// Written by hand: practical work with measuring instruments, of each type the subtopic lacked, up to three. Places are at(unit, topic)(marks, difficulty).
// The screw gauge figure: a sleeve marked in millimetres above the line and half-millimetres below it, with the thimble’s edge just past 3.5 mm and its 28th division on the line.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, match } = kit('physics', 'XI');
const P = at(1, 'p');

// Sleeve: 24 px to a millimetre from x = 40; the thimble’s edge is at 3.5 mm plus a little, at x = 130.
const gauge: SketchMark[] = [
  line([[30, 80], [130, 80]]), ...[0, 1, 2, 3].flatMap((k) => [line([[40 + 24 * k, 80], [40 + 24 * k, 68]]), label(40 + 24 * k, 62, `${k}`)]),
  ...[0, 1, 2, 3].map((k) => line([[52 + 24 * k, 80], [52 + 24 * k, 90]])),
  { t: 'box', x: 130, y: 40, w: 90, h: 80 },
  ...Array.from({ length: 9 }, (_, i) => 24 + i).map((d) => line([[130, 80 - 6 * (d - 28)], [d % 5 === 0 ? 148 : 140, 80 - 6 * (d - 28)]])),
  label(152, 102, '25', 'start'), label(152, 72, '30', 'start'), label(228, 84, 'thimble', 'start'), label(30, 112, 'sleeve', 'start'),
];

const questions: BankDef[] = [
  figure(P(3, 2), 'The figure shows a screw gauge of pitch 0.5 mm, with 50 divisions on its thimble. Find its least count and the reading.', ['Least count = pitch/number of divisions = 0.5/50 = 0.01 mm.', 'The last mark showing on the sleeve is the half-millimetre mark after 3 mm, so the linear reading is 3.5 mm.', 'The 28th thimble division is on the line: reading = 3.5 + 28 × 0.01 = 3.78 mm.'], {
    shown: sketch(300, 140, 'A screw gauge sleeve with a reference line along it, marked in whole millimetres 0 to 3 above the line and half-millimetres below. The thimble’s edge stands just past the half-millimetre mark after 3. On the thimble, the division 28, between the marks numbered 25 and 30, lies on the reference line.', gauge),
  }),
  figure(P(3, 2), 'Draw a top view of a spherometer’s legs, showing the distance l used, and explain how l and the height h give the radius of curvature of a surface.', ['The three outer legs stand at the corners of an equilateral triangle, with the centre leg at its centre.', 'l is the mean distance between pairs of outer legs, measured by pressing them on paper.', 'R = l²/6h + h/2, where h is the height the centre leg is raised or lowered from the flat position.'], {
    answer: sketch(260, 200, 'Three dots at the corners of an equilateral triangle, the outer legs, joined by thin lines. A fourth dot at the centre of the triangle is the centre leg. One side of the triangle is marked l.', [
      { t: 'path', d: 'M130 30 L210 168 L50 168 Z' }, { t: 'dot', x: 130, y: 30 }, { t: 'dot', x: 210, y: 168 }, { t: 'dot', x: 50, y: 168 }, { t: 'dot', x: 130, y: 122 },
      label(130, 186, 'l'), label(130, 146, 'centre leg'), label(140, 30, 'outer leg', 'start'),
    ]),
  }),
  figure(P(3, 2), 'Vernier callipers of least count 0.01 cm have their jaws closed, as shown. Find the zero error. With a block between the jaws, the main scale reads 4.2 cm and the 5th vernier division is in line. Find the corrected length.', ['The vernier zero is to the right of the main-scale zero, and its 3rd division is in line, so the zero error is +3 × 0.01 = +0.03 cm.', 'Observed reading = 4.2 + 5 × 0.01 = 4.25 cm.', 'Corrected length = 4.25 − (+0.03) = 4.22 cm.'], {
    shown: sketch(320, 130, 'A main scale with its zero mark, and under it a 10-division vernier whose zero lies a little to the right of the main zero. The vernier’s 3rd division lines up with a main-scale mark.', [
      line([[20, 50], [300, 50]]), ...Array.from({ length: 13 }, (_, i) => line([[40 + 20 * i, 50], [40 + 20 * i, i % 10 === 0 ? 26 : i % 5 === 0 ? 34 : 40]])), label(40, 20, '0'), label(240, 20, '1 cm'),
      line([[44, 54], [230, 54]]), ...Array.from({ length: 11 }, (_, k) => line([[46 + 18 * k, 54], [46 + 18 * k, k % 5 === 0 ? 78 : 70]])),
      label(46, 94, '0'), label(136, 94, '5'), label(226, 94, '10'), label(100, 118, '3rd division in line'),
    ]),
  }),

  predict(P(2, 2), 'When a spherometer is put on a curved surface, its centre leg has to be screwed down below the level of the outer legs before it touches. Predict whether the surface is convex or concave.', 'It is concave.', 'The middle of the surface is lower than the points under the outer legs, as in a hollow.'),

  odd(P(2, 1), ['vernier callipers', 'a screw gauge', 'a spherometer', 'a metre rule'], 'a metre rule', 'It reads only to 1 mm; the others use a vernier or a screw to read much finer.'),
  odd(P(2, 1), ['main scale', 'vernier scale', 'thimble', 'depth strip'], 'thimble', 'It is part of a screw gauge; the others are parts of vernier callipers.'),
  odd(P(2, 2), ['pitch', 'least count', 'zero error', 'radius of curvature'], 'radius of curvature', 'It is a quantity measured with an instrument, the spherometer; the others describe the instrument itself.'),

  long(P(5, 2), 'Describe how vernier callipers are used to find the inside volume of a small beaker.\n(a) How is the inner diameter measured? [1]\n(b) How is the inside depth measured? [1]\n(c) How is the zero error dealt with? [1]\n(d) The inner diameter is 4.20 cm and the depth 5.00 cm. Find the volume. [1]\n(e) Give one precaution. [1]', '(a) With the inside jaws, at several places, in directions at right angles, taking the mean.', '(b) With the depth strip, resting the end of the main scale on the rim and pushing the strip to the bottom.', '(c) It is found with the jaws closed, and subtracted, with its sign, from each reading.', '(d) V = πd²h/4 = π × 4.20² × 5.00/4 = 69.3 cm³.', '(e) The jaws are not pressed hard against the glass, and the callipers are held square to it.'),

  match(P(4, 2), [['Least count of vernier callipers', '1 main-scale division − 1 vernier division'], ['Least count of a screw gauge', 'pitch/number of circular divisions'], ['Radius of curvature by spherometer', 'l²/6h + h/2'], ['Corrected reading', 'observed reading − zero error']]),
  match(P(4, 1), [['Measuring the depth of a hole', 'the strip of vernier callipers'], ['Holding a wire in a screw gauge', 'between the stud and the spindle'], ['Stopping a screw gauge pressing too hard', 'the ratchet'], ['Reading a spherometer', 'the vertical scale and the disc scale']]),
];

export default questions;
