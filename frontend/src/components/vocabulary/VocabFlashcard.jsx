import { useEffect, useState } from 'react';
import Badge from '../common/Badge';
import SpeakButton from '../common/SpeakButton';
import ScriptText from '../common/ScriptText';
import { useLanguage } from '../../hooks/useLanguage';
import { useProgress } from '../../hooks/useProgress';
import { useUI } from '../../hooks/useUI';
import { useToast } from '../../hooks/useToast';
import { getScriptPair } from '../../services/chineseScript';
import { pickFields } from '../../utils/helpers';

const SRS = [
  { r: 1, icon: '❌', vi: 'Chưa nhớ', zh: '未记住', when: '5 phút' },
  { r: 2, icon: '😐', vi: 'Hơi nhớ', zh: '有点印象', when: '1 ngày' },
  { r: 3, icon: '😊', vi: 'Nhớ', zh: '已记住', when: '3 ngày' },
  { r: 4, icon: '🔥', vi: 'Rất nhớ', zh: '非常熟练', when: '7 ngày' }
];
const LABELS_VI = { 1: '❌ Sẽ nhắc lại sau 5 phút', 2: '😐 Đã lên lịch ôn sau 1 ngày', 3: '😊 Đã thuộc! Ôn lại sau 3 ngày', 4: '🔥 Rất nhớ! Ôn lại sau 7 ngày' };
const LABELS_ZH = { 1: '❌ 5分钟后再次复习', 2: '😐 已安排1天后复习', 3: '😊 已掌握！3天后复习', 4: '🔥 非常熟练！7天后复习' };

/** 3D flip flashcard + 4-level SRS rating. `items` is the already filtered list. */
export default function VocabFlashcard({ items }) {
  const { isLearningZh } = useLanguage();
  const { favorites, toggleFavorite, rateSrs } = useProgress();
  const { openInsight } = useUI();
  const { showToast } = useToast();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => setIndex(0), [items]);
  useEffect(() => setFlipped(false), [index]);

  if (!items.length) {
    return <div className="card" style={{ textAlign: 'center' }}>{isLearningZh ? 'Không có từ nào trong bộ lọc này.' : '当前筛选下没有词卡。'}</div>;
  }

  const total = items.length;
  const item = items[index % total];
  const f = pickFields(item, isLearningZh);
  const sp = getScriptPair(isLearningZh ? item.word : f.meaning);
  const isFav = favorites.has(item.id);
  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  const rate = (r) => {
    rateSrs(item.id, r);
    showToast(isLearningZh ? LABELS_VI[r] : LABELS_ZH[r]);
    next();
  };

  return (
    <div className="flashcard-stage">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <Badge variant="indigo">Card {index + 1} / {total}</Badge>
        <div style={{ display: 'flex', gap: 6 }}>
          <Badge variant="indigo">🇨🇳 简: {sp.simp}</Badge>
          <Badge variant="gold">🇹🇼 繁: {sp.trad}</Badge>
          <Badge variant="jade">{f.topicLabel} ({item.level})</Badge>
        </div>
      </div>

      <div className={`flashcard-3d-wrapper ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((v) => !v)}>
        <div className="flashcard-3d-inner">
          <div className="flashcard-face flashcard-front">
            <Badge variant="rose" style={{ marginBottom: 16 }}>
              {isLearningZh ? 'Nhấn vào thẻ để lật xem nghĩa & Mẹo nhớ ↺' : '点击卡片翻转查看释义与记忆窍门 ↺'}
            </Badge>
            <div style={{ fontSize: '3.2rem', fontWeight: 800, marginBottom: 10 }}>{isLearningZh ? <ScriptText text={item.word} /> : item.word}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <SpeakButton text={item.word} lang={f.speechLang} className="btn btn-outline" stopPropagation>
                🔊 {isLearningZh ? 'Nghe phát âm' : '听标准发音'}
              </SpeakButton>
              <button type="button" className="btn btn-outline" style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }} onClick={(e) => { e.stopPropagation(); openInsight(item.id); }}>
                ✨ {isLearningZh ? 'Giải mã thú vị' : '趣味解析'}
              </button>
            </div>
          </div>
          <div className="flashcard-face flashcard-back">
            <div style={{ fontSize: '1.85rem', fontWeight: 800 }}>
              {item.word} <span style={{ fontSize: '1rem', color: 'var(--brand-indigo)' }}>(简:{sp.simp} / 繁:{sp.trad})</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-primary)', margin: '4px 0' }}>{f.phonetic}</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-secondary)', marginBottom: 10 }}>{f.meaning}</div>
            <div style={{ background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: 14, width: '100%', fontSize: '0.9rem' }}>
              <div style={{ fontWeight: 700 }}>{isLearningZh ? <ScriptText text={f.exTarget} /> : f.exTarget}</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{f.exNative}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
        <button type="button" className="btn btn-sm btn-outline" onClick={prev}>← {isLearningZh ? 'Từ trước' : '上一张'}</button>
        <SpeakButton text={item.word} lang={f.speechLang} className="btn btn-sm btn-outline">🔊 {isLearningZh ? 'Nghe' : '发音'}</SpeakButton>
        <button type="button" className="btn btn-sm btn-primary" onClick={() => openInsight(item.id)}>✨ {isLearningZh ? 'Giải mã SGK vs Đời thực' : '教科书 vs 现实解析'}</button>
        <button type="button" className={`btn btn-sm ${isFav ? 'btn-primary' : 'btn-outline'}`} onClick={() => toggleFavorite(item.id)}>❤️ {isLearningZh ? 'Yêu thích' : '收藏'}</button>
        <button type="button" className="btn btn-sm btn-outline" onClick={next}>{isLearningZh ? 'Từ tiếp' : '下一张'} →</button>
      </div>

      <div className="card" style={{ padding: 18, textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>
          {isLearningZh ? 'Đánh giá mức độ nhớ (Spaced Repetition SRS):' : '间隔重复记忆评分 (Spaced Repetition):'}
        </div>
        <div className="srs-rating-grid">
          {SRS.map((s) => (
            <button key={s.r} type="button" className={`srs-btn srs-${s.r}`} onClick={() => rate(s.r)}>
              <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
              <span>{isLearningZh ? s.vi : s.zh}</span>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{s.when}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
