'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAdminAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulated login for now - real API will be used in production
    setTimeout(() => {
      setAuth({ id: 'admin-1', email, role: 'SUPER_ADMIN' }, 'dummy-admin-token');
      router.push('/dashboard');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="login-page">
      <div className="login-card-wrapper">
        <div className="login-header">
           <div className="admin-logo">
             <ShieldCheck size={32} />
           </div>
           <h1>SemtAğı Admin</h1>
           <p>Yönetim paneline erişmek için giriş yapın.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form card">
          <div className="input-group">
            <label>E-posta Adresi</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input 
                type="email" 
                placeholder="admin@semtagi.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Şifre</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Giriş Yap'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 SemtAğı Yönetim Sistemi</p>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--admin-primary);
          padding: 2rem;
        }

        .login-card-wrapper {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .login-header {
          text-align: center;
          color: white;
        }

        .admin-logo {
          width: 64px;
          height: 64px;
          background: var(--admin-accent);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
        }

        .login-header h1 { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; }
        .login-header p { color: var(--text-light); opacity: 0.7; font-size: 0.9375rem; }

        .login-form {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-group label { font-size: 0.875rem; font-weight: 700; color: var(--admin-primary); }
        
        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          color: var(--text-light);
        }

        .input-wrapper input {
          border: none;
          background: none;
          outline: none;
          width: 100%;
          font-size: 0.9375rem;
          color: var(--admin-primary);
        }

        .login-btn { width: 100%; height: 3rem; margin-top: 0.5rem; font-size: 1rem; }

        .login-footer {
          text-align: center;
          color: var(--text-light);
          opacity: 0.5;
          font-size: 0.75rem;
        }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
