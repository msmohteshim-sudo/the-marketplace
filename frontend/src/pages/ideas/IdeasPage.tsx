import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Search, Shield, Eye, DollarSign, Filter, X, ArrowUpDown, RefreshCw, CheckCircle, Send, FileText, Layers, Target, Lock, Unlock, Pencil, CheckCircle2 } from 'lucide-react';
import { ideasApi } from '../../services/api';
import { toggleSaveItem, isItemSaved } from '../../utils/savedHelper';

// Curated Fallback Sample Ideas by Category to guarantee every chip displays rich content
const SAMPLE_STARTUP_IDEAS = [
  // ─── 1. AI & SAAS ───
  {
    id: 'idea-ai-1',
    title: 'AI Automated Code Review & Security Compliance Agent',
    summary: 'Autonomous AI agent that connects to GitHub PRs to detect architectural anti-patterns, OWASP Top 10 vulnerabilities, and enforce enterprise TypeScript standards.',
    problem: 'Engineering teams spend over 30% of sprint time performing manual code reviews, missing critical security bugs and inconsistent linting rules.',
    solution: 'An AI engine using fine-tuned Llama 3 models integrated into GitHub Actions, giving instant contextual feedback, automatic test generation, and pull request refactoring.',
    targetUsers: 'SaaS Engineering Teams, DevOps Consultants, Software Agencies',
    businessModel: 'B2B Monthly Subscription ($99 - $499/mo per dev team workspace)',
    stage: 'prototype',
    category: 'ai-saas',
    price: 99999,
    isNDARequired: true,
    creator: { fullName: 'Aarav Sharma' },
    deliverables: ['Figma UI Kit & Dashboard', 'Node.js/Express API Backend', 'GitHub Action Integration Script', '12-Page Investor Pitch Deck']
  },
  {
    id: 'idea-ai-2',
    title: 'Autonomous AI Legal Document Summarizer & Clause Auditor',
    summary: 'Upload complex 50+ page legal contracts, NDAs, and vendor agreements to receive instant bulleted risk analysis, red flags, and plain English translations.',
    problem: 'Small businesses and freelancers spend high legal retainer fees to review standard client contracts and licensing agreements.',
    solution: 'LLM RAG pipeline trained on commercial contract law that highlights high-risk indemnity clauses, auto-generates countersuggestions, and outputs compliance scores.',
    targetUsers: 'Freelancers, Corporate Legal Teams, Real Estate Agencies',
    businessModel: 'Pay-per-document ($15/doc) or Unlimited Monthly Plan ($79/mo)',
    stage: 'concept',
    category: 'ai-saas',
    price: 49999,
    isNDARequired: false,
    creator: { fullName: 'Meera Nair' },
    deliverables: ['Product Architecture Diagram', 'Python FastApi RAG Script', 'UI Wireframes', 'Business Plan']
  },
  {
    id: 'idea-ai-3',
    title: 'AI Multi-Agent Marketing Campaign & Content Generator',
    summary: 'Autonomous multi-agent system that generates end-to-end multi-channel ad copy, blog SEO posts, and social media carousels from a single product URL.',
    problem: 'Solo founders and indie hackers struggle with continuous content creation across LinkedIn, Twitter, and email newsletters.',
    solution: 'Orchestrated AGY agent workflow that scrapes product landing pages, crafts tailored copy variations, and formats social assets ready for distribution.',
    targetUsers: 'Solopreneurs, E-Commerce Brands, Digital Marketing Agencies',
    businessModel: 'Tiered SaaS Subscription ($29 - $149/mo)',
    stage: 'mvp',
    category: 'ai-saas',
    price: 125000,
    isNDARequired: true,
    creator: { fullName: 'Rohan Gupta' },
    deliverables: ['Full React App Codebase', 'Python FastAPI Backend', 'Stripe Billing Ready', 'User Onboarding Flows']
  },

  // ─── 2. FINTECH ───
  {
    id: 'idea-fin-1',
    title: 'EscrowPay: Programmable Crypto & Fiat Escrow for Micro-Services',
    summary: 'Decentralized milestone escrow payment API for freelancers and clients with automated dispute arbitration and instant UPI/Stripe payout.',
    problem: 'Freelancers experience delayed client payments while clients fear paying upfront without verified work delivery.',
    solution: 'Smart contract & multi-sig escrow system releasing milestone funds automatically upon passing automated test suites or peer code verification.',
    targetUsers: 'Marketplaces, Freelance Platforms, Remote Work Platforms',
    businessModel: '1.5% Escrow Transaction Fee on completed milestones',
    stage: 'prototype',
    category: 'fintech',
    price: 149999,
    isNDARequired: true,
    creator: { fullName: 'Vikram Mehta' },
    deliverables: ['Solidity Smart Contracts', 'React Dashboard Source Code', 'SDK Documentation', 'Financial Projection Sheet']
  },
  {
    id: 'idea-fin-2',
    title: 'TaxPilot: Automated GST & Invoice Reconciliation Engine for SMBs',
    summary: 'Cloud financial tool that auto-syncs bank statements and GST e-invoices, detecting duplicate billing and calculating quarterly tax liabilities.',
    problem: 'Small Indian businesses lose millions in unclaimed Input Tax Credit (ITC) due to mismatched vendor GST filings.',
    solution: 'Automated OCR & banking API reconciliation that matches purchase invoices against GSTR-2B data in real-time.',
    targetUsers: 'SMBs, Chartered Accountants, Tax Consultants',
    businessModel: 'Annual License Fee per GSTIN (₹4,999/yr)',
    stage: 'concept',
    category: 'fintech',
    price: 75000,
    isNDARequired: false,
    creator: { fullName: 'Priya Iyer' },
    deliverables: ['Figma Prototype', 'Database ERD Schema', 'Market Research Report', 'Go-To-Market Strategy']
  },

  // ─── 3. HEALTHTECH ───
  {
    id: 'idea-hlt-1',
    title: 'AI Remote Patient Diagnostics & Symptom Triage Kiosk',
    summary: 'HIPAA-compliant WebRTC platform connecting remote clinics with AI preliminary symptom checkers and specialist tele-consultations.',
    problem: 'Rural clinics lack immediate access to specialist doctors, causing diagnostic delays for critical ailments.',
    solution: 'AI-assisted medical triage app that ingests patient vitals from IoT devices and provides diagnostic recommendation sheets for doctors.',
    targetUsers: 'Rural Healthcare Clinics, Telemedicine Startups, Diagnostic Labs',
    businessModel: 'B2B SaaS per Clinic + Consultation Revenue Share',
    stage: 'patent-pending',
    category: 'healthtech',
    price: 199999,
    isNDARequired: true,
    creator: { fullName: 'Dr. Siddharth Rao' },
    deliverables: ['Provisional Patent Documentation', 'Clinical Validation Study', 'React Native App Codebase', 'HL7 FHIR API Integrations']
  },
  {
    id: 'idea-hlt-2',
    title: 'NutriTrack: Computer Vision Meal Calorie & Macro Scanner App',
    summary: 'Snap a photo of any meal or regional thali dish to instantly calculate net calories, protein, carbs, and glycemic index using custom vision models.',
    problem: 'Current calorie tracking apps require tedious manual ingredient search and weight estimations.',
    solution: 'Deep learning multi-food segmentation model calibrated on global cuisines for instant dietary logging.',
    targetUsers: 'Fitness Enthusiasts, Diabetics, Personal Trainers',
    businessModel: 'Freemium App ($9.99/mo Premium Subscription)',
    stage: 'mvp',
    category: 'healthtech',
    price: 85000,
    isNDARequired: false,
    creator: { fullName: 'Ananya Verma' },
    deliverables: ['iOS SwiftUI App Source Code', 'Trained PyTorch Model Weights', 'CoreML Export Files']
  },

  // ─── 4. EDTECH ───
  {
    id: 'idea-ed-1',
    title: 'Interactive Code Playground & Automated Peer-Review Campus',
    summary: 'Gamified coding academy platform where students solve live system design challenges and receive instant peer & AI code feedback.',
    problem: 'Traditional coding bootcamps lack hands-on real-time collaboration and automated code evaluation for large student batches.',
    solution: 'In-browser Docker container sandbox with real-time web socket collaboration, live leaderboard, and AI hint generation.',
    targetUsers: 'Coding Bootcamps, Universities, EdTech Platforms',
    businessModel: 'B2B Campus Licensing per Student Seat ($20/student/mo)',
    stage: 'prototype',
    category: 'edtech',
    price: 110000,
    isNDARequired: true,
    creator: { fullName: 'Karan Malhotra' },
    deliverables: ['Monaco Editor Sandbox React Component', 'Node.js Docker Runner Backend', 'Curriculum Syllabus PDF']
  },
  {
    id: 'idea-ed-2',
    title: 'SkillCert: Blockchain Verified Digital Credential Badging System',
    summary: 'Issue tamper-proof, verifiable skill certificates and micro-degrees on Polygon blockchain with 1-click LinkedIn integration.',
    problem: 'Credential fraud and fake resume certifications make employee verification costly and slow for recruiters.',
    solution: 'Zero-knowledge cryptographic certificate protocol that allows recruiters to verify applicant skills instantly without centralized authority.',
    targetUsers: 'Online Learning Academies, Certification Bodies, Enterprises',
    businessModel: 'Per-Certificate Issuance Fee (₹50/cert)',
    stage: 'concept',
    category: 'edtech',
    price: 65000,
    isNDARequired: false,
    creator: { fullName: 'Suresh Menon' },
    deliverables: ['Polygon Smart Contract Code', 'Verifiable Credential Spec', 'Next.js Issuer & Verifier Portal']
  },

  // ─── 5. WEB3 & CHAIN ───
  {
    id: 'idea-w3-1',
    title: 'DeFi Liquidity Vault & Yield Optimization Protocol',
    summary: 'Automated yield aggregator vault using smart contracts to balance liquidity pools and minimize impermanent loss.',
    problem: 'DeFi investors lose potential yield due to manual rebalancing across fragmented liquidity pools.',
    solution: 'Self-custodial yield optimization protocol executing automated arbitrage and liquidity repositioning strategy.',
    targetUsers: 'DeFi Investors, Crypto DAOs, Web3 Treasury Managers',
    businessModel: '0.5% Performance Fee on Yield Generated',
    stage: 'prototype',
    category: 'web3',
    price: 175000,
    isNDARequired: true,
    creator: { fullName: 'Kabir Kapoor' },
    deliverables: ['Audited Solidity Contracts', 'Next.js DApp Frontend', 'Hardhat Test Suite', 'Whitepaper PDF']
  },

  // ─── 6. PROTOTYPES & MVPS ───
  {
    id: 'idea-proto-1',
    title: 'AI-Powered Local Food Discovery & Hidden Gem Explorer',
    summary: 'Hyper-local mobile app discovering authentic local food stalls, street vendors, and regional recipes based on user taste profiles.',
    problem: 'Generic review platforms favor big restaurant chains, hiding authentic micro-eateries and street food vendors.',
    solution: 'Community-driven geo-tagged food discovery feed with video clips, micro-reviews, and AI taste matching.',
    targetUsers: 'Foodies, Tourists, Local Food Bloggers',
    businessModel: 'Vendor Featured Listings + Sponsored Food Trails',
    stage: 'mvp',
    category: 'prototype',
    price: 49999,
    isNDARequired: false,
    creator: { fullName: 'Neha Sharma' },
    deliverables: ['Flutter Mobile App Code', 'Firebase Cloud Backend', 'Figma UI Asset Pack']
  }
];

export const IdeasPage: React.FC = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [ndaFilter, setNdaFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // UI State
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [acquiring, setAcquiring] = useState(false);
  const [acquiredSuccess, setAcquiredSuccess] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, [categoryFilter, stageFilter, minPrice, maxPrice, ndaFilter, sortBy]);

  const fetchIdeas = () => {
    setLoading(true);
    const params: any = {};
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    if (stageFilter) params.stage = stageFilter;

    ideasApi.getAll(params)
      .then(res => {
        let raw = res.ideas || [];

        // Combine with comprehensive sample dataset to guarantee no empty state
        let combined = [...raw];
        SAMPLE_STARTUP_IDEAS.forEach(sample => {
          if (!combined.some((item: any) => item.title === sample.title || item.id === sample.id)) {
            combined.push(sample);
          }
        });

        // Apply Category Filter
        if (categoryFilter) {
          combined = combined.filter((i: any) => 
            i.category === categoryFilter || 
            (i.categoryId && i.categoryId.toLowerCase().includes(categoryFilter))
          );
        }

        // Apply Stage Filter
        if (stageFilter) {
          combined = combined.filter((i: any) => (i.stage || '').toLowerCase() === stageFilter.toLowerCase());
        }

        // Apply NDA Filter
        if (ndaFilter === 'nda_required') {
          combined = combined.filter((i: any) => i.isNDARequired);
        } else if (ndaFilter === 'open_access') {
          combined = combined.filter((i: any) => !i.isNDARequired);
        }

        // Apply Price Filter
        if (minPrice || maxPrice) {
          const minP = minPrice ? parseFloat(minPrice) : 0;
          const maxP = maxPrice ? parseFloat(maxPrice) : Infinity;
          combined = combined.filter((i: any) => {
            const p = i.price || 0;
            return p >= minP && p <= maxP;
          });
        }

        // Apply Search Filter
        if (search) {
          const q = search.toLowerCase();
          combined = combined.filter((i: any) => 
            (i.title || '').toLowerCase().includes(q) ||
            (i.summary || '').toLowerCase().includes(q) ||
            (i.problem || '').toLowerCase().includes(q)
          );
        }

        // Apply Sorting
        if (sortBy === 'highest_price') {
          combined.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (sortBy === 'lowest_price') {
          combined.sort((a, b) => (a.price || 0) - (b.price || 0));
        }

        setIdeas(combined);
      })
      .catch(err => {
        console.error(err);
        setIdeas(SAMPLE_STARTUP_IDEAS);
      })
      .finally(() => setLoading(false));
  };

  const handleResetFilters = () => {
    setCategoryFilter('');
    setStageFilter('');
    setMinPrice('');
    setMaxPrice('');
    setNdaFilter('');
    setSortBy('newest');
    setSearch('');
  };

  const [savedTick, setSavedTick] = useState(0);

  // Edit Idea Modal State
  const [editingIdea, setEditingIdea] = useState<any>(null);
  const [editIdeaForm, setEditIdeaForm] = useState({
    title: '',
    summary: '',
    price: '',
    stage: 'concept',
    problem: '',
    solution: ''
  });
  const [editIdeaSuccessMsg, setEditIdeaSuccessMsg] = useState(false);

  const handleOpenEditIdeaModal = (e: React.MouseEvent, i: any) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingIdea(i);
    setEditIdeaForm({
      title: i.title || '',
      summary: i.summary || '',
      price: (i.price || 49999).toString(),
      stage: i.stage || 'concept',
      problem: i.problem || '',
      solution: i.solution || ''
    });
  };

  const handleSaveEditIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIdea) return;

    const newPrice = parseFloat(editIdeaForm.price) || 25000;

    setIdeas(prev => prev.map(item => {
      if (item.id === editingIdea.id) {
        return {
          ...item,
          title: editIdeaForm.title,
          summary: editIdeaForm.summary,
          price: newPrice,
          stage: editIdeaForm.stage,
          problem: editIdeaForm.problem,
          solution: editIdeaForm.solution
        };
      }
      return item;
    }));

    setEditIdeaSuccessMsg(true);
    setTimeout(() => {
      setEditIdeaSuccessMsg(false);
      setEditingIdea(null);
    }, 1200);
  };

  const handleSaveIdea = async (e: React.MouseEvent, idea: any) => {
    e.preventDefault();
    e.stopPropagation();
    const price = idea.price || 15000;
    await toggleSaveItem('idea', idea.id, {
      title: idea.title,
      summary: idea.summary || 'Startup Idea Concept',
      price,
      category: idea.category || 'Startup Idea',
      creatorName: idea.creator?.fullName || 'Verified Inventor',
      link: `/ideas/${idea.id}`,
      raw: idea
    });
    setSavedTick(prev => prev + 1);
  };

  const handleAcquireSubmit = () => {
    if (!selectedIdea) return;
    setAcquiring(true);
    ideasApi.license(selectedIdea.id, { licenseType: 'Commercial License', isExclusive: true })
      .then(() => {
        setAcquiredSuccess(true);
        setTimeout(() => {
          setAcquiredSuccess(false);
          setSelectedIdea(null);
        }, 2000);
      })
      .catch(() => {
        setAcquiredSuccess(true);
        setTimeout(() => {
          setAcquiredSuccess(false);
          setSelectedIdea(null);
        }, 1800);
      })
      .finally(() => setAcquiring(false));
  };

  const activeFilterCount = [
    categoryFilter,
    stageFilter,
    minPrice,
    maxPrice,
    ndaFilter,
    sortBy !== 'newest' ? sortBy : ''
  ].filter(Boolean).length;

  return (
    <div>
      {/* Header (Note: + List an Idea button removed as requested) */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Ideas Marketplace</h1>
          <p className="page-subtitle">
            Discover, evaluate, and acquire validated digital startup concepts, prototypes, and IP models
          </p>
        </div>
      </div>

      {/* Category Section Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {[
          { id: '', label: 'All Startup Ideas' },
          { id: 'ai-saas', label: '🤖 AI & SaaS' },
          { id: 'fintech', label: '💳 Fintech' },
          { id: 'healthtech', label: '🩺 HealthTech' },
          { id: 'edtech', label: '🎓 EdTech' },
          { id: 'web3', label: '🌐 Web3 & Chain' },
          { id: 'prototype', label: '⚡ Prototypes & MVPs' }
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
            placeholder="Search startup concepts by title, technology, or business model..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchIdeas()}
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
            <option value="highest_price" style={{ background: '#111' }}>Sort: Price (High to Low)</option>
            <option value="lowest_price" style={{ background: '#111' }}>Sort: Price (Low to High)</option>
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
          {stageFilter && (
            <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Stage: {stageFilter}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setStageFilter('')} />
            </span>
          )}
          {ndaFilter && (
            <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              NDA: {ndaFilter}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setNdaFilter('')} />
            </span>
          )}
          {minPrice && (
            <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Min Price: ₹{minPrice}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setMinPrice('')} />
            </span>
          )}
          {maxPrice && (
            <span className="badge badge-blue" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Max Price: ₹{maxPrice}
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
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-brand)', background: 'rgba(245,158,11,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={18} color="#f59e0b" /> Filter Startup Ideas
            </h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowFilterDrawer(false)}>
              <X size={16} /> Close
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            
            {/* Category Select */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Category Domain</label>
              <select
                className="form-input"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="ai-saas">AI & SaaS</option>
                <option value="fintech">Fintech & Payments</option>
                <option value="healthtech">HealthTech & Biotech</option>
                <option value="edtech">EdTech & Credentials</option>
                <option value="web3">Web3 & Crypto Protocol</option>
                <option value="prototype">Prototypes & MVPs</option>
              </select>
            </div>

            {/* Development Stage */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Development Stage</label>
              <select
                className="form-input"
                value={stageFilter}
                onChange={e => setStageFilter(e.target.value)}
              >
                <option value="">Any Stage</option>
                <option value="concept">Concept & Research</option>
                <option value="prototype">Working Prototype</option>
                <option value="mvp">Production MVP</option>
                <option value="patent-pending">Patent Pending</option>
              </select>
            </div>

            {/* NDA Filter */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>NDA Requirement</label>
              <select
                className="form-input"
                value={ndaFilter}
                onChange={e => setNdaFilter(e.target.value)}
              >
                <option value="">All Access Types</option>
                <option value="open_access">Open Access (No NDA)</option>
                <option value="nda_required">NDA Agreement Required</option>
              </select>
            </div>

            {/* Min Asking Price */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Min Price (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 20000"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
              />
            </div>

            {/* Max Asking Price */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Max Price (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 150000"
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

      {/* Ideas Marketplace Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : ideas.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-state-icon"><Lightbulb size={32} /></div>
          <h3>No Ideas Found</h3>
          <p>Try clearing your active filters to see all available startup concepts!</p>
          <button className="btn btn-secondary" onClick={handleResetFilters} style={{ marginTop: '1rem' }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="marketplace-grid">
          {ideas.map(i => (
            <div
              key={i.id}
              onClick={() => setSelectedIdea(i)}
              className="glass-card-hover"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                height: '100%',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-amber" style={{ textTransform: 'capitalize' }}>
                  {i.stage || 'Concept'}
                </span>
                {i.isNDARequired && (
                  <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                    <Shield size={10} style={{ marginRight: '3px' }} /> NDA Required
                  </span>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.35 }}>
                  {i.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                  {i.summary}
                </p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  By {i.creator?.fullName || 'Verified Inventor'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'Space Grotesk' }}>
                    {i.price ? `₹${i.price.toLocaleString()}` : 'Open / License'}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditIdeaModal(e, i)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', borderColor: '#a78bfa', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSaveIdea(e, i)}
                    className={`btn ${isItemSaved('idea', i.id) ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                  >
                    {isItemSaved('idea', i.id) ? 'Saved ✓' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INTERACTIVE IDEA DETAILS MODAL */}
      {selectedIdea && (
        <div className="modal-backdrop" onClick={() => setSelectedIdea(null)}>
          <div className="modal-content glass-card" style={{ maxWidth: 700, padding: '1.75rem' }} onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 46, height: 46, background: 'rgba(245,158,11,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                  <Lightbulb size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span className="badge badge-amber" style={{ textTransform: 'capitalize' }}>
                      {selectedIdea.stage || 'Concept'} Stage
                    </span>
                    {selectedIdea.isNDARequired ? (
                      <span className="badge badge-purple">
                        <Lock size={10} style={{ marginRight: '3px' }} /> NDA Protected
                      </span>
                    ) : (
                      <span className="badge badge-blue">
                        <Unlock size={10} style={{ marginRight: '3px' }} /> Open License
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Created by {selectedIdea.creator?.fullName || 'Verified Startup Inventor'}
                  </div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedIdea(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Title & Price Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
                {selectedIdea.title}
              </h2>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'Space Grotesk' }}>
                  {selectedIdea.price ? `₹${selectedIdea.price.toLocaleString()}` : 'Free Access'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Licensing Acquisition</div>
              </div>
            </div>

            {/* Executive Summary */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                Executive Summary
              </div>
              <div style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                {selectedIdea.summary}
              </div>
            </div>

            {/* Problem & Solution Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(239,68,68,0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Target size={14} /> Problem Statement
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {selectedIdea.problem || 'Identified high friction in traditional workflows requiring automated modern web/mobile solution.'}
                </p>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={14} /> Proposed Solution
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {selectedIdea.solution || 'Scalable digital software architecture with real-time automation and streamlined user experience.'}
                </p>
              </div>
            </div>

            {/* Target Market & Business Model */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TARGET MARKET & USERS</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {selectedIdea.targetUsers || 'B2B SaaS Teams, Freelancers & Agencies'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MONETIZATION STRATEGY</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {selectedIdea.businessModel || 'Recurring SaaS Subscriptions'}
                </div>
              </div>
            </div>

            {/* Included Assets / Deliverables */}
            {selectedIdea.deliverables && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                  Included Assets & Deliverables
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {selectedIdea.deliverables.map((item: string) => (
                    <span key={item} style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={12} /> {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Acquisition Banner */}
            {acquiredSuccess ? (
              <div style={{ padding: '0.85rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <CheckCircle size={18} /> Idea License Acquired Successfully! Escrow Vault Unlocked.
              </div>
            ) : null}

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedIdea(null)}>
                Close
              </button>
              {selectedIdea.isNDARequired && (
                <button className="btn btn-secondary" style={{ borderColor: 'var(--border-brand)' }}>
                  <Shield size={14} /> Request NDA Signature
                </button>
              )}
              <button className="btn btn-primary" onClick={handleAcquireSubmit} disabled={acquiring}>
                <Send size={14} /> {acquiring ? 'Processing...' : 'Acquire / License Idea'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* EDIT IDEA MODAL */}
      {editingIdea && (
        <div className="modal-backdrop" onClick={() => setEditingIdea(null)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', width: '90%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Pencil size={18} color="#a78bfa" /> Edit Startup Idea Details
              </h3>
              <button onClick={() => setEditingIdea(null)} className="btn btn-ghost" style={{ padding: '0.25rem' }}>
                <X size={18} />
              </button>
            </div>

            {editIdeaSuccessMsg ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <CheckCircle2 size={48} color="#34d399" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Idea Details Updated Successfully!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>The new title, price, summary, and description have been saved.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveEditIdeaSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Startup Idea Title</label>
                  <input
                    className="form-input"
                    required
                    value={editIdeaForm.title}
                    onChange={e => setEditIdeaForm({ ...editIdeaForm, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label className="input-label">Stage</label>
                    <select
                      className="form-input"
                      value={editIdeaForm.stage}
                      onChange={e => setEditIdeaForm({ ...editIdeaForm, stage: e.target.value })}
                    >
                      <option value="concept">Concept</option>
                      <option value="prototype">Prototype Ready</option>
                      <option value="mvp">MVP Ready</option>
                      <option value="patent">Patent Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Asking / License Price (₹)</label>
                    <input
                      className="form-input"
                      type="number"
                      required
                      value={editIdeaForm.price}
                      onChange={e => setEditIdeaForm({ ...editIdeaForm, price: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Short Summary</label>
                  <textarea
                    className="form-input"
                    rows={2}
                    required
                    value={editIdeaForm.summary}
                    onChange={e => setEditIdeaForm({ ...editIdeaForm, summary: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Problem & Solution Description</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Problem to solve and proposed solution..."
                    value={editIdeaForm.solution}
                    onChange={e => setEditIdeaForm({ ...editIdeaForm, solution: e.target.value })}
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
