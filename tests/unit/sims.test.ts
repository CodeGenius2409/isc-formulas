import { describe, expect, it } from 'vitest';
import { derivative, integrate, intersections, roots } from '../../src/sims/lib/calculus';
import { labelBlocks, solveCircuit, toNetlist, type Block, type Element } from '../../src/sims/lib/circuit';
import { idealTrajectory, positionAt, simulate } from '../../src/sims/lib/projectile';
import { bestIndicator, equivalenceVolume, phAfter, suitableIndicators, type TitrationSetup } from '../../src/sims/lib/titration';

describe('projectile', () => {
  const launch = { speed: 20, angle: 45, height: 0, g: 9.8, drag: 0 };

  it('matches the textbook formulas with no drag', () => {
    const ideal = idealTrajectory(launch);
    expect(ideal.range).toBeCloseTo(400 / 9.8, 6);
    expect(ideal.maxHeight).toBeCloseTo(200 / 19.6, 6);
    expect(ideal.flightTime).toBeCloseTo((2 * 20 * Math.SQRT1_2) / 9.8, 6);
  });

  it('agrees with the formulas when integrated numerically', () => {
    const t = simulate(launch);
    const ideal = idealTrajectory(launch);
    expect(t.range).toBeCloseTo(ideal.range, 2);
    expect(t.maxHeight).toBeCloseTo(ideal.maxHeight, 2);
    expect(t.flightTime).toBeCloseTo(ideal.flightTime, 2);
  });

  it('handles a launch from a height', () => {
    // Horizontal launch from 20 m: t = √(2h/g), R = u·t
    const t = simulate({ speed: 10, angle: 0, height: 20, g: 10, drag: 0 });
    expect(t.flightTime).toBeCloseTo(2, 2);
    expect(t.range).toBeCloseTo(20, 1);
  });

  it('matches the exact drag solution', () => {
    // Linear drag has a closed form: x(t) = (ux/k)(1 − e^(−kt))
    const k = 0.1;
    const t = simulate({ ...launch, drag: k });
    const ux = 20 * Math.SQRT1_2;
    const expected = (ux / k) * (1 - Math.exp(-k * t.flightTime));
    expect(t.range).toBeCloseTo(expected, 2);
  });

  it('shortens range and height when drag is on', () => {
    const drag = simulate({ ...launch, drag: 0.2 });
    const none = simulate(launch);
    expect(drag.range).toBeLessThan(none.range);
    expect(drag.maxHeight).toBeLessThan(none.maxHeight);
  });

  it('gives the ball a position along the path', () => {
    const t = simulate(launch);
    expect(positionAt(t, 0)).toEqual([0, 0]);
    expect(positionAt(t, t.flightTime)[0]).toBeCloseTo(t.range, 3);
  });
});

describe('DC circuit analysis', () => {
  const find = (solution: ReturnType<typeof solveCircuit>, label: string) => solution.elements.find((e) => e.label === label)!;

  it("reduces to Ohm's law for one cell and one resistor", () => {
    const s = solveCircuit([
      { kind: 'cell', id: 'e', label: 'E1', a: 1, b: 0, emf: 12, r: 0 },
      { kind: 'resistor', id: 'r', label: 'R1', a: 1, b: 0, r: 100 },
    ]);
    expect(find(s, 'R1').current).toBeCloseTo(0.12);
    expect(find(s, 'R1').power).toBeCloseTo(1.44);
    expect(find(s, 'E1').current).toBeCloseTo(0.12);
  });

  it('accounts for internal resistance', () => {
    const s = solveCircuit([
      { kind: 'cell', id: 'e', label: 'E1', a: 1, b: 0, emf: 12, r: 1 },
      { kind: 'resistor', id: 'r', label: 'R1', a: 1, b: 0, r: 5 },
    ]);
    expect(find(s, 'R1').current).toBeCloseTo(2);
    expect(find(s, 'E1').voltage).toBeCloseTo(10); // terminal voltage = E − Ir
  });

  it('solves a classic two-loop Kirchhoff problem', () => {
    // Two cells (12 V, 6 V) feeding a shared 4 Ω with 2 Ω and 1 Ω in their branches.
    // Node equation: (12−V)/2 + (6−V)/1 = V/4, so V = 36/7 ... worked by hand below.
    const s = solveCircuit([
      { kind: 'cell', id: 'a', label: 'E1', a: 2, b: 0, emf: 12, r: 0 },
      { kind: 'resistor', id: 'r1', label: 'R1', a: 2, b: 1, r: 2 },
      { kind: 'cell', id: 'b', label: 'E2', a: 3, b: 0, emf: 6, r: 0 },
      { kind: 'resistor', id: 'r2', label: 'R2', a: 3, b: 1, r: 1 },
      { kind: 'resistor', id: 'r3', label: 'R3', a: 1, b: 0, r: 4 },
    ]);
    const V = (12 / 2 + 6 / 1) / (1 / 2 + 1 + 1 / 4); // 12 / 1.75
    expect(s.nodeVoltages[1]).toBeCloseTo(V, 6);
    expect(find(s, 'R3').current).toBeCloseTo(V / 4, 6);
    expect(find(s, 'R1').current).toBeCloseTo((12 - V) / 2, 6);
    expect(find(s, 'R2').current).toBeCloseTo((6 - V) / 1, 6);
  });

  it('solves an unbalanced Wheatstone bridge, which is not series-parallel', () => {
    const net: Element[] = [
      { kind: 'cell', id: 'e', label: 'E1', a: 1, b: 0, emf: 10, r: 0 },
      { kind: 'resistor', id: 'p', label: 'P', a: 1, b: 2, r: 100 },
      { kind: 'resistor', id: 'q', label: 'Q', a: 2, b: 0, r: 100 },
      { kind: 'resistor', id: 'r', label: 'R', a: 1, b: 3, r: 100 },
      { kind: 'resistor', id: 's', label: 'S', a: 3, b: 0, r: 300 },
      { kind: 'resistor', id: 'g', label: 'G', a: 2, b: 3, r: 50 },
    ];
    const s = solveCircuit(net);
    // Kirchhoff's current law must hold at every node.
    expect(find(s, 'P').current).toBeCloseTo(find(s, 'Q').current + find(s, 'G').current, 8);
    expect(find(s, 'R').current + find(s, 'G').current).toBeCloseTo(find(s, 'S').current, 8);
    expect(find(s, 'E1').current).toBeCloseTo(find(s, 'P').current + find(s, 'R').current, 8);
    expect(Math.abs(find(s, 'G').current)).toBeGreaterThan(0.001);
  });

  it('shows no galvanometer current in a balanced bridge', () => {
    const s = solveCircuit([
      { kind: 'cell', id: 'e', label: 'E1', a: 1, b: 0, emf: 10, r: 0 },
      { kind: 'resistor', id: 'p', label: 'P', a: 1, b: 2, r: 100 },
      { kind: 'resistor', id: 'q', label: 'Q', a: 2, b: 0, r: 200 },
      { kind: 'resistor', id: 'r', label: 'R', a: 1, b: 3, r: 50 },
      { kind: 'resistor', id: 's', label: 'S', a: 3, b: 0, r: 100 },
      { kind: 'resistor', id: 'g', label: 'G', a: 2, b: 3, r: 50 },
    ]);
    expect(find(s, 'G').current).toBeCloseTo(0, 9);
  });

  it('builds a netlist from nested series and parallel groups', () => {
    // 12 V cell, then 2 Ω in series with (3 Ω ∥ 6 Ω). Total 4 Ω, so 3 A.
    const root: Block = {
      type: 'series',
      id: 'root',
      items: [
        { type: 'cell', id: 'e', emf: 12, r: 0 },
        { type: 'resistor', id: 'a', r: 2 },
        {
          type: 'parallel',
          id: 'p',
          items: [
            { type: 'resistor', id: 'b', r: 3 },
            { type: 'resistor', id: 'c', r: 6 },
          ],
        },
      ],
    };
    const s = solveCircuit(toNetlist(root));
    expect(s.ok).toBe(true);
    const by = (id: string) => s.elements.find((e) => e.id === id)!;
    expect(Math.abs(by('a').current)).toBeCloseTo(3);
    expect(Math.abs(by('b').current)).toBeCloseTo(2);
    expect(Math.abs(by('c').current)).toBeCloseTo(1);
    expect(Math.abs(by('b').voltage)).toBeCloseTo(6);
    expect(labelBlocks(root).get('c')).toBe('R3');
  });

  it('conserves power', () => {
    const root: Block = {
      type: 'series',
      id: 'root',
      items: [
        { type: 'cell', id: 'e', emf: 9, r: 0.5 },
        { type: 'parallel', id: 'p', items: [{ type: 'resistor', id: 'a', r: 10 }, { type: 'resistor', id: 'b', r: 15 }] },
        { type: 'resistor', id: 'c', r: 4 },
      ],
    };
    const s = solveCircuit(toNetlist(root));
    const delivered = s.elements.filter((e) => e.kind === 'cell').reduce((n, e) => n + e.power, 0);
    const used = s.elements.filter((e) => e.kind === 'resistor').reduce((n, e) => n + e.power, 0);
    // The rest is lost in the cell's internal resistance, I²r.
    const I = s.elements.find((e) => e.kind === 'cell')!.current;
    expect(delivered).toBeCloseTo(used, 8);
    expect(9 * I).toBeCloseTo(used + I * I * 0.5, 8);
  });

  it('explains a circuit it cannot solve', () => {
    expect(solveCircuit([{ kind: 'resistor', id: 'r', label: 'R1', a: 1, b: 0, r: 5 }]).message).toMatch(/Add a cell/);
    expect(solveCircuit([{ kind: 'cell', id: 'e', label: 'E1', a: 1, b: 0, emf: 5, r: 0 }, { kind: 'resistor', id: 'r', label: 'R1', a: 1, b: 0, r: 0 }]).message).toMatch(/above 0/);
    const parallelIdeal = solveCircuit([
      { kind: 'cell', id: 'a', label: 'E1', a: 1, b: 0, emf: 5, r: 0 },
      { kind: 'cell', id: 'b', label: 'E2', a: 1, b: 0, emf: 6, r: 0 },
    ]);
    expect(parallelIdeal.ok).toBe(false);
  });
});

describe('titration', () => {
  const strong: TitrationSetup = { kind: 'strong-acid-strong-base', analyteC: 0.1, analyteV: 25, titrantC: 0.1, pK: 0 };
  const weak: TitrationSetup = { kind: 'weak-acid-strong-base', analyteC: 0.1, analyteV: 25, titrantC: 0.1, pK: 4.76 };
  const weakBase: TitrationSetup = { kind: 'weak-base-strong-acid', analyteC: 0.1, analyteV: 25, titrantC: 0.1, pK: 4.75 };

  it('strong acid with strong base follows the textbook values', () => {
    expect(equivalenceVolume(strong)).toBe(25);
    expect(phAfter(strong, 0)).toBeCloseTo(1, 2);
    expect(phAfter(strong, 25)).toBeCloseTo(7, 2);
    // 5 mL excess of 0.1 M in 55 mL: [OH⁻] = 0.5/55... after 30 mL: 0.5 mmol in 55 mL
    expect(phAfter(strong, 30)).toBeCloseTo(14 + Math.log10(0.5 / 55), 2);
    // Before equivalence: 20 mL added leaves 0.5 mmol in 45 mL
    expect(phAfter(strong, 20)).toBeCloseTo(-Math.log10(0.5 / 45), 2);
  });

  it('weak acid: starting pH, half-equivalence equals pKa, basic equivalence point', () => {
    // [H⁺] ≈ √(Ka·C) = √(1.74×10⁻⁵ × 0.1), so pH ≈ 2.88
    expect(phAfter(weak, 0)).toBeCloseTo(2.88, 1);
    expect(phAfter(weak, 12.5)).toBeCloseTo(4.76, 2);
    // Salt at 0.05 M: pH = 7 + ½pKa + ½log C = 8.73
    expect(phAfter(weak, 25)).toBeCloseTo(8.73, 1);
  });

  it('weak base with strong acid has an acidic equivalence point', () => {
    expect(phAfter(weakBase, 0)).toBeGreaterThan(10);
    expect(phAfter(weakBase, 25)).toBeLessThan(7);
    // At half-equivalence, pOH = pKb.
    expect(phAfter(weakBase, 12.5)).toBeCloseTo(14 - 4.75, 1);
  });

  it('strong base with strong acid falls from high pH', () => {
    const s: TitrationSetup = { ...strong, kind: 'strong-base-strong-acid' };
    expect(phAfter(s, 0)).toBeCloseTo(13, 2);
    expect(phAfter(s, 25)).toBeCloseTo(7, 2);
    expect(phAfter(s, 50)).toBeLessThan(2);
  });

  it('pH always moves one way as titrant is added', () => {
    for (const setup of [strong, weak]) {
      let last = -Infinity;
      for (let v = 0; v <= 50; v += 0.5) {
        const ph = phAfter(setup, v);
        expect(ph).toBeGreaterThan(last);
        last = ph;
      }
    }
  });

  it('chooses indicators the way textbooks do', () => {
    // Weak acid/strong base: phenolphthalein, because the equivalence point is basic.
    expect(bestIndicator(weak).name).toBe('Phenolphthalein');
    expect(suitableIndicators(weak).map((i) => i.name)).toContain('Phenolphthalein');
    expect(suitableIndicators(weak).map((i) => i.name)).not.toContain('Methyl orange');
    // Strong acid/weak base: methyl orange or methyl red, because it is acidic.
    expect(['Methyl orange', 'Methyl red']).toContain(bestIndicator(weakBase).name);
    expect(suitableIndicators(weakBase).map((i) => i.name)).not.toContain('Phenolphthalein');
    // Strong/strong: the jump is wide, so several work.
    expect(suitableIndicators(strong).length).toBeGreaterThanOrEqual(3);
  });
});

describe('graph plotter maths', () => {
  it('differentiates', () => {
    expect(derivative((x) => x * x, 3)).toBeCloseTo(6, 6);
    expect(derivative(Math.sin, 0)).toBeCloseTo(1, 6);
  });

  it('integrates', () => {
    expect(integrate((x) => x * x, 0, 3)).toBeCloseTo(9, 6);
    expect(integrate(Math.sin, 0, Math.PI)).toBeCloseTo(2, 6);
    expect(integrate(Math.exp, 0, 1)).toBeCloseTo(Math.E - 1, 6);
  });

  it('finds roots and ignores a pole', () => {
    expect(roots((x) => x * x - 4, -5, 5).map((r) => Number(r.toFixed(6)))).toEqual([-2, 2]);
    expect(roots((x) => 1 / x, -1, 1.001)).toEqual([]);
  });

  it('finds intersections', () => {
    const points = intersections((x) => x * x, (x) => x + 2, -5, 5);
    expect(points.map((p) => Number(p.toFixed(6)))).toEqual([-1, 2]);
  });
});
