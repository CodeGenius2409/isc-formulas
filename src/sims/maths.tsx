import { useState } from 'react';
import { binomialCoefficient } from './lib/calculus';
import { Canvas, drawPlot, Plot, token } from './lib/plot';
import { Equation, Field, fmt, NumField, num, Readouts, Slider, ToolLayout } from './lib/ui';

const Warn = ({ text }: { text: string }) => <p className="var-warn">{text}</p>;

export function Quadratic() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('-5');
  const [c, setC] = useState('6');
  const A = num(a);
  const B = num(b);
  const C = num(c);
  const valid = Number.isFinite(A) && Number.isFinite(B) && Number.isFinite(C);
  const D = B * B - 4 * A * C;
  const isQuad = valid && Math.abs(A) > 1e-12;
  const roots = isQuad && D >= 0 ? [(-B + Math.sqrt(D)) / (2 * A), (-B - Math.sqrt(D)) / (2 * A)] : [];
  const vx = isQuad ? -B / (2 * A) : 0;
  const vy = isQuad ? A * vx * vx + B * vx + C : 0;
  const reach = Math.max(4, ...roots.map((r) => Math.abs(r - vx) * 1.5));
  const f = (x: number) => A * x * x + B * x + C;
  const edge = isQuad ? f(vx + reach) : 1;
  return (
    <ToolLayout
      controls={
        <>
          <div className="grid grid-cols-3 gap-2">
            <NumField label="a" value={a} onChange={setA} />
            <NumField label="b" value={b} onChange={setB} />
            <NumField label="c" value={c} onChange={setC} />
          </div>
          {!valid && <Warn text="All three must be numbers." />}
          {valid && !isQuad && <Warn text="With a = 0 this is not a quadratic." />}
          {isQuad && (
            <Readouts
              items={[
                ['Discriminant D', fmt(D)],
                ['Roots', D > 0 ? `${fmt(roots[0])} and ${fmt(roots[1])}` : D === 0 ? `${fmt(roots[0])} (repeated)` : `${fmt(-B / (2 * A))} ± ${fmt(Math.sqrt(-D) / (2 * Math.abs(A)))}i`],
                ['Sum of roots −b/a', fmt(-B / A)],
                ['Product of roots c/a', fmt(C / A)],
                ['Vertex', `(${fmt(vx)}, ${fmt(vy)})`],
              ]}
            />
          )}
          <Equation latex="x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}" />
        </>
      }
    >
      {isQuad && (
        <Plot
          height={320}
          label="Graph of the parabola, with its real roots marked."
          model={{
            x: [vx - reach, vx + reach],
            y: [Math.min(vy, edge, 0) - Math.abs(edge - vy) * 0.12 - 0.5, Math.max(vy, edge, 0) + Math.abs(edge - vy) * 0.12 + 0.5],
            series: [{ fn: f, color: 'mathematics' }],
            markers: roots.map((r) => ({ x: r, y: 0 })),
            xLabel: 'x',
            yLabel: 'y',
          }}
        />
      )}
    </ToolLayout>
  );
}

export function Binomial() {
  const [a, setA] = useState('x');
  const [b, setB] = useState('y');
  const [n, setN] = useState(4);
  const left = a.trim() || 'a';
  const right = b.trim() || 'b';
  const terms = Array.from({ length: n + 1 }, (_, r) => {
    const coefficient = binomialCoefficient(n, r);
    const parts = [coefficient === 1 && n > 0 ? '' : String(coefficient)];
    if (n - r > 0) parts.push(`${left}${n - r > 1 ? `^{${n - r}}` : ''}`);
    if (r > 0) parts.push(`${right}${r > 1 ? `^{${r}}` : ''}`);
    return parts.filter(Boolean).join('');
  });
  return (
    <ToolLayout
      controls={
        <>
          <div className="grid grid-cols-2 gap-2">
            <Field label="First term a" value={a} onChange={setA} inputMode="text" />
            <Field label="Second term b" value={b} onChange={setB} inputMode="text" />
          </div>
          <Slider label="Power n" value={n} min={0} max={12} onChange={setN} />
          <Equation latex="T_{r+1}={}^nC_r\,a^{n-r}b^r" />
        </>
      }
    >
      <p className="lbl">Expansion</p>
      <Equation latex={`(${left}+${right})^{${n}}=${terms.join('+')}`} />
      <p className="lbl mt-3">Pascal's triangle row</p>
      <p className="num">{Array.from({ length: n + 1 }, (_, r) => binomialCoefficient(n, r)).join('  ')}</p>
    </ToolLayout>
  );
}

export function Trig() {
  const [deg, setDeg] = useState(30);
  const rad = (deg * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const undefinedTan = Math.abs(c) < 1e-10;
  const undefinedCot = Math.abs(s) < 1e-10;
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Angle θ" value={deg} min={0} max={360} unit="°" onChange={setDeg} />
          <Readouts
            items={[
              ['In radians', fmt(rad, 6)],
              ['sin θ', fmt(s, 6)],
              ['cos θ', fmt(c, 6)],
              ['tan θ', undefinedTan ? 'undefined' : fmt(s / c, 6)],
              ['cosec θ', undefinedCot ? 'undefined' : fmt(1 / s, 6)],
              ['sec θ', undefinedTan ? 'undefined' : fmt(1 / c, 6)],
              ['cot θ', undefinedCot ? 'undefined' : fmt(c / s, 6)],
              ['sin²θ + cos²θ', fmt(s * s + c * c, 6)],
            ]}
          />
        </>
      }
    >
      <Canvas
        height={320}
        label={`Unit circle at ${deg} degrees.`}
        draw={(ctx, w, h) => {
          const cx = w / 2;
          const cy = h / 2;
          const r = Math.min(w, h) / 2 - 24;
          ctx.strokeStyle = token('rule-2');
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - r - 14, cy);
          ctx.lineTo(cx + r + 14, cy);
          ctx.moveTo(cx, cy - r - 14);
          ctx.lineTo(cx, cy + r + 14);
          ctx.stroke();
          ctx.strokeStyle = token('ink');
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
          const px = cx + r * c;
          const py = cy - r * s;
          ctx.lineWidth = 3;
          ctx.strokeStyle = token('physics');
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, cy);
          ctx.stroke();
          ctx.strokeStyle = token('accent');
          ctx.beginPath();
          ctx.moveTo(px, cy);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.strokeStyle = token('ink');
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.stroke();
          ctx.fillStyle = token('ink');
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
        }}
      />
      <p className="mt-1 text-step--1 text-ink-2">The horizontal line is cos θ and the vertical line is sin θ.</p>
    </ToolLayout>
  );
}

export function ComplexLab() {
  const [a, setA] = useState('3');
  const [b, setB] = useState('4');
  const re = num(a);
  const im = num(b);
  const valid = Number.isFinite(re) && Number.isFinite(im);
  const mod = Math.hypot(re, im);
  const arg = (Math.atan2(im, re) * 180) / Math.PI;
  const reach = Math.max(Math.abs(re), Math.abs(im), 1) * 1.3;
  return (
    <ToolLayout
      controls={
        <>
          <div className="grid grid-cols-2 gap-2">
            <NumField label="Real part a" value={a} onChange={setA} />
            <NumField label="Imaginary part b" value={b} onChange={setB} />
          </div>
          {valid ? (
            <Readouts
              items={[
                ['z', `${fmt(re)} ${im >= 0 ? '+' : '−'} ${fmt(Math.abs(im))}i`],
                ['Conjugate', `${fmt(re)} ${im >= 0 ? '−' : '+'} ${fmt(Math.abs(im))}i`],
                ['Modulus |z|', fmt(mod)],
                ['Argument', `${fmt(arg)}°`],
                ['Polar form', `${fmt(mod, 3)}(cos ${fmt(arg, 3)}° + i sin ${fmt(arg, 3)}°)`],
              ]}
            />
          ) : (
            <Warn text="Both parts must be numbers." />
          )}
          <Equation latex="|z|=\sqrt{a^2+b^2},\quad \arg z=\tan^{-1}\frac ba" />
        </>
      }
    >
      {valid && (
        <Plot
          height={320}
          label={`Argand diagram with z at ${re} plus ${im} i.`}
          model={{
            x: [-reach, reach],
            y: [-reach, reach],
            series: [{ points: [[0, 0], [re, im]], color: 'mathematics' }, { points: [[0, 0], [re, -im]], color: 'ink-3', dash: true, width: 1 }],
            markers: [{ x: re, y: im, label: 'z' }, { x: re, y: -im, color: 'ink-3', label: 'z̄' }],
            xLabel: 'Real',
            yLabel: 'Imaginary',
          }}
        />
      )}
    </ToolLayout>
  );
}

export function Vectors() {
  const [ax, setAx] = useState('3');
  const [ay, setAy] = useState('4');
  const [bx, setBx] = useState('1');
  const [by, setBy] = useState('2');
  const [a1, a2, b1, b2] = [num(ax), num(ay), num(bx), num(by)];
  const valid = [a1, a2, b1, b2].every(Number.isFinite);
  const magA = Math.hypot(a1, a2);
  const magB = Math.hypot(b1, b2);
  const dot = a1 * b1 + a2 * b2;
  const cross = a1 * b2 - a2 * b1;
  const cos = magA && magB ? dot / (magA * magB) : NaN;
  const angle = (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
  const rx = a1 + b1;
  const ry = a2 + b2;
  const reach = Math.max(Math.abs(a1), Math.abs(a2), Math.abs(b1), Math.abs(b2), Math.abs(rx), Math.abs(ry), 1) * 1.2;
  return (
    <ToolLayout
      controls={
        <>
          <div className="grid grid-cols-2 gap-2">
            <NumField label="Aₓ" value={ax} onChange={setAx} />
            <NumField label="Aᵧ" value={ay} onChange={setAy} />
            <NumField label="Bₓ" value={bx} onChange={setBx} />
            <NumField label="Bᵧ" value={by} onChange={setBy} />
          </div>
          {valid ? (
            <Readouts
              items={[
                ['|A|', fmt(magA)],
                ['|B|', fmt(magB)],
                ['A + B', `(${fmt(rx)}, ${fmt(ry)})`],
                ['|A + B|', fmt(Math.hypot(rx, ry))],
                ['Direction of A + B', `${fmt((Math.atan2(ry, rx) * 180) / Math.PI)}°`],
                ['A · B', fmt(dot)],
                ['|A × B|', fmt(Math.abs(cross))],
                ['Angle between', Number.isFinite(angle) ? `${fmt(angle)}°` : 'undefined'],
              ]}
            />
          ) : (
            <Warn text="All four components must be numbers." />
          )}
          <Equation latex="\vec A\cdot\vec B=A_xB_x+A_yB_y=AB\cos\theta" />
        </>
      }
    >
      {valid && (
        <Canvas
          height={340}
          label={`Vectors A and B, with their resultant ${fmt(rx)}, ${fmt(ry)}.`}
          draw={(ctx, w, h) => {
            const v = drawPlot(ctx, w, h, { x: [-reach, reach], y: [-reach, reach], xLabel: 'x', yLabel: 'y' });
            const arrow = (x0: number, y0: number, x1: number, y1: number, color: string, dash = false) => {
              const [p0, q0, p1, q1] = [v.toPx(x0), v.toPy(y0), v.toPx(x1), v.toPy(y1)];
              ctx.strokeStyle = token(color);
              ctx.fillStyle = token(color);
              ctx.lineWidth = 2;
              ctx.setLineDash(dash ? [5, 4] : []);
              ctx.beginPath();
              ctx.moveTo(p0, q0);
              ctx.lineTo(p1, q1);
              ctx.stroke();
              ctx.setLineDash([]);
              const t = Math.atan2(q1 - q0, p1 - p0);
              ctx.beginPath();
              ctx.moveTo(p1, q1);
              ctx.lineTo(p1 - 10 * Math.cos(t - 0.4), q1 - 10 * Math.sin(t - 0.4));
              ctx.lineTo(p1 - 10 * Math.cos(t + 0.4), q1 - 10 * Math.sin(t + 0.4));
              ctx.closePath();
              ctx.fill();
            };
            arrow(a1, a2, rx, ry, 'rule-2', true);
            arrow(b1, b2, rx, ry, 'rule-2', true);
            arrow(0, 0, a1, a2, 'physics');
            arrow(0, 0, b1, b2, 'chemistry');
            arrow(0, 0, rx, ry, 'accent');
          }}
        />
      )}
      <div className="legend">
        <span><i style={{ '--c': 'var(--physics)' } as React.CSSProperties} />A</span>
        <span><i style={{ '--c': 'var(--chemistry)' } as React.CSSProperties} />B</span>
        <span><i style={{ '--c': 'var(--accent)' } as React.CSSProperties} />A + B</span>
      </div>
    </ToolLayout>
  );
}
