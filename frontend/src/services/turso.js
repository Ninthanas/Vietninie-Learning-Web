// ============================================================================
// TURSO CLOUD BRIDGE (libSQL over HTTP) — used when the FastAPI backend is not reachable.
// Credentials come from Vite env vars (see .env.example); nothing is hardcoded.
// NOTE: anything in VITE_* is bundled into the browser. For production, move these calls
// behind the backend and rotate the token.
// ============================================================================
const URL_ = (import.meta.env.VITE_TURSO_URL || '').replace(/\/$/, '');
const TOKEN = import.meta.env.VITE_TURSO_TOKEN || '';

export const isTursoConfigured = () => Boolean(URL_ && TOKEN);

const toArg = (val) => {
  if (val === null || val === undefined) return { type: 'null' };
  if (typeof val === 'boolean') return { type: 'integer', value: val ? '1' : '0' };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { type: 'integer', value: String(val) } : { type: 'float', value: String(val) };
  }
  return { type: 'text', value: String(val) };
};

async function execute(sql, params = []) {
  if (!isTursoConfigured()) throw new Error('Turso is not configured');
  const res = await fetch(`${URL_}/v2/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ type: 'execute', stmt: { sql, args: params.map(toArg) } }, { type: 'close' }] })
  });
  if (!res.ok) throw new Error(`Turso HTTP ${res.status}`);
  const data = await res.json();
  const first = data?.results?.[0];
  if (first?.type === 'error') throw new Error(first?.error?.message || 'Turso SQL Error');
  const result = first?.response?.result;
  if (!result) return [];
  const cols = (result.cols || []).map((c) => c.name);
  return (result.rows || []).map((row) => {
    const obj = {};
    cols.forEach((col, idx) => {
      const cell = row[idx];
      if (!cell || cell.type === 'null') obj[col] = null;
      else if (cell.type === 'integer') obj[col] = Number(cell.value);
      else if (cell.type === 'float') obj[col] = parseFloat(cell.value);
      else obj[col] = cell.value;
    });
    return obj;
  });
}

async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hashBuf = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const SALT = 'vietninie2026';
const hashPassword = async (password) => `${SALT}:${await sha256(SALT + password)}`;

async function verifyPassword(password, stored) {
  if (!stored) return false;
  if (stored.includes(':')) {
    const [salt, expected] = stored.split(':');
    return (await sha256(salt + password)) === expected;
  }
  return (await sha256(password)) === stored || password === stored;
}

export async function registerUser(username, password, displayName) {
  const existing = await execute('SELECT id FROM users WHERE username = ?', [username]);
  if (existing.length > 0) throw new Error('Tên đăng nhập này đã tồn tại trên! / 用户名已存在！');
  const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  const now = new Date().toISOString();
  await execute(
    'INSERT INTO users (id, username, password_hash, display_name, created_at, updated_at, last_login) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId, username, await hashPassword(password), displayName || username, now, now, now]
  );
  return { access_token: 'turso-cloud-jwt-' + userId, user_id: userId, username, display_name: displayName || username };
}

export async function loginUser(username, password) {
  const rows = await execute('SELECT id, username, password_hash, display_name FROM users WHERE username = ?', [username]);
  if (!rows.length) throw new Error('Không tìm thấy tài khoản! Hãy bấm "Đăng ký ngay" để tạo mới. / 账号不存在，请先注册！');
  const user = rows[0];
  if (!(await verifyPassword(password, user.password_hash))) throw new Error('Mật khẩu không chính xác! / 密码错误！');
  await execute('UPDATE users SET last_login = ? WHERE id = ?', [new Date().toISOString(), user.id]);
  return {
    access_token: 'turso-cloud-jwt-' + user.id,
    user_id: user.id,
    username: user.username,
    display_name: user.display_name || user.username
  };
}

export async function saveLessonAttempt(userId, lessonId, score, total) {
  if (!userId) return;
  const now = new Date().toISOString();
  await execute(
    'INSERT INTO lesson_attempts (user_id, lesson_id, quiz_score, quiz_total, steps_completed, completed, started_at, completed_at) VALUES (?, ?, ?, ?, 4, 1, ?, ?)',
    [userId, Number(lessonId), Number(score), Number(total), now, now]
  );
}
