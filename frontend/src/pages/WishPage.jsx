import { useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import ErrorMessage from '../components/ErrorMessage';
import { submitWish } from '../services/api';
import { useJourneyAccess } from '../hooks/useJourneyAccess';

export default function WishPage() {
  const navigate = useNavigate();
  const { lock } = useJourneyAccess();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setError('');
    setSubmitting(true);

    try {
      await submitWish(text);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send wish');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    lock();
    navigate('/');
  };

  const openSignal = () => {
    window.location.href='sgnl://signal.me/#p/+917393928505'
  }



  return (
    <motion.section
      className="relative min-h-screen gradient-romantic flex flex-col items-center justify-center px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
    >
      <AnimatedBackground />

      <motion.div
        className="relative z-10 w-full max-w-lg text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      >
        {!submitted ? (
          <>
            <h1 className="font-display text-4xl md:text-5xl text-cream mb-3">Make a Wish Bebeeeeee 😘</h1>
            <p className="text-cream/60 text-sm md:text-base mb-10 font-light">
              Write something, It can be a wish, a thought, or a note back to me.
            </p>

            <motion.form
              onSubmit={handleSubmit}
              className="glass-card rounded-2xl p-8 text-left relative overflow-hidden"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(248,180,217,0.08)_0%,transparent_70%)] pointer-events-none"
                aria-hidden="true"
              />
              <div className="relative">
                <div
                  className="mx-auto mb-6 w-16 h-16 rounded-2xl border border-pink-soft/30 flex items-center justify-center text-2xl text-pink-soft/80"
                  aria-hidden="true"
                >
                  ✦
                </div>
                <label htmlFor="wish-text" className="block text-sm text-cream/70 mb-2 text-center">
                  Your wish
                </label>
                <textarea
                  id="wish-text"
                  className="input-field min-h-[140px] resize-none text-center font-display text-lg leading-relaxed"
                  placeholder="Bataooo Bataoooo Bubuuuuu..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={1000}
                  disabled={submitting}
                  required
                />
                <p className="text-xs text-cream/40 text-right mt-1">{text.length}/1000</p>
                <ErrorMessage message={error} />
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button type="submit" className="btn-primary flex-1" disabled={submitting || !text.trim()}>
                    {submitting ? 'Sending...' : 'Place in wish box'}
                  </button>
                  {/* { <button
                    type="button"
                    className="btn-ghost flex-1"
                    onClick={handleRestart}
                    disabled={submitting}
                  >
                    Skip
                  </button> } */}
                </div>
              </div>
            </motion.form>
          </>
        ) : (
          <motion.div
            className="glass-card rounded-2xl p-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.div
              className="mx-auto mb-6 w-20 h-20 rounded-2xl border border-pink-soft/40 flex items-center justify-center text-3xl text-pink-soft"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              ♥
            </motion.div>
            <h2 className="font-display text-3xl text-cream mb-3">I Received my Bubuuuu ki Wish! 😋</h2>
            <p className="text-cream/60 text-m mb-3 leading-relaxed">
              Thank you for sharing your wish with me. I&apos;ll try my bestttt to make this come trueee.
            </p>
            <p className="text-cream/60 text-xs mb-8 leading-relaxed">
              You may askkkk 2 more wishes by restarting the Journey again... 👉👈
            </p>


            <button type="button" className="btn-primary" onClick={openSignal}>
              Ab Iss button ko Click Karke Signal par aa jaao
            </button>



            



          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}
