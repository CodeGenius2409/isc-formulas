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
      if (key !== 'kind' && key !== 'type' && key !== 'meter' && key !== 'dir' && key !== 'sign' && key !== 'lens' && key !== 'mirror' && key !== 'ends' && key !== 'body') out.push(node);
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
            // Its frequencies are read off the graph: the words point to them and don't repeat them.
            if (bp.id.endsWith('stopping-graph')) continue;
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

    it('every simulator has a static figure of the same set-up, for print and mock papers', () => {
      for (const bp of set.blueprints) {
        for (let seed = 0; seed < 20; seed++) {
          const item = generateItem(bp, seed, set.names(bp));
          if (item.simulator) expect(item.diagram, `${bp.id} opens a simulator, and has nothing to print`).toBeDefined();
        }
      }
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
    { kind: 'vectors', a: '2 N', b: '3 N', angle: '60°', deg: 60 },
    { kind: 'circle', r: '1 m', v: '2 m/s' },
    { kind: 'hill', H: '10 m', point: { label: '2 m', fraction: 0.2 } },
    { kind: 'trolleys', a: '1 kg', b: '2 kg', v: '3 m/s' },
    { kind: 'lever', r: '1 m', F: '2 N', angle: '30°', deg: 30 },
    { kind: 'axis-masses', items: [{ m: '1 kg', x: 'x = 0' }] },
    { kind: 'pipe', a1: '2 cm²', v1: '1 m/s', a2: '1 cm²' },
    { kind: 'tank', h: '2 m' },
    { kind: 'capillary', r: '1 mm' },
    { kind: 'engine', hot: '500 K', cold: '300 K' },
    { kind: 'standing', ends: 'closed', L: '1 m' },
    { kind: 'in-field', body: 'wire', B: '1 T', label: '1 m', angle: '30°', deg: 30 },
    { kind: 'parallel-wires', i1: '1 A', i2: '2 A', d: '3 cm', same: true },
    { kind: 'field-entry', B: '1 T', v: '1 m/s', q: 'electron' },
    { kind: 'transformer', primary: ['220 V'], secondary: ['6 V'] },
    { kind: 'refraction', i: '30°', r: '20°', iDeg: 30, rDeg: 20, top: 'air', bottom: 'glass' },
    { kind: 'telescope', fo: '50 cm', fe: '2 cm' },
    { kind: 'photoelectric', light: '300 nm', metal: '2 eV' },
    { kind: 'drop', h: '5 m', rebound: { label: '1 m', fraction: 0.2 } },
    { kind: 'hanging', L: '1 m', A: '1 mm²', F: '10 N' },
    { kind: 'lens-surfaces', r1: '10 cm', r2: '20 cm', n: '1.5' },
    { kind: 'coil', turns: '10 turns', r: '5 cm', I: '1 A' },
  ];
  for (const spec of kinds) expect(describeFigure(spec).length, spec.kind).toBeGreaterThan(10);
});
