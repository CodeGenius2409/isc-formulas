// Written by hand: Python strings, lists and tuples, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { program } = kit('computerscience', 'XII');
const A = at(7, 'a');
const B = at(7, 'b');
const C = at(7, 'c');

const questions: BankDef[] = [
  program(A(5, 1), 'Write a Python program that reads a sentence, and prints each word on its own line with its length after it.', ['Reads the sentence.', 'Uses split() to get the words.', 'A loop goes through them.', 'len() gives each length.', 'Prints the word and its length together.'], '```\nsentence = input()\nfor word in sentence.split():\n    print(word, len(word))\n```', 1),
  program(A(5, 2), 'Write a Python function is_palindrome(s) that ignores case and spaces, and returns True if s reads the same both ways. Use slicing to compare, and show one call.', ['def with a parameter.', 'lower() makes the case the same.', 'replace() removes the spaces.', 'Compares with the slice [::-1], and returns the result.', 'One call is shown, with the result printed.'], '```\ndef is_palindrome(s):\n    t = s.lower().replace(" ", "")\n    return t == t[::-1]\n\nprint(is_palindrome("Never odd or even"))\n```', 1),
  program(B(5, 2), 'Write a Python program with a list of marks. Print the highest and the lowest, then make a new list of those above the mean, and print it. Use a list comprehension.', ['A list of marks is set up.', 'max() and min(), or a loop, give the highest and lowest.', 'The mean is the sum over the length.', 'A list comprehension keeps those above it.', 'The new list is printed.'], '```\nmarks = [40, 72, 65, 88, 51]\nprint(max(marks), min(marks))\nmean = sum(marks) / len(marks)\nabove = [m for m in marks if m > mean]\nprint(above)\n```', 1),
  program(B(5, 3), 'Write a Python function merge(a, b) that takes two sorted lists and returns one sorted list, by comparing their front elements. Don’t use sort() or sorted().', ['def with two parameters.', 'Two positions start at 0, with an empty result.', 'A loop runs while both have elements left, taking the smaller.', 'Whatever is left of either list is added.', 'The result is returned.'], '```\ndef merge(a, b):\n    i = j = 0\n    out = []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            out.append(a[i])\n            i += 1\n        else:\n            out.append(b[j])\n            j += 1\n    return out + a[i:] + b[j:]\n```', 1),
  program(C(5, 2), 'Write a Python program that takes a tuple of (name, mark) pairs, prints the name with the highest mark, and makes a tuple of just the names. Explain in a comment why the pairs can’t be changed in place.', ['A tuple of pairs is set up.', 'A loop or max() finds the highest mark.', 'The name that goes with it is printed.', 'tuple() with a comprehension or a loop makes the names.', 'The comment says tuples are immutable.'], '```\n# Tuples are immutable, so a pair can only be replaced, not changed.\npupils = (("Asha", 88), ("Ravi", 72), ("Meena", 91))\nbest = pupils[0]\nfor p in pupils:\n    if p[1] > best[1]:\n        best = p\nprint(best[0])\nnames = tuple(p[0] for p in pupils)\nprint(names)\n```', 1),
];

export default questions;
