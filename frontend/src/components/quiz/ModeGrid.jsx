import { useLanguage } from '../../hooks/useLanguage';
import { QUIZ_MODES } from '../../utils/quiz';

export default function ModeGrid({ active, onSelect }) {
  const { isLearningZh } = useLanguage();
  return (
    <div className="quiz-mode-grid">
      {QUIZ_MODES.map((m) => (
        <button key={m.id} type="button" className={`quiz-mode-btn ${m.id === active ? 'active' : ''}`} onClick={() => onSelect(m.id)}>
          <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{m.icon}</div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{isLearningZh ? m.vi : m.zh}</div>
        </button>
      ))}
    </div>
  );
}
