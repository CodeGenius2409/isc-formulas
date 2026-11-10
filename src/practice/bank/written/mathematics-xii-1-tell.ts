// Written by hand: relations, functions and inverse trigonometric functions, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('mathematics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  tell(A(2, 1), 'Distinguish between a relation and a function from $A$ to $B$.', 'A relation is any subset of $A \\times B$; an element of $A$ may go to many elements of $B$, or to none.', 'A function sends every element of $A$ to exactly one element of $B$.'),
  tell(A(2, 2), 'Distinguish between a one-one and an onto function.', 'One-one: different elements of the domain have different images.', 'Onto: every element of the codomain is the image of some element of the domain.'),
  tell(A(2, 2), 'Distinguish between the codomain and the range of a function.', 'The codomain is the set the function is said to map into.', 'The range is the set of values it actually takes, which may be smaller.'),
  tell(A(2, 3), 'Distinguish between a symmetric and an antisymmetric relation, with an example of each.', 'Symmetric: $a R b$ always gives $b R a$, as “is a sibling of” does.', 'Antisymmetric: $a R b$ and $b R a$ together force $a = b$, as “$\\le$” on numbers does.'),
  tell(A(3, 3), 'Distinguish between $f \\circ g$ and $g \\circ f$ for $f(x) = x + 1$ and $g(x) = 2x$.', '$f \\circ g(x) = f(2x) = 2x + 1$.', '$g \\circ f(x) = g(x + 1) = 2x + 2$.', 'They differ, so composition isn’t commutative.'),
  tell(B(2, 1), 'Distinguish between $\\sin^{-1} x$ and $(\\sin x)^{-1}$.', '$\\sin^{-1} x$ is the angle whose sine is $x$, the inverse function.', '$(\\sin x)^{-1}$ is $\\frac{1}{\\sin x} = \\operatorname{cosec} x$, the reciprocal.'),
  tell(B(2, 2), 'Distinguish between the principal value branch of $\\sin^{-1}$ and that of $\\cos^{-1}$.', '$\\sin^{-1}$: $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$, where sine rises from $-1$ to $1$.', '$\\cos^{-1}$: $[0, \\pi]$, where cosine falls from $1$ to $-1$.'),
  tell(B(2, 2), 'Distinguish between $\\sin^{-1}(\\sin x)$ and $\\sin(\\sin^{-1} x)$.', '$\\sin(\\sin^{-1} x) = x$ for every $x$ in $[-1, 1]$.', '$\\sin^{-1}(\\sin x) = x$ only for $x$ in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$; outside it gives an angle in that range.'),
  tell(B(2, 3), 'Distinguish between the graphs of $y = \\sin x$ and $y = \\sin^{-1} x$.', '$y = \\sin x$ is defined for all $x$ and repeats every $2\\pi$.', '$y = \\sin^{-1} x$ is defined only on $[-1, 1]$; it is the reflection, in $y = x$, of the part of $\\sin x$ from $-\\frac{\\pi}{2}$ to $\\frac{\\pi}{2}$.'),
  tell(B(3, 3), 'Distinguish between $\\tan^{-1} x$ and $\\cot^{-1} x$ by their domains, ranges and sum.', 'Both are defined for all real $x$.', '$\\tan^{-1}$ has range $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$, and $\\cot^{-1}$ has range $(0, \\pi)$.', 'Their sum is $\\frac{\\pi}{2}$ for every $x$.'),
];

export default questions;
