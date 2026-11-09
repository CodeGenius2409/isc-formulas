// Written by hand: Vitamins. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, theory } = bank('chemistry', 'XII');
const V = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [10, 'c', marks, d];

const questions: BankDef[] = [
  mcq(V(1, 1), 'Which vitamin’s deficiency causes scurvy?', ['A', 'C', 'D', 'K'], 1),
  mcq(V(1, 2), 'Which group is all fat-soluble?', ['A, D, E and K', 'B₁, B₂, C and D', 'B₁₂, C, E and K', 'A, B₁, C and K'], 0),
  theory('reason', V(1, 2), 'Give a reason: water-soluble vitamins must be taken regularly in the diet.', ['They aren’t stored much in the body, and the excess passes out in urine.']),
  theory('short', V(2, 2), 'Name the disease caused by a deficiency of (i) vitamin B₁ and (ii) vitamin D.', ['(i) Beriberi.', '(ii) Rickets.']),
];

export default questions;
