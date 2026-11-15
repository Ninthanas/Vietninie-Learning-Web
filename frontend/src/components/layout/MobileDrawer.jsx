import { NavLink } from 'react-router-dom';
import { useUI } from '../../hooks/useUI';
import { useLanguage } from '../../hooks/useLanguage';
import { LogoMark } from '../mascot/Logo';
import { NAV_ITEMS, SETTINGS_ITEM } from './navItems';

/** Slide-out menu for tablet & mobile. */
export default function MobileDrawer() {
  const { drawerOpen, closeDrawer, openLessons, openPlacement, openOnboarding } = useUI();
  const { setScriptMode, t } = useLanguage();
  const items = [...NAV_ITEMS, SETTINGS_ITEM];

  const run = (fn) => () => {
    closeDrawer();
    fn();
  };

  return (
    <div id="mobileNavDrawer" className={`mobile-nav-drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && closeDrawer()}>
      <aside className="mobile-nav-drawer">
        <div className="drawer-header">
          <div className="brand-logo">
            <LogoMark size={36} />
            <div>
              <strong>Vietninie 🌶️</strong>
              <small style={{ display: 'block', fontSize: '0.72rem', color: 'var(--brand-primary)' }}>越学越辣 • Việt ⇄ Trung</small>
            </div>
          </div>
          <button type="button" className="btn-icon" onClick={closeDrawer}>✕</button>
        </div>

        <div className="drawer-quick-actions">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => setScriptMode('simplified')}>🇨🇳 简体</button>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => setScriptMode('traditional')}>🇹🇼 繁體</button>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => setScriptMode('both')}>简+繁</button>
          </div>
          <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={run(openLessons)}>
            🎓 Học Khóa 4 Bước (Lưu điểm)
          </button>
          <button type="button" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={run(openPlacement)}>
            🎯 Làm Bài Test Đầu Vào (A1–C2)
          </button>
        </div>

        <nav className="drawer-links">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeDrawer}>
              {item.icon} <span>{t(item.key, item.label)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="drawer-footer">
          <button type="button" className="btn btn-sm btn-outline" style={{ width: '100%' }} onClick={run(openOnboarding)}>
            🌏 Chọn lại hướng học & Trình độ
          </button>
        </div>
      </aside>
    </div>
  );
}
