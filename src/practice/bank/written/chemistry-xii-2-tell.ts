// Written by hand: electrochemistry, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('chemistry', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  tell(A(2, 1), 'Distinguish between an electrode potential and the emf of a cell.', 'An electrode potential belongs to one half-cell, measured against the standard hydrogen electrode.', 'The emf of a cell is the difference between the potentials of its two electrodes, with no current drawn.'),
  tell(A(2, 2), 'Distinguish between E°cell and Ecell.', 'E°cell is the emf with every ion at 1 mol L⁻¹, gases at 1 bar, and 298 K.', 'Ecell is the emf at the actual concentrations, given by the Nernst equation.'),
  tell(A(2, 2), 'Distinguish between oxidation potential and reduction potential.', 'Oxidation potential measures how readily an electrode loses electrons.', 'Reduction potential measures how readily it gains them; for the same electrode the two are equal and opposite.'),
  tell(A(2, 3), 'Distinguish between the anode of a galvanic cell and the anode of an electrolytic cell.', 'In both, oxidation happens at the anode.', 'But a galvanic cell’s anode is negative, giving out electrons, while an electrolytic cell’s anode is positive, joined to the supply.'),
  tell(B(2, 1), 'Distinguish between conductivity and molar conductivity.', 'Conductivity, κ, is the conductance of a 1 cm cube of solution, in S cm⁻¹.', 'Molar conductivity, Λm = κ/c, is the conductance of all the ions from one mole, in S cm² mol⁻¹.'),
  tell(B(2, 2), 'Distinguish between a strong and a weak electrolyte by how their molar conductivities change on dilution.', 'A strong electrolyte’s Λm rises only a little, as it is fully ionised already.', 'A weak electrolyte’s Λm rises steeply, as it ionises more and more.'),
  tell(B(2, 2), 'Distinguish between conductance and conductivity.', 'Conductance is 1/R for a particular sample, in siemens, and depends on its size.', 'Conductivity is a property of the solution, the conductance of a unit cube, in S m⁻¹.'),
  tell(B(2, 3), 'Distinguish between electrochemical equivalent and equivalent mass.', 'Electrochemical equivalent, Z, is the mass deposited by 1 coulomb.', 'Equivalent mass is the mass deposited by 1 faraday, 96,500 C, so it is 96,500 Z.'),
  tell(B(3, 3), 'Distinguish between how Λ°m is found for a strong and for a weak electrolyte.', 'For a strong electrolyte, by extending the straight graph of Λm against √c to c = 0.', 'For a weak electrolyte the graph rises too steeply to extend.', 'So Kohlrausch’s law is used, adding the limiting conductivities of its ions.'),
];

export default questions;
