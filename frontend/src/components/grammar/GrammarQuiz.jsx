import { useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export default function GrammarQuiz({ quiz }) {
  const { isLearningZh } = useLanguage();
  const [chosen, setChosen] = useState(null);
  useEffect(() => setChosen(null), [quiz]);
  const correct = chosen === quiz.answerIndex;

  return (
    <div className="card" style={{ background: 'var(--bg-primary)', marginTop: 28 }}>
      <h4 style={{ marginBottom: 10 }}>🎯 {isLearningZh ? 'Bài tập kiểm tra nhanh' : '随堂即时测验'}</h4>
      <p style={{ fontWeight: 700, marginBottom: 14 }}>{quiz.question}</p>
      <div className="quiz-options-grid">
        {quiz.options.map((opt, i) => {
          let cls = 'quiz-opt-btn';
          if (chosen !== null) {
            if (i === quiz.answerIndex) cls += ' correct';
            else if (i === chosen) cls += ' wrong';
          }
          return (
            <button key={i} type="button" className={cls} disabled={chosen !== null} onClick={() => setChosen(i)}>
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <div style={{ marginTop: 14, fontWeight: 700, color: correct ? '#059669' : '#DC2626' }}>
          {correct ? '🎉 Chính xác! / 回答正确！' : '💡 Chưa đúng / 回答有误：'} {quiz.explanation}
        </div>
      )}
    </div>
  );
}
