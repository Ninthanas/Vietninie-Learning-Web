import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { useLanguage } from '../../hooks/useLanguage';
import { useProgress } from '../../hooks/useProgress';
import { getPref } from '../../services/storage';

export default function ProgressSummary({ total }) {
  const { isLearningZh } = useLanguage();
  const { learned, streak } = useProgress();
  const count = learned.size;
  const pct = Math.min(100, Math.round((count / Math.max(1, total)) * 100));
  return (
    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <strong style={{ fontSize: '0.92rem' }}>{isLearningZh ? 'Tiến độ học tập' : '词库掌握进度'}</strong>
        <Badge variant="jade">{count} / {total} ({pct}%)</Badge>
      </div>
      <ProgressBar percent={pct} minPercent={4} height={6} style={{ margin: '6px 0 12px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
        <span>📚 {isLearningZh ? 'Đã học' : '已学'}: <strong>{count}</strong></span>
        <span>🔥 Streak: <strong>{streak} {isLearningZh ? 'ngày' : '天'}</strong></span>
        <span>🧭 Trình độ: <strong>{getPref('sentruc_placement_level', 'A1')}</strong></span>
      </div>
    </div>
  );
}
