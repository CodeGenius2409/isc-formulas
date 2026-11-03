import { lazy, Suspense } from 'react';

const Figures = lazy(() => import('./Lewis'));

/** Structures with lone pairs. The drawings and their data load the first time one is needed. */
export function LazyLewis({ ids, scale }: { ids: string[]; scale?: number }) {
  return (
    <Suspense fallback={<div className="structures" aria-hidden />}>
      <Figures ids={ids} scale={scale} />
    </Suspense>
  );
}
