// Written by hand: numericals on matrices and determinants, for Mathematics XII at 0% generated. The answers are computed separately
// in tests/unit/written-answers.test.ts. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { theory } = bank('mathematics', 'XII');
const n = (place: Place, text: string, points: (string | [string, number])[]) => theory('short', place, text, points, { format: 'numerical' });
const M = (marks: number, d: 1 | 2 | 3): Place => [2, 'a', marks, d];
const D = (marks: number, d: 1 | 2 | 3): Place => [2, 'b', marks, d];

const questions: BankDef[] = [
  // ---- 2a Matrices
  n(M(1, 1), 'If $A$ is $2 \\times 3$ and $B$ is $3 \\times 4$, how many elements does $AB$ have?', ['$AB$ is $2 \\times 4$, so it has $8$ elements.']),
  n(M(1, 2), 'How many $2 \\times 2$ matrices have every entry 0 or 1?', ['Four places with two choices each: $2^4 = 16$.']),
  n(M(2, 1), 'Find $x$ and $y$ if $\\begin{bmatrix}x + y & 2\\\\5 & x - y\\end{bmatrix} = \\begin{bmatrix}6 & 2\\\\5 & 2\\end{bmatrix}$. Give the value of $xy$.', ['$x + y = 6$ and $x - y = 2$, so $x = 4$ and $y = 2$.', 'So $xy = 8$.']),
  n(M(2, 1), 'If $A = \\begin{bmatrix}2 & 1\\\\3 & 4\\end{bmatrix}$ and $B = \\begin{bmatrix}1 & 0\\\\2 & 1\\end{bmatrix}$, find the element in the second row and first column of $AB$.', ['It is row 2 of $A$ with column 1 of $B$: $3 \\times 1 + 4 \\times 2$.', 'This is $11$.']),
  n(M(2, 2), 'If $A = \\begin{bmatrix}1 & 2\\\\2 & 1\\end{bmatrix}$, find $k$ such that $A^2 - 2A = kI$.', ['$A^2 = \\begin{bmatrix}5 & 4\\\\4 & 5\\end{bmatrix}$, and subtracting $2A$ gives $\\begin{bmatrix}3 & 0\\\\0 & 3\\end{bmatrix}$.', 'So $k = 3$.']),
  n(M(3, 2), 'If $A = \\begin{bmatrix}4 & 1\\\\-1 & 2\\end{bmatrix}$, find $k$ such that $A^2 - 6A + kI = O$.', ['$A^2 = \\begin{bmatrix}15 & 6\\\\-6 & 3\\end{bmatrix}$.', '$A^2 - 6A = \\begin{bmatrix}-9 & 0\\\\0 & -9\\end{bmatrix}$.', 'So $k = 9$.']),
  n(M(3, 1), 'A school buys 5 notebooks, 3 pens and 2 rulers, priced at ₹10, ₹15 and ₹20 each. Write the cost as a product of two matrices, and find it.', ['Prices as a row matrix: $\\begin{bmatrix}10 & 15 & 20\\end{bmatrix}$.', 'Quantities as a column matrix, with the entries 5, 3 and 2.', 'The product is $50 + 45 + 40 = 135$ rupees.']),
  n(M(3, 2), 'Write $A = \\begin{bmatrix}3 & 5\\\\1 & -1\\end{bmatrix}$ as $P + Q$, with $P$ symmetric and $Q$ skew-symmetric. Find the element of $P$ in the first row and second column.', ['$P = \\frac{1}{2}(A + A^T) = \\begin{bmatrix}3 & 3\\\\3 & -1\\end{bmatrix}$.', '$Q = \\frac{1}{2}(A - A^T) = \\begin{bmatrix}0 & 2\\\\-2 & 0\\end{bmatrix}$.', 'So the element is $3$.']),
  n(M(5, 2), 'If $A = \\begin{bmatrix}2 & 3\\\\1 & 2\\end{bmatrix}$, find $A^{-1}$ by elementary operations, and use it to solve $2x + 3y = 7$, $x + 2y = 4$. Give the value of $x$.', ['Start from $[A \\mid I]$, and interchange the rows.', '$R_2 \\to R_2 - 2R_1$, then $R_2 \\to -R_2$.', '$R_1 \\to R_1 - 2R_2$ gives $A^{-1} = \\begin{bmatrix}2 & -3\\\\-1 & 2\\end{bmatrix}$.', 'The solution is $A^{-1}$ times the column with entries 7 and 4.', 'So $x = 2$, and $y = 1$.']),
  n(M(5, 3), 'A shop sells two brands of tea. In one week it sells 20 packets of $X$ and 30 of $Y$, and in the next 25 of $X$ and 15 of $Y$. A packet of $X$ gives ₹12 profit, and one of $Y$ gives ₹8. (i) Write the sales as a $2 \\times 2$ matrix. (ii) Write the profits as a column matrix. (iii) Find the profit in the first week. (iv) Find it in the second. (v) Find the total.', ['(i) The rows are the weeks, $\\begin{bmatrix}20 & 30\\\\25 & 15\\end{bmatrix}$.', '(ii) The column matrix has the entries 12 and 8.', '(iii) $240 + 240 = 480$ rupees.', '(iv) $300 + 120 = 420$ rupees.', '(v) The total is $900$ rupees.']),
  // ---- 2b Determinants
  n(D(1, 1), 'Find the value of $\\begin{vmatrix}2 & 3\\\\1 & 4\\end{vmatrix}$.', ['$8 - 3 = 5$.']),
  n(D(1, 1), 'Find the area of the triangle with vertices $(0, 0)$, $(4, 0)$ and $(0, 3)$, using a determinant.', ['$\\frac{1}{2}|4 \\times 3 - 0| = 6$.']),
  n(D(1, 2), 'If $A$ is a $2 \\times 2$ matrix with $|A| = 2$, find $|3A|$.', ['$|3A| = 3^2|A| = 18$.']),
  n(D(2, 1), 'Find the positive value of $x$ if $\\begin{vmatrix}x & 2\\\\3 & x\\end{vmatrix} = 10$.', ['$x^2 - 6 = 10$, so $x^2 = 16$.', 'The positive value is $4$.']),
  n(D(2, 2), 'If $A$ is a $3 \\times 3$ matrix with $|A| = 5$, find $|\\operatorname{adj} A|$.', ['$|\\operatorname{adj} A| = |A|^{n - 1}$ with $n = 3$.', 'This is $5^2 = 25$.']),
  n(D(2, 2), 'Find the cofactor of the element in the first row and second column of $\\begin{bmatrix}1 & 2 & 3\\\\4 & 5 & 6\\\\7 & 8 & 9\\end{bmatrix}$.', ['The minor is $4 \\times 9 - 6 \\times 7 = -6$.', 'The sign is $(-1)^{1 + 2}$, so the cofactor is $6$.']),
  n(D(3, 1), 'Find the value of $\\begin{vmatrix}1 & 2 & 3\\\\0 & 1 & 4\\\\5 & 6 & 0\\end{vmatrix}$.', ['Expand along the first row: $1(0 - 24) - 2(0 - 20) + 3(0 - 5)$.', 'That is $-24 + 40 - 15$.', 'This is $1$.']),
  n(D(3, 1), 'Find the area of the triangle with vertices $(1, 0)$, $(6, 0)$ and $(4, 3)$, using a determinant.', ['Set up $\\frac{1}{2}$ of the determinant with rows $(1, 0, 1)$, $(6, 0, 1)$, $(4, 3, 1)$.', 'Expanding gives $\\frac{1}{2}|{-3} + 18|$.', 'The area is $\\frac{15}{2}$.']),
  n(D(3, 2), 'Find $k$ if $(1, 2)$, $(3, k)$ and $(5, 8)$ are collinear, using a determinant.', ['The area determinant must be zero.', 'Expanding: $1(k - 8) - 2(3 - 5) + (24 - 5k) = 0$, so $20 - 4k = 0$.', 'So $k = 5$.']),
  n(D(5, 2), 'Solve by the matrix method: $x + y + z = 6$, $x - y + z = 2$, $2x + y - z = 1$. Give the value of $z$.', ['Let $A$ be the matrix of coefficients: $|A| = 6$, which isn’t zero.', 'Find the cofactors, and $\\operatorname{adj} A$.', 'Then $X = A^{-1}B$, with $B$ the column 6, 2, 1.', 'This gives $x = 1$, $y = 2$.', 'So $z = 3$.']),
  n(D(5, 3), 'Two pens, one book and one ruler cost ₹23. One pen, two books and one ruler cost ₹28. One pen, one book and two rulers cost ₹21. Set up a system, and use matrices to find the price of a book.', ['$2p + b + r = 23$, $p + 2b + r = 28$, $p + b + 2r = 21$.', 'The matrix of coefficients has determinant $4$, so it can be solved.', 'Find the inverse from the cofactors.', 'This gives $p = 5$ and $r = 3$.', 'A book costs $10$ rupees.']),
];

export default questions;
