import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Check, Paperclip } from 'lucide-react';
import { clientDigitalApi } from '../../services/api';

interface PostDigitalJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobPosted?: (job: any) => void;
  prefillData?: {
    title?: string;
    description?: string;
    skills?: string[];
    budgetMin?: number;
    budgetMax?: number;
  };
}

export const PostDigitalJobModal: React.FC<PostDigitalJobModalProps> = ({
  isOpen,
  onClose,
  onJobPosted,
  prefillData
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(prefillData?.title || '');
  const [description, setDescription] = useState(prefillData?.description || '');
  const [category, setCategory] = useState('');
  const [skillsStr, setSkillsStr] = useState(prefillData?.skills?.join(', ') || '');
  const [budgetMin, setBudgetMin] = useState(prefillData?.budgetMin?.toString() || '');
  const [budgetMax, setBudgetMax] = useState(prefillData?.budgetMax?.toString() || '');
  const [paymentType, setPaymentType] = useState('fixed');
  const [duration, setDuration] = useState('1_2_weeks');
  const [experience, setExperience] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (prefillData) {
      if (prefillData.title) setTitle(prefillData.title);
      if (prefillData.description) setDescription(prefillData.description);
      if (prefillData.skills) setSkillsStr(prefillData.skills.join(', '));
      if (prefillData.budgetMin) setBudgetMin(prefillData.budgetMin.toString());
      if (prefillData.budgetMax) setBudgetMax(prefillData.budgetMax.toString());
    }
  }, [prefillData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a job title and description.');
      return;
    }

    setLoading(true);
    setError('');

    const skills = skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      const res = await clientDigitalApi.postDigitalJob({
        title,
        description,
        categoryId: category || undefined,
        skills,
        budgetMin: budgetMin ? parseFloat(budgetMin) : undefined,
        budgetMax: budgetMax ? parseFloat(budgetMax) : undefined,
        paymentType,
        duration,
        experience
      });

      setSuccess(true);
      if (onJobPosted) onJobPosted(res.job);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to post digital job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="glass-card" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', borderRadius: 'var(--radius-lg)', position: 'relative', border: '1px solid rgba(14,165,233,0.4)', background: '#0b1120' }}>
        
        {/* Close button */}
        <button className="btn-icon" onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--text-muted)' }}>
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
              <Plus size={18} />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              + POST A DIGITAL JOB
            </h2>
            <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>CLIENT DIGITAL</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Describe your digital requirements to receive custom proposals from top freelancers.
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#4ade80' }}>
            <Check size={40} style={{ margin: '0 auto 1rem auto' }} />
            <h3>Digital Job Posted Successfully!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Freelancers will start submitting proposals shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Title */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                Job Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Build Full Stack E-Commerce Web Application"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                Detailed Project Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                className="input-field"
                rows={4}
                placeholder="Describe your project goals, required deliverables, scope, and technical requirements..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Category & Payment Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  Category
                </label>
                <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  <option value="web-dev">Web Development</option>
                  <option value="mobile-dev">Mobile App Development</option>
                  <option value="ai-ml">AI & Data Science</option>
                  <option value="ui-ux">UI/UX Design</option>
                  <option value="programming">Software Engineering</option>
                  <option value="content">Content & Marketing</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  Payment Type
                </label>
                <select className="input-field" value={paymentType} onChange={e => setPaymentType(e.target.value)}>
                  <option value="fixed">Fixed Price</option>
                  <option value="milestone">Milestone Payments</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                Required Skills (Comma separated)
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. React, Node.js, TypeScript, Tailwind, Stripe"
                value={skillsStr}
                onChange={e => setSkillsStr(e.target.value)}
              />
            </div>

            {/* Budget Min / Max */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  Min Budget (₹)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 10000"
                  value={budgetMin}
                  onChange={e => setBudgetMin(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  Max Budget (₹)
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 25000"
                  value={budgetMax}
                  onChange={e => setBudgetMax(e.target.value)}
                />
              </div>
            </div>

            {/* Project Duration & Experience */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  Project Duration
                </label>
                <select className="input-field" value={duration} onChange={e => setDuration(e.target.value)}>
                  <option value="1_3_days">1–3 Days</option>
                  <option value="3_7_days">3–7 Days</option>
                  <option value="1_2_weeks">1–2 Weeks</option>
                  <option value="2_4_weeks">2–4 Weeks</option>
                  <option value="1_month">1+ Month</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.4rem' }}>
                  Required Experience
                </label>
                <select className="input-field" value={experience} onChange={e => setExperience(e.target.value)}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Posting Job...' : 'Publish Digital Job'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
