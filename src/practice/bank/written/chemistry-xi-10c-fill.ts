// Written by hand: preparing inorganic compounds, of each type the subtopic lacked, up to three. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// Solubility of copper(II) sulphate, as g of CuSO₄ per 100 g of water: 14 at 0 °C, 21 at 20 °C, 29 at 40 °C, 40 at 60 °C, 55 at 80 °C, 75 at 100 °C, the usual data-book values.
// Molar masses: FeSO₄·7H₂O 278, (NH₄)₂SO₄ 132, Mohr’s salt 392, K₂SO₄ 174, Al₂(SO₄)₃·18H₂O 666, potash alum 948, CuO 79.5, CuSO₄·5H₂O 249.5.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XI');
const P = at(10, 'c');

const questions: BankDef[] = [
  figure(P(3, 1), 'Make a table of the steps in preparing crystals of potash alum, with the reason for each.', ['Dissolve equimolar amounts of K₂SO₄ and Al₂(SO₄)₃·18H₂O in the least hot water, with a few drops of dilute H₂SO₄ to stop hydrolysis, and filter hot to remove insoluble matter.', 'Heat the filtrate to the crystallisation point, then cool it slowly for large, pure crystals.', 'Filter off the crystals, wash them with a little cold water, and dry them between filter papers.'], {
    answer: table(['Step', 'Reason'], [['Dissolve both salts in the least hot water, with a little dilute H₂SO₄', 'a saturated solution; the acid stops hydrolysis'], ['Filter while hot', 'removes insoluble impurities'], ['Concentrate to the crystallisation point, then cool slowly', 'large, pure crystals form'], ['Filter, wash with a little cold water, dry between filter papers', 'removes the mother liquor without losing crystals']]),
  }),
  figure(P(3, 2), 'The graph shows the solubility of copper(II) sulphate in water against temperature. Explain why crystals form when a hot saturated solution is cooled, and estimate the mass of CuSO₄ that leaves 100 g of water when a solution saturated at 80 °C is cooled to 20 °C.', ['The solubility rises steeply with temperature, so a solution saturated when hot holds more than it can when cold.', 'At 80 °C, 100 g of water holds about 55 g; at 20 °C, about 21 g.', 'So about 55 − 21 = 34 g of CuSO₄ comes out, as blue crystals of CuSO₄·5H₂O (ignoring the water the crystals take with them).'], {
    shown: graph('temperature (°C)', 'solubility (g per 100 g water)', [{ points: [[0, 14], [20, 21], [40, 29], [60, 40], [80, 55], [100, 75]] }], { x: [[20, '20'], [40, '40'], [60, '60'], [80, '80'], [100, '100']], y: [[20, '20'], [40, '40'], [60, '60']] }),
  }),
  figure(P(2, 1), 'Draw how a hot solution is filtered in preparing crystals, labelling the parts.', ['A funnel with a folded filter paper stands in the mouth of a beaker or conical flask, which collects the filtrate.', 'The hot solution is poured in down a glass rod; insoluble impurities stay on the paper.'], {
    answer: sketch(310, 220, 'A glass rod leads the hot solution into a funnel lined with filter paper. The funnel’s stem goes into a beaker below, which collects the clear filtrate. Insoluble impurities are left on the paper.', [
      { t: 'path', d: 'M80 40 L200 40 L150 110 L150 160 L130 160 L130 110 Z' }, line([[96, 46], [140, 104], [184, 46]], { dash: 1 }),
      line([[60, 10], [120, 60]]), label(76, 14, 'glass rod', 'start'),
      { t: 'path', d: 'M90 130 L90 210 L190 210 L190 130' }, line([[92, 190], [188, 190]], { dash: 1 }),
      label(206, 60, 'filter paper', 'start'), arrow([204, 62], [176, 64]), label(196, 190, 'filtrate', 'start'),
    ]),
  }),

  predict(P(2, 1), 'Predict the appearance of crystals of potash alum and of Mohr’s salt.', 'Potash alum forms colourless, octahedral crystals.', 'Mohr’s salt forms pale green crystals.'),
  predict(P(2, 1), 'A solution of copper(II) sulphate is heated strongly until it is dry. Predict what is left.', 'A white powder instead of blue crystals.', 'Strong heating drives off the water of crystallisation, leaving anhydrous CuSO₄.'),

  odd(P(2, 2), ['potash alum', 'Mohr’s salt', 'carnallite', 'potassium ferrocyanide'], 'potassium ferrocyanide', 'It is a coordination compound, keeping its complex ion in water; the others are double salts.'),
  odd(P(2, 1), ['CuSO₄·5H₂O', 'FeSO₄·7H₂O', 'potash alum', 'NaCl'], 'NaCl', 'It has no water of crystallisation; the others do.'),
  odd(P(2, 1), ['filtering while hot', 'adding a little dilute H₂SO₄', 'cooling slowly', 'boiling to dryness'], 'boiling to dryness', 'It is a mistake, which spoils or decomposes the crystals; the others are correct steps.'),

  long(P(5, 2), 'Mohr’s salt is made from 3.50 g of FeSO₄·7H₂O.\n(a) Find the mass of (NH₄)₂SO₄ needed. [1]\n(b) Why is a little dilute H₂SO₄ added? [1]\n(c) Outline the rest of the preparation. [2]\n(d) Find the greatest mass of Mohr’s salt, FeSO₄·(NH₄)₂SO₄·6H₂O, that can be made. [1]', '(a) 3.50/278 = 0.0126 mol, and the same moles of (NH₄)₂SO₄: 0.0126 × 132 = 1.66 g.', '(b) To stop Fe²⁺ from being hydrolysed, and to slow its oxidation.', '(c) Dissolve both in the least warm water, filter, and heat gently to the crystallisation point, without boiling long.', '(c) Cool slowly, filter off the pale green crystals, wash with a little alcohol or cold water, and dry between filter papers.', '(d) 0.0126 × 392 = 4.94 g.'),
  long(P(5, 2), 'Potash alum is K₂SO₄·Al₂(SO₄)₃·24H₂O.\n(a) Why is it called a double salt? [1]\n(b) What mass of K₂SO₄ is needed with 6.66 g of Al₂(SO₄)₃·18H₂O? [1]\n(c) Find the greatest mass of alum that can be made. [1]\n(d) Why is the solution cooled slowly, and what is seen? [2]', '(a) It is made of two simple salts in a fixed ratio, and gives the ions of both in water.', '(b) 6.66/666 = 0.0100 mol, so 0.0100 mol of K₂SO₄: 1.74 g.', '(c) 0.0100 × 948 = 9.48 g.', '(d) Slow cooling gives larger, purer crystals, as the ions have time to fit into the lattice.', '(d) Colourless, octahedral crystals form.'),
  long(P(5, 2), 'Crystals of copper(II) sulphate are made from 4.0 g of copper(II) oxide and dilute sulphuric acid.\n(a) Write the equation. [1]\n(b) Why is the oxide added until some is left over? [1]\n(c) Find the greatest mass of CuSO₄·5H₂O that can be made. [2]\n(d) Why isn’t the solution heated to dryness? [1]', '(a) CuO + H₂SO₄ → CuSO₄ + H₂O.', '(b) So that all the acid is used up, and the excess oxide is simply filtered off.', '(c) 4.0/79.5 = 0.050 mol of CuO gives 0.050 mol of crystals.', '(c) 0.050 × 249.5 = 12.6 g.', '(d) It would drive off the water of crystallisation, giving a white powder, not blue crystals.'),

  tell(P(2, 1), 'Distinguish between crystallisation and evaporation to dryness.', 'In crystallisation, a hot saturated solution is cooled, so that pure crystals form, and impurities stay in the solution.', 'In evaporation to dryness, all the water is boiled off, leaving the solid with any impurities, and often without its water of crystallisation.'),
  tell(P(2, 1), 'Distinguish between hydrated and anhydrous copper(II) sulphate.', 'Hydrated copper(II) sulphate, CuSO₄·5H₂O, is blue and crystalline.', 'Anhydrous copper(II) sulphate, CuSO₄, is a white powder; it turns blue again with water.'),

  match(P(4, 1), [['Mohr’s salt', 'FeSO₄·(NH₄)₂SO₄·6H₂O'], ['Potash alum', 'K₂SO₄·Al₂(SO₄)₃·24H₂O'], ['Blue vitriol', 'CuSO₄·5H₂O'], ['Green vitriol', 'FeSO₄·7H₂O']]),
  match(P(4, 1), [['Mohr’s salt crystals', 'pale green'], ['Potash alum crystals', 'colourless octahedra'], ['Copper(II) sulphate crystals', 'blue'], ['Anhydrous copper(II) sulphate', 'white powder']]),
  match(P(4, 1), [['Adding a little dilute H₂SO₄ to FeSO₄ solution', 'stops hydrolysis'], ['Filtering the hot solution', 'removes insoluble impurities'], ['Cooling slowly', 'gives large crystals'], ['Washing with a little alcohol', 'removes the mother liquor and dries quickly']]),

  ar(P(1, 1), 'A solution of Mohr’s salt gives the tests for Fe²⁺, NH₄⁺ and SO₄²⁻.', 'A double salt splits completely into its simple ions in water.', 1, 'Mohr’s salt is a double salt, so all three ions are free in its solution.'),
];

export default questions;
