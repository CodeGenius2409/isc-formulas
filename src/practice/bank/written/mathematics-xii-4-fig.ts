// Written by hand: vectors and three-dimensional geometry, figures to draw and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch } from '../figures';

const { figure } = kit('mathematics', 'XII');
const V = at(4, 'a');

const questions: BankDef[] = [
  figure(V(2, 1), 'Draw a diagram to show the triangle law of vector addition for $\\vec{a}$ and $\\vec{b}$.', ['Draw $\\vec{a}$, then $\\vec{b}$ starting from the head of $\\vec{a}$.', 'The vector from the tail of $\\vec{a}$ to the head of $\\vec{b}$ is $\\vec{a} + \\vec{b}$.'], {
    answer: sketch(300, 160, 'A triangle of vectors. Vector a runs from O to the right and a little up, to P. Vector b runs from P up to Q. The third side, from O to Q, is a plus b.', [
      arrow([40, 130], [180, 110]), label(110, 136, 'a'), arrow([180, 110], [240, 30]), label(222, 76, 'b', 'start'), arrow([40, 130], [240, 30]), label(124, 66, 'a + b', 'end'),
      label(30, 140, 'O', 'end'), label(186, 124, 'P', 'start'), label(246, 26, 'Q', 'start'),
    ]),
  }),
  figure(V(2, 2), 'Draw the parallelogram on $\\vec{a}$ and $\\vec{b}$, and mark the vectors along its two diagonals.', ['One diagonal, from the common tail, is $\\vec{a} + \\vec{b}$.', 'The other, from the head of $\\vec{b}$ to the head of $\\vec{a}$, is $\\vec{a} - \\vec{b}$.'], {
    answer: sketch(300, 160, 'A parallelogram with sides a along the bottom and b up the left. One diagonal from the bottom-left corner to the top-right corner is a plus b. The other, from the top-left corner to the bottom-right corner, is a minus b.', [
      arrow([40, 130], [200, 130]), label(120, 148, 'a'), arrow([40, 130], [100, 40]), label(60, 80, 'b', 'end'),
      line([[100, 40], [260, 40], [200, 130]], { dash: 1 }),
      arrow([40, 130], [260, 40]), label(170, 70, 'a + b', 'start'), arrow([100, 40], [200, 130]), label(140, 104, 'a − b', 'end'),
    ]),
  }),
  figure(V(3, 2), 'The figure shows vectors $\\vec{a}$ from the origin to $(3, 4)$ and $\\vec{b}$ from the origin to $(-2, 1)$. Write each in terms of $\\hat{i}$ and $\\hat{j}$, and find $\\vec{a} + \\vec{b}$ and $|\\vec{a}|$.', ['$\\vec{a} = 3\\hat{i} + 4\\hat{j}$ and $\\vec{b} = -2\\hat{i} + \\hat{j}$.', '$\\vec{a} + \\vec{b} = \\hat{i} + 5\\hat{j}$.', '$|\\vec{a}| = \\sqrt{9 + 16} = 5$.'], {
    shown: graph('x', 'y', [{ label: 'a', points: [[0, 0], [3, 4]] }, { label: 'b', points: [[0, 0], [-2, 1]] }], { x: [[-2, '−2'], [3, '3']], y: [[1, '1'], [4, '4']] }),
  }),
  figure(V(2, 3), 'In the figure, $OA = \\vec{a}$ and the line $OB$ is along $\\vec{b}$. $AN$ is at right angles to $OB$. What is $ON$, in terms of $\\vec{a}$ and $\\vec{b}$?', ['$ON = |\\vec{a}| \\cos\\theta$, where $\\theta$ is the angle between them.', 'That is $\\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|}$, the projection of $\\vec{a}$ on $\\vec{b}$.'], {
    shown: sketch(300, 150, 'From O, vector a rises to A. A line runs from O along b to B, at a smaller angle θ. A dashed perpendicular drops from A to N on OB.', [
      arrow([30, 130], [150, 30]), label(156, 26, 'A', 'start'), label(80, 70, 'a', 'end'), arrow([30, 130], [270, 100]), label(276, 100, 'B', 'start'),
      line([[150, 30], [162, 115]], { dash: 1 }), label(164, 130, 'N'), label(20, 136, 'O', 'end'), label(66, 120, 'θ'),
    ]),
  }),
  figure(V(2, 2), 'Draw a diagram to show the point $R$ that divides $AB$ internally in the ratio $m : n$, and give its position vector.', ['$R$ lies on $AB$, with $AR : RB = m : n$.', '$\\vec{r} = \\frac{m\\vec{b} + n\\vec{a}}{m + n}$, where $\\vec{a}$ and $\\vec{b}$ are the position vectors of $A$ and $B$.'], {
    answer: sketch(300, 150, 'A line from A to B, with R between them, AR marked m and RB marked n. Lines from an origin O below go to A, R and B.', [
      line([[40, 40], [260, 40]]), { t: 'dot', x: 40, y: 40 }, { t: 'dot', x: 172, y: 40 }, { t: 'dot', x: 260, y: 40 }, label(40, 30, 'A'), label(172, 30, 'R'), label(260, 30, 'B'), label(106, 56, 'm'), label(216, 56, 'n'),
      arrow([150, 130], [44, 44]), arrow([150, 130], [172, 46]), arrow([150, 130], [256, 44]), label(150, 146, 'O'),
    ]),
  }),
];

export default questions;
