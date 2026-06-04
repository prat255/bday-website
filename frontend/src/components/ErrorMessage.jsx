import { motion } from 'framer-motion';

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="text-sm text-red-400 text-center mt-2"
      role="alert"
    >
      {message}
    </motion.p>
  );
}
