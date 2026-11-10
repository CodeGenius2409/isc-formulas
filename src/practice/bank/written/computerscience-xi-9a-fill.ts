// Written by hand: methods and constructors, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar } = kit('computerscience', 'XI');
const M = at(9, 'a');

const questions: BankDef[] = [
  predict(M(2, 1), 'Predict the output, and explain it.\n```\nstatic void change(int x) {\n  x = x * 2;\n}\n// in main:\nint a = 5;\nchange(a);\nSystem.out.println(a);\n```', 'It prints 5.', 'The method gets a copy of a’s value in x; doubling x leaves a unchanged.'),
  predict(M(2, 2), 'Predict what this prints, and correct the constructor.\n```\nclass P {\n  int n;\n  P(int n) {\n    n = n;\n  }\n}\n// in main:\nSystem.out.println(new P(7).n);\n```', 'It prints 0: inside the constructor, n means the parameter, so n = n gives the parameter its own value, and the field keeps its default 0.', 'The constructor should say this.n = n;, which sets the field to 7.'),
  predict(M(2, 2), 'Predict the output, and say which method each call uses.\n```\nstatic int f(int x) {\n  return x + 1;\n}\nstatic double f(double x) {\n  return x * 2;\n}\n// in main:\nSystem.out.println(f(3) + " " + f(3.0));\n```', 'It prints 4 6.0.', 'f(3) has an int argument, so it calls f(int); f(3.0) has a double, so it calls f(double).'),

  odd(M(2, 1), ['a constructor', 'void show()', 'int sum(int a, int b)', 'static double area(double r)'], 'a constructor', 'It has no return type, not even void; the others are methods with return types.'),
  odd(M(2, 2), ['Math.sqrt()', 'Math.max()', 'Integer.parseInt()', 's.length()'], 's.length()', 'It is an instance method, called on a String object; the others are static, called on the class.'),
  odd(M(2, 2), ['changing an instance variable', 'printing a line', 'changing a static variable', 'returning a value'], 'returning a value', 'It isn’t a side effect; the others change something outside the method.'),

  long(M(5, 2), 'Answer each part on constructors.\n(a) What is a default constructor, and when does Java supply one? [2]\n(b) Write a constructor for a class Point, with fields int x and int y, that takes two parameters named x and y. [2]\n(c) Why is this needed in your constructor? [1]', '(a) A constructor with no parameters, which gives the fields their default values.', '(a) Java supplies one only when the class defines no constructor of its own.', '(b) Point(int x, int y) { this.x = x; this.y = y; }', '(b) It has the class’s name and no return type.', '(c) The parameters have the same names as the fields and hide them, so this.x names the field.'),
  long(M(5, 2), 'Answer each part on a method for a quadratic equation.\n(a) Write a method void roots(double a, double b, double c) that prints the real roots of ax² + bx + c = 0, or says it has none. [3]\n(b) Name its formal arguments, and write a call with actual arguments for x² − 5x + 6 = 0. [1]\n(c) What does that call print? [1]', '(a) It works out d = b * b − 4 * a * c.', '(a) If d < 0 it prints that there are no real roots.', '(a) Otherwise it prints (−b + Math.sqrt(d)) / (2 * a) and (−b − Math.sqrt(d)) / (2 * a).', '(b) a, b and c are the formal arguments; roots(1, −5, 6) is the call, with actual arguments 1, −5 and 6.', '(c) d = 25 − 24 = 1, so it prints the roots 3.0 and 2.0.'),
  long(M(5, 2), 'Answer each part on number methods.\n(a) Write a method int sumDigits(int n) that returns the sum of the digits of n. [3]\n(b) Use it in a method boolean isNiven(int n), true when n is divisible by the sum of its digits. Is 18 a Niven number? [2]', '(a) A variable s starts at 0.', '(a) While n > 0: s = s + n % 10 and n = n / 10.', '(a) The method returns s.', '(b) return n % sumDigits(n) == 0;', '(b) The digits of 18 add up to 9, and 18 % 9 = 0, so it is a Niven number.'),

  tell(M(2, 1), 'Distinguish between formal and actual arguments.', 'Formal arguments are the variables named in the method’s heading, which receive the values.', 'Actual arguments are the values or variables given in the call, which are passed to them.'),
  tell(M(2, 1), 'Distinguish between a static variable and an instance variable.', 'A static variable belongs to the class: there is one copy, shared by every object.', 'An instance variable belongs to each object: every object has its own copy.'),
  tell(M(2, 2), 'Distinguish between a pure method and an impure method, with an example of each.', 'A pure method changes nothing outside itself and only returns a value, such as int square(int n).', 'An impure method has a side effect, changing an object’s state, such as void deposit(double amt), which changes the balance.'),

  match(M(4, 1), [['void', 'the method returns no value'], ['static', 'the method belongs to the class'], ['this', 'the object the method was called on'], ['return', 'sends a value back to the caller']]),
  match(M(4, 1), [['Formal argument', 'a variable in the method’s heading'], ['Actual argument', 'a value given in the call'], ['Method signature', 'the name and the parameter list'], ['Return type', 'the type of the value sent back']]),
  match(M(4, 2), [['Point() { x = 0; y = 0; }', 'a constructor with no parameters'], ['Point(int a, int b) { x = a; y = b; }', 'a parameterised constructor'], ['static int square(int n)', 'a static method'], ['void move(int d) { x += d; }', 'an impure method changing the object']]),

  reason(M(2, 1), 'Why does a constructor have no return type?', 'It isn’t called to work out a value; it runs when new makes an object, to set the object up.', 'new itself gives back the object, so the constructor has nothing to return.'),
  reason(M(2, 1), 'Why is a large program broken up into methods?', 'Each method does one job, so it can be written, tested and understood on its own.', 'A method can be called wherever its job is needed, so its code isn’t written again.'),
  reason(M(2, 2), 'Why must every path through a method that isn’t void end in a return statement?', 'The caller expects a value of the return type whenever the method finishes.', 'So the compiler rejects a method that could reach its end without returning one.'),

  short(M(2, 1), 'Write the heading of a method average that takes three int values and returns their average as a double. Name the parts of the heading.', 'double average(int a, int b, int c)', 'double is the return type, average the name, and a, b and c the formal arguments.'),
  short(M(2, 1), 'What is method overloading? Give two headings that overload one name.', 'Two or more methods in a class with the same name but different parameter lists.', 'For example, int area(int side) and int area(int l, int b).'),
  short(M(2, 2), 'Give two uses of the keyword this.', 'To name a field when a parameter or local variable of the same name hides it, as this.x = x.', 'To call another constructor of the same class from a constructor, as this(0, 0).'),

  ar(M(1, 1), 'A class can have more than one constructor.', 'The compiler tells constructors apart by their parameter lists.', 1, 'Constructors can be overloaded, like methods.'),
  ar(M(1, 2), 'A static method can use instance variables directly.', 'A static method belongs to the class, not to an object.', 4, 'With no object, there are no instance variables for it to use.'),
  ar(M(1, 2), 'A void method can contain a return statement.', 'A method can have more than one parameter.', 2, 'Both are true, but a plain return; in a void method just ends it, which has nothing to do with parameters.'),
];

export default questions;
