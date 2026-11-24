/**
 * A teacher's mark: a tick for right, a cross for wrong, in the colour of the notice it sits in.
 * Each stroke has a path length of 1, so answerFeedback (lib/motion.ts) can draw it on.
 * The words beside it carry the meaning; this is never the only sign.
 */
export function PenMark({ right, size = 18 }: { right: boolean; size?: number }) {
  return right ? (
    <svg className="pen-tick" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path pathLength={1} d="M4.5 12.5l4.6 4.8L19.5 6.5" />
    </svg>
  ) : (
    <svg className="pen-cross" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden>
      <path pathLength={1} d="M6 6l12 12" />
      <path pathLength={1} d="M18 6L6 18" />
    </svg>
  );
}
