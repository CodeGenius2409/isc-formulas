// Written by hand: matrices and determinants, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('mathematics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  ar(A(1, 1), 'Every diagonal entry of a skew-symmetric matrix is zero.', 'For a skew-symmetric matrix, $a_{ij} = -a_{ji}$.', 1, 'Putting $i = j$ gives $a_{ii} = -a_{ii}$, so $a_{ii} = 0$.'),
  ar(A(1, 2), '$AB = BA$ for all square matrices $A$ and $B$ of the same order.', 'Matrix addition is commutative.', 4, 'Multiplication isn’t commutative in general; addition is.'),
  ar(A(1, 2), 'A non-zero matrix can have a square equal to the zero matrix.', '$\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}^2 = O$.', 1, 'That matrix is an example, so the assertion holds.'),
  ar(A(1, 3), 'Every square matrix can be written as the sum of a symmetric and a skew-symmetric matrix.', '$A = \\frac{1}{2}(A + A^T) + \\frac{1}{2}(A - A^T)$.', 1, 'The first part is symmetric and the second skew-symmetric.'),
  ar(A(1, 3), 'The inverse of a square matrix, when it exists, is unique.', 'Every square matrix has an inverse.', 3, 'Only a matrix with non-zero determinant has an inverse; when it does, it is unique.'),
  ar(B(1, 1), 'A determinant with two identical rows is zero.', 'Swapping two rows changes the sign of a determinant.', 1, 'Swapping the identical rows gives $\\Delta = -\\Delta$, so $\\Delta = 0$.'),
  ar(B(1, 2), 'If $|A| = 0$, the system $AX = B$ has a unique solution.', 'A unique solution needs $A^{-1}$ to exist.', 4, 'With $|A| = 0$, $A^{-1}$ doesn’t exist, so there is no unique solution.'),
  ar(B(1, 2), 'For a $3 \\times 3$ matrix, $|2A| = 8|A|$.', 'Multiplying a matrix by 2 multiplies each of its three rows by 2.', 1, 'Each row gives a factor of 2, so $2^3 = 8$.'),
  ar(B(1, 3), 'Three points are collinear if the area of the triangle they form is zero.', 'The area of a triangle is half the size of a determinant of its vertices.', 2, 'Both are true, but collinearity follows from the area being zero, not from how the area is computed.'),
];

export default questions;
