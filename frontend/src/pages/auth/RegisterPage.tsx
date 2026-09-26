import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, ArrowRight,
  CheckCircle2, Briefcase, Wrench, Sparkles, MapPin, Laptop, Globe,
  ChevronLeft, Layers, ShieldCheck, DollarSign, Award, Clock, X
} from 'lucide-react';
import { useAuth, WorkType } from '../../context/AuthContext';
import { authApi, profileApi } from '../../services/api';
import '../../components/layout/layout.css';

type RoleSelection = 'client' | 'freelancer' | 'both';

const DIGITAL_SKILLS = ['React', 'Node.js', 'Python', 'Java', 'AI / ML', 'Data Science', 'Figma', 'UI/UX Design', 'Video Editing', 'Content Writing', 'Digital Marketing', 'SEO', 'Mobile App Dev'];
const PHYSICAL_SKILLS = ['Electrician', 'Plumber', 'Carpenter', 'Cleaner', 'Painter', 'Mover & Packer', 'Photography', 'Home Tutor', 'Appliance Repair', 'Gardening', 'Event Assistance'];

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Wizard Step: 1 = Role, 2 = Work Preference, 3 = Account Details, 4 = Profile Setup, 5 = Complete
  const [step, setStep] = useState<number>(1);

  // Step 1: Role Selection
  const [roleSelection, setRoleSelection] = useState<RoleSelection>('client');

  // Step 2: Work Preferences
  const [clientPref, setClientPref] = useState<WorkType>('digital');
  const [freelancerPref, setFreelancerPref] = useState<WorkType>('digital');

  // Step 3: Account Details Form
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [countryCode, setCountryCode] = useState('+91');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Step 4: Profile Details Form
  const [profileData, setProfileData] = useState({
    pincode: '',
    city: '',
    state: '',
    country: 'India',
    area: '',
    serviceRadius: '10',
    selectedDigitalSkills: [] as string[],
    selectedPhysicalSkills: [] as string[],
    serviceCategory: 'Web Development',
    hourlyRate: '500',
    projectRate: '2500',
    portfolio: '',
    hiringFrequency: 'monthly',
    preferredBudget: '10000-50000',
    workingHours: '9 AM - 6 PM'
  });

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeSuccessMsg, setPincodeSuccessMsg] = useState('');
  const [activeProfileTab, setActiveProfileTab] = useState<'digital' | 'physical'>('digital');

  const handlePincodeChange = async (val: string) => {
    const cleanPin = val.replace(/\D/g, '').slice(0, 6);
    setProfileData(prev => ({ ...prev, pincode: cleanPin }));
    setPincodeSuccessMsg('');

    if (cleanPin.length === 6) {
      setPincodeLoading(true);
      try {
        const res = await profileApi.pincodeLookup(cleanPin);
        if (res.success && res.district && res.state) {
          setProfileData(prev => ({
            ...prev,
            pincode: cleanPin,
            city: res.district,
            state: res.state,
            country: 'India'
          }));
          setPincodeSuccessMsg(`✓ Auto-filled location: ${res.district}, ${res.state}`);
        } else {
          setPincodeSuccessMsg(`✓ Location set for PIN Code ${cleanPin}`);
        }
      } catch (e) {
        setPincodeSuccessMsg(`✓ PIN Code ${cleanPin} entered`);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const toggleSkill = (skill: string, type: 'digital' | 'physical') => {
    if (type === 'digital') {
      const current = profileData.selectedDigitalSkills;
      const updated = current.includes(skill) ? current.filter(s => s !== skill) : [...current, skill];
      setProfileData({ ...profileData, selectedDigitalSkills: updated });
    } else {
      const current = profileData.selectedPhysicalSkills;
      const updated = current.includes(skill) ? current.filter(s => s !== skill) : [...current, skill];
      setProfileData({ ...profileData, selectedPhysicalSkills: updated });
    }
  };

  // Step 3 Submit -> Directly Register Account
  const handleRegisterAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      setError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      setError('Please enter a valid email address (e.g. name@domain.com)');
      return;
    }

    if (form.phone && form.phone.includes('@')) {
      setError('Phone field contains an email address. Please place your email address in the Email Address field.');
      return;
    }

    if (form.phone && form.phone.trim()) {
      const clean = form.phone.replace(/\D/g, '');
      if (clean.length < 7 || clean.length > 15) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8 || form.password.length > 16) {
      setError('Password must be between 8 and 16 characters long.');
      return;
    }
    if (!/[A-Z]/.test(form.password)) {
      setError('Password must include at least one uppercase capital letter (A-Z).');
      return;
    }
    if (!/[0-9]/.test(form.password)) {
      setError('Password must include at least one number (0-9).');
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) {
      setError('Password must include at least one special character (e.g. @, #, $, %, !).');
      return;
    }
    if (!form.agreeTerms) {
      setError('Please agree to the Terms & Conditions');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await authApi.register({
        fullName: form.fullName,
        email: form.email.trim(),
        phone: form.phone ? `${countryCode} ${form.phone.replace(/\D/g, '')}` : '',
        password: form.password,
        confirmPassword: form.confirmPassword,
        roleSelection,
        clientWorkPreference: clientPref,
        freelancerWorkPreference: freelancerPref
      });
      login(res);
      setStep(4);
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 4 Submit -> Save Profile
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const skills = [...profileData.selectedDigitalSkills, ...profileData.selectedPhysicalSkills];
      await authApi.updateProfileDetails({
        city: profileData.city,
        state: profileData.state,
        country: profileData.country,
        area: profileData.area,
        serviceRadius: profileData.serviceRadius,
        skills,
        hourlyRate: profileData.hourlyRate,
        projectRate: profileData.projectRate,
        portfolio: profileData.portfolio,
        serviceCategory: profileData.serviceCategory,
        hiringFrequency: profileData.hiringFrequency,
        preferredBudget: profileData.preferredBudget,
        workingHours: profileData.workingHours
      });
      navigate('/dashboard');
    } catch (e) {
      // Proceed even if skip/error
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

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

          <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Join The<br />
            <span className="gradient-text">Marketplace</span>
          </h1>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            One account. Client & Freelancer capabilities. Digital & Local opportunities.
          </p>

          {/* Progress Indicator */}
          <div style={{ marginTop: 'auto', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              Onboarding Progress (Step {step} of 4)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '4px',
                    background: step >= s ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.08)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              'Single Account for Hiring & Freelancing',
              'Digital Remote Work & Physical Local Services',
              'Instant Mode & Work-Type Switching',
              'Secure Payments & Smart Matching'
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={16} style={{ color: '#a78bfa', flexShrink: 0 }} />
                <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Main Content (Steps) */}
      <div className="auth-main" style={{ flex: 1, padding: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '640px' }}>

          {/* ═══════════════════════════════════════════════════════════
              STEP 1: ROLE SELECTION (CLIENT / FREELANCER / BOTH)
             ═══════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#a78bfa' }}>
                  STEP 1 OF 4 — ROLE SELECTION
                </span>
                <h2 style={{ fontSize: '1.85rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                  Welcome to The Marketplace
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  How would you like to use The Marketplace? You can enable more capabilities later.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                {/* Card 1: CLIENT */}
                <div
                  onClick={() => setRoleSelection('client')}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: roleSelection === 'client' ? '2px solid #7c3aed' : '1px solid var(--border-default)',
                    background: roleSelection === 'client' ? 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(14,165,233,0.08) 100%)' : 'var(--bg-card)',
                    boxShadow: roleSelection === 'client' ? '0 0 25px rgba(124,58,237,0.2)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.25rem'
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Briefcase size={22} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Client</span>
                      {roleSelection === 'client' && <CheckCircle2 size={20} color="#a78bfa" />}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 600, marginBottom: '0.375rem' }}>
                      Find people, services and solutions.
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      I want to hire people, buy services, post tasks and discover opportunities.
                    </p>
                  </div>
                </div>

                {/* Card 2: FREELANCER */}
                <div
                  onClick={() => setRoleSelection('freelancer')}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: roleSelection === 'freelancer' ? '2px solid #7c3aed' : '1px solid var(--border-default)',
                    background: roleSelection === 'freelancer' ? 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(14,165,233,0.08) 100%)' : 'var(--bg-card)',
                    boxShadow: roleSelection === 'freelancer' ? '0 0 25px rgba(124,58,237,0.2)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.25rem'
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Wrench size={22} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Freelancer</span>
                      {roleSelection === 'freelancer' && <CheckCircle2 size={20} color="#a78bfa" />}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600, marginBottom: '0.375rem' }}>
                      Offer your skills and earn.
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      I want to offer my skills, complete work and earn money.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Already registered? <Link to="/auth/login" style={{ color: '#a78bfa', fontWeight: 600 }}>Sign In</Link>
                </p>
                <button
                  className="btn-hero-primary"
                  onClick={() => setStep(2)}
                  style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 2: WORK TYPE SELECTION (DIGITAL / PHYSICAL / BOTH)
             ═══════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#a78bfa' }}>
                  STEP 2 OF 4 — WORK PREFERENCES
                </span>
                <h2 style={{ fontSize: '1.85rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                  What Kind of Work?
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Select your work environment preferences.
                </p>
              </div>

              {/* IF ROLE IS CLIENT */}
              {roleSelection === 'client' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    What kind of work are you looking for?
                  </div>

                  <div
                    onClick={() => setClientPref('digital')}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: clientPref === 'digital' ? '2px solid #7c3aed' : '1px solid var(--border-default)',
                      background: clientPref === 'digital' ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <Laptop size={26} color="#a78bfa" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Digital Work</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Remote & online services (Web Dev, Design, AI, Writing)</div>
                    </div>
                    {clientPref === 'digital' && <CheckCircle2 size={18} color="#a78bfa" />}
                  </div>

                  <div
                    onClick={() => setClientPref('physical')}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: clientPref === 'physical' ? '2px solid #7c3aed' : '1px solid var(--border-default)',
                      background: clientPref === 'physical' ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <MapPin size={26} color="#38bdf8" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Physical / Local Work</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Real-world services nearby (Electrician, Plumber, Tutor)</div>
                    </div>
                    {clientPref === 'physical' && <CheckCircle2 size={18} color="#a78bfa" />}
                  </div>

                  <div
                    onClick={() => setClientPref('both')}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: clientPref === 'both' ? '2px solid #7c3aed' : '1px solid var(--border-default)',
                      background: clientPref === 'both' ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <Layers size={26} color="#f59e0b" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Both (Digital & Physical Work)</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Access both remote digital services and local physical trades nearby</div>
                    </div>
                    {clientPref === 'both' && <CheckCircle2 size={18} color="#a78bfa" />}
                  </div>
                </div>
              )}

              {/* IF ROLE IS FREELANCER */}
              {roleSelection === 'freelancer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    What kind of work do you offer?
                  </div>

                  <div
                    onClick={() => setFreelancerPref('digital')}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: freelancerPref === 'digital' ? '2px solid #7c3aed' : '1px solid var(--border-default)',
                      background: freelancerPref === 'digital' ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <Laptop size={26} color="#a78bfa" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Digital Freelancer</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>I offer remote/online skills and services worldwide</div>
                    </div>
                    {freelancerPref === 'digital' && <CheckCircle2 size={18} color="#a78bfa" />}
                  </div>

                  <div
                    onClick={() => setFreelancerPref('physical')}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: freelancerPref === 'physical' ? '2px solid #7c3aed' : '1px solid var(--border-default)',
                      background: freelancerPref === 'physical' ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <MapPin size={26} color="#38bdf8" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Physical / Local Freelancer</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>I offer real-world services to nearby clients</div>
                    </div>
                    {freelancerPref === 'physical' && <CheckCircle2 size={18} color="#a78bfa" />}
                  </div>

                  <div
                    onClick={() => setFreelancerPref('both')}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: freelancerPref === 'both' ? '2px solid #7c3aed' : '1px solid var(--border-default)',
                      background: freelancerPref === 'both' ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <Layers size={26} color="#f59e0b" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Both (Digital & Physical Freelancer)</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>I offer both remote digital skills and local physical services nearby</div>
                    </div>
                    {freelancerPref === 'both' && <CheckCircle2 size={18} color="#a78bfa" />}
                  </div>
                </div>
              )}

              {/* IF ROLE IS BOTH */}
              {roleSelection === 'both' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  {/* CLIENT SIDE */}
                  <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                      Client Side (What you want to hire)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      {(['digital', 'physical', 'both'] as WorkType[]).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setClientPref(t)}
                          style={{
                            padding: '0.65rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: clientPref === t ? '2px solid #7c3aed' : '1px solid var(--border-default)',
                            background: clientPref === t ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                            color: 'var(--text-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                          }}
                        >
                          {t === 'physical' ? 'Physical / Local' : t === 'both' ? 'Both' : t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FREELANCER SIDE */}
                  <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                      Freelancer Side (What you want to offer)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      {(['digital', 'physical', 'both'] as WorkType[]).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFreelancerPref(t)}
                          style={{
                            padding: '0.65rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: freelancerPref === t ? '2px solid #0ea5e9' : '1px solid var(--border-default)',
                            background: freelancerPref === t ? 'rgba(14,165,233,0.2)' : 'rgba(255,255,255,0.04)',
                            color: 'var(--text-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                          }}
                        >
                          {t === 'physical' ? 'Physical / Local' : t === 'both' ? 'Both' : t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setStep(1)}
                  style={{ gap: '0.5rem' }}
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  className="btn-hero-primary"
                  onClick={() => setStep(3)}
                  style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 3: BASIC ACCOUNT REGISTRATION DETAILS
             ═══════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#a78bfa' }}>
                  STEP 3 OF 4 — ACCOUNT DETAILS
                </span>
                <h2 style={{ fontSize: '1.85rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                  Create Your Account
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Enter your credentials to register your account.
                </p>
              </div>

              {error && (
                <div style={{ padding: '0.875rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleRegisterAccount} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {/* Full Name */}
                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <div className="input-icon-wrap">
                    <UserIcon size={18} className="input-icon" />
                    <input
                      name="name"
                      autoComplete="name"
                      className="form-input"
                      placeholder="John Doe"
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="input-group">
                  <label className="input-label">Email Address *</label>
                  <div className="input-icon-wrap">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="input-group">
                  <label className="input-label">Mobile Phone Number (Optional)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      className="form-input"
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
                    <div className="input-icon-wrap" style={{ flex: 1 }}>
                      <Phone size={18} className="input-icon" />
                      <input
                        type="tel"
                        name="tel"
                        autoComplete="tel"
                        className="form-input"
                        placeholder={countryCode === '+91' ? '10-digit mobile (e.g. 9876543210)' : 'Mobile number'}
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Passwords */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Password *</label>
                    <div className="input-icon-wrap">
                      <Lock size={18} className="input-icon" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Min. 8 chars"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required
                      />
                      <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Confirm Password *</label>
                    <div className="input-icon-wrap">
                      <Lock size={18} className="input-icon" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Requirements Card */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', marginTop: '0.5rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>Password Requirements (8 - 16 Characters):</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem 0.75rem' }}>
                    <div style={{ color: form.password.length >= 8 && form.password.length <= 16 ? '#34d399' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 800 }}>{form.password.length >= 8 && form.password.length <= 16 ? '✓' : '•'}</span> 8 - 16 characters
                    </div>
                    <div style={{ color: /[A-Z]/.test(form.password) ? '#34d399' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 800 }}>{/[A-Z]/.test(form.password) ? '✓' : '•'}</span> 1 Capital Letter (A-Z)
                    </div>
                    <div style={{ color: /[0-9]/.test(form.password) ? '#34d399' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 800 }}>{/[0-9]/.test(form.password) ? '✓' : '•'}</span> 1 Number (0-9)
                    </div>
                    <div style={{ color: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) ? '#34d399' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 800 }}>{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) ? '✓' : '•'}</span> 1 Special Char (@,#,$)
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', marginTop: '0.25rem' }}>
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={e => setForm({ ...form, agreeTerms: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: '#7c3aed' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    I agree to the Terms of Service & Privacy Policy
                  </span>
                </label>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setStep(2)}
                    style={{ gap: '0.5rem' }}
                  >
                    <ChevronLeft size={18} /> Back
                  </button>
                  <button
                    type="submit"
                    className="btn-hero-primary"
                    disabled={loading}
                    style={{ padding: '0.75rem 2.25rem', fontSize: '0.95rem' }}
                  >
                    {loading ? 'Creating...' : 'Create Account'} <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 4: DYNAMIC PROFILE SETUP (SKIP AVAILABLE)
             ═══════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#a78bfa' }}>
                  STEP 4 OF 4 — COMPLETE YOUR PROFILE
                </span>
                <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem', marginBottom: '0.375rem' }}>
                  Tailor Your Marketplace Experience
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Fill in optional details to improve matching. You can complete this anytime later.
                </p>
              </div>

              {/* Location Fields with PIN Code Auto-Fill */}
              <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={16} color="#38bdf8" /> Location & Service Area (Decided by PIN Code)
                  </span>
                  {pincodeLoading && <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Finding location...</span>}
                </div>

                <div style={{ marginBottom: '0.875rem' }}>
                  <label className="input-label">Postal PIN Code (6 Digits)</label>
                  <input
                    className="form-input"
                    placeholder="Enter 6-digit PIN Code (e.g. 413512, 400001)"
                    maxLength={6}
                    value={profileData.pincode}
                    onChange={e => handlePincodeChange(e.target.value)}
                    style={{ fontWeight: 700, letterSpacing: '0.1rem' }}
                  />
                </div>

                {pincodeSuccessMsg && (
                  <div style={{ padding: '0.4rem 0.75rem', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 'var(--radius-sm)', color: '#34d399', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.875rem' }}>
                    {pincodeSuccessMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div>
                    <label className="input-label">City / District (Auto-Filled)</label>
                    <input
                      className="form-input"
                      placeholder="Auto-filled from PIN Code"
                      value={profileData.city}
                      onChange={e => setProfileData({ ...profileData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="input-label">State (Auto-Filled)</label>
                    <input
                      className="form-input"
                      placeholder="Auto-filled from PIN Code"
                      value={profileData.state}
                      onChange={e => setProfileData({ ...profileData, state: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* FREELANCER SPECIFIC FIELDS */}
              {(roleSelection === 'freelancer' || roleSelection === 'both') && (
                <div>
                  {/* Tabs ONLY if work preference is 'both' */}
                  {(roleSelection === 'freelancer' ? freelancerPref : clientPref) === 'both' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      <button
                        type="button"
                        onClick={() => setActiveProfileTab('digital')}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: activeProfileTab === 'digital' ? '1px solid #7c3aed' : '1px solid var(--border-default)',
                          background: activeProfileTab === 'digital' ? 'rgba(124,58,237,0.2)' : 'transparent',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        💻 Digital Skills
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveProfileTab('physical')}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: activeProfileTab === 'physical' ? '1px solid #0ea5e9' : '1px solid var(--border-default)',
                          background: activeProfileTab === 'physical' ? 'rgba(14,165,233,0.2)' : 'transparent',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        📍 Local Skills
                      </button>
                    </div>
                  )}

                  {((roleSelection === 'freelancer' ? freelancerPref : clientPref) === 'both' ? activeProfileTab === 'digital' : (roleSelection === 'freelancer' ? freelancerPref : clientPref) === 'digital') ? (
                    <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.75rem' }}>
                        Select Digital Skills
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {DIGITAL_SKILLS.map(s => {
                          const isSel = profileData.selectedDigitalSkills.includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => toggleSkill(s, 'digital')}
                              style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: 'var(--radius-full)',
                                border: isSel ? '1px solid #7c3aed' : '1px solid var(--border-default)',
                                background: isSel ? '#7c3aed' : 'rgba(255,255,255,0.04)',
                                color: 'white',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              {isSel ? '✓ ' : '+ '}{s}
                            </button>
                          );
                        })}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                        <div>
                          <label className="input-label">Hourly Rate (₹)</label>
                          <input
                            className="form-input"
                            placeholder="500"
                            value={profileData.hourlyRate}
                            onChange={e => setProfileData({ ...profileData, hourlyRate: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="input-label">Portfolio URL</label>
                          <input
                            className="form-input"
                            placeholder="https://github.com/myprofile"
                            value={profileData.portfolio}
                            onChange={e => setProfileData({ ...profileData, portfolio: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.75rem' }}>
                        Select Local Trade Skills
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {PHYSICAL_SKILLS.map(s => {
                          const isSel = profileData.selectedPhysicalSkills.includes(s);
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => toggleSkill(s, 'physical')}
                              style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: 'var(--radius-full)',
                                border: isSel ? '1px solid #0ea5e9' : '1px solid var(--border-default)',
                                background: isSel ? '#0ea5e9' : 'rgba(255,255,255,0.04)',
                                color: 'white',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              {isSel ? '✓ ' : '+ '}{s}
                            </button>
                          );
                        })}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                        <div>
                          <label className="input-label">Service Radius (km)</label>
                          <input
                            className="form-input"
                            placeholder="10"
                            value={profileData.serviceRadius}
                            onChange={e => setProfileData({ ...profileData, serviceRadius: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="input-label">Working Hours</label>
                          <input
                            className="form-input"
                            placeholder="9 AM - 6 PM"
                            value={profileData.workingHours}
                            onChange={e => setProfileData({ ...profileData, workingHours: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate('/dashboard')}
                  style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}
                >
                  Skip for now
                </button>
                <button
                  className="btn-hero-primary"
                  onClick={handleSaveProfile}
                  disabled={loading}
                  style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
                >
                  {loading ? 'Saving...' : 'Enter Marketplace'} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
