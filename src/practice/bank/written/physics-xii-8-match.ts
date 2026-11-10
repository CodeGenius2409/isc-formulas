// Written by hand: atoms and nuclei, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('physics', 'XII');
const A = at(8, 'a');
const B = at(8, 'b');

const questions: BankDef[] = [
  match(A(3, 1), [['Lyman series', 'Ultraviolet'], ['Balmer series', 'Visible'], ['Paschen series', 'Infrared']]),
  match(A(4, 2), [['Radius of the nth Bohr orbit', 'Proportional to n²'], ['Energy of the nth level', 'Proportional to −1/n²'], ['Speed in the nth orbit', 'Proportional to 1/n'], ['Angular momentum in the nth orbit', 'nh/2π']]),
  match(A(3, 2), [['Most alpha particles in Rutherford’s experiment', 'Went straight through'], ['A few alpha particles', 'Turned through large angles'], ['Very few alpha particles', 'Bounced almost straight back']]),
  match(A(4, 3), [['Ground state energy of hydrogen', '−13.6 eV'], ['Ionisation energy of hydrogen', '13.6 eV'], ['First excited state of hydrogen', '−3.4 eV'], ['Radius of the first Bohr orbit', '0.53 Å']]),
  match(A(3, 3), [['Rutherford’s model', 'Couldn’t explain why atoms are stable'], ['Bohr’s model', 'Explained hydrogen’s line spectrum'], ['Distance of closest approach', 'Gives an upper limit to the size of the nucleus']]),
  match(B(3, 1), [['Isotopes', 'Same Z, different A'], ['Isobars', 'Same A, different Z'], ['Isotones', 'Same number of neutrons']]),
  match(B(4, 2), [['Nuclear radius', 'R₀A^(1/3)'], ['Mass defect', 'Zm_p + Nm_n − M'], ['Binding energy', 'Δm c²'], ['1 u of mass, as energy', '931.5 MeV']]),
  match(B(3, 2), [['Fission', 'A heavy nucleus splits'], ['Fusion', 'Light nuclei join'], ['Energy in the Sun', 'Fusion of hydrogen']]),
  match(B(4, 3), [['Nuclear force at short range', 'Strongly attractive'], ['Nuclear force below about 0.8 fm', 'Repulsive'], ['Nuclear force between protons and neutrons', 'About the same as between protons'], ['Nuclear density', 'About the same for all nuclei']]),
  match(B(3, 3), [['Binding energy per nucleon, highest', 'Near iron, A ≈ 56'], ['Very heavy nuclei', 'Release energy by fission'], ['Very light nuclei', 'Release energy by fusion']]),
];

export default questions;
