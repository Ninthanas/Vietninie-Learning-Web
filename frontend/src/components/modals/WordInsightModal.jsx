import { useMemo } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import SpeakButton from '../common/SpeakButton';
import InsightSections from '../vocabulary/InsightSections';
import { useUI } from '../../hooks/useUI';
import { useLanguage } from '../../hooks/useLanguage';
import { useVocabulary } from '../../hooks/useVocabulary';
import { buildInsight } from '../../services/insight';

/** "✨ Giải mã từ vựng sống động" popup, opened from any vocabulary card via useUI().openInsight(id). */
export default function WordInsightModal() {
  const { insightId, closeInsight } = useUI();
  const { isLearningZh, speechLang } = useLanguage();
  const { items } = useVocabulary();

  const item = useMemo(
    () => (insightId == null ? null : items.find((i) => Number(i.id) === Number(insightId)) || items[0]),
    [insightId, items]
  );
  const insight = useMemo(() => (item ? buildInsight(item, isLearningZh) : null), [item, isLearningZh]);

  return (
    <Modal
      open={insightId != null && Boolean(insight)}
      onClose={closeInsight}
      maxWidth={680}
      closeGlyph="✕"
      closeOnBackdrop
      header={<Badge variant="rose">✨ Giải Mã Từ Vựng Sống Động (Đời Thực × 简/繁)</Badge>}
      headerStyle={{ marginBottom: 14 }}
    >
      {insight && (
        <>
          <div
            style={{
              background: 'var(--bg-primary)', padding: '18px 20px', borderRadius: 18, border: '1px solid var(--border-color)',
              marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                <Badge variant="rose">{item.level}</Badge>
                <Badge variant="jade">{insight.topic}</Badge>
                <Badge variant="indigo">🇨🇳 简: {insight.scriptPair.simp}</Badge>
                <Badge variant="gold">🇹🇼 繁: {insight.scriptPair.trad}</Badge>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{insight.word}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                {insight.phonetic} — <span style={{ color: 'var(--brand-secondary)' }}>{insight.meaning}</span>
              </div>
            </div>
            <SpeakButton text={insight.word} lang={speechLang} className="btn btn-primary">
              🔊 {isLearningZh ? 'Nghe phát âm' : '播放发音'}
            </SpeakButton>
          </div>
          <InsightSections insight={insight} variant="modal" />
        </>
      )}
    </Modal>
  );
}
