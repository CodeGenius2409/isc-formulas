import { useMemo, useRef, useState } from 'react';
import { Pin, RotateCcw, X } from 'lucide-react';
import { prefersReducedMotion } from '../lib/motion';
import { Canvas, drawPlot, token, useAnimation, type Series } from './lib/plot';
import { idealTrajectory, positionAt, simulate, type LaunchParams, type Trajectory } from './lib/projectile';
import { fmt, Legend, Readouts, Slider, Toggle, ToolLayout } from './lib/ui';

const COMPARE_COLOURS = ['chemistry', 'mathematics', 'computerscience'];

interface Saved {
  label: string;
  trajectory: Trajectory;
  color: string;
}

export function Projectile() {
  const [speed, setSpeed] = useState(20);
  const [angle, setAngle] = useState(45);
  const [height, setHeight] = useState(0);
  const [g, setG] = useState(9.8);
  const [dragOn, setDragOn] = useState(false);
  const [drag, setDrag] = useState(0.1);
  const [saved, setSaved] = useState<Saved[]>([]);

  const params: LaunchParams = { speed, angle, height, g, drag: dragOn ? drag : 0 };
  const trajectory = useMemo(() => simulate(params), [speed, angle, height, g, dragOn, drag]); // eslint-disable-line react-hooks/exhaustive-deps
  const ideal = useMemo(() => idealTrajectory({ ...params, drag: 0 }), [speed, angle, height, g]); // eslint-disable-line react-hooks/exhaustive-deps

  // The ball replays on every change. Without motion it rests at the landing point.
  const startRef = useRef(0);
  const [ballT, setBallT] = useState(trajectory.flightTime);
  const lastKey = useRef('');
  const key = `${speed}|${angle}|${height}|${g}|${dragOn}|${drag}`;
  useAnimation((now) => {
    if (lastKey.current !== key) {
      lastKey.current = key;
      startRef.current = now;
    }
    const t = Math.min((now - startRef.current) * 1.2, trajectory.flightTime);
    setBallT(t);
  }, true);

  const pts = [...saved.map((s) => s.trajectory), trajectory];
  const maxX = Math.max(...pts.map((t) => t.range), 1) * 1.06;
  const maxY = Math.max(...pts.map((t) => t.maxHeight), 1) * 1.15;

  const series: Series[] = [...saved.map((s) => ({ points: s.trajectory.points, color: s.color, dash: true })), { points: trajectory.points, color: 'physics' }];
  if (dragOn) {
    series.unshift({ points: simulate({ ...params, drag: 0 }).points, color: 'ink-3', dash: true, width: 1 });
  }

  const [bx, by] = positionAt(trajectory, prefersReducedMotion() ? trajectory.flightTime : ballT);
  const summary = `Trajectory: range ${fmt(trajectory.range)} metres, maximum height ${fmt(trajectory.maxHeight)} metres, flight time ${fmt(trajectory.flightTime)} seconds.`;

  return (
    <ToolLayout
      controls={
        <>
          <Slider label="Launch speed" value={speed} min={1} max={60} step={0.5} unit="m/s" onChange={setSpeed} />
          <Slider label="Launch angle" value={angle} min={0} max={90} unit="°" onChange={setAngle} />
          <Slider label="Launch height" value={height} min={0} max={50} step={0.5} unit="m" onChange={setHeight} />
          <Slider label="Gravity" value={g} min={1} max={25} step={0.1} unit="m/s²" onChange={setG} />
          <Toggle label="Air drag" checked={dragOn} onChange={setDragOn} />
          {dragOn && <Slider label="Drag rate k (a = −kv)" value={drag} min={0.01} max={1} step={0.01} unit="s⁻¹" onChange={setDrag} />}
          <Readouts
            items={[
              ['Range', `${fmt(trajectory.range)} m`],
              ['Maximum height', `${fmt(trajectory.maxHeight)} m`],
              ['Time of flight', `${fmt(trajectory.flightTime)} s`],
              ...(dragOn ? ([['Range without drag', `${fmt(ideal.range)} m`]] as [string, string][]) : []),
            ]}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-line"
              disabled={saved.length >= COMPARE_COLOURS.length}
              onClick={() => setSaved((list) => [...list, { label: `${speed} m/s at ${angle}°${dragOn ? ', drag' : ''}`, trajectory, color: COMPARE_COLOURS[list.length] }])}
            >
              <Pin size={15} aria-hidden /> Keep to compare
            </button>
            {saved.length > 0 && (
              <button type="button" className="btn btn-quiet" onClick={() => setSaved([])}>
                <X size={15} aria-hidden /> Clear
              </button>
            )}
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() => {
                lastKey.current = '';
              }}
            >
              <RotateCcw size={15} aria-hidden /> Replay
            </button>
          </div>
        </>
      }
    >
      <Canvas
        height={340}
        label={summary}
        draw={(ctx, w, h) => {
          const v = drawPlot(ctx, w, h, { x: [0, maxX], y: [0, maxY], series, xLabel: 'Distance (m)', yLabel: 'Height (m)' });
          ctx.fillStyle = token('accent');
          ctx.beginPath();
          ctx.arc(v.toPx(bx), v.toPy(by), 6, 0, Math.PI * 2);
          ctx.fill();
        }}
      />
      <Legend items={[{ label: `Now: ${speed} m/s at ${angle}°`, color: 'physics' }, ...(dragOn ? [{ label: 'Same launch without drag', color: 'ink-3', dash: true }] : []), ...saved.map((s) => ({ label: s.label, color: s.color, dash: true }))]} />
    </ToolLayout>
  );
}
