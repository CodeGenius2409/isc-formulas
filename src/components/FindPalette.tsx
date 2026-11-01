import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';
import { getSubject, manifest, unitTitle } from '../data/book';
import type { ClassLevel, Formula, SubjectId } from '../data/types';
import { href, navigate, openWork } from '../lib/router';
import { useStore } from '../lib/store';
import { getFormula, prepareSearch, search } from '../search/client';
import { matchQuantities, parseQuantityQuery, type QuantityMatch } from '../search/quantity';
import { closePalette, paletteStore } from '../state/ui';
import { Math as MathTex } from './Math';

type Option =
  | { kind: 'quantity'; key: string; match: QuantityMatch; formula: Formula | undefined }
  | { kind: 'formula'; key: string; formula: Formula; terms: string[] };

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Marks the matched words in a formula's name. */
export function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  const parts = useMemo(() => {
    const usable = terms.filter((t) => t.length > 1);
    if (!usable.length) return [text];
    return text.split(new RegExp(`(${usable.map(escapeRegExp).join('|')})`, 'ig'));
  }, [text, terms]);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part))}
    </>
  );
}

function where(f: Formula): string {
  return `${getSubject(f.subject).label} ${f.classLevel}, ${unitTitle(f.unit)}`;
}

/** Find: instant search and quantity search. Opens with no animation, always. */
export function FindPalette() {
  const open = useStore(paletteStore);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState<SubjectId | null>(null);
  const [level, setLevel] = useState<ClassLevel | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [preparing, setPreparing] = useState(false);
  const requestRef = useRef(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
      inputRef.current?.select();
      setPreparing(true);
      void prepareSearch().finally(() => setPreparing(false));
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    const request = ++requestRef.current;
    if (!q) {
      setOptions([]);
      setTotal(0);
      return;
    }
    let cancelled = false;
    void (async () => {
      const quantity = parseQuantityQuery(q);
      let quantityOptions: Option[] = [];
      if (quantity) {
        const { allEntries } = await import('../solver/registry');
        const matches = matchQuantities(quantity, allEntries()).filter((m) => !subject || m.entry.id.startsWith({ physics: 'p-', chemistry: 'c-', mathematics: 'm-', computerscience: 'cs-' }[subject]));
        await prepareSearch();
        quantityOptions = matches.slice(0, 12).map((match) => ({ kind: 'quantity', key: `q-${match.entry.id}`, match, formula: getFormula(match.entry.id) }));
      }
      const results = await search(q, { subject, level }, 30);
      if (cancelled || request !== requestRef.current) return;
      const seen = new Set(quantityOptions.map((o) => (o.kind === 'quantity' ? o.match.entry.id : '')));
      const formulaOptions: Option[] = quantity ? [] : results.hits.filter((h) => !seen.has(h.formula.id)).map((h) => ({ kind: 'formula', key: h.formula.id, formula: h.formula, terms: h.terms }));
      setOptions([...quantityOptions, ...formulaOptions]);
      setTotal(quantity ? quantityOptions.length : results.total);
      setActive(0);
    })();
    return () => {
      cancelled = true;
    };
  }, [query, subject, level, open]);

  const choose = useCallback((option: Option | undefined) => {
    if (!option) return;
    closePalette();
    if (option.kind === 'quantity') {
      navigateToSolver(option.match.entry.id, option.match.unknown);
    } else {
      navigate(`f/${option.formula.id}`);
    }
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    }
  };

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const quantityMode = options.some((o) => o.kind === 'quantity');
  const trimmed = query.trim();
  const listId = `${baseId}-list`;

  return (
    <dialog
      ref={dialogRef}
      className="palette"
      aria-label="Find a formula"
      onCancel={(e) => {
        e.preventDefault();
        closePalette();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) closePalette();
      }}
    >
      <div className="palette-input">
        <Search size={18} aria-hidden className="flex-none text-ink-3" />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={options.length > 0}
          aria-controls={listId}
          aria-activedescendant={options[active] ? `${baseId}-${options[active].key}` : undefined}
          aria-autocomplete="list"
          aria-label="Find a formula"
          placeholder="Name, symbol, or: have v, u, t want s"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button type="button" className="btn btn-quiet" aria-label="Close find" onClick={closePalette}>
          <X size={18} aria-hidden />
        </button>
      </div>

      <div className="palette-filters">
        <div className="seg" role="group" aria-label="Filter by subject">
          <button type="button" aria-pressed={subject === null} onClick={() => setSubject(null)}>
            All
          </button>
          {manifest.subjects.map((s) => (
            <button key={s.id} type="button" aria-pressed={subject === s.id} onClick={() => setSubject(s.id)}>
              {s.id === 'computerscience' ? 'CS' : s.label.slice(0, 5) === 'Mathe' ? 'Maths' : s.label}
            </button>
          ))}
        </div>
        <div className="seg" role="group" aria-label="Filter by class">
          <button type="button" aria-pressed={level === null} onClick={() => setLevel(null)}>
            Any
          </button>
          {(['XI', 'XII'] as const).map((l) => (
            <button key={l} type="button" aria-pressed={level === l} onClick={() => setLevel(l)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="palette-results" id={listId} role="listbox" aria-label="Results" ref={listRef}>
        {!trimmed && (
          <div className="palette-hint">
            <p>Search by name, topic, symbol or note. Spelling mistakes are fine.</p>
            <p className="mt-2">
              Or say what you have and want: <button type="button" className="underline" onClick={() => setQuery('have v, u, t want s')}>have v, u, t want s</button>, <button type="button" className="underline" onClick={() => setQuery('find f from v lambda')}>find f from v lambda</button>
            </p>
            {preparing && <p className="mt-2 text-ink-3">Preparing the index</p>}
          </div>
        )}
        {trimmed && !options.length && (
          <p className="palette-hint">
            {preparing ? 'Preparing the index' : parseQuantityQuery(trimmed) ? 'No solvable formula uses those quantities. Check the symbols, or try their names.' : `Nothing matches "${trimmed}". Try fewer words, or remove a filter.`}
          </p>
        )}
        {options.map((option, i) =>
          option.kind === 'quantity' ? (
            <QuantityOption key={option.key} id={`${baseId}-${option.key}`} option={option} selected={i === active} onChoose={() => choose(option)} />
          ) : (
            <div key={option.key} id={`${baseId}-${option.key}`} role="option" aria-selected={i === active} className="palette-row" data-subject={option.formula.subject} onClick={() => choose(option)}>
              <div className="palette-name">
                <Highlighted text={option.formula.name} terms={option.terms} />
              </div>
              <div className="palette-math math-host">
                <MathTex latex={option.formula.latex} />
              </div>
              <div className="palette-where">{where(option.formula)}</div>
            </div>
          ),
        )}
        {!quantityMode && total > options.length && trimmed && (
          <a className="palette-all" href={href('find', { q: trimmed })} onClick={closePalette}>
            See all {total} results
          </a>
        )}
      </div>
      <p className="palette-keys" aria-hidden>
        <kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Enter</kbd> to open, <kbd>Esc</kbd> to close
      </p>
    </dialog>
  );
}

function navigateToSolver(id: string, unknown: string) {
  openWork('solve', id);
  // Add which variable to find, without adding a second history entry.
  const hash = window.location.hash;
  history.replaceState(null, '', `${hash}&find=${encodeURIComponent(unknown)}`);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

function QuantityOption({ id, option, selected, onChoose }: { id: string; option: Extract<Option, { kind: 'quantity' }>; selected: boolean; onChoose: () => void }) {
  const { match, formula } = option;
  const wanted = match.entry.vars.find((v) => v.symbol === match.unknown)!;
  return (
    <div id={id} role="option" aria-selected={selected} className="palette-row" data-subject={formula?.subject} onClick={onChoose}>
      <div className="palette-name">{formula?.name ?? match.entry.id}</div>
      {formula && (
        <div className="palette-math math-host">
          <MathTex latex={formula.latex} />
        </div>
      )}
      <div className="palette-where" data-tier={match.tier}>
        {match.tier === 0 && `Gives ${wanted.name} from exactly what you have`}
        {match.tier === 1 && `Gives ${wanted.name}. Does not use ${match.unused.join(', ')}`}
        {match.tier === 2 && `Gives ${wanted.name}, but also needs ${match.missing.map((m) => m.name).join(', ')}`}
      </div>
    </div>
  );
}
