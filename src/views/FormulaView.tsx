import { useEffect } from 'react';
import { Calculator, Copy, ListChecks, Star } from 'lucide-react';
import { isRemovedId } from '../data/aliases';
import { findFormula, getSubject, unitTitle } from '../data/book';
import { copyableExpr, isBodyExpr } from '../data/expr';
import { useAsync } from '../lib/hooks';
import { href, openWork } from '../lib/router';
import { useStore } from '../lib/store';
import { favouritesStore, noteRecent, toggleFavourite } from '../state/library';
import { copyText, toast } from '../state/toast';
import { useSolvableIds } from '../solver/index-lite';
import { startPracticeOn } from '../practice/session-link';
import { Math } from '../components/Math';
import { EntryStructures } from '../components/Structures';

export default function FormulaView({ id }: { id: string }) {
  const state = useAsync(() => findFormula(id), id);
  const favourites = useStore(favouritesStore);
  const solvable = useSolvableIds();
  const f = state.status === 'ready' ? state.value : null;

  useEffect(() => {
    if (f) {
      noteRecent(f.id);
      document.title = `${f.name}: ISC Formula Book`;
    }
  }, [f]);

  if (state.status === 'loading') return <p className="spinner-line">Opening formula</p>;
  if (!f && isRemovedId(id)) {
    return (
      <div className="page-pad">
        <h1 className="text-step-3">This formula has left the book</h1>
        <p className="mt-2 text-ink-2">It is outside the official 2028 syllabus, or not needed for the exam. Try finding what you need by name.</p>
      </div>
    );
  }
  if (!f) {
    return (
      <div className="page-pad">
        <h1 className="text-step-3">No formula with that id</h1>
        <p className="mt-2 text-ink-2">It may have been a mistyped link. Try finding it by name.</p>
      </div>
    );
  }
  const saved = favourites.includes(f.id);
  const canSolve = solvable.has(f.id);
  return (
    <div className="page" data-subject={f.subject} data-formula={f.id}>
      <div className="page-pad">
        <p className="text-ink-2 text-step--1">
          <a className="crumb-link" href={href(`book/${f.subject}/${f.classLevel}/${f.unitIndex}`, { s: String(f.subtopicIndex) })}>
            {getSubject(f.subject).label} {f.classLevel}, {unitTitle(f.unit)}, {f.subtopic}
          </a>
        </p>
        <h1 className="mt-1 text-step-3" style={{ color: 'var(--subject)' }}>
          <span className="num mr-2 text-step-0 font-normal text-ink-3">{f.number}</span>
          {f.name}
        </h1>
        <div className="big-formula mt-3 math-host" tabIndex={0} role="group" aria-label="Formula">
          <Math latex={f.latex} />
        </div>
        {f.structure && <EntryStructures structure={f.structure} scale={1.15} />}
        {f.note && <p className="mt-3 max-w-[65ch]">{f.note}</p>}
        {f.aka && f.aka.length > 0 && <p className="mt-2 text-ink-2">Also called {f.aka.join(', ')}.</p>}
        {f.shared && f.shared.placements.length > 1 && (
          <div className="mt-3">
            <h2 className="text-step-0 font-body font-semibold">Appears in</h2>
            <ul className="m-0 list-none p-0 text-ink-2">
              {f.shared.placements.map((p) => (
                <li key={`${p.subject}${p.classLevel}${p.unit}`} data-subject={p.subject}>
                  {getSubject(p.subject).label} {p.classLevel}, {unitTitle(p.unit)}, {p.subtopic}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2 no-print">
          {canSolve && (
            <button type="button" className="btn btn-solid" onClick={() => openWork('solve', f.id)}>
              <Calculator size={16} aria-hidden /> Solve with this
            </button>
          )}
          <button type="button" className={canSolve ? 'btn btn-line' : 'btn btn-solid'} onClick={() => startPracticeOn(f.id)}>
            <ListChecks size={16} aria-hidden /> Practise
          </button>
          <button
            type="button"
            className="btn btn-line"
            aria-pressed={saved}
            onClick={() => {
              toast(toggleFavourite(f.id) ? 'Saved' : 'Removed from saved');
            }}
          >
            <Star size={16} fill={saved ? 'currentColor' : 'none'} aria-hidden /> {saved ? 'Saved' : 'Save'}
          </button>
          <button type="button" className="btn btn-line" onClick={() => void copyText(copyableExpr(f.latex), isBodyExpr(f.latex) ? 'Copied' : 'Copied LaTeX')}>
            <Copy size={16} aria-hidden /> {isBodyExpr(f.latex) ? 'Copy' : 'Copy LaTeX'}
          </button>
        </div>
      </div>
    </div>
  );
}
