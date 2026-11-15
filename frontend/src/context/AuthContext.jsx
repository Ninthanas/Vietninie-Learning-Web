import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authenticate, syncProgress, verifyToken } from '../services/api';
import { exportProgress, importProgress } from '../services/storage';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';

export const AuthContext = createContext(null);

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('vn_auth_user') || 'null');
  } catch {
    return null;
  }
};

/** Merge the local learned / favorites / SRS state into the account (both directions) and adopt the result. */
async function mergeProgress(token) {
  for (const dir of ['zh', 'vi']) {
    const merged = await syncProgress(token, dir, exportProgress(dir));
    if (merged) importProgress(dir, merged);
  }
}

export function AuthProvider({ children }) {
  const { isVi } = useLanguage();
  const { showToast } = useToast();
  const [token, setToken] = useState(() => localStorage.getItem('vn_auth_token'));
  const [user, setUser] = useState(readUser);
  const [modal, setModal] = useState({ open: false, mode: 'login' });

  // Re-validate an existing session against the local backend (no-op when offline / deployed).
  useEffect(() => {
    if (!token) return;
    verifyToken(token).then((data) => {
      if (data) {
        setUser(data);
        localStorage.setItem('vn_auth_user', JSON.stringify(data));
        mergeProgress(token);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAuthModal = useCallback((mode = 'login') => setModal({ open: true, mode }), []);
  const closeAuthModal = useCallback(() => setModal((m) => ({ ...m, open: false })), []);
  const setAuthMode = useCallback((mode) => setModal((m) => ({ ...m, mode })), []);

  /** Throws Error{handled:true} with a user-facing message on validation / credential errors. */
  const submitAuth = useCallback(
    async ({ mode, username, password, displayName }) => {
      const result = await authenticate({ mode, username, password, displayName: displayName || username, isVi });
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem('vn_auth_token', result.token);
      localStorage.setItem('vn_auth_user', JSON.stringify(result.user));
      closeAuthModal();
      if (result.source === 'api') mergeProgress(result.token);
      const name = result.user.display_name;
      if (result.source === 'turso') {
        showToast(isVi ? `☁️ Đã kết nối Turso Cloud DB: Chào mừng ${name}!` : `☁️ 已同步至 Turso 云端数据库：欢迎 ${name}！`);
      } else if (result.source === 'api') {
        showToast(isVi ? `🎉 Chào mừng ${name} đã đăng nhập!` : `🎉 欢迎回来，${name}！`);
      } else {
        showToast(isVi ? `✅ Đã đăng nhập tài khoản: ${name}!` : `✅ 已登录账户：${name}！`);
      }
    },
    [isVi, showToast, closeAuthModal]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vn_auth_token');
    localStorage.removeItem('vn_auth_user');
    showToast(isVi ? '👋 Đã đăng xuất tài khoản thành công!' : '👋 已安全退出登录！');
  }, [isVi, showToast]);

  const value = useMemo(
    () => ({ token, user, isLoggedIn: Boolean(token && user), modal, openAuthModal, closeAuthModal, setAuthMode, submitAuth, logout }),
    [token, user, modal, openAuthModal, closeAuthModal, setAuthMode, submitAuth, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
