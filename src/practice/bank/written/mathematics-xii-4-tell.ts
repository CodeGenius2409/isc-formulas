// Written by hand: vector algebra, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('mathematics', 'XII');
const V = at(4, 'a');

const questions: BankDef[] = [
  tell(V(2, 1), 'Distinguish between a scalar and a vector, with an example of each.', 'A scalar has size only, as mass.', 'A vector has size and direction, as velocity.'),
  tell(V(2, 2), 'Distinguish between the scalar product and the vector product of two vectors.', 'The scalar product, $\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta$, is a number, and is commutative.', 'The vector product, $\\vec{a} \\times \\vec{b}$, of size $|\\vec{a}||\\vec{b}|\\sin\\theta$, is a vector at right angles to both, and changes sign when the order changes.'),
  tell(V(2, 2), 'Distinguish between equal vectors and collinear vectors.', 'Equal vectors have the same size and the same direction.', 'Collinear vectors lie along the same or parallel lines, but may differ in size and sense.'),
  tell(V(2, 3), 'Distinguish between direction cosines and direction ratios.', 'Direction cosines are the cosines of the angles with the axes, and $l^2 + m^2 + n^2 = 1$.', 'Direction ratios are any three numbers in proportion to them.'),
  tell(V(2, 3), 'Distinguish between a position vector and a free vector.', 'A position vector starts at the origin and marks a point.', 'A free vector has a size and direction but can start anywhere.'),
];

export default questions;
