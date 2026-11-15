import { useLanguage } from '../../hooks/useLanguage';
import SpeakButton from '../common/SpeakButton';
import ScriptText from '../common/ScriptText';
import Badge from '../common/Badge';

function ScriptComparison({ insight, isLearningZh }) {
  const { word, scriptPair } = insight;
  if (isLearningZh) {
    return scriptPair.differs ? (
      <>
        🇨🇳 Đại Lục viết Giản thể là <strong>{scriptPair.simp}</strong> • 🇹🇼 Đài Loan / Hồng Kông viết Phồn thể là{' '}
        <strong>{scriptPair.trad}</strong>.
      </>
    ) : (
      <>Chữ này ở cả 🇨🇳 Đại Lục (简体) và 🇹🇼 Đài Loan (繁體) đều viết giống nhau.</>
    );
  }
  return (
    <>
      Việt ⇄ Trung: <strong>"{word}"</strong> ⇄ <strong>“{scriptPair.simp}”</strong> (🇹🇼 繁體: <strong>{scriptPair.trad}</strong>).
    </>
  );
}

/** 🧬 / 📘 / 🔥 / 💡 rows built from `usage_note` (HTML comes from our own dataset). */
export function InsightLines({ lines }) {
  return (
    <>
      {lines.map((line, i) =>
        line.icon ? (
          <div
            key={i}
            className="insight-row"
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 8, padding: '10px 14px',
              background: 'var(--bg-primary)', borderRadius: 12, border: '1px solid var(--border-color)',
              fontSize: '0.92rem', lineHeight: 1.6
            }}
          >
            <span style={{ fontSize: '1.25rem', flexShrink: 0, lineHeight: 1.2 }}>{line.icon}</span>
            <div style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: line.html }} />
          </div>
        ) : (
          <div key={i} style={{ marginTop: 6, lineHeight: 1.6, fontSize: '0.92rem' }} dangerouslySetInnerHTML={{ __html: line.html }} />
        )
      )}
    </>
  );
}

/**
 * Sections "1. Giải mã chữ" + "2. Đoạn chat thực chiến".
 * variant="modal" (compact popup) | "page" (vocabulary detail page).
 */
export default function InsightSections({ insight, variant = 'modal' }) {
  const { isLearningZh } = useLanguage();
  const page = variant === 'page';

  return (
    <>
      <div
        style={{
          background: 'var(--brand-primary-soft)',
          borderLeft: `${page ? 5 : 4}px solid var(--brand-primary)`,
          padding: page ? '18px 20px' : '16px 18px',
          borderRadius: 14,
          marginBottom: page ? 20 : 16
        }}
      >
        {page ? (
          <h3 style={{ color: 'var(--brand-primary)', marginBottom: 8 }}>🧬 1. Giải mã chữ & Gốc từ</h3>
        ) : (
          <div style={{ fontWeight: 800, color: 'var(--brand-primary)', fontSize: '1rem', marginBottom: 6 }}>🧬 1. Giải mã chữ & Đời thực</div>
        )}
        <div style={{ fontSize: page ? '0.95rem' : '0.92rem', color: 'var(--text-secondary)', marginBottom: page ? 8 : 6 }}>
          <ScriptComparison insight={insight} isLearningZh={isLearningZh} />
        </div>
        <InsightLines lines={insight.noteLines} />
      </div>

      <div style={page ? undefined : { background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '16px 18px', borderRadius: 14 }}>
        {page ? (
          <h3 style={{ marginBottom: 12 }}>💬 2. Đoạn Chat Thực Chiến (WeChat / LINE / Zalo)</h3>
        ) : (
          <div style={{ fontWeight: 800, marginBottom: 12, fontSize: '1rem' }}>💬 2. Đoạn Chat Thực Chiến (WeChat / LINE / Zalo)</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: page ? 12 : 10, marginBottom: page ? 22 : 0 }}>
          {insight.miniDialogue.map((line, i) => (
            <div
              key={i}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: page ? 12 : 10,
                background: page ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                padding: page ? '14px 18px' : '10px 14px', borderRadius: page ? 14 : 12, border: '1px solid var(--border-color)'
              }}
            >
              <div>
                {page ? (
                  <Badge variant="rose" style={{ marginBottom: 4 }}>{line.speaker}</Badge>
                ) : (
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{line.speaker}</span>
                )}
                <div style={{ fontWeight: 800, fontSize: page ? '1.08rem' : '0.98rem', marginTop: page ? 4 : 2 }}>
                  <ScriptText text={line.target} />
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: page ? '0.92rem' : '0.84rem' }}>{line.sub}</div>
              </div>
              <SpeakButton text={line.target} lang={line.lang} className={`btn btn-sm ${page ? 'btn-primary' : 'btn-outline'}`}>
                🔊{page ? ' Nghe' : ''}
              </SpeakButton>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
