// Written by hand: the semiconductor diode, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('physics', 'XII');
const B = at(9, 'b');

const questions: BankDef[] = [
  ar(B(1, 1), 'A diode can be used as a rectifier.', 'It lets current through much more easily in one direction than the other.', 1, 'So only one half of each a.c. cycle passes.'),
  ar(B(1, 2), 'A photodiode is used in forward bias.', 'Light makes extra electron–hole pairs in the depletion region.', 4, 'A photodiode is used in reverse bias, where the small dark current makes the change from light easy to see.'),
  ar(B(1, 2), 'A Zener diode can keep a voltage steady.', 'In breakdown its voltage stays almost fixed over a wide range of current.', 1, 'Joined in reverse across a load, it takes up changes in current while the voltage stays at Vz.'),
  ar(B(1, 3), 'The depletion layer of a p–n junction widens in forward bias.', 'In forward bias the applied voltage opposes the barrier potential.', 4, 'Opposing the barrier makes the depletion layer narrower, not wider.'),
];

export default questions;
