import MemoryImage from './MemoryImage';
import MemoryTypewriter from './MemoryTypewriter';

export default function MemorySlide({ memory, index, layoutKey }) {
  const imageOnLeft = index % 2 === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center w-full max-w-6xl mx-auto px-4">
      <div
        className={`order-1 ${imageOnLeft ? 'md:order-1' : 'md:order-2'}`}
      >
        <MemoryImage src={memory.image} fromLeft={imageOnLeft} layoutKey={layoutKey} />
      </div>
      <div
        className={`order-2 flex items-center ${imageOnLeft ? 'md:order-2 md:justify-start' : 'md:order-1 md:justify-end'}`}
      >
        <MemoryTypewriter text={memory.text} layoutKey={layoutKey} />
      </div>
    </div>
  );
}
