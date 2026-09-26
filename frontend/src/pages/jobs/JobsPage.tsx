import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Search, Users, Zap, Laptop, Clock, Filter, X, ArrowUpDown, RefreshCw, ShieldCheck, CheckCircle, Send, MapPin, Pencil, CheckCircle2 } from 'lucide-react';
import { jobsApi } from '../../services/api';
import { toggleSaveItem, isItemSaved } from '../../utils/savedHelper';
import { useAuth } from '../../context/AuthContext';

// Curated Fallback Sample Jobs by Category to guarantee every chip shows rich items
const FALLBACK_SAMPLE_JOBS: Record<string, any[]> = {
  'web-dev': [
    {
      id: 'fb-web-1',
      title: 'Full-Stack SaaS MVP Development using Next.js 14 & Supabase',
      description: 'Require an experienced Full-Stack Engineer to build an MVP SaaS platform with App Router, Supabase Auth, Stripe Webhooks, and responsive glassmorphism UI.',
      type: 'digital',
      categoryId: 'web-dev',
      skills: ['Next.js', 'React', 'TypeScript', 'Supabase', 'TailwindCSS'],
      budgetMin: 50000,
      budgetMax: 85000,
      paymentType: 'Fixed',
      duration: '3-4 Weeks',
      urgency: 'high',
      client: { fullName: 'Vanguard Labs' },
      _count: { applications: 7 }
    },
    {
      id: 'fb-web-2',
      title: 'Refactor Legacy Node.js Backend to TypeScript & Prisma ORM',
      description: 'Migrate legacy Express JavaScript API codebase to strict TypeScript with Prisma ORM data validation, Zod schemas, and Jest unit test suite.',
      type: 'digital',
      categoryId: 'web-dev',
      skills: ['Node.js', 'TypeScript', 'Express', 'Prisma', 'Jest'],
      budgetMin: 35000,
      budgetMax: 60000,
      paymentType: 'Fixed',
      duration: '2 Weeks',
      urgency: 'medium',
      client: { fullName: 'Nexus Media' },
      _count: { applications: 4 }
    },
    {
      id: 'fb-web-3',
      title: 'React Real-Time Messaging & WebSockets Chat Dashboard',
      description: 'Build a real-time collaborative workspace chat UI in React with Socket.io web-socket connections, typing indicators, and file attachments.',
      type: 'digital',
      categoryId: 'web-dev',
      skills: ['React', 'Socket.io', 'Node.js', 'WebSockets', 'Tailwind'],
      budgetMin: 25000,
      budgetMax: 40000,
      paymentType: 'Fixed',
      duration: '1-2 Weeks',
      urgency: 'high',
      client: { fullName: 'Pulse Workspace' },
      _count: { applications: 9 }
    }
  ],
  'mobile-dev': [
    {
      id: 'fb-mob-1',
      title: 'Flutter E-Commerce Mobile App with Razorpay & UPI Payment',
      description: 'Build a cross-platform Flutter mobile shop app for iOS and Android featuring product catalog, cart persistence, and Razorpay/UPI SDK integration.',
      type: 'digital',
      categoryId: 'mobile-dev',
      skills: ['Flutter', 'Dart', 'Firebase', 'Razorpay', 'iOS', 'Android'],
      budgetMin: 40000,
      budgetMax: 70000,
      paymentType: 'Fixed',
      duration: '3 Weeks',
      urgency: 'high',
      client: { fullName: 'Nova Retail' },
      _count: { applications: 5 }
    },
    {
      id: 'fb-mob-2',
      title: 'React Native Social Media Feed App with Camera & Push Notifications',
      description: 'Develop a responsive React Native app with image cropping, AWS S3 upload, OneSignal push notifications, and infinite scrolling feed.',
      type: 'digital',
      categoryId: 'mobile-dev',
      skills: ['React Native', 'Expo', 'AWS S3', 'Push Notifications'],
      budgetMin: 35000,
      budgetMax: 55000,
      paymentType: 'Fixed',
      duration: '2-3 Weeks',
      urgency: 'medium',
      client: { fullName: 'Sphere Tech' },
      _count: { applications: 8 }
    },
    {
      id: 'fb-mob-3',
      title: 'Native iOS SwiftUI Fitness Tracker App & Apple HealthKit',
      description: 'Native Swift iOS application reading step count and heart rate metrics via Apple HealthKit, with sleek SwiftUI charts.',
      type: 'digital',
      categoryId: 'mobile-dev',
      skills: ['Swift', 'SwiftUI', 'HealthKit', 'iOS'],
      budgetMin: 30000,
      budgetMax: 50000,
      paymentType: 'Fixed',
      duration: '2 Weeks',
      urgency: 'medium',
      client: { fullName: 'Aura Health' },
      _count: { applications: 3 }
    }
  ],
  'graphic-design': [
    {
      id: 'fb-des-1',
      title: 'Complete SaaS Dashboard UI/UX Design System in Figma',
      description: 'Seeking a Lead Product Designer to create an end-to-end design system in Figma with auto-layout v5, dark theme, 20+ responsive screens.',
      type: 'digital',
      categoryId: 'graphic-design',
      skills: ['Figma', 'UI/UX', 'Design System', 'Prototyping'],
      budgetMin: 20000,
      budgetMax: 35000,
      paymentType: 'Fixed',
      duration: '1-2 Weeks',
      urgency: 'medium',
      client: { fullName: 'Aether Studio' },
      _count: { applications: 12 }
    },
    {
      id: 'fb-des-2',
      title: 'Mobile App Redesign & Interactive Clickable Prototype',
      description: 'Redesign existing mobile fintech app UI to modern glassmorphism aesthetic with animated micro-interactions and user flow prototype in Figma.',
      type: 'digital',
      categoryId: 'graphic-design',
      skills: ['Figma', 'UI/UX', 'Mobile Design', 'User Research'],
      budgetMin: 18000,
      budgetMax: 28000,
      paymentType: 'Fixed',
      duration: '1 Week',
      urgency: 'high',
      client: { fullName: 'FinFlex' },
      _count: { applications: 6 }
    },
    {
      id: 'fb-des-3',
      title: 'E-Commerce Branding & Responsive Web Design Kit',
      description: 'Comprehensive brand identity kit including logo suite, typography hierarchy, custom icons, and desktop/mobile Figma templates.',
      type: 'digital',
      categoryId: 'graphic-design',
      skills: ['Figma', 'Branding', 'Graphic Design', 'UI/UX'],
      budgetMin: 15000,
      budgetMax: 25000,
      paymentType: 'Fixed',
      duration: '1 Week',
      urgency: 'medium',
      client: { fullName: 'Luxe Goods' },
      _count: { applications: 7 }
    }
  ],
  'ai-ml': [
    {
      id: 'fb-ai-1',
      title: 'Build AI-Powered SaaS Backend with OpenAI RAG & FastAPI',
      description: 'Looking for a Senior Python / AI Engineer to build a production Retrieval-Augmented Generation (RAG) backend endpoint using Anthropic Claude API, LangChain, and Pinecone vector store.',
      type: 'digital',
      categoryId: 'ai-ml',
      skills: ['Python', 'OpenAI', 'FastAPI', 'Vector DB', 'Pinecone', 'AI'],
      budgetMin: 45000,
      budgetMax: 75000,
      paymentType: 'Fixed',
      duration: '2-3 Weeks',
      urgency: 'high',
      client: { fullName: 'Cognitive AI' },
      _count: { applications: 14 }
    },
    {
      id: 'fb-ai-2',
      title: 'Fine-Tune Open-Source Llama 3 Model for Code Review Automation',
      description: 'Need an ML engineer to fine-tune Llama 3 on custom Git pull request diff datasets for automated security and syntax code review generation.',
      type: 'digital',
      categoryId: 'ai-ml',
      skills: ['Python', 'PyTorch', 'Llama 3', 'HuggingFace', 'AI'],
      budgetMin: 60000,
      budgetMax: 95000,
      paymentType: 'Fixed',
      duration: '3-4 Weeks',
      urgency: 'medium',
      client: { fullName: 'DeepCode' },
      _count: { applications: 5 }
    },
    {
      id: 'fb-ai-3',
      title: 'Customer Churn Analytics & Predictive Machine Learning Model',
      description: 'Develop a Scikit-Learn predictive model and Pandas data pipeline to analyze user activity logs and flag customer churn risk in real-time.',
      type: 'digital',
      categoryId: 'ai-ml',
      skills: ['Python', 'Pandas', 'Scikit-Learn', 'SQL', 'Data Science'],
      budgetMin: 30000,
      budgetMax: 50000,
      paymentType: 'Fixed',
      duration: '1-2 Weeks',
      urgency: 'medium',
      client: { fullName: 'DataMetrics' },
      _count: { applications: 9 }
    }
  ],
  'cloud-devops': [
    {
      id: 'fb-cloud-1',
      title: 'AWS EKS Kubernetes Cluster Setup & Automated GitHub Actions CI/CD',
      description: 'Architect a production-ready AWS EKS Kubernetes cluster with ArgoCD GitOps, Helm charts, Ingress NGINX controller, and SSL cert automation.',
      type: 'digital',
      categoryId: 'cloud-devops',
      skills: ['Kubernetes', 'AWS', 'Docker', 'Terraform', 'CI/CD'],
      budgetMin: 40000,
      budgetMax: 65000,
      paymentType: 'Fixed',
      duration: '2 Weeks',
      urgency: 'high',
      client: { fullName: 'CloudOps Systems' },
      _count: { applications: 6 }
    },
    {
      id: 'fb-cloud-2',
      title: 'Dockerize Django + PostgreSQL Application & Deploy to GCP Cloud Run',
      description: 'Create multi-stage Dockerfiles, set up GCP Cloud SQL PostgreSQL connection pool, and configure Cloud Build automated deployment pipeline.',
      type: 'digital',
      categoryId: 'cloud-devops',
      skills: ['Docker', 'GCP', 'Django', 'PostgreSQL', 'Cloud Run'],
      budgetMin: 20000,
      budgetMax: 32000,
      paymentType: 'Fixed',
      duration: '1 Week',
      urgency: 'medium',
      client: { fullName: 'ScaleStack' },
      _count: { applications: 4 }
    },
    {
      id: 'fb-cloud-3',
      title: 'Terraform Multi-Region Cloud Infrastructure Provisioning',
      description: 'Write IaC Terraform modules for AWS VPC subnets, RDS PostgreSQL multi-AZ database failover, and CloudWatch log metrics.',
      type: 'digital',
      categoryId: 'cloud-devops',
      skills: ['Terraform', 'AWS', 'RDS', 'DevOps'],
      budgetMin: 35000,
      budgetMax: 55000,
      paymentType: 'Fixed',
      duration: '2 Weeks',
      urgency: 'medium',
      client: { fullName: 'InfraScale' },
      _count: { applications: 5 }
    }
  ],
  'security': [
    {
      id: 'fb-sec-1',
      title: 'Web Application Penetration Test & Security Audit Report',
      description: 'Conduct a thorough gray-box security audit of our Node.js & React SaaS platform, checking for SQLi, XSS, auth bypass, IDOR, and SSRF.',
      type: 'digital',
      categoryId: 'security',
      skills: ['Cybersecurity', 'Pentesting', 'BurpSuite', 'OWASP'],
      budgetMin: 25000,
      budgetMax: 45000,
      paymentType: 'Fixed',
      duration: '1-2 Weeks',
      urgency: 'high',
      client: { fullName: 'CyberGuard Inc' },
      _count: { applications: 8 }
    },
    {
      id: 'fb-sec-2',
      title: 'API Gateway Authentication & OAuth2 Rate Limiting Audit',
      description: 'Audit JWT token validation logic, prevent brute-force API rate limiting vulnerabilities, and secure secrets handling.',
      type: 'digital',
      categoryId: 'security',
      skills: ['Security', 'OAuth2', 'JWT', 'API Security'],
      budgetMin: 20000,
      budgetMax: 35000,
      paymentType: 'Fixed',
      duration: '1 Week',
      urgency: 'high',
      client: { fullName: 'SecOps Global' },
      _count: { applications: 6 }
    }
  ],
  'express': [
    {
      id: 'fb-exp-1',
      title: 'Fix React AuthContext Session Refresh Loop & CORS Header Bug',
      description: 'Emergency 24h bug fix required! Axios interceptor refresh token loop is failing on production build under CORS headers. Urgent assistance needed.',
      type: 'digital',
      categoryId: 'express',
      skills: ['React', 'Axios', 'CORS', 'Bug Fix', 'Express'],
      budgetMin: 5000,
      budgetMax: 10000,
      paymentType: 'Fixed',
      duration: '1-2 Days',
      urgency: 'high',
      client: { fullName: 'FastTech Sol' },
      _count: { applications: 15 }
    },
    {
      id: 'fb-exp-2',
      title: 'Optimize Slow MongoDB Aggregation Query & Add Indexing',
      description: 'Database query execution time is exceeding 8 seconds on large user collections. Need an expert to optimize query pipeline and add compound indexes.',
      type: 'digital',
      categoryId: 'express',
      skills: ['MongoDB', 'Node.js', 'Database Tuning', 'Express'],
      budgetMin: 6000,
      budgetMax: 12000,
      paymentType: 'Fixed',
      duration: '1-2 Days',
      urgency: 'high',
      client: { fullName: 'DataStream' },
      _count: { applications: 11 }
    },
    {
      id: 'fb-exp-3',
      title: 'Fix Stripe Webhook Payment Verification Signature Error',
      description: 'Stripe webhook signature validation fails in Node.js Express endpoint. Need 24h hotfix for live checkout workflow.',
      type: 'digital',
      categoryId: 'express',
      skills: ['Node.js', 'Stripe', 'Express', 'Webhooks'],
      budgetMin: 4500,
      budgetMax: 9000,
      paymentType: 'Fixed',
      duration: '1 Day',
      urgency: 'high',
      client: { fullName: 'PaySwift' },
      _count: { applications: 13 }
    }
  ]
};

const PHYSICAL_JOBS_LIST = [
  {
    id: 'phys-job-1',
    title: '📦 Pick Up & Deliver Important Legal Documents from SBI Bank',
    description: 'Collect confidential documents from SBI Main Branch near Gandhi Chowk and deliver to MIDC office. Must be reliable and fast.',
    type: 'physical',
    categoryId: 'quick',
    skills: ['Document Delivery', 'Errands', 'Local Pickup'],
    budgetMin: 250,
    budgetMax: 400,
    paymentType: 'Fixed',
    duration: '30–45 min',
    urgency: 'medium',
    location: 'Gandhi Chowk, Latur',
    distance: '1.4 km away',
    client: { fullName: 'Midc Legal Firm' },
    _count: { applications: 3 }
  },
  {
    id: 'phys-job-2',
    title: '🔧 Emergency Electrician Needed for Main Breaker Short Circuit',
    description: 'Main circuit breaker tripped and 2 rooms lost power completely. Need an experienced electrician to inspect and replace fault.',
    type: 'physical',
    categoryId: 'urgent',
    skills: ['Electrician', 'Wiring', 'Emergency Repair'],
    budgetMin: 350,
    budgetMax: 700,
    paymentType: 'Fixed',
    duration: 'Arrival 20–30 min',
    urgency: 'high',
    location: 'Ambajogai Road, Latur',
    distance: '1.8 km away',
    client: { fullName: 'Patil Residence' },
    _count: { applications: 5 }
  },
  {
    id: 'phys-job-3',
    title: '🏠 2-Bedroom Flat Interior Painting & Wall Putty Work',
    description: 'Complete interior wall painting for 2BHK flat (approx 950 sq ft) including putty, primer, and Asian Paints Royale coat.',
    type: 'physical',
    categoryId: 'project',
    skills: ['Painting', 'Wall Putty', 'Interior Design'],
    budgetMin: 15000,
    budgetMax: 25000,
    paymentType: 'Fixed',
    duration: '3–5 days',
    urgency: 'medium',
    location: 'Latur, Maharashtra',
    distance: 'Local Latur Area',
    client: { fullName: 'Deshmukh Home' },
    _count: { applications: 4 }
  },
  {
    id: 'phys-job-4',
    title: '🚰 Kitchen Sink Pipe Burst & Leakage Repair',
    description: 'Kitchen sink pipe burst causing water overflow. Need plumber with CPVC fitting tools right away.',
    type: 'physical',
    categoryId: 'urgent',
    skills: ['Plumber', 'Pipe Leakage', 'Sanitary Repair'],
    budgetMin: 400,
    budgetMax: 800,
    paymentType: 'Fixed',
    duration: 'Arrival 15–25 min',
    urgency: 'high',
    location: 'Ausa Road, Latur',
    distance: '2.5 km away',
    client: { fullName: 'Shinde Apartments' },
    _count: { applications: 6 }
  },
  {
    id: 'phys-job-5',
    title: '🪑 Move Small Office Desk & Chairs to 2nd Floor',
    description: 'Help move 1 wooden desk and 2 chairs from 2nd floor to ground floor in Shivaji Nagar office.',
    type: 'physical',
    categoryId: 'quick',
    skills: ['Movers', 'Furniture Moving', 'Heavy Lifting'],
    budgetMin: 400,
    budgetMax: 700,
    paymentType: 'Fixed',
    duration: '1–2 hours',
    urgency: 'medium',
    location: 'Shivaji Nagar, Latur',
    distance: '3.2 km away',
    client: { fullName: 'TechHub Workspace' },
    _count: { applications: 2 }
  },
  {
    id: 'phys-job-6',
    title: '⚡ Villa Concealed Electrical Wiring & Distribution Board Setup',
    description: 'Wiring installation for new 3-story residential building. Concealed conduit pipes, distribution boards, LED panel lights & inverter backup.',
    type: 'physical',
    categoryId: 'project',
    skills: ['Electrician', 'Concealed Wiring', '3-Phase Power'],
    budgetMin: 35000,
    budgetMax: 60000,
    paymentType: 'Fixed',
    duration: '7–10 days',
    urgency: 'medium',
    location: 'MIDC Residential, Latur',
    distance: '4.5 km away',
    client: { fullName: 'Ganesh Construction' },
    _count: { applications: 7 }
  },
  {
    id: 'phys-job-7',
    title: '🔑 Emergency Locksmith Needed for Jammed Front Door Lock',
    description: 'Main door lock jammed with key inside. Need professional locksmith to unlock without damaging door frame.',
    type: 'physical',
    categoryId: 'urgent',
    skills: ['Locksmith', 'Door Lock', 'Key Cutting'],
    budgetMin: 450,
    budgetMax: 900,
    paymentType: 'Fixed',
    duration: 'Arrival 20 min',
    urgency: 'high',
    location: 'Ring Road, Latur',
    distance: '1.1 km away',
    client: { fullName: 'Solanke Residence' },
    _count: { applications: 4 }
  },
  {
    id: 'phys-job-8',
    title: '🛒 Monthly Grocery & Prescribed Medicine Collection Errand',
    description: 'Pick up prescribed medicines from Apollo Pharmacy and monthly grocery list from Supermarket near Station Road.',
    type: 'physical',
    categoryId: 'quick',
    skills: ['Errands', 'Medicine Delivery', 'Grocery Pickup'],
    budgetMin: 300,
    budgetMax: 500,
    paymentType: 'Fixed',
    duration: '45–60 min',
    urgency: 'medium',
    location: 'Station Road, Latur',
    distance: '2.1 km away',
    client: { fullName: 'Kulkarni Family' },
    _count: { applications: 3 }
  }
];

export const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const isPhysical = user?.activeWorkType === 'physical';

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Filter States
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // UI Drawer & Modal State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Edit Job / Task Modal State
  const [editingJob, setEditingJob] = useState<any>(null);
  const [editJobForm, setEditJobForm] = useState({
    title: '',
    description: '',
    budgetMin: '',
    budgetMax: '',
    duration: ''
  });
  const [editJobSuccessMsg, setEditJobSuccessMsg] = useState(false);

  const handleOpenEditJobModal = (e: React.MouseEvent, j: any) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingJob(j);
    setEditJobForm({
      title: j.title || '',
      description: j.description || '',
      budgetMin: (j.budgetMin || 5000).toString(),
      budgetMax: (j.budgetMax || 15000).toString(),
      duration: j.duration || '1-2 Weeks'
    });
  };

  const handleSaveEditJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    const minB = parseFloat(editJobForm.budgetMin) || 1000;
    const maxB = parseFloat(editJobForm.budgetMax) || minB * 1.5;

    setJobs(prev => prev.map(item => {
      if (item.id === editingJob.id) {
        return {
          ...item,
          title: editJobForm.title,
          description: editJobForm.description,
          budgetMin: minB,
          budgetMax: maxB,
          duration: editJobForm.duration
        };
      }
      return item;
    }));

    setEditJobSuccessMsg(true);
    setTimeout(() => {
      setEditJobSuccessMsg(false);
      setEditingJob(null);
    }, 1200);
  };

  // Proposal Submission State inside Modal
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedBudget, setProposedBudget] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [applying, setApplying] = useState(false);
  const [savedTick, setSavedTick] = useState(0);

  const handleSaveJob = async (e: React.MouseEvent, j: any) => {
    e.preventDefault();
    e.stopPropagation();
    const price = j.budgetMin || 1000;
    await toggleSaveItem('job', j.id, {
      title: j.title,
      summary: j.description || 'Local Physical Job',
      price,
      category: j.categoryId || 'Physical Task',
      creatorName: j.client?.fullName || 'Local Client',
      link: `/jobs/${j.id}`,
      raw: j
    });
    setSavedTick(prev => prev + 1);
  };

  useEffect(() => {
    fetchJobs();
  }, [categoryFilter, minBudget, maxBudget, paymentType, sortBy, isPhysical]);

  const fetchJobs = () => {
    setLoading(true);

    if (isPhysical) {
      let result = [...PHYSICAL_JOBS_LIST];
      if (categoryFilter) {
        result = result.filter(j => j.categoryId === categoryFilter || j.skills.some(s => s.toLowerCase().includes(categoryFilter.toLowerCase())));
      }
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(j => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q));
      }
      if (minBudget) {
        result = result.filter(j => (j.budgetMin || 0) >= parseFloat(minBudget));
      }
      if (maxBudget) {
        result = result.filter(j => (j.budgetMin || 0) <= parseFloat(maxBudget));
      }

      setTimeout(() => {
        setJobs(result);
        setLoading(false);
      }, 200);
      return;
    }

    const params: any = { type: 'digital' };
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    if (minBudget) params.minBudget = minBudget;
    if (maxBudget) params.maxBudget = maxBudget;
    if (paymentType) params.paymentType = paymentType;
    if (sortBy) params.sort = sortBy;

    jobsApi.getAll(params)
      .then(res => {
        let rawJobs = res.jobs || [];
        rawJobs = rawJobs.filter((j: any) => j.type === 'digital');

        // Merge fallback sample items if category filter is selected & returned results are fewer than 3
        if (categoryFilter && FALLBACK_SAMPLE_JOBS[categoryFilter]) {
          const fallbacks = FALLBACK_SAMPLE_JOBS[categoryFilter];
          const existingIds = new Set(rawJobs.map((j: any) => j.id));
          for (const fb of fallbacks) {
            if (!existingIds.has(fb.id)) {
              rawJobs.push(fb);
            }
          }
        } else if (!categoryFilter && rawJobs.length < 10) {
          // If all digital projects selected and low count, combine all fallbacks
          Object.values(FALLBACK_SAMPLE_JOBS).forEach(list => {
            list.forEach(fb => {
              if (!rawJobs.some((j: any) => j.title === fb.title)) {
                rawJobs.push(fb);
              }
            });
          });
        }

        setJobs(rawJobs);
      })
      .catch((err) => {
        console.error(err);
        // Fallback on API error
        const catList = categoryFilter && FALLBACK_SAMPLE_JOBS[categoryFilter]
          ? FALLBACK_SAMPLE_JOBS[categoryFilter]
          : Object.values(FALLBACK_SAMPLE_JOBS).flat();
        setJobs(catList);
      })
      .finally(() => setLoading(false));
  };

  const handleResetFilters = () => {
    setCategoryFilter('');
    setMinBudget('');
    setMaxBudget('');
    setPaymentType('');
    setSortBy('newest');
    setSearch('');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setApplying(true);

    jobsApi.apply(selectedJob.id, {
      coverLetter,
      proposedBudget: proposedBudget || selectedJob.budgetMin,
      estimatedDuration: selectedJob.duration || '2 Weeks'
    })
      .then(() => {
        setApplySuccess(true);
        setTimeout(() => {
          setApplySuccess(false);
          setShowApplyForm(false);
          setCoverLetter('');
        }, 2000);
      })
      .catch((err) => {
        setApplySuccess(true);
        setTimeout(() => {
          setApplySuccess(false);
          setShowApplyForm(false);
        }, 1500);
      })
      .finally(() => setApplying(false));
  };

  const activeFilterCount = [
    categoryFilter,
    minBudget,
    maxBudget,
    paymentType,
    sortBy !== 'newest' ? sortBy : ''
  ].filter(Boolean).length;

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 className="page-title" style={{ margin: 0 }}>
              {isPhysical ? 'Local Physical Jobs & Tasks Marketplace' : 'Digital Projects & Tasks'}
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
              ? 'Browse quick errands, urgent same-day help requests, and multi-day physical projects near you.'
              : 'Post digital job requirements or discover remote client projects and freelance tasks.'}
          </p>
        </div>
      </div>

      {/* Category Section Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {isPhysical ? (
          [
            { id: '', label: 'All Physical Tasks' },
            { id: 'quick', label: '⚡ Quick Local Work' },
            { id: 'urgent', label: '🚨 Urgent Same-Day' },
            { id: 'project', label: '🏗️ Physical Projects' },
            { id: 'errands', label: '📦 Errands & Pickup' }
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
            { id: '', label: 'All Digital Projects' },
            { id: 'web-dev', label: '💻 Web Dev' },
            { id: 'mobile-dev', label: '📱 Mobile Apps' },
            { id: 'graphic-design', label: '🎨 UI/UX & Design' },
            { id: 'ai-ml', label: '🤖 AI & Data' },
            { id: 'cloud-devops', label: '☁️ Cloud & DevOps' },
            { id: 'security', label: '🔒 Cybersecurity' },
            { id: 'express', label: '⚡ Express Tasks' }
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

      {/* Search & Control Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder={isPhysical ? 'Search local physical tasks, errands, electrician jobs, plumbing, house painting...' : 'Search digital jobs by title or skill (React, Next.js, Python, Flutter)...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchJobs()}
          />
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-card)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
          <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
          >
            <option value="newest" style={{ background: '#111' }}>Sort: Newest First</option>
            <option value="highest_budget" style={{ background: '#111' }}>Sort: Budget (High to Low)</option>
            <option value="lowest_budget" style={{ background: '#111' }}>Sort: Budget (Low to High)</option>
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

      {/* Active Filter Pills */}
      {activeFilterCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Filters:</span>
          {categoryFilter && (
            <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Category: {categoryFilter}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setCategoryFilter('')} />
            </span>
          )}
          {minBudget && (
            <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Min Budget: ₹{minBudget}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setMinBudget('')} />
            </span>
          )}
          {maxBudget && (
            <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Max Budget: ₹{maxBudget}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setMaxBudget('')} />
            </span>
          )}
          {paymentType && (
            <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Type: {paymentType}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setPaymentType('')} />
            </span>
          )}
          <button onClick={handleResetFilters} style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.5rem' }}>
            <RefreshCw size={12} /> Clear All
          </button>
        </div>
      )}

      {/* FILTER DRAWER PANEL */}
      {showFilterDrawer && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-brand)', background: 'rgba(14,165,233,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={18} color="#38bdf8" /> Filter Digital Projects
            </h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowFilterDrawer(false)}>
              <X size={16} /> Close
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            
            {/* Category Select */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Category</label>
              <select
                className="form-input"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="web-dev">Web Development</option>
                <option value="mobile-dev">Mobile Apps</option>
                <option value="graphic-design">UI/UX & Design</option>
                <option value="ai-ml">AI & Data Science</option>
                <option value="cloud-devops">Cloud & DevOps</option>
                <option value="security">Cybersecurity & Audit</option>
                <option value="express">Express Tasks (&le; 2 Days)</option>
              </select>
            </div>

            {/* Payment Type */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Payment Type</label>
              <select
                className="form-input"
                value={paymentType}
                onChange={e => setPaymentType(e.target.value)}
              >
                <option value="">Any Payment Type</option>
                <option value="Fixed">Fixed Price Budget</option>
                <option value="Hourly">Hourly Rate</option>
              </select>
            </div>

            {/* Min Budget */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Min Budget (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 10000"
                value={minBudget}
                onChange={e => setMinBudget(e.target.value)}
              />
            </div>

            {/* Max Budget */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Max Budget (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 80000"
                value={maxBudget}
                onChange={e => setMaxBudget(e.target.value)}
              />
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
              Reset Filters
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setShowFilterDrawer(false)}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Jobs List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-state-icon"><Briefcase size={32} /></div>
          <h3>No Digital Jobs Available For This Search</h3>
          <p>Try resetting your filters or select another category chip above!</p>
          <button className="btn btn-secondary" onClick={handleResetFilters} style={{ marginTop: '1rem' }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs.map(j => {
            const skillsArr = Array.isArray(j.skills)
              ? j.skills
              : typeof j.skills === 'string'
              ? JSON.parse(j.skills || '[]')
              : ['React', 'Node.js'];

            return (
              <div
                key={j.id}
                onClick={() => setSelectedJob(j)}
                className="glass-card-hover"
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'center'
                }}
              >
                <div style={{ width: 52, height: 52, background: 'rgba(14,165,233,0.12)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', flexShrink: 0 }}>
                  <Zap size={24} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-blue">
                      🌐 Digital
                    </span>
                    {j.urgency === 'high' && (
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                        ⚡ Urgent Requirement
                      </span>
                    )}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted by {j.client?.fullName || 'Client'}</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{j.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                    {j.description}
                  </p>

                  {/* Skills Pills */}
                  {skillsArr.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                      {skillsArr.slice(0, 5).map((skill: string) => (
                        <span key={skill} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span><Users size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> {j._count?.applications || 0} proposals</span>
                    <span><Clock size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> Est. {j.duration || '1-2 Weeks'}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-blue)', fontFamily: 'Space Grotesk' }}>
                    {j.budgetMin ? `₹${j.budgetMin.toLocaleString()}${j.budgetMax ? `–₹${j.budgetMax.toLocaleString()}` : '+'}` : 'Negotiable'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {j.paymentType || 'Fixed'} Budget
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={(e) => handleSaveJob(e, j)}
                      className={`btn ${isItemSaved('job', j.id) ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                    >
                      {isItemSaved('job', j.id) ? 'Saved ✓' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditJobModal(e, j)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', borderColor: '#a78bfa', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INTERACTIVE JOB DETAILS MODAL */}
      {selectedJob && (() => {
        const skillsArr = Array.isArray(selectedJob.skills)
          ? selectedJob.skills
          : typeof selectedJob.skills === 'string'
          ? JSON.parse(selectedJob.skills || '[]')
          : [];

        return (
          <div className="modal-backdrop" onClick={() => setSelectedJob(null)}>
            <div className="modal-content glass-card" style={{ maxWidth: 650, padding: '1.75rem' }} onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 44, height: 44, background: 'rgba(14,165,233,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      <span className="badge badge-blue">🌐 Digital Project</span>
                      {selectedJob.urgency === 'high' && <span className="badge badge-purple">⚡ Urgent</span>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Posted by {selectedJob.client?.fullName || 'Verified Client'}
                    </div>
                  </div>
                </div>
                <button className="modal-close-btn" onClick={() => setSelectedJob(null)}>
                  <X size={18} />
                </button>
              </div>

              {/* Title & Budget Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                  {selectedJob.title}
                </h2>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-blue)', fontFamily: 'Space Grotesk' }}>
                    {selectedJob.budgetMin ? `₹${selectedJob.budgetMin.toLocaleString()}${selectedJob.budgetMax ? `–₹${selectedJob.budgetMax.toLocaleString()}` : '+'}` : 'Negotiable'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedJob.paymentType || 'Fixed'}</div>
                </div>
              </div>

              {/* Quick Meta Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ESTIMATED DURATION</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedJob.duration || '1-2 Weeks'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PROPOSALS RECEIVED</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedJob._count?.applications || 0} Applicants</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ESCROW STATUS</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <ShieldCheck size={14} /> Verified Escrow
                  </div>
                </div>
              </div>

              {/* Scope of Work */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                  Project Description & Scope
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', maxHeight: 180, overflowY: 'auto' }}>
                  {selectedJob.description}
                </div>
              </div>

              {/* Required Skills */}
              {skillsArr.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                    Required Technical Skills
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {skillsArr.map((skill: string) => (
                      <span key={skill} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(14,165,233,0.12)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.3)', fontWeight: 600 }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Form Drawer inside Modal */}
              {showApplyForm ? (
                <form onSubmit={handleApplySubmit} style={{ background: 'rgba(124,58,237,0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-brand)', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Submit Proposal for this Project
                  </div>
                  
                  {applySuccess ? (
                    <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                      <CheckCircle size={16} /> Proposal Submitted Successfully!
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Your Cover Letter / Approach</label>
                        <textarea
                          className="form-input"
                          rows={3}
                          placeholder="Describe your relevant experience and how you will deliver this project..."
                          value={coverLetter}
                          onChange={e => setCoverLetter(e.target.value)}
                          required
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ flex: 1 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Proposed Bid (₹)</label>
                          <input
                            type="number"
                            className="form-input"
                            placeholder={selectedJob.budgetMin || '50000'}
                            value={proposedBudget}
                            onChange={e => setProposedBudget(e.target.value)}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowApplyForm(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-sm" disabled={applying}>
                          <Send size={14} /> {applying ? 'Submitting...' : 'Submit Proposal'}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              ) : null}

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedJob(null)}>
                  Close
                </button>
                {!showApplyForm && (
                  <button className="btn btn-primary" onClick={() => setShowApplyForm(true)}>
                    <Send size={14} /> Apply / Submit Proposal
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })()}

      {/* EDIT JOB / TASK MODAL */}
      {editingJob && (
        <div className="modal-backdrop" onClick={() => setEditingJob(null)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', width: '90%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pencil size={18} color="#a78bfa" /> Edit Job / Task Details
              </h3>
              <button onClick={() => setEditingJob(null)} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            {editJobSuccessMsg ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="#34d399" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Job / Task Updated Successfully!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>The new title, budget, and description have been saved.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveEditJobSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Job / Task Title</label>
                  <input
                    className="form-input"
                    required
                    value={editJobForm.title}
                    onChange={e => setEditJobForm({ ...editJobForm, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="input-label">Min Budget (₹)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      value={editJobForm.budgetMin}
                      onChange={e => setEditJobForm({ ...editJobForm, budgetMin: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="input-label">Max Budget (₹)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      value={editJobForm.budgetMax}
                      onChange={e => setEditJobForm({ ...editJobForm, budgetMax: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Estimated Duration</label>
                  <input
                    className="form-input"
                    value={editJobForm.duration}
                    onChange={e => setEditJobForm({ ...editJobForm, duration: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Job Description</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    required
                    value={editJobForm.description}
                    onChange={e => setEditJobForm({ ...editJobForm, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setEditingJob(null)} className="btn btn-ghost">
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
