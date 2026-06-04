import { motion } from 'framer-motion';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16" role="status" aria-live="polite">
      <motion.div
        className="h-10 w-10 rounded-full border-2 border-pink-soft/30 border-t-pink-soft"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />
      <p className="text-sm text-cream/70 tracking-wide">{label}</p>
    </div>
  );
}
