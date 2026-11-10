// Written by hand: propositional logic, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { table } from '../figures';

const { figure, predict, odd, tell, match, reason, short, ar } = kit('computerscience', 'XI');
const P = at(3, 'a');

const questions: BankDef[] = [
  figure(P(2, 2), 'The truth table defines a proposition X built from p and q. Which connective gives X? Write an equivalent proposition that uses only $\\sim$ and $\\vee$.', ['X is false only when p is true and q is false, so $X = p \\Rightarrow q$.', '$p \\Rightarrow q \\equiv \\sim p \\vee q$, which has the same column.'], {
    shown: table(['p', 'q', 'X'], [['T', 'T', 'T'], ['T', 'F', 'F'], ['F', 'T', 'T'], ['F', 'F', 'T']]),
  }),
  figure(P(2, 1), 'Draw the truth table of $(p \\wedge q) \\Rightarrow p$, and say what kind of proposition it is.', ['The column of $p \\wedge q$ is T, F, F, F, and the implication is T in every row.', 'It is true for every interpretation, so it is a tautology.'], {
    answer: table(['p', 'q', 'p ∧ q', '(p ∧ q) ⇒ p'], [['T', 'T', 'T', 'T'], ['T', 'F', 'F', 'T'], ['F', 'T', 'F', 'T'], ['F', 'F', 'F', 'T']]),
  }),
  figure(P(3, 2), 'Draw one truth table to show that $p \\Leftrightarrow q$ is equivalent to $(p \\Rightarrow q) \\wedge (q \\Rightarrow p)$.', ['Columns for $p \\Rightarrow q$ (T, F, T, T) and $q \\Rightarrow p$ (T, T, F, T).', 'Their conjunction is T, F, F, T.', 'This is the same as the column of $p \\Leftrightarrow q$, so the two are equivalent.'], {
    answer: table(['p', 'q', 'p ⇒ q', 'q ⇒ p', '(p ⇒ q) ∧ (q ⇒ p)', 'p ⇔ q'], [['T', 'T', 'T', 'T', 'T', 'T'], ['T', 'F', 'F', 'T', 'F', 'F'], ['F', 'T', 'T', 'F', 'F', 'F'], ['F', 'F', 'T', 'T', 'T', 'T']]),
  }),

  predict(P(2, 1), 'p is true and q is false. Predict the truth values of $p \\vee q$, $p \\wedge q$, $p \\Rightarrow q$ and $q \\Rightarrow p$.', '$p \\vee q$ is T and $p \\wedge q$ is F.', '$p \\Rightarrow q$ is F, as a true p leads to a false q; $q \\Rightarrow p$ is T.'),
  predict(P(2, 1), 'Predict how many rows a truth table needs for a proposition with four variables, p, q, r and s, and in how many of them $p \\wedge q \\wedge r \\wedge s$ is true.', 'It needs 2⁴ = 16 rows.', '$p \\wedge q \\wedge r \\wedge s$ is true in just one, where all four are true.'),
  predict(P(2, 2), 'Without a truth table, predict whether $(p \\wedge \\sim p) \\Rightarrow q$ is a tautology, and explain.', '$p \\wedge \\sim p$ is false in every row.', 'An implication with a false hypothesis is true, so the whole proposition is true in every row: a tautology.'),

  odd(P(2, 1), ['$p \\vee \\sim p$', '$p \\Rightarrow p$', '$p \\wedge \\sim p$', '$\\sim(p \\wedge \\sim p)$'], '$p \\wedge \\sim p$', 'It is a contradiction, false in every row; the other three are tautologies.'),
  odd(P(2, 2), ['$\\sim p \\vee q$', '$p \\Rightarrow q$', '$\\sim q \\Rightarrow \\sim p$', '$q \\Rightarrow p$'], '$q \\Rightarrow p$', 'It is the converse of $p \\Rightarrow q$, and isn’t equivalent to it; the other three are all equivalent.'),
  odd(P(2, 1), ['“7 is a prime number.”', '“Close the door.”', '“2 + 2 = 5.”', '“Delhi is in India.”'], '“Close the door.”', 'It is a command, which is neither true nor false, so it isn’t a proposition; the others are propositions, true or false.'),

  tell(P(2, 1), 'Distinguish between a tautology and a contingency, with an example of each.', 'A tautology is true for every interpretation of its variables, as $p \\vee \\sim p$.', 'A contingency is true for some interpretations and false for others, as $p \\wedge q$.'),
  tell(P(2, 1), 'Distinguish between the converse and the contrapositive of $p \\Rightarrow q$.', 'The converse is $q \\Rightarrow p$, which may differ from $p \\Rightarrow q$ in truth value.', 'The contrapositive is $\\sim q \\Rightarrow \\sim p$, which always has the same truth value as $p \\Rightarrow q$.'),
  tell(P(2, 2), 'Distinguish between a well-formed formula and a string of symbols that isn’t one, with an example of each.', 'A well-formed formula is built by the rules: variables, joined by connectives with the right number of parts, and brackets that match, as $(p \\wedge q) \\Rightarrow r$.', 'A string that breaks the rules, as $p \\wedge \\vee q$ or $(p \\Rightarrow$, has no meaning and no truth value.'),

  match(P(4, 1), [['$p \\wedge q$', 'true only when both are true'], ['$p \\vee q$', 'false only when both are false'], ['$p \\Rightarrow q$', 'false only when p is true and q is false'], ['$p \\Leftrightarrow q$', 'true when p and q have the same value']]),
  match(P(4, 2), [['$\\sim p \\Rightarrow \\sim q$', 'the inverse of $p \\Rightarrow q$'], ['$q \\Rightarrow p$', 'the converse of $p \\Rightarrow q$'], ['$\\sim q \\Rightarrow \\sim p$', 'the contrapositive of $p \\Rightarrow q$'], ['$p \\wedge \\sim q$', 'the negation of $p \\Rightarrow q$']]),
  match(P(4, 1), [['$p \\vee \\sim p$', 'a tautology'], ['$p \\wedge \\sim p$', 'a contradiction'], ['$p \\Rightarrow q$', 'a contingency'], ['$p \\wedge \\vee q$', 'not a well-formed formula']]),

  reason(P(2, 1), 'Why is $p \\Rightarrow q$ taken to be true whenever p is false?', 'An implication only promises that q holds when p does.', 'When p is false the promise isn’t tested, so it isn’t broken; only p true with q false breaks it.'),
  reason(P(2, 1), 'Why does a truth table with n variables have 2ⁿ rows?', 'Each variable can be true or false, independently of the others.', 'So there are 2 × 2 × … × 2 = 2ⁿ combinations, one row for each.'),
  reason(P(2, 2), 'Why do brackets matter in $\\sim p \\wedge q$? Show with p and q both false.', '$\\sim(p \\wedge q)$ negates the whole conjunction, while $(\\sim p) \\wedge q$ negates p alone.', 'With p and q false, $\\sim(p \\wedge q)$ is T but $(\\sim p) \\wedge q$ is F, so they are different propositions.'),

  short(P(2, 1), 'Write the negation of each in words: (a) “It is raining and it is cold.” (b) “I will walk or take the bus.”', '(a) “It is not raining or it is not cold.”', '(b) “I will not walk and I will not take the bus.”'),
  short(P(2, 2), 'Show by a truth table that $p \\vee (p \\wedge q) \\equiv p$.', 'For p, q = TT, TF, FT, FF, $p \\wedge q$ is T, F, F, F and $p \\vee (p \\wedge q)$ is T, T, F, F.', 'This is the same as the column of p, so the two are equivalent.'),

  ar(P(1, 1), '$p \\Leftrightarrow q$ is true when p and q are both false.', 'A biconditional is true when its two parts have the same truth value.', 1, 'Both are false, so they have the same value.'),
  ar(P(1, 2), 'The converse of a true implication is always true.', '$p \\Rightarrow q$ and $q \\Rightarrow p$ are false in different rows of the truth table.', 4, '“If it is a square, it has four sides” is true, but its converse is false.'),
  ar(P(1, 2), '$(p \\wedge q) \\Rightarrow p$ is a tautology.', '$p \\vee q$ is false only when p and q are both false.', 2, 'Both are true, but the tautology holds because $p \\wedge q$ can be true only when p is true.'),
];

export default questions;
