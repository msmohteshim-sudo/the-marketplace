import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Compass, Wrench, Briefcase, Lightbulb, GraduationCap,
  MessageSquare, Bell, Bookmark, User, Settings, LogOut, ChevronLeft,
  ChevronRight, Zap, Shield, TrendingUp, Laptop, MapPin, Globe
} from 'lucide-react';
import { useAuth, UserMode, WorkType } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { safeJsonParse } from '../../utils/safeJsonParse';
import './layout.css';

const MODE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  client: { label: 'Client Mode', icon: '💼', color: '#0ea5e9' },
  freelancer: { label: 'Freelancer Mode', icon: '💻', color: '#7c3aed' },
  both: { label: 'Universal View', icon: '✨', color: '#f59e0b' }
};

export const Sidebar: React.FC = () => {
  const { user, logout, switchMode, switchWorkType } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showModeSwitch, setShowModeSwitch] = useState(false);

  const currentMode = user?.activeMode || 'client';
  const currentWorkType = user?.activeWorkType || 'both';
  const modeInfo = MODE_LABELS[currentMode] || MODE_LABELS['client'];

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar-nav-item ${isActive ? 'active' : ''}`;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSwitchMode = async (mode: UserMode) => {
    try {
      const res = await authApi.switchMode(mode);
      switchMode(mode, res.token);
      setShowModeSwitch(false);
    } catch (e) {
      switchMode(mode);
      setShowModeSwitch(false);
    }
  };

  const handleSwitchWorkType = async (type: WorkType) => {
    try {
      const res = await authApi.switchMode(currentMode, type);
      switchWorkType(type, res.token);
    } catch (e) {
      switchWorkType(type);
    }
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  const capabilities = safeJsonParse<string[]>(user?.capabilities, ['client']);
  const hasBoth = capabilities.includes('client') && capabilities.includes('freelancer');

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand" onClick={() => navigate('/')} title="Go to home">
        <div className="sidebar-brand-icon">
          <Zap size={20} color="white" />
        </div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-name">THE MARKETPLACE</div>
            <div className="sidebar-brand-sub">EVERY OPPORTUNITY</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-group">
          {!collapsed && <div className="sidebar-nav-label">Main</div>}
          <NavLink to="/dashboard" end className={navClass}>
            <LayoutDashboard size={18} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
        </div>

        <div className="sidebar-nav-group">
          {!collapsed && <div className="sidebar-nav-label">Marketplace</div>}
          <NavLink to="/services" className={navClass}>
            <Wrench size={18} />
            {!collapsed && <span>Services</span>}
          </NavLink>
          <NavLink to="/jobs" className={navClass}>
            <Briefcase size={18} />
            {!collapsed && <span>Jobs & Tasks</span>}
          </NavLink>
          {currentWorkType !== 'physical' && (
            <NavLink to="/ideas" className={navClass}>
              <Lightbulb size={18} />
              {!collapsed && <span>Ideas</span>}
            </NavLink>
          )}
        </div>

        <div className="sidebar-nav-group">
          {!collapsed && <div className="sidebar-nav-label">Activity</div>}
          <NavLink to="/messages" className={navClass}>
            <MessageSquare size={18} />
            {!collapsed && <span>Messages</span>}
          </NavLink>
          <NavLink to="/notifications" className={navClass}>
            <Bell size={18} />
            {!collapsed && <span>Notifications</span>}
          </NavLink>
          <NavLink to="/saved" className={navClass}>
            <Bookmark size={18} />
            {!collapsed && <span>Saved</span>}
          </NavLink>
        </div>

        {user?.isAdmin && (
          <div className="sidebar-nav-group">
            {!collapsed && <div className="sidebar-nav-label">Admin</div>}
            <NavLink to="/admin" className={navClass}>
              <Shield size={18} />
              {!collapsed && <span>Admin Panel</span>}
            </NavLink>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {/* Account Mode Switcher */}
        {!collapsed && (
          <div className="sidebar-mode-section">
            <button
              className="sidebar-mode-btn"
              onClick={() => setShowModeSwitch(!showModeSwitch)}
              style={{ borderColor: modeInfo.color + '40', color: modeInfo.color }}
            >
              <span>{modeInfo.icon}</span>
              <span className="sidebar-mode-label">{modeInfo.label}</span>
              <TrendingUp size={14} style={{ marginLeft: 'auto' }} />
            </button>

            {showModeSwitch && (
              <div className="mode-switch-dropdown">
                <div className="mode-switch-title">Account Mode</div>
                {hasBoth ? (
                  <>
                    <button className="mode-switch-option" onClick={() => handleSwitchMode('client')}>
                      <span>💼</span> <span>Client Mode</span>
                    </button>
                    <button className="mode-switch-option" onClick={() => handleSwitchMode('freelancer')}>
                      <span>💻</span> <span>Freelancer Mode</span>
                    </button>
                    <button className="mode-switch-option" onClick={() => handleSwitchMode('both')}>
                      <span>✨</span> <span>Universal View</span>
                    </button>
                  </>
                ) : (
                  <>
                    {capabilities.includes('client') && (
                      <button className="mode-switch-option" onClick={() => handleSwitchMode('client')}>
                        <span>💼</span> <span>Client Mode</span>
                      </button>
                    )}
                    {capabilities.includes('freelancer') && (
                      <button className="mode-switch-option" onClick={() => handleSwitchMode('freelancer')}>
                        <span>💻</span> <span>Freelancer Mode</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* User Profile */}
        <div className="sidebar-user">
          <NavLink to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, textDecoration: 'none' }}>
            <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
              {initials}
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.fullName || user?.email?.split('@')[0] || 'User'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {hasBoth ? 'Client + Freelancer' : (user?.activeMode || 'User')}
                </div>
              </div>
            )}
          </NavLink>
          {!collapsed && (
            <button className="btn-icon" onClick={handleLogout} data-tooltip="Logout">
              <LogOut size={15} />
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button className="sidebar-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
};
