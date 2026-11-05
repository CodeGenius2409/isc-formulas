// One source of truth: a figure is drawn from the same values as the question, so its numbers must be the question's,
// and it must never give the answer away.
import { describe, expect, it } from 'vitest';
import { loadBlueprints } from '../../src/data/blueprints';
import type { ClassLevel } from '../../src/data/types';
import { generateItem } from '../../src/practice/gen/engine';
import type { DiagramSpec } from '../../src/practice/bank/diagram';
import { SIMS } from '../../src/sims/registry';

// BankDiagram's describe() is a pure function, but its file also holds components, so it's imported the same way.
import { describe as describeFigure } from '../../src/components/bank/BankDiagram';

/** The numbers a person would read off the figure: labels only, not positions. */
function labelsOf(spec: DiagramSpec): string[] {
  const out: string[] = [];
  const walk = (node: unknown, key = ''): void => {
    if (typeof node === 'string') {
      if (key !== 'kind' && key !== 'type' && key !== 'meter' && key !== 'dir' && key !== 'sign' && key !== 'lens' && key !== 'mirror') out.push(node);
    } else if (Array.isArray(node)) {
      node.forEach((n) => walk(n, key));
    } else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (k === 'points' || k === 'at' || k === 'f' || k === 'u') continue;
        walk(v, k);
      }
    }
  };
  walk(spec);
  return out;
}

const SUPER: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };

const numbersIn = (text: string): number[] => [...text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, (c) => SUPER[c]).matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));

for (const level of ['XI', 'XII'] as ClassLevel[]) {
  describe(`Physics ${level}`, async () => {
    const set = await loadBlueprints('physics', level);

    it('every figure’s numbers come from the question, and none is the answer', () => {
      let withFigure = 0;
      for (const bp of set.blueprints) {
        for (let seed = 0; seed < 150; seed++) {
          const item = generateItem(bp, seed, set.names(bp));
          if (!item.diagram) break;
          withFigure++;
          const text = item.text + (item.form === 'numeric' ? item.parts.map((p) => p.ask).join(' ') : '');
          const inText = numbersIn(text);
          const shown = numbersIn(labelsOf(item.diagram).join(' '));
          for (const n of shown) {
            if (n === 0) continue;
            // Worked-out labels, like level energies, are still tied to the words by the test on answers below.
            if (bp.id.endsWith('bohr-energy') || bp.id.endsWith('stopping-graph')) continue;
            expect(inText, `${bp.id} seed ${seed}: ${n} is on the figure but not in the question: ${text}`).toContain(n);
          }
          if (item.form === 'numeric') {
            for (const part of item.parts) {
              for (const answer of part.question.answers) {
                const hit = shown.find((n) => n !== 0 && Math.abs(n - answer) <= Math.abs(answer) * 1e-3);
                if (hit !== undefined) expect(inText, `${bp.id} seed ${seed}: the figure shows the answer ${answer}`).toContain(hit);
              }
            }
          }
          expect(describeFigure(item.diagram).length, `${bp.id}: a figure needs a description`).toBeGreaterThan(10);
        }
      }
      expect(withFigure).toBeGreaterThan(1000);
    });

    it('every simulator named exists, and is given values', () => {
      for (const bp of set.blueprints) {
        for (let seed = 0; seed < 20; seed++) {
          const item = generateItem(bp, seed, set.names(bp));
          if (!item.simulator) break;
          expect(SIMS.some((s) => s.id === item.simulator!.id), `${bp.id}: ${item.simulator.id}`).toBe(true);
          for (const value of Object.values(item.simulator.preset)) expect(Number.isFinite(value)).toBe(true);
        }
      }
    });
  });
}

it('every kind of figure can be put in words', () => {
  const kinds: DiagramSpec[] = [
    { kind: 'cell-parallel', emf: '6 V', r: '1 Ω', r1: '2 Ω', r2: '3 Ω' },
    { kind: 'series-capacitors', c1: '2 µF', c2: '3 µF', v: '12 V' },
    { kind: 'wheatstone', p: '1', q: '2', r: '3', s: '?' },
    { kind: 'circuit', source: { type: 'ac', label: '10 V' }, loop: [{ type: 'R', label: '5 Ω' }, { type: 'parallel', branches: [[{ type: 'C' }], [{ type: 'L' }]] }] },
    { kind: 'lens', lens: 'concave', f: 10, u: 20, fLabel: 'f', uLabel: '20 cm' },
    { kind: 'mirror', mirror: 'convex', f: 10, u: 20, fLabel: 'f', uLabel: '20 cm' },
    { kind: 'prism', angle: '60°' },
    { kind: 'ydse', d: '1 mm', D: '1 m', lambda: '500 nm' },
    { kind: 'graph', x: 't', y: 'v', lines: [{ points: [[0, 0], [1, 1]] }] },
    { kind: 'projectile', v: '10 m/s', angle: '30°' },
    { kind: 'incline', angle: '30°', m: '2 kg' },
    { kind: 'pulley', m1: '1 kg', m2: '2 kg' },
    { kind: 'block', m: '1 kg', forces: [{ dir: 'up', label: 'N' }] },
    { kind: 'charges', items: [{ q: '1 µC', sign: '+' }], gaps: [] },
    { kind: 'wave', amplitude: 'A', wavelength: 'λ' },
    { kind: 'rail', B: '1 T', l: '1 m', v: '1 m/s' },
    { kind: 'wire', I: '1 A', r: '1 cm' },
    { kind: 'solenoid', turns: '100', I: '1 A', length: 'long' },
    { kind: 'spring', k: '10 N/m', m: '1 kg' },
    { kind: 'orbit', height: '100 km', mass: 'M' },
    { kind: 'levels', levels: [{ n: 'n = 1', E: '-13.6 eV', at: -13.6 }] },
    { kind: 'capacitor', A: '1 cm²', d: '1 mm' },
    { kind: 'table', head: ['x'], rows: [['1']] },
    { kind: 'tree', nodes: [{ label: 'A' }] },
  ];
  for (const spec of kinds) expect(describeFigure(spec).length, spec.kind).toBeGreaterThan(10);
});
