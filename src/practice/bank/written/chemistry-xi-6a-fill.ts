// Written by hand: chemical equilibrium, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The concentration graph is [H₂] = 1 − 0.8(1 − e^(−t)) and [HI] = 1.6(1 − e^(−t)), in mol/L, for H₂ + I₂ ⇌ 2HI from 1 mol/L each of H₂ and I₂.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, plot, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('chemistry', 'XI');
const E = at(6, 'a');

const questions: BankDef[] = [
  figure(E(3, 2), 'The graph shows how the concentrations of H₂ and HI change with time when H₂ and I₂ are heated in a closed flask. Say when equilibrium is reached, and why the HI line rises twice as fast as the H₂ line falls. Is the reaction still going on at the end?', ['Equilibrium is reached when both lines become flat, from about 4 minutes, as the concentrations stop changing.', 'The equation H₂ + I₂ ⇌ 2HI makes 2 mol of HI for each mole of H₂ used.', 'Yes: the equilibrium is dynamic; the forward and backward reactions go on at equal rates, so there is no overall change.'], {
    shown: graph('time (min)', 'concentration (mol/L)', [{ label: 'H₂', points: plot((t) => 1 - 0.8 * (1 - Math.exp(-t)), 0, 6, 30) }, { label: 'HI', points: plot((t) => 1.6 * (1 - Math.exp(-t)), 0, 6, 30) }], { x: [[2, '2'], [4, '4'], [6, '6']], y: [[0.2, '0.2'], [1, '1.0'], [1.6, '1.6']] }),
  }),
  figure(E(2, 1), 'Sketch, on the same axes, how the rates of the forward and backward reactions change with time from the start of a reversible reaction, and mark where equilibrium is reached.', ['The forward rate starts high and falls as the reactants are used up; the backward rate starts at zero and rises as products form.', 'Equilibrium is reached where the two rates become equal, after which both stay constant.'], {
    answer: sketch(340, 220, 'Axes of rate against time. The forward rate starts high and curves down; the backward rate, dashed, starts at zero and curves up. They meet at a time marked equilibrium, and run on together as one flat line.', [
      arrow([50, 190], [330, 190]), arrow([50, 190], [50, 14]), label(326, 208, 'time', 'end'), label(56, 18, 'rate', 'start'),
      { t: 'path', d: 'M50 30 C 110 100, 150 116, 200 116 L 320 116' }, { t: 'path', d: 'M50 190 C 110 140, 150 118, 200 116', dash: 1 },
      label(84, 52, 'forward', 'start'), label(94, 176, 'backward', 'start'),
      line([[200, 116], [200, 190]], { dash: 1 }), label(204, 206, 'equilibrium'),
    ]),
  }),
  figure(E(3, 3), '1.00 mol of H₂ and 1.00 mol of I₂ are heated in a 1 L flask until equilibrium, as in the table. Complete the table, and find Kc for H₂ + I₂ ⇌ 2HI.', ['1.56 mol of HI forms from 0.78 mol each of H₂ and I₂.', 'At equilibrium, [H₂] = [I₂] = 1.00 − 0.78 = 0.22 mol/L, and [HI] = 1.56 mol/L.', 'Kc = [HI]²/([H₂][I₂]) = 1.56²/0.22² = 50.'], {
    shown: table(['', 'H₂', 'I₂', 'HI'], [['At the start (mol/L)', '1.00', '1.00', '0'], ['Change (mol/L)', '?', '?', '+1.56'], ['At equilibrium (mol/L)', '?', '?', '1.56']]),
  }),

  predict(E(2, 1), 'N₂O₄(g) ⇌ 2NO₂(g) is endothermic in the forward direction. N₂O₄ is colourless and NO₂ is brown. Predict what is seen when a sealed tube of the mixture is heated.', 'The brown colour gets darker.', 'Heating favours the endothermic, forward reaction, so more brown NO₂ forms.'),
  predict(E(2, 1), 'Fe³⁺(aq) + SCN⁻(aq) ⇌ [Fe(SCN)]²⁺(aq) gives a blood-red colour. Predict what is seen when more potassium thiocyanate is added.', 'The red colour deepens.', 'Adding SCN⁻ shifts the equilibrium forward, by Le Chatelier’s principle, making more of the red ion.'),
  predict(E(2, 2), 'CaCO₃(s) ⇌ CaO(s) + CO₂(g) is at equilibrium in a closed vessel. Predict the effect of adding more solid CaCO₃.', 'There is no change in the equilibrium.', 'The concentration of a pure solid is constant, so Kc = [CO₂], and adding solid doesn’t change it.'),

  odd(E(2, 1), ['N₂ + 3H₂ ⇌ 2NH₃', 'PCl₅ ⇌ PCl₃ + Cl₂', 'H₂ + I₂ ⇌ 2HI', '2SO₂ + O₂ ⇌ 2SO₃'], 'H₂ + I₂ ⇌ 2HI', 'It has the same number of moles of gas on both sides, so pressure doesn’t shift it; the others are shifted by pressure.'),
  odd(E(2, 1), ['ice ⇌ water at 0 °C', 'a saturated solution with some undissolved solid', 'water ⇌ water vapour in a closed flask', 'N₂ + 3H₂ ⇌ 2NH₃'], 'N₂ + 3H₂ ⇌ 2NH₃', 'It is a chemical equilibrium; the others are physical equilibria.'),
  odd(E(2, 2), ['concentration', 'pressure', 'temperature', 'a catalyst'], 'a catalyst', 'It doesn’t shift the position of equilibrium, only speeds up reaching it; the others can shift it.'),

  long(E(5, 2), 'For N₂(g) + 3H₂(g) ⇌ 2NH₃(g) at a certain temperature, the equilibrium concentrations are [N₂] = 0.20, [H₂] = 0.50 and [NH₃] = 0.10 mol/L.\n(a) Set up Kc for this reaction from the law of mass action. [1]\n(b) Find Kc. [2]\n(c) Find Kc for 2NH₃ ⇌ N₂ + 3H₂ at the same temperature. [1]\n(d) Find Kc for ½N₂ + ³⁄₂H₂ ⇌ NH₃. [1]', '(a) Kc = [NH₃]²/([N₂][H₂]³).', '(b) Kc = 0.10²/(0.20 × 0.50³) = 0.010/0.025.', '(b) = 0.40 mol⁻² L².', '(c) The reverse reaction has 1/Kc = 2.5.', '(d) Halving the equation gives √Kc = √0.40 = 0.63.'),
  long(E(5, 2), 'Answer each part on the reaction quotient Qc.\n(a) What is Qc, and how is it used to tell which way a reaction will go? [2]\n(b) For H₂ + I₂ ⇌ 2HI, Kc = 50. A mixture has [H₂] = [I₂] = 0.10 mol/L and [HI] = 0.50 mol/L. Which way will it go? [2]\n(c) What does a very large value of K tell you? [1]', '(a) Qc has the same form as Kc, but uses the concentrations at any moment, not only at equilibrium.', '(a) If Qc < Kc the reaction goes forward; if Qc > Kc it goes backward; if they are equal it is at equilibrium.', '(b) Qc = 0.50²/(0.10 × 0.10) = 25.', '(b) Qc < Kc, so the reaction goes forward, making more HI.', '(c) At equilibrium the mixture is mostly products: the reaction goes nearly to completion.'),

  tell(E(2, 1), 'Distinguish between physical and chemical equilibrium, with an example of each.', 'In a physical equilibrium, the same substance is in two states with no chemical change: ice and water at 0 °C.', 'In a chemical equilibrium, reactants and products are being turned into each other: N₂ + 3H₂ ⇌ 2NH₃.'),
  tell(E(2, 2), 'Distinguish between Kc and Qc.', 'Kc uses equilibrium concentrations, and is constant at a given temperature.', 'Qc has the same form but uses the concentrations at any moment, so it changes as the reaction goes on, until it equals Kc.'),
  tell(E(2, 1), 'Distinguish between homogeneous and heterogeneous equilibria, with an example of each.', 'In a homogeneous equilibrium, everything is in the same phase: H₂(g) + I₂(g) ⇌ 2HI(g).', 'In a heterogeneous equilibrium, there is more than one phase: CaCO₃(s) ⇌ CaO(s) + CO₂(g).'),

  match(E(4, 2), [['Raising the pressure on N₂ + 3H₂ ⇌ 2NH₃', 'shifts it forward'], ['Raising the pressure on PCl₅ ⇌ PCl₃ + Cl₂', 'shifts it backward'], ['Raising the pressure on H₂ + I₂ ⇌ 2HI', 'no shift'], ['Adding a catalyst to any equilibrium', 'reached sooner, at the same position']]),
  match(E(4, 1), [['Kp equals Kc when', 'the moles of gas are the same on both sides'], ['Qc is less than Kc when', 'the reaction is about to go forward'], ['Qc is greater than Kc when', 'the reaction is about to go backward'], ['Qc equals Kc when', 'the system is at equilibrium']]),
  match(E(4, 3), [['Kc for H₂ + I₂ ⇌ 2HI', 'no units'], ['Kc for N₂ + 3H₂ ⇌ 2NH₃', 'mol⁻² L²'], ['Kc for PCl₅ ⇌ PCl₃ + Cl₂', 'mol L⁻¹'], ['Kp for N₂O₄ ⇌ 2NO₂', 'atm']]),

  reason(E(2, 2), 'Give reasons. (a) The same equilibrium can be reached from either direction. (b) The concentrations of pure solids and liquids are left out of K.', '(a) The reaction is reversible, so starting from products, the backward reaction goes until its rate equals that of the forward one, giving the same mixture.', '(b) The concentration of a pure solid or liquid is fixed by its density, so it is constant and is taken into K.'),
  reason(E(2, 2), 'For 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), which is exothermic, give reasons. (a) Excess air is used. (b) A catalyst is used, though it doesn’t raise the yield.', '(a) More oxygen shifts the equilibrium forward, turning more of the costly SO₂ into SO₃.', '(b) It makes equilibrium come faster, at a temperature high enough for a good rate.'),
  reason(E(2, 1), 'Give reasons. (a) A bottle of soda water fizzes when it is opened. (b) Water and its vapour reach equilibrium only in a closed container.', '(a) CO₂(aq) ⇌ CO₂(g): opening lowers the pressure of CO₂ above it, so the equilibrium shifts to release gas.', '(b) In an open container the vapour escapes, so the backward change, condensing, can’t keep pace.'),

  short(E(2, 1), 'For N₂O₄(g) ⇌ 2NO₂(g), set up Kp in terms of partial pressures, and find how it is related to Kc.', 'Kp = p(NO₂)²/p(N₂O₄).', 'Kp = Kc(RT)^Δn, with Δn = 2 − 1 = 1 here, so Kp = Kc × RT.'),
  short(E(2, 1), 'State the law of mass action, and use it to write Kc for 2SO₂(g) + O₂(g) ⇌ 2SO₃(g).', 'The rate of a reaction is proportional to the product of the concentrations of the reactants, each raised to the power of its coefficient.', 'Kc = [SO₃]²/([SO₂]²[O₂]).'),

  ar(E(1, 1), 'For CaCO₃(s) ⇌ CaO(s) + CO₂(g), Kp = p(CO₂).', 'Pure solids have constant concentrations, and are left out of K.', 1, 'Only the gas, CO₂, appears in Kp.'),
  ar(E(1, 1), 'Removing ammonia as it forms raises its yield in the Haber process.', 'Removing a product shifts an equilibrium forward.', 1, 'By Le Chatelier’s principle, the system makes more ammonia to replace what was removed.'),
  ar(E(1, 2), 'The equilibrium constant of a reaction changes when the pressure changes.', 'A change of pressure shifts the position of some equilibria.', 4, 'K depends only on temperature; pressure can change the position, but not K.'),

  derive(E(3, 2), 'a mol of H₂ and b mol of I₂ are heated in a vessel of volume V, and x mol of each react by equilibrium. Derive Kc for H₂ + I₂ ⇌ 2HI, and show that it doesn’t depend on V.', ['At equilibrium there are a − x mol H₂, b − x mol I₂ and 2x mol HI.', 1], ['Kc = (2x/V)²/(((a − x)/V)((b − x)/V)).', 1], ['The V² terms cancel, so Kc = 4x²/((a − x)(b − x)), with no V in it.', 1]),
];

export default questions;
