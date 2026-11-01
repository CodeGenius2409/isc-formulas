import { useState } from 'react';
import { Field, Readouts, Toggle, ToolLayout, Equation } from './lib/ui';

const GATES = {
  AND: { op: (a: boolean, b: boolean) => a && b, tex: 'Y=A\\cdot B' },
  OR: { op: (a: boolean, b: boolean) => a || b, tex: 'Y=A+B' },
  NOT: { op: (a: boolean) => !a, tex: 'Y=\\overline{A}' },
  NAND: { op: (a: boolean, b: boolean) => !(a && b), tex: 'Y=\\overline{A\\cdot B}' },
  NOR: { op: (a: boolean, b: boolean) => !(a || b), tex: 'Y=\\overline{A+B}' },
  XOR: { op: (a: boolean, b: boolean) => a !== b, tex: 'Y=A\\oplus B' },
  XNOR: { op: (a: boolean, b: boolean) => a === b, tex: 'Y=A\\odot B' },
} as const;

type Gate = keyof typeof GATES;

const bit = (b: boolean) => (b ? 1 : 0);

export function LogicGates() {
  const [gate, setGate] = useState<Gate>('AND');
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const single = gate === 'NOT';
  const run = (x: boolean, y: boolean) => (GATES[gate].op as (p: boolean, q: boolean) => boolean)(x, y);
  const out = run(a, b);
  const combos: [boolean, boolean][] = single ? [[false, false], [true, false]] : [[false, false], [false, true], [true, false], [true, true]];
  return (
    <ToolLayout
      controls={
        <>
          <div>
            <span className="lbl">Gate</span>
            <div className="seg flex-wrap" role="group" aria-label="Gate">
              {(Object.keys(GATES) as Gate[]).map((g) => (
                <button key={g} type="button" aria-pressed={gate === g} onClick={() => setGate(g)}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <Toggle label="Input A" checked={a} onChange={setA} />
          {!single && <Toggle label="Input B" checked={b} onChange={setB} />}
          <Readouts items={[[`${gate}(${bit(a)}${single ? '' : `, ${bit(b)}`})`, String(bit(out))]]} />
          <Equation latex={GATES[gate].tex} />
        </>
      }
    >
      <table className="truth">
        <caption className="lbl" style={{ textAlign: 'left' }}>
          Truth table for {gate}
        </caption>
        <thead>
          <tr>
            <th scope="col">A</th>
            {!single && <th scope="col">B</th>}
            <th scope="col">Y</th>
          </tr>
        </thead>
        <tbody>
          {combos.map(([x, y]) => {
            const current = x === a && (single || y === b);
            return (
              <tr key={`${x}${y}`} style={current ? { background: 'var(--mark)' } : undefined} aria-current={current ? 'true' : undefined}>
                <td>{bit(x)}</td>
                {!single && <td>{bit(y)}</td>}
                <td style={{ fontWeight: 700 }}>{bit(run(x, y))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </ToolLayout>
  );
}

export function Adder() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [cin, setCin] = useState(false);
  const half = { s: a !== b, c: a && b };
  const full = { s: (a !== b) !== cin, c: (a && b) || (b && cin) || (a && cin) };
  return (
    <ToolLayout
      controls={
        <>
          <Toggle label="A" checked={a} onChange={setA} />
          <Toggle label="B" checked={b} onChange={setB} />
          <Toggle label="Carry in" checked={cin} onChange={setCin} />
          <Readouts
            items={[
              ['Half adder sum', String(bit(half.s))],
              ['Half adder carry', String(bit(half.c))],
              ['Full adder sum', String(bit(full.s))],
              ['Full adder carry', String(bit(full.c))],
              ['Value (carry, sum)', `${bit(full.c)}${bit(full.s)} in binary = ${bit(full.c) * 2 + bit(full.s)}`],
            ]}
          />
        </>
      }
    >
      <p className="lbl">Half adder</p>
      <Equation latex="S=A\oplus B,\quad C=A\cdot B" />
      <p className="lbl mt-2">Full adder</p>
      <Equation latex="S=A\oplus B\oplus C_{in},\quad C_{out}=AB+BC_{in}+AC_{in}" />
    </ToolLayout>
  );
}

const BASES = [
  { id: 'dec', label: 'Decimal', radix: 10, pattern: /^[0-9]+$/ },
  { id: 'bin', label: 'Binary', radix: 2, pattern: /^[01]+$/ },
  { id: 'hex', label: 'Hexadecimal', radix: 16, pattern: /^[0-9a-fA-F]+$/ },
  { id: 'oct', label: 'Octal', radix: 8, pattern: /^[0-7]+$/ },
];

export function BaseConverter() {
  const [source, setSource] = useState<{ id: string; text: string }>({ id: 'dec', text: '255' });
  const from = BASES.find((b) => b.id === source.id)!;
  const valid = from.pattern.test(source.text.trim());
  let value: bigint | null = null;
  if (valid) {
    value = 0n;
    for (const ch of source.text.trim().toLowerCase()) value = value * BigInt(from.radix) + BigInt(parseInt(ch, 16));
  }
  return (
    <ToolLayout
      controls={
        <>
          {BASES.map((b) => (
            <Field
              key={b.id}
              label={b.label}
              inputMode="text"
              value={b.id === source.id ? source.text : value !== null ? value.toString(b.radix).toUpperCase() : ''}
              invalid={b.id === source.id && !valid && source.text !== ''}
              onChange={(text) => setSource({ id: b.id, text })}
            />
          ))}
          {!valid && source.text !== '' && <p className="var-warn">"{source.text}" is not a valid {from.label.toLowerCase()} number.</p>}
        </>
      }
    >
      <p className="text-ink-2">Type in any box to convert. To convert by hand from decimal, divide repeatedly by the base and read the remainders from the last to the first.</p>
      {value !== null && value < 1024n && (
        <>
          <p className="lbl mt-3">Binary place values</p>
          <p className="num">{[...value.toString(2)].map((d, i, all) => `${d}×2^${all.length - 1 - i}`).join(' + ')}</p>
        </>
      )}
    </ToolLayout>
  );
}
