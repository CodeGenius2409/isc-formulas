// Written by hand: probability, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('mathematics', 'XII');
const P = at(7, 'a');

const questions: BankDef[] = [
  odd(P(2, 1), ['0', '0.5', '1', '1.2'], '1.2', 'It can’t be a probability, which lies between 0 and 1; the others can.'),
  odd(P(2, 2), ['$P(A \\cap B) = P(A)P(B)$', '$P(A | B) = P(A)$', '$P(B | A) = P(B)$', '$P(A \\cap B) = 0$'], '$P(A \\cap B) = 0$', 'It means the events are mutually exclusive; the others each mean they are independent.'),
  odd(P(2, 2), ['tossing a coin twice', 'drawing two balls with replacement', 'rolling two dice', 'drawing two cards without replacement'], 'drawing two cards without replacement', 'Its two draws are not independent; in the others they are.'),
  odd(P(2, 3), ['Bayes’ theorem', 'total probability', 'multiplication theorem', 'mean of a random variable'], 'mean of a random variable', 'It is about a random variable’s distribution; the others are about the probabilities of events.'),
  odd(P(2, 3), ['$\\{0.2, 0.3, 0.5\\}$', '$\\{0.1, 0.1, 0.8\\}$', '$\\{0.25, 0.25, 0.5\\}$', '$\\{0.3, 0.3, 0.3\\}$'], '$\\{0.3, 0.3, 0.3\\}$', 'Its probabilities add up to 0.9, so it isn’t a probability distribution; the others add up to 1.'),
];

export default questions;
