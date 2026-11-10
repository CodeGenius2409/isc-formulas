// Written by hand: recursion, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar } = kit('computerscience', 'XII');
const R = at(5, 'a');

const questions: BankDef[] = [
  predict(R(2, 1), 'Predict what f(3) prints, and what it would print if the two statements inside the if were swapped.\n```\nvoid f(int n) {\n  if (n > 0) {\n    System.out.print(n + " ");\n    f(n - 1);\n  }\n}\n```', 'As written, it prints 3 2 1, each value printed before the call goes deeper.', 'Swapped, it prints 1 2 3, as each print waits until the deeper call has returned.'),
  predict(R(2, 2), 'Predict the value of g(7), showing the calls.\n```\nint g(int n) {\n  if (n <= 1)\n    return 1;\n  return n + g(n - 2);\n}\n```', 'g(7) = 7 + g(5) = 7 + 5 + g(3) = 7 + 5 + 3 + g(1).', 'g(1) = 1, so g(7) = 16.'),
  predict(R(2, 2), 'Predict the value of gcd(48, 18), and how many times gcd is called.\n```\nint gcd(int a, int b) {\n  if (b == 0)\n    return a;\n  return gcd(b, a % b);\n}\n```', 'The calls are gcd(48, 18), gcd(18, 12), gcd(12, 6) and gcd(6, 0).', 'So it returns 6, after 4 calls.'),

  odd(R(2, 1), ['finding a factorial', 'finding a GCD by Euclid’s method', 'binary search', 'adding up an array with a for loop'], 'adding up an array with a for loop', 'It is iteration; the other three are the syllabus’s examples of problems solved by recursion.'),
  odd(R(2, 1), ['a base case', 'a recursive call', 'a smaller problem in each call', 'a static counter variable'], 'a static counter variable', 'A recursive method doesn’t need one; it needs the other three to work and to stop.'),
  odd(R(2, 2), ['fact(3)', 'sumDigits(123)', 'gcd(12, 18)', 'power(2, 3)'], 'power(2, 3)', 'It is 8; the other three are all 6.'),

  long(R(5, 1), 'Answer each part on a recursive factorial.\n(a) Write a recursive method long fact(int n). [2]\n(b) Show the calls and the values returned when fact(4) is worked out. [2]\n(c) What happens if fact(-1) is called, and why? [1]', '(a) if (n == 0) return 1;', '(a) return n * fact(n - 1);', '(b) fact(4) calls fact(3), fact(2), fact(1) and fact(0), which returns 1.', '(b) Returning: fact(1) = 1, fact(2) = 2, fact(3) = 6 and fact(4) = 24.', '(c) n goes −2, −3, … and never reaches 0, so the calls never stop and the program ends with a StackOverflowError.'),
  long(R(5, 2), 'Answer each part on changing a number to binary.\n(a) Write a recursive method void toBinary(int n) that prints n in binary, using no loop. [3]\n(b) Trace toBinary(6), showing the order in which the digits are printed. [2]', '(a) The method does nothing when n is 0, the base case.', '(a) Otherwise it first calls toBinary(n / 2).', '(a) Then it prints n % 2, after the call returns.', '(b) toBinary(6) calls toBinary(3), which calls toBinary(1), which calls toBinary(0).', '(b) As they return, toBinary(1) prints 1, toBinary(3) prints 1 and toBinary(6) prints 0, giving 110.'),
  long(R(5, 3), 'Answer each part on working out xⁿ.\n(a) Write a recursive method int power(int x, int n) using xⁿ = x × xⁿ⁻¹. [2]\n(b) Write a faster version that works out p = power(x, n / 2) once, and returns p × p, or x × p × p when n is odd. [2]\n(c) How many calls does each make for n = 8? [1]', '(a) if (n == 0) return 1;', '(a) return x * power(x, n - 1);', '(b) if (n == 0) return 1; int p = power(x, n / 2);', '(b) if (n % 2 == 0) return p * p; else return x * p * p;', '(c) The first makes 9 calls, for n = 8 down to 0; the second makes 5, for n = 8, 4, 2, 1 and 0.'),

  tell(R(2, 1), 'Distinguish between direct and indirect recursion.', 'In direct recursion a method calls itself, as fact calls fact.', 'In indirect recursion a method calls another method, which in turn calls the first, as a calls b and b calls a.'),
  tell(R(2, 1), 'Distinguish between the base case and the recursive case of a recursive method.', 'The base case is the simplest input, answered at once with no further call.', 'The recursive case answers a larger input by calling the method on a smaller one.'),
  tell(R(2, 2), 'Distinguish between the winding and unwinding phases of a recursion.', 'While winding, each call makes a deeper call, and the frames pile up on the stack until the base case is reached.', 'While unwinding, the calls return one by one in reverse order, each finishing the work after its recursive call.'),

  match(R(4, 1), [['fact(0)', '1'], ['gcd(9, 6)', '3'], ['sumDigits(321)', '6'], ['power(3, 2)', '9']]),
  match(R(4, 2), [['return n * f(n - 1);', 'factorial'], ['return f(b, a % b);', 'GCD'], ['return n % 10 + f(n / 10);', 'sum of digits'], ['f(n / 2); System.out.print(n % 2);', 'binary of n']]),
  match(R(4, 2), [['The call stack', 'holds a frame for each call not yet finished'], ['A StackOverflowError', 'too many calls without returning'], ['Winding', 'calls going deeper towards the base case'], ['Unwinding', 'calls returning one by one']]),

  reason(R(2, 1), 'Why must each recursive call work on a smaller problem than the call that made it?', 'Only then do the calls move towards the base case.', 'If the problem doesn’t shrink, the base case is never reached and the calls go on until the stack overflows.'),
  reason(R(2, 2), 'Why can a recursive method print the digits of a number in their own order, though n % 10 gives the last digit first?', 'It calls itself on n / 10 first, and prints n % 10 only after that call returns.', 'So the leading digits, handled by the deeper calls, are printed first, as the calls unwind.'),
  reason(R(2, 1), 'Why does binary search suit recursion?', 'Each step does the same thing as the whole search: compare with the middle item.', 'Then it searches one half, which is the same problem on a smaller part of the array.'),

  short(R(2, 1), 'Write a recursive method int count(int n) that returns the number of digits of a positive number n.', 'if (n < 10) return 1;', 'return 1 + count(n / 10);'),
  short(R(2, 1), 'Write a recursive method int sum(int n) that returns 1 + 2 + … + n.', 'if (n == 0) return 0;', 'return n + sum(n - 1);'),

  ar(R(1, 2), 'gcd(a, b) = gcd(b, a % b), with a, b > 0, always reaches b = 0 in the end.', 'a % b is always less than b.', 1, 'So the second argument falls with every call, and a falling run of whole numbers must reach 0.'),
  ar(R(1, 2), 'Every recursive method can be written with a loop instead.', 'Recursion always runs faster than a loop.', 3, 'Recursion is usually slower, as each call costs time to set up a stack frame.'),
];

export default questions;
