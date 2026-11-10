// Written by hand: sequences and series, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('mathematics', 'XI');
const G = at(2, 'e');

// The sequence 3, 7, 11, 15, 19 plotted with the origin at (40, 190), 50 px to each n and 8 px to each unit.
const terms = [3, 7, 11, 15, 19];
const dots: SketchMark[] = terms.flatMap((a, i) => [{ t: 'dot' as const, x: 90 + 50 * i, y: 190 - 8 * a }, label(96 + 50 * i, 186 - 8 * a, `${a}`, 'start'), label(90 + 50 * i, 206, `${i + 1}`)]);

// A 4 × 4 grid of 30 px squares, each marked with the odd number of the L-shaped layer it belongs to.
const grid: SketchMark[] = [0, 1, 2, 3].flatMap((i) => [0, 1, 2, 3].flatMap((j) => [{ t: 'box' as const, x: 40 + 30 * j, y: 130 - 30 * i, w: 30, h: 30 }, label(55 + 30 * j, 150 - 30 * i, `${2 * Math.max(i, j) + 1}`)]));

const questions: BankDef[] = [
  figure(G(3, 1), 'The figure plots the first five terms of a sequence against their position n. Say what kind of sequence it is, and find its first term, common difference and 20th term.', ['The points lie on a straight line, so the terms go up by the same amount each time: it is an AP.', 'The first term is $a = 3$, and the common difference is $d = 7 - 3 = 4$.', '$a_{20} = 3 + 19 \\times 4 = 79$.'], {
    shown: sketch(320, 220, 'Axes with n across and the term up. Five dots at n = 1 to 5, at heights 3, 7, 11, 15 and 19, lying on a straight line.', [
      arrow([40, 190], [310, 190]), arrow([40, 190], [40, 14]), label(306, 206, 'n', 'end'), label(48, 20, 'term', 'start'), ...dots,
    ]),
  }),
  figure(G(2, 2), 'Draw a square of 4 × 4 small squares split into L-shaped layers, and use it to show that the sum of the first $n$ odd numbers is $n^2$.', ['The corner square is 1, and each L-shaped layer round it adds the next odd number, 3, 5 and 7, making a 2 × 2, 3 × 3 and then 4 × 4 square.', 'So $1 + 3 + 5 + 7 = 16 = 4^2$, and in general $1 + 3 + \\dots + (2n - 1) = n^2$.'], {
    answer: sketch(260, 200, 'A 4 by 4 grid of squares. The bottom-left square is marked 1. The L-shaped layer around it, 3 squares, is marked 3; the next layer, 5 squares, is marked 5; the outer layer, 7 squares, is marked 7. Below the grid is written 1 + 3 + 5 + 7 = 4².', [
      ...grid, label(100, 186, '1 + 3 + 5 + 7 = 4²'),
    ]),
  }),
  figure(G(3, 2), 'A square of side 1 is cut in half, the remaining half is cut in half, and so on for ever. Draw the first few pieces, and use the picture to find the sum of $\\dfrac{1}{2} + \\dfrac{1}{4} + \\dfrac{1}{8} + \\dots$', ['Each piece is half of what was left, so the areas are $\\dfrac{1}{2}, \\dfrac{1}{4}, \\dfrac{1}{8}, \\dots$, a GP with $a = \\dfrac{1}{2}$ and $r = \\dfrac{1}{2}$.', 'Together the pieces fill the whole square, without overlapping, so the sum to infinity is 1.', 'Check: $S_\\infty = \\dfrac{a}{1 - r} = \\dfrac{1/2}{1/2} = 1$.'], {
    answer: sketch(240, 200, 'A square of side 1. Its left half is marked one half. The top of the right half is marked one quarter. Of what is left, the left part is marked one eighth, and the top of the rest is marked one sixteenth, leaving smaller and smaller pieces in the bottom-right corner.', [
      { t: 'box', x: 40, y: 20, w: 160, h: 160 }, line([[120, 20], [120, 180]]), line([[120, 100], [200, 100]]), line([[160, 100], [160, 180]]), line([[160, 140], [200, 140]]), line([[180, 140], [180, 180]]),
      label(80, 105, '½'), label(160, 65, '¼'), label(140, 145, '⅛'), label(180, 125, '1/16'),
    ]),
  }),

  predict(G(2, 1), 'Every term of an AP is multiplied by 3. Predict whether the new sequence is an AP, and its common difference.', 'Yes: the difference between neighbouring terms is multiplied by 3 too.', 'So it is an AP with common difference $3d$.'),
  predict(G(2, 2), 'Every term of a GP with common ratio $r$ is squared. Predict whether the new sequence is a GP, and its common ratio.', 'Yes: $\\dfrac{(ar^n)^2}{(ar^{n-1})^2} = r^2$ for every pair of neighbouring terms.', 'So it is a GP with common ratio $r^2$.'),
  predict(G(2, 1), 'Predict whether $1 + 2 + 4 + 8 + \\dots$ has a sum to infinity, and explain.', 'It is a GP with $r = 2$, and $|r| > 1$.', 'Its terms grow without end, so its sums grow without limit: it has no sum to infinity.'),

  odd(G(2, 1), ['2, 5, 8, 11', '10, 7, 4, 1', '1, 4, 9, 16', '−3, −1, 1, 3'], '1, 4, 9, 16', 'Its differences, 3, 5 and 7, aren’t equal, so it isn’t an AP; the others are.'),
  odd(G(2, 1), ['3, 6, 12, 24', '81, 27, 9, 3', '2, −4, 8, −16', '1, 3, 5, 7'], '1, 3, 5, 7', 'It is an AP, not a GP; the others are GPs.'),
  odd(G(2, 2), ['$\\sum_{k=1}^{n} k$', '$\\dfrac{n(n+1)}{2}$', '$1 + 2 + \\dots + n$', '$\\dfrac{n(n+1)(2n+1)}{6}$'], '$\\dfrac{n(n+1)(2n+1)}{6}$', 'It is the sum of the first $n$ squares; the others are all the sum of the first $n$ natural numbers.'),

  long(G(6, 2), 'The 3rd term of a GP is 12, and its 6th term is 96.\n(a) Find its common ratio and first term. [2]\n(b) Find the sum of its first 8 terms. [2]\n(c) Which term of it is 768? [2]', '(a) $\\dfrac{ar^5}{ar^2} = r^3 = \\dfrac{96}{12} = 8$, so $r = 2$.', '(a) $a \\times 2^2 = 12$, so $a = 3$.', '(b) $S_8 = \\dfrac{3(2^8 - 1)}{2 - 1}$.', '(b) $= 3 \\times 255 = 765$.', '(c) $3 \\times 2^{n-1} = 768$, so $2^{n-1} = 256 = 2^8$.', '(c) $n = 9$: it is the 9th term.'),
  long(G(6, 3), 'Answer each part.\n(a) Find $1^2 + 2^2 + \\dots + 12^2$ and $1^3 + 2^3 + \\dots + 12^3$. [2]\n(b) Check that the second is the square of $1 + 2 + \\dots + 12$. [1]\n(c) Find the sum of the first $n$ terms of $1^2 + 3^2 + 5^2 + \\dots$ [3]', '(a) $\\dfrac{12 \\times 13 \\times 25}{6} = 650$.', '(a) $\\left(\\dfrac{12 \\times 13}{2}\\right)^2 = 78^2 = 6084$.', '(b) $1 + 2 + \\dots + 12 = 78$, and $78^2 = 6084$.', '(c) The $k$th term is $(2k - 1)^2 = 4k^2 - 4k + 1$.', '(c) The sum is $4\\sum k^2 - 4\\sum k + n = \\dfrac{2n(n+1)(2n+1)}{3} - 2n(n+1) + n$.', '(c) $= \\dfrac{n(4n^2 - 1)}{3} = \\dfrac{n(2n - 1)(2n + 1)}{3}$.'),

  tell(G(2, 1), 'Distinguish between a sequence and a series.', 'A sequence is a list of terms in order, such as 1, 3, 5, 7.', 'A series is the sum of the terms of a sequence, such as 1 + 3 + 5 + 7.'),
  tell(G(2, 1), 'Distinguish between the arithmetic mean and the geometric mean of two positive numbers $a$ and $b$.', 'The AM is $\\dfrac{a + b}{2}$, the middle term of an AP from $a$ to $b$.', 'The GM is $\\sqrt{ab}$, the middle term of a GP from $a$ to $b$; it is never larger than the AM.'),
  tell(G(2, 2), 'Distinguish between the sum of a finite GP and the sum of an infinite GP.', 'A finite GP of $n$ terms always has a sum, $\\dfrac{a(r^n - 1)}{r - 1}$ for $r \\neq 1$.', 'An infinite GP has a sum only when $|r| < 1$, and then it is $\\dfrac{a}{1 - r}$.'),

  match(G(4, 1), [['$\\sum_{k=1}^{n} k$', '$\\dfrac{n(n+1)}{2}$'], ['$\\sum_{k=1}^{n} k^2$', '$\\dfrac{n(n+1)(2n+1)}{6}$'], ['$\\sum_{k=1}^{n} k^3$', '$\\left[\\dfrac{n(n+1)}{2}\\right]^2$'], ['$\\sum_{k=1}^{n} 1$', '$n$']]),
  match(G(4, 1), [['The AM of 4 and 16', '10'], ['The GM of 4 and 16', '8'], ['The AM of 2 and 8', '5'], ['The GM of 2 and 8', '4']]),
  match(G(4, 2), [['$1 + \\dfrac{1}{3} + \\dfrac{1}{9} + \\dots$', '$\\dfrac{3}{2}$'], ['$4 + 2 + 1 + \\dots$', '8'], ['$1 - \\dfrac{1}{2} + \\dfrac{1}{4} - \\dots$', '$\\dfrac{2}{3}$'], ['$9 + 3 + 1 + \\dots$', '$\\dfrac{27}{2}$']]),

  reason(G(2, 1), 'Why is the $n$th term of a GP $ar^{n-1}$, and not $ar^n$?', 'Each term is $r$ times the one before it, starting from $a$.', 'From the 1st term to the $n$th there are $n - 1$ steps, so $a$ is multiplied by $r$ just $n - 1$ times.'),
  reason(G(2, 2), 'Why has $-4$ and 9 no real geometric mean?', 'Their geometric mean would be $\\sqrt{(-4) \\times 9} = \\sqrt{-36}$.', 'A negative number has no real square root.'),
  reason(G(2, 1), 'Why is the sum of the first $n$ odd numbers equal to $n^2$?', 'The odd numbers form an AP with $a = 1$ and $d = 2$.', 'So $S_n = \\dfrac{n}{2}[2 + 2(n - 1)] = \\dfrac{n}{2} \\times 2n = n^2$.'),

  short(G(2, 1), 'Insert two arithmetic means between 4 and 13.', 'The AP 4, ?, ?, 13 has $3d = 9$, so $d = 3$.', 'The means are 7 and 10.'),
  short(G(2, 1), 'Insert two geometric means between 2 and 54.', 'The GP 2, ?, ?, 54 has $r^3 = 27$, so $r = 3$.', 'The means are 6 and 18.'),
  short(G(2, 2), 'Find the sum $2 + 5 + 8 + \\dots$ to 15 terms.', 'It is an AP with $a = 2$ and $d = 3$.', '$S_{15} = \\dfrac{15}{2}(4 + 14 \\times 3) = \\dfrac{15}{2} \\times 46 = 345$.'),

  ar(G(1, 1), '5, 10, 20, 40 is a GP.', 'Each term after the first is twice the term before it.', 1, 'A constant ratio, here 2, is what makes a GP.'),
  ar(G(1, 1), 'The AM of 3 and 12 is less than their GM.', 'For positive numbers, the AM is never less than the GM.', 4, 'The AM is 7.5 and the GM is 6, so the AM is larger.'),
];

export default questions;
