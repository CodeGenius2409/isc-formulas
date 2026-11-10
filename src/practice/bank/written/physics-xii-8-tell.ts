// Written by hand: atoms and nuclei, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('physics', 'XII');
const A = at(8, 'a');
const B = at(8, 'b');

const questions: BankDef[] = [
  tell(A(2, 1), 'Distinguish between Rutherford’s and Bohr’s models of the atom.', 'Rutherford: electrons orbit a small, dense nucleus, but the model can’t explain why they don’t spiral in.', 'Bohr: electrons move only in certain orbits, without radiating, and emit light only when they jump between them.'),
  tell(A(2, 2), 'Distinguish between the ground state and an excited state of an atom.', 'The ground state is the lowest energy level, where the atom normally stays.', 'An excited state is a higher level, reached by absorbing energy, from which the atom soon falls back, giving out light.'),
  tell(A(2, 2), 'Distinguish between excitation energy and ionisation energy of hydrogen.', 'Excitation energy lifts the electron to a higher level, such as 10.2 eV to n = 2.', 'Ionisation energy removes it entirely, 13.6 eV from the ground state.'),
  tell(A(2, 3), 'Distinguish between an emission and an absorption line spectrum.', 'An emission spectrum shows bright lines on a dark background, from a hot gas giving out light.', 'An absorption spectrum shows dark lines on a bright background, where a cool gas takes in the same wavelengths.'),
  tell(A(3, 3), 'Distinguish between the Lyman and Balmer series of hydrogen.', 'Lyman: transitions down to n = 1.', 'Balmer: transitions down to n = 2.', 'The Lyman lines are in the ultraviolet, and the Balmer lines mostly in the visible.'),
  tell(B(2, 1), 'Distinguish between the binding energy of a nucleus and its binding energy per nucleon.', 'Binding energy is the total energy needed to pull the nucleus apart into its nucleons.', 'Binding energy per nucleon is that divided by the mass number, and is the better guide to stability.'),
  tell(B(2, 2), 'Distinguish between mass defect and binding energy.', 'Mass defect is the difference between the mass of the separate nucleons and that of the nucleus.', 'Binding energy is the energy that mass corresponds to, Δm c², needed to pull the nucleus apart.'),
  tell(B(2, 2), 'Distinguish between the nuclear force and the electrostatic force between protons.', 'The nuclear force is very strong but acts only within a few femtometres, and doesn’t depend on charge.', 'The electrostatic force is weaker but reaches much further, falling as 1/r², and repels protons.'),
  tell(B(2, 3), 'Distinguish between isotopes and isobars, with an example of each.', 'Isotopes have the same atomic number but different mass numbers, as ¹²C and ¹⁴C.', 'Isobars have the same mass number but different atomic numbers, as ¹⁴C and ¹⁴N.'),
];

export default questions;
