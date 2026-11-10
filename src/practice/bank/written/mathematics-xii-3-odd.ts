// Written by hand: calculus, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('mathematics', 'XII');
const A = at(3, 'a');
const D = at(3, 'b');
const I = at(3, 'c');
const E = at(3, 'e');

const questions: BankDef[] = [
  odd(A(2, 1), ['$x^2$', '$\\sin x$', '$e^x$', '$|x|$'], '$|x|$', 'It isn’t differentiable at 0; the others are differentiable everywhere.'),
  odd(A(2, 2), ['$\\frac{d}{dx}e^x$', '$e^x$', '$\\frac{d^2}{dx^2}e^x$', '$\\frac{d}{dx}e^{2x}$'], '$\\frac{d}{dx}e^{2x}$', 'It is $2e^{2x}$; the others are all $e^x$.'),
  odd(A(2, 2), ['$\\frac{d}{dx}\\sin^{-1} x$', '$\\frac{d}{dx}(-\\cos^{-1} x)$', '$\\frac{1}{\\sqrt{1 - x^2}}$', '$\\frac{d}{dx}\\tan^{-1} x$'], '$\\frac{d}{dx}\\tan^{-1} x$', 'It is $\\frac{1}{1 + x^2}$; the others are all $\\frac{1}{\\sqrt{1 - x^2}}$.'),
  odd(A(2, 3), ['chain rule', 'logarithmic differentiation', 'implicit differentiation', 'integration by parts'], 'integration by parts', 'It is a method of integration; the others are methods of differentiation.'),
  odd(A(2, 3), ['$\\frac{1}{x}$', '$\\tan x$', '$\\log x$', '$x^3 - 1$'], '$x^3 - 1$', 'It is continuous on all of $\\mathbb{R}$; the others are not defined somewhere on it.'),
  odd(D(2, 1), ['$x^3$', '$e^x$', '$\\log x$, $x > 0$', '$x^2$'], '$x^2$', 'It is not increasing everywhere on its domain; the others are.'),
  odd(D(2, 2), ['$f\'(c) = 0$', '$f\'\'(c) < 0$', 'local maximum', '$f\'\'(c) > 0$'], '$f\'\'(c) > 0$', 'It points to a local minimum; the others go with a local maximum.'),
  odd(D(2, 2), ['rate of change', 'tangent and normal', 'maxima and minima', 'area under a curve'], 'area under a curve', 'It is an application of integrals; the others are applications of derivatives.'),
  odd(D(2, 3), ['$x + \\frac{1}{x}$, $x > 0$', '$x^2 - 4x + 7$', '$e^x$', '$(x - 1)^2 + 3$'], '$e^x$', 'It has no least value; the others have a minimum.'),
  odd(D(2, 3), ['slope of the tangent $m$', 'slope of the normal $-\\frac{1}{m}$', 'tangent parallel to the x-axis when $m = 0$', 'normal parallel to the x-axis when $m = 0$'], 'normal parallel to the x-axis when $m = 0$', 'It is wrong: when $m = 0$ the normal is vertical; the others are right.'),
  odd(I(2, 1), ['$\\int \\frac{1}{x}\\,dx = \\log|x| + C$', '$\\int e^x\\,dx = e^x + C$', '$\\int \\cos x\\,dx = \\sin x + C$', '$\\int \\log x\\,dx = \\frac{1}{x} + C$'], '$\\int \\log x\\,dx = \\frac{1}{x} + C$', 'It is wrong: $\\frac{1}{x}$ is the derivative of $\\log x$, not its integral; the others are right.'),
  odd(I(2, 2), ['substitution', 'by parts', 'partial fractions', 'chain rule'], 'chain rule', 'It is a rule of differentiation; the others are methods of integration.'),
  odd(I(2, 2), ['$\\int_{-1}^{1} x\\,dx$', '$\\int_{-1}^{1} x^3\\,dx$', '$\\int_{-1}^{1} \\sin x\\,dx$', '$\\int_{-1}^{1} x^2\\,dx$'], '$\\int_{-1}^{1} x^2\\,dx$', 'It is $\\frac{2}{3}$; the others are 0, as their integrands are odd.'),
  odd(I(2, 3), ['$\\int x e^x\\,dx$', '$\\int x\\sin x\\,dx$', '$\\int \\log x\\,dx$', '$\\int 2x e^{x^2}\\,dx$'], '$\\int 2x e^{x^2}\\,dx$', 'It is done by substitution; the others need integration by parts.'),
  odd(I(2, 3), ['$\\int_0^1 x\\,dx$', '$\\int_0^2 \\frac{x}{4}\\,dx$', '$\\int_0^{\\pi/2} \\sin x\\cos x\\,dx$', '$\\int_0^1 x^2\\,dx$'], '$\\int_0^1 x^2\\,dx$', 'It is $\\frac{1}{3}$; the others are all $\\frac{1}{2}$.'),
  odd(E(2, 1), ['$y = Cx$', '$y = x^2 + C$', '$y = Ce^x$', '$y = 5x$'], '$y = 5x$', 'It is a particular solution, with no arbitrary constant; the others are general solutions.'),
  odd(E(2, 2), ['$\\frac{dy}{dx} = \\frac{y}{x}$', '$\\frac{dy}{dx} = \\frac{x + y}{x}$', '$\\frac{dy}{dx} = \\frac{x^2 + y^2}{xy}$', '$\\frac{dy}{dx} = x + y^2$'], '$\\frac{dy}{dx} = x + y^2$', 'It isn’t homogeneous; the others are.'),
  odd(E(2, 2), ['$\\frac{dy}{dx} + y = x$', '$\\frac{dy}{dx} + \\frac{y}{x} = x^2$', '$\\frac{dx}{dy} + x = y$', '$\\frac{dy}{dx} + y^2 = x$'], '$\\frac{dy}{dx} + y^2 = x$', 'It isn’t linear, as it has $y^2$; the others are linear.'),
  odd(E(2, 3), ['order', 'degree', 'arbitrary constants', 'integrating factor'], 'integrating factor', 'It is a tool for solving linear equations; the others describe a differential equation or its solution.'),
  odd(E(2, 3), ['$\\frac{d^2y}{dx^2} + y = 0$', '$\\left(\\frac{dy}{dx}\\right)^2 + y = 0$', '$\\frac{d^2y}{dx^2} + \\frac{dy}{dx} = 0$', '$\\frac{d^2y}{dx^2} = x$'], '$\\left(\\frac{dy}{dx}\\right)^2 + y = 0$', 'It is of order 1; the others are of order 2.'),
];

export default questions;
