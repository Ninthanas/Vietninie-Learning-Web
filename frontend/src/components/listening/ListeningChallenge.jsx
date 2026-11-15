import { useEffect, useMemo, useState } from 'react';
import Badge from '../common/Badge';
import SpeakButton from '../common/SpeakButton';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import { speak } from '../../services/audio';
import { shuffle } from '../../utils/helpers';

export default function ListeningChallenge({ items, level }) {
  const { isLearningZh, speechLang } = useLanguage();
  const { showToast } = useToast();
  const [idx, setIdx] = useState(0);
  const [verdicts, setVerdicts] = useState({}); // optionId -> 'correct' | 'wrong'

  useEffect(() => setIdx(0), [items]);

  const current = items[idx % items.length];
  const options = useMemo(
    () => shuffle([current, ...shuffle(items.filter((i) => i.id !== current.id)).slice(0, 3)]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current.id, items]
  );

  useEffect(() => {
    setVerdicts({});
    const id = setTimeout(() => speak(current.word, speechLang), 300);
    return () => clearTimeout(id);
  }, [current.id, speechLang]); // eslint-disable-line react-hooks/exhaustive-deps

  const sentence = (isLearningZh ? current.example_zh : current.example_vi) || current.word;

  const verify = (opt) => {
    const ok = opt.id === current.id;
    setVerdicts((v) => ({ ...v, [opt.id]: ok ? 'correct' : 'wrong' }));
    showToast(ok ? '🎉 Chính xác! Tai nghe rất nhạy! / 听力完全正确！' : '💡 Hãy bấm nghe lại một lần nữa nhé! / 请再听一遍试试！');
  };

  return (
    <div className="quiz-arena" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <Badge variant="rose">🎯 {isLearningZh ? 'Cấp độ' : '难度等级'}: {level === 'all' ? current.level || 'Tổng hợp' : level.toUpperCase()}</Badge>
        <Badge variant="jade">{isLearningZh ? 'Câu' : '题目'} {(idx % items.length) + 1} / {items.length}</Badge>
      </div>
      <h2 style={{ margin: '10px 0 8px' }}>🎧 {isLearningZh ? 'Nghe phát âm và chọn đáp án chính xác' : '听标准发音并选择正确词条'}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 22 }}>
        {isLearningZh ? 'Bấm nút loa bên dưới để nghe từ vựng hoặc câu ví dụ tự nhiên:' : '点击下方扬声器按钮聆听单词或完整真实例句：'}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <SpeakButton text={current.word} lang={speechLang} className="btn btn-primary" style={{ padding: '15px 28px', fontSize: '1.05rem' }}>
          🔊 {isLearningZh ? 'Phát âm Từ vựng' : '播放单词音频'}
        </SpeakButton>
        <SpeakButton text={sentence} lang={speechLang} className="btn btn-outline" style={{ padding: '15px 24px' }}>
          🗣️ {isLearningZh ? 'Nghe câu thực tế' : '播放完整例句'}
        </SpeakButton>
      </div>

      <div className="quiz-options-grid">
        {options.map((opt) => (
          <button key={opt.id} type="button" className={`quiz-opt-btn ${verdicts[opt.id] || ''}`} onClick={() => verify(opt)}>
            {isLearningZh ? `${opt.word} (${opt.pinyin}) — ${opt.meaning_vi}` : `${opt.word} — ${opt.meaning_zh}`}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button type="button" className="btn btn-outline" onClick={() => setIdx((i) => i + 1)}>{isLearningZh ? 'Câu nghe tiếp theo →' : '下一题听力 →'}</button>
      </div>
    </div>
  );
}
