import { useId } from 'react';
import { clampShare } from '../../practice/gen/mix';

const SNAPS = [0, 25, 50, 75, 100];
const STICK = 3;

/** Any 5% step, with a slight pull towards the quarters when dragged. */
function fromDrag(raw: number): number {
  const near = SNAPS.find((s) => Math.abs(s - raw) <= STICK);
  return near ?? clampShare(raw);
}

/** How much of a set of questions is generated. The keys move by 5, and Page Up and Down jump between quarters. */
export function ShareSlider({ value, onChange, message, warning, label = 'Generated questions' }: { value: number; onChange: (share: number) => void; message: string; warning?: string; label?: string }) {
  const id = useId();
  const listId = useId();
  const onKey = (e: React.KeyboardEvent) => {
    const moves: Record<string, () => number> = {
      ArrowRight: () => value + 5,
      ArrowUp: () => value + 5,
      ArrowLeft: () => value - 5,
      ArrowDown: () => value - 5,
      PageUp: () => SNAPS.find((s) => s > value) ?? 100,
      PageDown: () => [...SNAPS].reverse().find((s) => s < value) ?? 0,
      Home: () => 0,
      End: () => 100,
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    onChange(clampShare(move()));
  };
  return (
    <div className="share-slider" data-testid="share-slider">
      <label className="lbl" htmlFor={id}>
        {label}: <span className="num">{value}%</span>
      </label>
      <input id={id} type="range" min={0} max={100} step={1} value={value} list={listId} aria-valuetext={`${value}% generated. ${message}`} onChange={(e) => onChange(fromDrag(Number(e.target.value)))} onKeyDown={onKey} />
      <datalist id={listId}>
        {SNAPS.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <div className="share-ticks num" aria-hidden>
        {SNAPS.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <p className="mt-1 text-step--1 text-ink-2" role="status" data-testid="share-message">
        {message}
      </p>
      {warning && (
        <p className="notice" data-tone="bad" role="alert" data-testid="share-warning">
          {warning}
        </p>
      )}
    </div>
  );
}
