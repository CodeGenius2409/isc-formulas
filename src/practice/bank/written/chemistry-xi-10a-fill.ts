// Written by hand: acid–base titration, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// Molar masses: Na₂CO₃ 106, NaOH 40, KOH 56, H₂SO₄ 98, HCl 36.5. Avogadro’s number 6.02 × 10²³.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('chemistry', 'XI');
const T = at(10, 'a');

const questions: BankDef[] = [
  figure(T(3, 2), 'The table gives the burette readings when 25.0 cm³ of sodium carbonate solution was titrated against 0.10 M HCl, with methyl orange. Find the titre to use, the molarity of the sodium carbonate, and its concentration in g/L.', ['The rough titre is left out, and the mean of the others, (24.9 + 25.0 + 25.1)/3 = 25.0 cm³, is used.', 'Moles of HCl = 0.10 × 25.0/1000 = 2.5 × 10⁻³; Na₂CO₃ + 2HCl, so moles of Na₂CO₃ = 1.25 × 10⁻³, and its molarity = 1.25 × 10⁻³/0.0250 = 0.050 M.', 'Concentration = 0.050 × 106 = 5.3 g/L.'], {
    shown: table(['Titration', 'Initial (cm³)', 'Final (cm³)', 'Titre (cm³)'], [['Rough', '0.0', '25.6', '25.6'], ['1', '0.0', '24.9', '24.9'], ['2', '24.9', '49.9', '25.0'], ['3', '0.5', '25.6', '25.1']], 'Each titration used 25.0 cm³ of the sodium carbonate solution.'),
  }),
  figure(T(2, 1), 'The figure shows the liquid in part of a burette. Give the reading, and say how a burette should be read.', ['The reading is 24.30 cm³, at the bottom of the meniscus.', 'The eye must be level with the bottom of the meniscus, to avoid parallax error.'], {
    shown: sketch(260, 200, 'A section of a burette marked from 24.0 at the top to 25.0 at the bottom, in tenths. The bottom of the curved liquid surface sits on the third small mark below 24.0.', [
      line([[100, 20], [100, 190]]), line([[160, 20], [160, 190]]),
      ...Array.from({ length: 11 }, (_, i) => line([[100, 30 + 15 * i], [i % 5 === 0 ? 130 : 118, 30 + 15 * i]])),
      label(94, 34, '24.0', 'end'), label(94, 109, '24.5', 'end'), label(94, 184, '25.0', 'end'),
      { t: 'path', d: 'M100 66 Q 130 84, 160 66' }, arrow([210, 75], [166, 75]), label(214, 79, 'liquid', 'start'),
    ]),
  }),
  figure(T(3, 2), 'Make a table showing, for 0.10 M H₂SO₄, its concentration in g/L, the number of H⁺ ions in 25.0 cm³ of it, and the volume of 0.10 M NaOH that neutralises 25.0 cm³ of it.', ['Concentration = 0.10 × 98 = 9.8 g/L.', 'Moles of H⁺ in 25.0 cm³ = 2 × 0.10 × 0.0250 = 5.0 × 10⁻³, which is 5.0 × 10⁻³ × 6.02 × 10²³ = 3.0 × 10²¹ ions.', 'H₂SO₄ + 2NaOH, so 5.0 × 10⁻³ mol of NaOH is needed: 5.0 × 10⁻³/0.10 = 0.050 L, or 50 cm³.'], {
    answer: table(['Quantity', 'Working', 'Value'], [['Concentration', '0.10 × 98', '9.8 g/L'], ['H⁺ ions in 25.0 cm³', '2 × 0.10 × 0.0250 × 6.02 × 10²³', '3.0 × 10²¹'], ['Volume of 0.10 M NaOH', '5.0 × 10⁻³ mol/0.10 M', '50 cm³']]),
  }),

  predict(T(2, 2), 'An air bubble in the tip of a burette holding HCl escapes during a titration of NaOH. Predict the effect on the molarity of NaOH worked out.', 'The bubble’s volume is read as acid that was added, so the titre read is too large.', 'So the molarity of NaOH worked out is too high.'),
  predict(T(2, 2), 'A student rinses the conical flask with the NaOH solution before pipetting 25.0 cm³ of it in. Predict the effect on the titre.', 'Some extra NaOH is left in the flask, so there is more than 25.0 cm³ of it.', 'The titre of acid is too large, and the NaOH seems more concentrated than it is.'),

  odd(T(2, 1), ['methyl orange', 'phenolphthalein', 'litmus', 'potassium manganate(VII)'], 'potassium manganate(VII)', 'It is a reagent that acts as its own indicator in redox titrations; the others are acid–base indicators.'),
  odd(T(2, 1), ['Na₂CO₃', 'NaOH', 'KOH', 'HCl'], 'HCl', 'It is an acid; the others are bases.'),
  odd(T(2, 2), ['anhydrous Na₂CO₃', 'oxalic acid crystals', 'NaOH pellets', 'Mohr’s salt'], 'NaOH pellets', 'They take in water and CO₂ from the air, so they can’t be weighed exactly; the others are primary standards.'),

  long(T(5, 2), '20.0 cm³ of NaOH solution is neutralised by 25.0 cm³ of 0.050 M H₂SO₄.\n(a) Write the equation. [1]\n(b) Find the molarity of the NaOH. [2]\n(c) Find its concentration in g/L. [1]\n(d) Find the number of Na⁺ ions in the 20.0 cm³. [1]', '(a) 2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O.', '(b) Moles of H₂SO₄ = 0.050 × 25.0/1000 = 1.25 × 10⁻³, so moles of NaOH = 2.5 × 10⁻³.', '(b) Molarity = 2.5 × 10⁻³/0.0200 = 0.125 M.', '(c) 0.125 × 40 = 5.0 g/L.', '(d) 2.5 × 10⁻³ × 6.02 × 10²³ = 1.5 × 10²¹.'),
  long(T(5, 3), 'Impure KOH is dissolved to make 7.0 g per litre of solution. 25.0 cm³ of it needs 20.0 cm³ of 0.10 M HCl.\n(a) Write the equation. [1]\n(b) Find the molarity of the KOH. [2]\n(c) Find the concentration of pure KOH in g/L. [1]\n(d) Find the percentage purity. [1]', '(a) KOH + HCl → KCl + H₂O.', '(b) Moles of HCl = 0.10 × 20.0/1000 = 2.0 × 10⁻³ = moles of KOH.', '(b) Molarity = 2.0 × 10⁻³/0.0250 = 0.080 M.', '(c) 0.080 × 56 = 4.48 g/L.', '(d) 4.48/7.0 × 100 = 64%.'),
  long(T(5, 1), 'Answer each part on titrating sodium carbonate with HCl.\n(a) Why is methyl orange suitable here? [1]\n(b) What colour change is seen at the end point, with the acid in the burette? [1]\n(c) Why isn’t the last drop in the pipette blown out? [1]\n(d) Why is the burette read with the eye level with the meniscus? [1]\n(e) Why is a white tile put under the flask? [1]', '(a) It changes colour in the acid range, which includes the pH at the end point of a carbonate with a strong acid.', '(b) From yellow to orange.', '(c) The pipette is made to deliver its volume with that drop left in it.', '(d) To avoid parallax error, which makes the reading too high or too low.', '(e) So that the colour change is easy to see.'),

  tell(T(2, 1), 'Distinguish between molarity and concentration in g/L.', 'Molarity is the number of moles of solute in a litre of solution, in mol/L.', 'Concentration in g/L is the mass of solute in a litre; it equals molarity × molar mass.'),
  tell(T(2, 1), 'Distinguish between a rough titre and concordant titres.', 'A rough titre is a first, quick run to find roughly where the end point is; it isn’t used in the mean.', 'Concordant titres are careful runs that agree within about 0.1 cm³; their mean is used.'),
  tell(T(2, 2), 'Distinguish between methyl orange and phenolphthalein as indicators.', 'Methyl orange is red in acid and yellow in alkali, changing in the acid range, about pH 3–4.5.', 'Phenolphthalein is colourless in acid and pink in alkali, changing in the alkaline range, about pH 8–10.'),

  match(T(4, 1), [['The molar mass of Na₂CO₃', '106 g/mol'], ['The molar mass of NaOH', '40 g/mol'], ['The molar mass of H₂SO₄', '98 g/mol'], ['The molar mass of HCl', '36.5 g/mol']]),
  match(T(4, 1), [['Methyl orange in acid', 'red'], ['Methyl orange in alkali', 'yellow'], ['Methyl orange at the end point', 'orange'], ['Phenolphthalein in alkali', 'pink']]),
  match(T(4, 2), [['Mole ratio of Na₂CO₃ to HCl', '1 : 2'], ['Mole ratio of NaOH to H₂SO₄', '2 : 1'], ['Mole ratio of KOH to HCl', '1 : 1'], ['Moles of water in one mole of washing soda', '10']]),

  reason(T(2, 1), 'Give reasons. (a) The tip of the burette must be free of air bubbles. (b) Only two or three drops of indicator are used.', '(a) A bubble that escapes is read as liquid delivered, making the titre wrong.', '(b) An indicator is itself a weak acid or base, so too much of it would use up some of the titrant.'),
  reason(T(2, 2), 'Give reasons. (a) A solution of NaOH must be standardised before use. (b) Sodium carbonate solution is made in a volumetric flask.', '(a) Solid NaOH takes in water and CO₂ from the air, so its exact mass, and so its molarity, isn’t known.', '(b) A volumetric flask holds an exact volume, so the concentration is known exactly.'),

  short(T(2, 1), 'Find the molarity of a solution made by dissolving 5.3 g of anhydrous Na₂CO₃ in water to make 500 cm³.', 'Moles = 5.3/106 = 0.050 mol.', 'Molarity = 0.050/0.500 = 0.10 M.'),
  short(T(2, 1), 'What mass of NaOH is needed to make 250 cm³ of a 0.20 M solution?', 'Moles = 0.20 × 0.250 = 0.050 mol.', 'Mass = 0.050 × 40 = 2.0 g.'),

  ar(T(1, 1), 'Methyl orange is a suitable indicator for titrating sodium carbonate against HCl.', 'Methyl orange changes colour in the acid range, near the pH at the end point.', 1, 'At the end point the solution holds CO₂ and is slightly acid, so an indicator that changes in the acid range is needed.'),
  ar(T(1, 1), 'A conical flask still wet with distilled water doesn’t change the titre.', 'Water doesn’t change the number of moles of alkali pipetted in.', 1, 'The titre depends only on the moles of alkali, not on how much it is diluted.'),
  ar(T(1, 1), 'NaOH is a primary standard.', 'NaOH takes in water and carbon dioxide from the air.', 4, 'Because of what R says, its mass can’t be weighed exactly, so it isn’t a primary standard.'),
];

export default questions;
