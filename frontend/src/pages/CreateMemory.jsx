import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Camera, Calendar, Hash, Lock, Check, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const moods = [
  { v: 'happy',      l: 'Happy',      c: '#ffd60a' },
  { v: 'sad',        l: 'Sad',        c: '#0a84ff' },
  { v: 'nostalgic',  l: 'Nostalgic',  c: '#ff9f0a' },
  { v: 'grateful',   l: 'Grateful',   c: '#30d158' },
  { v: 'excited',    l: 'Excited',    c: '#ff375f' },
  { v: 'peaceful',   l: 'Peaceful',   c: '#64d2ff' },
  { v: 'reflective', l: 'Reflective', c: '#bf5af2' }
];

export default function CreateMemory() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('nostalgic');
  const [tags, setTags] = useState('');
  const [isCapsule, setIsCapsule] = useState(false);
  const [unlockDate, setUnlockDate] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) {
        alert("Image too large (max 5MB)");
        return;
      }
      setImage(f);
      setImagePreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('title', title);
    fd.append('content', content);
    fd.append('mood', mood);
    fd.append('tags', tags);
    fd.append('isCapsule', isCapsule);
    if (isCapsule && unlockDate) fd.append('unlockDate', unlockDate);
    if (image) fd.append('image', image);

    try {
      const res = await fetch(`${API_URL}/memories`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      if (!res.ok) throw new Error("Upload failed");
      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: '#1c1c1e' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 40px' }}>
        
        {/* Top Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: 'none', color: '#98989d',
              display: 'flex', alignItems: 'center', gap: 6,
              cursor: 'pointer', fontSize: 13, fontWeight: 500, padding: 0
            }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = '#98989d'}
          >
            <ArrowLeft size={14} /> Back
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>New Memory</h1>
          </div>
          
          <div style={{ width: 60 }} /> {/* Spacer to center the title */}
        </div>

        {/* Main Content Grid */}
        <form onSubmit={handleSubmit} className="animate-up" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
          gap: 40,
          background: '#2c2c2e', 
          borderRadius: 24,
          padding: '40px',
          boxShadow: '0 12px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.06) inset',
        }}>
          
          {/* Left Column: Visuals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ marginBottom: 8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Capture the Vision</h2>
              <p style={{ fontSize: 14, color: '#98989d' }}>Upload a photo to ground your memory in reality.</p>
            </div>

            {imagePreview ? (
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: '1px solid #3a3a3c', flex: 1, minHeight: 400 }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute', inset: 0, 
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)'
                }} />
                <button 
                  type="button" 
                  onClick={() => { setImage(null); setImagePreview(null); }} 
                  style={{
                    position: 'absolute', top: 16, right: 16, padding: '10px 16px',
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                    color: '#fff', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                width: '100%', flex: 1, minHeight: 450, borderRadius: 20, border: '2px dashed #48484a',
                background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0a84ff'; e.currentTarget.style.background = 'rgba(10,132,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#48484a'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
              >
                <div style={{ width: 64, height: 64, borderRadius: 20, background: '#1c1c1e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Camera size={32} style={{ color: '#636366' }} />
                </div>
                <span style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>Add a Photo</span>
                <span style={{ fontSize: 14, color: '#98989d', marginTop: 8 }}>Click to browse or drag and drop</span>
                <span style={{ fontSize: 12, color: '#48484a', marginTop: 12 }}>High resolution JPEG or PNG (Max 5MB)</span>
                <input type="file" onChange={handleImage} className="hidden" accept="image/*" />
              </label>
            )}
          </div>

          {/* Right Column: Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input 
                type="text" value={title} onChange={e => setTitle(e.target.value)} 
                placeholder="Give your memory a name..." required 
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#0a84ff'; e.target.style.boxShadow = '0 0 0 3px rgba(10,132,255,0.2)'; }}
                onBlur={e => { e.target.style.borderColor = '#3a3a3c'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label style={labelStyle}>The Story</label>
              <textarea 
                value={content} onChange={e => setContent(e.target.value)} 
                placeholder="What happened? What were you feeling?" required 
                style={{ ...inputStyle, height: 180, resize: 'none' }}
                onFocus={e => { e.target.style.borderColor = '#0a84ff'; e.target.style.boxShadow = '0 0 0 3px rgba(10,132,255,0.2)'; }}
                onBlur={e => { e.target.style.borderColor = '#3a3a3c'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Mood</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={mood} onChange={e => setMood(e.target.value)} 
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                  >
                    {moods.map(m => (
                      <option key={m.v} value={m.v}>{m.l}</option>
                    ))}
                  </select>
                  <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-10%)', pointerEvents: 'none' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: moods.find(m => m.v === mood).c }} />
                  </div>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Tags</label>
                <input 
                  type="text" value={tags} onChange={e => setTags(e.target.value)} 
                  placeholder="travel, family..."
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ 
              padding: '24px', borderRadius: 20, background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: 'rgba(255,159,10,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Lock size={16} style={{ color: '#ff9f0a' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Time Capsule</p>
                    <p style={{ fontSize: 12, color: '#636366' }}>Reveal on a future date</p>
                  </div>
                </div>
                <div 
                  style={{
                    width: 50, height: 28, borderRadius: 14, 
                    background: isCapsule ? '#30d158' : '#3a3a3c',
                    position: 'relative', transition: 'all 0.3s'
                  }}
                  onClick={() => setIsCapsule(!isCapsule)}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: 12, background: '#fff',
                    position: 'absolute', top: 2, left: isCapsule ? 24 : 2,
                    transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </label>
              
              {isCapsule && (
                <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
                  <label style={labelStyle}>Unlock Date</label>
                  <input 
                    type="date" value={unlockDate} onChange={e => setUnlockDate(e.target.value)} 
                    required={isCapsule} min={new Date().toISOString().split('T')[0]}
                    style={inputStyle}
                  />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px 0', borderRadius: 16,
              background: '#0a84ff',
              color: '#fff',
              fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(10,132,255,0.2)',
              opacity: loading ? 0.6 : 1, transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              marginTop: 'auto'
            }}>
              {loading ? 'Capturing Moment...' : <><Sparkles size={18} /> Capture Memory</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { 
  display: 'block', 
  fontSize: 13, 
  fontWeight: 600, 
  color: '#98989d', 
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: '0.04em'
};

const inputStyle = {
  width: '100%', padding: '14px 16px', borderRadius: 12,
  background: '#1c1c1e', border: '1px solid #3a3a3c',
  color: '#f5f5f7', fontSize: 16, outline: 'none',
  transition: 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
};
