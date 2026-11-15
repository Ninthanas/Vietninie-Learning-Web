import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';
import { useUI } from '../../hooks/useUI';
import { useStorageVersion } from '../../hooks/useProgress';
import { getPref } from '../../services/storage';

export default function PlacementCard() {
  const { isLearningZh } = useLanguage();
  const { openPlacement } = useUI();
  useStorageVersion(); // re-read the level after the test saves it
  return (
    <div className="card" style={{ padding: 26 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3>🧭 {isLearningZh ? 'Đánh Giá Năng Lực Đầu Vào' : '语言水平定级测试'}</h3>
        <Button size="sm" variant="outline" onClick={openPlacement}>🎯 {isLearningZh ? 'Làm bài Test' : '重新测评'}</Button>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 16 }}>
        {isLearningZh
          ? 'Kiểm tra trình độ thực tế từ A1 đến C2 (hoặc HSK 1–6) để hệ thống gợi ý bài học phù hợp nhất.'
          : '通过分级测试精准评估您的当前水平（A1–C2），自动匹配最适合您的课程。'}
      </p>
      <div style={{ padding: 18, borderRadius: 14, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{isLearningZh ? 'Trình độ hiện tại của bạn:' : '您当前的评定等级：'}</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--brand-primary)' }}>{getPref('sentruc_placement_level', 'A1 / HSK 1')}</div>
        </div>
        <Button onClick={openPlacement}>🚀 {isLearningZh ? 'Kiểm tra ngay' : '立即定级'}</Button>
      </div>
    </div>
  );
}
