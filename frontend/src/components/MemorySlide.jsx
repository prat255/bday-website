import { useEffect, useRef, useState } from 'react';
import MemoryImage from './MemoryImage';
import MemoryTypewriter from './MemoryTypewriter';

export default function MemorySlide({ memory, index, layoutKey }) {
  const imageOnLeft = index % 2 === 0;
  const imageWrapRef = useRef(null);
  const [imageHeight, setImageHeight] = useState(null);

  useEffect(() => {
    const node = imageWrapRef.current;
    if (!node) return;

    const update = () => setImageHeight(node.offsetHeight);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [layoutKey, memory.image]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center w-full max-w-6xl mx-auto px-4">
      <div
        ref={imageWrapRef}
        className={`order-1 ${imageOnLeft ? 'md:order-1' : 'md:order-2'}`}
      >
        <MemoryImage src={memory.image} fromLeft={imageOnLeft} layoutKey={layoutKey} />
      </div>
      <div
        className={`order-2 flex items-center w-full ${
          imageOnLeft ? 'md:order-2 md:justify-start' : 'md:order-1 md:justify-end'
        }`}
        style={imageHeight ? { height: imageHeight } : undefined}
      >
        {imageHeight ? (
          <MemoryTypewriter
            text={memory.text}
            layoutKey={layoutKey}
            maxHeight={imageHeight}
            fitToHeight
          />
        ) : (
          <div className="w-full max-w-lg" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
