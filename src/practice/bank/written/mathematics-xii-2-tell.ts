// Written by hand: matrices and determinants, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('mathematics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  tell(A(2, 1), 'Distinguish between a matrix and a determinant.', 'A matrix is an array of numbers, of any order, and has no single value.', 'A determinant belongs to a square matrix and is a single number.'),
  tell(A(2, 2), 'Distinguish between a symmetric and a skew-symmetric matrix.', 'Symmetric: $A^T = A$, so $a_{ij} = a_{ji}$.', 'Skew-symmetric: $A^T = -A$, so $a_{ij} = -a_{ji}$, and every diagonal entry is 0.'),
  tell(A(2, 2), 'Distinguish between a diagonal, a scalar and an identity matrix.', 'A diagonal matrix has zeros off the diagonal; a scalar matrix is diagonal with all its diagonal entries equal.', 'An identity matrix is the scalar matrix whose diagonal entries are all 1.'),
  tell(A(2, 3), 'Distinguish between a singular and a non-singular matrix.', 'A singular matrix has determinant zero, and no inverse.', 'A non-singular matrix has a non-zero determinant, and an inverse.'),
  tell(A(3, 3), 'Distinguish between $AB$ and $BA$ for $A = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ and $B = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}$.', '$AB = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$.', '$BA = \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}$.', 'They differ, so matrix multiplication isn’t commutative.'),
  tell(B(2, 1), 'Distinguish between the adjoint and the inverse of a square matrix.', 'The adjoint is the transpose of the matrix of cofactors, and always exists.', 'The inverse is $\\frac{1}{|A|}\\operatorname{adj} A$, which exists only when $|A| \\ne 0$.'),
  tell(B(2, 2), 'Distinguish between a consistent and an inconsistent system of equations.', 'A consistent system has at least one solution.', 'An inconsistent system has none, as two of its equations contradict each other.'),
  tell(B(2, 3), 'Distinguish between expanding a determinant along a row and along a column.', 'Along a row, each entry of that row is multiplied by its cofactor and the products added.', 'Along a column, the same is done with a column; both give the same value.'),
  tell(B(3, 3), 'Distinguish between $|A|$, $|A^T|$ and $|kA|$ for a $3 \\times 3$ matrix $A$.', '$|A^T| = |A|$, as transposing doesn’t change a determinant.', '$|kA| = k^3|A|$, as each of the three rows is multiplied by $k$.', 'So only $|kA|$ differs from $|A|$, unless $k^3 = 1$.'),
];

export default questions;
