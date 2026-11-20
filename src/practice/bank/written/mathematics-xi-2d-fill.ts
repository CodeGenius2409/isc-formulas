// Written by hand: the binomial theorem, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { graph, label, line, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XI');
const B = at(2, 'd');

const choose = (n: number, r: number): number => (r === 0 ? 1 : (choose(n, r - 1) * (n - r + 1)) / r);

// Rows 0 to 6 of Pascal's triangle, centred at x = 160, 34 px apart across and 26 px down.
const pascal: SketchMark[] = Array.from({ length: 7 }, (_, n) => [
  label(14, 24 + 26 * n, `n = ${n}`, 'start'),
  ...Array.from({ length: n + 1 }, (_, r) => label(180 + 34 * (r - n / 2), 24 + 26 * n, `${choose(n, r)}`)),
]).flat();

const questions: BankDef[] = [
  figure(B(3, 1), 'Draw Pascal’s triangle down to the row for n = 6, and use it to write out $(1 + x)^6$.', ['Each row starts and ends with 1, and every other number is the sum of the two just above it.', 'The row for n = 6 is 1, 6, 15, 20, 15, 6, 1.', 'So $(1 + x)^6 = 1 + 6x + 15x^2 + 20x^3 + 15x^4 + 6x^5 + x^6$.'], {
    answer: sketch(340, 200, 'Pascal’s triangle with seven rows, for n = 0 to 6: 1; 1 1; 1 2 1; 1 3 3 1; 1 4 6 4 1; 1 5 10 10 5 1; 1 6 15 20 15 6 1.', pascal),
  }),
  figure(B(3, 2), 'The graph shows the binomial coefficients $^{10}C_r$ plotted against $r$. Explain its symmetry, find which term of $(1 + x)^{10}$ has the largest coefficient, and find the sum of all the coefficients.', ['It is symmetric about $r = 5$, because $^{10}C_r = {}^{10}C_{10-r}$.', 'The largest is at $r = 5$, the middle term: the 6th term, $^{10}C_5 x^5 = 252x^5$.', 'The sum of the coefficients is $(1 + 1)^{10} = 2^{10} = 1024$.'], {
    shown: graph('r', 'coefficient', [{ points: Array.from({ length: 11 }, (_, r) => [r, choose(10, r)] as [number, number]) }], { x: [[0, '0'], [5, '5'], [10, '10']], y: [[100, '100'], [200, '200'], [252, '252']] }),
  }),
  figure(B(2, 1), 'Draw a square of side $a + b$, divided to show that $(a + b)^2 = a^2 + 2ab + b^2$.', ['Split each side into lengths $a$ and $b$, cutting the square into a square $a^2$, a square $b^2$ and two rectangles, each $ab$.', 'The pieces fill the whole square, so $(a + b)^2 = a^2 + 2ab + b^2$.'], {
    answer: sketch(240, 210, 'A square split by one vertical and one horizontal line. Along the top, the side is marked a then b; down the left, a then b. The top-left piece is a squared, the bottom-right piece b squared, and the other two pieces are each ab.', [
      { t: 'box', x: 40, y: 30, w: 160, h: 160 }, line([[140, 30], [140, 190]]), line([[40, 130], [200, 130]]),
      label(90, 22, 'a'), label(170, 22, 'b'), label(30, 84, 'a', 'end'), label(30, 164, 'b', 'end'),
      label(90, 84, 'a²'), label(170, 84, 'ab'), label(90, 164, 'ab'), label(170, 164, 'b²'),
    ]),
  }),

  predict(B(2, 2), 'Predict whether the expansion of $\\left(x^2 + \\dfrac{1}{x}\\right)^7$ has a term independent of $x$.', 'The general term is $^7C_r (x^2)^{7-r} x^{-r} = {}^7C_r x^{14-3r}$.', 'A constant term needs $14 - 3r = 0$, but $r = \\dfrac{14}{3}$ isn’t a whole number, so there is none.'),
  predict(B(2, 1), 'Predict how the signs of the terms run in the expansion of $(a - b)^n$.', 'The terms are $^nC_r a^{n-r}(-b)^r$, so the sign is that of $(-1)^r$: they alternate, starting with +.', 'The last term, $(-b)^n$, is positive when $n$ is even and negative when $n$ is odd.'),
  predict(B(2, 2), 'Predict, using the binomial theorem, the remainder when $8^{n}$ is divided by 7, for any natural number $n$.', '$8^n = (7 + 1)^n = 7^n + {}^nC_1 7^{n-1} + \\dots + {}^nC_{n-1} 7 + 1$.', 'Every term but the last is a multiple of 7, so the remainder is 1.'),

  odd(B(2, 1), ['$^{10}C_3$', '$^{10}C_7$', '120', '$^{10}C_4$'], '$^{10}C_4$', 'It is 210; the others are all 120.'),
  odd(B(2, 1), ['$(a + b)^4$', '$(a - b)^4$', '$(1 + x)^4$', '$(1 + x)^5$'], '$(1 + x)^5$', 'Its expansion has 6 terms; the others have 5.'),
  odd(B(2, 2), ['$(x + y)^6$', '$(x + y)^8$', '$(x + y)^{10}$', '$(x + y)^7$'], '$(x + y)^7$', 'It has an even number of terms, 8, so two middle terms; the others have one.'),

  long(B(6, 2), 'Answer each part.\n(a) Expand $(2x - 3)^4$ fully. [3]\n(b) Check your answer by putting $x = 1$. [1]\n(c) Hence write down $(2x + 3)^4 - (2x - 3)^4$. [2]', '(a) The terms are $^4C_r (2x)^{4-r}(-3)^r$ for $r = 0$ to 4.', '(a) $16x^4 - 4 \\times 8 \\times 3x^3 + 6 \\times 4 \\times 9x^2 - 4 \\times 2 \\times 27x + 81$.', '(a) $= 16x^4 - 96x^3 + 216x^2 - 216x + 81$.', '(b) $16 - 96 + 216 - 216 + 81 = 1$, and $(2 - 3)^4 = 1$.', '(c) $(2x + 3)^4$ has the same terms, all positive, so the even-power terms cancel.', '(c) $= 2(96x^3 + 216x) = 192x^3 + 432x$.'),
  long(B(6, 3), 'For the expansion of $\\left(x^2 - \\dfrac{1}{x}\\right)^9$:\n(a) Write its general term in its simplest form. [2]\n(b) Find the coefficient of $x^6$. [2]\n(c) Find the term independent of $x$. [2]', '(a) $T_{r+1} = {}^9C_r (x^2)^{9-r}\\left(-\\dfrac{1}{x}\\right)^r$.', '(a) $= (-1)^r\\, {}^9C_r\\, x^{18-3r}$.', '(b) $18 - 3r = 6$ gives $r = 4$.', '(b) The coefficient is $(-1)^4\\, {}^9C_4 = 126$.', '(c) $18 - 3r = 0$ gives $r = 6$.', '(c) The term is $(-1)^6\\, {}^9C_6 = 84$.'),
  long(B(6, 2), 'Answer each part on middle terms.\n(a) How many middle terms does the expansion of $(a + b)^n$ have when $n$ is even, and when it is odd? Say which they are. [2]\n(b) Find the middle term of $(x + 2)^8$. [2]\n(c) Find the middle terms of $(x - 1)^7$. [2]', '(a) When $n$ is even there are $n + 1$ terms, an odd number, so one middle term, the $\\left(\\dfrac{n}{2} + 1\\right)$th.', '(a) When $n$ is odd there are two, the $\\left(\\dfrac{n+1}{2}\\right)$th and $\\left(\\dfrac{n+3}{2}\\right)$th.', '(b) It is the 5th term: $T_5 = {}^8C_4 x^4 2^4$.', '(b) $= 70 \\times 16x^4 = 1120x^4$.', '(c) They are the 4th and 5th: $T_4 = {}^7C_3 x^4(-1)^3 = -35x^4$.', '(c) $T_5 = {}^7C_4 x^3(-1)^4 = 35x^3$.'),

  tell(B(2, 1), 'Distinguish between the general term and the middle term of a binomial expansion.', 'The general term, $T_{r+1} = {}^nC_r a^{n-r} b^r$, gives any term of $(a + b)^n$ by choosing $r$.', 'A middle term is the one in the centre of the expansion: one term when $n$ is even, two when $n$ is odd.'),
  tell(B(2, 2), 'Distinguish between a binomial coefficient and the coefficient of a term, using the $x^3$ term of $(2x + 1)^4$.', 'The binomial coefficient of that term is $^4C_1 = 4$, from Pascal’s triangle alone.', 'The coefficient of $x^3$ also includes the powers of the numbers in the bracket: $4 \\times 2^3 = 32$.'),
  tell(B(2, 1), 'Distinguish between the expansions of $(a + b)^n$ and $(a - b)^n$.', 'In $(a + b)^n$ every term is positive.', 'In $(a - b)^n$ the terms are the same in size but alternate in sign, since each has the factor $(-1)^r$.'),

  match(B(4, 1), [['The number of terms of $(a + b)^n$', '$n + 1$'], ['The sum of the coefficients of $(1 + x)^n$', '$2^n$'], ['The general term of $(a + b)^n$', '$^nC_r a^{n-r} b^r$'], ['The middle term of $(a + b)^n$, when $n$ is even', 'the $\\left(\\dfrac{n}{2} + 1\\right)$th']]),
  match(B(4, 1), [['The coefficients of $(a + b)^3$', '1, 3, 3, 1'], ['The coefficients of $(a + b)^4$', '1, 4, 6, 4, 1'], ['The coefficients of $(a + b)^5$', '1, 5, 10, 10, 5, 1'], ['The coefficients of $(a + b)^6$', '1, 6, 15, 20, 15, 6, 1']]),
  match(B(4, 1), [['$^6C_2$', '15'], ['$^7C_3$', '35'], ['$^8C_4$', '70'], ['$^5C_5$', '1']]),

  reason(B(2, 2), 'Give a reason: in the expansion of $(a + b)^n$, terms the same distance from the two ends have equal coefficients.', 'The $(r + 1)$th term from the start has coefficient $^nC_r$, and the $(r + 1)$th from the end has $^nC_{n-r}$.', 'These are equal, as choosing $r$ things from $n$ is the same as choosing the $n - r$ to leave out.'),
  reason(B(2, 2), 'Give a reason: $11^n - 1$ is divisible by 10 for every natural number $n$.', '$11^n = (1 + 10)^n = 1 + {}^nC_1 10 + {}^nC_2 10^2 + \\dots + 10^n$.', 'So $11^n - 1$ is a sum of terms each with a factor 10.'),
  reason(B(2, 1), 'Give a reason: $(0.99)^5$ can be found to four decimal places from just the first few terms of its binomial expansion.', '$(0.99)^5 = (1 - 0.01)^5 = 1 - 5(0.01) + 10(0.01)^2 - 10(0.01)^3 + \\dots$', 'Each later term has a higher power of 0.01, so it is too small to change the fourth decimal place.'),

  short(B(2, 1), 'Find the 4th term in the expansion of $(2x + y)^6$.', '$T_4 = {}^6C_3 (2x)^3 y^3$.', '$= 20 \\times 8x^3y^3 = 160x^3y^3$.'),
  short(B(2, 1), 'Use the binomial theorem to find $99^3$.', '$99^3 = (100 - 1)^3 = 100^3 - 3(100)^2 + 3(100) - 1$.', '$= 1000000 - 30000 + 300 - 1 = 970299$.'),

  ar(B(1, 2), 'The middle term of $\\left(x + \\dfrac{1}{x}\\right)^{10}$ is independent of $x$.', 'In that term the powers of $x$ and $\\dfrac{1}{x}$ are equal.', 1, 'The middle term is $^{10}C_5 x^5 x^{-5} = 252$, as the two powers are both 5.'),
  ar(B(1, 2), '$(1.1)^{10}$ is greater than 2.', 'The first two terms of $(1 + 0.1)^{10}$ already add up to 2, and every other term is positive.', 1, '$1 + 10(0.1) = 2$, and the remaining terms add more.'),
  ar(B(1, 2), 'The term independent of $x$ in $\\left(x - \\dfrac{1}{x}\\right)^4$ is $-6$.', 'That term is $^4C_2 x^2\\left(-\\dfrac{1}{x}\\right)^2$, and the square makes it positive.', 4, 'The term is $+6$, not $-6$.'),

  derive(B(3, 2), 'Show that $^nC_0 + {}^nC_1 + \\dots + {}^nC_n = 2^n$, and that the sum of the coefficients in even places equals the sum of those in odd places, each being $2^{n-1}$.', ['Put $x = 1$ in $(1 + x)^n = {}^nC_0 + {}^nC_1 x + \\dots + {}^nC_n x^n$: $2^n = {}^nC_0 + {}^nC_1 + \\dots + {}^nC_n$.', 1], ['Put $x = -1$: $0 = {}^nC_0 - {}^nC_1 + {}^nC_2 - \\dots$, so $^nC_0 + {}^nC_2 + \\dots = {}^nC_1 + {}^nC_3 + \\dots$', 1], ['The two equal sums together make $2^n$, so each is $2^{n-1}$.', 1]),
];

export default questions;
