// Written by hand: Boolean algebra and logic gates, figures to draw and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import type { SketchMark } from '../diagram';
import { label, line, sketch, table } from '../figures';

const { figure } = kit('computerscience', 'XII');
const B = at(1, 'b');

/** Gate outlines, with inputs on the left and the output at (x + 40, y). */
const andGate = (x: number, y: number): SketchMark => ({ t: 'path', d: `M${x} ${y - 18} L${x + 20} ${y - 18} A 18 18 0 0 1 ${x + 20} ${y + 18} L${x} ${y + 18} Z` });
const orGate = (x: number, y: number): SketchMark => ({ t: 'path', d: `M${x} ${y - 18} Q ${x + 30} ${y - 18}, ${x + 40} ${y} Q ${x + 30} ${y + 18}, ${x} ${y + 18} Q ${x + 10} ${y}, ${x} ${y - 18} Z` });
const notGate = (x: number, y: number): SketchMark[] => [{ t: 'path', d: `M${x} ${y - 12} L${x + 24} ${y} L${x} ${y + 12} Z` }, { t: 'circle', x: x + 28, y, r: 4 }];

const questions: BankDef[] = [
  figure(B(2, 2), 'The Karnaugh map shows F(A, B, C, D). Group its 1s, and write F in its simplest sum-of-products form.', ['The four 1s form one quad, in rows A′B and AB, and columns C′D and CD.', 'A and C change across the quad, so F = B·D.'], {
    shown: table(['AB \\ CD', 'C′D′', 'C′D', 'CD', 'CD′'], [['A′B′', '0', '0', '0', '0'], ['A′B', '0', '1', '1', '0'], ['AB', '0', '1', '1', '0'], ['AB′', '0', '0', '0', '0']]),
  }),
  figure(B(3, 1), 'Draw the logic circuit for F = A·B + C′, using AND, OR and NOT gates.', ['A and B go into an AND gate, giving A·B.', 'C goes into a NOT gate, giving C′.', 'The two outputs go into an OR gate, whose output is F.'], {
    answer: sketch(320, 150, 'A and B enter an AND gate at the top left. C enters a NOT gate at the bottom left. The outputs of both go into an OR gate on the right, whose output is F.', [
      label(20, 44, 'A', 'end'), label(20, 72, 'B', 'end'), line([[24, 40], [80, 40]]), line([[24, 68], [80, 68]]), andGate(80, 54),
      label(20, 114, 'C', 'end'), line([[24, 110], [90, 110]]), ...notGate(90, 110),
      line([[118, 54], [170, 54], [170, 74], [196, 74]]), line([[122, 110], [170, 110], [170, 94], [200, 94]]), orGate(190, 84),
      line([[230, 84], [280, 84]]), label(286, 88, 'F', 'start'),
    ]),
  }),
  figure(B(2, 2), 'The figure shows a logic circuit. Write its output X, name the single gate it equals, and give X when A = 0 and B = 0.', ['X = (A + B)′, so the circuit is a NOR gate.', 'With A = 0 and B = 0, A + B = 0, so X = 1.'], {
    shown: sketch(300, 120, 'Inputs A and B enter an OR gate. Its output goes into a NOT gate, whose output is X.', [
      label(20, 44, 'A', 'end'), label(20, 76, 'B', 'end'), line([[24, 40], [90, 40]]), line([[24, 72], [90, 72]]), orGate(80, 56),
      line([[120, 56], [160, 56]]), ...notGate(160, 56), line([[192, 56], [250, 56]]), label(256, 60, 'X', 'start'),
    ]),
  }),
  figure(B(2, 3), 'Draw the 3-variable Karnaugh map of F(A, B, C) = Σ(1, 3, 5, 7), and reduce it.', ['The 1s are in every cell where C = 1: the two middle columns of the map, B′C and BC, in both rows.', 'They form a group of four in which A and B both change, so F = C.'], {
    answer: table(['A \\ BC', 'B′C′', 'B′C', 'BC', 'BC′'], [['A′', '0', '1', '1', '0'], ['A', '0', '1', '1', '0']], 'Minterms 1, 3, 5 and 7 hold 1'),
  }),
];

export default questions;
