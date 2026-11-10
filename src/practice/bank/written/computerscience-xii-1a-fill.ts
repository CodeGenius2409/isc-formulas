// Written by hand: propositional logic, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { table } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('computerscience', 'XII');
const L = at(1, 'a');

const questions: BankDef[] = [
  figure(L(2, 1), 'The truth table gives a formula F in p and q. Which connective is F? Write it also using only ¬ and ∨.', ['F is false only when p is true and q is false, so F is p ⇒ q.', 'p ⇒ q ≡ ¬p ∨ q.'], {
    shown: table(['p', 'q', 'F'], [['T', 'T', 'T'], ['T', 'F', 'F'], ['F', 'T', 'T'], ['F', 'F', 'T']]),
  }),
  figure(L(3, 2), 'Complete the truth table of (p ∨ q) ∧ ¬p, and say whether the formula is valid, satisfiable or unsatisfiable.', ['p ∨ q is T, T, T, F and ¬p is F, F, T, T down the rows.', 'So (p ∨ q) ∧ ¬p is F, F, T, F.', 'It is true in one row, so it is satisfiable, but not valid.'], {
    shown: table(['p', 'q', 'p ∨ q', '¬p', '(p ∨ q) ∧ ¬p'], [['T', 'T', '?', '?', '?'], ['T', 'F', '?', '?', '?'], ['F', 'T', '?', '?', '?'], ['F', 'F', '?', '?', '?']]),
    answer: table(['p', 'q', 'p ∨ q', '¬p', '(p ∨ q) ∧ ¬p'], [['T', 'T', 'T', 'F', 'F'], ['T', 'F', 'T', 'F', 'F'], ['F', 'T', 'T', 'T', 'T'], ['F', 'F', 'F', 'T', 'F']]),
  }),
  figure(L(2, 2), 'Draw the truth table of p ⇔ ¬q, and classify the formula.', ['p ⇔ ¬q is F, T, T, F for the rows TT, TF, FT, FF.', 'It is true in some rows and false in others: satisfiable, but not valid.'], {
    answer: table(['p', 'q', '¬q', 'p ⇔ ¬q'], [['T', 'T', 'F', 'F'], ['T', 'F', 'T', 'T'], ['F', 'T', 'F', 'T'], ['F', 'F', 'T', 'F']]),
  }),

  predict(L(2, 1), 'p is true and q is false. Predict the truth values of p ⇒ q, q ⇒ p and p ⇔ q.', 'p ⇒ q is false, as a true condition leads to a false result.', 'q ⇒ p is true, as its condition is false; p ⇔ q is false, as p and q differ.'),
  predict(L(2, 2), 'A formula is valid. Predict what kind of formula its negation is, and why.', 'Its negation is unsatisfiable.', 'The formula is true under every interpretation, so its negation is false under every one.'),
  predict(L(2, 1), 'Predict how many rows the truth table of a formula in p, q, r, s and t has, and in how many of them a valid formula is true.', '2⁵ = 32 rows.', 'A valid formula is true in all 32.'),

  odd(L(2, 2), ['p ∨ ¬p', '(p ∧ q) ⇒ p', 'p ⇒ (p ∨ q)', 'p ∧ ¬q'], 'p ∧ ¬q', 'It is true only when p is true and q false; the other three are valid.'),
  odd(L(2, 2), ['¬(p ∧ q)', '¬p ∨ ¬q', 'p ⇒ ¬q', '¬p ∧ ¬q'], '¬p ∧ ¬q', 'It is ¬(p ∨ q); the other three are all equivalent to ¬(p ∧ q).'),
  odd(L(2, 1), ['satisfiable', 'valid', 'contingent', 'unsatisfiable'], 'unsatisfiable', 'Such a formula is true in no row; a formula of each of the other kinds is true in at least one.'),

  long(L(6, 2), 'Answer each part on the formula ¬(p ∨ ¬q) ∨ (¬p ∧ ¬q).\n(a) Simplify it using equivalence laws, naming each law. [3]\n(b) Check your answer with a truth table. [2]\n(c) Is the formula valid, satisfiable or unsatisfiable? [1]', '(a) By De Morgan’s law and double negation, ¬(p ∨ ¬q) ≡ ¬p ∧ q.', '(a) By the distributive law, (¬p ∧ q) ∨ (¬p ∧ ¬q) ≡ ¬p ∧ (q ∨ ¬q).', '(a) q ∨ ¬q ≡ T, and ¬p ∧ T ≡ ¬p, by the identity law.', '(b) For the rows TT, TF, FT, FF the formula is F, F, T, T.', '(b) This is the column of ¬p, so the two agree.', '(c) Satisfiable, but not valid.'),

  tell(L(2, 1), 'Distinguish between a satisfiable formula and a valid formula.', 'A satisfiable formula is true under at least one interpretation.', 'A valid formula is true under every interpretation.'),
  tell(L(2, 2), 'Distinguish between the converse and the contrapositive of p ⇒ q.', 'The converse is q ⇒ p, which can differ from p ⇒ q in truth value.', 'The contrapositive is ¬q ⇒ ¬p, which always has the same truth value as p ⇒ q.'),
  tell(L(2, 1), 'Distinguish between p ∨ q and p ⊕ q.', 'p ∨ q is true when at least one of p and q is true, including both.', 'p ⊕ q is true when exactly one is true, so it is false when both are.'),

  match(L(4, 1), [['De Morgan’s law', '¬(p ∧ q) ≡ ¬p ∨ ¬q'], ['Distributive law', 'p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)'], ['Absorption law', 'p ∨ (p ∧ q) ≡ p'], ['Double negation', '¬¬p ≡ p']]),
  match(L(4, 2), [['p ⇒ q', '¬p ∨ q'], ['p ⇔ q', '(p ⇒ q) ∧ (q ⇒ p)'], ['¬(p ⇒ q)', 'p ∧ ¬q'], ['p ⊕ q', '(p ∧ ¬q) ∨ (¬p ∧ q)']]),
  match(L(4, 1), [['p ∨ ¬p', 'valid'], ['p ∧ ¬p', 'unsatisfiable'], ['p ∧ q', 'satisfiable but not valid'], ['p ∧ ∨ q', 'not a well-formed formula']]),

  reason(L(2, 1), 'Why is every valid formula also satisfiable?', 'A valid formula is true under every interpretation.', 'So it is true under at least one, which is what satisfiable means.'),
  reason(L(2, 1), 'Why is a truth table enough to show that a formula is valid?', 'It lists every combination of truth values of the variables, that is, every interpretation.', 'If the final column is true in every row, the formula is true under all of them.'),
  reason(L(2, 2), 'Why are ¬(p ∧ q) and ¬p ∧ ¬q not equivalent? Give a row where they differ.', 'By De Morgan’s law, ¬(p ∧ q) is ¬p ∨ ¬q, not ¬p ∧ ¬q.', 'For p true and q false, ¬(p ∧ q) is true but ¬p ∧ ¬q is false.'),

  short(L(2, 1), 'Let p be “n is even” and q be “n² is even”. Write p ⇒ q in words, and its contrapositive.', 'p ⇒ q: if n is even, then n² is even.', 'Contrapositive: if n² is not even, then n is not even.'),
  short(L(2, 2), 'Show that p ⇒ (q ⇒ p) is valid.', 'If p is true, then q ⇒ p is true, since its result is true, so the whole is true.', 'If p is false, the whole is true, since its condition is false; so it is true under every interpretation.'),
  short(L(2, 2), 'Simplify p ∧ (¬p ∨ q) using equivalence laws.', 'By the distributive law, it is (p ∧ ¬p) ∨ (p ∧ q).', 'p ∧ ¬p ≡ F, so it is F ∨ (p ∧ q) ≡ p ∧ q.'),

  ar(L(1, 1), 'p ∨ ¬p is valid.', 'A formula is valid if it is true under every interpretation.', 1, 'Whichever value p has, one of p and ¬p is true.'),
  ar(L(1, 2), '(p ∧ q) ⇒ p is unsatisfiable.', '(p ∧ q) ⇒ p is true under every interpretation.', 4, 'It is valid, the opposite of unsatisfiable.'),
  ar(L(1, 2), '¬(p ∨ q) ≡ ¬p ∧ ¬q.', 'This equivalence is the distributive law.', 3, 'It is De Morgan’s law.'),
];

export default questions;
