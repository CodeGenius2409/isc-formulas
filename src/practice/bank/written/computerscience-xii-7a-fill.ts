// Written by hand: Python strings, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The tracer runs only Java, so every Python output here was traced by hand.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar, program } = kit('computerscience', 'XII');
const S = at(7, 'a');

const questions: BankDef[] = [
  predict(S(2, 1), 'Given s = "computer", predict the values of s[-3:] and s[::2].', 's[-3:] is "ter", the last three characters.', 's[::2] takes every second character from the start: "cmue".'),
  predict(S(2, 1), 'Predict the value of "ab" * 3 + "c".', 'Repetition comes first: "ab" * 3 is "ababab".', 'Joining "c" gives "abababc".'),
  predict(S(2, 2), 'Predict what happens when s = "hello" is followed by s[0] = "H".', 'Python raises a TypeError: a str object doesn’t support item assignment.', 'Strings are immutable; to get "Hello", a new string is made, such as s = "H" + s[1:].'),

  odd(S(2, 1), ['upper()', 'lower()', 'title()', 'len()'], 'len()', 'It is a built-in function, called as len(s); the others are string methods, called as s.upper() and so on.'),
  odd(S(2, 2), ['"py" in "python"', '"Py" in "python"', '"thon" in "python"', '"" in "python"'], '"Py" in "python"', 'It is False, as in is case-sensitive; the others are all True.'),
  odd(S(2, 2), ['find()', 'index()', 'count()', 'split()'], 'split()', 'It returns a list of strings; the others return a whole number.'),

  long(S(5, 1), 'Given s = "Programming", find each.\n(a) len(s) [1]\n(b) s[3:7] [1]\n(c) s.count("m") and s.find("g") [1]\n(d) s[::-1] [1]\n(e) s.replace("m", "M", 1) [1]', '(a) 11.', '(b) "gram".', '(c) 2 and 3.', '(d) "gnimmargorP".', '(e) "PrograMming": only the first "m" is replaced.'),
  long(S(5, 2), 'Study this code.\n```\ns = "Hello World"\ncount = 0\nfor ch in s:\n    if ch in "aeiouAEIOU":\n        count += 1\nprint(count)\n```\n(a) What does it print? [1]\n(b) What does the line for ch in s do? [1]\n(c) Rewrite the loop with while and an index. [2]\n(d) Why are the vowels given in both cases? [1]', '(a) 3: e, o and o.', '(b) It takes each character of s in turn, from first to last.', '(c) i = 0, then while i < len(s): test s[i] in the same way, and add 1 to i at the end of each pass.', '(c) Without the i += 1 the loop would never end.', '(d) in is case-sensitive, so capital vowels would be missed otherwise.'),
  long(S(5, 2), 'Given t = "  Data Science  ", with two spaces at each end, find each.\n(a) t.strip() [1]\n(b) t.split() [1]\n(c) "-".join(t.split()) [1]\n(d) t.strip().lower().startswith("data") [1]\n(e) t.isalpha() [1]', '(a) "Data Science".', '(b) [\'Data\', \'Science\']: split() with no argument splits on runs of whitespace and drops the ends.', '(c) "Data-Science".', '(d) True.', '(e) False, as spaces aren’t letters.'),

  tell(S(2, 1), 'Distinguish between the find() and index() methods of a string.', 'Both return the position of the first match of a substring.', 'When there is no match, find() returns -1, while index() raises a ValueError.'),
  tell(S(2, 1), 'Distinguish between the split() and join() string methods.', 'split() breaks a string into a list of parts, at a separator or at whitespace: "a b".split() gives [\'a\', \'b\'].', 'join() does the opposite, joining a list of strings with the string it is called on between them: "-".join([\'a\', \'b\']) gives "a-b".'),
  tell(S(2, 1), 'Distinguish between s.upper() and s.isupper().', 's.upper() returns a new string with every letter in upper case.', 's.isupper() returns True or False, telling whether all the letters in s are already upper case.'),

  match(S(4, 1), [['"abc" + "de"', '"abcde"'], ['"ab" * 2', '"abab"'], ['"b" in "abc"', 'True'], ['"abcdef"[1:4]', '"bcd"']]),
  match(S(4, 1), [['len("hello")', '5'], ['"hello".find("l")', '2'], ['"hello".index("o")', '4'], ['"hello".find("z")', '-1']]),
  match(S(4, 2), [['capitalize()', 'the first character in upper case, the rest in lower case'], ['title()', 'the first letter of each word in upper case'], ['swapcase()', 'upper and lower case swapped'], ['strip()', 'spaces removed from both ends']]),

  reason(S(2, 2), 'For s = "hello", give a reason: s[10] raises an IndexError, but s[2:10] doesn’t.', 'Indexing must give a position that exists, and s has only positions 0 to 4.', 'A slice is cut short at the end of the string, so s[2:10] simply gives "llo".'),
  reason(S(2, 1), 'Give a reason: s.replace("a", "b") must be assigned to a variable to keep the change.', 'Strings are immutable, so replace() can’t change s.', 'It returns a new string, which is lost unless it is stored, as in s = s.replace("a", "b").'),
  reason(S(2, 2), 'Give a reason: "Apple" < "apple" is True in Python.', 'Strings are compared character by character, by their Unicode values.', '"A" has the value 65 and "a" has 97, so "Apple" comes first.'),

  short(S(2, 1), 'Write the output of print("Python"[1:4], "Python"[-2]).', '"Python"[1:4] is "yth", and "Python"[-2] is "o".', 'print separates them with a space: yth o'),
  short(S(2, 1), 'Write one statement that gives the number of words in a string s, and one that gives s reversed.', 'len(s.split())', 's[::-1]'),
  short(S(2, 2), 'What do isdigit() and isalnum() return for "2025" and for "ab12"?', '"2025": isdigit() is True and isalnum() is True.', '"ab12": isdigit() is False, as it has letters, and isalnum() is True.'),

  ar(S(1, 2), 'Strings in Python are immutable.', 'A string method such as upper() returns a new string.', 2, 'Both are true, but R is a result of immutability, not its cause; strings are immutable by the design of the language.'),
  ar(S(1, 1), '"abc"[::-1] gives "cba".', 'A step of -1 goes through the string backwards.', 1, 'With no start or stop, a step of -1 runs from the last character to the first.'),
  ar(S(1, 1), '"5" + 5 gives "55".', '+ joins two strings.', 4, '"5" + 5 raises a TypeError, as a str and an int can’t be joined; "5" + str(5) gives "55".'),

  program(S(5, 1), 'Write a Python program that reads a string, and prints how many upper-case letters, lower-case letters, digits and other characters it has.', [['Reads the string with input().', 1], ['A loop goes through each character.', 1], ['isupper(), islower() and isdigit(), with an else for the rest.', 2], ['Prints the four counts.', 1]], '```\ns = input("Enter a string: ")\nupper = lower = digits = other = 0\nfor ch in s:\n    if ch.isupper():\n        upper += 1\n    elif ch.islower():\n        lower += 1\n    elif ch.isdigit():\n        digits += 1\n    else:\n        other += 1\nprint("Upper:", upper)\nprint("Lower:", lower)\nprint("Digits:", digits)\nprint("Others:", other)\n```', 1),
];

export default questions;
