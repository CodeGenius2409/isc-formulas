import { useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { CircuitElement, DiagramSpec } from '../../practice/bank/diagram';

/** A resistor along a horizontal line: the standard zigzag, with wire either side. */
function zigzag(x1: number, x2: number, y: number): string {
  const start = (x1 + x2) / 2 - 30;
  const peaks = Array.from({ length: 6 }, (_, i) => `L${start + 5 + i * 10} ${y + (i % 2 ? 7 : -7)}`).join(' ');
  return `M${x1} ${y} L${start} ${y} ${peaks} L${start + 60} ${y} L${x2} ${y}`;
}

/** A cell on a horizontal wire: the long plate is the positive terminal. */
function Cell({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const mid = (x1 + x2) / 2;
  return (
    <>
      <path d={`M${x1} ${y} L${mid - 4} ${y} M${mid + 4} ${y} L${x2} ${y} M${mid - 4} ${y - 14} L${mid - 4} ${y + 14}`} />
      <path d={`M${mid + 4} ${y - 7} L${mid + 4} ${y + 7}`} strokeWidth={3} />
    </>
  );
}

function Label({ x, y, children, anchor = 'middle' }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} textAnchor={anchor} stroke="none" fill="currentColor" fontSize={13}>
      {children}
    </text>
  );
}

/** A resistor on a slanted arm of the bridge, drawn level and then turned. */
function Arm({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return <path d={zigzag(0, length, 0)} transform={`translate(${x1} ${y1}) rotate(${angle})`} />;
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a = 7;
  const p1 = `${x2 - a * Math.cos(angle - 0.45)} ${y2 - a * Math.sin(angle - 0.45)}`;
  const p2 = `${x2 - a * Math.cos(angle + 0.45)} ${y2 - a * Math.sin(angle + 0.45)}`;
  return <path d={`M${x1} ${y1} L${x2} ${y2} M${p1} L${x2} ${y2} L${p2}`} />;
}

// ---- Circuits, from a list of elements

const elementWidth = (e: CircuitElement): number => (e.type === 'parallel' ? Math.max(...e.branches.map((b) => b.reduce((sum, x) => sum + elementWidth(x), 0))) + 30 : e.type === 'switch' ? 50 : 86);
const elementHeight = (e: CircuitElement): number => (e.type === 'parallel' ? e.branches.length * 56 : 40);

function DrawElement({ e, x, y }: { e: CircuitElement; x: number; y: number }) {
  const w = elementWidth(e);
  if (e.type === 'parallel') {
    const gap = 56;
    const top = y - ((e.branches.length - 1) * gap) / 2;
    return (
      <>
        <path d={`M${x} ${top} L${x} ${top + (e.branches.length - 1) * gap} M${x + w} ${top} L${x + w} ${top + (e.branches.length - 1) * gap}`} />
        {e.branches.map((branch, i) => {
          const by = top + i * gap;
          const inner = branch.reduce((sum, item) => sum + elementWidth(item), 0);
          let cursor = x + (w - inner) / 2;
          return (
            <g key={i}>
              <path d={`M${x} ${by} L${cursor} ${by} M${cursor + inner} ${by} L${x + w} ${by}`} />
              {branch.map((item, j) => {
                const at = cursor;
                cursor += elementWidth(item);
                return <DrawElement key={j} e={item} x={at} y={by} />;
              })}
            </g>
          );
        })}
        <circle cx={x} cy={y} r={2.5} fill="currentColor" />
        <circle cx={x + w} cy={y} r={2.5} fill="currentColor" />
      </>
    );
  }
  const mid = x + w / 2;
  switch (e.type) {
    case 'R':
      return (
        <>
          <path d={zigzag(x, x + w, y)} />
          {e.label && <Label x={mid} y={y - 12}>{e.label}</Label>}
        </>
      );
    case 'C':
      return (
        <>
          <path d={`M${x} ${y} L${mid - 4} ${y} M${mid + 4} ${y} L${x + w} ${y} M${mid - 4} ${y - 13} L${mid - 4} ${y + 13} M${mid + 4} ${y - 13} L${mid + 4} ${y + 13}`} />
          {e.label && <Label x={mid} y={y - 18}>{e.label}</Label>}
        </>
      );
    case 'L': {
      const loops = Array.from({ length: 4 }, () => 'a7 7 0 0 1 14 0').join(' ');
      return (
        <>
          <path d={`M${x} ${y} L${mid - 28} ${y} ${loops} L${x + w} ${y}`} />
          {e.label && <Label x={mid} y={y - 12}>{e.label}</Label>}
        </>
      );
    }
    case 'diode':
      return (
        <>
          <path d={`M${x} ${y} L${mid - 10} ${y} M${mid + 10} ${y} L${x + w} ${y} ${e.reverse ? `M${mid + 10} ${y - 10} L${mid + 10} ${y + 10} L${mid - 10} ${y} Z M${mid - 10} ${y - 10} L${mid - 10} ${y + 10}` : `M${mid - 10} ${y - 10} L${mid - 10} ${y + 10} L${mid + 10} ${y} Z M${mid + 10} ${y - 10} L${mid + 10} ${y + 10}`}`} />
          {e.label && <Label x={mid} y={y - 16}>{e.label}</Label>}
        </>
      );
    case 'switch':
      return <path d={`M${x} ${y} L${mid - 12} ${y} L${mid + 10} ${y - 12} M${mid + 12} ${y} L${x + w} ${y}`} />;
    case 'meter':
      return (
        <>
          <path d={`M${x} ${y} L${mid - 12} ${y} M${mid + 12} ${y} L${x + w} ${y}`} />
          <circle cx={mid} cy={y} r={12} />
          <Label x={mid} y={y + 5}>{e.meter}</Label>
          {e.label && <Label x={mid} y={y - 18}>{e.label}</Label>}
        </>
      );
  }
}

function CircuitFigure({ spec }: { spec: Extract<DiagramSpec, { kind: 'circuit' }> }) {
  const inner = spec.loop.reduce((sum, e) => sum + elementWidth(e), 0);
  const width = Math.max(inner + 60, 320);
  const tall = Math.max(...spec.loop.map(elementHeight), 40);
  const top = 22 + tall / 2;
  const bottom = top + tall / 2 + 50;
  const left = 30;
  const right = width - 30;
  let cursor = left + (right - left - inner) / 2;
  const sourceMid = (left + right) / 2;
  return (
    <svg className="bank-diagram" viewBox={`0 0 ${width} ${bottom + 34}`} role="img" aria-label={describe(spec)} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d={`M${left} ${bottom} L${left} ${top} L${cursor} ${top} M${cursor + inner} ${top} L${right} ${top} L${right} ${bottom}`} />
      {spec.loop.map((e, i) => {
        const at = cursor;
        cursor += elementWidth(e);
        return <DrawElement key={i} e={e} x={at} y={top} />;
      })}
      {spec.source.type === 'cell' ? (
        <Cell x1={left} x2={spec.source.r ? sourceMid + 20 : right} y={bottom} />
      ) : (
        <>
          <path d={`M${left} ${bottom} L${sourceMid - 14} ${bottom} M${sourceMid + 14} ${bottom} L${right} ${bottom}`} />
          <circle cx={sourceMid} cy={bottom} r={14} />
          <path d={`M${sourceMid - 8} ${bottom} q4 -8 8 0 t8 0`} />
        </>
      )}
      {spec.source.r && <path d={zigzag(sourceMid + 20, right, bottom)} />}
      <Label x={spec.source.r ? (left + sourceMid + 20) / 2 : sourceMid} y={bottom + 28}>{spec.source.label}</Label>
      {spec.source.r && <Label x={(sourceMid + 20 + right) / 2} y={bottom + 24}>{`r = ${spec.source.r}`}</Label>}
    </svg>
  );
}

// ---- Optics

/** Object, optical element and focal points, to scale. The image is never drawn, as that would answer the question. */
function LensFigure({ spec }: { spec: Extract<DiagramSpec, { kind: 'lens' | 'mirror' }> }) {
  const reach = Math.max(spec.u * 1.15, spec.f * 2.4);
  const isLens = spec.kind === 'lens';
  const w = 360;
  const cx = isLens ? 220 : 300;
  const scale = (cx - 20) / reach;
  const axis = 90;
  const fx = spec.f * scale;
  const ox = cx - spec.u * scale;
  return (
    <svg className="bank-diagram" viewBox={`0 0 ${w} 170`} role="img" aria-label={describe(spec)} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d={`M6 ${axis} L${w - 6} ${axis}`} strokeDasharray="5 4" strokeWidth={1} />
      {spec.kind === 'lens' ? (
        spec.lens === 'convex' ? (
          <path d={`M${cx} ${axis - 58} Q${cx + 16} ${axis} ${cx} ${axis + 58} Q${cx - 16} ${axis} ${cx} ${axis - 58}`} />
        ) : (
          <path d={`M${cx - 8} ${axis - 58} L${cx + 8} ${axis - 58} Q${cx - 3} ${axis} ${cx + 8} ${axis + 58} L${cx - 8} ${axis + 58} Q${cx + 3} ${axis} ${cx - 8} ${axis - 58}`} />
        )
      ) : (
        <path d={spec.mirror === 'concave' ? `M${cx - 16} ${axis - 58} Q${cx + 16} ${axis} ${cx - 16} ${axis + 58}` : `M${cx + 8} ${axis - 58} Q${cx - 16} ${axis} ${cx + 8} ${axis + 58}`} />
      )}
      <Arrow x1={ox} y1={axis} x2={ox} y2={axis - 38} />
      <Label x={ox} y={axis - 44}>Object</Label>
      <circle cx={cx - fx} cy={axis} r={2.5} fill="currentColor" />
      <Label x={cx - fx} y={axis + 18}>F</Label>
      {isLens && (
        <>
          <circle cx={cx + fx} cy={axis} r={2.5} fill="currentColor" />
          <Label x={cx + fx} y={axis + 18}>F</Label>
        </>
      )}
      <path d={`M${ox} ${axis + 34} L${cx} ${axis + 34}`} strokeWidth={1} />
      <Label x={(ox + cx) / 2} y={axis + 50}>{spec.uLabel}</Label>
      <path d={`M${cx - fx} ${axis - 62} L${cx} ${axis - 62}`} strokeWidth={1} />
      <Label x={cx - fx / 2} y={axis - 67}>{spec.fLabel}</Label>
    </svg>
  );
}

// ---- Graphs

function GraphFigure({ spec }: { spec: Extract<DiagramSpec, { kind: 'graph' }> }) {
  const all = spec.lines.flatMap((l) => l.points);
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const minX = Math.min(0, ...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(0, ...ys);
  const maxY = Math.max(...ys);
  const [left, right, top, bottom] = [46, 300, 28, 170];
  const px = (x: number) => left + ((x - minX) / (maxX - minX || 1)) * (right - left);
  const py = (y: number) => bottom - ((y - minY) / (maxY - minY || 1)) * (bottom - top);
  const originY = py(0);
  const originX = px(0);
  return (
    <svg className="bank-diagram" viewBox="0 0 320 210" role="img" aria-label={describe(spec)} fill="none" stroke="currentColor" strokeWidth={1.5}>
      <Arrow x1={originX} y1={bottom + 6} x2={originX} y2={top - 6} />
      <Arrow x1={left - 6} y1={originY} x2={right + 10} y2={originY} />
      <Label x={(left + right) / 2} y={204}>{spec.x}</Label>
      <text x={12} y={(top + bottom) / 2} textAnchor="middle" stroke="none" fill="currentColor" fontSize={13} transform={`rotate(-90 12 ${(top + bottom) / 2})`}>
        {spec.y}
      </text>
      {spec.lines.map((line, i) => {
        const end = line.points[line.points.length - 1];
        const d = line.points.map((p, j) => `${j ? 'L' : 'M'}${px(p[0]).toFixed(1)} ${py(p[1]).toFixed(1)}`).join(' ');
        return (
          <g key={i}>
            <path d={d} strokeWidth={2} strokeDasharray={i === 1 ? '6 3' : undefined} />
            {line.label && <Label x={px(end[0]) - 2} y={py(end[1]) - 6} anchor="end">{line.label}</Label>}
          </g>
        );
      })}
      {spec.ticksX?.map(([x, label]) => (
        <g key={label}>
          <path d={`M${px(x)} ${originY - 4} L${px(x)} ${originY + 4}`} />
          <Label x={px(x)} y={originY + 17}>{label}</Label>
        </g>
      ))}
      {spec.ticksY?.map(([y, label]) => (
        <g key={label}>
          <path d={`M${originX - 4} ${py(y)} L${originX + 4} ${py(y)}`} />
          <Label x={originX - 8} y={py(y) + 4} anchor="end">{label}</Label>
        </g>
      ))}
    </svg>
  );
}

// ---- Binary trees

function TreeFigure({ spec }: { spec: Extract<DiagramSpec, { kind: 'tree' }> }) {
  const place: { x: number; y: number }[] = [];
  let next = 0;
  const depthOf = (i: number): number => 1 + Math.max(spec.nodes[i].left !== undefined ? depthOf(spec.nodes[i].left!) : 0, spec.nodes[i].right !== undefined ? depthOf(spec.nodes[i].right!) : 0);
  const levels = depthOf(0);
  const walk = (i: number, depth: number) => {
    const n = spec.nodes[i];
    if (n.left !== undefined) walk(n.left, depth + 1);
    place[i] = { x: 24 + next * 40, y: 22 + depth * 46 };
    next++;
    if (n.right !== undefined) walk(n.right, depth + 1);
  };
  walk(0, 0);
  const width = next * 40 + 8;
  return (
    <svg className="bank-diagram" viewBox={`0 0 ${width} ${levels * 46 + 8}`} role="img" aria-label={describe(spec)} fill="none" stroke="currentColor" strokeWidth={1.5}>
      {spec.nodes.flatMap((n, i) => [n.left, n.right].flatMap((c) => (c === undefined ? [] : [<path key={`${i}-${c}`} d={`M${place[i].x} ${place[i].y} L${place[c].x} ${place[c].y}`} />])))}
      {spec.nodes.map((n, i) => (
        <g key={i}>
          <circle cx={place[i].x} cy={place[i].y} r={14} fill="var(--paper)" />
          <Label x={place[i].x} y={place[i].y + 5}>{n.label}</Label>
        </g>
      ))}
    </svg>
  );
}

// ---- Words, for anyone who can't see the figure

const inWords = (list: CircuitElement[]): string =>
  list
    .map((e) => {
      if (e.type === 'parallel') return `a parallel group of ${e.branches.map(inWords).join(' and ')}`;
      const names = { R: 'a resistor', C: 'a capacitor', L: 'an inductor', switch: 'a switch', diode: 'a diode', meter: 'a meter' } as const;
      return `${names[e.type]}${e.label ? ` of ${e.label}` : ''}`;
    })
    .join(', then ');

export function describe(spec: DiagramSpec): string {
  switch (spec.kind) {
    case 'vectors':
      return `Two arrows from one point, ${spec.a} and ${spec.b}, with ${spec.angle} between them.`;
    case 'circle':
      return `A body${spec.m ? ` of ${spec.m}` : ''} moving at ${spec.v} on a circular path of radius ${spec.r}.`;
    case 'hill':
      return `A track falling from a height of ${spec.H}${spec.point ? `, with a point on it at ${spec.point.label}` : ''}.`;
    case 'trolleys':
      return `A trolley of ${spec.a} moving at ${spec.v} towards a trolley of ${spec.b} at rest.`;
    case 'lever':
      return `A door hinged at one end. A force of ${spec.F} acts ${spec.r} from the hinge, at ${spec.angle} to the door.`;
    case 'axis-masses':
      return `Masses on an axis: ${spec.items.map((i) => `${i.m} at ${i.x}`).join(', ')}.`;
    case 'pipe':
      return `A pipe narrowing from a cross-section of ${spec.a1}, where the flow is ${spec.v1}, to ${spec.a2}.`;
    case 'tank':
      return `A tank of water with a hole in its side, ${spec.h} below the surface.`;
    case 'capillary':
      return `A thin tube of radius ${spec.r} standing in a liquid, with the rise marked h.`;
    case 'engine':
      return `A heat engine taking heat from a reservoir at ${spec.hot}, giving out work, and rejecting heat to a reservoir at ${spec.cold}.`;
    case 'standing':
      return `The fundamental mode of ${spec.ends === 'fixed' ? 'a string fixed at both ends' : spec.ends === 'open' ? 'an air column open at both ends' : 'an air column closed at one end'}, of length ${spec.L}.`;
    case 'in-field':
      return `A ${spec.body} (${spec.label})${spec.body === 'coil' ? ' with its normal' : ''} at ${spec.angle} to a uniform field of ${spec.B}.`;
    case 'parallel-wires':
      return `Two parallel wires ${spec.d} apart, carrying ${spec.i1} and ${spec.i2} in ${spec.same ? 'the same direction' : 'opposite directions'}.`;
    case 'field-entry':
      return `A ${spec.q} entering at ${spec.v}, at right angles, a magnetic field of ${spec.B} going into the page.`;
    case 'transformer':
      return `A transformer. Primary: ${spec.primary.join(', ')}. Secondary: ${spec.secondary.join(', ')}.`;
    case 'refraction':
      return `A ray going from ${spec.top} into ${spec.bottom}, with angle of incidence ${spec.i} and angle of refraction ${spec.r}.`;
    case 'telescope':
      return `An objective of focal length ${spec.fo} and an eyepiece of focal length ${spec.fe} on one axis.`;
    case 'photoelectric':
      return `Light of ${spec.light} falling on a metal with a work function of ${spec.metal}, and an electron leaving the surface.`;
    case 'drop':
      return `A ball falling from a height of ${spec.h}${spec.rebound ? ` and rebounding to ${spec.rebound.label}` : ''}.`;
    case 'hanging':
      return `A wire of length ${spec.L} and cross-section ${spec.A} hanging from a support, with a load of ${spec.F}${spec.e ? `, stretching it by ${spec.e}` : ''}.`;
    case 'lens-surfaces':
      return `A biconvex lens of refractive index ${spec.n}, with faces of radii ${spec.r1} and ${spec.r2}.`;
    case 'coil':
      return `A flat circular coil of ${spec.turns} and radius ${spec.r}, carrying ${spec.I}, with its centre marked.`;
    case 'cell-parallel':
      return `A cell of emf ${spec.emf} and internal resistance ${spec.r}, connected across resistors of ${spec.r1} and ${spec.r2} in parallel.`;
    case 'series-capacitors':
      return `Capacitors of ${spec.c1} and ${spec.c2} in series across a supply of ${spec.v}.`;
    case 'wheatstone':
      return `A Wheatstone bridge with a galvanometer between the two middle points. The top arms are P = ${spec.p} and Q = ${spec.q}. The bottom arms are R = ${spec.r} and S = ${spec.s}.`;
    case 'circuit':
      return `A circuit with ${spec.source.type === 'ac' ? 'an a.c. source' : 'a cell'} of ${spec.source.label}${spec.source.r ? ` and internal resistance ${spec.source.r}` : ''}, in series with ${inWords(spec.loop)}.`;
    case 'lens':
      return `A ${spec.lens} lens, with an object ${spec.uLabel} to its left on the axis, and focal points marked. The focal length is ${spec.fLabel}. The image isn't drawn.`;
    case 'mirror':
      return `A ${spec.mirror} mirror, with an object ${spec.uLabel} in front of it on the axis, and its focus marked. The focal length is ${spec.fLabel}. The image isn't drawn.`;
    case 'prism':
      return `A triangular prism of angle ${spec.angle}, with a ray entering one face${spec.incidence ? ` at ${spec.incidence}` : ''}.`;
    case 'ydse':
      return `Young's double slit: two slits ${spec.d} apart, a screen ${spec.D} away, and light of wavelength ${spec.lambda}.`;
    case 'graph':
      return `A graph of ${spec.y} on the vertical axis against ${spec.x} on the horizontal axis, with ${spec.lines.length === 1 ? 'one line' : `${spec.lines.length} lines`}${spec.lines.some((l) => l.label) ? `, labelled ${spec.lines.map((l) => l.label).filter(Boolean).join(' and ')}` : ''}.${spec.ticksX?.length ? ` Marked on the horizontal axis: ${spec.ticksX.map((t) => t[1]).join(', ')}.` : ''}${spec.ticksY?.length ? ` Marked on the vertical axis: ${spec.ticksY.map((t) => t[1]).join(', ')}.` : ''}`;
    case 'projectile':
      return `A projectile launched at ${spec.v}, at ${spec.angle} to the horizontal${spec.h ? `, from a height of ${spec.h}` : ''}. Its path is shown as a curve, without distances.`;
    case 'incline':
      return `A block of mass ${spec.m} on a slope of ${spec.angle}${spec.mu ? `, with ${spec.mu}` : ''}${spec.force ? `, and a force of ${spec.force}` : ''}.`;
    case 'pulley':
      return `Masses of ${spec.m1} and ${spec.m2} hanging from a string over a pulley.`;
    case 'block':
      return `A block of ${spec.m}, with these forces on it: ${spec.forces.map((f) => `${f.label} ${f.dir === 'left' || f.dir === 'right' ? `to the ${f.dir}` : f.dir === 'up' ? 'upwards' : 'downwards'}`).join(', ')}.`;
    case 'charges':
      return `Point charges in a line: ${spec.items.map((c) => c.q).join(', ')}, with gaps of ${spec.gaps.join(' and ')}.${spec.point ? ` A point ${spec.point.label} is ${spec.point.gap} away.` : ''}`;
    case 'wave':
      return `A sine wave with amplitude ${spec.amplitude} and wavelength ${spec.wavelength}.`;
    case 'rail':
      return `A rod of length ${spec.l} sliding at ${spec.v} on two rails, in a field of ${spec.B} into the page${spec.r ? `, with a resistor of ${spec.r} across the rails` : ''}.`;
    case 'wire':
      return `A long straight wire carrying ${spec.I}, and a point ${spec.r} from it.`;
    case 'solenoid':
      return `A solenoid with ${spec.turns}, carrying ${spec.I}. It is ${spec.length}.`;
    case 'spring':
      return `A spring of constant ${spec.k} holding ${spec.m} on a smooth surface${spec.a ? `, moved ${spec.a} from its rest position` : ''}.`;
    case 'orbit':
      return `A satellite in a circular orbit ${spec.height} above a planet of mass ${spec.mass}.`;
    case 'levels':
      return `Energy levels: ${spec.levels.map((l) => (l.E ? `${l.n} at ${l.E}` : l.n)).join(', ')}${spec.from !== undefined && spec.to !== undefined ? `, with an arrow from ${spec.levels[spec.from].n} to ${spec.levels[spec.to].n}` : ''}.`;
    case 'capacitor':
      return `A parallel plate capacitor with plates of area ${spec.A}, ${spec.d} apart${spec.V ? `, across a supply of ${spec.V}` : ''}${spec.dielectric ? `, filled with a dielectric of ${spec.dielectric}` : ''}.`;
    case 'table':
      return `A table with columns ${spec.head.join(', ')}. ${spec.rows.map((r) => r.join(', ')).join('. ')}.`;
    case 'tree':
      return `A binary tree with root ${spec.nodes[0].label}. ${spec.nodes.map((n) => `${n.label} has ${n.left === undefined ? 'no left child' : `left child ${spec.nodes[n.left].label}`} and ${n.right === undefined ? 'no right child' : `right child ${spec.nodes[n.right].label}`}`).join('. ')}.`;
  }
}

/** The figure itself, drawn in the theme's ink so it works in both themes and in print. */
/** "R = 20 Ω", or just "R" when the figure is for a derivation and has no values. */
const arm = (symbol: string, value: string) => (value === symbol ? symbol : `${symbol} = ${value}`);

/** A wave along a straight line, for light. */
function wavy(x1: number, y1: number, x2: number, y2: number, waves = 4, size = 4): string {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const [ux, uy] = [(x2 - x1) / length, (y2 - y1) / length];
  const out: string[] = [];
  for (let i = 0; i <= 48; i++) {
    const along = (i / 48) * length;
    const side = size * Math.sin((i / 48) * waves * 2 * Math.PI);
    out.push(`${i ? 'L' : 'M'}${(x1 + ux * along - uy * side).toFixed(1)} ${(y1 + uy * along + ux * side).toFixed(1)}`);
  }
  return out.join(' ');
}

/** Where a track of this shape reaches a given fraction of its height. */
function pointOnHill(fraction: number): [number, number] {
  const at = (t: number): [number, number] => {
    const u = 1 - t;
    return [u ** 3 * 20 + 3 * u ** 2 * t * 90 + 3 * u * t ** 2 * 130 + t ** 3 * 220, u ** 3 * 40 + 3 * u ** 2 * t * 40 + 3 * u * t ** 2 * 170 + t ** 3 * 170];
  };
  const wanted = 170 - 130 * fraction;
  let [low, high] = [0, 1];
  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2;
    if (at(mid)[1] < wanted) low = mid;
    else high = mid;
  }
  return at(low);
}

function Figure({ spec }: { spec: DiagramSpec }) {
  const box = (viewBox: string, body: ReactNode) => (
    <svg className="bank-diagram" viewBox={viewBox} role="img" aria-label={describe(spec)} fill="none" stroke="currentColor" strokeWidth={1.5}>
      {body}
    </svg>
  );
  switch (spec.kind) {
    case 'circuit':
      return <CircuitFigure spec={spec} />;
    case 'lens':
    case 'mirror':
      return <LensFigure spec={spec} />;
    case 'graph':
      return <GraphFigure spec={spec} />;
    case 'tree':
      return <TreeFigure spec={spec} />;
    case 'table':
      return (
        <table className="paper-table bank-table" data-testid="bank-table">
          {spec.caption && <caption>{spec.caption}</caption>}
          <thead>
            <tr>
              {spec.head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {spec.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="num">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'cell-parallel':
      return box(
        '0 0 320 190',
        <>
          <path d="M110 60 L110 30 M110 60 L110 95 M270 60 L270 30 M270 60 L270 95 M110 60 L40 60 L40 160 M270 60 L300 60 L300 160" />
          <path d={zigzag(110, 270, 30)} />
          <path d={zigzag(110, 270, 95)} />
          <Cell x1={40} x2={150} y={160} />
          <path d={zigzag(150, 300, 160)} />
          <circle cx={110} cy={60} r={2.5} fill="currentColor" />
          <circle cx={270} cy={60} r={2.5} fill="currentColor" />
          <Label x={190} y={18}>{spec.r1}</Label>
          <Label x={190} y={83}>{spec.r2}</Label>
          <Label x={95} y={184}>{spec.emf}</Label>
          <Label x={225} y={184}>{`r = ${spec.r}`}</Label>
        </>,
      );
    case 'series-capacitors':
      return box(
        '0 0 320 190',
        <>
          <path d="M40 150 L40 50 L115 50 M125 50 L205 50 M215 50 L280 50 L280 150 M115 32 L115 68 M125 32 L125 68 M205 32 L205 68 M215 32 L215 68" />
          <Cell x1={40} x2={280} y={150} />
          <Label x={120} y={22}>{spec.c1}</Label>
          <Label x={210} y={22}>{spec.c2}</Label>
          <Label x={160} y={178}>{spec.v}</Label>
        </>,
      );
    case 'wheatstone':
      return box(
        '0 0 320 250',
        <>
          <Arm x1={50} y1={100} x2={160} y2={30} />
          <Arm x1={160} y1={30} x2={270} y2={100} />
          <Arm x1={50} y1={100} x2={160} y2={170} />
          <Arm x1={160} y1={170} x2={270} y2={100} />
          <path d="M160 30 L160 88 M160 112 L160 170 M50 100 L50 215 M270 100 L270 215" />
          <circle cx={160} cy={100} r={12} />
          <Label x={160} y={105}>G</Label>
          <Cell x1={50} x2={270} y={215} />
          <Label x={90} y={50} anchor="end">{arm('P', spec.p)}</Label>
          <Label x={230} y={50} anchor="start">{arm('Q', spec.q)}</Label>
          <Label x={68} y={180} anchor="start">{arm('R', spec.r)}</Label>
          <Label x={252} y={180} anchor="end">{arm('S', spec.s)}</Label>
        </>,
      );
    case 'prism':
      return box(
        '0 0 320 180',
        <>
          <path d="M160 20 L70 160 L250 160 Z" />
          <path d="M20 110 L112 95" />
          <path d="M112 95 L208 95" strokeDasharray="5 4" />
          <Arrow x1={40} y1={106.7} x2={70} y2={101.8} />
          <Label x={160} y={55}>{spec.angle}</Label>
          {spec.incidence && <Label x={60} y={92}>{spec.incidence}</Label>}
        </>,
      );
    case 'ydse':
      return box(
        '0 0 360 190',
        <>
          <path d="M100 20 L100 74 M100 86 L100 104 M100 116 L100 170 M300 20 L300 170" strokeWidth={2.5} />
          <path d="M20 95 L100 95" strokeDasharray="5 4" strokeWidth={1} />
          <Arrow x1={30} y1={70} x2={80} y2={70} />
          <Label x={55} y={60}>{spec.lambda}</Label>
          <path d="M100 80 L300 60 M100 110 L300 60" strokeWidth={1} />
          <path d="M85 80 L85 110" strokeWidth={1} />
          <Label x={70} y={124}>{spec.d}</Label>
          <path d="M100 180 L300 180" strokeWidth={1} />
          <Label x={200} y={174}>{spec.D}</Label>
          <Label x={306} y={100} anchor="start">Screen</Label>
        </>,
      );
    case 'projectile': {
      const h = spec.h ? 40 : 0;
      return box(
        '0 0 320 160',
        <>
          <path d="M10 140 L310 140" />
          {spec.h ? <path d={`M10 ${140 - h} L60 ${140 - h} L60 140`} /> : null}
          <path d={spec.h ? `M60 ${140 - h} Q160 ${140 - h} 240 140` : 'M30 140 Q160 -30 290 140'} strokeWidth={2} />
          <Arrow x1={spec.h ? 60 : 30} y1={140 - h} x2={spec.h ? 105 : 62} y2={spec.h ? 140 - h : 100} />
          <Label x={spec.h ? 110 : 78} y={spec.h ? 92 : 100} anchor="start">{spec.v}</Label>
          {!spec.h && <Label x={72} y={135} anchor="start">{spec.angle}</Label>}
          {spec.h && <Label x={34} y={118}>{spec.h}</Label>}
        </>,
      );
    }
    case 'incline':
      return box(
        '0 0 320 180',
        <>
          <path d="M20 160 L300 160 L300 50 Z" />
          <g transform="rotate(-21.4 180 110)">
            <rect x={160} y={80} width={46} height={30} fill="var(--paper)" />
            <text x={183} y={100} textAnchor="middle" stroke="none" fill="currentColor" fontSize={13}>
              {spec.m}
            </text>
          </g>
          <path d="M70 160 A50 50 0 0 0 66 142" />
          <Label x={92} y={154} anchor="start">{spec.angle}</Label>
          {spec.mu && <Label x={120} y={176}>{spec.mu}</Label>}
          {spec.force && <Label x={250} y={40}>{spec.force}</Label>}
        </>,
      );
    case 'pulley':
      return box(
        '0 0 260 220',
        <>
          <path d="M60 10 L200 10 M130 10 L130 40" />
          <circle cx={130} cy={70} r={32} />
          <path d="M98 70 L98 130 M162 70 L162 100" />
          <rect x={68} y={130} width={60} height={44} fill="var(--paper)" />
          <rect x={132} y={100} width={60} height={44} fill="var(--paper)" />
          <Label x={98} y={157}>{spec.m1}</Label>
          <Label x={162} y={127}>{spec.m2}</Label>
        </>,
      );
    case 'block': {
      const ends = { right: [230, 80], left: [90, 80], up: [160, 22], down: [160, 138] } as const;
      const starts = { right: [195, 80], left: [125, 80], up: [160, 58], down: [160, 102] } as const;
      const text = { right: [234, 84, 'start'], left: [86, 84, 'end'], up: [168, 28, 'start'], down: [168, 134, 'start'] } as const;
      return box(
        '0 0 320 160',
        <>
          <path d="M60 102 L260 102" />
          <rect x={125} y={58} width={70} height={44} fill="var(--paper)" />
          <Label x={160} y={85}>{spec.m}</Label>
          {spec.forces.map((f) => (
            <g key={`${f.dir}${f.label}`}>
              <Arrow x1={starts[f.dir][0]} y1={starts[f.dir][1]} x2={ends[f.dir][0]} y2={ends[f.dir][1]} />
              <Label x={text[f.dir][0]} y={text[f.dir][1]} anchor={text[f.dir][2]}>{f.label}</Label>
            </g>
          ))}
        </>,
      );
    }
    case 'charges': {
      const gapCount = spec.items.length - 1 + (spec.point ? 1 : 0);
      const step = 240 / Math.max(gapCount, 1);
      return box(
        '0 0 320 110',
        <>
          <path d={`M30 55 L${40 + step * gapCount + 10} 55`} strokeDasharray="4 4" strokeWidth={1} />
          {spec.items.map((c, i) => (
            <g key={i}>
              <circle cx={40 + i * step} cy={55} r={13} fill="var(--paper)" />
              <Label x={40 + i * step} y={60}>{c.sign}</Label>
              <Label x={40 + i * step} y={30}>{c.q}</Label>
            </g>
          ))}
          {spec.gaps.map((gap, i) => (
            <Label key={i} x={40 + (i + 0.5) * step} y={88}>{gap}</Label>
          ))}
          {spec.point && (
            <>
              <circle cx={40 + gapCount * step} cy={55} r={3} fill="currentColor" />
              <Label x={40 + gapCount * step} y={30}>{spec.point.label}</Label>
              <Label x={40 + (gapCount - 0.5) * step} y={88}>{spec.point.gap}</Label>
            </>
          )}
        </>,
      );
    }
    case 'wave': {
      const points = Array.from({ length: 121 }, (_, i) => `${i ? 'L' : 'M'}${30 + i * 2.2} ${80 - 40 * Math.sin((i / 60) * 2 * Math.PI * 1.5)}`).join(' ');
      return box(
        '0 0 320 130',
        <>
          <path d="M18 80 L300 80" strokeDasharray="4 4" strokeWidth={1} />
          <path d={points} strokeWidth={2} />
          <path d="M18 40 L18 80 M18 40 L52 40" strokeWidth={1} />
          <Label x={12} y={64} anchor="end">{spec.amplitude}</Label>
          <path d="M52 28 L140 28 M52 22 L52 34 M140 22 L140 34" strokeWidth={1} />
          <Label x={96} y={20}>{spec.wavelength}</Label>
        </>,
      );
    }
    case 'rail':
      return box(
        '0 0 320 170',
        <>
          <path d="M40 30 L300 30 M40 130 L300 130" strokeWidth={2} />
          <path d="M180 30 L180 130" strokeWidth={3} />
          {spec.r ? (
            <>
              <path d="M40 30 L40 50 M40 110 L40 130" />
              <path d={zigzag(0, 60, 0)} transform="translate(40 50) rotate(90)" />
              <Label x={52} y={84} anchor="start">{spec.r}</Label>
            </>
          ) : null}
          <Arrow x1={185} y1={80} x2={235} y2={80} />
          <Label x={240} y={84} anchor="start">{spec.v}</Label>
          <Label x={170} y={84} anchor="end">{spec.l}</Label>
          <Label x={170} y={20}>{`${spec.B}, into the page`}</Label>
          {[52, 108].flatMap((y) => [80, 120, 150, 210, 250, 290].map((x) => (
            <Label key={`${x}-${y}`} x={x} y={y + 4}>×</Label>
          )))}
        </>,
      );
    case 'wire':
      return box(
        '0 0 320 130',
        <>
          <path d="M20 40 L300 40" strokeWidth={2.5} />
          <Arrow x1={130} y1={40} x2={190} y2={40} />
          <Label x={160} y={28}>{spec.I}</Label>
          <path d="M160 40 L160 100" strokeWidth={1} strokeDasharray="4 3" />
          <circle cx={160} cy={100} r={3} fill="currentColor" />
          <Label x={170} y={76} anchor="start">{spec.r}</Label>
          <Label x={160} y={120}>P</Label>
        </>,
      );
    case 'solenoid': {
      const coils = Array.from({ length: 12 }, (_, i) => `M${60 + i * 18} 30 q9 40 0 80`).join(' ');
      return box(
        '0 0 320 150',
        <>
          <path d={coils} />
          <path d="M60 110 L30 130 M258 110 L290 130" />
          <Label x={160} y={22}>{spec.turns}</Label>
          <Label x={160} y={136}>{spec.length === 'long' ? spec.I : `${spec.I}, ${spec.length}`}</Label>
        </>,
      );
    }
    case 'spring': {
      const coils = Array.from({ length: 10 }, (_, i) => `L${60 + i * 14} ${i % 2 ? 70 : 90}`).join(' ');
      return box(
        '0 0 320 130',
        <>
          <path d="M20 40 L20 110 M20 110 L300 110" />
          <path d={`M20 80 L50 80 ${coils} L205 80`} />
          <rect x={205} y={60} width={56} height={50} fill="var(--paper)" />
          <Label x={233} y={90}>{spec.m}</Label>
          <Label x={120} y={52}>{spec.k}</Label>
          {spec.a && <Label x={233} y={126}>{spec.a}</Label>}
        </>,
      );
    }
    case 'orbit':
      return box(
        '0 0 340 220',
        <>
          <circle cx={150} cy={110} r={46} />
          <circle cx={150} cy={110} r={88} strokeDasharray="5 4" />
          <rect x={232} y={100} width={14} height={14} fill="currentColor" stroke="none" />
          <path d="M196 110 L232 110" strokeWidth={1} />
          <Label x={254} y={115} anchor="start">{spec.height}</Label>
          <Label x={150} y={115}>{spec.mass}</Label>
        </>,
      );
    case 'levels': {
      const values = spec.levels.map((l) => l.at);
      const low = Math.min(...values);
      const high = Math.max(...values);
      const y = (v: number) => 170 - ((v - low) / (high - low || 1)) * 140;
      return box(
        '0 0 320 200',
        <>
          {spec.levels.map((l) => (
            <g key={l.n}>
              <path d={`M90 ${y(l.at)} L230 ${y(l.at)}`} strokeWidth={2} />
              <Label x={82} y={y(l.at) + 5} anchor="end">{l.n}</Label>
              {l.E && <Label x={238} y={y(l.at) + 5} anchor="start">{l.E}</Label>}
            </g>
          ))}
          {spec.from !== undefined && spec.to !== undefined && <Arrow x1={160} y1={y(spec.levels[spec.from].at)} x2={160} y2={y(spec.levels[spec.to].at)} />}
        </>,
      );
    }
    case 'vectors': {
      const rad = (spec.deg * Math.PI) / 180;
      const [cos, sin] = [Math.cos(rad), Math.sin(rad)];
      const [ox, oy] = [110, 130];
      const [bx, by] = [ox + 110 * cos, oy - 110 * sin];
      const half = rad / 2;
      return box(
        '0 0 320 160',
        <>
          <Arrow x1={ox} y1={oy} x2={290} y2={oy} />
          <Arrow x1={ox} y1={oy} x2={bx} y2={by} />
          <path d={`M${ox + 32} ${oy} A32 32 0 0 0 ${ox + 32 * cos} ${oy - 32 * sin}`} strokeWidth={1} />
          <Label x={290} y={oy + 18} anchor="end">{spec.a}</Label>
          <Label x={bx + (cos >= 0 ? 8 : -8)} y={by + 2} anchor={cos >= 0 ? 'start' : 'end'}>{spec.b}</Label>
          <Label x={ox + 40 * Math.cos(half)} y={oy - 40 * Math.sin(half) + 4} anchor="start">{spec.angle}</Label>
        </>,
      );
    }
    case 'circle':
      return box(
        '0 0 320 190',
        <>
          <circle cx={130} cy={100} r={72} />
          <path d="M130 100 L202 100" strokeWidth={1} strokeDasharray="4 3" />
          <circle cx={130} cy={100} r={2} fill="currentColor" />
          <circle cx={202} cy={100} r={7} fill="currentColor" stroke="none" />
          <Arrow x1={202} y1={100} x2={202} y2={40} />
          <Label x={210} y={50} anchor="start">{spec.v}</Label>
          <Label x={160} y={94}>{spec.r}</Label>
          {spec.m && <Label x={214} y={112} anchor="start">{spec.m}</Label>}
        </>,
      );
    case 'hill': {
      const point = spec.point ? pointOnHill(spec.point.fraction) : null;
      return box(
        '0 0 320 190',
        <>
          <path d="M10 170 L310 170" />
          <path d="M20 40 C90 40 130 170 220 170 L300 170" strokeWidth={2} />
          <rect x={24} y={24} width={26} height={14} fill="var(--paper)" />
          <path d="M14 40 L14 170" strokeWidth={1} />
          <Label x={22} y={110} anchor="start">{spec.H}</Label>
          {spec.m && <Label x={56} y={32} anchor="start">{spec.m}</Label>}
          {point && (
            <>
              <circle cx={point[0]} cy={point[1]} r={4} fill="currentColor" stroke="none" />
              <path d={`M${point[0]} ${point[1]} L${point[0]} 170`} strokeWidth={1} strokeDasharray="4 3" />
              <Label x={point[0] + 8} y={point[1] - 6} anchor="start">{spec.point!.label}</Label>
            </>
          )}
        </>,
      );
    }
    case 'trolleys':
      return box(
        '0 0 320 130',
        <>
          <path d="M16 112 L304 112" />
          <rect x={50} y={62} width={76} height={38} fill="var(--paper)" />
          <rect x={194} y={62} width={76} height={38} fill="var(--paper)" />
          {[66, 110, 210, 254].map((x) => <circle key={x} cx={x} cy={106} r={6} />)}
          <Label x={88} y={86}>{spec.a}</Label>
          <Label x={232} y={86}>{spec.b}</Label>
          <Arrow x1={70} y1={46} x2={130} y2={46} />
          <Label x={100} y={36}>{spec.v}</Label>
          <Label x={232} y={50}>at rest</Label>
        </>,
      );
    case 'lever': {
      const rad = (spec.deg * Math.PI) / 180;
      const [cos, sin] = [Math.cos(rad), Math.sin(rad)];
      const [ex, ey] = [230 + 70 * cos, 110 - 70 * sin];
      return box(
        '0 0 340 150',
        <>
          <circle cx={40} cy={110} r={6} />
          <path d="M46 110 L230 110" strokeWidth={4} />
          <path d="M230 110 L304 110" strokeWidth={1} strokeDasharray="4 3" />
          <Arrow x1={230} y1={110} x2={ex} y2={ey} />
          <path d={`M${230 + 34} 110 A34 34 0 0 0 ${230 + 34 * cos} ${110 - 34 * sin}`} strokeWidth={1} />
          <Label x={ex + 6} y={ey - 2} anchor="start">{spec.F}</Label>
          <Label x={230 + 42 * Math.cos(rad / 2)} y={110 - 42 * Math.sin(rad / 2) + 4} anchor="start">{spec.angle}</Label>
          <path d="M40 128 L230 128" strokeWidth={1} />
          <Label x={135} y={144}>{spec.r}</Label>
          <Label x={40} y={94}>hinge</Label>
        </>,
      );
    }
    case 'axis-masses': {
      const step = spec.items.length > 1 ? 210 / (spec.items.length - 1) : 0;
      return box(
        '0 0 320 110',
        <>
          <Arrow x1={20} y1={60} x2={304} y2={60} />
          {spec.items.map((item, i) => (
            <g key={i}>
              <circle cx={50 + i * step} cy={60} r={13} fill="var(--paper)" />
              <Label x={50 + i * step} y={34}>{item.m}</Label>
              <Label x={50 + i * step} y={94}>{item.x}</Label>
            </g>
          ))}
        </>,
      );
    }
    case 'pipe':
      return box(
        '0 0 320 150',
        <>
          <path d="M20 40 L150 40 L210 62 L300 62 M20 120 L150 120 L210 98 L300 98" strokeWidth={2} />
          <Arrow x1={40} y1={80} x2={110} y2={80} />
          <Label x={75} y={70}>{spec.v1}</Label>
          <Label x={85} y={32}>{spec.a1}</Label>
          <Arrow x1={226} y1={80} x2={286} y2={80} />
          <Label x={256} y={54}>{spec.a2}</Label>
          <Label x={256} y={116}>speed = ?</Label>
        </>,
      );
    case 'tank':
      return box(
        '0 0 320 190',
        <>
          <rect x={62} y={50} width={156} height={108} fill="var(--paper-3)" stroke="none" />
          <path d="M60 24 L60 160 L220 160 L220 136 M220 124 L220 24" strokeWidth={2} />
          <path d="M60 50 L220 50" strokeDasharray="4 3" strokeWidth={1} />
          <path d="M190 50 L190 130" strokeWidth={1} />
          <path d="M183 50 L197 50 M183 130 L197 130" strokeWidth={1} />
          <Label x={182} y={94} anchor="end">{spec.h}</Label>
          <path d="M220 130 Q262 130 288 180" />
          <Arrow x1={224} y1={130} x2={250} y2={134} />
        </>,
      );
    case 'capillary':
      return box(
        '0 0 320 190',
        <>
          <rect x={42} y={130} width={236} height={38} fill="var(--paper-3)" stroke="none" />
          <rect x={151} y={70} width={18} height={60} fill="var(--paper-3)" stroke="none" />
          <path d="M40 104 L40 170 L280 170 L280 104" />
          <path d="M40 130 L150 130 M170 130 L280 130" strokeDasharray="4 3" strokeWidth={1} />
          <path d="M150 28 L150 150 M170 28 L170 150" />
          <path d="M150 70 Q160 80 170 70" strokeWidth={1} />
          <path d="M186 70 L186 130 M180 70 L192 70 M180 130 L192 130" strokeWidth={1} />
          <Label x={196} y={104} anchor="start">h</Label>
          <Label x={160} y={20}>{`radius ${spec.r}`}</Label>
        </>,
      );
    case 'engine':
      return box(
        '0 0 320 190',
        <>
          <rect x={90} y={10} width={120} height={32} />
          <Label x={150} y={31}>{spec.hot}</Label>
          <circle cx={150} cy={95} r={24} />
          <Label x={150} y={100}>Engine</Label>
          <rect x={90} y={148} width={120} height={32} />
          <Label x={150} y={169}>{spec.cold}</Label>
          <Arrow x1={150} y1={42} x2={150} y2={71} />
          <Arrow x1={150} y1={119} x2={150} y2={148} />
          <Arrow x1={174} y1={95} x2={236} y2={95} />
          <Label x={160} y={62} anchor="start">Heat in</Label>
          <Label x={160} y={138} anchor="start">Heat out</Label>
          <Label x={242} y={100} anchor="start">Work</Label>
        </>,
      );
    case 'standing': {
      const [x1, x2] = [50, 270];
      const mid = 70;
      const curve =
        spec.ends === 'fixed'
          ? `M${x1} ${mid} Q160 ${mid - 80} ${x2} ${mid} M${x1} ${mid} Q160 ${mid + 80} ${x2} ${mid}`
          : spec.ends === 'open'
            ? `M${x1} ${mid - 36} Q160 ${mid + 36} ${x2} ${mid - 36} M${x1} ${mid + 36} Q160 ${mid - 36} ${x2} ${mid + 36}`
            : `M${x1} ${mid} Q200 ${mid - 10} ${x2} ${mid - 36} M${x1} ${mid} Q200 ${mid + 10} ${x2} ${mid + 36}`;
      return box(
        '0 0 320 150',
        <>
          {spec.ends === 'fixed' ? (
            <path d={`M${x1} 26 L${x1} 114 M${x2} 26 L${x2} 114`} strokeWidth={3} />
          ) : (
            <path d={`M${x1} 30 L${x2} 30 M${x1} 110 L${x2} 110${spec.ends === 'closed' ? ` M${x1} 30 L${x1} 110` : ''}`} strokeWidth={2} />
          )}
          <path d={curve} />
          <path d={`M${x1} 128 L${x2} 128`} strokeWidth={1} />
          <Label x={160} y={145}>{spec.L}</Label>
          {spec.note && <Label x={160} y={18}>{spec.note}</Label>}
        </>,
      );
    }
    case 'in-field': {
      const rad = (spec.deg * Math.PI) / 180;
      const [cos, sin] = [Math.cos(rad), Math.sin(rad)];
      const [cx, cy] = [130, 86];
      const reach = 58;
      const [tipX, tipY] = [cx + reach * cos, cy - reach * sin];
      return box(
        '0 0 320 170',
        <>
          <Arrow x1={20} y1={20} x2={296} y2={20} />
          <Arrow x1={20} y1={152} x2={296} y2={152} />
          <Label x={300} y={14} anchor="end">{spec.B}</Label>
          <path d={`M${cx} ${cy} L${cx + 90} ${cy}`} strokeWidth={1} strokeDasharray="4 3" />
          {spec.body === 'coil' ? (
            <>
              <path d={`M${cx - reach * sin} ${cy - reach * cos} L${cx + reach * sin} ${cy + reach * cos}`} strokeWidth={4} />
              <Arrow x1={cx} y1={cy} x2={tipX} y2={tipY} />
            </>
          ) : spec.body === 'dipole' ? (
            <>
              <path d={`M${cx - reach * cos} ${cy + reach * sin} L${tipX} ${tipY}`} strokeWidth={2} />
              <circle cx={tipX} cy={tipY} r={9} fill="var(--paper)" />
              <Label x={tipX} y={tipY + 4}>+</Label>
              <circle cx={cx - reach * cos} cy={cy + reach * sin} r={9} fill="var(--paper)" />
              <Label x={cx - reach * cos} y={cy + reach * sin + 4}>−</Label>
            </>
          ) : (
            <path d={`M${cx - reach * cos} ${cy + reach * sin} L${tipX} ${tipY}`} strokeWidth={3} />
          )}
          <path d={`M${cx + 28} ${cy} A28 28 0 0 0 ${cx + 28 * cos} ${cy - 28 * sin}`} strokeWidth={1} />
          <Label x={cx + 34 * Math.cos(rad / 2)} y={cy - 34 * Math.sin(rad / 2) + 4} anchor="start">{spec.angle}</Label>
          <Label x={cx + 96} y={cy + 28} anchor="start">{spec.label}</Label>
        </>,
      );
    }
    case 'parallel-wires':
      return box(
        '0 0 320 170',
        <>
          <path d="M110 30 L110 150 M210 30 L210 150" strokeWidth={2.5} />
          <Arrow x1={110} y1={100} x2={110} y2={60} />
          {spec.same ? <Arrow x1={210} y1={100} x2={210} y2={60} /> : <Arrow x1={210} y1={60} x2={210} y2={100} />}
          <Label x={110} y={22}>{spec.i1}</Label>
          <Label x={210} y={22}>{spec.i2}</Label>
          <path d="M110 125 L210 125" strokeWidth={1} strokeDasharray="4 3" />
          <Label x={160} y={119}>{spec.d}</Label>
        </>,
      );
    case 'field-entry':
      return box(
        '0 0 320 165',
        <>
          <rect x={120} y={24} width={180} height={126} strokeWidth={1} />
          {[50, 90, 130].flatMap((y) => [145, 185, 225, 265].map((x) => (
            <Label key={`${x}-${y}`} x={x} y={y}>×</Label>
          )))}
          <Label x={210} y={18}>{`${spec.B}, into the page`}</Label>
          <circle cx={34} cy={86} r={5} fill="currentColor" stroke="none" />
          <Arrow x1={40} y1={86} x2={119} y2={86} />
          <Label x={76} y={76}>{spec.v}</Label>
          <Label x={34} y={106}>{spec.q}</Label>
        </>,
      );
    case 'transformer': {
      const loops = (x: number, side: number) => Array.from({ length: 6 }, (_, i) => `M${x} ${44 + i * 14} q${side * 14} 7 0 14`).join(' ');
      return box(
        '0 0 320 160',
        <>
          <rect x={138} y={26} width={44} height={108} strokeWidth={2} />
          <rect x={150} y={38} width={20} height={84} strokeWidth={1} />
          <path d={loops(138, -1)} />
          <path d={loops(182, 1)} />
          <path d="M138 44 L108 44 M138 128 L108 128 M182 44 L212 44 M182 128 L212 128" />
          {spec.primary.map((line, i) => (
            <Label key={i} x={100} y={80 + i * 18} anchor="end">{line}</Label>
          ))}
          {spec.secondary.map((line, i) => (
            <Label key={i} x={220} y={80 + i * 18} anchor="start">{line}</Label>
          ))}
        </>,
      );
    }
    case 'refraction': {
      const ray = (deg: number): [number, number] => [Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)];
      const [si, ci] = ray(spec.iDeg);
      const [sr, cr] = ray(spec.rDeg);
      return box(
        '0 0 320 180',
        <>
          <rect x={20} y={90} width={280} height={80} fill="var(--paper-3)" stroke="none" />
          <path d="M20 90 L300 90" />
          <path d="M160 16 L160 170" strokeWidth={1} strokeDasharray="4 3" />
          <Arrow x1={160 - 80 * si} y1={90 - 80 * ci} x2={160} y2={90} />
          <path d={`M160 90 L${160 + 76 * sr} ${90 + 76 * cr}`} />
          <Label x={160 - 36 * Math.sin(((spec.iDeg / 2) * Math.PI) / 180) - 2} y={90 - 40} anchor="end">{spec.i}</Label>
          <Label x={160 + 26 * sr + 22} y={90 + 44} anchor="start">{spec.r}</Label>
          <Label x={296} y={40} anchor="end">{spec.top}</Label>
          <Label x={296} y={160} anchor="end">{spec.bottom}</Label>
        </>,
      );
    }
    case 'telescope':
      return box(
        '0 0 320 150',
        <>
          <path d="M16 70 L304 70" strokeWidth={1} strokeDasharray="5 4" />
          <path d="M60 20 Q76 70 60 120 Q44 70 60 20 Z" />
          <path d="M262 44 Q270 70 262 96 Q254 70 262 44 Z" />
          <Label x={60} y={14}>Objective</Label>
          <Label x={262} y={38}>Eyepiece</Label>
          <circle cx={230} cy={70} r={3} fill="currentColor" stroke="none" />
          <path d="M60 132 L230 132 M230 132 L262 132 M60 126 L60 138 M230 126 L230 138 M262 126 L262 138" strokeWidth={1} />
          <Label x={145} y={126}>{spec.fo}</Label>
          <Label x={262} y={118}>{spec.fe}</Label>
        </>,
      );
    case 'photoelectric':
      return box(
        '0 0 320 150',
        <>
          <rect x={50} y={110} width={220} height={26} fill="var(--paper-3)" />
          <Label x={160} y={128}>{`metal, work function ${spec.metal}`}</Label>
          <path d={wavy(66, 30, 136, 108)} />
          <Arrow x1={130} y1={100} x2={136} y2={108} />
          <Label x={40} y={22} anchor="start">{`light, ${spec.light}`}</Label>
          <Arrow x1={170} y1={108} x2={224} y2={46} />
          <Label x={230} y={44} anchor="start">electron</Label>
        </>,
      );
    case 'drop': {
      const top = spec.rebound ? 170 - 130 * spec.rebound.fraction : 0;
      return box(
        '0 0 320 190',
        <>
          <path d="M40 170 L280 170" strokeWidth={2} />
          <circle cx={110} cy={40} r={8} fill="var(--paper)" />
          <path d="M110 48 L110 162" strokeWidth={1} strokeDasharray="4 3" />
          <path d="M76 40 L76 170 M70 40 L82 40" strokeWidth={1} />
          <Label x={68} y={110} anchor="end">{spec.h}</Label>
          {spec.rebound && (
            <>
              <circle cx={180} cy={top} r={8} fill="var(--paper)" />
              <path d={`M180 ${top + 8} L180 164`} strokeWidth={1} strokeDasharray="4 3" />
              <path d={`M214 ${top} L214 170 M208 ${top} L220 ${top}`} strokeWidth={1} />
              <Label x={222} y={Math.min((top + 170) / 2 + 4, 160)} anchor="start">{spec.rebound.label}</Label>
            </>
          )}
        </>,
      );
    }
    case 'hanging':
      return box(
        '0 0 320 170',
        <>
          <path d="M100 16 L220 16" strokeWidth={3} />
          <path d="M160 16 L160 116" />
          <rect x={130} y={116} width={60} height={38} fill="var(--paper)" />
          <Label x={160} y={140}>{spec.F}</Label>
          <path d="M112 16 L112 116 M106 116 L118 116" strokeWidth={1} />
          <Label x={104} y={70} anchor="end">{spec.L}</Label>
          <Label x={170} y={60} anchor="start">{spec.A}</Label>
          {spec.e && <Label x={198} y={140} anchor="start">{`stretches ${spec.e}`}</Label>}
        </>,
      );
    case 'lens-surfaces':
      return box(
        '0 0 320 160',
        <>
          <path d="M16 80 L304 80" strokeWidth={1} strokeDasharray="5 4" />
          <path d="M160 16 Q204 80 160 144 Q116 80 160 16 Z" />
          <Label x={100} y={60} anchor="end">{spec.r1}</Label>
          <Label x={220} y={60} anchor="start">{spec.r2}</Label>
          <Label x={160} y={156}>{arm('n', spec.n)}</Label>
        </>,
      );
    case 'coil':
      return box(
        '0 0 320 170',
        <>
          <circle cx={140} cy={88} r={62} strokeWidth={2.5} />
          <circle cx={140} cy={88} r={3} fill="currentColor" stroke="none" />
          <path d="M140 88 L202 88" strokeWidth={1} strokeDasharray="4 3" />
          <Label x={170} y={82}>{spec.r}</Label>
          <Label x={140} y={106}>O</Label>
          <Arrow x1={118} y1={30} x2={158} y2={29} />
          <Label x={140} y={18}>{spec.I}</Label>
          <Label x={212} y={92} anchor="start">{spec.turns}</Label>
        </>,
      );
    case 'capacitor':
      return box(
        '0 0 320 170',
        <>
          <path d="M120 30 L120 110 M200 30 L200 110" strokeWidth={3} />
          {spec.dielectric && <rect x={122} y={32} width={76} height={76} fill="var(--paper-3)" stroke="none" />}
          <path d="M120 70 L60 70 L60 140 L140 140 M180 140 L260 140 L260 70 L200 70" />
          <path d="M140 126 L140 154 M180 133 L180 147" />
          <path d="M120 120 L200 120" strokeWidth={1} />
          <Label x={160} y={116}>{spec.d}</Label>
          <Label x={160} y={22}>{spec.A}</Label>
          {spec.V && <Label x={160} y={166}>{spec.V}</Label>}
          {spec.dielectric && <Label x={160} y={75}>{spec.dielectric}</Label>}
        </>,
      );
  }
}

/**
 * A question's figure. It's generated from the same values as the question's words, and tapping it opens it larger.
 * `plain` is for use outside the page, such as a Word file.
 */
export function BankDiagram({ spec, plain }: { spec: DiagramSpec; plain?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  if (plain || spec.kind === 'table') return <Figure spec={spec} />;
  return (
    <>
      <button
        type="button"
        className="diagram-button"
        aria-label={`Enlarge this figure. ${describe(spec)}`}
        onClick={() => {
          setOpen(true);
          queueMicrotask(() => dialog.current?.showModal());
        }}
      >
        <Figure spec={spec} />
      </button>
      {open && (
        <dialog ref={dialog} className="molecule-zoom diagram-zoom" aria-label="Figure, enlarged" onClose={() => setOpen(false)} onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
          <div className="molecule-zoom-head">
            <h2>Figure</h2>
            <button type="button" className="btn btn-quiet" aria-label="Close" onClick={() => dialog.current?.close()}>
              <X size={16} aria-hidden />
            </button>
          </div>
          <div className="diagram-zoom-body">
            <Figure spec={spec} />
            <p className="mt-2 text-step--1 text-ink-2">{describe(spec)}</p>
          </div>
        </dialog>
      )}
    </>
  );
}

export default BankDiagram;
