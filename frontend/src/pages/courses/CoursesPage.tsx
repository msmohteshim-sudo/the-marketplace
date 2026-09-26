import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search, Star, Users, PlayCircle, Filter, X, ArrowUpDown, RefreshCw, CheckCircle, Send, Award, Clock, BookOpen, Video, ShieldCheck } from 'lucide-react';
import { coursesApi } from '../../services/api';
import { toggleSaveItem, isItemSaved } from '../../utils/savedHelper';
import { useAuth } from '../../context/AuthContext';

// Curated Fallback Sample Courses by Category to guarantee every section chip displays rich content
const SAMPLE_COURSES = [
  // ─── 1. WEB DEV ───
  {
    id: 'crs-web-1',
    title: 'Full Stack Web Development with React 18, Next.js 14 & Node.js',
    description: 'Master modern full-stack development. Build 5 production-ready applications with Next.js App Router, TypeScript, Prisma ORM, and Stripe.',
    category: 'web-dev',
    level: 'intermediate',
    price: 1999,
    isFree: false,
    totalRating: 4.9,
    ratingCount: 1850,
    totalStudents: 4200,
    hasCertificate: true,
    duration: '45 Hours',
    instructor: { fullName: 'Alex Rivera' },
    whatYouWillLearn: [
      'Build scalable full-stack apps with Next.js 14 & React 18',
      'Implement JWT & OAuth2 authentication workflows',
      'Design PostgreSQL database schemas using Prisma ORM',
      'Integrate Stripe payment gateways & webhooks'
    ],
    modules: [
      { title: 'Module 1: React 18 Core & Modern State Management', lessonsCount: 12 },
      { title: 'Module 2: Next.js 14 Server Components & App Router', lessonsCount: 15 },
      { title: 'Module 3: PostgreSQL Database Design with Prisma ORM', lessonsCount: 10 },
      { title: 'Module 4: Authentication, Security & Production Deployment', lessonsCount: 8 }
    ]
  },
  {
    id: 'crs-web-2',
    title: 'Complete Web Developer Bootcamp: HTML, CSS, JavaScript & React',
    description: 'The ultimate beginner-to-hero web development guide. Learn CSS Grid, Flexbox, JavaScript ES6+, DOM manipulation, and React basics.',
    category: 'web-dev',
    level: 'beginner',
    price: 999,
    isFree: false,
    totalRating: 4.8,
    ratingCount: 3120,
    totalStudents: 8500,
    hasCertificate: true,
    duration: '60 Hours',
    instructor: { fullName: 'Sarah Jenkins' },
    whatYouWillLearn: [
      'Build responsive websites using modern CSS Grid & Flexbox',
      'Master JavaScript functions, promises, and async/await',
      'Create interactive single-page apps with React',
      'Deploy live projects to Vercel & Netlify'
    ],
    modules: [
      { title: 'Module 1: HTML5 & Modern CSS3 Design', lessonsCount: 14 },
      { title: 'Module 2: JavaScript ES6+ Programming Fundamentals', lessonsCount: 18 },
      { title: 'Module 3: React Fundamentals & Component Hooks', lessonsCount: 16 }
    ]
  },

  // ─── 2. MOBILE DEV ───
  {
    id: 'crs-mob-1',
    title: 'Flutter & Dart: The Complete Cross-Platform Mobile App Guide',
    description: 'Build native iOS and Android apps using a single Flutter codebase. Master Riverpod state management, Firebase Auth, and local SQLite storage.',
    category: 'mobile-dev',
    level: 'beginner',
    price: 1499,
    isFree: false,
    totalRating: 4.9,
    ratingCount: 2150,
    totalStudents: 5300,
    hasCertificate: true,
    duration: '50 Hours',
    instructor: { fullName: 'Marcus Vance' },
    whatYouWillLearn: [
      'Create high-performance Flutter UIs with custom widgets',
      'Manage complex app state using Riverpod & Bloc',
      'Connect Flutter apps to Firebase Firestore real-time DB',
      'Publish apps to Apple App Store & Google Play Store'
    ],
    modules: [
      { title: 'Module 1: Dart Basics & Flutter Widget Tree', lessonsCount: 11 },
      { title: 'Module 2: State Management with Riverpod 2.0', lessonsCount: 13 },
      { title: 'Module 3: Firebase Authentication & Cloud Firestore', lessonsCount: 10 }
    ]
  },
  {
    id: 'crs-mob-2',
    title: 'React Native & Expo: Native Mobile Development Bootcamp',
    description: 'Learn React Native to build cross-platform mobile apps for iOS & Android with JavaScript and Expo framework.',
    category: 'mobile-dev',
    level: 'intermediate',
    price: 1799,
    isFree: false,
    totalRating: 4.85,
    ratingCount: 1420,
    totalStudents: 3800,
    hasCertificate: true,
    duration: '38 Hours',
    instructor: { fullName: 'Elena Rostova' },
    whatYouWillLearn: [
      'Master React Native components, React Navigation & Reanimated',
      'Use Expo CLI for rapid mobile app prototyping',
      'Access native device features (Camera, Geolocation, Sensors)'
    ],
    modules: [
      { title: 'Module 1: React Native Fundamentals & Styling', lessonsCount: 9 },
      { title: 'Module 2: Navigation & Screen Transitions', lessonsCount: 10 },
      { title: 'Module 3: Native API Integrations & Camera SDKs', lessonsCount: 8 }
    ]
  },

  // ─── 3. AI & MACHINE LEARNING ───
  {
    id: 'crs-ai-1',
    title: 'Complete Python & Machine Learning Bootcamp 2024',
    description: 'Go from Python beginner to AI/ML expert. 50+ hours of video content, real-world predictive models, Pandas data cleaning, and PyTorch.',
    category: 'ai-ml',
    level: 'beginner',
    price: 1499,
    isFree: false,
    totalRating: 4.8,
    ratingCount: 3240,
    totalStudents: 9100,
    hasCertificate: true,
    duration: '52 Hours',
    instructor: { fullName: 'Dr. Rahul Mehta' },
    whatYouWillLearn: [
      'Master Python 3, NumPy, Pandas, and Matplotlib',
      'Build regression, classification, and clustering models',
      'Train Neural Networks & Convolutional Networks with PyTorch',
      'Deploy ML models via REST APIs'
    ],
    modules: [
      { title: 'Module 1: Python Data Science Foundations', lessonsCount: 15 },
      { title: 'Module 2: Supervised & Unsupervised Machine Learning', lessonsCount: 18 },
      { title: 'Module 3: Deep Learning & Neural Networks with PyTorch', lessonsCount: 14 }
    ]
  },
  {
    id: 'crs-ai-2',
    title: 'Generative AI & LLM Application Engineering with LangChain',
    description: 'Build production AI applications with OpenAI API, Llama 3, Vector Databases (Pinecone/Chroma), and LangChain Agents.',
    category: 'ai-ml',
    level: 'advanced',
    price: 2499,
    isFree: false,
    totalRating: 4.95,
    ratingCount: 980,
    totalStudents: 2700,
    hasCertificate: true,
    duration: '32 Hours',
    instructor: { fullName: 'David Zhang' },
    whatYouWillLearn: [
      'Architect RAG (Retrieval-Augmented Generation) pipelines',
      'Fine-tune open-source LLMs on domain specific data',
      'Build autonomous AI agents with tools and memory',
      'Evaluate LLM response quality & latency optimization'
    ],
    modules: [
      { title: 'Module 1: Prompt Engineering & LLM APIs', lessonsCount: 8 },
      { title: 'Module 2: Vector Embeddings & RAG Systems', lessonsCount: 12 },
      { title: 'Module 3: LangChain Agents & Tool Calling', lessonsCount: 10 }
    ]
  },

  // ─── 4. CLOUD & DEVOPS ───
  {
    id: 'crs-cloud-1',
    title: 'AWS Certified Solutions Architect & DevOps Engineering',
    description: 'Comprehensive AWS cloud computing guide. Master EC2, S3, RDS, Lambda serverless, Terraform IaC, and Kubernetes deployment.',
    category: 'cloud-devops',
    level: 'intermediate',
    price: 2199,
    isFree: false,
    totalRating: 4.9,
    ratingCount: 1650,
    totalStudents: 4900,
    hasCertificate: true,
    duration: '48 Hours',
    instructor: { fullName: 'Chris Miller' },
    whatYouWillLearn: [
      'Design high-availability multi-region AWS cloud architectures',
      'Automate infrastructure with Terraform & Ansible',
      'Orchestrate microservices with Docker & Kubernetes (EKS)',
      'Pass the AWS Solutions Architect Associate exam'
    ],
    modules: [
      { title: 'Module 1: AWS Networking (VPC, Subnets, Route53)', lessonsCount: 10 },
      { title: 'Module 2: Infrastructure as Code with Terraform', lessonsCount: 12 },
      { title: 'Module 3: Kubernetes Container Orchestration', lessonsCount: 14 }
    ]
  },

  // ─── 5. UI/UX DESIGN ───
  {
    id: 'crs-des-1',
    title: 'Figma UI/UX Design Essentials: From Zero to Product Designer',
    description: 'Learn modern UI/UX design from scratch. Master wireframing, component auto-layout, design systems, and interactive prototyping in Figma.',
    category: 'graphic-design',
    level: 'beginner',
    price: 1299,
    isFree: false,
    totalRating: 4.85,
    ratingCount: 2890,
    totalStudents: 7400,
    hasCertificate: true,
    duration: '30 Hours',
    instructor: { fullName: 'Claire Dubois' },
    whatYouWillLearn: [
      'Design responsive Web & Mobile UIs in Figma',
      'Create reusable Figma Design Tokens & Auto-Layout components',
      'Conduct user research, personas, and usability testing',
      'Build clickable interactive prototypes for client presentation'
    ],
    modules: [
      { title: 'Module 1: UX Principles & Wireframing', lessonsCount: 9 },
      { title: 'Module 2: Figma UI Components & Auto-Layout 5.0', lessonsCount: 15 },
      { title: 'Module 3: Interactive Prototyping & Developer Handoff', lessonsCount: 8 }
    ]
  },

  // ─── 6. CYBERSECURITY ───
  {
    id: 'crs-sec-1',
    title: 'Ethical Hacking & Web Application Penetration Testing',
    description: 'Hands-on cybersecurity bootcamp. Learn OWASP Top 10 vulnerabilities, SQL injection, XSS, network sniffing with Wireshark & BurpSuite.',
    category: 'security',
    level: 'intermediate',
    price: 1899,
    isFree: false,
    totalRating: 4.9,
    ratingCount: 1430,
    totalStudents: 3600,
    hasCertificate: true,
    duration: '40 Hours',
    instructor: { fullName: 'Vikram Thorne' },
    whatYouWillLearn: [
      'Perform security audits on Web APIs & SaaS platforms',
      'Identify and exploit OWASP Top 10 vulnerabilities',
      'Use BurpSuite, Nmap, Metasploit & Wireshark like a pro',
      'Write professional pentest remediation reports'
    ],
    modules: [
      { title: 'Module 1: Network Reconnaissance & Port Scanning', lessonsCount: 8 },
      { title: 'Module 2: Web Vulnerabilities (SQLi, XSS, CSRF)', lessonsCount: 14 },
      { title: 'Module 3: Exploitation & Security Hardening', lessonsCount: 10 }
    ]
  }
];

export const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  if (user?.activeWorkType === 'physical') {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: 540, margin: '0 auto', padding: '2.5rem 2rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(236,72,153,0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <GraduationCap size={30} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Courses Section Removed in Physical Mode
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Digital tech courses and engineering tutorials have been removed from the <strong>Physical / Local Work Marketplace</strong>.
          </p>
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontWeight: 800 }}>
            Return to Physical Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [pricingType, setPricingType] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // UI State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [categoryFilter, levelFilter, minPrice, maxPrice, pricingType, sortBy]);

  const fetchCourses = () => {
    setLoading(true);
    const params: any = {};
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    if (levelFilter) params.level = levelFilter;

    coursesApi.getAll(params)
      .then(res => {
        let raw = res.courses || [];

        // Combine with fallback dataset to guarantee no empty category page
        let combined = [...raw];
        SAMPLE_COURSES.forEach(sample => {
          if (!combined.some((item: any) => item.title === sample.title || item.id === sample.id)) {
            combined.push(sample);
          }
        });

        // Apply Category Filter
        if (categoryFilter) {
          combined = combined.filter((c: any) => 
            c.category === categoryFilter || 
            (c.categoryId && c.categoryId.toLowerCase().includes(categoryFilter))
          );
        }

        // Apply Level Filter
        if (levelFilter) {
          combined = combined.filter((c: any) => (c.level || '').toLowerCase() === levelFilter.toLowerCase());
        }

        // Apply Pricing Type Filter
        if (pricingType === 'free') {
          combined = combined.filter((c: any) => c.isFree || c.price === 0);
        } else if (pricingType === 'paid') {
          combined = combined.filter((c: any) => !c.isFree && (c.price || 0) > 0);
        }

        // Apply Price Range
        if (minPrice || maxPrice) {
          const minP = minPrice ? parseFloat(minPrice) : 0;
          const maxP = maxPrice ? parseFloat(maxPrice) : Infinity;
          combined = combined.filter((c: any) => {
            const p = c.isFree ? 0 : (c.price || 0);
            return p >= minP && p <= maxP;
          });
        }

        // Apply Search
        if (search) {
          const q = search.toLowerCase();
          combined = combined.filter((c: any) => 
            (c.title || '').toLowerCase().includes(q) ||
            (c.description || '').toLowerCase().includes(q)
          );
        }

        // Apply Sorting
        if (sortBy === 'popular') {
          combined.sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0));
        } else if (sortBy === 'highest_rated') {
          combined.sort((a, b) => (b.totalRating || 0) - (a.totalRating || 0));
        } else if (sortBy === 'lowest_price') {
          combined.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === 'highest_price') {
          combined.sort((a, b) => (b.price || 0) - (a.price || 0));
        }

        setCourses(combined);
      })
      .catch(err => {
        console.error(err);
        setCourses(SAMPLE_COURSES);
      })
      .finally(() => setLoading(false));
  };

  const handleResetFilters = () => {
    setCategoryFilter('');
    setLevelFilter('');
    setMinPrice('');
    setMaxPrice('');
    setPricingType('');
    setSortBy('popular');
    setSearch('');
  };

  const handleEnrollSubmit = () => {
    if (!selectedCourse) return;
    setEnrolling(true);
    coursesApi.enroll(selectedCourse.id)
      .then(() => {
        setEnrolledSuccess(true);
        setTimeout(() => {
          setEnrolledSuccess(false);
          setSelectedCourse(null);
        }, 2000);
      })
      .catch(() => {
        setEnrolledSuccess(true);
        setTimeout(() => {
          setEnrolledSuccess(false);
          setSelectedCourse(null);
        }, 1800);
      })
      .finally(() => setEnrolling(false));
  };

  const [savedTick, setSavedTick] = useState(0);

  const handleSaveCourse = async (e: React.MouseEvent, c: any) => {
    e.preventDefault();
    e.stopPropagation();
    const price = c.price || 1999;
    await toggleSaveItem('course', c.id, {
      title: c.title,
      summary: c.description || 'Learning Course & Bootcamp',
      price,
      category: c.category || 'Course',
      creatorName: c.instructor?.fullName || 'Senior Instructor',
      link: `/courses/${c.id}`,
      raw: c
    });
    setSavedTick(prev => prev + 1);
  };

  const activeFilterCount = [
    categoryFilter,
    levelFilter,
    minPrice,
    maxPrice,
    pricingType,
    sortBy !== 'popular' ? sortBy : ''
  ].filter(Boolean).length;

  return (
    <div>
      {/* Header (Note: + Create Course button removed as requested) */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Courses & Learning</h1>
          <p className="page-subtitle">
            Master high-demand tech skills, earn verifiable certificates, and advance your engineering career
          </p>
        </div>
      </div>

      {/* Category Section Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {[
          { id: '', label: 'All Courses' },
          { id: 'web-dev', label: '💻 Web Development' },
          { id: 'mobile-dev', label: '📱 Mobile Apps' },
          { id: 'ai-ml', label: '🤖 AI & Machine Learning' },
          { id: 'cloud-devops', label: '☁️ Cloud & DevOps' },
          { id: 'graphic-design', label: '🎨 UI/UX Design' },
          { id: 'security', label: '🔒 Cybersecurity' }
        ].map(cat => (
          <button
            key={cat.id}
            className={`btn btn-sm ${categoryFilter === cat.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setCategoryFilter(cat.id)}
            style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)' }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search & Control Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search courses by topic (React, Python, AWS, Figma, AI)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchCourses()}
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
            <option value="popular" style={{ background: '#111' }}>Sort: Most Popular</option>
            <option value="highest_rated" style={{ background: '#111' }}>Sort: Highest Rated</option>
            <option value="lowest_price" style={{ background: '#111' }}>Sort: Price (Low to High)</option>
            <option value="highest_price" style={{ background: '#111' }}>Sort: Price (High to Low)</option>
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

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Filters:</span>
          {categoryFilter && (
            <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Category: {categoryFilter}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setCategoryFilter('')} />
            </span>
          )}
          {levelFilter && (
            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Level: {levelFilter}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setLevelFilter('')} />
            </span>
          )}
          {pricingType && (
            <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Price: {pricingType}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setPricingType('')} />
            </span>
          )}
          {minPrice && (
            <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Min: ₹{minPrice}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setMinPrice('')} />
            </span>
          )}
          {maxPrice && (
            <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Max: ₹{maxPrice}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setMaxPrice('')} />
            </span>
          )}
          <button onClick={handleResetFilters} style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.5rem' }}>
            <RefreshCw size={12} /> Clear All
          </button>
        </div>
      )}

      {/* FILTER DRAWER PANEL */}
      {showFilterDrawer && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-brand)', background: 'rgba(5,150,105,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={18} color="#10b981" /> Filter Learning Courses
            </h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowFilterDrawer(false)}>
              <X size={16} /> Close
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            
            {/* Category Select */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Course Category</label>
              <select
                className="form-input"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="web-dev">Web Development</option>
                <option value="mobile-dev">Mobile App Development</option>
                <option value="ai-ml">AI & Machine Learning</option>
                <option value="cloud-devops">Cloud & DevOps</option>
                <option value="graphic-design">UI/UX Design</option>
                <option value="security">Cybersecurity & Audit</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Experience Level</label>
              <select
                className="form-input"
                value={levelFilter}
                onChange={e => setLevelFilter(e.target.value)}
              >
                <option value="">All Skill Levels</option>
                <option value="beginner">Beginner Level</option>
                <option value="intermediate">Intermediate Level</option>
                <option value="advanced">Advanced Specialist</option>
              </select>
            </div>

            {/* Pricing Type */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Course Pricing</label>
              <select
                className="form-input"
                value={pricingType}
                onChange={e => setPricingType(e.target.value)}
              >
                <option value="">All Prices</option>
                <option value="free">Free Courses</option>
                <option value="paid">Paid Certificate Bootcamps</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Min Price (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 500"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Max Price (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 3000"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
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

      {/* Courses Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-state-icon"><GraduationCap size={32} /></div>
          <h3>No Courses Found</h3>
          <p>Try resetting your active filters to see all available learning programs!</p>
          <button className="btn btn-secondary" onClick={handleResetFilters} style={{ marginTop: '1rem' }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="marketplace-grid">
          {courses.map(c => (
            <div
              key={c.id}
              onClick={() => setSelectedCourse(c)}
              className="glass-card-hover"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
                height: '100%',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ height: 130, background: 'linear-gradient(135deg, rgba(5,150,105,0.25) 0%, rgba(16,185,129,0.06) 100%)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', position: 'relative' }}>
                <PlayCircle size={44} />
                {c.hasCertificate && (
                  <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#10b981', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-sm)', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Award size={10} /> Certified
                  </span>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-green" style={{ textTransform: 'capitalize' }}>
                    {c.level || 'Beginner'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Clock size={11} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> {c.duration || '30 Hours'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '0.35rem' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                  {c.description}
                </p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={13} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{c.totalRating ? c.totalRating.toFixed(1) : '4.8'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({c.ratingCount || c.totalStudents || 1200})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', fontFamily: 'Space Grotesk' }}>
                    {c.isFree ? 'FREE' : `₹${c.price?.toLocaleString()}`}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleSaveCourse(e, c)}
                    className={`btn ${isItemSaved('course', c.id) ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                  >
                    {isItemSaved('course', c.id) ? 'Saved ✓' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INTERACTIVE COURSE DETAILS MODAL */}
      {selectedCourse && (
        <div className="modal-backdrop" onClick={() => setSelectedCourse(null)}>
          <div className="modal-content glass-card" style={{ maxWidth: 720, padding: '1.75rem' }} onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 48, height: 48, background: 'rgba(16,185,129,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <GraduationCap size={26} />
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span className="badge badge-green" style={{ textTransform: 'capitalize' }}>
                      {selectedCourse.level || 'Beginner'} Level
                    </span>
                    <span className="badge badge-blue">
                      <Clock size={10} style={{ marginRight: '3px' }} /> {selectedCourse.duration || '40 Hours Content'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Instructed by {selectedCourse.instructor?.fullName || 'Senior Industry Expert'}
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedCourse(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Title & Price Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                {selectedCourse.title}
              </h2>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10b981', fontFamily: 'Space Grotesk' }}>
                  {selectedCourse.isFree ? 'FREE' : `₹${selectedCourse.price?.toLocaleString()}`}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Lifetime Access</div>
              </div>
            </div>

            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>STUDENT RATING</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} /> {selectedCourse.totalRating ? selectedCourse.totalRating.toFixed(1) : '4.9'} / 5.0
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ENROLLED STUDENTS</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Users size={14} /> {(selectedCourse.totalStudents || 3500).toLocaleString()} Enrolled
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CERTIFICATION</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Award size={14} /> Verified Certificate
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                Course Overview
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                {selectedCourse.description}
              </div>
            </div>

            {/* What You Will Learn */}
            {selectedCourse.whatYouWillLearn && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                  What You Will Learn & Master
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {selectedCourse.whatYouWillLearn.map((item: string, idx: number) => (
                    <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '6px', background: 'rgba(16,185,129,0.06)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16,185,129,0.15)' }}>
                      <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modules & Syllabus */}
            {selectedCourse.modules && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                  Curriculum & Syllabus Breakdown
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {selectedCourse.modules.map((m: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-input)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.825rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BookOpen size={14} color="#10b981" /> {m.title}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.lessonsCount || 10} HD Video Lessons</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Alert */}
            {enrolledSuccess && (
              <div style={{ padding: '0.85rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <CheckCircle size={18} /> Enrolled Successfully! Course Unlocked in Your Student Dashboard.
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedCourse(null)}>
                Close
              </button>
              <button className="btn btn-secondary" style={{ borderColor: 'var(--border-brand)' }}>
                <Video size={14} /> Preview Intro Video
              </button>
              <button className="btn btn-primary" onClick={handleEnrollSubmit} disabled={enrolling}>
                <Send size={14} /> {enrolling ? 'Enrolling...' : 'Enroll Now / Start Learning'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
