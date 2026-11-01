import { useMemo, useState } from 'react';
import { Canvas, drawPlot, token } from './lib/plot';
import { bestIndicator, equivalenceVolume, INDICATORS, jumpRange, phAfter, suitableIndicators, type Indicator, type TitrationKind, type TitrationSetup } from './lib/titration';
import { Equation, fmt, Readouts, Slider, ToolLayout } from './lib/ui';

const KINDS: { id: TitrationKind; label: string; analyte: string; titrant: string; pKLabel?: string; weakIsAcid?: boolean }[] = [
  { id: 'strong-acid-strong-base', label: 'Strong acid, strong base', analyte: 'HCl', titrant: 'NaOH' },
  { id: 'weak-acid-strong-base', label: 'Weak acid, strong base', analyte: 'CH₃COOH', titrant: 'NaOH', pKLabel: 'pKa of the acid', weakIsAcid: true },
  { id: 'weak-base-strong-acid', label: 'Weak base, strong acid', analyte: 'NH₃', titrant: 'HCl', pKLabel: 'pKb of the base' },
  { id: 'strong-base-strong-acid', label: 'Strong base, strong acid', analyte: 'NaOH', titrant: 'HCl' },
  { id: 'strong-acid-weak-base', label: 'Strong acid, weak base', analyte: 'HCl', titrant: 'NH₃', pKLabel: 'pKb of the base' },
];

function equations(kind: TitrationKind): { label: string; latex: string }[] {
  const eq = { label: 'At equivalence', latex: 'C_aV_a=C_bV_b' };
  if (kind === 'weak-acid-strong-base') {
    return [
      { label: 'Before any base', latex: '[\\mathrm{H^+}]\\approx\\sqrt{K_aC}' },
      { label: 'Buffer region', latex: '\\mathrm{pH}=\\mathrm{p}K_a+\\log\\frac{[\\mathrm{A^-}]}{[\\mathrm{HA}]}' },
      { label: 'Half-equivalence', latex: '\\mathrm{pH}=\\mathrm{p}K_a' },
      eq,
      { label: 'Salt at equivalence', latex: '\\mathrm{pH}=7+\\tfrac12\\mathrm{p}K_a+\\tfrac12\\log C' },
    ];
  }
  if (kind === 'weak-base-strong-acid') {
    return [
      { label: 'Before any acid', latex: '[\\mathrm{OH^-}]\\approx\\sqrt{K_bC}' },
      { label: 'Buffer region', latex: '\\mathrm{pOH}=\\mathrm{p}K_b+\\log\\frac{[\\mathrm{BH^+}]}{[\\mathrm{B}]}' },
      { label: 'Half-equivalence', latex: '\\mathrm{pOH}=\\mathrm{p}K_b' },
      eq,
      { label: 'Salt at equivalence', latex: '\\mathrm{pH}=7-\\tfrac12\\mathrm{p}K_b-\\tfrac12\\log C' },
    ];
  }
  if (kind === 'strong-acid-weak-base') {
    return [{ label: 'Before equivalence', latex: '[\\mathrm{H^+}]=\\frac{C_aV_a-C_bV_b}{V_a+V_b}' }, eq, { label: 'Salt at equivalence', latex: '\\mathrm{pH}=7-\\tfrac12\\mathrm{p}K_b-\\tfrac12\\log C' }];
  }
  return [{ label: 'Excess acid', latex: '[\\mathrm{H^+}]=\\frac{C_aV_a-C_bV_b}{V_a+V_b}' }, eq, { label: 'Excess base', latex: '[\\mathrm{OH^-}]=\\frac{C_bV_b-C_aV_a}{V_a+V_b}' }];
}

function Swatch({ indicator, ph }: { indicator: Indicator; ph: number }) {
  const colour = ph < indicator.low ? indicator.acidColour : ph > indicator.high ? indicator.baseColour : `color-mix(in srgb, ${indicator.acidColour}, ${indicator.baseColour})`;
  const word = ph < indicator.low ? indicator.acidName : ph > indicator.high ? indicator.baseName : 'changing';
  return (
    <span className="inline-flex items-center gap-1">
      <span aria-hidden className="inline-block h-3 w-3 border border-rule-2" style={{ background: colour }} />
      {word}
    </span>
  );
}

export function Titration() {
  const [kindId, setKindId] = useState<TitrationKind>('weak-acid-strong-base');
  const [analyteC, setAnalyteC] = useState(0.1);
  const [analyteV, setAnalyteV] = useState(25);
  const [titrantC, setTitrantC] = useState(0.1);
  const [pK, setPK] = useState(4.76);
  const [added, setAdded] = useState(12.5);
  const [chosen, setChosen] = useState<string>('auto');

  const kind = KINDS.find((k) => k.id === kindId)!;
  const setup: TitrationSetup = useMemo(() => ({ kind: kindId, analyteC, analyteV, titrantC, pK }), [kindId, analyteC, analyteV, titrantC, pK]);
  const vEq = equivalenceVolume(setup);
  const maxV = Math.max(vEq * 2, 1);
  const curve = useMemo(() => {
    const pts: [number, number][] = [];
    const n = 400;
    for (let i = 0; i <= n; i++) {
      const v = (maxV * i) / n;
      pts.push([v, phAfter(setup, v)]);
    }
    return pts;
  }, [setup, maxV]);

  const ph = phAfter(setup, Math.min(added, maxV));
  const phEq = phAfter(setup, vEq);
  const halfV = vEq / 2;
  const phHalf = phAfter(setup, halfV);
  const hasHalf = Boolean(kind.pKLabel) && kindId !== 'strong-acid-weak-base';
  const suitable = suitableIndicators(setup);
  const best = bestIndicator(setup);
  const indicator = chosen === 'auto' ? best : (INDICATORS.find((i) => i.name === chosen) ?? best);
  const jump = jumpRange(setup);

  const markers = [{ x: vEq, y: phEq, color: 'accent', label: `Equivalence, pH ${fmt(phEq, 3)}` }, ...(hasHalf ? [{ x: halfV, y: phHalf, color: 'computerscience', label: `Half-equivalence, pH ${fmt(phHalf, 3)}` }] : [])];

  return (
    <div>
      <ToolLayout
        controls={
          <>
            <div>
              <label className="lbl" htmlFor="tit-kind">
                Titration
              </label>
              <select id="tit-kind" className="field" value={kindId} onChange={(e) => setKindId(e.target.value as TitrationKind)}>
                {KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-step--1 text-ink-2">
                {kind.titrant} from the burette into {kind.analyte}
              </p>
            </div>
            <Slider label="Concentration in flask" value={analyteC} min={0.01} max={1} step={0.01} unit="mol/L" onChange={setAnalyteC} />
            <Slider label="Volume in flask" value={analyteV} min={5} max={50} step={1} unit="mL" onChange={setAnalyteV} />
            <Slider label="Concentration in burette" value={titrantC} min={0.01} max={1} step={0.01} unit="mol/L" onChange={setTitrantC} />
            {kind.pKLabel && <Slider label={kind.pKLabel} value={pK} min={2} max={11} step={0.01} onChange={setPK} />}
            <Slider label="Volume added" value={Math.min(added, maxV)} min={0} max={maxV} step={maxV / 200} unit="mL" format={(v) => v.toFixed(1)} onChange={setAdded} />
            <Readouts
              items={[
                ['pH now', fmt(ph, 3)],
                ['Equivalence volume', `${fmt(vEq, 4)} mL`],
                ['pH at equivalence', fmt(phEq, 3)],
                ...(hasHalf ? ([['Half-equivalence', `${fmt(halfV, 4)} mL, pH ${fmt(phHalf, 3)}`]] as [string, string][]) : []),
                ['pH jump (one drop either side)', `${fmt(jump.low, 3)} to ${fmt(jump.high, 3)}`],
              ]}
            />
          </>
        }
      >
        <Canvas
          height={360}
          label={`Titration curve. Equivalence at ${fmt(vEq, 3)} millilitres, pH ${fmt(phEq, 3)}. Currently pH ${fmt(ph, 3)}.`}
          draw={(ctx, w, h) => {
            const v = drawPlot(ctx, w, h, {
              x: [0, maxV],
              y: [0, 14],
              series: [{ points: curve, color: 'chemistry' }],
              bands: [{ y0: indicator.low, y1: indicator.high, color: indicator.baseColour === '#d8d8d8' ? indicator.acidColour : indicator.baseColour }],
              vlines: [{ x: vEq, color: 'accent' }],
              markers,
              xLabel: 'Volume added (mL)',
              yLabel: 'pH',
            });
            ctx.strokeStyle = token('ink');
            ctx.fillStyle = token('paper');
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(v.toPx(Math.min(added, maxV)), v.toPy(ph), 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }}
        />
        <p className="mt-1 text-step--1 text-ink-2">The shaded band is the colour-change range of {indicator.name.toLowerCase()}.</p>
      </ToolLayout>

      <section className="today-section" aria-labelledby="ind-h">
        <h2 id="ind-h">Indicator</h2>
        <p className="mt-2">
          <b>{best.name}</b> is the best choice here, changing from {best.acidName} to {best.baseName} at pH {best.low} to {best.high}.
          {suitable.length > 1 ? ` Also suitable: ${suitable.filter((i) => i !== best).map((i) => i.name).join(', ')}.` : ''}
          {suitable.length === 0 ? ' No indicator changes sharply for this titration, because the jump is too small.' : ''}
        </p>
        <div className="table-scroll mt-2" tabIndex={0} role="region" aria-label="Indicators">
          <table className="trace-table" style={{ fontFamily: 'var(--font-body)' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Show on graph</th>
                <th>Range (pH)</th>
                <th style={{ textAlign: 'left' }}>Colour change</th>
                <th style={{ textAlign: 'left' }}>Colour now</th>
                <th style={{ textAlign: 'left' }}>Suits this titration</th>
              </tr>
            </thead>
            <tbody>
              {INDICATORS.map((i) => (
                <tr key={i.name}>
                  <td style={{ textAlign: 'left' }}>
                    <label className="check-row">
                      <input type="radio" name="indicator" checked={indicator === i} onChange={() => setChosen(i.name)} />
                      {i.name}
                    </label>
                  </td>
                  <td>
                    {i.low} to {i.high}
                  </td>
                  <td style={{ textAlign: 'left' }}>
                    {i.acidName} to {i.baseName}
                  </td>
                  <td style={{ textAlign: 'left' }}>
                    <Swatch indicator={i} ph={ph} />
                  </td>
                  <td style={{ textAlign: 'left' }}>{suitable.includes(i) ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="today-section" aria-labelledby="eq-h">
        <h2 id="eq-h">Equations behind this curve</h2>
        <dl className="mt-2">
          {equations(kindId).map((e) => (
            <div key={e.label} className="border-b border-rule py-2">
              <dt className="font-semibold">{e.label}</dt>
              <dd className="m-0">
                <Equation latex={e.latex} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-step--1 text-ink-2">The curve itself comes from solving the full charge balance at every point, so it does not rely on these approximations.</p>
      </section>
    </div>
  );
}
