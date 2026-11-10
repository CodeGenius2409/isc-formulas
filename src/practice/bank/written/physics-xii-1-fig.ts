// Written by hand: electrostatics, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, plot, sketch } from '../figures';

const { figure } = kit('physics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  figure(A(2, 1), 'Draw the electric field lines of an electric dipole.', ['Lines start on the positive charge and end on the negative one.', 'They curve between the charges, are closest together between them, and never cross.'], {
    answer: sketch(300, 180, 'Field lines of a dipole: lines leave the positive charge on the left, curve round, and enter the negative charge on the right. The straight line between them is the densest.', [
      { t: 'dot', x: 100, y: 90 }, label(100, 76, '+'), { t: 'dot', x: 200, y: 90 }, label(200, 76, '−'),
      arrow([106, 90], [194, 90]),
      { t: 'path', d: 'M104 84 C 125 40, 175 40, 196 84', arrow: 1 },
      { t: 'path', d: 'M104 96 C 125 140, 175 140, 196 96', arrow: 1 },
      { t: 'path', d: 'M98 82 C 80 0, 220 0, 202 82', arrow: 1 },
      { t: 'path', d: 'M98 98 C 80 180, 220 180, 202 98', arrow: 1 },
    ]),
  }),
  figure(A(2, 2), 'Draw the field lines of two equal positive charges a short distance apart. Mark the point where the field is zero.', ['Lines leave each charge and bend away from the other, so none join the two.', 'The field is zero at the neutral point N, halfway between them.'], {
    answer: sketch(300, 180, 'Two positive charges with field lines going outwards and bending away from each other. A neutral point N lies halfway between them.', [
      { t: 'dot', x: 100, y: 90 }, label(100, 78, '+'), { t: 'dot', x: 200, y: 90 }, label(200, 78, '+'),
      arrow([94, 90], [30, 90]), arrow([206, 90], [270, 90]),
      { t: 'path', d: 'M104 85 C 125 70, 135 40, 130 10', arrow: 1 }, { t: 'path', d: 'M104 95 C 125 110, 135 140, 130 170', arrow: 1 },
      { t: 'path', d: 'M196 85 C 175 70, 165 40, 170 10', arrow: 1 }, { t: 'path', d: 'M196 95 C 175 110, 165 140, 170 170', arrow: 1 },
      { t: 'path', d: 'M96 85 C 80 60, 60 40, 40 30', arrow: 1 }, { t: 'path', d: 'M204 85 C 220 60, 240 40, 260 30', arrow: 1 },
      { t: 'dot', x: 150, y: 90 }, label(150, 108, 'N'),
    ]),
  }),
  figure(A(2, 2), 'The figure shows electric field lines in a region. At which point, P or Q, is the field stronger? Which way is a positive charge at Q pushed?', ['At P, as the lines are closer together there.', 'Along the lines at Q, to the right.'], {
    shown: sketch(300, 160, 'Five field lines run from left to right, close together on the left and spreading apart on the right. Point P is on the left, among the close lines, and point Q on the right, where they are far apart. The arrows point right.', [
      line([[30, 70], [270, 20]], { arrow: 1 }), line([[30, 75], [270, 50]], { arrow: 1 }), line([[30, 80], [270, 80]], { arrow: 1 }), line([[30, 85], [270, 110]], { arrow: 1 }), line([[30, 90], [270, 140]], { arrow: 1 }),
      { t: 'dot', x: 60, y: 78 }, label(60, 104, 'P'), { t: 'dot', x: 230, y: 96 }, label(240, 104, 'Q', 'start'),
    ]),
  }),
  figure(A(3, 2), 'The figure shows a closed surface drawn around part of a long, straight, charged wire. Name the parts P and Q. Through which of them does the electric flux pass, and why?', ['P is the curved surface of the cylinder, and Q is one of its flat ends.', 'All the flux passes through P.', 'The field points straight out from the wire, so it runs along Q’s plane and none crosses it.'], {
    shown: sketch(300, 150, 'A long straight wire runs from left to right through the middle of a cylinder. The cylinder’s curved side is labelled P and its right-hand flat end is labelled Q.', [
      line([[10, 75], [290, 75]]), label(285, 65, 'wire', 'end'),
      { t: 'path', d: 'M80 35 L220 35 M80 115 L220 115' },
      { t: 'path', d: 'M80 35 C 60 35, 60 115, 80 115 C 100 115, 100 35, 80 35', dash: 1 },
      { t: 'path', d: 'M220 35 C 200 35, 200 115, 220 115 C 240 115, 240 35, 220 35' },
      label(150, 28, 'P'), label(250, 120, 'Q', 'start'),
    ]),
  }),
  figure(A(2, 3), 'A thin spherical shell of radius R has charge spread evenly over it. Sketch how the field E changes with distance r from its centre.', ['E = 0 everywhere inside, for r < R.', 'Outside, E is greatest at r = R and falls as 1/r².'], {
    answer: graph('distance r from the centre', 'field E', [{ points: [[0, 0], [1, 0], [1, 1], ...plot((r) => 1 / (r * r), 1.05, 3, 24)] }], { x: [[1, 'R']] }),
  }),
  figure(B(2, 1), 'Draw a graph of the potential V against distance r from the centre of a charged conducting sphere of radius R.', ['V is the same everywhere inside, equal to its value at the surface.', 'Outside, V falls as 1/r.'], {
    answer: graph('distance r from the centre', 'potential V', [{ points: [[0, 1], [1, 1], ...plot((r) => 1 / r, 1.05, 4, 24)] }], { x: [[1, 'R']] }),
  }),
  figure(B(2, 2), 'The graph shows the charge Q on a capacitor against the potential difference V across it. Find its capacitance, and the energy stored at 10 V.', ['C = Q/V = 50 μC / 10 V = 5 μF.', 'U = ½QV = ½ × 50 × 10⁻⁶ × 10 = 2.5 × 10⁻⁴ J.'], {
    shown: graph('potential difference V (V)', 'charge Q (μC)', [{ points: [[0, 0], [10, 50]] }], { x: [[10, '10']], y: [[50, '50']] }),
  }),
  figure(B(2, 2), 'Draw the equipotential surfaces of a uniform electric field, and show the direction of the field.', ['Equally spaced parallel planes at right angles to the field.', 'The potential falls along the field, so V₁ > V₂ > V₃ in the direction of the arrows.'], {
    answer: sketch(300, 160, 'Three dashed vertical lines, the equipotentials, labelled V₁, V₂ and V₃ from left to right. Horizontal arrows across them point to the right, the field.', [
      line([[90, 20], [90, 140]], { dash: 1 }), line([[150, 20], [150, 140]], { dash: 1 }), line([[210, 20], [210, 140]], { dash: 1 }),
      label(90, 154, 'V₁'), label(150, 154, 'V₂'), label(210, 154, 'V₃'),
      arrow([40, 50], [260, 50]), arrow([40, 110], [260, 110]), label(270, 80, 'E', 'start'),
    ]),
  }),
  figure(B(3, 2), 'The figure shows a parallel-plate capacitor. Name A, B and C, and say what B does to the capacitance.', ['A is a conducting plate.', 'B is a dielectric slab, which raises the capacitance by its dielectric constant.', 'C is charge induced on the slab’s face, opposite in sign to the plate beside it, which weakens the field inside.'], {
    shown: sketch(300, 170, 'Two vertical plates, the left one marked with plus signs. Between them stands a slab. Minus signs line the slab’s left face. The left plate is labelled A, the slab B, and the row of minus signs C.', [
      line([[70, 20], [70, 150]]), line([[230, 20], [230, 150]]),
      label(60, 50, '+', 'end'), label(60, 90, '+', 'end'), label(60, 130, '+', 'end'), label(242, 50, '−', 'start'), label(242, 90, '−', 'start'), label(242, 130, '−', 'start'),
      { t: 'box', x: 110, y: 30, w: 80, h: 110 }, label(100, 60, '−'), label(100, 100, '−'), label(200, 60, '+'), label(200, 100, '+'),
      label(70, 166, 'A'), label(150, 90, 'B'), label(100, 22, 'C'),
    ]),
  }),
  figure(B(2, 3), 'The graph shows how the potential V changes along the x-axis. Where is the field strongest, and what is the field between x = 0 and x = 2 m?', ['Strongest between 3 m and 4 m, where V falls fastest: E = 6 V m⁻¹.', 'Between 0 and 2 m, E = (10 − 6)/2 = 2 V m⁻¹, along +x.'], {
    shown: graph('x (m)', 'V (V)', [{ points: [[0, 10], [2, 6], [3, 6], [4, 0]] }], { x: [[2, '2'], [3, '3'], [4, '4']], y: [[10, '10'], [6, '6']] }),
  }),
];

export default questions;
