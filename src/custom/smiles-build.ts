// The builder buttons. It keeps a small description of what's been built and writes the SMILES from that,
// so you can add a group by name and position without knowing how brackets and ring numbers work.

export type CoreKind = 'benzene' | 'cyclohexane' | 'cyclopentane' | 'pyridine' | 'chain';

export type GroupKey = 'OH' | 'NO2' | 'Cl' | 'Br' | 'NH2' | 'CH3' | 'CHO' | 'COOH' | 'OCH3';

export interface BuilderState {
  core: CoreKind;
  /** Carbons in a chain. Rings ignore it. */
  length: number;
  /** Position to group. Positions count from 1. */
  groups: Partial<Record<number, GroupKey>>;
}

export const GROUPS: { key: GroupKey; label: string; smiles: string }[] = [
  { key: 'OH', label: '–OH', smiles: 'O' },
  { key: 'NO2', label: '–NO₂', smiles: '[N+](=O)[O-]' },
  { key: 'Cl', label: '–Cl', smiles: 'Cl' },
  { key: 'Br', label: '–Br', smiles: 'Br' },
  { key: 'NH2', label: '–NH₂', smiles: 'N' },
  { key: 'CH3', label: '–CH₃', smiles: 'C' },
  { key: 'CHO', label: '–CHO', smiles: 'C=O' },
  { key: 'COOH', label: '–COOH', smiles: 'C(=O)O' },
  { key: 'OCH3', label: '–OCH₃', smiles: 'OC' },
];

export const CORES: { key: CoreKind; label: string; size: number }[] = [
  { key: 'benzene', label: 'Benzene', size: 6 },
  { key: 'cyclohexane', label: 'Cyclohexane', size: 6 },
  { key: 'cyclopentane', label: 'Cyclopentane', size: 5 },
  { key: 'pyridine', label: 'Pyridine', size: 6 },
  { key: 'chain', label: 'Chain', size: 0 },
];

const groupSmiles = (key: GroupKey) => GROUPS.find((g) => g.key === key)!.smiles;

export function sizeOf(state: BuilderState): number {
  return state.core === 'chain' ? state.length : CORES.find((c) => c.key === state.core)!.size;
}

export const isRing = (core: CoreKind) => core !== 'chain';

/** Which ring atom is what. In pyridine, position 1 is the nitrogen, so it can't carry a group. */
export function canHold(state: BuilderState, position: number): boolean {
  if (position < 1 || position > sizeOf(state)) return false;
  return !(state.core === 'pyridine' && position === 1);
}

function atomText(core: CoreKind, position: number): string {
  switch (core) {
    case 'benzene':
      return 'c';
    case 'pyridine':
      return position === 1 ? 'n' : 'c';
    default:
      return 'C';
  }
}

/** Writes it out. A group at position p comes straight after that atom, in brackets. */
export function writeSmiles(state: BuilderState): string {
  const size = sizeOf(state);
  let out = '';
  for (let p = 1; p <= size; p++) {
    out += atomText(state.core, p);
    if (isRing(state.core) && (p === 1 || p === size)) out += '1';
    const group = state.groups[p];
    if (group) out += p === size && !isRing(state.core) ? groupSmiles(group) : `(${groupSmiles(group)})`;
  }
  return out;
}

export type Relation = 'ortho' | 'meta' | 'para';

const STEPS: Record<Relation, number[]> = { ortho: [1, -1], meta: [2, -2], para: [3] };

/** The free ring position in the given relation to `from`, if there is one. Only six-membered rings have these. */
export function relatedPosition(state: BuilderState, from: number, relation: Relation): number | null {
  if (!isRing(state.core) || sizeOf(state) !== 6) return null;
  for (const step of STEPS[relation]) {
    const p = ((from - 1 + step + 6) % 6) + 1;
    if (!state.groups[p] && canHold(state, p)) return p;
  }
  return null;
}

export function addGroup(state: BuilderState, position: number, group: GroupKey): BuilderState {
  return canHold(state, position) ? { ...state, groups: { ...state.groups, [position]: group } } : state;
}

export function removeGroup(state: BuilderState, position: number): BuilderState {
  const groups = { ...state.groups };
  delete groups[position];
  return { ...state, groups };
}

export function startCore(core: CoreKind, length = 4): BuilderState {
  return { core, length: Math.max(1, Math.min(12, length)), groups: {} };
}
