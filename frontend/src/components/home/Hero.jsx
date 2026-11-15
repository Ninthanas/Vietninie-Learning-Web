import Trans from '../common/Trans';
import Button from '../common/Button';
import { useUI } from '../../hooks/useUI';
import SpotlightCard from './SpotlightCard';
import ProgressSummary from './ProgressSummary';
import Mascot3D from '../mascot/Mascot3D';

export default function Hero({ items }) {
  const { openPlacement } = useUI();
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content-col">
          <Trans k="heroEyebrow" as="span" className="hero-eyebrow">✨ Học Ngoại Ngữ Tự Nhiên & Thực Tế</Trans>
          <Trans k="heroTitle" as="h1" className="hero-title">
            Chinh phục <span className="highlight">Tiếng Trung & Tiếng Việt</span> dễ dàng hơn mỗi ngày
          </Trans>
          <Trans k="heroDesc" as="p" className="hero-desc">
            Từ vựng theo tình huống thực tế, phát âm chuẩn bản xứ và phản xạ tự nhiên — học nhẹ nhàng, nhớ lâu, không áp lực.
          </Trans>
          <div className="hero-cta-group">
            <Button to="/vocabulary" className="hero-btn-main"><Trans k="startLearning">🚀 Bắt đầu học ngay</Trans></Button>
            <Button variant="outline" className="hero-btn-sub" onClick={openPlacement}>🎯 Test trình độ (A1–C2)</Button>
          </div>
          <div className="hero-highlights">
            <span className="highlight-item">📚 <strong>4.500+</strong> từ vựng đời sống</span>
            <span className="highlight-dot">•</span>
            <span className="highlight-item">🎧 Phát âm bản xứ chuẩn</span>
            <span className="highlight-dot">•</span>
            <span className="highlight-item">🃏 Flashcard 3D thông minh</span>
          </div>
        </div>

        <div className="hero-stage" aria-label="Ni Ni">
          <div className="hero-stage-glow" aria-hidden="true" />
          <Mascot3D className="hero-mascot" zoom={7.6} />
          <span className="stage-chip stage-chip-a">🔥 Giữ streak mỗi ngày</span>
          <span className="stage-chip stage-chip-b">⭐ Nhận XP khi học</span>
          <span className="stage-chip stage-chip-c">🏅 Mở huy hiệu mới</span>
          <p className="stage-hint">Bấm vào Ni Ni để chào bạn</p>
        </div>
      </div>

      <div className="container hero-today">
        <div className="hero-showcase-card">
          <div className="mascot-floating-header">
            <div>
              <Trans k="directionBadge" as="span" className="badge badge-jade">🌱 Mỗi ngày một từ mới</Trans>
              <Trans k="dailySpotlightTitle" as="h3" style={{ marginTop: 4 }}>Từ vựng hôm nay</Trans>
            </div>
          </div>
          <SpotlightCard items={items} />
          <ProgressSummary total={items.length} />
        </div>
      </div>
    </section>
  );
}
