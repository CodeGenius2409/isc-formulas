// Written by hand: systems, the first law and enthalpy changes, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// Work is taken as positive when done on the system, so ΔU = q + w.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('chemistry', 'XI');
const H = at(5, 'a');

const questions: BankDef[] = [
  figure(H(3, 1), 'Draw enthalpy level diagrams for an exothermic and an endothermic reaction, marking ΔH and its sign on each.', ['Exothermic: the products are drawn lower than the reactants, as heat is given out.', 'Endothermic: the products are drawn higher than the reactants, as heat is taken in.', 'ΔH = H(products) − H(reactants): negative for the exothermic reaction, positive for the endothermic one.'], {
    answer: sketch(340, 200, 'Two enthalpy diagrams side by side, each with enthalpy up the side. Left, exothermic: a high line for the reactants and a lower line for the products, with a downward arrow marked ΔH negative. Right, endothermic: a low line for the reactants and a higher line for the products, with an upward arrow marked ΔH positive.', [
      arrow([20, 180], [20, 20]), label(26, 24, 'H', 'start'),
      line([[40, 60], [130, 60]]), label(85, 52, 'reactants'), line([[40, 140], [130, 140]]), label(85, 158, 'products'),
      arrow([85, 64], [85, 136]), label(92, 104, 'ΔH < 0', 'start'), label(85, 190, 'exothermic'),
      line([[200, 140], [290, 140]]), label(245, 158, 'reactants'), line([[200, 60], [290, 60]]), label(245, 52, 'products'),
      arrow([245, 136], [245, 64]), label(252, 104, 'ΔH > 0', 'start'), label(245, 190, 'endothermic'),
    ]),
  }),
  figure(H(3, 2), 'Draw a Hess’s law cycle to find the enthalpy of formation of methane from the enthalpies of combustion: C(s) −393.5, H₂(g) −285.8 and CH₄(g) −890.3 kJ/mol. Find ΔfH of methane.', ['C(s) + 2H₂(g) → CH₄(g) is the wanted change; both sides burn to the same products, CO₂(g) + 2H₂O(l).', 'By Hess’s law, ΔfH + (−890.3) = −393.5 + 2(−285.8).', 'ΔfH = −965.1 + 890.3 = −74.8 kJ/mol.'], {
    answer: sketch(340, 210, 'A triangle. Top left: C(s) + 2H2(g). Top right: CH4(g). An arrow from left to right is marked ΔfH. From each top corner an arrow goes down to the bottom: CO2(g) + 2H2O(l). The left arrow is marked −393.5 + 2(−285.8), the right arrow −890.3.', [
      label(70, 40, 'C(s) + 2H₂(g)'), label(270, 40, 'CH₄(g)'), arrow([124, 36], [240, 36]), label(182, 28, 'ΔfH'),
      label(170, 190, 'CO₂(g) + 2H₂O(l)'), arrow([70, 48], [150, 172]), arrow([270, 48], [190, 172]),
      label(104, 112, '−393.5', 'end'), label(104, 130, '+ 2(−285.8)', 'end'), label(240, 120, '−890.3', 'start'),
    ]),
  }),
  figure(H(3, 2), 'The graph shows a gas expanding from 1 L to 5 L against a constant outside pressure of 1.0 × 10⁵ Pa. Find the work done on the gas, and explain its sign.', ['The work is the area under the line: w = −p(ext)ΔV.', 'w = −1.0 × 10⁵ × (5 − 1) × 10⁻³ = −400 J.', 'It is negative because the gas does work on its surroundings as it expands, losing energy.'], {
    shown: graph('volume (L)', 'external pressure (10⁵ Pa)', [{ points: [[1, 0], [1, 1], [5, 1], [5, 0]] }], { x: [[1, '1'], [5, '5']], y: [[1, '1.0']] }),
  }),

  predict(H(2, 1), 'Ice melts at 0 °C, and a gas expands against the atmosphere. Predict the sign of ΔH for the melting, and of w for the expansion.', 'ΔH is positive: melting takes in heat.', 'w is negative: the expanding gas does work on its surroundings.'),
  predict(H(2, 2), '1 mol of water turns to steam at 100 °C, with ΔH = +40.7 kJ. Predict whether ΔU is larger or smaller than ΔH.', 'Δn(gas) = +1, so ΔU = ΔH − RT.', 'ΔU is smaller: 40.7 − 8.314 × 373/1000 = 37.6 kJ.'),
  predict(H(2, 1), 'Two equal beakers of water at 30 °C are poured together. Predict the temperature and the volume of the mixture, and say which is an intensive property.', 'The temperature stays 30 °C, while the volume doubles.', 'Temperature is intensive, not depending on the amount; volume is extensive.'),

  odd(H(2, 1), ['internal energy', 'enthalpy', 'heat', 'pressure'], 'heat', 'It depends on the path taken; the others are state functions.'),
  odd(H(2, 1), ['mass', 'volume', 'enthalpy', 'density'], 'density', 'It is intensive; the others are extensive, depending on the amount.'),
  odd(H(2, 2), ['ΔcH of carbon (graphite)', 'ΔfH of CO₂(g)', 'ΔH of C(s) + O₂(g) → CO₂(g)', 'ΔfH of O₂(g)'], 'ΔfH of O₂(g)', 'It is zero, for an element in its standard state; the others are all the same, −393.5 kJ/mol.'),

  long(H(5, 2), 'Answer each part. (R = 8.314 J mol⁻¹ K⁻¹.)\n(a) A gas takes in 300 J of heat and does 120 J of work. Find ΔU. [1]\n(b) 2.0 mol of an ideal gas expands isothermally and reversibly at 300 K from 10 L to 20 L. Find the work done on it. [2]\n(c) Find ΔU and q for the change in (b). [1]\n(d) What work is done when a gas expands into a vacuum? [1]', '(a) q = +300 J and w = −120 J, so ΔU = 180 J.', '(b) w = −nRT ln(V₂/V₁) = −2.0 × 8.314 × 300 × ln 2.', '(b) = −3.46 × 10³ J.', '(c) ΔU = 0, as the temperature of the ideal gas doesn’t change, so q = −w = +3.46 × 10³ J.', '(d) None: there is no outside pressure to push against.'),
  long(H(5, 3), 'The enthalpies of combustion of C(s), H₂(g) and C₂H₆(g) are −393.5, −285.8 and −1560 kJ/mol.\n(a) State Hess’s law. [1]\n(b) Write the equation for the formation of ethane. [1]\n(c) Find the enthalpy of formation of ethane. [2]\n(d) Why is Hess’s law useful for such reactions? [1]', '(a) The total enthalpy change of a reaction is the same whether it takes place in one step or in several.', '(b) 2C(s) + 3H₂(g) → C₂H₆(g).', '(c) ΔfH = 2(−393.5) + 3(−285.8) − (−1560).', '(c) = −787.0 − 857.4 + 1560 = −84.4 kJ/mol.', '(d) Carbon and hydrogen don’t combine directly to give ethane, so its ΔfH can’t be measured; it is found from reactions that can.'),

  tell(H(2, 1), 'Distinguish between intensive and extensive properties, with two examples of each.', 'An intensive property doesn’t depend on the amount of matter: temperature and density.', 'An extensive property depends on the amount: mass and volume.'),
  tell(H(2, 1), 'Distinguish between a state function and a path function, with one example of each.', 'A state function depends only on the present state of the system, not on how it got there: internal energy.', 'A path function depends on the way the change is made: work, or heat.'),
  tell(H(2, 1), 'Distinguish between the enthalpy of formation and the enthalpy of combustion.', 'The enthalpy of formation is the enthalpy change when 1 mol of a compound is made from its elements in their standard states.', 'The enthalpy of combustion is the enthalpy change when 1 mol of a substance burns completely in oxygen.'),

  match(H(4, 2), [['Enthalpy of formation', '1 mol of a compound made from its elements in their standard states'], ['Enthalpy of combustion', '1 mol of a substance burnt completely in oxygen'], ['Enthalpy of atomisation', '1 mol of a substance broken into gaseous atoms'], ['Enthalpy of sublimation', '1 mol of a solid turned straight into vapour']]),
  match(H(4, 1), [['An isolated system', 'hot tea in a closed vacuum flask'], ['A closed system', 'water in a sealed steel can'], ['An open system', 'water boiling in an open pan'], ['The surroundings', 'everything outside the system']]),
  match(H(4, 2), [['Heat taken in at constant volume', 'ΔU'], ['Heat taken in at constant pressure', 'ΔH'], ['Work in a free expansion into a vacuum', 'zero'], ['Work on a gas in a reversible isothermal expansion', '−nRT ln(V₂/V₁)']]),

  reason(H(2, 1), 'Give reasons. (a) The enthalpy of formation of an element in its standard state is zero. (b) Enthalpy is an extensive property.', '(a) Forming an element from itself, in the same state, involves no change, so by definition ΔfH = 0.', '(b) It depends on the amount of substance: twice the amount has twice the enthalpy.'),
  reason(H(2, 2), 'Give reasons. (a) ΔH and ΔU are almost the same for reactions of solids and liquids only. (b) The enthalpy of neutralisation of any strong acid by a strong base is about −57 kJ/mol.', '(a) Their volumes hardly change, so pΔV, the difference between ΔH and ΔU, is tiny.', '(b) Strong acids and bases are fully ionised, so every such reaction is the same: H⁺(aq) + OH⁻(aq) → H₂O(l).'),
  reason(H(2, 1), 'Give reasons. (a) A bond dissociation enthalpy is always positive. (b) No process can make energy from nothing.', '(a) Energy must always be supplied to break a bond.', '(b) The first law: energy can change form, but the total energy of a system and its surroundings stays the same.'),

  short(H(2, 2), 'Use the bond enthalpies N≡N 946, H–H 436 and N–H 391 kJ/mol to find ΔH for N₂(g) + 3H₂(g) → 2NH₃(g).', 'Bonds broken: 946 + 3 × 436 = 2254 kJ; bonds made: 6 × 391 = 2346 kJ.', 'ΔH = 2254 − 2346 = −92 kJ.'),
  short(H(2, 2), 'For a reaction at 298 K, ΔH = −92 kJ and Δn(gas) = −2. Find ΔU. (R = 8.314 J mol⁻¹ K⁻¹.)', 'ΔU = ΔH − Δn(gas)RT = −92 − (−2 × 8.314 × 298/1000).', '= −92 + 5.0 = −87 kJ.'),

  ar(H(1, 1), 'For C(s) + O₂(g) → CO₂(g), ΔH = ΔU.', 'There is one mole of gas on each side.', 1, 'Δn(gas) = 0, so ΔH = ΔU + Δn(gas)RT = ΔU.'),
  ar(H(1, 1), 'The heat taken in at constant volume equals ΔU.', 'No work of expansion is done at constant volume.', 1, 'With w = 0, ΔU = q.'),
  ar(H(1, 1), 'The internal energy of an isolated system can change.', 'An isolated system exchanges neither energy nor matter with its surroundings.', 4, 'With no exchange of energy, its internal energy stays constant.'),

  derive(H(3, 3), 'Show that the work done on n mol of an ideal gas in a reversible isothermal expansion from V₁ to V₂ is −nRT ln(V₂/V₁).', ['In a reversible change the outside pressure equals the gas pressure, p = nRT/V, so dw = −p dV = −nRT dV/V.', 1], ['T is constant, so w = −nRT ∫dV/V from V₁ to V₂.', 1], ['w = −nRT ln(V₂/V₁).', 1]),
  derive(H(3, 2), 'Show that the heat taken in at constant pressure equals the enthalpy change, q(p) = ΔH.', ['By the first law, ΔU = q + w, and at constant pressure w = −pΔV, so q(p) = ΔU + pΔV.', 1], ['Enthalpy is defined as H = U + pV, so at constant p, ΔH = ΔU + pΔV.', 1], ['So q(p) = ΔH.', 1]),
];

export default questions;
