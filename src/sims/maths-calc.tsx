// Matrices, calculus tools and counting. The other maths tools are in maths.tsx.
import { useState } from 'react';
import { binomialCoefficient, integrate } from './lib/calculus';
import { Plot } from './lib/plot';
import { Choice, Equation, fmt, num, Readouts, Slider, ToolLayout } from './lib/ui';

const Warn = ({ text }: { text: string }) => <p className="var-warn">{text}</p>;

function CellGrid({ size, values, onChange }: { size: number; values: string[]; onChange: (i: number, v: string) => void }) {
  return (
    <div className="grid-input" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
      {values.map((v, i) => (
        <input key={i} className="field" inputMode="decimal" autoComplete="off" aria-label={`Row ${Math.floor(i / size) + 1}, column ${(i % size) + 1}`} value={v} onChange={(e) => onChange(i, e.target.value)} />
      ))}
    </div>
  );
}

export function Matrix2() {
  const [cells, setCells] = useState(['1', '2', '3', '4']);
  const [a, b, c, d] = cells.map((x) => num(x));
  const valid = [a, b, c, d].every(Number.isFinite);
  const det = a * d - b * c;
  const inverse = det !== 0 ? [d / det, -b / det, -c / det, a / det] : null;
  const mat = (m: number[]) => `\\begin{pmatrix}${fmt(m[0])}&${fmt(m[1])}\\\\${fmt(m[2])}&${fmt(m[3])}\\end{pmatrix}`;
  return (
    <ToolLayout
      controls={
        <>
          <span className="lbl">Matrix A</span>
          <CellGrid size={2} values={cells} onChange={(i, v) => setCells((list) => list.map((x, j) => (j === i ? v : x)))} />
          {valid ? <Readouts items={[['|A|', fmt(det)], ['Trace', fmt(a + d)]]} /> : <Warn text="All entries must be numbers." />}
        </>
      }
    >
      {valid && (inverse ? <Equation latex={`A^{-1}=\\frac{1}{|A|}\\operatorname{adj}A=${mat(inverse)}`} /> : <p className="notice">This matrix is singular, because |A| = 0, so it has no inverse.</p>)}
      <Equation latex="|A|=ad-bc,\quad A^{-1}=\frac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}" />
    </ToolLayout>
  );
}

export function Det3() {
  const [cells, setCells] = useState(['1', '2', '3', '0', '1', '4', '5', '6', '0']);
  const a = cells.map((x) => num(x));
  const valid = a.every(Number.isFinite);
  const m1 = a[4] * a[8] - a[5] * a[7];
  const m2 = a[3] * a[8] - a[5] * a[6];
  const m3 = a[3] * a[7] - a[4] * a[6];
  const det = a[0] * m1 - a[1] * m2 + a[2] * m3;
  return (
    <ToolLayout
      controls={
        <>
          <span className="lbl">Matrix A</span>
          <CellGrid size={3} values={cells} onChange={(i, v) => setCells((list) => list.map((x, j) => (j === i ? v : x)))} />
          {valid ? <Readouts items={[['|A|', fmt(det, 6)]]} /> : <Warn text="All entries must be numbers." />}
        </>
      }
    >
      {valid && (
        <>
          <p className="lbl">Expanding along the first row</p>
          <Equation latex={`|A|=${fmt(a[0])}(${fmt(m1)})-${fmt(a[1])}(${fmt(m2)})+${fmt(a[2])}(${fmt(m3)})=${fmt(det, 6)}`} />
        </>
      )}
    </ToolLayout>
  );
}

const FNS = {
  x2: { f: (x: number) => x * x, df: (x: number) => 2 * x, tex: 'x^2' },
  sin: { f: Math.sin, df: Math.cos, tex: '\\sin x' },
  exp: { f: Math.exp, df: Math.exp, tex: 'e^x' },
};

type FnId = keyof typeof FNS;

const fnOptions = [
  { id: 'x2' as const, label: 'x²' },
  { id: 'sin' as const, label: 'sin x' },
  { id: 'exp' as const, label: 'eˣ' },
];

export function DerivativeTool() {
  const [id, setId] = useState<FnId>('x2');
  const [x0, setX0] = useState(1);
  const { f, df, tex } = FNS[id];
  const slope = df(x0);
  const y0 = f(x0);
  return (
    <ToolLayout
      controls={
        <>
          <Choice label="Function" value={id} onChange={setId} options={fnOptions} />
          <Slider label="At x" value={x0} min={-3} max={3} step={0.05} format={(v) => v.toFixed(2)} onChange={setX0} />
          <Readouts items={[[`f(${x0.toFixed(2)})`, fmt(y0)], ['Slope of the tangent', fmt(slope)]]} />
          <Equation latex={`f(x)=${tex}`} />
        </>
      }
    >
      <Plot
        height={330}
        label={`Tangent to the curve at x = ${x0.toFixed(2)}, with slope ${fmt(slope)}.`}
        model={{ x: [-4, 4], y: [-4, 8], series: [{ fn: f, color: 'mathematics' }, { fn: (x) => y0 + slope * (x - x0), color: 'accent', width: 1.5 }], markers: [{ x: x0, y: y0 }], xLabel: 'x', yLabel: 'y' }}
      />
      <p className="mt-2 text-ink-2">
        For several functions at once, use the <a href="#/tools/plotter">Graph plotter</a>.
      </p>
    </ToolLayout>
  );
}

export function IntegralTool() {
  const [id, setId] = useState<FnId>('x2');
  const [a, setA] = useState(0);
  const [b, setB] = useState(2);
  const { f, tex } = FNS[id];
  const area = integrate(f, a, b);
  return (
    <ToolLayout
      controls={
        <>
          <Choice label="Function" value={id} onChange={setId} options={fnOptions} />
          <Slider label="Lower limit a" value={a} min={-2} max={2} step={0.1} onChange={setA} />
          <Slider label="Upper limit b" value={b} min={-2} max={4} step={0.1} onChange={setB} />
          <Readouts items={[['Value of the integral', fmt(area, 6)]]} />
          <Equation latex={`\\int_{${a}}^{${b}}${tex}\\,dx`} />
        </>
      }
    >
      <Plot
        height={330}
        label={`Area under the curve from ${a} to ${b} is about ${fmt(area)}.`}
        model={{ x: [-3, 5], y: [-3, Math.max(8, f(Math.max(a, b)) * 1.1)], series: [{ fn: f, color: 'mathematics' }], area: { fn: f, a: Math.min(a, b), b: Math.max(a, b), color: 'mathematics' }, xLabel: 'x', yLabel: 'y' }}
      />
    </ToolLayout>
  );
}

export function Limits() {
  const [a, setA] = useState(2);
  const [delta, setDelta] = useState(0.01);
  const f = (x: number) => (x * x - a * a) / (x - a);
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="a" value={a} min={-5} max={5} step={0.1} onChange={setA} />
          <Slider label="Distance δ from a" value={delta} min={0.0001} max={0.5} step={0.0001} format={(v) => v.toFixed(4)} onChange={setDelta} />
          <Readouts items={[['f(a − δ)', fmt(f(a - delta), 7)], ['f(a + δ)', fmt(f(a + delta), 7)], ['The limit 2a', fmt(2 * a, 6)]]} />
          <Equation latex="\lim_{x\to a}\frac{x^2-a^2}{x-a}=2a" />
        </>
      }
    >
      <Plot
        height={320}
        label={`The function approaches ${fmt(2 * a)} from both sides, with a hole at x = ${a}.`}
        model={{ x: [a - 3, a + 3], y: [2 * a - 4, 2 * a + 4], series: [{ fn: f, color: 'mathematics' }], markers: [{ x: a - delta, y: f(a - delta), color: 'ink-3' }, { x: a + delta, y: f(a + delta), color: 'ink-3' }, { x: a, y: 2 * a, label: `limit ${fmt(2 * a, 3)}` }], xLabel: 'x', yLabel: 'f(x)' }}
      />
      <p className="mt-2 text-ink-2">f(a) itself is undefined, since it is 0/0, yet the values on both sides approach the same number.</p>
    </ToolLayout>
  );
}

export function BinomialProb() {
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.5);
  const [rRaw, setR] = useState(5);
  const r = Math.min(rRaw, n);
  const P = (k: number) => binomialCoefficient(n, k) * p ** k * (1 - p) ** (n - k);
  const bars: [number, number][] = [];
  for (let k = 0; k <= n; k++) {
    bars.push([k - 0.35, 0], [k - 0.35, P(k)], [k + 0.35, P(k)], [k + 0.35, 0]);
  }
  const top = Math.max(...Array.from({ length: n + 1 }, (_, k) => P(k)));
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Trials n" value={n} min={1} max={30} onChange={setN} />
          <Slider label="Probability p" value={p} min={0.05} max={0.95} step={0.05} format={(v) => v.toFixed(2)} onChange={setP} />
          <Slider label="Successes r" value={r} min={0} max={n} onChange={setR} />
          <Readouts items={[[`P(X = ${r})`, fmt(P(r), 6)], ['Mean np', fmt(n * p)], ['Variance npq', fmt(n * p * (1 - p))], ['Standard deviation', fmt(Math.sqrt(n * p * (1 - p)))]]} />
          <Equation latex="P(X=r)={}^nC_r\,p^r q^{n-r}" />
        </>
      }
    >
      <Plot
        height={320}
        label={`Binomial distribution. The probability of exactly ${r} successes is ${fmt(P(r))}.`}
        model={{ x: [-1, n + 1], y: [0, top * 1.15], series: [{ points: bars, color: 'mathematics', width: 1.5 }], markers: [{ x: r, y: P(r) }], xLabel: 'Number of successes', yLabel: 'Probability' }}
      />
    </ToolLayout>
  );
}

function factorial(n: number): bigint {
  let out = 1n;
  for (let i = 2n; i <= BigInt(n); i++) out *= i;
  return out;
}

export function Combinatorics() {
  const [n, setN] = useState(10);
  const [rRaw, setR] = useState(3);
  const r = Math.min(rRaw, n);
  const nPr = factorial(n) / factorial(n - r);
  const nCr = nPr / factorial(r);
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="n" value={n} min={1} max={30} onChange={setN} />
          <Slider label="r" value={r} min={0} max={n} onChange={setR} />
          <Readouts items={[[`${n}P${r}`, nPr.toString()], [`${n}C${r}`, nCr.toString()], [`${n}!`, factorial(n).toString()]]} />
        </>
      }
    >
      <Equation latex="{}^nP_r=\frac{n!}{(n-r)!},\quad {}^nC_r=\frac{n!}{r!(n-r)!}" />
      <p className="mt-2 text-ink-2">Order matters in permutations but not in combinations, which is why ⁿPᵣ = r! × ⁿCᵣ.</p>
    </ToolLayout>
  );
}
