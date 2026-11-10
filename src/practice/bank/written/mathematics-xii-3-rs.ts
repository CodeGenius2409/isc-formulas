// Written by hand: calculus, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('mathematics', 'XII');
const A = at(3, 'a');
const D = at(3, 'b');
const I = at(3, 'c');
const E = at(3, 'e');

const questions: BankDef[] = [
  reason(A(1, 1), 'Explain why $f(x) = |x|$ is continuous at $x = 0$.', 'Both one-sided limits are 0, which is $f(0)$.'),
  reason(A(2, 2), 'Explain why $f(x) = |x|$ is not differentiable at $x = 0$, though it is continuous there.', 'The left-hand derivative is $-1$ and the right-hand derivative is $1$.', 'They differ, so there is no single derivative at 0: the graph has a corner.'),
  reason(A(2, 2), 'Explain why logarithmic differentiation is used for $y = x^x$.', 'Both the base and the power change with $x$, so neither the power rule nor the exponential rule applies.', 'Taking logs gives $\\log y = x \\log x$, which can be differentiated as a product.'),
  reason(A(2, 3), 'Explain why a function that is differentiable at a point must be continuous there.', '$f(a + h) - f(a) = \\frac{f(a + h) - f(a)}{h} \\cdot h$.', 'As $h \\to 0$, this tends to $f\'(a) \\times 0 = 0$, so $f(a + h) \\to f(a)$.'),
  reason(A(1, 2), 'Explain why $f(x) = \\frac{1}{x - 2}$ is not continuous at $x = 2$.', '$f$ is not defined at $x = 2$, and it grows without bound near it.'),
  short(A(2, 1), 'Find $\\frac{dy}{dx}$ if $x = at^2$ and $y = 2at$.', '$\\frac{dx}{dt} = 2at$ and $\\frac{dy}{dt} = 2a$.', '$\\frac{dy}{dx} = \\frac{2a}{2at} = \\frac{1}{t}$.'),
  short(A(2, 2), 'Find $\\frac{dy}{dx}$ if $x^2 + y^2 = 25$, and give its value at $(3, 4)$.', '$2x + 2y\\frac{dy}{dx} = 0$, so $\\frac{dy}{dx} = -\\frac{x}{y}$.', 'At $(3, 4)$ it is $-\\frac{3}{4}$.'),
  short(A(3, 3), 'Find the value of $k$ for which $f(x) = kx + 1$ for $x \\le 2$, and $f(x) = 3x - 1$ for $x > 2$, is continuous at $x = 2$. Is it then differentiable there?', 'The left limit is $2k + 1$ and the right limit is 5, so $k = 2$.', 'The left derivative is $k = 2$, and the right derivative is 3.', 'They differ, so $f$ is not differentiable at $x = 2$.'),
  reason(D(1, 1), 'Explain why $f(x) = e^x$ is increasing on all of $\\mathbb{R}$.', '$f\'(x) = e^x$, which is positive for every $x$.'),
  reason(D(2, 2), 'Explain why $f\'(c) = 0$ doesn’t always mean $f$ has a maximum or minimum at $c$.', 'The derivative may keep its sign on both sides of $c$.', 'For $f(x) = x^3$, $f\'(0) = 0$, but $f$ increases through 0, so it has neither.'),
  reason(D(2, 3), 'Explain why the slope of the normal is $-\\frac{1}{m}$ when the slope of the tangent is $m$, with $m \\ne 0$.', 'The normal is at right angles to the tangent.', 'Two lines at right angles have slopes whose product is $-1$.'),
  short(D(2, 2), 'Find the rate at which the area of a circle grows when its radius is 5 cm and is growing at 0.2 cm/s.', '$\\frac{dA}{dt} = 2\\pi r \\frac{dr}{dt}$.', '$= 2\\pi \\times 5 \\times 0.2 = 2\\pi$ cm²/s.'),
  reason(I(1, 1), 'Explain why an indefinite integral has a constant $C$ added.', 'Functions that differ by a constant have the same derivative, so the antiderivative is fixed only up to a constant.'),
  reason(I(2, 2), 'Explain why the constant of integration isn’t needed in a definite integral.', 'By the fundamental theorem, $\\int_a^b f = F(b) - F(a)$.', 'Any constant added to $F$ cancels in the difference.'),
  reason(I(2, 2), 'Explain why $\\int_{-a}^{a} x^3\\,dx = 0$ without working it out.', '$x^3$ is an odd function, as $(-x)^3 = -x^3$.', 'The area on the left is the negative of the area on the right, so they cancel.'),
  reason(I(2, 3), 'Explain why partial fractions can be used for $\\frac{x + 3}{(x - 1)(x + 2)}$ straight away, but not for $\\frac{x^3}{(x - 1)(x + 2)}$.', 'The first is a proper fraction: the top’s degree is less than the bottom’s.', 'The second is improper, so it must first be divided to give a polynomial plus a proper fraction.'),
  reason(I(1, 2), 'Explain why $\\int_0^{\\pi/2} \\sin x\\,dx = \\int_0^{\\pi/2} \\cos x\\,dx$.', 'By $\\int_0^a f(x)\\,dx = \\int_0^a f(a - x)\\,dx$, and $\\sin\\left(\\frac{\\pi}{2} - x\\right) = \\cos x$.'),
  reason(E(1, 1), 'Explain why the order of $\\frac{d^2y}{dx^2} + \\left(\\frac{dy}{dx}\\right)^3 = 0$ is 2.', 'Its highest derivative is the second derivative.'),
  reason(E(2, 2), 'Explain why the degree of $\\frac{dy}{dx} + \\sin\\left(\\frac{dy}{dx}\\right) = 0$ is not defined.', 'Degree is defined only when the equation is a polynomial in its derivatives.', '$\\sin\\left(\\frac{dy}{dx}\\right)$ isn’t a polynomial in $\\frac{dy}{dx}$.'),
  reason(E(2, 2), 'Explain why a general solution of a first-order differential equation has one arbitrary constant.', 'Solving it takes one integration.', 'Each integration brings one constant, as many functions share a derivative.'),
  reason(E(2, 3), 'Explain why $y\\,dx - x\\,dy = 0$ can be solved by separating the variables, and give the solution.', 'Dividing by $xy$ gives $\\frac{dx}{x} = \\frac{dy}{y}$, so each side has one variable.', 'Integrating, $\\log|x| = \\log|y| + c$, so $y = Cx$.'),
  reason(E(1, 2), 'Explain why $\\frac{dy}{dx} = \\frac{x + y}{x}$ is a homogeneous differential equation.', 'Its right-hand side is $1 + \\frac{y}{x}$, a function of $\\frac{y}{x}$ alone, which is of degree 0.'),
  short(E(2, 1), 'Give the order and the degree of $\\left(\\frac{d^2y}{dx^2}\\right)^2 + 3\\frac{dy}{dx} = y$.', 'Order 2, as the highest derivative is the second.', 'Degree 2, as that derivative is squared.'),
  short(E(2, 2), 'Find the integrating factor of $\\frac{dy}{dx} + \\frac{y}{x} = x^2$, for $x > 0$.', '$P = \\frac{1}{x}$, so $\\int P\\,dx = \\log x$.', 'The integrating factor is $e^{\\log x} = x$.'),
  short(E(3, 2), 'Solve $\\frac{dy}{dx} = \\frac{y}{x}$, given $y = 6$ when $x = 2$.', 'Separating, $\\frac{dy}{y} = \\frac{dx}{x}$.', 'So $\\log|y| = \\log|x| + c$, which gives $y = Cx$.', '$6 = 2C$, so $C = 3$ and $y = 3x$.'),
];

export default questions;
