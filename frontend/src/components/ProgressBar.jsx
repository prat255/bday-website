import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const percent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-purple-deep/80">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-mid to-pink-soft"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <p className="text-center text-xs text-cream/50 mt-3 tracking-widest uppercase">
        Memory {current} of {total}
      </p>
    </div>
  );
}
