// A program for each hand-written Python question whose answer says what Python does, run in the Python tracer by
// python-bank.test.ts. Each names its question by the start of its wording. Without `prints`, every line the
// program prints must appear in the question's own answer, so a check can't quietly disagree with the bank.
// With `prints`, the answer says it in words, and the check holds Python to exactly that output.

export interface BankCheck {
  /** The start of the question's wording. Any further lines are pieces of the wording it must also contain. */
  ask: string;
  /** Python to run. With `model`, the question's model program is run, and this is added after it. */
  run?: string;
  /** Run the question's model answer. */
  model?: true;
  input?: string;
  /** The exception the program should end with, which the answer names unless `prints` is given. */
  error?: string;
  /** The exact output, for an answer that says what happens in words. */
  prints?: string;
  /** Values that must be in both the output and the answer, for a program whose output has more words round them. */
  shows?: string[];
}

const lines = (...parts: string[]) => parts.join('\n');

export const BANK_CHECKS: BankCheck[] = [
  // ---- Class XII, strings
  { ask: 'Given s = "computer", predict', run: lines('s = "computer"', 'print(s[-3:])', 'print(s[::2])') },
  { ask: 'Predict the value of "ab" * 3 + "c"', run: lines('print("ab" * 3)', 'print("ab" * 3 + "c")') },
  { ask: 'Predict what happens when s = "hello"', run: lines('s = "hello"', 'print("H" + s[1:])', 's[0] = "H"'), error: 'TypeError' },
  { ask: 'Which is the odd one out? Give the reason.\n"Py" in "python"', run: lines('print("Py" in "python")', 'print(all(["py" in "python", "thon" in "python", "" in "python"]))') },
  { ask: 'Which is the odd one out? Give the reason.\nsplit()', run: lines('s = "a b"', 'print(type(s.find("a")).__name__, type(s.index("a")).__name__, type(s.count("a")).__name__, type(s.split()).__name__)'), prints: 'int int int list\n' },
  { ask: 'Given s = "Programming", find each', run: lines('s = "Programming"', 'print(len(s))', 'print(s[3:7])', 'print(s.count("m"), "and", s.find("g"))', 'print(s[::-1])', 'print(s.replace("m", "M", 1))') },
  { ask: 'Study this code.\n```\ns = "Hello World"', run: lines('s = "Hello World"', 'count = 0', 'for ch in s:', '    if ch in "aeiouAEIOU":', '        count += 1', 'print(count)', 'i = 0', 'again = 0', 'while i < len(s):', '    if s[i] in "aeiouAEIOU":', '        again += 1', '    i += 1', 'print(again)') },
  { ask: 'Given t = "  Data Science  "', run: lines('t = "  Data Science  "', 'print(t.strip())', 'print(t.split())', 'print("-".join(t.split()))', 'print(t.strip().lower().startswith("data"))', 'print(t.isalpha())') },
  { ask: 'Distinguish between the find() and index() methods of a string', run: lines('print("abc".find("z"))', '"abc".index("z")'), error: 'ValueError' },
  { ask: 'Distinguish between the split() and join() string methods', run: lines('print("a b".split())', 'print("-".join(["a", "b"]))') },
  { ask: 'Distinguish between s.upper() and s.isupper()', run: lines('s = "Abc"', 'print(s.upper(), s.isupper(), s.upper().isupper())'), prints: 'ABC False True\n' },
  { ask: 'For s = "hello", give a reason: s[10]', run: lines('s = "hello"', 'print(s[2:10])', 's[10]'), error: 'IndexError' },
  { ask: 'Give a reason: s.replace("a", "b") must be assigned', run: lines('s = "banana"', 's.replace("a", "b")', 'print(s)', 's = s.replace("a", "b")', 'print(s)'), prints: 'banana\nbbnbnb\n' },
  { ask: 'Give a reason: "Apple" < "apple"', run: lines('print("Apple" < "apple")', 'print(ord("A"))', 'print(ord("a"))') },
  { ask: 'Write the output of print("Python"[1:4], "Python"[-2])', run: 'print("Python"[1:4], "Python"[-2])' },
  { ask: 'Write one statement that gives the number of words', run: lines('s = "to be or not"', 'print(len(s.split()))', 'print(s[::-1])'), prints: '4\nton ro eb ot\n' },
  { ask: 'What do isdigit() and isalnum() return', run: lines('print("2025".isdigit(), "2025".isalnum())', 'print("ab12".isdigit(), "ab12".isalnum())'), prints: 'True True\nFalse True\n' },
  { ask: 'Assertion: Strings in Python are immutable.', run: lines('s = "ab"', 't = s.upper()', 'print(s, t, s is t)'), prints: 'ab AB False\n' },
  { ask: 'Assertion: "abc"[::-1] gives "cba".', run: 'print("abc"[::-1])' },
  { ask: 'Assertion: "5" + 5 gives "55".', run: lines('print("5" + str(5))', 'print("5" + 5)'), error: 'TypeError' },
  { ask: 'Write a Python program that reads a string, and prints how many upper-case', model: true, input: 'Hi there, ISC 2028!', prints: 'Enter a string: Upper: 4\nLower: 6\nDigits: 4\nOthers: 5\n' },
  { ask: 'Write a Python program that reads a sentence, and prints each word', model: true, input: 'lists and tuples', prints: 'lists 5\nand 3\ntuples 6\n' },
  { ask: 'Write a Python function is_palindrome(s)', model: true, prints: 'True\n' },

  // ---- Class XII, lists
  { ask: 'Predict what a holds after a = [1, 2, 3]', run: lines('a = [1, 2, 3]', 'b = a', 'b.append(4)', 'print(a)') },
  { ask: 'Predict the value of [1, 2] * 2 + [3]', run: lines('print([1, 2] * 2)', 'print([1, 2] * 2 + [3])') },
  { ask: 'Predict what is printed by l = [5, 2, 8]', run: lines('l = [5, 2, 8]', 'x = l.sort()', 'print(x, l)') },
  { ask: 'Which is the odd one out? Give the reason.\ninsert()', run: lines('l = [1, 2]', 'l.count(1)', 'print(l)', 'l.append(3)', 'l.insert(0, 0)', 'l.remove(2)', 'print(l)'), prints: '[1, 2]\n[0, 1, 3]\n' },
  { ask: 'Which is the odd one out? Give the reason.\n[[1, 2], [3]]', run: 'print(type([1, 2, 3]).__name__, type([]).__name__, type([[1, 2], [3]]).__name__, type((1, 2, 3)).__name__)', prints: 'list list list tuple\n' },
  { ask: 'Which is the odd one out? Give the reason.\nsorted()', run: lines('l = [3, 1]', 'print(sorted(l), l)', 'print(type(sorted).__name__, type(l.sort).__name__)'), prints: '[1, 3] [3, 1]\nbuiltin_function_or_method builtin_function_or_method\n' },
  { ask: 'Start with l = [10, 20, 30, 40, 50]', run: lines('l = [10, 20, 30, 40, 50]', 'print(l[1:4])', 'print(l[::-2])', 'l.insert(2, 25)', 'print(l)', 'print(l.pop())', 'print(l)', 'print(l.index(30))') },
  { ask: 'Given the nested list m = [[1, 2, 3]', run: lines('m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', 'print(m[1][2])', 'print(m[2])', 'for row in m:', '    print(sum(row))', 'd = [m[i][i] for i in range(3)]', 'print(d)', 'print(len(m))', 'print(len(m[0]))') },
  { ask: 'Distinguish between the remove() and pop() list methods', run: lines('l = [5, 1, 5]', 'print(l.remove(5), l)', 'print(l.pop(0), l)', 'print(l.pop(), l)'), prints: 'None [1, 5]\n1 [5]\n5 []\n' },
  { ask: 'Distinguish between l.sort() and sorted(l)', run: lines('l = [3, 1, 2]', 'print(sorted(l), l)', 'print(l.sort(), l)'), prints: '[1, 2, 3] [3, 1, 2]\nNone [1, 2, 3]\n' },
  { ask: 'Distinguish between b = a and b = a[:]', run: lines('a = [1]', 'b = a', 'c = a[:]', 'b.append(2)', 'c.append(3)', 'print(a, b, c)'), prints: '[1, 2] [1, 2] [1, 3]\n' },
  { ask: 'Give a reason: lists are called mutable', run: lines('l = [1]', 'before = id(l)', 'l[0] = 5', 'l.append(6)', 'print(l, id(l) == before)'), prints: '[5, 6] True\n' },
  { ask: 'Give a reason: after b = a, where a is a list', run: lines('a = [1]', 'b = a', 'b.append(2)', 'print(a, a is b)', 'c = a.copy()', 'd = a[:]', 'print(c is a, d is a)'), prints: '[1, 2] True\nFalse False\n' },
  { ask: 'Give a reason: l.remove(10) raises an error', run: lines('l = [1]', 'print(10 in l)', 'l.remove(10)'), error: 'ValueError' },
  { ask: 'Write the output of print([2 * x for x in range(4)])', run: 'print([2 * x for x in range(4)])' },
  { ask: 'Write statements that add 7 at the end of a list l', run: lines('l = [1, 2]', 'l.append(7)', 'l.reverse()', 'print(l)'), prints: '[7, 2, 1]\n' },
  { ask: 'Write the output of l = [3, 1, 2], then l.sort(reverse=True)', run: lines('l = [3, 1, 2]', 'l.sort(reverse=True)', 'print(l)') },
  { ask: 'Assertion: l.sort() returns None.', run: 'print([2, 1].sort())' },
  { ask: 'Assertion: [1, 2, 3] == [3, 2, 1] is True.', run: 'print([1, 2, 3] == [3, 2, 1])' },
  { ask: 'Assertion: A list can hold items of different types.', run: 'print([1, "a", 2.5, [3]])', prints: "[1, 'a', 2.5, [3]]\n" },
  { ask: 'Write a Python program that reads n whole numbers into a list', model: true, input: '6\n4\n7\n4\n2\n7\n9', prints: 'How many numbers? [4, 7, 2, 9]\nEven numbers: 2\n' },
  { ask: 'Write a Python program with a list of marks.', model: true, prints: '88 40\n[72, 65, 88]\n' },
  { ask: 'Write a Python function merge(a, b)', model: true, run: 'print(merge([1, 4, 9], [2, 3, 10]))', prints: '[1, 2, 3, 4, 9, 10]\n' },
  { ask: 'Write the output of each line, in order, and say which list method', run: lines('l = [4, 1, 3]', 'l.append(9)', 'print(l)', 'l.sort()', 'print(l)', 'print(l[-1], len(l))') },

  // ---- Class XII, tuples
  { ask: 'Predict what type(t) gives after t = (5)', run: lines('t = (5)', 'print(type(t).__name__)', 't = (5,)', 'print(type(t).__name__)') },
  { ask: 'Predict the value of (1, 2) + (3,) * 2', run: lines('print((3,) * 2)', 'print((1, 2) + (3,) * 2)') },
  { ask: 'Predict a and b after a, b = 3, 7', run: lines('a, b = 3, 7', 'a, b = b, a', 'print(a, b)'), prints: '7 3\n' },
  { ask: 'Which is the odd one out? Give the reason.\nlen()\nappend()', run: lines('t = (1, 2, 1)', 'print(t.count(1), t.index(2), len(t))', 't.append(3)'), prints: '2 1 3\n', error: 'AttributeError' },
  { ask: 'Which is the odd one out? Give the reason.\n(1,)', run: 'print(type((1, 2)).__name__, type((1,)).__name__, type(()).__name__, type((1)).__name__)', prints: 'tuple tuple tuple int\n' },
  { ask: 'Which is the odd one out? Give the reason.\nitem assignment', run: lines('t = (1, 2)', 'print(t + (3,), t * 2, t[1:])', 't[0] = 5'), prints: '(1, 2, 3) (1, 2, 1, 2) (2,)\n', error: 'TypeError' },
  { ask: 'Given t = (4, 8, 15, 16, 23, 42)', run: lines('t = (4, 8, 15, 16, 23, 42)', 'print(t[2:5])', 'print(t[-1])', 'print(len(t), "and", sum(t))', 'print(16 in t)', 'print(t.index(23))') },
  { ask: 'Given student = ("Asha", (85, 92, 78))', run: lines('student = ("Asha", (85, 92, 78))', 'print(student[1][2])', 'name, marks = student', 'print(name)', 'print(marks)', 'print(sum(marks) / len(marks))', 'print(max(marks))') },
  { ask: 'Distinguish between (5) and (5,) in Python', run: 'print((5), (5,))', prints: '5 (5,)\n' },
  { ask: 'Distinguish between tuple packing and tuple unpacking', run: lines('t = 1, 2, 3', 'a, b, c = t', 'print(t, a, b, c)', 'a, b = t'), prints: '(1, 2, 3) 1 2 3\n', error: 'ValueError' },
  { ask: 'Distinguish between the count() and index() methods of a tuple', run: lines('t = (1, 2, 1)', 'print(t.count(1), t.index(2))', 't.index(9)'), prints: '2 1\n', error: 'ValueError' },
  { ask: 'Give a reason: t = t + (4,) works', run: lines('t = (1, 2)', 'old = t', 't = t + (4,)', 'print(t, old, t is old)'), prints: '(1, 2, 4) (1, 2) False\n' },
  { ask: 'For t = (1, [2, 3]), give a reason', run: lines('t = (1, [2, 3])', 't[1].append(4)', 'print(t)', 't[1] = [9]'), error: 'TypeError' },
  { ask: 'Write the output of t = (10, 20, 30), then a, b, c = t', run: lines('t = (10, 20, 30)', 'a, b, c = t', 'print(b + c)') },
  { ask: 'Write statements that turn the list l = [1, 2, 3] into a tuple', run: lines('l = [1, 2, 3]', 't = tuple(l)', 'l2 = list(t)', 'print(t, l2)'), prints: '(1, 2, 3) [1, 2, 3]\n' },
  { ask: 'For t = (1, 2, 3, 2), what do t.count(2)', run: lines('t = (1, 2, 3, 2)', 'print(t.count(2), t.index(2))'), prints: '2 1\n' },
  { ask: 'Assertion: a, b = b, a swaps', run: lines('a, b = 1, 2', 'a, b = b, a', 'print(a, b)'), prints: '2 1\n' },
  { ask: 'Assertion: A tuple can’t hold another tuple.', run: 'print(((1, 2), (3, 4)))' },
  { ask: 'Assertion: A tuple uses less memory than a list', run: lines('import sys', 'print(sys.getsizeof((1, 2, 3)) < sys.getsizeof([1, 2, 3]))'), prints: 'True\n' },
  { ask: 'Write a Python program that takes the tuple nums = (12, 7, 30, 5, 18, 21)', model: true, shows: ['(12, 30, 18)', '60'] },
  { ask: 'Write a Python function stats(t)', model: true, shows: ['2', '9', '5.0'] },
  { ask: 'Write a Python program that takes a tuple of (name, mark) pairs', model: true, prints: "Meena\n('Asha', 'Ravi', 'Meena')\n" },
  { ask: 'Using Python: (a) State two differences between a list and a tuple.', run: lines('t = tuple(i * i for i in range(1, 6))', 'print(t)', 't[0] = 5'), error: 'TypeError' },
  { ask: 'In Python, what does `"hello"[1:3]` give?', run: 'print("hello"[1:3])' },

  // ---- Class XI, introduction to Python
  { ask: 'Predict the output of this Python code, and explain it.\n```\nfor i in range(1, 10, 3)', run: lines('for i in range(1, 10, 3):', '    print(i, end=" ")') },
  { ask: 'Predict the output of this Python code, and explain it.\n```\nx = 5', run: lines('x = 5', 'x = "five"', 'print(type(x))') },
  { ask: 'Predict the output of this Python code, and explain it.\n```\nfor i in range(3):', run: lines('for i in range(3):', '    for j in range(3):', '        if j == i:', '            break', '        print(i, j)') },
  { ask: 'Distinguish between break and continue in a Python loop', run: lines('for i in range(5):', '    if i == 2:', '        continue', '    if i == 4:', '        break', '    print(i, end=" ")', 'print("after")'), prints: '0 1 3 after\n' },
  { ask: 'Distinguish between the operators / and //', run: lines('print(9 / 2)', 'print(9 // 2)') },
  { ask: 'Why must input() usually be wrapped in int()', input: '12', run: lines('x = input()', 'print(type(x).__name__, x + "1", int(x) + 1)'), prints: 'str 121 13\n' },
  { ask: 'Why does 0.1 + 0.2 == 0.3 give False', run: lines('print(0.1 + 0.2)', 'print(0.1 + 0.2 == 0.3)') },
  { ask: 'Write a Python loop that prints the table of 7', run: lines('for i in range(1, 11):', '    print(7, "x", i, "=", 7 * i)'), prints: Array.from({ length: 10 }, (_, i) => `7 x ${i + 1} = ${7 * (i + 1)}\n`).join('') },
  { ask: 'Write Python code that prints positive, negative or zero', run: lines('for n in (5, -2, 0):', '    if n > 0:', '        print("positive")', '    elif n < 0:', '        print("negative")', '    else:', '        print("zero")'), prints: 'positive\nnegative\nzero\n' },
  { ask: 'Predict what this Python code prints, and say what it does.\n```\nn = 12345', run: lines('n = 12345', 's = 0', 'while n > 0:', '    s += n % 10', '    n //= 10', 'print(s)') },
  { ask: 'Assertion: In Python, range(5) doesn’t include 5.', run: 'print(list(range(5)), 5 in range(5))', prints: '[0, 1, 2, 3, 4] False\n' },
  { ask: 'Assertion: Python needs every variable’s type to be declared.', run: lines('x = 5', 'x = "five"', 'print(type(x).__name__)'), prints: 'str\n' },
  { ask: 'Assertion: 2 ** 3 gives 8 in Python.', run: 'print(2 ** 3)' },
  { ask: 'Write a Python program that reads a whole number n and prints the sum', model: true, input: '10', prints: '55\n' },
  { ask: 'Write a Python program that reads a word and prints how many vowels', model: true, input: 'EducAtion', prints: '5\n' },
  { ask: 'Write a Python function is_prime(n) that returns True if n is prime and False otherwise', model: true, prints: '2\n3\n5\n7\n11\n13\n17\n19\n' },
  { ask: 'Answer each part about Python.\n(i) What does indentation do', run: lines('for v in (7, 7.0, "7", True):', '    print(type(v).__name__)', 'print(17 // 5)', 'print(17 % 5)', 'print(2 ** 5)') },
  { ask: 'Answer each part about Python.\n(i) Write what each of these prints', run: lines('s = "PYTHON"', 'print(s[0])', 'print(s[-1])', 'print(s[1:4])', 'print(s[::2])', 's[0] = "J"'), error: 'TypeError' },
  { ask: 'Using Python: (a) How does a Python variable differ from a Java variable?', run: lines('for i in range(2, 11, 2):', '    print(i, end=" ")', 'print()', 'print(type(input()).__name__)', 'print(7 // 2)', 'print(7 / 2)'), input: '42', prints: '2 4 6 8 10 \nstr\n3\n3.5\n' },
];
