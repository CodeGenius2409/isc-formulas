// Written by hand: chemical kinetics, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('chemistry', 'XII');
const A = at(3, 'a');

const questions: BankDef[] = [
  predict(A(2, 1), 'The initial concentration of a first-order reactant is doubled. Predict what happens to its half-life.', 'It stays the same.', 'For first order, t½ = 0.693/k, which doesn’t depend on concentration.'),
  predict(A(2, 2), 'The initial concentration of a zero-order reactant is doubled. Predict what happens to its half-life.', 'It doubles.', 'For zero order, t½ = [A]₀/2k, which is proportional to the starting concentration.'),
  predict(A(2, 2), 'For a reaction with rate = k[A], the concentration of A is tripled. Predict the new rate.', 'Three times the rate.', 'The rate is proportional to [A], as the reaction is first order in A.'),
  predict(A(3, 3), 'A first-order reaction is 50% done in 20 minutes. Predict how long it takes to be 75% done, and 87.5% done.', 'Each half-life is 20 minutes, whatever the concentration.', '75% done is two half-lives: 40 minutes.', '87.5% done is three half-lives: 60 minutes.'),
  predict(A(2, 3), 'Marble chips react with dilute acid. Predict what happens to the rate if the same mass is used as a fine powder.', 'The rate rises.', 'The powder has a much larger surface area, so more collisions happen each second.'),
];

export default questions;
