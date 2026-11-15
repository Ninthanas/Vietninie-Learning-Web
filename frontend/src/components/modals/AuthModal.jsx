import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

const labelStyle = { fontSize: '0.84rem', fontWeight: 700, display: 'block', marginBottom: 5 };

export default function AuthModal() {
  const { modal, closeAuthModal, setAuthMode, submitAuth } = useAuth();
  const { isVi } = useLanguage();
  const [form, setForm] = useState({ username: '', password: '', displayName: '' });
  const [error, setError] = useState('');
  const isLogin = modal.mode === 'login';

  useEffect(() => setError(''), [modal.mode, modal.open]);
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const username = form.username.trim();
    if (username.length < 3 || form.password.length < 6) {
      setError(isVi ? 'Tên đăng nhập cần từ 3 ký tự và mật khẩu từ 6 ký tự trở lên!' : '用户名至少3位，密码至少6位！');
      return;
    }
    try {
      await submitAuth({ mode: modal.mode, username, password: form.password, displayName: form.displayName.trim() });
      setForm({ username: '', password: '', displayName: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const heading = isLogin ? (isVi ? '🔐 Đăng nhập Hệ thống' : '🔐 登录学习账户') : isVi ? '✨ Đăng ký Tài khoản mới' : '✨ 注册新学习账户';
  const toggle = isLogin
    ? isVi ? 'Chưa có tài khoản? Đăng ký ngay →' : '还没有账号？立即注册 →'
    : isVi ? 'Đã có tài khoản? Đăng nhập ngay →' : '已有账号？直接登录 →';

  return (
    <Modal
      open={modal.open}
      onClose={closeAuthModal}
      maxWidth={430}
      headerStyle={{ marginBottom: 18 }}
      header={<h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{heading}</h2>}
    >
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!isLogin && (
          <div>
            <label style={labelStyle}>{isVi ? 'Tên hiển thị (Biệt danh)' : '显示昵称 (选填)'}</label>
            <input type="text" className="unified-input" value={form.displayName} onChange={set('displayName')} placeholder={isVi ? 'VD: Minh Anh / 小明' : '例如：小明'} />
          </div>
        )}
        <div>
          <label style={labelStyle}>{isVi ? 'Tên đăng nhập (3–20 ký tự)' : '用户名 (3-20位字母或数字)'}</label>
          <input type="text" className="unified-input" value={form.username} onChange={set('username')} placeholder="hocvien01" required />
        </div>
        <div>
          <label style={labelStyle}>{isVi ? 'Mật khẩu (tối thiểu 6 ký tự)' : '密码 (至少6位)'}</label>
          <input type="password" className="unified-input" value={form.password} onChange={set('password')} placeholder="••••••" required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 13, marginTop: 4, fontSize: '0.96rem' }}>
          {isLogin ? (isVi ? 'Đăng nhập ngay 🚀' : '立即登录 🚀') : isVi ? 'Tạo tài khoản & Học ngay 🎉' : '完成注册并开始 🎉'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: '#FEE2E2', color: '#DC2626', fontSize: '0.86rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
        <button
          type="button"
          onClick={() => setAuthMode(isLogin ? 'register' : 'login')}
          style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
        >
          {toggle}
        </button>
      </div>
    </Modal>
  );
}
