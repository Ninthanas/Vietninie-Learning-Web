import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../hooks/useToast';
import { useVocabulary } from '../../hooks/useVocabulary';
import { resetProgress } from '../../services/storage';

export default function PreferencesCard() {
  const { isLearningZh, learningLang, setNativeLang } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { items } = useVocabulary();

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentruc-vocabulary-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  const reset = () => {
    resetProgress(learningLang);
    showToast('🗑️ Đã đặt lại tiến độ học của hướng hiện tại!');
  };

  const label = { fontWeight: 700, display: 'block', marginBottom: 8 };
  return (
    <div className="card">
      <h3 style={{ marginBottom: 16 }}>⚙️ {isLearningZh ? 'Cài đặt Ngôn ngữ & Giao diện' : '语言方向与界面设置'}</h3>

      <div style={{ marginBottom: 18 }}>
        <label style={label}>{isLearningZh ? 'Hướng học hiện tại:' : '当前学习方向：'}</label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant={isLearningZh ? 'primary' : 'outline'} onClick={() => setNativeLang('vi')}>🇻🇳 Người Việt → Học Tiếng Trung</Button>
          <Button variant={!isLearningZh ? 'primary' : 'outline'} onClick={() => setNativeLang('zh')}>🇨🇳 我是中国人 → 学习越南语</Button>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={label}>{isLearningZh ? 'Chế độ giao diện (Light / Dark Mode):' : '主题外观模式：'}</label>
        <Button variant="outline" onClick={toggleTheme}>{isDark ? '☀️ Chuyển sang Light Mode' : '🌙 Chuyển sang Dark Mode'}</Button>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 18, marginTop: 18 }}>
        <h4 style={{ marginBottom: 10 }}>💾 {isLearningZh ? 'Sao lưu & Đặt lại Tiến độ' : '数据导出与重置'}</h4>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button size="sm" variant="outline" onClick={exportJson}>📥 {isLearningZh ? 'Xuất JSON Từ vựng' : '导出 JSON 词库'}</Button>
          <Button size="sm" variant="outline" onClick={reset}>🗑️ {isLearningZh ? 'Xóa tiến độ học' : '重置学习记录'}</Button>
        </div>
      </div>
    </div>
  );
}
