import { useMemo, useRef, useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { labelBlocks, solveCircuit, toNetlist, type Block, type ElementResult } from './lib/circuit';
import { fmt } from './lib/ui';

let counter = 0;
const uid = () => `b${++counter}`;
const R = (r: number): Block => ({ type: 'resistor', id: uid(), r });
const E = (emf: number, r = 0): Block => ({ type: 'cell', id: uid(), emf, r });
const S = (...items: Block[]): Block => ({ type: 'series', id: uid(), items });
const P = (...items: Block[]): Block => ({ type: 'parallel', id: uid(), items });

const PRESETS: { id: string; label: string; make: () => Block }[] = [
  { id: 'ohm', label: "Ohm's law: one resistor", make: () => S(E(12), R(100)) },
  { id: 'series', label: 'Resistors in series', make: () => S(E(12), R(10), R(20), R(30)) },
  { id: 'parallel', label: 'Resistors in parallel', make: () => S(E(12), P(R(6), R(3))) },
  { id: 'mixed', label: 'Series and parallel', make: () => S(E(12, 0.5), R(2), P(R(3), R(6)), R(4)) },
  { id: 'internal', label: 'Cell with internal resistance', make: () => S(E(9, 1), R(8)) },
  { id: 'kirchhoff', label: 'Two cells: Kirchhoff', make: () => S(P(S(E(12), R(2)), S(E(6), R(1))), R(4)) },
  { id: 'opposing', label: 'Two cells opposing', make: () => S(E(12, 1), E(-6, 1), R(4)) },
];

function update(block: Block, id: string, change: (b: Block) => Block | null): Block {
  if (block.id === id) return change(block) ?? block;
  if (block.type === 'series' || block.type === 'parallel') {
    const items: Block[] = [];
    for (const item of block.items) {
      if (item.id === id) {
        const next = change(item);
        if (next) items.push(next);
      } else items.push(update(item, id, change));
    }
    return { ...block, items };
  }
  return block;
}

const ADD: { label: string; make: () => Block }[] = [
  { label: 'Resistor', make: () => R(10) },
  { label: 'Cell', make: () => E(6) },
  { label: 'Parallel group', make: () => P(S(R(10)), S(R(10))) },
];

interface EditorProps {
  block: Block;
  labels: Map<string, string>;
  depth: number;
  onChange: (id: string, change: (b: Block) => Block | null) => void;
  parentType?: Block['type'];
  branchIndex?: number;
}

function NumberInput({ label, value, onCommit, width = '5rem' }: { label: string; value: number; onCommit: (v: number) => void; width?: string }) {
  const [text, setText] = useState(String(value));
  return (
    <input
      className="field num"
      style={{ width }}
      aria-label={label}
      inputMode="decimal"
      autoComplete="off"
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        const v = Number(e.target.value);
        if (e.target.value.trim() !== '' && Number.isFinite(v)) onCommit(v);
      }}
    />
  );
}

function BlockEditor({ block, labels, depth, onChange }: EditorProps) {
  const remove = () => onChange(block.id, () => null);
  const removeButton = (name: string) => (
    <button type="button" className="btn btn-quiet flex-none" aria-label={`Remove ${name}`} onClick={remove}>
      <Trash2 size={15} aria-hidden />
    </button>
  );

  if (block.type === 'resistor') {
    const name = labels.get(block.id) ?? 'R';
    return (
      <div className="flex items-center gap-2 py-1">
        <span className="num w-8 flex-none font-bold">{name}</span>
        <NumberInput label={`${name} in ohms`} value={block.r} onCommit={(r) => onChange(block.id, (b) => ({ ...b, r }) as Block)} />
        <span className="text-ink-2">Ω</span>
        <span className="flex-1" />
        {removeButton(name)}
      </div>
    );
  }

  if (block.type === 'cell') {
    const name = labels.get(block.id) ?? 'E';
    return (
      <div className="flex flex-wrap items-center gap-2 py-1">
        <span className="num w-8 flex-none font-bold">{name}</span>
        <NumberInput label={`${name} emf in volts`} value={block.emf} width="4.5rem" onCommit={(emf) => onChange(block.id, (b) => ({ ...b, emf }) as Block)} />
        <span className="text-ink-2">V</span>
        <NumberInput label={`${name} internal resistance in ohms`} value={block.r} width="4rem" onCommit={(r) => onChange(block.id, (b) => ({ ...b, r }) as Block)} />
        <span className="text-ink-2">Ω inside</span>
        <span className="flex-1" />
        {removeButton(name)}
      </div>
    );
  }

  if (block.type === 'parallel') {
    return (
      <div className="my-1 border border-rule-2 p-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold">In parallel</span>
          {removeButton('this parallel group')}
        </div>
        {block.items.map((branch, i) => (
          <div key={branch.id} className="mt-1 border-t border-rule pt-1">
            <div className="flex items-center justify-between text-step--1 text-ink-2">
              Branch {i + 1}
              {block.items.length > 2 && (
                <button type="button" className="btn btn-quiet" aria-label={`Remove branch ${i + 1}`} onClick={() => onChange(branch.id, () => null)}>
                  <Minus size={14} aria-hidden />
                </button>
              )}
            </div>
            <BlockEditor block={branch} labels={labels} depth={depth + 1} onChange={onChange} parentType="parallel" />
          </div>
        ))}
        <button type="button" className="btn btn-quiet mt-1" onClick={() => onChange(block.id, (b) => ({ ...(b as typeof block), items: [...(b as typeof block).items, S(R(10))] }))}>
          <Plus size={14} aria-hidden /> Add a branch
        </button>
      </div>
    );
  }

  // Series list: the loop, or one branch of a parallel group.
  return (
    <div>
      {block.items.map((item) => (
        <BlockEditor key={item.id} block={item} labels={labels} depth={depth} onChange={onChange} parentType="series" />
      ))}
      <div className="mt-1 flex flex-wrap gap-1">
        {ADD.filter((a) => depth < 2 || a.label !== 'Parallel group').map((a) => (
          <button key={a.label} type="button" className="btn btn-quiet" onClick={() => onChange(block.id, (b) => ({ ...(b as typeof block), items: [...(b as typeof block).items, a.make()] }))}>
            <Plus size={14} aria-hidden /> {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Schematic, laid out from the nested groups. */
const PART_W = 74;
const PART_H = 68;

interface Size {
  w: number;
  h: number;
}

function measure(b: Block): Size {
  if (b.type === 'resistor' || b.type === 'cell') return { w: PART_W, h: PART_H };
  const sizes = b.items.map(measure);
  if (b.type === 'series') return { w: Math.max(sizes.reduce((n, s) => n + s.w, 0), 24), h: Math.max(...sizes.map((s) => s.h), PART_H) };
  return { w: Math.max(...sizes.map((s) => s.w), PART_W) + 28, h: sizes.reduce((n, s) => n + s.h, 0) };
}

function Wire({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth={1.5} />;
}

function Schematic({ block, x, y, labels, results }: { block: Block; x: number; y: number; labels: Map<string, string>; results: Map<string, ElementResult> }) {
  const size = measure(block);
  if (block.type === 'resistor' || block.type === 'cell') {
    const name = labels.get(block.id);
    const res = results.get(block.id);
    const cx = x + PART_W / 2;
    return (
      <g>
        {block.type === 'resistor' ? (
          <>
            <Wire x1={x} y1={y} x2={cx - 18} y2={y} />
            <rect x={cx - 18} y={y - 7} width={36} height={14} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.5} />
            <Wire x1={cx + 18} y1={y} x2={x + PART_W} y2={y} />
          </>
        ) : (
          <>
            <Wire x1={x} y1={y} x2={cx - 3} y2={y} />
            <line x1={cx - 3} y1={y - 5} x2={cx - 3} y2={y + 5} stroke="var(--ink)" strokeWidth={3} />
            <line x1={cx + 3} y1={y - 13} x2={cx + 3} y2={y + 13} stroke="var(--ink)" strokeWidth={1.5} />
            <Wire x1={cx + 3} y1={y} x2={x + PART_W} y2={y} />
          </>
        )}
        <text x={cx} y={y - 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--ink)">
          {name}
        </text>
        {res && (
          <text x={cx} y={y + 24} textAnchor="middle" fontSize={11} fill="var(--ink-2)" style={{ fontFamily: 'var(--font-mono)' }}>
            {fmt(Math.abs(res.current), 3)} A
          </text>
        )}
      </g>
    );
  }
  if (block.type === 'series') {
    let cx = x;
    const sizes = block.items.map(measure);
    if (!block.items.length) return <Wire x1={x} y1={y} x2={x + size.w} y2={y} />;
    return (
      <g>
        {block.items.map((item, i) => {
          const el = <Schematic key={item.id} block={item} x={cx} y={y} labels={labels} results={results} />;
          cx += sizes[i].w;
          return el;
        })}
      </g>
    );
  }
  const sizes = block.items.map(measure);
  const innerW = size.w - 28;
  let top = y - size.h / 2;
  const centres: number[] = [];
  const rows = block.items.map((item, i) => {
    const cy = top + sizes[i].h / 2;
    centres.push(cy);
    top += sizes[i].h;
    return (
      <g key={item.id}>
        <Schematic block={item} x={x + 14} y={cy} labels={labels} results={results} />
        {sizes[i].w < innerW && <Wire x1={x + 14 + sizes[i].w} y1={cy} x2={x + 14 + innerW} y2={cy} />}
      </g>
    );
  });
  return (
    <g>
      <Wire x1={x} y1={y} x2={x + 14} y2={y} />
      <Wire x1={x + 14 + innerW} y1={y} x2={x + size.w} y2={y} />
      {centres.length > 0 && <Wire x1={x + 14} y1={centres[0]} x2={x + 14} y2={centres[centres.length - 1]} />}
      {centres.length > 0 && <Wire x1={x + 14 + innerW} y1={centres[0]} x2={x + 14 + innerW} y2={centres[centres.length - 1]} />}
      {rows}
    </g>
  );
}

export function Circuits() {
  const [preset, setPreset] = useState('mixed');
  const [root, setRoot] = useState<Block>(() => PRESETS.find((p) => p.id === 'mixed')!.make());
  const editorVersion = useRef(0);

  const labels = useMemo(() => labelBlocks(root), [root]);
  const solution = useMemo(() => solveCircuit(toNetlist(root)), [root]);
  const results = useMemo(() => new Map(solution.elements.map((e) => [e.id, e])), [solution]);

  const onChange = (id: string, change: (b: Block) => Block | null) => setRoot((r) => update(r, id, change));

  const cells = solution.elements.filter((e) => e.kind === 'cell');
  const resistors = solution.elements.filter((e) => e.kind === 'resistor');
  const totalPower = resistors.reduce((n, e) => n + e.power, 0);
  const size = measure(root);
  const svgH = size.h + 56;
  const midY = size.h / 2 + 14;
  const summary = solution.ok ? `Circuit with ${resistors.length} resistors and ${cells.length} cells. Each part's current is in the table.` : 'Circuit diagram. The circuit cannot be solved yet.';

  return (
    <div>
      <div className="tool-layout">
        <div className="tool-controls">
          <div>
            <label className="lbl" htmlFor="cir-preset">
              Start from
            </label>
            <select
              id="cir-preset"
              className="field"
              value={preset}
              onChange={(e) => {
                setPreset(e.target.value);
                editorVersion.current++;
                setRoot(PRESETS.find((p) => p.id === e.target.value)!.make());
              }}
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="lbl">Around the loop, in order</span>
            <BlockEditor key={editorVersion.current} block={root} labels={labels} depth={0} onChange={onChange} />
          </div>
        </div>
        <div className="min-w-0">
          <div className="plot scrollable overflow-x-auto p-2" tabIndex={0} role="group" aria-label="Circuit diagram, scrollable">
            <svg role="img" aria-label={summary} width={size.w + 28} height={svgH} viewBox={`0 0 ${size.w + 28} ${svgH}`} style={{ fontFamily: 'var(--font-body)', display: 'block' }}>
              <Schematic block={root} x={14} y={midY} labels={labels} results={results} />
              {/* The return wire closes the loop. */}
              <polyline points={`14,${midY} 4,${midY} 4,${svgH - 8} ${size.w + 24},${svgH - 8} ${size.w + 24},${midY} ${size.w + 14},${midY}`} fill="none" stroke="var(--ink)" strokeWidth={1.5} />
            </svg>
          </div>

          {!solution.ok && (
            <p className="notice" data-tone="bad" role="alert">
              {solution.message}
            </p>
          )}

          {solution.ok && (
            <div className="table-scroll mt-3" style={{ maxHeight: 'none' }}>
              <table className="trace-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Part</th>
                    <th>Current (A)</th>
                    <th>Voltage (V)</th>
                    <th>Power (W)</th>
                  </tr>
                </thead>
                <tbody>
                  {solution.elements.map((e) => (
                    <tr key={e.id}>
                      <td style={{ textAlign: 'left', fontWeight: 700 }}>{e.label}</td>
                      <td>{fmt(Math.abs(e.current))}</td>
                      <td>{fmt(Math.abs(e.voltage))}</td>
                      <td>{fmt(e.kind === 'cell' ? e.power : Math.abs(e.power))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {solution.ok && (
            <p className="mt-2 text-step--1 text-ink-2">
              Power used in the resistors: {fmt(totalPower)} W. Solved by nodal analysis: Kirchhoff's current law at every junction, with each cell's voltage as an extra equation. A negative power for a cell means it is being charged.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
