import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';

export default function MemoryTypewriter({ text, layoutKey }) {
  return (
    <motion.div
      key={`text-${layoutKey}`}
      className="max-w-lg"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="font-display text-xl md:text-2xl lg:text-3xl leading-relaxed text-cream/95 [&_.Typewriter__wrapper]:inline">
        <Typewriter
          onInit={(typewriter) => {
            const chars = text.split('');
            chars.forEach((char) => {
              typewriter.typeString(char);
              if (/[.!?,:;]/.test(char)) {
                typewriter.pauseFor(280);
              }
            });
            typewriter.start();
          }}
          options={{
            loop: false,
            delay: 42,
            cursor: '',
            autoStart: false,
          }}
        />
      </div>
    </motion.div>
  );
}
