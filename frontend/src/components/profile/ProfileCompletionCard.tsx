import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
}

interface ProfileCompletionCardProps {
  percentage: number;
  checklist: ChecklistItem[];
  onSelectMissing?: (itemKey: string) => void;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  percentage,
  checklist,
  onSelectMissing
}) => {
  const missingItems = checklist.filter(c => !c.completed);

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.75rem',
        marginBottom: '1.75rem',
        border: '1px solid rgba(167,139,250,0.3)',
        background: 'rgba(20,15,38,0.85)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Sparkles size={18} color="#a78bfa" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              PROFILE COMPLETION STATUS
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Complete your profile to improve client trust, unlock high-tier matching, and boost project visibility.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: percentage >= 80 ? '#34d399' : percentage >= 50 ? '#fbbf24' : '#f43f5e' }}>
            {percentage}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {percentage >= 80 ? 'Marketplace Ready' : 'Action Required'}
          </div>
        </div>
      </div>

      {/* Progress Bar Visual [████████████░░░░░░] */}
      <div
        style={{
          width: '100%',
          height: 10,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          marginBottom: '1.25rem',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #7c3aed 0%, #0ea5e9 50%, #10b981 100%)',
            transition: 'width 0.5s ease',
            borderRadius: 'var(--radius-full)'
          }}
        />
      </div>

      {/* Checklist Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
        {checklist.map(item => (
          <div
            key={item.id}
            onClick={() => !item.completed && onSelectMissing && onSelectMissing(item.id)}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              background: item.completed ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)',
              border: item.completed ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(245,158,11,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: item.completed ? 'default' : 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {item.completed ? (
                <CheckCircle2 size={16} color="#34d399" />
              ) : (
                <AlertCircle size={16} color="#fbbf24" />
              )}
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: item.completed ? '#34d399' : '#fbbf24' }}>
                {item.label}
              </span>
            </div>

            {!item.completed && (
              <span style={{ fontSize: '0.7rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '2px' }}>
                Fix <ArrowRight size={11} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
