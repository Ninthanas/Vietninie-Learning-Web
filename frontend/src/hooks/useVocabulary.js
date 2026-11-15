import { useEffect, useMemo, useState } from 'react';
import { getBaseVocabulary } from '../services/dataService';
import { getCustomVocabulary } from '../services/storage';
import { useLanguage } from './useLanguage';
import { useStorageVersion } from './useProgress';

/** Active vocabulary (admin-added words first, then the dataset of the current learning direction). */
export function useVocabulary() {
  const { learningLang } = useLanguage();
  const version = useStorageVersion();
  const [base, setBase] = useState(null);

  useEffect(() => {
    let alive = true;
    setBase(null);
    getBaseVocabulary(learningLang).then((d) => alive && setBase(d));
    return () => {
      alive = false;
    };
  }, [learningLang]);

  const items = useMemo(() => {
    if (!base) return [];
    return [...getCustomVocabulary(learningLang), ...base];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, learningLang, version]);

  return { items, loading: base === null };
}
