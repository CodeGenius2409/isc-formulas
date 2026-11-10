// Written by hand: relations, functions and inverse trigonometric functions, figures to draw and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, plot, sketch, table } from '../figures';

const { figure } = kit('mathematics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  figure(A(2, 1), 'The arrow diagram shows a function $f$ from $A$ to $B$. Is $f$ one-one? Is it onto? Give reasons.', ['It is not one-one, as 1 and 2 both go to $p$.', 'It is not onto, as $r$ has no pre-image.'], {
    shown: sketch(300, 160, 'Two ovals. A on the left holds 1, 2 and 3. B on the right holds p, q and r. Arrows go from 1 to p, from 2 to p, and from 3 to q. Nothing points to r.', [
      { t: 'circle', x: 80, y: 80, r: 55 }, { t: 'circle', x: 220, y: 80, r: 55 }, label(80, 18, 'A'), label(220, 18, 'B'),
      label(80, 54, '1'), label(80, 84, '2'), label(80, 114, '3'), label(220, 54, 'p'), label(220, 84, 'q'), label(220, 114, 'r'),
      arrow([90, 50], [210, 50]), arrow([90, 80], [210, 54]), arrow([90, 110], [210, 82]),
    ]),
  }),
  figure(A(2, 2), 'Draw the graphs of $f(x) = 2x + 1$ and its inverse on the same axes. How are they related?', ['$f^{-1}(x) = \\frac{x - 1}{2}$, a line of slope $\\frac{1}{2}$.', 'The two graphs are mirror images in the line $y = x$.'], {
    answer: graph('x', 'y', [{ label: 'f', points: [[-2, -3], [2, 5]] }, { label: 'y = x', points: [[-3, -3], [5, 5]] }, { label: 'f⁻¹', points: [[-3, -2], [5, 2]] }]),
  }),
  figure(A(2, 2), 'The graph is of $y = x^2$ on $\\mathbb{R}$. Use the horizontal line test to decide whether it is one-one, and say how to restrict the domain so that it is.', ['A horizontal line above the origin meets the graph twice, so it isn’t one-one.', 'On $[0, \\infty)$ every horizontal line meets it at most once, so there it is one-one.'], {
    shown: graph('x', 'y', [{ points: plot((x) => x * x, -3, 3, 30) }, { label: 'y = 4', points: [[-3, 4], [3, 4]] }]),
  }),
  figure(A(3, 2), 'The table shows a relation $R$ on $\\{1, 2, 3\\}$: a tick in row $a$ and column $b$ means $(a, b)$ is in $R$. Is $R$ reflexive, symmetric and transitive?', ['Reflexive: yes, as $(1, 1)$, $(2, 2)$ and $(3, 3)$ are all in $R$.', 'Symmetric: yes, as $(1, 2)$ and $(2, 1)$ are both in it, and nothing else is off the diagonal.', 'Transitive: yes, as every chain such as $(1, 2)$ then $(2, 1)$ gives a pair, $(1, 1)$, that is in $R$. So $R$ is an equivalence relation.'], {
    shown: table(['', '1', '2', '3'], [['1', '✓', '✓', ''], ['2', '✓', '✓', ''], ['3', '', '', '✓']]),
  }),
  figure(A(2, 3), 'The graph is of $f(x) = e^x$ from $\\mathbb{R}$ to $\\mathbb{R}$. Is $f$ one-one? Is it onto? What codomain would make it onto?', ['It is one-one: it always rises, so no value comes twice. It is not onto, as it never takes 0 or a negative value.', 'With codomain $(0, \\infty)$ it is onto, and so has an inverse, $\\log x$.'], {
    shown: graph('x', 'y', [{ points: plot((x) => Math.exp(x), -3, 1.6, 30) }]),
  }),
  figure(B(2, 1), 'Draw the graph of $y = \\sin^{-1} x$, and mark its domain and range.', ['The domain is $[-1, 1]$, along the $x$-axis.', 'The range is $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$: the curve rises from $\\left(-1, -\\frac{\\pi}{2}\\right)$ to $\\left(1, \\frac{\\pi}{2}\\right)$.'], {
    answer: graph('x', 'y = sin⁻¹ x', [{ points: plot((x) => Math.asin(x), -1, 1, 40) }], { x: [[-1, '−1'], [1, '1']], y: [[1.571, 'π/2'], [-1.571, '−π/2']] }),
  }),
  figure(B(2, 2), 'Draw the graph of $y = \\cos^{-1} x$, and mark its domain and range.', ['The domain is $[-1, 1]$.', 'The range is $[0, \\pi]$: the curve falls from $(-1, \\pi)$ to $(1, 0)$.'], {
    answer: graph('x', 'y = cos⁻¹ x', [{ points: plot((x) => Math.acos(x), -1, 1, 40) }], { x: [[-1, '−1'], [1, '1']], y: [[3.142, 'π'], [1.571, 'π/2']] }),
  }),
  figure(B(2, 2), 'Draw the graph of $y = \\tan^{-1} x$. What happens to $y$ as $x$ grows large?', ['It rises through the origin, over all of $\\mathbb{R}$.', 'It approaches $\\frac{\\pi}{2}$ as $x \\to \\infty$, and $-\\frac{\\pi}{2}$ as $x \\to -\\infty$, without reaching them.'], {
    answer: graph('x', 'y = tan⁻¹ x', [{ points: plot((x) => Math.atan(x), -6, 6, 50) }, { label: 'y = π/2', points: [[-6, 1.571], [6, 1.571]] }], { y: [[1.571, 'π/2'], [-1.571, '−π/2']] }),
  }),
  figure(B(2, 3), 'The graph is of $y = \\sin x$, with the part from $-\\frac{\\pi}{2}$ to $\\frac{\\pi}{2}$ drawn alone. Why is this part used to define $\\sin^{-1} x$?', ['On this part, $\\sin x$ is one-one, as it rises all the way.', 'It also takes every value from $-1$ to $1$, so its inverse is defined on all of $[-1, 1]$.'], {
    shown: graph('x', 'y', [{ points: plot((x) => Math.sin(x), -1.571, 1.571, 30) }, { label: 'sin x', points: plot((x) => Math.sin(x), -6.3, 6.3, 80) }], { x: [[-1.571, '−π/2'], [1.571, 'π/2']] }),
  }),
  figure(B(3, 3), 'The graph is of $y = \\sin^{-1}(\\sin x)$ for $0 \\le x \\le \\pi$. Use it to find $y$ at $x = \\frac{\\pi}{4}$ and at $x = \\frac{3\\pi}{4}$, and give a formula for each half.', ['For $0 \\le x \\le \\frac{\\pi}{2}$, $y = x$, so at $\\frac{\\pi}{4}$, $y = \\frac{\\pi}{4}$.', 'For $\\frac{\\pi}{2} \\le x \\le \\pi$, $y = \\pi - x$.', 'So at $\\frac{3\\pi}{4}$, $y = \\frac{\\pi}{4}$ too.'], {
    shown: graph('x', 'y', [{ points: [[0, 0], [1.571, 1.571], [3.142, 0]] }], { x: [[1.571, 'π/2'], [3.142, 'π']], y: [[1.571, 'π/2']] }),
  }),
];

export default questions;
