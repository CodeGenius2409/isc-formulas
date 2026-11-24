import '../styles/motion-later.css';

/**
 * Calm progress for a download: a 4 px red-pen line that eases forward as bytes arrive, or, before
 * the size is known, a short stroke that travels along it. Only the stroke's transform moves.
 */
export function LoadBar({ share, label, className = '' }: { share: number | null | undefined; label: string; className?: string }) {
  const known = typeof share === 'number';
  return (
    <div className={`load-bar ${className}`} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={known ? Math.round(share) : undefined}>
      <span data-unknown={!known || undefined} style={known ? { transform: `scaleX(${Math.max(0, Math.min(100, share)) / 100})` } : undefined} />
    </div>
  );
}
