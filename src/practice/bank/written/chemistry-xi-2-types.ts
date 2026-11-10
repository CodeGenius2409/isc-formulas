// Written by hand: structure of the atom, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XI');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  long(A(5, 2), 'Answer each part on Bohr’s model.\n(a) State two of its postulates. [2]\n(b) Find the energy of the electron in the third orbit of hydrogen, given 13.6 eV for the first. [1]\n(c) Find the energy of the photon emitted in the jump from n = 3 to n = 2, and name the series it belongs to. [2]', ['(a) Electrons move only in certain circular orbits, in which they don’t lose energy.', '(a) Energy is absorbed or given out only when an electron moves between orbits, as a photon with E = hν.', '(b) −13.6 / 9 = −1.51 eV.', '(c) E₂ is −3.40 eV, so the photon has 3.40 − 1.51 = 1.89 eV.', '(c) The Balmer series.']),
  long(B(5, 2), 'Answer each part.\n(a) Name the four quantum numbers, and say what each describes. [2]\n(b) State the Aufbau principle, Hund’s rule and Pauli’s exclusion principle in a line each. [2]\n(c) Write the configuration of chromium, Z = 24, and say why it differs from the expected one. [1]', ['(a) Principal n gives the shell and its energy. Azimuthal l gives the shape of the subshell.', '(a) Magnetic m gives the orbital’s orientation. Spin s gives the electron’s spin.', '(b) Aufbau: orbitals fill in order of increasing energy.', '(b) Hund: paired only when each orbital of a subshell has one. Pauli: no two electrons have all four quantum numbers alike.', '(c) [Ar] 3d⁵ 4s¹, as half-filled subshells are extra stable.']),
  long(B(5, 3), 'Answer each part.\n(a) How many orbitals and how many electrons can the shell n = 3 hold? [1]\n(b) Give the quantum numbers n, l and m of the orbital 3dxy’s subshell, and say how many values m can take. [2]\n(c) Which has more energy, 4s or 3d, as they first fill? Use the (n + l) rule to say why. [2]', ['(a) 9 orbitals and 18 electrons.', '(b) n = 3 and l = 2.', '(b) m runs from −2 to +2, which is five values.', '(c) 3d, as n + l is 5 for 3d and 4 for 4s.', '(c) The lower n + l fills first.']),
];

export default questions;
