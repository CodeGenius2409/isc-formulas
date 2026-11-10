// Written by hand: atoms and nuclei, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('physics', 'XII');
const A = at(8, 'a');
const B = at(8, 'b');

const questions: BankDef[] = [
  ar(A(1, 1), 'Most alpha particles pass straight through a thin gold foil.', 'Most of an atom is empty space.', 1, 'Only the few that come close to a tiny nucleus are turned aside.'),
  ar(A(1, 2), 'Hydrogen’s spectrum has lines at only certain wavelengths.', 'Its electron can have only certain energies.', 1, 'Each line comes from a jump between two allowed levels, of a fixed energy difference.'),
  ar(A(1, 2), 'The energy levels of hydrogen get closer together as n rises.', 'The radius of the nth orbit is proportional to n².', 2, 'Both are true, but the levels close up because E is proportional to −1/n², not because of how the radius grows.'),
  ar(A(1, 3), 'Bohr’s model explains the spectra of all atoms.', 'It assumes that angular momentum is quantised.', 4, 'Bohr’s model works only for hydrogen and hydrogen-like ions, with one electron.'),
  ar(A(1, 3), 'An electron in a stationary Bohr orbit doesn’t radiate.', 'An accelerated charge always radiates, by classical physics.', 2, 'Both are true statements; Bohr simply postulated that his orbits break the classical rule, so the reason doesn’t explain the assertion.'),
  ar(B(1, 1), 'All nuclei have about the same density.', 'The nuclear radius is proportional to A^(1/3).', 1, 'The volume is then proportional to A, as is the mass, so the density doesn’t depend on A.'),
  ar(B(1, 2), 'Fission of a heavy nucleus releases energy.', 'The products have a higher binding energy per nucleon.', 1, 'More tightly bound products have less total mass, and the difference is released.'),
  ar(B(1, 2), 'The nuclear force acts only between protons.', 'The nuclear force is independent of charge.', 4, 'Being independent of charge, it acts between every pair of nucleons: p–p, n–n and p–n.'),
  ar(B(1, 3), 'The mass of a nucleus is less than the sum of the masses of its nucleons.', 'Energy is released when nucleons join to form a nucleus.', 1, 'That released energy, the binding energy, corresponds to the missing mass, Δm = BE/c².'),
];

export default questions;
