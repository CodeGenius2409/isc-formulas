// Written by hand: Batteries and corrosion. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, theory } = bank('chemistry', 'XII');
const B = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [2, 'c', marks, d];

const questions: BankDef[] = [
  mcq(B(1, 1), 'In a dry cell, the anode is:', ['a carbon rod', 'the zinc container', 'manganese dioxide', 'ammonium chloride'], 1),
  theory('short', B(2, 2), 'Write the overall reaction in a lead accumulator on discharge.', ['Pb + PbO₂ + 2H₂SO₄ →', '2PbSO₄ + 2H₂O.']),
  theory('reason', B(1, 2), 'Give a reason: a lead accumulator can be recharged, but a dry cell usually can’t.', ['The lead accumulator’s reactions are reversible, while a dry cell’s aren’t easily reversed.']),
];

export default questions;
