// Written by hand: logic gates, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { andGate, label, line, nandGate, norGate, notGate, orGate, sketch, xorGate } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('computerscience', 'XII');
const G = at(2, 'a');

const questions: BankDef[] = [
  figure(G(3, 1), 'Draw the symbols of the NAND, NOR and XOR gates, and write the output expression under each.', ['NAND: an AND outline with a bubble at the output, (A·B)′.', 'NOR: an OR outline with a bubble at the output, (A + B)′.', 'XOR: an OR outline with a second curved line at its inputs, A·B′ + A′·B.'], {
    answer: sketch(320, 130, 'Three gate symbols side by side, each with two inputs and one output. The NAND gate is an AND shape with a small circle at its output, labelled (A·B)′. The NOR gate is an OR shape with a small circle, labelled (A + B)′. The XOR gate is an OR shape with an extra curve behind its inputs, labelled A·B′ + A′·B.', [
      line([[10, 50], [30, 50]]), line([[10, 70], [30, 70]]), ...nandGate(30, 60), line([[76, 60], [95, 60]]), label(52, 102, 'NAND'), label(52, 120, '(A·B)′'),
      line([[115, 50], [139, 50]]), line([[115, 70], [139, 70]]), ...norGate(135, 60), line([[183, 60], [200, 60]]), label(157, 102, 'NOR'), label(157, 120, '(A + B)′'),
      line([[222, 50], [242, 50]]), line([[222, 70], [242, 70]]), ...xorGate(245, 60), line([[285, 60], [305, 60]]), label(265, 102, 'XOR'), label(265, 120, 'A·B′ + A′·B'),
    ]),
  }),
  figure(G(3, 2), 'In the circuit shown, A and B go into an XOR gate, and its output and A go into an AND gate. Write the output X in its simplest form, and say for which inputs X = 1.', ['The XOR gate gives A·B′ + A′·B.', 'X = A·(A·B′ + A′·B) = A·B′ + 0 = A·B′.', 'So X = 1 only when A = 1 and B = 0.'], {
    shown: sketch(320, 150, 'Input A goes into an XOR gate and also, along a wire above it, into an AND gate. Input B goes into the XOR gate only. The XOR gate’s output is the AND gate’s second input. The AND gate’s output is X.', [
      label(14, 54, 'A', 'end'), line([[18, 50], [66, 50]]), { t: 'dot', x: 40, y: 50 }, line([[40, 50], [40, 20], [160, 20], [160, 74], [170, 74]]),
      label(14, 74, 'B', 'end'), line([[18, 70], [66, 70]]), ...xorGate(70, 60),
      line([[110, 60], [140, 60], [140, 94], [170, 94]]), andGate(170, 84), line([[210, 84], [260, 84]]), label(266, 88, 'X', 'start'),
    ]),
  }),
  figure(G(3, 3), 'Draw a circuit for an XNOR gate using only AND, OR and NOT gates, and write its expression.', ['X = A·B + A′·B′.', 'One AND gate takes A and B; NOT gates make A′ and B′, which go into a second AND gate.', 'An OR gate joins the two AND outputs to give X.'], {
    answer: sketch(330, 190, 'Inputs A and B go into an AND gate at the top. Branches of A and B each pass through a NOT gate, and A′ and B′ go into a second AND gate below. The outputs of both AND gates go into an OR gate, whose output is X.', [
      label(14, 44, 'A', 'end'), line([[18, 40], [150, 40]]), label(14, 64, 'B', 'end'), line([[18, 60], [150, 60]]), andGate(150, 50),
      { t: 'dot', x: 40, y: 40 }, line([[40, 40], [40, 130], [70, 130]]), ...notGate(70, 130), line([[102, 130], [150, 130]]), label(118, 124, 'A′'),
      { t: 'dot', x: 55, y: 60 }, line([[55, 60], [55, 165], [70, 165]]), ...notGate(70, 165), line([[102, 165], [130, 165], [130, 150], [150, 150]]), label(116, 182, 'B′'),
      andGate(150, 140),
      line([[190, 50], [205, 50], [205, 85], [224, 85]]), line([[190, 140], [205, 140], [205, 105], [224, 105]]), orGate(220, 95),
      line([[260, 95], [290, 95]]), label(296, 99, 'X', 'start'),
    ]),
  }),

  predict(G(2, 1), 'One input of a 2-input AND gate is held at 1. Predict its output as the other input A changes, and what happens if the held input is 0 instead.', 'With 1 held, the output follows A: 0 when A = 0 and 1 when A = 1.', 'With 0 held, the output stays 0 whatever A is.'),
  predict(G(2, 2), 'The two inputs of an XNOR gate are joined and driven by one signal A. Predict the output for A = 0 and A = 1.', 'Both inputs are always equal.', 'So the output is 1 for A = 0 and for A = 1.'),
  predict(G(2, 2), 'The output of a NOR gate is passed through a NOT gate. Predict which single gate the pair acts as, and its output when A = 1 and B = 0.', 'An OR gate, as ((A + B)′)′ = A + B.', 'Its output is 1.'),

  odd(G(2, 1), ['AND', 'OR', 'XNOR', 'NAND'], 'NAND', 'With both inputs 1 it gives 0; the other three give 1.'),
  odd(G(2, 2), ['A + A′', 'A·1', 'A + 1', 'A XNOR A'], 'A·1', 'It equals A; the other three always equal 1.'),
  odd(G(2, 2), ['(A + B)′', 'A′·B′', 'NOR of A and B', '(A·B)′'], '(A·B)′', 'It is NAND; by De Morgan’s law the other three are all the same NOR function.'),

  long(G(5, 2), 'Answer each part on the XOR gate.\n(a) Write the truth table of a 2-input XOR gate, and its expression. [2]\n(b) Show that A ⊕ B = (A + B)·(A·B)′. [2]\n(c) Give one use of an XOR gate. [1]', '(a) The output is 1 for inputs 01 and 10, and 0 for 00 and 11.', '(a) A ⊕ B = A·B′ + A′·B.', '(b) (A + B)·(A·B)′ = (A + B)·(A′ + B′), by De Morgan’s law.', '(b) = A·A′ + A·B′ + B·A′ + B·B′ = A·B′ + A′·B.', '(c) Comparing two bits, finding parity, or making the sum bit of an adder.'),
  long(G(5, 2), 'Answer each part on gates with more inputs.\n(a) Write the truth tables of a 3-input AND gate and a 3-input OR gate. [2]\n(b) How many rows does the truth table of an n-input gate have? Why? [1]\n(c) For which input combination alone does a 3-input NAND gate give 0? Explain. [2]', '(a) AND gives 1 only for 111, and 0 in the other seven rows.', '(a) OR gives 0 only for 000, and 1 in the other seven rows.', '(b) 2ⁿ, as each input can be 0 or 1 independently.', '(c) Only 111.', '(c) NAND is the complement of AND, which is 1 only when every input is 1.'),

  tell(G(2, 1), 'Distinguish between an OR gate and an XOR gate.', 'OR gives 1 when at least one input is 1, so 1 for inputs 1 and 1.', 'XOR gives 1 only when the inputs differ, so 0 for inputs 1 and 1.'),
  tell(G(2, 1), 'Distinguish between an AND gate and a NAND gate, by expression and symbol.', 'AND gives A·B, and NAND gives (A·B)′, its complement.', 'The NAND symbol is the AND outline with a bubble at the output.'),
  tell(G(2, 2), 'Distinguish between a NAND gate and a NOR gate by when each output is 1.', 'NAND gives 1 unless every input is 1.', 'NOR gives 1 only when every input is 0.'),

  match(G(4, 1), [['NAND', '(A·B)′'], ['NOR', '(A + B)′'], ['XOR', 'A·B′ + A′·B'], ['XNOR', 'A·B + A′·B′']]),
  match(G(4, 1), [['AND', '1 only when all inputs are 1'], ['OR', '1 when any input is 1'], ['NOR', '1 only when all inputs are 0'], ['XOR', '1 when its two inputs differ']]),
  match(G(4, 2), [['OR followed by NOT', 'NOR'], ['AND followed by NOT', 'NAND'], ['XOR followed by NOT', 'XNOR'], ['NOR followed by NOT', 'OR']]),

  reason(G(2, 1), 'Why is an XOR gate sometimes called an inequality detector?', 'Its output is 1 only when its two inputs are different.', 'So a 1 at the output shows the inputs are not equal.'),
  reason(G(2, 1), 'Why is a small circle drawn at the output of the NAND and NOR symbols?', 'The circle stands for inversion, a NOT.', 'So NAND is AND inverted, and NOR is OR inverted.'),
  reason(G(2, 1), 'Why does the truth table of a 3-input gate have eight rows?', 'Each input can be 0 or 1.', 'Three inputs give 2 × 2 × 2 = 2³ = 8 combinations.'),

  short(G(2, 1), 'Write the truth table of a 2-input NOR gate.', 'Inputs 0 and 0 give 1.', 'Inputs 01, 10 and 11 give 0.'),
  short(G(2, 2), 'What is the output of an XOR gate whose inputs are A and A′? Show why.', 'A ⊕ A′ = A·(A′)′ + A′·A′ = A·A + A′ = A + A′.', 'So the output is always 1.'),

  ar(G(1, 1), 'An XOR gate can be used to check whether two bits are equal.', 'Its output is 1 only when its inputs differ.', 1, 'So an output of 0 means the bits are equal.'),
  ar(G(1, 2), 'A 2-input NOR gate gives 1 when both its inputs are 1.', 'The NOR gate is the complement of the OR gate.', 4, 'OR gives 1 for inputs 1 and 1, so NOR gives 0.'),
  ar(G(1, 2), 'A NAND gate gives 0 only when all its inputs are 1.', 'NAND is a universal gate.', 2, 'Both are true, but the output follows from NAND being AND inverted, not from its being universal.'),
];

export default questions;
