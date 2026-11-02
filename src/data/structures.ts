// Bond-line structures, drawn and checked in the build by scripts/apply-structures.mjs. They arrive as
// finished paths, in one file that loads the first time a page needs a structure.
import { useEffect, useState } from 'react';

export interface Compound {
  /** Name. */
  n: string;
  /** Molecular formula. */
  m: string;
  /** Molar mass. */
  a: number;
  s: string;
  /** Functional groups, highest priority first. */
  g: string[];
  w: number;
  h: number;
  /** The bonds, stroked. */
  l: string;
  /** The atom labels, filled. */
  f: string;
}

export type Compounds = Record<string, Compound>;

let loaded: Compounds | null = null;
let loading: Promise<Compounds> | null = null;

export function loadStructures(): Promise<Compounds> {
  loading ??= import('./generated/structures.json').then((m) => {
    loaded = m.default as unknown as Compounds;
    return loaded;
  });
  loading.catch(() => {
    loading = null;
  });
  return loading;
}

/** The compounds once they have loaded, or null while they load. Pass false to not load them yet. */
export function useStructures(wanted = true): Compounds | null {
  const [value, setValue] = useState<Compounds | null>(loaded);
  useEffect(() => {
    if (!wanted || value) return undefined;
    let live = true;
    void loadStructures().then(
      (compounds) => {
        if (live) setValue(compounds);
      },
      () => undefined,
    );
    return () => {
      live = false;
    };
  }, [wanted, value]);
  return value;
}
