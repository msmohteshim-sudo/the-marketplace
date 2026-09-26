import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, Briefcase, Lightbulb, ArrowRight, Star, Clock, Zap, Plus, Sparkles, Laptop, Search, Bookmark, CheckCircle2, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clientDigitalApi } from '../../services/api';
import { QuickWorkSection } from '../../components/dashboard/QuickWorkSection';
import { DigitalProjectsSection } from '../../components/dashboard/DigitalProjectsSection';
import { IdeasMarketplaceSection } from '../../components/dashboard/IdeasMarketplaceSection';
import { PurchasedIdeasSection } from '../../components/ideas/PurchasedIdeasSection';
import { PostDigitalJobModal } from '../../components/jobs/PostDigitalJobModal';
import { PhysicalClientDashboard } from '../../components/dashboard/PhysicalClientDashboard';
import { DigitalFreelancerDashboard } from '../../components/dashboard/DigitalFreelancerDashboard';
import { PhysicalFreelancerDashboard } from '../../components/dashboard/PhysicalFreelancerDashboard';
import { getLocalSavedItems } from '../../utils/savedHelper';

export const DashboardPage: React.FC = () => {
  const { user, switchWorkType } = useAuth();
  const navigate = useNavigate();

  const mode = user?.activeMode || 'client';
  const workType = user?.activeWorkType || 'digital';
  const isPhysicalClient = mode === 'client' && workType === 'physical';

  // Summary Metrics
  const [summary, setSummary] = useState({
    activeProjects: 2,
    openProposals: 8,
    savedItems: 14,
    purchasedIdeas: 3
  });

  // Recommended items
  const [recommendations, setRecommendations] = useState<any>({ services: [], ideas: [] });

  // Post Digital Job modal state
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [postJobPrefill, setPostJobPrefill] = useState<any>(null);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  const updateSavedCount = () => {
    const localSaved = getLocalSavedItems();
    setSummary(prev => ({ ...prev, savedItems: Math.max(localSaved.length, prev.savedItems || 0) }));
  };

  useEffect(() => {
    // Fetch summary metrics from backend
    clientDigitalApi.getSummary()
      .then(res => {
        if (res.summary) {
          const localSaved = getLocalSavedItems();
          setSummary({
            ...res.summary,
            savedItems: Math.max(localSaved.length, res.summary.savedItems || 0)
          });
        }
      })
      .catch(() => {
        updateSavedCount();
      });

    // Fetch recommendations
    clientDigitalApi.getRecommendations()
      .then(res => setRecommendations(res))
      .catch(() => {});

    updateSavedCount();
    window.addEventListener('saved_items_updated', updateSavedCount);
    return () => window.removeEventListener('saved_items_updated', updateSavedCount);
  }, [mode, workType]);

  const displayName = user?.fullName?.split(' ')[0] || 'Client';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBuildIdea = (idea: any) => {
    setPostJobPrefill({
      title: `Build ${idea.title}`,
      description: `I have purchased the concept for "${idea.title}". Summary: ${idea.summary}\n\nProblem to solve: ${idea.problem || 'Standard market problem'}\nSolution required: ${idea.solution || 'Turnkey digital solution'}`,
      skills: ['React', 'Node.js', 'AI API'],
      budgetMin: 25000,
      budgetMax: 50000
    });
    setShowPostJobModal(true);
  };

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (isPhysicalClient) {
    return <PhysicalClientDashboard />;
  }

  if (mode === 'freelancer' && workType === 'physical') {
    return <PhysicalFreelancerDashboard />;
  }

  if (mode === 'freelancer') {
    return <DigitalFreelancerDashboard />;
  }

  return (
    <div>
      {/* ───────────────────────────────────────────────────────── */}
      {/* CLIENT DIGITAL HEADER BANNER                              */}
      {/* ───────────────────────────────────────────────────────── */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(14,165,233,0.15) 100%)',
          border: '1px solid rgba(167,139,250,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                {greeting}, <span className="gradient-text">{displayName}</span> 👋
              </span>
            </div>

            {/* Badges: CLIENT DIGITAL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                CLIENT MODE
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Laptop size={12} /> DIGITAL
              </span>
              {(user?.clientWorkPreference === 'both' || user?.activeWorkType === 'both') && (
                <button
                  type="button"
                  onClick={() => switchWorkType('physical')}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(52,211,153,0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(52,211,153,0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  title="Switch to Physical / Local Client view"
                >
                  <RefreshCw size={11} /> Switch to Physical Client
                </button>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px' }}>
              Find digital professionals, quick services, projects and ready-to-use ideas.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => scrollToSection('sec-quick-work')}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              ⚡ Browse Quick Work
            </button>
            <button
              onClick={() => scrollToSection('sec-projects')}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              💼 Explore Projects
            </button>
            <button
              onClick={() => scrollToSection('sec-ideas')}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              💡 Explore Ideas
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* YOUR ACTIVITY SUMMARY CARDS                               */}
      {/* ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
          YOUR ACTIVITY
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Active Projects */}
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #0ea5e9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE PROJECTS</span>
              <Briefcase size={16} color="#0ea5e9" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              {summary.activeProjects}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Orders & in-progress tasks</div>
          </div>

          {/* Open Proposals */}
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>OPEN PROPOSALS</span>
              <Sparkles size={16} color="#a78bfa" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              {summary.openProposals}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Received on your posted jobs</div>
          </div>

          {/* Saved Items */}
          <Link to="/saved" className="glass-card-hover" style={{ padding: '1.25rem', borderLeft: '4px solid #ec4899', textDecoration: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>SAVED ITEMS</span>
              <Bookmark size={16} color="#ec4899" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              {summary.savedItems}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Bookmarked services & projects</div>
          </Link>

          {/* Purchased Ideas */}
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>PURCHASED IDEAS</span>
              <Lightbulb size={16} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              {summary.purchasedIdeas}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Ready for developer matching</div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* SECTION 1 — ⚡ QUICK DIGITAL WORK                          */}
      {/* ───────────────────────────────────────────────────────── */}
      <div id="sec-quick-work">
        <QuickWorkSection />
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* SECTION 2 — 💼 DIGITAL PROJECTS & TASKS                    */}
      {/* ───────────────────────────────────────────────────────── */}
      <div id="sec-projects">
        <DigitalProjectsSection />
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* MY PURCHASED IDEAS (If Client owns purchased ideas)        */}
      {/* ───────────────────────────────────────────────────────── */}
      <PurchasedIdeasSection onBuildIdea={handleBuildIdea} />

      {/* ───────────────────────────────────────────────────────── */}
      {/* SECTION 3 — 💡 IDEAS MARKETPLACE                           */}
      {/* ───────────────────────────────────────────────────────── */}
      <div id="sec-ideas">
        <IdeasMarketplaceSection onBuildIdea={handleBuildIdea} />
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* RECOMMENDED FOR YOU                                       */}
      {/* ───────────────────────────────────────────────────────── */}
      {recommendations.services?.length > 0 && (
        <div className="section" style={{ marginBottom: '2rem' }}>
          <div className="section-header" style={{ marginBottom: '1.25rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} color="#a78bfa" /> RECOMMENDED FOR YOU
            </h2>
          </div>

          <div className="marketplace-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {recommendations.services.map((s: any) => (
              <Link key={s.id} to={`/services/${s.id}`} className="glass-card-hover" style={{ padding: '1.25rem', textDecoration: 'none', display: 'block' }}>
                <span className="badge badge-purple" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>Recommended</span>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>{s.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>{s.seller?.fullName}</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-purple-light)' }}>
                    ₹{(s.packages?.[0]?.price || 499).toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Post Digital Job Modal */}
      <PostDigitalJobModal
        isOpen={showPostJobModal}
        onClose={() => setShowPostJobModal(false)}
        prefillData={postJobPrefill}
        onJobPosted={() => {
          setSummary(prev => ({ ...prev, activeProjects: prev.activeProjects + 1 }));
        }}
      />
    </div>
  );
};
