import { useState } from 'react';
import Trans from '../common/Trans';
import { useUI } from '../../hooks/useUI';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import { setPref } from '../../services/storage';
import { LogoMark } from '../mascot/Logo';

const LEVELS = [
  { id: 'beginner', key: 'lvlBeginner', label: '🌱 Mới bắt đầu (A1 / HSK 1)' },
  { id: 'elementary', key: 'lvlElementary', label: '🌿 Cơ bản (A2 / HSK 2)' },
  { id: 'intermediate', key: 'lvlIntermediate', label: '🌳 Trung cấp (B1-B2 / HSK 3-4)' },
  { id: 'advanced', key: 'lvlAdvanced', label: '🎋 Nâng cao (C1-C2 / HSK 5-6)' }
];

/** First-visit popup: choose the native language (= learning direction) and a rough level. */
export default function OnboardingModal() {
  const { onboardingOpen, closeOnboarding, openPlacement } = useUI();
  const { nativeLang, setNativeLang } = useLanguage();
  const { showToast } = useToast();
  const [level, setLevel] = useState(() => localStorage.getItem('sentruc_user_level') || 'beginner');

  const pickLevel = (id) => {
    setLevel(id);
    setPref('sentruc_user_level', id);
  };

  const confirm = () => {
    closeOnboarding();
    showToast(nativeLang === 'vi' ? '🇻🇳 Đã thiết lập: Giao diện Tiếng Việt → Học Tiếng Trung!' : '🇨🇳 已设置：中文界面 → 学习越南语！');
  };

  return (
    <div
      id="onboardingBackdrop"
      className={`modal-backdrop ${onboardingOpen ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboardModalTitle"
      onClick={(e) => e.target === e.currentTarget && closeOnboarding()}
    >
      <div className="onboarding-modal">
        <button
          type="button"
          title="Đóng"
          onClick={closeOnboarding}
          style={{
            position: 'absolute', top: 14, right: 16, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
            width: 34, height: 34, borderRadius: '50%', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer',
            color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          ✕
        </button>
        <LogoMark size={88} />
        <Trans k="onboardTitle" as="h2" id="onboardModalTitle" style={{ fontSize: '1.35rem' }}>
          Chào mừng bạn đến với Vietninie (越学越辣)! 🌶️
        </Trans>
        <Trans k="onboardSubtitle" as="p" style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
          Hãy chọn ngôn ngữ mẹ đẻ của bạn để hệ thống thiết lập chương trình học:
        </Trans>

        <div className="onboarding-grid">
          <div className={`onboarding-card ${nativeLang === 'vi' ? 'selected' : ''}`} tabIndex={0} onClick={() => setNativeLang('vi')}>
            <span className="flag">🇻🇳</span>
            <h3>Tôi là người Việt Nam</h3>
            <p>Giao diện Tiếng Việt<br /><strong>Học Tiếng Trung 🇨🇳 (HSK 1–6)</strong></p>
          </div>
          <div className={`onboarding-card ${nativeLang === 'zh' ? 'selected' : ''}`} tabIndex={0} onClick={() => setNativeLang('zh')}>
            <span className="flag">🇨🇳</span>
            <h3>我是中国人</h3>
            <p>中文界面<br /><strong>学习越南语 🇻🇳 (A1–C2 词汇)</strong></p>
          </div>
        </div>

        <Trans k="onboardLevelTitle" as="h4" style={{ marginTop: 16 }}>Bạn đang ở trình độ nào? / 您目前的水平是？</Trans>
        <div className="level-grid">
          {LEVELS.map((l) => (
            <Trans key={l.id} k={l.key} as="button" type="button" className={`level-btn ${level === l.id ? 'selected' : ''}`} onClick={() => pickLevel(l.id)}>
              {l.label}
            </Trans>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <Trans k="onboardConfirm" as="button" type="button" className="btn btn-primary" style={{ flex: 2, padding: 14, fontSize: '0.96rem' }} onClick={confirm}>
            Hoàn tất & Bắt đầu học 🚀
          </Trans>
          <button
            type="button"
            className="btn btn-outline"
            style={{ flex: 1, padding: 14, fontSize: '0.92rem' }}
            onClick={() => {
              closeOnboarding();
              openPlacement();
            }}
          >
            🎯 Làm bài Test đầu vào
          </button>
        </div>
      </div>
    </div>
  );
}
