// Computer Science, Class XI. Java answers come from running the program, and conversions and logic are computed.
import { classify, truthColumn } from '../../practice/gen/boolean';
import type { Gen } from '../../practice/gen/gen';
import { complete, designClass, findError, inMain, outputOf, pyList, pySlice, SHORT_WORDS, withMethods } from './cs-common';
import { derivationBlueprints } from '../derivations';
import KNOWLEDGE from './knowledge/computerscience-xi';
import { blueprintsFor } from './dsl';
import type { Blueprint, Body, OutputBody } from './types';

const { custom, facts, rest } = blueprintsFor('computerscience', 'XI', KNOWLEDGE);

const fence = (code: string) => `\`\`\`\n${code}\n\`\`\``;

const BASES: [number, string][] = [[2, 'binary'], [8, 'octal'], [16, 'hexadecimal']];

function convertQuestion(g: Gen, marks: 1 | 2): Body {
  const value = g.int(10, 255);
  const [base, name] = g.pick(BASES);
  const shown = value.toString(base).toUpperCase();
  const direction = g.chance(0.5);
  if (marks === 1) {
    const [question, right] = direction ? [`The decimal number ${value} in ${name} is:`, shown] : [`The ${name} number ${shown} in decimal is:`, String(value)];
    const reversed = [...shown].reverse().join('');
    const slips: [string, string][] = direction
      ? [
          [reversed, 'read the remainders from the top down'],
          [Math.floor(value / base).toString(base).toUpperCase(), 'left out the last remainder'],
          [(value % base ** (shown.length - 1)).toString(base).toUpperCase(), 'left out the final quotient'],
          [(value + base).toString(base).toUpperCase(), 'carried one too many'],
        ]
      : [
          [String([...shown].reduce((sum, d) => sum + parseInt(d, 16), 0)), 'added the digits, ignoring their place values'],
          [String(parseInt(reversed, base)), 'read the digits from the wrong end'],
          [String(value * base), 'counted one place too many'],
          [String(Math.floor(value / base)), 'counted one place too few'],
        ];
    const usable = slips.filter(([text], i) => text !== right && slips.findIndex(([other]) => other === text) === i).slice(0, 3);
    if (usable.length < 3) g.retry('too few distinct slips');
    return g.mcq(question, right, usable.map(([text]) => text), { why: `The other options come from common slips: ${usable.map(([text, slip]) => `${text} if you ${slip}`).join('; ')}.` });
  }
  return direction ? g.theory(`Convert the decimal number ${value} to ${name}, showing your working.`, [`Divide repeatedly by ${base}, and note the remainders.`, `Reading them from last to first gives ${shown}.`]) : g.theory(`Convert the ${name} number ${shown} to decimal, showing your working.`, [`Multiply each digit by its power of ${base}.`, `The sum is ${value}.`]);
}

function complementQuestion(g: Gen): Body {
  const value = g.int(1, 120);
  const bits = 8;
  const one = (255 - value).toString(2).padStart(bits, '0');
  const two = (256 - value).toString(2).padStart(bits, '0');
  return g.theory(`Find the 8-bit 1’s complement and 2’s complement forms of −${value}.`, [`${value} in binary is ${value.toString(2).padStart(bits, '0')}, whose 1’s complement is ${one}.`, `Adding 1 gives the 2’s complement, ${two}.`]);
}

const OPERATORS: ((g: Gen) => OutputBody)[] = [
  (g) => {
    const a = g.int(10, 40);
    const b = g.int(2, 9);
    return outputOf(g, inMain(`int a = ${a};\nint b = ${b};\nSystem.out.println(a / b);\nSystem.out.println(a % b);\nSystem.out.println((double) a / b);`), 'Dividing two ints drops the fractional part. Casting one to double keeps it.');
  },
  (g) => {
    const a = g.int(2, 9);
    return outputOf(g, inMain(`int x = ${a};\nint y = x++ + ++x;\nSystem.out.println(x);\nSystem.out.println(y);`), 'x++ uses the value, then raises it. ++x raises it, then uses it.');
  },
  (g) => {
    const a = g.int(1, 9);
    const b = g.int(1, 9);
    return outputOf(g, inMain(`int a = ${a};\nint b = ${b};\nint c = (a > b) ? a : b;\nSystem.out.println(c);\nSystem.out.println(a + b + "x");\nSystem.out.println("x" + a + b);`), 'String joining goes left to right, so numbers before the string add first.');
  },
  (g) => {
    const c = g.pick(['A', 'B', 'C', 'K', 'Z', 'a', 'd']);
    return outputOf(g, inMain(`char c = '${c}';\nint n = c + 1;\nSystem.out.println(n);\nSystem.out.println((char) n);`), 'A char is stored as a number, so adding 1 gives a number until it’s cast back.');
  },
];

const LOOP_PROGRAMS: ((g: Gen) => OutputBody)[] = [
  (g) => {
    const n = g.int(3, 6);
    return outputOf(g, inMain(`for (int i = 1; i <= ${n}; i++) {\n  if (i % 2 == 0) {\n    continue;\n  }\n  System.out.print(i + " ");\n}\nSystem.out.println();`), 'continue skips the rest of the loop’s body for that turn.');
  },
  (g) => {
    const n = g.int(100, 999);
    return outputOf(g, inMain(`int n = ${n};\nint s = 0;\nwhile (n > 0) {\n  s += n % 10;\n  n /= 10;\n}\nSystem.out.println(s);`), 'This adds the digits, working from the last one.');
  },
  (g) => {
    const v = g.int(1, 4);
    return outputOf(g, inMain(`int v = ${v};\nswitch (v) {\n  case 1:\n    System.out.println("one");\n  case 2:\n    System.out.println("two");\n    break;\n  case 3:\n    System.out.println("three");\n  default:\n    System.out.println("other");\n}`), 'Without a break, a switch falls through to the next case.');
  },
  (g) => {
    const rows = g.int(3, 5);
    return outputOf(g, inMain(`for (int i = 1; i <= ${rows}; i++) {\n  for (int j = 1; j <= i; j++) {\n    System.out.print(j);\n  }\n  System.out.println();\n}`), 'The inner loop runs up to the current row number.');
  },
];

function pythonBasic(g: Gen): Body {
  const a = g.int(2, 15);
  const b = g.int(2, 6);
  const word = g.pick(SHORT_WORDS).toLowerCase();
  const pick = g.int(0, 2);
  if (pick === 0) return { form: 'output', text: 'Write the output of the following Python code.', code: `a = ${a}\nb = ${b}\nprint(a // b)\nprint(a % b)\nprint(a ** 2)`, expected: `${Math.floor(a / b)}\n${a % b}\n${a * a}`, python: 1, why: '// is floor division, % is the remainder, and ** is a power.' };
  if (pick === 1) return { form: 'output', text: 'Write the output of the following Python code.', code: `s = "${word}"\nprint(s[0])\nprint(s[-1])\nprint(s[1:3])\nprint(len(s))`, expected: `${word[0]}\n${word[word.length - 1]}\n${pySlice(word, 1, 3)}\n${word.length}`, python: 1, why: 'Indexes start at 0, and −1 is the last character.' };
  const list = Array.from({ length: g.int(3, 5) }, () => g.int(1, 9));
  return { form: 'output', text: 'Write the output of the following Python code.', code: `a = ${pyList(list)}\na.append(${a})\nprint(a)\nprint(len(a))\nprint(sum(a))`, expected: `${pyList([...list, a])}\n${list.length + 1}\n${list.reduce((s, v) => s + v, 0) + a}`, python: 1, why: 'append adds to the end of the list.' };
}

const blueprints: Blueprint[] = [
  // ---- Units 1 and 2: Numbers and codes
  custom('convert-mcq', [1, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => convertQuestion(g, 1)),
  custom('convert', [1, 'a', 2, 1], { type: 'short', format: 'short' }, (g) => convertQuestion(g, 2)),
  custom('binary-add', [1, 'a', 2, 2], { type: 'short', format: 'short' }, (g) => {
    const a = g.int(5, 60);
    const b = g.int(5, 60);
    return g.theory(`Add the binary numbers ${a.toString(2)} and ${b.toString(2)}. Check your answer using decimal.`, [`The sum is ${(a + b).toString(2)}.`, `In decimal, ${a} + ${b} = ${a + b}.`]);
  }),
  ...facts(1, 'a', {
    define: [
      ['a number system’s base', 'The number of different digits it uses.'],
      ['a bit', 'A single binary digit, 0 or 1.'],
      ['a byte', 'A group of eight bits.'],
    ],
    recall: [
      ['The base of the hexadecimal system is:', '16', '8', '10', '2'],
      ['The hexadecimal digit F stands for:', '15', '16', '14', '10'],
      ['How many bits are used for each octal digit?', '3', '4', '2', '8'],
      ['How many bits are used for each hexadecimal digit?', '4', '3', '8', '2'],
    ],
    reason: [
      ['Hexadecimal is often used instead of binary for writing addresses.', 'Each hexadecimal digit stands for four bits.', 'So long binary numbers become short and easy to read.'],
    ],
    truths: [
      ['Binary uses only the digits 0 and 1.', 'Binary uses the digits 0 to 2.'],
      ['Moving one place left in binary doubles the place value.', 'Moving one place left in binary triples the place value.'],
      ['Eight bits can represent 256 values.', 'Eight bits can represent 128 values.'],
    ],
    compare: [
      ['binary', 'decimal', ['Base 2.', 'Base 10.'], ['Used inside computers.', 'Used by people every day.']],
    ],
  }),
  custom('complements', [2, 'a', 2, 2], { type: 'short', format: 'short' }, complementQuestion),
  ...facts(2, 'a', {
    define: [
      ['ASCII', 'A code that gives a number to each English letter, digit and common symbol, using seven bits.'],
      ['Unicode', 'A code that gives a number to characters from most of the world’s writing systems.'],
      ['2’s complement', 'A way of writing negative numbers: invert all the bits, then add 1.'],
    ],
    recall: [
      ['The ASCII code of A is:', '65', '97', '48', '32'],
      ['The ASCII code of a is:', '97', '65', '48', '122'],
      ['In 2’s complement, the leftmost bit shows:', 'the sign', 'the size', 'the parity', 'nothing'],
      ['Java’s char type uses:', 'Unicode', 'ASCII only', 'binary only', 'BCD'],
    ],
    reason: [
      ['Computers mostly use 2’s complement for negative numbers.', 'Addition and subtraction then use the same circuit.', 'It also gives just one form for zero.'],
    ],
    compare: [
      ['ASCII', 'Unicode', ['Uses few bits, for English characters.', 'Uses more bits, for many languages.'], ['Has at most 256 characters in its extended form.', 'Has far more than 100,000 characters.']],
    ],
    truths: [
      ['2’s complement has one form for zero.', '2’s complement has two forms for zero.'],
      ['Upper case letters come before lower case letters in ASCII.', 'Lower case letters come before upper case letters in ASCII.'],
      ['A parity bit helps detect single-bit errors.', 'A parity bit corrects any number of errors.'],
    ],
  }),

  // ---- Unit 3: Logic and hardware
  custom('prop-table-xi', [3, 'a', 2, 2], { type: 'short', format: 'short' }, (g) => {
    const list: { text: string; f: (b: boolean[]) => boolean }[] = [
      { text: 'p ∨ ~p', f: ([p]) => p || !p },
      { text: 'p ∧ ~p', f: ([p]) => p && !p },
      { text: 'p ⇒ q', f: ([p, q]) => !p || q },
      { text: '(p ∧ q) ⇒ q', f: ([p, q]) => !(p && q) || q },
      { text: '~(p ∧ q)', f: ([p, q]) => !(p && q) },
      { text: 'p ⇔ q', f: ([p, q]) => p === q },
    ];
    const p = g.pick(list);
    const col = truthColumn(2, p.f);
    return g.theory(`Draw a truth table for ${p.text}, and say whether it is a tautology, a contradiction or a contingency.`, [`The final column reads ${col.map((b) => (b ? 1 : 0)).join(', ')}, top to bottom.`, `It is a ${classify(col)}.`]);
  }),
  custom('gate-xi', [3, 'b', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const gates: [string, (a: number, b: number) => number][] = [['AND', (a, b) => a & b], ['OR', (a, b) => a | b], ['NAND', (a, b) => 1 - (a & b)], ['NOR', (a, b) => 1 - (a | b)], ['XOR', (a, b) => a ^ b]];
    const [name, f] = g.pick(gates);
    const a = g.int(0, 1);
    const b = g.int(0, 1);
    return g.mcq(`A ${name} gate has inputs ${a} and ${b}. Its output is:`, String(f(a, b)), [String(1 - f(a, b))]);
  }),
  custom('section-a-xi', [1, 'a', 10, 3], { type: 'short', format: 'long' }, (g) => {
    const value = g.int(50, 200);
    const neg = g.int(5, 100);
    const a = g.int(0, 1);
    const b = g.int(0, 1);
    return g.theory(`(a) Convert the decimal number ${value} to binary, octal and hexadecimal. [3]\n(b) Find the 8-bit 2’s complement form of −${neg}. [3]\n(c) Find the output of an XOR gate with inputs ${a} and ${b}, and write its truth table. [2]\n(d) State De Morgan’s two laws. [2]`, [
      [`(a) ${value} is ${value.toString(2)} in binary, ${value.toString(8)} in octal, and ${value.toString(16).toUpperCase()} in hexadecimal.`, 3],
      [`(b) ${neg} is ${neg.toString(2).padStart(8, '0')}, whose 1’s complement is ${(255 - neg).toString(2).padStart(8, '0')}.`, 2],
      [`(b) Adding 1 gives ${(256 - neg).toString(2).padStart(8, '0')}.`, 1],
      [`(c) The output is ${a ^ b}.`, 1],
      ['(c) 00 → 0, 01 → 1, 10 → 1, 11 → 0.', 1],
      ['(d) (A + B)′ = A′B′.', 1],
      ['(d) (AB)′ = A′ + B′.', 1],
    ]);
  }),
  ...facts(3, 'a', {
    define: [
      ['a proposition', 'A statement that is either true or false.'],
      ['a truth table', 'A table of a logical expression’s value, for every combination of its inputs.'],
    ],
    recall: [
      ['p ∧ q is true when:', 'both are true', 'either is true', 'neither is true', 'p is false'],
      ['p ∨ q is false when:', 'both are false', 'both are true', 'p is true', 'q is true'],
      ['~(~p) is equivalent to:', 'p', '~p', 'a contradiction', 'a tautology'],
    ],
    truths: [
      ['A tautology is always true.', 'A tautology is always false.'],
      ['A conditional is false only if a true statement implies a false one.', 'A conditional is false only if a false statement implies a true one.'],
      ['Two variables need a truth table of four rows.', 'Two variables need a truth table of eight rows.'],
    ],
    reason: [
      ['A question like "What’s your name?" isn’t a proposition.', 'It can’t be said to be true or false.'],
    ],
  }),
  ...facts(3, 'b', {
    define: [
      ['a half adder', 'A circuit adding two bits, giving a sum and a carry.'],
      ['a logic gate', 'A circuit whose output follows a logical rule from its inputs.'],
    ],
    recall: [
      ['Which gate gives 1 only when all its inputs are 1?', 'AND', 'OR', 'NOR', 'XOR'],
      ['Which gate gives the opposite of its one input?', 'NOT', 'AND', 'OR', 'XOR'],
      ['A half adder’s carry is:', 'A AND B', 'A OR B', 'A XOR B', 'NOT A'],
    ],
    truths: [
      ['A NAND gate is an AND gate followed by a NOT gate.', 'A NAND gate is an OR gate followed by a NOT gate.'],
      ['XOR gives 1 when its two inputs differ.', 'XOR gives 1 when its two inputs are the same.'],
      ['A half adder has two outputs.', 'A half adder has three outputs.'],
    ],
    draw: [
      ['Draw the truth table and the circuit for a half adder.', 'A table: 00 → 0 0, 01 → 1 0, 10 → 1 0, 11 → 0 1, as sum then carry.', 'An XOR gate for the sum, and an AND gate for the carry.'],
    ],
  }),

  // ---- Units 4 and 5: Objects
  ...facts(4, 'a', {
    define: [
      ['encapsulation', 'Keeping data and the methods that work on it together in a class, and hiding the details.'],
      ['abstraction', 'Showing only what an object does, not how it does it.'],
      ['polymorphism', 'One name having different behaviour, depending on the object or the parameters.'],
    ],
    recall: [
      ['Java source code is compiled to:', 'bytecode', 'machine code directly', 'HTML', 'assembly'],
      ['Which is a principle of object-oriented programming?', 'Encapsulation', 'Compilation', 'Interpretation', 'Iteration'],
      ['A class is:', 'a blueprint for objects', 'an instance of an object', 'a primitive type', 'a loop'],
    ],
    truths: [
      ['An object is an instance of a class.', 'A class is an instance of an object.'],
      ['Java programs run on the JVM.', 'Java programs run only on one kind of processor.'],
      ['Data hiding is supported by the keyword private.', 'Data hiding is supported by the keyword public.'],
    ],
    compare: [
      ['a class', 'an object', ['A template.', 'A real instance made from it.'], ['Takes no memory for its data until instances are made.', 'Takes memory for its data.']],
      ['a compiler', 'an interpreter', ['Translates the whole program first.', 'Translates and runs line by line.'], ['Runs faster afterwards.', 'Is easier for finding errors step by step.']],
    ],
    reason: [
      ['Java is called platform independent.', 'Its compiler makes bytecode, not machine code.', 'Any machine with a JVM can run that bytecode.'],
    ],
  }),
  ...facts(5, 'a', {
    define: [
      ['an object', 'An instance of a class, with its own state and behaviour.'],
      ['a data member', 'A variable declared in a class, that holds an object’s state.'],
    ],
    recall: [
      ['Which keyword creates an object?', 'new', 'class', 'object', 'create'],
      ['Which operator reaches an object’s member?', 'The dot operator', 'The arrow operator', 'The colon operator', 'The hash operator'],
    ],
    truths: [
      ['Two objects of a class can hold different values.', 'Two objects of a class must hold the same values.'],
      ['A reference variable holds the address of an object.', 'A reference variable holds a copy of every object.'],
      ['Without new, a declared object variable refers to no object.', 'Without new, a declared object variable refers to a default object.'],
    ],
    reason: [
      ['Two reference variables can refer to one object.', 'Assigning a reference copies the address, not the object.'],
    ],
  }),
  ...facts(5, 'b', {
    define: [
      ['a syntax error', 'A mistake in the rules of the language, found when compiling.'],
      ['a runtime error', 'An error that happens while the program is running.'],
      ['a logical error', 'A mistake that gives a wrong result, without stopping the program.'],
      ['an exception', 'An event that stops the normal flow of a program while it runs.'],
    ],
    recall: [
      ['Dividing an int by zero throws:', 'ArithmeticException', 'NullPointerException', 'IOException', 'ClassCastException'],
      ['A missing semicolon is a:', 'syntax error', 'runtime error', 'logical error', 'warning only'],
      ['Which keyword handles an exception?', 'catch', 'if', 'switch', 'static'],
    ],
    compare: [
      ['a syntax error', 'a logical error', ['Stops the program compiling.', 'Lets the program run, giving wrong answers.'], ['Found by the compiler.', 'Found by testing.']],
    ],
    truths: [
      ['try must be followed by catch or finally.', 'try can stand on its own.'],
      ['A logical error isn’t reported by the compiler.', 'A logical error is always reported by the compiler.'],
      ['Using a null reference throws NullPointerException.', 'Using a null reference throws ArithmeticException.'],
    ],
    reason: [
      ['Logical errors are the hardest to find.', 'The program runs without any message.', 'Only wrong answers show that something’s wrong.'],
    ],
  }),

  // ---- Unit 6: Types
  custom('output-types', [6, 'a', 2, 1], { type: 'output', format: 'output' }, (g) => g.pick(OPERATORS)(g)),
  custom('casting', [6, 'a', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const d = g.int(2, 9) + g.pick([0.5, 0.75, 0.25]);
    return g.mcqNumber(`What does (int) ${d} give in Java?`, Math.floor(d), '', [
      { slip: 'rounded up', value: Math.ceil(d) },
      { slip: 'kept the fraction', value: d },
      { slip: 'added 1', value: Math.floor(d) + 2 },
      { slip: 'took 1 away', value: Math.floor(d) - 1 },
    ], { digits: 3 });
  }),
  custom('find-error-type', [6, 'a', 2, 2], { type: 'error', format: 'error' }, (g) => {
    const v = g.int(2, 9);
    return findError(g, inMain(`int a = ${v}.5;\nSystem.out.println(a);`), inMain(`double a = ${v}.5;\nSystem.out.println(a);`), [`${v}.5 is a double, which can’t be stored in an int without a cast.`, 'Correct it by declaring a as double.']);
  }),
  ...facts(6, 'a', {
    define: [
      ['a primitive data type', 'A basic type that holds a simple value, such as int or char.'],
      ['a wrapper class', 'A class that holds a primitive value as an object, such as Integer.'],
      ['type casting', 'Converting a value from one data type to another.'],
      ['autoboxing', 'The automatic conversion of a primitive value to its wrapper object.'],
    ],
    recall: [
      ['How many bits does an int use in Java?', '32', '16', '8', '64'],
      ['How many bits does a char use in Java?', '16', '8', '32', '4'],
      ['Which method changes the text "25" into an int?', 'Integer.parseInt', 'Integer.toString', 'String.valueOf', 'Double.parseDouble'],
      ['Which is the default value of an int data member?', '0', 'null', '1', 'a random value'],
    ],
    compare: [
      ['implicit casting', 'explicit casting', ['Done automatically, to a larger type.', 'Written by the programmer, to a smaller type.'], ['Loses no information.', 'May lose information.']],
      ['int', 'Integer', ['A primitive type.', 'A wrapper class.'], ['Holds just a value.', 'Holds a value, and has methods.']],
    ],
    truths: [
      ['A byte holds values from −128 to 127.', 'A byte holds values from 0 to 1000.'],
      ['A double takes more memory than a float.', 'A double takes less memory than a float.'],
      ['Character.isDigit tests whether a char is a digit.', 'Character.isDigit changes a char to a digit.'],
    ],
    reason: [
      ['Casting a double to an int can lose information.', 'An int has no room for the fractional part.', 'So that part is dropped.'],
    ],
  }),

  // ---- Unit 7: Expressions
  custom('precedence', [7, 'a', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const [a, b, c, d] = [g.int(1, 9), g.int(2, 6), g.int(2, 6), g.int(2, 5)];
    const right = a + b * c - Math.trunc(c / d);
    return g.mcqNumber(`In Java, ${a} + ${b} * ${c} - ${c} / ${d}, with all int values, gives:`, right, '', [
      { slip: 'worked left to right', value: Math.trunc((a + b) * c - c) / d },
      { slip: 'kept the fraction in the division', value: a + b * c - c / d },
      { slip: 'added before multiplying', value: (a + b) * c - Math.trunc(c / d) },
      { slip: 'ignored the division', value: a + b * c },
    ], { digits: 4 });
  }),
  custom('prefix', [7, 'a', 2, 2], { type: 'output', format: 'output' }, (g) => OPERATORS[1](g)),
  ...facts(7, 'a', {
    define: [
      ['a variable', 'A named place in memory that holds a value.'],
      ['an operator', 'A symbol that performs an action on its operands.'],
      ['the ternary operator', 'The operator a ? b : c, which gives b if a is true, and otherwise c.'],
    ],
    recall: [
      ['% in Java gives the:', 'remainder', 'percentage', 'quotient', 'power'],
      ['Which has the highest precedence?', '()', '*', '+', '='],
      ['Which is a valid identifier?', '_count', '2count', 'class', 'my-count'],
    ],
    compare: [
      ['= ', '==', ['Assigns a value.', 'Compares two values.'], ['Changes the variable.', 'Gives true or false.']],
      ['x++', '++x', ['Uses the old value, then raises it.', 'Raises it, then uses the new value.'], ['Called postfix.', 'Called prefix.']],
      ['&&', '&', ['Stops early if its first operand decides.', 'Always evaluates both operands.'], ['Used for logic.', 'Also used for bit operations.']],
    ],
    truths: [
      ['Integer division in Java drops the fractional part.', 'Integer division in Java rounds to the nearest whole number.'],
      ['Java is case-sensitive.', 'Java ignores the case of identifiers.'],
      ['A constant is declared using final.', 'A constant is declared using static alone.'],
    ],
    reason: [
      ['10 / 4 gives 2 in Java.', 'Both operands are ints.', 'So the result is an int, with the fraction dropped.'],
    ],
  }),

  // ---- Unit 8: Statements
  custom('output-loop', [8, 'a', 2, 1], { type: 'output', format: 'output' }, (g) => g.pick(LOOP_PROGRAMS)(g)),
  custom('output-loop3', [8, 'a', 3, 2], { type: 'output', format: 'output' }, (g) => LOOP_PROGRAMS[3](g)),
  custom('loop-count', [8, 'a', 1, 1], { type: 'mcq', format: 'mcq' }, (g) => {
    const start = g.int(0, 3);
    const end = start + g.int(4, 12);
    const by = g.pick([1, 2, 3]);
    const count = Math.ceil((end - start) / by);
    return g.mcqNumber(`How many times does this loop run?\n${fence(`for (int i = ${start}; i < ${end}; i += ${by}) { }`)}`, count, '', [
      { slip: 'counted one too many', value: count + 1 },
      { slip: 'counted one too few', value: count - 1 },
      { slip: 'ignored the step', value: end - start },
      { slip: 'used the end value', value: end },
    ], { digits: 3 });
  }),
  custom('find-error-loop', [8, 'a', 2, 2], { type: 'error', format: 'error' }, (g) => {
    const n = g.int(3, 7);
    return findError(g, inMain(`for (int i = 0; i < ${n}; i++) {\n  int s = i * 2;\n}\nSystem.out.println(s);`), inMain(`int s = 0;\nfor (int i = 0; i < ${n}; i++) {\n  s = i * 2;\n}\nSystem.out.println(s);`), ['s is declared inside the loop, so it doesn’t exist outside it.', 'Correct it by declaring s before the loop.']);
  }),
  ...facts(8, 'a', {
    define: [
      ['the scope of a variable', 'The part of a program in which it can be used.'],
      ['an entry-controlled loop', 'A loop that tests its condition before each turn.'],
      ['fall through', 'A switch carrying on into the next case because there’s no break.'],
    ],
    recall: [
      ['A do-while loop always runs at least:', 'once', 'twice', 'zero times', 'ten times'],
      ['break in a loop:', 'leaves the loop', 'skips one turn', 'restarts the loop', 'stops the program'],
      ['continue in a loop:', 'moves on to the next turn', 'leaves the loop', 'stops the program', 'repeats the same turn forever'],
    ],
    compare: [
      ['while', 'do-while', ['Tests before the loop’s body.', 'Tests after the loop’s body.'], ['May never run.', 'Runs at least once.']],
      ['break', 'continue', ['Leaves the loop completely.', 'Skips to the next turn.'], ['No more turns follow.', 'More turns may follow.']],
    ],
    truths: [
      ['A variable declared in a block is lost at the end of it.', 'A variable declared in a block lasts for the whole program.'],
      ['A switch can work on an int, a char or a String.', 'A switch can work on a double.'],
      ['A for loop’s three parts are all optional.', 'A for loop must have all three parts.'],
    ],
    reason: [
      ['A break is usually written at the end of each case.', 'Otherwise, a switch falls through into the next case.'],
    ],
    cases: [
      {
        scene: 'A programmer writes a menu using a switch. Choosing option 1 runs the code for options 1 and 2, which surprises the programmer.',
        parts: [
          ['What’s the cause?', 'There’s no break at the end of case 1.', 1],
          ['What’s this behaviour called?', 'Fall through.', 1],
          ['How is it fixed?', 'By adding a break after each case’s statements.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 9: Methods
  custom('design-xi', [9, 'a', 10, 3], { type: 'program', format: 'program' }, (g) => {
    const rate = g.pick([5, 8, 10, 12]);
    const p = 100 * g.int(1, 20);
    const t = g.int(1, 5);
    const code = `class Interest {\n  double principal;\n  int years;\n  Interest(double p, int y) {\n    principal = p;\n    years = y;\n  }\n  double simple() {\n    return principal * ${rate} * years / 100;\n  }\n  void show() {\n    System.out.println("Interest = " + simple());\n  }\n  public static void main(String[] args) {\n    Interest i = new Interest(${p}, ${t});\n    i.show();\n  }\n}`;
    return designClass(g, `Design a class Interest to work out simple interest at ${rate}% a year.\nData members: principal, years.\nMember functions:\nInterest(double p, int y): a parameterised constructor.\ndouble simple(): returns the simple interest.\nvoid show(): prints the interest.\nSpecify the class, and define main() to create an object and use it.`, code, [
      ['Declares the data members correctly.', 1],
      ['Writes the parameterised constructor.', 2],
      ['simple() uses the formula, and returns a double.', 3],
      ['show() prints the result, calling simple().', 2],
      ['main() creates an object, and calls show().', 2],
    ]);
  }),
  custom('method-output', [9, 'a', 2, 2], { type: 'output', format: 'output' }, (g) => {
    const a = g.int(2, 9);
    const b = g.int(2, 9);
    return outputOf(g, withMethods('static int add(int x, int y) {\n  return x + y;\n}\nstatic double add(double x, double y) {\n  return x * y;\n}\nstatic void change(int x) {\n  x = x * 2;\n}', `int n = ${a};\nchange(n);\nSystem.out.println(n);\nSystem.out.println(add(${a}, ${b}));\nSystem.out.println(add(${a}.0, ${b}.0));`), 'change works on a copy of n. Overloads are chosen by the types of the arguments.');
  }),
  custom('complete-method-xi', [9, 'a', 3, 2], { type: 'complete', format: 'short' }, (g) => {
    const n = g.int(4, 7);
    const code = (one: string, two: string, three: string) => withMethods(`static int fact(int n) {\n  int f = ${one};\n  for (int i = 2; i <= ${two}; i++) {\n    f = ${three};\n  }\n  return f;\n}`, `System.out.println(fact(${n}));`);
    return complete(g, code('?1?', '?2?', '?3?'), code('1', 'n', 'f * i'), [['?1? is 1, as a product must start from 1.', 1], ['?2? is n, the last number to multiply.', 1], ['?3? is f * i, multiplying each number in turn.', 1]], 'This method finds the factorial of n.');
  }),
  ...facts(9, 'a', {
    define: [
      ['a method', 'A named block of code in a class, that does one job.'],
      ['a parameter', 'A variable in a method’s definition, that gets a value when it’s called.'],
      ['a default constructor', 'A constructor with no parameters.'],
      ['method overloading', 'Several methods with one name, but different parameter lists.'],
    ],
    recall: [
      ['A method that returns nothing has the return type:', 'void', 'null', 'int', 'empty'],
      ['Which statement sends a value back from a method?', 'return', 'send', 'break', 'give'],
      ['The name of a constructor must match the:', 'class', 'first method', 'file only', 'package'],
    ],
    compare: [
      ['a constructor', 'a method', ['Has the same name as the class.', 'Can have any valid name.'], ['Has no return type.', 'Must have a return type, or void.']],
      ['call by value', 'call by reference', ['A copy of the value is passed.', 'A reference to the object is passed.'], ['Changes don’t reach the caller.', 'Changes to the object are seen by the caller.']],
    ],
    truths: [
      ['Overloaded methods differ in their parameter lists.', 'Overloaded methods differ only in return type.'],
      ['Java supplies a default constructor if none is written.', 'Java never supplies a default constructor.'],
      ['Primitive parameters in Java are passed by value.', 'Primitive parameters in Java are passed by reference.'],
    ],
    reason: [
      ['A method can’t change a caller’s int variable through its parameter.', 'Java passes a copy of a primitive value.', 'So changes stay inside the method.'],
    ],
  }),

  // ---- Unit 10: Arrays and strings
  custom('array-output', [10, 'a', 2, 1], { type: 'output', format: 'output' }, (g) => {
    const list = Array.from({ length: g.int(4, 6) }, () => g.int(1, 20));
    return outputOf(g, inMain(`int[] a = {${list.join(', ')}};\nint big = a[0];\nfor (int i = 1; i < a.length; i++) {\n  if (a[i] > big) {\n    big = a[i];\n  }\n}\nSystem.out.println(big);\nSystem.out.println(a.length);`), 'The loop keeps the largest value seen so far.');
  }),
  custom('string-output', [10, 'a', 2, 1], { type: 'output', format: 'output' }, (g) => {
    const word = g.pick(SHORT_WORDS);
    const i = g.int(1, 3);
    return outputOf(g, inMain(`String s = "${word}";\nSystem.out.println(s.length());\nSystem.out.println(s.charAt(${i}));\nSystem.out.println(s.substring(${i}));\nSystem.out.println(s.toLowerCase());`), 'charAt counts from 0, and substring with one argument runs to the end.');
  }),
  custom('bubble-pass', [10, 'a', 3, 2], { type: 'short', format: 'short' }, (g) => {
    const list = g.sample([3, 5, 8, 12, 15, 19, 23, 27, 31, 42], 5);
    const a = [...list];
    for (let j = 0; j < a.length - 1; j++) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
    const first = [...a];
    for (let j = 0; j < a.length - 2; j++) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
    return g.theory(`An array holds ${list.join(', ')}. Show it after each of the first two passes of a bubble sort, in ascending order.`, [
      [`After the first pass, it holds ${first.join(', ')}.`, 1],
      [`After the second pass, it holds ${a.join(', ')}.`, 1],
      ['The largest values have moved to the end, as each pass sets one in place.', 1],
    ]);
  }),
  custom('binary-search', [10, 'a', 3, 3], { type: 'short', format: 'short' }, (g) => {
    const list = Array.from({ length: 7 }, (_, i) => (i + 1) * g.pick([3, 4, 5]) + i).sort((a, b) => a - b);
    if (new Set(list).size !== list.length) g.retry();
    const target = g.pick(list);
    const steps: number[] = [];
    let lo = 0;
    let hi = list.length - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      steps.push(list[mid]);
      if (list[mid] === target) break;
      if (list[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return g.theory(`An array holds ${list.join(', ')}. List the elements a binary search compares with ${target}, in order, and say how many comparisons it makes.`, [
      ['It starts with the middle element, and halves the range each time.', 1],
      [`The elements compared are ${steps.join(', ')}.`, 1],
      [`So it makes ${steps.length} ${steps.length === 1 ? 'comparison' : 'comparisons'}.`, 1],
    ]);
  }),
  ...facts(10, 'a', {
    define: [
      ['an array', 'A collection of values of one type, reached using an index.'],
      ['linear search', 'Looking through a list, element by element, for a value.'],
      ['binary search', 'Finding a value in a sorted list, by halving the range each time.'],
    ],
    recall: [
      ['Which method gives the length of a String?', 'length()', 'size()', 'length', 'count()'],
      ['The index of the first element of an array is:', '0', '1', '−1', 'the length'],
      ['Which needs a sorted array?', 'Binary search', 'Linear search', 'Reading all the values', 'Adding all the values'],
    ],
    compare: [
      ['linear search', 'binary search', ['Works on any list.', 'Needs a sorted list.'], ['Slower on long lists.', 'Faster on long lists.']],
    ],
    truths: [
      ['Strings in Java can’t be changed once they’re made.', 'Strings in Java are changed in place by their methods.'],
      ['Arrays in Java have a fixed size once created.', 'Arrays in Java grow automatically when needed.'],
      ['s.charAt(0) gives the first character of s.', 's.charAt(1) gives the first character of s.'],
    ],
    reason: [
      ['Comparing strings with == can fail.', 'It compares references.', 'To compare their text, use equals().'],
    ],
  }),

  // ---- Unit 11: Input and files
  ...facts(11, 'a', {
    define: [
      ['the Scanner class', 'A class that reads input, such as numbers and text, from the keyboard or a file.'],
    ],
    recall: [
      ['Which method reads a whole line using Scanner?', 'nextLine()', 'next()', 'nextInt()', 'read()'],
      ['Which method reads an int using Scanner?', 'nextInt()', 'nextLine()', 'readInt()', 'getInt()'],
      ['Scanner belongs to the package:', 'java.util', 'java.lang', 'java.io', 'java.net'],
    ],
    truths: [
      ['next() reads one word at a time.', 'next() always reads a whole line.'],
      ['System.in stands for the standard input.', 'System.in stands for the standard output.'],
      ['java.lang is imported automatically.', 'java.util is imported automatically.'],
    ],
  }),
  ...facts(11, 'b', {
    define: [
      ['a text file', 'A file that stores characters that can be read by people.'],
      ['a binary file', 'A file that stores data in the same form as it’s held in memory.'],
    ],
    recall: [
      ['Which class writes characters to a file?', 'FileWriter', 'FileReader', 'Scanner', 'String'],
      ['Which class reads a text file a line at a time?', 'BufferedReader', 'PrintWriter', 'FileWriter', 'Math'],
      ['Opening a FileWriter with true as its second argument:', 'appends to the file', 'deletes the file', 'reads the file', 'locks the file'],
    ],
    compare: [
      ['a text file', 'a binary file', ['Readable by people.', 'Not readable by people.'], ['Often larger for numbers.', 'Often smaller for numbers.']],
    ],
    truths: [
      ['A file must be closed to make sure its data is saved.', 'A file doesn’t need closing for its data to be saved.'],
      ['IOException is raised for many file errors.', 'ArithmeticException is raised for most file errors.'],
      ['readLine() returns null at the end of a file.', 'readLine() returns 0 at the end of a file.'],
    ],
    reason: [
      ['A program should close a file when it has finished.', 'Buffered data might not be written otherwise.', 'It also frees the resource for others.'],
    ],
  }),

  // ---- Units 12 and 13
  custom('py-basic', [12, 'a', 2, 1], { type: 'output', format: 'output', python: 1 }, pythonBasic),
  custom('py-5-xi', [12, 'a', 5, 2], { type: 'output', format: 'output', python: 1 }, (g) => {
    const n = g.int(3, 6);
    const squares = Array.from({ length: n }, (_, i) => (i + 1) * (i + 1));
    const total = squares.reduce((a, b) => a + b, 0);
    return {
      form: 'output',
      text: 'Write the output of the following Python code.',
      code: `s = []\nfor i in range(1, ${n + 1}):\n    s.append(i * i)\nprint(s)\nprint(sum(s))\nprint(s[-1])\nprint(s[:2])\nprint(len(s))`,
      expected: `${pyList(squares)}\n${total}\n${squares[squares.length - 1]}\n${pyList(squares.slice(0, 2))}\n${n}`,
      python: 1,
      why: 'range stops one short of its second argument, and −1 is the last index.',
    };
  }),
  ...facts(12, 'a', {
    define: [
      ['indentation in Python', 'The spaces at the start of a line, which mark out blocks of code.'],
      ['a dictionary in Python', 'A collection of key and value pairs.'],
    ],
    recall: [
      ['Which keyword starts a function in Python?', 'def', 'function', 'func', 'method'],
      ['range(3) produces:', '0, 1, 2', '1, 2, 3', '0, 1, 2, 3', '3, 2, 1'],
      ['// in Python means:', 'floor division', 'a comment', 'a power', 'a remainder'],
      ['** in Python means:', 'a power', 'multiply twice', 'a pointer', 'floor division'],
      ['Which is a comment in Python?', '# like this', '// like this', '/* like this */', '-- like this'],
    ],
    compare: [
      ['Python', 'Java', ['Variables aren’t declared with a type.', 'Variables are declared with a type.'], ['Blocks are marked by indentation.', 'Blocks are marked by braces.']],
      ['a list', 'a tuple', ['Mutable.', 'Immutable.'], ['Square brackets.', 'Round brackets.']],
    ],
    truths: [
      ['Python is an interpreted language.', 'Python must be compiled to machine code before every run.'],
      ['A Python variable can later hold a value of another type.', 'A Python variable must keep one type for its whole life.'],
      ['Python’s / always gives a float.', 'Python’s / always gives an int.'],
    ],
    reason: [
      ['A wrongly indented line in Python causes an error.', 'Indentation is part of the language’s syntax.', 'It shows which block a line belongs to.'],
    ],
  }),
  ...facts(13, 'a', {
    define: [
      ['plagiarism', 'Using someone else’s work, and passing it off as your own.'],
      ['phishing', 'Tricking people into giving away personal information, usually with a fake message or website.'],
      ['malware', 'Software designed to harm a computer or steal from it.'],
      ['cloud computing', 'Using computing services over the internet, rather than on your own machine.'],
    ],
    recall: [
      ['Copyright protects:', 'original creative work', 'only inventions', 'only trade names', 'only physical goods'],
      ['A patent protects:', 'an invention', 'a novel', 'a song', 'a logo'],
      ['Which is an example of malware?', 'A trojan', 'A compiler', 'A browser', 'A spreadsheet'],
      ['Open-source software has:', 'source code anyone can see and change', 'no licence at all', 'no source code', 'a fixed high price'],
    ],
    compare: [
      ['a virus', 'a worm', ['Attaches itself to another program.', 'Spreads on its own.'], ['Needs a person to run the host program.', 'Doesn’t need a person to spread it.']],
      ['copyright', 'a patent', ['Protects a work’s expression.', 'Protects an invention.'], ['Given automatically on creation.', 'Has to be applied for.']],
    ],
    truths: [
      ['A strong password mixes letters, digits and symbols.', 'A strong password is a common dictionary word.'],
      ['Two-factor authentication adds a second check.', 'Two-factor authentication removes the need for a password check.'],
      ['Data on a public network can be intercepted.', 'Data on a public network can never be intercepted.'],
    ],
    reason: [
      ['Software should be kept up to date.', 'Updates often fix security holes.'],
      ['Personal data must be protected.', 'It can be misused for fraud or identity theft.'],
    ],
    cases: [
      {
        scene: 'A student gets an email saying their school account will be closed unless they follow a link and type in their password. The address looks almost right, but has one wrong letter.',
        parts: [
          ['What kind of attack is this?', 'Phishing.', 1],
          ['What’s one sign that it’s fake?', 'The sender’s address is slightly wrong, or the message is pressing for urgent action.', 1],
          ['What should the student do?', 'Not click the link, and report the message to the school.', 1],
        ],
      },
    ],
  }),
  custom('object-output', [5, 'a', 2, 2], { type: 'output', format: 'output' }, (g) => {
    const start = g.int(2, 9);
    const by = g.int(2, 5);
    const code = `class Counter {\n  int value;\n  Counter(int v) {\n    value = v;\n  }\n  void add(int x) {\n    value = value + x;\n  }\n  public static void main(String[] args) {\n    Counter a = new Counter(${start});\n    Counter b = a;\n    b.add(${by});\n    System.out.println(a.value);\n  }\n}`;
    return outputOf(g, code);
  }),
  custom('complete-expression', [7, 'a', 3, 2], { type: 'complete', format: 'short' }, (g) => {
    const [a, b] = [g.int(2, 9), g.int(2, 9)];
    const code = (one: string, two: string, three: string) => inMain(`int a = ${a}, b = ${b};\ndouble mean = ${one};\nint bigger = ${two};\nboolean same = ${three};\nSystem.out.println(mean + " " + bigger + " " + same);`);
    return complete(g, code('?1?', '?2?', '?3?'), code('(a + b) / 2.0', 'a > b ? a : b', 'a == b'), [['?1? is (a + b) / 2.0, as dividing by 2 alone would drop the fraction.', 1], ['?2? is a > b ? a : b, using the conditional operator.', 1], ['?3? is a == b, a test of equality.', 1]], 'This program finds the mean and the larger of two integers, and tests if they are equal.');
  }),
  custom('design-digits', [8, 'a', 5, 2], { type: 'program', format: 'program' }, (g) => {
    const n = g.int(100, 9999);
    const code = `class Digits {\n  public static void main(String[] args) {\n    int n = ${n};\n    int sum = 0;\n    while (n > 0) {\n      sum = sum + n % 10;\n      n = n / 10;\n    }\n    System.out.println(sum);\n  }\n}`;
    return designClass(g, `Write a program that finds the sum of the digits of the number ${n}, using a while loop, and prints it.`, code, [
      ['Starts the sum at 0.', 1],
      ['Loops while the number is above 0.', 1],
      ['Adds the last digit, found with % 10.', 2],
      ['Removes that digit with / 10, and prints the sum.', 1],
    ]);
  }),
  custom('design-base', [1, 'a', 5, 3], { type: 'program', format: 'program' }, (g) => {
    const n = g.int(20, 200);
    const code = `class ToBinary {\n  public static void main(String[] args) {\n    int n = ${n};\n    String s = "";\n    while (n > 0) {\n      s = (n % 2) + s;\n      n = n / 2;\n    }\n    System.out.println(s);\n  }\n}`;
    return designClass(g, `Write a program that converts the decimal number ${n} to binary, and prints it as a string.`, code, [
      ['Starts with an empty string.', 1],
      ['Loops while the number is above 0.', 1],
      ['Puts each remainder on 2 at the front of the string.', 2],
      ['Halves the number, and prints the result.', 1],
    ]);
  }),
  // ---- Real-life questions.
  custom('cbq-door-logic', [3, 'a', 2, 2], { type: 'short', format: 'cbq', style: 'cbq-style' }, (g) => {
    const [name, on, why] = g.pick([
      ['AND', 'both A and B are 1', 'Only when both inputs are 1 does an AND gate give 1.'],
      ['OR', 'at least one of A and B is 1', 'An OR gate gives 1 when any input is 1.'],
      ['NAND', 'A and B aren’t both 1', 'A NAND gate gives 0 only when both inputs are 1.'],
      ['XOR', 'A and B differ', 'An XOR gate gives 1 only when its inputs differ.'],
    ]);
    return g.theory(`A lift’s motor should run when ${on}, where A and B are two sensors. (i) Which gate does this? (ii) Give a reason.`, [[`(i) ${name}.`, 1], [`(ii) ${why}`, 1]]);
  }),
  custom('cbq-fee-loop', [8, 'a', 2, 2], { type: 'output', format: 'cbq', style: 'cbq-style' }, (g) => {
    const fee = g.pick([100, 200, 500]);
    const rise = g.pick([10, 20, 50]);
    const years = g.int(2, 4);
    const code = inMain(`int fee = ${fee};\nfor (int year = 1; year <= ${years}; year++) {\n  fee = fee + ${rise};\n}\nSystem.out.println(fee);`);
    return outputOf(g, code, undefined, `A club’s yearly fee rises by the same amount each year. Write what this program prints.`);
  }),
  custom('cbq-storage-units', [1, 'a', 2, 1], { type: 'numerical', format: 'cbq', style: 'cbq-style' }, (g) => {
    const bytes = 2 ** g.int(4, 9);
    return {
      form: 'numeric',
      text: `A small sensor stores ${bytes} bytes of readings in its memory.`,
      parts: [
        g.answerPart('The size in bits', bytes * 8, 1, [{ label: 'A byte is 8 bits', math: [`${bytes} \\times 8 = ${bytes * 8}`] }]),
        g.answerPart('The size as a power of 2: the value of n in 2ⁿ bytes', Math.log2(bytes), 1, [{ label: 'Find the power', math: [`${bytes} = 2^{${Math.log2(bytes)}}`] }]),
      ],
    };
  }),
  custom('cbq-grade-if', [8, 'a', 2, 2], { type: 'output', format: 'cbq', style: 'cbq-style' }, (g) => {
    const mark = g.int(30, 95);
    const code = inMain(`int mark = ${mark};\nchar grade;\nif (mark >= 80) grade = 'A';\nelse if (mark >= 60) grade = 'B';\nelse if (mark >= 40) grade = 'C';\nelse grade = 'D';\nSystem.out.println(grade);`);
    return outputOf(g, code, undefined, 'A report card program gives a grade from a mark. Write what it prints.');
  }),
  ...rest(),
  ...derivationBlueprints('computerscience', 'XI', { custom } as never),
];

export default blueprints;
