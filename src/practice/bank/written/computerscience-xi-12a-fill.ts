// Written by hand: introduction to Python, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, tell, match, reason, short, ar } = kit('computerscience', 'XI');
const Y = at(12, 'a');

const questions: BankDef[] = [
  predict(Y(2, 1), 'Predict the output of this Python code, and explain it.\n```\nfor i in range(1, 10, 3):\n    print(i, end=" ")\n```', 'It prints 1 4 7.', 'range(1, 10, 3) starts at 1 and goes up in steps of 3, stopping before 10.'),
  predict(Y(2, 1), 'Predict the output of this Python code, and explain it.\n```\nx = 5\nx = "five"\nprint(type(x))\n```', 'It prints <class \'str\'>.', 'A Python variable takes the type of whatever value it last held, here a string.'),
  predict(Y(2, 3), 'Predict the output of this Python code, and explain it.\n```\nfor i in range(3):\n    for j in range(3):\n        if j == i:\n            break\n        print(i, j)\n```', 'It prints 1 0, then 2 0, then 2 1, on separate lines.', 'For each i, the inner loop prints i and j until j reaches i, where break ends the inner loop; for i = 0 it breaks at once.'),

  odd(Y(2, 1), ['int', 'float', 'str', 'for'], 'for', 'It is a keyword for a loop; the others are data types.'),
  odd(Y(2, 1), ['//', '%', '**', 'and'], 'and', 'It is a logical operator; the others are arithmetic operators.'),
  odd(Y(2, 1), ['if', 'elif', 'else', 'while'], 'while', 'It starts a loop; the others are used in conditional statements.'),

  tell(Y(2, 1), 'Distinguish between break and continue in a Python loop.', 'break ends the loop at once, and the program goes on after it.', 'continue skips the rest of the current turn, and the loop goes on with its next turn.'),
  tell(Y(2, 1), 'Distinguish between the operators / and // in Python, with 9 and 2 as an example.', '/ is true division, and always gives a float: 9 / 2 is 4.5.', '// is floor division, and rounds the quotient down: 9 // 2 is 4.'),
  tell(Y(2, 1), 'Distinguish between a for loop and a while loop in Python.', 'A for loop runs once for each item of a sequence, such as range(5), so the number of turns is known.', 'A while loop runs as long as its condition is true, so it suits loops whose number of turns isn’t known.'),

  match(Y(4, 1), [['20 // 6', '3'], ['20 % 6', '2'], ['3 ** 3', '27'], ['9 / 2', '4.5']]),
  match(Y(4, 1), [['range(5)', '0, 1, 2, 3, 4'], ['range(2, 6)', '2, 3, 4, 5'], ['range(1, 10, 4)', '1, 5, 9'], ['range(5, 0, -2)', '5, 3, 1']]),
  match(Y(4, 1), [['elif', 'tests another condition after if'], ['break', 'leaves the loop at once'], ['continue', 'goes straight to the next turn of the loop'], ['pass', 'does nothing, as a placeholder']]),

  reason(Y(2, 1), 'Why must input() usually be wrapped in int() to read a number?', 'input() always returns what was typed as a string.', 'int() turns that string into a whole number, so it can be used in arithmetic.'),
  reason(Y(2, 1), 'Why can a while loop run for ever?', 'It repeats as long as its condition stays true.', 'If nothing inside the loop ever makes the condition false, it never stops.'),
  reason(Y(2, 2), 'Why does 0.1 + 0.2 == 0.3 give False in Python?', 'Floats are stored in binary, and 0.1, 0.2 and 0.3 can’t be stored exactly.', 'The sum comes out as 0.30000000000000004, which isn’t equal to the stored 0.3.'),

  short(Y(2, 1), 'Write a Python loop that prints the table of 7, from 7 × 1 to 7 × 10.', 'A for loop over range(1, 11) gives i from 1 to 10.', 'Each turn prints the line with print(7, "x", i, "=", 7 * i).'),
  short(Y(2, 1), 'Write Python code that prints positive, negative or zero for a number n.', 'if n > 0 prints "positive", and elif n < 0 prints "negative".', 'else prints "zero", the only case left.'),
  short(Y(2, 2), 'Predict what this Python code prints, and say what it does.\n```\nn = 12345\ns = 0\nwhile n > 0:\n    s += n % 10\n    n //= 10\nprint(s)\n```', 'It prints 15.', 'Each turn adds the last digit, n % 10, to s and drops it with n //= 10, so it adds up the digits: 1 + 2 + 3 + 4 + 5.'),

  ar(Y(1, 1), 'In Python, range(5) doesn’t include 5.', 'range stops just before its end value.', 1, 'So range(5) gives 0, 1, 2, 3 and 4.'),
  ar(Y(1, 1), 'Python needs every variable’s type to be declared.', 'Python works out a variable’s type from the value given to it.', 4, 'No declaration is needed: assigning a value creates the variable.'),
  ar(Y(1, 1), '2 ** 3 gives 8 in Python.', 'Python uses indentation to mark blocks of code.', 2, 'Both are true, but ** gives 8 because it raises 2 to the power 3.'),
];

export default questions;
