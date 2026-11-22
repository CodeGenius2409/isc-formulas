// Written by hand: Python lists, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// Every Python answer here is run in the Python tracer by tests/unit/python-bank.test.ts.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar, program } = kit('computerscience', 'XII');
const L = at(7, 'b');

const questions: BankDef[] = [
  predict(L(2, 2), 'Predict what a holds after a = [1, 2, 3], then b = a, then b.append(4).', 'a is [1, 2, 3, 4].', 'b = a doesn’t copy the list; both names refer to the same list, so appending through b changes a too.'),
  predict(L(2, 1), 'Predict the value of [1, 2] * 2 + [3].', 'Repetition first: [1, 2] * 2 is [1, 2, 1, 2].', 'Then concatenation: [1, 2, 1, 2, 3].'),
  predict(L(2, 2), 'Predict what is printed by l = [5, 2, 8], then x = l.sort(), then print(x, l).', 'None [2, 5, 8].', 'sort() sorts the list in place and returns None, so x is None while l is sorted.'),

  odd(L(2, 1), ['append()', 'insert()', 'remove()', 'count()'], 'count()', 'It leaves the list unchanged; the others change it.'),
  odd(L(2, 1), ['[1, 2, 3]', '[]', '[[1, 2], [3]]', '(1, 2, 3)'], '(1, 2, 3)', 'It is a tuple; the others are lists.'),
  odd(L(2, 2), ['sort()', 'sorted()', 'reverse()', 'pop()'], 'sorted()', 'It is a built-in function that returns a new list; the others are list methods that change the list itself.'),

  long(L(5, 2), 'Start with l = [10, 20, 30, 40, 50]. Give the result of each, in order, each part carrying on from the last.\n(a) l[1:4] [1]\n(b) l[::-2] [1]\n(c) l after l.insert(2, 25) [1]\n(d) what l.pop() returns, and l after it [1]\n(e) l.index(30) [1]', '(a) [20, 30, 40].', '(b) [50, 30, 10].', '(c) [10, 20, 25, 30, 40, 50].', '(d) It returns 50, leaving [10, 20, 25, 30, 40].', '(e) 3.'),
  long(L(5, 2), 'Given the nested list m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]:\n(a) What is m[1][2]? [1]\n(b) What is m[2]? [1]\n(c) Write a loop that prints the sum of each row, and give the output. [1]\n(d) Write one statement that makes the list of the diagonal items m[0][0], m[1][1] and m[2][2], and give it. [1]\n(e) What are len(m) and len(m[0])? [1]', '(a) 6.', '(b) [7, 8, 9].', '(c) for row in m: print(sum(row)) prints 6, 15 and 24, one on each line.', '(d) d = [m[i][i] for i in range(3)] gives [1, 5, 9].', '(e) 3 and 3: three rows, each of three items.'),

  tell(L(2, 1), 'Distinguish between the remove() and pop() list methods.', 'remove(x) deletes the first item equal to x, and returns nothing.', 'pop(i) deletes the item at position i, the last one if no position is given, and returns it.'),
  tell(L(2, 1), 'Distinguish between l.sort() and sorted(l).', 'l.sort() sorts the list l itself, in place, and returns None.', 'sorted(l) leaves l unchanged and returns a new, sorted list.'),
  tell(L(2, 2), 'Distinguish between b = a and b = a[:] when a is a list.', 'b = a makes b another name for the same list, so a change through either is seen in both.', 'b = a[:] makes b a new list with a copy of the items, so changing b leaves a as it was.'),

  match(L(4, 1), [['[1, 2] + [3]', '[1, 2, 3]'], ['[0] * 3', '[0, 0, 0]'], ['3 in [1, 2, 3]', 'True'], ['[1, 2, 3, 4][1:3]', '[2, 3]']]),
  match(L(4, 1), [['append(x)', 'adds x at the end'], ['insert(i, x)', 'puts x at position i'], ['remove(x)', 'deletes the first x'], ['pop()', 'removes and returns the last item']]),
  match(L(4, 1), [['len([4, 7, 1])', '3'], ['max([4, 7, 1])', '7'], ['sum([4, 7, 1])', '12'], ['[4, 7, 1].index(1)', '2']]),

  reason(L(2, 1), 'Give a reason: lists are called mutable.', 'Their items can be changed, added or removed after the list is made.', 'For example, l[0] = 5 or l.append(6) changes the same list object, without making a new one.'),
  reason(L(2, 2), 'Give a reason: after b = a, where a is a list, a change to b also changes a.', 'b = a doesn’t copy the list; b and a refer to the same list object.', 'To get a separate list, a copy is made, with a.copy() or a[:].'),
  reason(L(2, 2), 'Give a reason: l.remove(10) raises an error when 10 isn’t in l, but 10 in l doesn’t.', 'remove() must find the item to delete, and raises a ValueError if it can’t.', 'in only tests membership, and simply gives False.'),

  short(L(2, 1), 'Write the output of print([2 * x for x in range(4)]).', 'range(4) gives 0, 1, 2 and 3, and each is doubled.', '[0, 2, 4, 6]'),
  short(L(2, 1), 'Write statements that add 7 at the end of a list l, and then reverse l in place.', 'l.append(7)', 'l.reverse()'),
  short(L(2, 1), 'Write the output of l = [3, 1, 2], then l.sort(reverse=True), then print(l).', 'sort() with reverse=True sorts the list in place, largest first.', '[3, 2, 1]'),

  ar(L(1, 2), 'l.sort() returns None.', 'sort() changes the list in place, rather than making a new one.', 1, 'As no new list is made, there is nothing to return.'),
  ar(L(1, 1), '[1, 2, 3] == [3, 2, 1] is True.', 'Lists are ordered collections.', 4, 'Because order matters, the two lists aren’t equal, and the comparison is False.'),
  ar(L(1, 1), 'A list can hold items of different types.', 'Lists are mutable.', 2, 'Both are true, but mixing types is allowed because a list holds references to any objects, not because it can be changed.'),

  program(L(5, 1), 'Write a Python program that reads n whole numbers into a list, makes a new list without repeats, keeping the first of each, and prints it with the number of even numbers in it.', [['Reads n and then the n numbers into a list with append().', 1], ['A loop adds each number to the new list only if it is not in it already.', 2], ['Prints the new list.', 1], ['Counts and prints the even numbers in it.', 1]], '```\nnums = []\nn = int(input("How many numbers? "))\nfor i in range(n):\n    nums.append(int(input()))\nunique = []\nfor x in nums:\n    if x not in unique:\n        unique.append(x)\nprint(unique)\nevens = 0\nfor x in unique:\n    if x % 2 == 0:\n        evens += 1\nprint("Even numbers:", evens)\n```', 1),
];

export default questions;
