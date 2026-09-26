import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, AlertTriangle, Briefcase, MapPin, Clock, DollarSign, Star,
  Search, Filter, Plus, Heart, CheckCircle2, ShieldCheck, UserCheck,
  ChevronRight, ArrowRight, Bookmark, Sparkles, RefreshCw, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { profileApi } from '../../services/api';
import { isItemSaved, toggleSaveItem, getLocalSavedItems } from '../../utils/savedHelper';
import { PhysicalTaskDetailModal, PhysicalTaskItem } from '../physical/PhysicalTaskDetailModal';
import { PostPhysicalTaskModal } from '../physical/PostPhysicalTaskModal';
import { UberQuickRequestModal } from '../physical/UberQuickRequestModal';

// Sample Physical Quick Tasks (Section 1)
const INITIAL_QUICK_TASKS: PhysicalTaskItem[] = [
  {
    id: 'quick-1',
    title: '📦 Pick Up & Deliver Documents',
    category: 'Errands & Pickup',
    taskType: 'quick',
    description: 'Need someone to collect important legal documents from SBI Main Branch near Gandhi Chowk and deliver to MIDC Latur office.',
    location: 'Gandhi Chowk, Latur',
    distance: '1.4 km away',
    duration: '30–45 min',
    budgetMin: 250,
    budgetMax: 400,
    workerRating: 4.9,
    workerReviewsCount: 48,
    completedJobsCount: 86,
    workerName: 'Sachin Kamble',
    skills: ['Local Delivery', 'Document Handling'],
    createdAt: '10 min ago'
  },
  {
    id: 'quick-2',
    title: '🛒 Grocery & Medicine Pickup',
    category: 'Errands & Pickup',
    taskType: 'quick',
    description: 'Pick up prescribed medicines from Apollo Pharmacy and monthly grocery list from Supermarket near Station Road.',
    location: 'Station Road, Latur',
    distance: '2.1 km away',
    duration: '45–60 min',
    budgetMin: 300,
    budgetMax: 500,
    workerRating: 4.8,
    workerReviewsCount: 32,
    completedJobsCount: 54,
    workerName: 'Pravin Shinde',
    skills: ['Errands', 'Medicine Delivery'],
    createdAt: '25 min ago'
  },
  {
    id: 'quick-3',
    title: '🖨️ Print & Deliver High-School Project',
    category: 'Errands & Pickup',
    taskType: 'quick',
    description: 'Print 40-page PDF report in spiral binding at Xerox center and deliver to Dayanand College campus.',
    location: 'Dayanand Road, Latur',
    distance: '0.8 km away',
    duration: '30 min',
    budgetMin: 200,
    budgetMax: 350,
    workerRating: 4.9,
    workerReviewsCount: 65,
    completedJobsCount: 110,
    workerName: 'Vikas Mane',
    skills: ['Printing', 'College Errands'],
    createdAt: '1 hour ago'
  },
  {
    id: 'quick-4',
    title: '🪑 Move Small Office Desk & Chair',
    category: 'Movers & Packers',
    taskType: 'quick',
    description: 'Help move 1 wooden desk and 2 chairs from 2nd floor to ground floor in Shivaji Nagar.',
    location: 'Shivaji Nagar, Latur',
    distance: '3.2 km away',
    duration: '1–2 hours',
    budgetMin: 400,
    budgetMax: 700,
    workerRating: 4.7,
    workerReviewsCount: 29,
    completedJobsCount: 45,
    workerName: 'Anil Deshmukh',
    skills: ['Heavy Lifting', 'Furniture Handling'],
    createdAt: '2 hours ago'
  }
];

// Sample Urgent Local Help (Section 2)
const INITIAL_URGENT_TASKS: PhysicalTaskItem[] = [
  {
    id: 'urgent-1',
    title: '🔧 Electrician Needed Now (Short Circuit)',
    category: 'Electrician',
    taskType: 'urgent',
    description: 'Main breaker tripped and 2 rooms lost power completely. Need an experienced electrician immediately.',
    location: 'Ambajogai Road, Latur',
    distance: '1.8 km away',
    duration: 'Arrival in 20–30 min',
    budgetMin: 350,
    budgetMax: 700,
    availableNow: true,
    urgencyLabel: 'ARRIVING IN 20–30 MIN',
    workerRating: 4.9,
    workerReviewsCount: 126,
    completedJobsCount: 240,
    workerName: 'Ramesh Patil (Master Electrician)',
    skills: ['Emergency Repairs', 'Wiring', 'Circuit Breakers'],
    createdAt: 'Just now'
  },
  {
    id: 'urgent-2',
    title: '🚰 Emergency Plumber (Water Pipe Leak)',
    category: 'Plumber',
    taskType: 'urgent',
    description: 'Kitchen sink pipe burst causing water overflow. Need plumber with tools right away.',
    location: 'Ausa Road, Latur',
    distance: '2.5 km away',
    duration: 'Arrival in 15–25 min',
    budgetMin: 400,
    budgetMax: 800,
    availableNow: true,
    urgencyLabel: 'ARRIVING IN 15–25 MIN',
    workerRating: 4.8,
    workerReviewsCount: 94,
    completedJobsCount: 180,
    workerName: 'Sunil Jadhav',
    skills: ['Pipe Leakage', 'Tap Replacement', 'Emergency Plumbing'],
    createdAt: '5 min ago'
  },
  {
    id: 'urgent-3',
    title: '🔑 Emergency Locksmith (Locked Out)',
    category: 'Locksmith',
    taskType: 'urgent',
    description: 'Main door lock jammed with key inside. Need professional locksmith to unlock without damaging door.',
    location: 'Ring Road, Latur',
    distance: '1.1 km away',
    duration: 'Arrival in 20 min',
    budgetMin: 450,
    budgetMax: 900,
    availableNow: true,
    urgencyLabel: 'ARRIVING IN 20 MIN',
    workerRating: 4.9,
    workerReviewsCount: 78,
    completedJobsCount: 155,
    workerName: 'Mahesh Solanke',
    skills: ['Door Locks', 'Key Cutting', 'Lock Opening'],
    createdAt: '12 min ago'
  },
  {
    id: 'urgent-4',
    title: '❄️ AC Not Cooling (Emergency Repair)',
    category: 'AC & Appliance',
    taskType: 'urgent',
    description: 'Split AC making loud buzzing noise and stopped cooling in hot afternoon. Gas check & coil inspection.',
    location: 'Old Ausa Road, Latur',
    distance: '3.0 km away',
    duration: 'Arrival in 30–45 min',
    budgetMin: 600,
    budgetMax: 1200,
    availableNow: true,
    urgencyLabel: 'ARRIVING IN 30–45 MIN',
    workerRating: 4.7,
    workerReviewsCount: 112,
    completedJobsCount: 198,
    workerName: 'Akash Aircon Services',
    skills: ['AC Gas Refill', 'Compressor Repair'],
    createdAt: '18 min ago'
  }
];

// Sample Physical Projects (Section 3)
const INITIAL_PROJECTS: PhysicalTaskItem[] = [
  {
    id: 'proj-1',
    title: '🏠 2-Bedroom House Interior Painting',
    category: 'Painting',
    taskType: 'project',
    description: 'Complete interior wall painting for 2BHK flat (approx 950 sq ft) including putty, primer, and Asian Paints Royale coat.',
    location: 'Latur, Maharashtra — 413512',
    distance: 'Local Latur Area',
    duration: '3–5 days',
    budgetMin: 15000,
    budgetMax: 25000,
    workerRating: 4.9,
    workerReviewsCount: 84,
    completedJobsCount: 112,
    workerName: 'Apex Painters & Contractors',
    skills: ['Interior Painting', 'Wall Putty', 'Texture Design'],
    workerCount: 3,
    createdAt: '1 day ago'
  },
  {
    id: 'proj-2',
    title: '⚡ Full Villa Electrical Wiring & Fitting',
    category: 'Electrician',
    taskType: 'project',
    description: 'Wiring installation for new 3-story residential building. Concealed conduit pipes, distribution boards, LED panel lights & inverter backup.',
    location: 'MIDC Residential Area, Latur',
    distance: '4.5 km away',
    duration: '7–10 days',
    budgetMin: 35000,
    budgetMax: 60000,
    workerRating: 4.9,
    workerReviewsCount: 140,
    completedJobsCount: 210,
    workerName: 'Shree Ganesh Electricals',
    skills: ['Concealed Wiring', '3-Phase Power', 'Panel Board Setup'],
    workerCount: 4,
    createdAt: '2 days ago'
  },
  {
    id: 'proj-3',
    title: '🚰 Complete Bathroom Sanitary & Plumbing Installation',
    category: 'Plumber',
    taskType: 'project',
    description: 'Renovation of 2 bathrooms including CPVC pipe fitting, wall-hung commode installation, shower panel & solar water heater line.',
    location: 'Shyam Nagar, Latur',
    distance: '2.8 km away',
    duration: '4–6 days',
    budgetMin: 18000,
    budgetMax: 32000,
    workerRating: 4.8,
    workerReviewsCount: 92,
    completedJobsCount: 145,
    workerName: 'Reliable Plumbing Works',
    skills: ['Bathroom Fitting', 'CPVC Piping', 'Solar Lines'],
    workerCount: 2,
    createdAt: '3 days ago'
  }
];

// Sample Local Workers Discovery
const LOCAL_WORKERS = [
  {
    id: 'w-1',
    name: 'Ramesh Patil',
    trade: 'Electrician',
    photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 142,
    completedJobs: 260,
    distance: '1.2 km away',
    startingPrice: 350,
    availableNow: true,
    skills: ['Wiring', 'Short Circuit', 'Appliance Setup']
  },
  {
    id: 'w-2',
    name: 'Sunil Jadhav',
    trade: 'Plumber',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 98,
    completedJobs: 185,
    distance: '2.4 km away',
    startingPrice: 400,
    availableNow: true,
    skills: ['Pipe Leakage', 'Tap Fitting', 'Drainage']
  },
  {
    id: 'w-3',
    name: 'Vijay Carpenter Works',
    trade: 'Carpenter',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 76,
    completedJobs: 130,
    distance: '3.1 km away',
    startingPrice: 500,
    availableNow: false,
    skills: ['Door Repair', 'Furniture Assembly', 'Cabinets']
  },
  {
    id: 'w-4',
    name: 'Santosh Cleaners',
    trade: 'Cleaner',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 64,
    completedJobs: 92,
    distance: '1.8 km away',
    startingPrice: 600,
    availableNow: true,
    skills: ['Deep Cleaning', 'Sofa Washing', 'Office Cleaning']
  }
];

export const PhysicalClientDashboard: React.FC = () => {
  const { user, switchWorkType } = useAuth();
  const navigate = useNavigate();

  // State lists
  const [quickTasks, setQuickTasks] = useState<PhysicalTaskItem[]>(INITIAL_QUICK_TASKS);
  const [urgentTasks, setUrgentTasks] = useState<PhysicalTaskItem[]>(INITIAL_URGENT_TASKS);
  const [projects, setProjects] = useState<PhysicalTaskItem[]>(INITIAL_PROJECTS);

  // Filters state per section
  const [quickCategoryFilter, setQuickCategoryFilter] = useState('All');
  const [quickBudgetFilter, setQuickBudgetFilter] = useState('All');
  const [quickSort, setQuickSort] = useState('Recommended');

  const [urgentCategoryFilter, setUrgentCategoryFilter] = useState('All');
  const [urgentSort, setUrgentSort] = useState('Nearest');

  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const [projectSort, setProjectSort] = useState('Recommended');

  // Selected Worker Trade Filter
  const [workerTradeFilter, setWorkerTradeFilter] = useState('All');

  // Modal controls
  const [selectedDetailTask, setSelectedDetailTask] = useState<PhysicalTaskItem | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showUberModal, setShowUberModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // User location state
  const [userLocation, setUserLocation] = useState(() => {
    if (user?.city && user?.state) {
      return `${user.city}, ${user.state} ${user.pincode ? `— ${user.pincode}` : ''}`;
    }
    return 'Latur, Maharashtra — 413512';
  });

  const [newPincode, setNewPincode] = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Activity summary counts
  const [savedCount, setSavedCount] = useState(0);

  const updateCounts = () => {
    const saved = getLocalSavedItems();
    setSavedCount(saved.length);
  };

  useEffect(() => {
    updateCounts();
    window.addEventListener('saved_items_updated', updateCounts);
    return () => window.removeEventListener('saved_items_updated', updateCounts);
  }, []);

  const displayName = user?.fullName?.split(' ')[0] || 'Client';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  // Handle Location Change via PIN Code
  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPincode || newPincode.trim().length !== 6) return;

    setPincodeLoading(true);
    try {
      const res = await profileApi.pincodeLookup(newPincode.trim());
      if (res.success && res.district && res.state) {
        setUserLocation(`${res.district}, ${res.state} — ${newPincode.trim()}`);
      } else {
        setUserLocation(`PIN Code ${newPincode.trim()}, India`);
      }
      setShowLocationModal(false);
    } catch (e) {
      setUserLocation(`PIN Code ${newPincode.trim()}, India`);
      setShowLocationModal(false);
    } finally {
      setPincodeLoading(false);
    }
  };

  // Callback when a user posts a new task
  const handleNewTaskPosted = (newTask: PhysicalTaskItem) => {
    if (newTask.taskType === 'urgent') {
      setUrgentTasks(prev => [newTask, ...prev]);
    } else if (newTask.taskType === 'project') {
      setProjects(prev => [newTask, ...prev]);
    } else {
      setQuickTasks(prev => [newTask, ...prev]);
    }
  };

  // Toggle Save Helper
  const handleToggleSave = async (e: React.MouseEvent, item: PhysicalTaskItem) => {
    e.stopPropagation();
    const entityType = item.taskType === 'project' ? 'physical_project' : item.taskType === 'urgent' ? 'urgent_work' : 'quick_work';
    await toggleSaveItem(entityType, item.id, {
      title: item.title,
      summary: item.description,
      price: item.budgetMin,
      category: item.category,
      creatorName: item.workerName || 'Local Worker',
      link: `/tasks/${item.id}`
    });
    updateCounts();
  };

  // Filtered Quick Tasks
  const filteredQuickTasks = quickTasks.filter(t => {
    if (quickCategoryFilter !== 'All' && t.category !== quickCategoryFilter) return false;
    if (quickBudgetFilter === 'under_500' && t.budgetMin > 500) return false;
    if (quickBudgetFilter === '500_1000' && (t.budgetMin < 500 || t.budgetMin > 1000)) return false;
    if (quickBudgetFilter === 'above_1000' && t.budgetMin < 1000) return false;
    return true;
  });

  // Filtered Urgent Tasks
  const filteredUrgentTasks = urgentTasks.filter(t => {
    if (urgentCategoryFilter !== 'All' && t.category !== urgentCategoryFilter) return false;
    return true;
  });

  // Filtered Projects
  const filteredProjects = projects.filter(t => {
    if (projectCategoryFilter !== 'All' && t.category !== projectCategoryFilter) return false;
    return true;
  });

  // Filtered Local Workers
  const filteredWorkers = LOCAL_WORKERS.filter(w => {
    if (workerTradeFilter !== 'All' && w.trade !== workerTradeFilter) return false;
    return true;
  });

  return (
    <div>
      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. PHYSICAL CLIENT HEADER BANNER                          */}
      {/* ───────────────────────────────────────────────────────── */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(14,165,233,0.18) 0%, rgba(124,58,237,0.18) 100%)',
          border: '1px solid rgba(56,189,248,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            {/* Greeting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                {greeting}, <span className="gradient-text">{displayName}</span> 👋
              </span>
            </div>

            {/* Role Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                CLIENT MODE
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={12} /> PHYSICAL / LOCAL
              </span>
              {(user?.clientWorkPreference === 'both' || user?.activeWorkType === 'both') && (
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
                  title="Switch to Digital Client view"
                >
                  <RefreshCw size={11} /> Switch to Digital Client
                </button>
              )}
            </div>

            {/* Subtitle */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '640px', marginBottom: '0.75rem' }}>
              Find trusted local workers for quick tasks, urgent help and physical projects near you.
            </p>

            {/* Location Display */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>
              <MapPin size={15} />
              <span>{userLocation}</span>
              <button
                onClick={() => setShowLocationModal(true)}
                style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.75rem', marginLeft: '0.25rem', fontWeight: 600 }}
              >
                Change Location
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setShowUberModal(true);
                const el = document.getElementById('sec-urgent-work');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', gap: '0.35rem', background: 'linear-gradient(135deg, #f43f5e 0%, #7c3aed 100%)', fontWeight: 800, cursor: 'pointer' }}
            >
              🚨 Urgent Help
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2. ACTIVITY CARDS                                         */}
      {/* ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
          YOUR LOCAL ACTIVITY
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #0ea5e9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE TASKS</span>
              <Briefcase size={16} color="#0ea5e9" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              1
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Physical tasks in progress</div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #f43f5e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>ONGOING REQUESTS</span>
              <Zap size={16} color="#f43f5e" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              0
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Urgent same-day requests</div>
          </div>

          <Link to="/saved" className="glass-card-hover" style={{ padding: '1.25rem', borderLeft: '4px solid #ec4899', textDecoration: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>SAVED TASKS</span>
              <Bookmark size={16} color="#ec4899" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              {savedCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Bookmarked local tasks & workers</div>
          </Link>

          <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #34d399' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>HIRED WORKERS</span>
              <UserCheck size={16} color="#34d399" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              2
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Local tradespeople & helpers</div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* SECTION 1 — ⚡ QUICK LOCAL WORK                            */}
      {/* ───────────────────────────────────────────────────────── */}
      <div id="sec-quick-work" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ⚡ QUICK LOCAL WORK
              </h2>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem', fontWeight: 800 }}>5 MIN – 24 HOURS</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
              Small local tasks that can be completed quickly by nearby workers.
            </p>
          </div>

          {/* Filters & Sorting */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              className="form-input"
              value={quickCategoryFilter}
              onChange={e => setQuickCategoryFilter(e.target.value)}
              style={{ width: 'auto', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              <option value="All">All Categories</option>
              <option value="Errands & Pickup">Errands & Pickup</option>
              <option value="Movers & Packers">Movers & Packers</option>
              <option value="Device Repair">Device Repair</option>
            </select>

            <select
              className="form-input"
              value={quickBudgetFilter}
              onChange={e => setQuickBudgetFilter(e.target.value)}
              style={{ width: 'auto', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              <option value="All">All Budgets</option>
              <option value="under_500">₹0 – ₹500</option>
              <option value="500_1000">₹500 – ₹1,000</option>
              <option value="above_1000">₹1,000+</option>
            </select>

            <select
              className="form-input"
              value={quickSort}
              onChange={e => setQuickSort(e.target.value)}
              style={{ width: 'auto', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              <option value="Recommended">Recommended</option>
              <option value="Nearest">Nearest First</option>
              <option value="Lowest Price">Lowest Price</option>
              <option value="Highest Rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Task Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filteredQuickTasks.map(t => {
            const saved = isItemSaved('quick_work', t.id);
            return (
              <div
                key={t.id}
                className="glass-card-hover"
                style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => setSelectedDetailTask(t)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>{t.category}</span>
                    <button
                      onClick={e => handleToggleSave(e, t)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: saved ? '#ec4899' : 'var(--text-muted)' }}
                    >
                      <Heart size={16} fill={saved ? '#ec4899' : 'none'} />
                    </button>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {t.title}
                  </h4>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginBottom: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                    {t.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} color="#38bdf8" /> <span>{t.location} ({t.distance})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={13} color="#a78bfa" /> <span>Est. Duration: {t.duration}</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>BUDGET</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', fontFamily: 'Space Grotesk' }}>
                      ₹{t.budgetMin} – ₹{t.budgetMax}
                    </span>
                  </div>

                  <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', fontWeight: 700 }}>
                    View Task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* SECTION 2 — 🚨 URGENT LOCAL HELP                           */}
      {/* ───────────────────────────────────────────────────────── */}
      <div id="sec-urgent-work" style={{ marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem', border: '1px solid rgba(244,63,94,0.3)', background: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(124,58,237,0.12) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🚨 URGENT LOCAL HELP
                </h2>
                <span className="badge badge-rose" style={{ fontSize: '0.7rem', fontWeight: 800 }}>MINUTES / SAME DAY</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '600px' }}>
                Find nearby workers who are available now or can reach you quickly for emergency repairs & urgent help.
              </p>
            </div>

            <button
              onClick={() => setShowUberModal(true)}
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #7c3aed 100%)', fontWeight: 800, padding: '0.65rem 1.25rem', gap: '0.35rem' }}
            >
              ⚡ On-Demand Worker Match
            </button>
          </div>
        </div>

        {/* Urgent Task Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {filteredUrgentTasks.map(t => {
            const saved = isItemSaved('urgent_work', t.id);
            return (
              <div
                key={t.id}
                className="glass-card-hover"
                style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', borderLeft: '4px solid #f43f5e' }}
                onClick={() => setSelectedDetailTask(t)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                    <span className="badge badge-rose" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                      🟢 AVAILABLE NOW
                    </span>
                    <button
                      onClick={e => handleToggleSave(e, t)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: saved ? '#ec4899' : 'var(--text-muted)' }}
                    >
                      <Heart size={16} fill={saved ? '#ec4899' : 'none'} />
                    </button>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {t.title}
                  </h4>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginBottom: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                    {t.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} color="#f43f5e" /> <span>{t.location} ({t.distance})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f43f5e', fontWeight: 700 }}>
                      <Clock size={13} /> <span>{t.duration}</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>STARTING FROM</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', fontFamily: 'Space Grotesk' }}>
                      ₹{t.budgetMin}
                    </span>
                  </div>

                  <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', fontWeight: 700, borderColor: 'rgba(244,63,94,0.4)', color: '#f43f5e' }}>
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* SECTION 3 — 👷 FIND A LOCAL WORKER                        */}
      {/* ───────────────────────────────────────────────────────── */}
      <div id="sec-local-workers" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              👷 FIND A LOCAL WORKER
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
              Browse verified local trade workers, plumbers, electricians and skilled helpers near you.
            </p>
          </div>

          <select
            className="form-input"
            value={workerTradeFilter}
            onChange={e => setWorkerTradeFilter(e.target.value)}
            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
          >
            <option value="All">All Trades</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Cleaner">Cleaner</option>
          </select>
        </div>

        {/* Worker Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {filteredWorkers.map(w => {
            const saved = isItemSaved('local_worker', w.id);
            return (
              <div key={w.id} className="glass-card-hover" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <img
                      src={w.photo}
                      alt={w.name}
                      style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #7c3aed' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{w.name}</h4>
                        <ShieldCheck size={14} color="#34d399" />
                      </div>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem', marginTop: '0.2rem', display: 'inline-block' }}>{w.trade}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                        <Star size={12} fill="#f59e0b" color="#f59e0b" /> {w.rating} ({w.reviews} reviews)
                      </span>
                      <span>📍 {w.distance}</span>
                    </div>
                    <div>Completed Jobs: <strong>{w.completedJobs}+</strong></div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.85rem' }}>
                    {w.skills.map(s => (
                      <span key={s} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>STARTING PRICE</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#34d399', fontFamily: 'Space Grotesk' }}>₹{w.startingPrice}</span>
                  </div>
                  <button onClick={() => setShowUberModal(true)} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', fontWeight: 800 }}>
                    Request Work
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* SECTION 4 — 🏗️ PHYSICAL PROJECTS (24+ HOURS)              */}
      {/* ───────────────────────────────────────────────────────── */}
      <div id="sec-projects" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🏗️ PHYSICAL PROJECTS
              </h2>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem', fontWeight: 800 }}>24+ HOURS</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
              For larger jobs that require more time, planning or multiple workers.
            </p>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {filteredProjects.map(t => {
            const saved = isItemSaved('physical_project', t.id);
            return (
              <div
                key={t.id}
                className="glass-card-hover"
                style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => setSelectedDetailTask(t)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                    <span className="badge badge-blue" style={{ fontSize: '0.68rem', fontWeight: 800 }}>{t.category}</span>
                    <button
                      onClick={e => handleToggleSave(e, t)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: saved ? '#ec4899' : 'var(--text-muted)' }}
                    >
                      <Heart size={16} fill={saved ? '#ec4899' : 'none'} />
                    </button>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {t.title}
                  </h4>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {t.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} color="#38bdf8" /> <span>{t.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={13} color="#a78bfa" /> <span>Estimated Duration: {t.duration}</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>PROJECT BUDGET</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', fontFamily: 'Space Grotesk' }}>
                      ₹{t.budgetMin.toLocaleString()} – ₹{t.budgetMax.toLocaleString()}
                    </span>
                  </div>

                  <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', fontWeight: 700 }}>
                    View Project
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* LOCATION CHANGE MODAL                                     */}
      {/* ───────────────────────────────────────────────────────── */}
      {showLocationModal && (
        <div className="modal-backdrop" onClick={() => setShowLocationModal(false)} style={{ zIndex: 1100 }}>
          <div
            className="modal-content glass-card"
            style={{ maxWidth: 420, padding: '1.75rem', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Change Marketplace Location
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setShowLocationModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleLocationSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="input-label">Enter 6-Digit PIN Code</label>
                <input
                  className="form-input"
                  placeholder="e.g. 413512 or 400001"
                  maxLength={6}
                  value={newPincode}
                  onChange={e => setNewPincode(e.target.value.replace(/\D/g, ''))}
                  style={{ fontWeight: 800, letterSpacing: '0.1rem' }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowLocationModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={pincodeLoading}>
                  {pincodeLoading ? 'Updating Location...' : 'UPDATE LOCATION'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      <PhysicalTaskDetailModal
        task={selectedDetailTask}
        isOpen={Boolean(selectedDetailTask)}
        onClose={() => setSelectedDetailTask(null)}
      />

      {/* Post Physical Task Modal */}
      <PostPhysicalTaskModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onTaskCreated={handleNewTaskPosted}
      />

      {/* Uber Quick Request Modal */}
      <UberQuickRequestModal
        isOpen={showUberModal}
        onClose={() => setShowUberModal(false)}
        userLocation={userLocation}
      />
    </div>
  );
};
