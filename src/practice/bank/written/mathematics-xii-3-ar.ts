// Written by hand: calculus, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('mathematics', 'XII');
const A = at(3, 'a');
const I = at(3, 'c');
const E = at(3, 'e');

const questions: BankDef[] = [
  ar(A(1, 1), '$f(x) = |x|$ is continuous at $x = 0$.', '$f(x) = |x|$ is differentiable at $x = 0$.', 3, 'It is continuous there, but has a corner, so it isn’t differentiable.'),
  ar(A(1, 2), 'Every differentiable function is continuous.', 'A function that is continuous at a point is differentiable there.', 3, 'Differentiability implies continuity, but not the other way round, as $|x|$ shows.'),
  ar(A(1, 2), 'The derivative of $x^x$ is $x \\cdot x^{x - 1}$.', 'Both the base and the power of $x^x$ change with $x$.', 4, 'The power rule doesn’t apply; logarithmic differentiation gives $x^x(1 + \\log x)$.'),
  ar(A(1, 3), '$\\frac{d}{dx}\\sin(x^2) = 2x\\cos(x^2)$.', 'The chain rule: $\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$.', 1, 'With $u = x^2$, $\\cos u \\cdot 2x$.'),
  ar(I(1, 2), '$\\int_{-1}^{1} x^5\\,dx = 0$.', '$x^5$ is an odd function.', 1, 'The integral of an odd function over a symmetric interval is zero.'),
  ar(I(1, 3), '$\\int \\frac{1}{x}\\,dx = \\log x + C$ for all $x \\ne 0$.', 'The derivative of $\\log|x|$ is $\\frac{1}{x}$.', 4, 'For negative $x$, $\\log x$ isn’t defined; the right answer is $\\log|x| + C$.'),
  ar(E(1, 1), 'The order of $\\frac{d^2y}{dx^2} + y = 0$ is 2.', 'The order is the highest derivative in the equation.', 1, 'Its highest derivative is the second.'),
  ar(E(1, 2), 'The general solution of a second-order differential equation has two arbitrary constants.', 'Two integrations are needed to solve it.', 1, 'Each integration brings one constant.'),
  ar(E(1, 2), '$\\frac{dy}{dx} = \\frac{x + y}{x - y}$ is a linear differential equation.', 'Its right-hand side is a function of $\\frac{y}{x}$.', 4, 'It is homogeneous, as the reason says, not linear in $y$.'),
  ar(E(1, 3), 'The integrating factor of $\\frac{dy}{dx} + \\frac{y}{x} = x$, for $x > 0$, is $x$.', 'The integrating factor is $e^{\\int P\\,dx}$.', 1, '$\\int \\frac{1}{x}\\,dx = \\log x$, and $e^{\\log x} = x$.'),
  ar(E(1, 3), 'The degree of $\\left(\\frac{dy}{dx}\\right)^3 + \\frac{d^2y}{dx^2} = 0$ is 3.', 'The degree is the power of the highest-order derivative.', 4, 'The highest-order derivative is the second, to the power 1, so the degree is 1.'),
];

export default questions;
