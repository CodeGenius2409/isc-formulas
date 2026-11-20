// Written by hand: kinetic theory of gases, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// Values used: R = 8.31 J mol⁻¹ K⁻¹, k = 1.38 × 10⁻²³ J/K, Avogadro’s number 6.02 × 10²³ per mole.
import { at, kit, type BankDef } from '../define';
import { graph, plot, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const K = at(9, 'a');

const questions: BankDef[] = [
  figure(K(2, 1), 'Sketch, on P–V axes, two isotherms of a fixed mass of ideal gas, at temperatures T₁ and T₂, with T₂ > T₁.', ['Each isotherm is a curve with PV constant, falling as V rises.', 'PV = nRT is larger at T₂, so its curve lies further from the axes.'], {
    answer: graph('volume V', 'pressure P', [{ label: 'T₁', points: plot((v) => 1 / v, 0.5, 4, 30) }, { label: 'T₂', points: plot((v) => 2 / v, 1, 4, 30) }]),
  }),
  figure(K(3, 2), 'The graph shows the pressure of a fixed mass of gas, kept at constant volume, against its temperature in °C. Find the temperature at which the line, carried on, meets the temperature axis, and explain what it means.', ['The straight line, carried back, meets the axis at −273 °C.', 'At that temperature the pressure of an ideal gas would be zero, as its molecules would have no kinetic energy of motion.', 'It is absolute zero, 0 K; measured from it, P ∝ T, as kinetic theory gives.'], {
    shown: graph('temperature (°C)', 'pressure (kPa)', [{ points: [[0, 100], [100, 136.6]] }, { points: [[-273, 0], [0, 100]] }], { x: [[-273, '−273'], [0, '0'], [100, '100']], y: [[100, '100']], xFrom: -300 }),
  }),
  figure(K(3, 2), 'Make a table of the degrees of freedom, Cv, Cp and γ of a monatomic, a rigid diatomic and a rigid non-linear polyatomic ideal gas.', ['Monatomic: 3 degrees of freedom, Cv = 3R/2, Cp = 5R/2, γ = 5/3.', 'Rigid diatomic: 5, Cv = 5R/2, Cp = 7R/2, γ = 7/5.', 'Rigid non-linear polyatomic: 6, Cv = 3R, Cp = 4R, γ = 4/3.'], {
    answer: table(['Gas', 'Degrees of freedom', 'Cv', 'Cp', 'γ'], [['Monatomic', '3', '3R/2', '5R/2', '5/3'], ['Rigid diatomic', '5', '5R/2', '7R/2', '7/5'], ['Rigid non-linear polyatomic', '6', '3R', '4R', '4/3']]),
  }),

  predict(K(2, 2), 'Predict the ratio of the rms speed of oxygen molecules (M = 32) to that of hydrogen molecules (M = 2) at the same temperature.', 'The rms speed is √(3RT/M), so it is proportional to 1/√M.', '√(2/32) = ¼: oxygen molecules move a quarter as fast.'),
  predict(K(2, 1), 'The volume of an ideal gas is halved while its kelvin temperature is doubled. Predict the change in its pressure.', 'P = nRT/V: halving V doubles P, and doubling T doubles it again.', 'The pressure becomes 4 times as large.'),
  predict(K(2, 2), 'A gas is heated from 27 °C to 327 °C. Predict the change in the average kinetic energy of its molecules.', 'The average kinetic energy is (3/2)kT, proportional to the kelvin temperature.', 'T rises from 300 K to 600 K, so the average kinetic energy doubles.'),

  odd(K(2, 1), ['helium', 'neon', 'argon', 'nitrogen'], 'nitrogen', 'It is diatomic, with 5 degrees of freedom; the others are monatomic, with 3.'),
  odd(K(2, 2), ['translational', 'rotational', 'vibrational', 'gravitational'], 'gravitational', 'It isn’t a kind of molecular motion; the others are kinds of degrees of freedom of a molecule.'),
  odd(K(2, 2), ['PV = nRT', 'PV = NkT', 'P = ⅓ρc²', 'PV^γ = constant'], 'PV^γ = constant', 'It holds only in an adiabatic change; the others hold for an ideal gas in any state.'),

  long(K(5, 2), '2.0 mol of an ideal gas at 300 K fills a volume of 0.050 m³.\n(a) Find its pressure. [2]\n(b) Find the number of molecules. [1]\n(c) Find the average translational kinetic energy of a molecule. [1]\n(d) Find the total translational kinetic energy of the gas. [1]', '(a) P = nRT/V = 2.0 × 8.31 × 300/0.050.', '(a) = 1.0 × 10⁵ Pa.', '(b) N = 2.0 × 6.02 × 10²³ = 1.2 × 10²⁴.', '(c) (3/2)kT = 1.5 × 1.38 × 10⁻²³ × 300 = 6.2 × 10⁻²¹ J.', '(d) (3/2)nRT = 1.5 × 2.0 × 8.31 × 300 = 7.5 × 10³ J.'),
  long(K(5, 2), 'Answer each part on rms speed. (M of N₂ = 0.028 kg/mol, M of O₂ = 0.032 kg/mol.)\n(a) Find the rms speed of nitrogen molecules at 300 K. [2]\n(b) At what temperature is it twice as large? [1]\n(c) Find the rms speed of oxygen molecules at 300 K. [1]\n(d) Why is hydrogen rare in the Earth’s atmosphere? [1]', '(a) c = √(3RT/M) = √(3 × 8.31 × 300/0.028).', '(a) = 517 m/s.', '(b) c ∝ √T, so T must be 4 times as large: 1200 K.', '(c) √(3 × 8.31 × 300/0.032) = 483 m/s.', '(d) Its molecules are so light that many move faster than the escape speed, and leak away into space.'),
  long(K(5, 3), '1 mol of helium is mixed with 1 mol of oxygen, both ideal, at the same temperature. Treat oxygen as a rigid diatomic gas.\n(a) Use the law of equipartition of energy to find the molar Cv of each gas. [2]\n(b) Find the molar Cv of the mixture. [1]\n(c) Find γ of the mixture. [2]', '(a) Helium has 3 degrees of freedom, each with ½RT per mole, so Cv = 3R/2.', '(a) Oxygen has 5, so Cv = 5R/2.', '(b) Cv = (3R/2 + 5R/2)/2 = 2R.', '(c) Cp = Cv + R = 3R.', '(c) γ = 3R/2R = 1.5.'),

  tell(K(2, 2), 'Distinguish between the rms speed and the average speed of the molecules of a gas.', 'The average speed is the sum of the speeds divided by the number of molecules.', 'The rms speed is the square root of the mean of the squares of the speeds; it is a little larger, and is the one that fixes the kinetic energy.'),
  tell(K(2, 1), 'Distinguish between the degrees of freedom of a monatomic and a rigid diatomic molecule.', 'A monatomic molecule has 3 degrees of freedom, all of translation.', 'A rigid diatomic molecule has 5: 3 of translation and 2 of rotation, about the two axes at right angles to its length.'),
  tell(K(2, 1), 'Distinguish between the molar specific heat capacities Cp and Cv of a gas.', 'Cv is the heat needed to raise 1 mol by 1 K at constant volume, when no work is done.', 'Cp is the heat needed at constant pressure, when the gas also does work by expanding; for an ideal gas Cp = Cv + R.'),

  match(K(4, 2), [['A monatomic gas', 'γ = 5/3'], ['A rigid diatomic gas', 'γ = 7/5'], ['A rigid non-linear polyatomic gas', 'γ = 4/3'], ['Any ideal gas', 'Cp − Cv = R']]),
  match(K(4, 1), [['The Boltzmann constant k', '1.38 × 10⁻²³ J/K'], ['Avogadro’s number', '6.02 × 10²³ per mole'], ['The gas constant R', '8.31 J mol⁻¹ K⁻¹'], ['The average kinetic energy of a molecule', '(3/2)kT']]),
  match(K(4, 2), [['The rms speed', '√(3RT/M)'], ['The pressure from kinetic theory', '⅓ρc²'], ['The mean free path', '1/(√2 πd²n)'], ['The equation of state', 'PV = nRT']]),

  ar(K(1, 2), 'The internal energy of an ideal gas depends only on its temperature.', 'There are no forces between the molecules of an ideal gas.', 1, 'With no forces between them, the molecules have no potential energy, only kinetic energy, which depends on T.'),
  ar(K(1, 1), 'γ for helium is 7/5.', 'Helium is monatomic, with 3 degrees of freedom.', 4, 'With 3 degrees of freedom, γ = 5/3.'),

  derive(K(3, 2), 'Starting from P = ⅓ρc², show that the average kinetic energy of a molecule of an ideal gas is (3/2)kT.', ['For n moles of gas of molar mass M in volume V, ρ = nM/V, so PV = ⅓nMc².', 1], ['Comparing with PV = nRT gives ½Mc² = (3/2)RT for one mole.', 1], ['Dividing by Avogadro’s number, ½mc² = (3/2)(R/Nₐ)T = (3/2)kT.', 1]),
  derive(K(3, 2), 'Use the law of equipartition of energy to show that γ = 5/3 for a monatomic ideal gas.', ['A monatomic molecule has 3 degrees of freedom, each with ½kT, so the internal energy of 1 mol is U = (3/2)RT.', 1], ['Cv = dU/dT = 3R/2, and Cp = Cv + R = 5R/2.', 1], ['γ = Cp/Cv = (5R/2)/(3R/2) = 5/3.', 1]),
];

export default questions;
