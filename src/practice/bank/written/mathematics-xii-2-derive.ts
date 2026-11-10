// Written by hand: matrices and determinants, proofs not already in the bank. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { derive } = kit('mathematics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  derive(A(3, 2), 'Prove that $(A^{-1})^T = (A^T)^{-1}$ for an invertible matrix $A$.', ['$AA^{-1} = I$, and transposing gives $(A^{-1})^T A^T = I^T = I$.', 1], ['Likewise, from $A^{-1}A = I$, $A^T (A^{-1})^T = I$.', 1], ['So $(A^{-1})^T$ is the inverse of $A^T$.', 1]),
  derive(A(3, 3), 'Prove that if $A$ is symmetric, then $B^T A B$ is symmetric for any $B$ of suitable order.', ['$(B^T A B)^T = B^T A^T (B^T)^T$.', 1], ['$= B^T A^T B$.', 1], ['$= B^T A B$, as $A^T = A$; so it is symmetric.', 1]),
  derive(B(3, 2), 'Prove that $A(\\operatorname{adj} A) = |A| I$ for a $2 \\times 2$ matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$.', ['$\\operatorname{adj} A = \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$.', 1], ['$A(\\operatorname{adj} A) = \\begin{pmatrix} ad - bc & 0 \\\\ 0 & ad - bc \\end{pmatrix}$.', 1], ['$= (ad - bc) I = |A| I$.', 1]),
  derive(B(3, 3), 'Prove that $|\\operatorname{adj} A| = |A|^{n - 1}$ for an $n \\times n$ matrix with $|A| \\ne 0$.', ['Take determinants of $A(\\operatorname{adj} A) = |A| I$: $|A||\\operatorname{adj} A| = |A|^n$.', 1], ['as $|kI| = k^n$ for an $n \\times n$ identity.', 1], ['Dividing by $|A|$, $|\\operatorname{adj} A| = |A|^{n - 1}$.', 1]),
];

export default questions;
