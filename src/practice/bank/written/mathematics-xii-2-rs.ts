// Written by hand: matrices and determinants, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('mathematics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Explain why a $2 \\times 3$ matrix can’t be multiplied by another $2 \\times 3$ matrix.', 'The number of columns of the first, 3, must equal the number of rows of the second, 2.'),
  reason(A(2, 2), 'Explain why $(A + B)^2$ need not equal $A^2 + 2AB + B^2$ for square matrices.', '$(A + B)^2 = A^2 + AB + BA + B^2$.', '$AB$ and $BA$ need not be equal, so $AB + BA$ need not be $2AB$.'),
  reason(A(2, 2), 'Explain why the diagonal entries of a skew-symmetric matrix are all zero.', 'Skew-symmetric means $a_{ij} = -a_{ji}$ for every $i$ and $j$.', 'For $i = j$ this gives $a_{ii} = -a_{ii}$, so $a_{ii} = 0$.'),
  reason(A(2, 3), 'Explain why $AB = O$ doesn’t mean that $A = O$ or $B = O$ for matrices.', 'The product can be zero for two non-zero matrices.', 'For example, $\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}^2 = O$, though the matrix isn’t zero.'),
  reason(A(1, 2), 'Explain why a square matrix can have at most one inverse.', 'If $B$ and $C$ are both inverses of $A$, then $B = B(AC) = (BA)C = C$.'),
  short(A(2, 1), 'Show that $A + A^T$ is symmetric for any square matrix $A$.', '$(A + A^T)^T = A^T + (A^T)^T = A^T + A$.', 'That is $A + A^T$ again, so it is symmetric.'),
  short(A(2, 2), 'Write $A = \\begin{pmatrix} 1 & 3 \\\\ 5 & 2 \\end{pmatrix}$ as the sum of a symmetric and a skew-symmetric matrix.', 'Symmetric part: $\\frac{1}{2}(A + A^T) = \\begin{pmatrix} 1 & 4 \\\\ 4 & 2 \\end{pmatrix}$.', 'Skew-symmetric part: $\\frac{1}{2}(A - A^T) = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$.'),
  short(A(2, 2), 'If $A = \\begin{pmatrix} 1 & 2 \\\\ 0 & 1 \\end{pmatrix}$, find $AB$ and $BA$ for $B = \\begin{pmatrix} 1 & 0 \\\\ 3 & 1 \\end{pmatrix}$. What does it show?', '$AB = \\begin{pmatrix} 7 & 2 \\\\ 3 & 1 \\end{pmatrix}$ and $BA = \\begin{pmatrix} 1 & 2 \\\\ 3 & 7 \\end{pmatrix}$.', 'They differ, so matrix multiplication isn’t commutative.'),
  short(A(3, 3), 'Show that $(AB)^{-1} = B^{-1}A^{-1}$ for invertible square matrices $A$ and $B$ of the same order.', '$(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AA^{-1} = I$.', 'Likewise $(B^{-1}A^{-1})(AB) = I$.', 'The inverse is unique, so $(AB)^{-1} = B^{-1}A^{-1}$.'),
  reason(B(1, 1), 'Explain why a determinant with two equal rows is zero.', 'Swapping the two rows changes its sign but leaves it the same, so $\\Delta = -\\Delta$, and $\\Delta = 0$.'),
  reason(B(2, 2), 'Explain why a matrix with determinant zero has no inverse.', '$A^{-1} = \\frac{1}{|A|} \\operatorname{adj} A$ needs $|A| \\ne 0$.', 'Also $|A||A^{-1}| = |I| = 1$, which is impossible if $|A| = 0$.'),
  reason(B(2, 2), 'Explain why three points are collinear when the determinant giving the area of their triangle is zero.', 'The determinant gives twice the area of the triangle.', 'A zero area means the three points don’t form a triangle, so they lie on one line.'),
  reason(B(2, 3), 'Explain why $|kA| = k^3|A|$, not $k|A|$, for a $3 \\times 3$ matrix $A$.', 'Multiplying $A$ by $k$ multiplies every row by $k$.', 'Each row gives a factor $k$ out of the determinant, so three rows give $k^3$.'),
  reason(B(1, 2), 'Explain why the system $AX = B$ has a unique solution when $|A| \\ne 0$.', 'Then $A^{-1}$ exists, and $X = A^{-1}B$ is the only solution.'),
  tell(B(2, 1), 'Distinguish between the minor and the cofactor of an entry of a determinant.', 'The minor $M_{ij}$ is the determinant left after deleting row $i$ and column $j$.', 'The cofactor is $A_{ij} = (-1)^{i+j} M_{ij}$.'),
  short(B(2, 2), 'If $A$ is a $3 \\times 3$ matrix with $|A| = 4$, find $|\\operatorname{adj} A|$ and $|2A|$.', '$|\\operatorname{adj} A| = |A|^{n-1} = 4^2 = 16$.', '$|2A| = 2^3 \\times 4 = 32$.'),
  short(B(2, 2), 'For what values of $k$ does the system $x + 2y = 3$, $2x + ky = 6$ have more than one solution?', 'The determinant $k - 4$ must be zero, so $k = 4$.', 'Then the second equation is twice the first, so there are infinitely many solutions.'),
  short(B(3, 3), 'Describe how to tell, using $A^{-1}$ or adj $A$, whether the system $AX = B$ is consistent with one solution, consistent with many, or inconsistent.', 'If $|A| \\ne 0$, it is consistent with the unique solution $X = A^{-1}B$.', 'If $|A| = 0$ and $(\\operatorname{adj} A)B \\ne O$, it is inconsistent.', 'If $|A| = 0$ and $(\\operatorname{adj} A)B = O$, it may be consistent with many solutions, or inconsistent, which has to be checked.'),
];

export default questions;
