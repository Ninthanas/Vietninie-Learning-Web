import Trans from './Trans';

/** "🇻🇳 Người Việt học Tiếng Trung 🇨🇳" badge shown on top of every page title. */
export default function DirectionBadge({ variant = 'rose' }) {
  return (
    <Trans k="directionBadge" className={`badge badge-${variant}`}>
      🇻🇳 Người Việt học Tiếng Trung 🇨🇳
    </Trans>
  );
}
