import { useLanguage } from '../../hooks/useLanguage';
import { formatScript, getScriptPair } from '../../services/chineseScript';
import Badge from './Badge';

/** Chinese text rendered according to the 简 / 繁 / 简+繁 switch. */
export default function ScriptText({ text }) {
  const { scriptMode } = useLanguage();
  const { main, trad } = formatScript(text, scriptMode);
  return (
    <>
      {main}
      {trad && (
        <>
          {' '}
          <span style={{ fontWeight: 600, color: 'var(--brand-indigo)', fontSize: '0.86em' }}>(繁: {trad})</span>
        </>
      )}
    </>
  );
}

/** Badge telling whether a word is written differently in Traditional characters. */
export function TradBadge({ word, prefix = '🇹🇼 繁: ', sameLabel = '简·繁 chung', sameTitle = 'Chữ Giản thể và Phồn thể viết giống nhau' }) {
  const sp = getScriptPair(word);
  if (sp.differs) {
    return (
      <Badge variant="gold" title="Chữ Phồn thể dùng tại Đài Loan / Hồng Kông">
        {prefix}
        {sp.trad}
      </Badge>
    );
  }
  return sameLabel ? (
    <Badge variant="jade" title={sameTitle}>
      {sameLabel}
    </Badge>
  ) : null;
}
