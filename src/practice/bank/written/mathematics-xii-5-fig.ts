// Written by hand: three-dimensional geometry, figures to draw and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';

const { figure } = kit('mathematics', 'XII');
const G = at(5, 'a');

const axes = [arrow([110, 110], [110, 15]), arrow([110, 110], [260, 110]), arrow([110, 110], [40, 170]), label(110, 10, 'z'), label(268, 114, 'x', 'start'), label(32, 178, 'y', 'end')];

const questions: BankDef[] = [
  figure(G(2, 1), 'Draw a line through the origin making angles $\\alpha$, $\\beta$, $\\gamma$ with the axes. What are its direction cosines, and how are they related?', ['Its direction cosines are $\\cos\\alpha$, $\\cos\\beta$ and $\\cos\\gamma$.', 'They satisfy $\\cos^2\\alpha + \\cos^2\\beta + \\cos^2\\gamma = 1$.'], {
    answer: sketch(300, 190, 'Three axes from an origin: z up, x to the right and y towards the viewer at the lower left. A line OP rises from the origin between them, with its angles α to x, β to y and γ to z marked.', [
      ...axes, arrow([110, 110], [210, 45]), label(216, 42, 'P', 'start'), label(160, 104, 'α'), label(96, 128, 'β', 'end'), label(124, 70, 'γ', 'start'),
    ]),
  }),
  figure(G(2, 2), 'The figure shows a plane, a point $A$ on it with position vector $\\vec{a}$, and a normal $\\vec{n}$. Write the equation of the plane in vector form, and say why it holds.', ['For any point $\\vec{r}$ on the plane, $\\vec{r} - \\vec{a}$ lies in the plane, so it is at right angles to $\\vec{n}$.', 'So $(\\vec{r} - \\vec{a}) \\cdot \\vec{n} = 0$.'], {
    shown: sketch(300, 160, 'A slanted plane drawn as a parallelogram. A point A on it, and a point R on it, with an arrow from A to R in the plane. A normal arrow n stands up from A.', [
      line([[40, 120], [200, 120], [260, 60], [100, 60], [40, 120]]), { t: 'dot', x: 130, y: 95 }, label(122, 110, 'A', 'end'), { t: 'dot', x: 200, y: 85 }, label(208, 100, 'R', 'start'),
      arrow([130, 95], [198, 86]), arrow([130, 95], [130, 20]), label(138, 26, 'n', 'start'),
    ]),
  }),
  figure(G(3, 3), 'Draw two skew lines, and show the line along which the shortest distance between them is measured. What is special about that line?', ['Two lines that neither meet nor are parallel, drawn in different planes.', 'The shortest distance is along the line that is at right angles to both.', 'Its direction is $\\vec{b}_1 \\times \\vec{b}_2$, and the distance is $\\frac{|(\\vec{a}_2 - \\vec{a}_1) \\cdot (\\vec{b}_1 \\times \\vec{b}_2)|}{|\\vec{b}_1 \\times \\vec{b}_2|}$.'], {
    answer: sketch(300, 170, 'One line runs across the top from left to right; another, lower, runs from front-left to back-right. A short segment PQ joins them, at right angles to both.', [
      line([[20, 40], [280, 40]]), label(286, 44, 'L₁', 'start'), line([[40, 160], [260, 100]]), label(266, 98, 'L₂', 'start'),
      line([[150, 40], [150, 130]], { dash: 1 }), { t: 'dot', x: 150, y: 40 }, { t: 'dot', x: 150, y: 130 }, label(158, 36, 'P', 'start'), label(158, 144, 'Q', 'start'),
    ]),
  }),
  figure(G(2, 3), 'The figure shows a line meeting a plane, and the normal to the plane. The line makes an angle $\\phi$ with the normal. What angle does it make with the plane, and how is it found from the direction of the line and the normal?', ['The angle with the plane is $\\theta = 90° - \\phi$.', '$\\sin\\theta = \\frac{|\\vec{b} \\cdot \\vec{n}|}{|\\vec{b}||\\vec{n}|}$.'], {
    shown: sketch(300, 160, 'A horizontal plane drawn as a parallelogram. A normal stands up from a point on it. A slanted line meets the plane at that point, with angle φ between it and the normal, and angle θ between it and the plane.', [
      line([[30, 130], [210, 130], [270, 90], [90, 90], [30, 130]]), line([[150, 110], [150, 20]], { arrow: 1 }), label(158, 26, 'n', 'start'), line([[150, 110], [230, 40]]), label(236, 40, 'line', 'start'),
      label(162, 70, 'φ', 'start'), label(196, 104, 'θ', 'start'),
    ]),
  }),
  figure(G(3, 2), 'The table gives the direction ratios of three lines. Which two are parallel, and which two are at right angles?', ['$L_1$ and $L_3$ are parallel, as $(2, -2, 4)$ is twice $(1, -1, 2)$.', '$L_1$ and $L_2$ are at right angles, as $1 \\times 3 + (-1) \\times 1 + 2 \\times (-1) = 0$.', 'So $L_2$ and $L_3$ are at right angles too.'], {
    shown: table(['Line', 'a', 'b', 'c'], [['L₁', '1', '−1', '2'], ['L₂', '3', '1', '−1'], ['L₃', '2', '−2', '4']]),
  }),
];

export default questions;
