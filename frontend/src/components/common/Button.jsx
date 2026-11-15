import { Link } from 'react-router-dom';

/** <Button variant="primary|outline|null" size="sm" to="/path"> — renders the legacy `.btn` classes. */
export default function Button({ variant = 'primary', size, to, className = '', children, ...rest }) {
  const cls = ['btn', variant && `btn-${variant}`, size && `btn-${size}`, className].filter(Boolean).join(' ');
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
