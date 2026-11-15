import Trans from '../components/common/Trans';
import PreferencesCard from '../components/settings/PreferencesCard';
import AdminVocabForm from '../components/settings/AdminVocabForm';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Settings() {
  useDocumentTitle('Vietninie • Cài đặt');
  return (
    <section className="section-block">
      <div className="container">
        <div className="section-header">
          <div>
            <Trans k="settings" as="h1" style={{ fontSize: '2rem', fontWeight: 800, marginTop: 6 }}>Cài Đặt Hệ Thống & Quản Trị Từ Vựng (Admin CMS)</Trans>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 24 }}>
          <PreferencesCard />
          <details className="admin-fold">
            <summary>Quản trị từ vựng (Admin CMS)</summary>
            <AdminVocabForm />
          </details>
        </div>
      </div>
    </section>
  );
}
