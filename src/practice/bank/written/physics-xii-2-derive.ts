// Written by hand: current electricity, derivations not already in the bank. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { derive } = kit('physics', 'XII');
const A = at(2, 'a');

const questions: BankDef[] = [
  derive(A(3, 2), 'Obtain the mobility of free electrons in a conductor in terms of their relaxation time.', ['Mobility is drift velocity per unit field: μ = v_d/E.', 1], ['An electron accelerates at eE/m, and its drift velocity is v_d = eEτ/m.', 1], ['So μ = eτ/m.', 1]),
  derive(A(3, 3), 'Show that the heat produced in a resistor R carrying current I for time t is I²Rt.', ['In time t, a charge It passes through a potential difference V.', 1], ['The work done on it is W = VIt, all turned into heat in a resistor.', 1], ['With V = IR, H = I²Rt.', 1]),
];

export default questions;
