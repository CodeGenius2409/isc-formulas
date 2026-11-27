// A small example of each standard library module a school program may use as freely as math and random.
// python-stdlib.test.ts runs each one in the tracer, and in a real Python where there is one, which is the
// answer key. None of them reads or writes a file, so real Python leaves nothing behind.
import type { PyProgram } from './python-programs';

const lines = (...parts: string[]) => parts.join('\n');

/** The modules, each with its example. */
export const STDLIB_MODULES = ['statistics', 'fractions', 'decimal', 'datetime', 'collections', 'itertools', 'string', 'time', 'copy', 'functools', 'json', 'csv'] as const;

export const STDLIB_PROGRAMS: (PyProgram & { module: (typeof STDLIB_MODULES)[number] })[] = [
  {
    module: 'statistics',
    name: 'statistics: mean, median, mode and standard deviation',
    code: lines(
      'import statistics',
      'marks = [72, 85, 91, 64, 85, 78]',
      'print(statistics.mean(marks), statistics.median(marks), statistics.mode(marks))',
      'print(round(statistics.stdev(marks), 4), round(statistics.pstdev(marks), 4))',
      'print(statistics.median([1, 3, 5, 7]), statistics.variance([2, 4, 4, 4, 5, 5, 7, 9]))',
      'print(statistics.fmean([1, 2, 3, 4]), statistics.multimode("aabbbcc"), statistics.median_low([1, 3, 5, 7]))',
    ),
  },
  {
    module: 'fractions',
    name: 'fractions: exact arithmetic',
    code: lines(
      'from fractions import Fraction',
      'a = Fraction(1, 3)',
      'b = Fraction(1, 6)',
      'print(a + b, a - b, a * b, a / b)',
      'print(Fraction("0.75"), Fraction(3, 12), Fraction(5, 1), float(Fraction(7, 8)))',
      'print(sum(Fraction(1, n) for n in range(1, 6)))',
      'print(Fraction(0.1).limit_denominator(100), repr(Fraction(2, 4)), [Fraction(1, 2)])',
    ),
  },
  {
    module: 'decimal',
    name: 'decimal: 0.1 + 0.2 exactly, and rounding half up',
    code: lines(
      'from decimal import Decimal, getcontext, ROUND_HALF_UP',
      'print(Decimal("0.1") + Decimal("0.2"), 0.1 + 0.2)',
      'print(Decimal("2.675").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP), round(2.675, 2))',
      'getcontext().prec = 10',
      'print(Decimal(1) / Decimal(7))',
      'print(repr(Decimal("1.50")), Decimal("1.50") * 2, Decimal(0.1))',
    ),
  },
  {
    module: 'datetime',
    name: 'datetime: days between two dates, and times',
    code: lines(
      'from datetime import date, datetime, timedelta',
      'exam = date(2028, 2, 14)',
      'today = date(2027, 11, 27)',
      'gap = exam - today',
      'print(gap.days, gap, exam.strftime("%d %B %Y"), exam.weekday(), exam.isoformat())',
      'start = datetime(2027, 11, 27, 9, 30)',
      'end = start + timedelta(hours=2, minutes=45)',
      'print(end, end - start, end.strftime("%H:%M"))',
      'print(datetime.strptime("14/02/2028", "%d/%m/%Y").date(), date.fromisoformat("2028-03-01") - date(2028, 2, 28))',
    ),
  },
  {
    module: 'collections',
    name: 'collections: Counter, deque, defaultdict and namedtuple',
    code: lines(
      'from collections import Counter, deque, defaultdict, namedtuple, OrderedDict',
      'letters = Counter("mississippi")',
      'print(letters, letters.most_common(2), letters["s"], letters["z"])',
      'q = deque([1, 2, 3])',
      'q.appendleft(0)',
      'q.append(4)',
      'q.rotate(1)',
      'print(q, q.popleft(), q)',
      'groups = defaultdict(list)',
      'for word in ["apple", "avocado", "banana", "cherry", "blueberry"]:',
      '    groups[word[0]].append(word)',
      'print(dict(groups))',
      'Point = namedtuple("Point", "x y")',
      'p = Point(3, 4)',
      'print(p, p.x + p.y, p._replace(x=0), OrderedDict(a=1))',
    ),
  },
  {
    module: 'itertools',
    name: 'itertools: permutations and combinations',
    code: lines(
      'import itertools',
      'print(list(itertools.permutations("ABC", 2)))',
      'print(list(itertools.combinations([1, 2, 3, 4], 3)))',
      'print(len(list(itertools.permutations(range(5)))), list(itertools.product("ab", repeat=2)))',
      'print(list(itertools.accumulate([1, 2, 3, 4])), list(itertools.chain([1], (2, 3))), list(itertools.islice(itertools.count(10, 5), 4)))',
    ),
  },
  {
    module: 'string',
    name: 'string: constants, capwords and Template',
    code: lines(
      'import string',
      'print(string.ascii_lowercase, string.digits, string.punctuation)',
      'print(string.capwords("hello  world from python"))',
      'print(string.Template("$name scored $marks").substitute(name="Asha", marks=91))',
    ),
  },
  {
    module: 'time',
    name: 'time: timing a loop',
    code: lines(
      'import time',
      'start = time.perf_counter()',
      'total = sum(range(100000))',
      'elapsed = time.perf_counter() - start',
      'print(total, elapsed >= 0, type(time.time()).__name__)',
      'print(time.strftime("%Y-%m-%d", time.gmtime(0)))',
    ),
  },
  {
    module: 'copy',
    name: 'copy: a shallow copy and a deep copy',
    code: lines(
      'import copy',
      'grid = [[1, 2], [3, 4]]',
      'shallow = copy.copy(grid)',
      'deep = copy.deepcopy(grid)',
      'grid[0][0] = 99',
      'print(shallow, deep, shallow[0] is grid[0], deep[0] is grid[0])',
    ),
  },
  {
    module: 'functools',
    name: 'functools: reduce, lru_cache and partial',
    code: lines(
      'from functools import reduce, lru_cache, partial',
      'print(reduce(lambda a, b: a * b, range(1, 6)))',
      'def fib(n):',
      '    return n if n < 2 else fib(n - 1) + fib(n - 2)',
      'fib = lru_cache(maxsize=None)(fib)',
      'print(fib(50), fib.cache_info().hits)',
      'square = partial(pow, exp=2)',
      'print(square(9))',
    ),
  },
  {
    module: 'json',
    name: 'json: dumps and loads',
    code: lines(
      'import json',
      'student = {"name": "Asha", "marks": [91, 85], "passed": True, "house": None}',
      'text = json.dumps(student)',
      'print(text)',
      'back = json.loads(text)',
      'print(back == student, back["marks"][1], json.dumps([1.5, "é"], ensure_ascii=False))',
      'print(json.dumps({"b": 1, "a": 2}, sort_keys=True, indent=2))',
    ),
  },
  {
    module: 'csv',
    name: 'csv: reading text written in the program',
    code: lines(
      'import csv',
      'text = """name,marks',
      'Asha,91',
      'Ravi,78',
      '"Singh, K",85"""',
      'rows = list(csv.reader(text.splitlines()))',
      'print(rows)',
      'for row in csv.DictReader(text.splitlines()):',
      '    print(row["name"], int(row["marks"]) + 5)',
      'print(sum(int(r[1]) for r in rows[1:]) / (len(rows) - 1))',
    ),
  },
];

/** One program that imports all twelve at once, as the tracer must allow. */
export const ALL_AT_ONCE: PyProgram = {
  name: 'all twelve at once',
  code: lines(
    `import ${STDLIB_MODULES.join(', ')}`,
    'print(statistics.mean([1, 2, 3]), fractions.Fraction(1, 2) + fractions.Fraction(1, 3), decimal.Decimal("0.1") * 3)',
    'print(datetime.date(2028, 1, 1) - datetime.date(2027, 12, 25), collections.Counter("aab"), list(itertools.combinations("abc", 2)))',
    'print(string.ascii_uppercase[:5], time.gmtime(0).tm_year, copy.deepcopy([[1]]), functools.reduce(max, [3, 9, 2]))',
    'print(json.loads("[1, 2]"), list(csv.reader(["a,b"])))',
  ),
};
