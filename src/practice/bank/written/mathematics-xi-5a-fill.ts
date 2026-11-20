// Written by hand: measures of dispersion, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XI');
const D = at(5, 'a');

// Two dot plots on one scale from 0 to 10, 28 px to a unit from x = 30.
const px = (v: number) => 30 + 28 * v;
const dots: SketchMark[] = [
  label(10, 54, 'A', 'start'), ...[3, 4, 5, 6, 7].map((v) => ({ t: 'dot' as const, x: px(v), y: 50 })),
  label(10, 104, 'B', 'start'), ...[1, 3, 5, 7, 9].map((v) => ({ t: 'dot' as const, x: px(v), y: 100 })),
  line([[px(0), 140], [px(10), 140]]), ...[0, 2, 4, 6, 8, 10].flatMap((v) => [line([[px(v), 136], [px(v), 144]]), label(px(v), 160, `${v}`)]),
];

const questions: BankDef[] = [
  figure(D(3, 2), 'The dot plots show two sets of five values, A and B, on the same scale. Find the mean and range of each, and say which has the larger standard deviation.', ['A is 3, 4, 5, 6, 7 and B is 1, 3, 5, 7, 9: both have mean 5.', 'The range of A is 4 and of B is 8.', 'B’s values lie further from the mean, so B has the larger standard deviation: $\\sqrt{8}$ against $\\sqrt{2}$.'], {
    shown: sketch(340, 175, 'Two rows of five dots above a number line from 0 to 10. Row A has dots at 3, 4, 5, 6 and 7. Row B has dots at 1, 3, 5, 7 and 9.', dots),
  }),
  figure(D(3, 1), 'Find the mean deviation about the mean of 3, 5, 7, 9 and 11, setting out the working in a table.', ['The mean is $\\dfrac{35}{5} = 7$.', 'The deviations from it are $-4, -2, 0, 2, 4$, and their absolute values add up to 12.', 'Mean deviation $= \\dfrac{12}{5} = 2.4$.'], {
    answer: table(['x', 'x − 7', '|x − 7|'], [['3', '−4', '4'], ['5', '−2', '2'], ['7', '0', '0'], ['9', '2', '2'], ['11', '4', '4']], 'The sum of |x − 7| is 12, so the mean deviation is 12/5 = 2.4.'),
  }),
  figure(D(3, 3), 'The table gives a grouped frequency distribution. Using the mid-values of the classes, find the mean, the variance and the standard deviation.', ['The mid-values are 5, 15, 25 and 35, so the mean is $\\dfrac{5 \\times 2 + 15 \\times 3 + 25 \\times 4 + 35 \\times 1}{10} = \\dfrac{190}{10} = 19$.', '$\\dfrac{\\sum f x^2}{\\sum f} = \\dfrac{50 + 675 + 2500 + 1225}{10} = 445$, so the variance is $445 - 19^2 = 84$.', 'The standard deviation is $\\sqrt{84} \\approx 9.17$.'], {
    shown: table(['Class', '0–10', '10–20', '20–30', '30–40'], [['Frequency', '2', '3', '4', '1']]),
  }),

  predict(D(2, 1), 'All ten values in a set are 7. Predict their range, mean deviation and variance.', 'Every value equals the mean, 7, so every deviation is 0.', 'The range, the mean deviation and the variance are all 0.'),
  predict(D(2, 2), 'One value far larger than the rest is added to a set of data. Predict its effect on the range and the standard deviation.', 'The range grows, as it now ends at the new value.', 'The standard deviation grows a great deal too, as that value’s large squared deviation is included.'),
  predict(D(2, 2), 'Batsman A averages 50 runs with a standard deviation of 10, and batsman B averages 40 with a standard deviation of 4. Predict which is more consistent, and explain.', 'Their coefficients of variation are $\\dfrac{10}{50} \\times 100 = 20\\%$ and $\\dfrac{4}{40} \\times 100 = 10\\%$.', 'B has the smaller coefficient of variation, so B is more consistent.'),

  odd(D(2, 1), ['range', 'mean deviation', 'standard deviation', 'median'], 'median', 'It measures the centre of the data; the others measure spread.'),
  odd(D(2, 2), ['2, 4, 6', '12, 14, 16', '102, 104, 106', '2, 6, 10'], '2, 6, 10', 'It is twice as spread out; the other three have the same standard deviation, as each is the first moved along.'),
  odd(D(2, 2), ['range', 'standard deviation', 'mean deviation', 'variance'], 'variance', 'It is in squared units; the others are in the same units as the data.'),

  long(D(6, 2), 'Find the mean deviation about the median of 6, 7, 10, 12, 13, 4, 8 and 12.\n(a) Find the median. [2]\n(b) Find the absolute deviations from it. [2]\n(c) Find the mean deviation. [2]', '(a) In order: 4, 6, 7, 8, 10, 12, 12, 13.', '(a) There are 8 values, so the median is the mean of the 4th and 5th: $\\dfrac{8 + 10}{2} = 9$.', '(b) The absolute deviations are 5, 3, 2, 1, 1, 3, 3 and 4.', '(b) They add up to 22.', '(c) Mean deviation $= \\dfrac{22}{8}$.', '(c) $= 2.75$.'),
  long(D(6, 2), 'The values 2, 4, 6 and 8 have frequencies 3, 5, 8 and 4. Find the mean, the variance and the standard deviation.', '$\\sum f = 20$ and $\\sum fx = 6 + 20 + 48 + 32 = 106$.', 'Mean $= \\dfrac{106}{20} = 5.3$.', '$\\sum fx^2 = 12 + 80 + 288 + 256 = 636$.', 'Variance $= \\dfrac{636}{20} - 5.3^2 = 31.8 - 28.09$.', '$= 3.71$.', 'Standard deviation $= \\sqrt{3.71} \\approx 1.93$.'),

  tell(D(2, 1), 'Distinguish between variance and standard deviation.', 'Variance is the mean of the squared deviations from the mean, in squared units.', 'Standard deviation is the square root of the variance, in the same units as the data.'),
  tell(D(2, 1), 'Distinguish between the range and the standard deviation as measures of spread.', 'The range uses only the largest and smallest values, so one unusual value changes it a lot.', 'The standard deviation uses every value’s distance from the mean.'),
  tell(D(2, 2), 'Distinguish between the mean deviation about the mean and about the median.', 'About the mean: $\\dfrac{1}{n}\\sum |x_i - \\bar{x}|$.', 'About the median: $\\dfrac{1}{n}\\sum |x_i - M|$, which is never larger than the mean deviation about any other point.'),

  match(D(4, 2), [['The range of 3, 8, 5, 12', '9'], ['The mean of 3, 8, 5, 12', '7'], ['The median of 3, 8, 5, 12', '6.5'], ['The mean deviation about the mean of 3, 8, 5, 12', '3']]),
  match(D(4, 1), [['$\\sigma^2$', 'variance'], ['$\\sigma$', 'standard deviation'], ['$\\dfrac{\\sigma}{\\bar{x}} \\times 100$', 'coefficient of variation'], ['$\\dfrac{1}{n}\\sum |x_i - \\bar{x}|$', 'mean deviation about the mean']]),
  match(D(4, 2), [['Add 5 to every value', 'the standard deviation is unchanged'], ['Multiply every value by 3', 'the standard deviation is multiplied by 3'], ['Multiply every value by $-2$', 'the standard deviation is multiplied by 2'], ['Divide every value by 4', 'the variance is divided by 16']]),

  reason(D(2, 1), 'Why is the standard deviation usually given rather than the variance?', 'The variance is in squared units, such as square centimetres for lengths.', 'The standard deviation, its square root, is in the same units as the data, so it is easier to read.'),
  reason(D(2, 1), 'Why are absolute values taken in finding the mean deviation?', 'The deviations from the mean, with their signs, always add up to zero.', 'Taking absolute values stops the positive and negative deviations cancelling.'),
  reason(D(2, 2), 'Why is the coefficient of variation used to compare the spread of data with different means?', 'It gives the standard deviation as a percentage of the mean.', 'So it measures spread relative to size, and has no units, which makes sets with different means comparable.'),

  short(D(2, 1), 'Find the range and the mean deviation about the mean of 10, 12, 14, 16 and 18.', 'The range is $18 - 10 = 8$, and the mean is 14.', 'The absolute deviations are 4, 2, 0, 2, 4, so the mean deviation is $\\dfrac{12}{5} = 2.4$.'),
  short(D(2, 1), 'Ten values have a mean of 20 and a variance of 9. Find their coefficient of variation.', 'The standard deviation is $\\sqrt{9} = 3$.', 'Coefficient of variation $= \\dfrac{3}{20} \\times 100 = 15\\%$.'),

  ar(D(1, 1), 'The deviations of a set of values from their mean add up to zero.', 'The mean balances the values above it against those below it.', 1, 'So the positive and negative deviations cancel exactly.'),
  ar(D(1, 2), 'The variance of 2, 4 and 6 is 4.', 'Variance is the mean of the squared deviations from the mean.', 4, 'The squared deviations are 4, 0 and 4, so the variance is $\\dfrac{8}{3}$.'),
  ar(D(1, 1), 'A standard deviation can’t be negative.', 'The median is the middle value of ordered data.', 2, 'Both are true, but a standard deviation can’t be negative because it is a square root.'),

  derive(D(3, 2), 'Show that the variance of $x_1, x_2, \\dots, x_n$ can be written as $\\dfrac{1}{n}\\sum x_i^2 - \\bar{x}^2$.', ['$\\sigma^2 = \\dfrac{1}{n}\\sum (x_i - \\bar{x})^2 = \\dfrac{1}{n}\\sum x_i^2 - \\dfrac{2\\bar{x}}{n}\\sum x_i + \\bar{x}^2$.', 1], ['$\\dfrac{1}{n}\\sum x_i = \\bar{x}$, so the middle term is $-2\\bar{x}^2$.', 1], ['So $\\sigma^2 = \\dfrac{1}{n}\\sum x_i^2 - \\bar{x}^2$.', 1]),
  derive(D(3, 1), 'Show that adding a constant $c$ to every value leaves the variance unchanged.', ['The new values are $x_i + c$, and their mean is $\\bar{x} + c$.', 1], ['Each new deviation is $(x_i + c) - (\\bar{x} + c) = x_i - \\bar{x}$, the same as before.', 1], ['So the squared deviations, and the variance, are unchanged.', 1]),
  derive(D(3, 2), 'Show that multiplying every value by a constant $k$ multiplies the standard deviation by $|k|$.', ['The new values are $kx_i$, with mean $k\\bar{x}$, so each deviation becomes $k(x_i - \\bar{x})$.', 1], ['Each squared deviation is multiplied by $k^2$, so the variance becomes $k^2\\sigma^2$.', 1], ['Taking the square root, the standard deviation becomes $|k|\\sigma$.', 1]),
];

export default questions;
