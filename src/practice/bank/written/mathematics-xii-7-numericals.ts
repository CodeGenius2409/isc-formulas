// Written by hand: numericals on probability, for Mathematics XII at 0% generated. The answers are computed separately in
// tests/unit/written-answers.test.ts. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { theory } = bank('mathematics', 'XII');
const n = (place: Place, text: string, points: (string | [string, number])[]) => theory('short', place, text, points, { format: 'numerical' });
const P = (marks: number, d: 1 | 2 | 3): Place => [7, 'a', marks, d];

const questions: BankDef[] = [
  n(P(1, 1), 'If $P(A) = 0.5$ and $P(B | A) = 0.4$, find $P(A \\cap B)$.', ['$0.5 \\times 0.4 = 0.2$.']),
  n(P(1, 1), 'A binomial distribution has $n = 10$ and $p = 0.3$. Find its mean.', ['$np = 3$.']),
  n(P(2, 2), 'Two cards are drawn without replacement from a pack of 52. Find the probability that both are aces.', ['$\\frac{4}{52} \\times \\frac{3}{51}$.', 'This is $\\frac{1}{221}$.']),
  n(P(2, 1), 'Two fair coins are tossed, and $X$ is the number of heads. Find the mean of $X$.', ['$P(X = 0, 1, 2)$ are $\\frac{1}{4}, \\frac{1}{2}, \\frac{1}{4}$.', 'The mean is $1$.']),
  n(P(2, 1), 'If $P(A) = 0.6$, $P(B) = 0.5$, and $A$ and $B$ are independent, find $P(A \\cup B)$.', ['$P(A \\cap B) = 0.3$.', '$0.6 + 0.5 - 0.3 = 0.8$.']),
  n(P(3, 2), 'Bag I has 3 red and 2 black balls, and bag II has 1 red and 4 black. A bag is chosen at random, and a ball drawn is red. Find the probability that it came from bag I.', ['$P(\\text{red}) = \\frac{1}{2} \\cdot \\frac{3}{5} + \\frac{1}{2} \\cdot \\frac{1}{5} = \\frac{2}{5}$.', 'By Bayes’ theorem, divide $\\frac{1}{2} \\cdot \\frac{3}{5}$ by this.', 'The probability is $\\frac{3}{4}$.']),
  n(P(3, 2), '$X$ takes the values 0, 1, 2 with probabilities $\\frac{1}{4}, \\frac{1}{2}, \\frac{1}{4}$. Find the variance of $X$.', ['The mean is 1.', '$E(X^2) = 0 + \\frac{1}{2} + 1 = \\frac{3}{2}$.', 'The variance is $\\frac{3}{2} - 1 = \\frac{1}{2}$.']),
  n(P(3, 1), 'A fair coin is tossed 4 times. Find the probability of exactly 2 heads.', ['This is binomial, with $n = 4$ and $p = \\frac{1}{2}$.', '$\\binom{4}{2}\\left(\\frac{1}{2}\\right)^4 = \\frac{6}{16}$.', 'This is $\\frac{3}{8}$.']),
  n(P(5, 3), 'Factory A makes 60% of a firm’s phones, of which 2% are faulty. Factory B makes the rest, of which 3% are faulty. (i) Draw a tree. (ii) Find the probability that a phone is faulty. (iii) A faulty phone is found. Find the probability that it’s from factory B.', ['(i) A tree with branches 0.6 and 0.4, then faulty or not.', '(ii) $0.6 \\times 0.02 + 0.4 \\times 0.03$.', 'That is $0.012 + 0.012 = 0.024$.', '(iii) By Bayes’ theorem, $\\frac{0.012}{0.024}$.', 'This is $0.5$.']),
  n(P(5, 2), 'A die is thrown twice, and $X$ is the number of sixes. (i) Find the probability distribution of $X$. (ii) Find the mean of $X$.', ['$P(X = 0) = \\frac{25}{36}$.', '$P(X = 1) = \\frac{10}{36}$.', '$P(X = 2) = \\frac{1}{36}$.', 'The mean is $\\frac{10}{36} + \\frac{2}{36} = \\frac{12}{36}$.', 'This is $\\frac{1}{3}$.']),
];

export default questions;
