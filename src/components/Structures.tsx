import { memo, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useStructures, type Compound, type Compounds } from '../data/structures';
import type { EntryStructure, StructureToken } from '../data/types';

const SUBSCRIPT: Record<string, string> = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };

/** H2SO4 as H₂SO₄, for the small species drawn as words beside a structure. */
export function chemText(text: string): string {
  return text.replace(/([A-Za-z)\]])(\d+)/g, (_, before: string, digits: string) => before + [...digits].map((d) => SUBSCRIPT[d]).join('')).replace(/\^\+/g, '⁺').replace(/\^-/g, '⁻');
}

/** A molecule, in the colour of the text around it, so each theme draws it in its own ink or chalk. */
export function Molecule({ compound, scale = 1 }: { compound: Compound; scale?: number }) {
  return (
    <svg className="molecule" viewBox={`0 0 ${compound.w} ${compound.h}`} width={compound.w * scale} height={compound.h * scale} role="img" aria-label={compound.m ? `${compound.n}, ${chemText(compound.m)}` : compound.n}>
      <path d={compound.l} fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d={compound.f} fill="currentColor" />
    </svg>
  );
}

/** A molecule that opens larger when tapped. */
function ZoomMolecule({ compound, scale, onOpen }: { compound: Compound; scale: number; onOpen: (c: Compound) => void }) {
  return (
    <button type="button" className="molecule-button" title={compound.n} aria-label={`Enlarge ${compound.n}, ${chemText(compound.m)}`} onClick={() => onOpen(compound)}>
      <Molecule compound={compound} scale={scale} />
    </button>
  );
}

function Token({ token, compounds, scale, onOpen }: { token: StructureToken; compounds: Compounds; scale: number; onOpen: (c: Compound) => void }) {
  if ('op' in token) return <span className="scheme-op">+</span>;
  if ('r' in token) {
    return (
      <span className="scheme-arrow">
        {token.r && <small>{chemText(token.r)}</small>}
        <span aria-hidden>{token.b ? '⇌' : '→'}</span>
        <span className="sr-only">{token.b ? ' is in equilibrium with ' : ' gives '}</span>
      </span>
    );
  }
  const count = token.c && token.c > 1 ? <span className="scheme-count">{token.c}</span> : null;
  if ('t' in token) {
    return (
      <span className="scheme-word">
        {count}
        {chemText(token.t)}
      </span>
    );
  }
  const compound = compounds[token.s];
  if (!compound) return null;
  return (
    <span className="scheme-mol">
      {count}
      <ZoomMolecule compound={compound} scale={scale} onOpen={onOpen} />
    </span>
  );
}

interface Props {
  structure: EntryStructure;
  /** Larger on a formula's own page than in a list. */
  scale?: number;
}

/** The structures for one entry: a list of compounds, or a reaction drawn out. */
export const EntryStructures = memo(function EntryStructures({ structure, scale = 0.8 }: Props) {
  const compounds = useStructures();
  const [open, setOpen] = useState<Compound | null>(null);
  if (!compounds) return <div className="structures" aria-hidden />;
  return (
    <div className="structures">
      {structure.example && <p className="scheme-example">For example</p>}
      {structure.list && (
        <div className="scheme-row">
          {structure.list.map((key) =>
            compounds[key] ? (
              <figure key={key} className="scheme-named">
                {structure.unnamed ? <Molecule compound={{ ...compounds[key], n: 'A compound', m: '' }} scale={scale} /> : <ZoomMolecule compound={compounds[key]} scale={scale} onOpen={setOpen} />}
                {!structure.unnamed && <figcaption>{compounds[key].n}</figcaption>}
              </figure>
            ) : null,
          )}
        </div>
      )}
      {structure.rows?.map((row, i) => (
        <div key={i} className="scheme-row">
          {row.map((token, j) => (
            <Token key={j} token={token} compounds={compounds} scale={scale} onOpen={setOpen} />
          ))}
        </div>
      ))}
      {open && <EnlargedMolecule compound={open} onClose={() => setOpen(null)} />}
    </div>
  );
});

function EnlargedMolecule({ compound, onClose }: { compound: Compound; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  // As large as the screen allows, with room for its name.
  const room = Math.min((window.innerWidth - 64) / compound.w, (window.innerHeight - 220) / compound.h);
  return (
    <dialog
      ref={ref}
      className="molecule-zoom"
      aria-label={compound.n}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="molecule-zoom-head">
        <h2>{compound.n}</h2>
        <button type="button" className="btn btn-quiet" aria-label="Close" onClick={onClose}>
          <X size={18} aria-hidden />
        </button>
      </div>
      <div className="molecule-zoom-body">
        <Molecule compound={compound} scale={Math.min(room, 3.2)} />
      </div>
      <p className="molecule-zoom-facts">
        <span className="num">{chemText(compound.m)}</span> · <span className="num">{compound.a} g/mol</span>
        {compound.g.length > 0 && <> · {compound.g.join(', ')}</>}
      </p>
    </dialog>
  );
}
