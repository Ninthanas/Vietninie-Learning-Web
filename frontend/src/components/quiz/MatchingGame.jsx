import { useMemo, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useProgress } from '../../hooks/useProgress';
import { useToast } from '../../hooks/useToast';
import { shuffle } from '../../utils/helpers';

const PAIRS = 6;

/** Mode 5: match 6 words with their meanings (click one on each side). */
export default function MatchingGame({ pool }) {
  const { isLearningZh } = useLanguage();
  const { markLearned, saveQuizResult } = useProgress();
  const { showToast } = useToast();
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null); // { pairId, side }
  const [matched, setMatched] = useState(() => new Set());
  const [wrong, setWrong] = useState(null);

  const { left, right } = useMemo(() => {
    const pairs = shuffle(pool).slice(0, PAIRS);
    return {
      left: shuffle(pairs.map((p) => ({ pairId: p.id, side: 'word', label: p.word }))),
      right: shuffle(pairs.map((p) => ({ pairId: p.id, side: 'meaning', label: isLearningZh ? p.meaning_vi : p.meaning_zh })))
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, round, isLearningZh]);

  const reset = () => {
    setRound((r) => r + 1);
    setSelected(null);
    setMatched(new Set());
  };

  const click = (card) => {
    if (matched.has(card.pairId)) return;
    if (!selected) return setSelected(card);
    if (selected.pairId === card.pairId && selected.side === card.side) return setSelected(null);

    if (selected.pairId === card.pairId && selected.side !== card.side) {
      const next = new Set(matched).add(card.pairId);
      setMatched(next);
      setSelected(null);
      markLearned(card.pairId, true);
      if (next.size === left.length) {
        saveQuizResult('matching', left.length, left.length);
        showToast('🎉 Tuyệt vời! Bạn đã ghép đúng cả 6 cặp từ! / 恭喜全部配对成功！');
      }
    } else {
      const key = `${card.pairId}-${card.side}`;
      setWrong(key);
      setSelected(null);
      setTimeout(() => setWrong(null), 450);
    }
  };

  const cls = (c) => {
    const key = `${c.pairId}-${c.side}`;
    return ['match-card', matched.has(c.pairId) && 'matched', selected && selected.pairId === c.pairId && selected.side === c.side && 'selected', wrong === key && 'wrong']
      .filter(Boolean)
      .join(' ');
  };
  const column = (cards) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {cards.map((c) => <div key={`${c.pairId}-${c.side}`} className={cls(c)} onClick={() => click(c)}>{c.label}</div>)}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3>🧩 {isLearningZh ? 'Ghép 6 cặp Từ vựng & Nghĩa tương ứng' : '将左侧词汇与右侧正确释义配对'}</h3>
        <button type="button" className="btn btn-sm btn-outline" onClick={reset}>🔄 {isLearningZh ? 'Đổi bộ thẻ' : '换一组'}</button>
      </div>
      <div className="matching-board">
        {column(left)}
        {column(right)}
      </div>
    </div>
  );
}
