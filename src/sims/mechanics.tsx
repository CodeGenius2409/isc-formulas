import { usePreset } from './lib/question-mode';
import { useState } from 'react';
import { Canvas, drawPlot, Plot, token, useAnimation } from './lib/plot';
import { Equation, fmt, Legend, NumField, num, Readouts, Slider, ToolLayout } from './lib/ui';

function drawSpring(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, coils = 10): void {
  ctx.beginPath();
  ctx.moveTo(x0, y);
  const lead = 10;
  const span = x1 - x0 - lead * 2;
  ctx.lineTo(x0 + lead, y);
  for (let i = 0; i <= coils * 2; i++) ctx.lineTo(x0 + lead + (span * i) / (coils * 2), y + (i % 2 === 0 ? -9 : 9));
  ctx.lineTo(x1, y);
  ctx.stroke();
}

export function Shm() {
  const [A, setA] = useState(2);
  const [w, setW] = useState(2);
  const [t, setT] = useState(0);
  useAnimation((s) => setT(s));
  const T = (2 * Math.PI) / w;
  const x = A * Math.sin(w * t);
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Amplitude A" value={A} min={0.5} max={4} step={0.1} unit="m" onChange={setA} />
          <Slider label="Angular frequency ω" value={w} min={0.5} max={6} step={0.1} unit="rad/s" onChange={setW} />
          <Readouts items={[['Period T', `${fmt(T)} s`], ['Frequency f', `${fmt(1 / T)} Hz`], ['Maximum speed Aω', `${fmt(A * w)} m/s`], ['Maximum acceleration Aω²', `${fmt(A * w * w)} m/s²`]]} />
          <Equation latex="x=A\sin\omega t,\quad v=A\omega\cos\omega t" />
        </>
      }
    >
      <Canvas
        height={110}
        label={`A mass on a spring moving with amplitude ${A} metres.`}
        draw={(ctx, width, height) => {
          const mid = height / 2;
          const eq = width / 2;
          const scale = (width / 2 - 50) / 4.2;
          const mx = eq + x * scale;
          ctx.strokeStyle = token('ink');
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(14, 16);
          ctx.lineTo(14, height - 16);
          ctx.stroke();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = token('physics');
          drawSpring(ctx, 14, mx - 18, mid);
          ctx.fillStyle = token('ink');
          ctx.fillRect(mx - 18, mid - 16, 36, 32);
          ctx.strokeStyle = token('rule-2');
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(eq, 6);
          ctx.lineTo(eq, height - 6);
          ctx.stroke();
          ctx.setLineDash([]);
        }}
      />
      <div className="mt-2">
        <Canvas
          height={240}
          label="Displacement and velocity against time."
          draw={(ctx, width, height) => {
            const window = 4 * T;
            const start = Math.max(0, t - window);
            drawPlot(ctx, width, height, {
              x: [start, start + window],
              y: [-Math.max(A, A * w) * 1.15, Math.max(A, A * w) * 1.15],
              series: [{ fn: (s) => A * Math.sin(w * s), color: 'physics' }, { fn: (s) => A * w * Math.cos(w * s), color: 'accent', dash: true }],
              markers: [{ x: t, y: x, color: 'physics' }],
              xLabel: 'Time (s)',
            });
          }}
        />
      </div>
      <Legend items={[{ label: 'Displacement x (m)', color: 'physics' }, { label: 'Velocity v (m/s)', color: 'accent', dash: true }]} />
    </ToolLayout>
  );
}

export function Wave() {
  const [f1, setF1] = useState(5);
  const [f2, setF2] = useState(6);
  const [a, setA] = useState(1);
  const [t, setT] = useState(0);
  useAnimation((s) => setT(s));
  const shift = t * 0.15;
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Frequency f₁" value={f1} min={1} max={15} step={0.1} unit="Hz" onChange={setF1} />
          <Slider label="Frequency f₂" value={f2} min={1} max={15} step={0.1} unit="Hz" onChange={setF2} />
          <Slider label="Amplitude" value={a} min={0.2} max={2} step={0.1} onChange={setA} />
          <Readouts items={[['Beat frequency', `${fmt(Math.abs(f1 - f2))} Hz`]]} />
          <Equation latex="f_{\text{beat}}=|f_1-f_2|" />
        </>
      }
    >
      <Plot
        height={300}
        label={`Two waves adding, with a beat frequency of ${fmt(Math.abs(f1 - f2))} hertz.`}
        model={{
          x: [0, 2],
          y: [-2.3 * a, 2.3 * a],
          series: [
            { fn: (x) => a * Math.sin(2 * Math.PI * f1 * (x + shift)), color: 'rule-2', width: 1 },
            { fn: (x) => a * Math.sin(2 * Math.PI * f2 * (x + shift)), color: 'ink-3', width: 1, dash: true },
            { fn: (x) => a * (Math.sin(2 * Math.PI * f1 * (x + shift)) + Math.sin(2 * Math.PI * f2 * (x + shift))), color: 'physics' },
          ],
          xLabel: 'Time (s)',
        }}
      />
      <Legend items={[{ label: 'Sum of both', color: 'physics' }, { label: 'First wave', color: 'rule-2' }, { label: 'Second wave', color: 'ink-3', dash: true }]} />
    </ToolLayout>
  );
}

export function Atwood() {
  const [m1, setM1] = usePreset('m1', 5);
  const [m2, setM2] = usePreset('m2', 3);
  const g = 9.8;
  const a = ((m1 - m2) * g) / (m1 + m2);
  const T = (2 * m1 * m2 * g) / (m1 + m2);
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Mass m₁" value={m1} min={0.5} max={20} step={0.1} unit="kg" onChange={setM1} />
          <Slider label="Mass m₂" value={m2} min={0.5} max={20} step={0.1} unit="kg" onChange={setM2} />
          <Readouts items={[['Acceleration', `${fmt(Math.abs(a))} m/s²`], ['Direction', a === 0 ? 'balanced' : a > 0 ? 'm₁ falls' : 'm₂ falls'], ['Tension', `${fmt(T)} N`]]} />
          <Equation latex="a=\frac{(m_1-m_2)g}{m_1+m_2},\quad T=\frac{2m_1m_2g}{m_1+m_2}" />
        </>
      }
    >
      <Canvas
        height={300}
        label={`Atwood machine with masses ${m1} and ${m2} kilograms.`}
        draw={(ctx, w, h) => {
          const cx = w / 2;
          const r = 34;
          const y0 = 50;
          const offset = Math.max(-1, Math.min(1, a / 9.8)) * 60;
          const left = 160 + offset;
          const right = 160 - offset;
          ctx.strokeStyle = token('ink');
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, y0, r, Math.PI, 0);
          ctx.moveTo(cx - r, y0);
          ctx.lineTo(cx - r, y0 + left);
          ctx.moveTo(cx + r, y0);
          ctx.lineTo(cx + r, y0 + right);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, y0, r, 0, Math.PI * 2);
          ctx.stroke();
          const box = (x: number, y: number, m: number, name: string) => {
            const s = 22 + m * 2;
            ctx.fillStyle = token('ink');
            ctx.fillRect(x - s / 2, y, s, s);
            ctx.fillStyle = token('paper');
            ctx.font = "12px 'Atkinson Hyperlegible Next Variable', sans-serif";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(name, x, y + s / 2);
          };
          box(cx - r, y0 + left, m1, 'm₁');
          box(cx + r, y0 + right, m2, 'm₂');
          void h;
        }}
      />
    </ToolLayout>
  );
}

export function Inclined() {
  const [deg, setDeg] = usePreset('deg', 30);
  const [mu, setMu] = usePreset('mu', 0.2);
  const g = 9.8;
  const th = (deg * Math.PI) / 180;
  const smooth = g * Math.sin(th);
  const down = g * (Math.sin(th) - mu * Math.cos(th));
  const up = g * (Math.sin(th) + mu * Math.cos(th));
  const slides = Math.tan(th) > mu;
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Angle θ" value={deg} min={0} max={60} unit="°" onChange={setDeg} />
          <Slider label="Coefficient of friction μ" value={mu} min={0} max={1} step={0.01} onChange={setMu} />
          <Readouts
            items={[
              ['Without friction', `${fmt(smooth)} m/s²`],
              ['Sliding down', slides ? `${fmt(down)} m/s²` : 'stays at rest'],
              ['Slowing while going up', `${fmt(up)} m/s²`],
              ['Angle of repose', `${fmt((Math.atan(mu) * 180) / Math.PI, 3)}°`],
            ]}
          />
          <Equation latex="a=g(\sin\theta-\mu\cos\theta)" />
        </>
      }
    >
      <Canvas
        height={280}
        label={`Block on a ${deg} degree incline.`}
        draw={(ctx, w, h) => {
          const bx = 40;
          const by = h - 34;
          const L = Math.min(w - 90, (h - 70) / Math.max(Math.sin(th), 0.25));
          ctx.strokeStyle = token('ink');
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + L * Math.cos(th), by);
          ctx.lineTo(bx + L * Math.cos(th), by - L * Math.sin(th));
          ctx.closePath();
          ctx.stroke();
          ctx.save();
          ctx.translate(bx + L * 0.6 * Math.cos(th), by - L * 0.6 * Math.sin(th));
          ctx.rotate(-th);
          ctx.fillStyle = token('ink');
          ctx.fillRect(-20, -30, 40, 30);
          ctx.restore();
          ctx.fillStyle = token('ink-2');
          ctx.font = "13px 'Atkinson Hyperlegible Mono Variable', monospace";
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(`${deg}°`, bx + 34, by - 8);
        }}
      />
    </ToolLayout>
  );
}

export function Collision() {
  const [m1, setM1] = useState('2');
  const [u1, setU1] = useState('5');
  const [m2, setM2] = useState('3');
  const [u2, setU2] = useState('0');
  const a = num(m1);
  const b = num(m2);
  const ua = num(u1);
  const ub = num(u2);
  const v1 = ((a - b) * ua + 2 * b * ub) / (a + b);
  const v2 = ((b - a) * ub + 2 * a * ua) / (a + b);
  const valid = a > 0 && b > 0 && Number.isFinite(ua) && Number.isFinite(ub);
  return (
    <ToolLayout
      controls={
        <>
          <div className="grid grid-cols-2 gap-2">
            <NumField label="m₁ (kg)" value={m1} onChange={setM1} />
            <NumField label="u₁ (m/s)" value={u1} onChange={setU1} />
            <NumField label="m₂ (kg)" value={m2} onChange={setM2} />
            <NumField label="u₂ (m/s)" value={u2} onChange={setU2} />
          </div>
          {valid ? (
            <Readouts
              items={[
                ['Final v₁', `${fmt(v1)} m/s`],
                ['Final v₂', `${fmt(v2)} m/s`],
                ['Momentum before', `${fmt(a * ua + b * ub)} kg·m/s`],
                ['Momentum after', `${fmt(a * v1 + b * v2)} kg·m/s`],
                ['Kinetic energy before', `${fmt(0.5 * a * ua * ua + 0.5 * b * ub * ub)} J`],
                ['Kinetic energy after', `${fmt(0.5 * a * v1 * v1 + 0.5 * b * v2 * v2)} J`],
              ]}
            />
          ) : (
            <p className="var-warn">Masses must be above 0, and all values must be numbers.</p>
          )}
        </>
      }
    >
      <Equation latex="v_1=\frac{(m_1-m_2)u_1+2m_2u_2}{m_1+m_2}" />
      <Equation latex="v_2=\frac{(m_2-m_1)u_2+2m_1u_1}{m_1+m_2}" />
      <p className="mt-2 text-ink-2">In an elastic collision, both momentum and kinetic energy are conserved. The readouts show this for your values.</p>
    </ToolLayout>
  );
}

export function Spring() {
  const [k, setK] = usePreset('k', 100);
  const [x, setX] = usePreset('x', 0.1);
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Spring constant k" value={k} min={10} max={500} unit="N/m" onChange={setK} />
          <Slider label="Extension x" value={x} min={-0.4} max={0.4} step={0.01} unit="m" onChange={setX} />
          <Readouts items={[['Force F = −kx', `${fmt(-k * x)} N`], ['Energy U = ½kx²', `${fmt(0.5 * k * x * x)} J`]]} />
        </>
      }
    >
      <Canvas
        height={110}
        label={`Spring with extension ${x} metres.`}
        draw={(ctx, w, h) => {
          const mid = h / 2;
          const eq = w * 0.55;
          const mx = eq + x * (w * 0.8);
          ctx.strokeStyle = token('ink');
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(14, 14);
          ctx.lineTo(14, h - 14);
          ctx.stroke();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = token('physics');
          drawSpring(ctx, 14, mx - 16, mid, 12);
          ctx.fillStyle = token('ink');
          ctx.fillRect(mx - 16, mid - 15, 32, 30);
        }}
      />
      <div className="mt-2">
        <Plot height={220} label="Potential energy against extension, a parabola." model={{ x: [-0.4, 0.4], y: [0, 0.5 * k * 0.16 * 1.1], series: [{ fn: (s) => 0.5 * k * s * s, color: 'physics' }], markers: [{ x, y: 0.5 * k * x * x }], xLabel: 'Extension (m)', yLabel: 'Energy (J)' }} />
      </div>
    </ToolLayout>
  );
}
