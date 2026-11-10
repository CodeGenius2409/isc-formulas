// Written by hand: number systems, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, sketch, table } from '../figures';

const { figure, predict, odd, tell, match, reason, short, ar } = kit('computerscience', 'XI');
const N = at(1, 'a');

/** Bit groups in boxes, left to right, with the digit each gives written under it. */
const groups = (y: number, bits: string[], digits: string[], x0: number) => {
  let x = x0;
  return bits.flatMap((b, i) => {
    const w = b.length * 12 + 12;
    const out = [{ t: 'box' as const, x, y, w, h: 26 }, label(x + w / 2, y + 18, b), label(x + w / 2, y + 46, digits[i])];
    x += w + 8;
    return out;
  });
};

const questions: BankDef[] = [
  figure(N(2, 1), 'The table shows decimal 37 being changed to binary by dividing by 2 again and again. Find P and Q, and read off the binary number, saying in which order the remainders are read.', ['P = 4 and Q = 1, as 9 ÷ 2 = 4 remainder 1.', 'The remainders are read from the bottom up: 37 = (100101)₂.'], {
    shown: table(['Number', 'Quotient on ÷ 2', 'Remainder'], [['37', '18', '1'], ['18', '9', '0'], ['9', 'P', 'Q'], ['4', '2', '0'], ['2', '1', '0'], ['1', '0', '1']]),
  }),
  figure(N(2, 1), 'Draw a place-value table for the hexadecimal number 2B7, and use it to change the number to decimal.', ['The place values are 16², 16¹ and 16⁰, that is 256, 16 and 1, and B stands for 11.', '2 × 256 + 11 × 16 + 7 × 1 = 512 + 176 + 7 = 695.'], {
    answer: table(['Place value', '16² = 256', '16¹ = 16', '16⁰ = 1'], [['Digit', '2', 'B = 11', '7'], ['Digit × place value', '512', '176', '7']], 'Total: 512 + 176 + 7 = 695.'),
  }),
  figure(N(2, 2), 'Show, by grouping its bits, how (1101011010)₂ is changed to octal and to hexadecimal.', ['In threes from the right, 1 101 011 010, giving (1532)₈.', 'In fours from the right, 11 0101 1010, giving (35A)₁₆.'], {
    answer: sketch(320, 165, 'The bits 1101011010 split from the right into groups of three, 1, 101, 011 and 010, each in a box, with the octal digits 1, 5, 3 and 2 under them. Below, the same bits split into groups of four, 11, 0101 and 1010, with the hexadecimal digits 3, 5 and A under them.', [
      label(10, 20, 'In threes, for octal:', 'start'), ...groups(28, ['1', '101', '011', '010'], ['1', '5', '3', '2'], 10),
      label(10, 98, 'In fours, for hexadecimal:', 'start'), ...groups(106, ['11', '0101', '1010'], ['3', '5', 'A'], 10),
    ]),
  }),

  predict(N(2, 1), 'A 0 is written on the right-hand end of a binary number. Predict what happens to its value, and what happens if its last bit is removed instead.', 'Its value doubles, as every bit moves up to a place worth twice as much.', 'Removing the last bit halves it, dropping any remainder: 1011 (11) becomes 101 (5).'),
  predict(N(2, 2), 'Predict how many digits decimal 1000 needs in binary, in octal and in hexadecimal, and write it in each.', 'In binary it needs 10 bits: (1111101000)₂.', 'In octal it needs 4 digits, (1750)₈, and in hexadecimal 3, (3E8)₁₆.'),
  predict(N(2, 2), 'The 4-bit numbers 1011 and 0110 are added in a register that holds only 4 bits. Predict what the register holds, and what is lost.', '11 + 6 = 17 = (10001)₂, so the register holds 0001.', 'The carry out of the fourth bit, worth 16, is lost: an overflow.'),

  odd(N(2, 1), ['(17)₈', '(F)₁₆', '(1111)₂', '(16)₁₀'], '(16)₁₀', 'It is sixteen; the other three are all fifteen.'),
  odd(N(2, 1), ['A7', '3F', '19', 'G2'], 'G2', 'G isn’t a hexadecimal digit, so G2 isn’t a hexadecimal number; the others are.'),
  odd(N(2, 2), ['the base of the octal system', 'twice the number of bits in a nibble', '2³', 'the number of hexadecimal digits in a byte'], 'the number of hexadecimal digits in a byte', 'It is 2; the other three are all 8.'),

  tell(N(2, 1), 'Distinguish between the octal and the hexadecimal number systems.', 'Octal has base 8 and uses the digits 0 to 7; each octal digit stands for three bits.', 'Hexadecimal has base 16 and uses 0 to 9 and A to F; each hexadecimal digit stands for four bits.'),
  tell(N(2, 2), 'Distinguish between the 1’s complement and the 2’s complement of a binary number, with 0110 as an example.', 'The 1’s complement turns every 0 into 1 and every 1 into 0: 1001.', 'The 2’s complement is the 1’s complement plus 1: 1010.'),
  tell(N(2, 2), 'Distinguish between unsigned and signed 8-bit numbers, giving the range of each.', 'Unsigned, all eight bits give the size, from 0 to 255.', 'Signed in 2’s complement, the leftmost bit shows the sign, and the range is −128 to 127.'),

  match(N(4, 1), [['(1010)₂', '10'], ['(17)₈', '15'], ['(1C)₁₆', '28'], ['(100)₈', '64']]),
  match(N(4, 1), [['Base 2', 'the digits 0 and 1'], ['Base 8', 'the digits 0 to 7'], ['Base 10', 'the digits 0 to 9'], ['Base 16', 'the digits 0 to 9 and A to F']]),
  match(N(4, 2), [['(1011)₂ + (0110)₂', '(10001)₂'], ['(1101)₂ − (0110)₂', '(0111)₂'], ['(101)₂ × (11)₂', '(1111)₂'], ['(7)₈ + (5)₈', '(14)₈']]),

  reason(N(2, 1), 'Why does each octal digit stand for exactly three bits?', 'The base of octal is 8, and 8 = 2³.', 'So three bits give exactly the eight values 000 to 111, one for each octal digit.'),
  reason(N(2, 1), 'Why do computers work in binary?', 'Their circuits are built from switches that are either on or off.', 'Two states match exactly the two binary digits, 1 and 0.'),
  reason(N(2, 3), 'Why can’t decimal 0.1 be written exactly in binary?', 'Multiplying the fraction by 2 again and again gives the bits 0.000110011…, with 0011 repeating for ever.', 'It never ends, as 1/10 can’t be made from a finite sum of powers of ½.'),

  short(N(2, 2), 'Multiply (1101)₂ by (101)₂, showing the working, and check the answer in decimal.', 'The partial products are 1101 and 110100, and 1101 + 110100 = (1000001)₂.', 'Check: 13 × 5 = 65, and (1000001)₂ = 64 + 1 = 65.'),

  ar(N(1, 1), '(0.5)₁₀ = (0.1)₂.', 'The first place after the binary point is worth 2⁻¹.', 1, 'A 1 in that place is worth ½ = 0.5.'),
  ar(N(1, 1), '(FF)₁₆ = 255.', 'Hexadecimal is often used to write memory addresses.', 2, 'Both are true, but the value comes from 15 × 16 + 15 = 255.'),
  ar(N(1, 2), '(25)₈ is greater than (25)₁₀.', 'In octal the second place from the right is worth 8.', 4, '(25)₈ = 2 × 8 + 5 = 21, which is less than 25.'),
];

export default questions;
