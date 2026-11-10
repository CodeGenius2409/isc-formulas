// Written by hand: statements and scope, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('computerscience', 'XI');
const S = at(8, 'a');

const questions: BankDef[] = [
  predict(S(2, 1), 'With int n = 0, predict how many times the body of while (n > 0) { … } runs, and of do { … } while (n > 0);.', 'The while loop’s body never runs, as the test fails first.', 'The do-while body runs once, as its test comes after the body.'),
  predict(S(2, 2), 'In a switch on the value 2, case 2 has no break, and case 3 prints "three". Predict the output.', 'case 2’s statements run, then case 3’s, so "three" is printed.', 'Without break, control falls through to the next case.'),
  predict(S(2, 2), 'Predict the output: int x = 7; System.out.println(x % 2 == 0 ? "even" : "odd");', 'odd', '7 % 2 is 1, so the condition is false and the second value is chosen.'),
  predict(S(3, 3), 'Predict the output, and how many times the inner loop runs in all: for (int i = 1; i <= 3; i++) for (int j = 1; j <= i; j++) System.out.print(j);', 'Output: 112123.', 'The inner loop runs 1, 2 and 3 times.', 'So 6 times in all.'),
  predict(S(2, 3), 'A variable int k is declared inside an if block, and used after the block. Predict what happens when the program is compiled.', 'A compile error.', 'k’s scope ends with the block, so it can’t be seen after it.'),
];

export default questions;
