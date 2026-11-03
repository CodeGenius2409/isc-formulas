import { useEffect, useMemo, type RefObject } from 'react';
import { PenLine } from 'lucide-react';
import { CustomBackupControls } from '../components/custom/CustomBackupControls';
import { FormulaList, type ListItem } from '../components/FormulaList';
import { resolveCustom } from '../custom/merge';
import { customInPracticeStore, customStore, ensureCustomLoaded } from '../custom/store';
import { href } from '../lib/router';
import { useStore } from '../lib/store';

/** Every formula you have added, wherever in the book it lives. */
export default function MyFormulas({ scrollRef }: { scrollRef: RefObject<HTMLElement | null> }) {
  const custom = useStore(customStore);
  const inPractice = useStore(customInPracticeStore);

  useEffect(() => {
    void ensureCustomLoaded();
    document.title = 'Your formulas: ISC Formula Book';
  }, []);

  const items = useMemo<ListItem[]>(() => resolveCustom(custom.formulas).map((formula) => ({ kind: 'formula', key: formula.id, formula })), [custom.formulas]);

  return (
    <div className="page">
      <header className="unit-title">
        <h1 style={{ color: 'var(--ink)' }}>Your formulas</h1>
        <p>{custom.status === 'loading' ? 'Opening' : items.length ? `${items.length} ${items.length === 1 ? 'formula' : 'formulas'} you have written into the book` : 'You haven\'t added any yet. Add one here, or from any section of the book.'}</p>
        <a className="btn btn-solid mt-2 no-print" href={href('mine/new')}>
          <PenLine size={15} aria-hidden /> Add a formula
        </a>
        {custom.status === 'unavailable' && (
          <p className="notice" data-tone="bad" role="alert">
            This browser isn't allowing storage, perhaps because of private browsing. Anything you add here will be gone when this page closes.
          </p>
        )}
      </header>
      <h2 className="sr-only">Your list</h2>
      {items.length > 0 && <FormulaList items={items} scrollRef={scrollRef} showWhere />}
      <div className="page-pad no-print">
        <label className="custom-option">
          <input type="checkbox" checked={inPractice} onChange={(e) => customInPracticeStore.set(e.target.checked)} /> Include my formulas in practice, as recall cards
        </label>
        <CustomBackupControls />
      </div>
    </div>
  );
}
