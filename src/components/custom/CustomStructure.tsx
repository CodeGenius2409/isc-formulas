import { memo, useEffect, useState } from 'react';
import { parseStructure, type ParsedMolecule, type ParsedStructure } from '../../custom/smiles';

/** A drawing made here, from SMILES the app has just parsed, so it holds no outside markup. */
function Drawing({ molecule, scale = 0.55 }: { molecule: ParsedMolecule; scale?: number }) {
  return <span className="custom-molecule" style={{ width: 300 * scale, height: 220 * scale }} role="img" aria-label={`Structure with formula ${molecule.formula}`} dangerouslySetInnerHTML={{ __html: molecule.svg }} />;
}

function Side({ list, scale }: { list: ParsedMolecule[]; scale?: number }) {
  return (
    <>
      {list.map((molecule, i) => (
        <span key={`${molecule.smiles}${i}`} className="scheme-mol">
          {i > 0 && <span className="scheme-op">+</span>}
          <Drawing molecule={molecule} scale={scale} />
        </span>
      ))}
    </>
  );
}

export function StructureDrawing({ parsed, scale }: { parsed: ParsedStructure; scale?: number }) {
  return (
    <div className="scheme-row">
      <Side list={parsed.reactants} scale={scale} />
      {parsed.isReaction && (
        <>
          <span className="scheme-arrow">
            <span aria-hidden>→</span>
            <span className="sr-only"> gives </span>
          </span>
          <Side list={parsed.products} scale={scale} />
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
