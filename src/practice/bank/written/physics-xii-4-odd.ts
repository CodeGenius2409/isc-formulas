// Written by hand: alternating current, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('physics', 'XII');
const B = at(4, 'b');

const questions: BankDef[] = [
  odd(B(2, 1), ['inductive reactance', 'capacitive reactance', 'impedance', 'power factor'], 'power factor', 'It has no unit; the others are measured in ohms.'),
  odd(B(2, 2), ['pure resistor', 'pure inductor', 'pure capacitor', 'LC circuit at resonance'], 'pure resistor', 'It takes power from the supply; the others take none on average.'),
  odd(B(2, 2), ['peak value', 'rms value', 'average over a whole cycle', 'average over a half cycle'], 'average over a whole cycle', 'It is zero for a sine wave; the others are not.'),
  odd(B(2, 3), ['henry', 'farad', 'ohm', 'hertz'], 'hertz', 'It is the unit of frequency; the others are units of the inductance, capacitance and resistance in a circuit.'),
  odd(B(2, 3), ['ωL', '1/ωC', 'R', '1/2π√(LC)'], '1/2π√(LC)', 'It is a frequency; the others are oppositions to current, in ohms.'),
];

export default questions;
