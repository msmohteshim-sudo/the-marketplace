import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, MessageSquare, ChevronDown, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { searchApi, notificationsApi } from '../../services/api';
import { safeJsonParse } from '../../utils/safeJsonParse';
import './layout.css';

export const Header: React.FC = () => {
  const { user, switchWorkType } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    notificationsApi.getAll()
      .then(res => setUnreadNotifs(res.unreadCount || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
        setSearchResults(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults(null); return; }
    try {
      const res = await searchApi.search(q);
      setSearchResults(res.results);
      setShowSearch(true);
    } catch (e) {}
  };

  const goToResult = (type: string, id: string) => {
    navigate(`/${type}/${id}`);
    setShowSearch(false);
    setSearchQuery('');
  };

  const goToSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    setShowSearch(false);
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header className="app-header">
      {/* Search */}
      <div className="header-search" ref={searchRef}>
        <form className="header-search-input-wrap" onSubmit={e => { e.preventDefault(); goToSearch(); }}>
          <button
            type="submit"
            className="header-search-btn"
            title="Search"
            style={{
              position: 'absolute',
              left: '0.875rem',
              background: 'none',
              border: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              zIndex: 2
            }}
          >
            <Search size={16} />
          </button>
          <input
            className="header-search-input"
            placeholder={user?.activeWorkType === 'physical' ? "Search local services, tasks, electricians, plumbers..." : "Search jobs, ideas, services..."}
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowSearch(true)}
          />
          {searchQuery && (
            <button
              type="button"
              className="header-search-clear"
              onClick={() => { setSearchQuery(''); setSearchResults(null); }}
              style={{ zIndex: 2 }}
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Search Dropdown */}
        {showSearch && searchResults && (
          <div className="header-search-dropdown">
            {Object.entries({ jobs: searchResults.jobs, ideas: searchResults.ideas, courses: searchResults.courses }).some(([, v]) => (v as any[])?.length > 0) ? (
              <>
                {(searchResults.jobs || []).length > 0 && (
                  <div className="search-group">
                    <div className="search-group-label">Jobs</div>
                    {searchResults.jobs.map((j: any) => (
                      <button key={j.id} className="search-result-item" onClick={() => goToResult('jobs', j.id)}>
                        <div className="search-result-title">{j.title}</div>
                        <div className="search-result-sub">{j.client?.fullName}</div>
                      </button>
                    ))}
                  </div>
                )}
                {(searchResults.courses || []).length > 0 && (
                  <div className="search-group">
                    <div className="search-group-label">Courses</div>
                    {searchResults.courses.map((c: any) => (
                      <button key={c.id} className="search-result-item" onClick={() => goToResult('courses', c.id)}>
                        <div className="search-result-title">{c.title}</div>
                        <div className="search-result-sub">{c.instructor?.fullName}</div>
                      </button>
                    ))}
                  </div>
                )}
                {(searchResults.ideas || []).length > 0 && (
                  <div className="search-group">
                    <div className="search-group-label">Ideas</div>
                    {searchResults.ideas.map((i: any) => (
                      <button key={i.id} className="search-result-item" onClick={() => goToResult('ideas', i.id)}>
                        <div className="search-result-title">{i.title}</div>
                        <div className="search-result-sub">{i.creator?.fullName}</div>
                      </button>
                    ))}
                  </div>
                )}
                <button className="search-see-all" onClick={goToSearch}>
                  See all results for "{searchQuery}"
                </button>
              </>
            ) : (
              <div className="search-empty">No results found for "{searchQuery}"</div>
            )}
          </div>
        )}
      </div>

      {/* Actions & Badges */}
      <div className="header-actions">
        {/* Capability & Work Type Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginRight: '0.5rem' }}>
          {safeJsonParse<string[]>(user?.capabilities, ['client']).map((c: string) => (
            <span
              key={c}
              style={{
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                background: c === 'client' ? 'rgba(14,165,233,0.15)' : 'rgba(124,58,237,0.15)',
                color: c === 'client' ? '#38bdf8' : '#a78bfa',
                border: `1px solid ${c === 'client' ? 'rgba(14,165,233,0.3)' : 'rgba(124,58,237,0.3)'}`,
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {c}
            </span>
          ))}

          {/* Work Type Badge OR Switch Button */}
          {(() => {
            const isPhysical = user?.activeWorkType === 'physical';
            const canSwitch = user?.clientWorkPreference === 'both' || user?.freelancerWorkPreference === 'both' || user?.activeWorkType === 'both';
            
            const badgeContent = (
              <>
                <span>{isPhysical ? '🟢 PHYSICAL' : '💻 DIGITAL'}</span>
                {canSwitch && <RefreshCw size={10} />}
              </>
            );

            const badgeStyle = {
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: isPhysical ? 'rgba(52,211,153,0.15)' : 'rgba(167,139,250,0.15)',
              color: isPhysical ? '#34d399' : '#a78bfa',
              border: `1px solid ${isPhysical ? 'rgba(52,211,153,0.3)' : 'rgba(167,139,250,0.3)'}`,
              fontSize: '0.65rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            } as React.CSSProperties;

            if (canSwitch) {
              return (
                <button
                  onClick={() => switchWorkType(isPhysical ? 'digital' : 'physical')}
                  style={{ ...badgeStyle, cursor: 'pointer', border: '1px solid currentColor' }}
                  title="Switch work mode"
                >
                  {badgeContent}
                </button>
              );
            }
            return <span style={badgeStyle}>{badgeContent}</span>;
          })()}
        </div>

        <Link to="/notifications" className={`header-action-btn ${unreadNotifs > 0 ? 'has-badge' : ''}`} data-badge={unreadNotifs > 0 ? unreadNotifs : undefined}>
          <Bell size={18} />
        </Link>
        <Link to="/messages" className="header-action-btn">
          <MessageSquare size={18} />
        </Link>
        <Link to="/profile" className="header-user-btn">
          <div className="avatar-placeholder" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
            {initials}
          </div>
          <span className="header-user-name">
            {user?.fullName?.split(' ')[0] || 'Account'}
          </span>
        </Link>
      </div>
    </header>
  );
};
