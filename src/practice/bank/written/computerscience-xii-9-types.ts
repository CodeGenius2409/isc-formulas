// Written by hand: complexity and Big O, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('computerscience', 'XII');
const A = at(9, 'a');

const questions: BankDef[] = [
  long(A(5, 1), 'Answer each part.\n(i) What does Big O notation describe? [1]\n(ii) Write the complexity of linear search, of binary search and of bubble sort, in the worst case. [3]\n(iii) Why are constants left out, so that 3n + 5 is O(n)? [1]', ['(i) How the running time or space grows with the size of the input, in the worst case.', '(ii) Linear search is O(n).', '(ii) Binary search is O(log n).', '(ii) Bubble sort is O(n²).', '(iii) As n grows, the term in n decides the growth, and constants only scale it.']),
  long(A(5, 2), 'Find the complexity of each, in terms of n, and say why.\n(i) A loop running i from 1 to n, with a loop inside running j from 1 to n. [2]\n(ii) A loop in which i doubles from 1 until it passes n. [2]\n(iii) Two separate loops, one after the other, each running n times. [1]', ['(i) O(n²).', '(i) The inner loop runs n times for each of n passes of the outer.', '(ii) O(log n).', '(ii) i reaches n after about log₂ n doublings.', '(iii) O(n), as n + n is 2n.']),
  long(A(5, 3), 'An O(n²) sort takes 2 seconds on 1,000 items on one computer.\n(i) About how long would it take on 4,000 items? [2]\n(ii) About how long would an O(n log₂ n) sort take on 4,000 items, if it also takes 2 seconds on 1,000? [2]\n(iii) Which would you choose for a large input, and why? [1]', ['(i) Four times the items is 16 times the work.', '(i) So about 32 seconds.', '(ii) 4,000 × 12 over 1,000 × 10 is 4.8 times the work, using log₂ 4,000 ≈ 12 and log₂ 1,000 ≈ 10.', '(ii) So about 9.6 seconds.', '(iii) The O(n log n) sort, as the gap widens as n grows.']),
];

export default questions;
