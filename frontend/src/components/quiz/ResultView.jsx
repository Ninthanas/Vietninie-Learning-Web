import { useEffect } from 'react';
import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';

export default function ResultView({ score, total, onRetry, onSave }) {
  const { isLearningZh } = useLanguage();
  const pct = Math.round((score / Math.max(1, total)) * 100);
  useEffect(() => {
    onSave?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <div style={{ fontSize: '4rem', marginBottom: 12 }}>🏆</div>
      <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{isLearningZh ? 'Hoàn thành bài Quiz!' : '测验完成！'}</h2>
      <p style={{ fontSize: '1.25rem', margin: '12px 0', color: 'var(--brand-primary)', fontWeight: 800 }}>
        {isLearningZh ? `Điểm số: ${score} / ${total} (${pct}%)` : `得分：${score} / ${total} (${pct}%)`}
      </p>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        {isLearningZh ? 'Kết quả đã được lưu vào bảng Tiến độ học tập của bạn.' : '成绩已自动保存至您的学习进度档案。'}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <Button onClick={onRetry}>🔄 {isLearningZh ? 'Làm đề mới' : '再来一局'}</Button>
        <Button to="/progress" variant="outline">📊 {isLearningZh ? 'Xem Tiến độ' : '查看学习进度'}</Button>
      </div>
    </div>
  );
}
