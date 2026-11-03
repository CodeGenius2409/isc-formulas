import { useRef, useState, type KeyboardEvent } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMediaQuery } from '../lib/hooks';

/** § marks where the cursor lands, and any selected text goes there too. */
export const CARET = '§';

interface Key {
  label: string;
  name: string;
  insert: string;
}

const COMMON: Key[] = [
  { label: 'x', name: 'x', insert: 'x' },
  { label: 'π', name: 'pi', insert: 'π' },
  { label: '√', name: 'square root', insert: `sqrt(${CARET})` },
  { label: '^', name: 'power', insert: '^' },
  { label: '( )', name: 'brackets', insert: `(${CARET})` },
  { label: 'd/dx', name: 'd/dx, derivative', insert: `d/dx(${CARET})` },
];

const MORE: Key[] = [
  { label: 'e', name: 'e', insert: 'e' },
  { label: 'θ', name: 'theta', insert: 'θ' },
  { label: '∞', name: 'infinity', insert: '∞' },
  { label: '|x|', name: '|x|, absolute value', insert: `|${CARET}|` },
  { label: 'a/b', name: 'a/b, fraction', insert: `(${CARET})/()` },
  { label: 'sin', name: 'sin, sine', insert: `sin(${CARET})` },
  { label: 'cos', name: 'cos, cosine', insert: `cos(${CARET})` },
  { label: 'tan', name: 'tan, tangent', insert: `tan(${CARET})` },
  { label: 'sin⁻¹', name: 'sin⁻¹, inverse sine', insert: `sin⁻¹(${CARET})` },
  { label: 'cos⁻¹', name: 'cos⁻¹, inverse cosine', insert: `cos⁻¹(${CARET})` },
  { label: 'tan⁻¹', name: 'tan⁻¹, inverse tangent', insert: `tan⁻¹(${CARET})` },
  { label: 'ln', name: 'ln, natural log', insert: `ln(${CARET})` },
  { label: 'log', name: 'log', insert: `log(${CARET})` },
];

interface Props {
  /** Puts this text in the function box last used, at its cursor. */
  onInsert: (template: string) => void;
}

/** Keys that type into the box. One compact row on a phone, which opens out to all of them. */
export function SymbolKeypad({ onInsert }: Props) {
  const wide = useMediaQuery('(min-width: 48em)');
  const [opened, setOpened] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [from, setFrom] = useState('0');
  const [to, setTo] = useState('π');
  const [focusIndex, setFocusIndex] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const showAll = wide || opened;
  const keys = showAll ? [...COMMON, ...MORE] : COMMON;

  // One Tab stop for the whole keypad, and arrow keys within it.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = [...(barRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
    const here = items.indexOf(document.activeElement as HTMLButtonElement);
    if (here < 0) return;
    let next = here;
    if (e.key === 'ArrowRight') next = (here + 1) % items.length;
    else if (e.key === 'ArrowLeft') next = (here - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else return;
    e.preventDefault();
    setFocusIndex(next);
    items[next].focus();
  };

  // A tap on a key mustn't take the cursor out of the box it is typing into.
  const keepFocus = (e: React.PointerEvent | React.MouseEvent) => e.preventDefault();

  const insertIntegral = (definite: boolean) => {
    onInsert(definite ? `∫ from ${from.trim() || '0'} to ${to.trim() || '1'} of ${CARET}` : `∫ ${CARET}`);
    setLimitsOpen(false);
  };

  return (
    <div className="keypad">
      <div ref={barRef} className="keypad-keys" role="toolbar" aria-label="Maths symbols" onKeyDown={onKeyDown}>
        {keys.map((key, i) => (
          <button key={key.name} type="button" className="keypad-key" aria-label={`Insert ${key.name}`} tabIndex={i === focusIndex ? 0 : -1} onMouseDown={keepFocus} onClick={() => onInsert(key.insert)}>
            {key.label}
          </button>
        ))}
        <button type="button" className="keypad-key" aria-label="Insert integral" aria-expanded={limitsOpen} tabIndex={focusIndex === keys.length ? 0 : -1} onMouseDown={keepFocus} onClick={() => setLimitsOpen(!limitsOpen)}>
          ∫
        </button>
        {!wide && (
          <button type="button" className="keypad-key" aria-label={opened ? 'Fewer symbols' : 'More symbols'} aria-expanded={opened} tabIndex={focusIndex === keys.length + 1 ? 0 : -1} onMouseDown={keepFocus} onClick={() => setOpened(!opened)}>
            {opened ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
          </button>
        )}
      </div>
      {limitsOpen && (
        <div className="keypad-limits">
          <label>
            From
            <input className="field num" value={from} autoComplete="off" spellCheck={false} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label>
            To
            <input className="field num" value={to} autoComplete="off" spellCheck={false} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button type="button" className="btn btn-solid" onClick={() => insertIntegral(true)}>
            Insert with limits
          </button>
          <button type="button" className="btn btn-line" onClick={() => insertIntegral(false)}>
            No limits
          </button>
        </div>
      )}
    </div>
  );
}
