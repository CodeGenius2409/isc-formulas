// Written by hand: Input, output and data files. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, theory } = bank('computerscience', 'XI');
const S = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [11, 'a', marks, d];
const F = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [11, 'b', marks, d];

const questions: BankDef[] = [
  // ---- Scanner and tokens
  mcq(S(1, 1), 'Which Scanner method reads a whole line of text?', ['next()', 'nextLine()', 'nextInt()', 'hasNext()'], 1),
  mcq(S(1, 2), 'Scanner’s nextInt() is given the text “abc”. It throws:', ['ArithmeticException', 'InputMismatchException', 'NullPointerException', 'FileNotFoundException'], 1),
  theory('reason', S(1, 2), 'Give a reason: nextLine() straight after nextInt() can seem to read an empty string.', ['nextInt() leaves the end of the line in the input, and nextLine() reads only up to it.']),
  theory('short', S(2, 2), 'What do countTokens() and nextToken() do in a StringTokenizer?', ['countTokens() gives how many tokens are left.', 'nextToken() returns the next token as a String.']),
  // ---- Data files
  mcq(F(1, 2), 'To add text at the end of a file with FileWriter, without losing what’s there, you use:', ['new FileWriter("a.txt")', 'new FileWriter("a.txt", true)', 'new FileReader("a.txt")', 'new FileWriter("a.txt", false)'], 1),
  theory('reason', F(1, 2), 'Give a reason: a file should be closed after writing to it.', ['Buffered data is written out, and the file’s resources are freed, so nothing is lost.']),
];

export default questions;
