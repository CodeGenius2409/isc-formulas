// Projectile motion with optional linear air drag, integrated numerically.

export interface LaunchParams {
  speed: number;
  /** Degrees above horizontal. */
  angle: number;
  /** Launch height in metres. */
  height: number;
  g: number;
  /** Drag rate k in a = −k·v, per second. 0 means no air resistance. */
  drag: number;
}

export interface Trajectory {
  points: [number, number][];
  range: number;
  maxHeight: number;
  flightTime: number;
}

/** Exact results when there is no drag. */
export function idealTrajectory(p: LaunchParams): Omit<Trajectory, 'points'> {
  const th = (p.angle * Math.PI) / 180;
  const uy = p.speed * Math.sin(th);
  const ux = p.speed * Math.cos(th);
  const flightTime = (uy + Math.sqrt(uy * uy + 2 * p.g * p.height)) / p.g;
  return { flightTime, range: ux * flightTime, maxHeight: p.height + (uy * uy) / (2 * p.g) };
}

/**
 * Integrates with classical fourth-order Runge-Kutta, which is accurate at a fixed
 * step for this smooth system, then finds the landing point by interpolation.
 */
export function simulate(p: LaunchParams, steps = 1200): Trajectory {
  const th = (p.angle * Math.PI) / 180;
  const ideal = idealTrajectory({ ...p, drag: 0 });
  const dt = Math.max(ideal.flightTime, 0.01) / (steps / 2);
  let state = [0, p.height, p.speed * Math.cos(th), p.speed * Math.sin(th)];
  const deriv = (s: number[]) => [s[2], s[3], -p.drag * s[2], -p.g - p.drag * s[3]];
  const points: [number, number][] = [[state[0], state[1]]];
  let maxHeight = p.height;
  let t = 0;
  for (let i = 0; i < steps * 4; i++) {
    const k1 = deriv(state);
    const k2 = deriv(state.map((v, j) => v + (dt / 2) * k1[j]));
    const k3 = deriv(state.map((v, j) => v + (dt / 2) * k2[j]));
    const k4 = deriv(state.map((v, j) => v + dt * k3[j]));
    const next = state.map((v, j) => v + (dt / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    if (next[1] < 0) {
      // Land exactly at y = 0, between this step and the last.
      const f = state[1] / (state[1] - next[1]);
      const x = state[0] + f * (next[0] - state[0]);
      points.push([x, 0]);
      return { points, range: x, maxHeight, flightTime: t + f * dt };
    }
    state = next;
    t += dt;
    maxHeight = Math.max(maxHeight, state[1]);
    points.push([state[0], state[1]]);
  }
  return { points, range: state[0], maxHeight, flightTime: t };
}

/** Position at time t, for the moving ball. */
export function positionAt(trajectory: Trajectory, t: number): [number, number] {
  if (trajectory.flightTime <= 0) return [0, 0];
  const f = Math.min(Math.max(t / trajectory.flightTime, 0), 1);
  const i = f * (trajectory.points.length - 1);
  const lo = Math.floor(i);
  const hi = Math.min(lo + 1, trajectory.points.length - 1);
  const mix = i - lo;
  return [trajectory.points[lo][0] * (1 - mix) + trajectory.points[hi][0] * mix, trajectory.points[lo][1] * (1 - mix) + trajectory.points[hi][1] * mix];
}
