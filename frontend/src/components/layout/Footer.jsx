import { Link } from 'react-router-dom';
import { useUI } from '../../hooks/useUI';
import { useAuth } from '../../hooks/useAuth';
import Trans from '../common/Trans';
import { LogoMark } from '../mascot/Logo';

export default function Footer() {
  const { openLessons, openPlacement } = useUI();
  const { openAuthModal } = useAuth();
  const act = (fn) => (e) => {
    e.preventDefault();
    fn();
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-logo" style={{ marginBottom: 12 }}>
              <LogoMark size={42} />
              <Trans k="brandName">Vietninie (越学越辣 🌶️)</Trans>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 380 }}>
              Nền tảng học ngoại ngữ song ngữ Việt Nam ⇄ Trung Quốc chính thức: 5.000+ từ vựng thực tế, 10 Bài học 4 bước, Bài Test đầu vào A1–C2, Flashcard 3D SRS, 8 chế độ Quiz & Đồng bộ đám mây Turso.
            </p>
          </div>

          <div>
            <Trans k="vocabulary" as="h4" style={{ marginBottom: 12 }}>Từ vựng & Bài học</Trans>
            <ul className="footer-links">
              <li><a href="#lessons" onClick={act(openLessons)}>🎓 10 Bài học cốt lõi (4 bước)</a></li>
              <li><Link to="/vocabulary">60 Chủ đề thông dụng</Link></li>
              <li><Link to="/vocabulary?mode=flashcard">Flashcard 3D & SRS</Link></li>
            </ul>
          </div>

          <div>
            <Trans k="grammar" as="h4" style={{ marginBottom: 12 }}>Kỹ năng & Kiểm tra</Trans>
            <ul className="footer-links">
              <li><a href="#placement" onClick={act(openPlacement)}>🎯 Bài Test Đầu Vào (A1–C2)</a></li>
              <li><Link to="/grammar">Chuyên đề Ngữ pháp</Link></li>
              <li><Link to="/conversation">17 Tình huống Hội thoại</Link></li>
            </ul>
          </div>

          <div>
            <Trans k="progress" as="h4" style={{ marginBottom: 12 }}>Tài khoản & Tiến độ</Trans>
            <ul className="footer-links">
              <li><a href="#login" onClick={act(() => openAuthModal('login'))}>🔐 Đăng nhập / Đăng ký</a></li>
              <li><Link to="/progress">📊 Bảng điểm & Tiến độ</Link></li>
              <li><Link to="/settings">⚙️ Cài đặt & Quản trị CMS</Link></li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            color: 'var(--text-muted)',
            fontSize: '0.84rem'
          }}
        >
          <span>© 2026 SenTrúc × Vietninie Official Bilingual Platform (Việt Nam 🇻🇳 ⇄ 🇨🇳 Trung Quốc).</span>
          <span>Turso Cloud DB Connected • 4-Mirror Audio Engine</span>
        </div>
      </div>
    </footer>
  );
}
