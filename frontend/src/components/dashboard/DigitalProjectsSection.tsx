import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Filter, Clock, Users, ArrowRight, X, Sparkles, Check, DollarSign, Calendar
} from 'lucide-react';
import { clientDigitalApi } from '../../services/api';
import { toggleSaveItem, isItemSaved } from '../../utils/savedHelper';

interface DigitalProjectsSectionProps {
  onSaveItem?: (entityType: string, entityId: string) => void;
}

export const DigitalProjectsSection: React.FC<DigitalProjectsSectionProps> = ({ onSaveItem }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [duration, setDuration] = useState('');
  const [experience, setExperience] = useState('');
  const [projectType, setProjectType] = useState('');
  const [postedDate, setPostedDate] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchProjects = () => {
    setLoading(true);
    const params: Record<string, string> = { limit: '6', sort };

    if (search) params.search = search;
    if (category) params.category = category;
    if (duration) params.duration = duration;
    if (experience) params.experience = experience;
    if (projectType) params.projectType = projectType;
    if (postedDate) params.postedDate = postedDate;

    if (budgetRange === 'under_5k') {
      params.maxBudget = '5000';
    } else if (budgetRange === '5k_10k') {
      params.minBudget = '5000';
      params.maxBudget = '10000';
    } else if (budgetRange === '10k_25k') {
      params.minBudget = '10000';
      params.maxBudget = '25000';
    } else if (budgetRange === '25k_50k') {
      params.minBudget = '25000';
      params.maxBudget = '50000';
    } else if (budgetRange === '50k_plus') {
      params.minBudget = '50000';
    }

    clientDigitalApi.getProjects(params)
      .then(res => {
        let items = res.projects || [];
        // High quality mock fallback for empty database state
        if (items.length === 0 && !search && !category && !budgetRange) {
          items = [
            {
              id: 'dp-1',
              title: 'Build Full Stack E-Commerce Web Application',
              category: { name: 'Web Development' },
              budgetMin: 25000,
              budgetMax: 40000,
              duration: '14 Days',
              createdAt: new Date().toISOString(),
              _count: { applications: 18 },
              skills: ['React', 'Node.js', 'MongoDB', 'Payment Gateway'],
              paymentType: 'fixed',
              experience: 'Expert'
            },
            {
              id: 'dp-2',
              title: 'Develop AI Customer Support Chatbot with RAG & OpenAI API',
              category: { name: 'AI & Machine Learning' },
              budgetMin: 15000,
              budgetMax: 30000,
              duration: '10 Days',
              createdAt: new Date().toISOString(),
              _count: { applications: 12 },
              skills: ['Python', 'FastAPI', 'LangChain', 'OpenAI', 'Pinecone'],
              paymentType: 'fixed',
              experience: 'Expert'
            },
            {
              id: 'dp-3',
              title: 'Create iOS & Android Cross-Platform Mobile App (Flutter)',
              category: { name: 'Mobile App Development' },
              budgetMin: 40000,
              budgetMax: 70000,
              duration: '30 Days',
              createdAt: new Date().toISOString(),
              _count: { applications: 24 },
              skills: ['Flutter', 'Dart', 'Firebase', 'REST API'],
              paymentType: 'milestone',
              experience: 'Intermediate'
            },
            {
              id: 'dp-4',
              title: 'Redesign Modern SaaS Product Brand Identity & UI Design System',
              category: { name: 'UI/UX Design' },
              budgetMin: 12000,
              budgetMax: 20000,
              duration: '7 Days',
              createdAt: new Date().toISOString(),
              _count: { applications: 9 },
              skills: ['Figma', 'UI/UX', 'Design System', 'Branding'],
              paymentType: 'fixed',
              experience: 'Intermediate'
            }
          ];
        }
        setProjects(items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, [category, budgetRange, duration, experience, projectType, postedDate, sort]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setBudgetRange('');
    setDuration('');
    setExperience('');
    setProjectType('');
    setPostedDate('');
    setSort('newest');
  };

  const handleSave = async (e: React.MouseEvent, p: any) => {
    e.preventDefault();
    e.stopPropagation();
    const isSavedNow = await toggleSaveItem('job', p.id, {
      title: p.title,
      summary: `Estimated Budget: ₹${p.budgetMin ? p.budgetMin.toLocaleString() : '10,000'}`,
      price: p.budgetMin || 10000,
      category: p.category?.name || 'Digital Project',
      creatorName: p.client?.fullName || 'Verified Client',
      link: `/jobs/${p.id}`,
      raw: p
    });

    setSavedIds(prev => {
      const next = new Set(prev);
      if (isSavedNow) next.add(p.id);
      else next.delete(p.id);
      return next;
    });

    if (onSaveItem) onSaveItem('job', p.id);
  };

  return (
    <div className="section" style={{ marginBottom: '2.5rem' }}>
      {/* Section Header */}
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
              <Briefcase size={16} />
            </div>
            <h2 className="section-title" style={{ fontSize: '1.35rem', margin: 0 }}>💼 DIGITAL PROJECTS & TASKS</h2>
            <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>SCOPE &gt; 24 HOURS</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Larger digital projects requiring dedicated milestones, custom scopes, and experienced freelancers.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters || category || budgetRange || duration ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Filter size={14} />
            <span>FILTERS</span>
            {(category || budgetRange || duration || experience || projectType) && (
              <span className="badge badge-blue" style={{ padding: '0.1rem 0.35rem', fontSize: '0.65rem' }}>Active</span>
            )}
          </button>

          <Link to="/jobs?type=digital" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-blue)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            SEE ALL <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(14,165,233,0.3)', background: 'rgba(15,23,42,0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={15} color="#38bdf8" /> Filter Digital Projects
            </span>
            <button className="btn-icon" onClick={() => setShowFilters(false)}>
              <X size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {/* Category */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Category</label>
              <select className="input-field" value={category} onChange={e => setCategory(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                <option value="">All Categories</option>
                <option value="web-dev">Web Development</option>
                <option value="mobile-dev">Mobile Apps</option>
                <option value="ai-ml">AI & ML</option>
                <option value="ui-ux">UI/UX Design</option>
                <option value="blockchain">Blockchain</option>
                <option value="devops">DevOps & Cloud</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Budget</label>
              <select className="input-field" value={budgetRange} onChange={e => setBudgetRange(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                <option value="">Any Budget</option>
                <option value="under_5k">Under ₹5,000</option>
                <option value="5k_10k">₹5,000 – ₹10,000</option>
                <option value="10k_25k">₹10,000 – ₹25,000</option>
                <option value="25k_50k">₹25,000 – ₹50,000</option>
                <option value="50k_plus">₹50,000+</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Project Duration</label>
              <select className="input-field" value={duration} onChange={e => setDuration(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                <option value="">Any Duration</option>
                <option value="1_3_days">1–3 Days</option>
                <option value="3_7_days">3–7 Days</option>
                <option value="1_2_weeks">1–2 Weeks</option>
                <option value="2_4_weeks">2–4 Weeks</option>
                <option value="1_month">1+ Month</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Experience Level</label>
              <select className="input-field" value={experience} onChange={e => setExperience(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* Project Type */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Payment Type</label>
              <select className="input-field" value={projectType} onChange={e => setProjectType(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                <option value="">All Types</option>
                <option value="fixed">Fixed Price</option>
                <option value="milestone">Milestone</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={handleClearFilters}>
              Clear Filters
            </button>
            <button className="btn btn-primary btn-sm" onClick={fetchProjects}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* List of Project Cards */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>No digital projects matching your filters.</p>
          <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>Reset Filters</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projects.map(p => {
            const skillsArr = Array.isArray(p.skills)
              ? p.skills
              : typeof p.skills === 'string'
              ? JSON.parse(p.skills || '[]')
              : ['React', 'Node.js'];
            const isSaved = savedIds.has(p.id);

            return (
              <div key={p.id} className="glass-card-hover" style={{ padding: '1.35rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                        {p.category?.name || 'Digital Project'}
                      </span>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                        {p.paymentType === 'fixed' ? 'Fixed Price' : p.paymentType === 'milestone' ? 'Milestone' : 'Hourly'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <Clock size={11} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                        Posted recently
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      {p.title}
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-blue)', fontFamily: 'Space Grotesk' }}>
                      ₹{p.budgetMin ? p.budgetMin.toLocaleString() : '10,000'}
                      {p.budgetMax ? ` – ₹${p.budgetMax.toLocaleString()}` : '+'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Est. Duration: <strong>{p.duration || '7-14 Days'}</strong>
                    </div>
                  </div>
                </div>

                {/* Skill Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                  {skillsArr.map((sk: string) => (
                    <span
                      key={sk}
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.72rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Footer bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>
                      <Users size={13} style={{ verticalAlign: 'middle', marginRight: '4px', color: '#38bdf8' }} />
                      <strong>{p._count?.applications || p.proposalsCount || 8}</strong> proposals received
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={(e) => handleSave(e, p)}
                      className={`btn ${isSaved || isItemSaved('job', p.id) ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    >
                      {isSaved || isItemSaved('job', p.id) ? 'Saved ✓' : 'Save Project'}
                    </button>
                    <Link to={`/jobs/${p.id}`} className="btn btn-primary btn-sm">
                      View Project Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
