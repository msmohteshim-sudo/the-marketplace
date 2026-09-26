import React, { useState, useEffect } from 'react';
import { Shield, Users, Wrench, Briefcase, Lightbulb, GraduationCap, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../services/api';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getStats(),
      adminApi.getUsers()
    ]).then(([s, u]) => {
      setStats(s.stats);
      setUsers(u.users || []);
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  const toggleVerify = (userId: string, currentVal: boolean) => {
    adminApi.updateUser(userId, { isVerified: !currentVal }).then(() => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !currentVal } : u));
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform governance, user verification, and ecosystem analytics</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="loading-spinner" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Users', val: stats?.users || 0, icon: <Users size={18} /> },
              { label: 'Services', val: stats?.services || 0, icon: <Wrench size={18} /> },
              { label: 'Jobs', val: stats?.jobs || 0, icon: <Briefcase size={18} /> },
              { label: 'Ideas', val: stats?.ideas || 0, icon: <Lightbulb size={18} /> },
              { label: 'Courses', val: stats?.courses || 0, icon: <GraduationCap size={18} /> },
              { label: 'Enrollments', val: stats?.enrollments || 0, icon: <Shield size={18} /> }
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--color-purple-light)' }}>{s.val}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* User Table */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>User Management</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Mode</th>
                    <th style={{ padding: '0.75rem' }}>Role</th>
                    <th style={{ padding: '0.75rem' }}>Verified</th>
                    <th style={{ padding: '0.75rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.fullName || 'User'}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{u.activeMode}</td>
                      <td style={{ padding: '0.75rem' }}>
                        {u.isAdmin ? <span className="badge badge-purple">Admin</span> : 'User'}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {u.isVerified ? (
                          <span className="badge badge-green"><CheckCircle2 size={12} /> Verified</span>
                        ) : (
                          <span className="badge badge-gray">Unverified</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => toggleVerify(u.id, u.isVerified)}>
                          {u.isVerified ? 'Unverify' : 'Verify User'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
