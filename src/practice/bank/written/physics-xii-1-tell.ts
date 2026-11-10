// Written by hand: electrostatics, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('physics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  tell(A(2, 1), 'Distinguish between a point charge and a continuous charge distribution.', 'A point charge is one whose size can be ignored, taken to be at one point.', 'A continuous distribution spreads charge over a line, a surface or a volume, described by λ, σ or ρ.'),
  tell(A(2, 2), 'Distinguish between electric field and electric flux.', 'Electric field is the force per unit positive charge at a point, a vector.', 'Electric flux is the field passing through a surface, E·A, a scalar.'),
  tell(A(2, 2), 'Distinguish between charging by conduction and by induction.', 'By conduction, a charged body touches the other and shares charge with it, giving the same sign.', 'By induction, it is only brought near and the far side earthed, giving the opposite sign.'),
  tell(A(3, 3), 'Distinguish between the field of a dipole on its axis and on its equatorial line.', 'On the axis, E = 2kp/r³, along p.', 'On the equatorial line, E = kp/r³, half as strong.', 'There it points opposite to p.'),
  tell(A(2, 3), 'Distinguish between the field lines of an isolated positive charge and of an isolated negative charge.', 'Positive: the lines point radially outward, starting on the charge.', 'Negative: they point radially inward, ending on it.'),
  tell(B(2, 1), 'Distinguish between electric potential and potential difference.', 'Potential at a point is the work done per unit charge in bringing a charge there from infinity.', 'Potential difference is the work done per unit charge in moving it between two points.'),
  tell(B(2, 2), 'Distinguish between the energy stored in a capacitor and the work done by the battery that charges it.', 'The energy stored is ½QV.', 'The battery does QV of work; the other half is turned into heat in the wires.'),
  tell(B(2, 2), 'Distinguish between equipotential surfaces and electric field lines.', 'An equipotential surface joins points at the same potential, and no work is done moving along it.', 'Field lines cross equipotentials at right angles, pointing from higher to lower potential.'),
  tell(B(3, 3), 'Distinguish between a capacitor with a dielectric and one with a metal slab of the same thickness between its plates.', 'A dielectric slab reduces the field inside it by the factor K.', 'A metal slab makes the field inside it zero.', 'So the metal raises the capacitance more, as if the gap were narrowed by the slab’s thickness.'),
  tell(B(2, 3), 'Distinguish between a polar and a non-polar dielectric in an electric field.', 'In a polar dielectric, the molecules’ own dipoles line up with the field.', 'In a non-polar one, the field first creates dipoles, then lines them up.'),
];

export default questions;
