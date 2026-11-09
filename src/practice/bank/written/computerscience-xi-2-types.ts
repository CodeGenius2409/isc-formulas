// Written by hand: encodings, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('computerscience', 'XI');
const A = at(2, 'a');

const questions: BankDef[] = [
  long(A(10, 2), 'Answer each part.\n(i) In ASCII, A is 65 and a is 97. Write the codes for D and for g, and the 7-bit binary form of each. [4]\n(ii) What is the difference in code between a capital letter and its small form, and why does that make changing case quick? [2]\n(iii) Why was ASCII not enough for a text mixing Hindi and English? [2]\n(iv) UTF-8 is a variable-length encoding. State one benefit of that. [2]', ['(i) D is 68.', '(i) 68 is 1000100.', '(i) g is 103.', '(i) 103 is 1100111.', '(ii) The difference is 32.', '(ii) It is a single bit, so changing case only flips that bit.', ['(iii) ASCII has only 128 codes, all for English letters, digits and symbols, so it has none for Hindi’s letters.', 2], ['(iv) Common characters take one byte, so English text stays small, while every Unicode character can still be written.', 2]]),
];

export default questions;
