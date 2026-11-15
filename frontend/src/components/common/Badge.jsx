/** <Badge variant="rose|jade|indigo|gold"> — gold has no CSS class so it is styled inline. */
export default function Badge({ variant = 'rose', style, children, ...rest }) {
  if (variant === 'gold') {
    return (
      <span className="badge" style={{ background: 'var(--brand-gold-soft)', color: 'var(--brand-gold)', fontWeight: 800, ...style }} {...rest}>
        {children}
      </span>
    );
  }
  return (
    <span className={`badge badge-${variant}`} style={style} {...rest}>
      {children}
    </span>
  );
}
