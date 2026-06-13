import { useRef } from 'react';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { useAutoFontSize } from '../hooks/useAutoFontSize';

export default function MemoryTypewriter({ text, layoutKey, maxHeight, fitToHeight = false }) {
  const containerRef = useRef(null);
  const measureRef = useRef(null);

  const { fontSize, lineHeight, ready } = useAutoFontSize({
    text,
    containerRef,
    measureRef,
    maxHeight,
    enabled: fitToHeight && Boolean(maxHeight),
  });

  const constrained = fitToHeight && maxHeight;
  const textStyle = constrained
    ? { fontSize: `${fontSize}px`, lineHeight }
    : undefined;

  return (
    <motion.div
      key={`text-wrap-${layoutKey}`}
      ref={containerRef}
      className="relative w-full max-w-lg"
      style={constrained ? { maxHeight, height: maxHeight, overflow: 'hidden' } : undefined}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        ref={measureRef}
        className="font-display pointer-events-none absolute opacity-0 invisible"
        aria-hidden="true"
      />

      <div
        className={`font-display text-cream/95 [&_.Typewriter__wrapper]:inline ${
          constrained ? 'flex h-full items-center' : 'text-xl md:text-2xl lg:text-3xl leading-relaxed'
        }`}
        style={textStyle}
      >
        {ready ? (
          <Typewriter
            key={`${layoutKey}-${fontSize}`}
            onInit={(typewriter) => {
              text.split('').forEach((char) => {
	
		if (char == "\n"){
			typewriter.typeString('<br/>')
		} else {
			typewriter.typeString(char);
		}

                //typewriter.typeString(char);
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
        ) : null}
      </div>
    </motion.div>
  );
}
