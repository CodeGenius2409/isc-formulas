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
          <path d={`M${x} ${y} L${mid - 10} ${y} M${mid + 10} ${y} L${x + w} ${y} M${mid - 10} ${y - 10} L${mid - 10} ${y + 10} L${mid + 10} ${y} Z M${mid + 10} ${y - 10} L${mid + 10} ${y + 10}`} />
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
  const width = Math.max(inner + 60, 240);
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
  const [left, right, top, bottom] = [46, 300, 14, 170];
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
      return `Energy levels: ${spec.levels.map((l) => `${l.n} at ${l.E}`).join(', ')}${spec.from !== undefined && spec.to !== undefined ? `, with an arrow from ${spec.levels[spec.from].n} to ${spec.levels[spec.to].n}` : ''}.`;
    case 'capacitor':
      return `A parallel plate capacitor with plates of area ${spec.A}, ${spec.d} apart${spec.V ? `, across a supply of ${spec.V}` : ''}${spec.dielectric ? `, filled with a dielectric of ${spec.dielectric}` : ''}.`;
    case 'table':
      return `A table with columns ${spec.head.join(', ')}. ${spec.rows.map((r) => r.join(', ')).join('. ')}.`;
    case 'tree':
      return `A binary tree with root ${spec.nodes[0].label}. ${spec.nodes.map((n) => `${n.label} has ${n.left === undefined ? 'no left child' : `left child ${spec.nodes[n.left].label}`} and ${n.right === undefined ? 'no right child' : `right child ${spec.nodes[n.right].label}`}`).join('. ')}.`;
  }
}

/** The figure itself, drawn in the theme's ink so it works in both themes and in print. */
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
          <Label x={90} y={50} anchor="end">{`P = ${spec.p}`}</Label>
          <Label x={230} y={50} anchor="start">{`Q = ${spec.q}`}</Label>
          <Label x={68} y={180} anchor="start">{`R = ${spec.r}`}</Label>
          <Label x={252} y={180} anchor="end">{`S = ${spec.s}`}</Label>
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
        '0 0 340 190',
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
          <Label x={316} y={100}>Screen</Label>
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
          <circle cx={130} cy={60} r={24} />
          <path d="M106 60 L106 130 M154 60 L154 100" />
          <rect x={80} y={130} width={52} height={44} fill="var(--paper)" />
          <rect x={128} y={100} width={52} height={44} fill="var(--paper)" />
          <Label x={106} y={157}>{spec.m1}</Label>
          <Label x={154} y={127}>{spec.m2}</Label>
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
        '0 0 320 160',
        <>
          <path d="M30 80 L300 80" strokeDasharray="4 4" strokeWidth={1} />
          <path d={points} strokeWidth={2} />
          <path d="M60 30 L60 80" strokeWidth={1} />
          <Label x={66} y={60} anchor="start">{spec.amplitude}</Label>
          <path d="M60 148 L148 148" strokeWidth={1} />
          <Label x={104} y={142}>{spec.wavelength}</Label>
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
          <Label x={120} y={20}>{`${spec.B}, into the page`}</Label>
          {[80, 120, 260, 290].map((x) => (
            <Label key={x} x={x} y={150}>×</Label>
          ))}
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
          <Label x={160} y={136}>{`${spec.I}, ${spec.length}`}</Label>
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
        '0 0 300 220',
        <>
          <circle cx={150} cy={110} r={46} />
          <circle cx={150} cy={110} r={88} strokeDasharray="5 4" />
          <rect x={232} y={100} width={14} height={14} fill="currentColor" stroke="none" />
          <path d="M196 110 L232 110" strokeWidth={1} />
          <Label x={214} y={100}>{spec.height}</Label>
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
              <Label x={238} y={y(l.at) + 5} anchor="start">{l.E}</Label>
            </g>
          ))}
          {spec.from !== undefined && spec.to !== undefined && <Arrow x1={160} y1={y(spec.levels[spec.from].at)} x2={160} y2={y(spec.levels[spec.to].at)} />}
        </>,
      );
    }
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
