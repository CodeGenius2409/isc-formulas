import { usePreset } from './lib/question-mode';
import { useState } from 'react';
import { Canvas, Plot, token } from './lib/plot';
import { Equation, fmt, Legend, Readouts, Slider, ToolLayout } from './lib/ui';

export function Lcr() {
  const [R, setR] = usePreset('R', 50);
  const [Lm, setLm] = usePreset('Lm', 100);
  const [Cu, setCu] = usePreset('Cu', 10);
  const [V, setV] = useState(10);
  const L = Lm * 1e-3;
  const C = Cu * 1e-6;
  const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
  const Q = (2 * Math.PI * f0 * L) / R;
  const Z = (f: number) => {
    const XL = 2 * Math.PI * f * L;
    const XC = 1 / (2 * Math.PI * f * C);
    return Math.sqrt(R * R + (XL - XC) ** 2);
  };
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Resistance R" value={R} min={10} max={200} unit="Ω" onChange={setR} />
          <Slider label="Inductance L" value={Lm} min={10} max={500} unit="mH" onChange={setLm} />
          <Slider label="Capacitance C" value={Cu} min={1} max={50} unit="μF" onChange={setCu} />
          <Slider label="Supply voltage" value={V} min={1} max={50} unit="V" onChange={setV} />
          <Readouts
            items={[
              ['Resonant frequency', `${fmt(f0)} Hz`],
              ['Minimum impedance', `${fmt(R)} Ω`],
              ['Peak current', `${fmt(V / R)} A`],
              ['Quality factor Q', fmt(Q)],
              ['Bandwidth', `${fmt(f0 / Q)} Hz`],
            ]}
          />
          <Equation latex="f_0=\frac{1}{2\pi\sqrt{LC}},\quad Z=\sqrt{R^2+(X_L-X_C)^2}" />
        </>
      }
    >
      <Plot
        height={330}
        label={`Current against frequency, peaking at the resonant frequency of ${fmt(f0)} hertz.`}
        model={{
          x: [f0 * 0.1, f0 * 3],
          y: [0, (V / R) * 1.15],
          series: [{ fn: (f) => V / Z(f), color: 'physics' }],
          markers: [{ x: f0, y: V / R, label: `f₀ = ${fmt(f0, 3)} Hz` }],
          vlines: [{ x: f0 }],
          xLabel: 'Frequency (Hz)',
          yLabel: 'Current (A)',
        }}
      />
      <Legend items={[{ label: 'Current I = V/Z', color: 'physics' }]} />
    </ToolLayout>
  );
}

export function Capacitor() {
  const [Cu, setCu] = useState(10);
  const [V, setV] = useState(12);
  const C = Cu * 1e-6;
  const Q = C * V;
  const U = 0.5 * C * V * V;
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Capacitance C" value={Cu} min={1} max={100} unit="μF" onChange={setCu} />
          <Slider label="Voltage V" value={V} min={1} max={100} unit="V" onChange={setV} />
          <Readouts items={[['Charge Q = CV', `${fmt(Q * 1e6)} μC`], ['Energy U = ½CV²', `${fmt(U * 1e6)} μJ`]]} />
          <Equation latex="U=\tfrac12CV^2=\frac{Q^2}{2C}=\tfrac12QV" />
        </>
      }
    >
      <Canvas
        height={240}
        label={`Parallel plate capacitor holding ${fmt(Q * 1e6)} microcoulombs.`}
        draw={(ctx, w, h) => {
          const cx = w / 2;
          const gap = Math.max(26, 70 - V / 3);
          const plate = Math.min(w - 80, 280);
          const top = h / 2 - gap / 2;
          const bottom = h / 2 + gap / 2;
          ctx.fillStyle = token('ink');
          ctx.fillRect(cx - plate / 2, top - 5, plate, 5);
          ctx.fillRect(cx - plate / 2, bottom, plate, 5);
          const count = Math.min(18, Math.max(2, Math.round((Q * 1e6) / 40) + 2));
          ctx.font = "15px 'Atkinson Hyperlegible Mono Variable', monospace";
          ctx.textAlign = 'center';
          for (let i = 0; i < count; i++) {
            const x = cx - plate / 2 + ((i + 0.5) * plate) / count;
            ctx.fillStyle = token('accent');
            ctx.textBaseline = 'bottom';
            ctx.fillText('+', x, top - 6);
            ctx.fillStyle = token('physics');
            ctx.textBaseline = 'top';
            ctx.fillText('−', x, bottom + 7);
          }
          ctx.strokeStyle = token('rule-2');
          ctx.lineWidth = 1;
          for (let i = 0; i < count; i += 2) {
            const x = cx - plate / 2 + ((i + 0.5) * plate) / count;
            ctx.beginPath();
            ctx.moveTo(x, top + 1);
            ctx.lineTo(x, bottom - 1);
            ctx.stroke();
          }
        }}
      />
    </ToolLayout>
  );
}
