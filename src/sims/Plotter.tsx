import { useCallback, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Maximize, Minus, Plus, Trash2 } from 'lucide-react';
import { evaluate, ExprError, parseExpr, symbolsIn } from '../solver/expr';
import { derivative, integrate, intersections, roots } from './lib/calculus';
import { Canvas, drawPlot, makeViewport, type Marker, type PlotModel, type Series } from './lib/plot';
import { fmt, Legend, Slider, Toggle, ToolLayout } from './lib/ui';

const COLOURS = ['physics', 'accent', 'chemistry', 'mathematics', 'computerscience'];

interface FnRow {
  id: number;
  source: string;
}

interface Compiled {
  row: FnRow;
  fn: ((x: number) => number) | null;
  error?: string;
  color: string;
}

function compile(row: FnRow, color: string): Compiled {
  if (!row.source.trim()) return { row, fn: null, color };
  try {
    const expr = parseExpr(row.source);
    const unknown = [...symbolsIn(expr)].filter((s) => s !== 'x' && s !== 'e');
    if (unknown.length) return { row, fn: null, color, error: `Use only x here. "${unknown[0]}" has no value.` };
    return {
      row,
      color,
      fn: (x) => {
        try {
          return evaluate(expr, { x });
        } catch {
          return NaN;
        }
      },
    };
  } catch (err) {
    return { row, fn: null, color, error: err instanceof ExprError ? err.message : 'That expression could not be read.' };
  }
}

const DEFAULT_VIEW = { x: [-10, 10] as [number, number], y: [-6, 6] as [number, number] };

export function Plotter() {
  const [rows, setRows] = useState<FnRow[]>([
    { id: 1, source: 'sin(x)' },
    { id: 2, source: 'x^2/4 - 1' },
  ]);
  const nextId = useRef(3);
  const [view, setView] = useState(DEFAULT_VIEW);
  const [showDerivative, setShowDerivative] = useState(false);
  const [showTangent, setShowTangent] = useState(true);
  const [x0, setX0] = useState(1);
  const [showArea, setShowArea] = useState(false);
  const [areaA, setAreaA] = useState(0);
  const [areaB, setAreaB] = useState(3);
  const [showCrossings, setShowCrossings] = useState(true);
  const size = useRef({ w: 800, h: 400 });
  const drag = useRef<{ pointer: number; x: number; y: number; view: typeof view } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; view: typeof view } | null>(null);

  const compiled = useMemo(() => rows.map((row, i) => compile(row, COLOURS[i % COLOURS.length])), [rows]);
  const active = compiled.filter((c): c is Compiled & { fn: (x: number) => number } => c.fn !== null);
  const first = active[0];

  const crossings = useMemo(() => {
    const out: { x: number; y: number; label: string }[] = [];
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        for (const x of intersections(active[i].fn, active[j].fn, view.x[0], view.x[1])) out.push({ x, y: active[i].fn(x), label: `f${i + 1} = f${j + 1}` });
      }
    }
    return out;
  }, [active, view.x]);

  const zeros = useMemo(() => (first ? roots(first.fn, view.x[0], view.x[1]) : []), [first, view.x]);

  const slope = first ? derivative(first.fn, x0) : NaN;
  const y0 = first ? first.fn(x0) : NaN;
  const area = first && showArea ? integrate(first.fn, Math.min(areaA, areaB), Math.max(areaA, areaB)) * (areaA <= areaB ? 1 : -1) : NaN;

  const series: Series[] = active.map((c) => ({ fn: c.fn, color: c.color }));
  if (first && showDerivative) series.push({ fn: (x) => derivative(first.fn, x), color: first.color, dash: true, width: 1.5 });
  if (first && showTangent && Number.isFinite(slope)) series.push({ fn: (x) => y0 + slope * (x - x0), color: 'ink-2', width: 1 });

  const markers: Marker[] = [];
  if (first && showTangent && Number.isFinite(y0)) markers.push({ x: x0, y: y0, color: 'ink', label: `slope ${fmt(slope, 3)}` });
  if (showCrossings) crossings.forEach((c) => markers.push({ x: c.x, y: c.y, color: 'accent' }));

  const model: PlotModel = {
    x: view.x,
    y: view.y,
    series,
    markers,
    area: first && showArea ? { fn: first.fn, a: Math.min(areaA, areaB), b: Math.max(areaA, areaB), color: first.color } : undefined,
    xLabel: 'x',
    yLabel: 'y',
  };

  const zoom = useCallback((factor: number, cx?: number, cy?: number) => {
    setView((v) => {
      const mx = cx ?? (v.x[0] + v.x[1]) / 2;
      const my = cy ?? (v.y[0] + v.y[1]) / 2;
      return {
        x: [mx + (v.x[0] - mx) * factor, mx + (v.x[1] - mx) * factor],
        y: [my + (v.y[0] - my) * factor, my + (v.y[1] - my) * factor],
      };
    });
  }, []);

  const pan = useCallback((fx: number, fy: number) => {
    setView((v) => {
      const dx = (v.x[1] - v.x[0]) * fx;
      const dy = (v.y[1] - v.y[0]) * fy;
      return { x: [v.x[0] + dx, v.x[1] + dx], y: [v.y[0] + dy, v.y[1] + dy] };
    });
  }, []);

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setView((v) => {
        const vp = makeViewport(v, rect.width, rect.height);
        const mx = vp.fromPx(e.clientX - rect.left);
        const my = vp.fromPy(e.clientY - rect.top);
        const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15;
        return {
          x: [mx + (v.x[0] - mx) * factor, mx + (v.x[1] - mx) * factor],
          y: [my + (v.y[0] - my) * factor, my + (v.y[1] - my) * factor],
        };
      });
    },
    [],
  );

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), view };
      drag.current = null;
    } else {
      drag.current = { pointer: e.pointerId, x: e.clientX, y: e.clientY, view };
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const rect = e.currentTarget.getBoundingClientRect();
    size.current = { w: rect.width, h: rect.height };
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const factor = pinch.current.dist / Math.max(Math.hypot(a.x - b.x, a.y - b.y), 1);
      const start = pinch.current.view;
      const mx = (start.x[0] + start.x[1]) / 2;
      const my = (start.y[0] + start.y[1]) / 2;
      setView({ x: [mx + (start.x[0] - mx) * factor, mx + (start.x[1] - mx) * factor], y: [my + (start.y[0] - my) * factor, my + (start.y[1] - my) * factor] });
      return;
    }
    if (!drag.current || drag.current.pointer !== e.pointerId) return;
    const { view: start } = drag.current;
    const vp = makeViewport(start, rect.width, rect.height);
    const dx = ((e.clientX - drag.current.x) / (vp.right - vp.left)) * (start.x[1] - start.x[0]);
    const dy = ((e.clientY - drag.current.y) / (vp.bottom - vp.top)) * (start.y[1] - start.y[0]);
    setView({ x: [start.x[0] - dx, start.x[1] - dx], y: [start.y[0] + dy, start.y[1] + dy] });
  };

  // Every way a pointer can end must clear its state, or the next drag starts wrong.
  const endPointer = (e: PointerEvent<HTMLCanvasElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (drag.current?.pointer === e.pointerId) drag.current = null;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, () => void> = {
      ArrowLeft: () => pan(-0.1, 0),
      ArrowRight: () => pan(0.1, 0),
      ArrowUp: () => pan(0, 0.1),
      ArrowDown: () => pan(0, -0.1),
      '+': () => zoom(1 / 1.2),
      '=': () => zoom(1 / 1.2),
      '-': () => zoom(1.2),
      '0': () => setView(DEFAULT_VIEW),
    };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      move();
    }
  };

  const spanX = view.x[1] - view.x[0];

  return (
    <ToolLayout
      controls={
        <>
          <fieldset className="m-0 border-0 p-0">
            <legend className="lbl">Functions of x</legend>
            {compiled.map((c, i) => (
              <div key={c.row.id} className="mb-1">
                <div className="flex items-center gap-1">
                  <span aria-hidden className="num w-7 flex-none text-step--1" style={{ color: `var(--${c.color})` }}>
                    f{i + 1}
                  </span>
                  <input
                    className="field num"
                    aria-label={`Function ${i + 1}`}
                    autoComplete="off"
                    spellCheck={false}
                    value={c.row.source}
                    aria-invalid={Boolean(c.error)}
                    onChange={(e) => setRows((list) => list.map((r) => (r.id === c.row.id ? { ...r, source: e.target.value } : r)))}
                  />
                  <button type="button" className="btn btn-quiet flex-none" aria-label={`Remove function ${i + 1}`} disabled={rows.length === 1} onClick={() => setRows((list) => list.filter((r) => r.id !== c.row.id))}>
                    <Trash2 size={15} aria-hidden />
                  </button>
                </div>
                {c.error && (
                  <p className="var-warn mt-1" role="alert">
                    {c.error}
                  </p>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-line mt-1" disabled={rows.length >= 5} onClick={() => setRows((list) => [...list, { id: nextId.current++, source: '' }])}>
              <Plus size={15} aria-hidden /> Add a function
            </button>
          </fieldset>

          <Toggle label="Show f1's derivative" checked={showDerivative} onChange={setShowDerivative} />
          <Toggle label="Tangent to f1" checked={showTangent} onChange={setShowTangent} />
          {showTangent && <Slider label="Tangent at x" value={Math.min(Math.max(x0, view.x[0]), view.x[1])} min={view.x[0]} max={view.x[1]} step={spanX / 400} format={(v) => v.toFixed(2)} onChange={setX0} />}
          <Toggle label="Area under f1" checked={showArea} onChange={setShowArea} />
          {showArea && (
            <>
              <Slider label="From a" value={areaA} min={view.x[0]} max={view.x[1]} step={spanX / 400} format={(v) => v.toFixed(2)} onChange={setAreaA} />
              <Slider label="To b" value={areaB} min={view.x[0]} max={view.x[1]} step={spanX / 400} format={(v) => v.toFixed(2)} onChange={setAreaB} />
            </>
          )}
          <Toggle label="Mark intersections" checked={showCrossings} onChange={setShowCrossings} />

          <dl className="readouts" aria-live="polite">
            {first && showTangent && (
              <>
                <dt>f1({x0.toFixed(2)})</dt>
                <dd>{fmt(y0)}</dd>
                <dt>Slope there</dt>
                <dd>{fmt(slope)}</dd>
              </>
            )}
            {first && showArea && (
              <>
                <dt>Signed area</dt>
                <dd>{fmt(area)}</dd>
              </>
            )}
            {first && (
              <>
                <dt>Roots of f1 in view</dt>
                <dd>{zeros.length ? zeros.slice(0, 5).map((z) => fmt(z, 3)).join(', ') : 'none'}</dd>
              </>
            )}
            {showCrossings && active.length > 1 && (
              <>
                <dt>Intersections</dt>
                <dd>{crossings.length ? crossings.slice(0, 5).map((c) => `(${fmt(c.x, 3)}, ${fmt(c.y, 3)})`).join(' ') : 'none in view'}</dd>
              </>
            )}
          </dl>
        </>
      }
    >
      <Canvas
        interactive
        height={420}
        label="Graph of the functions listed. Drag to pan, scroll or pinch to zoom. With the keyboard, arrow keys pan, plus and minus zoom, and zero resets."
        draw={(ctx, w, h) => drawPlot(ctx, w, h, model)}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onKeyDown={onKeyDown}
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-line" aria-label="Zoom in" onClick={() => zoom(1 / 1.3)}>
          <Plus size={16} aria-hidden />
        </button>
        <button type="button" className="btn btn-line" aria-label="Zoom out" onClick={() => zoom(1.3)}>
          <Minus size={16} aria-hidden />
        </button>
        <button type="button" className="btn btn-line" onClick={() => setView(DEFAULT_VIEW)}>
          <Maximize size={15} aria-hidden /> Reset view
        </button>
        <span className="text-step--1 text-ink-2">Drag to move. Scroll or pinch to zoom.</span>
      </div>
      <Legend items={[...active.map((c) => ({ label: c.row.source, color: c.color })), ...(first && showDerivative ? [{ label: "f1'(x)", color: first.color, dash: true }] : [])]} />
      <p className="mt-2 text-step--1 text-ink-2">
        Write functions as <code>sin(x)</code>, <code>x^2 + 3*x</code>, <code>exp(-x)</code>, <code>log(x)</code> (natural), <code>log10(x)</code>, <code>sqrt(x)</code>, <code>abs(x)</code> or <code>pi*x</code>.
      </p>
    </ToolLayout>
  );
}
