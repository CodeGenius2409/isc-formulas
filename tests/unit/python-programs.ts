// Programs run through both the Python tracer and a real Python by python-real.test.ts. There are no
// expected outputs here on purpose: real Python is the answer key. A program meant to fail names the
// exception it should end with.

export interface PyProgram {
  name: string;
  code: string;
  input?: string;
  /** The exception the program should end with, when it is meant to fail. */
  error?: string;
}

const lines = (...parts: string[]) => parts.join('\n');

export const PY_PROGRAMS: PyProgram[] = [
  // Variables, types and operators
  { name: 'arithmetic', code: lines('print(7 / 2, 7 // 2, 7 % 2, 2 ** 10)', 'print(-7 // 2, -7 % 2, 7 // -2, 7 % -2)', 'print(2 + 3 * 4 ** 2, (2 + 3) * 4, 10 - 4 - 3, 2 ** 3 ** 2)', 'print(7.5 // 2, 7.5 % 2, abs(-4), divmod(17, 5), pow(3, 4))') },
  { name: 'floats as Python prints them', code: lines('print(0.1 + 0.2, 1 / 3, 2 / 3, 10 / 4)', 'print(1e16, 1e-5, 123456789.123, 2.0 * 3, 1e300 * 1e10)', 'print(round(2.5), round(3.5), round(2.675, 2), round(7.456, 1), round(1234, -2))', 'print(int(3.99), int(-3.99), float(7), float("2.50"), int("42"), int("-8"))') },
  { name: 'big integers', code: lines('print(2 ** 100)', 'print(10 ** 20 + 1, 99999999999 * 99999999999)', 'n = 1', 'for i in range(1, 21):', '    n *= i', 'print(n)') },
  { name: 'types', code: lines('print(type(5), type(5.0), type("5"), type(True), type(None))', 'print(type([1]), type((1,)), type({1: 2}), type({1}), type(range(3)))', 'print(isinstance(3, int), 3 == 3.0, True + True, bool(0), bool(""), bool([0]))') },
  { name: 'comparisons and logic', code: lines('a, b = 5, 9', 'print(a < b, a == b, a != b, 1 < a < 10, a < b > 20)', 'print(a > 3 and b > 10, a > 3 or b > 10, not a > 3)', 'print(0 or "x", 4 and 0, None or [], "a" < "b", "Z" < "a", "apple" < "apricot")') },
  { name: 'augmented assignment', code: lines('x = 10', 'x += 5', 'x -= 3', 'x *= 2', 'x //= 5', 'x **= 3', 'x %= 7', 'print(x)', 's = "ab"', 's += "cd"', 's *= 2', 'print(s)') },
  { name: 'chained and multiple assignment', code: lines('a = b = c = 0', 'b = 5', 'print(a, b, c)', 'x, y, z = 1, 2, 3', 'x, y = y + z, x', 'print(x, y, z)') },

  // Input and print
  { name: 'input and int()', code: lines('n = int(input())', 'm = int(input("Second: "))', 'print("Sum:", n + m)', 'print(n * m)'), input: '12\n30' },
  { name: 'input as text', code: lines('name = input("Name? ")', 'age = input("Age? ")', 'print("Hello,", name + "!", "Next year you will be", int(age) + 1)'), input: 'Ravi\n16\n' },
  { name: 'input split into numbers', code: lines('nums = input("Numbers: ").split()', 'total = 0', 'for n in nums:', '    total += float(n)', 'print(total, len(nums))'), input: '3 4.5 10' },
  { name: 'print sep and end', code: lines('print(1, 2, 3)', 'print(1, 2, 3, sep="")', 'print("a", "b", sep=", ", end=".\\n")', 'print("no newline", end="")', 'print(" then this")', 'print()', 'print("x", end="")', 'print(sep="-")') },
  { name: 'formatting', code: lines('x = 22 / 7', 'print(f"{x:.3f} {x:8.2f}| {42:5d}| {42:<5}| {"ab":>4}| {7:03d}")', 'print("{} and {}".format("tea", "toast"), "{1}{0}".format("a", "b"), "%d items at %.2f" % (3, 4.5))', 'print(f"{1000000:,}", f"{0.25:%}", str(3.0), repr("q"))') },

  // Decisions and loops
  { name: 'if elif else', code: lines('for marks in [95, 82, 67, 40, 12]:', '    if marks >= 90:', '        grade = "A"', '    elif marks >= 75:', '        grade = "B"', '    elif marks >= 50:', '        grade = "C"', '    else:', '        grade = "F"', '    print(marks, grade)') },
  { name: 'nested if', code: lines('a, b, c = 14, 27, 9', 'if a > b:', '    if a > c:', '        print("a is largest")', '    else:', '        print("c is largest")', 'elif b > c:', '    print("b is largest")', 'else:', '    print("c is largest")') },
  { name: 'range forms', code: lines('print(list(range(5)), list(range(2, 8)), list(range(10, 0, -3)), list(range(5, 1)))', 'for i in range(1, 11, 4):', '    print(i, end=" ")', 'print()', 'print(len(range(0, 100, 7)), range(3), sum(range(101)))') },
  { name: 'while with a counter', code: lines('n = 12345', 'rev = 0', 'count = 0', 'while n > 0:', '    rev = rev * 10 + n % 10', '    n //= 10', '    count += 1', 'print(rev, count)') },
  { name: 'break, continue and else on loops', code: lines('for i in range(10):', '    if i % 3 == 0:', '        continue', '    if i > 7:', '        break', '    print(i, end=" ")', 'print()', 'for n in [4, 6, 8]:', '    if n % 2:', '        break', 'else:', '    print("all even")', 'k = 0', 'while k < 3:', '    k += 1', 'else:', '    print("loop ended", k)') },
  { name: 'nested loops: a times table', code: lines('for i in range(1, 4):', '    for j in range(1, 6):', '        print(i * j, end="\\t")', '    print()') },
  { name: 'pattern of stars', code: lines('n = 4', 'for i in range(n):', '    print(" " * (n - i - 1) + "*" * (2 * i + 1))', 'for i in range(n, 0, -1):', '    print("#" * i)') },
  { name: 'number programs', code: lines('def is_perfect(n):', '    return sum(d for d in range(1, n) if n % d == 0) == n', 'print([n for n in range(1, 500) if is_perfect(n)])', 'a, b = 48, 18', 'while b:', '    a, b = b, a % b', 'print("GCD", a)', 'print(int("1011", 2), bin(11), oct(8), hex(255))') },

  // Strings
  { name: 'string methods', code: lines('s = "  Hello, World  "', 'print(s.strip(), s.lstrip(), s.rstrip() + "|")', 't = s.strip()', 'print(t.upper(), t.lower(), t.swapcase(), t.title(), "python is fun".capitalize())', 'print(t.find("o"), t.rfind("o"), t.find("z"), t.index("W"), t.count("l"))', 'print(t.replace("l", "L"), t.replace("l", "L", 1), t.split(", "), "a-b-c".split("-"))') },
  { name: 'string tests', code: lines('for s in ["abc", "ABC", "123", "a1", " ", "Abc Def", ""]:', '    print(repr(s), s.isalpha(), s.isdigit(), s.isalnum(), s.isupper(), s.islower(), s.isspace(), s.istitle())') },
  { name: 'string padding and joining', code: lines('print("7".zfill(3), "ab".center(6, "*"), "ab".ljust(5, ".") + "|", "ab".rjust(5) + "|")', 'print("-".join(["2028", "03", "14"]), "".join(reversed("stressed")), ", ".join("abc"))', 'print("Na" * 4 + " Batman", len("multiple words here"), "word" in "a word here")') },
  { name: 'ord and chr: a Caesar cipher', code: lines('msg = "Attack at Dawn"', 'out = ""', 'for ch in msg:', '    if ch.isupper():', '        out += chr((ord(ch) - 65 + 3) % 26 + 65)', '    elif ch.islower():', '        out += chr((ord(ch) - 97 + 3) % 26 + 97)', '    else:', '        out += ch', 'print(out, ord("A"), chr(97))') },
  { name: 'string slicing edge cases', code: lines('s = "COMPUTER"', 'print(s[2:5], s[-3:], s[:-3], s[::2], s[1::3], s[::-2])', 'print(s[5:2], s[100:], s[-100:2], s[3:3] == "", s[-1:-4:-1])', 'print(s.startswith("COM"), s.endswith("TER"), s.startswith("PUT", 3))') },
  { name: 'traversing a string', code: lines('s = "programming"', 'freq = {}', 'for ch in s:', '    freq[ch] = freq.get(ch, 0) + 1', 'print(freq)', 'for i, ch in enumerate(s[:4]):', '    print(i, ch, sep=":", end=" ")', 'print()', 'print(max(freq, key=freq.get), sorted(set(s)))') },

  // Lists
  { name: 'list methods', code: lines('a = [5, 3, 8]', 'a.append(1)', 'a.insert(1, 9)', 'a.extend([7, 3])', 'print(a)', 'print(a.pop(), a.pop(0), a)', 'a.remove(3)', 'print(a, a.index(8), a.count(3))', 'a.sort()', 'print(a)', 'a.sort(reverse=True)', 'print(a)', 'a.reverse()', 'print(a, len(a))', 'a.clear()', 'print(a)') },
  { name: 'sorted, key and reverse', code: lines('words = ["pear", "Fig", "banana", "kiwi", "apple"]', 'print(sorted(words))', 'print(sorted(words, key=len))', 'print(sorted(words, key=str.lower, reverse=True))', 'print(sorted([3, 1, 2], reverse=True), words)', 'x = words.sort()', 'print(x, words)') },
  { name: 'list operations', code: lines('a = [1, 2] + [3]', 'b = [0] * 4', 'print(a, b, 2 in a, 5 not in a)', 'print(max(a), min(a), sum(a), len(b))', 'c = a * 2', 'c[1] = 99', 'print(a, c)', 'del c[0]', 'del c[1:3]', 'print(c)', 'c[1:2] = [7, 8, 9]', 'print(c)') },
  { name: 'aliasing and copies', code: lines('a = [1, 2, 3]', 'b = a', 'c = a.copy()', 'd = list(a)', 'b[0] = 100', 'a += [4]', 'print(a, b, c, d)', 'print(a is b, a == c, a is c)', 'e = a', 'e = e + [5]', 'print(a, e)') },
  { name: 'a list changed inside a function', code: lines('def add_bonus(scores, bonus):', '    for i in range(len(scores)):', '        scores[i] += bonus', '    bonus = 0', '', 'marks = [40, 55, 70]', 'extra = 5', 'add_bonus(marks, extra)', 'print(marks, extra)') },
  { name: 'nested lists', code: lines('m = [[1, 2, 3], [4, 5, 6]]', 't = [[m[r][c] for r in range(2)] for c in range(3)]', 'print(t)', 'print(m[1][2], len(m), len(m[0]), m[-1][-1])', 'for row in m:', '    for v in row:', '        print(v, end=" ")', '    print()', 'rows = [[0] * 2] * 2', 'rows[0][0] = 1', 'print(rows)') },
  { name: 'list comprehensions', code: lines('print([x * x for x in range(6)])', 'print([x for x in range(20) if x % 3 == 0])', 'print([(x, y) for x in range(3) for y in range(x)])', 'print([c.upper() for c in "abc"], [len(w) for w in "to be or not".split()])', 'print(["even" if n % 2 == 0 else "odd" for n in range(4)])') },
  { name: 'enumerate and zip', code: lines('names = ["Asha", "Ben", "Chen"]', 'marks = [88, 72, 95]', 'for i, n in enumerate(names, start=1):', '    print(i, n)', 'for n, m in zip(names, marks):', '    print(n, m)', 'print(list(zip(names, marks)), list(enumerate("ab")))') },

  // Tuples and dictionaries
  { name: 'tuples', code: lines('t = (4, 7, 1, 7)', 'single = (5,)', 'not_tuple = (5)', 'print(t, single, not_tuple, type(single), type(not_tuple))', 'print(t[1:], t[::-1], t.count(7), t.index(7), len(t))', 'print(t + single, single * 3, 7 in t, tuple("abc"), tuple([1, 2]))', 'nested = ((1, 2), (3, (4, 5)))', 'print(nested[1][1][0], len(nested))') },
  { name: 'tuple packing and unpacking', code: lines('point = 3, 4', 'x, y = point', 'print(point, x, y)', 'def min_max(values):', '    return min(values), max(values)', 'lo, hi = min_max([6, 2, 9, 4])', 'print(lo, hi, min_max((5,)))', 'first, *rest = (1, 2, 3, 4)', 'print(first, rest)') },
  { name: 'a list inside a tuple can change', code: lines('t = (1, [2, 3])', 't[1].append(4)', 'print(t)') },
  { name: 'dictionaries', code: lines('d = {"apple": 3, "pear": 5}', 'd["fig"] = 2', 'd["apple"] += 1', 'print(d, len(d), "pear" in d, 5 in d)', 'print(list(d.keys()), list(d.values()), list(d.items()))', 'print(d.get("kiwi"), d.get("kiwi", 0), d.pop("pear"), d)', 'for k, v in sorted(d.items()):', '    print(k, v)', 'd.update({"lime": 1})', 'print(d)') },

  // Functions and recursion
  { name: 'default and keyword arguments', code: lines('def greet(name, greeting="Hello", mark="!"):', '    return greeting + ", " + name + mark', 'print(greet("Asha"))', 'print(greet("Ben", "Hi"))', 'print(greet("Chen", mark="?"))', 'print(greet(greeting="Hey", name="Dev"))') },
  { name: 'a mutable default argument keeps its value', code: lines('def add(item, bag=[]):', '    bag.append(item)', '    return bag', 'print(add(1))', 'print(add(2))', 'print(add(3, []))') },
  { name: 'local and global names', code: lines('count = 0', 'def bump():', '    global count', '    count += 1', 'def shadow():', '    count = 100', '    return count', 'bump()', 'bump()', 'print(count, shadow(), count)') },
  { name: 'recursion: power, reverse and binary', code: lines('def power(b, e):', '    return 1 if e == 0 else b * power(b, e - 1)', 'def rev(s):', '    return s if len(s) <= 1 else rev(s[1:]) + s[0]', 'def binary(n):', '    return str(n) if n < 2 else binary(n // 2) + str(n % 2)', 'print(power(3, 4), rev("recursion"), binary(37))') },
  { name: 'recursion: binary search', code: lines('def search(a, key, low, high):', '    if low > high:', '        return -1', '    mid = (low + high) // 2', '    if a[mid] == key:', '        return mid', '    if a[mid] < key:', '        return search(a, key, mid + 1, high)', '    return search(a, key, low, mid - 1)', 'a = [2, 5, 8, 12, 16, 23, 38, 56]', 'print(search(a, 23, 0, len(a) - 1), search(a, 7, 0, len(a) - 1))') },
  { name: 'recursion: Tower of Hanoi', code: lines('def hanoi(n, src, via, dst):', '    if n == 0:', '        return 0', '    moves = hanoi(n - 1, src, dst, via)', '    print("Move disc", n, "from", src, "to", dst)', '    return moves + 1 + hanoi(n - 1, via, src, dst)', 'print(hanoi(3, "A", "B", "C"), "moves")') },
  { name: 'return without a value', code: lines('def shout(s):', '    print(s.upper())', 'r = shout("hi")', 'print(r)', 'def early(n):', '    if n < 0:', '        return', '    return n * 2', 'print(early(-1), early(4))') },

  // Library modules the syllabus uses
  { name: 'math', code: lines('import math', 'print(math.sqrt(49), math.pi, math.e)', 'print(math.floor(-2.5), math.ceil(-2.5), math.fabs(-3), math.pow(2, 0.5))', 'print(math.factorial(6), math.gcd(36, 60), math.isqrt(50), round(math.sin(math.pi / 6), 10), math.log10(1000), math.log(math.e))') },
  { name: 'random with a seed', code: lines('import random', 'random.seed(2028)', 'print(random.randint(1, 100), random.randint(1, 6), random.random())', 'items = [1, 2, 3, 4, 5]', 'random.shuffle(items)', 'print(items, random.choice("ISCPY"), random.sample(range(50), 3), random.randrange(0, 10, 2))') },
  { name: 'from math import', code: lines('from math import sqrt, pi', 'r = 7', 'print(round(pi * r * r, 2), sqrt(2))') },

  // Errors, each as real Python reports it
  { name: 'IndexError', code: lines('a = [10, 20, 30]', 'i = 3', 'print(a[i])'), error: 'IndexError' },
  { name: 'IndexError on a string', code: lines('s = "abc"', 'print(s[5])'), error: 'IndexError' },
  { name: 'IndexError from pop', code: lines('a = []', 'a.pop()'), error: 'IndexError' },
  { name: 'TypeError: str + int', code: lines('age = 16', 'print("Age: " + age)'), error: 'TypeError' },
  { name: 'TypeError: int + str', code: lines('print(5 + "5")'), error: 'TypeError' },
  { name: 'TypeError: strings are immutable', code: lines('s = "cat"', 's[0] = "b"'), error: 'TypeError' },
  { name: 'TypeError: tuples are immutable', code: lines('t = (1, 2)', 't[0] = 5'), error: 'TypeError' },
  { name: 'TypeError: len of a number', code: lines('print(len(12345))'), error: 'TypeError' },
  { name: 'TypeError: wrong number of arguments', code: lines('def area(l, b):', '    return l * b', 'print(area(4))'), error: 'TypeError' },
  { name: 'TypeError: a number is not iterable', code: lines('for i in 10:', '    print(i)'), error: 'TypeError' },
  { name: 'TypeError: None from sort()', code: lines('a = [3, 1]', 'b = a.sort()', 'print(b[0])'), error: 'TypeError' },
  { name: 'ValueError from int()', code: lines('n = int(input("Number: "))'), input: 'twelve', error: 'ValueError' },
  { name: 'ValueError from remove', code: lines('a = [1, 2]', 'a.remove(5)'), error: 'ValueError' },
  { name: 'ValueError from index', code: lines('print("hello".index("z"))'), error: 'ValueError' },
  { name: 'ValueError: unpacking', code: lines('a, b = [1, 2, 3]'), error: 'ValueError' },
  { name: 'ZeroDivisionError', code: lines('total = 10', 'count = 0', 'print(total / count)'), error: 'ZeroDivisionError' },
  { name: 'ZeroDivisionError: floor division', code: lines('print(7 // 0)'), error: 'ZeroDivisionError' },
  { name: 'ZeroDivisionError: modulo', code: lines('print(7.5 % 0)'), error: 'ZeroDivisionError' },
  { name: 'NameError with a suggestion', code: lines('total = 5', 'print(totl)'), error: 'NameError' },
  { name: 'NameError: used before assignment', code: lines('print(score)', 'score = 3'), error: 'NameError' },
  { name: 'UnboundLocalError', code: lines('count = 0', 'def bump():', '    count += 1', 'bump()'), error: 'UnboundLocalError' },
  { name: 'KeyError', code: lines('d = {"a": 1}', 'print(d["b"])'), error: 'KeyError' },
  { name: 'AttributeError', code: lines('a = [1, 2]', 'a.push(3)'), error: 'AttributeError' },
  { name: 'AttributeError on a string', code: lines('s = "abc"', 's.append("d")'), error: 'AttributeError' },
  { name: 'RecursionError', code: lines('def countdown(n):', '    print(n)', '    countdown(n - 1)', 'countdown(3)'), error: 'RecursionError' },
  { name: 'recursion that just fits the limit', code: lines('import sys', 'def depth(n):', '    return n if n == 0 else 1 + depth(n - 1)', 'print(sys.getrecursionlimit(), depth(998))') },
  { name: 'recursion one call too deep', code: lines('def depth(n):', '    return n if n == 0 else 1 + depth(n - 1)', 'print(depth(999))'), error: 'RecursionError' },
  { name: 'a raised recursion limit', code: lines('import sys', 'sys.setrecursionlimit(1600)', 'def depth(n):', '    return n if n == 0 else 1 + depth(n - 1)', 'print(depth(1500), sys.getrecursionlimit())') },
  { name: 'EOFError: more input than given', code: lines('a = input()', 'b = input()', 'print(a, b)'), input: 'only one line', error: 'EOFError' },
  { name: 'OverflowError', code: lines('import math', 'print(math.exp(1000))'), error: 'OverflowError' },
  { name: 'an error inside a function, after output', code: lines('def average(values):', '    return sum(values) / len(values)', 'print(average([4, 6]))', 'print(average([]))'), error: 'ZeroDivisionError' },
  { name: 'IndentationError: expected an indented block', code: lines('for i in range(3):', 'print(i)'), error: 'IndentationError' },
  { name: 'IndentationError: unexpected indent', code: lines('x = 1', '    y = 2'), error: 'IndentationError' },
  { name: 'IndentationError: unindent does not match', code: lines('if True:', '        a = 1', '    b = 2'), error: 'IndentationError' },
  { name: 'SyntaxError: a bracket never closed', code: lines('print("total", (3 + 4)', 'x = 1'), error: 'SyntaxError' },
  { name: 'SyntaxError: = for ==', code: lines('x = 5', 'if x = 5:', '    print(x)'), error: 'SyntaxError' },
  { name: 'SyntaxError: a missing colon', code: lines('for i in range(3)', '    print(i)'), error: 'SyntaxError' },
  { name: 'SyntaxError: an unterminated string', code: lines('print("hello)'), error: 'SyntaxError' },
  { name: 'SyntaxError: a keyword as a name', code: lines('class = 5'), error: 'SyntaxError' },
  { name: 'sys.exit stops quietly', code: lines('import sys', 'print("before")', 'sys.exit()', 'print("after")') },
];
