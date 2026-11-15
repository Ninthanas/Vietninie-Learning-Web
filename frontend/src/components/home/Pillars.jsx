import { Link } from 'react-router-dom';
import Trans from '../common/Trans';
import { useUI } from '../../hooks/useUI';

export default function Pillars() {
  const { openLessons } = useUI();
  return (
    <section className="section-block">
      <div className="container">
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: 32 }}>
          <div>
            <Trans k="featuresTitle" as="h2">Học đúng trọng tâm, tự tin giao tiếp</Trans>
            <Trans k="featuresSubtitle" as="p" style={{ marginTop: 6 }}>Thiết kế tinh gọn, tập trung vào những gì bạn thực sự cần dùng</Trans>
          </div>
        </div>
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon">📚</div>
            <Trans k="feat1Title" as="h3">Kho Từ Vựng & Flashcard 3D</Trans>
            <Trans k="feat1Desc" as="p">Hơn 4.500+ từ theo 60 chủ đề đời sống, kết hợp thuật toán lặp lại ngắt quãng (SRS) giúp nhớ từ sâu, không học vẹt.</Trans>
            <Link to="/vocabulary" className="pillar-action">Khám phá từ vựng →</Link>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">💬</div>
            <Trans k="feat2Title" as="h3">Hội Thoại & Luyện Nghe Thực Tế</Trans>
            <Trans k="feat2Desc" as="p">17 tình huống đàm thoại đời sống, sân bay, công sở với giọng đọc chuẩn bản xứ, giúp bạn tự tin phản xạ.</Trans>
            <Link to="/conversation" className="pillar-action">Luyện hội thoại →</Link>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">🎯</div>
            <Trans k="feat3Title" as="h3">Bài Học 4 Bước & Quiz Thử Thách</Trans>
            <Trans k="feat3Desc" as="p">Học từng bước có hệ thống (Từ vựng → Câu mẫu → Quiz phản xạ), tự động chấm điểm và lưu tiến độ lên đám mây.</Trans>
            <button type="button" className="pillar-action-btn" onClick={openLessons}>Vào học ngay →</button>
          </div>
          <div className="pillar-card" style={{ border: '1.5px solid rgba(249, 115, 22, 0.3)', background: 'linear-gradient(180deg, var(--bg-secondary) 0%, rgba(249, 115, 22, 0.04) 100%)' }}>
            <div className="pillar-icon">💼</div>
            <h3>Tiếng Trung Chuyên Ngành</h3>
            <p>123+ thuật ngữ ngành Game, Quản lý dự án (PM), giao tiếp đối tác Trung Quốc, công cụ Jira/Notion & kịch bản phỏng vấn.</p>
            <Link to="/specialized" className="pillar-action" style={{ color: 'var(--brand-primary)', fontWeight: 800 }}>Khám phá chuyên ngành →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
