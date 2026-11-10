// Written by hand: matrices and determinants, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('mathematics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  match(A(3, 1), [['$A^T = A$', 'Symmetric matrix'], ['$A^T = -A$', 'Skew-symmetric matrix'], ['$a_{ij} = 0$ for $i \\ne j$', 'Diagonal matrix']]),
  match(A(4, 2), [['$(AB)^T$', '$B^T A^T$'], ['$(AB)^{-1}$', '$B^{-1} A^{-1}$'], ['$(A^T)^{-1}$', '$(A^{-1})^T$'], ['$(kA)^T$', '$k A^T$']]),
  match(A(3, 2), [['$2 \\times 3$ times $3 \\times 4$', 'A $2 \\times 4$ matrix'], ['$3 \\times 1$ times $1 \\times 3$', 'A $3 \\times 3$ matrix'], ['$1 \\times 3$ times $3 \\times 1$', 'A $1 \\times 1$ matrix']]),
  match(A(4, 3), [['Zero matrix', 'Every entry is 0'], ['Identity matrix', 'Diagonal entries 1, the rest 0'], ['Column matrix', 'Only one column'], ['Square matrix', 'As many rows as columns']]),
  match(A(3, 3), [['Any square matrix $A$', 'Is the sum of a symmetric and a skew-symmetric matrix'], ['$A + A^T$', 'Is always symmetric'], ['$A - A^T$', 'Is always skew-symmetric']]),
  match(B(3, 1), [['$|A^T|$', '$|A|$'], ['$|AB|$', '$|A||B|$'], ['$|A^{-1}|$', '$\\frac{1}{|A|}$']]),
  match(B(4, 2), [['$|kA|$, for $A$ of order 3', '$k^3|A|$'], ['$|\\operatorname{adj} A|$, for $A$ of order 3', '$|A|^2$'], ['$A(\\operatorname{adj} A)$', '$|A| I$'], ['$A^{-1}$', '$\\frac{1}{|A|}\\operatorname{adj} A$']]),
  match(B(3, 2), [['Two rows swapped', 'Determinant changes sign'], ['Two rows equal', 'Determinant is zero'], ['A multiple of one row added to another', 'Determinant is unchanged']]),
  match(B(4, 3), [['$|A| \\ne 0$', 'Unique solution'], ['$|A| = 0$ and $(\\operatorname{adj} A)B \\ne O$', 'No solution'], ['$|A| = 0$ and $(\\operatorname{adj} A)B = O$', 'Infinitely many solutions, or none'], ['A row multiplied by $k$', 'Determinant multiplied by $k$']]),
  match(B(3, 3), [['Area of a triangle with vertices $(x_i, y_i)$', 'Half the size of a determinant'], ['Three collinear points', 'That determinant is zero'], ['Cofactor $A_{ij}$', '$(-1)^{i+j} M_{ij}$']]),
];

export default questions;
