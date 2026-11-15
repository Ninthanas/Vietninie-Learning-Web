import SpecSpeak from './SpecSpeak';
import { useLanguage } from '../../hooks/useLanguage';

const ROLE_CLASSES = ['role-kaifa', 'role-faxing', 'role-yunying'];
const heading = { fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' };
const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 };

export default function CheatsheetView({ data }) {
  const { scriptMode } = useLanguage();
  const trad = scriptMode === 'traditional';
  const core = data.game_core_distinction;
  const phrases = data.pm_action_phrases || [];
  const tools = data.workplace_tools || [];

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6 }}>🛠️ Cẩm Nang Tra Cứu: Ngành Game, Quản Lý Dự Án & Công Cụ</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Được tổng hợp dành riêng cho các bạn làm việc trực tiếp với đối tác Trung Quốc, Game Studio, quản lý dự án và công nghệ.
        </p>
      </div>

      {core && (
        <div style={{ marginBottom: 36 }}>
          <div style={row}>
            <h3 style={heading}>🎮 1. Phân biệt 3 vị trí cốt lõi trong ngành Game</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{core.title_zh}</span>
          </div>
          <div className="game-distinction-grid">
            {(core.roles || []).map((role, i) => (
              <div key={i} className={`distinction-card ${ROLE_CLASSES[i] || ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="distinction-zh">
                    {trad && role.zh_tw ? role.zh_tw : role.zh}
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{role.pinyin}</span>
                  </div>
                  <SpecSpeak text={role.zh} />
                </div>
                <div className="distinction-vi">{role.role_vi}</div>
                <p className="distinction-desc">{role.desc_vi}</p>
                <div className="distinction-keywords">{(role.keywords || []).map((kw) => <span key={kw} className="kw-badge">{kw}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {phrases.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={row}>
            <h3 style={heading}>📋 2. Tám (8) Cụm Từ PM & Điều Phối Nên Dùng Được Ngay</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>项目日常高频短语</span>
          </div>
          <div className="pm-phrases-grid">
            {phrases.map((p, i) => (
              <div key={i} className="pm-phrase-card">
                <div>
                  <div className="pm-phrase-top">
                    <div className="pm-phrase-zh">{trad && p.zh_tw ? p.zh_tw : p.zh}</div>
                    <SpecSpeak text={p.zh} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--brand-secondary)', fontWeight: 700, marginBottom: 4 }}>{p.pinyin}</div>
                  <div className="pm-phrase-vi">{p.vi}</div>
                </div>
                <div className="pm-phrase-ctx">💡 {p.context_vi}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tools.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={row}>
            <h3 style={heading}>📁 3. Tên Các Công Cụ Văn Phòng & Phần Mềm Trong Tiếng Trung</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>常用办公与协作工具称谓</span>
          </div>
          <div className="spec-tools-table-wrap">
            <table className="spec-tools-table">
              <thead>
                <tr>
                  <th style={{ width: '18%' }}>Tên công cụ</th>
                  <th style={{ width: '28%' }}>Tiếng Trung & Pinyin</th>
                  <th style={{ width: '44%' }}>Ứng dụng thực tế trong công việc</th>
                  <th style={{ width: '10%', textAlign: 'center' }}>Âm thanh</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((t, i) => (
                  <tr key={i}>
                    <td><strong style={{ color: 'var(--brand-primary)', fontSize: '1rem' }}>{t.tool}</strong></td>
                    <td>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{trad && t.zh_tw ? t.zh_tw : t.zh}</div>
                      <small style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{t.pinyin}</small>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t.usage_vi}</td>
                    <td style={{ textAlign: 'center' }}><SpecSpeak text={t.zh.split('/')[1] ? t.zh.split('/')[1].trim() : t.zh} title="Nghe cách gọi" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
