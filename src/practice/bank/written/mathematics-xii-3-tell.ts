// Written by hand: calculus, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('mathematics', 'XII');
const A = at(3, 'a');
const D = at(3, 'b');
const I = at(3, 'c');
const E = at(3, 'e');

const questions: BankDef[] = [
  tell(A(2, 1), 'Distinguish between continuity and differentiability at a point.', 'Continuous: the limit at the point exists and equals the value there, so the graph has no break.', 'Differentiable: the left and right derivatives exist and are equal, so the graph is also smooth there.'),
  tell(A(2, 2), 'Distinguish between explicit and implicit functions, with an example of each.', 'Explicit: $y$ is given directly in terms of $x$, as $y = x^2 + 1$.', 'Implicit: $x$ and $y$ are mixed in one equation, as $x^2 + y^2 = 4$, and are differentiated term by term.'),
  tell(A(2, 2), 'Distinguish between the chain rule and logarithmic differentiation.', 'The chain rule differentiates a function of a function: $\\frac{dy}{dx} = \\frac{dy}{du}\\frac{du}{dx}$.', 'Logarithmic differentiation takes logs first, for products, quotients or powers like $x^x$.'),
  tell(A(2, 3), 'Distinguish between a removable discontinuity and a jump discontinuity.', 'Removable: the limit exists, but differs from the value, or the value is missing; redefining one point fixes it.', 'Jump: the left and right limits exist but differ, so no single value can fix it.'),
  tell(A(3, 3), 'Distinguish between differentiating a function given parametrically and one given directly.', 'Given directly as $y = f(x)$, $\\frac{dy}{dx}$ is found at once.', 'Given as $x = f(t)$ and $y = g(t)$, both are differentiated with respect to $t$.', 'Then $\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}$.'),
  tell(D(2, 1), 'Distinguish between a local maximum and the greatest value of a function on an interval.', 'A local maximum is higher than the values just around it.', 'The greatest value is the highest over the whole interval, which may be a local maximum or a value at an end.'),
  tell(D(2, 2), 'Distinguish between the first derivative test and the second derivative test.', 'First derivative test: look at how the sign of $f\'$ changes as $x$ passes the point.', 'Second derivative test: at a point where $f\' = 0$, $f\'\' < 0$ gives a maximum and $f\'\' > 0$ a minimum.'),
  tell(D(2, 2), 'Distinguish between the tangent and the normal to a curve at a point.', 'The tangent touches the curve there, with slope $f\'(x_0)$.', 'The normal is at right angles to the tangent there, with slope $-\\frac{1}{f\'(x_0)}$.'),
  tell(D(2, 3), 'Distinguish between increasing and strictly increasing functions.', 'Increasing: $x_1 < x_2$ gives $f(x_1) \\le f(x_2)$, so the function may stay level for a while.', 'Strictly increasing: $x_1 < x_2$ gives $f(x_1) < f(x_2)$, so it always rises.'),
  tell(D(3, 3), 'Distinguish between the rate of change of $y$ with $x$ and with time $t$, for a ladder sliding down a wall.', '$\\frac{dy}{dx}$ compares how the top and foot move against each other.', '$\\frac{dy}{dt}$ and $\\frac{dx}{dt}$ are how fast each moves.', 'They are linked by the chain rule: $\\frac{dy}{dt} = \\frac{dy}{dx} \\cdot \\frac{dx}{dt}$.'),
  tell(I(2, 1), 'Distinguish between an indefinite and a definite integral.', 'An indefinite integral is a family of functions, with a constant $C$.', 'A definite integral is a number, $F(b) - F(a)$, with no constant.'),
  tell(I(2, 2), 'Distinguish between integration by substitution and by parts.', 'Substitution changes the variable, when part of the integrand is the derivative of another part.', 'By parts handles a product: $\\int u\\,dv = uv - \\int v\\,du$.'),
  tell(I(2, 2), 'Distinguish between a proper and an improper rational function, for partial fractions.', 'Proper: the degree of the top is less than that of the bottom, so partial fractions can be used at once.', 'Improper: it isn’t, so it must first be divided.'),
  tell(I(2, 3), 'Distinguish between $\\int_0^a f(x)\\,dx$ and $\\int_{-a}^a f(x)\\,dx$ for an even function $f$.', 'For an even $f$, the graph is symmetric about the $y$-axis.', 'So $\\int_{-a}^a f(x)\\,dx = 2\\int_0^a f(x)\\,dx$.'),
  tell(I(3, 3), 'Distinguish between an antiderivative and the fundamental theorem of calculus.', 'An antiderivative of $f$ is any $F$ with $F\' = f$.', 'The fundamental theorem says a definite integral can be found from any one of them.', 'That is, $\\int_a^b f(x)\\,dx = F(b) - F(a)$.'),
  tell(E(2, 1), 'Distinguish between the order and the degree of a differential equation.', 'The order is that of the highest derivative in it.', 'The degree is the power of that highest derivative, once the equation is a polynomial in its derivatives.'),
  tell(E(2, 2), 'Distinguish between a general and a particular solution of a differential equation.', 'A general solution has as many arbitrary constants as the order.', 'A particular solution has values given to them, from given conditions.'),
  tell(E(2, 2), 'Distinguish between a homogeneous and a linear first-order differential equation.', 'Homogeneous: $\\frac{dy}{dx}$ is a function of $\\frac{y}{x}$, solved by putting $y = vx$.', 'Linear: of the form $\\frac{dy}{dx} + Py = Q$, solved with an integrating factor.'),
  tell(E(2, 3), 'Distinguish between the variables separable method and the integrating factor method.', 'Separation works when the equation can be written as $f(y)\\,dy = g(x)\\,dx$.', 'An integrating factor, $e^{\\int P\\,dx}$, is used for a linear equation that can’t be separated.'),
  tell(E(3, 3), 'Distinguish between $\\frac{dy}{dx} + Py = Q$ and $\\frac{dx}{dy} + Px = Q$.', 'In the first, $P$ and $Q$ are functions of $x$, and the integrating factor is $e^{\\int P\\,dx}$.', 'In the second, they are functions of $y$, and it is $e^{\\int P\\,dy}$.', 'The second is used when the equation is linear in $x$, not in $y$.'),
];

export default questions;
