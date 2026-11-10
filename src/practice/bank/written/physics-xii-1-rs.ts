// Written by hand: electrostatics, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('physics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why can two electric field lines never cross?', 'At a crossing point the field would have two directions at once, which is impossible.'),
  reason(A(2, 2), 'A charged comb attracts small bits of paper, though the paper has no net charge. Why?', 'The comb induces opposite charge on the near side of the paper.', 'The near charges are attracted more strongly than the far ones are repelled, so the net force is an attraction.'),
  reason(A(2, 2), 'Why is a test charge taken to be vanishingly small when a field is measured?', 'A larger charge would push the charges making the field out of place.', 'That would change the very field being measured.'),
  reason(A(2, 3), 'The electric field just outside a charged conductor is always normal to its surface. Why?', 'A part of the field along the surface would push charges along it.', 'Charges are at rest in equilibrium, so no such part can exist.'),
  reason(A(1, 2), 'Why does the flux through a closed surface not change when a charge outside it is moved?', 'Every field line from an outside charge that enters the surface also leaves it, so its net flux stays zero.'),
  short(A(2, 1), 'State Coulomb’s law, and name the factor that changes the force when the charges are placed in a medium.', 'The force between two point charges is proportional to the product of the charges and inversely proportional to the square of the distance between them, along the line joining them.', 'The relative permittivity of the medium, which divides the force.'),
  short(A(2, 2), 'State Gauss’s theorem in electrostatics, and say why the surface need not be a real one.', 'The net flux through a closed surface is 1/ε₀ times the net charge inside it.', 'The surface is only a means of counting field lines, so any imagined closed surface will do.'),
  short(A(2, 2), 'What is an electric dipole? Write the SI unit and direction of its dipole moment.', 'A pair of equal and opposite charges a short distance apart.', 'Its moment is q × 2a in C m, pointing from the negative to the positive charge.'),
  short(A(3, 2), 'State three properties of electric field lines.', 'They start on positive charges and end on negative ones, or go to infinity.', 'They are closer together where the field is stronger.', 'They never cross, and they meet a conductor at right angles.'),
  short(A(3, 3), 'A hollow metal sphere holds a charge. Say what the field is inside it, on its surface and outside it, with a reason from Gauss’s theorem.', 'Inside, it is zero, as a Gaussian surface there encloses no charge.', 'On the surface, it is σ/ε₀, normal to the surface.', 'Outside, it falls as 1/r², as if all the charge were at the centre.'),
  reason(B(1, 1), 'Why is no work done in moving a charge along an equipotential surface?', 'The potential difference along it is zero, and work is charge times potential difference.'),
  reason(B(2, 2), 'The plates of a charged capacitor are moved apart while it stays connected to a battery. Why does its stored energy fall?', 'The voltage is fixed, and the capacitance falls as the gap widens.', 'Energy is ½CV², so it falls with C.'),
  reason(B(2, 3), 'A dielectric slab raises the capacitance of a capacitor. Why?', 'Its polarised charges set up a field opposite to the plates’ field, which lowers the field between them.', 'So the same charge has a smaller potential difference, and C = Q/V rises.'),
  short(B(2, 1), 'Define electric potential at a point, and say whether it is a scalar or a vector.', 'The work done per unit positive charge in bringing a charge from infinity to that point.', 'A scalar.'),
  short(B(2, 2), 'What is the relation between electric field and potential? What does the minus sign mean?', 'E = −dV/dr.', 'The field points in the direction in which the potential falls.'),
  short(B(2, 2), 'Define the capacitance of a capacitor. On what two things does that of a parallel plate capacitor depend, in air?', 'The charge stored per unit potential difference, C = Q/V.', 'The area of the plates, directly, and the gap between them, inversely.'),
  short(B(3, 2), 'Write the capacitance of two capacitors in series and in parallel. Which arrangement gives the larger value, and when would you use the other?', '1/C = 1/C₁ + 1/C₂ in series, and C = C₁ + C₂ in parallel.', 'Parallel gives the larger value.', 'Series is used to withstand a higher voltage.'),
  short(B(3, 3), 'A capacitor of capacitance C is charged to a potential V. Write its stored energy in terms of C and V, and in terms of Q and C. Where is this energy held?', 'U = ½CV².', 'U = Q²/(2C).', 'In the electric field between the plates.'),
];

export default questions;
