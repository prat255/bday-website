import { motion } from 'framer-motion';
import { imageUrl } from '../services/api';

export default function MemoryImage({ src, fromLeft = true, layoutKey }) {
  const x = fromLeft ? -50 : 50;

  return (
    <motion.div
      key={`img-${layoutKey}`}
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
      initial={{ opacity: 0, x, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      <img
        src={imageUrl(src)}
        alt="A cherished memory"
        className="w-full h-auto max-h-[420px] md:max-h-[480px] object-cover object-center"
        loading="lazy"
      />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-pink-soft/10 pointer-events-none" />
    </motion.div>
  );
}
