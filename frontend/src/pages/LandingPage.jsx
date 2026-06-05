import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import ErrorMessage from '../components/ErrorMessage';
import { verifyPassword } from '../services/api';
import { useJourneyAccess } from '../hooks/useJourneyAccess';

export default function LandingPage() {
  const navigate = useNavigate();
  const { unlock } = useJourneyAccess();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyPassword(password);
      setExiting(true);
      unlock();
      setTimeout(() => navigate('/journey'), 1000);
    } catch (err) {
      setShake(true);
      setError(err.message || 'Incorrect password');
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      className="relative min-h-screen gradient-romantic flex items-center justify-center px-4"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 1.02 : 1 }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
    >
      <AnimatedBackground />
      <motion.div
        className="relative z-10 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      >
        <h1 className="font-display text-4xl md:text-5xl text-cream mb-3 tracking-tight">
          A Special Journey Awaits You Myyyyy Bubuuuu
        </h1>
        <p className="text-cream/65 text-sm md:text-base mb-2 font-light tracking-wide">
          Enter the secret password to begin
        </p>
        <p className='text-white text-sm md:text-base mb-10 font-light tracking-wide' style={{ fontSize: '12px' }}>Hint: The most important date of our Relationship 👉👈
        </p>


        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 text-left">
          <label htmlFor="password" className="sr-only">
            Secret password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="off"
            placeholder="DDMMYYYY"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            className={`input-field mb-4 ${shake ? 'input-error' : ''}`}
            disabled={loading || exiting}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'password-error' : undefined}
          />
          <AnimatePresence>
            {error && (
              <div id="password-error">
                <ErrorMessage message={error} />
              </div>
            )}
          </AnimatePresence>
          <button
            type="submit"
            className="btn-primary w-full mt-6"
            disabled={loading || exiting || !password.trim()}
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </motion.div>
    </motion.section>
  );
}
