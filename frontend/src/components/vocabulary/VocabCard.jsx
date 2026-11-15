import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import SpeakButton from '../common/SpeakButton';
import ScriptText, { TradBadge } from '../common/ScriptText';
import { useLanguage } from '../../hooks/useLanguage';
import { useProgress } from '../../hooks/useProgress';
import { useUI } from '../../hooks/useUI';
import { useToast } from '../../hooks/useToast';
import { getScriptPair, getTaiwanComparison } from '../../services/chineseScript';
import { formatScript } from '../../services/chineseScript';
import { pickFields } from '../../utils/helpers';

/** Renders trusted HTML from the dataset (usage_note) with Traditional hints applied. */
function UsageNote({ text }) {
  const { scriptMode } = useLanguage();
  const { main } = formatScript(text, scriptMode);
  return <span dangerouslySetInnerHTML={{ __html: main }} />;
}

/**
 * Vocabulary card. variant="preview" (home page, 4 cards) | "full" (list page with actions).
 */
export default function VocabCard({ item, variant = 'full' }) {
  const { isLearningZh, speechLang: _s } = useLanguage();
  const { learned, favorites, toggleFavorite, toggleLearned } = useProgress();
  const { openInsight } = useUI();
  const { showToast } = useToast();
  const f = pickFields(item, isLearningZh);
  const zhRef = isLearningZh ? item.word : f.meaning;
  const sp = getScriptPair(zhRef);
  const twComp = getTaiwanComparison(zhRef);
  const isLearned = learned.has(item.id);
  const isFav = favorites.has(item.id);
  const preview = variant === 'preview';

  const word = isLearningZh ? <ScriptText text={item.word} /> : item.word;
  const meaning = isLearningZh ? f.meaning : <ScriptText text={f.meaning} />;
  const exTarget = isLearningZh ? <ScriptText text={f.exTarget} /> : f.exTarget;

  const onFav = () => {
    const now = toggleFavorite(item.id);
    showToast(now ? (isLearningZh ? '❤️ Đã thêm vào Yêu thích' : '❤️ 已加入收藏夹') : isLearningZh ? '🤍 Đã bỏ Yêu thích' : '🤍 已取消收藏');
  };
  const onLearned = () => {
    const now = toggleLearned(item.id);
    showToast(now ? (isLearningZh ? '✓ Đã đánh dấu thuộc từ này!' : '✓ 已标记为掌握！') : isLearningZh ? '🔄 Đã đưa về danh sách Học lại' : '🔄 已移回待学习列表');
  };

  return (
    <article className={`vocab-card ${!preview && isLearned ? 'is-learned' : ''}`} id={preview ? undefined : `vocab-card-${item.id}`}>
      <div>
        <div className="vocab-card-header">
          <div style={{ display: 'flex', gap: preview ? 6 : 5, flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge variant="rose">{item.level}</Badge>
            {preview ? (
              sp.differs && <Badge variant="gold" title="Chữ Phồn thể">🇹🇼 {sp.trad}</Badge>
            ) : (
              <TradBadge word={zhRef} />
            )}
            {!preview && twComp && <Badge variant="indigo">🇹🇼 Đài: {twComp.tw}</Badge>}
          </div>
          <SpeakButton text={item.word} lang={f.speechLang} aria-label="Listen pronunciation">
            🔊 {isLearningZh ? 'Nghe' : preview ? '发音' : '听发音'}
          </SpeakButton>
        </div>

        <div className="vocab-word-main">{word}</div>
        <div className="vocab-pinyin">{f.phonetic}</div>
        <div className="vocab-meaning">{meaning}</div>

        <div className="vocab-example-box" style={{ marginBottom: 8 }}>
          <div className="ex-target" style={preview ? undefined : { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <span>💬 {exTarget}</span>
            {!preview && (
              <SpeakButton text={f.exTarget} lang={f.speechLang} className="btn-icon" style={{ width: 26, height: 26, fontSize: '0.75rem', flexShrink: 0 }} title="Nghe câu ví dụ">
                🔊
              </SpeakButton>
            )}
          </div>
          {!preview && f.exPinyin && <div className="ex-py">{f.exPinyin}</div>}
          <div className="ex-native">{f.exNative}</div>
        </div>

        {!preview && item.usage_note && (
          <div style={{ background: 'var(--bg-secondary)', borderLeft: '3px solid var(--brand-gold)', borderRadius: 8, padding: '8px 11px', marginBottom: 10, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            <UsageNote text={item.usage_note} />
          </div>
        )}
      </div>

      {preview ? (
        <div className="vocab-card-footer" style={{ marginTop: 10 }}>
          <Link to={`/vocabulary/${item.id}`} className="btn btn-sm btn-outline" style={{ width: '100%', textAlign: 'center' }}>
            {isLearningZh ? 'Xem chi tiết →' : '查看详情 →'}
          </Link>
        </div>
      ) : (
        <div className="vocab-card-footer" style={{ flexWrap: 'wrap', gap: 6 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" className={`action-icon-btn ${isFav ? 'active-fav' : ''}`} onClick={onFav}>{isFav ? '❤️' : '🤍'}</button>
            <button type="button" className={`action-icon-btn ${isLearned ? 'active-learned' : ''}`} onClick={onLearned}>
              {isLearned ? (isLearningZh ? '✓ Đã thuộc' : '✓ 已掌握') : isLearningZh ? '+ Đã thuộc' : '+ 已学'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" className="action-icon-btn" style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)', fontWeight: 800 }} onClick={() => openInsight(item.id)}>
              ✨ {isLearningZh ? 'Giải mã thú vị' : '趣味解析'}
            </button>
            <Link to={`/vocabulary/${item.id}`} className="action-icon-btn">{isLearningZh ? 'Chi tiết →' : '详情 →'}</Link>
          </div>
        </div>
      )}
    </article>
  );
}
