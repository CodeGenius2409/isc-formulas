// Written by hand: statements and scope, long answers in parts. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('computerscience', 'XI');
const S = at(8, 'a');

const questions: BankDef[] = [
  long(S(5, 1), 'Answer each part on loops.\n(a) Write a for loop that prints the even numbers from 2 to 20. [2]\n(b) Rewrite it as a while loop. [2]\n(c) How many times does its body run? [1]', '(a) for (int i = 2; i <= 20; i += 2) System.out.println(i);', '(a) The counter starts at 2, rises by 2, and stops after 20.', '(b) int i = 2; while (i <= 20) { System.out.println(i); i += 2; }', '(b) The start goes before the loop, and the update at the end of its body.', '(c) 10 times.'),
  long(S(5, 2), 'Answer each part on switch.\n(a) Write a switch statement that prints the name of a day for d = 1 to 3, and "Invalid" otherwise. [3]\n(b) What does break do in each case? [1]\n(c) What happens if d is 2 and the break after case 2 is left out? [1]', '(a) switch (d) { case 1: System.out.println("Monday"); break;', '(a) case 2: System.out.println("Tuesday"); break; case 3: System.out.println("Wednesday"); break;', '(a) default: System.out.println("Invalid"); }', '(b) It ends the switch, so no other case runs.', '(c) "Tuesday" and then "Wednesday" are printed, as control falls through.'),
  long(S(5, 2), 'Answer each part on this code: int t = 0; for (int k = 2; k <= 6; k++) { if (k == 4) continue; t += k; } System.out.println(t);\n(a) Trace it, giving t after each pass. [3]\n(b) What is printed? [1]\n(c) What would be printed with break in place of continue? [1]', '(a) k = 2: t = 2. k = 3: t = 5.', '(a) k = 4: skipped by continue, so t stays 5.', '(a) k = 5: t = 10. k = 6: t = 16.', '(b) 16.', '(c) 5, as the loop ends when k reaches 4.'),
  long(S(5, 3), 'Answer each part on scope.\n(a) What is the scope of a variable? [1]\n(b) Explain the scope of a local variable, a parameter and an instance variable. [3]\n(c) What happens if a local variable has the same name as an instance variable? [1]', '(a) The part of the program in which the variable can be used.', '(b) A local variable can be used only inside the block where it is declared, from its declaration on.', '(b) A parameter can be used anywhere in its method.', '(b) An instance variable can be used in every method of its class.', '(c) The local variable hides the instance variable inside its block; this.name reaches the instance variable.'),
  long(S(5, 3), 'Answer each part on nested loops.\n(a) Write nested loops that print this pattern:\n*\n* *\n* * *\n* * * * [3]\n(b) How many stars are printed in all? [1]\n(c) What changes to print n rows? [1]', '(a) for (int r = 1; r <= 4; r++) {', '(a) for (int c = 1; c <= r; c++) System.out.print("* ");', '(a) System.out.println(); }', '(b) 1 + 2 + 3 + 4 = 10.', '(c) The outer loop’s limit 4 becomes n.'),
];

export default questions;
