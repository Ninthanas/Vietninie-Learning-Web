/** Page title block (`.section-header`): badge + h1 + optional subtitle + optional right-side actions. */
export default function PageHeader({ badge, title, subtitle, actions, centered = false }) {
  return (
    <div className="section-header" style={centered ? { justifyContent: 'center', textAlign: 'center' } : undefined}>
      <div>
        {badge}
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: 6 }}>{title}</h1>
        {subtitle}
      </div>
      {actions}
    </div>
  );
}
