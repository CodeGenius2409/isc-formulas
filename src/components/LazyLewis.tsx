import { Suspense } from 'react';
import { lazyRetry } from '../lib/retry-import';
import { RetryBoundary } from './RetryBoundary';

const Figures = lazyRetry(() => import('./Lewis'));

/** Structures with lone pairs. The drawings and their data load the first time one is needed. */
export function LazyLewis({ ids, scale }: { ids: string[]; scale?: number }) {
  return (
    <RetryBoundary message="Couldn't load this drawing.">
      <Suspense fallback={<div className="structures" aria-hidden />}>
        <Figures ids={ids} scale={scale} />
      </Suspense>
    </RetryBoundary>
  );
}
