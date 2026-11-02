import { memo } from 'react';
import { Calculator, Copy, ExternalLink, ListChecks, Star } from 'lucide-react';
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
}

export const FormulaRow = memo(function FormulaRow({ formula: f, open, onToggle, showWhere }: Props) {
  const favourites = useStore(favouritesStore);
  const saved = favourites.includes(f.id);
  const elsewhere = f.shared?.placements.filter((p) => !(p.subject === f.subject && p.classLevel === f.classLevel && p.unit === f.unit)) ?? [];
  const solvable = useSolvableIds().has(f.id);
  const isCode = isBodyExpr(f.latex);
  const copyLabel = isCode ? 'Copy' : 'Copy LaTeX';
  const mathRef = useFocusableOverflow(`Formula for ${f.name}, scrolls sideways`, useKatexReady());

  return (
    <article className="row" data-open={open} data-subject={f.subject}>
      <div className="row-num">
        <span className="row-num-section">{f.number.slice(0, f.number.lastIndexOf('.'))}</span>
        {f.number.slice(f.number.lastIndexOf('.'))}
      </div>
      <div className="row-main">
        <div ref={mathRef} className="row-math math-host">
          <Math latex={f.latex} />
        </div>
        <h3 className="row-name">
          <button type="button" aria-expanded={open} onClick={() => onToggle(f.id)}>
            {f.name}
          </button>
        </h3>
        <button
          type="button"
          className="row-star"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${f.name} from saved` : `Save ${f.name}`}
          onClick={() => {
            toast(toggleFavourite(f.id) ? 'Saved' : 'Removed from saved');
          }}
        >
          <Star size={17} fill={saved ? 'currentColor' : 'none'} aria-hidden />
        </button>
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
        <div className="row-acts">
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
        </div>
      </div>
    </article>
  );
});
