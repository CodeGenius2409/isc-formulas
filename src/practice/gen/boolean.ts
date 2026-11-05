// Exact Boolean algebra for generated Computer Science questions. Quine–McCluskey gives a minimal sum of products,
// and a brute-force check confirms it, so an answer can't be wrong even when a K-map could be read two ways.

export const VARS = ['A', 'B', 'C', 'D'];

export interface Implicant {
  /** Bits that must match, from the most significant variable down. */
  value: number;
  /** Bits that don't matter. */
  mask: number;
  covers: number[];
}

const popcount = (x: number): number => {
  let n = 0;
  for (let v = x; v; v &= v - 1) n++;
  return n;
};

/** All prime implicants of the given minterms. */
export function primeImplicants(minterms: number[], dontCares: number[] = []): Implicant[] {
  let layer = new Map<string, Implicant>();
  for (const m of [...minterms, ...dontCares]) layer.set(`${m}/0`, { value: m, mask: 0, covers: [m] });
  const primes: Implicant[] = [];
  while (layer.size) {
    const items = [...layer.values()];
    const used = new Set<string>();
    const next = new Map<string, Implicant>();
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];
        if (a.mask !== b.mask) continue;
        const diff = a.value ^ b.value;
        if (popcount(diff) !== 1) continue;
        const merged = { value: a.value & ~diff, mask: a.mask | diff, covers: [...new Set([...a.covers, ...b.covers])].sort((x, y) => x - y) };
        next.set(`${merged.value}/${merged.mask}`, merged);
        used.add(`${a.value}/${a.mask}`);
        used.add(`${b.value}/${b.mask}`);
      }
    }
    for (const item of items) if (!used.has(`${item.value}/${item.mask}`)) primes.push(item);
    layer = next;
  }
  return primes;
}

/** A smallest set of prime implicants covering the minterms: essentials first, then an exhaustive search of the rest. */
export function minimalCover(minterms: number[], primes: Implicant[]): Implicant[] {
  const chosen: Implicant[] = [];
  const left = new Set(minterms);
  for (const m of minterms) {
    const covering = primes.filter((p) => p.covers.includes(m));
    if (covering.length === 1 && !chosen.includes(covering[0])) {
      chosen.push(covering[0]);
    }
  }
  for (const p of chosen) for (const m of p.covers) left.delete(m);
  const rest = primes.filter((p) => !chosen.includes(p));
  let best: Implicant[] | null = null;
  const cost = (list: Implicant[]) => list.length * 100 + list.reduce((sum, p) => sum + (4 - popcount(p.mask)), 0);
  const search = (index: number, picked: Implicant[], need: Set<number>) => {
    if (!need.size) {
      if (!best || cost(picked) < cost(best)) best = picked;
      return;
    }
    if (index >= rest.length || (best && picked.length >= best.length)) return;
    const p = rest[index];
    if (p.covers.some((m) => need.has(m))) {
      const after = new Set(need);
      for (const m of p.covers) after.delete(m);
      search(index + 1, [...picked, p], after);
    }
    search(index + 1, picked, need);
  };
  search(0, [], left);
  return [...chosen, ...(best ?? [])].sort((a, b) => a.value - b.value || a.mask - b.mask);
}

const complement = (name: string) => `${name}′`;

/** One product term, such as AB′C. */
export function termText(p: Implicant, size: number): string {
  let out = '';
  for (let i = 0; i < size; i++) {
    const bit = 1 << (size - 1 - i);
    if (p.mask & bit) continue;
    out += p.value & bit ? VARS[i] : complement(VARS[i]);
  }
  return out || '1';
}

export function sopText(list: Implicant[], size: number): string {
  return list.length ? list.map((p) => termText(p, size)).join(' + ') : '0';
}

/** Does this cover give exactly the wanted function? A last check, on every row. */
export function coverIsRight(list: Implicant[], minterms: number[], size: number, dontCares: number[] = []): boolean {
  for (let row = 0; row < 2 ** size; row++) {
    if (dontCares.includes(row)) continue;
    const on = list.some((p) => (row & ~p.mask) === (p.value & ~p.mask));
    if (on !== minterms.includes(row)) return false;
  }
  return true;
}

/** How many squares each group of a K-map holds. */
export function groupNames(list: Implicant[]): string {
  const names: Record<number, string> = { 1: 'single', 2: 'pair', 4: 'quad', 8: 'octet' };
  return list.map((p) => `${names[p.covers.length] ?? `group of ${p.covers.length}`} ${termLabel(p)}`).join(', ');
}

function termLabel(p: Implicant): string {
  return `{${p.covers.join(', ')}}`;
}

/** The Gray-code layout of a K-map, so a question can draw one. */
export function kmapRows(size: number, minterms: number[]): { head: string[]; rows: string[][] } {
  const gray = ['00', '01', '11', '10'];
  const rowCodes = size === 4 ? gray : ['0', '1'];
  const cols = size === 2 ? ['0', '1'] : gray;
  const rowLabel = size === 4 ? 'AB\\CD' : size === 3 ? 'A\\BC' : 'A\\B';
  return {
    head: [rowLabel, ...cols],
    rows: rowCodes.map((r) => [r, ...cols.map((c) => (minterms.includes(parseInt(r + c, 2)) ? '1' : '0'))]),
  };
}

/** Evaluates a small proposition, written with a function, across all the rows of its truth table. */
export function truthColumn(size: number, f: (bits: boolean[]) => boolean): boolean[] {
  const out: boolean[] = [];
  for (let row = 0; row < 2 ** size; row++) {
    const bits = Array.from({ length: size }, (_, i) => Boolean(row & (1 << (size - 1 - i))));
    out.push(f(bits));
  }
  return out;
}

export function classify(column: boolean[]): 'tautology' | 'contradiction' | 'contingency' {
  if (column.every(Boolean)) return 'tautology';
  if (!column.some(Boolean)) return 'contradiction';
  return 'contingency';
}
