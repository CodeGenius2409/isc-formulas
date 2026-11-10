// Written by hand: relations, functions and inverse trigonometric functions, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('mathematics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  predict(A(2, 1), 'The pair $(3, 3)$ is removed from an equivalence relation on $\\{1, 2, 3\\}$. Predict which property it loses.', 'It is no longer reflexive, as $(3, 3)$ is missing.', 'So it is no longer an equivalence relation.'),
  predict(A(2, 2), 'The codomain of $f(x) = x^2$ is changed from $\\mathbb{R}$ to $[0, \\infty)$, with the domain still $\\mathbb{R}$. Predict whether $f$ becomes one-one, onto, or both.', 'It becomes onto, as every non-negative number is a square.', 'It is still not one-one, as $f(-2) = f(2)$.'),
  predict(A(2, 2), 'Predict whether $f \\circ g$ is one-one when both $f$ and $g$ are one-one, and give the reason.', 'Yes, it is one-one.', 'If $f(g(a)) = f(g(b))$, then $g(a) = g(b)$ as $f$ is one-one, and so $a = b$ as $g$ is one-one.'),
  predict(A(3, 3), 'The function $f(x) = \\frac{x - 1}{x - 2}$ is defined from $\\mathbb{R} - \\{2\\}$ to $\\mathbb{R}$. Predict whether it is onto, and find any value it never takes.', 'Solving $y = \\frac{x - 1}{x - 2}$ gives $x = \\frac{2y - 1}{y - 1}$.', 'This needs $y \\ne 1$, so the value 1 is never taken.', 'So $f$ is not onto $\\mathbb{R}$, but it is onto $\\mathbb{R} - \\{1\\}$.'),
  predict(A(2, 3), 'A relation on a set is both symmetric and transitive. Predict whether it must be reflexive.', 'Not always.', 'An element related to nothing never gets $(a, a)$ from the other two properties; the empty relation on $\\{1\\}$ is an example.'),
  predict(B(2, 1), 'Predict the value of $\\sin^{-1}(\\sin 2\\pi)$ and of $\\cos^{-1}(\\cos 2\\pi)$.', '$\\sin^{-1}(\\sin 2\\pi) = \\sin^{-1} 0 = 0$.', '$\\cos^{-1}(\\cos 2\\pi) = \\cos^{-1} 1 = 0$.'),
  predict(B(2, 2), 'Predict whether $\\tan^{-1} x + \\tan^{-1} \\frac{1}{x}$ is the same for $x = 2$ and $x = -2$.', 'No.', 'For $x > 0$ it is $\\frac{\\pi}{2}$, and for $x < 0$ it is $-\\frac{\\pi}{2}$, as $\\tan^{-1}$ is odd.'),
  predict(B(2, 2), 'As $x$ increases from $-1$ to $1$, predict how $\\sin^{-1} x$ and $\\cos^{-1} x$ change, and what stays the same.', '$\\sin^{-1} x$ rises from $-\\frac{\\pi}{2}$ to $\\frac{\\pi}{2}$, and $\\cos^{-1} x$ falls from $\\pi$ to 0.', 'Their sum stays $\\frac{\\pi}{2}$ throughout.'),
  predict(B(3, 3), 'Predict the value of $\\cos^{-1}(\\cos x)$ for $\\pi < x < 2\\pi$, and check it at $x = \\frac{4\\pi}{3}$.', '$\\cos x = \\cos(2\\pi - x)$, and $2\\pi - x$ lies in $(0, \\pi)$.', 'So $\\cos^{-1}(\\cos x) = 2\\pi - x$.', 'At $x = \\frac{4\\pi}{3}$ it is $\\frac{2\\pi}{3}$, and indeed $\\cos\\frac{4\\pi}{3} = \\cos\\frac{2\\pi}{3} = -\\frac{1}{2}$.'),
  predict(B(2, 3), 'Predict whether $\\sin^{-1} x > \\cos^{-1} x$ for $x = 0.9$, without tables.', 'Yes.', 'They are equal at $x = \\frac{1}{\\sqrt{2}}$, about 0.71, and beyond it $\\sin^{-1}$ keeps rising while $\\cos^{-1}$ keeps falling.'),
];

export default questions;
