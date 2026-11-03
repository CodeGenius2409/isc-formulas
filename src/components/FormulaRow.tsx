import { LazyLewis } from './LazyLewis';
import { memo } from 'react';
import { useState } from 'react';
import { Calculator, Copy, ExternalLink, ListChecks, PenLine, Pencil, Star, Trash2 } from 'lucide-react';
import { deleteCustomFormula } from '../custom/actions';
import { customStore } from '../custom/store';
import { canSolveCustom } from '../solver/index-lite';
import { CustomStructure } from './custom/CustomStructure';
import { getSubject, unitTitle } from '../data/book';
import { copyableExpr, isBodyExpr } from '../data/expr';
import type { Formula, Placement } from '../data/types';
import { useFocusableOverflow } from '../lib/hooks';
import { useKatexReady } from '../lib/katex';
import { href, openWork } from '../lib/router';
import { useStore } from '../lib/store';
import { favouritesStore, noteRecent, toggleFavourite } from '../state/library';
import { copyText, toast } from '../state/toast';
import { useSolvableIds } from '../solver/index-lite';
import { startPracticeOn } from '../practice/session-link';
import { Math } from './Math';
import { EntryStructures } from './Structures';

function placementLabel(p: Placement): string {
  return `${getSubject(p.subject).label} ${p.classLevel}, ${unitTitle(p.unit)}`;
}

interface Props {
  formula: Formula;
  open: boolean;
  onToggle: (id: string) => void;
  /** Shows the place in the book, for lists that mix several units. */
  showWhere?: boolean;
  /** Just saved or edited, so the eye can find it. */
  flash?: boolean;
  /** Shown in the editor: how it will look, with nothing to press. */
  preview?: boolean;
}

/** Edit and delete, which only your own formulas have. Deleting asks first, in the row itself. */
export function CustomActions({ formula, onDeleted }: { formula: Formula; onDeleted?: () => void }) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <span className="custom-confirm" role="group" aria-label={`Delete ${formula.name}?`}>
        <span>Delete this?</span>
        <button type="button" className="btn btn-line" autoFocus onClick={() => void deleteCustomFormula(formula.id).then(onDeleted)}>
          Delete
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => setConfirming(false)}>
          Keep
        </button>
      </span>
    );
  }
  return (
    <>
      <a className="btn btn-quiet" title="Edit" aria-label={`Edit ${formula.name}`} href={href(`mine/edit/${formula.id}`)}>
        <Pencil size={15} aria-hidden /> <span className="act-label">Edit</span>
      </a>
      <button type="button" className="btn btn-quiet" title="Delete" aria-label={`Delete ${formula.name}`} onClick={() => setConfirming(true)}>
        <Trash2 size={15} aria-hidden /> <span className="act-label">Delete</span>
      </button>
    </>
  );
}

export const FormulaRow = memo(function FormulaRow({ formula: f, open, onToggle, showWhere, flash, preview }: Props) {
  const favourites = useStore(favouritesStore);
  const saved = favourites.includes(f.id);
  const elsewhere = f.shared?.placements.filter((p) => !(p.subject === f.subject && p.classLevel === f.classLevel && p.unit === f.unit)) ?? [];
  const custom = useStore(customStore);
  const printedSolvable = useSolvableIds().has(f.id);
  const solvable = f.custom ? canSolveCustom(custom.formulas.find((c) => c.id === f.id)) : printedSolvable;
  const isCode = isBodyExpr(f.latex);
  const copyLabel = isCode ? 'Copy' : 'Copy LaTeX';
  const mathRef = useFocusableOverflow(`Formula for ${f.name}, scrolls sideways`, useKatexReady());

  return (
    <article className="row" data-open={open} data-subject={f.subject} data-custom={f.custom || undefined} data-flash={flash || undefined} data-formula-row={f.id}>
      <div className="row-num">
        {f.custom ? (
          <PenLine size={15} aria-hidden className="row-pen" />
        ) : (
          <>
            <span className="row-num-section">{f.number.slice(0, f.number.lastIndexOf('.'))}</span>
            {f.number.slice(f.number.lastIndexOf('.'))}
          </>
        )}
      </div>
      <div className="row-main">
        <div ref={mathRef} className="row-math math-host">
          <Math latex={f.latex} />
        </div>
        <h3 className="row-name">
          <button type="button" aria-expanded={open} onClick={() => onToggle(f.id)}>
            {f.name}
          </button>
          {f.custom && <span className="row-yours">Your formula</span>}
        </h3>
        {!preview && <button
          type="button"
          className="row-star"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${f.name} from saved` : `Save ${f.name}`}
          onClick={() => {
            toast(toggleFavourite(f.id) ? 'Saved' : 'Removed from saved');
          }}
        >
          <Star size={17} fill={saved ? 'currentColor' : 'none'} aria-hidden />
        </button>}
        {(f.note || elsewhere.length > 0 || showWhere) && (
          <p className="row-note">
            {f.note}
            {showWhere && (
              <span className="row-also">
                {getSubject(f.subject).label} {f.classLevel}, {unitTitle(f.unit)}
              </span>
            )}
            {elsewhere.length > 0 && <span className="row-also">Also in {elsewhere.map(placementLabel).join('; ')}</span>}
          </p>
        )}
        {f.structure && (
          <div className="row-structure">
            <EntryStructures structure={f.structure} />
          </div>
        )}
        {f.lewis && (
          <div className="row-structure">
            <LazyLewis ids={f.lewis} />
          </div>
        )}
        {f.smiles && (
          <div className="row-structure">
            <CustomStructure smiles={f.smiles} />
          </div>
        )}
        {!preview && <div className="row-acts">
          {solvable && (
            <button
              type="button"
              className="btn btn-quiet"
              title="Solve"
              aria-label={`Solve with ${f.name}`}
              onClick={() => {
                noteRecent(f.id);
                openWork('solve', f.id);
              }}
            >
              <Calculator size={15} aria-hidden /> <span className="act-label">Solve</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn-quiet"
            title="Practise"
            aria-label={`Practise ${f.name}`}
            onClick={() => {
              noteRecent(f.id);
              startPracticeOn(f.id);
            }}
          >
            <ListChecks size={15} aria-hidden /> <span className="act-label">Practise</span>
          </button>
          <button type="button" className="btn btn-quiet" title={copyLabel} aria-label={`${copyLabel} of ${f.name}`} onClick={() => void copyText(copyableExpr(f.latex), isCode ? 'Copied' : 'Copied LaTeX')}>
            <Copy size={15} aria-hidden /> <span className="act-label">{copyLabel}</span>
          </button>
          <a className="btn btn-quiet" title="Open" aria-label={`Open ${f.name}`} href={href(`f/${f.id}`)} onClick={() => noteRecent(f.id)}>
            <ExternalLink size={15} aria-hidden /> <span className="act-label">Open</span>
          </a>
          {f.custom && <CustomActions formula={f} />}
        </div>}
      </div>
    </article>
  );
});
