import Badge from '../common/Badge';
import SpeakButton from '../common/SpeakButton';
import GrammarQuiz from './GrammarQuiz';
import { useLanguage } from '../../hooks/useLanguage';

export default function GrammarDetail({ grammar: g, total }) {
  const { isLearningZh, speechLang } = useLanguage();
  return (
    <div className="grammar-detail-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Badge variant="rose">{g.level}</Badge>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>Chuyên đề {g.id} / {total}</span>
      </div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>{g.title}</h2>

      <div className="formula-banner">
        📐 {isLearningZh ? 'Công thức cấu trúc:' : '核心句型公式：'} <br />
        <span style={{ color: 'var(--brand-primary)' }}>{g.pattern}</span>
      </div>

      <h3 style={{ margin: '20px 0 10px' }}>💡 {isLearningZh ? 'Giải thích chi tiết & Lưu ý' : '语法详解与避坑指南'}</h3>
      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{g.explanation}</p>

      <h3 style={{ margin: '24px 0 12px' }}>🗣️ {isLearningZh ? 'Ví dụ ứng dụng thực tế' : '典型双语例句'}</h3>
      <div className="example-card-list">
        {g.examples.map((ex, i) => {
          const target = isLearningZh ? ex.zh : ex.vi;
          const native = isLearningZh ? ex.vi : ex.zh;
          return (
            <div key={i} className="example-item-row">
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{target}</div>
                <div style={{ color: 'var(--brand-primary)', fontWeight: 600, fontSize: '0.92rem', margin: '4px 0' }}>{ex.pinyin || ''}</div>
                <div style={{ color: 'var(--text-secondary)' }}>{native}</div>
              </div>
              <SpeakButton text={target} lang={speechLang} className="btn btn-sm btn-primary">🔊 {isLearningZh ? 'Nghe' : '发音'}</SpeakButton>
            </div>
          );
        })}
      </div>

      {g.quiz && <GrammarQuiz quiz={g.quiz} />}
    </div>
  );
}
