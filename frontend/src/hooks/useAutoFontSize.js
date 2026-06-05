import { useLayoutEffect, useState } from 'react';

const MIN_PX = 13;
const MAX_PX = 30;
const LINE_HEIGHT = 1.55;

function measureTextHeight(measureEl, text, width, fontSizePx) {
  measureEl.style.width = `${width}px`;
  measureEl.style.fontSize = `${fontSizePx}px`;
  measureEl.style.lineHeight = String(LINE_HEIGHT);
  measureEl.textContent = text;
  return measureEl.scrollHeight;
}

function calculateFontSize(container, measure, text, maxHeight) {
  const width = container.clientWidth;
  if (width <= 0 || maxHeight <= 0) return null;

  let low = MIN_PX;
  let high = MAX_PX;
  let best = MIN_PX;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const height = measureTextHeight(measure, text, width, mid);
    if (height <= maxHeight) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return best;
}

export function useAutoFontSize({ text, containerRef, measureRef, maxHeight, enabled = true }) {
  const [fontSize, setFontSize] = useState(enabled ? null : MAX_PX);

  useLayoutEffect(() => {
    if (!enabled || !text || !maxHeight || maxHeight <= 0) {
      setFontSize(MAX_PX);
      return undefined;
    }

    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return undefined;

    const update = () => {
      const size = calculateFontSize(container, measure, text, maxHeight);
      if (size !== null) setFontSize(size);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [text, maxHeight, enabled, containerRef, measureRef]);

  return { fontSize, lineHeight: LINE_HEIGHT, ready: !enabled || fontSize !== null };
}
