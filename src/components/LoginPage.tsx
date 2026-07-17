import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import type { MitraKerjasama } from '../data/mockData';

// Admin credentials fallback
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'sumba2025';

interface LoginPageProps {
  onLogin: () => void;
  onMitraLogin: (mitraId: string) => void;
  mitra: MitraKerjasama[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onBackToPublic: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLogin, onMitraLogin, mitra, theme, toggleTheme, onBackToPublic 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const lowerUser = username.trim().toLowerCase();

    // 1. Check Admin
    if (lowerUser === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem('admin_auth', 'true');
      onLogin();
      setIsLoading(false);
      return;
    }

    // 2. Check Mitra Partner Logins
    const foundMitra = mitra.find(m => 
      m.username_login && 
      m.username_login.trim().toLowerCase() === lowerUser && 
      m.password_login === password
    );

    if (foundMitra) {
      sessionStorage.setItem('mitra_auth', 'true');
      sessionStorage.setItem('mitra_id', foundMitra.id);
      onMitraLogin(foundMitra.id);
    } else {
      setError('Username atau password tidak terdaftar. Silakan hubungi Admin Poltekkes Kupang.');
    }
    setIsLoading(false);
  };

  return (
    <div className="login-page">
      {/* Animated background blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div className="login-card glass">
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="login-icon">🏥</div>
          <div>
            <h1 className="login-title">Portal Login</h1>
            <p className="login-subtitle font-bold text-[10px]">Tracer Study & Kemitraan Sumba</p>
          </div>
        </div>

        <div className="login-divider">
          <span>Poltekkes Kemenkes Kupang Prodi D3 Keperawatan Waikabubak</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Username</label>
            <div className="login-input-wrap">
              <User size={16} className="login-input-icon" />
              <input
                type="text"
                className="login-input"
                placeholder="Masukkan username Anda"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <Lock size={16} className="login-input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                className="login-input"
                placeholder="Masukkan password Anda"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error text-center">
              <AlertCircle size={14} className="inline mr-1" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2.5 pt-2">
            <button 
              type="button" 
              className="btn btn-outline text-xs flex-1 py-2.5 rounded-lg border-color text-muted hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={onBackToPublic}
            >
              Kembali Ke Depan
            </button>
            
            <button type="submit" className="login-submit-btn flex-1" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="login-spinner" />
                  Memverifikasi...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Shield size={16} />
                  Masuk Portal
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="login-hint text-center bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-color mt-4 text-[10px] space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-200">Kredensial Contoh:</p>
          <p className="text-muted">🔑 Admin: <span className="font-semibold text-slate-800 dark:text-slate-200">admin / sumba2025</span></p>
          <p className="text-muted">🏥 RSUD Waikabubak: <span className="font-semibold text-slate-800 dark:text-slate-200">rswaikabubak / mitra123</span></p>
          <p className="text-muted">🏥 RS Lindimara: <span className="font-semibold text-slate-800 dark:text-slate-200">rslindimara / mitra123</span></p>
        </div>

        {/* Copyright */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '16px', 
          fontSize: '11px', 
          color: 'rgba(100, 116, 139, 0.6)',
          fontWeight: 500
        }}>
          © 2026 by Masandigital.com
        </div>
      </div>

      {/* Theme toggle floating */}
      <button className="login-theme-btn" onClick={toggleTheme} title="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
};
