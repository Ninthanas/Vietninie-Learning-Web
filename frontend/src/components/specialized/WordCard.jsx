import SpeakButton from './SpecSpeak';
import CopyButton from './CopyButton';
import { useLanguage } from '../../hooks/useLanguage';

export default function WordCard({ word: w, category }) {
  const { scriptMode } = useLanguage();
  const catBadge = category ? `${category.icon} ${category.name_vi.split('&')[0]}` : w.category;

  let displayZh = w.zh;
  let sub = '';
  if (scriptMode === 'traditional' && w.zh_tw) {
    displayZh = w.zh_tw;
    sub = `(Giản: ${w.zh})`;
  } else if (w.zh_tw && w.zh_tw !== w.zh) {
    sub = `[繁 ${w.zh_tw}]`;
  }

  return (
    <div className="spec-card">
      <div className="spec-card-header">
        <span className="spec-card-cat-badge">{catBadge}</span>
        <div className="spec-card-actions">
          <SpeakButton text={w.zh} title="Nghe phát âm chuẩn" />
          <CopyButton text={w.zh} />
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <div className="spec-word-main">
          {displayZh}
          {sub && <span className="spec-word-tw">{sub}</span>}
        </div>
        <div className="spec-pinyin">{w.pinyin}</div>
      </div>
      <div className="spec-meaning">{w.vi}</div>
      {w.explanation && <div className="spec-note-box">💡 {w.explanation}</div>}
      {w.example?.zh && (
        <div className="spec-example-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>Ví dụ công sở</span>
            <SpeakButton text={w.example.zh} title="Nghe câu ví dụ" className="" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--brand-primary)' }}>
              🔊 Nghe câu
            </SpeakButton>
          </div>
          <div className="spec-eg-zh">{w.example.zh}</div>
          {w.example.pinyin && <div className="spec-eg-py">{w.example.pinyin}</div>}
          {w.example.vi && <div className="spec-eg-vi">{w.example.vi}</div>}
        </div>
      )}
    </div>
  );
}
