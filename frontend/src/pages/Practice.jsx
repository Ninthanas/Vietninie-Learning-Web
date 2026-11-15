import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { useProgress } from '../hooks/useProgress';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const MODES = [
  { to: '/quiz', zh: '测', title: 'Quiz', text: 'Chọn đáp án đúng cho từ và câu. Chọn chủ đề hoặc cấp độ trước khi vào.', meta: '5–10 phút' },
  { to: '/listening', zh: '听', title: 'Luyện nghe', text: 'Nghe một đoạn rồi trả lời câu hỏi. Có thể nghe lại.', meta: '3–5 phút' },
  { to: '/conversation', zh: '话', title: 'Hội thoại', text: 'Học qua tình huống thật: gọi món, hỏi đường, đi làm.', meta: '5–8 phút' }
];

export default function Practice() {
  const { review } = useProgress();
  useDocumentTitle('Vietninie • Luyện tập');
  return (
    <section className="section-block">
      <div className="container">
        <div className="page-head">
          <div>
            <h1 className="page-title">Luyện tập</h1>
            <p className="page-sub">Chọn một kiểu luyện. Mỗi kiểu là một màn riêng, làm xong mới sang màn khác.</p>
          </div>
        </div>

        <div className="card practice-hero">
          <div>
            <span className="practice-eyebrow">GỢI Ý CHO BẠN</span>
            <h2>{review.size ? `Ôn ${review.size} từ sắp quên` : 'Ôn lại từ đã học'}</h2>
            <p>Lặp lại ngắt quãng (SRS), khoảng 5 phút.</p>
          </div>
          <Button to="/vocabulary?status=review&mode=flashcard" className="practice-cta">Ôn ngay</Button>
        </div>

        <div className="practice-grid">
          {MODES.map((m) => (
            <Link key={m.to} to={m.to} className="card practice-card">
              <span className="zone-char" lang="zh" aria-hidden="true">{m.zh}</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
              <small>{m.meta}</small>
              <span className="btn btn-outline practice-start">Bắt đầu</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
