// Python's own error messages, said again in plain words. The tracer always shows Python's message as it is,
// since that is what a student will meet in an exam room or on a real computer; this sits beside it.
import type { PyError } from './trace';

type Rule = [RegExp, string | ((m: RegExpMatchArray) => string)];

const RULES: Record<string, Rule[]> = {
  IndexError: [
    [/list (assignment )?index out of range/, 'The program used a position the list doesn’t have. A list of n items has positions 0 to n − 1, and −1 to −n from the end.'],
    [/string index out of range/, 'The program used a position the string doesn’t have. A string of n characters has positions 0 to n − 1.'],
    [/tuple index out of range/, 'The program used a position the tuple doesn’t have. A tuple of n items has positions 0 to n − 1.'],
    [/pop from empty list/, 'pop() was used on a list with nothing left in it.'],
  ],
  TypeError: [
    [/can only concatenate str \(not "(\w+)"\) to str/, (m) => `+ can’t join a string and ${article(m[1])}. Turn the value into a string first, with str(), or print them with a comma between.`],
    [/unsupported operand type\(s\) for (\S+): '(\w+)' and '(\w+)'/, (m) => `${m[1]} doesn’t work between ${article(m[2])} and ${article(m[3])}. If one of them came from input(), it is a string: use int() or float() on it first.`],
    [/'str' object does not support item assignment/, 'A string can’t be changed in place. Build a new string instead, for example with slicing and +.'],
    [/'tuple' object does not support item assignment/, 'A tuple can’t be changed once it is made. Use a list if the items need to change.'],
    [/object of type '(\w+)' has no len\(\)/, (m) => `len() needs a string, list, tuple or dictionary, not ${article(m[1])}.`],
    [/'(\w+)' object is not iterable/, (m) => `A for loop needs something with items to go through, such as a list, a string or range(n), not ${article(m[1])}.`],
    [/'NoneType' object is not subscriptable/, 'Something here is None, and None has no items. A method such as sort() or append() changes the list and gives back None, so its result can’t be used as a list.'],
    [/'(\w+)' object is not subscriptable/, (m) => `[ ] works on strings, lists, tuples and dictionaries, not on ${article(m[1])}.`],
    [/'(\w+)' object is not callable/, (m) => `Brackets after a name call it, but this ${m[1]} isn’t a function. A variable may have the same name as a function.`],
    [/missing (\d+) required positional argument/, 'The function was called with fewer values than it needs. Give one for each name in its def line that has no default.'],
    [/takes (\d+) positional arguments? but (\d+) (?:was|were) given/, (m) => `The function takes ${m[1]} value${m[1] === '1' ? '' : 's'} but was given ${m[2]}.`],
    [/'(<|>|<=|>=)' not supported between instances of '(\w+)' and '(\w+)'/, (m) => `${m[1]} can’t compare ${article(m[2])} with ${article(m[3])}. Convert one of them first, so both are numbers or both strings.`],
    [/can't multiply sequence by non-int/, 'A string or list can only be repeated a whole number of times.'],
  ],
  ValueError: [
    [/invalid literal for int\(\) with base 10: (.*)/, (m) => `int() was given ${m[1]}, which isn’t a whole number. Check what was typed into the input box.`],
    [/could not convert string to float: (.*)/, (m) => `float() was given ${m[1]}, which isn’t a number.`],
    [/list\.remove\(x\): x not in list/, 'remove() looks for the value to delete, and the list doesn’t have it. Test with in first.'],
    [/is not in list/, 'index() looks for the value, and the list doesn’t have it.'],
    [/substring not found/, 'index() looks for the text, and the string doesn’t have it. find() gives −1 instead of an error.'],
    [/tuple\.index\(x\): x not in tuple/, 'index() looks for the value, and the tuple doesn’t have it.'],
    [/too many values to unpack/, 'There are more values than names on the left of =. Give one name for each value.'],
    [/not enough values to unpack/, 'There are fewer values than names on the left of =. Give one name for each value.'],
    [/math domain error/, 'This maths function can’t take that value, such as the square root of a negative number.'],
  ],
  ZeroDivisionError: [[/./, 'The program divided by zero, with /, // or %. Check the value on the right before dividing.']],
  NameError: [
    [/name '(\w+)' is not defined. Did you mean: '(\w+)'\?/, (m) => `There is no variable or function called ${m[1]}. Python suggests ${m[2]}, which has a similar spelling.`],
    [/name '(\w+)' is not defined/, (m) => `There is no variable or function called ${m[1]} at this point. It may be misspelt, or used before it is given a value. Names are case-sensitive.`],
  ],
  UnboundLocalError: [[/cannot access local variable '(\w+)'/, (m) => `${m[1]} is given a value somewhere in this function, so Python treats it as the function’s own variable, which has no value yet. Pass it in as a parameter, or declare it with global.`]],
  KeyError: [[/./, 'The dictionary has no such key. Use in to check first, or get() for a default.']],
  AttributeError: [
    [/'list' object has no attribute 'push'/, 'Lists have append(), not push().'],
    [/'str' object has no attribute '(append|remove|insert|pop|sort|reverse)'/, (m) => `Strings can’t be changed, so they have no ${m[1]}(). Make a new string, or use a list.`],
    [/'tuple' object has no attribute '(\w+)'/, (m) => `Tuples can’t be changed, so they have no ${m[1]}(). Use a list instead.`],
    [/'(\w+)' object has no attribute '(\w+)'/, (m) => `${article(m[1], true)} has no method or value called ${m[2]}.`],
  ],
  RecursionError: [[/./, 'A function kept calling itself and never reached a case that returns without calling again. Check the base case, and that each call moves towards it.']],
  EOFError: [[/./, 'The program asked for more input than the Input box has. Add a line to the box for each input(), then trace again.']],
  OverflowError: [[/./, 'The result is too large for a decimal number.']],
  ModuleNotFoundError: [[/No module named '(\w+)'/, (m) => `The tracer has only the parts of Python’s library that the syllabus uses, such as math and random, so ${m[1]} isn’t here.`]],
  IndentationError: [
    [/expected an indented block after '(\w+)' statement on line (\d+)/, (m) => `The line after the ${m[1]} on line ${m[2]} must be indented, as the ${m[1]}'s block.`],
    [/expected an indented block/, 'The line after one that ends in a colon must be indented, as its block.'],
    [/unexpected indent/, 'This line is indented more than it should be. Only the lines of a block, after a colon, are indented.'],
    [/unindent does not match any outer indentation level/, 'This line’s indent doesn’t line up with any line above it. Use the same number of spaces for every line of a block.'],
  ],
  TabError: [[/./, 'Tabs and spaces are mixed in the indentation. Use spaces only; the editor puts in four for each Tab.']],
  SyntaxError: [
    [/'(.)' was never closed/, (m) => `A ${m[1]} is opened here and not closed.`],
    [/unterminated string literal/, 'A string starts here and has no closing quote on the same line.'],
    [/expected ':'/, 'This line needs a colon at the end, as if, elif, else, for, while and def lines do.'],
    [/Maybe you meant '==' or ':=' instead of '='/, 'A condition compares with ==. A single = gives a value to a variable.'],
    [/cannot assign to/, 'The left of = must be a name, or an item or slice of one.'],
    [/invalid syntax/, 'Python can’t read this line. Check for a missing bracket, quote, comma or colon, or a keyword used as a name.'],
  ],
};

function article(type: string, capital = false): string {
  const names: Record<string, string> = { str: 'string', int: 'whole number', float: 'decimal number', list: 'list', tuple: 'tuple', dict: 'dictionary', NoneType: 'None', bool: 'True or False value', set: 'set', function: 'function', range: 'range' };
  const word = names[type] ?? `${type} value`;
  const phrase = word === 'None' ? 'None' : `${/^[aeiou]/.test(word) ? 'an' : 'a'} ${word}`;
  return capital ? phrase[0].toUpperCase() + phrase.slice(1) : phrase;
}

/** Plain words for an error, or nothing if there is nothing useful to add to Python's own. */
export function explainError(error: PyError): string | null {
  const message = error.text.replace(/^\w+: /, '');
  for (const [pattern, say] of RULES[error.type] ?? []) {
    const m = message.match(pattern);
    if (m) return typeof say === 'string' ? say : say(m);
  }
  return null;
}

/** A gentle note when a program goes beyond the ISC Python units. It still runs, as it would anywhere. */
export function beyondNote(beyond: string[]): string | null {
  if (!beyond.length) return null;
  const list = beyond.length === 1 ? beyond[0] : `${beyond.slice(0, -1).join(', ')} and ${beyond[beyond.length - 1]}`;
  return `This program uses ${list}, which the ISC Python units don’t cover. It runs as it would in any Python.`;
}

