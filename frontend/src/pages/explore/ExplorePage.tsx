import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Wrench, Briefcase, Lightbulb, GraduationCap } from 'lucide-react';
import { searchApi } from '../../services/api';

export const ExplorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (q: string) => {
    if (!q) return;
    setLoading(true);
    searchApi.search(q)
      .then(res => setResults(res.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Explore Marketplace</h1>
        <p className="page-subtitle">Search across all 4 modules simultaneously</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', maxWidth: 600 }}>
        <input
          className="form-input"
          placeholder="Search jobs, ideas, courses..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
        />
        <button className="btn btn-primary" onClick={() => handleSearch(query)}>
          <Search size={16} /> Search
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : results ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Jobs */}
          {(results.jobs || []).length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={20} color="var(--color-blue)" /> Jobs & Tasks ({results.jobs.length})
              </h2>
              <div className="marketplace-grid">
                {results.jobs.map((j: any) => (
                  <Link key={j.id} to={`/jobs/${j.id}`} className="glass-card-hover" style={{ padding: '1.25rem', textDecoration: 'none' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>{j.title}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posted by {j.client?.fullName}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Courses */}
          {(results.courses || []).length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={20} color="#059669" /> Courses ({results.courses.length})
              </h2>
              <div className="marketplace-grid">
                {results.courses.map((c: any) => (
                  <Link key={c.id} to={`/courses/${c.id}`} className="glass-card-hover" style={{ padding: '1.25rem', textDecoration: 'none' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>{c.title}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instructor: {c.instructor?.fullName}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ideas */}
          {(results.ideas || []).length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lightbulb size={20} color="#f59e0b" /> Ideas ({results.ideas.length})
              </h2>
              <div className="marketplace-grid">
                {results.ideas.map((i: any) => (
                  <Link key={i.id} to={`/ideas/${i.id}`} className="glass-card-hover" style={{ padding: '1.25rem', textDecoration: 'none' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>{i.title}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Creator: {i.creator?.fullName}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state glass-card">
          <Search size={32} />
          <h3>Type a search term above to explore</h3>
        </div>
      )}
    </div>
  );
};
