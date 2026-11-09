// Written by hand: Python, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long, program } = kit('computerscience', 'XI');
const A = at(12, 'a');

const questions: BankDef[] = [
  program(A(5, 1), 'Write a Python program that reads a whole number n and prints the sum of the whole numbers from 1 to n.', ['Reads the input and converts it with int().', 'A running total starts at 0.', 'A for loop uses range(1, n + 1).', 'The total grows inside the loop.', 'The total is printed after the loop.'], '```\nn = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total = total + i\nprint(total)\n```', 1),
  program(A(5, 2), 'Write a Python program that reads a word and prints how many vowels it has, counting small and capital letters alike.', ['Reads the word.', 'Makes the case uniform, with lower() or by testing both cases.', 'A loop goes through each character.', 'Tests membership of "aeiou" and counts.', 'Prints the count.'], '```\nword = input().lower()\ncount = 0\nfor ch in word:\n    if ch in "aeiou":\n        count += 1\nprint(count)\n```', 1),
  program(A(5, 2), 'Write a Python function is_prime(n) that returns True if n is prime and False otherwise, then use it to print the primes below 20.', ['def with a parameter.', 'Numbers below 2 give False.', 'A loop tests divisors, returning False on the first.', 'Returns True after the loop.', 'A loop below 20 prints those that pass.'], '```\ndef is_prime(n):\n    if n < 2:\n        return False\n    for d in range(2, n):\n        if n % d == 0:\n            return False\n    return True\n\nfor x in range(20):\n    if is_prime(x):\n        print(x)\n```', 1),
  long(A(5, 1), 'Answer each part about Python.\n(i) What does indentation do in Python? [1]\n(ii) State the types of 7, 7.0, "7" and True. [2]\n(iii) What do 17 // 5, 17 % 5 and 2 ** 5 give? [2]', ['(i) It marks which statements belong to a block, so it is part of the syntax.', '(ii) int and float.', '(ii) str and bool.', '(iii) 17 // 5 is 3 and 17 % 5 is 2.', '(iii) 2 ** 5 is 32.']),
  long(A(5, 2), 'Answer each part about Python.\n(i) Write what each of these prints when s = "PYTHON": s[0], s[-1], s[1:4], s[::2]. [2]\n(ii) What happens on s[0] = "J", and why? [1]\n(iii) Write one line that makes a new string with the J in place of the P. [2]', ['(i) P and N.', '(i) YTH and PTO.', '(ii) A TypeError, as strings are immutable.', ['(iii) s = "J" + s[1:] or an equivalent.', 2]]),
];

export default questions;
