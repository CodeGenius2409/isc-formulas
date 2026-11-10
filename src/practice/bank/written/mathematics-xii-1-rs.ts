// Written by hand: relations, functions and inverse trigonometric functions, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('mathematics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Explain why the relation “is less than” on $\\mathbb{R}$ is not reflexive.', 'No real number is less than itself, so $(a, a)$ is never in the relation.'),
  reason(A(2, 2), 'Explain why $f : \\mathbb{R} \\to \\mathbb{R}$, $f(x) = x^2$ is not one-one.', 'Two different inputs can give the same output.', 'For example, $f(2) = f(-2) = 4$.'),
  reason(A(2, 2), 'Explain why $f : \\mathbb{R} \\to \\mathbb{R}$, $f(x) = x^2$ is not onto.', 'Every output $x^2$ is at least 0.', 'So a negative number in the codomain, such as $-1$, has no pre-image.'),
  reason(A(2, 3), 'Explain why a function must be both one-one and onto to have an inverse.', 'If it isn’t one-one, some output comes from two inputs, so the inverse can’t send it back to one.', 'If it isn’t onto, some element of the codomain has nothing to be sent to.'),
  reason(A(1, 2), 'Explain why the relation $R = \\{(1, 2), (2, 1)\\}$ on $\\{1, 2\\}$ is not transitive.', '$(1, 2)$ and $(2, 1)$ are in $R$, but $(1, 1)$ is not.'),
  short(A(2, 1), 'Show that the relation $R$ on $\\mathbb{Z}$, given by $a R b$ when $a - b$ is even, is symmetric.', 'If $a - b$ is even, then $b - a = -(a - b)$ is even too.', 'So $a R b$ gives $b R a$.'),
  short(A(2, 2), 'If $f(x) = 2x + 3$ and $g(x) = x^2$, find $f \\circ g$ and $g \\circ f$. Are they equal?', '$f \\circ g(x) = 2x^2 + 3$, and $g \\circ f(x) = (2x + 3)^2$.', 'They are not equal, so composition is not commutative.'),
  short(A(2, 2), 'Find the inverse of $f : \\mathbb{R} \\to \\mathbb{R}$, $f(x) = \\frac{3x - 1}{2}$.', 'Put $y = \\frac{3x - 1}{2}$, so $x = \\frac{2y + 1}{3}$.', '$f^{-1}(x) = \\frac{2x + 1}{3}$.'),
  short(A(3, 2), 'Show that the relation $R$ on $\\mathbb{R}$, given by $a R b$ when $|a| = |b|$, is an equivalence relation.', 'Reflexive: $|a| = |a|$.', 'Symmetric: $|a| = |b|$ gives $|b| = |a|$.', 'Transitive: $|a| = |b|$ and $|b| = |c|$ give $|a| = |c|$.'),
  short(A(3, 3), 'Write the equivalence class of 1 for the relation “$a - b$ is divisible by 3” on $\\mathbb{Z}$. How many classes are there?', '$[1] = \\{\\ldots, -5, -2, 1, 4, 7, \\ldots\\}$, the integers leaving remainder 1.', 'There are three classes, for remainders 0, 1 and 2.', 'They don’t overlap, and together they make up $\\mathbb{Z}$.'),
  reason(B(1, 1), 'Explain why $\\sin^{-1} 2$ is not defined.', 'The domain of $\\sin^{-1}$ is $[-1, 1]$, as $\\sin x$ never goes beyond those values.'),
  reason(B(2, 2), 'Explain why the range of $\\sin^{-1}$ is restricted to $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$.', '$\\sin x$ is not one-one on $\\mathbb{R}$, so it has no inverse there.', 'On $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ it is one-one and takes every value in $[-1, 1]$.'),
  reason(B(2, 2), 'Explain why $\\sin^{-1}(\\sin \\frac{2\\pi}{3})$ is not $\\frac{2\\pi}{3}$.', '$\\frac{2\\pi}{3}$ is outside the principal range $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$.', '$\\sin \\frac{2\\pi}{3} = \\sin \\frac{\\pi}{3}$, so the value is $\\frac{\\pi}{3}$.'),
  reason(B(2, 3), 'Explain why $\\cos^{-1}(-x) = \\pi - \\cos^{-1} x$, rather than $-\\cos^{-1} x$.', 'The principal range of $\\cos^{-1}$ is $[0, \\pi]$, so it can’t be negative.', 'If $\\cos \\theta = x$, then $\\cos(\\pi - \\theta) = -x$, and $\\pi - \\theta$ lies in $[0, \\pi]$.'),
  reason(B(1, 2), 'Explain why $\\tan^{-1} x$ is defined for every real $x$.', '$\\tan x$ takes every real value on $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$, so its inverse’s domain is $\\mathbb{R}$.'),
  short(B(2, 1), 'Give the domain and the principal value range of $\\cos^{-1} x$ and of $\\tan^{-1} x$.', '$\\cos^{-1}$: domain $[-1, 1]$, range $[0, \\pi]$.', '$\\tan^{-1}$: domain $\\mathbb{R}$, range $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$.'),
  short(B(2, 2), 'Find the principal value of $\\cos^{-1}\\left(-\\frac{1}{2}\\right) + \\sin^{-1}\\left(-\\frac{1}{2}\\right)$.', '$\\cos^{-1}\\left(-\\frac{1}{2}\\right) = \\frac{2\\pi}{3}$, and $\\sin^{-1}\\left(-\\frac{1}{2}\\right) = -\\frac{\\pi}{6}$.', 'The sum is $\\frac{\\pi}{2}$.'),
  short(B(2, 2), 'Show that $\\sin^{-1} x + \\cos^{-1} x = \\frac{\\pi}{2}$ for $x$ in $[-1, 1]$.', 'Let $\\sin^{-1} x = \\theta$, so $x = \\sin \\theta = \\cos\\left(\\frac{\\pi}{2} - \\theta\\right)$.', '$\\frac{\\pi}{2} - \\theta$ lies in $[0, \\pi]$, so $\\cos^{-1} x = \\frac{\\pi}{2} - \\theta$, which gives the result.'),
  short(B(3, 3), 'Simplify $\\tan^{-1}\\left(\\frac{\\cos x}{1 + \\sin x}\\right)$ for $-\\frac{\\pi}{2} < x < \\frac{\\pi}{2}$.', 'Write $\\cos x = \\cos^2\\frac{x}{2} - \\sin^2\\frac{x}{2}$ and $1 + \\sin x = \\left(\\cos\\frac{x}{2} + \\sin\\frac{x}{2}\\right)^2$.', 'The fraction becomes $\\frac{1 - \\tan\\frac{x}{2}}{1 + \\tan\\frac{x}{2}} = \\tan\\left(\\frac{\\pi}{4} - \\frac{x}{2}\\right)$.', 'The angle lies in the principal range, so the answer is $\\frac{\\pi}{4} - \\frac{x}{2}$.'),
];

export default questions;
