// Written by hand: collision theory and activation energy, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The Arrhenius plot is log k = 5 − 2000/T, so its slope is −2000 K and Ea = 2.303 × 8.314 × 2000 = 38.3 kJ/mol.
// The energy curves are √E·e^(−E/kT)/(kT)^1.5 for kT = 1 and 1.6, in arbitrary units, with Ea at 4.
import { at, kit, type BankDef } from '../define';
import { graph, label, line, plot, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('chemistry', 'XII');
const K = at(3, 'b');

const spread = (kt: number) => (e: number) => (Math.sqrt(e) * Math.exp(-e / kt)) / kt ** 1.5;

const questions: BankDef[] = [
  figure(K(3, 1), 'Draw the energy profile of an endothermic reaction, and mark the activation energy and the enthalpy change on it.', ['The products are drawn higher than the reactants, as the reaction takes in energy.', 'The curve rises over a peak between them; Ea is the height of the peak above the reactants.', 'ΔH is the height of the products above the reactants, and is positive.'], {
    answer: sketch(320, 220, 'Axes: energy upwards, progress of the reaction to the right. A curve starts low at the reactants, rises to a peak, and falls to the products, which are higher than the reactants. An arrow from the reactants’ level up to the peak is marked Ea. An arrow from the reactants’ level up to the products’ level is marked ΔH.', [
      line([[40, 200], [40, 10]], { arrow: 1 }), line([[40, 200], [310, 200]], { arrow: 1 }), label(48, 18, 'energy', 'start'), label(306, 216, 'progress of reaction', 'end'),
      { t: 'path', d: 'M50 160 L100 160 C 140 160, 140 40, 165 40 C 190 40, 190 110, 230 110 L290 110' },
      label(50, 178, 'reactants', 'start'), label(286, 102, 'products', 'end'),
      line([[100, 160], [100, 40]], { dash: 1 }), line([[100, 40], [165, 40]], { dash: 1 }), line([[90, 160], [90, 44]], { arrow: 1 }), label(84, 104, 'Ea', 'end'),
      line([[230, 160], [290, 160]], { dash: 1 }), line([[260, 160], [260, 114]], { arrow: 1 }), label(266, 142, 'ΔH', 'start'),
    ]),
  }),
  figure(K(3, 2), 'The graph shows log k against 1/T for a reaction. Find its slope, and use it to find the activation energy. (R = 8.314 J K⁻¹ mol⁻¹)', ['The line falls from log k = −1 at 1/T = 3.0 × 10⁻³ K⁻¹ to −2 at 3.5 × 10⁻³ K⁻¹: slope = −1/(0.5 × 10⁻³) = −2000 K.', 'The slope is −Ea/2.303R.', 'So Ea = 2.303 × 8.314 × 2000 = 3.83 × 10⁴ J/mol = 38.3 kJ/mol.'], {
    shown: graph('1/T (10⁻³ K⁻¹)', 'log k', [{ points: plot((x) => 5 - 2 * x, 3.0, 3.5, 5) }], { x: [[3.0, '3.0'], [3.5, '3.5']], y: [[-1, '−1'], [-2, '−2']], xFrom: 2.9, yFrom: -2.2 }),
  }),
  figure(K(3, 2), 'Sketch how the kinetic energies of the molecules of a gas are spread out at two temperatures, T₁ and a higher T₂. Mark the activation energy, and use the sketch to explain why a small rise in temperature speeds a reaction so much.', ['At T₂ the curve is lower and wider, and its peak moves to higher energy.', 'The area under each curve beyond Ea is the fraction of molecules with enough energy to react, and it is much larger at T₂.', 'So many more collisions succeed at T₂, and the rate rises sharply.'], {
    // Origin (40, 180): 35 px to a unit of energy, 333 px to a unit of the curve.
    answer: sketch(320, 215, 'Axes: fraction of molecules upwards, kinetic energy to the right. A solid curve for T₁ rises steeply to a high, narrow peak at low energy and falls away. A dashed curve for T₂ has a lower, wider peak at higher energy and stays higher out at large energies. A dashed vertical line marks Ea, well out along the energy axis, where the T₂ curve is clearly above the T₁ curve.', [
      line([[40, 180], [40, 12]], { arrow: 1 }), line([[40, 180], [310, 180]], { arrow: 1 }), label(48, 18, 'fraction of molecules', 'start'), label(306, 200, 'kinetic energy', 'end'),
      { t: 'path', d: `M${plot(spread(1), 0, 7, 70).map(([e, f]) => `${Math.round((40 + 35 * e) * 10) / 10} ${Math.round((180 - 333 * f) * 10) / 10}`).join(' L')}` },
      { t: 'path', d: `M${plot(spread(1.6), 0, 7, 70).map(([e, f]) => `${Math.round((40 + 35 * e) * 10) / 10} ${Math.round((180 - 333 * f) * 10) / 10}`).join(' L')}`, dash: 1 },
      line([[180, 180], [180, 110]], { dash: 1 }), label(180, 198, 'Ea'), label(66, 34, 'T₁', 'start'), label(150, 124, 'T₂', 'start'),
    ]),
  }),

  predict(K(2, 1), 'The temperature of a typical reaction is raised from 298 K to 308 K. Predict roughly how its rate changes, and why.', 'The rate roughly doubles, for a rise of only 10 K.', 'Many more molecules then have energy equal to or above the activation energy.'),
  predict(K(2, 2), 'Use the Arrhenius equation to predict how the rate constant of a reaction would behave if its activation energy were zero.', 'k = Ae⁰ = A, the frequency factor.', 'k wouldn’t change with temperature, as every collision with the right orientation would lead to reaction.'),
  predict(K(2, 1), 'Two molecules collide with more than enough energy, but the wrong way round. Predict whether they react, and why.', 'They don’t react.', 'A collision is effective only if the molecules have enough energy and the proper orientation, so the right atoms meet.'),

  odd(K(2, 1), ['k', 'A', 'Ea', 'ΔH'], 'ΔH', 'It doesn’t appear in the Arrhenius equation, k = Ae^(−Ea/RT); the others do.'),
  odd(K(2, 2), ['raising the temperature', 'adding a catalyst', 'raising the concentration of a reactant', 'finding a path of lower activation energy'], 'raising the concentration of a reactant', 'It speeds the reaction without changing the rate constant; the others change k.'),
  odd(K(2, 3), ['the fraction of collisions with energy of Ea or more', 'e^(−Ea/RT)', 'the Boltzmann factor', 'the frequency factor A'], 'the frequency factor A', 'It depends on how often molecules collide, and in what orientation; the other three are names for the same energy factor.'),

  long(K(5, 1), 'Answer each part on collision theory.\n(a) State its two main ideas about how reactions happen. [2]\n(b) What is an effective collision? [1]\n(c) How do a rise in temperature and a catalyst each raise the number of effective collisions? [2]', '(a) Molecules must collide to react.', '(a) The rate depends on how often they collide and on the fraction of collisions that are effective.', '(b) A collision between molecules that have at least the threshold energy and the proper orientation.', '(c) A rise in temperature gives more molecules energy equal to or above Ea.', '(c) A catalyst lowers Ea, so more of the collisions that happen have enough energy.'),
  long(K(5, 3), 'The rate constant of a reaction is 2.0 × 10⁻³ s⁻¹ at 300 K and 8.0 × 10⁻³ s⁻¹ at 320 K. (R = 8.314 J K⁻¹ mol⁻¹)\n(a) Write the Arrhenius equation for two temperatures. [1]\n(b) Find the activation energy. [3]\n(c) Find the rate constant at 310 K. [1]', '(a) log(k₂/k₁) = (Ea/2.303R)(1/T₁ − 1/T₂).', '(b) log 4 = 0.602, and 1/300 − 1/320 = 2.083 × 10⁻⁴ K⁻¹.', '(b) Ea = 0.602 × 2.303 × 8.314/(2.083 × 10⁻⁴).', '(b) Ea = 5.53 × 10⁴ J/mol = 55.3 kJ/mol.', '(c) log(k/2.0 × 10⁻³) = 2890 × (1/300 − 1/310) = 0.311, so k = 4.1 × 10⁻³ s⁻¹.'),
  long(K(5, 2), 'Answer each part on the Arrhenius equation.\n(a) Write the equation, and say what A and e^(−Ea/RT) stand for. [2]\n(b) Write it in log form, and say what a graph of log k against 1/T gives. [2]\n(c) What does k tend to at very high temperatures? [1]', '(a) k = Ae^(−Ea/RT).', '(a) A is the frequency factor, for how often molecules collide in a suitable way; e^(−Ea/RT) is the fraction of molecules with energy Ea or more.', '(b) log k = log A − Ea/(2.303RT).', '(b) A straight line of slope −Ea/2.303R and intercept log A.', '(c) As T grows very large, Ea/RT tends to 0, so k tends to A.'),

  tell(K(2, 1), 'Distinguish between effective and ineffective collisions.', 'An effective collision has at least the threshold energy and the proper orientation, and leads to products.', 'An ineffective collision lacks enough energy or the right orientation, and the molecules just bounce apart.'),
  tell(K(2, 2), 'Distinguish between the energy profiles of a catalysed and an uncatalysed path for the same reaction.', 'The catalysed path has a lower peak, so a smaller activation energy.', 'Both start at the same reactants and end at the same products, so ΔH is the same.'),
  tell(K(2, 3), 'For an exothermic reaction, distinguish between the activation energies of the forward and backward reactions.', 'The forward reaction climbs from the reactants to the peak, with activation energy Ea.', 'The backward reaction climbs from the lower products, so its activation energy is Ea + |ΔH|, larger.'),

  match(K(4, 1), [['A in the Arrhenius equation', 'the frequency factor'], ['e^(−Ea/RT)', 'the fraction of molecules with energy Ea or more'], ['The slope of log k against 1/T', '−Ea/2.303R'], ['The intercept of log k against 1/T', 'log A']]),
  match(K(4, 1), [['A catalyst', 'lowers Ea by giving another path'], ['A rise in temperature', 'more molecules with energy Ea or more'], ['Proper orientation', 'needed for a collision to be effective'], ['The activated complex', 'the arrangement at the top of the energy barrier']]),
  match(K(4, 2), [['Ea = 0', 'k doesn’t change with temperature'], ['A small Ea', 'a fast reaction'], ['A large Ea', 'a slow reaction, very sensitive to temperature'], ['A negative ΔH', 'products lower in energy than reactants']]),

  ar(K(1, 1), 'Raising the temperature raises the rate constant of a reaction.', 'More molecules then have energy equal to or greater than the activation energy.', 1, 'So a larger fraction of collisions is effective, and k grows.'),
  ar(K(1, 2), 'The activation energy of a reaction is about the same at all temperatures.', 'The rate constant of a reaction doesn’t change with temperature.', 3, 'k changes strongly with temperature; it is Ea that stays nearly constant.'),

  derive(K(3, 2), 'From the Arrhenius equation, derive log(k₂/k₁) = (Ea/2.303R)(1/T₁ − 1/T₂) for the rate constants k₁ and k₂ at temperatures T₁ and T₂.', ['Taking logs of k = Ae^(−Ea/RT): log k = log A − Ea/(2.303RT).', 1], ['At T₁ and T₂: log k₁ = log A − Ea/(2.303RT₁) and log k₂ = log A − Ea/(2.303RT₂).', 1], ['Subtracting removes log A: log(k₂/k₁) = (Ea/2.303R)(1/T₁ − 1/T₂).', 1]),
  derive(K(3, 2), 'Show that a graph of log k against 1/T is a straight line, and find its slope and intercept.', ['k = Ae^(−Ea/RT), so ln k = ln A − Ea/RT.', 1], ['Changing to base 10: log k = log A − (Ea/2.303R)(1/T).', 1], ['This has the form y = c + mx with y = log k and x = 1/T, so it is a straight line of slope −Ea/2.303R and intercept log A.', 1]),
  derive(K(3, 3), 'Show that a reaction with an activation energy of 53.6 kJ/mol goes about twice as fast at 310 K as at 300 K. (R = 8.314 J K⁻¹ mol⁻¹)', ['log(k₂/k₁) = (Ea/2.303R)(1/T₁ − 1/T₂), with Ea/2.303R = 53600/19.15 = 2799 K.', 1], ['1/300 − 1/310 = 1.075 × 10⁻⁴ K⁻¹, so log(k₂/k₁) = 2799 × 1.075 × 10⁻⁴ = 0.301.', 1], ['k₂/k₁ = 10^0.301 = 2.0, so the reaction goes twice as fast.', 1]),
];

export default questions;
