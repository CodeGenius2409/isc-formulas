// Written by hand: alternating current, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('physics', 'XII');
const B = at(4, 'b');

const questions: BankDef[] = [
  tell(B(2, 3), 'Distinguish between the apparent power and the true power in an a.c. circuit.', 'Apparent power is V_rms I_rms, in volt-amperes.', 'True power is V_rms I_rms cos φ, in watts, which is less unless the circuit is purely resistive.'),
];

export default questions;
