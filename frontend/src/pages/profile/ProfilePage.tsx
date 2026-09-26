import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, ShieldCheck, Award, Star, Laptop, Globe, Wrench, Briefcase, Sparkles, Check, AlertCircle, Lock, FileText, CheckCircle2, Save, RefreshCw, Settings, Eye
} from 'lucide-react';
import { useAuth, WorkType } from '../../context/AuthContext';
import { profileApi, authApi } from '../../services/api';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { ProfileCompletionCard } from '../../components/profile/ProfileCompletionCard';
import { PhoneVerificationModal } from '../../components/profile/PhoneVerificationModal';
import { SmartLocationSection } from '../../components/profile/SmartLocationSection';
import { ResumeSection } from '../../components/profile/ResumeSection';
import { VerificationCenter } from '../../components/profile/VerificationCenter';
import { PublicProfileModal } from '../../components/profile/PublicProfileModal';

import { safeJsonParse } from '../../utils/safeJsonParse';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  // Profile data & completion state
  const [profileData, setProfileData] = useState<any>(user?.profile || {});
  const [completion, setCompletion] = useState<{ percentage: number; checklist: any[] }>({
    percentage: user?.profileComplete || 65,
    checklist: []
  });

  const [activeTab, setActiveTab] = useState<
    'overview' | 'freelancer' | 'client' | 'resume' | 'location' | 'verification' | 'privacy'
  >('overview');

  // Modals state
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPublicModal, setShowPublicModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states for profile sections
  const [basicForm, setBasicForm] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    professionalTitle: user?.profile?.professionalTitle || ''
  });

  const [freelancerForm, setFreelancerForm] = useState({
    professionalTitle: user?.profile?.professionalTitle || '',
    hourlyRate: user?.profile?.hourlyRate || 500,
    availability: user?.profile?.availability || 'available',
    skills: safeJsonParse(user?.profile?.skills, ['React', 'Node.js', 'TypeScript'])
  });

  const [clientForm, setClientForm] = useState({
    clientType: user?.profile?.clientType || 'Individual',
    companyName: user?.profile?.companyName || '',
    industry: user?.profile?.industry || 'Technology & Software',
    clientWorkPreference: user?.clientWorkPreference || 'both'
  });

  const [privacyForm, setPrivacyForm] = useState({
    phoneVisibility: user?.phoneVisibility || 'private',
    profileVisibility: user?.profileVisibility || 'public',
    resumeVisibility: user?.resumeVisibility || 'private'
  });

  const fetchLatestProfile = async () => {
    try {
      const res = await profileApi.getMe();
      if (res.data?.user) {
        setProfileData(res.data.user.profile || {});
        if (res.data.completion) setCompletion(res.data.completion);
        updateUser(res.data.user);
      } else if (res.user) {
        setProfileData(res.user.profile || {});
        if (res.completion) setCompletion(res.completion);
        updateUser(res.user);
      }
    } catch (e) {
      console.error('Failed to fetch profile', e);
    }
  };

  useEffect(() => {
    fetchLatestProfile();
  }, []);

  // Update profile handler
  const handleSaveProfileSection = async (sectionData: any) => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await profileApi.update(sectionData);
      const updatedUserData = res.data?.user || res.user;
      const updatedCompletionData = res.data?.completion || res.completion;
      if (updatedUserData) updateUser(updatedUserData);
      if (updatedCompletionData) setCompletion(updatedCompletionData);
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg({ text: err.message || 'Update failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (photoUrl: string) => {
    await handleSaveProfileSection({ profilePhoto: photoUrl });
  };

  const handlePhotoRemove = async () => {
    await handleSaveProfileSection({ profilePhoto: null });
  };

  useEffect(() => {
    if (user) {
      setBasicForm({
        fullName: user.fullName || '',
        bio: user.bio || '',
        professionalTitle: user.profile?.professionalTitle || profileData?.professionalTitle || ''
      });
      setFreelancerForm({
        professionalTitle: user.profile?.professionalTitle || profileData?.professionalTitle || '',
        hourlyRate: user.profile?.hourlyRate || profileData?.hourlyRate || 500,
        availability: user.profile?.availability || profileData?.availability || 'available',
        skills: safeJsonParse(user.profile?.skills || profileData?.skills, ['React', 'Node.js', 'TypeScript'])
      });
      setClientForm({
        clientType: user.profile?.clientType || profileData?.clientType || 'Individual',
        companyName: user.profile?.companyName || profileData?.companyName || '',
        industry: user.profile?.industry || profileData?.industry || 'Technology & Software',
        clientWorkPreference: user.clientWorkPreference || 'both'
      });
      setPrivacyForm({
        phoneVisibility: user.phoneVisibility || 'private',
        profileVisibility: user.profileVisibility || 'public',
        resumeVisibility: user.resumeVisibility || 'private'
      });
    }
  }, [user, profileData]);

  const capabilities: string[] = safeJsonParse(user?.capabilities, ['client']);

  const isFreelancer = capabilities.includes('freelancer');
  const isClient = capabilities.includes('client');

  if (!user) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <RefreshCw size={32} className="spin" style={{ margin: '0 auto 1rem auto', color: '#a78bfa' }} />
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Loading Your Marketplace Profile...</h3>
        <p style={{ fontSize: '0.875rem' }}>Fetching credentials, smart PIN location, and verification badges.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ fontSize: '1.6rem', margin: 0 }}>
          User Profile & Professional Identity
        </h1>
        <p className="page-subtitle">
          Manage your verified credentials, capabilities, phone security, smart PIN location, and resume.
        </p>
      </div>

      {msg && (
        <div
          style={{
            padding: '0.875rem 1.25rem',
            background: msg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
            border: msg.type === 'success' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(244,63,94,0.3)',
            borderRadius: 'var(--radius-md)',
            color: msg.type === 'success' ? '#34d399' : '#f43f5e',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {msg.text}
        </div>
      )}

      {/* Professional Profile Header */}
      <ProfileHeader
        user={user}
        profile={profileData}
        onPhotoUpload={handlePhotoUpload}
        onPhotoRemove={handlePhotoRemove}
        onOpenPublicView={() => setShowPublicModal(true)}
        onOpenEditSection={(sec) => {
          if (sec === 'phone') setShowPhoneModal(true);
        }}
      />

      {/* Dynamic Profile Completion Card [████████████░░░░░░] */}
      <ProfileCompletionCard
        percentage={completion.percentage}
        checklist={completion.checklist}
        onSelectMissing={(key) => {
          if (key === 'phone') setShowPhoneModal(true);
          else if (key === 'location') setActiveTab('location');
          else if (key === 'resume') setActiveTab('resume');
          else if (key === 'title' || key === 'skills') setActiveTab('freelancer');
        }}
      />

      {/* Navigation Tabs Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'freelancer', label: 'Freelancer Profile', icon: Wrench, hide: !isFreelancer },
          { id: 'client', label: 'Client Profile', icon: Briefcase, hide: !isClient },
          { id: 'resume', label: 'Resume & AI Parser', icon: FileText, hide: !isFreelancer },
          { id: 'location', label: 'Location & PIN Code', icon: MapPin },
          { id: 'verification', label: 'Verification Center', icon: ShieldCheck },
          { id: 'privacy', label: 'Privacy & Settings', icon: Lock }
        ].filter(t => !t.hide).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1 — OVERVIEW & BASIC INFORMATION */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProfileSection({
                fullName: basicForm.fullName,
                bio: basicForm.bio,
                profile: { professionalTitle: basicForm.professionalTitle }
              });
            }}
            className="glass-card"
            style={{ padding: '1.75rem' }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
              Basic Information
            </h3>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={basicForm.fullName}
                onChange={e => setBasicForm({ ...basicForm, fullName: e.target.value })}
                placeholder="e.g. Alex Rivera"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Professional Title / Headline</label>
              <input
                className="form-input"
                value={basicForm.professionalTitle}
                onChange={e => setBasicForm({ ...basicForm, professionalTitle: e.target.value })}
                placeholder="e.g. Senior Full-Stack Next.js Developer & UI Specialist"
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">About / Professional Summary</label>
              <textarea
                className="form-input"
                rows={4}
                value={basicForm.bio}
                onChange={e => setBasicForm({ ...basicForm, bio: e.target.value })}
                placeholder="Write a compelling summary of your experience, services, or hiring expectations..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? 'Saving...' : 'Save Basic Details'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2 — FREELANCER PROFILE */}
      {activeTab === 'freelancer' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveProfileSection({
              profile: {
                professionalTitle: freelancerForm.professionalTitle,
                hourlyRate: parseFloat(freelancerForm.hourlyRate as any) || 500,
                availability: freelancerForm.availability,
                skills: freelancerForm.skills
              }
            });
          }}
          className="glass-card"
          style={{ padding: '1.75rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Wrench size={20} color="#a78bfa" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              FREELANCER PROFESSIONAL PROFILE
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Hourly Rate (₹)</label>
              <input
                type="number"
                className="input-field"
                value={freelancerForm.hourlyRate}
                onChange={e => setFreelancerForm({ ...freelancerForm, hourlyRate: e.target.value as any })}
                placeholder="500"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Availability Status</label>
              <select
                className="input-field"
                value={freelancerForm.availability}
                onChange={e => setFreelancerForm({ ...freelancerForm, availability: e.target.value })}
              >
                <option value="available">🟢 Available Now for Work</option>
                <option value="busy">🟡 Busy (Limited Hours)</option>
                <option value="not_available">🔴 Not Available</option>
              </select>
            </div>
          </div>

          {/* Primary & Secondary Skills Tags */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              Primary & Secondary Skills (Comma separated)
            </label>
            <input
              type="text"
              className="input-field"
              value={freelancerForm.skills.join(', ')}
              onChange={e => setFreelancerForm({
                ...freelancerForm,
                skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              placeholder="React, Next.js, Node.js, TypeScript, TailwindCSS"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Save Freelancer Profile'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3 — CLIENT PROFILE */}
      {activeTab === 'client' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveProfileSection({
              profile: {
                clientType: clientForm.clientType,
                companyName: clientForm.companyName,
                industry: clientForm.industry
              }
            });
          }}
          className="glass-card"
          style={{ padding: '1.75rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Briefcase size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              CLIENT & ORGANIZATION PROFILE
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Client Type</label>
              <select
                className="input-field"
                value={clientForm.clientType}
                onChange={e => setClientForm({ ...clientForm, clientType: e.target.value })}
              >
                <option value="Individual">Individual Client</option>
                <option value="Startup">Tech Startup</option>
                <option value="Small Business">Small Business / SMB</option>
                <option value="Company">Enterprise Company</option>
                <option value="Organization">Non-Profit / Organization</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Company Name (Optional)</label>
              <input
                type="text"
                className="input-field"
                value={clientForm.companyName}
                onChange={e => setClientForm({ ...clientForm, companyName: e.target.value })}
                placeholder="e.g. Apex Tech Solutions"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Industry Focus</label>
              <input
                type="text"
                className="input-field"
                value={clientForm.industry}
                onChange={e => setClientForm({ ...clientForm, industry: e.target.value })}
                placeholder="e.g. Software & SaaS"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Work Preference</label>
              <select
                className="input-field"
                value={clientForm.clientWorkPreference}
                onChange={e => {
                  const val = e.target.value as WorkType;
                  setClientForm({ ...clientForm, clientWorkPreference: val });
                  handleSaveProfileSection({ clientWorkPreference: val });
                  updateUser({ clientWorkPreference: val, activeWorkType: val });
                }}
              >
                <option value="digital">💻 Digital Work</option>
                <option value="physical">📍 Physical / Local Work</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Save Client Profile'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 4 — RESUME & AI PARSER */}
      {activeTab === 'resume' && (
        <ResumeSection
          profile={profileData}
          resumeVisibility={privacyForm.resumeVisibility}
          onUpdateProfile={async (updatedProfile) => {
            setProfileData(updatedProfile);
            await fetchLatestProfile();
          }}
          onUpdateVisibility={async (vis) => {
            setPrivacyForm(prev => ({ ...prev, resumeVisibility: vis }));
            await handleSaveProfileSection({ resumeVisibility: vis });
          }}
        />
      )}

      {/* TAB 5 — SMART LOCATION & PIN CODE */}
      {activeTab === 'location' && (
        <SmartLocationSection
          user={user}
          onSaveLocation={async (locData) => {
            await handleSaveProfileSection(locData);
          }}
        />
      )}

      {/* TAB 6 — VERIFICATION CENTER */}
      {activeTab === 'verification' && (
        <VerificationCenter
          user={user}
          profile={profileData}
          onVerifyPhoneClick={() => setShowPhoneModal(true)}
          onVerifyLocationClick={() => setActiveTab('location')}
          onVerifyResumeClick={() => setActiveTab('resume')}
        />
      )}

      {/* TAB 7 — PRIVACY & CONTACT SETTINGS */}
      {activeTab === 'privacy' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveProfileSection(privacyForm);
          }}
          className="glass-card"
          style={{ padding: '1.75rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <Lock size={20} color="#f472b6" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              PRIVACY & CONTACT EXPOSURE CONTROLS
            </h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Your security matters. Phone numbers and email addresses are never publicly exposed by default.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Phone Number Privacy</label>
              <select
                className="input-field"
                value={privacyForm.phoneVisibility}
                onChange={e => setPrivacyForm({ ...privacyForm, phoneVisibility: e.target.value })}
              >
                <option value="private">🔒 Private (Default - Hidden)</option>
                <option value="hired">🤝 Visible Only After Hiring</option>
                <option value="selected">👥 Visible to Selected Clients</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Profile Visibility</label>
              <select
                className="input-field"
                value={privacyForm.profileVisibility}
                onChange={e => setPrivacyForm({ ...privacyForm, profileVisibility: e.target.value })}
              >
                <option value="public">🌐 Public (Visible in Search)</option>
                <option value="marketplace">🏛️ Marketplace Members Only</option>
                <option value="private">🔒 Private (Hidden from Search)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Save Privacy Controls'}
            </button>
          </div>
        </form>
      )}

      {/* PHONE OTP MODAL */}
      {showPhoneModal && (
        <PhoneVerificationModal
          initialPhone={user?.phone || ''}
          initialCountryCode={user?.phoneCountryCode || '+91'}
          onClose={() => setShowPhoneModal(false)}
          onSuccess={async (p, cc) => {
            await fetchLatestProfile();
          }}
        />
      )}

      {/* PUBLIC PROFILE VIEW MODAL */}
      {showPublicModal && (
        <PublicProfileModal
          user={user}
          profile={profileData}
          onClose={() => setShowPublicModal(false)}
        />
      )}
    </div>
  );
};
