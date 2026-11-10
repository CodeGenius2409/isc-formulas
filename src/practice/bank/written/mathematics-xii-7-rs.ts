// Written by hand: probability, reasons. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason } = kit('mathematics', 'XII');
const P = at(7, 'a');

const questions: BankDef[] = [
  reason(P(1, 1), 'Explain why $P(A | B)$ is not defined when $P(B) = 0$.', '$P(A | B) = \\frac{P(A \\cap B)}{P(B)}$, which would mean dividing by zero.'),
  reason(P(2, 2), 'Explain why, if $A$ and $B$ are independent, $A$ and $B\'$ are independent too.', '$P(A \\cap B\') = P(A) - P(A \\cap B) = P(A) - P(A)P(B)$.', 'That is $P(A)(1 - P(B)) = P(A)P(B\')$.'),
  reason(P(2, 3), 'Explain why Bayes’ theorem needs the events $E_1, E_2, \\ldots$ to be mutually exclusive and together exhaustive.', 'The theorem uses the total probability $P(A) = \\sum P(E_i)P(A | E_i)$.', 'That sum counts every way $A$ can happen exactly once only if the $E_i$ don’t overlap and cover every case.'),
  reason(P(1, 2), 'Explain why the mean of a random variable need not be one of the values it takes.', 'The mean is a weighted average, so it can fall between values, as 3.5 does for a die.'),
];

export default questions;
