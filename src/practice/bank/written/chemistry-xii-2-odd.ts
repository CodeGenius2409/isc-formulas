// Written by hand: electrochemistry, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('chemistry', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  odd(A(2, 1), ['anode', 'cathode', 'salt bridge', 'galvanometer'], 'galvanometer', 'It is an instrument joined to a cell; the others are parts of the cell itself.'),
  odd(A(2, 2), ['Li', 'Na', 'K', 'Au'], 'Au', 'It has a positive standard reduction potential and isn’t a strong reducing agent; the others are.'),
  odd(A(2, 2), ['E°', 'ΔG°', 'K', 'Λm'], 'Λm', 'It is about conductance; the others are linked by ΔG° = −nFE° = −RT ln K.'),
  odd(A(2, 3), ['Nernst equation', 'Kohlrausch’s law', 'ΔG = −nFE', 'E°cell = E°cathode − E°anode'], 'Kohlrausch’s law', 'It is about conductance of ions; the others are about the emf of cells.'),
  odd(A(2, 3), ['F₂', 'Cl₂', 'Ag⁺', 'Zn'], 'Zn', 'It is a reducing agent; the others are oxidising agents.'),
  odd(B(2, 1), ['S m⁻¹', 'S m² mol⁻¹', 'Ω⁻¹ cm⁻¹', 'Ω'], 'Ω', 'It is the unit of resistance; the others belong to conductivity.'),
  odd(B(2, 2), ['KCl', 'NaCl', 'HCl', 'CH₃COOH'], 'CH₃COOH', 'It is a weak electrolyte; the others are strong.'),
  odd(B(2, 2), ['electroplating with copper', 'refining copper', 'extracting sodium from molten NaCl', 'Daniell cell'], 'Daniell cell', 'It turns a chemical reaction into electricity; the others use electricity to drive a reaction.'),
  odd(B(2, 3), ['viscosity of the solvent', 'size of the ions', 'temperature', 'mass of the electrodes'], 'mass of the electrodes', 'It doesn’t affect conductivity; the others do.'),
  odd(B(2, 3), ['96,500 C', 'charge on one mole of electrons', 'one faraday', 'one ampere for one hour'], 'one ampere for one hour', 'It is only 3,600 C; the others are all one faraday.'),
];

export default questions;
