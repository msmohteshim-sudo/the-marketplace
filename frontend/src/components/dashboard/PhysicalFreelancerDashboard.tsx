import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, MapPin, Briefcase, Plus, Search, Filter, Star, Clock, CheckCircle2,
  DollarSign, Wrench, ShieldCheck, ArrowRight, X, ChevronRight, Award, Hammer, Paintbrush, Truck, Key, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Default Physical Tasks Offered by Freelancer (Under 24h / Same-day)
const DEFAULT_PHYSICAL_QUICK_TASKS = [
  {
    id: 'p-quick-1',
    title: '⚡ Emergency Electrical Short-Circuit & Wiring Repair',
    description: 'Urgent home electrical troubleshooting, breaker replacement, switchboard repair, and power restoration.',
    deliveryTime: 'Arrival in 30 Min',
    category: 'Electrician',
    price: 350,
    rating: 4.9,
    completedCount: 54,
    skills: ['Electrician', 'Short Circuit', 'Wiring', 'Emergency'],
    location: 'Local Service Area',
    status: 'Active'
  },
  {
    id: 'p-quick-2',
    title: '🔧 Plumbing Tap Leakage & CPVC Pipe Burst Repair',
    description: 'Fast fix for leaking taps, pipe bursts, bathroom flush fittings, and clogged drainage lines.',
    deliveryTime: 'Arrival in 20 Min',
    category: 'Plumber',
    price: 400,
    rating: 4.8,
    completedCount: 41,
    skills: ['Plumber', 'Pipe Leakage', 'Sanitary Repair'],
    location: 'Local Service Area',
    status: 'Active'
  },
  {
    id: 'p-quick-3',
    title: '🔑 Emergency Locksmith & Door Key Extraction Service',
    description: 'Main door jammed lock opening, key extraction, and high-security lock cylinder replacement.',
    deliveryTime: 'Arrival in 20 Min',
    category: 'Locksmith',
    price: 450,
    rating: 4.9,
    completedCount: 38,
    skills: ['Locksmith', 'Door Lock', 'Key Cutting'],
    location: 'Local Service Area',
    status: 'Active'
  },
  {
    id: 'p-quick-4',
    title: '📦 Urgent Document & Parcel Local Pickup & Delivery',
    description: 'Same-day collection and safe drop-off for bank papers, legal documents, groceries, or urgent local parcels.',
    deliveryTime: 'Under 1 Hour',
    category: 'Errands',
    price: 300,
    rating: 4.8,
    completedCount: 62,
    skills: ['Document Delivery', 'Errands', 'Express Pickup'],
    location: 'Within 10 km',
    status: 'Active'
  }
];

// Default Physical Multi-Day / Project Packages Offered by Freelancer
const DEFAULT_PHYSICAL_PROJECT_PACKAGES = [
  {
    id: 'p-proj-1',
    title: '🏠 2-Bedroom Flat Interior Wall Painting & Putty Work',
    description: 'Complete interior wall painting for 2BHK flat including putty, primer, wall sanding, and Asian Paints Royale finish coat.',
    duration: '3–5 Days',
    category: 'Painting',
    priceMin: 15000,
    priceMax: 25000,
    rating: 4.9,
    completedCount: 18,
    skills: ['Painting', 'Wall Putty', 'Interior Design', 'Sanding'],
    status: 'Active'
  },
  {
    id: 'p-proj-2',
    title: '⚡ Villa Concealed Electrical Wiring & Distribution Board Setup',
    description: 'Wiring installation for 2-3 story residential building. Concealed conduit pipes, distribution boards, LED panel lights & inverter backup.',
    duration: '7–10 Days',
    category: 'Electrician',
    priceMin: 35000,
    priceMax: 60000,
    rating: 5.0,
    completedCount: 12,
    skills: ['Concealed Wiring', '3-Phase Power', 'DB Board', 'Inverter'],
    status: 'Active'
  },
  {
    id: 'p-proj-3',
    title: '🪑 Custom Teakwood Furniture & Modular Kitchen Cabinetry',
    description: 'Custom woodworking, wardrobe assembly, plywood modular kitchen cupboards, and furniture repairs.',
    duration: '5–7 Days',
    category: 'Carpenter',
    priceMin: 28000,
    priceMax: 48000,
    rating: 4.9,
    completedCount: 15,
    skills: ['Carpenter', 'Modular Kitchen', 'Woodwork', 'Furniture'],
    status: 'Active'
  }
];

export const PhysicalFreelancerDashboard: React.FC = () => {
  const { user, switchWorkType } = useAuth();
  const navigate = useNavigate();

  // Task Lists
  const [quickTasks, setQuickTasks] = useState(DEFAULT_PHYSICAL_QUICK_TASKS);
  const [projectPackages, setProjectPackages] = useState(DEFAULT_PHYSICAL_PROJECT_PACKAGES);

  // Filters
  const [quickFilter, setQuickFilter] = useState('All');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalTaskType, setModalTaskType] = useState<'quick' | 'project'>('quick');

  // Editing State
  const [editingTask, setEditingTask] = useState<any>(null);

  // Form State inside Modal
  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'Electrician',
    deliveryTime: 'Arrival in 30 Min',
    price: '',
    priceMax: '',
    skills: '',
    description: ''
  });

  const [createSuccessMsg, setCreateSuccessMsg] = useState(false);

  const displayName = user?.fullName?.split(' ')[0] || 'Worker';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  // Open Modal for Creating or Editing
  const openModal = (type: 'quick' | 'project', taskToEdit?: any) => {
    setModalTaskType(type);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setTaskForm({
        title: taskToEdit.title || '',
        category: taskToEdit.category || 'Electrician',
        deliveryTime: taskToEdit.deliveryTime || taskToEdit.duration || (type === 'quick' ? 'Arrival in 30 Min' : '3-5 Days'),
        price: (taskToEdit.price || taskToEdit.priceMin || 350).toString(),
        priceMax: (taskToEdit.priceMax || '').toString(),
        skills: Array.isArray(taskToEdit.skills) ? taskToEdit.skills.join(', ') : '',
        description: taskToEdit.description || ''
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        category: 'Electrician',
        deliveryTime: type === 'quick' ? 'Arrival in 30 Min' : '3-5 Days',
        price: type === 'quick' ? '400' : '15000',
        priceMax: type === 'quick' ? '' : '25000',
        skills: '',
        description: ''
      });
    }
    setShowCreateModal(true);
  };

  // Submit Handler
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    if (editingTask) {
      // Editing existing task
      if (modalTaskType === 'quick') {
        setQuickTasks(prev => prev.map(t => t.id === editingTask.id ? {
          ...t,
          title: taskForm.title,
          category: taskForm.category,
          deliveryTime: taskForm.deliveryTime,
          price: parseFloat(taskForm.price) || 400,
          description: taskForm.description,
          skills: taskForm.skills ? taskForm.skills.split(',').map(s => s.trim()) : t.skills
        } : t));
      } else {
        setProjectPackages(prev => prev.map(p => p.id === editingTask.id ? {
          ...p,
          title: taskForm.title,
          category: taskForm.category,
          duration: taskForm.deliveryTime,
          priceMin: parseFloat(taskForm.price) || 15000,
          priceMax: parseFloat(taskForm.priceMax) || parseFloat(taskForm.price) * 1.5 || 25000,
          description: taskForm.description,
          skills: taskForm.skills ? taskForm.skills.split(',').map(s => s.trim()) : p.skills
        } : p));
      }
    } else {
      // Creating new task
      if (modalTaskType === 'quick') {
        const newTask = {
          id: `p-quick-custom-${Date.now()}`,
          title: taskForm.title,
          description: taskForm.description || 'Fast local physical trade service.',
          deliveryTime: taskForm.deliveryTime || 'Arrival in 30 Min',
          category: taskForm.category,
          price: parseFloat(taskForm.price) || 400,
          rating: 5.0,
          completedCount: 1,
          skills: taskForm.skills ? taskForm.skills.split(',').map(s => s.trim()) : ['Electrician', 'Local Repair'],
          location: 'Local Service Area',
          status: 'Active'
        };
        setQuickTasks([newTask, ...quickTasks]);
      } else {
        const newProj = {
          id: `p-proj-custom-${Date.now()}`,
          title: taskForm.title,
          description: taskForm.description || 'Comprehensive local physical project package.',
          duration: taskForm.deliveryTime || '3-5 Days',
          category: taskForm.category,
          priceMin: parseFloat(taskForm.price) || 15000,
          priceMax: parseFloat(taskForm.priceMax) || parseFloat(taskForm.price) * 1.5 || 25000,
          rating: 5.0,
          completedCount: 1,
          skills: taskForm.skills ? taskForm.skills.split(',').map(s => s.trim()) : ['Painting', 'Interior'],
          status: 'Active'
        };
        setProjectPackages([newProj, ...projectPackages]);
      }
    }

    setCreateSuccessMsg(true);
    setTimeout(() => {
      setCreateSuccessMsg(false);
      setShowCreateModal(false);
      setEditingTask(null);
    }, 1200);
  };

  return (
    <div>
      {/* ───────────────────────────────────────────────────────── */}
      {/* PHYSICAL FREELANCER HEADER BANNER                         */}
      {/* ───────────────────────────────────────────────────────── */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(52,211,153,0.18) 0%, rgba(124,58,237,0.18) 100%)',
          border: '1px solid rgba(52,211,153,0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                {greeting}, <span className="gradient-text">{displayName}</span> 🛠️
              </span>
            </div>

            {/* Badges: FREELANCER PHYSICAL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                FREELANCER MODE
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={12} /> PHYSICAL LOCAL FREELANCER
              </span>
              {(user?.freelancerWorkPreference === 'both' || user?.activeWorkType === 'both') && (
                <button
                  type="button"
                  onClick={() => switchWorkType('digital')}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(167,139,250,0.15)',
                    color: '#a78bfa',
                    border: '1px solid rgba(167,139,250,0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  title="Switch to Digital Freelancer view"
                >
                  <RefreshCw size={11} /> Switch to Digital Freelancer
                </button>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '620px' }}>
              Offer your local trade skills, post quick same-day services or local physical project packages, submit proposals to local jobs, and manage active service requests.
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => openModal('quick')}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}
            >
              <Plus size={16} /> Post Quick Local Task (&lt;24h)
            </button>

            <button
              onClick={() => openModal('project')}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderColor: '#34d399', color: '#34d399' }}
            >
              <Plus size={16} /> Post Physical Project Package
            </button>

            <button
              onClick={() => navigate('/jobs')}
              className="btn btn-ghost"
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Briefcase size={15} /> Browse Local Client Jobs
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* FREELANCER METRICS & OVERVIEW                              */}
      {/* ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
          LOCAL FREELANCER METRICS & OVERVIEW
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Service Jobs</span>
              <Wrench size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>4</div>
            <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '0.25rem' }}>₹12,500 active contract value</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Submitted Quotes</span>
              <Award size={18} color="#a78bfa" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>6</div>
            <div style={{ fontSize: '0.8rem', color: '#a78bfa', marginTop: '0.25rem' }}>3 accepted by local clients</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #0ea5e9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Earnings</span>
              <DollarSign size={18} color="#0ea5e9" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>₹42,000</div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '0.25rem' }}>+22% from local bookings</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer Rating</span>
              <Star size={18} color="#f59e0b" fill="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>4.92 ⭐</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>From 28 local clients</div>
          </div>

        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* SECTION 1: QUICK LOCAL PHYSICAL WORK (UNDER 24 HOURS)     */}
      {/* ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                ⚡ Quick Local Physical Tasks Offered
              </h2>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                SAME-DAY / EXPRESS
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, marginTop: '0.25rem' }}>
              Fast local trade services, emergency repairs, and quick errands offered in your service area.
            </p>
          </div>

          <button
            onClick={() => openModal('quick')}
            className="btn btn-sm btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}
          >
            <Plus size={14} /> Post Quick Local Task
          </button>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {['All', 'Electrician', 'Plumber', 'Locksmith', 'Errands'].map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${quickFilter === cat ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setQuickFilter(cat)}
              style={{ borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Task Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {quickTasks
            .filter(t => quickFilter === 'All' || t.category === quickFilter)
            .map(t => (
              <div
                key={t.id}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border-default)',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                      {t.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {t.deliveryTime}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                    {t.title}
                  </h3>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {t.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    {t.skills.map(sk => (
                      <span key={sk} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(52,211,153,0.1)', color: '#34d399' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Starting Price</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>₹{t.price.toLocaleString()}</div>
                  </div>

                  <button
                    onClick={() => openModal('quick', t)}
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: '0.75rem', borderColor: '#a78bfa', color: '#a78bfa' }}
                  >
                    ✏️ Edit Task
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* SECTION 2: MULTI-DAY PHYSICAL PROJECTS & CONTRACT PACKAGES */}
      {/* ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                🏗️ Physical Project Packages offered by You
              </h2>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                LOCAL PROJECTS
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, marginTop: '0.25rem' }}>
              Comprehensive multi-day local trade contracts, flat painting, and building installations.
            </p>
          </div>

          <button
            onClick={() => openModal('project')}
            className="btn btn-sm btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', borderColor: '#34d399', color: '#34d399' }}
          >
            <Plus size={14} /> Post Physical Service Package
          </button>
        </div>

        {/* Project Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {projectPackages.map(p => (
            <div
              key={p.id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                border: '1px solid rgba(52,211,153,0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                    {p.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>
                    📅 {p.duration}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {p.title}
                </h3>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                  {p.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {p.skills.map(sk => (
                    <span key={sk} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Contract Package Range</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>
                    ₹{p.priceMin.toLocaleString()} - ₹{p.priceMax.toLocaleString()}
                  </div>
                </div>

                <button onClick={() => openModal('project', p)} className="btn btn-sm btn-secondary" style={{ borderColor: '#a78bfa', color: '#a78bfa' }}>
                  ✏️ Edit Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* CREATE / EDIT PHYSICAL TASK MODAL                         */}
      {/* ───────────────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', width: '90%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wrench size={18} color="#34d399" />
                {editingTask ? 'Edit Physical Service Task' : (modalTaskType === 'quick' ? 'Post Quick Local Task (<24h)' : 'Post Physical Service Package')}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            {createSuccessMsg ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="#34d399" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {editingTask ? 'Task Details Saved Successfully!' : 'Physical Task Listed Successfully!'}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your local service task details have been updated live.</p>
              </div>
            ) : (
              <form onSubmit={handleTaskSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Physical Service / Task Title</label>
                  <input
                    className="form-input"
                    required
                    placeholder={modalTaskType === 'quick' ? 'e.g. Emergency Electrical Short Circuit & Wiring Repair' : 'e.g. 2-Bedroom Flat Interior Painting'}
                    value={taskForm.title}
                    onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="input-label">Category</label>
                    <select
                      className="form-input"
                      value={taskForm.category}
                      onChange={e => setTaskForm({ ...taskForm, category: e.target.value })}
                    >
                      <option value="Electrician">Electrician</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="Painting">Painting & Walls</option>
                      <option value="Cleaning">Deep Cleaning</option>
                      <option value="Locksmith">Locksmith</option>
                      <option value="Errands">Errands & Pickup</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Arrival / Duration</label>
                    <input
                      className="form-input"
                      placeholder={modalTaskType === 'quick' ? 'e.g. Arrival in 30 Min, 1 Hour' : 'e.g. 3-5 Days, 1 Week'}
                      value={taskForm.deliveryTime}
                      onChange={e => setTaskForm({ ...taskForm, deliveryTime: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: modalTaskType === 'quick' ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="input-label">{modalTaskType === 'quick' ? 'Starting Price (₹)' : 'Min Budget (₹)'}</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      placeholder="400"
                      value={taskForm.price}
                      onChange={e => setTaskForm({ ...taskForm, price: e.target.value })}
                    />
                  </div>

                  {modalTaskType === 'project' && (
                    <div>
                      <label className="input-label">Max Budget (₹)</label>
                      <input
                        className="form-input"
                        type="number"
                        placeholder="25000"
                        value={taskForm.priceMax}
                        onChange={e => setTaskForm({ ...taskForm, priceMax: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Skills / Tools (Comma separated)</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Electrician, Short Circuit, Wiring, CPVC Fitting"
                    value={taskForm.skills}
                    onChange={e => setTaskForm({ ...taskForm, skills: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Service Description</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Describe what is included in this local service..."
                    value={taskForm.description}
                    onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}>
                    {editingTask ? 'Save Changes' : 'Publish Physical Task'}
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
