import React, { useState } from 'react';
import {
  X, Lightbulb, CheckCircle2, ShieldCheck, DollarSign, Code, Target, Layers, Rocket, Users, MessageSquare
} from 'lucide-react';
import { ideasApi, savedApi } from '../../services/api';

interface IdeaDetailModalProps {
  idea: any;
  isOpen: boolean;
  onClose: () => void;
  onBuyIdea: (idea: any) => void;
  onBuildIdea: (idea: any) => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  isOpen,
  onClose,
  onBuyIdea,
  onBuildIdea
}) => {
  if (!isOpen || !idea) return null;

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    savedApi.save('idea', idea.id).then(() => setIsSaved(true)).catch(() => {});
  };

  const estDevCost = idea.estDevCost || '₹25,000 – ₹50,000';
  const bizModel = idea.businessModel || 'Subscription (SaaS)';
  const price = idea.price ? `₹${idea.price.toLocaleString()}` : '₹999';

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="glass-card" style={{ maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', borderRadius: 'var(--radius-lg)', position: 'relative', border: '1px solid rgba(245,158,11,0.4)', background: '#120d1d' }}>
        
        {/* Close button */}
        <button
          className="btn-icon"
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--text-muted)' }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
            <Lightbulb size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                {idea.category?.name || idea.industry || 'Technology'}
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <ShieldCheck size={11} /> Verified Concept
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {idea.title}
            </h2>
          </div>
        </div>

        {/* Quick Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Idea Price</span>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'Space Grotesk' }}>
              {price}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Est. Development Cost</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {estDevCost}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Business Model</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
              {bizModel}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {/* Summary / Overview */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.4rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Rocket size={15} color="#f59e0b" /> Executive Overview
            </h4>
            <p style={{ lineHeight: 1.6 }}>{idea.summary || 'An innovative digital product concept designed to solve core workflow challenges.'}</p>
          </div>

          {/* Problem & Solution */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h5 style={{ color: '#f87171', margin: '0 0 0.4rem 0', fontSize: '0.85rem' }}>The Problem</h5>
              <p style={{ fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                {idea.problem || 'Existing solutions are fragmented, high-friction, and lack modern automation for end users.'}
              </p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(34,197,94,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <h5 style={{ color: '#4ade80', margin: '0 0 0.4rem 0', fontSize: '0.85rem' }}>The Proposed Solution</h5>
              <p style={{ fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                {idea.solution || 'An end-to-end automated digital platform with intuitive UI and turnkey monetisation hooks.'}
              </p>
            </div>
          </div>

          {/* Core Features & Scope */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={15} color="#a78bfa" /> MVP Core Features
            </h4>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
              <li>User Authentication & Role-based Dashboard</li>
              <li>Automated Workflow Engine & AI Integrations</li>
              <li>Stripe / UPI Payment Gateway Integration</li>
              <li>Real-time Notifications & Analytics Panel</li>
            </ul>
          </div>

          {/* Suggested Tech Stack */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Code size={15} color="#38bdf8" /> Recommended Tech Stack
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'OpenAI API'].map(tech => (
                <span key={tech} className="badge badge-blue" style={{ fontSize: '0.75rem' }}>{tech}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={`btn ${isSaved ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={handleSave}>
              {isSaved ? 'Saved' : 'Save Idea'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onBuyIdea(idea);
              }}
              style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
            >
              Buy Idea Concept ({price})
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onBuildIdea(idea);
              }}
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)', border: 'none' }}
            >
              <Rocket size={16} /> Hire Freelancer to Build It
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
