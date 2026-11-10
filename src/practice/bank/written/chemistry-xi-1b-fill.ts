// Written by hand: the mole concept and stoichiometry, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, tell, match, reason, short, ar, derive } = kit('chemistry', 'XI');
const M = at(1, 'b');

const questions: BankDef[] = [
  predict(M(2, 2), 'Predict which holds more atoms, 1 g of hydrogen gas or 1 g of oxygen gas, and by how many times.', '1 g of H₂ is 0.5 mol of molecules, so 1 mol of atoms; 1 g of O₂ is 1/32 mol of molecules, so 1/16 mol of atoms.', 'The hydrogen holds 16 times as many atoms.'),
  predict(M(2, 2), '2 L of hydrogen and 2 L of oxygen, at the same temperature and pressure, are exploded to make steam: 2H₂ + O₂ → 2H₂O. Predict which gas is left over, and the volumes of steam and of the gas left.', '2 L of hydrogen needs only 1 L of oxygen, so hydrogen is the limiting reagent and 1 L of oxygen is left.', '2 L of steam forms, measured at the same temperature and pressure.'),
  predict(M(2, 3), 'Chlorine has isotopes of mass 35 and 37, and its average atomic mass is 35.5. Predict which isotope is more common, and find its share.', 'Chlorine-35, as the average is much nearer 35.', 'With a fraction x of chlorine-35: 35x + 37(1 − x) = 35.5, so x = 0.75, or 75%.'),

  odd(M(2, 1), ['22 g of CO₂', '9 g of H₂O', '8 g of O₂', '14 g of N₂'], '8 g of O₂', 'It is 0.25 mol; each of the others is 0.5 mol.'),
  odd(M(2, 1), ['C₂H₂', 'C₆H₆', 'C₂H₄', 'C₈H₈'], 'C₂H₄', 'Its empirical formula is CH₂; the others all have the empirical formula CH.'),
  odd(M(2, 1), ['6.022 × 10²³ carbon atoms', '12 g of carbon-12', '1 mol of carbon atoms', '6 g of carbon-12'], '6 g of carbon-12', 'It is half a mole; the others are each one mole of carbon atoms.'),

  tell(M(2, 1), 'Distinguish between the empirical formula and the molecular formula of a compound, with glucose as an example.', 'The empirical formula gives the simplest whole-number ratio of atoms: CH₂O for glucose.', 'The molecular formula gives the actual number of each atom in a molecule: C₆H₁₂O₆.'),
  tell(M(2, 2), 'Distinguish between the mass of one atom of an element and its molar mass.', 'The mass of one atom is tiny, given in unified atomic mass units: one carbon-12 atom is 12 u.', 'The molar mass is the mass of a mole of atoms, in grams: 12 g/mol for carbon-12.'),
  tell(M(2, 1), 'Distinguish between the limiting reagent and the reagent in excess.', 'The limiting reagent is used up first, and decides how much product forms.', 'The reagent in excess is left over when the reaction stops.'),

  match(M(4, 1), [['1 mol of H₂O', '18 g'], ['1 mol of CO₂', '44 g'], ['1 mol of NaCl', '58.5 g'], ['1 mol of O₂', '32 g']]),
  match(M(4, 1), [['44.8 L of a gas at 273 K and 1 atm', '2 mol'], ['11.2 L of a gas at 273 K and 1 atm', '0.5 mol'], ['5.6 L of a gas at 273 K and 1 atm', '0.25 mol'], ['2.24 L of a gas at 273 K and 1 atm', '0.1 mol']]),
  match(M(4, 2), [['Carbon in CO₂', '27.3%'], ['Hydrogen in H₂O', '11.1%'], ['Oxygen in H₂O', '88.9%'], ['Carbon in CH₄', '75%']]),

  reason(M(2, 1), 'Why is the atomic mass of chlorine 35.5, not a whole number?', 'Chlorine is a mixture of isotopes, of mass 35 and 37.', 'Its atomic mass is their average, weighted by how common each is.'),
  reason(M(2, 2), 'Why can volumes be used in place of moles for gases that react at the same temperature and pressure?', 'By Avogadro’s law, equal volumes of gases at the same temperature and pressure hold equal numbers of molecules.', 'So volumes are in the same ratio as moles, the ratio given by the equation.'),
  reason(M(2, 1), 'Why is a molecular formula always a whole-number multiple of the empirical formula?', 'The empirical formula gives the simplest ratio of atoms, and a molecule holds whole atoms.', 'So the molecule must contain that ratio a whole number of times.'),

  short(M(2, 1), 'Find the number of atoms in 4.6 g of sodium. (Na = 23)', '4.6/23 = 0.2 mol.', '0.2 × 6.022 × 10²³ = 1.20 × 10²³ atoms.'),
  short(M(2, 1), 'Find the percentage of nitrogen in ammonia, NH₃. (N = 14, H = 1)', 'The molar mass of NH₃ is 17 g/mol, of which 14 g is nitrogen.', '14/17 × 100 = 82.4%.'),
  short(M(2, 1), 'What mass of carbon dioxide forms when 6 g of carbon burns completely? (C = 12, O = 16)', 'C + O₂ → CO₂, and 6 g of carbon is 0.5 mol.', 'It gives 0.5 mol of CO₂, which is 0.5 × 44 = 22 g.'),

  ar(M(1, 1), '1 mol of O₂ and 1 mol of N₂ contain the same number of molecules.', 'A mole of any substance contains 6.022 × 10²³ of its particles.', 1, 'So both contain 6.022 × 10²³ molecules.'),
  ar(M(1, 1), 'The empirical formula of glucose is C₆H₁₂O₆.', 'An empirical formula gives the simplest whole-number ratio of atoms.', 4, 'The simplest ratio is 1 : 2 : 1, so the empirical formula is CH₂O.'),
  ar(M(1, 1), '2 g of H₂ and 32 g of O₂ contain the same number of molecules.', 'Hydrogen is the lightest element.', 2, 'Both are true, but the numbers are equal because each mass is one mole.'),

  derive(M(3, 1), 'Show that a compound’s molecular formula is n times its empirical formula, where n is its molar mass divided by its empirical formula mass.', ['The molecular formula contains the empirical formula’s ratio of atoms a whole number of times, n.', 1], ['So the molar mass is n times the mass of the empirical formula.', 1], ['Hence n = molar mass/empirical formula mass, and the molecular formula is (empirical formula)ₙ.', 1]),
  derive(M(3, 1), 'Show that the mass of one atom of an element is its molar mass divided by the Avogadro constant, and find the mass of one carbon-12 atom.', ['One mole of the element has a mass equal to its molar mass, M grams.', 1], ['One mole holds 6.022 × 10²³ atoms, the Avogadro constant, so one atom has a mass of M/(6.022 × 10²³) grams.', 1], ['For carbon-12: 12/(6.022 × 10²³) = 1.993 × 10⁻²³ g.', 1]),
  derive(M(3, 2), 'Show that, for gases at the same temperature and pressure, their volumes in a reaction are in the same ratio as their moles in the balanced equation.', ['At a given temperature and pressure, one mole of any gas takes up the same volume, Vₘ.', 1], ['So a gas of n moles has a volume V = nVₘ.', 1], ['For two gases, V₁/V₂ = n₁Vₘ/n₂Vₘ = n₁/n₂, the ratio of their moles.', 1]),
];

export default questions;
