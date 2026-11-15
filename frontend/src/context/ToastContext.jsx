import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', show: false });
  const timer = useRef(null);

  const showToast = useCallback((message) => {
    setToast({ message, show: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2800);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div id="sentrucToast" className={`toast-notification ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
    </ToastContext.Provider>
  );
}
