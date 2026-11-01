import { useMemo, useState, type FormEvent } from 'react';
import { AlertTriangle, CircleCheck } from 'lucide-react';
import { checkUserEquation, suggestUnit, symbolsOfEquation, type FullCheck } from '../../solver/checker';
import { Math as MathTex } from '../Math';
import { symbolTex } from '../../solver/tex';

const EXAMPLES = ['v = u + a*t', 's = u + a*t^2', 'F = G*m*M/r^2', 'T = 2*pi*sqrt(l/g)'];

/** "Check my equation": does each side have the same dimensions? */
export default function CheckPane() {
  const [source, setSource] = useState('v = u + a*t');
  const [units, setUnits] = useState<Record<string, string>>({});
  const [result, setResult] = useState<FullCheck | null>(null);
  const parsed = useMemo(() => symbolsOfEquation(source), [source]);

  const unitOf = (symbol: string) => units[symbol] ?? suggestUnit(symbol);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const filled = Object.fromEntries(parsed.symbols.map((s) => [s, unitOf(s)]));
    setResult(checkUserEquation(source, filled));
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <h2 className="work-title">Check my equation</h2>
      <p className="work-hint">Type an equation and give each symbol a unit. This shows whether both sides have the same dimensions.</p>

      <label className="lbl mt-3" htmlFor="check-eq">
        Equation
      </label>
      <input
        id="check-eq"
        className="field num"
        value={source}
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => {
          setSource(e.target.value);
          setResult(null);
        }}
        aria-describedby={parsed.error ? 'check-eq-err' : undefined}
        aria-invalid={Boolean(parsed.error)}
      />
      <div className="mt-1 flex flex-wrap gap-1 text-step--1 text-ink-2">
        Try:
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            className="num underline text-action"
            onClick={() => {
              setSource(ex);
              setResult(null);
            }}
          >
            {ex}
          </button>
        ))}
      </div>
      {parsed.error && source.trim() && (
        <p id="check-eq-err" className="var-warn mt-2" role="alert">
          <AlertTriangle size={14} aria-hidden className="mt-[2px] flex-none" />
          {parsed.error}
        </p>
      )}

      {parsed.symbols.length > 0 && (
        <fieldset className="m-0 mt-3 border-0 p-0">
          <legend className="lbl mb-1">
            Units <small>leave blank for a pure number</small>
          </legend>
          {parsed.symbols.map((symbol) => (
            <div key={symbol} className="var-row" style={{ gridTemplateColumns: '2.75rem minmax(0, 1fr)' }}>
              <span className="var-sym" aria-hidden>
                <MathTex latex={symbolTex(symbol)} />
              </span>
              <input
                className="field num"
                aria-label={`Unit of ${symbol}`}
                value={unitOf(symbol)}
                autoComplete="off"
                spellCheck={false}
                placeholder="no unit"
                aria-invalid={Boolean(result?.unitProblems[symbol])}
                onChange={(e) => {
                  setUnits((cur) => ({ ...cur, [symbol]: e.target.value }));
                  setResult(null);
                }}
              />
              {result?.dims[symbol] && <span className="var-name num">{result.dims[symbol]}</span>}
              {result?.unitProblems[symbol] && (
                <span className="var-warn" role="alert">
                  <AlertTriangle size={14} aria-hidden className="mt-[2px] flex-none" />
                  {result.unitProblems[symbol]}
                </span>
              )}
            </div>
          ))}
        </fieldset>
      )}

      <button type="submit" className="btn btn-solid mt-3 w-full" disabled={!parsed.symbols.length}>
        Check dimensions
      </button>

      {result?.message && (
        <div className="notice" data-tone={result.ok ? 'good' : 'bad'} role={result.ok ? 'status' : 'alert'}>
          {result.ok ? <CircleCheck size={18} aria-hidden /> : <AlertTriangle size={18} aria-hidden />}
          <p>{result.message}</p>
        </div>
      )}
    </form>
  );
}
