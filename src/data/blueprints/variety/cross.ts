// Numericals that join two topics the papers link, such as energy and circular motion, or moles and gas volumes, and a few for
// topics with little in the solver registry. Each is built from clean values, with the working set out step by step.
import type { Difficulty } from '../../../practice/bank/types';
import { tidy, type Gen } from '../../../practice/gen/gen';
import type { ClassLevel, SubjectId } from '../../types';
import type { Blueprint, Body } from '../types';

type Made = [text: string, answer: number, working: string[], shown: string];
type Row = [subject: SubjectId, level: ClassLevel, place: string, key: string, marks: number, difficulty: Difficulty, make: (g: Gen) => Made];

const G = 9.8;
const u = (x: number, unit: string, digits = 3) => `${tidy(x, digits).replace(/^-/, '−')} ${unit}`;

const ROWS: Row[] = [
  ['physics', 'XI', '3c', 'x-energy-circle', 5, 3, (g) => { const h = g.pick([2, 2.5, 3, 4, 5]), r = g.pick([0.5, 0.8, 1, 1.25]), m = g.pick([0.2, 0.5, 1]); const v2 = 2 * G * h; const N = m * G + (m * v2) / r; return [`A ${m} kg ball runs without friction down a track from a height of ${h} m, and enters a circular dip of radius ${r} m at the bottom. Use energy to find its speed there, and hence the normal reaction on it at the lowest point, in newtons. (Take g = 9.8 m/s².)`, N, [`\\text{Energy: } v^2 = 2gh = ${tidy(v2, 3)}`, `N - mg = \\frac{mv^2}{r}`, `N = ${m}(9.8) + \\frac{${m}(${tidy(v2, 3)})}{${r}}`], u(N, 'N')]; }],
  ['physics', 'XI', '8a', 'x-fall-heat', 3, 3, (g) => { const h = g.pick([42, 84, 105, 210]); const dT = (G * h) / 4200; return [`Water falls ${h} m down a waterfall. If all its potential energy becomes heat in the water, find the temperature rise, in K. (Take g = 9.8 m/s² and c = 4200 J/(kg K).)`, dT, [`mgh = mc\\Delta T`, `\\Delta T = \\frac{gh}{c} = \\frac{9.8 \\times ${h}}{4200}`], u(dT, 'K')]; }],
  ['physics', 'XI', '10a', 'x-pendulum-planet', 3, 3, (g) => { const k = g.pick([4, 9, 16]); const T = g.pick([1, 1.5, 2]); return [`A pendulum has a period of ${T} s on Earth. A planet has the same radius as Earth and ${k} times its mass. Find the pendulum’s period there, in seconds.`, T / Math.sqrt(k), [`g \\propto M \\text{ at the same radius}`, `T \\propto \\frac{1}{\\sqrt{g}}`, `T' = \\frac{${T}}{\\sqrt{${k}}}`], u(T / Math.sqrt(k), 's')]; }],
  ['physics', 'XII', '3a', 'x-accelerate-bend', 5, 3, (g) => { const V = g.pick([100, 200, 400, 900]), B = g.pick([1, 2, 4, 5]); const v = Math.sqrt((2 * 1.6e-19 * V) / 9.1e-31); const r = (9.1e-31 * v) / (1.6e-19 * B * 1e-3); return [`An electron starts from rest and is accelerated through ${V} V. It then enters a field of ${B} mT at right angles. Find the radius of its circle, in cm. (Take m = 9.1 × 10⁻³¹ kg and e = 1.6 × 10⁻¹⁹ C.)`, r * 100, [`eV = \\frac{1}{2}mv^2 \\Rightarrow v = ${tidy(v, 3)}\\text{ m/s}`, `r = \\frac{mv}{eB}`], u(r * 100, 'cm')]; }],
  ['physics', 'XII', '2a', 'x-heater-water', 3, 2, (g) => { const P = g.pick([500, 1000, 1500, 2000]), m = g.pick([1, 2, 3]), dT = g.pick([20, 40, 50, 60]); const t = (m * 4200 * dT) / P; return [`A ${P} W heater warms ${m} kg of water by ${dT} K, with no heat lost. How long does it take, in seconds? (Take c = 4200 J/(kg K).)`, t, [`Pt = mc\\Delta T`, `t = \\frac{${m} \\times 4200 \\times ${dT}}{${P}}`], u(t, 's', 4)]; }],
  ['physics', 'XII', '1b', 'x-capacitor-lamp', 3, 3, (g) => { const C = g.pick([100, 200, 500, 1000]), V = g.pick([10, 12, 20, 50]), t = g.pick([0.1, 0.2, 0.5]); const E = 0.5 * C * 1e-6 * V * V; return [`A ${C} μF capacitor charged to ${V} V discharges through a lamp in ${t} s. Find the average power delivered, in watts.`, E / t, [`E = \\frac{1}{2}CV^2 = ${tidy(E, 3)}\\text{ J}`, `P = \\frac{E}{t}`], u(E / t, 'W')]; }],
  ['physics', 'XII', '7a', 'x-photon-stopping', 3, 2, (g) => { const lam = g.pick([200, 250, 300]), phi = g.pick([1.8, 2.2, 2.5]); const E = 1240 / lam; return [`Light of wavelength ${lam} nm falls on a metal of work function ${phi} eV. Find the stopping potential, in volts. (Take hc = 1240 eV nm.)`, E - phi, [`E = \\frac{1240}{${lam}} = ${tidy(E, 3)}\\text{ eV}`, `eV_0 = E - \\phi`], u(E - phi, 'V')]; }],
  ['physics', 'XII', '8a', 'x-level', 1, 1, (g) => { const n = g.int(2, 5); return [`Find the energy of the electron in level n = ${n} of a hydrogen atom, in eV.`, -13.6 / (n * n), [`E_n = -\\frac{13.6}{n^2}`], u(-13.6 / (n * n), 'eV')]; }],
  ['physics', 'XII', '8a', 'x-transition', 2, 2, (g) => { const b = g.int(1, 3), a = b + g.int(1, 3); const e = 13.6 * (1 / (b * b) - 1 / (a * a)); return [`A hydrogen atom falls from level ${a} to level ${b}. Find the energy of the photon it gives out, in eV.`, e, [`13.6\\left(\\frac{1}{${b}^2} - \\frac{1}{${a}^2}\\right)`], u(e, 'eV')]; }],
  ['physics', 'XII', '8a', 'x-wavelength', 3, 3, (g) => { const b = g.int(1, 2), a = b + g.int(1, 2); const e = 13.6 * (1 / (b * b) - 1 / (a * a)); return [`Find the wavelength of the light from a hydrogen atom falling from level ${a} to level ${b}, in nm. (Take hc = 1240 eV nm.)`, 1240 / e, [`E = ${tidy(e, 3)}\\text{ eV}`, `\\lambda = \\frac{1240}{E}`], u(1240 / e, 'nm')]; }],
  ['physics', 'XII', '8a', 'x-radius', 2, 1, (g) => { const n = g.int(2, 6); return [`The first Bohr radius is 0.053 nm. Find the radius of orbit n = ${n} of hydrogen, in nm.`, 0.053 * n * n, [`r_n = n^2 r_1`], u(0.053 * n * n, 'nm')]; }],
  ['physics', 'XII', '8a', 'x-speed-ratio', 2, 2, (g) => { const a = g.int(2, 6); return [`By what factor is an electron’s speed in the first Bohr orbit greater than in orbit n = ${a}?`, a, [`v \\propto \\frac{1}{n}`], String(a)]; }],
  ['physics', 'XII', '8a', 'x-lines', 2, 2, (g) => { const n = g.int(3, 7); const l = (n * (n - 1)) / 2; return [`A sample of hydrogen atoms is excited to level ${n}. How many spectral lines can it give out as they fall back?`, l, [`\\frac{n(n-1)}{2}`], String(l)]; }],
  ['physics', 'XII', '8a', 'x-ionise', 2, 2, (g) => { const n = g.int(2, 5); return [`How much energy is needed to remove an electron from level ${n} of hydrogen, in eV?`, 13.6 / (n * n), [`\\frac{13.6}{${n}^2}`], u(13.6 / (n * n), 'eV')]; }],
  ['physics', 'XII', '8a', 'x-kinetic', 3, 3, (g) => { const n = g.int(1, 4); return [`Find the kinetic energy of the electron in level ${n} of hydrogen, in eV, and note how it compares with the total energy.`, 13.6 / (n * n), [`KE = -E_n`, `E_n = -\\frac{13.6}{${n * n}}`], u(13.6 / (n * n), 'eV')]; }],
  ['physics', 'XII', '8a', 'x-potential', 3, 3, (g) => { const n = g.int(1, 4); return [`Find the potential energy of the electron in level ${n} of hydrogen, in eV.`, -27.2 / (n * n), [`PE = 2E_n`], u(-27.2 / (n * n), 'eV')]; }],
  ['chemistry', 'XI', '1b', 'x-mole-gas', 3, 2, (g) => { const m = g.pick([5, 10, 20, 25, 50]); const v = (m / 100) * 22.4; return [`${m} g of calcium carbonate is heated until it has fully decomposed to calcium oxide and carbon dioxide. Find the volume of carbon dioxide at STP, in litres. (M of CaCO₃ = 100 g/mol, and 1 mol of gas occupies 22.4 L at STP.)`, v, [`n = \\frac{${m}}{100}`, `V = n \\times 22.4`], u(v, 'L')]; }],
  ['chemistry', 'XI', '5a', 'x-burn-heat', 3, 2, (g) => { const m = g.pick([4, 8, 16, 32]), H = 890; return [`Methane burns with ΔH = −${H} kJ/mol. How much heat is given out when ${m} g of methane burns? Give your answer in kJ. (M = 16 g/mol.)`, (m / 16) * H, [`n = \\frac{${m}}{16}`, `q = n \\times ${H}`], u((m / 16) * H, 'kJ')]; }],
  ['chemistry', 'XI', '6b', 'x-dilute-ph', 3, 3, (g) => { const p = g.int(1, 3), k = g.int(1, 2); return [`A strong acid solution of pH ${p} is diluted to $10^{${k}}$ times its volume. Find the new pH.`, p + k, [`[H^+] \\text{ falls by } 10^{${k}}`, `pH = ${p} + ${k}`], String(p + k)]; }],
  ['chemistry', 'XII', '2b', 'x-faraday-mass', 3, 2, (g) => { const I = g.pick([2, 3, 4, 5]), t = g.pick([965, 1930, 2895]); const m = (I * t * 63.5) / (2 * 96500); return [`A current of ${I} A is passed through copper(II) sulphate solution for ${t} s. Find the mass of copper deposited, in grams. (M of Cu = 63.5 g/mol, and F = 96500 C/mol.)`, m, [`n_e = \\frac{${I} \\times ${t}}{96500}`, `m = \\frac{n_e}{2} \\times 63.5`], u(m, 'g')]; }],
  ['chemistry', 'XII', '1a', 'x-osmotic-gas', 3, 2, (g) => { const c = g.pick([0.1, 0.2, 0.5]), T = g.pick([300, 310]); const p = c * 0.0821 * T; return [`Find the osmotic pressure at ${T} K of a solution with ${c} mol of solute per litre, in atm, using the form of the ideal gas equation that applies. (Take R = 0.0821 L atm/(mol K).)`, p, [`\\pi = CRT`, `\\pi = ${c} \\times 0.0821 \\times ${T}`], u(p, 'atm')]; }],
  ['mathematics', 'XI', '5b', 'x-committee-prob', 3, 3, (g) => { const m = g.int(3, 6), w = g.int(3, 5), k = 3; const nCr = (n: number, r: number) => { let v = 1; for (let i = 0; i < r; i++) v = (v * (n - i)) / (i + 1); return v; }; const a = nCr(w, k), b = nCr(m + w, k); return [`A committee of ${k} is chosen at random from ${m} men and ${w} women. Find the probability, to 3 decimal places, that all are women.`, a / b, [`\\frac{{}^{${w}}C_{${k}}}{{}^{${m + w}}C_{${k}}} = \\frac{${a}}{${b}}`], (a / b).toFixed(3)]; }],
  ['computerscience', 'XI', '1a', 'x-bin-dec', 1, 1, (g) => { const n = g.int(9, 63); return [`Convert the binary number ${n.toString(2)} to decimal.`, n, [`\\text{Add the place values of the 1s}`], String(n)]; }],
  ['computerscience', 'XI', '1a', 'x-oct-dec', 2, 1, (g) => { const n = g.int(40, 400); return [`Convert the octal number ${n.toString(8)} to decimal.`, n, [`\\text{Powers of 8}`], String(n)]; }],
  ['computerscience', 'XI', '1a', 'x-hex-dec', 2, 2, (g) => { const n = g.int(160, 2000); return [`Convert the hexadecimal number ${n.toString(16).toUpperCase()} to decimal.`, n, [`\\text{Powers of 16}`], String(n)]; }],
  ['computerscience', 'XI', '1a', 'x-add-bin', 2, 2, (g) => { const a = g.int(9, 31), b = g.int(9, 31); return [`Add the binary numbers ${a.toString(2)} and ${b.toString(2)}. Give the sum in decimal.`, a + b, [`${a} + ${b}`], String(a + b)]; }],
  ['computerscience', 'XI', '1a', 'x-sub-bin', 2, 2, (g) => { const a = g.int(20, 63), b = g.int(3, 19); return [`Subtract the binary number ${b.toString(2)} from ${a.toString(2)}. Give the difference in decimal.`, a - b, [`${a} - ${b}`], String(a - b)]; }],
  ['computerscience', 'XI', '1a', 'x-bits', 1, 2, (g) => { const n = g.int(4, 10); return [`What is the largest unsigned number that ${n} bits can hold, in decimal?`, 2 ** n - 1, [`2^{${n}} - 1`], String(2 ** n - 1)]; }],
  ['computerscience', 'XI', '1a', 'x-digits', 2, 3, (g) => { const v = g.pick([100, 500, 1000, 5000]); const n = Math.ceil(Math.log2(v + 1)); return [`How many binary digits are needed to write ${v}?`, n, [`2^{${n - 1}} \\le ${v} < 2^{${n}}`], String(n)]; }],
  ['computerscience', 'XI', '1a', 'x-hex-bits', 1, 1, (g) => { const n = g.int(2, 8); return [`How many bits are in a ${n}-digit hexadecimal number?`, 4 * n, [`4 \\text{ bits per digit}`], String(4 * n)]; }],
  ['computerscience', 'XI', '1a', 'x-oct-bits', 1, 1, (g) => { const n = g.int(2, 8); return [`How many bits are in a ${n}-digit octal number?`, 3 * n, [`3 \\text{ bits per digit}`], String(3 * n)]; }],
];

const CODE: Record<SubjectId, string> = { physics: 'p', chemistry: 'c', mathematics: 'm', computerscience: 'k' };

export function crossBlueprints(subject: SubjectId, level: ClassLevel): Blueprint[] {
  const prefix = `${CODE[subject]}${level === 'XII' ? '12' : '11'}`;
  return ROWS.filter((r) => r[0] === subject && r[1] === level).map(([, , place, key, marks, difficulty, make]) => {
    const m = /^(\d+)([a-z])$/.exec(place)!;
    return {
      id: `${prefix}-${m[1]}${m[2]}-v-${key}`,
      subject,
      level,
      unit: Number(m[1]),
      topic: m[2],
      marks,
      type: 'numerical',
      difficulty,
      format: 'numerical',
      style: 'paper-style',
      family: key,
      make(g): Body {
        const [text, answer, working, shown] = make(g);
        if (answer === 0) g.retry('an answer of zero');
        return { form: 'numeric', text, parts: [g.answerPart('Answer', answer, marks, [{ label: 'Working', math: working }], '', shown)] };
      },
    } satisfies Blueprint;
  });
}
