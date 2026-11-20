// Written by hand: thermodynamics, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('physics', 'XI');
const T = at(8, 'b');

const questions: BankDef[] = [
  figure(T(3, 2), 'On P–V axes, sketch an expansion at constant pressure, a change at constant volume, and an isothermal expansion, and say what the work done is in each.', ['Constant pressure: a horizontal line; the work done is the area under it, P(V₂ − V₁).', 'Constant volume: a vertical line, with no area under it, so no work is done.', 'Isothermal: a curve falling as V rises, PV constant; the work is the area under the curve.'], {
    answer: sketch(330, 210, 'P–V axes. A horizontal line at the top is the expansion at constant pressure, with the area under it shaded by dashed lines. A vertical line is the change at constant volume. A curve falling to the right is the isothermal expansion.', [
      line([[40, 190], [40, 12]], { arrow: 1 }), line([[40, 190], [320, 190]], { arrow: 1 }), label(34, 18, 'P', 'end'), label(318, 206, 'V', 'end'),
      line([[70, 50], [170, 50]]), line([[70, 50], [70, 190]], { dash: 1 }), line([[170, 50], [170, 190]], { dash: 1 }), label(120, 44, 'constant P'),
      line([[210, 50], [210, 130]]), label(214, 90, 'constant V', 'start'),
      { t: 'path', d: 'M200 140 C 230 160, 260 168, 310 172' }, label(300, 146, 'isothermal', 'end'),
    ]),
  }),
  figure(T(3, 2), 'The graph shows a gas taken once round a rectangular cycle, from (1 L, 200 kPa) to (3 L, 200 kPa), then to (3 L, 100 kPa), to (1 L, 100 kPa) and back. Find the net work done in one cycle, and say whether it is done by the gas or on it.', ['The net work is the area inside the loop.', 'Area = (3 − 1) × 10⁻³ m³ × (200 − 100) × 10³ Pa = 200 J.', 'The cycle runs clockwise on P–V axes, so the gas does net work, 200 J, on its surroundings.'], {
    shown: graph('volume (L)', 'pressure (kPa)', [{ points: [[1, 200], [3, 200], [3, 100], [1, 100], [1, 200]] }], { x: [[1, '1'], [3, '3']], y: [[100, '100'], [200, '200']] }),
  }),
  figure(T(3, 1), 'Draw a block diagram of a heat engine, showing the hot and cold reservoirs and the flow of heat and work, and write its efficiency.', ['The engine takes heat Q₁ from the hot reservoir at T₁.', 'It does work W and gives out heat Q₂ to the cold reservoir at T₂, with W = Q₁ − Q₂.', 'Its efficiency is W/Q₁ = 1 − Q₂/Q₁.'], {
    answer: sketch(300, 230, 'A box at the top, the hot reservoir at T1. An arrow Q1 goes down to a circle, the engine. An arrow W goes from the engine to the right. An arrow Q2 goes down from the engine to a box at the bottom, the cold reservoir at T2.', [
      { t: 'box', x: 80, y: 10, w: 120, h: 34 }, label(140, 32, 'hot, T₁'),
      arrow([140, 44], [140, 92]), label(146, 72, 'Q₁', 'start'),
      { t: 'circle', x: 140, y: 120, r: 28 }, label(140, 124, 'engine'),
      arrow([168, 120], [250, 120]), label(209, 112, 'W'),
      arrow([140, 148], [140, 180]), label(146, 168, 'Q₂', 'start'),
      { t: 'box', x: 80, y: 180, w: 120, h: 34 }, label(140, 202, 'cold, T₂'),
    ]),
  }),

  predict(T(2, 1), 'A gas in a well-insulated cylinder is quickly compressed. Predict what happens to its temperature, and why.', 'Its temperature rises.', 'No heat can leave, so the work done on the gas goes into its internal energy: an adiabatic compression.'),
  predict(T(2, 1), 'Bodies A and B are each in thermal equilibrium with body C. Predict how A and B will behave when put in contact, and name the law.', 'No heat flows between A and B: they are already in thermal equilibrium.', 'This is the zeroth law, which lets temperature be defined.'),
  predict(T(2, 2), 'A refrigerator runs with its door open in a closed, insulated room. Predict what happens to the temperature of the room.', 'It slowly rises.', 'The refrigerator moves heat from inside to outside, but also gives out the work done by its motor as heat, so the room gains energy.'),

  odd(T(2, 2), ['an isothermal expansion of an ideal gas', 'one complete cycle', 'an isothermal compression of an ideal gas', 'an adiabatic expansion'], 'an adiabatic expansion', 'Its internal energy changes, as the gas cools; in the others the internal energy is unchanged.'),
  odd(T(2, 1), ['internal energy', 'temperature', 'pressure', 'work'], 'work', 'It depends on the path taken; the others depend only on the state.'),
  odd(T(2, 2), ['a slow, frictionless compression', 'heat flowing from a hot body to a cold one', 'a gas rushing into a vacuum', 'two gases mixing'], 'a slow, frictionless compression', 'It is reversible; the others are irreversible.'),

  long(T(5, 1), 'Answer each part using the first law, ΔQ = ΔU + ΔW.\n(a) A gas takes in 500 J of heat and does 200 J of work. Find the change in its internal energy. [1]\n(b) A gas is compressed with 150 J of work done on it, and gives out 50 J of heat. Find the change in its internal energy. [2]\n(c) Explain the signs used for ΔQ and ΔW. [2]', '(a) ΔU = ΔQ − ΔW = 500 − 200 = 300 J.', '(b) ΔQ = −50 J and ΔW = −150 J, as work is done on the gas.', '(b) ΔU = −50 − (−150) = +100 J.', '(c) ΔQ is positive when heat goes into the gas.', '(c) ΔW is positive when the gas does work on its surroundings, by expanding.'),
  long(T(5, 2), 'A Carnot engine works between 500 K and 300 K.\n(a) Find its efficiency. [1]\n(b) It takes in 1000 J of heat in each cycle. Find the work done and the heat given out. [2]\n(c) To what temperature must the sink be lowered for an efficiency of 50%? [2]', '(a) η = 1 − 300/500 = 0.4, or 40%.', '(b) W = 0.4 × 1000 = 400 J.', '(b) Heat given out = 1000 − 400 = 600 J.', '(c) 1 − T₂/500 = 0.5.', '(c) T₂ = 250 K.'),
  long(T(5, 3), 'Answer each part on isothermal and adiabatic changes of an ideal gas.\n(a) Write the equation linking P and V for each. [2]\n(b) Show that, at a given point, the slope of the adiabatic curve is γ times that of the isothermal one. [2]\n(c) Which curve is steeper, and why? [1]', '(a) Isothermal: PV = constant.', '(a) Adiabatic: PV^γ = constant.', '(b) From PV = constant, dP/dV = −P/V.', '(b) From PV^γ = constant, dP/dV = −γP/V, which is γ times as large.', '(c) The adiabatic curve, as γ > 1: in an adiabatic compression the gas also warms up.'),

  tell(T(2, 1), 'Distinguish between reversible and irreversible processes, with an example of each.', 'A reversible process can be run backwards through the same states, leaving no change anywhere; a very slow, frictionless compression comes close.', 'An irreversible process can’t be undone in that way; heat flowing from a hot to a cold body is one.'),
  tell(T(2, 1), 'Distinguish between heat and internal energy.', 'Heat is energy passing between bodies because of a difference in temperature.', 'Internal energy is the total energy of the molecules of a body, which depends on its state.'),
  tell(T(2, 1), 'Distinguish between isobaric and isochoric processes.', 'In an isobaric process the pressure stays constant, and the work done is PΔV.', 'In an isochoric process the volume stays constant, so no work is done and ΔQ = ΔU.'),

  match(T(4, 1), [['Isothermal', 'temperature constant'], ['Adiabatic', 'no heat exchanged'], ['Isobaric', 'pressure constant'], ['Isochoric', 'volume constant']]),
  match(T(4, 2), [['The zeroth law', 'defines temperature through thermal equilibrium'], ['The first law', 'ΔQ = ΔU + ΔW'], ['The second law', 'no engine can turn all its heat into work'], ['The efficiency of a Carnot engine', '1 − T₂/T₁']]),
  match(T(4, 2), [['A change at constant volume', 'no work done'], ['An expansion at constant pressure', 'W = PΔV'], ['An isothermal expansion of n moles', 'W = nRT ln(V₂/V₁)'], ['One complete cycle', 'net work equals net heat taken in']]),

  ar(T(1, 1), 'No work is done in a change at constant volume.', 'The volume doesn’t change.', 1, 'Work is PΔV, which is zero when ΔV = 0.'),
  ar(T(1, 1), 'Heat can flow by itself from a cold body to a hot one.', 'The second law of thermodynamics forbids this.', 4, 'Heat flows by itself only from hot to cold.'),
  ar(T(1, 2), 'Internal energy is a function of state.', 'The work done depends on the path taken.', 2, 'Both are true, but internal energy is a function of state because it depends only on the gas’s condition, not on how it got there.'),
];

export default questions;
