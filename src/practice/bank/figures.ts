// Helpers for hand-written diagram questions: a curve from a function, a graph of a few lines, and a sketch from marks.
// Kept out of written/, which the bank loads question by question.
import type { DiagramSpec, SketchMark } from './diagram';

/** Points along y = f(x), for a graph line. */
export function plot(f: (x: number) => number, from: number, to: number, steps = 30): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const x = from + ((to - from) * i) / steps;
    out.push([Math.round(x * 1000) / 1000, Math.round(f(x) * 1000) / 1000]);
  }
  return out;
}

type Line = { label?: string; points: [number, number][] };

/** A graph with axes named, and its lines. */
export function graph(x: string, y: string, lines: Line[], ticks: { x?: [number, string][]; y?: [number, string][]; xFrom?: number; yFrom?: number } = {}): DiagramSpec {
  return { kind: 'graph', x, y, lines, ...(ticks.x ? { ticksX: ticks.x } : {}), ...(ticks.y ? { ticksY: ticks.y } : {}), ...(ticks.xFrom !== undefined ? { xFrom: ticks.xFrom } : {}), ...(ticks.yFrom !== undefined ? { yFrom: ticks.yFrom } : {}) };
}

/** A sketch drawn from marks, with the words a screen reader gives in its place. */
export function sketch(w: number, h: number, alt: string, marks: SketchMark[]): DiagramSpec {
  return { kind: 'sketch', w, h, alt, marks };
}

/** A label at a point. */
export const label = (x: number, y: number, s: string, a?: 'start' | 'middle' | 'end'): SketchMark => ({ t: 'text', x, y, s, ...(a ? { a } : {}) });
/** A straight line, or a run of them. */
export const line = (p: [number, number][], opts: { dash?: 1; arrow?: 1 } = {}): SketchMark => ({ t: 'line', p, ...opts });
/** An arrow from one point to another. */
export const arrow = (from: [number, number], to: [number, number]): SketchMark => ({ t: 'line', p: [from, to], arrow: 1 });

/** A table of data to read from. */
export function table(head: string[], rows: string[][], caption?: string): DiagramSpec {
  return { kind: 'table', head, rows, ...(caption ? { caption } : {}) };
}
