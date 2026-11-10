// Written by hand: applications of logic gates, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { andGate, label, line, notGate, orGate, sketch, xorGate } from '../figures';

const { figure, predict, odd, tell, match, reason, short, ar } = kit('computerscience', 'XII');
const G = at(2, 'b');

const questions: BankDef[] = [
  figure(G(3, 2), 'Draw the logic circuit of a half subtractor, which works out A − B, and write the expressions for its difference D and borrow Bo.', ['D = A′·B + A·B′ = A ⊕ B, from an XOR gate.', 'Bo = A′·B: A passes through a NOT gate, and A′ and B go into an AND gate.', 'A borrow is needed only when A = 0 and B = 1.'], {
    answer: sketch(320, 150, 'Inputs A and B go into an XOR gate whose output is D. A branch of A passes through a NOT gate, and its output A′ goes with a branch of B into an AND gate, whose output is Bo.', [
      label(14, 54, 'A', 'end'), line([[18, 50], [146, 50]]), label(14, 74, 'B', 'end'), line([[18, 70], [146, 70]]), ...xorGate(150, 60),
      line([[190, 60], [260, 60]]), label(266, 64, 'D', 'start'),
      { t: 'dot', x: 40, y: 50 }, line([[40, 50], [40, 110], [70, 110]]), ...notGate(70, 110), line([[102, 110], [150, 110]]), label(126, 104, 'A′'),
      { t: 'dot', x: 60, y: 70 }, line([[60, 70], [60, 130], [150, 130]]), andGate(150, 120),
      line([[190, 120], [260, 120]]), label(266, 124, 'Bo', 'start'),
    ]),
  }),
  figure(G(3, 2), 'The circuit shown has data inputs I0 and I1 and a select input S. Write its output X, say which input reaches X when S = 0 and when S = 1, and name the circuit.', ['X = S′·I0 + S·I1.', 'When S = 0, X = I0; when S = 1, X = I1.', 'It is a 2-to-1 multiplexer, a data selector.'], {
    shown: sketch(340, 170, 'I0 goes into an upper AND gate. S passes through a NOT gate, and S′ is the upper AND gate’s second input. S itself goes into a lower AND gate with I1. The outputs of both AND gates go into an OR gate, whose output is X.', [
      label(20, 44, 'I0', 'end'), line([[24, 40], [160, 40]]), andGate(160, 50),
      label(20, 134, 'I1', 'end'), line([[24, 130], [160, 130]]), andGate(160, 120),
      label(20, 154, 'S', 'end'), line([[24, 150], [50, 150], [50, 85], [80, 85]]), { t: 'dot', x: 50, y: 110 }, line([[50, 110], [160, 110]]),
      ...notGate(80, 85), line([[112, 85], [130, 85], [130, 60], [160, 60]]), label(144, 54, 'S′'),
      line([[200, 50], [220, 50], [220, 75], [244, 75]]), line([[200, 120], [220, 120], [220, 95], [244, 95]]), orGate(240, 85),
      line([[280, 85], [310, 85]]), label(316, 89, 'X', 'start'),
    ]),
  }),
  figure(G(3, 2), 'Draw a 4-to-2 encoder with inputs D0 to D3 and outputs Y1 and Y0, using OR gates, and write its output expressions.', ['Y1 = D2 + D3 and Y0 = D1 + D3.', 'One OR gate takes D2 and D3 to give Y1; a second takes D1 and D3 to give Y0, so D3 goes to both.', 'D0 is joined to neither gate, as its code is 00.'], {
    answer: sketch(330, 175, 'Four input lines, D0 to D3, from top to bottom. D0 is joined to nothing. D2 and D3 go into an upper OR gate, whose output is Y1. D1 and a branch of D3 go into a lower OR gate, whose output is Y0.', [
      label(26, 34, 'D0', 'end'), line([[30, 30], [80, 30]]),
      label(26, 64, 'D1', 'end'), line([[30, 60], [120, 60], [120, 150], [224, 150]]),
      label(26, 94, 'D2', 'end'), line([[30, 90], [150, 90], [150, 50], [224, 50]]),
      label(26, 124, 'D3', 'end'), line([[30, 120], [180, 120], [180, 70], [224, 70]]), { t: 'dot', x: 180, y: 120 }, line([[180, 120], [200, 120], [200, 130], [224, 130]]),
      orGate(220, 60), orGate(220, 140),
      line([[260, 60], [290, 60]]), label(296, 64, 'Y1', 'start'), line([[260, 140], [290, 140]]), label(296, 144, 'Y0', 'start'),
    ]),
  }),

  predict(G(2, 1), 'A 4-to-1 multiplexer has I0 = 0, I1 = 1, I2 = 1 and I3 = 0, and its select lines are S1S0 = 10. Predict its output, and the output when the select lines change to 11.', 'With S1S0 = 10, input I2 is passed on, so the output is 1.', 'With 11, I3 is passed on, so the output becomes 0.'),
  predict(G(2, 1), 'A 2-to-4 decoder, with outputs D0 to D3, is given the inputs A = 1 and B = 0, A being the more significant bit. Predict its outputs.', 'The input 10 is two in binary, so D2 = 1.', 'D0, D1 and D3 are all 0, as a decoder makes only one output active.'),
  predict(G(2, 2), 'A half adder is given A = 1 and B = 1. Predict its sum and carry, and what a full adder would give if a carry-in of 1 were added as well.', 'The half adder gives sum 0 and carry 1, as 1 + 1 = 10 in binary.', 'The full adder gives sum 1 and carry 1, as 1 + 1 + 1 = 11 in binary.'),

  odd(G(2, 1), ['a half adder', 'a full adder', 'a half subtractor', 'a multiplexer'], 'a multiplexer', 'It selects one of its inputs to pass on; the others do binary arithmetic.'),
  odd(G(2, 1), ['AND', 'OR', 'NOT', 'NOR'], 'NOR', 'It is a universal gate: NOT, AND and OR can all be built from NOR gates alone.'),
  odd(G(2, 2), ['a half adder', 'a half subtractor', 'a full adder', 'an XOR gate'], 'a full adder', 'It takes three inputs, two bits and a carry; the others take two.'),

  tell(G(2, 1), 'Distinguish between a multiplexer and a demultiplexer.', 'A multiplexer has many data inputs and one output, and its select lines choose which input reaches the output.', 'A demultiplexer has one data input and many outputs, and its select lines choose which output the input goes to.'),
  tell(G(2, 1), 'Distinguish between a half adder and a half subtractor, by their expressions.', 'Both give A ⊕ B, as the sum of a half adder and the difference of a half subtractor.', 'The half adder’s carry is A·B, but the half subtractor’s borrow is A′·B.'),
  tell(G(2, 2), 'Distinguish between a decoder and a demultiplexer.', 'A decoder has n inputs and 2ⁿ outputs, and the input code alone makes one output 1.', 'A demultiplexer also has a data input, which is sent to the one output that its n select lines pick.'),

  match(G(4, 1), [['The carry of a half adder', 'A·B'], ['The sum of a half adder', 'A ⊕ B'], ['The borrow of a half subtractor', 'A′·B'], ['The sum of a full adder', 'A ⊕ B ⊕ C']]),
  match(G(4, 1), [['A 2-to-1 multiplexer', '1 select line'], ['A 4-to-1 multiplexer', '2 select lines'], ['An 8-to-1 multiplexer', '3 select lines'], ['A 16-to-1 multiplexer', '4 select lines']]),
  match(G(4, 2), [['A decoder', 'picks one memory chip from an address'], ['An encoder', 'turns a pressed key into its binary code'], ['A multiplexer', 'sends several signals down one line, one at a time'], ['A full adder', 'adds binary numbers one column at a time']]),

  reason(G(2, 1), 'Why does a half adder use an XOR gate for its sum and an AND gate for its carry?', 'The sum bit is 1 when exactly one input is 1, which is what XOR gives.', 'The carry is 1 only when both inputs are 1, which is what AND gives.'),
  reason(G(2, 2), 'Why does a full adder need three inputs, when a half adder has two?', 'In adding numbers of several bits, each column after the first must add the carry from the column before it.', 'So it adds two bits and a carry-in, which a half adder can’t do.'),
  reason(G(2, 3), 'Why does a simple 4-to-2 encoder give a wrong code if D1 and D2 are both 1 at once?', 'Y1 = D2 + D3 and Y0 = D1 + D3, so both outputs become 1.', 'The code 11 stands for D3, which isn’t active; a priority encoder avoids this by coding only the highest active input.'),

  short(G(2, 1), 'Write the truth table of a half subtractor, and its expressions.', 'For A B = 00, 01, 10 and 11, the difference is 0, 1, 1, 0 and the borrow is 0, 1, 0, 0.', 'D = A ⊕ B and Bo = A′·B.'),
  short(G(2, 2), 'Write the output expression of a 4-to-1 multiplexer with data inputs I0 to I3 and select lines S1 and S0.', 'Each input is ANDed with the select code that picks it.', 'X = S1′·S0′·I0 + S1′·S0·I1 + S1·S0′·I2 + S1·S0·I3.'),
  short(G(2, 1), 'Write the expressions for the outputs D0 to D3 of a 2-to-4 decoder with inputs A and B, A being the more significant bit.', 'D0 = A′·B′ and D1 = A′·B.', 'D2 = A·B′ and D3 = A·B.'),

  ar(G(1, 2), 'NOR gates alone can make an AND gate.', 'NOR gates make A′ and B′, and (A′ + B′)′ = A·B by De Morgan’s law.', 1, 'So two NOR gates used as NOTs, feeding a third NOR gate, give A·B.'),
  ar(G(1, 2), 'The borrow of a half subtractor working out A − B is A·B′.', 'A borrow is needed when the bit being taken away is larger than the bit it is taken from.', 4, 'That happens only for A = 0 and B = 1, so the borrow is A′·B.'),
  ar(G(1, 1), 'A demultiplexer with 2 select lines has 4 outputs.', 'A demultiplexer has a single data input.', 2, 'Both are true, but the 4 outputs come from the 2² = 4 codes the select lines can make.'),
];

export default questions;
