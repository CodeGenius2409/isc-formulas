import { useEffect, useRef, useState } from 'react';
import { ensureKatex } from '../../lib/katex';

/** The element MathLive registers. Only what is used here. */
interface MathFieldElement extends HTMLElement {
  value: string;
  mathVirtualKeyboardPolicy: string;
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

type Props = {
  value: string;
  onChange: (latex: string) => void;
  labelledBy: string;
  /** If MathLive can't load, the raw LaTeX box is still there. */
  onUnavailable: () => void;
};

/** The visual maths editor. MathLive is large, so it loads when this first opens, and is then precached. */
export default function MathField({ value, onChange, labelledBy, onUnavailable }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  // What the field last told us. React's copy of it can lag behind fast typing, and writing that older
  // text back would wipe the newest keystrokes.
  const fromField = useRef<string | null>(null);

  useEffect(() => {
    let live = true;
    // It uses the same maths fonts as the book, so it needs no copy of its own, and makes no sound.
    Promise.all([import('mathlive'), ensureKatex()])
      .then(([{ MathfieldElement }]) => {
        MathfieldElement.fontsDirectory = null;
        MathfieldElement.soundsDirectory = null;
        if (live) setReady(true);
      })
      .catch(() => {
        if (live) onUnavailable();
      });
    return () => {
      live = false;
    };
    // Once, when it opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Typing in the LaTeX box updates this, without moving a cursor that is already right.
  useEffect(() => {
    const field = ref.current as MathFieldElement | null;
    if (field && ready && value !== fromField.current && field.value !== value) field.value = value;
  }, [value, ready]);

  useEffect(() => {
    const field = ref.current as MathFieldElement | null;
    if (!field || !ready) return undefined;
    field.mathVirtualKeyboardPolicy = 'auto';
    const onInput = () => {
      fromField.current = field.value;
      onChange(field.value);
    };
    field.addEventListener('input', onInput);
    return () => field.removeEventListener('input', onInput);
  }, [ready, onChange]);

  if (!ready) return <p className="field text-ink-3">Opening the maths editor</p>;
  return <math-field ref={ref} className="math-editor" aria-labelledby={labelledBy} />;
}
