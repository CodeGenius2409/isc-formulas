// Written by hand: arrays, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar } = kit('computerscience', 'XII');
const A = at(4, 'a');

const questions: BankDef[] = [
  predict(A(2, 2), 'A bubble sort that stops as soon as a pass makes no swaps is run on an array of n elements that is already in ascending order. Predict how many passes it makes, and how many comparisons.', 'One pass, as the first pass finds nothing to swap.', 'n − 1 comparisons.'),
  predict(A(2, 2), 'Binary search looks for 25 in {3, 8, 12, 19, 25, 31, 40}, with mid = (low + high) / 2. Predict the elements it compares 25 with, in order.', '19 first, at index 3; 25 is larger, so the search moves to indexes 4 to 6.', 'Then 31, at index 5, and then 25, at index 4, where it is found: three comparisons.'),
  predict(A(2, 3), 'After int[][] m = new int[3][]; m[0] = new int[2]; a program prints m[1].length. Predict what happens, and why.', 'm[1] has not been given a row, so it is null.', 'Reading its length throws a NullPointerException.'),

  odd(A(2, 1), ['bubble sort', 'selection sort', 'insertion sort', 'binary search'], 'binary search', 'It finds an element; the other three put an array in order.'),
  odd(A(2, 1), ['a[0]', 'a[4]', 'a[5]', 'a[2]'], 'a[5]', 'For int[] a = new int[5], the indexes run from 0 to 4, so a[5] is out of range; the others are valid.'),
  odd(A(2, 2), ['new int[3]', 'new double[3]', 'new boolean[3]', 'new long[3]'], 'new boolean[3]', 'Its elements start as false; the others start as zero.'),

  long(A(5, 2), 'An array A[1..10][1..15] holds elements of 2 bytes each, from base address 2000.\n(a) Find the address of A[5][8] if it is stored row by row. [2]\n(b) Find the address of A[5][8] if it is stored column by column. [2]\n(c) How many bytes does the whole array take? [1]', '(a) Row-major: 2000 + 2[(5 − 1) × 15 + (8 − 1)] = 2000 + 2 × 67.', '(a) = 2134.', '(b) Column-major: 2000 + 2[(8 − 1) × 10 + (5 − 1)] = 2000 + 2 × 74.', '(b) = 2148.', '(c) 10 × 15 × 2 = 300 bytes.'),
  long(A(5, 2), 'An array holds {29, 10, 14, 37, 13}.\n(a) Show the array after each pass of selection sort in ascending order. [3]\n(b) At most how many swaps does selection sort make on n elements? [1]\n(c) How many comparisons does it make on n elements? [1]', '(a) Pass 1: {10, 29, 14, 37, 13}.', '(a) Pass 2: {10, 13, 14, 37, 29}; pass 3 leaves it unchanged, as 14 is already in place.', '(a) Pass 4: {10, 13, 14, 29, 37}.', '(b) n − 1 swaps, one a pass at most.', '(c) n(n − 1)/2 comparisons, which is 10 for five elements.'),
  long(A(5, 3), 'The equations 2x + y = 5 and x − y = 1 are to be solved by a program using Cramer’s rule.\n(a) Store their coefficients in a 2 × 2 array a and their constants in an array b. [1]\n(b) Write Java statements to find the determinant d, and then x and y. [2]\n(c) What values does the program find? [1]\n(d) When can’t the program find a single answer? [1]', '(a) double[][] a = {{2, 1}, {1, -1}}; double[] b = {5, 1};', '(b) double d = a[0][0] * a[1][1] - a[0][1] * a[1][0];', '(b) double x = (b[0] * a[1][1] - a[0][1] * b[1]) / d; double y = (a[0][0] * b[1] - b[0] * a[1][0]) / d;', '(c) d = −3, so x = −6/−3 = 2 and y = −3/−3 = 1.', '(d) When d = 0: then the equations have no solution, or infinitely many.'),

  tell(A(2, 1), 'Distinguish between row-major and column-major storage of a two-dimensional array.', 'Row-major stores the whole of row 0, then row 1, and so on.', 'Column-major stores the whole of column 0, then column 1, and so on.'),
  tell(A(2, 1), 'Distinguish between a one-dimensional and a two-dimensional array, with a declaration of each.', 'A one-dimensional array needs one index, as in int[] a = new int[5]; a[2].', 'A two-dimensional array needs a row and a column index, as in int[][] m = new int[3][4]; m[1][2].'),
  tell(A(2, 2), 'Distinguish between length for an array and length() for a String.', 'For an array, length is a field, written with no brackets: a.length.', 'For a String, length() is a method, written with brackets: s.length().'),

  match(A(4, 2), [['Linear search', 'n comparisons at most'], ['Binary search', 'about log₂ n comparisons at most'], ['Bubble sort', 'n(n − 1)/2 comparisons at most'], ['Finding the largest element', 'exactly n − 1 comparisons']]),
  match(A(4, 1), [['int[] a = new int[4];', 'four ints, each 0'], ['String[] s = new String[2];', 'two references, each null'], ["char[] c = {'x', 'y'};", 'two chars, x and y'], ['int[][] m = new int[2][3];', 'six ints, in two rows of three']]),
  match(A(4, 1), [['m.length', '2'], ['m[0].length', '3'], ['m[1][0]', '4'], ['m[1][2]', '6']]),

  reason(A(2, 1), 'Why do array indexes in Java start at 0?', 'The index is how many elements lie before the one wanted.', 'So the address is base + index × size, and the first element is at the base itself.'),
  reason(A(2, 2), 'Why does insertion sort run quickly on an array that is almost sorted?', 'Each new element is compared with those before it only until its place is found.', 'In an almost sorted array that place is close, so there are few comparisons and shifts.'),
  reason(A(2, 1), 'Why is a matrix better stored in a two-dimensional array than in separate variables?', 'Every element can be reached by its row and column index.', 'So nested loops can process all of them, whatever the size of the matrix.'),

  short(A(2, 2), 'An array X[10..40] holds elements of 2 bytes each, from base address 3000. Find the address of X[25], and how many elements X has.', 'Address = 3000 + 2 × (25 − 10) = 3030.', 'It has 40 − 10 + 1 = 31 elements.'),
  short(A(2, 1), 'Write a statement that creates a 3 × 4 array of doubles called d, and one that sets its last element to 1.5.', 'double[][] d = new double[3][4];', 'd[2][3] = 1.5;'),

  ar(A(1, 2), 'Insertion sort is efficient on an array that is nearly in order.', 'Each element has to move only a short distance to reach its place.', 1, 'So it needs few comparisons and shifts.'),
  ar(A(1, 3), 'int[][] a = new int[3][]; creates three rows of length zero.', 'In Java, the rows of a two-dimensional array can have different lengths.', 4, 'The statement makes three rows that are null, not empty; each row must be created before it is used.'),
  ar(A(1, 3), 'In a 4 × 5 array of 4-byte ints stored row by row from base 100, with indexes from 0, a[2][3] is at address 152.', 'In row-major order the elements of each column are stored together.', 3, '100 + 4 × (2 × 5 + 3) = 152, but row-major order stores each row together.'),
];

export default questions;
