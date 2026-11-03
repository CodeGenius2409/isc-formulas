import { memo, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { formulaText, METALS } from '../data/lewis/check';
import { LEWIS } from '../data/lewis/figures';
import type { LewisAtom, LewisFigure, LewisMolecule } from '../data/lewis/types';
import { chemText } from './Structures';

const ELEMENT: Record<string, string> = {
  H: 'hydrogen', Be: 'beryllium', B: 'boron', Al: 'aluminium', C: 'carbon', N: 'nitrogen', P: 'phosphorus', O: 'oxygen', S: 'sulphur', F: 'fluorine', Cl: 'chlorine', Br: 'bromine', I: 'iodine', Fe: 'iron', Co: 'cobalt', Ni: 'nickel', Pt: 'platinum', Cu: 'copper', Ag: 'silver', Zn: 'zinc',
};
const NUMBER = ['no', 'one', 'two', 'three', 'four', 'five', 'six'];

const superCharge = (charge: number) => (charge > 0 ? `${charge > 1 ? charge : ''}+` : `${charge < -1 ? -charge : ''}−`);

/** What the structure shows, in words, for a screen reader and the enlarged view. */
export function describeMolecule(m: LewisMolecule): string {
  const parts = [m.name, formulaText(m.formula, m.charge)];
  if (m.shape) parts.push(m.shape);
  const centre = m.central !== undefined ? m.atoms[m.central] : null;
  if (centre && !METALS.has(centre.el) && !m.quietPairs) {
    const lone = centre.lp ?? 0;
    parts.push(`${NUMBER[lone]} lone ${lone === 1 ? 'pair' : 'pairs'} on ${ELEMENT[centre.el] ?? centre.el}`);
  } else if (!centre && !m.quietPairs) {
    const marked = m.atoms.filter((a) => a.mark && a.lp);
    if (marked.length) parts.push(`lone pairs on ${[...new Set(marked.map((a) => ELEMENT[a.el] ?? a.el))].join(' and ')}`);
  }
  if (m.note) parts.push(m.note);
  return parts.join(', ');
}

const labelOf = (atom: LewisAtom) => chemText(atom.label ?? atom.el);

/** How far from an atom's centre its bonds stop and its dots sit, by the length of its label. */
function radiusOf(atom: LewisAtom): number {
  if (atom.hide) return 0;
  const length = [...labelOf(atom)].length;
  return 8 + (length - 1) * 4.2;
}

const dirOf = (a: LewisAtom, b: LewisAtom) => (Math.atan2(a.y - b.y, b.x - a.x) * 180) / Math.PI;
const angleGap = (p: number, q: number) => {
  const d = Math.abs(((p - q) % 360) + 360) % 360;
  return d > 180 ? 360 - d : d;
};

/** Places lone pairs in the widest gaps between an atom's bonds and each other. */
export function lonePairAngles(atom: LewisAtom, taken: number[]): number[] {
  if (!atom.lp) return [];
  if (atom.lpAt && atom.lpAt.length === atom.lp) return atom.lpAt;
  const used = [...taken];
  const out: number[] = [];
  for (let n = 0; n < atom.lp; n++) {
    let best = 0;
    let bestGap = -1;
    for (let at = 0; at < 360; at += 15) {
      const gap = used.length ? Math.min(...used.map((u) => angleGap(u, at))) : 360 - at;
      if (gap > bestGap + 1e-6) {
        bestGap = gap;
        best = at;
      }
    }
    used.push(best);
    out.push(best);
  }
  return out;
}

function BondLine({ m, index }: { m: LewisMolecule; index: number }) {
  const bond = m.bonds[index];
  const a = m.atoms[bond.a];
  const b = m.atoms[bond.b];
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = (b.x - a.x) / length;
  const uy = (b.y - a.y) / length;
  const ra = radiusOf(a);
  const rb = radiusOf(b);
  const x1 = a.x + ux * ra;
  const y1 = a.y + uy * ra;
  const x2 = b.x - ux * rb;
  const y2 = b.y - uy * rb;
  const nx = -uy;
  const ny = ux;
  const line = (offset: number, key: number) => <line key={key} x1={x1 + nx * offset} y1={y1 + ny * offset} x2={x2 + nx * offset} y2={y2 + ny * offset} />;

  if (bond.style === 'wedge') {
    return <polygon points={`${x1},${y1} ${x2 + nx * 3.2},${y2 + ny * 3.2} ${x2 - nx * 3.2},${y2 - ny * 3.2}`} fill="currentColor" stroke="none" />;
  }
  if (bond.style === 'dash') {
    const dashes = 5;
    return (
      <>
        {Array.from({ length: dashes }, (_, i) => {
          const t = (i + 1) / dashes;
          const px = x1 + (x2 - x1) * t;
          const py = y1 + (y2 - y1) * t;
          const w = 3.2 * t;
          return <line key={i} x1={px + nx * w} y1={py + ny * w} x2={px - nx * w} y2={py - ny * w} />;
        })}
      </>
    );
  }
  if (bond.style === 'hbond') return <line x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray="1.5 3.2" strokeLinecap="round" />;
  if (bond.style === 'dative') {
    return (
      <>
        <line x1={x1} y1={y1} x2={x2 - ux * 4} y2={y2 - uy * 4} />
        <polygon points={`${x2},${y2} ${x2 - ux * 7 + nx * 3.2},${y2 - uy * 7 + ny * 3.2} ${x2 - ux * 7 - nx * 3.2},${y2 - uy * 7 - ny * 3.2}`} fill="currentColor" stroke="none" />
      </>
    );
  }
  if (bond.order === 2) return <>{[line(-2.2, 0), line(2.2, 1)]}</>;
  if (bond.order === 3) return <>{[line(-3.4, 0), line(0, 1), line(3.4, 2)]}</>;
  return line(0, 0);
}

function AtomMarks({ m, index, showPairs }: { m: LewisMolecule; index: number; showPairs: boolean }) {
  const atom = m.atoms[index];
  const taken = m.bonds.flatMap((bond) => {
    if (bond.a === index) return [dirOf(atom, m.atoms[bond.b])];
    if (bond.b === index) return [dirOf(atom, m.atoms[bond.a])];
    return [];
  });
  const pairs = lonePairAngles(atom, taken);
  const r = radiusOf(atom);
  const shown = showPairs || atom.mark;
  const dots = shown
    ? pairs.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const dx = Math.cos(rad);
        const dy = -Math.sin(rad);
        const cx = atom.x + dx * (r + 3);
        const cy = atom.y + dy * (r + 3);
        return (
          <g key={i} className={atom.mark ? 'lewis-point' : undefined}>
            <circle cx={cx - dy * 2.7} cy={cy + dx * 2.7} r={1.45} />
            <circle cx={cx + dy * 2.7} cy={cy - dx * 2.7} r={1.45} />
          </g>
        );
      })
    : [];
  const clear = [...taken, ...pairs];
  let radicalDot = null;
  if (atom.radical) {
    const deg = lonePairAngles({ ...atom, lp: 1, lpAt: undefined }, clear)[0];
    const rad = (deg * Math.PI) / 180;
    clear.push(deg);
    radicalDot = <circle cx={atom.x + Math.cos(rad) * (r + 3)} cy={atom.y - Math.sin(rad) * (r + 3)} r={1.9} />;
  }
  let chargeText = null;
  if (atom.charge && !atom.quietCharge) {
    // The corner of the label furthest from everything else.
    const corners = [45, 135, 315, 225];
    const corner = corners.reduce((best, c) => (Math.min(...clear.map((u) => angleGap(u, c)), 360) > Math.min(...clear.map((u) => angleGap(u, best)), 360) ? c : best), corners[0]);
    const rad = (corner * Math.PI) / 180;
    chargeText = (
      <text x={atom.x + Math.cos(rad) * (r + 7)} y={atom.y - Math.sin(rad) * (r + 5)} className="lewis-charge">
        {superCharge(atom.charge)}
      </text>
    );
  }
  return (
    <>
      {dots}
      {radicalDot}
      {chargeText}
    </>
  );
}

/** One structure, in the theme's ink, sized from its own atoms. */
export const LewisSvg = memo(function LewisSvg({ m, scale = 1 }: { m: LewisMolecule; scale?: number }) {
  const pad = 26;
  const xs = m.atoms.map((a) => a.x);
  const ys = m.atoms.map((a) => a.y);
  const widest = Math.max(...m.atoms.map((a) => (a.hide ? 0 : radiusOf(a))));
  const left = Math.min(...xs) - pad - widest / 2;
  const right = Math.max(...xs) + pad + widest / 2;
  const top = Math.min(...ys) - pad;
  const bottom = Math.max(...ys) + pad;
  const extra = m.bracket ? 20 : 0;
  const w = right - left + extra * 2;
  const h = bottom - top + (m.bracket ? 8 : 0);
  return (
    <svg className="lewis" viewBox={`${left - extra} ${top - (m.bracket ? 4 : 0)} ${w} ${h}`} width={w * scale} height={h * scale} role="img" aria-label={describeMolecule(m)}>
      <g stroke="currentColor" strokeWidth={1.5} fill="currentColor">
        {m.bonds.map((_, i) => (
          <BondLine key={i} m={m} index={i} />
        ))}
      </g>
      <g fill="currentColor" stroke="none">
        {m.atoms.map((atom, i) => (
          <g key={i}>
            {!atom.hide && (
              <text x={atom.x} y={atom.y} className="lewis-atom">
                {labelOf(atom)}
              </text>
            )}
            <AtomMarks m={m} index={i} showPairs={!m.quietPairs} />
          </g>
        ))}
      </g>
      {m.bracket && (
        <g fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d={`M${left + 6} ${top + 2} h-6 V${bottom + 2} h6`} />
          <path d={`M${right - 6} ${top + 2} h6 V${bottom + 2} h-6`} />
          <text x={right + 10} y={top + 2} className="lewis-charge" fill="currentColor" stroke="none">
            {superCharge(m.charge)}
          </text>
        </g>
      )}
    </svg>
  );
});

function Enlarged({ figure, onClose }: { figure: LewisFigure; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  const first = figure.forms[0];
  return (
    <dialog
      ref={ref}
      className="molecule-zoom"
      aria-label={figure.name}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="molecule-zoom-head">
        <h2>{figure.name}</h2>
        <button type="button" className="btn btn-quiet" aria-label="Close" onClick={onClose}>
          <X size={18} aria-hidden />
        </button>
      </div>
      <div className="molecule-zoom-body">
        <FormsRow figure={figure} scale={figure.forms.length > 1 ? 1.15 : 2} />
      </div>
      <p className="molecule-zoom-facts">
        <span className="num">{formulaText(first.formula, first.charge)}</span>
        {first.shape && <> · {first.shape}</>}
        {first.hyb && <> · <span className="num">{first.hyb.replace(/2/g, '²').replace(/3/g, '³')}</span> hybridised</>}
        {first.note && <> · {first.note}</>}
      </p>
    </dialog>
  );
}

function FormsRow({ figure, scale }: { figure: LewisFigure; scale: number }) {
  return (
    <span className="scheme-row lewis-forms">
      {figure.forms.map((form, i) => (
        <span key={form.id} className="scheme-mol">
          {i > 0 && (
            <span className="scheme-arrow">
              <span aria-hidden>↔</span>
              <span className="sr-only"> or </span>
            </span>
          )}
          <LewisSvg m={form} scale={scale} />
        </span>
      ))}
    </span>
  );
}

/** The structures for one entry. Each opens larger when tapped. */
export default function LewisFigures({ ids, scale = 0.85 }: { ids: string[]; scale?: number }) {
  const [open, setOpen] = useState<LewisFigure | null>(null);
  return (
    <div className="structures lewis-set">
      <div className="scheme-row">
        {ids.map((id) => {
          const figure = LEWIS[id];
          if (!figure) return null;
          return (
            <figure key={id} className="scheme-named">
              <button type="button" className="molecule-button" title={figure.name} onClick={() => setOpen(figure)}>
                <span className="sr-only">Enlarge </span>
                <FormsRow figure={figure} scale={scale} />
              </button>
              <figcaption>{figure.name}</figcaption>
            </figure>
          );
        })}
      </div>
      {open && <Enlarged figure={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

