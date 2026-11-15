import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Loading from '../components/common/Loading';
import SpeakButton from '../components/common/SpeakButton';
import ScriptText from '../components/common/ScriptText';
import InsightSections from '../components/vocabulary/InsightSections';
import RelatedWordCard from '../components/vocabulary/RelatedWordCard';
import { useVocabulary } from '../hooks/useVocabulary';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../hooks/useProgress';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { buildInsight } from '../services/insight';
import { pickFields } from '../utils/helpers';

export default function VocabularyDetail() {
  const { id } = useParams();
  const { isLearningZh, setScriptMode } = useLanguage();
  const { items, loading } = useVocabulary();
  const { favorites, toggleFavorite } = useProgress();

  const item = useMemo(() => items.find((i) => Number(i.id) === Number(id)) || items[0], [items, id]);
  const related = useMemo(
    () => (item ? items.filter((i) => (i.topic_key || i.topic) === (item.topic_key || item.topic) && i.id !== item.id).slice(0, 6) : []),
    [items, item]
  );
  const insight = useMemo(() => (item ? buildInsight(item, isLearningZh) : null), [item, isLearningZh]);
  useDocumentTitle(item ? `Vietninie • ${item.word}` : 'Vietninie');

  if (loading || !item) return <section className="section-block"><div className="container"><Loading /></div></section>;

  const f = pickFields(item, isLearningZh);
  const isFav = favorites.has(item.id);

  return (
    <section className="section-block">
      <div className="container">
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <Link to="/vocabulary" className="btn btn-sm btn-outline">← {isLearningZh ? 'Quay lại kho từ vựng' : '返回词汇列表'}</Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => setScriptMode('simplified')}>🇨🇳 Chữ Giản Thể (简体)</button>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => setScriptMode('traditional')}>🇹🇼 Chữ Phồn Thể (繁體)</button>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => setScriptMode('both')}>简+繁 Song hành</button>
          </div>
        </div>

        <div className="card" style={{ padding: 32, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <Badge variant="rose">{item.level}</Badge>
                <Badge variant="indigo">{item.word_type}</Badge>
                <Badge variant="jade">{f.topicLabel}</Badge>
                <Badge variant="indigo">🇨🇳 简体: {insight.scriptPair.simp}</Badge>
                <Badge variant="gold">🇹🇼 繁體: {insight.scriptPair.trad}</Badge>
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15 }}>{isLearningZh ? <ScriptText text={item.word} /> : item.word}</h1>
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--brand-primary)', margin: '8px 0' }}>{f.phonetic}</div>
              <div style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--brand-secondary)' }}>{isLearningZh ? f.meaning : <ScriptText text={f.meaning} />}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <SpeakButton text={item.word} lang={f.speechLang} className="btn btn-primary">🔊 {isLearningZh ? 'Nghe phát âm chuẩn' : '播放标准发音'}</SpeakButton>
              <button type="button" className="btn btn-outline" onClick={() => toggleFavorite(item.id)}>{isFav ? '❤️ Đã thích' : '🤍 Yêu thích'}</button>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '24px 0' }} />

          <InsightSections insight={insight} variant="page" />

          <h3 style={{ marginBottom: 12 }}>📝 {isLearningZh ? 'Câu ví dụ & Ghi chú bổ sung' : '标准语境例句与备注'}</h3>
          <div className="vocab-example-box" style={{ fontSize: '1.05rem', padding: 18 }}>
            <div className="ex-target" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <span>{isLearningZh ? <ScriptText text={f.exTarget} /> : f.exTarget}</span>
              <SpeakButton text={f.exTarget} lang={f.speechLang} className="btn btn-sm btn-outline">🔊 {isLearningZh ? 'Nghe câu' : '听例句'}</SpeakButton>
            </div>
            {f.exPinyin && <div className="ex-py" style={{ fontSize: '0.95rem', margin: '6px 0' }}>{f.exPinyin}</div>}
            <div className="ex-native" style={{ marginTop: 4 }}>{f.exNative}</div>
          </div>
        </div>

        <h3 style={{ marginBottom: 16 }}>🔗 {isLearningZh ? 'Từ vựng cùng chủ đề' : '同主题相关词汇'}</h3>
        <div className="vocab-grid">
          {related.map((r) => <RelatedWordCard key={r.id} item={r} />)}
        </div>
      </div>
    </section>
  );
}
