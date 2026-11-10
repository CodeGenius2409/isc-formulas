// Written by hand: relations, functions and inverse trigonometric functions, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('mathematics', 'XII');
const A = at(1, 'a');
const B = at(1, 'b');

const questions: BankDef[] = [
  match(A(3, 1), [['$a R a$ for every $a$', 'Reflexive'], ['$a R b$ gives $b R a$', 'Symmetric'], ['$a R b$ and $b R c$ give $a R c$', 'Transitive']]),
  match(A(4, 2), [['$f(x) = 2x + 1$ on $\\mathbb{R}$', 'Has an inverse on $\\mathbb{R}$'], ['$f(x) = x^2$ on $\\mathbb{R}$', 'Misses negatives, and repeats values'], ['$f(x) = e^x$ from $\\mathbb{R}$ to $\\mathbb{R}$', 'Never repeats a value, but misses negatives'], ['$f(x) = x^3 - x$ on $\\mathbb{R}$', 'Takes every value, some of them three times']]),
  match(A(3, 2), [['“Is parallel to” on lines in a plane', 'An equivalence relation'], ['“Is less than or equal to” on $\\mathbb{R}$', 'Reflexive and transitive, not symmetric'], ['“Is perpendicular to” on lines in a plane', 'Symmetric only']]),
  match(A(4, 3), [['$f(x) = 3x - 2$', '$f^{-1}(x) = \\frac{x + 2}{3}$'], ['$f(x) = \\frac{x}{x + 1}$, $x \\ne -1$', '$f^{-1}(x) = \\frac{x}{1 - x}$'], ['$f(x) = x^3 + 1$', '$f^{-1}(x) = \\sqrt[3]{x - 1}$'], ['$f(x) = \\frac{1}{x}$, $x \\ne 0$', '$f^{-1}(x) = \\frac{1}{x}$']]),
  match(A(3, 3), [['$f$ and $g$ one-one', '$g \\circ f$ is one-one'], ['$f$ and $g$ onto', '$g \\circ f$ is onto'], ['$f$ invertible', '$(f^{-1})^{-1} = f$']]),
  match(B(3, 1), [['$\\sin^{-1} x$', 'Range $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$'], ['$\\cos^{-1} x$', 'Range $[0, \\pi]$'], ['$\\tan^{-1} x$', 'Range $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$']]),
  match(B(4, 2), [['$\\sin^{-1}\\frac{1}{2}$', '$\\frac{\\pi}{6}$'], ['$\\cos^{-1}\\left(-\\frac{1}{2}\\right)$', '$\\frac{2\\pi}{3}$'], ['$\\tan^{-1}(-1)$', '$-\\frac{\\pi}{4}$'], ['$\\cos^{-1}\\frac{1}{\\sqrt{2}}$', '$\\frac{\\pi}{4}$']]),
  match(B(3, 2), [['$\\sin^{-1} x + \\cos^{-1} x$', '$\\frac{\\pi}{2}$'], ['$\\tan^{-1} x + \\tan^{-1}\\frac{1}{x}$, $x > 0$', 'Also $\\frac{\\pi}{2}$, for positive $x$ only'], ['$\\sin^{-1}(-x)$', '$-\\sin^{-1} x$']]),
  match(B(4, 3), [['$\\sin^{-1}(\\sin \\frac{5\\pi}{6})$', '$\\frac{\\pi}{6}$'], ['$\\cos^{-1}(\\cos \\frac{7\\pi}{6})$', '$\\frac{5\\pi}{6}$'], ['$\\tan^{-1}(\\tan \\frac{3\\pi}{4})$', '$-\\frac{\\pi}{4}$'], ['$\\cos^{-1}(\\cos \\frac{\\pi}{3})$', '$\\frac{\\pi}{3}$']]),
  match(B(3, 3), [['Domain of $\\sin^{-1} x$', '$[-1, 1]$'], ['Domain of $\\tan^{-1} x$', '$\\mathbb{R}$'], ['Domain of $\\sec^{-1} x$', '$\\mathbb{R} - (-1, 1)$']]),
];

export default questions;
