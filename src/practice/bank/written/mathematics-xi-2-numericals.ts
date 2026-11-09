// Written by hand: numericals on algebra, for Mathematics XI at 0% generated. The answers are computed separately in
// tests/unit/written-answers.test.ts. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { theory } = bank('mathematics', 'XI');
const n = (place: Place, text: string, points: (string | [string, number])[]) => theory('short', place, text, points, { format: 'numerical' });
const Z = (marks: number, d: 1 | 2 | 3): Place => [2, 'a', marks, d];
const Q = (marks: number, d: 1 | 2 | 3): Place => [2, 'b', marks, d];
const P = (marks: number, d: 1 | 2 | 3): Place => [2, 'c', marks, d];
const B = (marks: number, d: 1 | 2 | 3): Place => [2, 'd', marks, d];
const S = (marks: number, d: 1 | 2 | 3): Place => [2, 'e', marks, d];

const questions: BankDef[] = [
  // ---- 2a Complex numbers
  n(Z(1, 1), 'Find the modulus of $3 - 4i$.', ['$\\sqrt{9 + 16} = 5$.']),
  n(Z(1, 1), 'Find the modulus of $(1 + i)^2$.', ['$(1 + i)^2 = 2i$, of modulus $2$.']),
  n(Z(2, 1), 'Find the real part of $(2 + 3i)(1 - i)$.', ['$2 - 2i + 3i - 3i^2 = 5 + i$.', 'The real part is $5$.']),
  n(Z(2, 2), 'Find the real part of $\\frac{3 + 4i}{1 + 2i}$.', ['Multiply by the conjugate: $\\frac{(3 + 4i)(1 - 2i)}{5} = \\frac{11 - 2i}{5}$.', 'The real part is $\\frac{11}{5}$.']),
  n(Z(2, 1), 'If $x + iy = \\frac{1 + i}{1 - i}$, find $y$.', ['$\\frac{(1 + i)^2}{2} = i$.', 'So $y = 1$.']),
  n(Z(3, 1), 'Find the argument of $1 + \\sqrt{3}i$.', ['Its modulus is 2.', '$\\cos\\theta = \\frac{1}{2}$, and $\\sin\\theta = \\frac{\\sqrt{3}}{2}$.', 'So $\\theta = \\frac{\\pi}{3}$.']),
  n(Z(3, 2), 'Find the real part of the square root of $5 + 12i$ whose real part is positive.', ['Let $(x + iy)^2 = 5 + 12i$, so $x^2 - y^2 = 5$ and $xy = 6$.', 'The modulus gives $x^2 + y^2 = 13$, so $x^2 = 9$.', 'The real part is $3$, and the root is $3 + 2i$.']),
  n(Z(3, 3), 'If $|z - 1| = |z + 1|$, find the real part of $z$.', ['Let $z = x + iy$, so $(x - 1)^2 + y^2 = (x + 1)^2 + y^2$.', 'This gives $-2x = 2x$.', 'So the real part is $0$.']),
  n(Z(5, 2), 'Write $z = -1 + \\sqrt{3}i$ in polar form, and find $z^3$.', ['The modulus is $r = 2$.', 'The point is in the second quadrant, so $\\theta = \\frac{2\\pi}{3}$.', 'So $z = 2\\left(\\cos\\frac{2\\pi}{3} + i\\sin\\frac{2\\pi}{3}\\right)$.', 'Then $z^2 = -2 - 2\\sqrt{3}i$, and multiplying by $z$ again gives a real number.', 'So $z^3 = 8$.']),
  n(Z(5, 3), 'Solve $z^2 = -3 + 4i$, and give the real part of the root whose real part is positive.', ['Let $z = x + iy$, so $x^2 - y^2 = -3$ and $2xy = 4$.', 'The modulus gives $x^2 + y^2 = 5$.', 'So $x^2 = 1$ and $y^2 = 4$.', 'As $xy > 0$, the roots are $\\pm(1 + 2i)$, each of modulus $\\sqrt{5}$.', 'The positive real part is $1$.']),
  // ---- 2b Quadratic equations
  n(Q(1, 1), 'Find the sum of the roots of $x^2 - 5x + 6 = 0$.', ['$-\\frac{b}{a} = 5$.']),
  n(Q(1, 1), 'Find the discriminant of $x^2 + x + 1 = 0$.', ['$1 - 4 = -3$.']),
  n(Q(2, 1), 'If $\\alpha$ and $\\beta$ are the roots of $x^2 - 5x + 6 = 0$, find $\\alpha^2 + \\beta^2$.', ['$(\\alpha + \\beta)^2 - 2\\alpha\\beta = 25 - 12$.', 'This is $13$.']),
  n(Q(2, 1), 'Find the positive value of $k$ for which $x^2 + kx + 9 = 0$ has equal roots.', ['$k^2 - 36 = 0$.', 'So $k = 6$.']),
  n(Q(2, 2), 'If $\\alpha$ and $\\beta$ are the roots of $x^2 - 5x + 6 = 0$, find $\\frac{1}{\\alpha} + \\frac{1}{\\beta}$.', ['$\\frac{\\alpha + \\beta}{\\alpha\\beta}$.', 'This is $\\frac{5}{6}$.']),
  n(Q(3, 2), 'Solve $x^2 + 2x + 5 = 0$, and find the square of the modulus of a root.', ['$x = \\frac{-2 \\pm \\sqrt{4 - 20}}{2}$.', 'So $x = -1 \\pm 2i$.', 'The modulus squared is $1 + 4 = 5$.']),
  n(Q(3, 1), 'Two numbers add up to 10, and their product is 21. Find the larger, using a quadratic.', ['They are the roots of $x^2 - 10x + 21 = 0$.', '$(x - 3)(x - 7) = 0$.', 'The larger is $7$.']),
  n(Q(3, 2), 'If 3 is a root of $x^2 - kx + 6 = 0$, find the other root, and $k$.', ['$9 - 3k + 6 = 0$.', 'The product of the roots is 6, so the other root is 2.', 'So $k = 5$.']),
  n(Q(5, 2), 'A train travels 300 km at a steady speed. If it were 10 km/h faster, the journey would take an hour less. Find its speed.', ['$\\frac{300}{v} - \\frac{300}{v + 10} = 1$.', 'This gives $3000 = v(v + 10)$.', 'So $v^2 + 10v - 3000 = 0$.', 'So $(v - 50)(v + 60) = 0$, and a speed can’t be negative.', 'The speed is $50$ km/h.']),
  n(Q(5, 2), 'A rectangle has an area of 96 m² and a perimeter of 40 m. Find its longer side.', ['Let the sides be $x$ and $y$: $x + y = 20$, and $xy = 96$.', 'They are the roots of $t^2 - 20t + 96 = 0$.', 'The discriminant is $400 - 384 = 16$.', '$t = \\frac{20 \\pm 4}{2}$, which is 12 or 8.', 'The longer side is $12$ m.']),
  // ---- 2c Permutations and combinations
  n(P(1, 1), 'Find the value of ${}^{6}C_2$.', ['$\\frac{6 \\times 5}{2} = 15$.']),
  n(P(1, 1), 'In how many ways can 5 different books be arranged on a shelf?', ['$5! = 120$.']),
  n(P(2, 1), 'How many words, with or without meaning, can be made from the letters of MATH?', ['Four different letters.', '$4! = 24$.']),
  n(P(2, 1), 'In how many ways can a committee of 3 be chosen from 7 people?', ['${}^{7}C_3$.', 'This is $35$.']),
  n(P(2, 2), 'How many three-digit numbers with no repeated digit can be made using 1, 2, 3, 4, 5?', ['${}^{5}P_3 = 5 \\times 4 \\times 3$.', 'This is $60$.']),
  n(P(3, 2), 'How many different arrangements are there of the letters of BANANA?', ['6 letters, with A three times and N twice.', '$\\frac{6!}{3!\\,2!}$.', 'This is $60$.']),
  n(P(3, 1), 'From 5 men and 4 women, a committee of 3 men and 2 women is chosen. In how many ways?', ['${}^{5}C_3 = 10$.', '${}^{4}C_2 = 6$.', 'So $60$ ways.']),
  n(P(3, 2), 'In how many ways can 5 people sit in a row, if two of them must sit together?', ['Treat the two as one, so 4 units give $4!$.', 'The two can swap, which doubles it.', 'So $2 \\times 24 = 48$.']),
  n(P(5, 3), 'A committee of 4 is chosen from 6 men and 4 women, with at least 2 women. In how many ways?', ['2 women and 2 men: ${}^{4}C_2 \\times {}^{6}C_2 = 90$.', '3 women and 1 man: ${}^{4}C_3 \\times 6 = 24$.', '4 women: 1 way.', 'These cases don’t overlap, so they add.', 'The total is $115$.']),
  n(P(5, 2), 'In how many ways can the letters of EQUATION be arranged, with all the vowels together?', ['The vowels are E, U, A, I and O, which is five, and the consonants are Q, T and N.', 'Treat the vowels as one unit, with the 3 consonants: 4 units.', 'These can be arranged in $4! = 24$ ways.', 'The vowels can be arranged among themselves in $5! = 120$ ways.', 'The total is $2880$.']),
  // ---- 2d Binomial theorem
  n(B(1, 1), 'Find the coefficient of $x^2$ in $(1 + x)^5$.', ['${}^{5}C_2 = 10$.']),
  n(B(1, 1), 'How many terms are there in the expansion of $(a + b)^8$?', ['$8 + 1 = 9$.']),
  n(B(2, 1), 'Find the coefficient of $x^3$ in $(2x + 1)^4$.', ['${}^{4}C_3 (2x)^3$.', 'The coefficient is $32$.']),
  n(B(2, 1), 'Find the sum of the coefficients in $(1 + x)^6$.', ['Put $x = 1$.', 'This is $2^6 = 64$.']),
  n(B(2, 2), 'Find the term independent of $x$ in $\\left(x + \\frac{1}{x}\\right)^6$.', ['$T_{r + 1} = {}^{6}C_r x^{6 - 2r}$, so $r = 3$.', 'The term is $20$.']),
  n(B(3, 2), 'Find the term independent of $x$ in $\\left(x + \\frac{1}{x^2}\\right)^6$.', ['$T_{r + 1} = {}^{6}C_r x^{6 - 3r}$.', 'So $r = 2$.', 'The term is ${}^{6}C_2 = 15$.']),
  n(B(3, 2), 'Find the coefficient of $x^4$ in $(1 - 2x)^5$.', ['$T_5 = {}^{5}C_4 (-2x)^4$.', 'That is $5 \\times 16 x^4$.', 'The coefficient is $80$.']),
  n(B(3, 1), 'Use the binomial theorem to find $(1.01)^5$, to three decimal places.', ['$(1 + 0.01)^5 = 1 + 5(0.01) + 10(0.01)^2 + \\dots$', '$= 1 + 0.05 + 0.001 + \\dots$', 'To three places, this is $1.051$.']),
  n(B(5, 2), 'Find $n$ if the coefficients of $x^2$ and $x^3$ in $(1 + x)^n$ are equal.', ['The coefficients are ${}^{n}C_2$ and ${}^{n}C_3$.', '$\\frac{n(n - 1)}{2} = \\frac{n(n - 1)(n - 2)}{6}$.', 'Dividing by $n(n - 1)$, which isn’t zero, gives $\\frac{1}{2} = \\frac{n - 2}{6}$.', 'So $n - 2 = 3$.', 'So $n = 5$.']),
  n(B(5, 3), 'Find the value of $(\\sqrt{2} + 1)^4 + (\\sqrt{2} - 1)^4$, using the binomial theorem.', ['The odd terms cancel, and the even ones double.', 'So it’s $2\\left[(\\sqrt{2})^4 + 6(\\sqrt{2})^2 + 1\\right]$.', 'That is $2[4 + 12 + 1]$.', 'So $2 \\times 17$.', 'This is $34$.']),
  // ---- 2e Sequences and series
  n(S(1, 1), 'Find the 10th term of the AP 2, 5, 8, …', ['$2 + 9 \\times 3 = 29$.']),
  n(S(1, 1), 'Find the 6th term of the GP 3, 6, 12, …', ['$3 \\times 2^5 = 96$.']),
  n(S(2, 1), 'Find the sum of the first 20 terms of the AP 1, 3, 5, …', ['$\\frac{20}{2}(2 + 19 \\times 2)$.', 'This is $400$.']),
  n(S(2, 1), 'Find the geometric mean of 4 and 9.', ['$\\sqrt{4 \\times 9}$.', 'This is $6$.']),
  n(S(2, 2), 'Find the sum to infinity of $1 + \\frac{1}{2} + \\frac{1}{4} + \\dots$', ['$\\frac{a}{1 - r}$, with $r = \\frac{1}{2}$.', 'This is $2$.']),
  n(S(3, 2), 'The 3rd term of an AP is 7, and the 7th term is 19. Find the 10th term.', ['$4d = 12$, so $d = 3$.', '$a = 7 - 6 = 1$.', '$a_{10} = 1 + 27 = 28$.']),
  n(S(3, 2), 'The 2nd term of a GP is 6, and the 5th term is 48. Find the 8th term.', ['$r^3 = 8$, so $r = 2$.', '$a = 3$.', '$a_8 = 3 \\times 2^7 = 384$.']),
  n(S(3, 1), 'A student saves ₹100 in the first month, and ₹20 more each month than the last. Find the total saved in 12 months.', ['This is an AP, with $a = 100$ and $d = 20$.', '$S_{12} = 6(200 + 11 \\times 20)$.', 'This is $2520$ rupees.']),
  n(S(5, 3), 'Find the value of $\\sum_{k = 1}^{10} k(k + 1)$.', ['$\\sum k^2 + \\sum k$.', '$\\sum k^2 = \\frac{10 \\times 11 \\times 21}{6} = 385$.', '$\\sum k = 55$.', 'Add the two.', 'This is $440$.']),
  n(S(5, 2), 'Three numbers in AP add up to 15, and their product is 80. Find the largest.', ['Let them be $a - d$, $a$, $a + d$.', 'The sum gives $3a = 15$, so $a = 5$.', 'The product gives $5(25 - d^2) = 80$.', 'So $d^2 = 9$, and $d = \\pm 3$.', 'The numbers are 2, 5, 8, and the largest is $8$.']),
];

export default questions;
