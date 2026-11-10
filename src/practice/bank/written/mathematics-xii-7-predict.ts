// Written by hand: probability, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('mathematics', 'XII');
const P = at(7, 'a');

const questions: BankDef[] = [
  predict(P(2, 1), 'A fair coin has shown five heads in a row. Predict the probability that the next toss is a head.', '$\\frac{1}{2}$.', 'The tosses are independent, so earlier results don’t change the next one.'),
  predict(P(2, 2), 'Every value of a random variable $X$ is doubled. Predict what happens to its mean.', 'It doubles.', '$E(2X) = \\sum 2x_i p_i = 2E(X)$.'),
  predict(P(2, 2), 'Two events have $P(A) = 0.6$ and $P(B) = 0.7$. Predict whether they can be mutually exclusive.', 'No.', 'Then $P(A \\cup B)$ would be $1.3$, more than 1.'),
  predict(P(3, 3), 'A test for a rare disease is 99% accurate, and 1 person in 1000 has the disease. Predict roughly the chance that a person who tests positive has it, and explain.', 'Out of 100,000 people, about 100 have it, and 99 of them test positive.', 'Of the 99,900 without it, about 999 also test positive.', 'So only about $\\frac{99}{1098}$, roughly 9%, of positives have the disease.'),
  predict(P(2, 3), 'Predict $P(A | A \\cup B)$ when $A$ and $B$ are mutually exclusive, with $P(A) = 0.2$ and $P(B) = 0.3$.', '$A \\cap (A \\cup B) = A$, and $P(A \\cup B) = 0.5$.', 'So $P(A | A \\cup B) = \\frac{0.2}{0.5} = 0.4$.'),
];

export default questions;
