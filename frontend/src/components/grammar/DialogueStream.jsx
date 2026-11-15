import { useState } from 'react';
import Badge from '../common/Badge';
import SpeakButton from '../common/SpeakButton';
import { useLanguage } from '../../hooks/useLanguage';
import { speak } from '../../services/audio';

export default function DialogueStream({ conversation: c }) {
  const { isLearningZh, speechLang } = useLanguage();
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  const primary = (l) => (isLearningZh ? l.zh : l.vi);
  const playAll = () => speak(c.lines.map(primary).join('。 '), speechLang);

  return (
    <div className="grammar-detail-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <Badge variant="rose">{c.level}</Badge>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: 8 }}>{isLearningZh ? c.title_vi : c.title_zh}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem' }}>{isLearningZh ? c.scenario_vi : c.scenario_zh}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-sm btn-primary" onClick={playAll}>▶️ {isLearningZh ? 'Nghe toàn bộ hội thoại' : '播放完整对话'}</button>
          <button type="button" className="btn btn-sm btn-outline" onClick={() => setShowPinyin((v) => !v)}>{showPinyin ? '🙈 Ẩn Pinyin' : '👁️ Hiện Pinyin'}</button>
          <button type="button" className="btn btn-sm btn-outline" onClick={() => setShowTranslation((v) => !v)}>{showTranslation ? '🙈 Ẩn bản dịch' : '👁️ Hiện bản dịch'}</button>
        </div>
      </div>

      <div className="dialogue-stream">
        {c.lines.map((line, i) => (
          <div key={i} className={`chat-bubble-row speaker-${line.speaker}`}>
            <div className="speaker-avatar">{line.name[0]}</div>
            <div className="chat-bubble">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                <strong style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{line.name}</strong>
                <SpeakButton text={primary(line)} lang={speechLang}>🔊 {isLearningZh ? 'Nghe câu' : '听本句'}</SpeakButton>
              </div>
              <div style={{ fontSize: '1.18rem', fontWeight: 800 }}>{primary(line)}</div>
              {showPinyin && <div style={{ color: 'var(--brand-primary)', fontSize: '0.92rem', fontWeight: 600, marginTop: 3 }}>{line.pinyin}</div>}
              {showTranslation && (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 6, paddingTop: 6, borderTop: '1px dashed var(--border-color)' }}>
                  {isLearningZh ? line.vi : line.zh}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
