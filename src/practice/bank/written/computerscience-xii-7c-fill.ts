// Written by hand: Python tuples, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// Every Python answer here is run in the Python tracer by tests/unit/python-bank.test.ts.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar, program } = kit('computerscience', 'XII');
const T = at(7, 'c');

const questions: BankDef[] = [
  predict(T(2, 1), 'Predict what type(t) gives after t = (5), and after t = (5,).', 'After t = (5), it is int: the brackets only group the number.', 'After t = (5,), it is tuple: the comma makes it a one-item tuple.'),
  predict(T(2, 1), 'Predict the value of (1, 2) + (3,) * 2.', 'Repetition first: (3,) * 2 is (3, 3).', 'Then concatenation: (1, 2, 3, 3).'),
  predict(T(2, 1), 'Predict a and b after a, b = 3, 7 and then a, b = b, a.', 'a is 7 and b is 3.', 'The right side is packed into the tuple (7, 3) first, and then unpacked into a and b, so the values are swapped.'),

  odd(T(2, 1), ['count()', 'index()', 'len()', 'append()'], 'append()', 'Tuples have no append(), as they can’t be changed; the others work with tuples.'),
  odd(T(2, 1), ['(1, 2)', '(1,)', '()', '(1)'], '(1)', 'It is just the int 1 in brackets; the others are tuples.'),
  odd(T(2, 1), ['concatenation', 'repetition', 'slicing', 'item assignment'], 'item assignment', 'It isn’t allowed on a tuple, which is immutable; the others are tuple operations, each giving a new tuple.'),

  long(T(5, 1), 'Given t = (4, 8, 15, 16, 23, 42), find each.\n(a) t[2:5] [1]\n(b) t[-1] [1]\n(c) len(t) and sum(t) [1]\n(d) 16 in t [1]\n(e) t.index(23) [1]', '(a) (15, 16, 23).', '(b) 42.', '(c) 6 and 108.', '(d) True.', '(e) 4.'),
  long(T(5, 2), 'Given student = ("Asha", (85, 92, 78)):\n(a) What is student[1][2]? [1]\n(b) After name, marks = student, what are name and marks? [1]\n(c) Find the mean of marks, as Python would print it. [1]\n(d) What is max(marks)? [1]\n(e) Why is a tuple a sensible way to keep such a record? [1]', '(a) 78.', '(b) name is "Asha", and marks is (85, 92, 78): tuple unpacking.', '(c) sum(marks)/len(marks) = 255/3 = 85.0.', '(d) 92.', '(e) A finished record shouldn’t change, and a tuple can’t be changed by mistake.'),

  tell(T(2, 1), 'Distinguish between (5) and (5,) in Python.', '(5) is just the integer 5, as brackets alone only group an expression.', '(5,) is a tuple with one item, as the comma is what makes a tuple.'),
  tell(T(2, 1), 'Distinguish between tuple packing and tuple unpacking.', 'Packing puts several values into one tuple: t = 1, 2, 3.', 'Unpacking takes the items of a tuple into separate variables: a, b, c = t, which needs as many variables as items.'),
  tell(T(2, 1), 'Distinguish between the count() and index() methods of a tuple.', 'count(x) gives the number of times x appears in the tuple.', 'index(x) gives the position of the first x, and raises a ValueError if there is none.'),

  match(T(4, 1), [['(1, 2) + (3,)', '(1, 2, 3)'], ['("a",) * 3', '(\'a\', \'a\', \'a\')'], ['2 in (1, 2, 3)', 'True'], ['(5, 6, 7, 8)[1:3]', '(6, 7)']]),
  match(T(4, 1), [['len((3, 1, 4))', '3'], ['max((3, 1, 4))', '4'], ['min((3, 1, 4))', '1'], ['sum((3, 1, 4))', '8']]),
  match(T(4, 1), [['Tuple packing', 't = 1, 2, 3'], ['Tuple unpacking', 'a, b, c = t'], ['A one-item tuple', '(5,)'], ['A nested tuple', '((1, 2), (3, 4))']]),

  reason(T(2, 1), 'Give a reason: (5,) is a tuple, but (5) isn’t.', 'Brackets on their own only group an expression, so (5) is the int 5.', 'It is the comma that makes a tuple, so (5,) is a tuple of one item.'),
  reason(T(2, 2), 'Give a reason: t = t + (4,) works, though tuples are immutable.', 't + (4,) doesn’t change the old tuple; it makes a new one.', 'The name t is then made to refer to the new tuple.'),
  reason(T(2, 2), 'For t = (1, [2, 3]), give a reason: t[1].append(4) works, but t[1] = [9] doesn’t.', 'The tuple can’t change which objects it holds, so t[1] = [9] raises a TypeError.', 'But the list it holds is itself mutable, so it can be changed in place: t becomes (1, [2, 3, 4]).'),

  short(T(2, 1), 'Write the output of t = (10, 20, 30), then a, b, c = t, then print(b + c).', 'Unpacking gives a = 10, b = 20 and c = 30.', '50'),
  short(T(2, 1), 'Write statements that turn the list l = [1, 2, 3] into a tuple t, and t back into a list.', 't = tuple(l)', 'l2 = list(t)'),
  short(T(2, 1), 'For t = (1, 2, 3, 2), what do t.count(2) and t.index(2) give?', 't.count(2) is 2.', 't.index(2) is 1, the position of the first 2.'),

  ar(T(1, 2), 'a, b = b, a swaps two values in Python.', 'The right side is packed into a tuple before it is unpacked into the names on the left.', 1, 'Both old values are saved in the tuple first, so neither is lost.'),
  ar(T(1, 1), 'A tuple can’t hold another tuple.', 'A tuple can hold items of any type.', 4, 'Tuples can be nested, as in ((1, 2), (3, 4)).'),
  ar(T(1, 2), 'A tuple uses less memory than a list of the same items.', 'Tuples are written with round brackets.', 2, 'Both are true, but a tuple is smaller because it is fixed in size and needs no spare room to grow; the brackets have nothing to do with it.'),

  program(T(5, 1), 'Write a Python program that takes the tuple nums = (12, 7, 30, 5, 18, 21), builds a tuple of its even numbers, and prints that tuple and its sum.', [['A loop goes through nums.', 1], ['Tests each for evenness with %.', 1], ['Builds the new tuple by concatenation, with (x,).', 2], ['Prints the tuple and its sum: (12, 30, 18) and 60.', 1]], '```\nnums = (12, 7, 30, 5, 18, 21)\nevens = ()\nfor x in nums:\n    if x % 2 == 0:\n        evens = evens + (x,)\nprint(evens)\nprint("Sum of evens:", sum(evens))\n```', 1),
  program(T(5, 2), 'Write a Python function stats(t) that takes a tuple of numbers and returns a tuple of its smallest value, largest value and mean. Call it on (4, 9, 2, 7, 3), unpack the result into three variables, and print them.', [['def with one parameter.', 1], ['Returns min, max and mean together, packed as a tuple.', 2], ['The result is unpacked into three variables.', 1], ['They are printed: 2, 9 and 5.0.', 1]], '```\ndef stats(t):\n    return min(t), max(t), sum(t) / len(t)\n\nlow, high, mean = stats((4, 9, 2, 7, 3))\nprint("Smallest:", low)\nprint("Largest:", high)\nprint("Mean:", mean)\n```', 1),
];

export default questions;
