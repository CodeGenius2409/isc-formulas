// Written by hand: chemical equivalents and volumetric calculations, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar } = kit('chemistry', 'XI');
const V = at(1, 'c');

const questions: BankDef[] = [
  predict(V(2, 1), '100 mL of 1 M NaCl solution is diluted with water to 500 mL. Predict the new molarity, and the number of moles of NaCl present.', 'The moles of NaCl don’t change: 1 × 0.1 = 0.1 mol.', 'The molarity becomes 0.1/0.5 = 0.2 M.'),
  predict(V(2, 2), 'A solution is warmed from 20 °C to 50 °C. Predict which of its molarity and molality changes, and why.', 'The molarity falls a little, as the solution expands and its volume grows.', 'The molality stays the same, as it depends only on masses, which don’t change with temperature.'),
  predict(V(2, 2), '25 mL of 0.1 N HCl is mixed with 25 mL of 0.1 N NaOH. Predict whether the mixture is acidic, basic or neutral, and the molarity of the salt in it.', 'The two contain equal gram equivalents, so they neutralise each other exactly and the mixture is neutral.', '0.0025 mol of NaCl in 50 mL gives 0.05 M NaCl.'),

  odd(V(2, 2), ['molarity', 'normality', 'molality', 'percentage by mass-volume (w/v)'], 'molality', 'It uses the mass of the solvent, so it doesn’t change with temperature; the others use the volume of the solution.'),
  odd(V(2, 1), ['HCl', 'HNO₃', 'CH₃COOH', 'H₂SO₄'], 'H₂SO₄', 'It is dibasic, so its equivalent mass is half its molar mass; the others are monobasic.'),
  odd(V(2, 2), ['NaOH', 'KOH', 'Ca(OH)₂', 'NH₄OH'], 'Ca(OH)₂', 'Its acidity is 2, so its equivalent mass is half its molar mass; the others have acidity 1.'),

  long(V(5, 2), '4 g of NaOH is dissolved in 96 g of water, and the solution has a density of 1.04 g/mL. (Na = 23, O = 16, H = 1)\n(a) Find the percentage by mass of NaOH. [1]\n(b) Find the molality. [1]\n(c) Find the mole fraction of NaOH. [1]\n(d) Find the molarity. [2]', '(a) 4/(4 + 96) × 100 = 4%.', '(b) 4 g of NaOH is 0.1 mol, so the molality is 0.1/0.096 = 1.04 mol/kg.', '(c) 96 g of water is 5.33 mol, so x = 0.1/(0.1 + 5.33) = 0.018.', '(d) The solution’s volume is 100/1.04 = 96.2 mL.', '(d) The molarity is 0.1/0.0962 = 1.04 M.'),
  long(V(5, 2), 'Oxalic acid crystals, H₂C₂O₄·2H₂O, have a molar mass of 126 g/mol.\n(a) Find their equivalent mass as an acid. [1]\n(b) Find the mass needed to make 250 mL of a 0.1 N solution. [2]\n(c) 20 mL of this solution neutralises 25 mL of a NaOH solution. Find the normality of the NaOH. [2]', '(a) Oxalic acid is dibasic, so the equivalent mass is 126/2 = 63.', '(b) Gram equivalents needed = 0.1 × 0.25 = 0.025.', '(b) Mass = 0.025 × 63 = 1.575 g.', '(c) By N₁V₁ = N₂V₂: 0.1 × 20 = N × 25.', '(c) N = 0.08 N.'),

  tell(V(2, 1), 'Distinguish between molarity and molality.', 'Molarity is the number of moles of solute in 1 litre of solution, and changes with temperature.', 'Molality is the number of moles of solute in 1 kg of solvent, and doesn’t change with temperature.'),
  tell(V(2, 1), 'Distinguish between percentage by mass (w/w) and percentage by mass-volume (w/v).', 'w/w is the mass of solute in 100 g of solution.', 'w/v is the mass of solute in 100 mL of solution.'),
  tell(V(2, 2), 'Distinguish between the equivalent mass and the molar mass of an acid, using H₂SO₄ as an example.', 'The molar mass is the mass of one mole: 98 g for H₂SO₄.', 'The equivalent mass is the mass that gives one mole of H⁺; H₂SO₄ gives two, so its equivalent mass is 98/2 = 49 g in full neutralisation.'),

  match(V(4, 1), [['Molarity', 'mol L⁻¹'], ['Molality', 'mol kg⁻¹'], ['Normality', 'gram equivalents per litre'], ['Mole fraction', 'no unit']]),
  match(V(4, 2), [['HCl (M = 36.5)', '36.5'], ['H₂SO₄ (M = 98), fully neutralised', '49'], ['Ca(OH)₂ (M = 74)', '37'], ['Na₂CO₃ (M = 106), fully neutralised', '53']]),
  match(V(4, 2), [['A strong acid with a strong base', 'methyl orange or phenolphthalein'], ['A weak acid with a strong base', 'phenolphthalein'], ['A strong acid with a weak base', 'methyl orange'], ['A weak acid with a weak base', 'no simple indicator works well']]),

  reason(V(2, 1), 'Why is the normality of a sulphuric acid solution twice its molarity, when both its hydrogens react?', 'Each mole of H₂SO₄ gives two moles of H⁺, so it is two gram equivalents.', 'So a 1 M solution holds 2 gram equivalents per litre, and is 2 N.'),
  reason(V(2, 1), 'Why is molality preferred to molarity for exact work at different temperatures?', 'A solution’s volume changes with temperature, so its molarity changes too.', 'Molality depends only on masses, which don’t change, so it stays the same.'),
  reason(V(2, 1), 'Why is a burette rinsed with the solution it is to hold, and not just with water?', 'Water left inside would dilute the solution put in.', 'Its concentration would then be lower than the value used in the calculation, so the result would be wrong.'),

  short(V(2, 1), 'Find the molarity of a solution made by dissolving 5.85 g of NaCl in water to make 250 mL. (Na = 23, Cl = 35.5)', '5.85 g of NaCl is 5.85/58.5 = 0.1 mol.', 'Molarity = 0.1/0.25 = 0.4 M.'),
  short(V(2, 1), 'What volume of water must be added to 200 mL of 0.5 M HCl to make it 0.2 M?', 'M₁V₁ = M₂V₂: 0.5 × 200 = 0.2 × V₂, so V₂ = 500 mL.', 'So 500 − 200 = 300 mL of water must be added.'),
  short(V(2, 1), 'State the law of equivalence on which titrations are based, and write it as an equation.', 'Substances react in amounts with equal numbers of gram equivalents.', 'So at the end point N₁V₁ = N₂V₂.'),

  ar(V(1, 1), 'The molality of a solution doesn’t change when it is warmed.', 'Molality is defined using the mass of the solvent.', 1, 'Masses don’t change with temperature, so neither does molality.'),
  ar(V(1, 2), 'The equivalent mass of Na₂CO₃ is 106 g in full neutralisation.', 'Na₂CO₃ takes up two H⁺ ions in full neutralisation.', 4, 'As it takes up two H⁺ ions, its equivalent mass is 106/2 = 53 g.'),
  ar(V(1, 2), 'A 1 N solution of HCl is also 1 M.', 'HCl is a strong acid.', 2, 'Both are true, but they are equal because HCl is monobasic, not because it is strong.'),
];

export default questions;
