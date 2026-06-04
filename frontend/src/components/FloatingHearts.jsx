import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function FloatingHearts({ count = 16 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        size: 14 + Math.random() * 20,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 4,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10" aria-hidden="true">
      {items.map((item) => (
        <motion.span
          key={item.id}
          className="absolute text-pink-soft/40"
          style={{ left: item.left, bottom: '-10%', fontSize: item.size }}
          animate={{ y: [0, -window.innerHeight - 100], opacity: [0, 0.7, 0] }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeOut',
          }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}
