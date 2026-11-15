// ============================================================================
// CHINESE SCRIPT ENGINE — Simplified (简体) <-> Traditional (繁體), pure functions.
// The *mode* (simplified | traditional | both) lives in LanguageContext.
// ============================================================================
import { S2T_CHAR_MAP, TAIWAN_PHRASE_EQUIVALENTS } from '../i18n/zhMaps';

const PHRASE_FIXES = [
  ['牛肉面', '牛肉麵'], ['面条', '麵條'], ['泡面', '泡麵'], ['拉面', '拉麵'], ['方便面', '方便麵'],
  ['面包', '麵包'], ['面粉', '麵粉'], ['头发', '頭髮'], ['理发', '理髮'], ['干净', '乾淨'],
  ['干杯', '乾杯'], ['饼干', '餅乾'], ['干燥', '乾燥'], ['系统', '系統'], ['联系', '聯繫']
];

export function toTraditional(str = '') {
  if (!str) return '';
  let s = String(str);
  PHRASE_FIXES.forEach(([from, to]) => {
    s = s.split(from).join(to);
  });
  return Array.from(s).map((ch) => (ch === '面' ? '面' : S2T_CHAR_MAP[ch] || ch)).join('');
}

export function getScriptPair(str = '') {
  const simp = String(str || '');
  const trad = toTraditional(simp);
  return { simp, trad, differs: simp !== trad };
}

export function getTaiwanComparison(wordOrMeaning = '') {
  for (const [k, val] of Object.entries(TAIWAN_PHRASE_EQUIVALENTS)) {
    if (String(wordOrMeaning).includes(k)) return { mainland: k, ...val };
  }
  return null;
}

/**
 * Decide how a Chinese string should be displayed for the current script mode.
 * @returns {{ main: string, trad: string|null }}  trad != null => show "(繁: ...)" hint next to main.
 */
export function formatScript(str = '', mode = 'both') {
  if (!str) return { main: '', trad: null };
  if (mode === 'simplified') return { main: str, trad: null };
  const trad = toTraditional(str);
  if (mode === 'traditional') return { main: trad, trad: null };
  if (trad !== str && str.length <= 8) return { main: str, trad };
  return { main: str, trad: null };
}
