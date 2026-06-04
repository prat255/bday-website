import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingHearts from '../components/FloatingHearts';
import ConfettiBurst from '../components/ConfettiBurst';
import { useJourneyAccess } from '../hooks/useJourneyAccess';

const BIRTHDAY_MESSAGE =
  'On this beautiful day, I want you to know how deeply loved, cherished, and celebrated you are. Every moment with you is a gift.';

export default function FinalePage() {
  const navigate = useNavigate();
  const { lock } = useJourneyAccess();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowConfetti(true), 600);
    const t2 = setTimeout(() => setShowThanks(true), 5500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleRestart = () => {
    lock();
    navigate('/');
  };

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
        <h1 className="font-display text-5xl md:text-7xl text-cream mb-10">
          Happy Birthday ❤️
        </h1>

        <div className="font-display text-lg md:text-xl text-cream/90 leading-relaxed min-h-[120px] mb-10">
          <Typewriter
            onInit={(typewriter) => {
              const chars = BIRTHDAY_MESSAGE.split('');
              chars.forEach((char) => {
                typewriter.typeString(char);
                if (/[.!?]/.test(char)) typewriter.pauseFor(400);
              });
              typewriter.start();
            }}
            options={{ loop: false, delay: 45, cursor: '', autoStart: false }}
          />
        </div>

        <motion.p
          className="text-cream/75 text-base md:text-lg mb-10 font-light"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: showThanks ? 1 : 0, y: showThanks ? 0 : 12 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        >
          Thank you for being part of my life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showThanks ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button type="button" className="btn-primary" onClick={handleRestart}>
            Restart Journey
          </button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
