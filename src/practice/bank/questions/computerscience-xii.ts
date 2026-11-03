// Original questions in the style of ISC Computer Science Class XII. Places are [unit, topic, marks, difficulty].
// tests/unit/bank.test.ts runs every program here and compares what it prints.
import { bank, type BankDef } from '../define';

const { mcq, ar, theory, output } = bank('computerscience', 'XII');
const block = (code: string) => '```\n' + code + '\n```';

const questions: BankDef[] = [
  // Part I: one mark
  mcq([1, 'a', 1, 1], 'The dual of the Boolean expression $A + 0 = A$ is:', ['$A \\cdot 1 = A$', '$A + 1 = 1$', '$A \\cdot 0 = 0$', '$A + A = A$'], 0),
  mcq([1, 'a', 1, 2], 'A proposition that is true for all values of its variables is called a:', ['contradiction', 'contingency', 'tautology', 'converse'], 2),
  mcq([1, 'b', 1, 2], 'By De Morgan’s law, the complement of $(A + B)$ is:', ['$A\' + B\'$', '$A\' \\cdot B\'$', '$A \\cdot B$', '$A + B\'$'], 1),
  ar([1, 'b', 1, 2], 'NAND is called a universal gate.', 'Any Boolean function can be built using NAND gates alone.', 1),
  mcq([2, 'a', 1, 1], 'A half adder has how many inputs and how many outputs?', ['2 and 1', '2 and 2', '3 and 2', '3 and 1'], 1),
  mcq([2, 'b', 1, 2], 'A decoder with 3 input lines has how many output lines?', ['3', '6', '8', '9'], 2),
  mcq([3, 'a', 1, 1], 'Which keyword refers to the current object?', ['`super`', '`this`', '`static`', '`new`'], 1),
  mcq([3, 'a', 1, 2], 'A method that changes the state of the object passed to it is called:', ['a pure method', 'an impure method', 'a constructor', 'an abstract method'], 1),
  mcq([4, 'a', 1, 1], 'If `int a[] = new int[10];` then the last valid index is:', ['8', '9', '10', '11'], 1),
  mcq([4, 'b', 1, 1], 'What does `"COMPUTER".substring(3, 6)` return?', ['`PUT`', '`MPU`', '`PUTE`', '`UTE`'], 0),
  mcq([4, 'b', 1, 2], 'What does `"apple".compareTo("apricot")` return, as a sign?', ['A negative value', 'Zero', 'A positive value', 'It causes a compile error'], 0, 'At the third character, `p` comes before `r`.'),
  mcq([5, 'a', 1, 1], 'Which part of a recursive method stops the recursion?', ['The recursive call', 'The base case', 'The return type', 'The parameter list'], 1),
  ar([5, 'a', 1, 2], 'A recursive method with no reachable base case ends with a stack overflow.', 'A recursive method cannot have parameters.', 3, 'Each call adds a frame to the call stack until its memory runs out. Recursive methods can take parameters.'),
  mcq([6, 'a', 1, 1], 'Which keyword makes one class inherit from another?', ['`implements`', '`extends`', '`super`', '`inherits`'], 1),
  mcq([6, 'b', 1, 2], 'Which is true of a Java interface?', ['It can have instance variables', 'A class can implement several interfaces', 'It can be instantiated with `new`', 'Its methods must be private'], 1),
  mcq([7, 'b', 1, 1], 'In Python, which of these is immutable?', ['A list', 'A tuple', 'A dictionary', 'A set'], 1),
  mcq([7, 'a', 1, 2], 'In Python, what does `"hello"[1:3]` give?', ['`he`', '`el`', '`ell`', '`ll`'], 1),
  mcq([8, 'a', 1, 1], 'In a binary tree, a node with no children is called a:', ['root', 'parent', 'leaf', 'sibling'], 2),
  mcq([9, 'a', 1, 2], 'The time complexity of binary search on a sorted array of n elements is:', ['$O(1)$', '$O(\\log n)$', '$O(n)$', '$O(n^2)$'], 1),

  // Part I: two marks
  output([3, 'a', 2, 1], `class Main {
    static int twice(int x) {
        x = x * 2;
        return x;
    }
    public static void main(String[] args) {
        int a = 5;
        int b = twice(a);
        System.out.println(a + " " + b);
    }
}`, '5 10', 'A primitive is passed by value, so the change to `x` does not reach `a`.'),
  output([4, 'a', 2, 1], `class Main {
    public static void main(String[] args) {
        int[] a = {3, 7, 2, 9};
        int s = 0;
        for (int i = 1; i < a.length; i += 2) {
            s += a[i];
        }
        System.out.println(s);
    }
}`, '16', 'Only the elements at index 1 and 3 are added.'),
  output([4, 'b', 2, 1], `class Main {
    public static void main(String[] args) {
        String s = "KEYBOARD";
        System.out.println(s.indexOf('B') + " " + s.charAt(2));
    }
}`, '3 Y'),
  output([5, 'a', 2, 2], `class Main {
    static int f(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * f(n - 2);
    }
    public static void main(String[] args) {
        System.out.println(f(7));
    }
}`, '105', 'This calculates 7 × 5 × 3 × 1.'),
  output([4, 'a', 2, 2], `class Main {
    public static void main(String[] args) {
        int[][] m = {{1, 2}, {3, 4}};
        int t = 0;
        for (int i = 0; i < 2; i++) {
            t += m[i][i] - m[i][1 - i];
        }
        System.out.println(t);
    }
}`, '0', '(1 − 2) + (4 − 3) = 0.'),
  theory('error', [3, 'a', 2, 2], 'The method below should return the larger of two values, but it does not compile. Find the error, and correct it.\n```\nint larger(int a, int b) {\n    if (a > b)\n        return a;\n}\n```', ['A value is not returned on every path: nothing is returned when `a > b` is false.', 'Correction: add `return b;` after the `if` statement.']),
  theory('error', [4, 'a', 2, 1], 'This code should print the elements of `a`. Find the error, and correct it.\n```\nint[] a = {1, 2, 3};\nfor (int i = 0; i <= a.length; i++)\n    System.out.println(a[i]);\n```', ['With `i <= a.length`, the last pass uses `a[3]`, which is out of bounds at run time.', 'Correction: use `i < a.length`.']),
  theory('complete', [5, 'a', 2, 2], 'Complete the recursive method that returns the sum of the digits of n, by filling in ?1? and ?2?.\n```\nint sum(int n) {\n    if (n == 0)\n        return ?1?;\n    return n % 10 + sum(?2?);\n}\n```', ['?1? is `0`.', '?2? is `n / 10`.']),
  theory('short', [1, 'b', 2, 1], 'Simplify $F = A + A\'B$, and name the law used.', ['$A + A\'B = (A + A\')(A + B)$, using the distributive law.', 'This gives $F = A + B$.']),
  theory('short', [2, 'a', 2, 1], 'Write the sum and carry expressions of a half adder.', ['Sum $= A \\oplus B = A\'B + AB\'$.', 'Carry $= A \\cdot B$.'], { recall: 1 }),
  theory('definition', [6, 'b', 2, 1], 'What is an interface in Java? Give one difference between an interface and a class.', ['An interface is a reference type that declares methods a class must define, along with constants.', 'A class can be instantiated and can hold object state, while an interface cannot be instantiated.']),
  theory('short', [8, 'a', 2, 1], 'Define the height of a binary tree. What is the largest number of nodes at level 3, taking the root at level 0?', ['Height is the number of edges on the longest path from the root to a leaf.', 'At level 3 there can be at most $2^3 = 8$ nodes.']),
  theory('short', [9, 'a', 2, 1], 'State the worst-case complexity of bubble sort, and of linear search, on n elements.', ['Bubble sort: $O(n^2)$.', 'Linear search: $O(n)$.']),
  theory('short', [4, 'a', 2, 3], 'An array `A[-2..8]` holds integers of 4 bytes each, with its base address at 1000. Find the address of `A[5]`.', ['Address = base + (index − lower bound) × size = 1000 + (5 − (−2)) × 4.', 'The address is 1028.']),

  // Part II, Section A: ten marks, hardware
  theory('short', [1, 'b', 10, 2], 'Given $F(A, B, C, D) = \\Sigma(0, 2, 5, 7, 8, 10, 13, 15)$: (a) Draw the K-map and reduce F to its simplest sum of products, showing the groups. (b) Draw the logic circuit for the reduced expression using only NAND gates, stating how you get there. (c) State what the output is for a simple rule between B and D.', [['Correct K-map, with 1s at all eight minterms.', 2], ['Group 1: minterms 0, 2, 8, 10, a quad giving $B\'D\'$.', 2], ['Group 2: minterms 5, 7, 13, 15, a quad giving $BD$.', 2], ['$F = B\'D\' + BD$.', 1], ['NAND-only form: $F = ((B\'D\')\' \\cdot (BD)\')\'$, with inverters as NAND gates with joined inputs.', 2], ['The output is 1 exactly when B and D are the same, so it is $B$ XNOR $D$.', 1]]),
  theory('short', [1, 'b', 10, 3], 'Given $F(A, B, C, D) = \\Pi(0, 1, 2, 3, 5, 7)$: (a) Reduce it with a K-map to its simplest product of sums, showing the groups. (b) From the same K-map, write the simplest sum of products. (c) Prove, with Boolean laws, that both give the same value when A = 1.', [['Correct K-map, with 0s at the six maxterms.', 2], ['Group 1: 0, 1, 2, 3, a quad giving $(A + B)$.', 2], ['Group 2: 1, 3, 5, 7, a quad giving $(A + D\')$.', 2], ['$F = (A + B)(A + D\')$.', 1], ['Sum of products: $F = A + BD\'$.', 2], ['With A = 1, each form is 1, using $1 + X = 1$.', 1]]),
  theory('short', [2, 'b', 10, 2], 'A full adder adds three bits A, B and C. (a) Write its truth table. (b) Derive the sum and carry expressions, and reduce them. (c) Show how a full adder can be built from two half adders and an OR gate.', [['Correct truth table for the eight rows.', 2], ['Sum as minterms: $\\Sigma(1, 2, 4, 7)$, which is $A \\oplus B \\oplus C$.', 2], ['Carry as minterms: $\\Sigma(3, 5, 6, 7)$, which reduces to $AB + BC + CA$.', 2], ['First half adder adds A and B, giving $A \\oplus B$ and $AB$.', 1], ['Second half adder adds $A \\oplus B$ and C, giving the final sum, and carry $(A \\oplus B)C$.', 2], ['An OR gate combines the two carries.', 1]]),
  theory('short', [2, 'b', 10, 2], 'A security system has inputs: P (password correct), C (card present) and T (out of hours). The door opens if the password and the card are both right, or if the card is present and it is not out of hours. (a) Write the truth table. (b) Write the Boolean expression, and reduce it. (c) Draw the circuit in words, naming the gates and how they connect. (d) What is a multiplexer, and how many select lines does an 8-to-1 multiplexer have?', [['Truth table for P, C and T.', 2], ['$F = PC + CT\'$.', 2], ['Reduced form: $F = C(P + T\')$.', 2], ['Circuit: NOT on T, OR with P, then AND with C.', 2], ['A multiplexer selects one of several inputs to send to one output, under the select lines.', 1], ['An 8-to-1 multiplexer has 3 select lines.', 1]]),
  theory('short', [1, 'a', 10, 2], '(a) With a truth table, verify that $(p \\Rightarrow q) \\equiv (\\sim p \\vee q)$. (b) State whether $(p \\wedge q) \\Rightarrow p$ is a tautology, a contradiction or a contingency, and show it. (c) Write the converse, inverse and contrapositive of "If it rains, the match stops". (d) State and prove the absorption law $A + AB = A$.', [['Truth table with all four rows and matching columns.', 2], ['$(p \\wedge q) \\Rightarrow p$ takes only the value true.', 1], ['So it is a tautology.', 1], ['Converse: if the match stops, it rains.', 1], ['Inverse: if it does not rain, the match does not stop.', 1], ['Contrapositive: if the match does not stop, it does not rain.', 1], ['$A + AB = A(1 + B)$.', 2], ['$= A \\cdot 1 = A$.', 1]]),

  // Part II, Section B: ten marks, Java
  theory('program', [3, 'a', 10, 2], 'Design a class `Fraction` with the data members `num` and `den` (integers). Its member methods are: a parameterised constructor; `Fraction add(Fraction f)`, to return the sum as a new object, without reducing it; `void show()`, to print it as num/den. Write `main` to create two objects, add them, and print the sum.', [['Class heading and the two data members.', 1], ['Constructor assigns both data members.', 1], ['`add` has the correct heading, with an object as parameter and return type.', 2], ['New numerator: `num * f.den + f.num * den`.', 2], ['New denominator: `den * f.den`.', 1], ['Returns a new `Fraction`.', 1], ['`show` prints in the right form.', 1], ['`main` creates the objects and calls the methods.', 1]], { model: block(`class Fraction {
    int num, den;
    Fraction(int n, int d) {
        num = n;
        den = d;
    }
    Fraction add(Fraction f) {
        return new Fraction(num * f.den + f.num * den, den * f.den);
    }
    void show() {
        System.out.println(num + "/" + den);
    }
    public static void main(String[] args) {
        Fraction a = new Fraction(1, 2);
        Fraction b = new Fraction(1, 3);
        a.add(b).show();
    }
}`) }),
  theory('program', [4, 'a', 10, 2], 'Design a class `Flip` that holds a square matrix `m[][]` of size `n`. Provide a constructor taking `n`; `void fill(int[][] d)`, to copy values in; `void flip()`, which reverses each row; and `void show()`. Write `main` for a 3 × 3 matrix.', [['Data members and a constructor which allocates the array.', 2], ['`fill` copies with a nested loop.', 1], ['`flip` loops over each row.', 1], ['Inner loop runs only to the middle of the row.', 2], ['Swaps `m[i][j]` with `m[i][n - 1 - j]` using a temporary variable.', 2], ['`show` prints row by row.', 1], ['`main` creates the object and calls the methods.', 1]], { model: block(`class Flip {
    int[][] m;
    int n;
    Flip(int size) {
        n = size;
        m = new int[n][n];
    }
    void fill(int[][] d) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                m[i][j] = d[i][j];
            }
        }
    }
    void flip() {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n / 2; j++) {
                int t = m[i][j];
                m[i][j] = m[i][n - 1 - j];
                m[i][n - 1 - j] = t;
            }
        }
    }
    void show() {
        for (int i = 0; i < n; i++) {
            String row = "";
            for (int j = 0; j < n; j++) {
                row = row + m[i][j] + " ";
            }
            System.out.println(row);
        }
    }
    public static void main(String[] args) {
        Flip f = new Flip(3);
        int[][] d = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
        f.fill(d);
        f.flip();
        f.show();
    }
}`) }),
  theory('program', [4, 'b', 10, 2], 'Design a class `WordCount` with a data member `s` that stores a sentence. Provide a constructor; `int vowels()`, which counts the vowels (either case); and `String longest()`, which returns the longest word. Words are separated by single spaces. Write `main`.', [['Data member and constructor.', 1], ['`vowels` loops over the characters.', 1], ['Correct test for a vowel, handling case.', 2], ['`longest` splits the sentence into words, by `split` or `indexOf`.', 2], ['Keeps the longest word seen so far, comparing lengths.', 2], ['Returns the result correctly.', 1], ['`main` creates the object and prints both answers.', 1]], { model: block(`class WordCount {
    String s;
    WordCount(String t) {
        s = t;
    }
    int vowels() {
        int c = 0;
        String low = s.toLowerCase();
        for (int i = 0; i < low.length(); i++) {
            if ("aeiou".indexOf(low.charAt(i)) >= 0) {
                c++;
            }
        }
        return c;
    }
    String longest() {
        String best = "";
        String word = "";
        String t = s + " ";
        for (int i = 0; i < t.length(); i++) {
            char ch = t.charAt(i);
            if (ch == ' ') {
                if (word.length() > best.length()) {
                    best = word;
                }
                word = "";
            } else {
                word = word + ch;
            }
        }
        return best;
    }
    public static void main(String[] args) {
        WordCount w = new WordCount("Practice makes a student confident");
        System.out.println(w.vowels());
        System.out.println(w.longest());
    }
}`) }),
  theory('program', [5, 'a', 10, 2], 'Design a class `Digits` that has a data member `n`. Using recursion, and no loops, write: `int product(int v)`, returning the product of the digits of `v`; `int reverse(int v, int r)`, which builds up the digits in reverse. Also write `boolean isPal()`, using `reverse` to test whether `n` is a palindrome. Write `main`.', [['Data member and constructor.', 1], ['`product` has a base case for a single digit.', 2], ['Its recursive step: `v % 10 * product(v / 10)`.', 2], ['`reverse` has a base case returning `r` at `v == 0`.', 1], ['Its recursive step: `reverse(v / 10, r * 10 + v % 10)`.', 2], ['`isPal` compares `n` with `reverse(n, 0)`.', 1], ['`main` creates the object and calls the methods.', 1]], { model: block(`class Digits {
    int n;
    Digits(int v) {
        n = v;
    }
    int product(int v) {
        if (v < 10) {
            return v;
        }
        return v % 10 * product(v / 10);
    }
    int reverse(int v, int r) {
        if (v == 0) {
            return r;
        }
        return reverse(v / 10, r * 10 + v % 10);
    }
    boolean isPal() {
        return n == reverse(n, 0);
    }
    public static void main(String[] args) {
        Digits d = new Digits(1221);
        System.out.println(d.product(d.n));
        System.out.println(d.isPal());
    }
}`) }),
  theory('program', [6, 'a', 10, 3], 'A class `Account` has `name` and `balance`, a parameterised constructor, and `void show()`. A class `Savings` inherits from `Account`, adding `rate`, a constructor that passes values up, and `double interest()`, to return one year’s simple interest. It overrides `show()`, to print everything. Specify both classes. Assume that `main` is written for you.', [['`Account` has its data members.', 1], ['`Account` constructor assigns both.', 1], ['`Account.show` prints name and balance.', 1], ['`Savings` uses `extends Account`.', 1], ['`Savings` has the extra data member `rate`.', 1], ['`Savings` constructor calls `super(n, b)` first.', 2], ['`interest` returns `balance * rate / 100`.', 1], ['`show` is overridden, and calls `super.show()`.', 2]], { model: block(`class Account {
    String name;
    double balance;
    Account(String n, double b) {
        name = n;
        balance = b;
    }
    void show() {
        System.out.println(name + " " + balance);
    }
}
class Savings extends Account {
    double rate;
    Savings(String n, double b, double r) {
        super(n, b);
        rate = r;
    }
    double interest() {
        return balance * rate / 100;
    }
    void show() {
        super.show();
        System.out.println(rate + " " + interest());
    }
}`) }),
  theory('program', [4, 'a', 10, 3], 'Design a class `Sorter` that holds an integer array. Provide `void sort()`, which sorts it in ascending order by selection sort, and `int find(int key)`, which does a binary search and returns the position, or −1. Write `main`.', [['Data member and constructor.', 1], ['Outer loop in `sort`.', 1], ['Finds the smallest of the rest.', 2], ['Swaps it into place.', 1], ['Binary search sets the low and high bounds.', 1], ['Calculates the middle, and compares.', 2], ['Moves the correct bound, and returns −1 if not found.', 1], ['`main` creates the object and calls the methods.', 1]], { model: block(`class Sorter {
    int[] a;
    Sorter(int[] d) {
        a = d;
    }
    void sort() {
        for (int i = 0; i < a.length - 1; i++) {
            int small = i;
            for (int j = i + 1; j < a.length; j++) {
                if (a[j] < a[small]) {
                    small = j;
                }
            }
            int t = a[i];
            a[i] = a[small];
            a[small] = t;
        }
    }
    int find(int key) {
        int low = 0;
        int high = a.length - 1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (a[mid] == key) {
                return mid;
            }
            if (a[mid] < key) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }
    public static void main(String[] args) {
        int[] d = {9, 2, 7, 4};
        Sorter s = new Sorter(d);
        s.sort();
        System.out.println(s.find(7));
    }
}`) }),

  // Part II, Section C: five marks
  theory('short', [8, 'a', 5, 2], 'A binary tree has root A. A’s left child is B and its right child is C. B’s children are D and E, left to right. C has only a right child, F. (a) Write its inorder, preorder and postorder traversals. (b) Name its leaf nodes. (c) State its height.', ['Inorder: D B E A C F.', 'Preorder: A B D E C F.', 'Postorder: D E B F C A.', 'The leaves are D, E and F.', 'The height is 2.']),
  theory('short', [8, 'a', 5, 2], 'Insert 50, 30, 70, 20, 40, 60 in that order, into an empty binary search tree. (a) Describe where each one goes. (b) Write the inorder traversal, and say what is special about it. (c) Name the root and the parent of 60.', ['50 is the root. 30 and 70 are its left and right children.', '20 and 40 are the children of 30, and 60 is the left child of 70.', 'Inorder: 20 30 40 50 60 70.', 'Inorder traversal of a binary search tree gives sorted order.', 'The root is 50, and the parent of 60 is 70.']),
  theory('short', [9, 'a', 5, 2], '(a) What does Big O notation express? (b) State the complexity of this code, in terms of n, with a reason. (c) Name the best case of linear search, with its complexity.\n```\nfor (int i = 0; i < n; i++)\n    for (int j = 0; j < n; j++)\n        c++;\n```', ['It gives an upper bound on how running time grows with input size, ignoring constants.', 'The code is $O(n^2)$.', 'The inner statement runs n times for each of the n outer passes, which is $n \\times n$.', 'Best case: the key is the first element.', 'Its complexity is $O(1)$.']),
  theory('short', [9, 'a', 5, 3], 'Compare $O(1)$, $O(\\log n)$, $O(n)$ and $O(n^2)$. (a) Order them from slowest growth to fastest. (b) Give an algorithm for each one.', ['The order is $O(1)$, $O(\\log n)$, $O(n)$, $O(n^2)$.', '$O(1)$: reading an array element by index.', '$O(\\log n)$: binary search.', '$O(n)$: linear search.', '$O(n^2)$: bubble sort.']),
  theory('short', [7, 'b', 5, 1], 'Write the output of each line, in order, and say which list method is used for each change.\n```\nl = [4, 1, 3]\nl.append(9)\nprint(l)\nl.sort()\nprint(l)\nprint(l[-1], len(l))\n```', ['`[4, 1, 3, 9]`', '`append` adds an element to the end.', '`[1, 3, 4, 9]`', '`sort` puts the list in ascending order, in place.', '`9 4`'], { python: 1 }),
  theory('short', [7, 'c', 5, 2], 'Using Python: (a) State two differences between a list and a tuple. (b) What happens with `t = (1, 2, 3)` followed by `t[0] = 5`? (c) Write the code to make a tuple of the squares of 1 to 5.', ['A list is mutable, and a tuple is immutable.', 'Lists use square brackets, and tuples use round brackets.', 'It raises a `TypeError`, since tuples cannot be changed.', '`t = tuple(i * i for i in range(1, 6))`', 'This gives `(1, 4, 9, 16, 25)`.'], { python: 1 }),
  output([7, 'a', 5, 2], `s = "programming"
print(s[0:4])
print(s[-3:])
print(s.upper().count("M"))
print(s[::-1][0:3])`, `prog
ing
2
gni`, 'Slicing with a step of −1 reverses the string.', { python: 1, text: 'Write the output of the following Python program.' }),
];

export default questions;
