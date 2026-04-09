import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await register(name, email, password); navigate('/'); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 52px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      background: 'linear-gradient(180deg, #1c1c1e 0%, #131316 100%)',
    }}>
      <div className="animate-scale" style={{
        width: '100%', maxWidth: 420,
        background: '#2c2c2e', borderRadius: 20,
        padding: '48px 40px',
        boxShadow: '0 8px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.06) inset',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(145deg, #0a84ff, #5e5ce6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 20, fontWeight: 700, color: '#fff',
          }}>L</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 6 }}>Create account</h1>
          <p style={{ fontSize: 15, color: '#98989d' }}>Start preserving your memories</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,69,58,0.12)', border: '1px solid rgba(255,69,58,0.2)',
            borderRadius: 10, padding: '10px 14px', marginBottom: 20,
            fontSize: 13, color: '#ff453a', textAlign: 'center',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#0a84ff'; e.target.style.boxShadow = '0 0 0 3px rgba(10,132,255,0.2)'; }}
              onBlur={e => { e.target.style.borderColor = '#3a3a3c'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#0a84ff'; e.target.style.boxShadow = '0 0 0 3px rgba(10,132,255,0.2)'; }}
              onBlur={e => { e.target.style.borderColor = '#3a3a3c'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="6+ characters" required minLength={6} style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#0a84ff'; e.target.style.boxShadow = '0 0 0 3px rgba(10,132,255,0.2)'; }}
              onBlur={e => { e.target.style.borderColor = '#3a3a3c'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px 0', borderRadius: 12,
            background: '#0a84ff', color: '#fff',
            fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer',
            opacity: loading ? 0.6 : 1,
          }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#636366' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#0a84ff', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, color: '#98989d', marginBottom: 6 };
const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 10,
  background: '#1c1c1e', border: '1px solid #3a3a3c',
  color: '#f5f5f7', fontSize: 15, outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};
