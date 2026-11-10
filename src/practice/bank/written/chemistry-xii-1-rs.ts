// Written by hand: solutions, short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { short } = kit('chemistry', 'XII');
const A = at(1, 'a');

const questions: BankDef[] = [
  short(A(2, 2), 'State Henry’s law. Why do divers breathe a mixture with helium rather than plain air at depth?', 'The solubility of a gas in a liquid is proportional to its partial pressure above the liquid.', 'At high pressure, nitrogen dissolves in the blood, and helium is far less soluble.'),
  short(A(3, 2), 'Give one example each of a solution of a gas in a liquid, of a solid in a solid and of a liquid in a solid.', 'Oxygen in water, or soda water.', 'An alloy such as brass.', 'Amalgam of mercury with sodium.'),
];

export default questions;
