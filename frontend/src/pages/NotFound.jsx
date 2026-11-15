import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';

export default function NotFound() {
  return (
    <section className="section-block">
      <div className="container">
        <EmptyState icon="🧭" title="404 — Không tìm thấy trang / 页面不存在">
          <div style={{ marginTop: 16 }}><Button to="/">← Về trang chủ</Button></div>
        </EmptyState>
      </div>
    </section>
  );
}
