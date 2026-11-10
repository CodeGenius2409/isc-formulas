// Written by hand: potassium dichromate and permanganate, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const K = at(4, 'b');

const questions: BankDef[] = [
  figure(K(2, 2), 'Draw the structure of the permanganate ion, and give the oxidation state of manganese in it.', ['A manganese atom at the centre of a tetrahedron of four oxygen atoms, with the charge spread over them.', 'Manganese is +7.'], {
    answer: sketch(260, 170, 'A manganese atom in the middle, bonded to four oxygen atoms at the corners of a tetrahedron: one above, two below to the sides, and one towards the viewer, drawn dashed. Three bonds are double and one oxygen carries the negative charge, with the whole ion in brackets marked minus.', [
      label(130, 92, 'Mn'),
      line([[130, 78], [130, 44]]), line([[136, 78], [136, 44]]), label(133, 36, 'O'),
      line([[118, 96], [74, 124]]), line([[122, 101], [78, 129]]), label(66, 138, 'O'),
      line([[146, 98], [188, 126]]), label(200, 138, 'O⁻'),
      line([[133, 100], [133, 146]], { dash: 1 }), label(133, 162, 'O'),
      line([[40, 20], [32, 20], [32, 160], [40, 160]]), line([[220, 20], [228, 20], [228, 160], [220, 160]]), label(236, 22, '−', 'start'),
    ]),
  }),
  figure(K(3, 2), 'The table gives the burette readings when 25.00 cm³ of an iron(II) solution was titrated with 0.020 M acidified KMnO₄. Find the volume to use, and the concentration of iron(II).', ['The rough titre is left out; the two accurate titres agree at 20.00 cm³.', 'MnO₄⁻ reacts with 5Fe²⁺, and 0.020 × 20.00/1000 = 4.0 × 10⁻⁴ mol of MnO₄⁻, so 2.0 × 10⁻³ mol of Fe²⁺.', 'Concentration = 2.0 × 10⁻³ / 0.02500 = 0.080 mol/dm³.'], {
    shown: table(['Titration', 'Initial reading (cm³)', 'Final reading (cm³)'], [['Rough', '0.00', '20.60'], ['1', '0.50', '20.50'], ['2', '1.20', '21.20']]),
  }),

  predict(K(2, 2), 'Acidified potassium dichromate is added to sodium sulphite solution. Predict the colour change, and write the ionic equation.', 'Orange turns green, as Cr₂O₇²⁻ is reduced to Cr³⁺ and sulphite is oxidised to sulphate.', 'Cr₂O₇²⁻ + 3SO₃²⁻ + 8H⁺ → 2Cr³⁺ + 3SO₄²⁻ + 4H₂O.'),
  predict(K(2, 2), 'Potassium permanganate is heated to about 513 K. Predict the products, and write the equation.', 'Potassium manganate, manganese dioxide and oxygen.', '2KMnO₄ → K₂MnO₄ + MnO₂ + O₂.'),
  predict(K(2, 3), 'A green solution of potassium manganate is acidified. Predict what is seen, and write the ionic equation.', 'The green turns purple, and a brown solid of MnO₂ settles, as manganate disproportionates in acid.', '3MnO₄²⁻ + 4H⁺ → 2MnO₄⁻ + MnO₂ + 2H₂O.'),

  odd(K(2, 1), ['K₂Cr₂O₇', 'KMnO₄', 'K₂MnO₄', 'K₂CrO₄'], 'KMnO₄', 'Its metal is in the +7 state; in the other three it is +6.'),
  odd(K(2, 2), ['chromite ore', 'sodium chromate', 'sodium dichromate', 'potassium manganate'], 'potassium manganate', 'It is a step in making KMnO₄; the others are steps in making K₂Cr₂O₇.'),
  odd(K(2, 3), ['MnO₄⁻', 'Cr₂O₇²⁻', 'CrO₄²⁻', 'MnO₄²⁻'], 'MnO₄²⁻', 'Its manganese, +6, has one d electron, so it is paramagnetic; the other three are d⁰.'),

  long(K(5, 2), 'Answer each part on potassium dichromate as an oxidising agent.\n(a) Write its half-equation in acid, and give the change in the oxidation state of chromium. [2]\n(b) Write the ionic equation for its reaction with tin(II) ions in acid. [1]\n(c) Write the ionic equation for its reaction with sulphur dioxide in acid. [1]\n(d) What happens when solid K₂Cr₂O₇ is heated strongly? [1]', '(a) Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O.', '(a) Chromium goes from +6 to +3.', '(b) Cr₂O₇²⁻ + 14H⁺ + 3Sn²⁺ → 2Cr³⁺ + 3Sn⁴⁺ + 7H₂O.', '(c) Cr₂O₇²⁻ + 2H⁺ + 3SO₂ → 2Cr³⁺ + 3SO₄²⁻ + H₂O.', '(d) It gives potassium chromate, chromium(III) oxide and oxygen: 4K₂Cr₂O₇ → 4K₂CrO₄ + 2Cr₂O₃ + 3O₂.'),
  long(K(5, 2), 'Answer each part on acidified potassium permanganate.\n(a) Write its half-equation. [1]\n(b) Write the ionic equations for its reactions with oxalate ions, hydrogen sulphide and nitrite ions. [3]\n(c) What is its equivalent mass in acid, given Mr = 158? [1]', '(a) MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O.', '(b) 2MnO₄⁻ + 16H⁺ + 5C₂O₄²⁻ → 2Mn²⁺ + 10CO₂ + 8H₂O.', '(b) 2MnO₄⁻ + 6H⁺ + 5H₂S → 2Mn²⁺ + 5S + 8H₂O.', '(b) 2MnO₄⁻ + 6H⁺ + 5NO₂⁻ → 2Mn²⁺ + 5NO₃⁻ + 3H₂O.', '(c) It gains five electrons, so 158/5 = 31.6.'),
  long(K(5, 3), 'Answer each part on potassium permanganate in neutral or alkaline solution.\n(a) Write its half-equation in neutral solution. [1]\n(b) Write the equations for its reactions with thiosulphate and with Mn²⁺ in neutral solution. [2]\n(c) What does cold, dilute alkaline KMnO₄ show when an alkene is added? [1]\n(d) Why is its equivalent mass different in neutral and in acid solution? [1]', '(a) MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻.', '(b) 8MnO₄⁻ + 3S₂O₃²⁻ + H₂O → 8MnO₂ + 6SO₄²⁻ + 2OH⁻.', '(b) 2MnO₄⁻ + 3Mn²⁺ + 2H₂O → 5MnO₂ + 4H⁺.', '(c) Its purple colour goes, as the alkene is oxidised to a diol: Baeyer’s test for unsaturation.', '(d) It gains three electrons in neutral solution but five in acid, so its equivalent mass is M/3 in one and M/5 in the other.'),

  tell(K(2, 2), 'Distinguish between potassium permanganate and potassium manganate.', 'KMnO₄ is purple, with manganese +7; K₂MnO₄ is green, with manganese +6.', 'KMnO₄ is diamagnetic, with no d electrons; K₂MnO₄ is paramagnetic, with one.'),
  tell(K(2, 2), 'Distinguish between titrating iron(II) with KMnO₄ and with K₂Cr₂O₇.', 'KMnO₄ is its own indicator: the first lasting pink shows the end point.', 'K₂Cr₂O₇ needs an indicator such as diphenylamine, as its orange-to-green change is hard to see; but it can be weighed out as a primary standard, which KMnO₄ can’t.'),
  tell(K(2, 3), 'Distinguish between the oxidation of iodide ions by permanganate in acid and in neutral or weakly alkaline solution.', 'In acid, iodide is oxidised to iodine, and permanganate is reduced to Mn²⁺.', 'In neutral or weakly alkaline solution, iodide is oxidised to iodate, IO₃⁻, and a brown solid of MnO₂ forms.'),

  match(K(4, 1), [['Cr₂O₇²⁻', 'orange'], ['CrO₄²⁻', 'yellow'], ['MnO₄⁻', 'purple'], ['MnO₄²⁻', 'green']]),
  match(K(4, 2), [['Fe²⁺', 'Fe³⁺'], ['C₂O₄²⁻', 'CO₂'], ['I⁻', 'I₂'], ['NO₂⁻', 'NO₃⁻']]),
  match(K(4, 2), [['Chromite fused with Na₂CO₃ in air', 'sodium chromate'], ['Sodium chromate with sulphuric acid', 'sodium dichromate'], ['Sodium dichromate with KCl', 'potassium dichromate'], ['MnO₂ fused with KOH in air', 'potassium manganate']]),

  ar(K(1, 2), 'Titrating iron(II) with K₂Cr₂O₇ needs an indicator such as diphenylamine.', 'The green of the Cr³⁺ formed hides the change of colour at the end point.', 1, 'Orange to green is not a sharp change, so an indicator is used.'),
  ar(K(1, 1), 'KMnO₄ is used to disinfect water.', 'KMnO₄ is purple.', 2, 'Both are true, but it disinfects because it is a strong oxidising agent.'),
  ar(K(1, 2), 'Manganese shows its highest oxidation state, +7, in KMnO₄.', 'Manganese has seven electrons in its 3d subshell.', 3, 'Manganese is 3d⁵4s², so it can use all seven of its 3d and 4s electrons.'),
];

export default questions;
