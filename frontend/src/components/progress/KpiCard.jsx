export default function KpiCard({ icon, value, label }) {
  return (
    <div className="kpi-card">
      <span style={{ fontSize: '1.6rem' }}>{icon}</span>
      <div className="kpi-value">{value}</div>
      <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</div>
    </div>
  );
}
