// Written by hand: calculus, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('mathematics', 'XII');
const A = at(3, 'a');
const D = at(3, 'b');
const I = at(3, 'c');
const E = at(3, 'e');

const questions: BankDef[] = [
  predict(A(2, 1), 'Predict whether $f(x) = |x| + |x - 1|$ is differentiable at $x = 0$ and at $x = \\frac{1}{2}$.', 'Not at $x = 0$, where $|x|$ has a corner.', 'Yes at $x = \\frac{1}{2}$, where the function is $1$, a constant, nearby.'),
  predict(A(2, 2), 'Predict $\\frac{dy}{dx}$ for $y = \\log(\\sin x)$, using the chain rule.', '$\\frac{dy}{dx} = \\frac{1}{\\sin x} \\cdot \\cos x$.', '$= \\cot x$.'),
  predict(A(2, 2), 'If $f$ is continuous at $a$ and $g$ is not, predict whether $f + g$ can be continuous at $a$.', 'No.', 'If $f + g$ were continuous, then $g = (f + g) - f$ would be continuous too.'),
  predict(A(3, 3), 'Predict the second derivative of $y = e^{2x} + e^{-2x}$, and find the equation linking $\\frac{d^2y}{dx^2}$ and $y$.', '$\\frac{dy}{dx} = 2e^{2x} - 2e^{-2x}$.', '$\\frac{d^2y}{dx^2} = 4e^{2x} + 4e^{-2x}$.', 'So $\\frac{d^2y}{dx^2} = 4y$.'),
  predict(A(2, 3), 'Predict whether $f(x) = x^2\\sin\\frac{1}{x}$, with $f(0) = 0$, is continuous at 0.', 'Yes.', '$|x^2 \\sin\\frac{1}{x}| \\le x^2$, which tends to 0, so the limit is $0 = f(0)$.'),
  predict(D(2, 1), 'The radius of a circle grows at a steady rate. Predict whether its area grows at a steady rate.', 'No: the area grows faster and faster.', '$\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}$, which rises as $r$ rises.'),
  predict(D(2, 2), 'Predict the greatest value of $\\sin x \\cos x$ without calculus, and check with calculus.', '$\\sin x\\cos x = \\frac{1}{2}\\sin 2x$, so the greatest value is $\\frac{1}{2}$.', 'Calculus: $\\cos 2x = 0$ at $x = \\frac{\\pi}{4}$, where the value is $\\frac{1}{2}$.'),
  predict(D(3, 3), 'A rectangle has a fixed perimeter. Predict its shape when its area is greatest, and prove it.', 'A square.', 'With perimeter $2P$, sides $x$ and $P - x$ give area $A = x(P - x)$, and $A\' = P - 2x = 0$ at $x = \\frac{P}{2}$.', '$A\'\' = -2 < 0$, so this is a maximum, and both sides are $\\frac{P}{2}$.'),
  predict(D(2, 3), 'Predict whether $f(x) = x^3$ has a maximum or minimum at $x = 0$.', 'Neither.', '$f\'(x) = 3x^2$ is positive on both sides of 0, so $f$ keeps increasing through it.'),
  predict(I(2, 1), 'Predict $\\int_0^{2\\pi} \\sin x\\,dx$ without integrating, and give the reason.', 'Zero.', 'Over a full period, the areas above and below the axis are equal, and they cancel.'),
  predict(I(2, 2), 'Predict whether $\\int_0^1 x^2\\,dx$ is more or less than $\\int_0^1 x\\,dx$, without working either out.', 'Less.', 'On $(0, 1)$, $x^2 < x$, so the area under $x^2$ is smaller.'),
  predict(I(2, 2), 'Predict a suitable method for $\\int x^2 e^x\\,dx$, and how many times it must be used.', 'Integration by parts, with $x^2$ as the first function.', 'Twice, as each use lowers the power of $x$ by one.'),
  predict(I(3, 3), 'Predict $\\int_0^{\\pi/2} \\frac{\\sin x}{\\sin x + \\cos x}\\,dx$ without finding an antiderivative.', 'Call it $I$; replacing $x$ by $\\frac{\\pi}{2} - x$ gives $I = \\int_0^{\\pi/2} \\frac{\\cos x}{\\cos x + \\sin x}\\,dx$.', 'Adding the two forms, $2I = \\int_0^{\\pi/2} 1\\,dx = \\frac{\\pi}{2}$.', 'So $I = \\frac{\\pi}{4}$.'),
  predict(I(2, 3), 'Predict the sign of $\\int_{-1}^{1} x^3 e^{x^2}\\,dx$, and its value.', 'It is zero.', 'The integrand is odd, as $(-x)^3 e^{x^2} = -x^3 e^{x^2}$.'),
  predict(E(2, 1), 'A family of curves has two arbitrary constants. Predict the order of its differential equation.', 'Order 2.', 'Two differentiations are needed to remove two constants.'),
  predict(E(2, 2), 'Predict the type of the equation $\\frac{dy}{dx} = \\frac{y^2 + x^2}{xy}$, and the substitution that solves it.', 'It is homogeneous, as its right side is a function of $\\frac{y}{x}$.', 'Put $y = vx$.'),
  predict(E(2, 2), 'For $\\frac{dy}{dx} + Py = Q$ with $P$ and $Q$ constant, predict what happens to $y$ for large $x$ if $P > 0$.', 'The solution is $y = \\frac{Q}{P} + Ce^{-Px}$.', 'The exponential dies away, so $y$ approaches $\\frac{Q}{P}$.'),
  predict(E(3, 3), 'A population grows at a rate proportional to its size. Predict how long it takes to double again, if it doubled in 10 years.', '$\\frac{dP}{dt} = kP$ gives $P = P_0e^{kt}$.', 'Doubling in 10 years gives $e^{10k} = 2$, which doesn’t depend on $P_0$.', 'So it doubles again in another 10 years.'),
  predict(E(2, 3), 'Predict whether $y = x^2 + 1$ is a solution of $x\\frac{dy}{dx} = 2y - 2$.', 'Yes.', '$x \\cdot 2x = 2x^2$, and $2(x^2 + 1) - 2 = 2x^2$: the two sides agree.'),
  predict(D(2, 2), 'Predict the tangent to $y = x^3$ at the origin, and whether the curve crosses it there.', '$\\frac{dy}{dx} = 3x^2 = 0$ at the origin, so the tangent is $y = 0$.', 'The curve crosses it, from below to above, as $x^3$ changes sign at 0.'),
];

export default questions;
