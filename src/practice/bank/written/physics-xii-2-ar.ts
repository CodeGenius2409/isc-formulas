// Written by hand: current electricity, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('physics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  ar(A(1, 1), 'The resistance of a metal wire rises when it is heated.', 'The electrons collide more often with the more strongly vibrating ions.', 1, 'More frequent collisions shorten the relaxation time, which raises the resistivity.'),
  ar(A(1, 2), 'A thick wire has a lower resistivity than a thin wire of the same metal.', 'Resistance is inversely proportional to the area of cross-section.', 4, 'Resistivity depends only on the material and temperature, not the wire’s size; it is the resistance that is lower.'),
  ar(A(1, 2), 'The drift speed of electrons in a wire is very small.', 'Electrons in a metal move at random at very high speeds.', 2, 'Both are true, but the drift speed is small because collisions keep interrupting the field’s push, not because of the random motion.'),
  ar(A(1, 3), 'Doubling the potential difference across a wire, at the same temperature, doubles the drift speed.', 'Drift speed is proportional to the electric field in the wire.', 1, 'v_d = eEτ/m, and E = V/l, so v_d doubles with V.'),
  ar(B(1, 2), 'A potentiometer can measure the emf of a cell more exactly than a voltmeter.', 'A potentiometer has a much higher resistance than a voltmeter.', 3, 'At balance a potentiometer draws no current from the cell, which is why it reads the true emf; its own resistance has nothing to do with it.'),
];

export default questions;
