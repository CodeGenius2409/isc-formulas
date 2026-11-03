// A small canvas plotting layer, bundled with the app. It reads colours from the
// design tokens at draw time, so plots follow the theme.
import { useCallback, useEffect, useLayoutEffect, useRef, useSyncExternalStore, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

const themeListeners = new Set<() => void>();
let themeVersion = 0;

if (typeof MutationObserver !== 'undefined') {
  new MutationObserver(() => {
    themeVersion++;
    themeListeners.forEach((l) => l());
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-contrast'] });
}

export function useThemeVersion(): number {
  return useSyncExternalStore(
    (l) => {
      themeListeners.add(l);
      return () => themeListeners.delete(l);
    },
    () => themeVersion,
  );
}

/** Reads a design token, for drawing on a canvas. */
export function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}

export type DrawFn = (ctx: CanvasRenderingContext2D, width: number, height: number) => void;

interface CanvasProps {
  draw: DrawFn;
  height?: number;
  label: string;
  className?: string;
  style?: CSSProperties;
  onPointerDown?: (e: ReactPointerEvent<HTMLCanvasElement>) => void;
  onPointerMove?: (e: ReactPointerEvent<HTMLCanvasElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLCanvasElement>) => void;
  onPointerCancel?: (e: ReactPointerEvent<HTMLCanvasElement>) => void;
  onPointerLeave?: (e: ReactPointerEvent<HTMLCanvasElement>) => void;
  onBlur?: () => void;
  onWheel?: (e: WheelEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  /** Interactive plots take focus and capture drags. Others let the page scroll. */
  interactive?: boolean;
  children?: ReactNode;
}

/** A canvas that redraws on resize and theme change, sharp on high-density screens. */
export function Canvas({ draw, height = 280, label, className = '', style, interactive, onWheel, onKeyDown, onBlur, children, ...pointer }: CanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const theme = useThemeVersion();

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const width = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (!width || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(h * dpr);
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, h);
    drawRef.current(ctx, width, h);
  }, []);

  useLayoutEffect(paint);
  useEffect(paint, [theme, paint]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(paint);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [paint]);

  // React attaches wheel listeners as passive, and zooming must prevent page scroll.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onWheel) return undefined;
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  return (
    <div ref={wrapRef} className={`plot ${interactive ? '' : 'scrollable'} ${className}`} style={{ height, ...style }} tabIndex={interactive ? 0 : undefined} onKeyDown={onKeyDown} onBlur={onBlur}>
      <canvas ref={canvasRef} role="img" aria-label={label} {...pointer} />
      {children}
    </div>
  );
}

export interface Series {
  fn?: (x: number) => number;
  points?: [number, number][];
  /** A token name, such as "physics" or "accent". */
  color: string;
  dash?: boolean;
  width?: number;
  label?: string;
}

export interface Marker {
  x: number;
  y: number;
  color?: string;
  label?: string;
}

export interface PlotModel {
  x: [number, number];
  y: [number, number];
  series?: Series[];
  markers?: Marker[];
  /** Horizontal bands, such as an indicator's colour-change range. */
  bands?: { y0: number; y1: number; color: string; label?: string }[];
  vlines?: { x: number; label?: string; color?: string }[];
  /** Shades between a curve and the axis, from a to b. */
  area?: { fn: (x: number) => number; a: number; b: number; color: string };
  xLabel?: string;
  yLabel?: string;
}

const MARGIN = { left: 52, right: 14, top: 12, bottom: 38 };

export function niceStep(span: number, targetTicks: number): number {
  const raw = span / Math.max(targetTicks, 1);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  return (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
}

export function formatTick(v: number, step: number): string {
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 1e5 || abs < 1e-3) return v.toExponential(1).replace('e+', 'e');
  const decimals = Math.max(0, Math.min(6, -Math.floor(Math.log10(step) + 1e-9)));
  return v.toFixed(decimals);
}

export interface Viewport {
  toPx: (x: number) => number;
  toPy: (y: number) => number;
  fromPx: (px: number) => number;
  fromPy: (py: number) => number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function makeViewport(model: Pick<PlotModel, 'x' | 'y'>, width: number, height: number): Viewport {
  const left = MARGIN.left;
  const right = width - MARGIN.right;
  const top = MARGIN.top;
  const bottom = height - MARGIN.bottom;
  const [x0, x1] = model.x;
  const [y0, y1] = model.y;
  return {
    left,
    right,
    top,
    bottom,
    toPx: (x) => left + ((x - x0) / (x1 - x0)) * (right - left),
    toPy: (y) => bottom - ((y - y0) / (y1 - y0)) * (bottom - top),
    fromPx: (px) => x0 + ((px - left) / (right - left)) * (x1 - x0),
    fromPy: (py) => y0 + ((bottom - py) / (bottom - top)) * (y1 - y0),
  };
}

const MONO = "12px 'Atkinson Hyperlegible Mono Variable', ui-monospace, monospace";
const BODY = "13px 'Atkinson Hyperlegible Next Variable', system-ui, sans-serif";

/** Draws axes, grid and everything in the model. */
export function drawPlot(ctx: CanvasRenderingContext2D, width: number, height: number, model: PlotModel): Viewport {
  const v = makeViewport(model, width, height);
  const grid = token('plot-grid');
  const ink = token('ink');
  const ink2 = token('ink-2');
  const [x0, x1] = model.x;
  const [y0, y1] = model.y;

  ctx.save();
  ctx.lineWidth = 1;
  ctx.font = MONO;
  ctx.fillStyle = ink2;

  const xStep = niceStep(x1 - x0, Math.max(3, (v.right - v.left) / 70));
  const yStep = niceStep(y1 - y0, Math.max(3, (v.bottom - v.top) / 40));

  ctx.strokeStyle = grid;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let x = Math.ceil(x0 / xStep) * xStep; x <= x1 + xStep * 1e-6; x += xStep) {
    const px = Math.round(v.toPx(x)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(px, v.top);
    ctx.lineTo(px, v.bottom);
    ctx.stroke();
    ctx.fillText(formatTick(x, xStep), px, v.bottom + 5);
  }
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let y = Math.ceil(y0 / yStep) * yStep; y <= y1 + yStep * 1e-6; y += yStep) {
    const py = Math.round(v.toPy(y)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(v.left, py);
    ctx.lineTo(v.right, py);
    ctx.stroke();
    ctx.fillText(formatTick(y, yStep), v.left - 6, py);
  }

  // Keep everything inside the plot area.
  ctx.save();
  ctx.beginPath();
  ctx.rect(v.left, v.top, v.right - v.left, v.bottom - v.top);
  ctx.clip();

  for (const band of model.bands ?? []) {
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = band.color;
    ctx.fillRect(v.left, v.toPy(band.y1), v.right - v.left, v.toPy(band.y0) - v.toPy(band.y1));
    ctx.globalAlpha = 1;
  }

  // Zero lines are stronger than the grid.
  ctx.strokeStyle = token('rule-2');
  if (x0 < 0 && x1 > 0) {
    ctx.beginPath();
    ctx.moveTo(v.toPx(0), v.top);
    ctx.lineTo(v.toPx(0), v.bottom);
    ctx.stroke();
  }
  if (y0 < 0 && y1 > 0) {
    ctx.beginPath();
    ctx.moveTo(v.left, v.toPy(0));
    ctx.lineTo(v.right, v.toPy(0));
    ctx.stroke();
  }

  if (model.area) {
    const { fn, a, b, color } = model.area;
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = token(color);
    ctx.beginPath();
    ctx.moveTo(v.toPx(a), v.toPy(0));
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const x = a + ((b - a) * i) / steps;
      const y = fn(x);
      if (Number.isFinite(y)) ctx.lineTo(v.toPx(x), v.toPy(y));
    }
    ctx.lineTo(v.toPx(b), v.toPy(0));
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  for (const line of model.vlines ?? []) {
    ctx.strokeStyle = token(line.color ?? 'ink-3');
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(v.toPx(line.x), v.top);
    ctx.lineTo(v.toPx(line.x), v.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  for (const s of model.series ?? []) {
    ctx.strokeStyle = token(s.color);
    ctx.lineWidth = s.width ?? 2;
    ctx.setLineDash(s.dash ? [6, 4] : []);
    ctx.lineJoin = 'round';
    ctx.beginPath();
    let pen = false;
    if (s.fn) {
      const span = y1 - y0;
      let last = NaN;
      for (let px = v.left; px <= v.right; px += 1) {
        const y = s.fn(v.fromPx(px));
        // A jump across most of the view is an asymptote, not part of the curve.
        const broken = !Number.isFinite(y) || (Number.isFinite(last) && Math.abs(y - last) > span * 2);
        if (broken) pen = false;
        if (Number.isFinite(y)) {
          const py = Math.max(-1e5, Math.min(1e5, v.toPy(y)));
          if (pen) ctx.lineTo(px, py);
          else ctx.moveTo(px, py);
          pen = true;
        }
        last = y;
      }
    } else if (s.points) {
      for (const [x, y] of s.points) {
        if (!Number.isFinite(y)) {
          pen = false;
          continue;
        }
        if (pen) ctx.lineTo(v.toPx(x), v.toPy(y));
        else ctx.moveTo(v.toPx(x), v.toPy(y));
        pen = true;
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.lineWidth = 1;

  for (const m of model.markers ?? []) {
    const px = v.toPx(m.x);
    const py = v.toPy(m.y);
    ctx.fillStyle = token(m.color ?? 'accent');
    ctx.strokeStyle = token('paper');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (m.label) {
      ctx.fillStyle = ink;
      ctx.font = MONO;
      // Prefer the side with more room, and never run off the plot.
      const width = ctx.measureText(m.label).width;
      const fitsRight = px + 8 + width <= v.right - 2;
      const fitsLeft = px - 8 - width >= v.left + 2;
      ctx.textBaseline = 'bottom';
      let labelX: number;
      let labelY = py - 6;
      if (fitsRight || fitsLeft) {
        ctx.textAlign = fitsRight && (!fitsLeft || px <= (v.left + v.right) / 2) ? 'left' : 'right';
        labelX = px + (ctx.textAlign === 'right' ? -8 : 8);
      } else {
        // Too long for either side on a narrow plot, so it sits centred above the point.
        ctx.textAlign = 'left';
        labelX = Math.max(v.left + 2, Math.min(px - width / 2, v.right - width - 2));
        labelY = py - 8;
      }
      // A halo keeps the label readable where a curve runs behind it.
      ctx.strokeStyle = token('paper');
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.strokeText(m.label, labelX, labelY);
      ctx.fillText(m.label, labelX, labelY);
    }
  }
  ctx.restore();

  // Axis frame and labels.
  ctx.strokeStyle = token('rule-2');
  ctx.lineWidth = 1;
  ctx.strokeRect(v.left + 0.5, v.top + 0.5, v.right - v.left - 1, v.bottom - v.top - 1);
  ctx.font = BODY;
  ctx.fillStyle = ink2;
  if (model.xLabel) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(model.xLabel, (v.left + v.right) / 2, height - 1);
  }
  if (model.yLabel) {
    ctx.save();
    ctx.translate(12, (v.top + v.bottom) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(model.yLabel, 0, 0);
    ctx.restore();
  }
  ctx.restore();
  return v;
}

export function Plot({ model, height, label }: { model: PlotModel; height?: number; label: string }) {
  return <Canvas height={height} label={label} draw={(ctx, w, h) => drawPlot(ctx, w, h, model)} />;
}

/** Runs a callback each frame while mounted, unless the user prefers less motion. */
export function useAnimation(onFrame: (seconds: number) => void, active = true): void {
  const callback = useRef(onFrame);
  callback.current = onFrame;
  useEffect(() => {
    if (!active) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      callback.current(0);
      return undefined;
    }
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      if (!document.hidden) callback.current((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}
