import { useLanguage } from '../../hooks/useLanguage';
import { cleanTopicName } from '../../utils/topics';

/** Grid of topics with progress: the first screen of the vocabulary area. */
export default function TopicGrid({ stats, onPick }) {
  const { isLearningZh } = useLanguage();
  return (
    <div className="topic-grid">
      {stats.map(({ topic, total, done, pct }) => (
        <button key={topic.key} type="button" className="card topic-card" onClick={() => onPick(topic.key)}>
          <span className="topic-level">{isLearningZh ? topic.level : topic.cefr}</span>
          <strong className="topic-name">{cleanTopicName(isLearningZh ? topic.vi : topic.zh)}</strong>
          <span className="progress-bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>
          <small>{done === total ? 'Hoàn thành' : `${done}/${total} từ`}</small>
        </button>
      ))}
    </div>
  );
}
