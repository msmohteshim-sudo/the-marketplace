import React from 'react';
import {
  User, CheckCircle2, ShieldCheck, MapPin, Calendar, Star, Briefcase, X, Mail, Globe, Award, Sparkles, Phone, Lock
} from 'lucide-react';

interface PublicProfileModalProps {
  user: any;
  profile: any;
  onClose: () => void;
}

import { safeJsonParse } from '../../utils/safeJsonParse';

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({
  user,
  profile,
  onClose
}) => {
  const capabilities: string[] = safeJsonParse(user?.capabilities, ['client']);
  const skillsArr: string[] = safeJsonParse(profile?.skills, ['React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS']);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Aug 2026';

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass-card"
        style={{ maxWidth: 680, padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
              PUBLIC MARKETPLACE PROFILE
            </span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Header Header */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
              padding: '2px',
              flexShrink: 0
            }}
          >
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.fullName || 'User Profile'}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: 'var(--color-purple-light)',
                  fontFamily: 'Space Grotesk'
                }}
              >
                {initials}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {user?.fullName || 'Marketplace User'}
              </h2>
              {user?.isVerified && <CheckCircle2 size={16} color="#34d399" />}
            </div>

            <p style={{ color: 'var(--color-purple-light)', fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
              {profile?.professionalTitle || 'Senior Digital Professional'}
            </p>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {capabilities.includes('client') && <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>CLIENT</span>}
              {capabilities.includes('freelancer') && <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>FREELANCER</span>}
              {user?.emailVerified && <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>✓ Email Verified</span>}
              {user?.phoneVerified && <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>✓ Phone Verified</span>}
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Location</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={12} color="#a78bfa" /> {user?.location || 'Latur, Maharashtra'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rating</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={12} fill="#fbbf24" /> {profile?.totalRating?.toFixed(1) || '5.0'} ({profile?.ratingCount || 18})
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Member Since</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {memberSince}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Response Rate</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>
              98% (&lt; 1 Hour)
            </div>
          </div>
        </div>

        {/* About / Summary */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            About Professional
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {user?.bio || 'Verified digital professional providing high quality software engineering, architectural solutions, and client consulting.'}
          </p>
        </div>

        {/* Verified Skills */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Verified Technical Skills
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {skillsArr.map(sk => (
              <span
                key={sk}
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(167,139,250,0.3)',
                  color: '#a78bfa',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Public Contact Privacy Notice */}
        <div style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Lock size={13} color="#a78bfa" /> Contact method: Marketplace Encrypted Messaging
          </span>
          <button className="btn btn-primary btn-sm" onClick={onClose} style={{ fontSize: '0.78rem' }}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
