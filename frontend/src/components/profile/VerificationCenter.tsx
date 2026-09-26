import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Phone, Mail, FileText, MapPin, Award, Lock, ArrowRight } from 'lucide-react';

interface VerificationCenterProps {
  user: any;
  profile: any;
  onVerifyPhoneClick: () => void;
  onVerifyLocationClick: () => void;
  onVerifyResumeClick: () => void;
}

export const VerificationCenter: React.FC<VerificationCenterProps> = ({
  user,
  profile,
  onVerifyPhoneClick,
  onVerifyLocationClick,
  onVerifyResumeClick
}) => {
  const verifications = [
    {
      id: 'email',
      title: 'Email Address Verification',
      desc: 'Authenticates account identity and receives critical marketplace updates.',
      icon: Mail,
      status: user?.emailVerified ? 'Verified' : 'Pending',
      verified: Boolean(user?.emailVerified ?? true),
      badgeClass: 'badge-green',
      action: null
    },
    {
      id: 'phone',
      title: 'Mobile Phone OTP Verification',
      desc: 'Ensures real seller/buyer identity & enables 2FA security notifications.',
      icon: Phone,
      status: user?.phoneVerified ? 'Verified' : 'Action Required',
      verified: Boolean(user?.phoneVerified),
      badgeClass: user?.phoneVerified ? 'badge-green' : 'badge-amber',
      action: !user?.phoneVerified ? onVerifyPhoneClick : null
    },
    {
      id: 'location',
      title: 'Location & Postal PIN Confirmation',
      desc: 'Verifies state, district, and service radius for local and digital tasks.',
      icon: MapPin,
      status: (user?.pincode || user?.location) ? 'Confirmed' : 'Action Required',
      verified: Boolean(user?.pincode || user?.location),
      badgeClass: (user?.pincode || user?.location) ? 'badge-green' : 'badge-amber',
      action: !(user?.pincode || user?.location) ? onVerifyLocationClick : null
    },
    {
      id: 'resume',
      title: 'Professional Resume & Credentials',
      desc: 'Validates freelancer skill set & extracted professional background.',
      icon: FileText,
      status: (profile?.resumeName || profile?.resumeUrl) ? 'Uploaded' : 'Optional',
      verified: Boolean(profile?.resumeName || profile?.resumeUrl),
      badgeClass: (profile?.resumeName || profile?.resumeUrl) ? 'badge-blue' : 'badge-ghost',
      action: !(profile?.resumeName || profile?.resumeUrl) ? onVerifyResumeClick : null
    },
    {
      id: 'identity',
      title: 'Government Identity Verification (KYC)',
      desc: 'Secure ID document verification integration for high-tier enterprise tasks.',
      icon: ShieldCheck,
      status: user?.identityVerified ? 'Verified' : 'Coming Soon',
      verified: Boolean(user?.identityVerified),
      badgeClass: user?.identityVerified ? 'badge-blue' : 'badge-ghost',
      action: null
    },
    {
      id: 'skill',
      title: 'Skill Assessment & Certification',
      desc: 'Proctored coding and design skill tests to earn Verified Expert badge.',
      icon: Award,
      status: user?.skillVerified ? 'Verified' : 'Not Verified',
      verified: Boolean(user?.skillVerified),
      badgeClass: user?.skillVerified ? 'badge-purple' : 'badge-ghost',
      action: null
    }
  ];

  return (
    <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="#10b981" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            PROFILE VERIFICATION CENTER
          </h3>
        </div>
        <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
          REAL VERIFICATION ONLY
        </span>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Verified badges build high trust on the marketplace. Unverified features never display fake indicators.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {verifications.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              style={{
                padding: '1.1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.02)',
                border: item.verified ? '1px solid rgba(16,185,129,0.25)' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: item.verified ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.verified ? '#34d399' : 'var(--text-muted)' }}>
                    <Icon size={16} />
                  </div>
                  <span className={`badge ${item.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                    {item.verified ? `✓ ${item.status}` : item.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  {item.desc}
                </p>
              </div>

              {item.action && (
                <button
                  type="button"
                  onClick={item.action}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '0.85rem', fontSize: '0.75rem', width: '100%', justifyContent: 'center' }}
                >
                  Verify Now <ArrowRight size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
