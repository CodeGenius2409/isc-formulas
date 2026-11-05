import { memo, useEffect, useState } from 'react';
import { parseStructure, type ParsedMolecule, type ParsedStructure } from '../../custom/smiles';

/** Which atom of which compound. Compounds count across the reaction, reactants first. */
export interface ActiveAtom {
  molecule: number;
  atom: number;
}

interface Pointing {
  active?: ActiveAtom | null;
  /** Hovering or tapping an atom. Null when the pointer leaves. */
  onAtom?: (atom: ActiveAtom | null, tapped?: boolean) => void;
}

/** A drawing made here, from SMILES the app has just parsed, so it holds no outside markup. */
function Drawing({ molecule, scale = 0.55, index, active, onAtom }: { molecule: ParsedMolecule; scale?: number; index: number } & Pointing) {
  return (
    <span className="custom-molecule" style={{ width: 300 * scale, height: 220 * scale }} role="img" aria-label={`Structure with formula ${molecule.formula}`}>
      <span className="custom-molecule-art" dangerouslySetInnerHTML={{ __html: molecule.svg }} />
      {onAtom && molecule.points.length > 0 && (
        <svg className="atom-map" viewBox={molecule.viewBox} aria-hidden>
          {molecule.points.map((p, i) =>
            p ? (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={13}
                data-atom={i}
                data-active={active?.molecule === index && active.atom === i ? true : undefined}
                onPointerEnter={() => onAtom({ molecule: index, atom: i })}
                onPointerLeave={() => onAtom(null)}
                onClick={() => onAtom({ molecule: index, atom: i }, true)}
              />
            ) : null,
          )}
        </svg>
      )}
    </span>
  );
}

function Side({ list, scale, offset, ...pointing }: { list: ParsedMolecule[]; scale?: number; offset: number } & Pointing) {
  return (
    <>
      {list.map((molecule, i) => (
        <span key={`${molecule.smiles}${i}`} className="scheme-mol">
          {i > 0 && <span className="scheme-op">+</span>}
          <Drawing molecule={molecule} scale={scale} index={offset + i} {...pointing} />
        </span>
      ))}
    </>
  );
}

export function StructureDrawing({ parsed, scale, ...pointing }: { parsed: ParsedStructure; scale?: number } & Pointing) {
  return (
    <div className="scheme-row">
      <Side list={parsed.reactants} scale={scale} offset={0} {...pointing} />
      {parsed.isReaction && (
        <>
          <span className="scheme-arrow">
            <span aria-hidden>→</span>
            <span className="sr-only"> gives </span>
          </span>
          <Side list={parsed.products} scale={scale} offset={parsed.reactants.length} {...pointing} />
        </>
      )}
    </div>
  );
}

/** A structure from one of your formulas. The drawing engine loads the first time one is on screen. */
export const CustomStructure = memo(function CustomStructure({ smiles, scale }: { smiles: string; scale?: number }) {
  const [parsed, setParsed] = useState<ParsedStructure | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    parseStructure(smiles).then(
      (value) => {
        if (live) setParsed(value);
      },
      () => {
        if (live) setFailed(true);
      },
    );
    return () => {
      live = false;
    };
  }, [smiles]);
  if (failed) return <p className="text-step--1 text-ink-2">This structure can't be drawn: {smiles}</p>;
  if (!parsed) return <div className="structures" aria-hidden />;
  return (
    <div className="structures">
      <StructureDrawing parsed={parsed} scale={scale} />
    </div>
  );
});
