// Written by hand: relations, functions and inverse trigonometric functions, proofs not already in the bank. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { derive } = kit('mathematics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  derive(A(4, 2), 'Prove that the composition of two bijections $f : A \\to B$ and $g : B \\to C$ is a bijection.', ['One-one: if $g(f(x_1)) = g(f(x_2))$, then $f(x_1) = f(x_2)$, as $g$ is one-one.', 1], ['So $x_1 = x_2$, as $f$ is one-one.', 1], ['Onto: for any $z$ in $C$ there is $y$ in $B$ with $g(y) = z$, and $x$ in $A$ with $f(x) = y$.', 1], ['Then $g \\circ f(x) = z$, so $g \\circ f$ is onto, and a bijection.', 1]),
  derive(A(3, 3), 'Prove that an invertible function has only one inverse.', ['Let $g$ and $h$ both be inverses of $f$, so $f \\circ g$ and $h \\circ f$ are identities.', 1], ['Then $g = (h \\circ f) \\circ g = h \\circ (f \\circ g)$.', 1], ['$= h$, so the inverse is unique.', 1]),
  derive(B(3, 1), 'Prove that $\\tan^{-1} x + \\cot^{-1} x = \\frac{\\pi}{2}$ for every real $x$.', ['Let $\\tan^{-1} x = \\theta$, with $\\theta$ in $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$.', 1], ['Then $x = \\tan\\theta = \\cot\\left(\\frac{\\pi}{2} - \\theta\\right)$, and $\\frac{\\pi}{2} - \\theta$ lies in $(0, \\pi)$.', 1], ['So $\\cot^{-1} x = \\frac{\\pi}{2} - \\theta$, which gives the result.', 1]),
  derive(B(3, 2), 'Prove that $\\sin^{-1}(-x) = -\\sin^{-1} x$ for $x$ in $[-1, 1]$.', ['Let $\\sin^{-1} x = \\theta$, so $x = \\sin\\theta$ with $\\theta$ in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$.', 1], ['Then $-x = \\sin(-\\theta)$, and $-\\theta$ is in the same range.', 1], ['So $\\sin^{-1}(-x) = -\\theta = -\\sin^{-1} x$.', 1]),
  derive(B(3, 3), 'Prove that $2\\tan^{-1} x = \\tan^{-1}\\frac{2x}{1 - x^2}$ for $|x| < 1$.', ['Let $\\tan^{-1} x = \\theta$; for $|x| < 1$, $\\theta$ lies in $\\left(-\\frac{\\pi}{4}, \\frac{\\pi}{4}\\right)$.', 1], ['$\\tan 2\\theta = \\frac{2\\tan\\theta}{1 - \\tan^2\\theta} = \\frac{2x}{1 - x^2}$.', 1], ['$2\\theta$ lies in the principal range, so $2\\theta = \\tan^{-1}\\frac{2x}{1 - x^2}$.', 1]),
  derive(B(3, 3), 'Prove that $\\cos^{-1} x = \\sin^{-1}\\sqrt{1 - x^2}$ for $0 \\le x \\le 1$.', ['Let $\\cos^{-1} x = \\theta$, with $\\theta$ in $\\left[0, \\frac{\\pi}{2}\\right]$ as $x \\ge 0$.', 1], ['Then $\\sin\\theta = \\sqrt{1 - x^2}$, taking the positive root as $\\sin\\theta \\ge 0$ there.', 1], ['$\\theta$ lies in the range of $\\sin^{-1}$, so $\\theta = \\sin^{-1}\\sqrt{1 - x^2}$.', 1]),
];

export default questions;
