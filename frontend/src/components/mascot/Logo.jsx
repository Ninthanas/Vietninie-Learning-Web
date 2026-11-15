// Vietninie logo: mascot face + wordmark. Pure SVG, scales crisply (replaces the heavy base64 logo).
export function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d="M14 40 Q10 14 30 10 Q40 14 44 26Z" fill="#B81D1D" />
      <path d="M86 40 Q90 14 70 10 Q60 14 56 26Z" fill="#B81D1D" />
      <path d="M20 34 Q19 20 29 17 Q35 20 37 27Z" fill="#FADADD" />
      <path d="M80 34 Q81 20 71 17 Q65 20 63 27Z" fill="#FADADD" />
      <ellipse cx="50" cy="58" rx="40" ry="36" fill="#E62E2D" />
      <ellipse cx="33" cy="58" rx="19" ry="17" fill="#FADADD" />
      <ellipse cx="67" cy="58" rx="19" ry="17" fill="#FADADD" />
      <ellipse cx="50" cy="62" rx="14" ry="12" fill="#FADADD" />
      <ellipse cx="34" cy="56" rx="11" ry="13" fill="#1A0B0B" />
      <ellipse cx="66" cy="56" rx="11" ry="13" fill="#1A0B0B" />
      <circle cx="30" cy="50" r="4.2" fill="#fff" />
      <circle cx="62" cy="50" r="4.2" fill="#fff" />
      <circle cx="38" cy="61" r="2" fill="#fff" />
      <circle cx="70" cy="61" r="2" fill="#fff" />
      <path d="M46 70 L54 70 L50 75Z" fill="#7A1520" />
      <path d="M43 79 Q46.5 84 50 79 Q53.5 84 57 79" fill="none" stroke="#1A0B0B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ size = 40, showText = true }) {
  return (
    <span className="brand-logo">
      <LogoMark size={size} />
      {showText && (
        <span className="brand-logo-text">
          <span className="brand-logo-name">Vietninie</span>
          <span className="brand-logo-zh">越学越辣</span>
        </span>
      )}
    </span>
  );
}
