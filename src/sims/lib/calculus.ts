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

/** Where two functions cross. */
export function intersections(f: (x: number) => number, g: (x: number) => number, a: number, b: number): number[] {
  return roots((x) => f(x) - g(x), a, b);
}
