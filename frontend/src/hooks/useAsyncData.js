import { useEffect, useState } from 'react';

/** Run an async loader whenever `deps` change; returns { data, loading }. */
export function useAsyncData(loader, deps = [], initial = null) {
  const [state, setState] = useState({ data: initial, loading: true });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    Promise.resolve(loader()).then((data) => alive && setState({ data, loading: false }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
