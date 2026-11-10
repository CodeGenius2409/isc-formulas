// Written by hand: statements and scope, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('computerscience', 'XI');
const S = at(8, 'a');

const questions: BankDef[] = [
  reason(S(1, 1), 'Give a reason: a do-while loop always runs its body at least once.', 'Its condition is tested after the body, not before.'),
  reason(S(2, 2), 'Give a reason: leaving out break in a switch case makes the next case run too.', 'A case label only marks where to start.', 'Without break, the statements carry on, falling through into the next case.'),
  reason(S(2, 2), 'Give a reason: a variable declared inside a for loop can’t be used after the loop ends.', 'Its scope is the block of the loop.', 'Outside that block the name isn’t visible, so the compiler rejects its use.'),
  reason(S(2, 3), 'Give a reason: if (x = 5) is an error in Java, though it is allowed in some other languages.', 'x = 5 is an assignment, whose value is an int.', 'Java’s if needs a boolean condition, and won’t turn an int into one.'),
  reason(S(1, 2), 'Give a reason: continue in a for loop still runs the loop’s update.', 'It skips the rest of the body only, and goes on to the update and the test.'),
  tell(S(2, 1), 'Distinguish between break and continue.', 'break leaves the loop or switch at once.', 'continue skips the rest of this pass, and goes on to the next.'),
  short(S(2, 2), 'Rewrite using the ternary operator: if (a > b) max = a; else max = b;', 'max = (a > b) ? a : b;', 'The condition comes first, then the value if true, then the value if false.'),
  short(S(2, 2), 'How many times does this loop run, and what is i afterwards? int i = 1; while (i < 20) i = i * 3;', 'i goes 1, 3, 9, 27, so the body runs 3 times.', 'Afterwards, i is 27.'),
  short(S(3, 2), 'Name the three kinds of loop in Java. Which tests its condition before the body, and which after?', 'for, while and do-while.', 'for and while test it before the body.', 'do-while tests it after the body.'),
  short(S(3, 3), 'Give the output: for (int i = 1; i <= 10; i++) { if (i % 3 == 0) continue; if (i > 7) break; System.out.print(i + " "); }', 'Multiples of 3 are skipped by continue.', 'At i = 8 the loop ends by break.', 'Output: 1 2 4 5 7'),
];

export default questions;
