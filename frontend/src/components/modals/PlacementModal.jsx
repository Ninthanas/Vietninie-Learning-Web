import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { useUI } from '../../hooks/useUI';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import { getBaseVocabulary, getGrammar } from '../../services/dataService';
import { getPref, setPref } from '../../services/storage';
import { HSK_OF, buildPlacementTest, scorePlacement, shouldStopAfter } from '../../utils/placement';

/**
 * Adaptive placement test (A1 → C2 / HSK 1 → 6). Questions are generated from the vocabulary +
 * grammar banks every time, so a retake is a different test. phases: intro → question → result
 */
export default function PlacementModal() {
  const { placementOpen, closePlacement } = useUI();
  const { isVi, learningLang, isLearningZh } = useLanguage();
  const { showToast } = useToast();

  const [phase, setPhase] = useState('intro');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (placementOpen) setPhase('intro');
  }, [placementOpen]);

  const start = async () => {
    setLoading(true);
    try {
      const [vocab, grammar] = await Promise.all([getBaseVocabulary(learningLang), getGrammar(learningLang)]);
      setQuestions(buildPlacementTest({ vocab, grammar, dir: learningLang, isVi }));
      setAnswers({});
      setIndex(0);
      setPhase('question');
    } catch {
      showToast(isVi ? 'Không tạo được đề, thử lại nhé.' : '生成试题失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  // optionIdx === -1 means "I don't know" (counts as wrong, discourages guessing)
  const choose = (q, optionIdx) => {
    const next = { ...answers, [q.id]: optionIdx };
    setAnswers(next);
    const last = index + 1 >= questions.length;
    if (last || shouldStopAfter(questions, next, index)) {
      const res = scorePlacement(questions, next);
      setPref('sentruc_placement_level', res.recommended_level);
      setPref('sentruc_placement_result', JSON.stringify(res));
      setResult(res);
      setPhase('result');
      return;
    }
    setIndex(index + 1);
  };

  const applyLevel = (level) => {
    setPref('sentruc_user_level', level);
    setPref('vietmigo_current_level', level);
    closePlacement();
    showToast(isVi ? `🎯 Đã cập nhật trình độ học của bạn thành: ${level}!` : `🎯 已将您的学习等级更新为：${level}！`);
  };

  const q = questions[index];
  const savedLevel = getPref('sentruc_placement_level');
  const levelLabel = (lv) => (isLearningZh ? `${lv} · ${HSK_OF[lv]}` : lv);

  return (
    <Modal open={placementOpen} onClose={closePlacement} header={<Badge variant="rose">🎯 Placement Test (A1 → C2 / HSK 1 → 6)</Badge>}>
      {phase === 'intro' && (
        <div style={{ textAlign: 'center', padding: '12px 8px' }}>
          <div style={{ fontSize: '3.4rem', marginBottom: 10 }}>🧭</div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: 8 }}>
            {isVi ? 'Bài Kiểm Tra Đánh Giá Năng Lực Đầu Vào' : '越南语 / 中文 水平定级测试'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
            {isVi
              ? 'Tối đa 30 câu, đi từ dễ đến khó (A1 → C2). Đề được tạo mới mỗi lần: hiểu nghĩa từ, nhớ từ, điền từ vào câu và ngữ pháp. Bài sẽ tự dừng khi bạn chạm trần trình độ.'
              : '最多30题，由易到难（A1 → C2）。每次随机出题：词义辨析、词汇回忆、句中填空和语法。达到您的水平上限后会自动结束。'}
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 18, fontSize: '0.9rem' }}>
            💡 {isVi ? 'Không biết thì chọn “Tôi không biết” — đoán bừa sẽ làm kết quả kém chính xác.' : '不会就选“我不知道”——乱猜会让结果不准确。'}
          </p>
          {savedLevel && (
            <div style={{ marginBottom: 18, padding: 12, borderRadius: 12, background: 'var(--brand-secondary-soft)', color: 'var(--brand-secondary)', fontWeight: 700 }}>
              🏆 {isVi ? `Kết quả đánh giá gần nhất của bạn: Trình độ ${savedLevel}` : `您上次的定级结果：${savedLevel} 等级`}
            </div>
          )}
          <button type="button" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }} onClick={start} disabled={loading}>
            🚀 {loading ? (isVi ? 'Đang tạo đề…' : '正在出题…') : isVi ? 'Bắt đầu làm bài test ngay' : '立即开始定级测试'}
          </button>
        </div>
      )}

      {phase === 'question' && q && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
              {isVi ? `Câu ${index + 1} / ${questions.length}` : `题目 ${index + 1} / ${questions.length}`}
            </span>
            <Badge variant="jade">{isVi ? `Cấp độ: ${levelLabel(q.level)}` : `难度等级: ${levelLabel(q.level)}`}</Badge>
          </div>
          <ProgressBar percent={Math.round((index / questions.length) * 100)} height={8} style={{ marginBottom: 20 }} />
          <div style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 }}>{q.prompt}</div>
          <h3
            style={{
              fontSize: q.stemClass === 'word' ? '2.2rem' : q.stemClass === 'meaning' ? '1.4rem' : '1.2rem',
              fontWeight: 800,
              marginBottom: q.hint ? 6 : 18,
              lineHeight: 1.5
            }}
          >
            {q.stem}
          </h3>
          {q.hint && <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 18, lineHeight: 1.5 }}>{q.hint}</div>}
          <div>
            {q.options.map((opt, idx) => (
              <button key={`${q.id}-${idx}`} type="button" className="placement-option-btn" onClick={() => choose(q, idx)}>
                <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
              </button>
            ))}
            <button type="button" className="placement-option-btn" style={{ opacity: 0.75, borderStyle: 'dashed' }} onClick={() => choose(q, -1)}>
              🤷 {isVi ? 'Tôi không biết' : '我不知道'}
            </button>
          </div>
        </div>
      )}

      {phase === 'result' && result && (
        <div style={{ textAlign: 'center', padding: '10px 4px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 8 }}>🏆</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{isVi ? 'Kết Quả Đánh Giá Trình Độ Của Bạn' : '您的语言水平定级报告'}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            {isVi ? `Số câu đúng: ${result.total_correct} / ${result.total_questions}` : `答对题数：${result.total_correct} / ${result.total_questions}`}
            {result.skipped > 0 && (isVi ? ` · bỏ qua ${result.skipped} câu` : ` · 跳过 ${result.skipped} 题`)}
          </p>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--brand-primary)', margin: '12px 0 0' }}>{result.recommended_level}</div>
          {isLearningZh && <div style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>≈ {HSK_OF[result.recommended_level]}</div>}
          <div className="placement-score-grid">
            {(result.level_scores || []).map((ls) => (
              <div key={ls.level} className="placement-score-cell" style={ls.tested ? undefined : { opacity: 0.4 }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ls.level}</div>
                <div style={{ fontWeight: 900, fontSize: '1.15rem', color: 'var(--brand-primary)', margin: '4px 0' }}>
                  {ls.tested ? `${ls.correct}/${ls.total}` : '—'}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: ls.percentage >= 60 ? '#059669' : '#DC2626' }}>{ls.tested ? `${ls.percentage}%` : ''}</div>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: 10 }}>
            {isVi ? 'Trình độ = cấp cao nhất bạn đạt từ 60% trở lên liên tục, bắt đầu từ A1.' : '等级 = 从A1起连续达到60%以上的最高等级。'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={() => applyLevel(result.recommended_level)}>
              ✓ {isVi ? `Áp dụng trình độ ${result.recommended_level}` : `应用推荐等级 ${result.recommended_level}`}
            </button>
            <button type="button" className="btn btn-outline" onClick={start} disabled={loading}>
              🔄 {isVi ? 'Làm lại bài test' : '重新测试'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
