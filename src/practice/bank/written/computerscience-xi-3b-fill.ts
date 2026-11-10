// Written by hand: logic gates and adders, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { andGate, label, line, nandGate, sketch, table, xorGate } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('computerscience', 'XI');
const H = at(3, 'b');

/** A NAND gate at (x, y) with both inputs joined to one wire coming in at the left. */
const tied = (x: number, y: number, from: number): SketchMark[] => [
  line([[from, y], [x - 20, y]]), { t: 'dot', x: x - 20, y }, line([[x - 20, y], [x - 20, y - 10], [x + 4, y - 10]]), line([[x - 20, y], [x - 20, y + 10], [x + 4, y + 10]]), ...nandGate(x, y),
];

const questions: BankDef[] = [
  figure(H(3, 2), 'Show how NAND gates alone can make a NOT gate, an AND gate and an OR gate.', ['NOT: a NAND gate with both inputs joined to A gives (A·A)′ = A′.', 'AND: a NAND gate followed by a NAND gate used as a NOT gives ((A·B)′)′ = A·B.', 'OR: NAND gates used as NOTs on A and B, feeding a third NAND gate, give (A′·B′)′ = A + B.'], {
    answer: sketch(340, 240, 'Three small circuits of NAND gates. First, A goes to both inputs of one NAND gate, whose output is A′, labelled NOT. Second, A and B go into a NAND gate, whose output goes to both inputs of a second NAND gate, giving A·B, labelled AND. Third, A goes to both inputs of one NAND gate and B to both inputs of another; their outputs go into a third NAND gate, giving A + B, labelled OR.', [
      label(14, 34, 'A', 'end'), ...tied(60, 30, 18), line([[106, 30], [130, 30]]), label(136, 34, 'A′', 'start'), label(330, 34, 'NOT', 'end'),
      label(14, 89, 'A', 'end'), line([[18, 85], [64, 85]]), label(14, 109, 'B', 'end'), line([[18, 105], [64, 105]]), ...nandGate(60, 95),
      ...tied(150, 95, 106), line([[196, 95], [215, 95]]), label(221, 99, 'A·B', 'start'), label(330, 99, 'AND', 'end'),
      label(14, 154, 'A', 'end'), ...tied(60, 150, 18), label(14, 209, 'B', 'end'), ...tied(60, 205, 18),
      line([[106, 150], [130, 150], [130, 167], [154, 167]]), line([[106, 205], [130, 205], [130, 187], [154, 187]]), ...nandGate(150, 177),
      line([[196, 177], [215, 177]]), label(221, 181, 'A + B', 'start'), label(330, 181, 'OR', 'end'),
    ]),
  }),
  figure(H(3, 1), 'In the circuit shown, A and B both go into an XOR gate and an AND gate. Write the outputs S and C, name the circuit, and give S and C when A = B = 1.', ['S = A ⊕ B and C = A·B.', 'It is a half adder: S is the sum bit and C the carry.', 'For A = B = 1, S = 0 and C = 1, as 1 + 1 = 10 in binary.'], {
    shown: sketch(320, 150, 'Inputs A and B each split into two branches. One branch of each goes into an XOR gate, whose output is S. The other branches go into an AND gate, whose output is C.', [
      label(14, 44, 'A', 'end'), line([[18, 40], [146, 40]]), label(14, 64, 'B', 'end'), line([[18, 60], [146, 60]]), ...xorGate(150, 50),
      line([[190, 50], [260, 50]]), label(266, 54, 'S', 'start'),
      { t: 'dot', x: 50, y: 40 }, line([[50, 40], [50, 100], [150, 100]]), { t: 'dot', x: 70, y: 60 }, line([[70, 60], [70, 120], [150, 120]]), andGate(150, 110),
      line([[190, 110], [260, 110]]), label(266, 114, 'C', 'start'),
    ]),
  }),
  figure(H(3, 2), 'Draw the truth table of a full adder, with inputs A, B and a carry-in C, and outputs S and Cout.', ['S is 1 when an odd number of the inputs are 1: rows 001, 010, 100 and 111.', 'Cout is 1 when two or more inputs are 1: rows 011, 101, 110 and 111.', 'Each row gives A + B + C in binary as Cout S.'], {
    answer: table(['A', 'B', 'C', 'S', 'Cout'], [['0', '0', '0', '0', '0'], ['0', '0', '1', '1', '0'], ['0', '1', '0', '1', '0'], ['0', '1', '1', '0', '1'], ['1', '0', '0', '1', '0'], ['1', '0', '1', '0', '1'], ['1', '1', '0', '0', '1'], ['1', '1', '1', '1', '1']]),
  }),

  predict(H(2, 2), 'One input of an XNOR gate is held at 1, and then at 0, while the other input is A. Predict the output each time.', 'With 1 held, the output is 1 only when A = 1, so it follows A.', 'With 0 held, the output is 1 only when A = 0, so it is A′.'),
  predict(H(2, 1), 'Both inputs of a NOR gate are joined to one signal A. Predict its output, and what gate it acts as.', 'The output is (A + A)′ = A′.', 'So it acts as a NOT gate.'),
  predict(H(2, 1), 'A full adder is given A = 1, B = 0 and a carry-in of 1. Predict its sum and carry-out.', '1 + 0 + 1 = 2, which is 10 in binary.', 'So the sum is 0 and the carry-out is 1.'),

  odd(H(2, 1), ['AND', 'OR', 'NOT', 'XNOR'], 'XNOR', 'It isn’t one of the basic gates; AND, OR and NOT are.'),
  odd(H(2, 2), ['A·1', 'A + 0', 'A·A', 'A + 1'], 'A + 1', 'It always equals 1; the other three equal A.'),
  odd(H(2, 2), ['NAND', 'NOR', 'XNOR', 'OR'], 'OR', 'With both inputs 0 it gives 0; the other three give 1.'),

  long(H(5, 2), 'Two 2-bit numbers, A1A0 and B1B0, are to be added.\n(a) Why does the adder need a half adder for the right-hand bits and a full adder for the left-hand bits? [2]\n(b) Add 11 and 01 with it, giving the sum and carry of each stage. [2]\n(c) What is the largest possible result, and how many output bits does the adder need? [1]', '(a) The right-hand bits have no carry coming in, so a half adder is enough.', '(a) The left-hand bits must also add the carry from the right-hand stage, so they need a full adder.', '(b) Right-hand stage: 1 + 1 gives sum 0, carry 1.', '(b) Left-hand stage: 1 + 0 + 1 gives sum 0, carry 1, so the result is 100, which is 4.', '(c) 11 + 11 = 110, which is 6, so 3 output bits are needed.'),

  tell(H(2, 1), 'Distinguish between a basic gate and a universal gate.', 'The basic gates are AND, OR and NOT, from which any logic circuit can be built when used together.', 'A universal gate, NAND or NOR, can build any logic circuit on its own, as it can make all three basic gates.'),
  tell(H(2, 1), 'Distinguish between the XOR and XNOR gates.', 'XOR gives 1 when its inputs differ: A·B′ + A′·B.', 'XNOR gives 1 when its inputs are the same: A·B + A′·B′, the complement of XOR.'),
  tell(H(2, 2), 'Distinguish between the sum and the carry of a half adder.', 'The sum is the right-hand bit of A + B, given by A ⊕ B.', 'The carry is the bit carried to the next place, 1 only for 1 + 1, given by A·B.'),

  match(H(4, 2), [['A NAND gate with its inputs joined', 'NOT'], ['A NAND gate followed by a NOT gate', 'AND'], ['NOT gates on both inputs of a NAND gate', 'OR'], ['An OR gate followed by a NOT gate', 'NOR']]),
  match(H(4, 1), [['A·B', 'AND'], ['A + B', 'OR'], ['A′', 'NOT'], ['A ⊕ B', 'XOR']]),
  match(H(4, 1), [['A half adder', 'adds two bits'], ['A full adder', 'adds two bits and a carry'], ['An XOR gate', 'gives the sum bit of a half adder'], ['An AND gate', 'gives the carry bit of a half adder']]),

  reason(H(2, 1), 'Why are AND, OR and NOT called the basic gates?', 'Every Boolean function can be written using AND, OR and NOT alone.', 'So any logic circuit can be built from these three kinds of gate.'),
  reason(H(2, 1), 'Why does a NAND gate with its two inputs joined act as a NOT gate?', 'Both inputs then carry A, so the output is (A·A)′.', 'A·A = A, so the output is A′.'),
  reason(H(2, 1), 'Why can an XNOR gate be used to test whether two bits are equal?', 'An XNOR gate gives 1 when its inputs are the same, and 0 when they differ.', 'So an output of 1 shows the two bits are equal.'),

  short(H(2, 1), 'Write the truth table of a 2-input XNOR gate.', 'Inputs 00 and 11 give 1.', 'Inputs 01 and 10 give 0.'),
  short(H(2, 3), 'A and B go into a NAND gate. Its output and A go into a second NAND gate, whose output is X. Find X in its simplest form.', 'The first gate gives (A·B)′.', 'X = (A·(A·B)′)′ = (A·(A′ + B′))′ = (A·B′)′ = A′ + B.'),
  short(H(2, 2), 'How many NAND gates are needed to make an OR gate? Explain how they are joined.', 'Three.', 'Two NAND gates with joined inputs make A′ and B′, and a third NAND gate gives (A′·B′)′ = A + B.'),

  ar(H(1, 1), 'A NOR gate with its two inputs joined acts as a NOT gate.', 'With both inputs A, the output is (A + A)′ = A′.', 1, 'So the gate inverts A.'),
  ar(H(1, 1), 'An XOR gate is a universal gate.', 'An XOR gate gives 1 when its inputs differ.', 4, 'XOR can’t make an AND gate on its own, so it isn’t universal.'),
  ar(H(1, 1), 'A full adder has three inputs.', 'Adders use XOR gates for their sum bits.', 2, 'Both are true, but it has three inputs because it adds a carry-in as well as two bits.'),
];

export default questions;
