// Numerical helpers for the graph plotter.

/** Central difference, accurate for smooth functions. */
export function derivative(f: (x: number) => number, x: number): number {
  const h = Math.max(Math.abs(x), 1) * 1e-5;
  return (f(x + h) - f(x - h)) / (2 * h);
}

/** Composite Simpson's rule. Non-finite samples are skipped rather than poisoning the sum. */
export function integrate(f: (x: number) => number, a: number, b: number, intervals = 1000): number {
  const n = intervals % 2 === 0 ? intervals : intervals + 1;
  const h = (b - a) / n;
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    const y = f(a + i * h);
    if (!Number.isFinite(y)) continue;
    sum += y * (i === 0 || i === n ? 1 : i % 2 === 0 ? 2 : 4);
  }
  return (sum * h) / 3;
}

/** Roots of f in [a, b], by scanning for sign changes then bisecting. */
export function roots(f: (x: number) => number, a: number, b: number, samples = 1000): number[] {
  const out: number[] = [];
  const dx = (b - a) / samples;
  let px = a;
  let py = f(px);
  for (let i = 1; i <= samples; i++) {
    const x = a + i * dx;
    const y = f(x);
    if (Number.isFinite(py) && Number.isFinite(y)) {
      if (py === 0) out.push(px);
      else if (py * y < 0) {
        let lo = px;
        let hi = x;
        let fLo = py;
        for (let j = 0; j < 80; j++) {
          const mid = (lo + hi) / 2;
          const fMid = f(mid);
          if (fLo * fMid <= 0) hi = mid;
          else {
            lo = mid;
            fLo = fMid;
          }
        }
        const root = (lo + hi) / 2;
        // A sign change across a pole (1/x at 0) blows up instead of settling to 0.
        if (Math.abs(f(root)) < 1e-6 * Math.max(1, Math.abs(py), Math.abs(y))) out.push(root);
      }
    }
    px = x;
    py = y;
  }
  if (Number.isFinite(py) && py === 0) out.push(px);
  return out.filter((r, i) => i === 0 || Math.abs(r - out[i - 1]) > 1e-7);
}

function adaptive(f: (x: number) => number, a: number, b: number, fa: number, fm: number, fb: number, whole: number, tol: number, depth: number): number {
  const m = (a + b) / 2;
  const lm = (a + m) / 2;
  const rm = (m + b) / 2;
  const flm = f(lm);
  const frm = f(rm);
  const left = ((m - a) / 6) * (fa + 4 * flm + fm);
  const right = ((b - m) / 6) * (fm + 4 * frm + fb);
  const delta = left + right - whole;
  if (depth <= 0 || Math.abs(delta) <= 15 * tol) return left + right + delta / 15;
  return adaptive(f, a, m, fa, flm, fm, left, tol / 2, depth - 1) + adaptive(f, m, b, fm, frm, fb, right, tol / 2, depth - 1);
}

/** Adaptive Simpson on a stretch with no pole inside. A value undefined at one point counts as 0 there. */
function adaptiveSimpson(f: (x: number) => number, a: number, b: number, tol = 1e-10): number {
  if (a === b) return 0;
  const safe = (x: number) => {
    const y = f(x);
    return Number.isFinite(y) ? y : 0;
  };
  // Starting from several panels stops it missing a bump that the first few samples step over.
  const panels = 16;
  let total = 0;
  for (let i = 0; i < panels; i++) {
    const lo = a + ((b - a) * i) / panels;
    const hi = a + ((b - a) * (i + 1)) / panels;
    const fa = safe(lo);
    const fb = safe(hi);
    const fm = safe((lo + hi) / 2);
    total += adaptive(safe, lo, hi, fa, fm, fb, ((hi - lo) / 6) * (fa + 4 * fm + fb), tol / panels, 24);
  }
  return total;
}

export interface DefiniteResult {
  /** The signed area, or null when the integral doesn't converge. */
  value: number | null;
  /** Area above the axis, as a positive number. */
  above: number;
  /** Area below the axis, as a positive number. */
  below: number;
}

const POLE = 1e5;

/** Whether this stretch converges as its ends close in on a pole. Null if it doesn't. */
function convergent(f: (x: number) => number, a: number, b: number): number | null {
  const near = adaptiveSimpson(f, a + 1e-8, b - 1e-8);
  const nearer = adaptiveSimpson(f, a + 1e-10, b - 1e-10);
  if (!Number.isFinite(nearer) || Math.abs(near - nearer) > 1e-3 * (1 + Math.abs(nearer))) return null;
  return nearer;
}

/**
 * The definite integral, with the area above and below the x-axis found separately by splitting at the
 * curve's roots. An infinite limit is mapped onto a finite range first. An integral that doesn't converge
 * gives a null value rather than a wrong number.
 */
export function definiteIntegral(f: (x: number) => number, a: number, b: number): DefiniteResult {
  if (a === b) return { value: 0, above: 0, below: 0 };
  if (a > b) {
    const swapped = definiteIntegral(f, b, a);
    return { value: swapped.value === null ? null : -swapped.value, above: swapped.below, below: swapped.above };
  }
  let g = f;
  let lo = a;
  let hi = b;
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    // x = t / (1 − t²) maps (−1, 1) onto the whole line, x = a + t/(1 − t) maps (0, 1) onto (a, ∞).
    if (!Number.isFinite(a) && !Number.isFinite(b)) {
      g = (t) => f(t / (1 - t * t)) * ((1 + t * t) / (1 - t * t) ** 2);
      lo = -1;
      hi = 1;
    } else if (!Number.isFinite(b)) {
      g = (t) => f(a + t / (1 - t)) / (1 - t) ** 2;
      lo = 0;
      hi = 1;
    } else {
      g = (t) => f(b - (1 - t) / t) / (t * t);
      lo = 0;
      hi = 1;
    }
  }
  // Split at sign changes and at poles, so each stretch is all above or all below the axis.
  const samples = 4000;
  const breaks = [lo];
  const poles = new Set<number>();
  let previous = g(lo);
  const dx = (hi - lo) / samples;
  for (let i = 1; i <= samples; i++) {
    const x = lo + i * dx;
    const y = g(x);
    if (i < samples && (!Number.isFinite(y) || Math.abs(y) > POLE)) {
      if (x - breaks[breaks.length - 1] > dx / 2) breaks.push(x);
      poles.add(x);
    } else if (y === 0 && i < samples) {
      // A sample landing exactly on a root is a split too, or the next step sees no change of sign.
      breaks.push(x);
    } else if (Number.isFinite(previous) && Number.isFinite(y) && previous * y < 0) {
      if (Math.abs(previous) > POLE || Math.abs(y) > POLE) {
        previous = y;
        continue;
      }
      let l = x - dx;
      let r = x;
      let fl = previous;
      for (let k = 0; k < 60; k++) {
        const m = (l + r) / 2;
        const fm = g(m);
        if (fl * fm <= 0) r = m;
        else {
          l = m;
          fl = fm;
        }
      }
      breaks.push((l + r) / 2);
    }
    previous = y;
  }
  breaks.push(hi);
  let above = 0;
  let below = 0;
  for (let i = 0; i < breaks.length - 1; i++) {
    const l = breaks[i];
    const r = breaks[i + 1];
    if (r <= l) continue;
    const touchesPole = poles.has(l) || poles.has(r) || !Number.isFinite(g(l)) || !Number.isFinite(g(r));
    const area = touchesPole || !Number.isFinite(a) || !Number.isFinite(b) ? convergent(g, l, r) : adaptiveSimpson(g, l, r);
    if (area === null) return { value: null, above: 0, below: 0 };
    if (area >= 0) above += area;
    else below -= area;
  }
  const value = above - below;
  return { value: Math.abs(value) < 1e-11 ? 0 : value, above, below };
}

/**
 * An antiderivative as a curve: F(from) = 0, and F(x) is found by adding up strips outward from there, and
 * kept. Past a place where the integrand is undefined, F is undefined too, since it can't be carried over.
 */
export function cumulativeIntegral(f: (x: number) => number, from: number, step = 1 / 64, limit = 200000): (x: number) => number {
  const right: number[] = [0];
  const left: number[] = [0];
  let rightOpen = true;
  let leftOpen = true;
  const strip = (x: number, h: number) => {
    const a = f(x);
    const m = f(x + h / 2);
    const b = f(x + h);
    return Number.isFinite(a) && Number.isFinite(m) && Number.isFinite(b) ? (h / 6) * (a + 4 * m + b) : NaN;
  };
  return (x) => {
    if (!Number.isFinite(x)) return NaN;
    const distance = (x - from) / step;
    const table = distance >= 0 ? right : left;
    const direction = distance >= 0 ? 1 : -1;
    const steps = Math.abs(distance);
    const needed = Math.ceil(steps);
    if (needed >= limit) return NaN;
    while (table.length <= needed && (direction > 0 ? rightOpen : leftOpen)) {
      const i = table.length - 1;
      const area = strip(from + direction * i * step, direction * step);
      if (Number.isNaN(area)) {
        if (direction > 0) rightOpen = false;
        else leftOpen = false;
        break;
      }
      table.push(table[i] + area);
    }
    if (needed >= table.length) return NaN;
    const low = Math.floor(steps);
    const frac = steps - low;
    return table[low] + (needed > low ? (table[needed] - table[low]) * frac : 0);
  };
}

/** Where two functions cross. */
export function intersections(f: (x: number) => number, g: (x: number) => number, a: number, b: number): number[] {
  return roots((x) => f(x) - g(x), a, b);
}

/** nCr, built up term by term so that it stays exact for the sizes used here. */
export function binomialCoefficient(n: number, r: number): number {
  let out = 1;
  for (let i = 1; i <= r; i++) out = (out * (n - r + i)) / i;
  return Math.round(out);
}
