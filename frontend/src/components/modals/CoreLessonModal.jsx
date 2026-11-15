import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import SpeakButton from '../common/SpeakButton';
import { CORE_LESSONS_BANK } from '../../data/coreLessons';
import { useUI } from '../../hooks/useUI';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { useProgress } from '../../hooks/useProgress';
import { saveLessonScore } from '../../services/storage';
import { syncLessonAttempt } from '../../services/api';

const card = { padding: 14, borderRadius: 12, background: 'var(--bg-primary)', border: '1px solid var(--border-color)' };

const scoreOf = (lesson, answers) => lesson.quizzes.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);

/** 4-step lesson player: lesson list → 1 vocab → 2 sentences → 3 quiz → 4 result (score is saved + synced). */
export default function CoreLessonModal() {
  const { lessonsOpen, closeLessons } = useUI();
  const { token, user } = useAuth();
  const { isVi } = useLanguage();
  const { lessonScores } = useProgress();

  const [lessonId, setLessonId] = useState(null); // null => lesson list
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (lessonsOpen) setLessonId(null);
  }, [lessonsOpen]);

  const lesson = CORE_LESSONS_BANK.find((l) => l.id === lessonId) || null;

  const start = (id) => {
    setLessonId(id);
    setStep(1);
    setAnswers({});
  };

  const complete = async () => {
    const score = scoreOf(lesson, answers);
    const total = lesson.quizzes.length;
    saveLessonScore({
      lesson_id: lesson.id, title_vi: lesson.title_vi, title_zh: lesson.title_zh, score, total,
      date: new Date().toISOString().slice(0, 10)
    });
    setStep(4);
    await syncLessonAttempt({ token, user, lessonId: lesson.id, score, total });
  };

  const badge = (
    <Badge variant="rose">{lesson ? `${lesson.level} • Bước ${step} / 4` : '🎓 Bài Học Cốt Lõi 4 Bước'}</Badge>
  );

  const nav = (back, backLabel, next, nextLabel, nextClass = 'btn-primary') => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <button type="button" className="btn btn-outline" onClick={back}>{backLabel}</button>
      <button type="button" className={`btn ${nextClass}`} onClick={next}>{nextLabel}</button>
    </div>
  );

  return (
    <Modal open={lessonsOpen} onClose={closeLessons} maxWidth={720} header={badge}>
      {!lesson && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 }}>
            {isVi ? '🎓 Khóa Học Cốt Lõi 4 Bước (Có Chấm Điểm & Lưu Hồ Sơ)' : '🎓 4步法核心闯关课程（自动计分与云端存档）'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 18, fontSize: '0.92rem' }}>
            {isVi
              ? 'Mỗi bài học gồm 4 bước: Từ vựng → Câu mẫu → Kiểm tra tính điểm → Lưu điểm vào bảng thành tích.'
              : '每课包含 4 个互动步骤：核心词汇 → 实用句型 → 随堂测验计分 → 云端成绩保存。'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CORE_LESSONS_BANK.map((l) => {
              const rec = lessonScores[l.id];
              return (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 14, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <Badge variant="rose">{l.level}</Badge>
                    <strong style={{ fontSize: '1.05rem', marginLeft: 6 }}>{isVi ? l.title_vi : l.title_zh}</strong>
                    {rec && (
                      <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700, marginTop: 4 }}>
                        ✓ Đã hoàn thành • Điểm số: {rec.score}/{rec.total} ({rec.date})
                      </div>
                    )}
                  </div>
                  <button type="button" className="btn btn-sm btn-primary" onClick={() => start(l.id)}>
                    {rec ? (isVi ? 'Học lại 🔄' : '重新闯关 🔄') : isVi ? 'Bắt đầu học →' : '开始学习 →'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {lesson && step === 1 && (
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 14 }}>📖 Bước 1/4: Từ vựng trọng tâm</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {lesson.vocab.map((v) => (
              <div key={v.vi} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{v.vi}</div>
                  <div style={{ fontWeight: 700, margin: '2px 0' }}>{v.zh}</div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{v.note}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <SpeakButton text={v.vi} lang="vi-VN" className="btn btn-sm btn-outline">🔊 VI</SpeakButton>
                  <SpeakButton text={v.zh} lang="zh-CN" className="btn btn-sm btn-outline">🔊 ZH</SpeakButton>
                </div>
              </div>
            ))}
          </div>
          {nav(() => setLessonId(null), '← Danh sách bài', () => setStep(2), 'Tiếp tục Bước 2 (Câu mẫu) →')}
        </div>
      )}

      {lesson && step === 2 && (
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 14 }}>💬 Bước 2/4: Mẫu câu giao tiếp thực tế</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {lesson.sentences.map((s) => (
              <div key={s.vi} style={{ ...card, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{s.vi}</div>
                    <div style={{ color: 'var(--brand-primary)', fontWeight: 700, margin: '4px 0' }}>{s.zh}</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>💡 {s.note}</div>
                  </div>
                  <SpeakButton text={s.vi} lang="vi-VN" className="btn btn-sm btn-primary">🔊 Nghe</SpeakButton>
                </div>
              </div>
            ))}
          </div>
          {nav(() => setStep(1), '← Quay lại Bước 1', () => setStep(3), 'Tiếp tục Bước 3 (Kiểm tra tính điểm) →')}
        </div>
      )}

      {lesson && step === 3 && (
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 14 }}>✅ Bước 3/4: Bài tập kiểm tra lấy điểm</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            {lesson.quizzes.map((q, qIdx) => (
              <div key={qIdx} style={{ ...card, padding: 16 }}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>Câu {qIdx + 1}: {q.q}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      className="placement-option-btn"
                      style={{ margin: 0, ...(answers[qIdx] === oIdx ? { borderColor: 'var(--brand-primary)', background: 'var(--brand-primary-soft)' } : {}) }}
                      onClick={() => setAnswers((a) => ({ ...a, [qIdx]: oIdx }))}
                    >
                      {String.fromCharCode(65 + oIdx)}. {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {nav(() => setStep(2), '← Quay lại Bước 2', complete, '🏆 Nộp bài & Lưu điểm số →')}
        </div>
      )}

      {lesson && step === 4 && (() => {
        const total = lesson.quizzes.length;
        const score = scoreOf(lesson, answers);
        return (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ fontSize: '3.6rem', marginBottom: 10 }}>🎉</div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Hoàn Thành Bài Học!</h2>
            <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-primary)', margin: '10px 0' }}>
              Điểm số đạt được: {score} / {total} ({Math.round((score / Math.max(1, total)) * 100)}%)
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 22 }}>
              Kết quả điểm số đã được lưu vào Hồ sơ Tiến độ và đồng bộ lên hệ thống!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button type="button" className="btn btn-primary" onClick={() => setLessonId(null)}>📚 Học bài tiếp theo</button>
              <button type="button" className="btn btn-outline" onClick={closeLessons}>Đóng cửa sổ</button>
            </div>
          </div>
        );
      })()}
    </Modal>
  );
}
