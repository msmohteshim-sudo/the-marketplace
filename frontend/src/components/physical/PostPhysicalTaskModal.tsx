import React, { useState } from 'react';
import { X, MapPin, Zap, AlertTriangle, Briefcase, Plus, CheckCircle2 } from 'lucide-react';
import { profileApi } from '../../services/api';

interface PostPhysicalTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: (newTask: any) => void;
}

const CATEGORIES = [
  'Errands & Pickup', 'Electrician', 'Plumber', 'Painting', 'Carpenter',
  'Home Cleaning', 'Movers & Packers', 'Device Repair', 'AC & Appliance',
  'Locksmith', 'Gardening & Lawn', 'Construction & Masonry', 'Event Staff'
];

export const PostPhysicalTaskModal: React.FC<PostPhysicalTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated
}) => {
  if (!isOpen) return null;

  const [taskType, setTaskType] = useState<'quick' | 'urgent' | 'project'>('quick');

  const [form, setForm] = useState({
    title: '',
    category: 'Errands & Pickup',
    description: '',
    pincode: '',
    city: '',
    state: '',
    budgetMin: '500',
    budgetMax: '1500',
    preferredTime: 'Within 2 hours',
    duration: '1-2 hours',
    workerCount: '1',
    skillsText: ''
  });

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeMsg, setPincodeMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePincodeChange = async (val: string) => {
    const cleanPin = val.replace(/\D/g, '').slice(0, 6);
    setForm(prev => ({ ...prev, pincode: cleanPin }));
    setPincodeMsg('');

    if (cleanPin.length === 6) {
      setPincodeLoading(true);
      try {
        const res = await profileApi.pincodeLookup(cleanPin);
        if (res.success && res.district && res.state) {
          setForm(prev => ({ ...prev, city: res.district, state: res.state }));
          setPincodeMsg(`✓ Auto-filled: ${res.district}, ${res.state}`);
        } else {
          setPincodeMsg(`✓ Location set for PIN Code ${cleanPin}`);
        }
      } catch (e) {
        setPincodeMsg(`✓ PIN Code ${cleanPin} entered`);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError('Please provide a title and detailed task description.');
      return;
    }

    setLoading(true);
    setError('');

    const newTask = {
      id: `task-posted-${Date.now()}`,
      title: form.title.trim(),
      category: form.category,
      taskType,
      description: form.description.trim(),
      location: form.city && form.state ? `${form.city}, ${form.state}` : 'Latur, Maharashtra',
      pincode: form.pincode || '413512',
      distance: '1.5 km away',
      duration: taskType === 'urgent' ? 'Immediate' : form.duration,
      budgetMin: parseInt(form.budgetMin) || 500,
      budgetMax: parseInt(form.budgetMax) || 1500,
      urgencyLabel: taskType === 'urgent' ? 'ARRIVING IN 20-30 MIN' : 'NEXT 24 HOURS',
      availableNow: taskType === 'urgent',
      workerRating: 4.9,
      workerReviewsCount: 18,
      completedJobsCount: 42,
      workerName: 'Nearby Local Verified Worker',
      skills: form.skillsText ? form.skillsText.split(',').map(s => s.trim()) : [form.category],
      workerCount: parseInt(form.workerCount) || 1,
      createdAt: 'Just now'
    };

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      if (onTaskCreated) onTaskCreated(newTask);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content glass-card"
        style={{
          maxWidth: 600,
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-purple-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CREATE A LOCAL TASK
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              What Do You Need Done?
            </h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(52,211,153,0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={28} />
            </div>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Task Posted Successfully!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your task is now live on the Local Marketplace. Nearby workers are being notified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Task Type Tabs */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Select Work Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setTaskType('quick'); setForm(f => ({ ...f, budgetMin: '300', budgetMax: '800' })); }}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: taskType === 'quick' ? '2px solid #7c3aed' : '1px solid var(--border-default)',
                    background: taskType === 'quick' ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                    color: 'white',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Zap size={16} color="#a78bfa" />
                  <span>⚡ Quick Work</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>5m – 24h</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setTaskType('urgent'); setForm(f => ({ ...f, budgetMin: '500', budgetMax: '1500' })); }}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: taskType === 'urgent' ? '2px solid #f43f5e' : '1px solid var(--border-default)',
                    background: taskType === 'urgent' ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.03)',
                    color: 'white',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <AlertTriangle size={16} color="#f43f5e" />
                  <span>🚨 Urgent Work</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Same-Day</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setTaskType('project'); setForm(f => ({ ...f, budgetMin: '5000', budgetMax: '15000' })); }}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: taskType === 'project' ? '2px solid #0ea5e9' : '1px solid var(--border-default)',
                    background: taskType === 'project' ? 'rgba(14,165,233,0.2)' : 'rgba(255,255,255,0.03)',
                    color: 'white',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Briefcase size={16} color="#38bdf8" />
                  <span>🏗️ Project</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>24+ Hours</span>
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 'var(--radius-md)', color: '#f43f5e', marginBottom: '1rem', fontSize: '0.825rem' }}>
                {error}
              </div>
            )}

            {/* Title & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.875rem', marginBottom: '1rem' }}>
              <div>
                <label className="input-label">Task Title *</label>
                <input
                  className="form-input"
                  placeholder={taskType === 'urgent' ? 'e.g. Electrician needed for short circuit' : 'e.g. Pick up documents from SBI main branch'}
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="input-label">Category</label>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Detailed Task Instructions *</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Describe what needs to be done, specific requirements or items to collect..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            {/* PIN Code Auto-Fill Location */}
            <div style={{ padding: '0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="input-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} color="#38bdf8" /> Location PIN Code (Auto-Fills City & State)
                </label>
                {pincodeLoading && <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>Looking up PIN code...</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <input
                  className="form-input"
                  placeholder="PIN Code (6 digits)"
                  maxLength={6}
                  value={form.pincode}
                  onChange={e => handlePincodeChange(e.target.value)}
                />
                <input
                  className="form-input"
                  placeholder="City (Auto-filled)"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                />
                <input
                  className="form-input"
                  placeholder="State (Auto-filled)"
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })}
                />
              </div>
              {pincodeMsg && (
                <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, marginTop: '0.35rem' }}>
                  {pincodeMsg}
                </div>
              )}
            </div>

            {/* Budget & Time / Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="input-label">Min Budget (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.budgetMin}
                  onChange={e => setForm({ ...form, budgetMin: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Max Budget (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.budgetMax}
                  onChange={e => setForm({ ...form, budgetMax: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">{taskType === 'urgent' ? 'Required Arrival' : 'Estimated Duration'}</label>
                <input
                  className="form-input"
                  placeholder={taskType === 'urgent' ? 'Within 30 mins' : '1-2 hours'}
                  value={form.duration}
                  onChange={e => setForm({ ...form, duration: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.65rem 1.5rem', fontWeight: 800 }}>
                {loading ? 'Posting Task...' : 'POST LOCAL TASK NOW'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
