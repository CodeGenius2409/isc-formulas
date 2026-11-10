// Written by hand: statements and scope, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('computerscience', 'XI');
const S = at(8, 'a');

const questions: BankDef[] = [
  match(S(3, 1), [['break', 'Leaves the loop at once'], ['continue', 'Skips to the next pass of the loop'], ['default', 'The case taken when no other matches']]),
  match(S(4, 2), [['for loop', 'Best when the number of passes is known'], ['while loop', 'Tests before each pass'], ['do-while loop', 'Runs at least once'], ['switch', 'Chooses among fixed values']]),
  match(S(3, 2), [['A local variable', 'Seen only inside its block'], ['An instance variable', 'One copy for each object'], ['A class variable', 'One copy for the whole class']]),
  match(S(4, 3), [['for (int i = 0; i < 5; i++)', 'Runs 5 times'], ['for (int i = 0; i <= 5; i++)', 'Runs 6 times'], ['for (int i = 5; i > 0; i -= 2)', 'Runs 3 times'], ['for (int i = 1; i < 1; i++)', 'Doesn’t run at all']]),
  match(S(3, 3), [['a > b ? a : b', 'The larger of a and b'], ['a < b ? a : b', 'The smaller of a and b'], ['a % 2 == 0 ? "even" : "odd"', 'Whether a is even']]),
];

export default questions;
