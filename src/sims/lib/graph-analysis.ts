// What the graph plotter works out about its curves: where they cross, where they turn, and where a
// label can go without sitting on something else. Everything here is plain numbers, so it can be tested.

type Fn = (x: number) => number;

/** Values this large only come up beside an asymptote, as tan(π/2) gives 1.6e16 rather than infinity. */
const HUGE = 1e12;
export const isDefined = (y: number): boolean => Number.isFinite(y) && Math.abs(y) < HUGE;

const closeEnough = (d: number, f: number, g: number) => Math.abs(d) <= 1e-7 * Math.max(1, Math.abs(f), Math.abs(g));

function bisect(d: Fn, lo: number, hi: number): number {
  let a = lo;
  let b = hi;
  let da = d(a);
  for (let i = 0; i < 70; i++) {
    const mid = (a + b) / 2;
    const dm = d(mid);
    if (da * dm <= 0) b = mid;
    else {
      a = mid;
      da = dm;
    }
  }
  return (a + b) / 2;
}

/** The lowest point of |d| between two bounds, for curves that touch without crossing. */
function lowestPoint(d: Fn, lo: number, hi: number): number {
  const ratio = (Math.sqrt(5) - 1) / 2;
  let a = lo;
  let b = hi;
  for (let i = 0; i < 60; i++) {
    const p = b - ratio * (b - a);
    const q = a + ratio * (b - a);
    if (Math.abs(d(p)) < Math.abs(d(q))) b = q;
    else a = p;
  }
  return (a + b) / 2;
}

/**
 * Where f and g meet in [a, b]. It samples f − g, refines each sign change by bisection, and also finds
 * curves that touch without crossing. A sign change across a jump or an asymptote fails the check that
 * the two values really agree at the point, so tan x and 1/x give no false hits.
 */
export function crossings(f: Fn, g: Fn, a: number, b: number, samples = 1200): number[] {
  const d: Fn = (x) => f(x) - g(x);
  const dx = (b - a) / samples;
  const xs = Array.from({ length: samples + 1 }, (_, i) => a + i * dx);
  const ds = xs.map(d);
  // The same curve twice meets everywhere, which isn't a point to mark.
  if (ds.filter((v) => Math.abs(v) < 1e-12).length > samples * 0.05) return [];

  const found: number[] = [];
  const accept = (x: number) => {
    const fx = f(x);
    const gx = g(x);
    if (!isDefined(fx) || !isDefined(gx) || !closeEnough(fx - gx, fx, gx)) return;
    if (!found.length || Math.abs(x - found[found.length - 1]) > dx / 4) found.push(x);
  };
  for (let i = 0; i <= samples; i++) {
    const here = ds[i];
    if (!Number.isFinite(here)) continue;
    if (here === 0) {
      accept(xs[i]);
      continue;
    }
    const next = ds[i + 1];
    if (i < samples && Number.isFinite(next) && here * next < 0) accept(bisect(d, xs[i], xs[i + 1]));
    const before = ds[i - 1];
    if (i > 0 && i < samples && Number.isFinite(before) && Number.isFinite(next) && before * here > 0 && here * next > 0 && Math.abs(here) <= Math.abs(before) && Math.abs(here) < Math.abs(next)) {
      accept(lowestPoint(d, xs[i - 1], xs[i + 1]));
    }
  }
  return found;
}

export type PointKind = 'intersection' | 'root' | 'maximum' | 'minimum';

export interface GraphPoint {
  x: number;
  y: number;
  kind: PointKind;
  /** The curves it belongs to, by name. */
  curves: string[];
}

export interface Curve {
  name: string;
  fn: Fn;
  /** A token name. */
  color: string;
}

/** Each pair of curves once. */
export function intersectionPoints(curves: Curve[], a: number, b: number): GraphPoint[] {
  const out: GraphPoint[] = [];
  for (let i = 0; i < curves.length; i++) {
    for (let j = i + 1; j < curves.length; j++) {
      for (const x of crossings(curves[i].fn, curves[j].fn, a, b)) out.push({ x, y: curves[i].fn(x), kind: 'intersection', curves: [curves[i].name, curves[j].name] });
    }
  }
  return out.sort((p, q) => p.x - q.x);
}

/** Where a curve meets the x-axis. */
export function rootPoints(curve: Curve, a: number, b: number): GraphPoint[] {
  return crossings(curve.fn, () => 0, a, b, 800).map((x) => ({ x, y: 0, kind: 'root', curves: [curve.name] }));
}

/** Where a curve turns: the slope changes sign, and the curve is unbroken there. */
export function turningPoints(curve: Curve, a: number, b: number, samples = 800): GraphPoint[] {
  const out: GraphPoint[] = [];
  const dx = (b - a) / samples;
  const ys = Array.from({ length: samples + 1 }, (_, i) => curve.fn(a + i * dx));
  const span = Math.max(1e-9, Math.abs(b - a));
  for (let i = 1; i < samples; i++) {
    const [l, m, r] = [ys[i - 1], ys[i], ys[i + 1]];
    if (!isDefined(l) || !isDefined(m) || !isDefined(r)) continue;
    const isMax = m >= l && m > r;
    const isMin = m <= l && m < r;
    if (!isMax && !isMin) continue;
    const sign = isMax ? -1 : 1;
    const ratio = (Math.sqrt(5) - 1) / 2;
    let lo = a + (i - 1) * dx;
    let hi = a + (i + 1) * dx;
    for (let k = 0; k < 50; k++) {
      const p = hi - ratio * (hi - lo);
      const q = lo + ratio * (hi - lo);
      if (sign * curve.fn(p) < sign * curve.fn(q)) hi = q;
      else lo = p;
    }
    const x = (lo + hi) / 2;
    const y = curve.fn(x);
    // A peak beside a pole is the sampling catching the asymptote, not a turning point.
    const near = Math.max(Math.abs(y - curve.fn(x + span / 2000)), Math.abs(y - curve.fn(x - span / 2000)));
    if (isDefined(y) && near < Math.max(1, Math.abs(y)) * 0.5) out.push({ x, y, kind: isMax ? 'maximum' : 'minimum', curves: [curve.name] });
  }
  return out;
}

const SUB_ZERO = 5e-10;

/** A coordinate for reading: at most three decimals, or scientific when very large or small. */
export function formatCoord(v: number): string {
  if (!Number.isFinite(v)) return 'undefined';
  if (Math.abs(v) < SUB_ZERO) return '0';
  const abs = Math.abs(v);
  if (abs >= 1e5 || abs < 1e-3) return v.toExponential(2).replace('e+', 'e').replace('-', '−');
  const decimals = abs >= 1000 ? 1 : abs >= 100 ? 2 : 3;
  return String(Number(v.toFixed(decimals))).replace('-', '−');
}

export const formatPoint = (x: number, y: number): string => `(${formatCoord(x)}, ${formatCoord(y)})`;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

export interface LabelRequest {
  px: number;
  py: number;
  width: number;
  height: number;
}

export interface PlacedLabel {
  box: Box;
  /** The request's position in the list it was given. */
  index: number;
}

/**
 * Places labels one at a time, trying eight spots around each dot. A label never overlaps another label
 * or a dot, and stays in the plot. It avoids curves where it can, as the brief asks, so a spot on a curve
 * only wins when every other spot is worse. A label with nowhere to go is left out, and its dot stays.
 */
export function placeLabels(requests: LabelRequest[], bounds: Box, hitsCurve: (box: Box) => number): PlacedLabel[] {
  const gap = 7;
  const placed: PlacedLabel[] = [];
  const dots: Box[] = requests.map((r) => ({ x: r.px - 6, y: r.py - 6, w: 12, h: 12 }));
  requests.forEach((r, index) => {
    const spots: Box[] = [
      { x: r.px + gap, y: r.py - gap - r.height, w: r.width, h: r.height },
      { x: r.px - gap - r.width, y: r.py - gap - r.height, w: r.width, h: r.height },
      { x: r.px + gap, y: r.py + gap, w: r.width, h: r.height },
      { x: r.px - gap - r.width, y: r.py + gap, w: r.width, h: r.height },
      { x: r.px - r.width / 2, y: r.py - gap - 4 - r.height, w: r.width, h: r.height },
      { x: r.px - r.width / 2, y: r.py + gap + 4, w: r.width, h: r.height },
      { x: r.px + gap + 2, y: r.py - r.height / 2, w: r.width, h: r.height },
      { x: r.px - gap - 2 - r.width, y: r.py - r.height / 2, w: r.width, h: r.height },
    ];
    let best: Box | null = null;
    let bestScore = Infinity;
    spots.forEach((box, order) => {
      const inside = box.x >= bounds.x && box.y >= bounds.y && box.x + box.w <= bounds.x + bounds.w && box.y + box.h <= bounds.y + bounds.h;
      if (!inside || placed.some((p) => overlaps(p.box, box)) || dots.some((dot) => overlaps(dot, box))) return;
      const score = hitsCurve(box) * 100 + order;
      if (score < bestScore) {
        bestScore = score;
        best = box;
      }
    });
    if (best) placed.push({ box: best, index });
  });
  return placed;
}

export interface CurveValue {
  name: string;
  color: string;
  /** Null where the curve is undefined: outside its domain, or at an asymptote. */
  y: number | null;
}

export function readCurves(curves: Curve[], x: number): CurveValue[] {
  return curves.map((c) => {
    const y = c.fn(x);
    return { name: c.name, color: c.color, y: isDefined(y) ? y : null };
  });
}

/** Says what a point is, in words. */
export function describePoint(point: GraphPoint): string {
  const [a, b] = point.curves;
  if (point.kind === 'intersection') return `Intersection of ${a} and ${b}`;
  if (point.kind === 'root') return `Root of ${a}`;
  return `${point.kind === 'maximum' ? 'Maximum' : 'Minimum'} of ${a}`;
}

const SNAP_ORDER: Record<PointKind, number> = { intersection: 0, maximum: 1, minimum: 1, root: 2 };

/** The named point within reach of the pointer, closest first, and the rarer kind if two are level. */
export function nearestPoint(points: GraphPoint[], toPx: Fn, toPy: Fn, px: number, py: number, radius: number): GraphPoint | null {
  let best: GraphPoint | null = null;
  let bestScore = Infinity;
  for (const point of points) {
    const distance = Math.hypot(toPx(point.x) - px, toPy(point.y) - py);
    if (distance > radius) continue;
    const score = distance + SNAP_ORDER[point.kind] * 0.5;
    if (score < bestScore) {
      bestScore = score;
      best = point;
    }
  }
  return best;
}

export interface ReadoutRequest {
  /** The guide line. */
  px: number;
  /** Where the markers are on it. */
  ys: number[];
  w: number;
  h: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/**
 * Where the readout goes: beside the guide line, flipping sides near the edges. Beside the line it can't
 * cover a marker. On a narrow plot where it fits neither side, it goes above or below the markers.
 */
export function placeReadout({ px, ys, w, h, left, right, top, bottom }: ReadoutRequest): { x: number; y: number } {
  const gap = 12;
  const inset = 4;
  if (px + gap + w <= right - inset) return { x: px + gap, y: top + inset };
  if (px - gap - w >= left + inset) return { x: px - gap - w, y: top + inset };
  const x = Math.max(left + inset, Math.min(px - w / 2, right - inset - w));
  // The tallest gap between markers that the box fits in, trying the top first.
  const edges = [top + inset - 7, ...ys.filter((y) => y > top && y < bottom).sort((a, b) => a - b), bottom - inset + 7];
  for (let i = 0; i < edges.length - 1; i++) {
    if (edges[i + 1] - edges[i] >= h + 14) return { x, y: edges[i] + 7 };
  }
  return { x, y: top + inset };
}
