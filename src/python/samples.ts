// Sample Python programs in the style of the ISC Python units. tests/unit/python-trace.test.ts checks each
// one in the tracer against its expected output, and tests/unit/python-real.test.ts runs them through a real
// Python as well, where one is installed. Those using NumPy, pandas or Matplotlib are checked in
// tests/unit/python-libraries.test.ts, against a real Python that has them.

export interface PySample {
  id: string;
  title: string;
  topic: string;
  code: string;
  input?: string;
  /** What the program prints, for the tests. */
  expected: string;
  /** NumPy, pandas or Matplotlib, which load when it runs. Real Python needs them too, to compare with. */
  libraries?: string[];
}

export const PY_SAMPLES: PySample[] = [
  {
    id: 'list-alias',
    title: 'Two names for one list',
    topic: 'Lists',
    code: `a = [10, 20, 30]
b = a
c = a[:]
b.append(40)
c.append(50)
print("a =", a)
print("b =", b)
print("c =", c)
print(a is b, a is c)`,
    expected: 'a = [10, 20, 30, 40]\nb = [10, 20, 30, 40]\nc = [10, 20, 30, 50]\nTrue False\n',
  },
  {
    id: 'list-stats',
    title: 'Largest, smallest and average, without max() or min()',
    topic: 'Lists',
    code: `marks = [67, 82, 45, 91, 58]
largest = marks[0]
smallest = marks[0]
total = 0
for m in marks:
    if m > largest:
        largest = m
    if m < smallest:
        smallest = m
    total = total + m
print("Largest:", largest)
print("Smallest:", smallest)
print("Average:", total / len(marks))`,
    expected: 'Largest: 91\nSmallest: 45\nAverage: 68.6\n',
  },
  {
    id: 'list-unique',
    title: 'Remove repeats, keeping the first of each',
    topic: 'Lists',
    code: `nums = [4, 7, 4, 2, 7, 9, 2]
unique = []
for x in nums:
    if x not in unique:
        unique.append(x)
print(unique)
print("Removed", len(nums) - len(unique), "repeats")`,
    expected: '[4, 7, 2, 9]\nRemoved 3 repeats\n',
  },
  {
    id: 'list-matrix',
    title: 'A matrix as a nested list: row sums and the diagonal',
    topic: 'Lists',
    code: `m = [[2, 7, 6],
     [9, 5, 1],
     [4, 3, 8]]
for row in m:
    print(row, "sum", sum(row))
diagonal = 0
for i in range(len(m)):
    diagonal += m[i][i]
print("Diagonal sum:", diagonal)`,
    expected: '[2, 7, 6] sum 15\n[9, 5, 1] sum 15\n[4, 3, 8] sum 15\nDiagonal sum: 15\n',
  },
  {
    id: 'list-rows-trap',
    title: 'Rows made with * are the same list',
    topic: 'Lists',
    code: `grid = [[0] * 3] * 3
grid[0][1] = 5
print(grid)
fixed = [[0] * 3 for i in range(3)]
fixed[0][1] = 5
print(fixed)`,
    expected: '[[0, 5, 0], [0, 5, 0], [0, 5, 0]]\n[[0, 5, 0], [0, 0, 0], [0, 0, 0]]\n',
  },
  {
    id: 'list-comprehension',
    title: 'Squares and even numbers with list comprehensions',
    topic: 'Lists',
    code: `nums = [3, 8, 5, 12, 7, 6]
squares = [n * n for n in nums]
evens = [n for n in nums if n % 2 == 0]
print(squares)
print(evens)
print(nums[1:4], nums[::-1], nums[::2])`,
    expected: '[9, 64, 25, 144, 49, 36]\n[8, 12, 6]\n[8, 5, 12] [6, 7, 12, 5, 8, 3] [3, 5, 7]\n',
  },
  {
    id: 'tuple-ops',
    title: 'Tuples: indexing, slicing, count and index',
    topic: 'Tuples',
    code: `t = (5, 3, 8, 3, 1)
print(t[0], t[-1], t[1:3])
print(len(t), max(t), min(t), sum(t))
print(t.count(3), t.index(8))
print(t + (9,), t * 2)
print(3 in t, 7 in t)`,
    expected: '5 1 (3, 8)\n5 8 1 20\n2 2\n(5, 3, 8, 3, 1, 9) (5, 3, 8, 3, 1, 5, 3, 8, 3, 1)\nTrue False\n',
  },
  {
    id: 'tuple-assign',
    title: 'Swapping by tuple assignment, and a nested tuple',
    topic: 'Tuples',
    code: `a, b = 4, 9
a, b = b, a
print(a, b)
student = ("Asha", (78, 85, 91))
name, marks = student
print(name, marks[1], sum(marks))
print(sorted((7, 2, 5)))`,
    expected: '9 4\nAsha 85 254\n[2, 5, 7]\n',
  },
  {
    id: 'string-palindrome',
    title: 'Is a word a palindrome?',
    topic: 'Strings',
    code: `word = input("Enter a word: ")
reverse = ""
for ch in word:
    reverse = ch + reverse
if word.lower() == reverse.lower():
    print(word, "is a palindrome")
else:
    print(word, "is not a palindrome")`,
    input: 'Madam',
    expected: 'Enter a word: Madam is a palindrome\n',
  },
  {
    id: 'string-count',
    title: 'Count vowels, consonants, digits and spaces',
    topic: 'Strings',
    code: `s = "ISC Computer Science 2028"
vowels = consonants = digits = spaces = 0
for ch in s:
    if ch.isdigit():
        digits += 1
    elif ch == " ":
        spaces += 1
    elif ch.lower() in "aeiou":
        vowels += 1
    elif ch.isalpha():
        consonants += 1
print("Vowels:", vowels)
print("Consonants:", consonants)
print("Digits:", digits, "Spaces:", spaces)`,
    expected: 'Vowels: 7\nConsonants: 11\nDigits: 4 Spaces: 3\n',
  },
  {
    id: 'string-words',
    title: 'Capitalise each word, and reverse the order of words',
    topic: 'Strings',
    code: `line = "the quick brown fox"
words = line.split()
caps = []
for w in words:
    caps.append(w[0].upper() + w[1:])
print(" ".join(caps))
print(" ".join(words[::-1]))
print(line.title(), line.count("o"), line.find("brown"))`,
    expected: 'The Quick Brown Fox\nfox brown quick the\nThe Quick Brown Fox 2 10\n',
  },
  {
    id: 'string-slices',
    title: 'String slicing and methods',
    topic: 'Strings',
    code: `s = "PROGRAMMING"
print(s[0], s[-1], s[3:7], s[:4], s[7:])
print(s[::-1], s[::3])
print(s.lower(), s.replace("M", "m"), s.startswith("PRO"))
print(s * 2, len(s), "GRAM" in s)`,
    expected: 'P G GRAM PROG MING\nGNIMMARGORP PGMN\nprogramming PROGRAmmING True\nPROGRAMMINGPROGRAMMING 11 True\n',
  },
  {
    id: 'linear-search',
    title: 'Linear search',
    topic: 'Searching and sorting',
    code: `items = [14, 3, 27, 9, 31, 6]
key = int(input("Number to find: "))
position = -1
for i in range(len(items)):
    if items[i] == key:
        position = i
        break
if position == -1:
    print(key, "is not in the list")
else:
    print(key, "found at index", position)`,
    input: '9',
    expected: 'Number to find: 9 found at index 3\n',
  },
  {
    id: 'binary-search',
    title: 'Binary search in a sorted list',
    topic: 'Searching and sorting',
    code: `items = [3, 8, 12, 19, 24, 31, 40]
key = 24
low = 0
high = len(items) - 1
found = -1
while low <= high:
    mid = (low + high) // 2
    if items[mid] == key:
        found = mid
        break
    elif items[mid] < key:
        low = mid + 1
    else:
        high = mid - 1
print("Found at index", found)`,
    expected: 'Found at index 4\n',
  },
  {
    id: 'bubble-sort',
    title: 'Bubble sort',
    topic: 'Searching and sorting',
    code: `a = [29, 10, 14, 37, 13]
n = len(a)
for i in range(n - 1):
    for j in range(n - 1 - i):
        if a[j] > a[j + 1]:
            a[j], a[j + 1] = a[j + 1], a[j]
    print("Pass", i + 1, a)
print("Sorted:", a)`,
    expected: 'Pass 1 [10, 14, 29, 13, 37]\nPass 2 [10, 14, 13, 29, 37]\nPass 3 [10, 13, 14, 29, 37]\nPass 4 [10, 13, 14, 29, 37]\nSorted: [10, 13, 14, 29, 37]\n',
  },
  {
    id: 'selection-sort',
    title: 'Selection sort',
    topic: 'Searching and sorting',
    code: `a = [64, 25, 12, 22, 11]
for i in range(len(a) - 1):
    smallest = i
    for j in range(i + 1, len(a)):
        if a[j] < a[smallest]:
            smallest = j
    a[i], a[smallest] = a[smallest], a[i]
print(a)`,
    expected: '[11, 12, 22, 25, 64]\n',
  },
  {
    id: 'insertion-sort',
    title: 'Insertion sort',
    topic: 'Searching and sorting',
    code: `a = [12, 11, 13, 5, 6]
for i in range(1, len(a)):
    key = a[i]
    j = i - 1
    while j >= 0 and a[j] > key:
        a[j + 1] = a[j]
        j -= 1
    a[j + 1] = key
print(a)`,
    expected: '[5, 6, 11, 12, 13]\n',
  },
  {
    id: 'rec-factorial',
    title: 'Factorial by recursion',
    topic: 'Recursion',
    code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`,
    expected: '120\n',
  },
  {
    id: 'rec-fibonacci',
    title: 'Fibonacci terms by recursion',
    topic: 'Recursion',
    code: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

for i in range(7):
    print(fib(i), end=" ")
print()`,
    expected: '0 1 1 2 3 5 8 \n',
  },
  {
    id: 'rec-digits',
    title: 'Sum of digits, and a power, by recursion',
    topic: 'Recursion',
    code: `def digit_sum(n):
    if n == 0:
        return 0
    return n % 10 + digit_sum(n // 10)

def power(x, y):
    if y == 0:
        return 1
    return x * power(x, y - 1)

print(digit_sum(4729))
print(power(2, 5))`,
    expected: '22\n32\n',
  },
  {
    id: 'default-args',
    title: 'Functions with default arguments',
    topic: 'Functions',
    code: `def interest(p, r=5, t=1):
    return p * r * t / 100

def add_item(item, basket=None):
    if basket is None:
        basket = []
    basket.append(item)
    return basket

print(interest(1000))
print(interest(1000, 8))
print(interest(1000, t=3))
print(add_item("pen"), add_item("book"))`,
    expected: '50.0\n80.0\n150.0\n[\'pen\'] [\'book\']\n',
  },
  {
    id: 'numbers',
    title: 'Primes and Armstrong numbers, with break and continue',
    topic: 'Loops and numbers',
    code: `for n in range(2, 20):
    if n % 2 == 0 and n != 2:
        continue
    prime = True
    for d in range(2, n):
        if n % d == 0:
            prime = False
            break
    if prime:
        print(n, end=" ")
print()
for n in [153, 370, 371, 123]:
    digits = str(n)
    total = sum(int(d) ** len(digits) for d in digits)
    print(n, "Armstrong" if total == n else "not Armstrong")`,
    expected: '2 3 5 7 11 13 17 19 \n153 Armstrong\n370 Armstrong\n371 Armstrong\n123 not Armstrong\n',
  },
  {
    id: 'pattern',
    title: 'A number pattern, with print’s sep and end',
    topic: 'Loops and numbers',
    code: `rows = int(input("Rows: "))
for i in range(1, rows + 1):
    for j in range(1, i + 1):
        print(j, end=" ")
    print()
print(1, 2, 3, sep="-")
print("done", end="!\\n")`,
    input: '4',
    expected: 'Rows: 1 \n1 2 \n1 2 3 \n1 2 3 4 \n1-2-3\ndone!\n',
  },
  {
    id: 'lib-statistics',
    title: 'Class marks: mean, median, mode and standard deviation',
    topic: 'Python’s library',
    code: `import statistics

marks = [72, 85, 91, 64, 85, 78, 59, 88]
mean = statistics.mean(marks)
print("Mean:", mean)
print("Median:", statistics.median(marks))
print("Mode:", statistics.mode(marks))
print("Standard deviation:", round(statistics.stdev(marks), 2))
above = []
for m in marks:
    if m > mean:
        above.append(m)
print("Above the mean:", above)`,
    expected: 'Mean: 77.75\nMedian: 81.5\nMode: 85\nStandard deviation: 11.71\nAbove the mean: [85, 91, 85, 78, 88]\n',
  },
  {
    id: 'lib-fractions',
    title: 'Exact fractions, where floats are slightly out',
    topic: 'Python’s library',
    code: `from fractions import Fraction

tenth = Fraction(1, 10)
total = Fraction(0)
float_total = 0.0
for i in range(10):
    total = total + tenth
    float_total = float_total + 0.1
print("With fractions:", total, total == 1)
print("With floats:", float_total, float_total == 1)

a = Fraction(2, 3)
b = Fraction(5, 6)
print(a, "+", b, "=", a + b)
print(a, "*", b, "=", a * b)
print(a, "/", b, "=", a / b)
print("3/4 as a decimal:", float(Fraction(3, 4)))`,
    expected: 'With fractions: 1 True\nWith floats: 0.9999999999999999 False\n2/3 + 5/6 = 3/2\n2/3 * 5/6 = 5/9\n2/3 / 5/6 = 4/5\n3/4 as a decimal: 0.75\n',
  },
  {
    id: 'lib-counter',
    title: 'Counting letters and words with Counter',
    topic: 'Python’s library',
    code: `from collections import Counter

sentence = "the quick brown fox jumps over the lazy dog"
letters = Counter(sentence.replace(" ", ""))
print("Most common:", letters.most_common(3))
print("How many o's:", letters["o"])
print("How many z's:", letters["z"])
words = Counter(sentence.split())
word, count = words.most_common(1)[0]
print("Most used word:", word, "appears", count, "times")
print("Every letter used?", len(letters) == 26)`,
    expected: "Most common: [('o', 4), ('e', 3), ('t', 2)]\nHow many o's: 4\nHow many z's: 1\nMost used word: the appears 2 times\nEvery letter used? True\n",
  },
  {
    id: 'lib-permutations',
    title: 'Permutations and combinations for a P&C problem',
    topic: 'Python’s library',
    code: `from itertools import permutations, combinations
from math import comb, factorial

# In how many ways can A, B and C stand in a line?
ways = list(permutations("ABC"))
for w in ways:
    print("".join(w))
print(len(ways), "ways, and 3! =", factorial(3))

# A committee of 2 chosen from 4 students
students = ["Asha", "Ravi", "Meera", "Kabir"]
pairs = list(combinations(students, 2))
for p in pairs:
    print(p[0], "and", p[1])
print(len(pairs), "committees, and 4C2 =", comb(4, 2))`,
    expected: 'ABC\nACB\nBAC\nBCA\nCAB\nCBA\n6 ways, and 3! = 6\nAsha and Ravi\nAsha and Meera\nAsha and Kabir\nRavi and Meera\nRavi and Kabir\nMeera and Kabir\n6 committees, and 4C2 = 6\n',
  },
  {
    id: 'lib-numpy-stats',
    title: 'Marks as a NumPy array: mean, median and standard deviation',
    topic: 'NumPy',
    libraries: ['numpy'],
    code: `import numpy as np

marks = np.array([72, 85, 91, 64, 85, 78, 59, 88])
print("Marks:", marks)
print("How many:", marks.size)
print("Mean:", marks.mean())
print("Median:", np.median(marks))
print("Standard deviation:", round(marks.std(), 2))
print("Highest and lowest:", marks.max(), marks.min())
print("Above 80:", marks[marks > 80])
print("Out of 1:", marks / 100)`,
    expected: 'Marks: [72 85 91 64 85 78 59 88]\nHow many: 8\nMean: 77.75\nMedian: 81.5\nStandard deviation: 10.95\nHighest and lowest: 91 59\nAbove 80: [85 91 85 88]\nOut of 1: [0.72 0.85 0.91 0.64 0.85 0.78 0.59 0.88]\n',
  },
  {
    id: 'lib-numpy-views',
    title: 'A slice of an array shares its data, and a copy doesn’t',
    topic: 'NumPy',
    libraries: ['numpy'],
    code: `import numpy as np

a = np.arange(1, 7)
b = a[1:4]     # a slice is a view: it shares a's data
c = a.copy()   # a copy has data of its own
b[0] = 99
print("a =", a)
print("b =", b)
print("c =", c)
grid = a.reshape(2, 3)
print(grid)
print("Column sums:", grid.sum(axis=0))
print("Row sums:", grid.sum(axis=1))`,
    expected: 'a = [ 1 99  3  4  5  6]\nb = [99  3  4]\nc = [1 2 3 4 5 6]\n[[ 1 99  3]\n [ 4  5  6]]\nColumn sums: [  5 104   9]\nRow sums: [103  15]\n',
  },
  {
    id: 'lib-pandas-filter',
    title: 'A class’s marks in a DataFrame: a new column, and filtering',
    topic: 'pandas',
    libraries: ['pandas'],
    code: `import pandas as pd

data = {
    "name": ["Asha", "Ravi", "Meera", "Kabir", "Zoya", "Dev"],
    "house": ["Red", "Blue", "Red", "Green", "Blue", "Green"],
    "physics": [91, 78, 85, 64, 88, 72],
    "maths": [95, 82, 79, 70, 91, 68],
}
df = pd.DataFrame(data)
print(df)
df["total"] = df["physics"] + df["maths"]
top = df[df["total"] > 160]
print(top[["name", "total"]])
print("Average in physics:", df["physics"].mean())
print("Top three:", df.sort_values("total", ascending=False)["name"].head(3).tolist())`,
    expected: "    name  house  physics  maths\n0   Asha    Red       91     95\n1   Ravi   Blue       78     82\n2  Meera    Red       85     79\n3  Kabir  Green       64     70\n4   Zoya   Blue       88     91\n5    Dev  Green       72     68\n    name  total\n0   Asha    186\n2  Meera    164\n4   Zoya    179\nAverage in physics: 79.66666666666667\nTop three: ['Asha', 'Zoya', 'Meera']\n",
  },
  {
    id: 'lib-pandas-groupby',
    title: 'Average marks for each house, with groupby',
    topic: 'pandas',
    libraries: ['pandas'],
    code: `import pandas as pd

df = pd.DataFrame({
    "house": ["Red", "Blue", "Red", "Green", "Blue", "Green", "Red"],
    "marks": [91, 78, 85, 64, 88, 72, 69],
})
by_house = df.groupby("house")["marks"]
print(by_house.mean())
print(by_house.count())
summary = by_house.agg(["min", "max", "mean"])
print(summary)
print("Best house:", summary["mean"].idxmax())`,
    expected: 'house\nBlue     83.000000\nGreen    68.000000\nRed      81.666667\nName: marks, dtype: float64\nhouse\nBlue     2\nGreen    2\nRed      3\nName: marks, dtype: int64\n       min  max       mean\nhouse                     \nBlue    78   88  83.000000\nGreen   64   72  68.000000\nRed     69   91  81.666667\nBest house: Blue\n',
  },
  {
    id: 'lib-mpl-line',
    title: 'A line graph of a week’s temperatures',
    topic: 'Matplotlib',
    libraries: ['matplotlib'],
    code: `import matplotlib.pyplot as plt

days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
delhi = [31, 33, 34, 32, 30, 29, 31]
shimla = [18, 19, 21, 20, 17, 16, 18]
plt.plot(days, delhi, marker="o", label="Delhi")
plt.plot(days, shimla, marker="s", label="Shimla")
plt.title("Highest temperature in a week")
plt.xlabel("Day")
plt.ylabel("Temperature (°C)")
plt.legend()
plt.grid(True)
plt.show()
print("Warmest day in Delhi:", days[delhi.index(max(delhi))])`,
    expected: 'Warmest day in Delhi: Wed\n',
  },
  {
    id: 'lib-mpl-bar',
    title: 'A bar chart of marks in each subject',
    topic: 'Matplotlib',
    libraries: ['matplotlib'],
    code: `import matplotlib.pyplot as plt

subjects = ["Physics", "Chemistry", "Maths", "Computer Sc."]
marks = [84, 78, 92, 88]
plt.bar(subjects, marks)
plt.ylim(0, 100)
plt.title("Marks in the pre-board")
plt.ylabel("Marks out of 100")
for i in range(len(marks)):
    plt.text(i, marks[i] + 2, str(marks[i]), ha="center")
plt.show()
print("Average:", sum(marks) / len(marks))`,
    expected: 'Average: 85.5\n',
  },
  {
    id: 'lib-mpl-scatter',
    title: 'A scatter plot of height and weight, with a best-fit line',
    topic: 'Matplotlib',
    libraries: ['numpy', 'matplotlib'],
    code: `import numpy as np
import matplotlib.pyplot as plt

height = np.array([150, 155, 160, 162, 165, 168, 170, 172, 175, 180])
weight = np.array([45, 50, 52, 55, 58, 60, 63, 65, 68, 74])
slope, intercept = np.polyfit(height, weight, 1)
print("Slope of the best-fit line:", round(slope, 2), "kg per cm")
print("Where it crosses the axis:", round(intercept, 2), "kg")
plt.scatter(height, weight, label="Students")
plt.plot(height, slope * height + intercept, label="Best fit")
plt.xlabel("Height (cm)")
plt.ylabel("Weight (kg)")
plt.title("Height and weight")
plt.legend()
plt.show()`,
    expected: 'Slope of the best-fit line: 0.95 kg per cm\nWhere it crosses the axis: -99.07 kg\n',
  },
  {
    id: 'lib-mpl-projectile',
    title: 'Projectiles at three angles, worked out with NumPy and drawn',
    topic: 'Matplotlib',
    libraries: ['numpy', 'matplotlib'],
    code: `import numpy as np
import matplotlib.pyplot as plt

g = 9.8
u = 20   # launch speed in m/s
for angle in [30, 45, 60]:
    theta = np.radians(angle)
    flight = 2 * u * np.sin(theta) / g
    t = np.linspace(0, flight, 50)
    x = u * np.cos(theta) * t
    y = u * np.sin(theta) * t - 0.5 * g * t ** 2
    plt.plot(x, y, label=str(angle) + " degrees")
    print(angle, "degrees: range", round(x[-1], 1), "m, greatest height", round(y.max(), 1), "m")
plt.xlabel("Distance (m)")
plt.ylabel("Height (m)")
plt.title("Projectiles launched at 20 m/s")
plt.legend()
plt.show()`,
    expected: '30 degrees: range 35.3 m, greatest height 5.1 m\n45 degrees: range 40.8 m, greatest height 10.2 m\n60 degrees: range 35.3 m, greatest height 15.3 m\n',
  },
];
