// DC circuit analysis by modified nodal analysis: Kirchhoff's current law at every
// node, plus one equation for each ideal voltage source.

export type Element =
  | { kind: 'resistor'; id: string; label: string; a: number; b: number; r: number }
  /** A cell with its positive terminal at `a`, and internal resistance r. */
  | { kind: 'cell'; id: string; label: string; a: number; b: number; emf: number; r: number };

export interface ElementResult {
  id: string;
  label: string;
  kind: Element['kind'];
  /** Current through it, from a to b for a resistor, and out of + for a cell. */
  current: number;
  /** Voltage across it: terminal voltage for a cell. */
  voltage: number;
  /** Power dissipated in a resistor, or delivered by a cell. */
  power: number;
}

export interface CircuitSolution {
  ok: boolean;
  message?: string;
  nodeVoltages: number[];
  elements: ElementResult[];
}

/** Gaussian elimination with partial pivoting. Null if the system is singular. */
export function solveLinear(matrix: number[][], rhs: number[]): number[] | null {
  const n = rhs.length;
  const a = matrix.map((row, i) => [...row, rhs[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let row = col + 1; row < n; row++) if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
    if (Math.abs(a[pivot][col]) < 1e-12) return null;
    [a[col], a[pivot]] = [a[pivot], a[col]];
    for (let row = col + 1; row < n; row++) {
      const f = a[row][col] / a[col][col];
      if (f === 0) continue;
      for (let k = col; k <= n; k++) a[row][k] -= f * a[col][k];
    }
  }
  const x = new Array<number>(n).fill(0);
  for (let row = n - 1; row >= 0; row--) {
    let sum = a[row][n];
    for (let k = row + 1; k < n; k++) sum -= a[row][k] * x[k];
    x[row] = sum / a[row][row];
  }
  return x;
}

/**
 * Solves a circuit. Node 0 is the reference. Each cell gets an internal node between
 * its ideal source and its internal resistance, so that r may be zero.
 */
export function solveCircuit(elements: Element[]): CircuitSolution {
  const fail = (message: string): CircuitSolution => ({ ok: false, message, nodeVoltages: [], elements: [] });
  if (!elements.some((e) => e.kind === 'cell')) return fail('Add a cell, so that something drives the circuit.');
  for (const e of elements) {
    if (e.kind === 'resistor' && !(e.r > 0)) return fail(`${e.label} needs a resistance above 0.`);
    if (e.kind === 'cell' && e.r < 0) return fail(`${e.label} cannot have a negative internal resistance.`);
  }
  const nodeCount = Math.max(...elements.flatMap((e) => [e.a, e.b])) + 1;
  const cells = elements.filter((e) => e.kind === 'cell');

  // Unknowns: voltages of nodes 1..n-1, then one current per cell.
  const nv = nodeCount - 1;
  const size = nv + cells.length;
  const A = Array.from({ length: size }, () => new Array<number>(size).fill(0));
  const z = new Array<number>(size).fill(0);
  const node = (i: number) => i - 1; // node 0 is ground, and has no row

  const stamp = (a: number, b: number, g: number) => {
    if (a > 0) A[node(a)][node(a)] += g;
    if (b > 0) A[node(b)][node(b)] += g;
    if (a > 0 && b > 0) {
      A[node(a)][node(b)] -= g;
      A[node(b)][node(a)] -= g;
    }
  };

  for (const e of elements) {
    if (e.kind === 'resistor') stamp(e.a, e.b, 1 / e.r);
  }
  cells.forEach((cell, i) => {
    const row = nv + i;
    // Current i flows out of the + terminal into node a, returning at node b.
    if (cell.a > 0) A[node(cell.a)][row] -= 1;
    if (cell.b > 0) A[node(cell.b)][row] += 1;
    // V(a) − V(b) = emf − i·r
    if (cell.a > 0) A[row][node(cell.a)] += 1;
    if (cell.b > 0) A[row][node(cell.b)] -= 1;
    A[row][row] += cell.r;
    z[row] = cell.emf;
  });

  const x = solveLinear(A, z);
  if (!x) return fail('This circuit has no unique solution. Check for a part left unconnected, or ideal cells in parallel.');

  const voltage = (i: number) => (i === 0 ? 0 : x[node(i)]);
  const results: ElementResult[] = elements.map((e) => {
    if (e.kind === 'resistor') {
      const v = voltage(e.a) - voltage(e.b);
      const current = v / e.r;
      return { id: e.id, label: e.label, kind: e.kind, current, voltage: v, power: v * current };
    }
    const current = x[nv + cells.indexOf(e)];
    const v = voltage(e.a) - voltage(e.b);
    return { id: e.id, label: e.label, kind: e.kind, current, voltage: v, power: v * current };
  });
  return { ok: true, nodeVoltages: Array.from({ length: nodeCount }, (_, i) => voltage(i)), elements: results };
}

/** A circuit as nested series and parallel groups, closed into one loop. */
export type Block =
  | { type: 'resistor'; id: string; r: number }
  | { type: 'cell'; id: string; emf: number; r: number }
  | { type: 'series'; id: string; items: Block[] }
  | { type: 'parallel'; id: string; items: Block[] };

/** Numbers parts R1, R2, E1, E2 in reading order. */
export function labelBlocks(root: Block): Map<string, string> {
  const labels = new Map<string, string>();
  let r = 0;
  let e = 0;
  const walk = (b: Block) => {
    if (b.type === 'resistor') labels.set(b.id, `R${++r}`);
    else if (b.type === 'cell') labels.set(b.id, `E${++e}`);
    else b.items.forEach(walk);
  };
  walk(root);
  return labels;
}

/** Turns the nested description into a netlist, closing the loop back to node 0. */
export function toNetlist(root: Block): Element[] {
  const labels = labelBlocks(root);
  const out: Element[] = [];
  let next = 1;
  const build = (b: Block, a: number, end: number) => {
    if (b.type === 'resistor') out.push({ kind: 'resistor', id: b.id, label: labels.get(b.id)!, a, b: end, r: b.r });
    else if (b.type === 'cell') out.push({ kind: 'cell', id: b.id, label: labels.get(b.id)!, a: end, b: a, emf: b.emf, r: b.r });
    else if (b.type === 'parallel') {
      for (const item of b.items) build(item, a, end);
    } else {
      let from = a;
      b.items.forEach((item, i) => {
        const to = i === b.items.length - 1 ? end : next++;
        build(item, from, to);
        from = to;
      });
    }
  };
  build(root, 0, 0);
  return out;
}
