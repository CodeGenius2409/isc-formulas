import { useState } from 'react';
import { Canvas, Plot, token } from './lib/plot';
import { Choice, Equation, fmt, NumField, num, Readouts, Slider, ToolLayout } from './lib/ui';

const Problem = ({ text }: { text: string }) => <p className="var-warn">{text}</p>;

export function Ph() {
  const [mode, setMode] = useState<'strong' | 'buffer'>('strong');
  const [conc, setConc] = useState('0.01');
  const [pKa, setPKa] = useState('4.76');
  const [ratio, setRatio] = useState('1');
  const c = num(conc);
  const k = num(pKa);
  const q = num(ratio);
  const ph = mode === 'strong' ? -Math.log10(c) : k + Math.log10(q);
  const valid = mode === 'strong' ? c > 0 : Number.isFinite(k) && q > 0;
  return (
    <ToolLayout
      controls={
        <>
          <Choice
            label="Solution"
            value={mode}
            onChange={setMode}
            options={[
              { id: 'strong', label: 'Strong acid' },
              { id: 'buffer', label: 'Buffer' },
            ]}
          />
          {mode === 'strong' ? (
            <NumField label="[H⁺] (mol/L)" value={conc} onChange={setConc} />
          ) : (
            <>
              <NumField label="pKa" value={pKa} onChange={setPKa} />
              <NumField label="[Salt] / [Acid]" value={ratio} onChange={setRatio} />
            </>
          )}
          {valid ? (
            <Readouts items={[['pH', fmt(ph, 4)], ['pOH', fmt(14 - ph, 4)], ['[H⁺]', `${fmt(10 ** -ph, 3)} mol/L`], ['[OH⁻]', `${fmt(10 ** (ph - 14), 3)} mol/L`]]} />
          ) : (
            <Problem text="Enter a positive concentration or ratio." />
          )}
          <Equation latex={mode === 'strong' ? '\\mathrm{pH}=-\\log[\\mathrm{H^+}]' : '\\mathrm{pH}=\\mathrm{p}K_a+\\log\\frac{[\\mathrm{salt}]}{[\\mathrm{acid}]}'} />
        </>
      }
    >
      <Canvas
        height={100}
        label={valid ? `pH scale, marker at ${fmt(ph, 3)}.` : 'pH scale.'}
        draw={(ctx, w, h) => {
          const left = 16;
          const right = w - 16;
          const scale = (p: number) => left + ((right - left) * Math.min(14, Math.max(0, p))) / 14;
          ctx.strokeStyle = token('ink');
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(left, h / 2);
          ctx.lineTo(right, h / 2);
          ctx.stroke();
          ctx.fillStyle = token('ink-2');
          ctx.font = "12px 'Atkinson Hyperlegible Mono Variable', monospace";
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          for (let p = 0; p <= 14; p += 1) {
            const x = scale(p);
            ctx.beginPath();
            ctx.moveTo(x, h / 2 - 5);
            ctx.lineTo(x, h / 2 + 5);
            ctx.stroke();
            if (w > 420 || p % 2 === 0) ctx.fillText(String(p), x, h / 2 + 9);
          }
          ctx.textBaseline = 'bottom';
          ctx.textAlign = 'left';
          ctx.fillText('acidic', left, h / 2 - 12);
          ctx.textAlign = 'right';
          ctx.fillText('basic', right, h / 2 - 12);
          if (valid) {
            ctx.fillStyle = token('accent');
            ctx.beginPath();
            ctx.arc(scale(ph), h / 2, 7, 0, Math.PI * 2);
            ctx.fill();
          }
        }}
      />
      <p className="mt-2 text-ink-2">
        To see how pH changes during a neutralisation, use <a href="#/tools/titration">Titration curves</a>.
      </p>
    </ToolLayout>
  );
}

export function Nernst() {
  const [e0, setE0] = useState('1.10');
  const [n, setN] = useState('2');
  const [q, setQ] = useState('0.1');
  const E0 = num(e0);
  const N = num(n);
  const Q = num(q);
  const valid = Number.isFinite(E0) && N >= 1 && Q > 0;
  const E = E0 - (0.0591 / N) * Math.log10(Q);
  return (
    <ToolLayout
      controls={
        <>
          <NumField label="E° (V)" value={e0} onChange={setE0} />
          <NumField label="n, electrons transferred" value={n} onChange={setN} />
          <NumField label="Reaction quotient Q" value={q} onChange={setQ} />
          {valid ? <Readouts items={[['Cell potential E', `${fmt(E, 4)} V`], ['Spontaneous?', E > 0 ? 'Yes, E > 0' : 'No']]} /> : <Problem text="n must be at least 1, and Q must be above 0." />}
          <Equation latex="E=E^\circ-\frac{0.0591}{n}\log Q" />
        </>
      }
    >
      {valid && (
        <Plot
          height={300}
          label={`Cell potential falls as log Q rises. At Q = ${Q}, E is ${fmt(E, 4)} volts.`}
          model={{
            x: [-6, 6],
            y: [E0 - (0.0591 / N) * 6.5, E0 + (0.0591 / N) * 6.5],
            series: [{ fn: (x) => E0 - (0.0591 / N) * x, color: 'chemistry' }],
            markers: [{ x: Math.log10(Q), y: E, label: `E = ${fmt(E, 3)} V` }],
            xLabel: 'log Q',
            yLabel: 'E (V)',
          }}
        />
      )}
    </ToolLayout>
  );
}

export function Kinetics() {
  const [A0, setA0] = useState(1);
  const [k, setK] = useState(0.1);
  const [t, setT] = useState(10);
  const At = A0 * Math.exp(-k * t);
  const half = Math.LN2 / k;
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Initial [A]₀" value={A0} min={0.1} max={5} step={0.1} unit="mol/L" onChange={setA0} />
          <Slider label="Rate constant k" value={k} min={0.01} max={1} step={0.01} unit="s⁻¹" onChange={setK} />
          <Slider label="Time t" value={t} min={0} max={50} step={0.5} unit="s" onChange={setT} />
          <Readouts items={[['[A] at time t', `${fmt(At)} mol/L`], ['Half-life', `${fmt(half)} s`], ['Fraction reacted', `${fmt((1 - At / A0) * 100, 3)}%`]]} />
          <Equation latex="[\mathrm{A}]=[\mathrm{A}]_0e^{-kt},\quad t_{1/2}=\frac{0.693}{k}" />
        </>
      }
    >
      <Plot
        height={320}
        label={`Concentration decays to ${fmt(At)} moles per litre after ${t} seconds.`}
        model={{
          x: [0, 50],
          y: [0, A0 * 1.08],
          series: [{ fn: (x) => A0 * Math.exp(-k * x), color: 'chemistry' }],
          markers: [{ x: t, y: At, label: fmt(At, 3) }],
          vlines: half <= 50 ? [{ x: half }] : [],
          xLabel: 'Time (s)',
          yLabel: '[A] (mol/L)',
        }}
      />
    </ToolLayout>
  );
}

export function Arrhenius() {
  const [Ea, setEa] = useState('50000');
  const [T, setT] = useState('298');
  const [A, setA] = useState('1e10');
  const e = num(Ea);
  const temp = num(T);
  const a = num(A);
  const valid = e >= 0 && temp > 0 && a > 0;
  const k = a * Math.exp(-e / (8.314 * temp));
  return (
    <ToolLayout
      controls={
        <>
          <NumField label="Activation energy Ea (J/mol)" value={Ea} onChange={setEa} />
          <NumField label="Temperature T (K)" value={T} onChange={setT} />
          <NumField label="Frequency factor A" value={A} onChange={setA} />
          {valid ? <Readouts items={[['Rate constant k', fmt(k)], ['Fraction with enough energy', fmt(Math.exp(-e / (8.314 * temp)))]]} /> : <Problem text="Ea cannot be negative. T and A must be above 0." />}
          <Equation latex="k=Ae^{-E_a/RT}" />
        </>
      }
    >
      {valid && (
        <Plot
          height={300}
          label="Rate constant against temperature, on a logarithmic scale."
          model={{
            x: [250, 500],
            y: [Math.log10(a) - e / (2.303 * 8.314 * 250), Math.log10(a) - e / (2.303 * 8.314 * 500)].sort((p, q) => p - q) as [number, number],
            series: [{ fn: (x) => Math.log10(a) - e / (2.303 * 8.314 * x), color: 'chemistry' }],
            markers: temp >= 250 && temp <= 500 ? [{ x: temp, y: Math.log10(k) }] : [],
            xLabel: 'Temperature (K)',
            yLabel: 'log₁₀ k',
          }}
        />
      )}
    </ToolLayout>
  );
}

export function Equilibrium() {
  const [a0, setA] = useState('1');
  const [b0, setB] = useState('0');
  const [K, setK] = useState('4');
  const a = num(a0);
  const b = num(b0);
  const k = num(K);
  const valid = a >= 0 && b >= 0 && k > 0;
  // K = (b + x)/(a − x), so x = (K·a − b)/(1 + K)
  const x = (k * a - b) / (1 + k);
  const ae = a - x;
  const be = b + x;
  return (
    <ToolLayout
      controls={
        <>
          <NumField label="Initial [A] (mol/L)" value={a0} onChange={setA} />
          <NumField label="Initial [B] (mol/L)" value={b0} onChange={setB} />
          <NumField label="Kc" value={K} onChange={setK} />
          {valid ? (
            <Readouts items={[['[A] at equilibrium', `${fmt(ae)} mol/L`], ['[B] at equilibrium', `${fmt(be)} mol/L`], ['Change x', `${fmt(x)} mol/L`], ['Direction', x > 0 ? 'forward' : x < 0 ? 'backward' : 'already at equilibrium']]} />
          ) : (
            <Problem text="Concentrations cannot be negative, and Kc must be above 0." />
          )}
          <Equation latex="\mathrm{A}\rightleftharpoons\mathrm{B},\quad K_c=\frac{[\mathrm{B}]}{[\mathrm{A}]}" />
        </>
      }
    >
      {valid && (
        <Plot
          height={280}
          label={`Concentrations approach equilibrium: A at ${fmt(ae, 3)}, B at ${fmt(be, 3)} moles per litre.`}
          model={{
            x: [0, 5],
            y: [0, Math.max(a, b, ae, be, 0.1) * 1.15],
            series: [
              { fn: (t) => ae + (a - ae) * Math.exp(-t * 1.2), color: 'chemistry' },
              { fn: (t) => be + (b - be) * Math.exp(-t * 1.2), color: 'accent', dash: true },
            ],
            xLabel: 'Time (shape only, not to scale)',
            yLabel: 'mol/L',
          }}
        />
      )}
    </ToolLayout>
  );
}

const R_ATM = 0.0821;

export function GasLaw() {
  const [n, setN] = useState(1);
  const [T, setT] = useState(300);
  const [V, setV] = useState(22.4);
  const P = (n * R_ATM * T) / V;
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Amount n" value={n} min={0.1} max={5} step={0.1} unit="mol" onChange={setN} />
          <Slider label="Temperature T" value={T} min={100} max={600} unit="K" onChange={setT} />
          <Slider label="Volume V" value={V} min={1} max={50} step={0.1} unit="L" onChange={setV} />
          <Readouts items={[['Pressure', `${fmt(P)} atm`], ['In kPa', `${fmt(P * 101.325)} kPa`]]} />
          <Equation latex="PV=nRT" />
        </>
      }
    >
      <Plot
        height={320}
        label={`Isotherm of pressure against volume. At ${V} litres, the pressure is ${fmt(P)} atmospheres.`}
        model={{
          x: [1, 50],
          y: [0, Math.min((n * R_ATM * T) / 1, 80)],
          series: [{ fn: (v) => (n * R_ATM * T) / v, color: 'chemistry' }],
          markers: [{ x: V, y: P, label: `${fmt(P, 3)} atm` }],
          xLabel: 'Volume (L)',
          yLabel: 'Pressure (atm)',
        }}
      />
    </ToolLayout>
  );
}

export function Molality() {
  const [m, setM] = useState('10');
  const [M, setMM] = useState('58.5');
  const [V, setV] = useState('0.5');
  const [W, setW] = useState('0.5');
  const mass = num(m);
  const molar = num(M);
  const vol = num(V);
  const solvent = num(W);
  const valid = mass >= 0 && molar > 0 && vol > 0 && solvent > 0;
  const n = mass / molar;
  return (
    <ToolLayout
      controls={
        <>
          <NumField label="Mass of solute (g)" value={m} onChange={setM} />
          <NumField label="Molar mass (g/mol)" value={M} onChange={setMM} />
          <NumField label="Volume of solution (L)" value={V} onChange={setV} />
          <NumField label="Mass of solvent (kg)" value={W} onChange={setW} />
          {valid ? <Readouts items={[['Moles of solute', `${fmt(n)} mol`], ['Molarity', `${fmt(n / vol)} mol/L`], ['Molality', `${fmt(n / solvent)} mol/kg`]]} /> : <Problem text="Molar mass, volume and solvent mass must be above 0." />}
        </>
      }
    >
      <Equation latex="n=\frac{m}{M},\quad \text{molarity}=\frac{n}{V},\quad \text{molality}=\frac{n}{w_{\text{solvent}}}" />
      <p className="mt-2 text-ink-2">Molarity depends on the solution's volume, which changes with temperature. Molality depends only on masses, so it does not.</p>
    </ToolLayout>
  );
}
