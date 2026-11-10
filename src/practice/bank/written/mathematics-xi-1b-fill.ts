// Written by hand: relations and functions, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, plot, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XI');
const F = at(1, 'b');

const questions: BankDef[] = [
  figure(F(3, 1), 'The arrow diagram shows a relation $R$ from $A = \\{-2, -1, 1, 2\\}$ to $B = \\{1, 4, 9\\}$. Is $R$ a function? Write its domain, codomain and range.', ['Yes: every element of $A$ has exactly one arrow leaving it.', 'Domain $A$, codomain $B = \\{1, 4, 9\\}$.', 'Range $\\{1, 4\\}$, as nothing is sent to 9.'], {
    shown: sketch(300, 190, 'Two ovals. The left one, A, holds −2, −1, 1 and 2. The right one, B, holds 1, 4 and 9. Arrows go from −2 to 4, from −1 to 1, from 1 to 1, and from 2 to 4. Nothing points to 9.', [
      { t: 'path', d: 'M60 20 A40 70 0 1 0 60 160 A40 70 0 1 0 60 20' }, { t: 'path', d: 'M240 20 A40 70 0 1 0 240 160 A40 70 0 1 0 240 20' },
      label(60, 50, '−2'), label(60, 80, '−1'), label(60, 110, '1'), label(60, 140, '2'),
      label(240, 60, '1'), label(240, 95, '4'), label(240, 130, '9'),
      line([[76, 45], [226, 89]], { arrow: 1 }), line([[76, 75], [226, 57]], { arrow: 1 }), line([[76, 105], [226, 59]], { arrow: 1 }), line([[76, 135], [226, 93]], { arrow: 1 }),
      label(60, 182, 'A'), label(240, 182, 'B'),
    ]),
  }),
  figure(F(2, 2), 'Draw the graph of the greatest integer function $f(x) = [x]$ for $-2 \\le x < 3$, and write its range over all real numbers.', ['A staircase of horizontal steps, each one unit long, with a filled dot at its left end and an open one at its right end.', 'The range is the set of integers, $\\mathbb{Z}$.'], {
    // Origin at (150, 100), 40 px to a unit.
    answer: sketch(300, 210, 'Axes crossing at the origin. Five horizontal steps, each one unit long: at height −2 from x = −2 to −1, at −1 from −1 to 0, along the x-axis from 0 to 1, at 1 from 1 to 2, and at 2 from 2 to 3. Each step has a filled dot at its left end and an open circle at its right end.', [
      arrow([20, 100], [290, 100]), arrow([150, 195], [150, 12]), label(290, 116, 'x', 'end'), label(140, 16, 'y', 'end'),
      ...[-2, -1, 0, 1, 2].flatMap((k) => [line([[150 + 40 * k, 100 - 40 * k], [147 + 40 * (k + 1), 100 - 40 * k]]), { t: 'dot' as const, x: 150 + 40 * k, y: 100 - 40 * k }, { t: 'circle' as const, x: 150 + 40 * (k + 1), y: 100 - 40 * k, r: 3 }]),
      label(70, 116, '−2'), label(110, 116, '−1'), label(190, 116, '1'), label(230, 116, '2'), label(270, 116, '3'),
      label(158, 64, '1', 'start'), label(158, 24, '2', 'start'), label(158, 144, '−1', 'start'), label(158, 184, '−2', 'start'),
    ]),
  }),
  figure(F(2, 2), 'The figure shows the graph of a function $f$. Read off its domain and its range.', ['Domain: $-2 \\le x \\le 2$, as the graph runs from $x = -2$ to $x = 2$.', 'Range: $0 \\le y \\le 2$, from its ends to its top.'], {
    shown: graph('x', 'y', [{ points: plot((x) => Math.sqrt(Math.max(0, 4 - x * x)), -2, 2, 40) }], { x: [[-2, '−2'], [2, '2']], y: [[2, '2']] }),
  }),

  predict(F(2, 1), 'Without plotting it, predict how the graph of $f(x) = |x - 2|$ differs from that of $|x|$, and where its lowest point is.', 'It is the same V shape, moved 2 units to the right.', 'Its lowest point, the corner, is at $(2, 0)$.'),
  predict(F(2, 2), 'Predict the range of $f(x) = \\dfrac{x}{|x|}$, $x \\neq 0$, without plotting it.', 'For $x > 0$, $f(x) = 1$, and for $x < 0$, $f(x) = -1$.', 'So the range is $\\{-1, 1\\}$.'),
  predict(F(2, 3), 'Given that $g(x) = x - [x]$, predict the range of $g$, and explain.', 'For any $x$, $[x] \\le x < [x] + 1$.', 'So $0 \\le x - [x] < 1$, and the range is $[0, 1)$.'),

  odd(F(2, 1), ['$f(x) = x^2$', '$f(x) = |x|$', '$f(x) = \\sqrt{x}$', '$f(x) = x^3$'], '$f(x) = \\sqrt{x}$', 'Its domain is $x \\ge 0$; the other three are defined for every real $x$.'),
  odd(F(2, 2), ['$\\log_2 8$', '$[3.7]$', '$|-3|$', '$\\operatorname{sgn}(5)$'], '$\\operatorname{sgn}(5)$', 'It equals 1; the other three all equal 3.'),
  odd(F(2, 2), ['$\\dfrac{x + 1}{x - 2}$', '$x^2 + 1$', '$\\dfrac{1}{x}$', '$\\dfrac{x^2 - 1}{x + 3}$'], '$x^2 + 1$', 'It is a polynomial, defined for every real $x$; each of the others has a denominator that can be zero.'),

  long(F(6, 2), 'Let $f(x) = \\sqrt{x}$ and $g(x) = x - 1$.\n(a) Find $(f + g)(4)$ and $(fg)(9)$. [2]\n(b) Write the domain of $f + g$. [1]\n(c) Write the domain of $\\dfrac{f}{g}$, and find $\\left(\\dfrac{f}{g}\\right)(4)$. [3]', '(a) $(f + g)(4) = 2 + 3 = 5$.', '(a) $(fg)(9) = 3 \\times 8 = 24$.', '(b) The domain of $f$ is $x \\ge 0$ and that of $g$ is every real number, so $f + g$ has domain $[0, \\infty)$.', '(c) $\\dfrac{f}{g}$ also needs $g(x) \\neq 0$, so $x \\neq 1$.', '(c) Domain $[0, \\infty) - \\{1\\}$.', '(c) $\\left(\\dfrac{f}{g}\\right)(4) = \\dfrac{2}{3}$.'),
  long(F(6, 1), 'Let $A = \\{1, 2\\}$ and $B = \\{3, 4, 5\\}$.\n(a) Write $A \\times B$. [2]\n(b) Write $n(A \\times B)$ and $n(B \\times A)$. Is $A \\times B = B \\times A$? [2]\n(c) Write as a set of ordered pairs the relation $R = \\{(a, b) : a \\in A, b \\in B, a + b \\text{ is even}\\}$. [2]', '(a) With first entry 1: $(1, 3), (1, 4), (1, 5)$.', '(a) With first entry 2: $(2, 3), (2, 4), (2, 5)$; $A \\times B$ is the set of all six.', '(b) Both have $2 \\times 3 = 6$ elements.', '(b) But they are not equal: $(1, 3) \\in A \\times B$, while $(1, 3) \\notin B \\times A$.', '(c) The sums $1 + 3$, $1 + 5$ and $2 + 4$ are even.', '(c) $R = \\{(1, 3), (1, 5), (2, 4)\\}$.'),
  long(F(6, 3), 'Answer each part.\n(a) Find the domain and range of $f(x) = \\dfrac{1}{1 - x}$. [3]\n(b) Find the range of $g(x) = x^2 + 3$. [1]\n(c) Find the domain of $h(x) = \\sqrt{x - 1} + \\sqrt{5 - x}$. [2]', '(a) The denominator is zero at $x = 1$, so the domain is $\\mathbb{R} - \\{1\\}$.', '(a) If $y = \\dfrac{1}{1 - x}$, then $x = 1 - \\dfrac{1}{y}$, which exists for every $y \\neq 0$.', '(a) So the range is $\\mathbb{R} - \\{0\\}$.', '(b) $x^2 \\ge 0$, so the range is $[3, \\infty)$.', '(c) It needs $x - 1 \\ge 0$ and $5 - x \\ge 0$.', '(c) So the domain is $[1, 5]$.'),

  tell(F(2, 1), 'Distinguish between a relation and a function from $A$ to $B$.', 'A relation is any subset of $A \\times B$, so an element of $A$ may have no image or several.', 'A function is a relation in which every element of $A$ has exactly one image.'),
  tell(F(2, 1), 'Distinguish between the codomain and the range of a function.', 'The codomain is the whole set $B$ that the function maps into.', 'The range is the set of images actually reached, which is a subset of the codomain.'),
  tell(F(2, 2), 'Distinguish between $A \\times B$ and $B \\times A$.', 'In $A \\times B$ the first entry of each pair comes from $A$; in $B \\times A$ it comes from $B$.', 'They have the same number of elements, but are equal only if $A = B$ or one of them is empty.'),

  match(F(4, 1), [['$[x]$', 'the integers'], ['$\\operatorname{sgn} x$', '$\\{-1, 0, 1\\}$'], ['$|x|$', '$[0, \\infty)$'], ['$2^x$', '$(0, \\infty)$']]),
  match(F(4, 2), [['$\\log x$', '$(0, \\infty)$'], ['$\\dfrac{1}{x - 3}$', '$\\mathbb{R} - \\{3\\}$'], ['$\\sqrt{4 - x}$', '$(-\\infty, 4]$'], ['$x^3$', '$\\mathbb{R}$']]),
  match(F(4, 1), [['A V with its corner at the origin', 'the modulus function'], ['A staircase of horizontal steps', 'the greatest integer function'], ['A horizontal line', 'a constant function'], ['A straight line through the origin at 45°', 'the identity function']]),

  reason(F(2, 2), 'If $n(A) = m$ and $n(B) = n$, why are there $2^{mn}$ relations from $A$ to $B$?', 'A relation from $A$ to $B$ is a subset of $A \\times B$, which has $mn$ elements.', 'A set of $mn$ elements has $2^{mn}$ subsets.'),
  reason(F(2, 1), 'Why does the identity function on $\\mathbb{R}$ have the same domain and range?', 'It sends every $x$ to $x$ itself.', 'So every real number is reached, and the range is $\\mathbb{R}$, the domain.'),
  reason(F(2, 1), 'Why is $A \\times \\phi = \\phi$ for any set $A$?', 'Each element of $A \\times \\phi$ would need a second entry from $\\phi$.', '$\\phi$ has no elements, so no ordered pair can be formed.'),

  short(F(2, 1), 'If $(x + 1, y - 2) = (3, 1)$, find $x$ and $y$.', 'Ordered pairs are equal when their entries are equal, so $x + 1 = 3$ and $y - 2 = 1$.', '$x = 2$, $y = 3$.'),
  short(F(2, 1), 'Find the range of $f(x) = 2 - 3x$ on the domain $\\{-1, 0, 2\\}$.', '$f(-1) = 5$, $f(0) = 2$, $f(2) = -4$.', 'Range $\\{-4, 2, 5\\}$.'),

  ar(F(1, 1), 'If $n(A) = 3$ and $n(B) = 2$, then $n(A \\times B) = 6$.', '$n(A \\times B) = n(A) \\times n(B)$.', 1, 'Each of the 3 elements of $A$ pairs with each of the 2 elements of $B$.'),
  ar(F(1, 2), 'The domain of $f(x) = \\dfrac{1}{x - 1}$ is all real numbers.', 'A fraction is undefined when its denominator is zero.', 4, 'The domain is $\\mathbb{R} - \\{1\\}$, because the denominator is zero at $x = 1$.'),
  ar(F(1, 2), 'The signum function takes only three values.', '$\\operatorname{sgn} x = \\dfrac{x}{|x|}$ for every real $x$.', 3, 'The formula fails at $x = 0$, where $\\operatorname{sgn} 0 = 0$ is defined separately.'),

  derive(F(3, 2), 'Prove that $A \\times (B \\cup C) = (A \\times B) \\cup (A \\times C)$.', ['$(x, y) \\in A \\times (B \\cup C) \\iff x \\in A$ and ($y \\in B$ or $y \\in C$).', 1], ['$\\iff (x \\in A$ and $y \\in B)$ or $(x \\in A$ and $y \\in C)$.', 1], ['$\\iff (x, y) \\in (A \\times B) \\cup (A \\times C)$, so the sets are equal.', 1]),
  derive(F(3, 2), 'Prove that $A \\times (B \\cap C) = (A \\times B) \\cap (A \\times C)$.', ['$(x, y) \\in A \\times (B \\cap C) \\iff x \\in A$, $y \\in B$ and $y \\in C$.', 1], ['$\\iff (x, y) \\in A \\times B$ and $(x, y) \\in A \\times C$.', 1], ['$\\iff (x, y) \\in (A \\times B) \\cap (A \\times C)$, so the sets are equal.', 1]),
  derive(F(3, 2), 'Prove that if $A \\subseteq B$, then $A \\times C \\subseteq B \\times C$.', ['Take any $(x, y) \\in A \\times C$, so $x \\in A$ and $y \\in C$.', 1], ['As $A \\subseteq B$, $x \\in B$.', 1], ['So $(x, y) \\in B \\times C$, and every element of $A \\times C$ is in $B \\times C$.', 1]),
];

export default questions;
