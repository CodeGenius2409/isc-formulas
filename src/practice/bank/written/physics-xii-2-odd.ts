// Written by hand: current electricity, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('physics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  odd(A(2, 1), ['copper', 'silver', 'aluminium', 'silicon'], 'silicon', 'It is a semiconductor, whose resistance falls as it warms; the others are metals.'),
  odd(A(2, 2), ['resistance', 'resistivity', 'current', 'drift velocity'], 'drift velocity', 'It is a vector; the others are scalars.'),
  odd(A(2, 2), ['nichrome', 'manganin', 'constantan', 'copper'], 'copper', 'Its resistance changes a lot with temperature; the others are alloys whose resistance barely changes.'),
  odd(A(2, 3), ['Ω m', 'V m A⁻¹', 'kg m³ s⁻³ A⁻²', 'Ω m⁻¹'], 'Ω m⁻¹', 'It isn’t a unit of resistivity; the others are.'),
  odd(A(2, 3), ['length of a wire', 'area of the wire', 'temperature', 'current through it'], 'current through it', 'An ohmic wire’s resistance doesn’t depend on the current; the others change it.'),
  odd(B(2, 1), ['metre bridge', 'Wheatstone bridge', 'potentiometer', 'voltmeter'], 'voltmeter', 'It draws current from what it measures; the others are null methods, read when no current flows in the galvanometer.'),
  odd(B(2, 2), ['emf', 'terminal voltage', 'potential difference', 'internal resistance'], 'internal resistance', 'It is measured in ohms; the others are measured in volts.'),
  odd(B(2, 2), ['junction rule', 'loop rule', 'Ohm’s law', 'conservation of charge'], 'Ohm’s law', 'It holds only for some conductors; the others hold for every circuit.'),
  odd(B(2, 3), ['potential gradient', 'balancing length', 'jockey', 'shunt'], 'shunt', 'It belongs to an ammeter; the others belong to the potentiometer.'),
  odd(B(2, 3), ['Daniell cell', 'dry cell', 'lead accumulator', 'potentiometer'], 'potentiometer', 'It measures an emf; the others are sources of emf.'),
];

export default questions;
