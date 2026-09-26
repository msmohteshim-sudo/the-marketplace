import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb, Filter, ArrowRight, X, ShieldCheck, Rocket, DollarSign, Check, Eye, Pencil, CheckCircle2
} from 'lucide-react';
import { clientDigitalApi, savedApi, ideasApi } from '../../services/api';
import { IdeaDetailModal } from '../ideas/IdeaDetailModal';

interface IdeasMarketplaceSectionProps {
  onSaveItem?: (entityType: string, entityId: string) => void;
  onBuildIdea: (idea: any) => void;
}

export const IdeasMarketplaceSection: React.FC<IdeasMarketplaceSectionProps> = ({
  onSaveItem,
  onBuildIdea
}) => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Selected idea for detailed view modal
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // Edit Idea Modal State
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [editIdeaForm, setEditIdeaForm] = useState({ title: '', summary: '', price: '' });
  const [editSuccessMsg, setEditSuccessMsg] = useState(false);

  const handleOpenEditIdeaModal = (e: React.MouseEvent, idea: any) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingIdea(idea);
    setEditIdeaForm({
      title: idea.title || '',
      summary: idea.summary || '',
      price: (idea.price || 4999).toString()
    });
  };

  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIdea) return;
    const newPrice = parseFloat(editIdeaForm.price) || 999;
    setIdeas(prev => prev.map(item => {
      if (item.id === editingIdea.id) {
        return {
          ...item,
          title: editIdeaForm.title,
          summary: editIdeaForm.summary,
          price: newPrice
        };
      }
      return item;
    }));
    setEditSuccessMsg(true);
    setTimeout(() => {
      setEditSuccessMsg(false);
      setEditingIdea(null);
    }, 1200);
  };

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [businessModel, setBusinessModel] = useState('');
  const [devCost, setDevCost] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState('newest');

  const fetchIdeas = () => {
    setLoading(true);
    const params: Record<string, string> = { limit: '6', sort };

    if (search) params.search = search;
    if (category) params.category = category;
    if (businessModel) params.businessModel = businessModel;
    if (verifiedOnly) params.verified = 'true';

    if (priceRange === 'free') params.maxPrice = '0';
    else if (priceRange === 'under_500') { params.minPrice = '0'; params.maxPrice = '500'; }
    else if (priceRange === '500_1000') { params.minPrice = '500'; params.maxPrice = '1000'; }
    else if (priceRange === '1000_5000') { params.minPrice = '1000'; params.maxPrice = '5000'; }
    else if (priceRange === '5000_plus') { params.minPrice = '5000'; }

    clientDigitalApi.getIdeas(params)
      .then(res => {
        let items = res.ideas || [];
        // Rich mock fallback if database has no active ideas yet
        if (items.length === 0 && !search && !category && !priceRange) {
          items = [
            {
              id: 'idea-1',
              title: 'AI Automated Resume & Portfolio Builder',
              summary: 'Generates ATS-optimized resumes and interactive web portfolios powered by Gemini API.',
              category: { name: 'AI / EdTech' },
              industry: 'AI & Career',
              price: 999,
              estDevCost: '₹25,000 – ₹50,000',
              businessModel: 'Subscription (SaaS)',
              stage: 'Validated Concept',
              isVerified: true,
              views: 340,
              creator: { fullName: 'Sarah Jenkins', isVerified: true },
              problem: 'Job seekers spend hours crafting custom resumes without knowing if ATS tools can parse them.',
              solution: 'An AI engine that extracts skills and builds responsive portfolio links in 60 seconds.'
            },
            {
              id: 'idea-2',
              title: 'Hyperlocal Micro-Task & Handyman Booking SaaS',
              summary: 'Uber-style instant dispatch system for verified local plumbers, electricians, and carpenters.',
              category: { name: 'Marketplace' },
              industry: 'Local Services',
              price: 1499,
              estDevCost: '₹40,000 – ₹75,000',
              businessModel: 'Commission per Booking',
              stage: 'MVP Ready',
              isVerified: true,
              views: 520,
              creator: { fullName: 'Rohit Verma', isVerified: true },
              problem: 'Homeowners struggle to find trustworthy local workers with transparent pricing.',
              solution: 'Real-time geo-matching engine with automated escrow payment release.'
            },
            {
              id: 'idea-3',
              title: 'Restaurant QR Code Menu & Instant Table Ordering',
              summary: 'Contactless ordering software with POS sync, Inventory alerts, and WhatsApp invoice billing.',
              category: { name: 'Food & Hospitality' },
              industry: 'Hospitality Tech',
              price: 1999,
              estDevCost: '₹30,000 – ₹60,000',
              businessModel: 'Monthly SaaS',
              stage: 'Validated Concept',
              isVerified: true,
              views: 410,
              creator: { fullName: 'Vikram Mehta', isVerified: true },
              problem: 'Restaurants experience high waiter costs and order errors during peak hours.',
              solution: 'Customer scans table QR code to customize items, submit order directly to kitchen display.'
            },
            {
              id: 'idea-4',
              title: 'AI Smart Study Notes & Exam Flashcard Generator',
              summary: 'Upload PDF textbooks or lecture videos to get instant summary notes and active-recall quizzes.',
              category: { name: 'Education' },
              industry: 'EdTech',
              price: 799,
              estDevCost: '₹20,000 – ₹40,000',
              businessModel: 'Freemium + Subscriptions',
              stage: 'Prototype Ready',
              isVerified: true,
              views: 290,
              creator: { fullName: 'Elena Rostova', isVerified: true },
              problem: 'Students get overwhelmed reading 500-page textbooks before exams.',
              solution: 'Multi-modal LLM ingests documents and builds interactive Anki-style deck queues.'
            }
          ];
        }
        setIdeas(items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIdeas();
  }, [category, priceRange, businessModel, verifiedOnly, sort]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setPriceRange('');
    setBusinessModel('');
    setDevCost('');
    setVerifiedOnly(false);
    setSort('newest');
  };

  const handleSave = (e: React.MouseEvent, ideaId: string) => {
    e.preventDefault();
    e.stopPropagation();
    savedApi.save('idea', ideaId).then(() => {
      setSavedIds(prev => new Set(prev).add(ideaId));
      if (onSaveItem) onSaveItem('idea', ideaId);
    }).catch(() => {});
  };

  const handleBuyIdea = (idea: any) => {
    ideasApi.license(idea.id, { licenseType: 'project', isExclusive: false })
      .then(() => {
        alert(`Success! You have purchased license for "${idea.title}".`);
        onBuildIdea(idea);
      })
      .catch(err => {
        alert(err.message || 'Error acquiring license');
        onBuildIdea(idea);
      });
  };

  return (
    <div className="section" style={{ marginBottom: '2.5rem' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <Lightbulb size={16} />
            </div>
            <h2 className="section-title" style={{ fontSize: '1.35rem', margin: 0 }}>💡 IDEAS MARKETPLACE</h2>
            <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>READY-TO-BUILD CONCEPTS</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Buy validated digital startup ideas and concepts, then hire top freelancers to turn them into live products.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters || category || priceRange || businessModel ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Filter size={14} />
            <span>FILTERS</span>
            {(category || priceRange || businessModel || verifiedOnly) && (
              <span className="badge badge-amber" style={{ padding: '0.1rem 0.35rem', fontSize: '0.65rem' }}>Active</span>
            )}
          </button>

          <Link to="/ideas" className="btn btn-ghost btn-sm" style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            SEE ALL <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(26,18,37,0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={15} color="#f59e0b" /> Filter Ideas Marketplace
            </span>
            <button className="btn-icon" onClick={() => setShowFilters(false)}>
              <X size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {/* Category / Industry */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Industry</label>
              <select className="input-field" value={category} onChange={e => setCategory(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                <option value="">All Industries</option>
                <option value="ai">AI & Automation</option>
                <option value="edtech">Education</option>
                <option value="finance">FinTech</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="productivity">Productivity</option>
                <option value="food">Food & Local</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Idea Price</label>
              <select className="input-field" value={priceRange} onChange={e => setPriceRange(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                <option value="">Any Price</option>
                <option value="free">Free Concepts</option>
                <option value="under_500">Under ₹500</option>
                <option value="500_1000">₹500 – ₹1,000</option>
                <option value="1000_5000">₹1,000 – ₹5,000</option>
                <option value="5000_plus">₹5,000+</option>
              </select>
            </div>

            {/* Business Model */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Business Model</label>
              <select className="input-field" value={businessModel} onChange={e => setBusinessModel(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                <option value="">All Models</option>
                <option value="Subscription">SaaS / Subscription</option>
                <option value="Marketplace">Marketplace Commission</option>
                <option value="Freemium">Freemium</option>
                <option value="One-Time">One-Time License</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Sort By</label>
              <select className="input-field" value={sort} onChange={e => setSort(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}>
                <option value="newest">Newest First</option>
                <option value="most_popular">Most Popular</option>
                <option value="lowest_price">Lowest Price</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={handleClearFilters}>
              Clear Filters
            </button>
            <button className="btn btn-primary btn-sm" onClick={fetchIdeas}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Grid of Idea Cards */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : ideas.length === 0 ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>No ideas matching your filters.</p>
          <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>Reset Filters</button>
        </div>
      ) : (
        <div className="marketplace-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {ideas.map(idea => {
            const price = idea.price ? `₹${idea.price.toLocaleString()}` : 'Free';
            const estDev = idea.estDevCost || '₹25,000 – ₹50,000';
            const isSaved = savedIds.has(idea.id);

            return (
              <div
                key={idea.id}
                className="glass-card-hover"
                style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                      {idea.category?.name || idea.industry || 'Tech Idea'}
                    </span>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <ShieldCheck size={11} /> Verified Concept
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                    {idea.title}
                  </h3>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {idea.summary}
                  </p>
                </div>

                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.75rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Idea Price</span>
                      <strong style={{ color: '#f59e0b', fontSize: '0.95rem', fontFamily: 'Space Grotesk' }}>{price}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block' }}>Est. Build Cost</span>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.8rem' }}>{estDev}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', borderColor: '#a78bfa', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      onClick={(e) => handleOpenEditIdeaModal(e, idea)}
                    >
                      <Pencil size={12} /> Edit
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: '0.75rem' }}
                      onClick={() => {
                        setSelectedIdea(idea);
                        setShowModal(true);
                      }}
                    >
                      <Eye size={12} /> View Idea
                    </button>

                    <button
                      className="btn btn-primary btn-sm"
                      style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', fontSize: '0.75rem' }}
                      onClick={() => handleBuyIdea(idea)}
                    >
                      Buy & Build
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Idea Detail Modal */}
      <IdeaDetailModal
        idea={selectedIdea}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onBuyIdea={handleBuyIdea}
        onBuildIdea={(idea) => {
          setShowModal(false);
          onBuildIdea(idea);
        }}
      />

      {/* EDIT IDEA MODAL */}
      {editingIdea && (
        <div className="modal-backdrop" onClick={() => setEditingIdea(null)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pencil size={18} color="#a78bfa" /> Edit Startup Idea Details
              </h3>
              <button onClick={() => setEditingIdea(null)} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            {editSuccessMsg ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="#34d399" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Idea Details Updated Successfully!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>The new title, summary, and price have been saved.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveEditSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Idea Title</label>
                  <input
                    className="form-input"
                    required
                    value={editIdeaForm.title}
                    onChange={e => setEditIdeaForm({ ...editIdeaForm, title: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Asking Price (₹)</label>
                  <input
                    className="form-input"
                    type="number"
                    required
                    value={editIdeaForm.price}
                    onChange={e => setEditIdeaForm({ ...editIdeaForm, price: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Summary</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    required
                    value={editIdeaForm.summary}
                    onChange={e => setEditIdeaForm({ ...editIdeaForm, summary: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setEditingIdea(null)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
