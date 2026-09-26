import React, { useState } from 'react';
import { X, Zap, MapPin, Clock, DollarSign, Star, ShieldCheck, CheckCircle2, Search } from 'lucide-react';

interface UberQuickRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation?: string;
  onWorkerHired?: (worker: any) => void;
}

const TRADES = [
  { id: 'electrician', name: 'Electrician', icon: '⚡' },
  { id: 'plumber', name: 'Plumber', icon: '🔧' },
  { id: 'locksmith', name: 'Locksmith', icon: '🔑' },
  { id: 'ac', name: 'AC Technician', icon: '❄️' },
  { id: 'appliance', name: 'Appliance Repair', icon: '📺' },
  { id: 'mechanic', name: 'Car/Bike Mechanic', icon: '🚗' },
  { id: 'cleaning', name: 'Urgent Cleaner', icon: '🧹' },
  { id: 'mover', name: 'Moving Helper', icon: '📦' }
];

export const UberQuickRequestModal: React.FC<UberQuickRequestModalProps> = ({
  isOpen,
  onClose,
  userLocation = 'Latur, Maharashtra — 413512',
  onWorkerHired
}) => {
  if (!isOpen) return null;

  const [selectedTrade, setSelectedTrade] = useState('electrician');
  const [problem, setProblem] = useState('Fan not working / short circuit');
  const [budget, setBudget] = useState('500 - 800');
  const [searching, setSearching] = useState(false);
  const [matchedWorker, setMatchedWorker] = useState<any>(null);
  const [hired, setHired] = useState(false);

  const handleSearchWorkers = () => {
    setSearching(true);
    setMatchedWorker(null);

    setTimeout(() => {
      setSearching(false);
      setMatchedWorker({
        id: `matched-worker-${Date.now()}`,
        name: 'Ramesh Patil',
        skill: selectedTrade === 'electrician' ? 'Master Electrician' : selectedTrade === 'plumber' ? 'Licensed Plumber' : 'Certified Local Technician',
        photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviewsCount: 142,
        distance: '1.2 km away',
        arrivalTime: '15 – 25 mins',
        hourlyRate: 350,
        fixedPrice: 650,
        verified: true,
        availableNow: true
      });
    }, 1800);
  };

  const handleConfirmHire = () => {
    setHired(true);
    if (onWorkerHired && matchedWorker) onWorkerHired(matchedWorker);
    setTimeout(() => {
      setHired(false);
      setMatchedWorker(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content glass-card"
        style={{
          maxWidth: 540,
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '1.75rem',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e' }}>
              <Zap size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                On-Demand Urgent Helper
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Find nearby available workers in minutes</span>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {hired ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(52,211,153,0.2)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={32} />
            </div>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Worker Dispatched!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <strong>{matchedWorker?.name}</strong> is on the way to your location.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Estimated Arrival: {matchedWorker?.arrivalTime}</p>
          </div>
        ) : searching ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', border: '4px solid rgba(124,58,237,0.2)', borderTopColor: '#7c3aed', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }} />
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Scanning Nearby Workers...</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Finding top-rated available workers within 5 km of your location.</p>
          </div>
        ) : matchedWorker ? (
          <div>
            <div style={{ padding: '1rem', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', color: '#34d399', fontSize: '0.8rem', fontWeight: 700 }}>
              ⚡ 1 Top-Rated Available Worker Found Nearby!
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <img
                  src={matchedWorker.photo}
                  alt={matchedWorker.name}
                  style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #7c3aed' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{matchedWorker.name}</h4>
                    <ShieldCheck size={16} color="#34d399" />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-purple-light)', fontWeight: 600 }}>{matchedWorker.skill}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    <span style={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                      <Star size={12} fill="#f59e0b" color="#f59e0b" /> {matchedWorker.rating} ({matchedWorker.reviewsCount})
                    </span>
                    <span>📍 {matchedWorker.distance}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>ESTIMATED ARRIVAL</span>
                  <span style={{ fontWeight: 800, color: '#a78bfa' }}>⏱ {matchedWorker.arrivalTime}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>ESTIMATED COST</span>
                  <span style={{ fontWeight: 800, color: '#34d399' }}>₹{matchedWorker.fixedPrice}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setMatchedWorker(null)}>Re-search</button>
              <button className="btn btn-primary" onClick={handleConfirmHire} style={{ fontWeight: 800 }}>
                DISPATCH & HIRE WORKER NOW
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Location Banner */}
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#38bdf8' }}>
              <MapPin size={16} /> <strong>Location:</strong> {userLocation}
            </div>

            {/* Trade Picker Grid */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Select Service Needed *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {TRADES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTrade(t.id)}
                    style={{
                      padding: '0.6rem 0.35rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedTrade === t.id ? '2px solid #7c3aed' : '1px solid var(--border-default)',
                      background: selectedTrade === t.id ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                    <span style={{ textAlign: 'center', lineHeight: 1.2 }}>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Describe Problem / Task *</label>
              <input
                className="form-input"
                placeholder="e.g. Fan not working, short circuit, tap leaking..."
                value={problem}
                onChange={e => setProblem(e.target.value)}
              />
            </div>

            {/* Expected Arrival & Budget */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="input-label">Urgency</label>
                <div className="form-input" style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', fontWeight: 800, border: '1px solid rgba(244,63,94,0.3)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={16} /> NOW (20–40 min)
                </div>
              </div>

              <div>
                <label className="input-label">Budget Range (₹)</label>
                <input
                  className="form-input"
                  placeholder="500 - 800"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleSearchWorkers}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontWeight: 800, fontSize: '0.95rem' }}
            >
              ⚡ FIND AVAILABLE WORKER NOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
