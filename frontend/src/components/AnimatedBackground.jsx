import { motion } from 'framer-motion';
import { useMemo } from 'react';

function Particle({ style, delay }) {
  return (
    <motion.span
      className="absolute rounded-full bg-pink-soft/20"
      style={style}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.6, 0.2],
      }}
      transition={{
        duration: 6 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      aria-hidden="true"
    />
  );
}

function Heart({ style, delay }) {
  return (
    <motion.span
      className="absolute text-pink-soft/25 text-lg select-none"
      style={style}
      animate={{
        y: [0, -40, 0],
        x: [0, 8, 0],
        opacity: [0.15, 0.45, 0.15],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      aria-hidden="true"
    >
      ♥
    </motion.span>
  );
}

export default function AnimatedBackground({ showHearts = true }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${4 + Math.random() * 6}px`,
          height: `${4 + Math.random() * 6}px`,
        },
        delay: Math.random() * 4,
      })),
    []
  );

  const hearts = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        },
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <Particle key={p.id} style={p.style} delay={p.delay} />
      ))}
      {showHearts &&
        hearts.map((h) => (
          <Heart key={h.id} style={h.style} delay={h.delay} />
        ))}
    </div>
  );
}
