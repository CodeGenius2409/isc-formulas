// Written by hand: trigonometry, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('mathematics', 'XI');
const T = at(1, 'c');

const questions: BankDef[] = [
  predict(T(2, 1), 'An angle $x$ is in the second quadrant. Predict the signs of $\\sin x$, $\\cos x$ and $\\tan x$.', '$\\sin x$ is positive.', '$\\cos x$ and $\\tan x$ are negative.'),
  predict(T(2, 2), 'Predict the greatest and least values of $3\\sin x + 4\\cos x$.', 'Write it as $5\\sin(x + \\alpha)$, as $\\sqrt{3^2 + 4^2} = 5$.', 'So it ranges from $-5$ to $5$.'),
  predict(T(2, 2), 'Predict the period of $\\sin 3x$ and of $\\tan 2x$.', '$\\sin 3x$: $\\frac{2\\pi}{3}$.', '$\\tan 2x$: $\\frac{\\pi}{2}$.'),
  predict(T(3, 3), 'If $\\tan x = 1$ and $x$ is in the third quadrant, predict $\\sin 2x$, $\\cos 2x$ and the quadrant of $2x$.', '$x = \\frac{5\\pi}{4}$, so $2x = \\frac{5\\pi}{2}$, which is $\\frac{\\pi}{2}$ after a full turn.', '$\\sin 2x = 1$.', '$\\cos 2x = 0$, so $2x$ lies on the boundary, along the positive $y$-axis.'),
  predict(T(2, 3), 'Predict how many solutions $\\sin x = \\frac{1}{2}$ has for $0 \\le x \\le 2\\pi$, and find them.', 'Two.', '$x = \\frac{\\pi}{6}$ and $x = \\frac{5\\pi}{6}$.'),
];

export default questions;
