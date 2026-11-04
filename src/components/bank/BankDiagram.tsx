import type { DiagramSpec } from '../../practice/bank/diagram';

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

function Label({ x, y, children, anchor = 'middle' }: { x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end' }) {
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

function describe(spec: DiagramSpec): string {
  switch (spec.kind) {
    case 'cell-parallel':
      return `A cell of emf ${spec.emf} and internal resistance ${spec.r}, connected across resistors of ${spec.r1} and ${spec.r2} in parallel.`;
    case 'series-capacitors':
      return `Capacitors of ${spec.c1} and ${spec.c2} in series across a supply of ${spec.v}.`;
    case 'wheatstone':
      return `A Wheatstone bridge with a galvanometer between the two middle points. The top arms are P = ${spec.p} and Q = ${spec.q}. The bottom arms are R = ${spec.r} and S = ${spec.s}.`;
    default:
      return 'A figure for this question.';
  }
}

/** A clean circuit generated from the question's values, in the theme's ink. */
export function BankDiagram({ spec }: { spec: DiagramSpec }) {
  return (
    <svg className="bank-diagram" viewBox={spec.kind === 'wheatstone' ? '0 0 320 250' : '0 0 320 190'} role="img" aria-label={describe(spec)} fill="none" stroke="currentColor" strokeWidth={1.5}>
      {spec.kind === 'cell-parallel' && (
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
        </>
      )}
      {spec.kind === 'series-capacitors' && (
        <>
          <path d="M40 150 L40 50 L115 50 M125 50 L205 50 M215 50 L280 50 L280 150 M115 32 L115 68 M125 32 L125 68 M205 32 L205 68 M215 32 L215 68" />
          <Cell x1={40} x2={280} y={150} />
          <Label x={120} y={22}>{spec.c1}</Label>
          <Label x={210} y={22}>{spec.c2}</Label>
          <Label x={160} y={178}>{spec.v}</Label>
        </>
      )}
      {spec.kind === 'wheatstone' && (
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
        </>
      )}
    </svg>
  );
}
