import React, { useState, useEffect } from 'react';
import { Phone, ShieldCheck, X, CheckCircle2, Clock, Send } from 'lucide-react';
import { profileApi } from '../../services/api';

interface PhoneVerificationModalProps {
  initialPhone?: string;
  initialCountryCode?: string;
  onClose: () => void;
  onSuccess: (phone: string, countryCode: string) => void;
}

export const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({
  initialPhone = '',
  initialCountryCode = '+91',
  onClose,
  onSuccess
}) => {
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input' | 'otp' | 'verified'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCodeNote, setDevCodeNote] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const clean = phone.replace(/\D/g, '');
    if (!clean || clean.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await profileApi.sendPhoneOTP(clean, countryCode);
      if (res.devCode) {
        setDevCodeNote(`Dev Verification Code: ${res.devCode}`);
        setOtp(res.devCode);
      }
      setStep('otp');
      setCooldown(30);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      await profileApi.verifyPhoneOTP(phone.replace(/\D/g, ''), otp.trim());
      setStep('verified');
      setTimeout(() => {
        onSuccess(phone, countryCode);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass-card"
        style={{ maxWidth: 460, padding: '1.75rem', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Phone size={18} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Phone Number Verification
            </h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 'var(--radius-md)', color: '#f43f5e', marginBottom: '1.25rem', fontSize: '0.825rem' }}>
            {error}
          </div>
        )}

        {step === 'input' && (
          <form onSubmit={handleSendOTP}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Add and verify your mobile number to increase trust and receive critical marketplace SMS notifications.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <select
                className="input-field"
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                style={{ width: '130px', fontSize: '0.85rem' }}
              >
                <option value="+91">🇮🇳 +91 India</option>
                <option value="+1">🇺🇸 +1 USA</option>
                <option value="+44">🇬🇧 +44 UK</option>
                <option value="+971">🇦🇪 +971 UAE</option>
                <option value="+61">🇦🇺 +61 Australia</option>
              </select>

              <input
                type="tel"
                className="input-field"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ flex: 1, fontSize: '0.9rem' }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              We sent a 6-digit OTP code to <strong>{countryCode} {phone}</strong>.
            </p>

            {devCodeNote && (
              <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 'var(--radius-sm)', color: '#a78bfa', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center' }}>
                {devCodeNote}
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                Enter 6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                className="input-field"
                placeholder="• • • • • •"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                style={{ fontSize: '1.3rem', letterSpacing: '0.5rem', textAlign: 'center', fontWeight: 800, fontFamily: 'Space Grotesk' }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={cooldown > 0 || loading}
                onClick={() => handleSendOTP()}
                style={{ fontSize: '0.78rem' }}
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setStep('input')}
                style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}
              >
                Change Number
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'VERIFY OTP'}
              </button>
            </div>
          </form>
        )}

        {step === 'verified' && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', margin: '0 auto 1rem auto' }}>
              <CheckCircle2 size={32} />
            </div>
            <h4 style={{ fontSize: '1.15rem', color: '#10b981', marginBottom: '0.35rem' }}>
              Phone Verified Successfully!
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Your phone number has been authenticated and linked to your marketplace profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
