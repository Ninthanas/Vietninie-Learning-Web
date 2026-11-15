import Badge from '../common/Badge';
import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';
import { useProgress } from '../../hooks/useProgress';
import { useUI } from '../../hooks/useUI';

export default function LessonScores() {
  const { isLearningZh } = useLanguage();
  const { lessonScores } = useProgress();
  const { openLessons } = useUI();
  const entries = Object.values(lessonScores);
  return (
    <div className="card" style={{ padding: 26 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3>🎓 {isLearningZh ? 'Bảng Điểm Các Bài Học (4 Bước)' : '核心课程得分记录 (4步法)'}</h3>
        <Button size="sm" onClick={openLessons}>+ {isLearningZh ? 'Học bài mới' : '开始闯关'}</Button>
      </div>
      {!entries.length ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {isLearningZh ? 'Chưa có bài học nào được chấm điểm. Hãy bấm "+ Học bài mới" để hoàn thành bài học đầu tiên!' : '暂无课程得分记录，点击右上角开始学习第一课！'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.map((e) => (
            <div key={e.lesson_id || e.date + e.title_vi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 12, background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontWeight: 800 }}>{isLearningZh ? e.title_vi : e.title_zh}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📅 {e.date}</div>
              </div>
              <Badge variant="jade" style={{ fontSize: '0.95rem' }}>🏆 {e.score} / {e.total}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
