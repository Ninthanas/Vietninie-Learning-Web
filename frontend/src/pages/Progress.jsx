import Loading from '../components/common/Loading';
import MasteryBanner from '../components/progress/MasteryBanner';
import KpiCard from '../components/progress/KpiCard';
import StudyChart from '../components/progress/StudyChart';
import LessonScores from '../components/progress/LessonScores';
import PlacementCard from '../components/progress/PlacementCard';
import { useVocabulary } from '../hooks/useVocabulary';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../hooks/useProgress';
import { useToast } from '../hooks/useToast';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { seedDemoProgress } from '../services/storage';

export default function Progress() {
  const { isLearningZh, learningLang } = useLanguage();
  const { items, loading } = useVocabulary();
  const { learned, favorites, review, streak, quizAccuracy, last7Days } = useProgress();
  const { showToast } = useToast();
  useDocumentTitle('Vietninie • Tiến độ');

  if (loading) return <section className="section-block"><div className="container"><Loading /></div></section>;

  const seed = () => {
    seedDemoProgress(learningLang, items);
    showToast('🎉 Đã nạp dữ liệu tiến độ mẫu: 1.284 từ đã học, 86 yêu thích, 132 cần ôn, Streak 12 ngày!');
  };
  const day = isLearningZh ? 'ngày' : '天';

  return (
    <section className="section-block">
      <div className="container">
        <MasteryBanner learned={learned.size} total={items.length} onSeed={seed} />

        <div className="progress-kpi-grid">
          <KpiCard icon="📚" value={learned.size.toLocaleString()} label={isLearningZh ? 'Từ vựng đã thuộc' : '已掌握词汇'} />
          <KpiCard icon="❤️" value={favorites.size} label={isLearningZh ? 'Từ vựng Yêu thích' : '收藏夹词汇'} />
          <KpiCard icon="🧠" value={review.size} label={isLearningZh ? 'Cần ôn tập (SRS)' : '待复习词汇 (SRS)'} />
          <KpiCard icon="🔥" value={`${streak} ${day}`} label={isLearningZh ? 'Chuỗi ngày học liên tiếp' : '连续打卡天数'} />
          <KpiCard icon="🎯" value={`${quizAccuracy}%`} label={isLearningZh ? 'Tỷ lệ đúng Quiz' : '测验平均正确率'} />
        </div>

        <StudyChart days={last7Days} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 24, marginTop: 28 }}>
          <LessonScores />
          <PlacementCard />
        </div>
      </div>
    </section>
  );
}
