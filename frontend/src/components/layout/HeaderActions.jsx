import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import Trans from '../common/Trans';

const SCRIPT_BADGE = { simplified: '简 🇨🇳', traditional: '繁 🇹🇼', both: '简·繁' };
const SCRIPT_TOAST = {
  simplified: '🇨🇳 Đã chuyển chữ Hán sang: Giản Thể (简体 - Đại lục)',
  traditional: '🇹🇼 Đã chuyển chữ Hán sang: Phồn Thể (繁體 - Đài Loan)',
  both: '🇨🇳/🇹🇼 Đã bật hiển thị song song: Giản Thể + Phồn Thể (简 + 繁)'
};

/** 简 / 繁 / 简·繁 cycle button. */
export function ScriptSwitch() {
  const { scriptMode, cycleScriptMode } = useLanguage();
  const { showToast } = useToast();
  return (
    <button
      type="button"
      id="scriptSwitchBtn"
      className="btn btn-sm btn-outline"
      style={{ padding: '5px 9px', fontSize: '0.78rem', fontWeight: 800, whiteSpace: 'nowrap' }}
      title="Chuyển đổi Chữ Giản Thể (Đại lục) / Phồn Thể (Đài Loan) / Song song"
      onClick={() => showToast(SCRIPT_TOAST[cycleScriptMode()])}
    >
      <span>{SCRIPT_BADGE[scriptMode]}</span>
    </button>
  );
}

/** Việt ⇄ 中 direction switch. */
export function LanguageSwitch() {
  const { nativeLang, toggleLanguage } = useLanguage();
  const { showToast } = useToast();
  return (
    <button
      type="button"
      id="langSwitchBtn"
      className="lang-switch-btn"
      aria-label="Switch Language"
      title="Đổi hướng học Việt ⇄ Trung"
      onClick={() => {
        toggleLanguage();
        showToast(nativeLang === 'vi' ? '🇨🇳 已切换至：中国人学习越南语' : '🇻🇳 Đã chuyển sang: Người Việt học Tiếng Trung');
      }}
    >
      <span>🇻🇳⇄🇨🇳</span>
      <Trans k="switchLangBtn" className="switch-label-text">
        VI / 中
      </Trans>
    </button>
  );
}

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button type="button" id="themeToggleBtn" className="btn-icon" aria-label="Toggle Dark Mode" title={isDark ? 'Light Mode' : 'Dark Mode'} onClick={toggleTheme}>
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}

/** Login button / user pill in the header. */
export function AuthButton() {
  const { isVi } = useLanguage();
  const { isLoggedIn, user, openAuthModal, logout } = useAuth();

  if (isLoggedIn) {
    return (
      <div className="auth-user-pill">
        <span>👤 {user.display_name || user.username}</span>
        <button type="button" className="auth-logout-btn" onClick={logout}>
          {isVi ? 'Thoát' : '退出'}
        </button>
      </div>
    );
  }
  return (
    <button
      type="button"
      className="btn btn-sm btn-primary"
      style={{ padding: '6px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
      onClick={() => openAuthModal('login')}
    >
      👤 {isVi ? 'Đăng nhập' : '登录'}
    </button>
  );
}
