import { translations } from '../../i18n/translations';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Replacement for the legacy `data-i18n="key"` attribute.
 * Renders the dictionary entry (may contain trusted HTML such as <span class="highlight">),
 * or falls back to `children` when the key does not exist for the current UI language.
 */
export default function Trans({ k, as: Tag = 'span', children, ...rest }) {
  const { nativeLang, t } = useLanguage();
  if (!translations[nativeLang]?.[k]) return <Tag {...rest}>{children}</Tag>;
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: t(k) }} />;
}
