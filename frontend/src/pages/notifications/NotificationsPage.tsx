import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, X, ExternalLink, Zap, Lightbulb, Briefcase, DollarSign, Star, UserCheck, ShieldCheck, Clock } from 'lucide-react';
import { notificationsApi } from '../../services/api';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    setLoading(true);
    notificationsApi.getAll()
      .then(res => setNotifications(res.notifications || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleMarkAllRead = () => {
    notificationsApi.markAllRead().then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    });
  };

  const handleSelectNotification = (n: any) => {
    setSelectedNotif(n);
    if (!n.isRead) {
      // Optimistically update UI and mark read on backend
      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item));
      notificationsApi.markRead(n.id).catch(() => {});
    }
  };

  const getCategoryMeta = (title: string) => {
    if (title.includes('Proposal')) {
      return { label: 'PROPOSAL', color: '#38bdf8', bg: 'rgba(14,165,233,0.15)', icon: Briefcase, actionText: 'View Proposals & Applicants', link: '/jobs' };
    } else if (title.includes('Order') || title.includes('Quick Work')) {
      return { label: 'QUICK WORK', color: '#a78bfa', bg: 'rgba(124,58,237,0.15)', icon: Zap, actionText: 'Review Delivered Files', link: '/dashboard' };
    } else if (title.includes('Idea')) {
      return { label: 'IDEAS MARKETPLACE', color: '#fbbf24', bg: 'rgba(245,158,11,0.15)', icon: Lightbulb, actionText: 'Open Ideas Vault', link: '/dashboard' };
    } else if (title.includes('Escrow') || title.includes('Milestone') || title.includes('₹')) {
      return { label: 'ESCROW PAYMENT', color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: DollarSign, actionText: 'View Financial Summary', link: '/dashboard' };
    } else {
      return { label: 'RECOMMENDATION', color: '#f43f5e', bg: 'rgba(244,63,94,0.15)', icon: UserCheck, actionText: 'View Matched Profile', link: '/services' };
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Stay updated on your orders, proposals, ideas, and messages</p>
        </div>
        {notifications.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-state-icon"><Bell size={32} /></div>
          <h3>All Caught Up!</h3>
          <p>You have no notifications at this time.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map(n => {
            const meta = getCategoryMeta(n.title);
            const Icon = meta.icon;

            return (
              <div
                key={n.id}
                onClick={() => handleSelectNotification(n)}
                className="glass-card-hover"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  cursor: 'pointer',
                  background: n.isRead ? 'var(--bg-glass)' : 'rgba(124,58,237,0.08)',
                  borderColor: n.isRead ? 'var(--border-default)' : 'var(--border-brand)',
                  position: 'relative'
                }}
              >
                {!n.isRead && (
                  <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: 8, height: 8, borderRadius: '50%', background: '#a78bfa' }} />
                )}

                <div style={{ width: 42, height: 42, background: meta.bg, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color, flexShrink: 0 }}>
                  <Icon size={20} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', background: meta.bg, color: meta.color, letterSpacing: '0.05em' }}>
                      {meta.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem', lineHeight: 1.3 }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                    {n.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NOTIFICATION DETAIL MODAL */}
      {selectedNotif && (() => {
        const meta = getCategoryMeta(selectedNotif.title);
        const Icon = meta.icon;

        return (
          <div className="modal-backdrop" onClick={() => setSelectedNotif(null)}>
            <div className="modal-content glass-card" style={{ maxWidth: 550, padding: '1.75rem' }} onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 44, height: 44, background: meta.bg, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: meta.bg, color: meta.color, letterSpacing: '0.05em' }}>
                      {meta.label}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={12} /> {new Date(selectedNotif.createdAt).toLocaleDateString()} at {new Date(selectedNotif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <button className="modal-close-btn" onClick={() => setSelectedNotif(null)}>
                  <X size={18} />
                </button>
              </div>

              {/* Modal Title & Body */}
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.35 }}>
                {selectedNotif.title}
              </h2>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedNotif.body}
              </div>

              {/* Extended Details Card */}
              <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  MARKETPLACE AUDIT LOG
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                  <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={14} /> Verified & Active
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Recipient Account:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Client Digital Dashboard</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Escrow Protection:</span>
                  <span style={{ color: meta.color, fontWeight: 600 }}>100% Protected</span>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedNotif(null)}>
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedNotif(null);
                    navigate(meta.link);
                  }}
                  style={{ background: meta.color.includes('a78bfa') ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : undefined }}
                >
                  {meta.actionText} <ExternalLink size={14} />
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
