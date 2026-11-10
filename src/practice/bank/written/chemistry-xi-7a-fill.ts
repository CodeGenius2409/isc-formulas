// Written by hand: redox reactions, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar } = kit('chemistry', 'XI');
const R = at(7, 'a');

const questions: BankDef[] = [
  predict(R(2, 1), 'A zinc rod is left in blue copper sulphate solution. Predict what is seen, and which substance is oxidised.', 'A reddish-brown layer of copper forms on the rod, and the blue colour fades.', 'Zinc is oxidised to Zn²⁺, and Cu²⁺ is reduced to copper: Zn + Cu²⁺ → Zn²⁺ + Cu.'),
  predict(R(2, 1), 'A copper wire is put in silver nitrate solution. Predict what is seen, and write the ionic equation.', 'Shiny silver forms on the wire, and the solution slowly turns blue.', 'Cu + 2Ag⁺ → Cu²⁺ + 2Ag.'),
  predict(R(2, 2), 'An iron nail is put in zinc sulphate solution. Predict whether any reaction happens, and explain.', 'No reaction happens.', 'Zinc is more reactive than iron, so iron can’t give its electrons to Zn²⁺ and reduce it.'),

  odd(R(2, 1), ['H₂SO₄', 'SO₃', 'SO₂', 'Na₂SO₄'], 'SO₂', 'Its sulphur has the oxidation number +4; in the others it is +6.'),
  odd(R(2, 2), ['NaCl dissolving in water', 'Zn + CuSO₄ → ZnSO₄ + Cu', '2H₂ + O₂ → 2H₂O', 'Fe + 2HCl → FeCl₂ + H₂'], 'NaCl dissolving in water', 'No oxidation number changes, so it isn’t a redox change; the others are redox reactions.'),
  odd(R(2, 1), ['KMnO₄', 'K₂Cr₂O₇', 'dilute H₂SO₄', 'O₃'], 'dilute H₂SO₄', 'It acts as an acid; the others are strong oxidising agents.'),

  long(R(5, 3), 'Balance the reaction of copper with nitrate ions in acid, Cu + NO₃⁻ → Cu²⁺ + NO, by the oxidation number method.', 'Cu goes from 0 to +2, losing 2 electrons; N goes from +5 to +2, gaining 3.', 'To make the electrons equal, take 3 Cu for every 2 NO₃⁻: 3Cu + 2NO₃⁻ → 3Cu²⁺ + 2NO.', 'Oxygen: 6 on the left and 2 on the right, so add 4H₂O on the right.', 'Hydrogen: add 8H⁺ on the left.', '3Cu + 2NO₃⁻ + 8H⁺ → 3Cu²⁺ + 2NO + 4H₂O, with a charge of +6 on each side.'),

  tell(R(2, 1), 'Distinguish between an oxidising agent and a reducing agent.', 'An oxidising agent takes electrons from another substance, and is itself reduced.', 'A reducing agent gives electrons to another substance, and is itself oxidised.'),
  tell(R(2, 2), 'Distinguish between oxidation number and valency.', 'Oxidation number is the charge an atom would have if all its bonds were ionic; it can be positive, negative, zero or a fraction.', 'Valency is the number of bonds an atom forms, a whole number with no sign.'),
  tell(R(2, 2), 'Distinguish between an ordinary redox reaction and a disproportionation reaction.', 'In an ordinary redox reaction, one substance is oxidised and a different one is reduced.', 'In a disproportionation reaction, the same element is both oxidised and reduced, as chlorine is with cold NaOH.'),

  match(R(4, 1), [['Cr in K₂Cr₂O₇', '+6'], ['Mn in KMnO₄', '+7'], ['O in H₂O₂', '−1'], ['N in NH₃', '−3']]),
  match(R(4, 2), [['2Na + Cl₂ → 2NaCl', 'combination'], ['2H₂O₂ → 2H₂O + O₂', 'disproportionation'], ['Zn + CuSO₄ → ZnSO₄ + Cu', 'displacement'], ['2KClO₃ → 2KCl + 3O₂', 'decomposition']]),
  match(R(4, 2), [['Fe²⁺ → Fe³⁺', 'oxidation, losing 1 electron'], ['MnO₄⁻ → Mn²⁺', 'reduction, gaining 5 electrons'], ['Cr₂O₇²⁻ → 2Cr³⁺', 'reduction, gaining 6 electrons'], ['2I⁻ → I₂', 'oxidation, losing 2 electrons']]),

  reason(R(2, 1), 'Why does fluorine always have the oxidation number −1 in its compounds?', 'Fluorine is the most electronegative element.', 'So in every bond it takes the shared electrons, and needs only one more to complete its octet.'),
  reason(R(2, 2), 'Why can SO₂ act as both an oxidising and a reducing agent?', 'Sulphur in SO₂ has the oxidation number +4.', 'This lies between its lowest, −2, and its highest, +6, so it can be reduced or oxidised.'),
  reason(R(2, 1), 'Why do the oxidation numbers in a neutral compound add up to zero?', 'Each oxidation number is the charge an atom would carry.', 'A neutral compound has no overall charge, so the charges must cancel.'),

  short(R(2, 1), 'Find the oxidation number of Cr in K₂Cr₂O₇ and of S in Na₂S₂O₃.', 'K₂Cr₂O₇: 2(+1) + 2x + 7(−2) = 0, so x = +6.', 'Na₂S₂O₃: 2(+1) + 2y + 3(−2) = 0, so y = +2.'),

  ar(R(1, 1), 'In 2Mg + O₂ → 2MgO, magnesium is oxidised.', 'Its oxidation number rises from 0 to +2.', 1, 'A rise in oxidation number is oxidation.'),
  ar(R(1, 2), 'H₂O₂ acts only as an oxidising agent.', 'Oxygen in H₂O₂ has the oxidation number −1.', 4, 'With oxygen at −1, between −2 and 0, H₂O₂ can act as either an oxidising or a reducing agent.'),
  ar(R(1, 2), 'Hydrogen has the oxidation number −1 in NaH.', 'Hydrogen is placed in group 1 of the periodic table.', 2, 'Both are true, but it is −1 because hydrogen is more electronegative than sodium.'),
];

export default questions;
