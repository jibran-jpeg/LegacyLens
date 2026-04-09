import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Lock, Camera } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const moods = {
  happy:      { label: 'Happy',      color: '#ffd60a' },
  sad:        { label: 'Sad',        color: '#0a84ff' },
  nostalgic:  { label: 'Nostalgic',  color: '#ff9f0a' },
  grateful:   { label: 'Grateful',   color: '#30d158' },
  excited:    { label: 'Excited',    color: '#ff375f' },
  peaceful:   { label: 'Peaceful',   color: '#64d2ff' },
  reflective: { label: 'Reflective', color: '#bf5af2' },
};

function SkeletonCard() {
  return (
    <div style={{ background: '#2c2c2e', borderRadius: 16, overflow: 'hidden' }}>
      <div className="animate-pulse-bg" style={{ width: '100%', height: 200, background: '#3a3a3c' }} />
      <div style={{ padding: 20 }}>
        <div className="animate-pulse-bg" style={{ width: '40%', height: 12, background: '#3a3a3c', borderRadius: 6, marginBottom: 12 }} />
        <div className="animate-pulse-bg" style={{ width: '80%', height: 16, background: '#3a3a3c', borderRadius: 6, marginBottom: 10 }} />
        <div className="animate-pulse-bg" style={{ width: '100%', height: 12, background: '#3a3a3c', borderRadius: 6, marginBottom: 8 }} />
        <div className="animate-pulse-bg" style={{ width: '60%', height: 12, background: '#3a3a3c', borderRadius: 6 }} />
      </div>
    </div>
  );
}

export default function Timeline() {
  const { token, user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/memories`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setMemories(d); setTimeout(() => setLoading(false), 500); })
      .catch(() => setLoading(false));
  }, [token]);

  const deleteMemory = async (id) => {
    if (!confirm('Delete this memory forever?')) return;
    await fetch(`${API_URL}/memories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setMemories(m => m.filter(x => x._id !== id));
  };

  const fmt = (d) => {
    const now = new Date();
    const date = new Date(d);
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 60px' }}>
      {/* Header */}
      <div className="animate-up" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            {user?.name ? `${user.name}'s Memories` : 'Memories'}
          </h1>
          <p style={{ fontSize: 15, color: '#98989d', marginTop: 6 }}>
            {loading ? 'Loading your memories...' : `${memories.length} moment${memories.length !== 1 ? 's' : ''} captured`}
          </p>
        </div>
        <Link to="/create" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#0a84ff', color: '#fff', padding: '10px 20px',
          borderRadius: 12, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          <Plus size={16} /> New Memory
        </Link>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : memories.length === 0 ? (
        /* Empty State */
        <div className="animate-scale" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '100px 24px', textAlign: 'center',
          background: '#2c2c2e', borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, marginBottom: 24,
            background: 'rgba(10,132,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Camera size={32} style={{ color: '#0a84ff' }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em' }}>
            No memories yet
          </h2>
          <p style={{ fontSize: 15, color: '#98989d', maxWidth: 320, marginBottom: 28, lineHeight: 1.5 }}>
            Start capturing the moments that matter most to you. Each memory tells your story.
          </p>
          <Link to="/create" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#0a84ff', color: '#fff', padding: '12px 24px',
            borderRadius: 12, fontSize: 15, fontWeight: 600,
          }}>
            <Plus size={16} /> Capture First Memory
          </Link>
        </div>
      ) : (
        /* Memory Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {memories.map((m, i) => {
            const mood = moods[m.mood] || moods.nostalgic;
            const isLocked = m.isLocked && m.unlockDate && new Date() < new Date(m.unlockDate);

            return (
              <div key={m._id} className="animate-up" style={{
                animationDelay: `${i * 0.08}s`,
                background: '#2c2c2e', borderRadius: 16, overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'transform 0.25s, box-shadow 0.25s',
                cursor: 'default',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Image */}
                {m.mediaUrl && !isLocked && (
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={`http://localhost:5000${m.mediaUrl}`}
                      alt={m.title}
                      style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
                      background: 'linear-gradient(to top, #2c2c2e, transparent)',
                    }} />
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: 20 }}>
                  {/* Mood + Date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: mood.color,
                        boxShadow: `0 0 8px ${mood.color}60`,
                      }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: mood.color }}>{mood.label}</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#636366' }}>{fmt(m.createdAt)}</span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em',
                    marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    {isLocked && <Lock size={14} style={{ color: '#636366' }} />}
                    {m.title}
                  </h3>

                  {/* Body */}
                  <p style={{
                    fontSize: 14, color: '#98989d', lineHeight: 1.6, marginBottom: 16,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {isLocked ? `This time capsule unlocks on ${new Date(m.unlockDate).toLocaleDateString()}` : m.content}
                  </p>

                  {/* Tags + Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {m.tags?.slice(0, 3).map((t, j) => (
                        <span key={j} style={{
                          fontSize: 12, fontWeight: 500, color: '#98989d',
                          background: '#3a3a3c', padding: '3px 10px', borderRadius: 6,
                        }}>{t}</span>
                      ))}
                      {m.isCapsule && (
                        <span style={{
                          fontSize: 11, fontWeight: 600, color: '#ff9f0a',
                          background: 'rgba(255,159,10,0.12)', padding: '3px 10px', borderRadius: 6,
                        }}>Time Capsule</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteMemory(m._id); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: 'none', border: 'none', fontSize: 12,
                        color: '#48484a', cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ff453a'; e.currentTarget.style.background = 'rgba(255,69,58,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#48484a'; e.currentTarget.style.background = 'none'; }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
