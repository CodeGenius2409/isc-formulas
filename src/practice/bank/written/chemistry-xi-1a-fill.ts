// Written by hand: matter, laws of chemical combination and measurement, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar } = kit('chemistry', 'XI');
const M = at(1, 'a');

const questions: BankDef[] = [
  predict(M(2, 1), 'Silver nitrate solution and sodium chloride solution are mixed in a stoppered flask on a balance. A white precipitate forms. Predict what happens to the reading, and name the law.', 'The reading stays the same.', 'Mass is neither created nor destroyed in a chemical reaction: the law of conservation of mass.'),
  predict(M(2, 2), 'In N₂O, 14 g of nitrogen is combined with 8 g of oxygen; in NO, 14 g of nitrogen is combined with 16 g of oxygen. Predict the ratio of the masses of oxygen, and the law it shows.', 'The masses of oxygen joined to the same mass of nitrogen are 8 : 16, a simple ratio of 1 : 2.', 'This is the law of multiple proportions.'),
  predict(M(2, 2), 'A student works out 2.5 × 3.42 on a calculator, which shows 8.55. Predict how the answer should be written, and why.', 'As 8.6.', 'The answer can have no more significant figures than the least precise value, 2.5, which has two.'),

  odd(M(2, 1), ['metre', 'kelvin', 'mole', 'litre'], 'litre', 'It isn’t an SI base unit; the others are.'),
  odd(M(2, 1), ['air', 'brass', 'sea water', 'distilled water'], 'distilled water', 'It is a pure substance, a compound; the others are mixtures.'),
  odd(M(2, 2), ['CO and CO₂', 'SO₂ and SO₃', 'H₂O and H₂O₂', 'NaCl and KCl'], 'NaCl and KCl', 'They aren’t two compounds of the same two elements, so they can’t show the law of multiple proportions; the others can.'),

  long(M(5, 2), 'Carbon forms two oxides. Oxide A has 42.9% carbon by mass, and oxide B has 27.3%.\n(a) Find the mass of oxygen joined to 1 g of carbon in each. [2]\n(b) Find the ratio of these masses. [1]\n(c) Name and state the law the data show. [1]\n(d) Suggest formulae for A and B. [1]', '(a) A: 57.1/42.9 = 1.33 g of oxygen per gram of carbon.', '(a) B: 72.7/27.3 = 2.66 g of oxygen per gram of carbon.', '(b) 1.33 : 2.66 = 1 : 2.', '(c) The law of multiple proportions: when two elements form more than one compound, the masses of one that join a fixed mass of the other are in a simple whole-number ratio.', '(d) A is CO and B is CO₂.'),
  long(M(5, 1), 'Answer each part on Dalton’s atomic theory.\n(a) Give three of its main points. [3]\n(b) Give two of its points that are no longer held, and why. [2]', '(a) All matter is made of tiny particles called atoms.', '(a) Atoms of the same element are alike in mass and properties; those of different elements differ.', '(a) Atoms join in simple whole-number ratios to form compounds, and are rearranged, not made or destroyed, in reactions.', '(b) Atoms can’t be divided: they are now known to be made of electrons, protons and neutrons.', '(b) All atoms of an element have the same mass: isotopes of one element have different masses.'),
  long(M(5, 1), 'Use conversion factors to convert each.\n(a) 2.5 L into m³. [1]\n(b) 1 atm, which is 101 325 Pa, into bar, where 1 bar = 10⁵ Pa. [1]\n(c) 36 km/h into m/s. [1]\n(d) 3.2 mg into kg, and 5 ns into s. [2]', '(a) 2.5 L × (10⁻³ m³/1 L) = 2.5 × 10⁻³ m³.', '(b) 101 325 Pa × (1 bar/10⁵ Pa) = 1.01325 bar.', '(c) 36 km/h × (1000 m/1 km) × (1 h/3600 s) = 10 m/s.', '(d) 3.2 mg × (10⁻³ g/1 mg) × (10⁻³ kg/1 g) = 3.2 × 10⁻⁶ kg.', '(d) 5 ns × (10⁻⁹ s/1 ns) = 5 × 10⁻⁹ s.'),

  tell(M(2, 1), 'Distinguish between precision and accuracy, with an example.', 'Precision is how close repeated measurements are to each other.', 'Accuracy is how close a measurement is to the true value: readings of 2.10, 2.11 and 2.10 g are precise, but not accurate if the true mass is 2.50 g.'),
  tell(M(2, 1), 'Distinguish between an element and a compound, with one example of each.', 'An element is made of only one kind of atom and can’t be broken into simpler substances by chemical means: copper.', 'A compound is made of two or more elements joined in a fixed ratio by mass, and can be broken down chemically: water.'),

  match(M(4, 1), [['The law of conservation of mass', 'Lavoisier'], ['The law of definite proportions', 'Proust'], ['The law of multiple proportions', 'Dalton'], ['The law of gaseous volumes', 'Gay-Lussac']]),
  match(M(4, 1), [['The SI unit of amount of substance', 'mol'], ['The SI unit of thermodynamic temperature', 'K'], ['The SI unit of electric current', 'A'], ['The SI unit of mass', 'kg']]),
  match(M(4, 1), [['The prefix milli', '10⁻³'], ['The prefix micro', '10⁻⁶'], ['The prefix nano', '10⁻⁹'], ['The prefix kilo', '10³']]),

  reason(M(2, 2), 'Give reasons. (a) A mass written as 2.50 g doesn’t mean the same as 2.5 g. (b) The law of conservation of mass holds when magnesium burns in air, though the ash weighs more than the metal.', '(a) 2.50 g has three significant figures, showing it was measured to the nearest 0.01 g; 2.5 g only to the nearest 0.1 g.', '(b) The extra mass is oxygen taken from the air; the total mass of magnesium and oxygen equals the mass of the oxide.'),
  reason(M(2, 1), 'Give two reasons why chemistry is important in daily life.', 'It gives medicines that cure diseases, and fertilisers and pesticides that help grow more food.', 'It gives new materials, such as plastics, alloys and fuels, used in homes and industry.'),

  short(M(2, 1), 'Write 0.0004560 in scientific notation, and give its number of significant figures.', '4.560 × 10⁻⁴.', 'It has four significant figures: 4, 5, 6 and the final 0.'),
  short(M(2, 1), 'State the law of definite proportions and the law of conservation of mass.', 'Definite proportions: a given compound always has the same elements in the same ratio by mass, whatever its source.', 'Conservation of mass: in a chemical reaction, the total mass of the products equals the total mass of the reactants.'),

  ar(M(1, 1), '2.0 g of hydrogen and 16.0 g of oxygen react completely to give 18.0 g of water.', 'Matter is neither created nor destroyed in a chemical reaction.', 1, 'The mass of the water equals the total mass of the hydrogen and oxygen.'),
  ar(M(1, 1), 'The number 0.0050 has four significant figures.', 'Zeros before the first non-zero digit aren’t significant.', 4, '0.0050 has two significant figures, 5 and the final 0.'),
];

export default questions;
