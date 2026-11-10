// Written by hand: moving charges and magnetism, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('physics', 'XII');
const A = at(3, 'a');

const questions: BankDef[] = [
  predict(A(2, 1), 'Two long parallel wires carry currents in opposite directions. Predict whether they attract or repel, and what happens if both currents are doubled.', 'They repel each other.', 'The force per unit length, μ₀I₁I₂/2πd, becomes four times as large.'),
  predict(A(2, 2), 'An electron and a proton enter the same uniform magnetic field at right angles to it, with the same speed. Predict which moves in the larger circle, and in which directions they turn.', 'The proton, as r = mv/qB and its mass is much larger.', 'They turn in opposite directions, as their charges are opposite.'),
  predict(A(2, 2), 'A charged particle moves in a circle in a uniform magnetic field. Predict what happens to its period if its speed is doubled.', 'It stays the same: T = 2πm/qB has no speed in it.', 'The radius doubles, so the longer path takes the same time.'),
  predict(A(3, 3), 'A galvanometer is turned into an ammeter by a shunt. Predict what happens to the meter’s range and to its resistance if the shunt is made smaller.', 'A smaller shunt takes a larger share of the current.', 'So a larger total current is needed for full-scale deflection: the range rises.', 'The ammeter’s total resistance falls, closer to the shunt’s.'),
  predict(A(2, 3), 'Uniform electric and magnetic fields E and B are at right angles to each other. A positive charge moves at right angles to both, in the direction in which their forces on it are opposite. Predict the speed at which it goes straight through, undeflected.', 'The electric force qE must balance the magnetic force qvB.', 'So v = E/B: faster charges are bent one way and slower ones the other.'),
];

export default questions;
