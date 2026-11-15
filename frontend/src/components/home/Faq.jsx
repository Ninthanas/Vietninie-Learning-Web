import { useState } from 'react';
import Trans from '../common/Trans';

const FAQS = [
  ['faq1Q', 'faq1A', 'Làm sao để đổi giữa giao diện học Tiếng Trung và học Tiếng Việt?', 'Bạn chỉ cần bấm nút "Đổi ngôn ngữ / 切换语言" trên thanh menu trên cùng. Toàn bộ giao diện và kho dữ liệu sẽ chuyển sang hướng học tương ứng ngay lập tức.'],
  ['faq2Q', 'faq2A', 'Hệ thống ôn tập Spaced Repetition (SRS) hoạt động như thế nào?', 'Khi học Flashcard, bạn đánh giá mức độ nhớ (❌ Chưa nhớ, 😐 Hơi nhớ, 😊 Nhớ, 🔥 Rất nhớ). Hệ thống sẽ lưu vào bộ nhớ trình duyệt và ưu tiên nhắc lại những từ bạn hay quên.'],
  ['faq3Q', 'faq3A', 'Website có phát âm giọng đọc khi không có mạng hoặc thiếu file MP3 không?', 'Có! Hệ thống ưu tiên giọng đọc bản xứ của trình duyệt (Web Speech API zh-CN / vi-VN) và tự động chuyển sang luồng TTS dự phòng khi cần.']
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section-block" style={{ background: 'var(--bg-tertiary)' }}>
      <div className="container">
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <Trans k="faqTitle" as="h2">Câu hỏi thường gặp (FAQ)</Trans>
        </div>
        <div className="faq-list">
          {FAQS.map(([qk, ak, q, a], i) => (
            <div key={qk} className={`faq-item ${open === i ? 'open' : ''}`}>
              <button type="button" className="faq-question" onClick={() => setOpen(open === i ? -1 : i)}>
                <Trans k={qk}>{q}</Trans>
                <span>▾</span>
              </button>
              <Trans k={ak} as="div" className="faq-answer">{a}</Trans>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
