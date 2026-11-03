// Original questions in the style of ISC Computer Science Class XI. Places are [unit, topic, marks, difficulty].
// tests/unit/bank.test.ts runs every program here and compares what it prints.
import { bank, type BankDef } from '../define';

const { mcq, ar, theory, output } = bank('computerscience', 'XI');
const block = (code: string) => '```\n' + code + '\n```';

const questions: BankDef[] = [
  // Part I: one mark
  mcq([1, 'a', 1, 1], 'The binary number 1011 in decimal is:', ['9', '10', '11', '13'], 2),
  mcq([1, 'a', 1, 2], 'The hexadecimal number 2F in decimal is:', ['31', '47', '215', '32'], 1),
  mcq([2, 'a', 1, 1], 'How many bits does standard ASCII use for each character?', ['7', '8', '16', '32'], 0),
  ar([2, 'a', 1, 2], 'Unicode can represent the characters of many languages.', 'Unicode assigns a unique code point to each character, across writing systems.', 1),
  mcq([3, 'a', 1, 2], 'Which proposition is equivalent to $\\sim(p \\wedge q)$?', ['$\\sim p \\wedge \\sim q$', '$\\sim p \\vee \\sim q$', '$p \\vee q$', '$p \\wedge \\sim q$'], 1),
  mcq([3, 'b', 1, 1], 'The output of an AND gate is 1 only when:', ['any input is 1', 'all inputs are 1', 'all inputs are 0', 'exactly one input is 1'], 1),
  mcq([4, 'a', 1, 1], 'Bundling data and the methods that use it into one unit is called:', ['inheritance', 'polymorphism', 'encapsulation', 'recursion'], 2),
  mcq([5, 'a', 1, 1], 'Java source code compiles to:', ['machine code', 'bytecode', 'assembly', 'HTML'], 1),
  mcq([5, 'b', 1, 2], 'Dividing an integer by zero, in Java, gives:', ['a compile-time error', 'a run-time exception', 'zero', 'a logical error only'], 1),
  mcq([6, 'a', 1, 1], 'What is the size of `int` in Java?', ['2 bytes', '4 bytes', '8 bytes', 'It depends on the machine'], 1),
  mcq([6, 'a', 1, 2], 'The value of `(int) 7.9` is:', ['7', '8', '7.9', 'a compile error'], 0),
  mcq([7, 'a', 1, 1], 'The value of `7 / 2` in Java, with both operands `int`, is:', ['3', '3.5', '4', '4.0'], 0),
  mcq([7, 'a', 1, 2], 'After `int a = 5; int b = a++ + 2;`, what is `b`?', ['5', '6', '7', '8'], 2),
  mcq([8, 'a', 1, 1], 'Which statement exits a loop immediately?', ['`continue`', '`break`', '`return false`', '`exit`'], 1),
  mcq([9, 'a', 1, 1], 'A constructor has the same name as its:', ['package', 'class', 'object', 'first variable'], 1),
  mcq([10, 'a', 1, 1], 'The length of the array `int a[] = new int[6]` is given by:', ['`a.length()`', '`a.length`', '`a.size()`', '`length(a)`'], 1),
  mcq([11, 'a', 1, 1], 'Which `Scanner` method reads a whole line of text?', ['`next()`', '`nextInt()`', '`nextLine()`', '`readLine()`'], 2),
  mcq([12, 'a', 1, 1], 'In Python, a block of code is marked by:', ['braces', 'indentation', 'semicolons', 'keywords only'], 1),
  mcq([13, 'a', 1, 1], 'Using someone’s work without credit is called:', ['phishing', 'plagiarism', 'encryption', 'hacking'], 1),

  // Part I: two marks
  output([7, 'a', 2, 1], `class Main {
    public static void main(String[] args) {
        int a = 17;
        int b = 5;
        System.out.println(a / b + " " + a % b);
        System.out.println((double) a / b);
    }
}`, `3 2
3.4`, 'Integer division drops the fraction, and the cast makes the second division real.'),
  output([8, 'a', 2, 1], `class Main {
    public static void main(String[] args) {
        int s = 0;
        for (int i = 1; i <= 5; i++) {
            if (i == 3) {
                continue;
            }
            s += i;
        }
        System.out.println(s);
    }
}`, '12', '`continue` skips 3, so the sum is 1 + 2 + 4 + 5.'),
  output([10, 'a', 2, 2], `class Main {
    public static void main(String[] args) {
        String s = "ISC2028";
        int c = 0;
        for (int i = 0; i < s.length(); i++) {
            if (Character.isDigit(s.charAt(i))) {
                c++;
            }
        }
        System.out.println(c + " " + s.substring(0, 3));
    }
}`, '4 ISC'),
  output([9, 'a', 2, 2], `class Box {
    int w;
    Box(int x) {
        w = x;
    }
    int doubled() {
        return w * 2;
    }
}
class Main {
    public static void main(String[] args) {
        Box b = new Box(4);
        b.w = b.doubled() + 1;
        System.out.println(b.doubled());
    }
}`, '18'),
  output([12, 'a', 2, 1], `for i in range(1, 4):
    print(i * i)`, `1
4
9`, undefined, { python: 1, text: 'Write the output of the following Python program.' }),
  theory('error', [8, 'a', 2, 2], 'This loop should print 1 to 5, but something is wrong. Find the error, and correct it.\n```\nint i = 1;\nwhile (i <= 5);\n{\n    System.out.println(i);\n    i++;\n}\n```', ['The semicolon after the `while` condition makes an empty loop body, so the loop never ends.', 'Correction: remove the semicolon.']),
  theory('short', [1, 'a', 2, 1], 'Convert decimal 45 to (a) binary, and (b) octal.', ['(a) 101101', '(b) 55']),
  theory('short', [1, 'a', 2, 2], 'Find the 8-bit two’s complement of 25, and state what it stands for.', ['25 is 00011001. Inverting and adding 1 gives 11100111.', 'It stands for −25.']),
  theory('short', [3, 'a', 2, 1], 'Write the truth table for $p \\Rightarrow q$. When is it false?', ['Rows: TT gives T, TF gives F, FT gives T, FF gives T.', 'It is false only when p is true and q is false.']),
  theory('definition', [5, 'b', 2, 1], 'Distinguish between a syntax error and a logical error, with an example of each.', ['A syntax error breaks the rules of the language, such as a missing semicolon, and is found at compile time.', 'A logical error runs without complaint but gives the wrong result, such as using `+` where `*` was meant.']),
  theory('distinguish', [6, 'a', 2, 1], 'Distinguish between primitive types and reference types, with an example of each.', ['A primitive type holds its value directly, such as `int`.', 'A reference type holds a reference to an object, such as `String`.']),
  theory('complete', [8, 'a', 2, 1], 'Complete the method that returns the factorial of n, by filling in ?1? and ?2?.\n```\nint fact(int n) {\n    int f = ?1?;\n    for (int i = 2; i <= n; i++)\n        ?2?;\n    return f;\n}\n```', ['?1? is `1`.', '?2? is `f = f * i` (or `f *= i`).']),

  // Part II, Section A: ten marks
  theory('short', [1, 'a', 10, 2], 'Show your working. (a) Convert 156 from decimal to binary, octal and hexadecimal. (b) Add the binary numbers 10110 and 01101. (c) Subtract 01001 from 10110 by two’s complement. (d) Convert the hexadecimal number A3 to decimal.', [['Binary: 10011100.', 2], ['Octal: 234.', 1], ['Hexadecimal: 9C.', 1], ['10110 + 01101 = 100011, with the carries shown.', 2], ['Two’s complement of 01001 is 10111.', 1], ['10110 + 10111 = 101101, and dropping the carry gives 01101.', 1], ['A3 = 10 × 16 + 3.', 1], ['This is 163.', 1]]),
  theory('short', [2, 'a', 10, 2], '(a) Compare ASCII, ISCII and Unicode, in terms of bits and languages. (b) What is UTF-8, and why is it popular? (c) What is the ASCII code of "A", and how would you find "D" from it? (d) How many different characters can 8 bits represent?', [['ASCII: 7 bits, for English characters.', 1], ['ISCII: 8 bits, for Indian scripts.', 1], ['Unicode: a code point for the characters of nearly all languages.', 2], ['UTF-8 is a variable-length encoding of Unicode, from one to four bytes.', 2], ['It is compatible with ASCII, and it saves space for English text.', 1], ['"A" is 65.', 1], ['Adding 3 gives 68 for "D".', 1], ['8 bits can represent 256 characters.', 1]]),
  theory('short', [3, 'a', 10, 2], '(a) Verify with a truth table that $\\sim(p \\vee q) \\equiv \\sim p \\wedge \\sim q$. (b) Is $p \\vee \\sim p$ a tautology? Why? (c) Write the converse and contrapositive of "If a number is even, it is divisible by 2". (d) Translate into symbols: "If it is hot and I am free, then I swim". (e) Name the rule that $p \\wedge (q \\vee r) \\equiv (p \\wedge q) \\vee (p \\wedge r)$ illustrates.', [['All four rows are correct.', 2], ['The two columns match, so they are equivalent.', 1], ['Yes, it is a tautology.', 1], ['One of p and ∼p is always true, so the result is always true.', 1], ['Converse: if a number is divisible by 2, it is even.', 1], ['Contrapositive: if a number is not divisible by 2, it is not even.', 1], ['$(h \\wedge f) \\Rightarrow s$.', 2], ['The distributive law.', 1]]),
  theory('short', [3, 'b', 10, 2], '(a) Draw the truth table of a half adder, and name the gates that give its sum and carry. (b) With gates described in words, give the circuit for $F = AB + A\'C$. (c) Why are NAND and NOR called universal gates? (d) Show that a NAND gate with joined inputs acts as a NOT gate.', [['Truth table for the half adder.', 2], ['Sum: XOR gate.', 1], ['Carry: AND gate.', 1], ['Circuit: AND of A and B.', 1], ['AND of NOT A and C, with both fed to an OR gate.', 2], ['Any Boolean function can be built using only that one type of gate.', 1], ['With both inputs A, the output is $(A \\cdot A)\' = A\'$.', 2]]),

  // Part II, Section B: ten marks
  theory('program', [9, 'a', 10, 2], 'Design a class `Student` with the data members `name` and `marks[]` (5 integers). Provide a constructor; `int total()`; `char grade()`, giving A at an average of 80 or more, B at 60 or more, and C otherwise; and `void show()`. Write `main`.', [['Data members and class heading.', 1], ['Constructor assigns both data members.', 1], ['`total` loops over the array.', 2], ['`grade` calculates the average, avoiding integer truncation.', 1], ['Correct `if` chain in `grade`.', 2], ['`show` prints all the details.', 1], ['Correct method headings.', 1], ['`main` creates the object and calls the methods.', 1]], { model: block(`class Student {
    String name;
    int[] marks;
    Student(String n, int[] m) {
        name = n;
        marks = m;
    }
    int total() {
        int t = 0;
        for (int i = 0; i < marks.length; i++) {
            t += marks[i];
        }
        return t;
    }
    char grade() {
        double avg = (double) total() / marks.length;
        if (avg >= 80) {
            return 'A';
        } else if (avg >= 60) {
            return 'B';
        }
        return 'C';
    }
    void show() {
        System.out.println(name + " " + total() + " " + grade());
    }
    public static void main(String[] args) {
        int[] m = {70, 85, 90, 65, 80};
        Student s = new Student("Asha", m);
        s.show();
    }
}`) }),
  theory('program', [10, 'a', 10, 2], 'Write a class with `static int[] bubble(int[] a)`, to sort an array in ascending order by bubble sort, and `static int count(int[] a, int key)`, which counts how often `key` occurs. Write `main`, using a small array of your own.', [['Class and method headings.', 1], ['Outer loop runs length − 1 times.', 1], ['Inner loop bound shrinks with each pass.', 2], ['Compares adjacent elements.', 1], ['Swaps correctly with a temporary variable.', 2], ['`count` loops, tests and counts.', 2], ['`main` calls both methods and prints.', 1]], { model: block(`class ArrayWork {
    static int[] bubble(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            for (int j = 0; j < a.length - 1 - i; j++) {
                if (a[j] > a[j + 1]) {
                    int t = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = t;
                }
            }
        }
        return a;
    }
    static int count(int[] a, int key) {
        int c = 0;
        for (int i = 0; i < a.length; i++) {
            if (a[i] == key) {
                c++;
            }
        }
        return c;
    }
    public static void main(String[] args) {
        int[] d = {5, 2, 9, 2};
        bubble(d);
        System.out.println(d[0] + " " + count(d, 2));
    }
}`) }),
  theory('program', [10, 'a', 10, 3], 'Write a program with `static boolean isPalindrome(String s)`, ignoring case, and `static String initials(String s)`, which returns the first letter of each word in a sentence. Words are separated by single spaces. Write `main` to test them.', [['Method headings.', 1], ['Converts to one case.', 1], ['Compares characters from both ends, or builds the reverse.', 2], ['Returns the correct boolean.', 1], ['`initials` takes the first character.', 1], ['Finds each character after a space.', 2], ['Builds and returns the string.', 1], ['`main` tests both.', 1]], { model: block(`class Words {
    static boolean isPalindrome(String s) {
        String t = s.toLowerCase();
        int i = 0;
        int j = t.length() - 1;
        while (i < j) {
            if (t.charAt(i) != t.charAt(j)) {
                return false;
            }
            i++;
            j--;
        }
        return true;
    }
    static String initials(String s) {
        String r = "" + s.charAt(0);
        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i - 1) == ' ') {
                r = r + s.charAt(i);
            }
        }
        return r;
    }
    public static void main(String[] args) {
        System.out.println(isPalindrome("Level"));
        System.out.println(initials("Indian School Certificate"));
    }
}`) }),
  theory('short', [6, 'a', 10, 2], '(a) Name the wrapper class of `int`, `char` and `double`. (b) Convert the string "45" to an `int`, using a wrapper class. (c) What are autoboxing and unboxing? Give one line of code for each. (d) What is the result of `(char) 66` and `(int) \'A\'`? (e) State the type of `3 + 4.0f`, and the type of `\'a\' + 1`.', [['`Integer`, `Character`, `Double`.', 2], ['`int n = Integer.parseInt("45");`', 1], ['Autoboxing converts a primitive to its wrapper object automatically, as in `Integer a = 5;`.', 2], ['Unboxing is the reverse, as in `int b = a;`.', 1], ['`(char) 66` is `B`.', 1], ['`(int) \'A\'` is 65.', 1], ['`3 + 4.0f` is a `float`.', 1], ['`\'a\' + 1` is an `int`.', 1]]),
  theory('program', [11, 'b', 10, 3], 'Write a program that writes the names of three subjects to a text file, one per line, then reads the file back and prints each line, with its line number. Use `FileWriter`, `PrintWriter`, `FileReader` and `BufferedReader`, and handle exceptions.', [['Imports `java.io.*`.', 1], ['Opens the file with `FileWriter` and `PrintWriter`.', 2], ['Writes the three lines.', 1], ['Closes the writer.', 1], ['Opens it with `FileReader` and `BufferedReader`.', 2], ['Reads until `readLine` returns `null`, keeping a counter.', 2], ['Handles or declares `IOException`.', 1]], { model: block(`import java.io.*;
class Subjects {
    public static void main(String[] args) throws IOException {
        PrintWriter out = new PrintWriter(new FileWriter("subjects.txt"));
        out.println("Physics");
        out.println("Chemistry");
        out.println("Mathematics");
        out.close();
        BufferedReader in = new BufferedReader(new FileReader("subjects.txt"));
        String line;
        int n = 1;
        while ((line = in.readLine()) != null) {
            System.out.println(n + " " + line);
            n++;
        }
        in.close();
    }
}`) }),

  // Part II, Section C: five marks
  theory('short', [12, 'a', 5, 1], 'Using Python: (a) How does a Python variable differ from a Java variable? (b) Write a loop to print the even numbers from 2 to 10. (c) What does `input()` return? (d) What is the value of `7 // 2` and of `7 / 2`?', ['A Python variable has no declared type, and its type follows the value it holds.', '`for i in range(2, 11, 2):` followed by `print(i)`.', '`input()` always returns a string.', '`7 // 2` is 3.', '`7 / 2` is 3.5.'], { python: 1 }),
  theory('short', [12, 'a', 5, 2], 'Write a Python function `is_prime(n)` that returns True if n is prime. Then write the line that calls it, and prints the result for 17.', ['Heading: `def is_prime(n):`.', 'It returns False for n below 2.', 'It loops over candidates from 2 up to n − 1, or up to the square root of n.', 'It returns False if any candidate divides n, and True otherwise.', 'The call: `print(is_prime(17))`.'], { python: 1 }),
  output([12, 'a', 5, 2], `n = 5
t = 1
for i in range(1, n + 1):
    t = t * i
    if i % 2 == 0:
        print(i, t)
print(t)`, `2 2
4 24
120`, undefined, { python: 1, text: 'Write the output of the following Python program.' }),
  theory('short', [13, 'a', 5, 1], 'Briefly explain (a) what is meant by intellectual property, (b) the difference between free software and open source software, (c) what spam is, and (d) what cloud computing is.', ['(a) Creations of the mind, such as software, music and writing, which the law protects.', '(b) Free software stresses the user’s freedom to run and change a program.', 'Open source stresses that the source code is available to read and improve.', '(c) Unwanted messages sent in bulk.', '(d) Using computing services over the internet, rather than on your own machine.']),
  theory('short', [13, 'a', 5, 2], 'State five responsible practices a student should follow when using the internet and software.', ['Do not copy other people’s work without credit.', 'Use only licensed software.', 'Keep passwords private.', 'Respect the privacy of others online.', 'Verify information before sharing it.']),
];

export default questions;
