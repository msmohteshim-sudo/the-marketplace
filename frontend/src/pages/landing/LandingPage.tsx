import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Wrench, Briefcase, Lightbulb, GraduationCap, ArrowRight, Sparkles, User, ShieldCheck, Star } from 'lucide-react';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 1. Mouse Position Tracker for Global Cursor Spotlight & Globe Parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  // 2. Interactive Background Particle Constellation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes drifting gently across space
    const particleCount = Math.min(Math.floor(width / 16), 85);
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2.2 + 1,
      color: Math.random() > 0.4 ? 'rgba(167, 139, 250, ' : 'rgba(56, 189, 248, '
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and animate particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.65)';
        ctx.fill();

        // Connect nearby particles with glowing laser lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - dist / 115)})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Connect to Cursor spotlight if close
        if (mousePos.x > 0 && mousePos.y > 0) {
          const dx = p.x - mousePos.x;
          const dy = p.y - mousePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 170) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 * (1 - dist / 170)})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos.x, mousePos.y]);

  // 3. Card 3D Tilt & Cursor Reflection Handler
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.setProperty('--card-mouse-x', `${x}px`);
    card.style.setProperty('--card-mouse-y', `${y}px`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  // Parallax translation for giant globe
  const globeTransformX = (mousePos.x - (window.innerWidth / 2)) * 0.025;
  const globeTransformY = (mousePos.y - (window.innerHeight / 2)) * 0.025;

  return (
    <div className="landing-container" ref={containerRef} onMouseMove={handleMouseMove}>
      {/* Dynamic Cursor Spotlight Layer */}
      <div className="landing-spotlight-layer" />

      {/* Dynamic Interactive Particle Canvas Background */}
      <canvas ref={canvasRef} className="landing-particle-canvas" />

      {/* Ambient Glows & Mesh Grid Background */}
      <div className="landing-bg-glow-1" />
      <div className="landing-bg-glow-2" />
      <div className="landing-bg-glow-3" />
      <div className="landing-bg-grid" />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="landing-logo-icon">
            <Zap size={22} color="white" />
          </div>
          <div>
            <div className="landing-logo-title">THE MARKETPLACE</div>
            <div className="landing-logo-sub">EVERY OPPORTUNITY</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/auth/login" className="btn btn-ghost" style={{ color: '#cbd5e1', fontWeight: 500 }}>
            Sign In
          </Link>
          <Link to="/auth/register" className="btn-hero-primary" style={{ padding: '0.65rem 1.4rem', fontSize: '0.9rem' }}>
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        {/* Left Column: Hero Content */}
        <div className="landing-hero-content">
          <div className="landing-badge">
            <Sparkles size={14} /> The Next-Generation Opportunity Platform
          </div>

          <h1 className="landing-title">
            Every Skill. Every Task.<br />
            <span className="gradient-text">Every Idea. Every Opportunity.</span>
          </h1>

          <p className="landing-desc">
            A unified marketplace matching clients, freelancers, local workers, idea creators, and instructors under one intelligent ecosystem.
          </p>

          <div className="landing-cta-group">
            <Link to="/auth/register" className="btn-hero-primary">
              Explore Marketplace <ArrowRight size={18} />
            </Link>
            <Link to="/auth/login" className="btn-hero-secondary">
              Demo Sign In
            </Link>
          </div>
        </div>

        {/* Right Column: Massive High-Impact Holographic Globe */}
        <div 
          className="landing-globe-wrapper"
          style={{ transform: `translate3d(${globeTransformX}px, ${globeTransformY}px, 0)` }}
        >
          <div className="globe-outer-ring" />
          <div className="globe-middle-ring" />
          <div className="globe-inner-ring" />

          {/* Rich Floating Glass Node Cards */}
          <div 
            className="floating-node-card node-card-top-right" 
            style={{
              '--node-bg': 'rgba(124, 58, 237, 0.2)',
              '--node-color': '#c084fc',
              '--node-glow': 'rgba(124, 58, 237, 0.4)'
            } as React.CSSProperties}
          >
            <div className="node-icon-box">
              <User size={20} />
            </div>
            <div>
              <div className="node-text-title">Global Ecosystem</div>
              <div className="node-text-sub">50,000+ Verified Users</div>
            </div>
          </div>

          <div 
            className="floating-node-card node-card-mid-left"
            style={{
              '--node-bg': 'rgba(14, 165, 233, 0.2)',
              '--node-color': '#38bdf8',
              '--node-glow': 'rgba(14, 165, 233, 0.4)'
            } as React.CSSProperties}
          >
            <div className="node-icon-box">
              <Briefcase size={20} />
            </div>
            <div>
              <div className="node-text-title">Jobs & Tasks</div>
              <div className="node-text-sub">12,500+ Active Bids</div>
            </div>
          </div>

          <div 
            className="floating-node-card node-card-bottom-left"
            style={{
              '--node-bg': 'rgba(245, 158, 11, 0.2)',
              '--node-color': '#fbbf24',
              '--node-glow': 'rgba(245, 158, 11, 0.4)'
            } as React.CSSProperties}
          >
            <div className="node-icon-box">
              <Lightbulb size={20} />
            </div>
            <div>
              <div className="node-text-title">IP & Ideas</div>
              <div className="node-text-sub">Verified Patents & Ideas</div>
            </div>
          </div>

          <div 
            className="floating-node-card node-card-bottom-right"
            style={{
              '--node-bg': 'rgba(16, 185, 129, 0.2)',
              '--node-color': '#34d399',
              '--node-glow': 'rgba(16, 185, 129, 0.4)'
            } as React.CSSProperties}
          >
            <div className="node-icon-box">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="node-text-title">Courses & Skills</div>
              <div className="node-text-sub">Certified Learning</div>
            </div>
          </div>

          {/* Expanded High-Detail Holographic Sphere SVG Canvas (600x600) */}
          <div className="globe-svg-container">
            <svg viewBox="0 0 600 600" width="100%" height="100%" style={{ overflow: 'visible' }}>
              <defs>
                <radialGradient id="globeCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.65" />
                  <stop offset="45%" stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="85%" stopColor="#0ea5e9" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#070814" stopOpacity="0" />
                </radialGradient>

                <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                </linearGradient>

                <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Glowing Core Aura */}
              <circle cx="300" cy="300" r="230" fill="url(#globeCoreGlow)" />

              {/* Tilted 3D Holographic Orbit Rings */}
              <ellipse cx="300" cy="300" rx="230" ry="230" fill="none" stroke="rgba(167, 139, 250, 0.35)" strokeWidth="1.8" />
              
              <ellipse cx="300" cy="300" rx="230" ry="85" fill="none" stroke="url(#orbitGrad1)" strokeWidth="2.2" transform="rotate(-25 300 300)" />
              <ellipse cx="300" cy="300" rx="230" ry="125" fill="none" stroke="url(#orbitGrad2)" strokeWidth="2" transform="rotate(40 300 300)" />
              <ellipse cx="300" cy="300" rx="230" ry="165" fill="none" stroke="rgba(192, 132, 252, 0.35)" strokeWidth="1.6" transform="rotate(-65 300 300)" />
              <ellipse cx="300" cy="300" rx="230" ry="70" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.8" transform="rotate(15 300 300)" />

              {/* Energy Pulse Orbit Lines */}
              <path className="pulsing-orbit-line" d="M 90,160 Q 240,70 510,120" fill="none" stroke="rgba(192, 132, 252, 0.7)" strokeWidth="2" />
              <path className="pulsing-orbit-line" d="M 70,360 Q 280,490 530,420" fill="none" stroke="rgba(56, 189, 248, 0.7)" strokeWidth="2" />

              {/* Dotted Global Grid Matrix (Expanded Scale) */}
              {Array.from({ length: 220 }).map((_, i) => {
                const angle = (i * 137.5) * (Math.PI / 180);
                const radius = Math.sqrt(i) * 15;
                if (radius > 215) return null;
                const x = 300 + radius * Math.cos(angle);
                const y = 300 + radius * Math.sin(angle);
                const opacity = 0.3 + (Math.sin(i * 0.35) + 1) * 0.35;
                const size = i % 8 === 0 ? 3.5 : i % 3 === 0 ? 2.4 : 1.5;
                const isCyan = i % 4 === 0;
                const isPink = i % 9 === 0;
                const color = isPink ? '#f43f5e' : isCyan ? '#38bdf8' : '#c084fc';
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={size}
                    fill={color}
                    opacity={opacity}
                  />
                );
              })}

              {/* Major Pulsing Node Lights */}
              <circle cx="230" cy="200" r="5" fill="#38bdf8" />
              <circle cx="230" cy="200" r="16" fill="rgba(56, 189, 248, 0.35)" />

              <circle cx="375" cy="330" r="5" fill="#c084fc" />
              <circle cx="375" cy="330" r="16" fill="rgba(192, 132, 252, 0.35)" />

              <circle cx="180" cy="360" r="5" fill="#fbbf24" />
              <circle cx="180" cy="360" r="16" fill="rgba(251, 191, 36, 0.35)" />

              <circle cx="430" cy="210" r="5" fill="#f43f5e" />
              <circle cx="430" cy="210" r="16" fill="rgba(244, 63, 94, 0.35)" />
            </svg>
          </div>
        </div>
      </section>

      {/* Four Core Ecosystem Modules Section */}
      <section className="modules-section">
        <div className="modules-header">
          <h2 className="modules-title">Four Core Ecosystem Modules</h2>
          <p className="modules-subtitle">Everything you need to offer, hire, build, or learn in one place</p>
        </div>

        <div className="modules-grid">
          {/* Card 1: Services Marketplace */}
          <div 
            className="module-card"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              '--card-glow-color': 'rgba(124, 58, 237, 0.28)',
              '--card-border-color': 'rgba(167, 139, 250, 0.5)'
            } as React.CSSProperties}
          >
            <div className="card-spotlight-reflection" />
            <div 
              className="module-icon-box"
              style={{
                '--icon-bg': 'rgba(124, 58, 237, 0.18)',
                '--icon-color': '#c084fc',
                '--icon-glow': 'rgba(124, 58, 237, 0.4)'
              } as React.CSSProperties}
            >
              <Wrench size={26} />
            </div>

            <div>
              <h3 className="module-card-title">Services Marketplace</h3>
              <p className="module-card-desc">
                Digital & local physical services offered by top freelancers and experts.
              </p>
            </div>

            <svg className="card-art-overlay" viewBox="0 0 100 100">
              <path d="M20 80 L50 20 L80 80 Z" fill="none" stroke="#7c3aed" strokeWidth="2" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* Card 2: Jobs & Tasks */}
          <div 
            className="module-card"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              '--card-glow-color': 'rgba(14, 165, 233, 0.28)',
              '--card-border-color': 'rgba(56, 189, 248, 0.5)'
            } as React.CSSProperties}
          >
            <div className="card-spotlight-reflection" />
            <div 
              className="module-icon-box"
              style={{
                '--icon-bg': 'rgba(14, 165, 233, 0.18)',
                '--icon-color': '#38bdf8',
                '--icon-glow': 'rgba(14, 165, 233, 0.4)'
              } as React.CSSProperties}
            >
              <Briefcase size={26} />
            </div>

            <div>
              <h3 className="module-card-title">Jobs & Tasks</h3>
              <p className="module-card-desc">
                Post job requirements or apply to remote & local physical tasks near you.
              </p>
            </div>

            <svg className="card-art-overlay" viewBox="0 0 100 100">
              <rect x="15" y="25" width="70" height="50" rx="8" fill="none" stroke="#0ea5e9" strokeWidth="2" />
              <line x1="15" y1="45" x2="85" y2="45" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Card 3: Ideas Marketplace */}
          <div 
            className="module-card"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              '--card-glow-color': 'rgba(245, 158, 11, 0.28)',
              '--card-border-color': 'rgba(251, 191, 36, 0.5)'
            } as React.CSSProperties}
          >
            <div className="card-spotlight-reflection" />
            <div 
              className="module-icon-box"
              style={{
                '--icon-bg': 'rgba(245, 158, 11, 0.18)',
                '--icon-color': '#fbbf24',
                '--icon-glow': 'rgba(245, 158, 11, 0.4)'
              } as React.CSSProperties}
            >
              <Lightbulb size={26} />
            </div>

            <div>
              <h3 className="module-card-title">Ideas Marketplace</h3>
              <p className="module-card-desc">
                List, license, or purchase verified business ideas and patents.
              </p>
            </div>

            <svg className="card-art-overlay" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="35" fill="none" stroke="#f59e0b" strokeWidth="2" />
              <polygon points="50,15 60,40 85,50 60,60 50,85 40,60 15,50 40,40" fill="none" stroke="#fbbf24" strokeWidth="1" />
            </svg>
          </div>

          {/* Card 4: Courses & Learning */}
          <div 
            className="module-card"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              '--card-glow-color': 'rgba(16, 185, 129, 0.28)',
              '--card-border-color': 'rgba(52, 211, 153, 0.5)'
            } as React.CSSProperties}
          >
            <div className="card-spotlight-reflection" />
            <div 
              className="module-icon-box"
              style={{
                '--icon-bg': 'rgba(16, 185, 129, 0.18)',
                '--icon-color': '#34d399',
                '--icon-glow': 'rgba(16, 185, 129, 0.4)'
              } as React.CSSProperties}
            >
              <GraduationCap size={26} />
            </div>

            <div>
              <h3 className="module-card-title">Courses & Learning</h3>
              <p className="module-card-desc">
                Master new skills with video courses, track progress, and earn certificates.
              </p>
            </div>

            <svg className="card-art-overlay" viewBox="0 0 100 100">
              <polygon points="50,20 85,40 50,60 15,40" fill="none" stroke="#10b981" strokeWidth="2" />
              <path d="M30 50 v20 q20 15 40 0 v-20" fill="none" stroke="#34d399" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 The Marketplace Inc. All rights reserved. Every Skill. Every Task. Every Idea. Every Opportunity.</p>
      </footer>
    </div>
  );
};
