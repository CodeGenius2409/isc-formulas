// Written by hand: complexity and Big O notation, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { graph, plot, table } from '../figures';

const { figure, predict, odd, tell, match, reason, short, ar, derive } = kit('computerscience', 'XII');
const C = at(9, 'a');

const questions: BankDef[] = [
  figure(C(3, 1), 'Sketch, on one set of axes, how the number of steps grows with the input size n for O(1), O(log n), O(n) and O(n²), and say which grows fastest.', ['O(1) is a flat line, and O(log n) rises ever more slowly.', 'O(n) is a straight line through the origin.', 'O(n²) curves upwards and soon passes all the others, so it grows fastest.'], {
    answer: graph('input size n', 'steps', [
      { label: 'O(1)', points: plot(() => 1, 1, 10, 9) },
      { label: 'O(log n)', points: plot((n) => Math.log2(n), 1, 10, 36) },
      { label: 'O(n)', points: plot((n) => n, 1, 10, 9) },
      { label: 'O(n²)', points: plot((n) => n * n, 1, 3.2, 22) },
    ], { x: [[5, '5'], [10, '10']], y: [[5, '5'], [10, '10']] }),
  }),
  figure(C(3, 2), 'The graph shows the time an algorithm takes against its input size n. Read off the times for n = 10 and n = 20, and say what its complexity is likely to be.', ['At n = 10 it takes 2 ms, and at n = 20 it takes 8 ms.', 'Doubling n makes the time four times as long.', 'So the time grows as n², and the algorithm is O(n²).'], {
    shown: graph('input size n', 'time (ms)', [{ points: plot((n) => (2 * n * n) / 100, 0, 30, 30) }], { x: [[10, '10'], [20, '20'], [30, '30']], y: [[2, '2'], [8, '8'], [18, '18']] }),
  }),
  figure(C(3, 2), 'The table gives the most comparisons a search makes on a sorted array of n items. Say what its complexity is, and find the most comparisons for n = 1024.', ['Each time n doubles, the comparisons rise by only one.', 'So they grow as log₂ n, and the search is O(log n), as in binary search.', 'For n = 1024 = 2¹⁰, it makes at most 11 comparisons.'], {
    shown: table(['n', '8', '16', '32', '64'], [['Most comparisons', '4', '5', '6', '7']], 'Each count is log₂ n + 1.'),
  }),

  predict(C(2, 2), 'A loop body inside two nested loops, each running n times, takes 1 ms in all when n = 50. Predict the time for n = 100 and for n = 500.', 'The body runs n² times, so doubling n makes the time four times as long: 4 ms for n = 100.', 'For n = 500, n is ten times as large, so the time is 100 times as long: 100 ms.'),
  predict(C(2, 1), 'Linear search looks for a value that isn’t in an array of n items. Predict how many comparisons it makes, and which case this is.', 'It compares the value with every item before it can say the value isn’t there: n comparisons.', 'This is the worst case, O(n).'),
  predict(C(2, 2), 'Binary search on a sorted list of 1,000 items makes at most 10 comparisons. Predict the most it makes when the list grows to 2,000 items.', 'Each comparison halves the range, so doubling the list adds only one halving.', 'It makes at most 11 comparisons.'),

  odd(C(2, 1), ['linear search', 'bubble sort', 'selection sort', 'insertion sort'], 'linear search', 'Its worst case is O(n); the three sorts are O(n²).'),
  odd(C(2, 1), ['3n + 7', 'n + log n', '100n', 'n² + 1'], 'n² + 1', 'It is O(n²); the other three are O(n).'),
  odd(C(2, 2), ['reading a[5] from an array', 'swapping two variables', 'adding two ints', 'finding the largest of n numbers'], 'finding the largest of n numbers', 'It must look at all n numbers, so it is O(n); the others take a fixed number of steps, O(1).'),

  tell(C(2, 1), 'Distinguish between the best case and the worst case of an algorithm, with linear search as an example.', 'The best case is the input that needs the fewest steps: for linear search, the item is first, one comparison, O(1).', 'The worst case is the input that needs the most: the item is last or absent, n comparisons, O(n).'),
  tell(C(2, 1), 'Distinguish between time complexity and space complexity.', 'Time complexity measures how the number of steps grows with the input size.', 'Space complexity measures how the memory the algorithm needs grows with the input size.'),
  tell(C(2, 2), 'Distinguish between linear search and binary search in their complexity and in what they need.', 'Linear search is O(n) and works on any array, sorted or not.', 'Binary search is O(log n), but needs the array to be sorted first.'),

  match(C(4, 1), [['O(1)', 'the time stays the same when n doubles'], ['O(log n)', 'the time grows by about one step when n doubles'], ['O(n)', 'the time doubles when n doubles'], ['O(n²)', 'the time is four times as long when n doubles']]),
  match(C(4, 2), [['for (i = 0; i < n; i++) s++;', 'O(n)'], ['for (i = 1; i < n; i = i * 2) s++;', 'O(log n)'], ['two nested loops, each from 0 to n', 'O(n²)'], ['x = a[0] + a[1];', 'O(1)']]),
  match(C(4, 1), [['5n² + 3n + 2', 'O(n²)'], ['4n + 100', 'O(n)'], ['2 log n + 7', 'O(log n)'], ['n³ + n²', 'O(n³)']]),

  reason(C(2, 1), 'Why is the worst case usually quoted for an algorithm’s complexity?', 'It is the most steps the algorithm can take for any input of that size.', 'So it is a guarantee: the algorithm will never be slower than that.'),
  reason(C(2, 1), 'Why is binary search so much faster than linear search on a large sorted array?', 'Each comparison in binary search halves the part still to be searched.', 'So a million items need about 20 comparisons, where linear search may need a million.'),
  reason(C(2, 2), 'Why do only the dominant term and not the smaller terms matter in Big O notation? Use n² + 100n as an example.', 'For large n the dominant term is far bigger than the rest: at n = 10,000, n² = 10⁸ but 100n = 10⁶.', 'So the smaller terms hardly change the total, and n² + 100n is O(n²).'),

  short(C(2, 2), 'Count how many times count++ runs in this fragment, and give its complexity.\n```\nfor (int i = 0; i < n; i++)\n  for (int j = i; j < n; j++)\n    count++;\n```', 'The inner loop runs n, n − 1, …, 1 times, so count++ runs n(n + 1)/2 times.', 'The dominant term is n²/2, so the fragment is O(n²).'),
  short(C(2, 1), 'What is meant by the input size of a problem? Give it for searching an array, and for solving n linear equations in n unknowns.', 'The input size measures how much data the algorithm works on, which its number of steps depends on.', 'For a search it is the number of items in the array; for the equations it is n, the number of unknowns.'),

  ar(C(1, 3), 'Solving n linear equations in n unknowns by elimination is O(n³).', 'Each of the n unknowns is eliminated by changing up to n rows of up to n numbers.', 1, 'n × n × n steps gives n³ as the dominant term.'),
  ar(C(1, 2), 'An O(n) algorithm is always faster than an O(n²) one.', 'Big O notation shows how the time grows as n grows.', 4, 'For small n, the constants left out of Big O can make the O(n²) algorithm faster.'),
  ar(C(1, 1), 'The best case of binary search is O(1).', 'Binary search needs a sorted array.', 2, 'Both are true, but the best case is O(1) because the item may be the first middle element checked.'),

  derive(C(3, 2), 'Show that bubble sort makes n(n − 1)/2 comparisons on n items when every pass is made, and so is O(n²).', ['The first pass compares n − 1 adjacent pairs, the second n − 2, and so on, down to 1 in the last pass.', 1], ['The total is 1 + 2 + … + (n − 1) = n(n − 1)/2.', 1], ['This is n²/2 − n/2; keeping the dominant term and dropping the constant ½ gives O(n²).', 1]),
  derive(C(3, 2), 'Show that binary search on n sorted items makes at most about log₂ n + 1 comparisons, and so is O(log n).', ['Each comparison halves the range, so after k comparisons at most n/2ᵏ items are left.', 1], ['The search must end by the time one item is left and checked: n/2ᵏ = 1 gives k = log₂ n, and one more comparison checks it.', 1], ['So it makes at most about log₂ n + 1 comparisons; dropping the constant gives O(log n).', 1]),
  derive(C(3, 3), 'Show that a successful linear search on n items makes (n + 1)/2 comparisons on average, if each item is equally likely to be the one sought, and so is O(n).', ['Finding the item in position i takes i comparisons.', 1], ['The average is (1 + 2 + … + n)/n = [n(n + 1)/2]/n = (n + 1)/2.', 1], ['This is n/2 + 1/2, whose dominant term is n, so the average case is O(n).', 1]),
];

export default questions;
