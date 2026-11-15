import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { useUI } from '../../hooks/useUI';
import NavIcon from '../common/NavIcon';
import { PROGRESS_ITEM, SETTINGS_ITEM } from './navItems';

const SCRIPT_LABEL = { simplified: '简体 (Giản thể)', traditional: '繁體 (Phồn thể)', both: '简 + 繁 song song' };

/** Avatar button + dropdown: everything that is a setting rather than a place to learn. */
export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { isLoggedIn, user, openAuthModal, logout } = useAuth();
  const { nativeLang, toggleLanguage, scriptMode, cycleScriptMode } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { openPlacement, openLessons } = useUI();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const name = isLoggedIn ? user.display_name || user.username : 'Khách';
  const run = (fn) => () => { setOpen(false); fn(); };

  return (
    <div className="account-menu" ref={ref}>
      <button type="button" className="account-btn" aria-haspopup="menu" aria-expanded={open} aria-label="Tài khoản và cài đặt" onClick={() => setOpen((o) => !o)}>
        <span className="account-avatar">{name.trim().charAt(0).toUpperCase()}</span>
        <NavIcon name="chev" size={16} />
      </button>
      {open && (
        <div className="account-panel" role="menu">
          <div className="account-head">{name}</div>
          <Link role="menuitem" to={PROGRESS_ITEM.to} onClick={() => setOpen(false)}>Tiến độ của tôi</Link>
          <button role="menuitem" type="button" onClick={run(openLessons)}>Khoá học 4 bước</button>
          <button role="menuitem" type="button" onClick={run(openPlacement)}>Test trình độ (A1–C2)</button>
          <hr />
          <button role="menuitem" type="button" onClick={toggleLanguage}>
            Hướng học: {nativeLang === 'vi' ? 'Người Việt học tiếng Trung' : '中国人学越南语'}
          </button>
          <button role="menuitem" type="button" onClick={cycleScriptMode}>Chữ Hán: {SCRIPT_LABEL[scriptMode]}</button>
          <button role="menuitem" type="button" onClick={toggleTheme}>Giao diện: {isDark ? 'Tối → chuyển sang Sáng' : 'Sáng → chuyển sang Tối'}</button>
          <Link role="menuitem" to={SETTINGS_ITEM.to} onClick={() => setOpen(false)}>Cài đặt &amp; quản trị</Link>
          <hr />
          {isLoggedIn ? (
            <button role="menuitem" type="button" onClick={run(logout)}>Đăng xuất</button>
          ) : (
            <button role="menuitem" type="button" className="account-login" onClick={run(() => openAuthModal('login'))}>Đăng nhập</button>
          )}
        </div>
      )}
    </div>
  );
}
