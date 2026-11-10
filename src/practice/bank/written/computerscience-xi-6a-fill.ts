// Written by hand: primitive types, wrapper classes and casting, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar, program } = kit('computerscience', 'XI');
const T = at(6, 'a');

const questions: BankDef[] = [
  predict(T(2, 1), 'Predict the output, and explain it.\n```\nint a = 7;\ndouble d = a / 2;\nSystem.out.println(d);\n```', 'It prints 3.0.', 'a / 2 divides two ints, giving 3, and only then is 3 widened to the double 3.0.'),
  predict(T(2, 2), 'Predict the output, and explain it.\n```\nbyte b = (byte) 130;\nSystem.out.println(b);\n```', 'It prints −126.', 'A byte holds only −128 to 127, so the cast keeps the low 8 bits, and 130 − 256 = −126.'),
  predict(T(2, 2), 'Predict the output of both lines, and explain why they differ.\n```\nchar c = \'A\';\nc += 2;\nSystem.out.println(c);\nSystem.out.println(\'A\' + 2);\n```', 'The first prints C: += casts the result back to char, and 65 + 2 = 67 is the code of C.', 'The second prints 67: \'A\' + 2 is an int expression, so its int value is printed.'),

  odd(T(2, 1), ['byte', 'short', 'int', 'float'], 'float', 'It holds numbers with a fractional part; the others are integer types.'),
  odd(T(2, 1), ['Integer', 'Double', 'Character', 'String'], 'String', 'It isn’t a wrapper class; the others wrap int, double and char.'),
  odd(T(2, 2), ['int to long', 'float to double', 'char to int', 'double to int'], 'double to int', 'It is a narrowing conversion that needs a cast; the others are widening, done automatically.'),

  long(T(5, 1), 'Answer each part on primitive types.\n(a) Group the eight primitive types of Java into integer, floating-point, character and boolean types. [2]\n(b) Give the size and range of byte. [1]\n(c) Why does a char take 16 bits in Java? [1]\n(d) Write a literal of type long and one of type float. [1]', '(a) Integer: byte, short, int and long.', '(a) Floating-point: float and double; character: char; boolean: boolean.', '(b) 8 bits, from −128 to 127.', '(c) It holds a Unicode character, and 16 bits allow the characters of many languages.', '(d) 25L and 2.5f.'),
  long(T(5, 2), 'Answer each part on conversions in expressions.\n(a) Give the value and type of 5 + 2.0, \'a\' + 1, 10 / 4 and (float) 10 / 4. [2]\n(b) Why does int x = 3.5; fail to compile, and how is it put right? [2]\n(c) What does (int) \'z\' give? [1]', '(a) 7.0, a double, and 98, an int.', '(a) 2, an int, and 2.5, a float.', '(b) 3.5 is a double, and Java won’t narrow a double to an int without being told.', '(b) int x = (int) 3.5; which gives 3.', '(c) 122, the Unicode code of z.'),

  tell(T(2, 1), 'Distinguish between float and double.', 'A float takes 32 bits and keeps about 7 significant digits; its literals end in f.', 'A double takes 64 bits and keeps about 15 significant digits; a decimal literal is a double unless marked otherwise.'),
  tell(T(2, 1), 'Distinguish between char and String.', 'A char is a primitive type holding one 16-bit character, written in single quotes, as \'A\'.', 'A String is an object holding a sequence of characters, written in double quotes, as "A".'),

  match(T(4, 1), [['int', 'Integer'], ['char', 'Character'], ['boolean', 'Boolean'], ['double', 'Double']]),
  match(T(4, 1), [['An int field', '0'], ['A double field', '0.0'], ['A boolean field', 'false'], ['A char field', 'the character with code 0']]),
  match(T(4, 2), [['(int) 9.99', '9'], ['(char) 66', 'B'], ['(double) 7 / 2', '3.5'], ['(int) -4.7', '-4']]),

  reason(T(2, 1), 'Why does float f = 3.14; fail to compile?', '3.14 is a double literal, and putting a double into a float is narrowing.', 'It must be written 3.14f, or cast with (float).'),
  reason(T(2, 1), 'Why is a class called a user-defined type?', 'The programmer writes the class, choosing its fields and methods.', 'Variables can then be declared of that class type, to refer to its objects, just as int is used for whole numbers.'),
  reason(T(2, 1), 'Why does 1 / 2 give 0, but 1.0 / 2 give 0.5?', '1 / 2 divides two ints, so the fractional part is dropped.', 'In 1.0 / 2 the 2 is promoted to a double, so the division keeps the fraction.'),

  short(T(2, 1), 'Write statements to change the String "3.75" into a double, and the int 42 into a String.', 'double d = Double.parseDouble("3.75");', 'String s = Integer.toString(42); or String.valueOf(42).'),
  short(T(2, 2), 'Give the value and type of each: (a) 5 / 2 * 2.0 (b) \'x\' + \'y\'', '(a) 5 / 2 is the int 2, and 2 * 2.0 gives the double 4.0.', '(b) The chars are promoted to int: 120 + 121 = 241, an int.'),
  short(T(2, 1), 'Use the wrapper class Integer to give the largest and smallest values an int can hold.', 'Integer.MAX_VALUE, which is 2147483647.', 'Integer.MIN_VALUE, which is −2147483648.'),

  ar(T(1, 2), 'long n = 2147483648; doesn’t compile.', 'A whole-number literal with no L is an int, and 2147483648 is too large for an int.', 1, 'Writing 2147483648L makes it a long literal, which compiles.'),
  ar(T(1, 1), '(int) 3.99 gives 4.', 'Casting a double to an int drops its fractional part.', 4, 'The fraction is dropped, not rounded, so the result is 3.'),
  ar(T(1, 2), 'A char can be assigned to an int with no cast.', 'A char literal is written in single quotes.', 2, 'Both are true, but the assignment works because char to int is a widening conversion.'),

  program(T(5, 1), 'Write a program that reads one character, and prints its Unicode code, the character after it, and whether it is an uppercase letter, using casts where needed.', [['The character is read with next().charAt(0).', 1], ['Its code is found by assigning it to an int.', 1], ['The next character is (char) (c + 1).', 1], ['An if tests c >= \'A\' && c <= \'Z\'.', 1], ['All three results are printed.', 1]], '```\nimport java.util.Scanner;\n\nclass CharCode {\n  public static void main(String[] args) {\n    Scanner in = new Scanner(System.in);\n    char c = in.next().charAt(0);\n    int code = c;\n    char next = (char) (c + 1);\n    System.out.println("Code: " + code);\n    System.out.println("Next character: " + next);\n    if (c >= \'A\' && c <= \'Z\')\n      System.out.println("Uppercase letter");\n    else\n      System.out.println("Not an uppercase letter");\n  }\n}\n```'),
  program(T(5, 2), 'Write a program that reads two ints and prints their average three ways: with int division, exactly as a double using a cast, and rounded to the nearest whole number.', [['Two ints are read.', 1], ['(a + b) / 2 gives the int average.', 1], ['(double) (a + b) / 2 gives the exact average.', 1], ['Math.round of the exact average gives the rounded one.', 1], ['All three are printed with labels.', 1]], '```\nimport java.util.Scanner;\n\nclass Average {\n  public static void main(String[] args) {\n    Scanner in = new Scanner(System.in);\n    int a = in.nextInt();\n    int b = in.nextInt();\n    int whole = (a + b) / 2;\n    double exact = (double) (a + b) / 2;\n    long rounded = Math.round(exact);\n    System.out.println("Integer average: " + whole);\n    System.out.println("Exact average: " + exact);\n    System.out.println("Rounded: " + rounded);\n  }\n}\n```'),
  program(T(5, 3), 'Write a program that reads a word and prints it with every letter moved three places on in the alphabet, wrapping round from z to a, keeping its case. Other characters stay as they are. Use char arithmetic and casts.', [['The word is read, and each character taken with charAt in a loop.', 1], ['Lowercase letters become (char) (\'a\' + (c - \'a\' + 3) % 26).', 1], ['Uppercase letters are shifted in the same way from \'A\'.', 1], ['Other characters are left unchanged.', 1], ['The new word is built up and printed.', 1]], '```\nimport java.util.Scanner;\n\nclass Shift {\n  public static void main(String[] args) {\n    Scanner in = new Scanner(System.in);\n    String word = in.next();\n    String out = "";\n    for (int i = 0; i < word.length(); i++) {\n      char c = word.charAt(i);\n      if (c >= \'a\' && c <= \'z\')\n        c = (char) (\'a\' + (c - \'a\' + 3) % 26);\n      else if (c >= \'A\' && c <= \'Z\')\n        c = (char) (\'A\' + (c - \'A\' + 3) % 26);\n      out = out + c;\n    }\n    System.out.println(out);\n  }\n}\n```'),
];

export default questions;
