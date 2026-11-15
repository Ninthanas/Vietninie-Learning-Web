import { useEffect, useRef, useState } from 'react';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import SpeakButton from '../common/SpeakButton';
import { useLanguage } from '../../hooks/useLanguage';
import { speak } from '../../services/audio';

/** One multiple-choice question. Calls onAnswer(isCorrect) ~850ms after the user picks. */
export default function QuestionView({ question, index, total, score, level, autoPlay, onAnswer }) {
  const { isLearningZh, speechLang } = useLanguage();
  const [chosen, setChosen] = useState(null);
  const timer = useRef();

  useEffect(() => {
    setChosen(null);
    if (autoPlay) {
      const id = setTimeout(() => speak(question.item.word, speechLang), 200);
      return () => clearTimeout(id);
    }
  }, [question, autoPlay, speechLang]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const pick = (idx) => {
    if (chosen !== null) return;
    setChosen(idx);
    timer.current = setTimeout(() => onAnswer(idx === question.correctIdx), 850);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Badge variant="rose">{isLearningZh ? `Câu ${index + 1} / ${total}` : `第 ${index + 1} / ${total} 题`}</Badge>
          <Badge variant="indigo">🎯 {level === 'all' ? (isLearningZh ? 'Tổng hợp' : '综合') : level.toUpperCase()}</Badge>
        </div>
        <Badge variant="jade">{isLearningZh ? `Điểm: ${score}` : `当前得分: ${score}`}</Badge>
      </div>

      <ProgressBar percent={Math.round((index / total) * 100)} />

      <p style={{ color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 8 }}>{question.title}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'var(--bg-primary)', padding: 24, borderRadius: 20, border: '1px solid var(--border-color)' }}>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{question.main}</div>
          {question.sub && <div style={{ color: 'var(--brand-primary)', fontWeight: 600, marginTop: 4 }}>{question.sub}</div>}
        </div>
        <SpeakButton text={question.item.word} lang={speechLang} className="btn btn-primary">🔊 {isLearningZh ? 'Nghe' : '发音'}</SpeakButton>
      </div>

      <div className="quiz-options-grid">
        {question.options.map((opt, idx) => {
          let cls = 'quiz-opt-btn';
          if (chosen !== null) {
            if (idx === question.correctIdx) cls += ' correct';
            else if (idx === chosen) cls += ' wrong';
          }
          return (
            <button key={idx} type="button" className={cls} disabled={chosen !== null} onClick={() => pick(idx)}>
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
