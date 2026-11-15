import { useEffect, useState } from 'react';
import SpecSpeak from './SpecSpeak';
import { useLanguage } from '../../hooks/useLanguage';
import { shuffle } from '../../utils/helpers';

/** 3D flashcards over the filtered words. Keyboard: Space/Enter flip, ←/↑ prev, →/↓ next. */
export default function FlashcardView({ words }) {
  const { scriptMode } = useLanguage();
  const [deck, setDeck] = useState(words);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const total = deck.length;

  useEffect(() => {
    setDeck(words);
    setIndex(0);
    setFlipped(false);
  }, [words]);

  const next = () => { if (total) { setFlipped(false); setIndex((i) => (i + 1) % total); } };
  const prev = () => { if (total) { setFlipped(false); setIndex((i) => (i - 1 + total) % total); } };
  const flip = () => setFlipped((f) => !f);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches?.('input, textarea, select')) return;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!total) return <div style={{ textAlign: 'center', padding: '60px 20px' }}><h3>Không có thẻ từ vựng nào trong danh mục này.</h3></div>;

  const w = deck[index];
  const zh = scriptMode === 'traditional' && w.zh_tw ? w.zh_tw : w.zh;

  return (
    <div className="spec-flashcard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-secondary)' }}>Thẻ <strong>{index + 1}</strong> / {total}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-sm btn-outline" title="Xáo trộn thẻ" onClick={() => { setDeck(shuffle(deck)); setIndex(0); setFlipped(false); }}>🔀 Xáo thẻ</button>
          <SpecSpeak text={w.zh} className="btn btn-sm btn-outline" title="Nghe phát âm">🔊 Nghe</SpecSpeak>
        </div>
      </div>

      <div className={`spec-flashcard-box ${flipped ? 'flipped' : ''}`} onClick={flip}>
        <div className="spec-card-face spec-card-front">
          <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '4px 12px', borderRadius: 999, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', marginBottom: 20 }}>{w.category.toUpperCase()}</span>
          <div style={{ fontSize: '3.2rem', fontWeight: 900, color: 'var(--brand-primary)', marginBottom: 12, lineHeight: 1.2 }}>{zh}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-secondary)', marginBottom: 24 }}>{w.pinyin}</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>👆 Nhấp thẻ hoặc bấm [Phím Cách] để lật xem nghĩa & ví dụ</p>
        </div>
        <div className="spec-card-face spec-card-back">
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>{w.vi}</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-secondary)', marginBottom: 18 }}>{zh} ({w.pinyin})</div>
          {w.explanation && (
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 16px', fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'left', lineHeight: 1.5, marginBottom: 14, width: '100%' }}>💡 {w.explanation}</div>
          )}
          {w.example?.zh && (
            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: 10, width: '100%', textAlign: 'left', fontSize: '0.86rem' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{w.example.zh}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: 2 }}>{w.example.vi || ''}</div>
            </div>
          )}
        </div>
      </div>

      <div className="flashcard-nav-row">
        <button type="button" className="btn btn-outline" style={{ padding: '10px 24px' }} onClick={prev}>← Thẻ trước</button>
        <button type="button" className="btn btn-primary" style={{ padding: '10px 32px' }} onClick={flip}>🔄 Lật mặt thẻ</button>
        <button type="button" className="btn btn-outline" style={{ padding: '10px 24px' }} onClick={next}>Thẻ sau →</button>
      </div>
    </div>
  );
}
