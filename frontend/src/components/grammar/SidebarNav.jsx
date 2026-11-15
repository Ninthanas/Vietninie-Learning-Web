/** Left list shared by Grammar and Conversation. items: [{ key, label, badge }] */
export default function SidebarNav({ items, activeIndex, onSelect, badgeVariant = 'rose', label }) {
  return (
    <aside className="grammar-sidebar" aria-label={label} tabIndex={0}>
      {items.map((it, idx) => (
        <div key={it.key} className={`grammar-nav-item ${idx === activeIndex ? 'active' : ''}`} onClick={() => onSelect(idx)}>
          <span>{it.label}</span>
          <span className={`badge badge-${badgeVariant}`}>{it.badge}</span>
        </div>
      ))}
    </aside>
  );
}
