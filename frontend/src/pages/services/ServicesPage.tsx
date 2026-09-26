import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Star, Plus, Search, MapPin, Filter, X, Zap, Clock, ShieldCheck, ArrowUpDown, RefreshCw, ChevronDown, Laptop, Pencil, CheckCircle2 } from 'lucide-react';
import { servicesApi } from '../../services/api';
import { toggleSaveItem, isItemSaved } from '../../utils/savedHelper';
import { useAuth } from '../../context/AuthContext';

// Curated Physical Local Services Dataset
const PHYSICAL_SERVICES = [
  {
    id: 'phys-srv-1',
    title: 'Emergency Electrical Short-Circuit & Wiring Repair',
    description: 'Urgent home electrical troubleshooting, breaker replacement, switchboard repair, and power restoration by certified electrician.',
    category: { name: 'Electrician' },
    categoryId: 'electrician',
    seller: { fullName: 'Ramesh Patil (Master Electrician)' },
    packages: [{ price: 350, deliveryTime: 1 }],
    deliveryTime: 1,
    rating: 4.9,
    reviewsCount: 142,
    location: 'Latur, Maharashtra (1.2 km away)',
    tags: ['Electrician', 'Short Circuit', 'Wiring', 'Emergency']
  },
  {
    id: 'phys-srv-2',
    title: 'Plumbing Tap Leakage & Pipe Replacement Service',
    description: 'Fast fix for leaking taps, pipe bursts, bathroom flush fittings, and clogged drainage lines using professional tools.',
    category: { name: 'Plumber' },
    categoryId: 'plumber',
    seller: { fullName: 'Sunil Jadhav (Licensed Plumber)' },
    packages: [{ price: 400, deliveryTime: 1 }],
    deliveryTime: 1,
    rating: 4.8,
    reviewsCount: 98,
    location: 'Latur, Maharashtra (2.4 km away)',
    tags: ['Plumber', 'Leakage', 'Tap Fitting', 'Sanitary']
  },
  {
    id: 'phys-srv-3',
    title: 'Complete 2BHK / 3BHK Interior Painting & Putty Touchup',
    description: 'High-quality wall putty, primer coat, and Asian Paints Royale interior painting with clean drop-cloth protection.',
    category: { name: 'Painting & Walls' },
    categoryId: 'painting',
    seller: { fullName: 'Apex Painters & Decorators' },
    packages: [{ price: 14999, deliveryTime: 4 }],
    deliveryTime: 4,
    rating: 4.9,
    reviewsCount: 86,
    location: 'Latur Area',
    tags: ['Painting', 'Wall Putty', 'Interior', 'House Paint']
  },
  {
    id: 'phys-srv-4',
    title: 'Split & Window AC Servicing, Deep Cleaning & Gas Refill',
    description: 'Comprehensive AC jet pump cleaning, cooling coil check, gas pressure check, and compressor troubleshooting.',
    category: { name: 'AC & Appliance' },
    categoryId: 'ac',
    seller: { fullName: 'Akash Aircon Services' },
    packages: [{ price: 599, deliveryTime: 1 }],
    deliveryTime: 1,
    rating: 4.8,
    reviewsCount: 112,
    location: 'Latur, Maharashtra (3.0 km away)',
    tags: ['AC Service', 'Gas Refill', 'Cooling Repair']
  },
  {
    id: 'phys-srv-5',
    title: 'Door Lock Repair, Key Duplication & Emergency Locksmith',
    description: 'Unlock jammed doors, key extraction, new latch installation, and key duplication service at your doorstep.',
    category: { name: 'Locksmith' },
    categoryId: 'locksmith',
    seller: { fullName: 'Mahesh Key & Lock Works' },
    packages: [{ price: 300, deliveryTime: 1 }],
    deliveryTime: 1,
    rating: 4.9,
    reviewsCount: 78,
    location: 'Latur, Maharashtra (1.1 km away)',
    tags: ['Locksmith', 'Door Lock', 'Key Duplication']
  },
  {
    id: 'phys-srv-6',
    title: 'Full Home & Sofa Deep Cleaning Service',
    description: 'Professional high-pressure vacuuming, chemical sofa shampooing, bathroom tile scrubbing, and kitchen degreasing.',
    category: { name: 'Deep Cleaning' },
    categoryId: 'cleaning',
    seller: { fullName: 'Santosh Home Cleaners' },
    packages: [{ price: 1499, deliveryTime: 1 }],
    deliveryTime: 1,
    rating: 4.7,
    reviewsCount: 64,
    location: 'Latur, Maharashtra (1.8 km away)',
    tags: ['Cleaning', 'Sofa Shampoo', 'Deep Clean']
  },
  {
    id: 'phys-srv-7',
    title: 'Furniture Assembly, Door Hinge & Cabinet Carpenter Repair',
    description: 'Expert carpenter for assembling modular furniture, fixing squeaky doors, hydraulic hinges, and custom woodwork.',
    category: { name: 'Carpenter' },
    categoryId: 'carpenter',
    seller: { fullName: 'Vijay Woodcraft Works' },
    packages: [{ price: 450, deliveryTime: 1 }],
    deliveryTime: 1,
    rating: 4.9,
    reviewsCount: 76,
    location: 'Latur, Maharashtra (3.1 km away)',
    tags: ['Carpenter', 'Furniture Repair', 'Cabinet']
  },
  {
    id: 'phys-srv-8',
    title: 'Same-Day City Document & Parcel Pickup Delivery',
    description: 'Safe and instant pickup and delivery of documents, keys, parcels, and bank paperwork across the city.',
    category: { name: 'Errands & Delivery' },
    categoryId: 'errands',
    seller: { fullName: 'Sachin Courier Express' },
    packages: [{ price: 250, deliveryTime: 1 }],
    deliveryTime: 1,
    rating: 4.9,
    reviewsCount: 48,
    location: 'Latur City',
    tags: ['Errands', 'Parcel Pickup', 'Courier']
  }
];

export const ServicesPage: React.FC = () => {
  const { user } = useAuth();
  const isPhysical = user?.activeWorkType === 'physical';

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savedTick, setSavedTick] = useState(0);

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState('');
  const [maxDelivery, setMaxDelivery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  // UI Drawer State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Edit Service Modal State
  const [editingService, setEditingService] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    price: '',
    description: '',
    category: ''
  });
  const [editSuccessMsg, setEditSuccessMsg] = useState(false);

  const handleOpenEditModal = (s: any) => {
    setEditingService(s);
    setEditForm({
      title: s.title || '',
      price: (s.packages?.[0]?.price || s.price || 499).toString(),
      description: s.description || '',
      category: s.category?.name || 'Service'
    });
  };

  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const newPrice = parseFloat(editForm.price) || 499;

    setServices(prev => prev.map(item => {
      if (item.id === editingService.id) {
        return {
          ...item,
          title: editForm.title,
          description: editForm.description,
          packages: [{ ...(item.packages?.[0] || {}), price: newPrice }],
          price: newPrice,
          category: { name: editForm.category }
        };
      }
      return item;
    }));

    setEditSuccessMsg(true);
    setTimeout(() => {
      setEditSuccessMsg(false);
      setEditingService(null);
    }, 1200);
  };

  const handleSaveService = async (e: React.MouseEvent, s: any) => {
    e.preventDefault();
    e.stopPropagation();
    const price = s.packages?.[0]?.price || 499;
    await toggleSaveItem('service', s.id, {
      title: s.title,
      summary: s.description || 'Local Physical Service',
      price,
      category: s.category?.name || 'Physical Service',
      creatorName: s.seller?.fullName || 'Local Worker',
      link: `/services/${s.id}`,
      raw: s
    });
    setSavedTick(prev => prev + 1);
  };

  useEffect(() => {
    fetchServices();
  }, [categoryFilter, maxDelivery, minPrice, maxPrice, minRating, sortBy, isPhysical]);

  const fetchServices = () => {
    setLoading(true);

    if (isPhysical) {
      // In physical mode: filter PHYSICAL_SERVICES
      let result = [...PHYSICAL_SERVICES];

      if (categoryFilter) {
        result = result.filter(s => s.categoryId === categoryFilter || s.category?.name?.toLowerCase().includes(categoryFilter.toLowerCase()));
      }
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category?.name?.toLowerCase().includes(q));
      }
      if (minPrice) {
        result = result.filter(s => (s.packages?.[0]?.price || 0) >= parseFloat(minPrice));
      }
      if (maxPrice) {
        result = result.filter(s => (s.packages?.[0]?.price || 0) <= parseFloat(maxPrice));
      }
      if (minRating) {
        result = result.filter(s => (s.rating || 0) >= parseFloat(minRating));
      }

      setTimeout(() => {
        setServices(result);
        setLoading(false);
      }, 200);
      return;
    }

    // Digital mode
    const params: any = { type: 'digital' };
    if (search) params.search = search;
    if (categoryFilter && categoryFilter !== 'express') params.category = categoryFilter;
    if (categoryFilter === 'express') params.deliveryTime = '1';
    if (maxDelivery) params.deliveryTime = maxDelivery;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (minRating) params.rating = minRating;
    if (sortBy) params.sort = sortBy;

    servicesApi.getAll(params)
      .then(res => {
        let rawServices = res.services || [];
        rawServices = rawServices.filter((s: any) => s.type === 'digital');
        setServices(rawServices);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleResetFilters = () => {
    setCategoryFilter('');
    setMaxDelivery('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSortBy('recommended');
    setSearch('');
  };

  const activeFilterCount = [
    categoryFilter,
    maxDelivery,
    minPrice,
    maxPrice,
    minRating,
    sortBy !== 'recommended' ? sortBy : ''
  ].filter(Boolean).length;

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 className="page-title" style={{ margin: 0 }}>
              {isPhysical ? 'Local Physical Services Marketplace' : 'Digital Services Marketplace'}
            </h1>
            <span className={`badge ${isPhysical ? 'badge-emerald' : 'badge-purple'}`} style={{ fontSize: '0.7rem', fontWeight: 800 }}>
              {isPhysical ? (
                <>
                  <MapPin size={11} style={{ marginRight: '3px' }} /> PHYSICAL / LOCAL
                </>
              ) : (
                <>
                  <Laptop size={11} style={{ marginRight: '3px' }} /> DIGITAL MODE
                </>
              )}
            </span>
          </div>
          <p className="page-subtitle">
            {isPhysical
              ? 'Find trusted local trade workers, electricians, plumbers, carpenters, and physical service pros near you.'
              : 'Find top digital talent and remote experts for any software, design, or AI task.'}
          </p>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {isPhysical ? (
          [
            { id: '', label: 'All Local Services' },
            { id: 'electrician', label: '⚡ Electricians' },
            { id: 'plumber', label: '🔧 Plumbers' },
            { id: 'carpenter', label: '🔨 Carpenters' },
            { id: 'painting', label: '🎨 Painting & Walls' },
            { id: 'cleaning', label: '🧹 Deep Cleaning' },
            { id: 'ac', label: '❄️ AC & Appliance' },
            { id: 'locksmith', label: '🔑 Locksmiths' },
            { id: 'errands', label: '🚚 Errands & Courier' }
          ].map(cat => (
            <button
              key={cat.id}
              className={`btn btn-sm ${categoryFilter === cat.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setCategoryFilter(cat.id)}
              style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)' }}
            >
              {cat.label}
            </button>
          ))
        ) : (
          [
            { id: '', label: 'All Digital Services' },
            { id: 'web-dev', label: '💻 Web Dev' },
            { id: 'mobile-dev', label: '📱 Mobile Apps' },
            { id: 'graphic-design', label: '🎨 UI/UX & Design' },
            { id: 'ai-ml', label: '🤖 AI & Data' },
            { id: 'cloud-devops', label: '☁️ Cloud & DevOps' },
            { id: 'security', label: '🔒 Cybersecurity' },
            { id: 'express', label: '⚡ Under 24h Express' }
          ].map(cat => (
            <button
              key={cat.id}
              className={`btn btn-sm ${categoryFilter === cat.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setCategoryFilter(cat.id)}
              style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)' }}
            >
              {cat.label}
            </button>
          ))
        )}
      </div>

      {/* Controls & Search Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search Field */}
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder={isPhysical ? 'Search local services by trade (Electrician, Plumber, AC Repair, Cleaning)...' : 'Search digital services by title or skill (React, Figma, AI, DevOps)...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchServices()}
          />
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-card)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
          >
            <option value="recommended" style={{ background: '#111' }}>Sort: Recommended</option>
            <option value="top_rated" style={{ background: '#111' }}>Sort: Top Rated First</option>
            <option value="lowest_price" style={{ background: '#111' }}>Sort: Price (Low to High)</option>
            <option value="highest_price" style={{ background: '#111' }}>Sort: Price (High to Low)</option>
            <option value="newest" style={{ background: '#111' }}>Sort: Newest First</option>
          </select>
        </div>

        {/* Filter Drawer Toggle */}
        <button
          className={`btn ${activeFilterCount > 0 ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Filter size={16} /> Filters
          {activeFilterCount > 0 && (
            <span style={{ background: 'white', color: '#7c3aed', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 800 }}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : services.length === 0 ? (
        <div className="empty-state glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Wrench size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No services found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try expanding your search query or clearing active filters.</p>
          <button className="btn btn-secondary btn-sm" onClick={handleResetFilters} style={{ marginTop: '1rem' }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="marketplace-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {services.map(s => {
            const saved = isItemSaved('service', s.id);
            const price = s.packages?.[0]?.price || 499;

            return (
              <div key={s.id} className="glass-card-hover" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span className={`badge ${isPhysical ? 'badge-emerald' : 'badge-purple'}`} style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                      {s.category?.name || 'Local Service'}
                    </span>
                    <button
                      onClick={e => handleSaveService(e, s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: saved ? '#ec4899' : 'var(--text-muted)' }}
                    >
                      ★ {saved ? 'Saved' : 'Save'}
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                    {s.title}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginBottom: '0.85rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {s.description}
                  </p>

                  {s.location && (
                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                      <MapPin size={12} /> {s.location}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    <span style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Star size={12} fill="#f59e0b" color="#f59e0b" /> {s.rating || 4.9} ({s.reviewsCount || 48})
                    </span>
                    <span>• {s.seller?.fullName || 'Verified Pro'}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>STARTING AT</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', fontFamily: 'Space Grotesk' }}>
                      ₹{price.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(s)}
                      className="btn btn-secondary"
                      style={{
                        fontSize: '0.78rem',
                        padding: '0.35rem 0.65rem',
                        fontWeight: 700,
                        borderColor: '#a78bfa',
                        color: '#a78bfa',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Pencil size={13} /> Edit
                    </button>

                    <button className="btn btn-primary" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', fontWeight: 800 }}>
                      Request Service
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT SERVICE MODAL */}
      {editingService && (
        <div className="modal-backdrop" onClick={() => setEditingService(null)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pencil size={18} color="#a78bfa" /> Edit Service Details
              </h3>
              <button onClick={() => setEditingService(null)} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            {editSuccessMsg ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="#34d399" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Service Updated Successfully!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>The new title, price, and description have been saved.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveEditSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Service Title</label>
                  <input
                    className="form-input"
                    required
                    value={editForm.title}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="input-label">Category</label>
                    <input
                      className="form-input"
                      value={editForm.category}
                      onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="input-label">Starting Price (₹)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      value={editForm.price}
                      onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Description</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    required
                    value={editForm.description}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setEditingService(null)} className="btn btn-ghost">
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
