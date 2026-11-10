// Written by hand: chemical kinetics, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('chemistry', 'XII');
const A = at(3, 'a');

const questions: BankDef[] = [
  odd(A(2, 1), ['concentration', 'temperature', 'catalyst', 'molecular mass of the product'], 'molecular mass of the product', 'It doesn’t affect the rate; the others do.'),
  odd(A(2, 2), ['order', 'molecularity', 'rate constant', 'half-life of first order'], 'molecularity', 'It is always a whole number from the mechanism; the others are found by experiment.'),
  odd(A(2, 2), ['mol L⁻¹ s⁻¹', 's⁻¹', 'mol L⁻¹', 'L mol⁻¹ s⁻¹'], 'mol L⁻¹', 'It is a unit of concentration; the others are units of rate or rate constant.'),
  odd(A(2, 3), ['radioactive decay', 'hydrolysis of an ester in much water', 'decomposition of N₂O₅', 'decomposition of NH₃ on hot platinum at high pressure'], 'decomposition of NH₃ on hot platinum at high pressure', 'It is zero order; the others are first order.'),
  odd(A(2, 3), ['average rate', 'instantaneous rate', 'initial rate', 'rate constant'], 'rate constant', 'It doesn’t change with concentration; the others do as the reaction goes on.'),
];

export default questions;
