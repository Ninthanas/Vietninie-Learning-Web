export default function Loading({ text = '⏳ ...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)', fontWeight: 700 }}>{text}</div>
  );
}
