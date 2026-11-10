// Written by hand: relations, functions and inverse trigonometric functions, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('mathematics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  ar(A(1, 1), 'The relation “is parallel to” on the lines of a plane is an equivalence relation.', 'It is reflexive, symmetric and transitive.', 1, 'Those three properties together make an equivalence relation.'),
  ar(A(1, 2), '$f(x) = x^2$ from $\\mathbb{R}$ to $\\mathbb{R}$ is onto.', 'A negative number has no real square root.', 4, 'So no negative number is an image, and $f$ isn’t onto $\\mathbb{R}$.'),
  ar(A(1, 2), 'A function from a set of 3 elements to a set of 2 elements can’t be one-one.', 'If more elements go into fewer places, two must share one.', 1, 'By this pigeonhole idea, some two elements have the same image.'),
  ar(A(1, 3), '$f(x) = 3x + 2$ on $\\mathbb{R}$ has an inverse.', 'It is one-one and onto.', 1, 'A bijection always has an inverse, here $f^{-1}(x) = \\frac{x - 2}{3}$.'),
  ar(A(1, 3), 'The composition of two onto functions is onto.', 'The composition of two functions is always one-one.', 3, 'The assertion holds, but the reason is false: composing two functions that aren’t one-one needn’t give one that is.'),
  ar(B(1, 1), '$\\sin^{-1}(2)$ is not defined.', 'The range of $\\sin x$ is $[-1, 1]$.', 1, 'So the domain of $\\sin^{-1}$ is $[-1, 1]$, and 2 lies outside it.'),
  ar(B(1, 2), '$\\cos^{-1}(-x) = -\\cos^{-1} x$.', 'The principal value range of $\\cos^{-1}$ is $[0, \\pi]$.', 4, 'Its range has no negative values, so the identity is $\\cos^{-1}(-x) = \\pi - \\cos^{-1} x$.'),
  ar(B(1, 2), '$\\tan^{-1} x + \\cot^{-1} x = \\frac{\\pi}{2}$ for every real $x$.', '$\\tan^{-1}$ is an odd function.', 2, 'Both are true, but the sum is $\\frac{\\pi}{2}$ because $\\cot^{-1} x$ is the complement of $\\tan^{-1} x$, not because $\\tan^{-1}$ is odd.'),
  ar(B(1, 3), '$\\sin^{-1}(\\sin \\frac{5\\pi}{6}) = \\frac{5\\pi}{6}$.', '$\\sin^{-1}(\\sin x) = x$ for $x$ in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$.', 4, '$\\frac{5\\pi}{6}$ is outside that range, so the value is $\\frac{\\pi}{6}$.'),
];

export default questions;
