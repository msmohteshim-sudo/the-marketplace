import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Filter, Clock, Star, ArrowRight, X, Check, Search, ShieldCheck, Tag
} from 'lucide-react';
import { clientDigitalApi } from '../../services/api';
import { toggleSaveItem, isItemSaved } from '../../utils/savedHelper';

interface QuickWorkSectionProps {
  onSaveItem?: (entityType: string, entityId: string) => void;
}

export const QuickWorkSection: React.FC<QuickWorkSectionProps> = ({ onSaveItem }) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');
  const [sort, setSort] = useState('recommended');

  const fetchQuickWork = () => {
    setLoading(true);
    const params: Record<string, string> = { limit: '8', sort };

    if (search) params.search = search;
    if (category) params.category = category;
    if (deliveryTime) params.deliveryTime = deliveryTime;
    if (rating) params.rating = rating;

    if (priceRange === 'under_500') {
      params.minPrice = '0';
      params.maxPrice = '500';
    } else if (priceRange === '500_1000') {
      params.minPrice = '500';
      params.maxPrice = '1000';
    } else if (priceRange === '1000_2500') {
      params.minPrice = '1000';
      params.maxPrice = '2500';
    } else if (priceRange === '2500_plus') {
      params.minPrice = '2500';
    }

    clientDigitalApi.getQuickServices(params)
      .then(res => {
        let items = res.services || [];
        // If empty, supply high quality quick digital work mock fallback
        if (items.length === 0 && !search && !category && !priceRange) {
          items = [
            {
              id: 'qw-1',
              title: 'Fix React Login Bug & Auth Redirect Error',
              category: { name: 'Web Development' },
              deliveryTime: 1, // 6h
              deliveryText: '6 Hours',
              totalRating: 4.9,
              ratingCount: 28,
              packages: [{ price: 499 }],
              seller: { fullName: 'Alex Rivera', isVerified: true },
              type: 'digital'
            },
            {
              id: 'qw-2',
              title: 'Convert PDF to Fully Editable Word / Excel Document',
              category: { name: 'Data Entry' },
              deliveryTime: 1,
              deliveryText: '2 Hours',
              totalRating: 5.0,
              ratingCount: 42,
              packages: [{ price: 299 }],
              seller: { fullName: 'Priya Sharma', isVerified: true },
              type: 'digital'
            },
            {
              id: 'qw-3',
              title: 'Remove Background from 20 Product Images',
              category: { name: 'Graphic Design' },
              deliveryTime: 1,
              deliveryText: '4 Hours',
              totalRating: 4.8,
              ratingCount: 19,
              packages: [{ price: 399 }],
              seller: { fullName: 'David Chen', isVerified: true },
              type: 'digital'
            },
            {
              id: 'qw-4',
              title: 'Fix Critical WordPress PHP / Database Connection Error',
              category: { name: 'Programming' },
              deliveryTime: 1,
              deliveryText: '3 Hours',
              totalRating: 4.9,
              ratingCount: 34,
              packages: [{ price: 799 }],
              seller: { fullName: 'Marcus Vance', isVerified: true },
              type: 'digital'
            }
          ];
        }
        setServices(items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuickWork();
  }, [category, deliveryTime, priceRange, rating, sort]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setDeliveryTime('');
    setPriceRange('');
    setRating('');
    setSort('recommended');
  };

  const handleSave = async (e: React.MouseEvent, s: any) => {
    e.preventDefault();
    e.stopPropagation();
    const price = s.packages?.[0]?.price || s.price || 499;
    const isSavedNow = await toggleSaveItem('service', s.id, {
      title: s.title,
      summary: s.description || s.category?.name || 'Quick Digital Task',
      price,
      category: s.category?.name || 'Web Development',
      creatorName: s.seller?.fullName || 'Freelancer',
      link: `/services/${s.id}`,
      raw: s
    });

    setSavedIds(prev => {
      const next = new Set(prev);
      if (isSavedNow) next.add(s.id);
      else next.delete(s.id);
      return next;
    });

    if (onSaveItem) onSaveItem('service', s.id);
  };

  return (
    <div className="section" style={{ marginBottom: '2.5rem' }}>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'rgba(236,72,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
              <Zap size={16} />
            </div>
            <h2 className="section-title" style={{ fontSize: '1.35rem', margin: 0 }}>⚡ QUICK DIGITAL WORK</h2>
            <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>UNDER 24 HOURS</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Small, urgent digital tasks completed fast by verified professionals.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters || category || deliveryTime || priceRange ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Filter size={14} />
            <span>FILTERS</span>
            {(category || deliveryTime || priceRange || rating) && (
              <span className="badge badge-purple" style={{ padding: '0.1rem 0.35rem', fontSize: '0.65rem' }}>Active</span>
            )}
          </button>

          <Link to="/services?type=digital" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-purple-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            SEE ALL <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Filter Bar / Drawer */}
      {showFilters && (
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(20,15,38,0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={15} color="#a78bfa" /> Filter Quick Digital Work
            </span>
            <button className="btn-icon" onClick={() => setShowFilters(false)}>
              <X size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {/* Category */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Category</label>
              <select
                className="input-field"
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              >
                <option value="">All Categories</option>
                <option value="web-dev">Web Development</option>
                <option value="graphic-design">Graphic Design</option>
                <option value="video">Video Editing</option>
                <option value="programming">Programming</option>
                <option value="ai">AI Tasks</option>
                <option value="data-entry">Data Entry</option>
                <option value="content">Content Writing</option>
                <option value="marketing">Digital Marketing</option>
              </select>
            </div>

            {/* Delivery Time */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Delivery Time</label>
              <select
                className="input-field"
                value={deliveryTime}
                onChange={e => setDeliveryTime(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              >
                <option value="">Any Time (&lt; 24h)</option>
                <option value="under_2h">Under 2 Hours</option>
                <option value="under_6h">Under 6 Hours</option>
                <option value="under_12h">Under 12 Hours</option>
                <option value="under_24h">Under 24 Hours</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Price Range</label>
              <select
                className="input-field"
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              >
                <option value="">Any Price</option>
                <option value="under_500">Under ₹500</option>
                <option value="500_1000">₹500 – ₹1,000</option>
                <option value="1000_2500">₹1,000 – ₹2,500</option>
                <option value="2500_plus">₹2,500+</option>
              </select>
            </div>

            {/* Minimum Rating */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Rating</label>
              <select
                className="input-field"
                value={rating}
                onChange={e => setRating(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              >
                <option value="">Any Rating</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
                <option value="5.0">5.0 Stars</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Sort By</label>
              <select
                className="input-field"
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
              >
                <option value="recommended">Recommended</option>
                <option value="lowest_price">Lowest Price</option>
                <option value="top_rated">Highest Rating</option>
                <option value="fastest">Fastest Delivery</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={handleClearFilters}>
              Clear Filters
            </button>
            <button className="btn btn-primary btn-sm" onClick={fetchQuickWork}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Grid of Quick Work Cards */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : services.length === 0 ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>No quick digital work matching your current filters.</p>
          <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>Reset Filters</button>
        </div>
      ) : (
        <div className="marketplace-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {services.map(s => {
            const price = s.packages?.[0]?.price || s.price || 499;
            const delivery = s.deliveryText || `${s.deliveryTime || 1} Day`;
            const isSaved = savedIds.has(s.id);

            return (
              <Link
                key={s.id}
                to={`/services/${s.id}`}
                className="glass-card-hover"
                style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      {s.category?.name || 'Digital Task'}
                    </span>
                    <span className="badge badge-blue" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={11} /> {delivery}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                    {s.title}
                  </h3>
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div className="avatar-placeholder" style={{ width: 24, height: 24, fontSize: '0.65rem' }}>
                        {s.seller?.fullName?.[0] || 'F'}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {s.seller?.fullName || 'Freelancer'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Star size={12} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{s.totalRating?.toFixed(1) || '4.9'}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({s.ratingCount || 12})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Price</span>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-purple-light)', fontFamily: 'Space Grotesk' }}>
                        ₹{price.toLocaleString()}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleSave(e, s)}
                      className={`btn ${isSaved || isItemSaved('service', s.id) ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
                    >
                      {isSaved || isItemSaved('service', s.id) ? 'Saved ✓' : 'Save'}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
