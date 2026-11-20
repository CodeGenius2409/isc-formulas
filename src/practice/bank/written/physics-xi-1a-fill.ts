// Written by hand: units and measurement, of each type the subtopic lacked, up to three. Places are at(unit, topic)(marks, difficulty).
// The vernier figure is drawn to scale: 20 px to a millimetre on the main scale from 2.0 cm at x = 30; the vernier’s 10 divisions span 9 mm, and its zero is at 2.37 cm.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, match } = kit('physics', 'XI');
const M = at(1, 'a');

const vernier: SketchMark[] = [
  line([[20, 60], [310, 60]]), ...Array.from({ length: 14 }, (_, i) => line([[30 + 20 * i, 60], [30 + 20 * i, i % 10 === 0 ? 36 : i % 5 === 0 ? 44 : 50]])),
  label(30, 30, '2 cm'), label(230, 30, '3 cm'),
  line([[94, 64], [300, 64]]), ...Array.from({ length: 11 }, (_, k) => line([[104 + 18 * k, 64], [104 + 18 * k, k % 5 === 0 ? 88 : 80]])),
  label(104, 104, '0'), label(194, 104, '5'), label(284, 104, '10'),
  line([[230, 120], [230, 92]], { arrow: 1 }), label(230, 134, 'these marks line up'),
];

const target = (cx: number, dots: [number, number][], name: string): SketchMark[] => [
  { t: 'circle', x: cx, y: 60, r: 36 }, { t: 'circle', x: cx, y: 60, r: 18 }, { t: 'circle', x: cx, y: 60, r: 3 },
  ...dots.map(([dx, dy]) => ({ t: 'dot' as const, x: cx + dx, y: 60 + dy })), label(cx, 116, name),
];

const questions: BankDef[] = [
  figure(M(3, 2), 'The figure shows the main scale and vernier of a calliper, in which 10 vernier divisions equal 9 main-scale millimetres. Find the least count and the reading.', ['Least count = 1 main-scale division − 1 vernier division = 1 mm − 0.9 mm = 0.1 mm = 0.01 cm.', 'The vernier zero lies just past 2.3 cm, so the main-scale reading is 2.3 cm.', 'The 7th vernier mark lines up with a main-scale mark, so the reading is 2.3 + 7 × 0.01 = 2.37 cm.'], {
    shown: sketch(320, 145, 'A main scale marked in millimetres from 2 cm to past 3 cm, with a sliding vernier scale under it. The vernier’s zero is just past the 2.3 cm mark. Its 7th mark lines up exactly with a main-scale mark.', vernier),
  }),
  figure(M(3, 2), 'A screw gauge has a zero error of +0.02 mm. The table gives three readings of the diameter of a wire with it. Find the corrected diameter.', ['The mean of the readings is (2.45 + 2.47 + 2.46)/3 = 2.46 mm.', 'A positive zero error makes every reading too large, so it is subtracted.', 'Corrected diameter = 2.46 − 0.02 = 2.44 mm.'], {
    shown: table(['Reading', 'Diameter shown (mm)'], [['1', '2.45'], ['2', '2.47'], ['3', '2.46']], 'Zero error: +0.02 mm.'),
  }),
  figure(M(2, 2), 'Draw targets to show the difference between accuracy and precision: shots that are precise but not accurate, and shots that are both accurate and precise.', ['Precise but not accurate: the shots are close together, but away from the centre.', 'Accurate and precise: the shots are close together and at the centre.'], {
    answer: sketch(320, 130, 'Two targets. On the left, the shots are bunched tightly together but well away from the centre: precise, not accurate. On the right, the shots are bunched tightly at the centre: accurate and precise.', [
      ...target(90, [[18, -18], [22, -14], [16, -12], [20, -20]], 'precise, not accurate'),
      ...target(240, [[2, -2], [-3, 1], [1, 3], [-1, -3]], 'accurate and precise'),
    ]),
  }),

  predict(M(2, 1), 'A student tries to measure the thickness of one sheet of paper with a metre rule. Predict the difficulty, and suggest a better method.', 'One sheet is far thinner than the rule’s least count, 1 mm, so it can’t be measured directly.', 'Measure the thickness of a stack of, say, 200 sheets and divide by 200.'),
  predict(M(2, 2), 'The diameter of a disc is measured with an error of 2%. Predict the percentage error in the area worked out from it.', 'Area = πd²/4, so it depends on d squared.', 'The percentage error doubles: 4%.'),
  predict(M(2, 1), 'Predict the number of significant figures in 0.00450 and in 4.50 × 10⁻³.', 'Both have 3 significant figures: 4, 5 and the final 0.', 'The leading zeros of 0.00450 only place the decimal point, and aren’t significant.'),

  odd(M(2, 1), ['metre', 'kilogram', 'second', 'newton'], 'newton', 'It is a derived unit; the others are base units of SI.'),
  odd(M(2, 1), ['light year', 'parsec', 'astronomical unit', 'year'], 'year', 'It is a unit of time; the others are units of length used in astronomy.'),

  long(M(5, 2), 'In finding g with a simple pendulum, its length is 100.0 ± 0.1 cm, and 20 oscillations take 40.0 ± 0.2 s.\n(a) Find the period. [1]\n(b) Find g, using g = 4π²l/T². [1]\n(c) Find the percentage error in g. [2]\n(d) Write g with its absolute error. [1]', '(a) T = 40.0/20 = 2.00 s.', '(b) g = 4π² × 1.000/2.00² = 9.87 m/s².', '(c) The percentage error in l is 0.1%, and in T is 0.2/40.0 = 0.5%.', '(c) The percentage error in g is 0.1 + 2 × 0.5 = 1.1%.', '(d) 1.1% of 9.87 is 0.11, so g = 9.87 ± 0.11 m/s².'),
  long(M(5, 1), 'Answer each part on significant figures.\n(a) How many significant figures are there in 0.0300, 2.050 and 6.02 × 10²³? [2]\n(b) Round 4.2356 to three significant figures. [1]\n(c) Work out 3.14 × 2.2 to the right number of significant figures. [1]\n(d) Work out 12.11 + 18.0 + 1.012 to the right number of decimal places. [1]', '(a) 0.0300 has 3, and 2.050 has 4.', '(a) 6.02 × 10²³ has 3.', '(b) 4.24.', '(c) 6.908 is rounded to 2 significant figures, as in 2.2: 6.9.', '(d) 31.122 is rounded to one decimal place, as in 18.0: 31.1.'),
  long(M(5, 2), 'Answer each part on the parallax method.\n(a) What is parallax? [1]\n(b) How is the distance D of a far object found from the basis b and the parallax angle θ, in radians? [1]\n(c) Two observers 6.4 × 10⁶ m apart see the Moon with a parallax angle of 0.955°. Find its distance. [2]\n(d) Why must the basis be very large to find the distance of a star? [1]', '(a) The apparent shift in the position of an object against a distant background when it is seen from two different points.', '(b) D = b/θ.', '(c) θ = 0.955 × π/180 = 0.01667 rad.', '(c) D = 6.4 × 10⁶/0.01667 = 3.84 × 10⁸ m.', '(d) A star is so far away that its parallax from any basis on the Earth is far too small to measure; the diameter of the Earth’s orbit is used instead.'),

  match(M(4, 1), [['Length', 'metre'], ['Mass', 'kilogram'], ['Luminous intensity', 'candela'], ['Amount of substance', 'mole']]),
  match(M(4, 2), [['1 fermi', '10⁻¹⁵ m'], ['1 ångström', '10⁻¹⁰ m'], ['1 astronomical unit', '1.5 × 10¹¹ m'], ['1 light year', '9.46 × 10¹⁵ m']]),
  match(M(4, 1), [['A vernier calliper', 'least count 0.01 cm'], ['A screw gauge', 'least count 0.001 cm'], ['A metre rule', 'least count 0.1 cm'], ['A stopwatch', 'least count about 0.1 s']]),
];

export default questions;
