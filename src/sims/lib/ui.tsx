// Controls shared by the simulators.
import { useId, type ReactNode } from 'react';
import { Math as MathTex } from '../../components/Math';

export function ToolLayout({ controls, children }: { controls: ReactNode; children?: ReactNode }) {
  return (
    <div className="tool-layout">
      <div className="tool-controls">{controls}</div>
      <div className="tool-output">{children}</div>
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}

export function Slider({ label, value, min, max, step = 1, unit, onChange, format }: SliderProps) {
  const id = useId();
  const shown = format ? format(value) : String(value);
  return (
    <div className="slider">
      <label htmlFor={id}>
        {label}
        <output htmlFor={id}>
          {shown}
          {unit ? ` ${unit}` : ''}
        </output>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-valuetext={`${shown}${unit ? ` ${unit}` : ''}`} />
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  inputMode?: 'decimal' | 'text' | 'numeric';
  invalid?: boolean;
}

export function Field({ label, value, onChange, hint, inputMode = 'decimal', invalid }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label className="lbl" htmlFor={id}>
        {label} {hint && <small>{hint}</small>}
      </label>
      <input id={id} className="field num" inputMode={inputMode} autoComplete="off" spellCheck={false} value={value} aria-invalid={invalid || undefined} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** A number box that keeps its text while typing. Bad values become NaN for the caller. */
export function NumField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return <Field label={label} value={value} onChange={onChange} hint={hint} invalid={value.trim() !== '' && !Number.isFinite(Number(value))} />;
}

export function Readouts({ items }: { items: [ReactNode, ReactNode][] }) {
  return (
    <dl className="readouts" aria-live="polite">
      {items.map(([k, v], i) => (
        <div key={i} style={{ display: 'contents' }}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: ReactNode }[]; onChange: (id: T) => void }) {
  return (
    <div>
      <span className="lbl">{label}</span>
      <div className="seg flex-wrap" role="group" aria-label={label}>
        {options.map((o) => (
          <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="check-row font-semibold">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function Equation({ latex }: { latex: string }) {
  return (
    <div className="math-host py-1">
      <MathTex latex={latex} />
    </div>
  );
}

export function Legend({ items }: { items: { label: string; color: string; dash?: boolean }[] }) {
  return (
    <div className="legend">
      {items.map((i) => (
        <span key={i.label}>
          <i style={{ '--c': `var(--${i.color})` } as React.CSSProperties} data-dash={i.dash} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

/** Formats to a sensible number of figures for a readout. */
export function fmt(value: number, figures = 4): string {
  if (!Number.isFinite(value)) return value > 0 ? '∞' : value < 0 ? '−∞' : 'undefined';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e6 || abs < 1e-3) return value.toExponential(Math.max(figures - 1, 1)).replace('e+', '×10^').replace('e-', '×10^-');
  return String(Number(value.toPrecision(figures)));
}

export const num = (text: string, fallback = NaN): number => {
  const v = Number(text);
  return text.trim() !== '' && Number.isFinite(v) ? v : fallback;
};
