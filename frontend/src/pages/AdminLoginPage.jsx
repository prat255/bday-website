import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ErrorMessage from '../components/ErrorMessage';
import { adminLogin } from '../services/api';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminLogin(username, password);
      login(data.token, data.username);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen gradient-romantic flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md glass-card rounded-2xl p-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      >
        <h1 className="font-display text-3xl text-center text-cream mb-2">Admin</h1>
        <p className="text-center text-cream/50 text-sm mb-8">Sign in to manage memories</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm text-cream/70 mb-1.5">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm text-cream/70 mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <ErrorMessage message={error} />
          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link to="/" className="text-sm text-pink-soft/80 hover:text-pink-soft transition-colors">
            ← Back to journey
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
