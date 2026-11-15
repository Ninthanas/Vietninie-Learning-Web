import { useCallback, useState } from 'react';

/** useState backed by a localStorage string key (e.g. selected quiz level). */
export function usePersistentState(storageKey, fallback) {
  const [value, setValue] = useState(() => localStorage.getItem(storageKey) || fallback);
  const set = useCallback(
    (next) => {
      setValue(next);
      localStorage.setItem(storageKey, next);
    },
    [storageKey]
  );
  return [value, set];
}
