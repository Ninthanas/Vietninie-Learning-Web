import Trans from '../common/Trans';

const STEPS = [
  ['pathStep1', 'Giai đoạn 1: Nền tảng sinh hoạt (A1 / HSK 1-2)', 'Chào hỏi, số đếm, gọi món, mua sắm và 500 từ vựng cốt lõi.'],
  ['pathStep2', 'Giai đoạn 2: Du lịch & Đời sống (A2 / HSK 3)', 'Khách sạn, sân bay, hỏi đường, thuê nhà và các mẫu câu thông dụng.'],
  ['pathStep3', 'Giai đoạn 3: Công sở & Thương mại (B1-B2 / HSK 4-5)', 'Họp hành, ký hợp đồng, xuất nhập khẩu, thanh toán và đàm phán.'],
  ['pathStep4', 'Giai đoạn 4: Thành thạo bản xứ (C1-C2 / HSK 6)', 'Thành ngữ đời sống, tiếng lóng mạng xã hội và tư duy ngôn ngữ sâu.']
];

export default function LearningPath() {
  return (
    <section className="section-block">
      <div className="container">
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: 28 }}>
          <div>
            <Trans k="pathTitle" as="h2">Lộ trình học 4 giai đoạn tinh gọn</Trans>
            <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>Từng bước vững chắc từ con số 0 đến tự tin giao tiếp thành thạo</p>
          </div>
        </div>
        <div className="learning-path-grid">
          {STEPS.map(([key, title, desc], i) => (
            <div key={key} className="path-step-card">
              <div className="path-step-number">{i + 1}</div>
              <Trans k={key} as="h3">{title}</Trans>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
