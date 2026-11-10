// Written by hand: relations, functions and inverse trigonometric functions, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('mathematics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  odd(A(2, 1), ['“is equal to” on numbers', '“is parallel to” on lines', '“is congruent to” on triangles', '“is less than” on numbers'], '“is less than” on numbers', 'It is not an equivalence relation, as it isn’t reflexive or symmetric; the others are.'),
  odd(A(2, 2), ['$f(x) = 2x + 3$', '$f(x) = x^3$', '$f(x) = e^x$', '$f(x) = x^2$'], '$f(x) = x^2$', 'It is not one-one on $\\mathbb{R}$; the others are.'),
  odd(A(2, 2), ['$f(x) = x$', '$f(x) = 5 - x$', '$f(x) = \\frac{1}{x}$, $x \\ne 0$', '$f(x) = 2x$'], '$f(x) = 2x$', 'It is not its own inverse; the others are.'),
  odd(A(2, 3), ['reflexive', 'symmetric', 'transitive', 'one-one'], 'one-one', 'It is a property of functions; the others are properties of relations.'),
  odd(A(2, 3), ['$x^3$ on $\\mathbb{R}$', '$2x + 1$ on $\\mathbb{R}$', '$x^3 - x$ on $\\mathbb{R}$', '$\\frac{x}{2}$ on $\\mathbb{R}$'], '$x^3 - x$ on $\\mathbb{R}$', 'It isn’t one-one, so it has no inverse; the others are bijections.'),
  odd(B(2, 1), ['$\\sin^{-1}\\frac{1}{2}$', '$\\cos^{-1}\\frac{\\sqrt{3}}{2}$', '$\\tan^{-1}\\frac{1}{\\sqrt{3}}$', '$\\cos^{-1}\\frac{1}{2}$'], '$\\cos^{-1}\\frac{1}{2}$', 'It is $\\frac{\\pi}{3}$; the others are all $\\frac{\\pi}{6}$.'),
  odd(B(2, 2), ['$\\sin^{-1} x$', '$\\tan^{-1} x$', '$\\operatorname{cosec}^{-1} x$', '$\\cos^{-1} x$'], '$\\cos^{-1} x$', 'It isn’t an odd function, as $\\cos^{-1}(-x) = \\pi - \\cos^{-1} x$; the others are odd.'),
  odd(B(2, 2), ['$[-1, 1]$', '$\\mathbb{R}$', '$\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$', '$[0, \\pi]$'], '$\\mathbb{R}$', 'It is the domain of $\\tan^{-1}$; the others are domains or ranges of $\\sin^{-1}$ and $\\cos^{-1}$.'),
  odd(B(2, 3), ['$\\sin^{-1} 1$', '$\\cos^{-1} 0$', '$\\tan^{-1} 1$', '$2\\tan^{-1} 1$'], '$\\tan^{-1} 1$', 'It is $\\frac{\\pi}{4}$; the others are all $\\frac{\\pi}{2}$.'),
  odd(B(2, 3), ['$\\sin^{-1} x + \\cos^{-1} x$', '$\\tan^{-1} x + \\cot^{-1} x$', '$\\sec^{-1} x + \\operatorname{cosec}^{-1} x$', '$\\sin^{-1} x - \\cos^{-1} x$'], '$\\sin^{-1} x - \\cos^{-1} x$', 'It isn’t constant; the others all equal $\\frac{\\pi}{2}$.'),
];

export default questions;
