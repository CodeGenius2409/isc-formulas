// Written by hand: atoms and nuclei, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('physics', 'XII');
const A = at(8, 'a');
const B = at(8, 'b');

const questions: BankDef[] = [
  predict(A(2, 1), 'In Rutherford’s experiment, the gold foil is replaced by a thin aluminium foil. Predict what happens to the number of alpha particles scattered through large angles.', 'Far fewer are scattered through large angles.', 'An aluminium nucleus has a much smaller charge, so it repels an alpha particle far less strongly.'),
  predict(A(2, 2), 'A hydrogen atom’s electron moves from n = 1 to n = 2. Predict what happens to the radius of its orbit and to its speed.', 'The radius becomes four times as large, as r ∝ n².', 'The speed halves, as v ∝ 1/n.'),
  predict(A(2, 2), 'Hydrogen atoms in the ground state are struck by photons of 10.2 eV, and then by photons of 11 eV. Predict which are absorbed.', 'The 10.2 eV photons are absorbed, lifting electrons from n = 1 to n = 2.', 'The 11 eV photons are not, as no jump takes exactly 11 eV.'),
  predict(A(3, 3), 'A sample of hydrogen is excited so that its electrons reach the n = 4 level. Predict how many different spectral lines it can give, and which series they belong to.', 'Six lines: from 4, 3 and 2 down to 1, from 4 and 3 down to 2, and from 4 down to 3.', 'Three are in the Lyman series and two in the Balmer series.', 'One, from 4 to 3, is in the Paschen series.'),
  predict(A(2, 3), 'An alpha particle is aimed straight at a gold nucleus with twice the kinetic energy. Predict what happens to its distance of closest approach.', 'It halves.', 'At closest approach all the kinetic energy has become potential energy, which is proportional to 1/r.'),
  predict(B(2, 1), 'A heavy nucleus with A = 240 splits into two of A = 120. Predict whether energy is released.', 'Yes.', 'The binding energy per nucleon is about 7.6 MeV for A = 240 and about 8.5 MeV for A = 120, so the products are more tightly bound.'),
  predict(B(2, 2), 'Predict how the radius of a nucleus changes when its mass number becomes eight times as large.', 'It doubles.', 'R = R₀A^(1/3), and 8^(1/3) = 2.'),
  predict(B(2, 2), 'Predict whether two deuterium nuclei joining to form helium releases or absorbs energy, and why.', 'It releases energy.', 'Helium-4 has a far higher binding energy per nucleon than deuterium, so mass is lost as energy.'),
  predict(B(3, 3), 'Predict how the nuclear force between two protons compares with that between two neutrons and between a proton and a neutron, at the same separation inside a nucleus.', 'All three are about the same.', 'The nuclear force doesn’t depend on charge.', 'The two protons also repel electrically, so their net attraction is a little less.'),
  predict(B(2, 3), 'Predict the effect on the mass of a nucleus of the energy that binds it, compared with the masses of its separate nucleons.', 'The nucleus has less mass than its nucleons put together.', 'The difference, the mass defect, is the binding energy divided by c².'),
];

export default questions;
