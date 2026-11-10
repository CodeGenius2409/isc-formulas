// Written by hand: statements and scope, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('computerscience', 'XI');
const S = at(8, 'a');

const questions: BankDef[] = [
  odd(S(2, 1), ['for', 'while', 'do-while', 'switch'], 'switch', 'It chooses between cases; the others are loops.'),
  odd(S(2, 2), ['if', 'if-else', 'switch', 'break'], 'break', 'It jumps out of a loop or switch; the others choose which statements run.'),
  odd(S(2, 2), ['for', 'while', 'if', 'do-while'], 'do-while', 'Its body always runs at least once; the others may run their bodies zero times.'),
  odd(S(2, 3), ['local variable', 'parameter', 'loop counter declared in for', 'instance variable'], 'instance variable', 'It lasts as long as its object; the others last only while their block or method runs.'),
  odd(S(2, 3), ['?:', '&&', '||', '!'], '?:', 'It is the conditional operator, giving one of two values; the others are logical operators.'),
];

export default questions;
