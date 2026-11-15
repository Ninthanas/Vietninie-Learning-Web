import { useLanguage } from '../../hooks/useLanguage';

export default function StudyChart({ days }) {
  const { isLearningZh } = useLanguage();
  const max = Math.max(20, ...days.map((d) => d.count));
  return (
    <div className="card" style={{ padding: 28 }}>
      <h3 style={{ marginBottom: 6 }}>📈 {isLearningZh ? 'Biểu đồ tiến độ học tập 7 ngày gần nhất' : '近 7 天每日词汇学习趋势图'}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        {isLearningZh ? 'Số lượng từ vựng & lượt ôn tập hoàn thành mỗi ngày:' : '每日完成的新学与复习词条数量：'}
      </p>
      <div className="chart-bars-wrap">
        {days.map((d, i) => (
          <div key={i} className="chart-col">
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{d.count}</span>
            <div className="chart-bar" style={{ height: `${Math.max(10, Math.round((d.count / max) * 100))}%` }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
