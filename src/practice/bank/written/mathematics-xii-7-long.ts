// Written by hand: probability, long answers in parts. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('mathematics', 'XII');
const P = at(7, 'a');

const questions: BankDef[] = [
  long(P(5, 2), 'Answer each part. Two cards are drawn one after the other, without replacement, from a pack of 52.\n(a) Find the probability that both are kings. [2]\n(b) Find the probability that the second is a king. [2]\n(c) Are the two draws independent? [1]', '(a) $\\frac{4}{52} \\times \\frac{3}{51}$.', '(a) $= \\frac{1}{221}$.', '(b) $\\frac{4}{52} \\times \\frac{3}{51} + \\frac{48}{52} \\times \\frac{4}{51} = \\frac{204}{2652}$.', '(b) $= \\frac{1}{13}$.', '(c) No: the first draw changes what is left for the second.'),
];

export default questions;
