// Written by hand: solutions, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('chemistry', 'XII');
const A = at(1, 'a');

const questions: BankDef[] = [
  odd(A(2, 1), ['relative lowering of vapour pressure', 'elevation of boiling point', 'osmotic pressure', 'viscosity'], 'viscosity', 'It isn’t a colligative property; the others depend only on the number of solute particles.'),
  odd(A(2, 2), ['molality', 'mole fraction', 'mass percentage', 'molarity'], 'molarity', 'It changes with temperature, as volume does; the others don’t.'),
  odd(A(2, 2), ['NaCl', 'KCl', 'MgSO₄', 'glucose'], 'glucose', 'It doesn’t ionise in water, so its van ’t Hoff factor is 1; the others split into ions.'),
  odd(A(2, 3), ['benzene and toluene', 'hexane and heptane', 'bromoethane and chloroethane', 'ethanol and water'], 'ethanol and water', 'It deviates from Raoult’s law; the others are nearly ideal.'),
  odd(A(2, 3), ['K_b', 'K_f', 'i', 'R'], 'i', 'It has no unit; the others are constants with units.'),
];

export default questions;
