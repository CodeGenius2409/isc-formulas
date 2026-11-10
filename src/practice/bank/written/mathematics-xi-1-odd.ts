// Written by hand: trigonometry, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('mathematics', 'XI');
const T = at(1, 'c');

const questions: BankDef[] = [
  odd(T(2, 1), ['$\\sin 30°$', '$\\cos 60°$', '$\\sin 150°$', '$\\cos 120°$'], '$\\cos 120°$', 'It is $-\\frac{1}{2}$; the others are $\\frac{1}{2}$.'),
  odd(T(2, 2), ['$\\sin x$', '$\\cos x$', '$\\sec x$', '$\\tan x$'], '$\\tan x$', 'Its period is $\\pi$; the others have period $2\\pi$.'),
  odd(T(2, 2), ['$2\\sin x\\cos x$', '$\\frac{2\\tan x}{1 + \\tan^2 x}$', '$\\sin 2x$', '$\\cos^2 x - \\sin^2 x$'], '$\\cos^2 x - \\sin^2 x$', 'It equals $\\cos 2x$; the others equal $\\sin 2x$.'),
  odd(T(2, 3), ['$\\sin x$', '$\\tan x$', '$\\operatorname{cosec} x$', '$\\cos x$'], '$\\cos x$', 'It is an even function; the others are odd.'),
  odd(T(2, 3), ['$\\frac{\\pi}{6}$', '$30°$', 'half of $60°$', '$\\frac{\\pi}{4}$'], '$\\frac{\\pi}{4}$', 'It is $45°$; the others are all $30°$.'),
];

export default questions;
