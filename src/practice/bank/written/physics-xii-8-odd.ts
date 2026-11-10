// Written by hand: atoms and nuclei, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('physics', 'XII');
const A = at(8, 'a');
const B = at(8, 'b');

const questions: BankDef[] = [
  odd(A(2, 1), ['Lyman series', 'Balmer series', 'Paschen series', 'Fraunhofer lines'], 'Fraunhofer lines', 'They are dark lines in the Sun’s spectrum; the others are series of lines from hydrogen.'),
  odd(A(2, 2), ['radius of orbit', 'energy level', 'angular momentum', 'speed in orbit'], 'speed in orbit', 'It falls as n rises; the others rise as n rises.'),
  odd(A(2, 2), ['13.6 eV', '3.4 eV', '1.51 eV', '10.2 eV'], '10.2 eV', 'It is the energy of a transition, from n = 2 to 1; the others are the energies needed to ionise from n = 1, 2 and 3.'),
  odd(A(2, 3), ['stable orbits', 'quantised angular momentum', 'photon emitted on a jump', 'electrons spiral into the nucleus'], 'electrons spiral into the nucleus', 'It is what classical physics predicts, and Bohr’s model avoids; the others are Bohr’s ideas.'),
  odd(A(2, 3), ['alpha particle', 'gold nucleus', 'zinc sulphide screen', 'neutron'], 'neutron', 'It plays no part in the scattering experiment; the others do.'),
  odd(B(2, 1), ['¹²C', '¹³C', '¹⁴C', '¹⁴N'], '¹⁴N', 'It is a different element; the others are isotopes of carbon.'),
  odd(B(2, 2), ['mass defect', 'binding energy', 'Q value of a reaction', 'nuclear radius'], 'nuclear radius', 'It is a length; the others are linked to energy by E = mc².'),
  odd(B(2, 2), ['fission of uranium', 'fusion in the Sun', 'burning of coal', 'fusion in a hydrogen bomb'], 'burning of coal', 'It is a chemical change; the others are nuclear reactions.'),
  odd(B(2, 3), ['strong', 'short range', 'charge independent', 'falls as 1/r²'], 'falls as 1/r²', 'That is true of the electric and gravitational forces, not the nuclear force; the others describe the nuclear force.'),
  odd(B(2, 3), ['¹H', '²H', '⁴He', '⁵⁶Fe'], '⁵⁶Fe', 'It can’t release energy by fusion, being at the peak of binding energy; the others can fuse to release energy.'),
];

export default questions;
