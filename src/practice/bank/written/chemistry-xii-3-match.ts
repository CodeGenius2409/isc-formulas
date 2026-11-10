// Written by hand: chemical kinetics, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('chemistry', 'XII');
const A = at(3, 'a');

const questions: BankDef[] = [
  match(A(3, 1), [['Zero-order rate constant', 'mol L⁻¹ s⁻¹'], ['First-order rate constant', 's⁻¹'], ['Rate of reaction', 'Change in concentration per unit time']]),
  match(A(4, 2), [['Half-life of a zero-order reaction', '[A]₀/2k'], ['Half-life of a first-order reaction', '0.693/k'], ['Integrated first-order equation', 'k = (2.303/t) log([A]₀/[A])'], ['Time for 99.9% of a first-order reaction', 'About ten half-lives']]),
  match(A(3, 2), [['Zero order', 'Concentration against time is a straight line'], ['First order', 'log concentration against time is a straight line'], ['Rate against concentration, first order', 'A straight line through the origin']]),
  match(A(4, 3), [['Raising the temperature', 'Rate rises, often about doubling for 10 K'], ['Adding a catalyst', 'Rate rises, with the catalyst left unchanged'], ['Raising the concentration', 'More collisions each second'], ['Grinding a solid', 'Larger surface area']]),
  match(A(3, 3), [['Hydrolysis of an ester in much water', 'Pseudo first order'], ['Decomposition of NH₃ on hot platinum', 'Zero order at high pressure'], ['Molecularity', 'Can’t be zero or a fraction']]),
];

export default questions;
