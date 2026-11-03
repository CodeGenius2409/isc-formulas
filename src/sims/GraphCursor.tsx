import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { describePoint, formatCoord, formatPoint, intersectionPoints, nearestPoint, placeReadout, readCurves, rootPoints, turningPoints, type Curve, type GraphPoint } from './lib/graph-analysis';
import { makeViewport, niceStep, token, useThemeVersion } from './lib/plot';

export interface GraphCursorHandle {
  /** The pointer is over the graph, at these pixels from its corner. */
  point: (px: number, py: number, radius: number) => void;
  /** Moves x = a by a step, from the keyboard. */
  step: (direction: 1 | -1) => void;
  /** Moves to the next or previous named point, from the keyboard. */
  jump: (direction: 1 | -1) => void;
  clear: () => void;
}

interface Reading {
  x: number;
  snapped: GraphPoint | null;
  fromKeyboard: boolean;
}

interface Props {
  view: { x: [number, number]; y: [number, number] };
  curves: Curve[];
}

/**
 * The guide line, markers and readout. It has its own canvas and its own state, so following the pointer
 * redraws only this layer and never the curves underneath.
 */
export const GraphCursor = forwardRef<GraphCursorHandle, Props>(function GraphCursor({ view, curves }, ref) {
  const [reading, setReading] = useState<Reading | null>(null);
  const [spoken, setSpoken] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const theme = useThemeVersion();
  const frame = useRef(0);
  const latest = useRef<(() => void) | null>(null);

  // Worked out when first needed, since panning shouldn't pay for points nobody is reading.
  const cache = useRef<{ curves: Curve[]; x: [number, number]; points: GraphPoint[] } | null>(null);
  const pointsOfInterest = useCallback((): GraphPoint[] => {
    const held = cache.current;
    if (held && held.curves === curves && held.x === view.x) return held.points;
    const [a, b] = view.x;
    const points = [...intersectionPoints(curves, a, b), ...curves.flatMap((c) => [...turningPoints(c, a, b), ...rootPoints(c, a, b)])]
      .filter((p) => p.y >= view.y[0] && p.y <= view.y[1])
      .sort((p, q) => p.x - q.x);
    cache.current = { curves, x: view.x, points };
    return points;
  }, [curves, view]);

  const size = () => {
    const parent = canvasRef.current?.parentElement;
    return parent ? { w: parent.clientWidth, h: parent.clientHeight } : { w: 0, h: 0 };
  };

  useImperativeHandle(
    ref,
    () => ({
      point(px, py, radius) {
        latest.current = () => {
          const { w, h } = size();
          const v = makeViewport(view, w, h);
          if (px < v.left || px > v.right) {
            setReading(null);
            return;
          }
          const snapped = nearestPoint(pointsOfInterest(), v.toPx, v.toPy, px, py, radius);
          setReading({ x: snapped ? snapped.x : v.fromPx(px), snapped, fromKeyboard: false });
        };
        // At most one update a frame, however fast the pointer reports.
        if (!frame.current) {
          frame.current = requestAnimationFrame(() => {
            frame.current = 0;
            latest.current?.();
          });
        }
      },
      step(direction) {
        const stepSize = niceStep(view.x[1] - view.x[0], 100);
        setReading((now) => {
          const from = now?.x ?? Math.round((view.x[0] + view.x[1]) / 2 / stepSize) * stepSize;
          const next = now ? Math.round((from + direction * stepSize) / stepSize) * stepSize : from;
          const x = Math.min(view.x[1], Math.max(view.x[0], next));
          const snapped = pointsOfInterest().find((p) => Math.abs(p.x - x) < stepSize / 2) ?? null;
          return { x: snapped ? snapped.x : x, snapped, fromKeyboard: true };
        });
      },
      jump(direction) {
        setReading((now) => {
          const from = now?.x ?? view.x[0];
          const points = pointsOfInterest();
          const next = direction > 0 ? points.find((p) => p.x > from + 1e-9) : [...points].reverse().find((p) => p.x < from - 1e-9);
          return next ? { x: next.x, snapped: next, fromKeyboard: true } : now;
        });
      },
      clear() {
        latest.current = null;
        setReading(null);
      },
    }),
    [view, pointsOfInterest],
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const values = reading ? readCurves(curves, reading.x) : [];
  const inView = reading && reading.x >= view.x[0] && reading.x <= view.x[1];

  // Draw the guide and markers, then put the readout where it covers none of them.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const { clientWidth: w, clientHeight: h } = parent;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (!reading || !inView) return;
    const v = makeViewport(view, w, h);
    const px = v.toPx(reading.x);
    ctx.save();
    ctx.beginPath();
    ctx.rect(v.left, v.top, v.right - v.left, v.bottom - v.top);
    ctx.clip();
    ctx.strokeStyle = token('ink-2');
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(px, v.top);
    ctx.lineTo(px, v.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    const ys: number[] = [];
    for (const value of values) {
      if (value.y === null) continue;
      const py = v.toPy(value.y);
      ys.push(py);
      ctx.fillStyle = token(value.color);
      ctx.strokeStyle = token('paper');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    if (reading.snapped) {
      ctx.strokeStyle = token('ink');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, v.toPy(reading.snapped.y), 9, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    const box = boxRef.current;
    if (box) {
      const spot = placeReadout({ px, ys, w: box.offsetWidth, h: box.offsetHeight, left: v.left, right: v.right, top: v.top, bottom: v.bottom });
      box.style.left = `${spot.x}px`;
      box.style.top = `${spot.y}px`;
    }
  });

  // Only keyboard moves are spoken, and only once they settle, so holding a key doesn't queue a speech.
  const speech = reading?.fromKeyboard ? [`x = ${formatCoord(reading.x)}.`, reading.snapped ? `${describePoint(reading.snapped)}.` : '', ...values.map((value) => `${value.name}: ${value.y === null ? 'undefined' : formatCoord(value.y)}.`)].filter(Boolean).join(' ') : '';
  useEffect(() => {
    const timer = window.setTimeout(() => setSpoken(speech), 250);
    return () => window.clearTimeout(timer);
  }, [speech]);

  void theme;

  return (
    <>
      <canvas ref={canvasRef} className="plot-overlay" aria-hidden="true" />
      {reading && inView && (
        <div ref={boxRef} className="plot-readout" data-testid="plot-readout">
          {reading.snapped && <div className="plot-readout-head">{describePoint(reading.snapped)}</div>}
          {values.map((value) => (
            <div key={value.name} style={{ color: `var(--${value.color})` }}>
              {value.y === null ? `${value.name}(x): undefined at x = ${formatCoord(reading.x)}` : `${value.name}(x): ${formatPoint(reading.x, value.y)}`}
            </div>
          ))}
        </div>
      )}
      <div className="sr-only" aria-live="polite" data-testid="plot-spoken">
        {spoken}
      </div>
    </>
  );
});
