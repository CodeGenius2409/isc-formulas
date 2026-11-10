// Written by hand: matrices and determinants, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('mathematics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  predict(A(2, 1), 'Predict the order of $AB$ when $A$ is $3 \\times 2$ and $B$ is $2 \\times 4$, and whether $BA$ exists.', '$AB$ is $3 \\times 4$.', '$BA$ doesn’t exist, as $B$ has 4 columns and $A$ has 3 rows.'),
  predict(A(2, 2), 'Predict whether $(A + B)(A - B) = A^2 - B^2$ for any two square matrices of the same order.', 'Not always.', 'Expanding gives $A^2 - AB + BA - B^2$, and $AB$ and $BA$ needn’t be equal.'),
  predict(A(2, 2), 'Predict what kind of matrix $A^T A$ is, for any matrix $A$.', 'Symmetric.', '$(A^T A)^T = A^T (A^T)^T = A^T A$.'),
  predict(A(3, 3), '$A$ is a square matrix with $A^2 = A$. Predict what $(I - A)^2$ equals.', '$(I - A)^2 = I - 2A + A^2$.', 'Using $A^2 = A$, this is $I - 2A + A = I - A$.', 'So $I - A$ has the same property as $A$.'),
  predict(A(2, 3), 'Predict whether the inverse of a symmetric invertible matrix is symmetric.', 'Yes.', '$(A^{-1})^T = (A^T)^{-1} = A^{-1}$, as $A^T = A$.'),
  predict(B(2, 1), 'Two columns of a determinant are swapped, and then one row is multiplied by 3. Predict the new value if the first was 5.', 'Swapping changes the sign: $-5$.', 'Multiplying a row by 3 multiplies it by 3: $-15$.'),
  predict(B(2, 2), 'Predict the value of a determinant in which one row is the sum of the other two.', 'Zero.', 'Subtracting the other two rows from it leaves a row of zeros, without changing the value.'),
  predict(B(2, 2), 'A system $AX = B$ has $|A| = 0$, and $(\\operatorname{adj} A)B \\ne O$. Predict how many solutions it has.', 'None.', 'The system is inconsistent.'),
  predict(B(3, 3), 'Predict the value of $|A^{-1}|$ and of $|\\operatorname{adj} A|$ for a $3 \\times 3$ matrix with $|A| = -2$.', '$|A^{-1}| = \\frac{1}{|A|} = -\\frac{1}{2}$.', '$|\\operatorname{adj} A| = |A|^2 = 4$.', 'The second is always non-negative for a $3 \\times 3$ matrix, as the power is even.'),
  predict(B(2, 3), 'Predict the area given by the determinant for three points that lie on one line, and what that tells you.', 'The determinant is zero.', 'Zero area means the points don’t make a triangle, so they are collinear: this is a test for collinearity.'),
];

export default questions;
