// Written by hand: trigonometry, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('mathematics', 'XI');
const T = at(1, 'c');

const questions: BankDef[] = [
  tell(T(2, 1), 'Distinguish between a degree and a radian.', 'A degree is $\\frac{1}{360}$ of a full turn.', 'A radian is the angle at the centre of a circle made by an arc as long as the radius; $\\pi$ radians are $180°$.'),
  tell(T(2, 2), 'Distinguish between a positive and a negative angle.', 'A positive angle is turned anticlockwise from the initial line.', 'A negative angle is turned clockwise.'),
  tell(T(2, 2), 'Distinguish between the domains of $\\sin x$ and $\\tan x$.', '$\\sin x$ is defined for every real $x$.', '$\\tan x$ is not defined at odd multiples of $\\frac{\\pi}{2}$, where $\\cos x = 0$.'),
  tell(T(2, 3), 'Distinguish between $\\sin(x + y)$ and $\\sin x + \\sin y$, with an example.', '$\\sin(x + y) = \\sin x\\cos y + \\cos x\\sin y$, which is generally different.', 'For $x = y = 30°$: $\\sin 60° = \\frac{\\sqrt{3}}{2}$, while $\\sin 30° + \\sin 30° = 1$.'),
  tell(T(3, 3), 'Distinguish between $\\cos 2x$ written in its three forms, and say when each is useful.', '$\\cos 2x = \\cos^2 x - \\sin^2 x$, when both are known.', '$= 2\\cos^2 x - 1$, to remove $\\sin x$.', '$= 1 - 2\\sin^2 x$, to remove $\\cos x$, as in finding $\\sin^2 x$ for integration.'),
];

export default questions;
