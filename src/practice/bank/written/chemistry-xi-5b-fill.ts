// Written by hand: the second and third laws of thermodynamics, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// Standard entropies of water, in J K⁻¹ mol⁻¹: ice at 273 K about 41, liquid 70, vapour 189.
import { at, kit, type BankDef } from '../define';
import { graph, label, line, plot, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('chemistry', 'XI');
const S = at(5, 'b');

const questions: BankDef[] = [
  figure(S(3, 2), 'A reaction has ΔH = +50 kJ/mol and ΔS = +200 J K⁻¹ mol⁻¹. Sketch ΔG against temperature, and find the temperature above which the reaction is spontaneous.', ['ΔG = ΔH − TΔS = 50 − 0.2T kJ/mol, a straight line that falls as T rises.', 'ΔG = 0 at T = ΔH/ΔS = 50/0.2 = 250 K.', 'Above 250 K, ΔG is negative, so the reaction is spontaneous.'], {
    answer: graph('temperature (K)', 'ΔG (kJ/mol)', [{ points: plot((t) => 50 - 0.2 * t, 0, 500, 10) }], { x: [[250, '250'], [500, '500']], y: [[50, '50'], [-50, '−50']] }),
  }),
  figure(S(3, 1), 'The table gives the entropy of water as ice, liquid and vapour. Explain the order, and find the entropy change when one mole of liquid water turns to vapour.', ['The entropy rises from ice to liquid to vapour, as the molecules become freer to move and more disordered.', 'The jump from liquid to vapour is the largest, as gas molecules are far apart and move freely.', 'ΔS = 189 − 70 = +119 J K⁻¹ mol⁻¹.'], {
    shown: table(['Form of water', 'Entropy (J K⁻¹ mol⁻¹)'], [['Ice, at 273 K', '41'], ['Liquid', '70'], ['Vapour', '189']]),
  }),
  figure(S(3, 2), 'Sketch how the entropy of a substance changes as it is heated from 0 K, through its melting and boiling points.', ['The entropy starts at zero at 0 K for a perfect crystal, by the third law, and rises steadily as the substance warms.', 'It jumps suddenly at the melting point, as the solid becomes a less ordered liquid.', 'It jumps much more at the boiling point, as the liquid becomes a far more disordered gas.'], {
    answer: sketch(320, 220, 'Axes: entropy upwards, temperature to the right. The entropy starts at zero at 0 K and rises gently. At the melting point it jumps up a little, then rises gently again. At the boiling point it jumps up a great deal, then rises gently.', [
      line([[40, 190], [40, 14]], { arrow: 1 }), line([[40, 190], [305, 190]], { arrow: 1 }), label(48, 20, 'entropy', 'start'), label(305, 208, 'temperature', 'end'),
      { t: 'path', d: 'M40 190 C 70 186, 100 176, 120 166 L120 140 C 150 134, 170 128, 190 122 L190 60 C 220 54, 250 50, 280 46' },
      line([[120, 190], [120, 166]], { dash: 1 }), line([[190, 190], [190, 122]], { dash: 1 }),
      label(120, 206, 'melts'), label(190, 206, 'boils'),
    ]),
  }),

  predict(S(2, 1), 'Predict the sign of ΔS for N₂(g) + 3H₂(g) → 2NH₃(g), and explain.', 'ΔS is negative.', 'Four moles of gas become two, so the system becomes more ordered.'),
  predict(S(2, 2), 'A salt dissolves in water by itself, and the solution grows colder. Predict the sign of ΔS for dissolving, and explain.', 'ΔS is positive, and large.', 'The change takes in heat, so ΔH is positive; it can only be spontaneous, with ΔG negative, if TΔS is larger than ΔH.'),
  predict(S(2, 2), 'A reaction has a negative ΔH and a negative ΔS. Predict how temperature affects whether it is spontaneous.', 'ΔG = ΔH − TΔS, where −TΔS is positive and grows with T.', 'So it is spontaneous at low temperatures, while |ΔH| > T|ΔS|, and not at high ones.'),

  odd(S(2, 1), ['ice melting', 'water evaporating', 'a gas spreading into a vacuum', 'steam condensing'], 'steam condensing', 'The entropy of the system falls; in the others it rises.'),
  odd(S(2, 1), ['ΔG < 0', 'the total entropy change > 0', 'a change that happens by itself', 'ΔG > 0'], 'ΔG > 0', 'It describes a change that isn’t spontaneous; the others describe spontaneous ones.'),
  odd(S(2, 2), ['entropy', 'enthalpy', 'Gibbs energy', 'heat'], 'heat', 'It isn’t a state function, as it depends on the path; the others are state functions.'),

  long(S(5, 2), 'A reaction has ΔH = −90 kJ/mol and ΔS = −200 J K⁻¹ mol⁻¹.\n(a) State the second law of thermodynamics. [1]\n(b) Find ΔG at 300 K and at 600 K, and say whether the reaction is spontaneous at each. [3]\n(c) Find the temperature at which ΔG changes sign. [1]', '(a) In a spontaneous change, the total entropy of a system and its surroundings increases.', '(b) At 300 K: ΔG = −90 − 300 × (−0.200) = −90 + 60 = −30 kJ/mol, so it is spontaneous.', '(b) At 600 K: ΔG = −90 + 120 = +30 kJ/mol, so it isn’t.', '(b) The favourable ΔH wins at low temperature, and the unfavourable ΔS at high temperature.', '(c) T = ΔH/ΔS = −90/−0.200 = 450 K.'),

  tell(S(2, 1), 'Distinguish between spontaneous and non-spontaneous changes, with an example of each.', 'A spontaneous change happens by itself, without outside help, as ice melting at 25 °C.', 'A non-spontaneous change needs outside help to happen, as water splitting into hydrogen and oxygen, which needs electricity.'),
  tell(S(2, 1), 'Distinguish between entropy and enthalpy.', 'Entropy measures the disorder of a system, the number of ways its energy can be spread; its unit is J K⁻¹ mol⁻¹.', 'Enthalpy measures its heat content at constant pressure; its unit is kJ mol⁻¹.'),
  tell(S(2, 2), 'Distinguish between the entropy change of the system and the total entropy change.', 'The entropy change of the system can be positive or negative in a spontaneous change.', 'The total entropy change, of system and surroundings together, is always positive in a spontaneous change.'),

  match(S(4, 1), [['The first law', 'energy is conserved'], ['The second law', 'the entropy of the universe rises in a spontaneous change'], ['The third law', 'a perfect crystal has zero entropy at 0 K'], ['The Gibbs equation', 'ΔG = ΔH − TΔS']]),
  match(S(4, 2), [['ΔH < 0 and ΔS > 0', 'spontaneous at all temperatures'], ['ΔH > 0 and ΔS < 0', 'never spontaneous'], ['ΔH < 0 and ΔS < 0', 'spontaneous only at low temperatures'], ['ΔH > 0 and ΔS > 0', 'spontaneous only at high temperatures']]),
  match(S(4, 1), [['Entropy', 'a measure of disorder'], ['Gibbs energy', 'energy free to do useful work'], ['Enthalpy', 'heat content at constant pressure'], ['A spontaneous change', 'one that happens without outside help']]),

  reason(S(2, 1), 'Why can’t ΔH alone tell whether a change is spontaneous?', 'Some endothermic changes, such as ice melting above 0 °C, happen by themselves.', 'The entropy change matters too: ΔG = ΔH − TΔS must be negative.'),
  reason(S(2, 2), 'Why does a substance have zero entropy only as a perfect crystal at 0 K?', 'At 0 K the particles of a perfect crystal have just one possible arrangement, with no disorder.', 'An imperfect crystal, or any substance above 0 K, has more than one arrangement, so some entropy.'),
  reason(S(2, 2), 'Why is ΔG zero for melting at the melting point?', 'At the melting point, solid and liquid are in equilibrium.', 'Neither change is favoured, so ΔG = 0, and ΔH = TΔS.'),

  short(S(2, 1), 'Find the entropy change when one mole of ice melts at 273 K, if the enthalpy of fusion is 6.0 kJ/mol.', 'ΔS = ΔH/T, as ΔG = 0 at the melting point.', '6000/273 = +22.0 J K⁻¹ mol⁻¹.'),
  short(S(2, 2), 'Find the temperature above which a reaction with ΔH = +60 kJ/mol and ΔS = +200 J K⁻¹ mol⁻¹ becomes spontaneous.', 'ΔG = 0 when T = ΔH/ΔS = 60 000/200.', 'T = 300 K; above it, ΔG is negative.'),
  short(S(2, 1), 'State the third law of thermodynamics, and give one use of it.', 'The entropy of a perfect crystal is zero at 0 K.', 'It lets the absolute entropy of a substance be worked out at any temperature.'),

  ar(S(1, 2), 'Ice melts by itself at 10 °C, though melting takes in heat.', 'At 10 °C, TΔS for melting is larger than ΔH.', 1, 'So ΔG = ΔH − TΔS is negative, and melting is spontaneous.'),
  ar(S(1, 1), 'ΔG for a reaction is the same at every temperature.', 'ΔG = ΔH − TΔS.', 4, 'ΔG contains −TΔS, so it changes with temperature.'),

  derive(S(3, 3), 'Show that, at constant temperature and pressure, ΔG = −TΔS(total), and so a spontaneous change has ΔG < 0.', ['The surroundings take in heat −ΔH at temperature T, so ΔS(surroundings) = −ΔH/T.', 1], ['ΔS(total) = ΔS − ΔH/T, and multiplying by −T: −TΔS(total) = ΔH − TΔS = ΔG.', 1], ['A spontaneous change has ΔS(total) > 0, so ΔG < 0.', 1]),
  derive(S(3, 1), 'Show that a reaction with positive ΔH and positive ΔS becomes spontaneous above T = ΔH/ΔS.', ['ΔG = ΔH − TΔS is spontaneous when ΔG < 0.', 1], ['ΔH − TΔS < 0 gives TΔS > ΔH.', 1], ['As ΔS is positive, dividing by it keeps the sign: T > ΔH/ΔS.', 1]),
  derive(S(3, 2), 'Show that, for a change of state at its transition temperature T, ΔS = ΔH/T.', ['At the transition temperature the two states are in equilibrium, so ΔG = 0.', 1], ['ΔG = ΔH − TΔS = 0.', 1], ['So ΔS = ΔH/T.', 1]),
];

export default questions;
