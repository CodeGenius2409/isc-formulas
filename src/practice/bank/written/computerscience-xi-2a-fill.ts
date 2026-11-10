// Written by hand: character encodings, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('computerscience', 'XI');
const E = at(2, 'a');

const questions: BankDef[] = [
  figure(E(3, 1), 'The table gives the ASCII codes of some characters, with three left blank. Find P, Q and R.', ['P = 90, as Z is 25 letters after A, and 65 + 25 = 90.', 'Q = 122, as z is 25 after a: 97 + 25 = 122.', 'R = 57, as the digits run in order from 48: 48 + 9 = 57.'], {
    shown: table(['Character', 'ASCII code'], [['A', '65'], ['B', '66'], ['Z', 'P'], ['a', '97'], ['z', 'Q'], ['0', '48'], ['9', 'R']]),
  }),
  figure(E(3, 2), 'Make a table comparing ASCII, ISCII and Unicode by the bits each uses for a character, how many characters it can hold, and the scripts it covers.', ['ASCII: 7 bits, 128 characters, English letters, digits, signs and control codes.', 'ISCII: 8 bits, 256 characters, the ASCII set in its lower half and Indian scripts in its upper half.', 'Unicode: over a million code points, stored as 8-, 16- or 32-bit units in UTF-8, UTF-16 or UTF-32, for nearly every script in the world.'], {
    answer: table(['Code', 'Bits for a character', 'Characters', 'Scripts'], [['ASCII', '7', '128', 'English letters, digits, signs'], ['ISCII', '8', '256', 'ASCII and the Indian scripts'], ['Unicode', '8, 16 or 32 bits a unit', 'over a million code points', 'nearly every script']]),
  }),
  figure(E(2, 1), 'Draw the eight bits of the byte that stores the letter K in ASCII, and show how they are found.', ['K is 10 letters after A, so its code is 65 + 10 = 75 = 64 + 8 + 2 + 1, which is 1001011 in 7 bits.', 'In a byte, a 0 is put in front: 01001011.'], {
    answer: sketch(320, 110, 'Eight boxes in a row, for bit positions 7 down to 0, holding 0, 1, 0, 0, 1, 0, 1 and 1. Above them are the place values 128, 64, 32, 16, 8, 4, 2 and 1. Below, 64 + 8 + 2 + 1 = 75.', [
      ...['0', '1', '0', '0', '1', '0', '1', '1'].flatMap((b, i) => [{ t: 'box' as const, x: 20 + 35 * i, y: 36, w: 32, h: 30 }, label(36 + 35 * i, 56, b), label(36 + 35 * i, 28, `${2 ** (7 - i)}`)]),
      label(160, 96, '64 + 8 + 2 + 1 = 75, the code of K'),
    ]),
  }),

  predict(E(2, 1), 'A program adds 32 to the ASCII code of each letter of “HELLO”. Predict what it prints.', 'Each capital letter’s code becomes that of its small letter, as small letters are 32 higher.', 'So it prints “hello”.'),
  predict(E(2, 2), 'A Hindi word in Devanagari is typed into a program that can store only ASCII. Predict what happens, and what code is needed instead.', 'ASCII has no codes for Devanagari letters, so the word is lost or shows as question marks or wrong symbols.', 'A code with Indian scripts, such as Unicode or ISCII, is needed.'),
  predict(E(2, 2), 'Predict how many bytes the text “Hi” takes in UTF-8 and in UTF-16.', 'In UTF-8 each of these letters takes one byte, as for ASCII: 2 bytes.', 'In UTF-16 each takes one 16-bit unit: 4 bytes.'),

  odd(E(2, 1), ['ASCII', 'ISCII', 'Unicode', 'binary'], 'binary', 'It is a number system; the others are codes for characters.'),
  odd(E(2, 1), ['65', '97', '48', '128'], '128', 'It isn’t a standard ASCII code, which runs from 0 to 127; the others are the codes of A, a and 0.'),
  odd(E(2, 2), ['UTF-8', 'UTF-16', 'UTF-32', 'ISCII'], 'ISCII', 'It isn’t a way of storing Unicode; the other three are.'),

  long(E(5, 2), 'Answer each part on the word “Cat”.\n(a) Write the ASCII code of each letter, in decimal and in 7-bit binary. [3]\n(b) How many bytes does it take in ASCII stored a byte to a letter, and in UTF-16? [2]', '(a) C = 67 = 1000011.', '(a) a = 97 = 1100001.', '(a) t = 116 = 1110100.', '(b) In ASCII, 3 bytes, one for each letter.', '(b) In UTF-16, 6 bytes, two for each letter.'),

  tell(E(2, 1), 'Distinguish between a character and its code.', 'A character is a symbol people read, such as the letter A or the digit 7.', 'Its code is the number a computer stores for it, such as 65 for A in ASCII.'),
  tell(E(2, 1), 'Distinguish between ISCII and Unicode.', 'ISCII is an 8-bit code of 256 characters, made for the Indian scripts alongside English.', 'Unicode gives a code point to the characters of nearly every script in the world, over a million in all.'),
  tell(E(2, 2), 'Distinguish between UTF-8 and UTF-16.', 'UTF-8 stores each character in one to four 8-bit bytes, using one byte for the ASCII characters.', 'UTF-16 stores each character in one or two 16-bit units, so even an ASCII letter takes two bytes.'),

  match(E(4, 1), [['A', '65'], ['a', '97'], ['0', '48'], ['a space', '32']]),
  match(E(4, 1), [['ASCII', '7 bits, 128 characters'], ['Extended ASCII', '8 bits, 256 characters'], ['ISCII', '8 bits, with the Indian scripts'], ['UTF-32', '32 bits for every character']]),
  match(E(4, 2), [['U+0041', 'the letter A'], ['U+0905', 'the Devanagari letter अ'], ['U+20B9', 'the rupee sign ₹'], ['U+0030', 'the digit 0']]),

  reason(E(2, 1), 'Why was Unicode needed, when ASCII already existed?', 'ASCII has only 128 codes, enough for English letters, digits and signs.', 'Other languages, such as Hindi, Tamil or Chinese, needed codes too, and Unicode gives one to every character of nearly every script.'),
  reason(E(2, 1), 'Why does sorting words by their ASCII codes put “Zebra” before “apple”?', 'The capital letters have codes 65 to 90, and the small letters 97 to 122.', 'So Z, at 90, comes before a, at 97.'),
  reason(E(2, 2), 'Why does a plain ASCII text file read correctly as UTF-8?', 'UTF-8 uses exactly the ASCII codes, in one byte each, for the first 128 characters.', 'So every byte of the ASCII file means the same character in UTF-8.'),

  short(E(2, 1), 'Write the ASCII codes of the characters of “Ab1”.', 'A = 65 and b = 98.', '1 = 49.'),
  short(E(2, 1), 'How many different characters can an 8-bit code hold? And a 16-bit code?', 'An 8-bit code has 2⁸ = 256 patterns, so 256 characters.', 'A 16-bit code has 2¹⁶ = 65,536.'),
  short(E(2, 1), 'Decode the ASCII codes 72, 105 and 33.', '72 is H and 105 is i.', '33 is !, so the text is “Hi!”.'),

  ar(E(1, 1), 'The character ‘5’ and the number 5 are stored differently.', 'The character ‘5’ is stored as its ASCII code, 53.', 1, 'The number is stored as the binary value 101, but the character as 53, 0110101.'),
  ar(E(1, 1), 'ISCII can represent every script in the world.', 'ISCII is an 8-bit code.', 4, 'With only 256 codes, ISCII covers English and the Indian scripts, not every script.'),

  derive(E(3, 1), 'Show that an n-bit code can represent 2ⁿ characters, and find the fewest bits needed for 128 characters and for 1,000 characters.', ['Each bit can be 0 or 1, independently, so n bits give 2 × 2 × … × 2 = 2ⁿ patterns, one for each character.', 1], ['128 = 2⁷, so 7 bits are enough for 128 characters, as in ASCII.', 1], ['2⁹ = 512 is too few and 2¹⁰ = 1024 is enough, so 1,000 characters need 10 bits.', 1]),
  derive(E(3, 2), 'Show that, in ASCII, a capital letter is changed to its small letter by adding 32, which sets just one bit.', ['The capitals A to Z have codes 65 to 90, and the small letters a to z have codes 97 to 122, each 32 higher.', 1], ['65 to 90 are 64 + 1 to 64 + 26, so in binary the bit worth 32 is 0; 97 to 122 are 96 + 1 to 96 + 26, so that bit is 1.', 1], ['So adding 32 just sets the bit worth 32: A, 1000001, becomes a, 1100001.', 1]),
  derive(E(3, 1), 'Show that the value of a digit character c can be found from its ASCII code as code(c) − 48, and use it for ‘7’.', ['The digit characters ‘0’ to ‘9’ have the codes 48 to 57, in order.', 1], ['So the code of a digit d is 48 + d, and d = code − 48.', 1], ['‘7’ has the code 55, and 55 − 48 = 7.', 1]),
];

export default questions;
