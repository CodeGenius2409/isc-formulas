// Written by hand: the semiconductor diode, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('physics', 'XII');
const B = at(9, 'b');

const questions: BankDef[] = [
  tell(B(2, 1), 'Distinguish between forward and reverse bias of a p–n junction.', 'Forward bias: p side to positive, which lowers the barrier, so a large current flows.', 'Reverse bias: p side to negative, which raises the barrier, so only a tiny current flows.'),
  tell(B(2, 2), 'Distinguish between a half-wave and a full-wave rectifier.', 'A half-wave rectifier uses one diode, and passes only one half of each cycle.', 'A full-wave rectifier uses two or four diodes, and turns both halves into output.'),
  tell(B(2, 2), 'Distinguish between an LED and a photodiode.', 'An LED works in forward bias, and gives out light when electrons and holes recombine.', 'A photodiode works in reverse bias, and its current rises when light falls on it.'),
  tell(B(2, 3), 'Distinguish between a solar cell and a photodiode.', 'A solar cell needs no bias and gives out an emf, turning light into electrical energy.', 'A photodiode is reverse biased by a battery, and is used to detect light.'),
  tell(B(3, 3), 'Distinguish between the reverse breakdown of an ordinary diode and of a Zener diode.', 'An ordinary diode breaks down at a high reverse voltage, and is usually damaged.', 'A Zener diode is heavily doped, so it breaks down at a low, sharp voltage, safely.', 'Its voltage then stays almost fixed, which is used to steady a supply.'),
];

export default questions;
