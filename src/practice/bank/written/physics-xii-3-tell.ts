// Written by hand: moving charges and magnetism, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('physics', 'XII');
const A = at(3, 'a');

const questions: BankDef[] = [
  tell(A(2, 3), 'Distinguish between a moving coil galvanometer and an ammeter made from it.', 'A galvanometer detects small currents, and its resistance is moderate.', 'An ammeter has a low shunt in parallel with the coil, so it measures large currents, and its resistance is very low.'),
];

export default questions;
