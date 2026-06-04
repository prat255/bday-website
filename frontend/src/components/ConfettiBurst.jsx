import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiBurst({ active }) {
  useEffect(() => {
    if (!active) return;

    const duration = 4000;
    const end = Date.now() + duration;
    const colors = ['#f8b4d9', '#e8a0c8', '#2d1b4e', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.55 },
      colors,
    });
    frame();

    return () => {};
  }, [active]);

  return null;
}
