import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import ProgressBar from '../components/ProgressBar';
import MemorySlide from '../components/MemorySlide';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { fetchMemories } from '../services/api';

export default function JourneyPage() {
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMemories();
        if (!cancelled) setMemories(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load memories');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const goNext = useCallback(() => {
    if (index >= memories.length - 1) {
      navigate('/message');
      return;
    }
    setDirection(1);
    setIndex((i) => i + 1);
  }, [index, memories.length, navigate]);

  const goPrev = useCallback(() => {
    if (index <= 0) return;
    setDirection(-1);
    setIndex((i) => i - 1);
  }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-romantic flex items-center justify-center">
        <LoadingSpinner label="Preparing your journey..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-romantic flex flex-col items-center justify-center px-4">
        <ErrorMessage message={error} />
        <button type="button" className="btn-ghost mt-6" onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  if (!memories.length) {
    return (
      <div className="min-h-screen gradient-romantic flex items-center justify-center px-4">
        <EmptyState
          title="No memories yet"
          description="The journey will begin once memories are added from the admin dashboard."
        />
      </div>
    );
  }

  const memory = memories[index];
  const layoutKey = `${memory.id}-${index}`;

  return (
    <section className="relative min-h-screen gradient-romantic pt-16 pb-24">
      <AnimatedBackground showHearts={false} />
      <ProgressBar current={index + 1} total={memories.length} />

      <div className="relative z-10 max-w-7xl mx-auto pt-12">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={layoutKey}
            custom={direction}
            initial={{ opacity: 0, y: direction >= 0 ? 20 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction >= 0 ? -20 : 20 }}
            transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
          >
            <MemorySlide memory={memory} index={index} layoutKey={layoutKey} />
          </motion.div>
        </AnimatePresence>

        <nav
          className="flex justify-center gap-4 mt-14 px-4"
          aria-label="Memory navigation"
        >
          <button
            type="button"
            className="btn-ghost"
            onClick={goPrev}
            disabled={index === 0}
            aria-label="Previous memory"
          >
            Previous
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={goNext}
            aria-label={index >= memories.length - 1 ? 'Finish journey' : 'Next memory'}
          >
            {index >= memories.length - 1 ? 'Finish' : 'Next'}
          </button>
        </nav>
      </div>
    </section>
  );
}
