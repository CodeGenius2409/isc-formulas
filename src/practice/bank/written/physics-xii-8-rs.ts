// Written by hand: atoms and nuclei, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('physics', 'XII');
const A = at(8, 'a');
const B = at(8, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why did most alpha particles pass straight through the gold foil, in Rutherford’s experiment?', 'Most of an atom is empty space, as its positive charge and mass lie in a tiny nucleus.'),
  reason(A(2, 2), 'Why does a classical atom fail, according to electromagnetic theory?', 'An electron in orbit is accelerating, so it would radiate energy.', 'It would spiral into the nucleus, which doesn’t happen.'),
  reason(A(2, 2), 'Why is the hydrogen spectrum made of separate lines rather than a continuous band?', 'The electron’s energy levels are separate.', 'So only photons with the exact differences of energy can be given out.'),
  reason(A(2, 3), 'Why is hydrogen’s ground-state energy written as negative?', 'The zero of energy is taken with the electron free, far from the nucleus.', 'A bound electron has less energy than that, so its energy is negative.'),
  reason(A(1, 2), 'Why does a tiny fraction of alpha particles bounce back from a gold foil?', 'They come almost head-on to the heavy, positive nucleus, and are strongly repelled.'),
  short(A(2, 1), 'State Bohr’s quantisation condition. What does it say about angular momentum?', 'Electrons move only in orbits where mvr = nh/2π.', 'Angular momentum comes only in whole multiples of h/2π.'),
  short(A(2, 2), 'State two conclusions that Rutherford drew from alpha-particle scattering.', 'Most of an atom is empty space.', 'Its positive charge and nearly all its mass are in a very small nucleus.'),
  short(A(3, 2), 'Name the series of the hydrogen spectrum in which the jumps end on n = 1, on n = 2 and on n = 3, and say in which region each is.', 'Lyman: ultraviolet.', 'Balmer: visible.', 'Paschen: infrared.'),
  short(A(3, 3), 'The ground state of hydrogen is −13.6 eV. Find its ionisation energy, and the shortest wavelength of the Lyman series, using hc = 1240 eV nm.', 'Ionisation energy is 13.6 eV.', 'The shortest wavelength comes from a jump from infinity to n = 1.', 'λ = 1240 / 13.6 ≈ 91 nm.'),
  reason(B(1, 1), 'Why is the mass of a nucleus less than the total of its nucleons?', 'The difference, the mass defect, is released as binding energy when the nucleus forms.'),
  reason(B(2, 2), 'Why are heavy nuclei split, and very light ones joined, to get energy?', 'Binding energy per nucleon peaks near iron.', 'Moving towards that peak from either side releases energy.'),
  reason(B(2, 2), 'Why are neutrons better than protons at causing fission?', 'A neutron has no charge.', 'So the nucleus doesn’t repel it, even at low speed.'),
  reason(B(2, 3), 'Why must fusion take place at temperatures of millions of kelvin?', 'Nuclei repel each other strongly.', 'Only at such temperatures do they move fast enough to get close enough for the strong force to act.'),
  reason(B(1, 2), 'Why is the density of nuclear matter the same for nearly all nuclei?', 'A nucleus’s volume goes as A, since R goes as A^(1/3), so mass over volume is the same.'),
  short(B(2, 1), 'State two properties of nuclear force.', 'It is very strong, at short range only.', 'It doesn’t depend on charge, and acts between all pairs of nucleons.'),
  short(B(2, 2), 'Define mass defect and binding energy, and give the link between them.', 'Mass defect is the mass of the separate nucleons, less the mass of the nucleus.', 'Binding energy is the energy needed to split the nucleus into them, E = Δm c².'),
  short(B(3, 2), 'Sketch in words the curve of binding energy per nucleon against mass number. Where is it highest, and what do its two ends mean for energy?', 'It rises fast, peaks near A = 56, then falls slowly.', 'Nuclei near the peak are most stable.', 'Light nuclei give energy by fusing, and heavy ones by splitting.'),
  tell(B(3, 3), 'Distinguish between nuclear fission and nuclear fusion in three points.', 'Fission splits a heavy nucleus, and fusion joins light ones.', 'Fission can go on with slow neutrons at ordinary temperatures, and fusion needs millions of kelvin.', 'Fusion gives more energy per nucleon, and leaves less radioactive waste.'),
];

export default questions;
