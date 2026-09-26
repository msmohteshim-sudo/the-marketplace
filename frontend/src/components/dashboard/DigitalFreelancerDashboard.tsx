import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, Laptop, Briefcase, Plus, Search, Filter, Star, Clock, CheckCircle2,
  DollarSign, TrendingUp, ShieldCheck, ArrowRight, X, ChevronRight, Award, MessageSquare, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Default Sample Quick Tasks (Under 24h)
const DEFAULT_QUICK_TASKS = [
  {
    id: 'f-quick-1',
    title: '⚡ Fix Critical React / Next.js Auth Bug & Hydration Error',
    description: 'Emergency 4-hour fix for Next.js App Router auth context, cookie token refresh, or SSR hydration error.',
    deliveryTime: '4 Hours',
    category: 'Web Dev',
    price: 3500,
    rating: 5.0,
    completedCount: 38,
    skills: ['Next.js', 'React', 'TypeScript', 'Auth'],
    status: 'Active'
  },
  {
    id: 'f-quick-2',
    title: '🤖 Custom AI Chatbot & LLM RAG Pipeline (OpenAI / Claude API)',
    description: 'Integrate LangChain / LlamaIndex vector store & OpenAI API into your web or Node.js backend in 12 hours.',
    deliveryTime: '12 Hours',
    category: 'AI & Data',
    price: 6500,
    rating: 5.0,
    completedCount: 29,
    skills: ['OpenAI', 'LangChain', 'Python', 'Node.js'],
    status: 'Active'
  },
  {
    id: 'f-quick-3',
    title: '🚀 Express API Endpoint & PostgreSQL Query Optimization',
    description: 'Optimize slow SQL queries, add Redis caching, and eliminate DB bottlenecks to boost response speed.',
    deliveryTime: '8 Hours',
    category: 'Backend',
    price: 4500,
    rating: 4.9,
    completedCount: 42,
    skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    status: 'Active'
  },
  {
    id: 'f-quick-4',
    title: '🐳 Dockerize & Deploy Node.js App to GCP Cloud Run / VPS',
    description: 'Multi-stage Dockerfile containerization, NGINX reverse proxy, SSL cert setup and deployment in 24 hours.',
    deliveryTime: '24 Hours',
    category: 'DevOps',
    price: 5500,
    rating: 4.9,
    completedCount: 31,
    skills: ['Docker', 'GCP', 'NGINX', 'DevOps'],
    status: 'Active'
  }
];

// Default Sample Multi-Day / Week Projects
const DEFAULT_PROJECT_PACKAGES = [
  {
    id: 'f-proj-1',
    title: '💻 Full-Stack SaaS MVP with Next.js 14, Supabase & Stripe',
    description: 'Complete production-ready SaaS application with user auth, database models, Stripe subscriptions, and responsive glassmorphism UI.',
    duration: '2-3 Weeks',
    category: 'Full-Stack',
    priceMin: 50000,
    priceMax: 85000,
    rating: 5.0,
    completedCount: 14,
    skills: ['Next.js 14', 'TypeScript', 'Supabase', 'Stripe', 'TailwindCSS'],
    status: 'Active'
  },
  {
    id: 'f-proj-2',
    title: '📱 Cross-Platform Flutter iOS & Android Mobile Application',
    description: 'Build a performant mobile app with Flutter, Firebase Auth, Push Notifications, REST API integration and app store submission.',
    duration: '2 Weeks',
    category: 'Mobile',
    priceMin: 40000,
    priceMax: 68000,
    rating: 4.9,
    completedCount: 19,
    skills: ['Flutter', 'Dart', 'Firebase', 'iOS', 'Android'],
    status: 'Active'
  },
  {
    id: 'f-proj-3',
    title: '☁️ AWS EKS Kubernetes Architecture & ArgoCD GitOps CI/CD',
    description: 'Production EKS cluster provisioning with Terraform, ArgoCD automated GitOps pipelines, Helm charts, and Monitoring metrics.',
    duration: '1-2 Weeks',
    category: 'Cloud',
    priceMin: 45000,
    priceMax: 75000,
    rating: 5.0,
    completedCount: 11,
    skills: ['Kubernetes', 'AWS EKS', 'Terraform', 'ArgoCD', 'Helm'],
    status: 'Active'
  }
];

// Open Client Jobs for Freelancer to Apply
const OPEN_CLIENT_JOBS = [
  {
    id: 'c-job-1',
    title: 'Full-Stack Developer Needed for E-Commerce Next.js Checkout',
    clientName: 'TechStyle Retail',
    budget: '₹35,000 - ₹50,000',
    duration: '1-2 Weeks',
    urgency: 'high',
    skills: ['Next.js', 'Stripe', 'Node.js']
  },
  {
    id: 'c-job-2',
    title: 'Urgent: Fix PostgreSQL Slow Aggregation Queries under Heavy Load',
    clientName: 'ScaleStack Inc',
    budget: '₹12,000 - ₹20,000',
    duration: '2-3 Days',
    urgency: 'urgent',
    skills: ['PostgreSQL', 'Database Tuning', 'Node.js']
  },
  {
    id: 'c-job-3',
    title: 'Build Custom AI Resume Parser & Summary Extractor (Python/FastAPI)',
    clientName: 'HireFast HR',
    budget: '₹25,000 - ₹40,000',
    duration: '1 Week',
    urgency: 'medium',
    skills: ['Python', 'FastAPI', 'OpenAI', 'PDF Parsing']
  }
];

export const DigitalFreelancerDashboard: React.FC = () => {
  const { user, switchWorkType } = useAuth();
  const navigate = useNavigate();

  // Task Lists
  const [quickTasks, setQuickTasks] = useState(DEFAULT_QUICK_TASKS);
  const [projectPackages, setProjectPackages] = useState(DEFAULT_PROJECT_PACKAGES);

  // Filters
  const [quickFilter, setQuickFilter] = useState('All');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalTaskType, setModalTaskType] = useState<'quick' | 'project'>('quick');

  // Form State inside Modal
  const [taskForm, setTaskForm] = useState({
    title: '',
    category: 'Web Dev',
    deliveryTime: '12 Hours',
    price: '',
    priceMax: '',
    skills: '',
    description: ''
  });

  const [createSuccessMsg, setCreateSuccessMsg] = useState(false);

  const displayName = user?.fullName?.split(' ')[0] || 'Freelancer';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  const [editingTask, setEditingTask] = useState<any>(null);

  const openModal = (type: 'quick' | 'project', taskToEdit?: any) => {
    setModalTaskType(type);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setTaskForm({
        title: taskToEdit.title || '',
        category: taskToEdit.category || 'Web Dev',
        deliveryTime: taskToEdit.deliveryTime || taskToEdit.duration || (type === 'quick' ? '12 Hours' : '1-2 Weeks'),
        price: (taskToEdit.price || taskToEdit.priceMin || 4500).toString(),
        priceMax: (taskToEdit.priceMax || '').toString(),
        skills: Array.isArray(taskToEdit.skills) ? taskToEdit.skills.join(', ') : '',
        description: taskToEdit.description || ''
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        category: 'Web Dev',
        deliveryTime: type === 'quick' ? '12 Hours' : '1-2 Weeks',
        price: type === 'quick' ? '4500' : '35000',
        priceMax: type === 'quick' ? '' : '60000',
        skills: '',
        description: ''
      });
    }
    setShowCreateModal(true);
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    if (editingTask) {
      if (modalTaskType === 'quick') {
        setQuickTasks(prev => prev.map(t => t.id === editingTask.id ? {
          ...t,
          title: taskForm.title,
          category: taskForm.category,
          deliveryTime: taskForm.deliveryTime,
          price: parseFloat(taskForm.price) || 3000,
          description: taskForm.description,
          skills: taskForm.skills ? taskForm.skills.split(',').map(s => s.trim()) : t.skills
        } : t));
      } else {
        setProjectPackages(prev => prev.map(p => p.id === editingTask.id ? {
          ...p,
          title: taskForm.title,
          category: taskForm.category,
          duration: taskForm.deliveryTime,
          priceMin: parseFloat(taskForm.price) || 25000,
          priceMax: parseFloat(taskForm.priceMax) || parseFloat(taskForm.price) * 1.5 || 45000,
          description: taskForm.description,
          skills: taskForm.skills ? taskForm.skills.split(',').map(s => s.trim()) : p.skills
        } : p));
      }
    } else {
      if (modalTaskType === 'quick') {
        const newTask = {
          id: `f-quick-custom-${Date.now()}`,
          title: taskForm.title,
          description: taskForm.description || 'Fast 24-hour digital service delivered by verified freelancer.',
          deliveryTime: taskForm.deliveryTime || '12 Hours',
          category: taskForm.category,
          price: parseFloat(taskForm.price) || 3000,
          rating: 5.0,
          completedCount: 1,
          skills: taskForm.skills ? taskForm.skills.split(',').map(s => s.trim()) : ['React', 'Node.js'],
          status: 'Active'
        };
        setQuickTasks([newTask, ...quickTasks]);
      } else {
        const newProj = {
          id: `f-proj-custom-${Date.now()}`,
          title: taskForm.title,
          description: taskForm.description || 'Comprehensive multi-day digital development project package.',
          duration: taskForm.deliveryTime || '1-2 Weeks',
          category: taskForm.category,
          priceMin: parseFloat(taskForm.price) || 25000,
          priceMax: parseFloat(taskForm.priceMax) || parseFloat(taskForm.price) * 1.5 || 45000,
          rating: 5.0,
          completedCount: 1,
          skills: taskForm.skills ? taskForm.skills.split(',').map(s => s.trim()) : ['Next.js', 'TypeScript', 'DevOps'],
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
      {/* FREELANCER DIGITAL HEADER BANNER                         */}
      {/* ───────────────────────────────────────────────────────── */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(14,165,233,0.18) 100%)',
          border: '1px solid rgba(167,139,250,0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                {greeting}, <span className="gradient-text">{displayName}</span> 🚀
              </span>
            </div>

            {/* Badges: FREELANCER DIGITAL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                FREELANCER MODE
              </span>
              <span className="badge badge-blue" style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Laptop size={12} /> DIGITAL FREELANCER
              </span>
              {(user?.freelancerWorkPreference === 'both' || user?.activeWorkType === 'both') && (
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
                  title="Switch to Physical Freelancer view"
                >
                  <RefreshCw size={11} /> Switch to Physical Freelancer
                </button>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '620px' }}>
              Offer your skills, post quick 24-hour tasks or multi-week project packages, submit proposals to client jobs, and manage active orders.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => openModal('quick')}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={16} /> Post Quick Task (&lt;24h)
            </button>

            <button
              onClick={() => openModal('project')}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderColor: '#a78bfa', color: '#a78bfa' }}
            >
              <Plus size={16} /> Post Project Package
            </button>

            <button
              onClick={() => navigate('/jobs')}
              className="btn btn-ghost"
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Briefcase size={15} /> Browse Client Jobs
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* FREELANCER ACTIVITY & EARNINGS METRICS                    */}
      {/* ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
          FREELANCER METRICS & OVERVIEW
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          
          {/* Active Orders */}
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #0ea5e9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Orders</span>
              <Briefcase size={18} color="#0ea5e9" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>3</div>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '0.25rem' }}>₹38,000 in-progress value</div>
          </div>

          {/* Submitted Proposals */}
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #7c3aed' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Submitted Proposals</span>
              <Award size={18} color="#a78bfa" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>7</div>
            <div style={{ fontSize: '0.8rem', color: '#a78bfa', marginTop: '0.25rem' }}>2 shortlisted by clients</div>
          </div>

          {/* Total Earnings */}
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Earnings</span>
              <DollarSign size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>₹84,500</div>
            <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '0.25rem' }}>+18% from last month</div>
          </div>

          {/* Client Rating */}
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Freelancer Rating</span>
              <Star size={18} color="#f59e0b" fill="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>4.95 ⭐</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>From 34 verified clients</div>
          </div>

        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* SECTION 1: QUICK DIGITAL WORK (UNDER 24 HOURS)            */}
      {/* ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                ⚡ Quick Digital Tasks Offered
              </h2>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                UNDER 24 HOURS
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, marginTop: '0.25rem' }}>
              Fast 24-hour micro-services, emergency bug fixes, and quick digital turnarounds you offer.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => openModal('quick')}
              className="btn btn-sm btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Plus size={14} /> Post Quick Task (&lt;24h)
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {['All', 'Web Dev', 'AI & Data', 'Backend', 'DevOps'].map(cat => (
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
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                      {t.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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
                      <span key={sk} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Service Price</div>
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
      {/* SECTION 2: MULTI-DAY / WEEK DIGITAL PROJECTS & PACKAGES    */}
      {/* ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                🏗️ Digital Project Packages offered by You
              </h2>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                DAYS / WEEKS
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, marginTop: '0.25rem' }}>
              Comprehensive multi-day and multi-week freelance development project packages.
            </p>
          </div>

          <button
            onClick={() => openModal('project')}
            className="btn btn-sm btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', borderColor: '#a78bfa', color: '#a78bfa' }}
          >
            <Plus size={14} /> Post Project Package
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
                border: '1px solid rgba(167,139,250,0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                    {p.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa' }}>
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
                    <span key={sk} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Project Budget Range</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
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
      {/* CREATE FREELANCER TASK / SERVICE MODAL                    */}
      {/* ───────────────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', width: '90%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {modalTaskType === 'quick' ? <Zap size={18} color="#a78bfa" /> : <Laptop size={18} color="#38bdf8" />}
                {modalTaskType === 'quick' ? 'Post Quick Digital Task (<24h)' : 'Post Project Package (>24h / Days)'}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            {createSuccessMsg ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="#34d399" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Task Listed Successfully!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your new service has been published to your freelancer dashboard & public profile.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateTaskSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Task / Service Title</label>
                  <input
                    className="form-input"
                    required
                    placeholder={modalTaskType === 'quick' ? 'e.g. Fix React Auth & Hydration Error in 4 Hours' : 'e.g. Full-Stack Next.js SaaS MVP Development'}
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
                      <option value="Web Dev">Web Dev</option>
                      <option value="Mobile">Mobile Apps</option>
                      <option value="AI & Data">AI & Data</option>
                      <option value="Backend">Backend & API</option>
                      <option value="DevOps">Cloud & DevOps</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Delivery Time / Duration</label>
                    <input
                      className="form-input"
                      placeholder={modalTaskType === 'quick' ? 'e.g. 4 Hours, 12 Hours, 24 Hours' : 'e.g. 1 Week, 2-3 Weeks'}
                      value={taskForm.deliveryTime}
                      onChange={e => setTaskForm({ ...taskForm, deliveryTime: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: modalTaskType === 'quick' ? '1fr' : '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="input-label">{modalTaskType === 'quick' ? 'Price (₹)' : 'Min Budget (₹)'}</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      placeholder="3500"
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
                        placeholder="65000"
                        value={taskForm.priceMax}
                        onChange={e => setTaskForm({ ...taskForm, priceMax: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Skills Included (Comma separated)</label>
                  <input
                    className="form-input"
                    placeholder="e.g. React, Next.js, Node.js, TypeScript"
                    value={taskForm.skills}
                    onChange={e => setTaskForm({ ...taskForm, skills: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Service Description</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Describe what is included in this service, deliverables, and requirements..."
                    value={taskForm.description}
                    onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Publish Task / Service
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
