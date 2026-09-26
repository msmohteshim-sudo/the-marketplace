import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, AlertCircle, RefreshCw, Compass } from 'lucide-react';
import { profileApi } from '../../services/api';

interface SmartLocationSectionProps {
  user: any;
  onSaveLocation: (locationData: any) => Promise<void>;
}

export const SmartLocationSection: React.FC<SmartLocationSectionProps> = ({
  user,
  onSaveLocation
}) => {
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [country, setCountry] = useState(user?.country || 'India');
  const [state, setState] = useState(user?.state || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [city, setCity] = useState(user?.city || '');
  const [locality, setLocality] = useState(user?.locality || '');
  const [serviceRadius, setServiceRadius] = useState<number>(user?.serviceRadius || 10);

  const [postOffices, setPostOffices] = useState<any[]>([]);
  const [loadingPin, setLoadingPin] = useState(false);
  const [pinMessage, setPinMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    setPinMessage(null);

    if (val.length === 6) {
      setLoadingPin(true);
      try {
        const res = await profileApi.pincodeLookup(val);
        if (res.success) {
          setState(res.state || '');
          setDistrict(res.district || '');
          setPostOffices(res.postOffices || []);

          if (res.postOffices && res.postOffices.length > 0) {
            setLocality(res.postOffices[0].name);
            setCity(res.district || res.postOffices[0].name);
          }

          setPinMessage({
            text: `Detected: ${res.district}, ${res.state}`,
            type: 'success'
          });
        } else {
          setPinMessage({
            text: res.message || 'Location could not be found. Please check your PIN code.',
            type: 'error'
          });
        }
      } catch (err) {
        setPinMessage({
          text: 'Error connecting to PIN code service. Enter details manually if needed.',
          type: 'error'
        });
      } finally {
        setLoadingPin(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fullLocationString = locality && state ? `${locality}, ${city || district}, ${state} - ${pincode}` : `${city || district}, ${state}`;
      await onSaveLocation({
        pincode,
        country,
        state,
        district,
        city,
        locality,
        location: fullLocationString,
        serviceRadius
      });
      setPinMessage({ text: 'Location details saved successfully!', type: 'success' });
    } catch (err) {
      setPinMessage({ text: 'Failed to save location details.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={20} color="#a78bfa" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            SMART LOCATION & PIN CODE SYSTEM
          </h3>
        </div>
        <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
          INDIAN POSTAL AUTO-FILL
        </span>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Enter your 6-digit Indian Postal PIN Code to automatically retrieve State, District, and Local Post Offices.
      </p>

      {pinMessage && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: pinMessage.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
            border: pinMessage.type === 'success' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(244,63,94,0.3)',
            borderRadius: 'var(--radius-md)',
            color: pinMessage.type === 'success' ? '#34d399' : '#f43f5e',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          {pinMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {pinMessage.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Country */}
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Country</label>
          <select className="input-field" value={country} onChange={e => setCountry(e.target.value)} style={{ fontSize: '0.85rem' }}>
            <option value="India">🇮🇳 India</option>
            <option value="United States">🇺🇸 United States</option>
            <option value="United Kingdom">🇬🇧 United Kingdom</option>
            <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
          </select>
        </div>

        {/* PIN Code */}
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
            6-Digit PIN Code {loadingPin && <RefreshCw size={12} className="spin" style={{ marginLeft: '4px' }} />}
          </label>
          <input
            type="text"
            className="input-field"
            maxLength={6}
            placeholder="e.g. 413512"
            value={pincode}
            onChange={handlePincodeChange}
            style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Space Grotesk' }}
          />
        </div>

        {/* State (Auto-filled) */}
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>State (Auto-Detected)</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Maharashtra"
            value={state}
            onChange={e => setState(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          />
        </div>

        {/* District (Auto-filled) */}
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>District / City</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Latur"
            value={district || city}
            onChange={e => {
              setDistrict(e.target.value);
              setCity(e.target.value);
            }}
            style={{ fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Post Office / Locality Selector */}
      {postOffices.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
            Select Locality / Post Office
          </label>
          <select
            className="input-field"
            value={locality}
            onChange={e => setLocality(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          >
            {postOffices.map((po, i) => (
              <option key={i} value={po.name}>
                📍 {po.name} ({po.district}, {po.state})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Local Service Radius Slider */}
      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Compass size={15} color="#38bdf8" /> Local Service Radius
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'Space Grotesk' }}>
            {serviceRadius} km
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={50}
          value={serviceRadius}
          onChange={e => setServiceRadius(parseInt(e.target.value, 10))}
          style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          <span>1 km (Neighborhood)</span>
          <span>10 km (City Wide)</span>
          <span>50 km (Metro District)</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving Location...' : 'Save Location & PIN Details'}
        </button>
      </div>
    </form>
  );
};
