import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { BookOpenText, Check, Hammer, Search, Table2, X } from 'lucide-react';
import { checkTry } from '../../custom/smiles-check';
import { addGroup, CORES, GROUPS, isRing, relatedPosition, removeGroup, sizeOf, startCore, writeSmiles, type BuilderState, type CoreKind, type GroupKey, type Relation } from '../../custom/smiles-build';
import { parseStructure, SmilesEngineUnavailable, SmilesProblem, type ParsedStructure } from '../../custom/smiles';
import type { ReadStructure } from '../../custom/smiles-read';
import { CHEAT_SHEET, GUIDE } from '../../data/smiles-tutorial';
import { loadOnce } from '../../lib/retry-import';
import { readJson, writeJson } from '../../lib/storage';
import { LazyLewis } from '../LazyLewis';
import { RetryBoundary } from '../RetryBoundary';
import { StructureDrawing, type ActiveAtom } from './CustomStructure';

export type StructureMode = 'none' | 'smiles' | 'reaction' | 'lewis';

const loadChoices = loadOnce(() => import('../../data/lewis/figures').then(({ LEWIS }) => Object.values(LEWIS).map((f) => ({ id: f.id, name: f.name })).sort((a, b) => a.name.localeCompare(b.name))));

interface Compound {
  n: string;
  s: string;
  m: string;
  a: number;
}
const loadCompounds = loadOnce(() => import('../../data/generated/compound-list.json').then((m) => m.default as unknown as Compound[]));

const GUIDE_KEY = 'isc-smiles-guide';
interface GuideMemory {
  /** It has opened by itself once, so from now on it waits for the link. */
  seen?: boolean;
  step?: number;
}

/** A load that has failed for good belongs to the boundary around this section, so hand it over in a render. */
function useFailure(): (err: unknown) => void {
  const [failure, setFailure] = useState<{ err: unknown } | null>(null);
  if (failure) throw failure.err;
  return useCallback((err) => setFailure({ err }), []);
}

interface Preview {
  parsed: (ParsedStructure & { read: ReadStructure }) | null;
  problem: { message: string; start: number; end: number } | null;
}

/** Reads and draws text as it's typed. The text-only check runs first, so a mistake shows without waiting for the engine. */
function usePreview(text: string, reaction = false): Preview {
  const [preview, setPreview] = useState<Preview>({ parsed: null, problem: null });
  const fail = useFailure();
  useEffect(() => {
    let live = true;
    const value = text.trim();
    if (!value) {
      setPreview({ parsed: null, problem: null });
      return undefined;
    }
    const timer = window.setTimeout(() => {
      parseStructure(value).then(
        (result) => {
          if (!live) return;
          if (reaction && !result.isReaction) setPreview({ parsed: null, problem: { message: 'A reaction is written reactants>>products.', start: 0, end: 0 } });
          else setPreview({ parsed: result, problem: null });
        },
        (err) => {
          if (!live) return;
          if (err instanceof SmilesEngineUnavailable) {
            fail(err);
            return;
          }
          setPreview({ parsed: null, problem: err instanceof SmilesProblem ? { message: err.message, start: err.start, end: err.end } : { message: "That can't be read as SMILES.", start: 0, end: 0 } });
        },
      );
    }, 200);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [text, reaction, fail]);
  return preview;
}

const moleculesOf = (read: ReadStructure) => [...read.reactants, ...read.products];

/** The text again, under the box, where characters can be marked: a mistake in red, the current atom in pen. */
function SmilesEcho({ text, read, active, problem, onAtom }: { text: string; read: ReadStructure | null; active: ActiveAtom | null; problem: Preview['problem']; onAtom: (atom: ActiveAtom | null, tapped?: boolean) => void }) {
  const molecules = read ? moleculesOf(read) : [];
  const atomAt = (i: number): ActiveAtom | null => {
    for (let m = 0; m < molecules.length; m++) {
      const atom = molecules[m].atoms.findIndex((a) => i >= a.start && i < a.end);
      if (atom >= 0) return { molecule: m, atom };
    }
    return null;
  };
  if (!text) return null;
  const chars = [...text];
  return (
    <p className="smiles-echo num" aria-hidden data-testid="smiles-echo">
      {chars.map((c, i) => {
        const atom = atomAt(i);
        const isActive = Boolean(atom && active && atom.molecule === active.molecule && atom.atom === active.atom);
        const isBad = Boolean(problem && problem.end > problem.start && i >= problem.start && i < problem.end);
        return (
          <span key={i} data-active={isActive || undefined} data-bad={isBad || undefined} onPointerEnter={atom ? () => onAtom(atom) : undefined} onPointerLeave={atom ? () => onAtom(null) : undefined} onClick={atom ? () => onAtom(atom, true) : undefined}>
            {c}
          </span>
        );
      })}
    </p>
  );
}

const ELEMENT_NAMES: Record<string, string> = { C: 'carbon', N: 'nitrogen', O: 'oxygen', S: 'sulphur', P: 'phosphorus', F: 'fluorine', Cl: 'chlorine', Br: 'bromine', I: 'iodine', B: 'boron', H: 'hydrogen' };

function atomWords(read: ReadStructure, active: ActiveAtom): string {
  const molecule = moleculesOf(read)[active.molecule];
  const atom = molecule?.atoms[active.atom];
  if (!atom) return '';
  const name = ELEMENT_NAMES[atom.element] ?? atom.element;
  const h = atom.hydrogens ? `, with ${atom.hydrogens} ${atom.hydrogens === 1 ? 'hydrogen' : 'hydrogens'}` : '';
  return `Atom ${active.atom + 1}: ${name}${atom.aromatic ? ', aromatic' : ''}${h}`;
}

function SmilesField({ value, onChange, reaction, onResult }: { value: string; onChange: (v: string) => void; reaction: boolean; onResult: (ok: boolean) => void }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const { parsed, problem } = usePreview(value, reaction);
  const [cursorAtom, setCursorAtom] = useState<ActiveAtom | null>(null);
  const [pointed, setPointed] = useState<ActiveAtom | null>(null);
  const read = parsed?.read ?? null;
  const offset = value.length - value.trimStart().length;

  useEffect(() => {
    onResult(Boolean(parsed));
  }, [parsed, onResult]);

  const followCursor = useCallback(() => {
    const field = input.current;
    if (!field || !read) {
      setCursorAtom(null);
      return;
    }
    const at = (field.selectionStart ?? 0) - offset;
    const molecules = moleculesOf(read);
    let found: ActiveAtom | null = null;
    for (let m = 0; m < molecules.length && !found; m++) {
      const molecule = molecules[m];
      if (at < molecule.start || at > molecule.end) continue;
      const on = molecule.atoms.findIndex((a) => at >= a.start && at < a.end);
      const before = molecule.atoms.reduce((best, a, i) => (a.end <= at ? i : best), -1);
      const atom = on >= 0 ? on : before;
      if (atom >= 0) found = { molecule: m, atom };
    }
    setCursorAtom(found);
  }, [read, offset]);

  useEffect(followCursor, [followCursor]);

  // Tapping an atom puts the cursor on it, so the two stay in step on a phone too.
  const onAtom = useCallback(
    (atom: ActiveAtom | null, tapped?: boolean) => {
      setPointed(tapped ? null : atom);
      if (tapped && atom && read) {
        const place = moleculesOf(read)[atom.molecule]?.atoms[atom.atom];
        const field = input.current;
        if (place && field) {
          field.focus({ preventScroll: true });
          field.setSelectionRange(place.start + offset, place.start + offset);
          setCursorAtom(atom);
        }
      }
    },
    [read, offset],
  );

  const active = pointed ?? cursorAtom;
  return (
    <div className="mt-2">
      <label className="lbl" htmlFor={id}>
        {reaction ? 'Reaction SMILES, as reactants>>products' : 'SMILES'}
      </label>
      <input ref={input} id={id} className="field num" autoComplete="off" autoCapitalize="off" spellCheck={false} value={value} placeholder={reaction ? 'CCO>>CC=O' : 'CCO'} aria-invalid={Boolean(problem)} onChange={(e) => onChange(e.target.value)} onSelect={followCursor} onKeyUp={followCursor} onClick={followCursor} />
      <SmilesEcho text={value.trim()} read={read} active={active} problem={problem} onAtom={onAtom} />
      {problem && (
        <p className="var-warn mt-1" role="alert" data-testid="smiles-problem">
          {problem.message}
        </p>
      )}
      {parsed && (
        <div className="structures" data-testid="smiles-preview">
          <StructureDrawing parsed={parsed} scale={0.7} active={active} onAtom={onAtom} />
          <p className="mt-1 text-step--1 text-ink-2" role="status">
            Computed formula: <b className="num" data-testid="smiles-formula">{[...parsed.reactants, ...parsed.products].map((m) => m.formula).join(', ')}</b>. Check this is the compound you meant.
          </p>
          {active && read && (
            <p className="text-step--1 text-ink-2" data-testid="smiles-atom">
              {atomWords(read, active)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** One step's example: it can be edited, with its own drawing and formula. */
function GuidePreview({ value }: { value: string }) {
  const { parsed, problem } = usePreview(value);
  const [active, setActive] = useState<ActiveAtom | null>(null);
  return (
    <div>
      <SmilesEcho text={value.trim()} read={parsed?.read ?? null} active={active} problem={problem} onAtom={setActive} />
      {problem && (
        <p className="var-warn mt-1" role="alert">
          {problem.message}
        </p>
      )}
      {parsed && (
        <div className="structures" data-testid="guide-preview">
          <StructureDrawing parsed={parsed} scale={0.6} active={active} onAtom={setActive} />
          <p className="mt-1 text-step--1 text-ink-2">
            Molecular formula: <b className="num" data-testid="guide-formula">{[...parsed.reactants, ...parsed.products].map((m) => m.formula).join(', ')}</b>
          </p>
        </div>
      )}
    </div>
  );
}

function TryIt({ step }: { step: number }) {
  const task = GUIDE[step].tryIt;
  const id = useId();
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(0);
  const [result, setResult] = useState<{ right: boolean; message: string } | null>(null);
  if (!task) return null;
  const check = () => {
    const outcome = checkTry(answer, task.answer, task.hints, wrong);
    setResult(outcome);
    if (!outcome.right && outcome.message) setWrong((w) => w + 1);
  };
  return (
    <form
      className="guide-try"
      onSubmit={(e) => {
        e.preventDefault();
        check();
      }}
    >
      <label className="lbl" htmlFor={id}>
        Try it: {task.ask}
      </label>
      <div className="mt-1 flex flex-wrap gap-2">
        <input id={id} className="field num guide-input" autoComplete="off" autoCapitalize="off" spellCheck={false} value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <button type="submit" className="btn btn-line">
          <Check size={15} aria-hidden /> Check
        </button>
      </div>
      {result?.message && (
        <p className="notice" data-tone={result.right ? 'good' : 'bad'} role="status" data-testid="guide-result">
          {result.message}
        </p>
      )}
    </form>
  );
}

function SmilesGuide({ onClose, onUse }: { onClose: () => void; onUse: (smiles: string) => void }) {
  const [step, setStepRaw] = useState(() => Math.min(readJson<GuideMemory>(GUIDE_KEY, {}).step ?? 0, GUIDE.length - 1));
  const here = GUIDE[step];
  const [example, setExample] = useState(here.example);
  const setStep = (next: number) => {
    setStepRaw(next);
    setExample(GUIDE[next].example);
    writeJson(GUIDE_KEY, { ...readJson<GuideMemory>(GUIDE_KEY, {}), step: next });
  };
  const titleId = useId();
  const exampleId = useId();
  const stepsId = useId();
  return (
    <section className="custom-panel" aria-labelledby={titleId} data-testid="smiles-guide">
      <div className="flex items-baseline justify-between gap-2">
        <h3 id={titleId} className="text-step-0 font-semibold">
          How SMILES works: {step + 1} of {GUIDE.length}. {here.title}
        </h3>
        <button type="button" className="btn btn-quiet" onClick={onClose} aria-label="Close the guide">
          <X size={15} aria-hidden />
        </button>
      </div>
      {here.explain.map((p) => (
        <p key={p} className="mt-1">
          {p}
        </p>
      ))}
      <div className="mt-2">
        <label className="lbl" htmlFor={exampleId}>
          Example, which you can change
        </label>
        <input id={exampleId} className="field num" autoComplete="off" autoCapitalize="off" spellCheck={false} value={example} onChange={(e) => setExample(e.target.value)} data-testid="guide-example" />
        <div className="mt-1 flex flex-wrap gap-1">
          {here.more.map((m) => (
            <button key={m.smiles} type="button" className="btn btn-quiet guide-chip" onClick={() => setExample(m.smiles)}>
              {m.label}
            </button>
          ))}
        </div>
        <GuidePreview value={example} />
      </div>
      <TryIt key={step} step={step} />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-line" disabled={step === 0} onClick={() => setStep(step - 1)}>
          Previous step
        </button>
        {step < GUIDE.length - 1 ? (
          <button type="button" className="btn btn-solid" onClick={() => setStep(step + 1)}>
            Next step
          </button>
        ) : (
          <button type="button" className="btn btn-solid" onClick={onClose}>
            Finish
          </button>
        )}
        <button type="button" className="btn btn-quiet" onClick={() => onUse(example)}>
          Use this example above
        </button>
        <label className="sr-only" htmlFor={stepsId}>
          Go to step
        </label>
        <select id={stepsId} className="field guide-steps" value={step} onChange={(e) => setStep(Number(e.target.value))} aria-label="Go to step">
          {GUIDE.map((g, i) => (
            <option key={g.title} value={i}>
              {i + 1}. {g.title}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

function CheatSheet() {
  return (
    <div className="custom-panel" data-testid="smiles-cheat">
      <h3 className="text-step-0 font-semibold">Cheat sheet</h3>
      <dl className="cheat">
        {CHEAT_SHEET.map((row) => (
          <div key={row.symbol}>
            <dt className="num">{row.symbol}</dt>
            <dd>{row.means}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Builder({ onWrite }: { onWrite: (smiles: string) => void }) {
  const [state, setState] = useState<BuilderState>(() => startCore('benzene'));
  const [group, setGroup] = useState<GroupKey>('OH');
  const [position, setPosition] = useState(1);
  const [chainLength, setChainLength] = useState(4);
  const [relateTo, setRelateTo] = useState<number | null>(null);
  const size = sizeOf(state);
  const taken = Object.keys(state.groups).map(Number);

  const change = (next: BuilderState) => {
    setState(next);
    onWrite(writeSmiles(next));
  };
  const pickCore = (core: CoreKind) => {
    const next = startCore(core, chainLength);
    setPosition(core === 'pyridine' ? 2 : 1);
    setRelateTo(null);
    change(next);
  };
  const addAt = (where: number | null) => {
    if (where === null) return;
    const next = addGroup(state, where, group);
    if (next !== state) {
      change(next);
      setRelateTo(where);
    }
  };
  const base = relateTo !== null && state.groups[relateTo] ? relateTo : (taken[0] ?? null);

  return (
    <div className="custom-panel" data-testid="smiles-builder">
      <h3 className="text-step-0 font-semibold">Build it with buttons</h3>
      <p className="mt-1 text-step--1 text-ink-2">This writes the SMILES box above, replacing what's in it.</p>
      <p className="lbl mt-2">Start from</p>
      <div className="flex flex-wrap items-end gap-1">
        {CORES.filter((c) => c.key !== 'chain').map((c) => (
          <button key={c.key} type="button" className="btn btn-line" aria-pressed={state.core === c.key} onClick={() => pickCore(c.key)}>
            {c.label}
          </button>
        ))}
        <button type="button" className="btn btn-line" aria-pressed={state.core === 'chain'} onClick={() => pickCore('chain')}>
          Chain of
        </button>
        <input
          type="number"
          min={1}
          max={12}
          className="field num builder-count"
          aria-label="Carbons in the chain"
          value={chainLength}
          onChange={(e) => {
            const n = Math.max(1, Math.min(12, Number(e.target.value) || 1));
            setChainLength(n);
            if (state.core === 'chain') {
              const kept = Object.fromEntries(Object.entries(state.groups).filter(([p]) => Number(p) <= n));
              change({ core: 'chain', length: n, groups: kept });
            }
          }}
        />
        <span className="builder-unit">carbons</span>
      </div>
      <p className="lbl mt-2">Add a group</p>
      <div className="flex flex-wrap gap-1" role="group" aria-label="Group to add">
        {GROUPS.map((g) => (
          <button key={g.key} type="button" className="btn btn-line builder-group" aria-pressed={group === g.key} onClick={() => setGroup(g.key)}>
            {g.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <label className="builder-unit" htmlFor="builder-position">
          at position
        </label>
        <select id="builder-position" className="field builder-count" value={Math.min(position, size)} onChange={(e) => setPosition(Number(e.target.value))}>
          {Array.from({ length: size }, (_, i) => i + 1)
            .filter((p) => state.core !== 'pyridine' || p !== 1)
            .map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
        </select>
        <button type="button" className="btn btn-solid" onClick={() => addAt(Math.min(position, size))}>
          Add
        </button>
        {base !== null &&
          isRing(state.core) &&
          size === 6 &&
          (['ortho', 'meta', 'para'] as Relation[]).map((relation) => {
            const where = relatedPosition(state, base, relation);
            return (
              <button key={relation} type="button" className="btn btn-line" disabled={where === null} onClick={() => addAt(where)}>
                {relation} to {GROUPS.find((g) => g.key === state.groups[base])?.label}
              </button>
            );
          })}
      </div>
      {taken.length > 0 && (
        <ul className="builder-list">
          {taken.map((p) => (
            <li key={p}>
              <span className="num">
                {p}: {GROUPS.find((g) => g.key === state.groups[p])?.label}
              </span>
              <button type="button" className="btn btn-quiet" aria-label={`Remove the group at position ${p}`} onClick={() => change(removeGroup(state, p))}>
                <X size={14} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PickByName({ onPick }: { onPick: (smiles: string) => void }) {
  const [list, setList] = useState<Compound[]>([]);
  const [query, setQuery] = useState('');
  const fail = useFailure();
  const id = useId();
  useEffect(() => {
    let live = true;
    loadCompounds().then(
      (all) => {
        if (live) setList(all);
      },
      (err) => {
        if (live) fail(err);
      },
    );
    return () => {
      live = false;
    };
  }, [fail]);
  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const starts = list.filter((c) => c.n.toLowerCase().startsWith(q));
    const rest = list.filter((c) => !c.n.toLowerCase().startsWith(q) && (c.n.toLowerCase().includes(q) || c.m.toLowerCase() === q));
    return [...starts, ...rest].slice(0, 12);
  }, [query, list]);
  return (
    <div className="custom-panel" data-testid="smiles-pick">
      <label className="lbl" htmlFor={id}>
        Find a compound by name
      </label>
      <input id={id} className="field" type="search" autoComplete="off" placeholder="toluene" value={query} onChange={(e) => setQuery(e.target.value)} />
      {list.length > 0 && <p className="mt-1 text-step--1 text-ink-2">{list.length} compounds, each checked against its formula and mass.</p>}
      {query.trim() && !found.length && <p className="mt-1 text-ink-2">Nothing by that name. Try part of the name, or a formula.</p>}
      <ul className="pick-list">
        {found.map((c) => (
          <li key={c.s}>
            <button type="button" className="btn btn-quiet pick-row" onClick={() => onPick(c.s)}>
              <span>{c.n}</span>
              <span className="num text-ink-2">{c.m}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SmilesHelpers({ reaction, smiles, onSmiles }: { reaction: boolean; smiles: string; onSmiles: (value: string) => void }) {
  const [guide, setGuide] = useState(false);
  const [cheat, setCheat] = useState(false);
  const [builder, setBuilder] = useState(false);
  const [pick, setPick] = useState(false);

  // By itself once, the first time the section is really used. After that, it's the link.
  useEffect(() => {
    const memory = readJson<GuideMemory>(GUIDE_KEY, {});
    if (memory.seen) return;
    writeJson(GUIDE_KEY, { ...memory, seen: true });
    setGuide(true);
  }, []);

  const toggle = (label: string, open: boolean, set: (v: boolean) => void, Icon: typeof X) => (
    <button type="button" className="btn btn-quiet" aria-expanded={open} onClick={() => set(!open)}>
      <Icon size={15} aria-hidden /> {label}
    </button>
  );
  return (
    <>
      <div className="mt-2 flex flex-wrap gap-1">
        {toggle('How SMILES works', guide, setGuide, BookOpenText)}
        {toggle('Cheat sheet', cheat, setCheat, Table2)}
        {toggle('Build with buttons', builder, setBuilder, Hammer)}
        {toggle('Pick by name', pick, setPick, Search)}
      </div>
      {cheat && <CheatSheet />}
      {pick && (
        <RetryBoundary message="Couldn't load the list of compounds. Try again.">
          <PickByName onPick={(s) => onSmiles(reaction && smiles.trim() ? (smiles.includes('>>') ? `${smiles}.${s}` : `${smiles}>>${s}`) : s)} />
        </RetryBoundary>
      )}
      {builder && <Builder onWrite={onSmiles} />}
      {guide && <SmilesGuide onClose={() => setGuide(false)} onUse={onSmiles} />}
    </>
  );
}

function LewisPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [choices, setChoices] = useState<{ id: string; name: string }[]>([]);
  const fail = useFailure();
  useEffect(() => {
    let live = true;
    loadChoices().then(
      (list) => {
        if (live) setChoices(list);
      },
      (err) => {
        if (live) fail(err);
      },
    );
    return () => {
      live = false;
    };
  }, [fail]);
  return (
    <div className="mt-2">
      <label className="lbl" htmlFor="custom-lewis">
        Structure
      </label>
      <select id="custom-lewis" className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose</option>
        {choices.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {value && <LazyLewis ids={[value]} />}
    </div>
  );
}

interface Props {
  mode: StructureMode;
  onMode: (mode: StructureMode) => void;
  smiles: string;
  onSmiles: (value: string) => void;
  onSmilesResult: (ok: boolean) => void;
  lewisId: string;
  onLewis: (id: string) => void;
}

/**
 * Everything about a formula's structure. The heading and the choice of kind need nothing to load, so the
 * section is always here, and a part that can't load fails inside it, leaving the rest of the editor alone.
 */
export function StructureSection({ mode, onMode, smiles, onSmiles, onSmilesResult, lewisId, onLewis }: Props) {
  const usesSmiles = mode === 'smiles' || mode === 'reaction';
  return (
    <section className="today-section" aria-labelledby="structure-h">
      <h2 id="structure-h">Structure</h2>
      <div className="mt-2">
        <label className="lbl" htmlFor="custom-mode">
          Add a structure
        </label>
        <select id="custom-mode" className="field" value={mode} onChange={(e) => onMode(e.target.value as StructureMode)}>
          <option value="none">None</option>
          <option value="smiles">A compound, from SMILES</option>
          <option value="reaction">A reaction, from SMILES</option>
          <option value="lewis">A checked structure with lone pairs</option>
        </select>
      </div>
      <RetryBoundary message="Couldn't load the structure editor. Try again.">
        {usesSmiles && (
          <>
            <SmilesField value={smiles} onChange={onSmiles} reaction={mode === 'reaction'} onResult={onSmilesResult} />
            <SmilesHelpers reaction={mode === 'reaction'} smiles={smiles} onSmiles={onSmiles} />
          </>
        )}
        {mode === 'lewis' && <LewisPicker value={lewisId} onChange={onLewis} />}
      </RetryBoundary>
    </section>
  );
}
