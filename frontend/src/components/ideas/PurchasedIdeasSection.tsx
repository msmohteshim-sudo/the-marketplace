import React, { useState, useEffect } from 'react';
import { Lightbulb, Rocket, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { clientDigitalApi } from '../../services/api';

interface PurchasedIdeasSectionProps {
  onBuildIdea: (idea: any) => void;
}

export const PurchasedIdeasSection: React.FC<PurchasedIdeasSectionProps> = ({ onBuildIdea }) => {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientDigitalApi.getPurchasedIdeas()
      .then(res => setLicenses(res.licenses || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || licenses.length === 0) return null;

  return (
    <div className="section" style={{ marginBottom: '2.5rem' }}>
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
              <CheckCircle2 size={16} />
            </div>
            <h2 className="section-title" style={{ fontSize: '1.35rem', margin: 0 }}>MY PURCHASED IDEAS</h2>
            <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>READY TO DEVELOP</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Ideas and product concepts you own. Turn them into reality by hiring recommended freelancers.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {licenses.map(lic => {
          const idea = lic.idea;
          if (!idea) return null;

          return (
            <div
              key={lic.id}
              className="glass-card"
              style={{ padding: '1.35rem', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(13,28,21,0.85)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                  License Acquired
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Purchased {new Date(lic.purchasedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                {idea.title}
              </h3>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                {idea.summary}
              </p>

              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                🚀 Recommended Freelancer Skills: <strong>React, Node.js, AI API</strong>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #22c55e 0%, #059669 100%)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                onClick={() => onBuildIdea(idea)}
              >
                <Rocket size={16} /> BUILD THIS IDEA
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
