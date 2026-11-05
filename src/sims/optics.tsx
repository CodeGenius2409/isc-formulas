import { usePreset } from './lib/question-mode';
import { useState } from 'react';
import { Canvas, Plot, token } from './lib/plot';
import { Equation, fmt, Readouts, Slider, ToolLayout } from './lib/ui';

const arrow = (ctx: CanvasRenderingContext2D, x: number, y0: number, y1: number) => {
  ctx.beginPath();
  ctx.moveTo(x, y0);
  ctx.lineTo(x, y1);
  const dir = y1 < y0 ? 1 : -1;
  ctx.lineTo(x - 5, y1 + 8 * dir);
  ctx.moveTo(x, y1);
  ctx.lineTo(x + 5, y1 + 8 * dir);
  ctx.stroke();
};

export function Lens() {
  const [f, setF] = usePreset('f', 20);
  const [u, setU] = usePreset('u', -40);
  const atFocus = Math.abs(u + f) < 0.01;
  // Cartesian sign convention: 1/v − 1/u = 1/f, with u negative for a real object.
  const v = atFocus ? Infinity : 1 / (1 / f + 1 / u);
  const m = atFocus ? Infinity : v / u;
  const real = v > 0;
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Focal length f" value={f} min={-50} max={50} unit="cm" onChange={(x) => setF(x === 0 ? 1 : x)} />
          <Slider label="Object distance u" value={u} min={-100} max={-5} unit="cm" onChange={setU} />
          <Readouts
            items={[
              ['Lens', f > 0 ? 'convex' : 'concave'],
              ['Image distance v', atFocus ? 'at infinity' : `${fmt(v)} cm`],
              ['Magnification m', atFocus ? 'undefined' : fmt(m)],
              ['Image', atFocus ? 'none formed' : `${real ? 'real' : 'virtual'}, ${m < 0 ? 'inverted' : 'erect'}, ${Math.abs(m) > 1 ? 'enlarged' : Math.abs(m) < 1 ? 'diminished' : 'same size'}`],
            ]}
          />
          <Equation latex="\frac1v-\frac1u=\frac1f,\quad m=\frac vu" />
        </>
      }
    >
      <Canvas
        height={320}
        label={`Ray diagram. Object at ${u} centimetres, focal length ${f} centimetres, image at ${atFocus ? 'infinity' : `${fmt(v)} centimetres`}.`}
        draw={(ctx, w, h) => {
          const ox = w / 2;
          const oy = h / 2;
          const reach = Math.max(Math.abs(u), Math.abs(f) * 1.5, atFocus ? 0 : Math.min(Math.abs(v), 150), 50);
          const sc = (w / 2 - 20) / (reach * 1.1);
          const objH = 44;
          ctx.lineWidth = 1;
          ctx.strokeStyle = token('rule-2');
          ctx.beginPath();
          ctx.moveTo(0, oy);
          ctx.lineTo(w, oy);
          ctx.stroke();

          ctx.strokeStyle = token('physics');
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ox, oy - h * 0.42);
          ctx.lineTo(ox, oy + h * 0.42);
          ctx.stroke();

          ctx.fillStyle = token('ink-2');
          ctx.font = "12px 'Atkinson Hyperlegible Mono Variable', monospace";
          ctx.textAlign = 'center';
          for (const s of [-1, 1]) {
            const fx = ox + s * Math.abs(f) * sc;
            ctx.fillRect(fx - 1, oy - 4, 2, 8);
            ctx.fillText('F', fx, oy + 18);
          }

          ctx.strokeStyle = token('ink');
          ctx.lineWidth = 2;
          const objX = ox + u * sc;
          arrow(ctx, objX, oy, oy - objH);

          const tip = { x: objX, y: oy - objH };
          ctx.strokeStyle = token('accent');
          ctx.lineWidth = 1;
          ctx.beginPath();
          // Ray 1: parallel to the axis, then through the focus.
          ctx.moveTo(tip.x, tip.y);
          ctx.lineTo(ox, tip.y);
          const slope = (oy - tip.y) / (f * sc);
          ctx.lineTo(w, tip.y + slope * (w - ox));
          // Ray 2: straight through the centre of the lens.
          ctx.moveTo(tip.x, tip.y);
          const s2 = (oy - tip.y) / (ox - tip.x);
          ctx.lineTo(w, oy + s2 * (w - ox));
          ctx.stroke();

          if (!atFocus && Number.isFinite(v) && Math.abs(v) < 400) {
            const imgX = ox + v * sc;
            const imgH = objH * m;
            if (!real) {
              // A virtual image sits where the rays appear to come from.
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(ox, tip.y);
              ctx.lineTo(imgX, oy - imgH);
              ctx.moveTo(ox, oy);
              ctx.lineTo(imgX, oy - imgH);
              ctx.stroke();
              ctx.setLineDash([]);
            }
            ctx.strokeStyle = token('chemistry');
            ctx.lineWidth = 2;
            if (!real) ctx.setLineDash([4, 3]);
            arrow(ctx, imgX, oy, oy - imgH);
            ctx.setLineDash([]);
          }
        }}
      />
    </ToolLayout>
  );
}

export function Snell() {
  const [n1, setN1] = useState(1.5);
  const [n2, setN2] = useState(1);
  const [iDeg, setI] = useState(30);
  const i = (iDeg * Math.PI) / 180;
  const s = (n1 * Math.sin(i)) / n2;
  const tir = s > 1;
  const r = tir ? NaN : Math.asin(s);
  const critical = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Refractive index n₁ (upper)" value={n1} min={1} max={2.5} step={0.05} onChange={setN1} />
          <Slider label="Refractive index n₂ (lower)" value={n2} min={1} max={2.5} step={0.05} onChange={setN2} />
          <Slider label="Angle of incidence" value={iDeg} min={0} max={89} unit="°" onChange={setI} />
          <Readouts
            items={[
              ['Angle of refraction', tir ? 'total internal reflection' : `${fmt((r * 180) / Math.PI)}°`],
              ['Critical angle', critical === null ? 'none (needs n₁ > n₂)' : `${fmt(critical)}°`],
            ]}
          />
          <Equation latex="n_1\sin i=n_2\sin r,\quad \sin i_c=\frac{n_2}{n_1}" />
        </>
      }
    >
      <Canvas
        height={320}
        label={tir ? 'The ray reflects completely at the boundary.' : `The ray refracts to ${fmt((r * 180) / Math.PI, 3)} degrees.`}
        draw={(ctx, w, h) => {
          const cx = w / 2;
          const cy = h / 2;
          const L = Math.min(w, h) * 0.46;
          ctx.fillStyle = token('paper-3');
          ctx.fillRect(0, cy, w, h / 2);
          ctx.strokeStyle = token('rule-2');
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, cy);
          ctx.lineTo(w, cy);
          ctx.stroke();
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(cx, cy - L);
          ctx.lineTo(cx, cy + L);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.strokeStyle = token('accent');
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx - L * Math.sin(i), cy - L * Math.cos(i));
          ctx.lineTo(cx, cy);
          if (tir) ctx.lineTo(cx + L * Math.sin(i), cy - L * Math.cos(i));
          else ctx.lineTo(cx + L * Math.sin(r), cy + L * Math.cos(r));
          ctx.stroke();
          if (!tir) {
            // A weak reflected ray is always present at a boundary.
            ctx.globalAlpha = 0.35;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + L * Math.sin(i), cy - L * Math.cos(i));
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
          ctx.fillStyle = token('ink-2');
          ctx.font = "13px 'Atkinson Hyperlegible Mono Variable', monospace";
          ctx.textBaseline = 'alphabetic';
          ctx.textAlign = 'left';
          ctx.fillText(`n₁ = ${n1}`, 10, 20);
          ctx.fillText(`n₂ = ${n2}`, 10, h - 10);
        }}
      />
    </ToolLayout>
  );
}

export function Ydse() {
  const [nm, setNm] = usePreset('nm', 600);
  const [dmm, setD] = usePreset('dmm', 0.5);
  const [L, setL] = usePreset('L', 1);
  const lambda = nm * 1e-9;
  const d = dmm * 1e-3;
  const beta = (lambda * L) / d;
  const span = 5 * beta * 1000;
  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Wavelength λ" value={nm} min={400} max={700} unit="nm" onChange={setNm} />
          <Slider label="Slit separation d" value={dmm} min={0.1} max={2} step={0.05} unit="mm" onChange={setD} />
          <Slider label="Screen distance D" value={L} min={0.5} max={3} step={0.1} unit="m" onChange={setL} />
          <Readouts items={[['Fringe width β', `${fmt(beta * 1000)} mm`], ['Angular fringe width', `${fmt(lambda / d)} rad`]]} />
          <Equation latex="\beta=\frac{\lambda D}{d},\quad I=4I_0\cos^2\frac{\pi dy}{\lambda D}" />
        </>
      }
    >
      <Plot
        height={280}
        label={`Interference pattern with fringe width ${fmt(beta * 1000)} millimetres.`}
        model={{
          x: [-span, span],
          y: [0, 1.15],
          series: [{ fn: (y) => Math.cos((Math.PI * d * (y / 1000)) / (lambda * L)) ** 2, color: 'physics' }],
          xLabel: 'Position on the screen (mm)',
          yLabel: 'Relative intensity',
        }}
      />
      <Canvas
        height={60}
        label="The bright and dark fringes as they appear on the screen."
        style={{ marginTop: 8 }}
        draw={(ctx, w, h) => {
          ctx.fillStyle = `hsl(${Math.max(0, Math.min(270, 270 - ((nm - 400) / 300) * 270))} 90% 50%)`;
          for (let px = 0; px < w; px++) {
            const y = (-span + (2 * span * px) / w) / 1000;
            ctx.globalAlpha = Math.cos((Math.PI * d * y) / (lambda * L)) ** 2;
            ctx.fillRect(px, 0, 1, h);
          }
          ctx.globalAlpha = 1;
        }}
      />
    </ToolLayout>
  );
}
