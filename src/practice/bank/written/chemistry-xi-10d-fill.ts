// Written by hand: paper chromatography, of each type the subtopic lacked, up to three. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The ink chromatogram is drawn to scale, 20 px to a centimetre above a base line at y = 190, with the solvent front 8.0 cm up.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, ar } = kit('chemistry', 'XI');
const C = at(10, 'd');

const up = (cm: number) => 190 - 20 * cm;
/** A lane of spots at x, at the heights given in cm above the base line. */
const lane = (x: number, name: string, heights: number[]): SketchMark[] => [
  { t: 'dot', x, y: 190 }, ...heights.map((h) => ({ t: 'circle' as const, x, y: up(h), r: 5 })), label(x, 210, name),
];

const questions: BankDef[] = [
  figure(C(3, 1), 'Draw a labelled diagram of paper chromatography in progress.', ['A strip of chromatography paper hangs in a covered jar, its lower end dipping in the solvent.', 'A pencil base line, with the spot of the mixture on it, is above the level of the solvent.', 'The solvent rises up the paper, carrying the substances at different rates; the jar is covered to keep the air inside saturated with solvent vapour.'], {
    answer: sketch(320, 240, 'A tall glass jar with a lid. A strip of paper hangs from the lid, its bottom end dipping into a shallow layer of solvent. A pencil base line with a spot on it is just above the solvent. Higher up, the solvent front is marked, with separated spots below it.', [
      { t: 'path', d: 'M70 30 L70 220 L210 220 L210 30' }, line([[60, 30], [220, 30]]), label(226, 34, 'lid', 'start'),
      { t: 'box', x: 120, y: 30, w: 40, h: 180 }, line([[72, 196], [208, 196]], { dash: 1 }), label(216, 204, 'solvent', 'start'),
      line([[120, 180], [160, 180]]), { t: 'dot', x: 140, y: 180 }, label(216, 180, 'base line', 'start'),
      line([[120, 80], [160, 80]], { dash: 1 }), label(216, 84, 'solvent front', 'start'),
      { t: 'circle', x: 140, y: 100, r: 5 }, { t: 'circle', x: 140, y: 140, r: 5 }, label(64, 120, 'spots', 'end'),
    ]),
  }),
  figure(C(3, 2), 'The chromatogram shows an ink X run beside three dyes, A, B and C, in the same solvent, with the solvent front 8.0 cm above the base line. Which dyes does X contain? Find the Rf value of each of its spots.', ['X has two spots, level with those of A and C, so it contains dyes A and C, and not B.', 'The spot level with A is 6.0 cm up: Rf = 6.0/8.0 = 0.75.', 'The spot level with C is 2.4 cm up: Rf = 2.4/8.0 = 0.30.'], {
    shown: sketch(300, 220, 'A chromatogram with four lanes, X, A, B and C, from the base line. X has two spots, at 6.0 cm and 2.4 cm. A has one spot at 6.0 cm, B one at 4.0 cm, and C one at 2.4 cm. The solvent front is at 8.0 cm.', [
      line([[30, 190], [270, 190]]), line([[30, up(8)], [270, up(8)]], { dash: 1 }), label(150, up(8) - 8, 'solvent front, 8.0 cm'),
      ...lane(60, 'X', [6, 2.4]), ...lane(120, 'A', [6]), ...lane(180, 'B', [4]), ...lane(240, 'C', [2.4]),
    ]),
  }),
  figure(C(3, 2), 'An extract of green leaves gives four bands, at 9.5, 7.0, 4.5 and 3.5 cm above the base line, with the solvent front at 10.0 cm. Make a table of their Rf values, and say which pigment is most soluble in the solvent.', ['Rf values: 0.95, 0.70, 0.45 and 0.35.', 'In order, these are carotene, xanthophyll, chlorophyll a and chlorophyll b.', 'Carotene, with the largest Rf, is the most soluble in the solvent and the least held by the paper.'], {
    answer: table(['Band (cm above base line)', 'Rf', 'Pigment'], [['9.5', '0.95', 'carotene'], ['7.0', '0.70', 'xanthophyll'], ['4.5', '0.45', 'chlorophyll a'], ['3.5', '0.35', 'chlorophyll b']]),
  }),

  predict(C(2, 1), 'A student puts a large, heavy spot of ink on the base line. Predict how this affects the chromatogram.', 'The spots spread into long streaks.', 'They overlap, so the dyes aren’t separated clearly; small, concentrated spots are better.'),
  predict(C(2, 2), 'A run is stopped when the solvent has risen only half as far as usual. Predict the Rf values of the spots.', 'They are unchanged.', 'Each spot moves a fixed fraction of the distance moved by the solvent, so the ratio stays the same, though the spots are closer together.'),

  odd(C(2, 1), ['filter paper', 'a strip of chalk', 'silica gel on a plate', 'the solvent'], 'the solvent', 'It is the mobile phase; the others can act as the stationary phase.'),
  odd(C(2, 1), ['a pencil base line', 'solvent below the base line', 'a covered jar', 'a large spot'], 'a large spot', 'It is a poor practice, causing streaks; the others are correct.'),
  odd(C(2, 1), ['carotene', 'xanthophyll', 'chlorophyll a', 'haemoglobin'], 'haemoglobin', 'It is a pigment of blood, not of leaves; the others are leaf pigments.'),

  long(C(5, 1), 'Describe how the pigments of a green leaf are separated by paper chromatography.\n(a) How is the extract made? [1]\n(b) How is the paper prepared? [1]\n(c) How is it run? [1]\n(d) One band is 6.3 cm above the base line, with the solvent front at 9.0 cm. Find its Rf value. [1]\n(e) Why do the pigments move different distances? [1]', '(a) Grind the leaves with a little propanone in a mortar, and filter.', '(b) Draw a pencil base line near the bottom of a strip of paper, and put a small spot of extract on it, drying and adding again several times.', '(c) Hang the strip in a covered jar with solvent below the base line, until the solvent has nearly reached the top; mark the solvent front at once.', '(d) Rf = 6.3/9.0 = 0.70.', '(e) Each divides itself differently between the solvent and the water held in the paper, depending on its solubility.'),
  long(C(5, 2), 'In one solvent, a red dye has Rf 0.30, a blue dye 0.55 and a yellow dye 0.80. A green ink gives two spots, 4.4 cm and 6.4 cm above the base line, with the solvent front at 8.0 cm.\n(a) Find the Rf of each spot. [2]\n(b) Which dyes does the green ink contain? [1]\n(c) Why must the same solvent be used for the comparison? [1]\n(d) How do you know the ink has no red dye? [1]', '(a) 4.4/8.0 = 0.55.', '(a) 6.4/8.0 = 0.80.', '(b) Blue and yellow.', '(c) Rf values depend on the solvent, so they can only be compared in the same one.', '(d) There is no spot at Rf 0.30, that is, 2.4 cm up.'),
  long(C(5, 2), 'Answer each part on Rf values.\n(a) Define the Rf value. [1]\n(b) A spot has moved 2.7 cm when the solvent has moved 9.0 cm. Find its Rf. [1]\n(c) Where will the spot be when the solvent has moved 12.0 cm? [1]\n(d) Two dyes have Rf values 0.40 and 0.45. How far apart are their spots when the solvent has moved 8.0 cm? [1]\n(e) How could they be separated better? [1]', '(a) The distance moved by a substance divided by the distance moved by the solvent front, both from the base line.', '(b) 2.7/9.0 = 0.30.', '(c) 0.30 × 12.0 = 3.6 cm above the base line.', '(d) 0.45 × 8.0 − 0.40 × 8.0 = 3.6 − 3.2 = 0.4 cm.', '(e) Use a longer strip and run it further, or try another solvent in which their Rf values differ more.'),

  tell(C(2, 2), 'Distinguish between adsorption and partition as the basis of chromatography.', 'In adsorption, the substances stick to the surface of a solid stationary phase, such as chalk or silica, to different extents.', 'In partition, as in paper chromatography, they divide themselves between two liquids: the water held in the paper and the moving solvent.'),
  tell(C(2, 1), 'Distinguish between chromatography and a chromatogram.', 'Chromatography is the method of separating a mixture as a solvent carries it over a stationary phase.', 'A chromatogram is the record it produces: the paper with the separated spots.'),

  match(C(4, 1), [['The paper', 'the stationary phase'], ['The solvent', 'the mobile phase'], ['The pencil line near the bottom', 'the base line'], ['The highest line reached by the solvent', 'the solvent front']]),
  match(C(4, 2), [['Carotene', 'orange-yellow, moves furthest'], ['Xanthophyll', 'yellow'], ['Chlorophyll a', 'blue-green'], ['Chlorophyll b', 'yellow-green, moves least']]),
  match(C(4, 1), [['An Rf of 0', 'the substance didn’t move from the base line'], ['An Rf close to 1', 'the substance moves almost with the solvent'], ['The same Rf in the same solvent', 'probably the same substance'], ['Several spots from one sample', 'the sample is a mixture']]),

  reason(C(2, 1), 'Give reasons. (a) The spot put on the base line is kept small. (b) The Rf value of a substance doesn’t depend on how far the solvent is allowed to run.', '(a) A small spot gives small, separate spots; a large one spreads into overlapping streaks.', '(b) The substance always moves the same fraction of the distance the solvent moves.'),

  ar(C(1, 1), 'An Rf value has no unit.', 'It is the ratio of two distances.', 1, 'The units of the two distances cancel.'),
];

export default questions;
