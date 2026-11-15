import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import NavIcon from '../common/NavIcon';
import { NAV_ITEMS } from './navItems';

/** Bottom tab bar on phones: the same 5 areas as the desktop header. */
export default function MobileBottomNav() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const isOn = (item) => (item.match ? item.match.some((p) => pathname.startsWith(p)) : undefined);

  return (
    <nav className="mobile-bottom-nav" aria-label="Điều hướng chính">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => ((isOn(item) ?? isActive) ? 'active' : '')}
        >
          <span className="nav-icon"><NavIcon name={item.icon} /></span>
          <span>{t(item.key, item.label)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
