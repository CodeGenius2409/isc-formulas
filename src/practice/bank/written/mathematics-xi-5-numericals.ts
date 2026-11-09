// Written by hand: numericals on statistics and probability, for Mathematics XI at 0% generated. The answers are computed separately
// in tests/unit/written-answers.test.ts. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { theory } = bank('mathematics', 'XI');
const n = (place: Place, text: string, points: (string | [string, number])[]) => theory('short', place, text, points, { format: 'numerical' });
const S = (marks: number, d: 1 | 2 | 3): Place => [5, 'a', marks, d];
const P = (marks: number, d: 1 | 2 | 3): Place => [5, 'b', marks, d];

const questions: BankDef[] = [
  // ---- 5a Statistics
  n(S(1, 1), 'Find the mean of 2, 4, 6, 8, 10.', ['$\\frac{30}{5} = 6$.']),
  n(S(1, 1), 'Find the median of 3, 1, 7, 5, 9.', ['In order: 1, 3, 5, 7, 9, so the median is $5$.']),
  n(S(2, 1), 'Find the variance of 2, 4, 6, 8, 10.', ['The mean is 6, and the squared differences add to 40.', 'The variance is $\\frac{40}{5} = 8$.']),
  n(S(2, 1), 'Find the mean deviation about the mean of 2, 4, 6, 8, 10.', ['The differences from 6 add to 12.', 'The mean deviation is $\\frac{12}{5}$.']),
  n(S(2, 2), 'The mean of 5 numbers is 12. A sixth number, 18, is added. Find the new mean.', ['The total becomes $60 + 18 = 78$.', 'The new mean is $13$.']),
  n(S(3, 1), 'Values 1, 2, 3 have frequencies 2, 3, 5. Find the mean.', ['$\\sum fx = 2 + 6 + 15 = 23$.', '$\\sum f = 10$.', 'The mean is $2.3$.']),
  n(S(3, 2), 'Values 1, 2, 3 have frequencies 2, 3, 5. Find the variance.', ['The mean is 2.3.', '$\\sum fx^2 = 2 + 12 + 45 = 59$, and dividing by 10 gives 5.9.', 'The variance is $5.9 - 5.29 = 0.61$.']),
  n(S(3, 2), 'Every value in a set is multiplied by 3. The old variance was 4. Find the new standard deviation.', ['The variance is multiplied by $3^2$, so it’s 36.', 'The standard deviation is its square root.', 'This is $6$.']),
  n(S(5, 3), 'Two classes have 20 and 30 students, with means of 60 and 70. Their variances are 16 and 25. Find the combined mean, and the combined variance.', ['The combined mean is $\\frac{1200 + 2100}{50} = 66$.', 'The differences of the means from 66 are 6 and 4.', 'The combined variance is $\\frac{20(16 + 36) + 30(25 + 16)}{50}$.', 'That is $\\frac{1040 + 1230}{50}$.', 'This is $45.4$.']),
  n(S(5, 2), 'The marks of 5 students are 40, 50, 60, 70, 80. (i) Find the mean. (ii) Find the variance. (iii) If each mark rises by 5, find the new mean. (iv) Find the new variance. (v) If instead each mark is doubled, find the new variance.', ['(i) 60.', '(ii) The squared differences add to 1000, so the variance is 200.', '(iii) 65.', '(iv) Adding a constant leaves it unchanged, at 200.', '(v) Doubling multiplies it by 4, which gives $800$.']),
  // ---- 5b Probability
  n(P(1, 1), 'A fair die is thrown. Find the probability of an even number.', ['$\\frac{3}{6} = \\frac{1}{2}$.']),
  n(P(1, 1), 'A card is drawn from a pack of 52. Find the probability that it’s a king.', ['$\\frac{4}{52} = \\frac{1}{13}$.']),
  n(P(2, 1), 'Two dice are thrown. Find the probability that the sum is 7.', ['Six of the 36 outcomes give 7.', 'This is $\\frac{1}{6}$.']),
  n(P(2, 1), 'If $P(A) = 0.5$, $P(B) = 0.4$ and $P(A \\cap B) = 0.2$, find $P(A \\cup B)$.', ['$0.5 + 0.4 - 0.2$.', 'This is $0.7$.']),
  n(P(2, 2), 'Two fair coins are tossed. Find the probability of at least one head.', ['Only one of the four outcomes has none.', 'So it’s $\\frac{3}{4}$.']),
  n(P(3, 2), 'A bag has 5 red and 3 black balls. Two are drawn together. Find the probability that both are red.', ['${}^{5}C_2 = 10$ ways of drawing two red.', '${}^{8}C_2 = 28$ ways in all.', 'So it’s $\\frac{10}{28} = \\frac{5}{14}$.']),
  n(P(3, 1), 'A number from 1 to 20 is chosen at random. Find the probability that it’s a multiple of 3 or 5.', ['Multiples of 3: 6. Multiples of 5: 4.', 'Multiples of both: only 15.', 'So it’s $\\frac{9}{20}$.']),
  n(P(3, 2), 'Three fair coins are tossed. Find the probability of exactly two heads.', ['There are 8 equally likely outcomes.', 'Three of them have exactly two heads.', 'So it’s $\\frac{3}{8}$.']),
  n(P(5, 2), 'A committee of 4 is chosen at random from 6 men and 4 women. Find the probability that it has exactly 2 women.', ['In all: ${}^{10}C_4 = 210$.', '2 women: ${}^{4}C_2 = 6$.', '2 men: ${}^{6}C_2 = 15$.', 'So 90 of them have exactly 2 women.', 'The probability is $\\frac{3}{7}$.']),
  n(P(5, 3), 'Three cards are drawn together from a pack of 52. (i) Find the number of possible draws. (ii) Find the number that are all aces. (iii) Find the probability of no ace, as a fraction. (iv) Find the probability of three aces.', ['(i) ${}^{52}C_3 = 22100$.', '(ii) ${}^{4}C_3 = 4$.', '(iii) $\\frac{{}^{48}C_3}{22100} = \\frac{17296}{22100}$.', '(iv) $\\frac{4}{22100}$.', 'This is $\\frac{1}{5525}$.']),
];

export default questions;
