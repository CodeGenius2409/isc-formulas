// Written by hand: numericals on sets, functions and trigonometry, for Mathematics XI at 0% generated. The answers are computed
// separately in tests/unit/written-answers.test.ts. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { theory } = bank('mathematics', 'XI');
const n = (place: Place, text: string, points: (string | [string, number])[]) => theory('short', place, text, points, { format: 'numerical' });
const S = (marks: number, d: 1 | 2 | 3): Place => [1, 'a', marks, d];
const F = (marks: number, d: 1 | 2 | 3): Place => [1, 'b', marks, d];
const T = (marks: number, d: 1 | 2 | 3): Place => [1, 'c', marks, d];

const questions: BankDef[] = [
  // ---- 1a Sets
  n(S(1, 1), 'If $n(A) = 10$, $n(B) = 15$ and $n(A \\cap B) = 5$, find $n(A \\cup B)$.', ['$10 + 15 - 5 = 20$.']),
  n(S(1, 1), 'How many subsets does a set of 4 elements have?', ['$2^4 = 16$.']),
  n(S(2, 1), 'How many proper subsets does a set of 3 elements have?', ['There are $2^3 = 8$ subsets.', 'All but the set itself are proper, so $7$.']),
  n(S(2, 1), 'In a universal set of 50 elements, $n(A) = 20$ and $n(B) = 25$, and $A$ and $B$ have no common element. Find $n((A \\cup B)\')$.', ['$n(A \\cup B) = 45$.', 'The complement has $5$ elements.']),
  n(S(2, 2), 'Of 60 students, 35 drink tea, 30 drink coffee and 10 drink both. How many drink neither?', ['Tea or coffee: $35 + 30 - 10 = 55$.', 'Neither: $60 - 55 = 5$.']),
  n(S(3, 2), 'Of 100 students, 50 study Mathematics, 40 Physics and 30 Chemistry. 20 study Mathematics and Physics, 10 Physics and Chemistry, and 15 Mathematics and Chemistry. 5 study all three. How many study none?', ['At least one: $50 + 40 + 30 - 20 - 10 - 15 + 5$.', 'That is 80.', 'None: $100 - 80 = 20$.']),
  n(S(3, 2), 'In a class, 25 play cricket, 20 play hockey and 8 play both. How many play exactly one of them?', ['Only cricket: $25 - 8 = 17$.', 'Only hockey: $20 - 8 = 12$.', 'Exactly one: $17 + 12 = 29$.']),
  n(S(3, 3), 'If $n(A) = 3$ and $n(B) = 6$, find the sum of the least and greatest possible values of $n(A \\cup B)$.', ['The least is 6, when $A$ is inside $B$.', 'The greatest is 9, when they have nothing in common.', 'The sum is $15$.']),
  n(S(5, 2), 'A survey of 200 people asks about three newspapers. 90 read $A$, 80 read $B$ and 60 read $C$. 30 read $A$ and $B$, 20 read $B$ and $C$, and 25 read $A$ and $C$. 10 read all three. (i) How many read at least one? (ii) How many read none? (iii) How many read only $A$? (iv) How many read exactly two?', ['(i) $90 + 80 + 60 - 30 - 20 - 25 + 10 = 165$.', '(ii) $200 - 165 = 35$.', '(iii) $90 - 30 - 25 + 10 = 45$.', '(iv) Each pair without the 10: $20 + 10 + 15$.', 'So exactly two is $45$.']),
  n(S(2, 1), 'If $n(A) = 12$ and $n(A \\cap B) = 4$, find $n(A - B)$.', ['$A - B$ is $A$ without the common elements.', 'So $12 - 4 = 8$.']),
  // ---- 1b Relations and functions
  n(F(1, 1), 'If $f(x) = x^2 + 1$, find $f(3)$.', ['$9 + 1 = 10$.']),
  n(F(1, 2), 'If $n(A) = 2$ and $n(B) = 3$, how many relations are there from $A$ to $B$?', ['$A \\times B$ has 6 pairs, so there are $2^6 = 64$.']),
  n(F(2, 1), 'If $f(x) = 2x + 3$, find $x$ when $f(x) = 11$.', ['$2x + 3 = 11$.', 'So $x = 4$.']),
  n(F(2, 1), 'If $f(x) = x^2 - x$, find $f(2) + f(-1)$.', ['$f(2) = 2$, and $f(-1) = 2$.', 'The sum is $4$.']),
  n(F(2, 2), 'If $A = \\{1, 2, 3\\}$ and $B = \\{x, y\\}$, how many elements does $A \\times B$ have, and how many functions are there from $A$ to $B$?', ['$A \\times B$ has 6 elements.', 'Each of three elements has 2 images, so there are $8$ functions.']),
  n(F(3, 1), 'If $f(x) = x + 1$ and $g(x) = x^2$, find the sum of $(f + g)(2)$ and $(fg)(2)$.', ['$(f + g)(2) = 3 + 4 = 7$.', '$(fg)(2) = 3 \\times 4 = 12$.', 'The sum is $19$.']),
  n(F(3, 2), 'A function is $f(x) = 2x$ for $x < 1$, and $f(x) = x + 3$ for $x \\ge 1$. Find $f(0) + f(1) + f(2)$.', ['$f(0) = 0$.', '$f(1) = 4$, and $f(2) = 5$.', 'The sum is $9$.']),
  n(F(5, 2), 'A taxi charges a fixed ₹20, and ₹8 per km for the first 10 km, and then ₹6 for each km after that. (i) Write the fare as a function of the distance $x$. (ii) Find the fare for 5 km. (iii) Find the fare for 10 km. (iv) Find the fare for 15 km.', ['(i) $f(x) = 20 + 8x$ for $x \\le 10$.', 'For $x > 10$, $f(x) = 100 + 6(x - 10)$.', '(ii) $60$ rupees.', '(iii) $100$ rupees.', '(iv) $130$ rupees.']),
  n(F(2, 1), 'If $f(x) = 3x^2$, find the positive value of $x$ for which $f(x) = 27$.', ['$x^2 = 9$.', 'The positive value is $3$.']),
  n(F(2, 2), 'How many functions are there from a set of 2 elements to a set of 3 elements?', ['Each of the 2 elements has 3 possible images.', 'So there are $3^2 = 9$.']),
  // ---- 1c Trigonometry
  n(T(1, 1), 'Find the value of $\\sin 30° + \\cos 60°$.', ['$\\frac{1}{2} + \\frac{1}{2} = 1$.']),
  n(T(1, 1), 'Write $150°$ in radians.', ['$150 \\times \\frac{\\pi}{180} = \\frac{5\\pi}{6}$.']),
  n(T(2, 1), 'A circle has radius 10 cm. Find the length of the arc that subtends an angle of 0.5 radian at the centre.', ['$l = r\\theta$.', 'This is $5$ cm.']),
  n(T(2, 1), 'If $\\sin x = \\frac{3}{5}$ with $x$ in the first quadrant, find $\\tan x$.', ['$\\cos x = \\frac{4}{5}$.', 'So $\\tan x = \\frac{3}{4}$.']),
  n(T(2, 2), 'Find the value of $\\cos^2 15° - \\sin^2 15°$.', ['This is $\\cos 30°$.', 'It is $\\frac{\\sqrt{3}}{2}$.']),
  n(T(3, 1), 'If $\\sin x = \\frac{4}{5}$ with $x$ in the second quadrant, find $\\cos x$, and hence $\\tan x$.', ['$\\cos^2 x = 1 - \\frac{16}{25} = \\frac{9}{25}$.', 'In the second quadrant, $\\cos x = -\\frac{3}{5}$.', 'So $\\tan x = -\\frac{4}{3}$.']),
  n(T(3, 2), 'If $\\sin x = \\frac{1}{3}$, find $\\cos 2x$.', ['$\\cos 2x = 1 - 2\\sin^2 x$.', 'That is $1 - \\frac{2}{9}$.', 'This is $\\frac{7}{9}$.']),
  n(T(3, 2), 'Find the value of $\\tan 15°$, using $\\tan(45° - 30°)$.', ['$\\frac{1 - \\frac{1}{\\sqrt{3}}}{1 + \\frac{1}{\\sqrt{3}}} = \\frac{\\sqrt{3} - 1}{\\sqrt{3} + 1}$.', 'Rationalising, this is $\\frac{(\\sqrt{3} - 1)^2}{2}$.', 'So it is $2 - \\sqrt{3}$.']),
  n(T(5, 3), 'Find the value of $\\sin 20° \\sin 40° \\sin 80°$.', ['Use $2\\sin A\\sin B = \\cos(A - B) - \\cos(A + B)$ on the first two.', 'This gives $\\frac{1}{2}(\\cos 20° - \\cos 60°)\\sin 80°$.', 'Multiply out: $\\frac{1}{2}\\cos 20°\\sin 80° - \\frac{1}{4}\\sin 80°$.', '$\\cos 20°\\sin 80° = \\frac{1}{2}(\\sin 100° + \\sin 60°)$, and $\\sin 100° = \\sin 80°$.', 'The $\\sin 80°$ terms cancel, which leaves $\\frac{\\sqrt{3}}{8}$.']),
  n(T(5, 2), 'A wheel of radius 35 cm makes 3 turns per second. (i) Find the angle it turns through in one second, in radians. (ii) Find the distance a point on its rim moves in one second, using $\\pi = \\frac{22}{7}$. (iii) Find its speed in m/s. (iv) Find the distance in one minute, in metres.', ['(i) $3 \\times 2\\pi = 6\\pi$ radians.', '(ii) $l = r\\theta = 35 \\times 6 \\times \\frac{22}{7}$.', 'That is $660$ cm.', '(iii) $6.6$ m/s.', '(iv) $396$ m.']),
];

export default questions;
