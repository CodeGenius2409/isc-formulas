// Written by hand: trigonometry, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('mathematics', 'XI');
const T = at(1, 'c');

const questions: BankDef[] = [
  match(T(3, 1), [['$\\frac{\\pi}{6}$', '$30°$'], ['$\\frac{3\\pi}{4}$', '$135°$'], ['$\\frac{5\\pi}{3}$', '$300°$']]),
  match(T(4, 2), [['First quadrant', 'All are positive'], ['Second quadrant', 'Only $\\sin$ and $\\operatorname{cosec}$ are positive'], ['Third quadrant', 'Only $\\tan$ and $\\cot$ are positive'], ['Fourth quadrant', 'Only $\\cos$ and $\\sec$ are positive']]),
  match(T(3, 2), [['$\\sin 2x$', '$2\\sin x\\cos x$'], ['$\\cos 2x$', '$1 - 2\\sin^2 x$'], ['$\\tan 2x$', '$\\frac{2\\tan x}{1 - \\tan^2 x}$']]),
  match(T(4, 3), [['$\\sin 3x$', '$3\\sin x - 4\\sin^3 x$'], ['$\\cos 3x$', '$4\\cos^3 x - 3\\cos x$'], ['$\\tan 3x$', '$\\frac{3\\tan x - \\tan^3 x}{1 - 3\\tan^2 x}$'], ['$\\sin(x + y)$', '$\\sin x\\cos y + \\cos x\\sin y$']]),
  match(T(3, 3), [['$\\sin x$', 'Period $2\\pi$, range $[-1, 1]$'], ['$\\tan x$', 'Period $\\pi$, range $\\mathbb{R}$'], ['$\\sec x$', 'Period $2\\pi$, range $\\mathbb{R} - (-1, 1)$']]),
];

export default questions;
