import Badge from '../common/Badge';
import SpeakButton from '../common/SpeakButton';
import ScriptText from '../common/ScriptText';
import { useLanguage } from '../../hooks/useLanguage';
import { useUI } from '../../hooks/useUI';
import { getScriptPair } from '../../services/chineseScript';
import { pickFields } from '../../utils/helpers';

/** "Từ vựng hôm nay": rotates by day of month through the first 15 words. */
export default function SpotlightCard({ items }) {
  const { isLearningZh } = useLanguage();
  const { openInsight } = useUI();
  if (!items.length) return <div className="daily-word-spotlight" />;

  const item = items[new Date().getDate() % Math.min(15, items.length)] || items[0];
  const f = pickFields(item, isLearningZh);
  const sp = getScriptPair(isLearningZh ? item.word : f.meaning);

  return (
    <div className="daily-word-spotlight">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge variant="rose">{item.level}</Badge>
          {sp.differs ? <Badge variant="gold" title="Chữ Phồn thể (Đài Loan/Hồng Kông)">🇹🇼 繁: {sp.trad}</Badge> : <Badge variant="jade">简·繁同字</Badge>}
        </div>
        <SpeakButton text={item.word} lang={f.speechLang} className="btn btn-sm btn-primary">🔊 {isLearningZh ? 'Nghe' : '听发音'}</SpeakButton>
      </div>
      <div className="spotlight-hanzi" style={{ marginTop: 10 }}>{isLearningZh ? <ScriptText text={item.word} /> : item.word}</div>
      <div className="spotlight-pinyin">{f.phonetic}</div>
      <div style={{ fontSize: '1.12rem', fontWeight: 700, marginBottom: 10 }}>{isLearningZh ? f.meaning : <ScriptText text={f.meaning} />}</div>
      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: 12, marginBottom: 12, borderLeft: '3px solid var(--brand-primary)' }}>
        <div style={{ color: 'var(--text-primary)', marginBottom: 2 }}><strong>💬 {isLearningZh ? <ScriptText text={f.exTarget} /> : f.exTarget}</strong></div>
        <div>{f.exNative}</div>
      </div>
      <button type="button" className="btn btn-sm btn-outline" style={{ width: '100%', borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }} onClick={() => openInsight(item.id)}>
        ✨ {isLearningZh ? 'Xem chi tiết & So sánh Giản / Phồn' : '查看深度拆解与简繁对比'}
      </button>
    </div>
  );
}
