export default function EmptyState({ title, description }) {
  return (
    <div className="text-center py-16 px-6 glass-card rounded-2xl max-w-md mx-auto">
      <p className="font-display text-2xl text-pink-soft mb-2">{title}</p>
      <p className="text-cream/60 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
