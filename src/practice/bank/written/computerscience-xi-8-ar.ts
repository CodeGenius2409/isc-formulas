// Written by hand: statements and scope, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('computerscience', 'XI');
const S = at(8, 'a');

const questions: BankDef[] = [
  ar(S(1, 1), 'A do-while loop always runs its body at least once.', 'It tests its condition after the body.', 1, 'The test comes too late to stop the first pass.'),
  ar(S(1, 2), 'A switch statement can test whether a number lies between 10 and 20.', 'Each case of a switch compares the expression with one fixed value.', 4, 'switch can’t test a range; if-else-if is used for that.'),
  ar(S(1, 2), 'A variable declared inside a loop can be used after the loop ends.', 'A variable’s scope is the block in which it is declared.', 4, 'Its scope ends with the loop’s block, so it can’t be used after it.'),
  ar(S(1, 3), 'continue inside a for loop skips the loop’s update.', 'continue skips the rest of the body for this pass.', 4, 'After continue, the update still runs, and then the test.'),
  ar(S(1, 3), 'Leaving out break in a switch case can make the next case run too.', 'Case labels only mark where execution begins.', 1, 'Without break, execution falls through into the following cases.'),
];

export default questions;
