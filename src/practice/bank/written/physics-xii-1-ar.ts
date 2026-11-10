// Written by hand: electrostatics, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('physics', 'XII');
const E1 = at(1, 'a');
const E2 = at(1, 'b');

const questions: BankDef[] = [
  ar(E1(1, 1), 'A charged comb attracts small bits of uncharged paper.', 'The comb induces opposite charge on the near side of the paper.', 1, 'The induced charge is nearer the comb than the like charge left on the far side, so attraction wins.'),
  ar(E1(1, 2), 'Electric field lines never cross each other.', 'Electric field lines always form closed loops.', 3, 'They never cross, as the field has one direction at each point. But electrostatic field lines start and end on charges, so they don’t form closed loops.'),
  ar(E1(1, 2), 'Charge given to an isolated conductor spreads over its outer surface.', 'Like charges repel, and the field inside the conductor must become zero.', 1, 'The charges push apart as far as they can, and settle only when there is no field left inside to move them.'),
  ar(E1(1, 3), 'A dipole in a uniform electric field feels a net force.', 'The forces on its two charges are equal and opposite.', 4, 'In a uniform field the two forces cancel, so there is no net force, only a torque.'),
  ar(E1(1, 3), 'Gauss’s law can be used to find the field of any charge distribution easily.', 'Gauss’s law holds for every closed surface.', 4, 'Gauss’s law always holds, but it only gives the field easily when symmetry makes E constant over a suitable surface.'),
  ar(E2(1, 1), 'No work is done in moving a charge along an equipotential surface.', 'The potential is the same at every point on it.', 1, 'W = qΔV, and ΔV = 0 along the surface.'),
  ar(E2(1, 2), 'Putting a dielectric slab between the plates of a capacitor raises its capacitance.', 'The dielectric is polarised, which weakens the field between the plates.', 1, 'A weaker field means a smaller voltage for the same charge, so C = Q/V rises.'),
  ar(E2(1, 2), 'The electric potential at the centre of a charged hollow sphere is zero.', 'The electric field inside a charged hollow sphere is zero.', 4, 'With no field inside, the potential is the same everywhere inside, equal to its value at the surface, which isn’t zero.'),
  ar(E2(1, 3), 'Capacitors in series all hold the same charge.', 'Capacitance in series is found by adding reciprocals.', 2, 'Both are true, but the same charge comes from the charge passing through the chain, not from the rule for combining them.'),
];

export default questions;
