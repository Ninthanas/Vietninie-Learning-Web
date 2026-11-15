// ============================================================================
// API SERVICE — Spring Boot backend (localhost:8080) with Turso / offline fallbacks.
// ============================================================================
import * as turso from './turso';
import { FALLBACK_PLACEMENT_QUESTIONS } from '../data/placementQuestions';

export const isLocalEnv =
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
  window.location.protocol === 'http:';

export const API_BASE_URL = isLocalEnv ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080' : '';

const HANDLED_ERRORS = ['Mật khẩu', 'tồn tại', 'Không tìm thấy', 'UNIQUE constraint'];
const handledError = (message) => Object.assign(new Error(message), { handled: true });

// ----------------------------------------------------------------- auth
export async function verifyToken(token) {
  if (!isLocalEnv || !token) return null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    return res.ok ? await res.json() : null;
  } catch {
    return null; // offline: keep the local session
  }
}

/**
 * Resolve a login / register attempt.
 * Order: (localhost) Spring Boot API -> Turso cloud -> offline local session.
 * Throws Error{handled:true} for messages that must be shown to the user (wrong password, ...).
 * @returns {{token:string, user:object, source:'api'|'turso'|'offline'}}
 */
export async function authenticate({ mode, username, password, displayName, isVi }) {
  const viaTurso = async () => {
    try {
      const d =
        mode === 'login'
          ? await turso.loginUser(username, password)
          : await turso.registerUser(username, password, displayName);
      return {
        token: d.access_token,
        user: { user_id: d.user_id, username: d.username, display_name: d.display_name || displayName },
        source: 'turso'
      };
    } catch (e) {
      if (e?.message && HANDLED_ERRORS.some((k) => e.message.includes(k))) throw handledError(e.message);
      return null;
    }
  };

  if (!isLocalEnv) {
    const r = await viaTurso();
    if (r) return r;
  } else {
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login' ? { username, password } : { username, password, display_name: displayName };
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw handledError(data.detail || (isVi ? 'Đăng nhập thất bại, vui lòng kiểm tra lại!' : '认证失败，请重试！'));
      }
      return {
        token: data.access_token,
        user: { user_id: data.user_id, username: data.username, display_name: data.display_name || displayName },
        source: 'api'
      };
    } catch (e) {
      if (e.handled) throw e;
      const r = await viaTurso();
      if (r) return r;
    }
  }

  // Offline fallback (no network at all): local session only, nothing sensitive is stored.
  return {
    token: 'local-jwt-' + username,
    user: { user_id: 'local_' + Date.now(), username, display_name: displayName },
    source: 'offline'
  };
}

// ----------------------------------------------------------------- placement test
export async function fetchPlacementQuestions() {
  if (isLocalEnv) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/placement/questions`);
      if (res.ok) {
        const data = await res.json();
        if (data.questions?.length) return data.questions;
      }
    } catch {
      /* fall through */
    }
  }
  return FALLBACK_PLACEMENT_QUESTIONS;
}

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function computeLocalResult(questions, answers) {
  const counts = Object.fromEntries(LEVELS.map((l) => [l, { correct: 0, total: 0 }]));
  let totalCorrect = 0;
  questions.forEach((q) => {
    const lvl = q.level || 'A1';
    if (!counts[lvl]) counts[lvl] = { correct: 0, total: 0 };
    counts[lvl].total++;
    const correctIdx = q.correct_index !== undefined ? q.correct_index : 1;
    if (answers[q.id] === correctIdx) {
      counts[lvl].correct++;
      totalCorrect++;
    }
  });
  let rec = 'A1';
  const levelScores = LEVELS.map((lvl) => {
    const c = counts[lvl].correct;
    const pct = Math.round((c / Math.max(1, counts[lvl].total)) * 100);
    if (pct >= 60) rec = lvl;
    return { level: lvl, correct: c, total: counts[lvl].total, percentage: pct };
  });
  return { recommended_level: rec, level_scores: levelScores, total_correct: totalCorrect, total_questions: questions.length };
}

export async function submitPlacement({ questions, answers, token }) {
  if (isLocalEnv) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_BASE_URL}/api/placement/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          answers: Object.entries(answers).map(([question_id, selected_index]) => ({ question_id, selected_index }))
        })
      });
      if (res.ok) return await res.json();
    } catch {
      /* fall through */
    }
  }
  return computeLocalResult(questions, answers);
}

// ----------------------------------------------------------------- lessons
export async function syncLessonAttempt({ token, user, lessonId, score, total }) {
  if (!token || !user) return;
  const viaTurso = () => turso.saveLessonAttempt(user.user_id, lessonId, score, total).catch(() => {});
  if (!isLocalEnv) return viaTurso();
  try {
    const res = await fetch(`${API_BASE_URL}/api/lessons/${lessonId}/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ quiz_score: score, quiz_total: total, steps_completed: 4, completed: true })
    });
    if (!res.ok) throw new Error('fallback');
  } catch {
    await viaTurso();
  }
}

// ----------------------------------------------------------------- shared helpers
/** Spring Boot only issues real JWTs; Turso / offline sessions use other tokens and must not hit the API. */
const hasApiSession = (token) => Boolean(isLocalEnv && token && !token.startsWith('local-jwt-'));

async function apiRequest(path, { method = 'GET', token, body } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.status === 204 ? null : res.json();
}

// ----------------------------------------------------------------- public datasets
/** Fetch a dataset from the API (localhost only). Returns null when unavailable so callers use the bundled JSON. */
export async function fetchDataset(path) {
  if (!isLocalEnv) return null;
  try {
    const data = await apiRequest(path);
    return Array.isArray(data) ? (data.length ? data : null) : data;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------- progress sync (fire-and-forget)
const authToken = () => localStorage.getItem('vn_auth_token');

/** kind: 'learned' | 'favorite' -> {value}; 'srs' -> {rating,reps,lastReviewed,nextReview} */
export function pushProgress(kind, dir, id, payload) {
  const token = authToken();
  if (!hasApiSession(token)) return;
  apiRequest(`/api/progress/${dir}/${kind}/${id}`, { method: 'PUT', token, body: payload }).catch(() => {});
}

export function pushQuizResult(dir, mode, score, total) {
  const token = authToken();
  if (!hasApiSession(token)) return;
  apiRequest(`/api/progress/${dir}/quiz`, { method: 'POST', token, body: { mode, score, total } }).catch(() => {});
}

export function pushReset(dir) {
  const token = authToken();
  if (!hasApiSession(token)) return;
  apiRequest(`/api/progress/${dir}`, { method: 'DELETE', token }).catch(() => {});
}

/** Merge local progress into the server copy and return the merged state ({learned, favorites, srs}) or null. */
export async function syncProgress(token, dir, local) {
  if (!hasApiSession(token)) return null;
  try {
    return await apiRequest(`/api/progress/${dir}/sync`, { method: 'POST', token, body: local });
  } catch {
    return null;
  }
}
