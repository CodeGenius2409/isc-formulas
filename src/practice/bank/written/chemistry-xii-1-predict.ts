// Written by hand: solutions, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('chemistry', 'XII');
const A = at(1, 'a');

const questions: BankDef[] = [
  predict(A(2, 1), 'Equal numbers of moles of glucose and of NaCl are dissolved in equal amounts of water. Predict which solution freezes at the lower temperature.', 'The NaCl solution.', 'NaCl splits into two ions, so its van ’t Hoff factor is about 2, and the depression is about twice that of glucose.'),
  predict(A(2, 2), 'A red blood cell is placed in a strong salt solution. Predict what happens to it, and why.', 'It shrinks.', 'The salt solution is hypertonic, so water passes out of the cell by osmosis.'),
  predict(A(2, 2), 'A pressure greater than the osmotic pressure is applied to sea water, on the side of a semipermeable membrane away from pure water. Predict what happens.', 'Water flows out of the sea water into the pure water: reverse osmosis.', 'This is used to make drinking water from sea water.'),
  predict(A(3, 3), 'Ethanoic acid is dissolved in benzene, and its molar mass found from the freezing point. Predict how the result compares with 60 g mol⁻¹, and why.', 'It comes out near 120 g mol⁻¹, about twice the true value.', 'In benzene the acid molecules pair up as dimers through hydrogen bonds.', 'So there are half as many particles, the depression is halved, and the molar mass appears doubled.'),
  predict(A(2, 3), 'Predict how the solubility of oxygen in a lake changes on a hot summer day, and what this means for fish.', 'Less oxygen dissolves, as the solubility of gases falls when the temperature rises.', 'Fish may struggle to get enough oxygen.'),
];

export default questions;
