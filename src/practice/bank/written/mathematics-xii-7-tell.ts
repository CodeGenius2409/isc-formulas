// Written by hand: probability, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('mathematics', 'XII');
const P = at(7, 'a');

const questions: BankDef[] = [
  tell(P(2, 1), 'Distinguish between $P(A \\cap B)$ and $P(A | B)$.', '$P(A \\cap B)$ is the chance that both happen, out of all outcomes.', '$P(A | B)$ is the chance that $A$ happens among only the outcomes where $B$ does: $\\frac{P(A \\cap B)}{P(B)}$.'),
  tell(P(2, 2), 'Distinguish between drawing with and without replacement.', 'With replacement, each draw is from the same set, so the draws are independent.', 'Without replacement, each draw changes what is left, so the probabilities change from draw to draw.'),
  tell(P(2, 3), 'Distinguish between the total probability theorem and Bayes’ theorem.', 'Total probability finds $P(A)$ from the ways it can happen: $\\sum P(E_i)P(A | E_i)$.', 'Bayes’ theorem works backwards, finding $P(E_i | A)$, the chance that a given cause led to $A$.'),
];

export default questions;
