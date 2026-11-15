import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';
import { toTraditional } from '../services/chineseScript';

export const LanguageContext = createContext(null);

const SCRIPT_ORDER = ['simplified', 'traditional', 'both'];

/**
 * nativeLang  : 'vi' (Vietnamese UI -> learns Chinese) | 'zh' (Chinese UI -> learns Vietnamese)
 * learningLang: derived, 'zh' | 'vi'   (used as the storage / dataset key)
 * scriptMode  : 'simplified' | 'traditional' | 'both'
 */
export function LanguageProvider({ children }) {
  const [nativeLang, setNativeLangState] = useState(() => (localStorage.getItem('sentruc_native_lang') === 'zh' ? 'zh' : 'vi'));
  const [scriptMode, setScriptModeState] = useState(() => {
    const saved = localStorage.getItem('vietninie_zh_script');
    return SCRIPT_ORDER.includes(saved) ? saved : 'both';
  });

  useEffect(() => {
    document.documentElement.lang = nativeLang;
    localStorage.setItem('sentruc_native_lang', nativeLang);
  }, [nativeLang]);

  useEffect(() => {
    localStorage.setItem('vietninie_zh_script', scriptMode);
  }, [scriptMode]);

  const setNativeLang = useCallback((lang) => setNativeLangState(lang === 'zh' ? 'zh' : 'vi'), []);
  const toggleLanguage = useCallback(() => setNativeLangState((l) => (l === 'vi' ? 'zh' : 'vi')), []);
  const setScriptMode = useCallback((mode) => setScriptModeState(SCRIPT_ORDER.includes(mode) ? mode : 'both'), []);
  const cycleScriptMode = useCallback(() => {
    const next = SCRIPT_ORDER[(SCRIPT_ORDER.indexOf(scriptMode) + 1) % SCRIPT_ORDER.length];
    setScriptModeState(next);
    return next;
  }, [scriptMode]);

  const t = useCallback(
    (key, fallback = '') => {
      let val = (translations[nativeLang] && translations[nativeLang][key]) || fallback || key;
      if (nativeLang === 'zh' && scriptMode === 'traditional') val = toTraditional(val);
      return val;
    },
    [nativeLang, scriptMode]
  );

  const value = useMemo(() => {
    const learningLang = nativeLang === 'vi' ? 'zh' : 'vi';
    return {
      nativeLang,
      learningLang,
      isVi: nativeLang === 'vi',
      isLearningZh: learningLang === 'zh',
      speechLang: learningLang === 'zh' ? 'zh-CN' : 'vi-VN',
      setNativeLang,
      toggleLanguage,
      scriptMode,
      setScriptMode,
      cycleScriptMode,
      t,
      /** Convenience: pick Vietnamese or Chinese copy by UI language. */
      pick: (vi, zh) => (nativeLang === 'vi' ? vi : zh)
    };
  }, [nativeLang, scriptMode, setNativeLang, toggleLanguage, setScriptMode, cycleScriptMode, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
