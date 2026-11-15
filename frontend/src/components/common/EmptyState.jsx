/** Centered "nothing found" card. */
export default function EmptyState({ icon = '🔍', title, text, children, fullRow = false, dashed = false }) {
  return (
    <div
      className={dashed ? undefined : 'card'}
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        ...(fullRow ? { gridColumn: '1 / -1' } : {}),
        ...(dashed ? { background: 'var(--bg-primary)', borderRadius: 16, border: '1px dashed var(--border-color)' } : {})
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>{icon}</div>
      <h3>{title}</h3>
      {text && <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>{text}</p>}
      {children}
    </div>
  );
}
