// Written by hand: number systems, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('computerscience', 'XI');
const A = at(1, 'a');

const questions: BankDef[] = [
  long(A(10, 2), 'Answer each part, showing the working.\n(i) Convert (10110.101)₂ to decimal, to octal and to hexadecimal. [3]\n(ii) Convert (7A.C)₁₆ to binary. [2]\n(iii) Add (1011.01)₂ and (110.11)₂. [2]\n(iv) Find the 8-bit two’s complement of 00101100, and say what decimal number it stands for. [3]', ['(i) Place values give 16 + 4 + 2 + 0.5 + 0.125 = 22.625.', '(i) Grouping in threes from the point: 010 110.101 gives (26.5)₈.', '(i) Grouping in fours from the point: 0001 0110.1010 gives (16.A)₁₆.', ['(ii) Each digit as four bits: 7 = 0111, A = 1010, C = 1100, so (1111010.11)₂.', 2], ['(iii) (10010.00)₂, which is 11.25 + 6.75 = 18 in decimal.', 2], ['(iv) Invert to 11010011, then add 1: 11010100.', 2], '(iv) 00101100 is 44, so this stands for −44.']),
  long(A(10, 3), 'Answer each part, showing the working.\n(i) Using 8-bit two’s complement, work out 25 − 43, and check the answer by converting it back. [4]\n(ii) Convert (156)₁₀ to binary, octal and hexadecimal. [3]\n(iii) Convert (0.625)₁₀ to binary. Then say why (0.1)₁₀ has no exact binary form. [3]', ['(i) 25 is 00011001 and 43 is 00101011.', '(i) The two’s complement of 43 is 11010101.', '(i) The sum is 11101110, with no carry out.', '(i) Its two’s complement is 00010010, which is 18, so the answer is −18.', '(ii) (10011100)₂', '(ii) (234)₈', '(ii) (9C)₁₆', '(iii) Doubling gives 1.25, 0.5, 1.0, so the digits are (0.101)₂.', ['(iii) Doubling 0.1 repeats 0.2, 0.4, 0.8, 1.6, 1.2, 0.4 …, so the digits 0011 go on for ever.', 2]]),
];

export default questions;
