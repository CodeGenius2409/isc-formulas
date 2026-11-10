// Written by hand: arrays and strings, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar } = kit('computerscience', 'XI');
const A = at(10, 'a');

const questions: BankDef[] = [
  predict(A(2, 2), 'Predict the output, and explain it.\n```\nint[] a = {4, 7, 1};\nint[] b = a;\nb[0] = 9;\nSystem.out.println(a[0]);\n```', 'It prints 9.', 'b = a copies the reference, so a and b are the same array; changing b[0] changes a[0].'),
  predict(A(2, 1), 'Predict the output.\n```\nint[][] m = new int[3][4];\nSystem.out.println(m.length + " " + m[0].length);\n```', 'It prints 3 4.', 'm.length is the number of rows, 3, and m[0].length the number of columns in a row, 4.'),
  predict(A(2, 2), 'Predict the output, and explain it.\n```\nString s = "Computer";\nSystem.out.println(s.substring(3).toUpperCase().charAt(1));\n```', 'It prints U.', 'substring(3) is "puter", toUpperCase() makes it "PUTER", and charAt(1) is U.'),

  odd(A(2, 2), ['length, for an array', 'length(), for a String', 'charAt()', 'indexOf()'], 'length, for an array', 'It is a field, used without brackets; the others are methods.'),
  odd(A(2, 1), ['int[] a', 'String s', 'char[] c', 'double[] d'], 'String s', 'It is a String, not an array; the others declare arrays.'),
  odd(A(2, 2), ['"cat".compareTo("cat")', '"abc".indexOf(\'a\')', '"hello".length() - 5', '"dog".charAt(0)'], '"dog".charAt(0)', 'It gives the character d; the others all give the int 0.'),

  long(A(5, 2), 'An array holds {12, 5, 9, 20, 3}.\n(a) Describe how a loop finds the largest element and its index. [2]\n(b) Show the array after each of the first two passes of bubble sort into ascending order. [2]\n(c) What must be true of an array before binary search can be used on it? [1]', '(a) Start with max = a[0] and pos = 0, then go through the rest of the array.', '(a) Whenever a[i] > max, set max = a[i] and pos = i; here max is 20, at index 3.', '(b) After pass 1: {5, 9, 12, 3, 20}.', '(b) After pass 2: {5, 9, 3, 12, 20}.', '(c) It must be sorted.'),
  long(A(5, 3), 'The equations a₁x + b₁y = c₁ and a₂x + b₂y = c₂ are kept in a 2 × 3 array, one equation to a row.\n(a) Write the formulas for x and y by Cramer’s rule. [2]\n(b) Use them to solve 2x + 3y = 8 and x − y = −1. [2]\n(c) When do the equations have no single solution? [1]', '(a) With d = a₁b₂ − a₂b₁: x = (c₁b₂ − c₂b₁)/d.', '(a) y = (a₁c₂ − a₂c₁)/d.', '(b) d = 2 × (−1) − 1 × 3 = −5, and x = (8 × (−1) − (−1) × 3)/(−5) = 1.', '(b) y = (2 × (−1) − 1 × 8)/(−5) = 2.', '(c) When d = 0, as the lines are then parallel or the same.'),
  long(A(5, 2), 'Answer each part for String s = "Programming".\n(a) Give s.length(), s.charAt(3), s.indexOf("gram") and s.substring(0, 3) + "!". [3]\n(b) Describe a loop that counts the vowels in s. [2]', '(a) s.length() is 11, and s.charAt(3) is g.', '(a) s.indexOf("gram") is 3.', '(a) s.substring(0, 3) + "!" is "Pro!".', '(b) Go through i from 0 to s.length() − 1, taking c = s.charAt(i).', '(b) If "aeiouAEIOU".indexOf(c) isn’t −1, add 1 to a counter; for "Programming" the count is 3.'),

  tell(A(2, 1), 'Distinguish between a one-dimensional and a two-dimensional array.', 'A one-dimensional array is a single row of elements, reached by one index, as a[i].', 'A two-dimensional array is a table of rows and columns, reached by two indexes, as m[i][j].'),
  tell(A(2, 1), 'Distinguish between the length of an array and the length() of a String.', 'An array’s length is a field, written without brackets: a.length.', 'A String’s length is found by calling a method: s.length().'),
  tell(A(2, 2), 'Distinguish between joining strings with + and with concat().', '+ joins a String with a value of any type, which it turns into text: "x" + 5 is "x5".', 'concat() joins only another String: "x".concat("5").'),

  match(A(4, 1), [['int[] a = new int[5];', 'five ints, all 0'], ['int[][] m = new int[2][3];', '2 rows of 3 ints'], ['a[a.length - 1]', 'the last element of a'], ['m[1][2]', 'row 1, column 2 of m']]),
  match(A(4, 1), [['"Hello".length()', '5'], ['"Hello".charAt(1)', 'e'], ['"Hello".indexOf(\'l\')', '2'], ['"Hello".substring(1, 3)', '"el"']]),
  match(A(4, 1), [['Bubble sort', 'swaps neighbours that are out of order'], ['Selection sort', 'puts the smallest remaining element in place each pass'], ['Linear search', 'checks each element in turn'], ['Binary search', 'halves a sorted range at each step']]),

  reason(A(2, 1), 'Why do array indexes in Java start at 0?', 'An index gives how many places an element is from the start of the array.', 'The first element is no places from the start, so its index is 0.'),
  reason(A(2, 1), 'Why is an array better than many separate variables for the marks of 40 students?', 'One name and an index reach every mark.', 'So a single loop can read, total or sort them all.'),
  reason(A(2, 2), 'Why does a two-dimensional array suit a set of linear equations?', 'Each equation is a row of coefficients, and each unknown has a column.', 'So m[i][j] is the coefficient of the j-th unknown in the i-th equation, and loops can work through them.'),

  short(A(2, 1), 'Write a loop that adds up the elements of an int array a.', 'int sum = 0; for (int i = 0; i < a.length; i++)', 'sum += a[i];'),
  short(A(2, 2), 'Write a loop that builds the reverse of a String s.', 'String r = ""; for (int i = s.length() - 1; i >= 0; i--)', 'r = r + s.charAt(i);'),
  short(A(2, 1), 'Write statements that swap a[i] and a[j].', 'int t = a[i]; a[i] = a[j];', 'a[j] = t;'),

  ar(A(1, 2), 'After int[] b = a;, b refers to the same array as a.', 'Arrays are objects, and assigning one copies its reference.', 1, 'So a change made through b is seen through a.'),
  ar(A(1, 1), 'The elements of a new int array start as 1.', 'The elements of a new array are given default values.', 4, 'The default value for int is 0.'),
  ar(A(1, 1), '"abc" + 5 gives "abc5".', 'Strings in Java can’t be changed once made.', 2, 'Both are true, but "abc5" comes from + turning 5 into text and joining it.'),
];

export default questions;
