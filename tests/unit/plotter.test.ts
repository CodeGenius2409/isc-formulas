// The graph plotter's maths and placement, away from the screen.
import { derivative as mathjsDerivative, parse as mathjsParse } from 'mathjs';
import { describe, expect, it } from 'vitest';
import { evaluate, parseExpr } from '../../src/solver/expr';
import { toTex } from '../../src/solver/tex';
import { cumulativeIntegral, definiteIntegral } from '../../src/sims/lib/calculus';
import { normalise, readLine, readLines, type GraphLine } from '../../src/sims/lib/graph-input';
import { antiderivative, differentiate, matchesIntegrand } from '../../src/sims/lib/symbolic';
import { crossings, describePoint, formatCoord, formatPoint, intersectionPoints, nearestPoint, placeLabels, placeReadout, readCurves, rootPoints, turningPoints } from '../../src/sims/lib/graph-analysis';

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

describe('reading the graph', () => {
  it('says undefined outside a domain and at an asymptote', () => {
    const curves = [
      { name: 'f1', color: 'a', fn: (x: number) => Math.sqrt(x) },
      { name: 'f2', color: 'a', fn: (x: number) => 1 / x },
      { name: 'f3', color: 'a', fn: Math.tan },
    ];
    expect(readCurves(curves, -1).map((v) => v.y)).toEqual([null, -1, Math.tan(-1)]);
    expect(readCurves(curves, 0)[1].y).toBeNull();
    expect(readCurves(curves, Math.PI / 2)[2].y).toBeNull();
  });

  it('snaps within reach, and prefers the closer point', () => {
    const point = (x: number, kind: 'root' | 'maximum') => ({ x, y: 0, kind, curves: ['f1'] });
    const list = [point(10, 'root'), point(20, 'maximum')];
    const id = (v: number) => v;
    expect(nearestPoint(list, id, id, 12, 0, 14)?.x).toBe(10);
    expect(nearestPoint(list, id, id, 18, 0, 14)?.x).toBe(20);
    expect(nearestPoint(list, id, id, 50, 0, 14)).toBeNull();
  });

  it('names points', () => {
    expect(describePoint({ x: 0, y: 0, kind: 'intersection', curves: ['f1', 'f2'] })).toBe('Intersection of f1 and f2');
    expect(describePoint({ x: 0, y: 0, kind: 'root', curves: ['f1'] })).toBe('Root of f1');
    expect(describePoint({ x: 0, y: 0, kind: 'maximum', curves: ['f2'] })).toBe('Maximum of f2');
  });

  const frame = { w: 120, h: 40, left: 50, right: 400, top: 10, bottom: 300 };

  it('flips sides near the edges, and stays clear of the guide line', () => {
    expect(placeReadout({ ...frame, px: 100, ys: [] }).x).toBe(112);
    const near = placeReadout({ ...frame, px: 380, ys: [] });
    expect(near.x + frame.w).toBeLessThan(380);
  });

  it('on a narrow plot, sits above or below every marker it would otherwise cover', () => {
    const narrow = { ...frame, right: 200, left: 50 };
    const ys = [30, 150, 290];
    const spot = placeReadout({ ...narrow, px: 125, ys });
    for (const y of ys) expect(y < spot.y - 5 || y > spot.y + frame.h + 5).toBe(true);
    expect(spot.x).toBeGreaterThanOrEqual(50);
    expect(spot.x + frame.w).toBeLessThanOrEqual(200);
  });
});

describe('symbolic derivatives', () => {
  const texOf = (source: string) => toTex(differentiate(parseExpr(source))!);

  it('gives 3x² for x³', () => {
    expect(texOf('x^3')).toBe('3\\,x^{2}');
    expect(readLine('d/dx(x^3)', 'f1').kind).toBe('derivative');
  });

  it('agrees with mathjs and with the numbers, across the syllabus', () => {
    const sources = ['x^3*sin(x)', 'sin(x)^2', 'cos(2*x+1)', 'tan(x)', 'exp(x)*x', 'log(x)', 'sqrt(x)', '1/x', 'x/(1+x^2)', 'asin(x/2)', 'acos(x/2)', 'atan(x)', 'e^(2*x)', '2^x', 'log(x^2+1)', 'x^x', 'sec(x)', 'cot(x)', 'csc(x)', 'sinh(x)', 'cosh(x)', 'log10(x)'];
    for (const source of sources) {
      const mine = differentiate(parseExpr(source))!;
      expect(mine, source).not.toBeNull();
      const theirs = mathjsDerivative(mathjsParse(source.replace(/\bcsc\b/, 'csc')), 'x').compile();
      for (const x of [0.3, 0.7, 1.1, 1.6]) {
        expect(evaluate(mine, { x }), `${source} at ${x}`).toBeCloseTo(theirs.evaluate({ x }) as number, 8);
      }
    }
  });

  it('says it has no formula for what has none', () => {
    expect(differentiate(parseExpr('floor(x)'))).toBeNull();
    const line = readLine('d/dx(floor(x))', 'f1');
    expect(line.kind === 'derivative' && line.symbolic).toBe(false);
  });
});

describe('antiderivatives', () => {
  it('are right for standard forms, checked by differentiating back', () => {
    for (const source of ['x', 'x^2', '3*x^2 + 2*x + 1', '1/x', 'sin(x)', 'cos(3*x)', 'exp(2*x)', 'e^x', '2^x', 'sqrt(x)', 'tan(x)', 'sec(x)^2', 'x*exp(x)', 'x*sin(x)', 'x^2*cos(x)', '1/(1+x^2)', '1/sqrt(1-x^2)', 'log(x)', '(2*x+1)^3', '1/(2*x+1)', '5']) {
      const f = parseExpr(source);
      const F = antiderivative(f);
      expect(F, source).not.toBeNull();
      expect(matchesIntegrand(F!, f), source).toBe(true);
    }
  });

  it('refuses what it can\'t do, for a numeric curve to take over', () => {
    expect(antiderivative(parseExpr('exp(x^2)'))).toBeNull();
    expect(antiderivative(parseExpr('sin(x)/x'))).toBeNull();
    const line = readLine('∫ exp(x^2)', 'f1');
    expect(line.kind === 'indefinite' && line.symbolic).toBe(false);
  });

  it('a numeric curve starts from its reference point and adds up correctly', () => {
    const F = cumulativeIntegral(Math.cos, 0);
    for (const x of [0, 0.5, 1, -1, 3.2, -4]) expect(F(x)).toBeCloseTo(Math.sin(x), 4);
    const G = cumulativeIntegral((x) => 1 / x, 1);
    expect(G(2)).toBeCloseTo(Math.log(2), 4);
    expect(G(-1)).toBeNaN();
  });
});

describe('definite integrals', () => {
  it('the integral of sin x from 0 to π is 2, to four decimal places', () => {
    const r = definiteIntegral(Math.sin, 0, Math.PI);
    expect(r.value!.toFixed(4)).toBe('2.0000');
    expect(r.above.toFixed(4)).toBe('2.0000');
    expect(r.below).toBeCloseTo(0, 8);
  });

  it('the integral of x from −1 to 1 is 0, with an area on each side', () => {
    const r = definiteIntegral((x) => x, -1, 1);
    expect(r.value).toBe(0);
    expect(r.above).toBeCloseTo(0.5, 8);
    expect(r.below).toBeCloseTo(0.5, 8);
  });

  it('is signed, and reversing the limits reverses it', () => {
    expect(definiteIntegral(Math.sin, Math.PI, 2 * Math.PI).value).toBeCloseTo(-2, 8);
    expect(definiteIntegral(Math.sin, Math.PI, 0).value).toBeCloseTo(-2, 8);
    expect(definiteIntegral((x) => x * x, 1, 1).value).toBe(0);
  });

  it('handles infinite limits', () => {
    expect(definiteIntegral((x) => Math.exp(-x), 0, Infinity).value).toBeCloseTo(1, 4);
    expect(definiteIntegral((x) => 1 / (1 + x * x), -Infinity, Infinity).value).toBeCloseTo(Math.PI, 3);
    expect(definiteIntegral((x) => Math.exp(x), -Infinity, 0).value).toBeCloseTo(1, 4);
  });

  it('says no value for an integral that diverges, and copes with one that only looks bad', () => {
    expect(definiteIntegral((x) => 1 / x, -1, 1).value).toBeNull();
    expect(definiteIntegral((x) => 1 / x, 0, 1).value).toBeNull();
    expect(definiteIntegral((x) => 1 / (x * x), -1, 1).value).toBeNull();
    expect(definiteIntegral((x) => 1 / Math.sqrt(x), 0, 1).value).toBeCloseTo(2, 3);
  });
});

describe('reading what is typed', () => {
  const value = (source: string, x: number) => {
    const line = readLine(source, 'f1');
    if (line.kind === 'error' || line.kind === 'empty') throw new Error(`${source}: ${line.kind === 'error' ? line.message : 'empty'}`);
    return line.fn(x);
  };

  it('understands implicit multiplication, and the way students write maths', () => {
    expect(value('2x', 3)).toBe(6);
    expect(value('3sin(x)', 1)).toBeCloseTo(3 * Math.sin(1), 10);
    expect(value('x sin(x)', 2)).toBeCloseTo(2 * Math.sin(2), 10);
    expect(value('xsin(x)', 2)).toBeCloseTo(2 * Math.sin(2), 10);
    expect(value('2xcos(x)', 2)).toBeCloseTo(4 * Math.cos(2), 10);
    expect(value('sin x', 1)).toBeCloseTo(Math.sin(1), 10);
    expect(value('sin 2x', 1)).toBeCloseTo(Math.sin(2), 10);
    expect(value('sin^2(x)', 1)).toBeCloseTo(Math.sin(1) ** 2, 10);
    expect(value('sin²(x)', 1)).toBeCloseTo(Math.sin(1) ** 2, 10);
    expect(value('sin⁻¹(x)', 0.5)).toBeCloseTo(Math.asin(0.5), 10);
    expect(value('x(x+1)', 2)).toBe(6);
    expect(value('(x+1)(x-1)', 3)).toBe(8);
    expect(value('|x|', -4)).toBe(4);
    expect(value('|x - 1| + |x + 1|', 0)).toBe(2);
    expect(value('√x', 9)).toBe(3);
    expect(value('√(x+1)', 8)).toBe(3);
    expect(value('2π', 0)).toBeCloseTo(2 * Math.PI, 10);
    expect(value('θ^2', 3)).toBe(9);
    expect(value('y = x + 1', 2)).toBe(3);
    expect(value('f(x) = x + 1', 2)).toBe(3);
    expect(value('e^x', 1)).toBeCloseTo(Math.E, 10);
    expect(normalise('sin⁻¹(x)')).toBe('asin(x)');
  });

  const message = (source: string) => {
    const line = readLine(source, 'f1');
    return line.kind === 'error' ? line.message : '';
  };

  it('says what is wrong, in words', () => {
    expect(message('sin(x')).toBe('A closing bracket ) is missing.');
    expect(message('((x')).toBe('2 closing brackets ) are missing.');
    expect(message('x)')).toBe('There is a ) with no ( before it.');
    expect(message('x +')).toBe('Something is missing after the + at the end.');
    expect(message('*x')).toBe('Something is missing before the * at the start.');
    expect(message('x ** 2')).toContain('two operators');
    expect(message('y + 1')).toBe('"y" has no value. Use only x here.');
    expect(message('foo(x)')).toContain('foo');
    expect(message('|x')).toContain('bar');
    expect(message('∞')).toContain('limit');
    expect(message('2 + d/dx(x)')).toContain('start of the line');
    expect(message('∫')).toContain('after ∫');
    expect(message('d/dx')).toContain('after d/dx');
    expect(message('∫ from 0 of x')).toContain('Write the limits');
  });

  const kinds = (source: string) => readLine(source, 'f1').kind;

  it('reads the ways of writing calculus', () => {
    for (const source of ['d/dx(x^3 sin(x))', 'd/dx x^2', 'derivative of x^2', 'differentiate x^2']) expect(kinds(source), source).toBe('derivative');
    for (const source of ['∫ from 0 to π of sin(x)', '∫ from 0 to π of sin(x) dx', 'integral from 0 to 1 of x', '∫[0, pi] sin(x) dx', 'integrate from 0 to 1 of x', '∫ from 0 to ∞ of exp(-x)']) expect(kinds(source), source).toBe('definite');
    for (const source of ['∫ x^2', '∫ x^2 dx', 'integral of x^2', 'integrate x', '∫(x^2)']) expect(kinds(source), source).toBe('indefinite');
  });

  const expectValue = (line: GraphLine, want: number) => {
    expect(line.kind === 'definite' && line.result.value).toBeCloseTo(want, 4);
  };

  it('works out a definite integral as it reads it', () => {
    expectValue(readLine('∫ from 0 to π of sin(x)', 'f1'), 2);
    expectValue(readLine('∫ from 0 to π/2 of sin x', 'f1'), 1);
    expect(message('∫ from a to 1 of x')).toContain('lower limit');
    expect(message('∫ from 0 to x of x')).toContain('upper limit');
  });

  it('lets a line use the lines above it', () => {
    const [f1, f2, f3, f4] = readLines(['x^2', 'derivative of f1', "f1'", 'f1 + f2']);
    expect(f1.kind).toBe('plain');
    expect(f2.kind === 'derivative' && f2.fn(3)).toBe(6);
    expect(f3.kind === 'derivative' && f3.fn(3)).toBe(6);
    expect(f4.kind === 'plain' && f4.fn(3)).toBe(15);
    const [later] = readLines(['f2', 'x']);
    expect(later.kind === 'error' && later.message).toContain('above');
    const [self] = readLines(['f1 + 1']);
    expect(self.kind === 'error' && self.message).toContain('itself');
  });

  it('prints the preview as LaTeX, in θ where θ was typed', () => {
    const line = readLine('∫ from 0 to π of sin(θ)', 'f1');
    expect(line.kind === 'definite' && line.tex).toContain('\\theta');
    expect(line.kind === 'definite' && line.tex).toContain('\\int_{0}^{\\pi}');
    const d = readLine('d/dx(x^3)', 'f1');
    expect(d.kind === 'derivative' && d.tex).toContain('3\\,x^{2}');
    const i = readLine('∫ x^2', 'f1');
    expect(i.kind === 'indefinite' && i.tex).toContain('+C');
    const sum = readLine('∫ x + 1', 'f1');
    expect(sum.kind === 'indefinite' && sum.tex).toContain('\\left(x+1\\right)\\,dx');
  });
});
