import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import Trans from '../common/Trans';
import { LogoMark } from '../mascot/Logo';
import { NAV_ITEMS } from './navItems';
import GameStats from '../common/GameStats';
import AccountMenu from './AccountMenu';

export default function Header() {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  return (
    <header className="site-header">
      <div className="container navbar">
        <Link to="/" className="brand-logo" aria-label="Vietninie – Trang chủ">
          <LogoMark size={42} />
          <div>
            <Trans k="brandName">Vietninie</Trans>
            <Trans k="brandTagline" as="small" className="brand-subtitle">越学越辣 • Việt ⇄ Trung</Trans>
          </div>
        </Link>

        <nav className="desktop-main-nav" aria-label="Điều hướng chính">
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => {
              const forced = item.match ? item.match.some((p) => pathname.startsWith(p)) : null;
              return (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className={({ isActive }) => ((forced ?? isActive) ? 'active' : '')}>
                    {t(item.key, item.label)}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="nav-actions">
          <GameStats />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
