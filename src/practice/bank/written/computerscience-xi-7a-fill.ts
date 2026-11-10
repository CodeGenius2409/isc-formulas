// Written by hand: variables and expressions, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar, program } = kit('computerscience', 'XI');
const V = at(7, 'a');

const questions: BankDef[] = [
  predict(V(2, 3), 'Predict the value of x after: int x = 5; x += x++ + ++x;', 'x += e means x = x + e, and the old x, 5, is taken first; then x++ gives 5 and ++x gives 7, so e = 12.', 'x = 5 + 12 = 17.'),
  predict(V(2, 2), 'Predict what Java prints for System.out.println(10 + 20 + "AB" + 10 + 20);', '+ works left to right: 10 + 20 is added first, giving 30, then joined to "AB".', 'After that each number is joined as text, so it prints 30AB1020.'),
  predict(V(2, 2), 'Predict the value of r, and whether there is an error, after: boolean r = (5 > 3) || (10 / 0 > 1);', '5 > 3 is true, so || already knows the answer and skips the right side.', 'r is true, and the division by zero is never done, so there is no error.'),

  odd(V(2, 1), ['+', '*', '%', '&&'], '&&', 'It is a logical operator; the other three are arithmetic.'),
  odd(V(2, 1), ['x = x + 1', 'x += 1', 'x++', 'x = 1'], 'x = 1', 'It sets x to 1; each of the others adds 1 to x.'),
  odd(V(2, 2), ['total', '_count', '$sum', '2ndValue'], '2ndValue', 'It starts with a digit, so it can’t be a variable name; the others are valid identifiers.'),

  long(V(6, 2), 'With int a = 6, b = 4, c = 3, evaluate each expression, taking each from these starting values.\n(a) a + b * c [1]\n(b) a / b * c, and say why it is not 6 / 12 [2]\n(c) a % b + c * 2 [1]\n(d) a > b && b > c || c > a [1]\n(e) ++a * b--, and give a and b afterwards [1]', '(a) b * c first: 6 + 12 = 18.', '(b) / and * have the same precedence and work left to right: 6 / 4 = 1, then 1 × 3 = 3.', '(b) It is not 6 / 12 because associativity is left to right, not right to left.', '(c) 6 % 4 = 2, and 3 × 2 = 6, so 8.', '(d) true && true is true, so the whole is true without needing c > a.', '(e) 7 × 4 = 28; afterwards a = 7 and b = 3.'),
  long(V(5, 1), 'Answer each part on named constants.\n(a) What is a named constant? Declare one for a tax rate of 18%. [2]\n(b) What happens if a later statement tries to give it a new value? [1]\n(c) Give two advantages of using named constants. [2]', '(a) A variable declared final, whose value can’t change once set.', '(a) final double TAX_RATE = 0.18;', '(b) The program doesn’t compile: a final variable can’t be assigned again.', '(c) The value is changed in one place only, if it ever has to change.', '(c) A name such as TAX_RATE says what the number means, and the compiler stops it being changed by mistake.'),
  long(V(6, 3), 'Answer each part on assignment.\n(a) Which of these are valid, and why: 5 = x; x + 1 = y; x = y = 3; [3]\n(b) With byte b = 10;, b += 5; compiles but b = b + 5; doesn’t. Why? [2]\n(c) What is x after x = y = 3;? [1]', '(a) 5 = x is invalid: the left side must be a variable, which can hold a value.', '(a) x + 1 = y is invalid for the same reason: the left side is an expression.', '(a) x = y = 3 is valid: = works right to left, so 3 goes to y, and then y’s value to x.', '(b) b + 5 is worked out as an int, which can’t be stored in a byte without a cast.', '(b) b += 5 includes the cast to byte, so it compiles.', '(c) x is 3.'),

  tell(V(2, 1), 'Distinguish between / and % when both operands are ints.', '/ gives the quotient with the fraction dropped: 17 / 5 is 3.', '% gives the remainder: 17 % 5 is 2.'),
  tell(V(2, 1), 'Distinguish between a variable and a named constant.', 'A variable’s value can be changed by assignment as the program runs.', 'A named constant is declared final, and its value can’t change after it is set.'),
  tell(V(2, 2), 'Distinguish between precedence and associativity.', 'Precedence decides which of two different operators acts first, as * before +.', 'Associativity decides the order for operators of the same precedence, as left to right for / and *.'),

  match(V(4, 2), [['7 / 3', '2'], ['7 % 3', '1'], ['7 * 3', '21'], ['(double) 7 / 3', '2.333…']]),
  match(V(4, 1), [['%', 'arithmetic'], ['>=', 'relational'], ['!', 'logical'], ['+=', 'compound assignment']]),
  match(V(4, 2), [['int x = 10; x %= 4;', '2'], ['int x = 10; x /= 3;', '3'], ['int x = 10; x *= 2 + 3;', '50'], ['int x = 10; x -= x - 1;', '1']]),

  reason(V(2, 1), 'Why does 1 / 3 + 1 / 3 + 1 / 3 give 0 in Java?', 'Each 1 / 3 divides two ints, so the fraction is dropped and it is 0.', 'So the sum is 0 + 0 + 0 = 0.'),
  reason(V(2, 2), 'Why should == not be used to test whether two doubles from calculations are equal?', 'Most decimal fractions can’t be stored exactly, so calculations leave tiny rounding errors.', 'Two values that should be equal may differ slightly, so == can give false; testing whether their difference is very small is safer.'),
  reason(V(2, 1), 'Why must a local variable be given a value before it is used in an expression?', 'A local variable has no default value.', 'So the compiler refuses to use it until it has been assigned.'),

  short(V(2, 1), 'Write the Java expression for (a + b)² ÷ 2ab.', '(a + b) * (a + b) for the square, as Java has no ² operator.', 'Divided by (2 * a * b), with the brackets, so the whole product divides: (a + b) * (a + b) / (2 * a * b).'),
  short(V(2, 2), 'Evaluate 5 + 4 * 3 % 5 - 2 in Java.', '* and % have the same precedence and work left to right: 4 * 3 = 12, then 12 % 5 = 2.', '5 + 2 - 2 = 5.'),
  short(V(2, 2), 'After int x = 4; int y = x++ * 2 + --x;, what are x and y?', 'x++ gives 4 and makes x 5, so x++ * 2 = 8; then --x makes x 4 and gives 4.', 'y = 8 + 4 = 12, and x = 4.'),

  ar(V(1, 2), "'A' + 1 gives 66 in Java.", 'Arithmetic on a char uses its Unicode value.', 1, "'A' is 65, so 'A' + 1 is the int 66."),
  ar(V(1, 2), 'x = x + 1 can be written as x += 1.', 'Assignment operators have lower precedence than +.', 2, 'Both are true, but x += 1 means x = x + 1 by definition, not because of precedence.'),
  ar(V(1, 1), 'A final variable can be changed by a later assignment.', 'final marks a variable as a named constant.', 4, 'A final variable can’t be assigned again once it has a value.'),

  program(V(5, 1), 'Write a program that reads the radius of a circle and prints its area and its circumference. Use a named constant for π, 3.14159.', [['final double PI = 3.14159; declared as a named constant.', 1], ['The radius is read with a Scanner, as a double.', 1], ['area = PI * r * r.', 1], ['circumference = 2 * PI * r.', 1], ['Both are printed with labels.', 1]], '```\nimport java.util.Scanner;\n\nclass Circle {\n  public static void main(String[] args) {\n    final double PI = 3.14159;\n    Scanner in = new Scanner(System.in);\n    double r = in.nextDouble();\n    double area = PI * r * r;\n    double circumference = 2 * PI * r;\n    System.out.println("Area = " + area);\n    System.out.println("Circumference = " + circumference);\n  }\n}\n```'),
  program(V(5, 2), 'Write a program that reads a number of seconds, and prints it as hours, minutes and seconds, using / and %.', [['The seconds are read as an int.', 1], ['hours = total / 3600.', 1], ['minutes = (total % 3600) / 60.', 1], ['seconds = total % 60.', 1], ['All three are printed.', 1]], '```\nimport java.util.Scanner;\n\nclass Clock {\n  public static void main(String[] args) {\n    Scanner in = new Scanner(System.in);\n    int total = in.nextInt();\n    int hours = total / 3600;\n    int minutes = (total % 3600) / 60;\n    int seconds = total % 60;\n    System.out.println(hours + " h " + minutes + " min " + seconds + " s");\n  }\n}\n```'),
  program(V(5, 2), 'Write a program that reads a temperature in degrees Celsius as an int, and prints it in Fahrenheit, F = 9C/5 + 32, worked out correctly as a double. Also print 9 / 5 * c + 32, and in a comment say why it differs.', [['The temperature is read as an int.', 1], ['9.0 / 5 * c + 32, or a cast, so the division keeps its fraction.', 2], ['9 / 5 * c + 32 is printed too.', 1], ['A comment says 9 / 5 is int division, giving 1, so that answer is wrong.', 1]], '```\nimport java.util.Scanner;\n\nclass Temperature {\n  public static void main(String[] args) {\n    Scanner in = new Scanner(System.in);\n    int c = in.nextInt();\n    double f = 9.0 / 5 * c + 32;\n    System.out.println("Fahrenheit: " + f);\n    // 9 / 5 divides two ints, giving 1, so this is c + 32: wrong.\n    System.out.println("With int division: " + (9 / 5 * c + 32));\n  }\n}\n```'),
];

export default questions;
