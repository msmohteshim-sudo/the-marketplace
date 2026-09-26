import React, { useState } from 'react';
import {
  X, MapPin, Clock, DollarSign, Star, ShieldCheck, Heart, Share2, MessageSquare, Briefcase, CheckCircle2, User, AlertCircle
} from 'lucide-react';
import { isItemSaved, toggleSaveItem } from '../../utils/savedHelper';

export interface PhysicalTaskItem {
  id: string;
  title: string;
  category: string;
  taskType: 'quick' | 'urgent' | 'project';
  description: string;
  location: string;
  pincode?: string;
  distance: string;
  duration: string;
  budgetMin: number;
  budgetMax: number;
  urgencyLabel?: string;
  availableNow?: boolean;
  workerRating: number;
  workerReviewsCount: number;
  completedJobsCount: number;
  workerName?: string;
  workerPhoto?: string;
  skills: string[];
  workerCount?: number;
  preferredDate?: string;
  clientRequirements?: string;
  createdAt?: string;
}

interface PhysicalTaskDetailModalProps {
  task: PhysicalTaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestWork?: (task: PhysicalTaskItem) => void;
}

export const PhysicalTaskDetailModal: React.FC<PhysicalTaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onRequestWork
}) => {
  if (!isOpen || !task) return null;

  const [saved, setSaved] = useState(() => isItemSaved(task.taskType === 'project' ? 'physical_project' : task.taskType === 'urgent' ? 'urgent_work' : 'quick_work', task.id));
  const [requested, setRequested] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const entityType = task.taskType === 'project' ? 'physical_project' : task.taskType === 'urgent' ? 'urgent_work' : 'quick_work';
    const newState = await toggleSaveItem(entityType, task.id, {
      title: task.title,
      summary: task.description,
      price: task.budgetMin,
      category: task.category,
      creatorName: task.workerName || 'Local Worker',
      link: `/tasks/${task.id}`
    });
    setSaved(newState);
  };

  const handleRequestWorkClick = () => {
    setRequested(true);
    if (onRequestWork) onRequestWork(task);
    setTimeout(() => {
      setRequested(false);
      onClose();
    }, 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content glass-card"
        style={{
          maxWidth: 680,
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span className={`badge ${task.taskType === 'urgent' ? 'badge-rose' : task.taskType === 'project' ? 'badge-blue' : 'badge-purple'}`} style={{ fontSize: '0.72rem', fontWeight: 800 }}>
                {task.taskType === 'urgent' ? '🚨 URGENT SAME-DAY' : task.taskType === 'project' ? '🏗️ PHYSICAL PROJECT' : '⚡ QUICK LOCAL WORK'}
              </span>
              <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>
                {task.category}
              </span>
              {task.availableNow && (
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                  🟢 Available Now
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
              {task.title}
            </h2>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Success Alert Banner if Requested */}
        {requested && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 'var(--radius-md)', color: '#34d399', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} /> Request sent successfully! Nearby worker will respond shortly.
          </div>
        )}

        {/* Key Task Highlights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {/* Budget */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>ESTIMATED BUDGET</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', fontFamily: 'Space Grotesk' }}>
              ₹{task.budgetMin.toLocaleString()} {task.budgetMax > task.budgetMin ? `– ₹${task.budgetMax.toLocaleString()}` : ''}
            </span>
          </div>

          {/* Location & Distance */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>LOCATION / DISTANCE</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} color="#38bdf8" /> {task.location} ({task.distance})
            </span>
          </div>

          {/* Duration / Arrival */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>ESTIMATED DURATION</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={14} color="#a78bfa" /> {task.duration}
            </span>
          </div>

          {/* Rating */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>WORKER RATING</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" /> {task.workerRating} ({task.workerReviewsCount} jobs)
            </span>
          </div>
        </div>

        {/* Task Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            TASK DESCRIPTION
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', margin: 0 }}>
            {task.description}
          </p>
        </div>

        {/* Required Trade Skills */}
        {task.skills && task.skills.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              REQUIRED SKILLS & TOOLS
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {task.skills.map(skill => (
                <span key={skill} className="badge badge-purple" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location Privacy Note */}
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#60a5fa' }}>
          <AlertCircle size={16} />
          <span>Location Privacy: Exact house address is kept private and shared only after worker selection.</span>
        </div>

        {/* Action Buttons Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleSave}
              className={`btn ${saved ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.85rem', gap: '0.35rem', color: saved ? '#ec4899' : 'var(--text-muted)' }}
            >
              <Heart size={16} fill={saved ? '#ec4899' : 'none'} color={saved ? '#ec4899' : 'currentColor'} />
              {saved ? 'Saved' : 'Save'}
            </button>
            <button onClick={handleShare} className="btn btn-ghost" style={{ fontSize: '0.85rem', gap: '0.35rem' }}>
              <Share2 size={16} /> {shareCopied ? 'Copied Link!' : 'Share'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button onClick={onClose} className="btn btn-ghost">
              Close
            </button>
            <button
              onClick={handleRequestWorkClick}
              className="btn btn-primary"
              disabled={requested}
              style={{ padding: '0.65rem 1.5rem', fontWeight: 800 }}
            >
              {task.taskType === 'urgent' ? '⚡ REQUEST NOW' : task.taskType === 'project' ? '🏗️ SEND PROPOSAL / HIRE' : '🤝 REQUEST THIS WORK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
