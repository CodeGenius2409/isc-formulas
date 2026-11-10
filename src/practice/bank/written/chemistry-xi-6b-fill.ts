// Written by hand: ionic equilibrium, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The titration curve is 25 mL of 0.1 M HCl against 0.1 M NaOH: [H⁺] = 0.1(25 − V)/(25 + V) before the end point, [OH⁻] = 0.1(V − 25)/(25 + V) after it.
// The buffer table: 100 mL of 1 M ethanoic acid and 1 M sodium ethanoate (pKa 4.74), or 1 M ammonia and 1 M ammonium chloride (pKb 4.75), with 0.001 mol HCl added.
import { at, kit, type BankDef } from '../define';
import { graph, plot, table } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('chemistry', 'XI');
const I = at(6, 'b');

const pHOf = (v: number) => {
  if (Math.abs(v - 25) < 1e-9) return 7;
  if (v < 25) return -Math.log10((0.1 * (25 - v)) / (25 + v));
  return 14 + Math.log10((0.1 * (v - 25)) / (25 + v));
};

const questions: BankDef[] = [
  figure(I(3, 2), 'The graph shows the pH as 0.1 M NaOH is added to 25 mL of 0.1 M HCl. Read off the volume and the pH at the end point, and say why both methyl orange and phenolphthalein can be used.', ['The end point is at 25 mL of NaOH, where the pH is 7.', 'Near it, the pH jumps from about 3 to about 11 for a drop or two of alkali.', 'Both indicators change colour inside this jump, methyl orange at pH 3.1–4.4 and phenolphthalein at 8.3–10, so either shows the end point.'], {
    shown: graph('volume of NaOH added (mL)', 'pH', [{ points: plot(pHOf, 0, 50, 100) }], { x: [[25, '25'], [50, '50']], y: [[3, '3'], [7, '7'], [11, '11']] }),
  }),
  figure(I(2, 2), 'Sketch how the percentage of ethanoic acid that is ionised changes with its concentration C, and explain the shape from Ostwald’s dilution law.', ['The percentage ionised falls as C rises, steeply at low concentrations and slowly at high ones.', 'α = √(Ka/C), so α varies as 1/√C: diluting a weak acid ionises more of it.'], {
    answer: graph('concentration C (mol/L)', 'ionised (%)', [{ points: plot((c) => 100 * Math.sqrt(1.8e-5 / c), 0.01, 0.5, 49) }], { x: [[0.1, '0.1'], [0.5, '0.5']], y: [[1, '1'], [4, '4']] }),
  }),
  figure(I(3, 2), 'The table gives the pH of 100 mL of three solutions before and after 1 mL of 1 M HCl is added. Say which are buffers, of what kind, and why the pH of water changes so much.', ['A and B are buffers, as their pH hardly changes.', 'A is an acidic buffer, a weak acid with its salt; B is a basic buffer, a weak base with its salt.', 'Water has nothing to take up the H⁺ added: 0.001 mol in about 0.1 L makes [H⁺] = 0.01 mol/L, so its pH falls to 2.'], {
    shown: table(['Solution', 'pH before', 'pH after'], [['Water', '7.00', '2.00'], ['A', '4.74', '4.73'], ['B', '9.25', '9.24']], '100 mL of each, with 1 mL of 1 M HCl added.'),
  }),

  predict(I(2, 2), 'Solid ammonium chloride is added to aqueous ammonia coloured pink with a few drops of phenolphthalein. Predict what is seen, and why.', 'The pink colour fades.', 'NH₄⁺ is a common ion that pushes NH₃ + H₂O ⇌ NH₄⁺ + OH⁻ to the left, so [OH⁻] and the pH fall.'),
  predict(I(2, 2), 'Hydrogen chloride gas is passed into a saturated solution of sodium chloride. Predict what is seen, and why.', 'Pure sodium chloride crystallises out.', 'The added Cl⁻ is a common ion, so the ionic product [Na⁺][Cl⁻] goes above the solubility product.'),
  predict(I(2, 3), 'Predict whether a solution of ammonium ethanoate is acidic, basic or neutral, and explain.', 'It is very nearly neutral, at pH about 7.', 'Both ions are hydrolysed, NH₄⁺ giving H⁺ and CH₃COO⁻ giving OH⁻, and as Ka of ethanoic acid and Kb of ammonia are almost equal, the two effects cancel.'),

  odd(I(2, 1), ['NaCl', 'HCl', 'glucose', 'KOH'], 'glucose', 'It is a non-electrolyte, forming no ions in water; the others are strong electrolytes.'),
  odd(I(2, 2), ['CH₃COONa', 'Na₂CO₃', 'NH₄Cl', 'KCN'], 'NH₄Cl', 'Its solution is acidic, as NH₄⁺ is hydrolysed; the others give basic solutions.'),
  odd(I(2, 1), ['H₃PO₄', 'H₂SO₄', 'H₂CO₃', 'HNO₃'], 'HNO₃', 'It is monobasic, with one ionisable hydrogen; the others are polybasic.'),

  long(I(5, 2), 'Answer each part on salt hydrolysis.\n(a) Write the equation for the hydrolysis of the ethanoate ion, and say why sodium chloride doesn’t hydrolyse. [2]\n(b) Find the pH of 0.1 M sodium ethanoate, given Ka of ethanoic acid = 1.8 × 10⁻⁵ and Kw = 1.0 × 10⁻¹⁴. [3]', '(a) CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻.', '(a) Na⁺ and Cl⁻ come from a strong base and a strong acid, so neither takes H⁺ or OH⁻ from water.', '(b) Kh = Kw/Ka = 1.0 × 10⁻¹⁴/1.8 × 10⁻⁵ = 5.6 × 10⁻¹⁰.', '(b) [OH⁻] = √(Kh × C) = √(5.6 × 10⁻¹¹) = 7.5 × 10⁻⁶ mol/L.', '(b) pOH = 5.13, so pH = 14 − 5.13 = 8.87.'),

  tell(I(2, 1), 'Distinguish between the solubility and the solubility product of a sparingly soluble salt.', 'Solubility is how much of the salt dissolves to make a saturated solution, in mol/L.', 'The solubility product is the product of the ion concentrations in that saturated solution, each raised to its power in the formula; for AgCl, Ksp = s².'),
  tell(I(2, 1), 'Distinguish between an acidic buffer and a basic buffer, with an example of each.', 'An acidic buffer is a weak acid with its salt of a strong base, such as ethanoic acid and sodium ethanoate; it keeps a pH below 7.', 'A basic buffer is a weak base with its salt of a strong acid, such as ammonia and ammonium chloride; it keeps a pH above 7.'),
  tell(I(2, 2), 'Distinguish between the ionic product and the solubility product of a salt, and say how they decide whether it precipitates.', 'The ionic product is the product of the ion concentrations at any moment; the solubility product is its value in a saturated solution.', 'The salt precipitates when the ionic product is greater than the solubility product.'),

  match(I(4, 1), [['Methyl orange', 'red to yellow, about pH 3.1–4.4'], ['Phenolphthalein', 'colourless to pink, about pH 8.3–10'], ['Litmus', 'red to blue, about pH 5–8'], ['Methyl red', 'red to yellow, about pH 4.4–6.2']]),
  match(I(4, 2), [['NaCl', 'neutral, neither ion hydrolysed'], ['CH₃COONa', 'basic, the anion hydrolysed'], ['NH₄Cl', 'acidic, the cation hydrolysed'], ['CH₃COONH₄', 'nearly neutral, both ions hydrolysed']]),
  match(I(4, 1), [['0.01 M HCl', 'pH 2'], ['0.001 M NaOH', 'pH 11'], ['Pure water at 25 °C', 'pH 7'], ['0.0001 M HNO₃', 'pH 4']]),

  reason(I(2, 2), 'Why is pure water still neutral at 60 °C, though its pH is less than 7?', 'Kw is larger at higher temperatures, so more water ionises and [H⁺] goes above 10⁻⁷ mol/L.', 'But [H⁺] and [OH⁻] stay equal, which is what neutral means.'),
  reason(I(2, 1), 'Why is a weak acid more ionised when it is diluted?', 'By Ostwald’s dilution law, α = √(Ka/C).', 'So as the concentration C falls, the degree of ionisation α rises.'),
  reason(I(2, 3), 'Why does an indicator change colour over a range of about two pH units, not at one pH?', 'An indicator is a weak acid, HIn ⇌ H⁺ + In⁻, whose two forms have different colours.', 'The eye sees a change only once one form is about ten times the other, and that ratio goes from 1:10 to 10:1 over about two pH units.'),

  short(I(2, 1), 'Find the pH of 0.005 M H₂SO₄, taking both its protons as fully ionised.', '[H⁺] = 2 × 0.005 = 0.01 mol/L.', 'pH = −log 0.01 = 2.'),
  short(I(2, 2), 'The solubility product of BaSO₄ is 1.1 × 10⁻¹⁰. Find its solubility in mol/L.', 'BaSO₄ ⇌ Ba²⁺ + SO₄²⁻, so Ksp = s².', 's = √(1.1 × 10⁻¹⁰) = 1.05 × 10⁻⁵ mol/L.'),
  short(I(2, 1), 'Write the Henderson equation for an acidic buffer, and say when its pH equals the pKa of the acid.', 'pH = pKa + log([salt]/[acid]).', 'The pH equals the pKa when the salt and the acid have the same concentration, as log 1 = 0.'),

  ar(I(1, 2), 'Silver chloride precipitates when its ionic product goes above its solubility product.', 'The solubility product is the ionic product in a saturated solution, at equilibrium.', 1, 'An ionic product above that value means more ions than a saturated solution can hold, so the excess comes out as a solid.'),
  ar(I(1, 3), 'The pH of 10⁻⁸ M HCl is 8.', 'Water itself gives 10⁻⁷ mol/L of H⁺, which can’t be left out at so low a concentration.', 4, 'With the water’s H⁺ the total is a little above 10⁻⁷ mol/L, so the pH is just below 7, about 6.98: an acid solution can’t have a pH of 8.'),

  derive(I(3, 2), 'Derive the Henderson equation for the pH of a buffer made of a weak acid HA and its salt NaA.', ['HA ⇌ H⁺ + A⁻, so Ka = [H⁺][A⁻]/[HA], and [H⁺] = Ka[HA]/[A⁻].', 1], ['The salt is fully ionised and the weak acid hardly at all, more so with the common ion, so [A⁻] ≈ [salt] and [HA] ≈ [acid].', 1], ['Taking −log of both sides: pH = pKa + log([salt]/[acid]).', 1]),
  derive(I(3, 3), 'For the salt of a weak acid HA and a strong base, show that the hydrolysis constant is Kh = Kw/Ka.', ['The anion is hydrolysed: A⁻ + H₂O ⇌ HA + OH⁻, so Kh = [HA][OH⁻]/[A⁻].', 1], ['Multiplying top and bottom by [H⁺]: Kh = ([HA]/[H⁺][A⁻]) × [H⁺][OH⁻].', 1], ['The first factor is 1/Ka and the second is Kw, so Kh = Kw/Ka.', 1]),
];

export default questions;
