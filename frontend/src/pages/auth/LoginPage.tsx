import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, Wrench, Globe, Sparkles } from 'lucide-react';
import { useAuth, UserMode } from '../../context/AuthContext';
import { authApi } from '../../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchMode } = useAuth();

  const [form, setForm] = useState({ email: '', password: '', rememberMe: true });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Post-login mode selection modal state for users with BOTH capabilities
  const [showBothModal, setShowBothModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login({ email: form.email, password: form.password });
      login(res);

      const caps = res.user?.capabilities || [];
      const hasBoth = caps.includes('client') && caps.includes('freelancer');

      if (hasBoth) {
        setLoggedInUser(res.user);
        setShowBothModal(true);
      } else {
        const destMode: UserMode = caps.includes('freelancer') ? 'freelancer' : 'client';
        switchMode(destMode);
        navigate('/dashboard');
      }
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChooseMode = async (mode: UserMode) => {
    try {
      await authApi.switchMode(mode);
      switchMode(mode);
      if (mode === 'both') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (e) {
      switchMode(mode);
      navigate('/dashboard');
    }
  };

  const fillDemo = (email: string) => setForm({ ...form, email, password: email.includes('admin') ? 'Admin@1234' : 'Demo@1234' });

  return (
    <div className="auth-layout" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Panel */}
      <div className="auth-side" style={{ flex: '0 0 380px', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)' }}>
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="brand-logo-interactive" onClick={() => navigate('/')} style={{ marginBottom: '3rem' }}>
            <div className="brand-logo-icon">
              <Zap size={22} color="white" />
            </div>
            <div>
              <div className="brand-logo-title">THE MARKETPLACE</div>
              <div className="brand-logo-sub">EVERY OPPORTUNITY</div>
            </div>
          </div>

          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Welcome<br />
            <span className="gradient-text">Back</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Every Skill. Every Task.<br />Every Idea. Every Opportunity.
          </p>

          {/* Demo Accounts */}
          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Quick Demo Accounts
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: '💼 Client Only', email: 'client@demo.com' },
                { label: '💻 Freelancer Only', email: 'rahul@demo.com' },
                { label: '🛡 Admin', email: 'admin@marketplace.com' }
              ].map(d => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => fillDemo(d.email)}
                  style={{ padding: '0.55rem 0.875rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                >
                  {d.label} — <span style={{ opacity: 0.65 }}>{d.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Login Form / Modal Container */}
      <div className="auth-main" style={{ flex: 1, padding: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* POST-LOGIN MODAL FOR USERS WITH BOTH CAPABILITIES */}
          {showBothModal ? (
            <div style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-brand)', boxShadow: 'var(--glow-purple)', textAlign: 'center' }}>
              <div style={{ width: 54, height: 54, borderRadius: '16px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Sparkles size={28} color="white" />
              </div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>WELCOME BACK</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                How would you like to continue today?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <button
                  onClick={() => handleChooseMode('client')}
                  style={{
                    padding: '0.9rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(79,70,229,0.1) 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <Briefcase size={18} color="#a78bfa" /> CONTINUE AS CLIENT
                </button>

                <button
                  onClick={() => handleChooseMode('freelancer')}
                  style={{
                    padding: '0.9rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'linear-gradient(135deg, rgba(14,165,233,0.2) 0%, rgba(99,102,241,0.1) 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <Wrench size={18} color="#60a5fa" /> CONTINUE AS FREELANCER
                </button>

                <button
                  onClick={() => handleChooseMode('both')}
                  style={{
                    padding: '0.9rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <Globe size={18} color="#fbbf24" /> OPEN MARKETPLACE
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.85rem', marginBottom: '0.375rem' }}>Sign In</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  New here?{' '}
                  <Link to="/auth/register" style={{ color: '#a78bfa', fontWeight: 600 }}>Create account</Link>
                </p>
              </div>

              {error && (
                <div style={{ padding: '0.875rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <div className="input-icon-wrap">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="input-label">Password</label>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email'); }} style={{ fontSize: '0.75rem', color: '#a78bfa' }}>
                      Forgot Password?
                    </a>
                  </div>
                  <div className="input-icon-wrap">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={e => setForm({ ...form, rememberMe: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: '#7c3aed' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Remember me on this device</span>
                </label>

                <button
                  type="submit"
                  className="btn-hero-primary"
                  disabled={loading}
                  style={{ padding: '0.85rem', fontSize: '0.95rem', justifyContent: 'center', width: '100%', marginTop: '0.5rem' }}
                >
                  {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
