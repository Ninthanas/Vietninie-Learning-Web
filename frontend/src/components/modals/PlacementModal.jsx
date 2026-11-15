import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { useUI } from '../../hooks/useUI';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import { fetchPlacementQuestions, submitPlacement } from '../../services/api';
import { getPref, setPref } from '../../services/storage';

/** 30-question placement test (A1 → C2). phases: intro → question → result */
export default function PlacementModal() {
  const { placementOpen, closePlacement } = useUI();
  const { token } = useAuth();
  const { isVi } = useLanguage();
  const { showToast } = useToast();

  const [phase, setPhase] = useState('intro');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (placementOpen) setPhase('intro');
  }, [placementOpen]);

  const start = async () => {
    setAnswers({});
    setIndex(0);
    setQuestions(await fetchPlacementQuestions());
    setPhase('question');
  };

  const choose = async (qId, optionIdx) => {
    const next = { ...answers, [qId]: optionIdx };
    setAnswers(next);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      return;
    }
    const res = await submitPlacement({ questions, answers: next, token });
    setPref('sentruc_placement_level', res.recommended_level);
    setPref('sentruc_placement_result', JSON.stringify(res));
    setResult(res);
    setPhase('result');
  };

  const applyLevel = (level) => {
    setPref('sentruc_user_level', level);
    setPref('vietmigo_current_level', level);
    closePlacement();
    showToast(isVi ? `🎯 Đã cập nhật trình độ học của bạn thành: ${level}!` : `🎯 已将您的学习等级更新为：${level}！`);
  };

  const q = questions[index];
  const savedLevel = getPref('sentruc_placement_level');

  return (
    <Modal open={placementOpen} onClose={closePlacement} header={<Badge variant="rose">🎯 Placement Test (A1 → C2 / HSK 1 → 6)</Badge>}>
      {phase === 'intro' && (
        <div style={{ textAlign: 'center', padding: '12px 8px' }}>
          <div style={{ fontSize: '3.4rem', marginBottom: 10 }}>🧭</div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: 8 }}>
            {isVi ? 'Bài Kiểm Tra Đánh Giá Năng Lực Đầu Vào' : '越南语 / 中文 水平定级测试'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.6 }}>
            {isVi
              ? 'Hệ thống đánh giá chính xác năng lực của bạn qua các cấp độ từ Sơ cấp (A1 / HSK 1) đến Cao cấp (C2 / HSK 6) và tự động đề xuất lộ trình học phù hợp nhất.'
              : '通过精选分级考题，精准测评您当前的语言水平（A1入门 至 C2精通），并自动为您匹配最佳学习起点。'}
          </p>
          {savedLevel && (
            <div style={{ marginBottom: 18, padding: 12, borderRadius: 12, background: 'var(--brand-secondary-soft)', color: 'var(--brand-secondary)', fontWeight: 700 }}>
              🏆 {isVi ? `Kết quả đánh giá gần nhất của bạn: Trình độ ${savedLevel}` : `您上次的定级结果：${savedLevel} 等级`}
            </div>
          )}
          <button type="button" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }} onClick={start}>
            🚀 {isVi ? 'Bắt đầu làm bài test ngay' : '立即开始定级测试'}
          </button>
        </div>
      )}

      {phase === 'question' && q && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
              {isVi ? `Câu hỏi ${index + 1} / ${questions.length}` : `题目 ${index + 1} / ${questions.length}`}
            </span>
            <Badge variant="jade">{isVi ? `Cấp độ câu: ${q.level}` : `难度等级: ${q.level}`}</Badge>
          </div>
          <ProgressBar percent={Math.round(((index + 1) / questions.length) * 100)} height={8} style={{ marginBottom: 20 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 18, lineHeight: 1.5 }}>{q.question_zh}</h3>
          <div>
            {q.options.map((opt, idx) => (
              <button key={idx} type="button" className="placement-option-btn" onClick={() => choose(q.id, idx)}>
                <strong>{String.fromCharCode(65 + idx)}.</strong> {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'result' && result && (
        <div style={{ textAlign: 'center', padding: '10px 4px' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 8 }}>🏆</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{isVi ? 'Kết Quả Đánh Giá Trình Độ Của Bạn' : '您的语言水平定级报告'}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            {isVi ? `Số câu đúng: ${result.total_correct} / ${result.total_questions}` : `答对题数：${result.total_correct} / ${result.total_questions}`}
          </p>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--brand-primary)', margin: '12px 0' }}>{result.recommended_level}</div>
          <div className="placement-score-grid">
            {(result.level_scores || []).map((ls) => (
              <div key={ls.level} className="placement-score-cell">
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ls.level}</div>
                <div style={{ fontWeight: 900, fontSize: '1.15rem', color: 'var(--brand-primary)', margin: '4px 0' }}>{ls.correct}/{ls.total}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: ls.percentage >= 60 ? '#059669' : '#DC2626' }}>{ls.percentage}%</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={() => applyLevel(result.recommended_level)}>
              ✓ {isVi ? `Áp dụng trình độ ${result.recommended_level}` : `应用推荐等级 ${result.recommended_level}`}
            </button>
            <button type="button" className="btn btn-outline" onClick={start}>
              🔄 {isVi ? 'Làm lại bài test' : '重新测试'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
