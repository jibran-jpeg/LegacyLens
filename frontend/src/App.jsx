import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Timeline from './pages/Timeline';
import CreateMemory from './pages/CreateMemory';

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 rounded-full animate-spin" style={{ border: '2px solid var(--color-border)', borderTopColor: 'var(--color-primary)' }} />
        <p className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" />;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return !user ? children : <Navigate to="/" />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateMemory /></ProtectedRoute>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
          <Navbar />
          <AnimatedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
