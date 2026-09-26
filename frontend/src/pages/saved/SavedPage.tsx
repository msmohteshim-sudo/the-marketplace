import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, Wrench, Briefcase, Lightbulb, User, ArrowRight, GraduationCap, Zap, AlertTriangle, MapPin } from 'lucide-react';
import { savedApi } from '../../services/api';
import { Link } from 'react-router-dom';
import { getLocalSavedItems, toggleSaveItem, SavedItemData } from '../../utils/savedHelper';

export const SavedPage: React.FC = () => {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'quick_work' | 'urgent_work' | 'physical_project' | 'local_worker' | 'services' | 'projects' | 'ideas'>('all');

  const loadAllSaved = () => {
    setLoading(true);
    savedApi.getAll()
      .then(res => {
        const apiItems = res.saved || [];
        const localItems = getLocalSavedItems();

        const combined = [...apiItems];
        localItems.forEach(loc => {
          if (!combined.some(item => (item.entityType === loc.entityType && (item.entityId === loc.entityId || item.id === loc.entityId)))) {
            combined.push({
              id: loc.id,
              entityType: loc.entityType,
              entityId: loc.entityId,
              title: loc.title,
              summary: loc.summary,
              price: loc.price,
              category: loc.category,
              creatorName: loc.creatorName,
              link: loc.link,
              raw: loc.raw
            });
          }
        });

        setSaved(combined);
      })
      .catch(() => {
        setSaved(getLocalSavedItems());
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAllSaved();
    window.addEventListener('saved_items_updated', loadAllSaved);
    return () => window.removeEventListener('saved_items_updated', loadAllSaved);
  }, []);

  const handleUnsave = async (entityType: string, entityId: string) => {
    await toggleSaveItem(entityType as any, entityId);
    setSaved(prev => prev.filter(s => !(s.entityType === entityType && (s.entityId === entityId || s.id === entityId))));
  };

  const quickTasksList = saved.filter(s => s.entityType === 'quick_work');
  const urgentTasksList = saved.filter(s => s.entityType === 'urgent_work');
  const physicalProjectsList = saved.filter(s => s.entityType === 'physical_project');
  const localWorkersList = saved.filter(s => s.entityType === 'local_worker' || s.entityType === 'profile');
  const servicesList = saved.filter(s => s.entityType === 'service');
  const projectsList = saved.filter(s => s.entityType === 'job');
  const ideasList = saved.filter(s => s.entityType === 'idea');

  const getFilteredItems = () => {
    if (activeTab === 'quick_work') return quickTasksList;
    if (activeTab === 'urgent_work') return urgentTasksList;
    if (activeTab === 'physical_project') return physicalProjectsList;
    if (activeTab === 'local_worker') return localWorkersList;
    if (activeTab === 'services') return servicesList;
    if (activeTab === 'projects') return projectsList;
    if (activeTab === 'ideas') return ideasList;
    return saved;
  };

  const currentItems = getFilteredItems();

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Bookmark size={22} color="#ec4899" />
          <h1 className="page-title" style={{ fontSize: '1.5rem', margin: 0 }}>SAVED ITEMS</h1>
        </div>
        <p className="page-subtitle">Organized collection of your bookmarked local tasks, urgent work, physical projects, workers and services.</p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: `All Items (${saved.length})`, icon: Bookmark, color: '#ec4899' },
          { id: 'quick_work', label: `Quick Tasks (${quickTasksList.length})`, icon: Zap, color: '#a78bfa' },
          { id: 'urgent_work', label: `Urgent Work (${urgentTasksList.length})`, icon: AlertTriangle, color: '#f43f5e' },
          { id: 'physical_project', label: `Projects (${physicalProjectsList.length})`, icon: Briefcase, color: '#38bdf8' },
          { id: 'local_worker', label: `Workers (${localWorkersList.length})`, icon: User, color: '#34d399' },
          { id: 'services', label: `Services (${servicesList.length})`, icon: Wrench, color: '#a78bfa' },
          { id: 'projects', label: `Digital Jobs (${projectsList.length})`, icon: Briefcase, color: '#60a5fa' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                borderColor: isActive ? tab.color : undefined
              }}
            >
              <Icon size={14} color={isActive ? 'white' : tab.color} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : currentItems.length === 0 ? (
        <div className="empty-state glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="empty-state-icon" style={{ margin: '0 auto 1rem auto', width: 48, height: 48, borderRadius: '50%', background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
            <Bookmark size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No Saved Items in this Category</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto' }}>
            Click the "Save" button on any Quick Work task, Urgent Help request, Physical Project, or Local Worker to bookmark it here!
          </p>
        </div>
      ) : (
        <div className="marketplace-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
          {currentItems.map(item => {
            const title = item.title || item.service?.title || item.job?.title || 'Saved Item';
            const entityType = item.entityType || 'service';
            const entityId = item.entityId || item.id;
            const price = item.price || item.service?.packages?.[0]?.price || item.job?.budgetMin || 0;
            const link = item.link || `/tasks/${entityId}`;

            return (
              <div key={item.id} className="glass-card-hover" style={{ padding: '1.25rem', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span className={`badge ${entityType === 'urgent_work' ? 'badge-rose' : entityType === 'physical_project' ? 'badge-blue' : 'badge-purple'}`} style={{ textTransform: 'capitalize', fontSize: '0.65rem' }}>
                      {entityType.replace('_', ' ')}
                    </span>

                    <button
                      className="btn-icon"
                      onClick={() => handleUnsave(entityType, entityId)}
                      style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.1)', padding: '0.3rem', borderRadius: 'var(--radius-sm)' }}
                      title="Remove from saved"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                    {title}
                  </h3>

                  {item.summary && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                      {item.summary}
                    </p>
                  )}
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ec4899', fontFamily: 'Space Grotesk' }}>
                    {price ? `₹${price.toLocaleString()}` : 'Free / Open'}
                  </div>

                  <Link to={link} className="btn btn-primary btn-sm" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    View Item <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
