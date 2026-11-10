// Written by hand: matrices and determinants, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('mathematics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  odd(A(2, 1), ['$A + B = B + A$', '$(A + B) + C = A + (B + C)$', '$AB = BA$', '$k(A + B) = kA + kB$'], '$AB = BA$', 'It isn’t true for all square matrices; the others always are.'),
  odd(A(2, 2), ['$\\begin{pmatrix} 1 & 2 \\\\ 2 & 3 \\end{pmatrix}$', '$\\begin{pmatrix} 0 & 4 \\\\ 4 & 1 \\end{pmatrix}$', '$\\begin{pmatrix} 5 & 0 \\\\ 0 & 5 \\end{pmatrix}$', '$\\begin{pmatrix} 0 & 2 \\\\ -2 & 0 \\end{pmatrix}$'], '$\\begin{pmatrix} 0 & 2 \\\\ -2 & 0 \\end{pmatrix}$', 'It is skew-symmetric; the others are symmetric.'),
  odd(A(2, 2), ['$(AB)^T = B^T A^T$', '$(AB)^{-1} = B^{-1} A^{-1}$', '$(A^T)^T = A$', '$(A + B)^2 = A^2 + 2AB + B^2$'], '$(A + B)^2 = A^2 + 2AB + B^2$', 'It isn’t true in general, as $AB$ and $BA$ can differ; the others always hold.'),
  odd(A(2, 3), ['$2 \\times 3$', '$3 \\times 3$', '$1 \\times 1$', '$4 \\times 4$'], '$2 \\times 3$', 'It isn’t square, so it has no determinant or inverse; the others are square.'),
  odd(A(2, 3), ['zero matrix', 'identity matrix', 'diagonal matrix', 'row matrix'], 'row matrix', 'It needn’t be square; the others are square matrices.'),
  odd(B(2, 1), ['minor', 'cofactor', 'adjoint', 'transpose'], 'transpose', 'It doesn’t need determinants to find; the others are found from them.'),
  odd(B(2, 2), ['swap two rows', 'add a multiple of one row to another', 'take the transpose', 'multiply a row by 2'], 'multiply a row by 2', 'It changes the size of the determinant; the others change at most its sign.'),
  odd(B(2, 2), ['$|A^T| = |A|$', '$|AB| = |A||B|$', '$|kA| = k|A|$ for order 3', '$|A^{-1}| = \\frac{1}{|A|}$'], '$|kA| = k|A|$ for order 3', 'It is wrong: for order 3, $|kA| = k^3|A|$; the others are right.'),
  odd(B(2, 3), ['unique solution', 'no solution', 'infinitely many solutions', 'exactly two solutions'], 'exactly two solutions', 'A system of linear equations can never have exactly two; the others can happen.'),
  odd(B(2, 3), ['$|A| \\ne 0$', '$A^{-1}$ exists', '$A$ is non-singular', '$|A| = 0$'], '$|A| = 0$', 'It means $A$ has no inverse; the others all say that it has one.'),
];

export default questions;
