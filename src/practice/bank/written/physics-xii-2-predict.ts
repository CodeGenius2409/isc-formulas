// Written by hand: current electricity, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('physics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  predict(A(2, 1), 'A wire is stretched to twice its length, keeping its volume the same. Predict its new resistance and resistivity.', 'Its area halves, so R = ρl/A becomes four times as large.', 'Its resistivity doesn’t change, as it is a property of the material.'),
  predict(A(2, 2), 'The potential difference across a copper wire is doubled, at the same temperature. Predict what happens to the drift speed of its electrons and to the current.', 'The field in the wire doubles, so the drift speed doubles.', 'The current, neAv_d, doubles too.'),
  predict(A(2, 2), 'A copper wire and a silicon strip are both cooled from room temperature. Predict how the resistance of each changes, and why.', 'The copper’s falls, as its ions vibrate less and electrons collide less often.', 'The silicon’s rises, as fewer electrons have the energy to become free carriers.'),
  predict(A(3, 3), 'Two bulbs, 60 W and 100 W, both for 220 V, are joined in series across 220 V. Predict which glows brighter, and why.', 'The 60 W bulb has the larger resistance, as R = V²/P.', 'In series both carry the same current, so the power I²R is greater in the larger resistance.', 'So the 60 W bulb glows brighter.'),
  predict(A(2, 3), 'A wire of the same length and material, but twice the diameter, replaces a heater’s element on the same supply. Predict what happens to the power.', 'The area is four times as large, so the resistance is a quarter.', 'P = V²/R, so the power becomes four times as great.'),
  predict(B(2, 1), 'In a balanced Wheatstone bridge, the galvanometer and the cell are swapped. Predict whether the bridge stays balanced.', 'Yes, it stays balanced.', 'The balance condition P/Q = R/S doesn’t depend on which arms hold the cell and galvanometer.'),
  predict(B(2, 2), 'In a potentiometer, the current in the main wire is reduced. Predict what happens to the balancing length for a given cell, and to the sensitivity.', 'The fall of potential per unit length drops, so the balancing length grows.', 'A longer length for the same emf means the potentiometer is more sensitive.'),
  predict(B(2, 2), 'A cell is joined to a resistor, and the resistor is then made smaller and smaller. Predict what happens to the terminal voltage and the current.', 'The current rises, towards E/r.', 'The terminal voltage, E − Ir, falls towards zero.'),
  predict(B(3, 3), 'In a metre bridge, the unknown resistance and the known one are swapped. Predict where the new balance point is, and how that helps.', 'The balance point moves to 100 − l, where l was the first one.', 'Taking the mean of the two results cancels end errors at the bridge’s ends.', 'It gives a more reliable value of the unknown resistance.'),
  predict(B(2, 3), 'Two cells of equal emf but different internal resistances are joined in parallel, with nothing else in the circuit. Predict whether a current flows between them.', 'No current flows.', 'Round their loop the two emfs are equal and opposite, so nothing drives a current; only unequal emfs would.'),
];

export default questions;
