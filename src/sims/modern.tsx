import { usePreset } from './lib/question-mode';
import { Canvas, Plot, token } from './lib/plot';
import { Equation, fmt, Readouts, Slider, ToolLayout } from './lib/ui';

export function Bohr() {
  const [n, setN] = usePreset('n', 1);
  const E = -13.6 / (n * n);
  const r = 0.529 * n * n;
  const ionise = 13.6 / (n * n);
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Principal quantum number n" value={n} min={1} max={6} onChange={setN} />
          <Readouts items={[['Energy Eₙ', `${fmt(E)} eV`], ['Radius rₙ', `${fmt(r)} Å`], ['Energy to ionise', `${fmt(ionise)} eV`]]} />
          <Equation latex="E_n=-\frac{13.6}{n^2}\,\mathrm{eV},\quad r_n=0.529\,n^2\,\mathring{\mathrm{A}}" />
        </>
      }
    >
      <Canvas
        height={320}
        label={`Bohr model with the electron in orbit ${n} of 6.`}
        draw={(ctx, w, h) => {
          const cx = w / 2;
          const cy = h / 2;
          const step = (Math.min(w, h) / 2 - 12) / 6;
          ctx.lineWidth = 1;
          for (let k = 1; k <= 6; k++) {
            ctx.strokeStyle = k === n ? token('physics') : token('rule');
            ctx.lineWidth = k === n ? 2 : 1;
            ctx.beginPath();
            ctx.arc(cx, cy, k * step, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.fillStyle = token('accent');
          ctx.beginPath();
          ctx.arc(cx, cy, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = token('ink');
          ctx.beginPath();
          ctx.arc(cx + n * step, cy, 5, 0, Math.PI * 2);
          ctx.fill();
        }}
      />
    </ToolLayout>
  );
}

const H_EV = 4.136e-15;

export function Photoelectric() {
  const [f14, setF] = usePreset('f14', 8);
  const [phi, setPhi] = usePreset('phi', 2.5);
  const f = f14 * 1e14;
  const E = H_EV * f;
  const K = E - phi;
  const f0 = phi / H_EV;
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Frequency" value={f14} min={1} max={20} step={0.1} unit="× 10¹⁴ Hz" onChange={setF} />
          <Slider label="Work function φ" value={phi} min={1} max={6} step={0.1} unit="eV" onChange={setPhi} />
          <Readouts
            items={[
              ['Photon energy', `${fmt(E)} eV`],
              ['Maximum kinetic energy', K > 0 ? `${fmt(K)} eV` : '0, no emission'],
              ['Stopping potential', K > 0 ? `${fmt(K)} V` : 'none'],
              ['Threshold frequency', `${fmt(f0 / 1e14)} × 10¹⁴ Hz`],
            ]}
          />
          <Equation latex="K_{\max}=h\nu-\phi" />
        </>
      }
    >
      <Plot
        height={320}
        label="Maximum kinetic energy against frequency, a straight line starting at the threshold frequency."
        model={{
          x: [0, 20],
          y: [0, H_EV * 20e14],
          series: [{ fn: (x) => (H_EV * x * 1e14 - phi > 0 ? H_EV * x * 1e14 - phi : NaN), color: 'physics' }],
          vlines: [{ x: f0 / 1e14 }],
          markers: K > 0 ? [{ x: f14, y: K, label: `${fmt(K, 3)} eV` }] : [{ x: f14, y: 0, color: 'ink-3', label: 'no emission' }],
          xLabel: 'Frequency (× 10¹⁴ Hz)',
          yLabel: 'Kinetic energy (eV)',
        }}
      />
    </ToolLayout>
  );
}

export function Radioactive() {
  const [N0, setN0] = usePreset('N0', 1000);
  const [half, setHalf] = usePreset('half', 10);
  const [t, setT] = usePreset('t', 10);
  const lambda = Math.LN2 / half;
  const N = N0 * Math.exp(-lambda * t);
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Initial nuclei N₀" value={N0} min={100} max={5000} step={100} onChange={setN0} />
          <Slider label="Half-life" value={half} min={1} max={30} step={0.5} unit="s" onChange={setHalf} />
          <Slider label="Time t" value={t} min={0} max={60} step={0.5} unit="s" onChange={setT} />
          <Readouts items={[['Decay constant λ', `${fmt(lambda)} s⁻¹`], ['Nuclei left N(t)', fmt(N)], ['Half-lives passed', fmt(t / half, 3)], ['Mean life', `${fmt(1 / lambda)} s`]]} />
          <Equation latex="N=N_0e^{-\lambda t},\quad T_{1/2}=\frac{\ln 2}{\lambda}" />
        </>
      }
    >
      <Plot
        height={320}
        label={`${fmt(N)} nuclei remain after ${t} seconds.`}
        model={{
          x: [0, 60],
          y: [0, N0 * 1.08],
          series: [{ fn: (x) => N0 * Math.exp(-lambda * x), color: 'physics' }],
          vlines: [{ x: half }],
          markers: [{ x: t, y: N, label: fmt(N, 3) }],
          xLabel: 'Time (s)',
          yLabel: 'Nuclei remaining',
        }}
      />
    </ToolLayout>
  );
}
