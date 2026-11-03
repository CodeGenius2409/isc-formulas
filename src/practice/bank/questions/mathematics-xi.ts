// Original questions in the style of ISC Mathematics Class XI. Places are [unit, topic, marks, difficulty].
// tests/unit/bank-answers.test.ts recalculates the answers that can be checked numerically.
import { bank, type BankDef } from '../define';

const { mcq, ar, theory, num } = bank('mathematics', 'XI');

const questions: BankDef[] = [
  // One mark
  mcq([1, 'a', 1, 1], 'A set with 4 elements has how many subsets?', ['4', '8', '16', '24'], 2),
  mcq([1, 'a', 1, 1], 'If A = {1, 2, 3} and B = {3, 4}, then A ∩ B is:', ['{3}', '{1, 2, 3, 4}', '{1, 2}', 'the empty set'], 0),
  mcq([1, 'b', 1, 2], 'The domain of $f(x) = \\sqrt{x - 2}$ is:', ['$x > 2$', '$x \\ge 2$', '$x \\le 2$', 'all real x'], 1),
  mcq([1, 'c', 1, 1], 'The value of $\\sin 30^\\circ\\cos 60^\\circ + \\cos 30^\\circ\\sin 60^\\circ$ is:', ['0', '1/2', '1', '$\\sqrt3/2$'], 2),
  mcq([1, 'c', 1, 2], 'The period of $\\sin 2x$ is:', ['$\\pi/2$', '$\\pi$', '$2\\pi$', '$4\\pi$'], 1),
  ar([1, 'c', 1, 2], '$\\sin^2\\theta + \\cos^2\\theta = 1$ for all real θ.', 'For a point on the unit circle, $x^2 + y^2 = 1$, with $x = \\cos\\theta$ and $y = \\sin\\theta$.', 1),
  mcq([2, 'a', 1, 1], 'The value of $i^{10}$ is:', ['1', '−1', '$i$', '$-i$'], 1),
  mcq([2, 'a', 1, 1], 'The modulus of $3 + 4i$ is:', ['3', '4', '5', '7'], 2),
  mcq([2, 'b', 1, 2], 'The roots of $x^2 + x + 1 = 0$ are:', ['real and equal', 'real and different', 'complex', 'rational'], 2),
  mcq([2, 'c', 1, 1], 'The value of $^5C_2$ is:', ['5', '10', '20', '60'], 1),
  mcq([2, 'c', 1, 2], 'In how many ways can the letters of the word MATH be arranged?', ['4', '12', '16', '24'], 3),
  mcq([2, 'd', 1, 2], 'How many terms does the expansion of $(x+y)^7$ have?', ['6', '7', '8', '14'], 2),
  mcq([2, 'e', 1, 1], 'The 10th term of the arithmetic progression 2, 5, 8, … is:', ['27', '29', '30', '32'], 1),
  ar([2, 'e', 1, 2], 'The sum to infinity of 1 + 1/2 + 1/4 + … is 2.', 'For $|r| < 1$, the sum to infinity of a geometric series is $a/(1-r)$.', 1),
  mcq([3, 'a', 1, 1], 'The slope of the line $2x + 3y = 6$ is:', ['2/3', '−2/3', '3/2', '−3/2'], 1),
  mcq([3, 'a', 1, 2], 'Two lines with slopes $m_1$ and $m_2$ are perpendicular if:', ['$m_1 = m_2$', '$m_1 m_2 = 1$', '$m_1 m_2 = -1$', '$m_1 + m_2 = 0$'], 2),
  mcq([3, 'b', 1, 1], 'The radius of $x^2 + y^2 - 4x - 6y + 12 = 0$ is:', ['1', '2', '3', '5'], 0),
  mcq([3, 'c', 1, 2], 'The focus of the parabola $y^2 = 12x$ is:', ['(3, 0)', '(0, 3)', '(12, 0)', '(−3, 0)'], 0),
  mcq([3, 'd', 1, 1], 'A point on the z-axis has coordinates of the form:', ['(x, 0, 0)', '(0, y, 0)', '(0, 0, z)', '(x, y, 0)'], 2),
  mcq([4, 'a', 1, 1], 'The value of $\\lim_{x\\to 0}\\dfrac{\\sin x}{x}$ is:', ['0', '1', '∞', 'not defined'], 1),
  mcq([4, 'a', 1, 1], 'The derivative of $x^5$ with respect to x is:', ['$5x^4$', '$x^4$', '$5x^5$', '$x^6/6$'], 0),
  ar([4, 'a', 1, 2], 'The derivative of a constant is one.', 'A constant does not change, so its rate of change is zero.', 4),
  mcq([5, 'a', 1, 1], 'The mean of 2, 4, 6, 8, 10 is:', ['5', '6', '7', '8'], 1),
  mcq([5, 'b', 1, 1], 'A fair die is thrown. The probability of an even number is:', ['1/6', '1/3', '1/2', '2/3'], 2),
  mcq([5, 'b', 1, 2], 'If P(A) = 0.3, then P(not A) is:', ['0.3', '0.5', '0.7', '1.3'], 2),

  // Two marks
  theory('short', [1, 'a', 2, 1], 'In a class of 40, 25 play cricket, 20 play football and 10 play both. How many play neither?', ['$n(C\\cup F) = 25 + 20 - 10 = 35$.', 'So 40 − 35 = 5 play neither.']),
  theory('proof', [1, 'c', 2, 2], 'Prove that $\\dfrac{\\sin 2\\theta}{1 + \\cos 2\\theta} = \\tan\\theta$.', ['Numerator: $2\\sin\\theta\\cos\\theta$. Denominator: $2\\cos^2\\theta$.', 'Dividing gives $\\sin\\theta/\\cos\\theta = \\tan\\theta$.']),
  num([2, 'a', 2, 1], {
    text: 'Find the modulus of the complex number {A} + {B}i.',
    vars: { A: [1, 8, 1], B: [2, 9, 1] },
    parts: [{ ask: 'Modulus', use: 'm-xi-2-1', find: 'z_m', given: { a: 'A', b: 'B' }, marks: 2 }],
  }),
  num([2, 'b', 2, 1], {
    text: 'Find the discriminant of {A}x² + {B}x + {C} = 0, and so decide the nature of its roots for yourself.',
    vars: { A: [1, 3, 1], B: [4, 8, 2], C: [1, 3, 1] },
    parts: [{ ask: 'Discriminant', use: 'm-xi-2-9', find: 'D', given: { a: 'A', b: 'B', c: 'C' }, marks: 2 }],
  }),
  theory('short', [2, 'c', 2, 1], 'How many 3-letter arrangements, with no repeated letters, can be made from the letters of the word NUMBER?', ['There are 6 different letters, so the count is $^6P_3$.', '$6\\times5\\times4 = 120$.']),
  theory('short', [2, 'd', 2, 2], 'Find the term with no x in the expansion of $\\left(x + \\dfrac1x\\right)^6$.', ['$T_{r+1} = {^6C_r}\\,x^{6-2r}$.', 'For no x, $r = 3$, so the term is $^6C_3 = 20$.']),
  num([2, 'e', 2, 1], {
    text: 'An arithmetic progression has first term {A} and common difference {D}. Find its {N}th term.',
    vars: { A: [2, 10, 2], D: [3, 7, 2], N: [8, 20, 4] },
    parts: [{ ask: 'The term', use: 'm-xi-2-10', find: 'a_n', given: { a: 'A', n: 'N', d: 'D' }, marks: 2 }],
  }),
  num([3, 'a', 2, 1], {
    text: 'Find the distance between the points ({A}, {B}) and ({C}, {D}).',
    vars: { A: [1, 3, 1], B: [1, 4, 1], C: [5, 9, 1], D: [6, 9, 1] },
    parts: [{ ask: 'Distance', use: 'm-xi-3-9', find: 'd', given: { x_1: 'A', y_1: 'B', x_2: 'C', y_2: 'D' }, marks: 2 }],
  }),
  theory('short', [3, 'b', 2, 1], 'Find the centre and radius of the circle $x^2 + y^2 + 6x - 8y = 0$.', ['Complete the squares: $(x+3)^2 + (y-4)^2 = 25$.', 'The centre is (−3, 4), and the radius is 5.']),
  theory('short', [3, 'd', 2, 1], 'Find the distance between the points (1, 2, 3) and (4, 6, 3).', ['Distance $= \\sqrt{3^2 + 4^2 + 0^2}$.', 'This is 5.']),
  theory('short', [4, 'a', 2, 1], 'Evaluate $\\lim_{x\\to 2}\\dfrac{x^2 - 4}{x - 2}$.', ['Factorising, $\\dfrac{(x-2)(x+2)}{x-2} = x + 2$ for $x \\ne 2$.', 'The limit is 4.']),
  theory('short', [4, 'a', 2, 2], 'Differentiate $x^2\\sin x$ with respect to x.', ['Using the product rule, $\\dfrac{d}{dx}(uv) = u\'v + uv\'$.', 'The result is $2x\\sin x + x^2\\cos x$.']),
  num([5, 'a', 2, 1], {
    text: 'The sum of {N} observations is {S}. Find their mean.',
    vars: { N: [5, 20, 5], S: [100, 400, 50] },
    parts: [{ ask: 'Mean', use: 'p-xi-1-142', find: 'a_mean', given: { S_x: 'S', n: 'N' }, marks: 2 }],
  }),
  num([5, 'b', 2, 1], {
    text: 'For events A and B, P(A) = {A}, P(B) = {B} and P(A ∩ B) = {I}. Find P(A ∪ B).',
    vars: { A: [0.3, 0.5, 0.1], B: [0.2, 0.4, 0.1], I: [0.05, 0.15, 0.05] },
    parts: [{ ask: 'P(A ∪ B)', use: 'm-xi-5-6', find: 'P_U', given: { P_A: 'A', P_B: 'B', P_I: 'I' }, marks: 2 }],
  }),

  // Three marks
  theory('proof', [1, 'a', 3, 2], 'For any sets A, B and C, use a Venn diagram argument or element reasoning to prove $A\\cap(B\\cup C) = (A\\cap B)\\cup(A\\cap C)$.', ['Let $x\\in A\\cap(B\\cup C)$. Then $x\\in A$, and $x$ is in B or in C.', 'So $x\\in A\\cap B$ or $x\\in A\\cap C$, which gives one inclusion.', 'The argument reverses step by step, giving the other inclusion, so the sets are equal.']),
  theory('short', [1, 'b', 3, 2], 'Let $f(x) = x^2$ and $g(x) = 2x + 1$. Find $f\\circ g$, $g\\circ f$, and state whether they are equal.', ['$(f\\circ g)(x) = (2x+1)^2$.', '$(g\\circ f)(x) = 2x^2 + 1$.', 'They are not equal, so composition is not commutative.']),
  theory('proof', [1, 'c', 3, 2], 'Prove that $\\cos 3\\theta = 4\\cos^3\\theta - 3\\cos\\theta$.', ['$\\cos 3\\theta = \\cos(2\\theta + \\theta) = \\cos 2\\theta\\cos\\theta - \\sin 2\\theta\\sin\\theta$.', 'Substituting: $(2\\cos^2\\theta - 1)\\cos\\theta - 2\\sin^2\\theta\\cos\\theta$.', 'With $\\sin^2\\theta = 1 - \\cos^2\\theta$, this simplifies to $4\\cos^3\\theta - 3\\cos\\theta$.']),
  theory('short', [1, 'c', 3, 3], 'Find the general solution of $\\sin 2x = \\cos x$.', ['$2\\sin x\\cos x - \\cos x = 0$, so $\\cos x(2\\sin x - 1) = 0$.', '$\\cos x = 0$ gives $x = (2n+1)\\pi/2$.', '$\\sin x = \\tfrac12$ gives $x = n\\pi + (-1)^n\\pi/6$.']),
  theory('short', [2, 'a', 3, 2], 'Express $\\dfrac{1+i}{1-i}$ in the form $a + ib$, and find its modulus and argument.', ['Multiplying by the conjugate: $\\dfrac{(1+i)^2}{2} = i$.', 'So $a = 0$, $b = 1$, and the modulus is 1.', 'The argument is $\\pi/2$.']),
  theory('short', [2, 'b', 3, 2], 'If $\\alpha$ and $\\beta$ are the roots of $x^2 - 5x + 6 = 0$, find $\\alpha^2 + \\beta^2$ without solving the equation.', ['$\\alpha + \\beta = 5$, and $\\alpha\\beta = 6$.', '$\\alpha^2 + \\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta$.', 'This is $25 - 12 = 13$.']),
  theory('short', [2, 'c', 3, 2], 'A committee of 4 is chosen from 6 boys and 4 girls, with exactly 2 girls. How many ways are there?', ['The girls can be chosen in $^4C_2 = 6$ ways.', 'The boys can be chosen in $^6C_2 = 15$ ways.', 'The total is $6\\times15 = 90$.']),
  num([2, 'e', 3, 2], {
    text: 'A geometric progression has first term {A} and common ratio {R}. Find its {N}th term, and the sum of the first {N} terms.',
    vars: { A: [1, 5, 1], R: [2, 4, 1], N: [4, 8, 1] },
    parts: [
      { ask: 'The term', use: 'm-xi-2-12', find: 'a_n', given: { a: 'A', r: 'R', n: 'N' }, marks: 1 },
      { ask: 'The sum', use: 'm-xi-2-13', find: 'S_n', given: { a: 'A', r: 'R', n: 'N' }, marks: 2 },
    ],
  }),
  theory('short', [3, 'a', 3, 2], 'Find the equation of the line through (2, 3) that is perpendicular to $x + 2y = 5$.', ['The slope of the given line is −1/2, so the slope wanted is 2.', '$y - 3 = 2(x - 2)$.', 'This gives $2x - y - 1 = 0$.']),
  num([3, 'a', 3, 2], {
    text: 'Find the distance between the parallel lines {A}x + {B}y + {P} = 0 and {A}x + {B}y + {Q} = 0.',
    vars: { A: [3, 8, 5], B: [4, 15, 11], P: [1, 5, 2], Q: [10, 20, 5] },
    parts: [{ ask: 'Distance between the lines', use: 'm-xi-3-102', find: 'd', given: { c_1: 'P', c_2: 'Q', a: 'A', b: 'B' }, marks: 3 }],
  }),
  theory('short', [3, 'c', 3, 2], 'For the ellipse $\\dfrac{x^2}{25} + \\dfrac{y^2}{9} = 1$, find the eccentricity, the foci, and the length of the latus rectum.', ['$a = 5$, $b = 3$, so $e = \\sqrt{1 - 9/25} = 4/5$.', 'The foci are $(\\pm 4, 0)$.', 'The latus rectum is $2b^2/a = 18/5$.']),
  theory('short', [4, 'a', 3, 2], 'Find, from first principles, the derivative of $x^2$.', ['$f\'(x) = \\lim_{h\\to 0}\\dfrac{(x+h)^2 - x^2}{h}$.', '$= \\lim_{h\\to 0}\\dfrac{2xh + h^2}{h} = \\lim_{h\\to 0}(2x + h)$.', 'This is $2x$.']),
  theory('short', [5, 'a', 3, 2], 'Find the variance of 2, 4, 6, 8.', ['The mean is 5.', 'The squared deviations are 9, 1, 1 and 9, with sum 20.', 'The variance is 20/4 = 5.']),
  theory('short', [5, 'b', 3, 2], 'Two cards are drawn together from a pack of 52. What is the probability that both are kings?', ['Total ways: $^{52}C_2 = 1326$.', 'Ways of drawing two kings: $^4C_2 = 6$.', 'The probability is 6/1326 = 1/221.']),

  // Five marks
  theory('proof', [1, 'c', 5, 3], 'Prove the identity $\\sin A + \\sin B + \\sin C = 4\\cos\\tfrac A2\\cos\\tfrac B2\\cos\\tfrac C2$, given $A + B + C = \\pi$.', ['$\\sin A + \\sin B = 2\\sin\\tfrac{A+B}{2}\\cos\\tfrac{A-B}{2}$.', 'Since $\\tfrac{A+B}{2} = \\tfrac{\\pi}{2} - \\tfrac C2$, this is $2\\cos\\tfrac C2\\cos\\tfrac{A-B}{2}$.', 'Also $\\sin C = 2\\sin\\tfrac C2\\cos\\tfrac C2 = 2\\cos\\tfrac{A+B}{2}\\cos\\tfrac C2$.', 'Adding: $2\\cos\\tfrac C2\\left[\\cos\\tfrac{A-B}{2} + \\cos\\tfrac{A+B}{2}\\right]$.', 'The bracket is $2\\cos\\tfrac A2\\cos\\tfrac B2$, which gives the result.']),
  theory('short', [2, 'a', 5, 3], 'Find the square roots of $5 + 12i$.', ['Let $(x + iy)^2 = 5 + 12i$.', 'Comparing parts: $x^2 - y^2 = 5$ and $2xy = 12$.', 'The modulus gives $x^2 + y^2 = 13$.', 'So $x^2 = 9$ and $y^2 = 4$.', 'Since $xy > 0$, the roots are $\\pm(3 + 2i)$.']),
  theory('proof', [2, 'd', 5, 3], 'Prove by induction that $1 + 2 + 3 + \\dots + n = \\dfrac{n(n+1)}{2}$ for every natural number n.', ['For $n = 1$: both sides equal 1.', 'Assume the statement holds for $n = k$.', 'Then the sum to $k + 1$ terms is $\\dfrac{k(k+1)}{2} + (k+1)$.', 'This factorises to $\\dfrac{(k+1)(k+2)}{2}$, which is the statement for $k + 1$.', 'So by induction it holds for every natural number.']),
  theory('short', [2, 'e', 5, 2], 'The 3rd and 7th terms of an arithmetic progression are 7 and 19. Find the first term, the common difference, the 20th term, and the sum of the first 20 terms.', ['$a + 2d = 7$ and $a + 6d = 19$.', 'So $d = 3$.', 'And $a = 1$.', '$a_{20} = 1 + 19(3) = 58$.', '$S_{20} = \\tfrac{20}{2}(1 + 58) = 590$.']),
  theory('short', [3, 'b', 5, 2], 'Find the equation of the circle through (0, 0), (2, 0) and (0, 4). State its centre and radius.', ['Let it be $x^2 + y^2 + 2gx + 2fy + c = 0$. Through the origin gives $c = 0$.', 'Through (2, 0): $4 + 4g = 0$, so $g = -1$.', 'Through (0, 4): $16 + 8f = 0$, so $f = -2$.', 'The circle is $x^2 + y^2 - 2x - 4y = 0$.', 'The centre is (1, 2), and the radius is $\\sqrt 5$.']),
  theory('short', [4, 'a', 5, 2], 'Evaluate (a) $\\lim_{x\\to 0}\\dfrac{\\sin 3x}{x}$, (b) $\\lim_{x\\to 1}\\dfrac{x^3 - 1}{x - 1}$. Then differentiate (c) $\\dfrac{x}{1+x}$, (d) $\\tan x$ using its quotient form, and (e) $(2x+1)^3$.', ['(a) 3.', '(b) 3.', '(c) $\\dfrac{1}{(1+x)^2}$.', '(d) $\\sec^2 x$.', '(e) $6(2x+1)^2$.']),
  theory('short', [5, 'a', 5, 3], 'For the data 5, 10, 15, 20, 25, find the mean, the variance, the standard deviation and the coefficient of variation.', ['Mean = 75/5 = 15.', 'Squared deviations: 100, 25, 0, 25, 100, with sum 250.', 'Variance = 250/5 = 50.', 'Standard deviation = $\\sqrt{50} = 5\\sqrt 2$, about 7.07.', 'Coefficient of variation = (7.07/15) × 100, about 47.1%.']),
];

export default questions;
