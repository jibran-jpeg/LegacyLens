import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const isActive = (p) => loc.pathname === p;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(28,28,30,0.72)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      borderBottom: '0.5px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>LegacyLens</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <>
              <NavItem to="/" active={isActive('/')}>Timeline</NavItem>
              <NavItem to="/create" active={isActive('/create')}>New Memory</NavItem>
              <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
              <span style={{ fontSize: 13, color: '#98989d' }}>{user.name}</span>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                style={{
                  background: 'none', border: 'none', color: '#0a84ff',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: '4px 8px',
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 13, fontWeight: 500, color: '#98989d', padding: '6px 12px' }}>Sign In</Link>
              <Link to="/register" style={{
                fontSize: 13, fontWeight: 500, color: '#fff',
                background: '#0a84ff', padding: '6px 16px', borderRadius: 20,
              }}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, active, children }) {
  return (
    <Link to={to} style={{
      fontSize: 13, fontWeight: 500, padding: '6px 14px', borderRadius: 20,
      color: active ? '#fff' : '#98989d',
      background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
      transition: 'all 0.2s',
    }}>{children}</Link>
  );
}
