import Badge from '../common/Badge';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { useLanguage } from '../../hooks/useLanguage';

export default function MasteryBanner({ learned, total, onSeed }) {
  const { isLearningZh } = useLanguage();
  const pct = Math.min(100, Math.round((learned / Math.max(1, total)) * 100));
  return (
    <div className="card" style={{ padding: 32, marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800 }}>{isLearningZh ? 'Tiến Độ Học Tiếng Trung' : '越南语学习总进度'}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            <strong>{learned.toLocaleString()}</strong> / {total.toLocaleString()} {isLearningZh ? 'từ đã học' : '词已掌握'} ({pct}%)
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button size="sm" variant="outline" onClick={onSeed}>✨ {isLearningZh ? 'Nạp tiến độ mẫu (1.284 từ - 75%)' : '加载演示数据 (1,284 词)'}</Button>
          <Button size="sm" to="/vocabulary?mode=flashcard">🃏 {isLearningZh ? 'Ôn tập SRS ngay' : '立即复习闪卡'}</Button>
        </div>
      </div>
      <ProgressBar percent={pct} minPercent={3} height={16} style={{ margin: '18px 0 8px' }} />
    </div>
  );
}
