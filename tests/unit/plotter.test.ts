// The graph plotter's maths and placement, away from the screen.
import { describe, expect, it } from 'vitest';
import { crossings, formatCoord, formatPoint, intersectionPoints, placeLabels, rootPoints, turningPoints } from '../../src/sims/lib/graph-analysis';

const rounded = (list: number[]) => list.map((v) => Number(v.toFixed(6)));

describe('intersections', () => {
  it('finds (−1, 1) and (2, 4) for y = x² and y = x + 2', () => {
    const points = intersectionPoints([{ name: 'f1', fn: (x) => x * x, color: 'a' }, { name: 'f2', fn: (x) => x + 2, color: 'b' }], -10, 10);
    expect(points.map((p) => [Number(p.x.toFixed(6)), Number(p.y.toFixed(6))])).toEqual([[-1, 1], [2, 4]]);
    expect(formatPoint(points[0].x, points[0].y)).toBe('(−1, 1)');
    expect(formatPoint(points[1].x, points[1].y)).toBe('(2, 4)');
  });

  it('finds x = π/4 + nπ for y = sin x and y = cos x', () => {
    const found = crossings(Math.sin, Math.cos, -10, 10);
    const expected: number[] = [];
    for (let n = -3; n <= 2; n++) expected.push(Math.PI / 4 + n * Math.PI);
    expect(found.length).toBe(expected.length);
    found.forEach((x, i) => expect(x).toBeCloseTo(expected[i], 7));
  });

  it('gives no false hits at the asymptotes of tan x', () => {
    // tan x changes sign across π/2 with y = 0 nowhere near it.
    const found = crossings(Math.tan, () => 0, -5, 5);
    expect(rounded(found)).toEqual(rounded([-Math.PI, 0, Math.PI]));
    for (const x of crossings(Math.tan, (v) => v, -5, 5)) expect(Math.abs(Math.tan(x) - x)).toBeLessThan(1e-5);
    expect(crossings(Math.tan, (v) => v, -5, 5).some((x) => Math.abs(Math.abs(x) - Math.PI / 2) < 0.01)).toBe(false);
  });

  it('gives no false hit across the pole of 1/x', () => {
    expect(crossings((x) => 1 / x, () => 0, -1, 1.001)).toEqual([]);
    expect(crossings((x) => 1 / x, (x) => -1 / x, -2, 2)).toEqual([]);
    expect(rounded(crossings((x) => 1 / x, (x) => x, -3, 3))).toEqual([-1, 1]);
  });

  it('gives no false hit across a jump', () => {
    expect(crossings(Math.floor, () => 0.5, -3, 3)).toEqual([]);
  });

  it('finds curves that touch without crossing', () => {
    expect(rounded(crossings((x) => x * x, () => 0, -3, 3.1)).map((x) => Number(x.toFixed(4)))).toEqual([0]);
    expect(crossings((x) => (x - 1) ** 2 + 1, () => 1, -3, 3.1)[0]).toBeCloseTo(1, 3);
  });

  it('does not mark the same curve drawn twice', () => {
    expect(crossings(Math.sin, Math.sin, -5, 5)).toEqual([]);
  });

  it('stays out of a domain where a curve is undefined', () => {
    expect(crossings((x) => Math.sqrt(x), (x) => x - 2, -5, 10).map((x) => Number(x.toFixed(5)))).toEqual([4]);
  });
});

describe('roots and turning points', () => {
  const curve = { name: 'f1', color: 'a', fn: (x: number) => x * x * x - 3 * x };

  it('finds roots', () => {
    expect(rootPoints(curve, -3, 3.1).map((p) => Number(p.x.toFixed(4)))).toEqual([-1.7321, 0, 1.7321]);
  });

  it('finds turning points, and names them', () => {
    const points = turningPoints(curve, -3, 3.1);
    expect(points.map((p) => [p.kind, Number(p.x.toFixed(3)), Number(p.y.toFixed(3))])).toEqual([['maximum', -1, 2], ['minimum', 1, -2]]);
  });

  it('calls nothing beside a pole a turning point', () => {
    expect(turningPoints({ name: 'f', color: 'a', fn: (x) => 1 / x }, -2, 2.01)).toEqual([]);
    expect(turningPoints({ name: 'f', color: 'a', fn: Math.tan }, -5, 5)).toEqual([]);
  });
});

describe('coordinates', () => {
  it('rounds sensibly', () => {
    expect(formatCoord(0.7853981)).toBe('0.785');
    expect(formatCoord(1.5625)).toBe('1.563');
    expect(formatCoord(2)).toBe('2');
    expect(formatCoord(-1.0000000001)).toBe('−1');
    expect(formatCoord(1e-13)).toBe('0');
    expect(formatCoord(123456)).toBe('1.23e5');
    expect(formatCoord(NaN)).toBe('undefined');
  });
});

describe('label placement', () => {
  const bounds = { x: 0, y: 0, w: 400, h: 300 };
  const label = (px: number, py: number) => ({ px, py, width: 60, height: 16 });
  const clash = (a: { x: number; y: number; w: number; h: number }, b: typeof a) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

  it('keeps labels apart when points are close together', () => {
    const placed = placeLabels([label(200, 150), label(210, 152), label(195, 160), label(205, 145)], bounds, () => 0);
    expect(placed.length).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) expect(clash(placed[i].box, placed[j].box)).toBe(false);
    }
  });

  it('stays inside the plot, flipping at the edges', () => {
    for (const [x, y] of [[395, 5], [5, 5], [395, 295], [5, 295]]) {
      const [p] = placeLabels([label(x, y)], bounds, () => 0);
      expect(p.box.x).toBeGreaterThanOrEqual(0);
      expect(p.box.y).toBeGreaterThanOrEqual(0);
      expect(p.box.x + p.box.w).toBeLessThanOrEqual(400);
      expect(p.box.y + p.box.h).toBeLessThanOrEqual(300);
    }
  });

  it('prefers a spot clear of the curves', () => {
    const [p] = placeLabels([label(200, 150)], bounds, (box) => (box.x >= 200 ? 5 : 0));
    expect(p.box.x + p.box.w).toBeLessThanOrEqual(200);
  });

  it('leaves out a label with nowhere to go, rather than overlapping', () => {
    const crowded = Array.from({ length: 200 }, (_, i) => label(20 + (i % 20) * 18, 20 + Math.floor(i / 20) * 26));
    const placed = placeLabels(crowded, bounds, () => 0);
    expect(placed.length).toBeLessThan(200);
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) expect(clash(placed[i].box, placed[j].box)).toBe(false);
    }
  });
});
