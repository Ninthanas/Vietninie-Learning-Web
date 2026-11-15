import SpecSpeak from './SpecSpeak';
import CopyButton from './CopyButton';
import { useLanguage } from '../../hooks/useLanguage';

export default function InterviewView({ scenarios = [] }) {
  const { scriptMode } = useLanguage();
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6 }}>🎙️ Kịch Bản Phỏng Vấn & Xử Lý Tình Huống Công Sở</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Các tình huống thực chiến kinh điển khi phỏng vấn công ty game / dự án Trung Quốc: Giới thiệu chuyên môn, xử lý thiếu thông tin, và quy trình phân tích tựa game mới.
        </p>
      </div>
      {scenarios.map((sc, idx) => {
        const answerZh = scriptMode === 'traditional' && sc.answer_zh_tw ? sc.answer_zh_tw : sc.answer_zh;
        return (
          <div key={idx} className="interview-scenario-card">
            <div className="interview-badge"><span>🎯 Tình huống {idx + 1}: {sc.topic_vi}</span></div>
            <div className="scenario-qa-box">
              <div className="scenario-q">
                <div className="scenario-q-label">❓ Câu hỏi của Nhà tuyển dụng / Đối tác (Interview Question):</div>
                <div className="scenario-q-text">{sc.question_zh}</div>
                <div style={{ fontSize: '0.88rem', color: '#92400E', marginTop: 4 }}>{sc.question_vi}</div>
                <div style={{ marginTop: 8 }}>
                  <SpecSpeak text={sc.question_zh} className="btn btn-sm btn-outline" style={{ borderColor: '#F59E0B', color: '#B45309', padding: '4px 10px', fontSize: '0.8rem' }}>🔊 Nghe câu hỏi</SpecSpeak>
                </div>
              </div>
              <div className="scenario-a">
                <div className="scenario-a-header">
                  <span className="scenario-a-label">⭐ Câu trả lời mẫu ghi điểm (Model Answer):</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <SpecSpeak text={sc.answer_zh} className="btn btn-sm" style={{ background: '#15803D', color: '#FFFFFF', padding: '4px 12px', fontSize: '0.82rem' }}>🔊 Nghe toàn bộ câu trả lời</SpecSpeak>
                    <CopyButton text={sc.answer_zh} className="btn btn-sm btn-outline" style={{ borderColor: '#15803D', color: '#15803D', padding: '4px 10px', fontSize: '0.82rem' }}>📋 Sao chép</CopyButton>
                  </div>
                </div>
                <div className="scenario-a-text">{answerZh}</div>
                <div className="scenario-a-pinyin">{sc.answer_pinyin}</div>
                <div className="scenario-a-vi">👉 {sc.answer_vi}</div>
              </div>
            </div>
            {sc.tips_vi && (
              <div className="scenario-tips">
                <span style={{ fontSize: '1.1rem' }}>💡</span>
                <div><strong>Mẹo ứng xử phỏng vấn:</strong> {sc.tips_vi}</div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
