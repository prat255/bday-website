import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingHearts from '../components/FloatingHearts';
import ConfettiBurst from '../components/ConfettiBurst';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { fetchMessage } from '../services/api';
import { useJourneyAccess } from '../hooks/useJourneyAccess';

const FALLBACK = {
  heading: 'Happy Birthday ❤️',
  message:
    'On this beautiful day, I want you to know how deeply loved, cherished, and celebrated you are. Every moment with you is a gift.',
  thanksMessage: 'Thank you for being part of my life.',
};

function MessageTypewriter({ text }) {
  return (
    <Typewriter
      key={text}
      onInit={(typewriter) => {
        text.split('').forEach((char) => {
          typewriter.typeString(char);
          if (/[.!?]/.test(char)) typewriter.pauseFor(400);
        });
        typewriter.start();
      }}
      options={{ loop: false, delay: 45, cursor: '', autoStart: false }}
    />
  );
}

export default function MessagePage() {
  const navigate = useNavigate();
  const { lock } = useJourneyAccess();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMessage();
        if (!cancelled) setContent(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load message');
          setContent(FALLBACK);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!content || loading) return;
    const t1 = setTimeout(() => setShowConfetti(true), 600);
    const t2 = setTimeout(() => setShowThanks(true), 5500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [content, loading]);

  const handleRestart = () => {
    lock();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-romantic flex items-center justify-center">
        <LoadingSpinner label="Preparing your surprise..." />
      </div>
    );
  }

  const message = content || FALLBACK;

  return (
    <motion.section
      className="relative min-h-screen gradient-romantic flex flex-col items-center justify-center px-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(248,180,217,0.15)_0%,transparent_60%)]"
        aria-hidden="true"
      />
      <AnimatedBackground />
      <FloatingHearts />
      <ConfettiBurst active={showConfetti} />

      <motion.div
        className="relative z-20 text-center max-w-2xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <h1 className="font-display text-5xl md:text-7xl text-cream mb-10">{message.heading}</h1>

        <div className="font-display text-lg md:text-xl text-cream/90 leading-relaxed min-h-[120px] mb-10">
          <MessageTypewriter text={message.message} />
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        <motion.p
          className="text-cream/75 text-base md:text-lg mb-10 font-light"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: showThanks ? 1 : 0, y: showThanks ? 0 : 12 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        >
          {message.thanksMessage}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: showThanks ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button type="button" className="btn-primary" onClick={() => navigate('/wish')}>
            Make a Wish
          </button>
          {/* <button type="button" className="btn-ghost" onClick={handleRestart}>
            Restart Journey
          </button> */}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
