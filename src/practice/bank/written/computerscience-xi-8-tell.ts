// Written by hand: statements and scope, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('computerscience', 'XI');
const S = at(8, 'a');

const questions: BankDef[] = [
  tell(S(2, 1), 'Distinguish between while and do-while loops.', 'A while loop tests its condition before each pass, so its body may never run.', 'A do-while loop tests after each pass, so its body runs at least once.'),
  tell(S(2, 2), 'Distinguish between if-else-if and switch.', 'if-else-if can test any conditions, including ranges and different variables.', 'switch compares one expression with fixed values only.'),
  tell(S(2, 2), 'Distinguish between the scope of a local variable and of an instance variable.', 'A local variable can be used only inside the block or method where it is declared.', 'An instance variable can be used in every method of the class, for as long as its object exists.'),
  tell(S(2, 3), 'Distinguish between the ternary operator and an if-else statement.', 'The ternary operator, c ? a : b, is an expression that gives a value.', 'An if-else is a statement that chooses which statements run, and gives no value itself.'),
];

export default questions;
