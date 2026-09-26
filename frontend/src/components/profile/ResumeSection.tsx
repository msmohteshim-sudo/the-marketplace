import React, { useState } from 'react';
import { FileText, Upload, Trash2, Eye, Download, Sparkles, CheckCircle2, Lock, Shield, RefreshCw } from 'lucide-react';
import { profileApi } from '../../services/api';

interface ResumeSectionProps {
  profile: any;
  resumeVisibility?: string;
  onUpdateProfile: (updatedProfile: any) => Promise<void>;
  onUpdateVisibility: (visibility: string) => Promise<void>;
}

import { safeJsonParse } from '../../utils/safeJsonParse';

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  profile,
  resumeVisibility = 'private',
  onUpdateProfile,
  onUpdateVisibility
}) => {
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [visibility, setVisibility] = useState(resumeVisibility);

  // Resume parsed AI suggestions state
  const [parsedSuggestions, setParsedSuggestions] = useState<any>(
    safeJsonParse(profile?.resumeParsedData, null)
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExts = ['pdf', 'doc', 'docx'];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!ext || !validExts.includes(ext)) {
      setMsg({ text: 'Please upload a valid PDF, DOC, or DOCX resume file.', type: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMsg({ text: 'Resume file size must be under 5 MB.', type: 'error' });
      return;
    }

    setUploading(true);
    setMsg(null);

    try {
      // Read simulated text for resume parsing
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawText = (event.target?.result as string) || '';
        
        const res = await profileApi.uploadResume({
          resumeName: file.name,
          resumeUrl: `https://themarketplace.storage/resumes/${file.name}`,
          rawText
        });

        if (res.parsedData) {
          setParsedSuggestions(res.parsedData);
          setSelectedSkills(res.parsedData.suggestedSkills || []);
        }

        setMsg({ text: 'Resume uploaded and processed successfully!', type: 'success' });
        await onUpdateProfile(res.profile);
      };
      reader.readAsText(file);
    } catch (err: any) {
      setMsg({ text: 'Failed to upload resume file.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete your uploaded resume?')) return;
    try {
      await profileApi.deleteResume();
      setParsedSuggestions(null);
      setMsg({ text: 'Resume deleted successfully.', type: 'success' });
      await onUpdateProfile({ ...profile, resumeUrl: null, resumeName: null });
    } catch (err) {
      setMsg({ text: 'Failed to delete resume.', type: 'error' });
    }
  };

  const handleApplySuggestions = async () => {
    if (!parsedSuggestions) return;

    try {
      const existingSkills: string[] = safeJsonParse(profile?.skills, []);
      const combinedSkills = Array.from(new Set([...existingSkills, ...selectedSkills]));

      await onUpdateProfile({
        ...profile,
        professionalTitle: profile?.professionalTitle || parsedSuggestions.suggestedTitle,
        skills: JSON.stringify(combinedSkills)
      });

      setMsg({ text: 'Selected skills & title added to your profile!', type: 'success' });
      setParsedSuggestions(null);
    } catch (err) {
      setMsg({ text: 'Failed to apply resume suggestions.', type: 'error' });
    }
  };

  const handleVisibilityChange = async (newVal: string) => {
    setVisibility(newVal);
    try {
      await onUpdateVisibility(newVal);
      setMsg({ text: 'Resume privacy setting updated.', type: 'success' });
    } catch (err) {
      setMsg({ text: 'Failed to update resume privacy.', type: 'error' });
    }
  };

  const hasResume = Boolean(profile?.resumeName || profile?.resumeUrl);

  return (
    <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} color="#38bdf8" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            PROFESSIONAL FREELANCER RESUME
          </h3>
        </div>
        <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
          AI SKILL EXTRACTION
        </span>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        Upload your resume (PDF, DOC, DOCX) to automatically extract skills, work history, and certifications into your marketplace profile.
      </p>

      {msg && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: msg.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
            border: msg.type === 'success' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(244,63,94,0.3)',
            borderRadius: 'var(--radius-md)',
            color: msg.type === 'success' ? '#34d399' : '#f43f5e',
            marginBottom: '1.25rem',
            fontSize: '0.85rem'
          }}
        >
          {msg.text}
        </div>
      )}

      {/* Resume Card Display or Upload Form */}
      {hasResume ? (
        <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <FileText size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {profile.resumeName || 'Freelancer_Resume.pdf'}
                </h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Uploaded on {profile.resumeUploadedAt ? new Date(profile.resumeUploadedAt).toLocaleDateString() : 'Aug 2026'} • 1.8 MB
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => alert(`Viewing document: ${profile.resumeName || 'Resume.pdf'}`)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
              >
                <Eye size={14} /> VIEW
              </button>

              <button
                type="button"
                onClick={() => alert(`Downloading ${profile.resumeName || 'Resume.pdf'}`)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
              >
                <Download size={14} /> DOWNLOAD
              </button>

              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', margin: 0 }}>
                <Upload size={14} /> REPLACE
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>

              <button
                type="button"
                onClick={handleDeleteResume}
                className="btn btn-ghost btn-sm"
                style={{ color: '#f43f5e', fontSize: '0.78rem' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', border: '2px dashed var(--border-default)', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.01)', marginBottom: '1.5rem' }}>
          <Upload size={36} color="#a78bfa" style={{ marginBottom: '0.75rem' }} />
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Upload Your Resume File</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
            Supported formats: PDF, DOC, DOCX (Max 5 MB)
          </p>
          <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            {uploading ? 'Processing...' : 'UPLOAD RESUME FILE'}
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>
      )}

      {/* NON-DESTRUCTIVE AI SUGGESTIONS BANNER */}
      {parsedSuggestions && (
        <div style={{ padding: '1.25rem', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Sparkles size={18} color="#a78bfa" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              WE FOUND THESE DETAILS IN YOUR RESUME
            </h4>
          </div>

          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Review suggested skills and title extracted from your resume. Check items you wish to add to your profile:
          </p>

          <div style={{ marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Suggested Title:</span>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a78bfa', marginTop: '0.2rem' }}>
              {parsedSuggestions.suggestedTitle}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              Suggested Technical Skills:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {(parsedSuggestions.suggestedSkills || []).map((skill: string) => {
                const isChecked = selectedSkills.includes(skill);
                return (
                  <label
                    key={skill}
                    style={{
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isChecked ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)',
                      border: isChecked ? '1px solid #7c3aed' : '1px solid var(--border-subtle)',
                      fontSize: '0.78rem',
                      color: isChecked ? '#white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={e => {
                        if (e.target.checked) setSelectedSkills([...selectedSkills, skill]);
                        else setSelectedSkills(selectedSkills.filter(s => s !== skill));
                      }}
                      style={{ width: 14, height: 14, accentColor: '#7c3aed' }}
                    />
                    {skill}
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplySuggestions}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.8rem' }}
          >
            [ ADD SELECTED TO PROFILE ]
          </button>
        </div>
      )}

      {/* Resume Privacy Controls */}
      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Lock size={14} color="#a78bfa" /> Resume Privacy Setting
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            Control who can view or download your resume file on the platform.
          </p>
        </div>

        <select
          className="input-field"
          value={visibility}
          onChange={e => handleVisibilityChange(e.target.value)}
          style={{ width: '210px', fontSize: '0.8rem' }}
        >
          <option value="private">🔒 Private (Only You)</option>
          <option value="clients">👥 Visible to Verified Clients</option>
          <option value="proposal">📄 Visible After Proposal</option>
          <option value="hired">🤝 Visible Only After Hiring</option>
        </select>
      </div>
    </div>
  );
};
