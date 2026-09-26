import React, { useState } from 'react';
import {
  User, CheckCircle2, ShieldCheck, MapPin, Calendar, Star, Briefcase, Camera, Trash2, Globe, Award, Sparkles, ExternalLink, Phone
} from 'lucide-react';

interface ProfileHeaderProps {
  user: any;
  profile: any;
  onPhotoUpload?: (url: string) => void;
  onPhotoRemove?: () => void;
  onOpenPublicView?: () => void;
  onOpenEditSection?: (sectionId: string) => void;
}

import { safeJsonParse } from '../../utils/safeJsonParse';

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  profile,
  onPhotoUpload,
  onPhotoRemove,
  onOpenPublicView,
  onOpenEditSection
}) => {
  const [uploading, setUploading] = useState(false);

  const capabilities: string[] = safeJsonParse(user?.capabilities, ['client']);

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Aug 2026';

  const title = profile?.professionalTitle || (
    capabilities.includes('freelancer') ? 'Senior Full-Stack Engineer & Consultant' : 'Client & Project Lead'
  );

  const handleSimulatedPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format & size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5 MB.');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (onPhotoUpload) onPhotoUpload(dataUrl);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '2rem',
        marginBottom: '1.75rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(14,165,233,0.08) 100%)',
        border: '1px solid rgba(167,139,250,0.25)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.75rem', flexWrap: 'wrap' }}>
        
        {/* Profile Avatar & Upload Button */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
              padding: '3px',
              boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
              position: 'relative'
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
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  color: 'var(--color-purple-light)',
                  fontFamily: 'Space Grotesk'
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Change Photo Overlay Button */}
          <label
            htmlFor="profile-photo-input"
            style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#7c3aed',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              border: '2px solid var(--bg-dark)'
            }}
            title="Upload / Change Profile Photo"
          >
            <Camera size={15} />
            <input
              id="profile-photo-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleSimulatedPhotoUpload}
            />
          </label>

          {user?.profilePhoto && onPhotoRemove && (
            <button
              onClick={onPhotoRemove}
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#f43f5e',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Remove profile photo"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>

        {/* User Details */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {user?.fullName || 'Marketplace User'}
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              @{user?.email?.split('@')[0] || 'user'}
            </span>
          </div>

          <p style={{ color: 'var(--color-purple-light)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            {title}
          </p>

          {/* Account & Verification Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            {/* Capability Badges */}
            {capabilities.includes('client') && (
              <span className="badge badge-blue" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                CLIENT
              </span>
            )}
            {capabilities.includes('freelancer') && (
              <span className="badge badge-purple" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                FREELANCER
              </span>
            )}

            {/* Scope Badge */}
            <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
              🌐 DIGITAL & LOCAL
            </span>

            {/* Real Verification Badges */}
            {user?.emailVerified && (
              <span style={{ padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={12} /> Email Verified
              </span>
            )}

            {user?.phoneVerified ? (
              <span style={{ padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Phone size={12} /> Phone Verified
              </span>
            ) : (
              <span
                onClick={() => onOpenEditSection && onOpenEditSection('phone')}
                style={{ padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                title="Click to verify phone"
              >
                ⚠ Verify Phone
              </span>
            )}

            {user?.identityVerified && (
              <span style={{ padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', background: 'rgba(14,165,233,0.12)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.3)', fontSize: '0.7rem', fontWeight: 700 }}>
                <ShieldCheck size={12} /> Identity Verified
              </span>
            )}
          </div>

          {/* Quick Stats Strip */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={14} color="#a78bfa" />
              {user?.location || (user?.city ? `${user.city}, ${user.state || ''}` : 'Latur, Maharashtra')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={14} color="#38bdf8" /> Member Since {memberSince}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Star size={14} color="#fbbf24" fill="#fbbf24" />
              <strong>{profile?.totalRating?.toFixed(1) || '5.0'}</strong> ({profile?.ratingCount || 18} Reviews)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Briefcase size={14} color="#34d399" />
              <strong>{profile?.jobsCompleted || 14}</strong> Completed Tasks
            </span>
          </div>
        </div>

        {/* Action Button */}
        {onOpenPublicView && (
          <button
            onClick={onOpenPublicView}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
          >
            <ExternalLink size={14} /> Public View
          </button>
        )}
      </div>
    </div>
  );
};
