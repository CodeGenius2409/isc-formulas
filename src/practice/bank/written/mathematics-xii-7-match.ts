// Written by hand: probability, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('mathematics', 'XII');
const P = at(7, 'a');

const questions: BankDef[] = [
  match(P(3, 1), [['$P(A | B)$', '$\\frac{P(A \\cap B)}{P(B)}$'], ['$P(A \\cap B)$ for independent events', '$P(A)P(B)$'], ['$P(A \\cap B)$ for mutually exclusive events', '0']]),
  match(P(4, 2), [['Total probability', '$\\sum P(E_i)P(A | E_i)$'], ['Bayes’ theorem', '$\\frac{P(E_i)P(A | E_i)}{\\sum P(E_j)P(A | E_j)}$'], ['Mean of a random variable', '$\\sum x_i p_i$'], ['Multiplication theorem', '$P(A)P(B | A)$']]),
  match(P(3, 2), [['A fair die, the mean score', '3.5'], ['A fair coin tossed twice, the mean number of heads', '1'], ['Two fair dice, the mean total', '7']]),
  match(P(4, 3), [['$P(A) = 0.5$, $P(B) = 0.4$, independent: $P(A \\cap B)$', '0.2'], ['The same events: $P(A \\cup B)$', '0.7'], ['The same events: $P(A\' \\cap B\')$', '0.3'], ['The same events: $P(A | B)$', '0.5']]),
  match(P(3, 3), [['$A$ and $B$ independent', '$A\'$ and $B\'$ are independent'], ['$P(A | B) = 1$', '$B$ lies inside $A$'], ['$P(B | A) = 0$, with $P(A) > 0$', '$A$ and $B$ can’t happen together']]),
];

export default questions;
