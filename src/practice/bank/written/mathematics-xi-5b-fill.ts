// Written by hand: probability, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XI');
const P = at(5, 'b');

const venn = (inside: SketchMark[]): SketchMark[] => [
  ...inside,
  { t: 'box', x: 20, y: 20, w: 270, h: 150 }, label(32, 38, 'S', 'start'),
  { t: 'circle', x: 120, y: 95, r: 55 }, { t: 'circle', x: 190, y: 95, r: 55 },
  label(78, 42, 'A'), label(232, 42, 'B'),
];

// The tree for three children: leaves 25 px apart, each parent halfway between its two children.
const leafY = (i: number) => 12 + 25 * i;
const tree = (): SketchMark[] => {
  const out: SketchMark[] = [];
  const node = (x: number, y: number, s: string) => out.push(label(x, y + 5, s));
  const edge = (x1: number, y1: number, x2: number, y2: number) => out.push(line([[x1 + 8, y1], [x2 - 8, y2]]));
  const ys = [Array.from({ length: 2 }, (_, i) => (leafY(4 * i) + leafY(4 * i + 3)) / 2), Array.from({ length: 4 }, (_, i) => (leafY(2 * i) + leafY(2 * i + 1)) / 2), Array.from({ length: 8 }, (_, i) => leafY(i))];
  const xs = [100, 180, 260];
  const rootY = (ys[0][0] + ys[0][1]) / 2;
  out.push({ t: 'dot', x: 20, y: rootY });
  ys.forEach((level, d) => level.forEach((y, i) => {
    node(xs[d], y, i % 2 === 0 ? 'B' : 'G');
    if (d === 0) out.push(line([[20, rootY], [xs[0] - 8, y]]));
    else edge(xs[d - 1], ys[d - 1][Math.floor(i / 2)], xs[d], y);
  }));
  ['BBB', 'BBG', 'BGB', 'BGG', 'GBB', 'GBG', 'GGB', 'GGG'].forEach((s, i) => out.push(label(290, leafY(i) + 5, s, 'start')));
  return out;
};

const questions: BankDef[] = [
  figure(P(3, 1), 'The Venn diagram shows the probabilities of the regions for two events $A$ and $B$ in a sample space $S$. Find $P(A)$, $P(B)$, $P(A \\cup B)$ and the probability that neither happens.', ['$P(A) = 0.3 + 0.2 = 0.5$ and $P(B) = 0.2 + 0.25 = 0.45$.', '$P(A \\cup B) = 0.3 + 0.2 + 0.25 = 0.75$.', 'Neither: $1 - 0.75 = 0.25$, the region outside both circles.'], {
    shown: sketch(310, 190, 'A rectangle S holds two overlapping circles, A and B. The part of A outside B is marked 0.3, the overlap 0.2, the part of B outside A 0.25, and the region outside both circles 0.25.', venn([label(92, 100, '0.3'), label(155, 100, '0.2'), label(218, 100, '0.25'), label(276, 160, '0.25', 'end')])),
  }),
  figure(P(3, 1), 'A family has three children, each equally likely to be a boy (B) or a girl (G). Draw a tree diagram, list the sample space, and find the probability of at least one girl.', ['The tree branches into B and G three times, giving 8 equally likely outcomes.', '$S = \\{BBB, BBG, BGB, BGG, GBB, GBG, GGB, GGG\\}$.', 'Only BBB has no girl, so $P(\\text{at least one girl}) = 1 - \\dfrac{1}{8} = \\dfrac{7}{8}$.'], {
    answer: sketch(340, 205, 'A tree growing to the right from a point. It splits into B and G for the first child, each of those splits into B and G for the second, and each again for the third, giving eight ends. The outcomes BBB, BBG, BGB, BGG, GBB, GBG, GGB and GGG are listed beside the ends.', tree()),
  }),
  figure(P(3, 2), 'The table gives the sum of the scores when two dice are thrown. Find the probability that the sum is 8, and that it is greater than 9.', ['There are 36 equally likely outcomes.', 'A sum of 8 appears in 5 cells, so $P(8) = \\dfrac{5}{36}$.', 'Sums of 10, 11 and 12 appear in 3 + 2 + 1 = 6 cells, so $P(\\text{sum} > 9) = \\dfrac{6}{36} = \\dfrac{1}{6}$.'], {
    shown: table(['First die / second die', '1', '2', '3', '4', '5', '6'], [1, 2, 3, 4, 5, 6].map((a) => [`${a}`, ...[1, 2, 3, 4, 5, 6].map((b) => `${a + b}`)])),
  }),

  predict(P(2, 1), 'A fair coin has come down heads five times in a row. Predict the probability of a head on the next toss, and explain.', 'It is still $\\dfrac{1}{2}$.', 'The coin has no memory: each toss is a new random experiment with the same two equally likely outcomes.'),
  predict(P(2, 1), 'Events $A$ and $B$ are mutually exclusive and exhaustive, and $P(A) = 0.35$. Predict $P(B)$.', 'Exhaustive means one of them must happen, and mutually exclusive means not both.', 'So $P(A) + P(B) = 1$, and $P(B) = 0.65$.'),
  predict(P(2, 2), 'A card is drawn from a pack of 52. Predict whether the events “a heart” and “a king” are mutually exclusive, and find the probability of “a heart or a king”.', 'They are not mutually exclusive, as the king of hearts is both.', '$P = \\dfrac{13}{52} + \\dfrac{4}{52} - \\dfrac{1}{52} = \\dfrac{16}{52} = \\dfrac{4}{13}$.'),

  odd(P(2, 1), ['0', '0.5', '1', '1.2'], '1.2', 'It can’t be a probability, which lies between 0 and 1; the others can.'),
  odd(P(2, 1), ['a head on one toss of a coin', 'an even number on one throw of a die', 'a red card drawn from a pack', 'a 7 on one throw of a die'], 'a 7 on one throw of a die', 'It is impossible, with probability 0; each of the others has probability $\\dfrac{1}{2}$.'),
  odd(P(2, 2), ['$\\{1, 2\\}$', '$\\{3, 4\\}$', '$\\{5, 6\\}$', '$\\{2, 5\\}$'], '$\\{2, 5\\}$', 'For one throw of a die, the first three are mutually exclusive and together exhaustive; $\\{2, 5\\}$ overlaps two of them.'),

  long(P(6, 2), 'Two dice are thrown. $A$ is the event “the sum is 8”, $B$ is “both scores are even”, and $C$ is “the first die shows 3”.\n(a) Write $A$, $B$ and $C$ as sets of outcomes. [3]\n(b) Find $P(A)$ and $P(A \\cap B)$. [2]\n(c) Are $A$ and $C$ mutually exclusive? Why? [1]', '(a) $A = \\{(2, 6), (3, 5), (4, 4), (5, 3), (6, 2)\\}$.', '(a) $B = \\{(2, 2), (2, 4), (2, 6), (4, 2), (4, 4), (4, 6), (6, 2), (6, 4), (6, 6)\\}$.', '(a) $C = \\{(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6)\\}$.', '(b) $P(A) = \\dfrac{5}{36}$.', '(b) $A \\cap B = \\{(2, 6), (4, 4), (6, 2)\\}$, so $P(A \\cap B) = \\dfrac{3}{36} = \\dfrac{1}{12}$.', '(c) No: $A \\cap C = \\{(3, 5)\\}$, which isn’t empty.'),
  long(P(6, 2), 'In a class, 40% of the students read a Hindi newspaper, 25% read an English one, and 15% read both. A student is chosen at random. Find the probability that the student reads:\n(a) Hindi or English [2]\n(b) neither [1]\n(c) Hindi but not English [2]\n(d) exactly one of the two. [1]', '(a) $P(H \\cup E) = P(H) + P(E) - P(H \\cap E)$.', '(a) $= 0.40 + 0.25 - 0.15 = 0.50$.', '(b) $1 - 0.50 = 0.50$.', '(c) $P(H \\cap E\') = P(H) - P(H \\cap E)$.', '(c) $= 0.40 - 0.15 = 0.25$.', '(d) $0.25 + (0.25 - 0.15) = 0.35$.'),
  long(P(6, 2), 'A bag holds 4 red, 5 white and 6 blue balls.\n(a) One ball is drawn. Find the probability that it is red, that it isn’t blue, and that it is red or blue. [3]\n(b) Two balls are drawn together. Find the probability that both are blue, and that one is red and one white. [3]', '(a) There are 15 balls, so $P(\\text{red}) = \\dfrac{4}{15}$.', '(a) $P(\\text{not blue}) = 1 - \\dfrac{6}{15} = \\dfrac{3}{5}$.', '(a) $P(\\text{red or blue}) = \\dfrac{4 + 6}{15} = \\dfrac{2}{3}$, as the two can’t both happen.', '(b) There are $^{15}C_2 = 105$ equally likely pairs.', '(b) $P(\\text{both blue}) = \\dfrac{^{6}C_2}{105} = \\dfrac{15}{105} = \\dfrac{1}{7}$.', '(b) $P(\\text{one red, one white}) = \\dfrac{4 \\times 5}{105} = \\dfrac{4}{21}$.'),

  tell(P(2, 1), 'Distinguish between mutually exclusive events and exhaustive events, with an example of each from one throw of a die.', 'Mutually exclusive events can’t happen together: “a 1” and “a 2”.', 'Exhaustive events between them cover the whole sample space, so one must happen: “an odd number” and “a number greater than 1”.'),
  tell(P(2, 1), 'Distinguish between a sample space and an event, with an example for tossing two coins.', 'The sample space is the set of all outcomes: $\\{HH, HT, TH, TT\\}$.', 'An event is any subset of it, such as “exactly one head”, $\\{HT, TH\\}$.'),
  tell(P(2, 1), 'Distinguish between the events “$A$ or $B$” and “$A$ and $B$”, as sets.', '“$A$ or $B$” is $A \\cup B$: the outcomes in $A$, in $B$, or in both.', '“$A$ and $B$” is $A \\cap B$: only the outcomes in both.'),

  match(P(4, 1), [['$A$ or $B$', '$A \\cup B$'], ['$A$ and $B$', '$A \\cap B$'], ['not $A$', "$A'$"], ['$A$ but not $B$', '$A - B$']]),
  match(P(4, 1), [['P(a number less than 7) on one throw of a die', '1'], ['P(a number greater than 6) on one throw of a die', '0'], ['P(a prime number) on one throw of a die', '$\\dfrac{1}{2}$'], ['P(a multiple of 3) on one throw of a die', '$\\dfrac{1}{3}$']]),
  match(P(4, 2), [["$P(A) + P(A')$", '1'], ['$P(\\phi)$', '0'], ['$P(A \\cup B)$ for mutually exclusive $A$ and $B$', '$P(A) + P(B)$'], ['$P(A \\cup B)$ for any $A$ and $B$', '$P(A) + P(B) - P(A \\cap B)$']]),

  reason(P(2, 1), 'Why can a probability never be negative?', 'By the axioms, $P(E) \\ge 0$ for every event $E$.', 'For equally likely outcomes, it is the number of favourable outcomes over the total, and neither can be negative.'),
  reason(P(2, 1), 'Why do the probabilities of all the outcomes of a sample space add up to 1?', 'The outcomes are mutually exclusive, and together they make up the whole sample space.', '$S$ is a sure event, so $P(S) = 1$, and that is the sum of their probabilities.'),
  reason(P(2, 2), 'There are 11 possible sums when two dice are thrown. Why isn’t the probability of a sum of 7 equal to $\\dfrac{1}{11}$?', 'The 11 sums aren’t equally likely: they come from 36 equally likely ordered pairs.', 'Six pairs give 7, so its probability is $\\dfrac{6}{36} = \\dfrac{1}{6}$.'),

  short(P(2, 1), 'A letter is chosen at random from the word PROBABILITY. Find the probability that it is a vowel.', 'The word has 11 letters, and its vowels are O, A, I and I: 4 of them.', '$P(\\text{vowel}) = \\dfrac{4}{11}$.'),
  short(P(2, 1), 'Events $A$ and $B$ are mutually exclusive, with $P(A) = \\dfrac{3}{5}$ and $P(B) = \\dfrac{1}{5}$. Find $P(A \\text{ or } B)$ and the probability that neither happens.', '$P(A \\cup B) = \\dfrac{3}{5} + \\dfrac{1}{5} = \\dfrac{4}{5}$.', 'Neither: $1 - \\dfrac{4}{5} = \\dfrac{1}{5}$.'),

  ar(P(1, 1), 'On one throw of a die, “an even number” and “an odd number” are complementary events.', 'They are mutually exclusive, and together make up the sample space.', 1, 'That is what complementary means, so each is the complement of the other.'),
  ar(P(1, 2), 'If $P(A) = 0.6$ and $P(B) = 0.7$, $A$ and $B$ can be mutually exclusive.', 'For mutually exclusive events, $P(A \\cup B) = P(A) + P(B)$.', 4, 'That would make $P(A \\cup B) = 1.3$, more than 1, which is impossible.'),
  ar(P(1, 1), 'The sample space for tossing two coins has 4 outcomes.', 'Each face of a fair coin is equally likely.', 2, 'Both are true, but the 4 outcomes come from 2 faces for each of the 2 coins, not from their being equally likely.'),

  derive(P(3, 1), "Using the axioms of probability, prove that $P(A') = 1 - P(A)$.", ["$A$ and $A'$ are mutually exclusive, and $A \\cup A' = S$.", 1], ["By the axioms, $P(A \\cup A') = P(A) + P(A')$ and $P(S) = 1$.", 1], ["So $P(A) + P(A') = 1$, and $P(A') = 1 - P(A)$.", 1]),
  derive(P(3, 1), 'Using the axioms of probability, prove that $P(\\phi) = 0$.', ['$S$ and $\\phi$ are mutually exclusive, and $S \\cup \\phi = S$.', 1], ['So $P(S) = P(S \\cup \\phi) = P(S) + P(\\phi)$.', 1], ['Subtracting $P(S)$ from both sides, $P(\\phi) = 0$.', 1]),
  derive(P(3, 2), 'Prove that $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$ for any events $A$ and $B$.', ['$A \\cup B$ is the union of the mutually exclusive sets $A - B$, $A \\cap B$ and $B - A$.', 1], ['$P(A) = P(A - B) + P(A \\cap B)$ and $P(B) = P(B - A) + P(A \\cap B)$.', 1], ['So $P(A \\cup B) = P(A - B) + P(A \\cap B) + P(B - A) = P(A) + P(B) - P(A \\cap B)$.', 1]),
];

export default questions;
