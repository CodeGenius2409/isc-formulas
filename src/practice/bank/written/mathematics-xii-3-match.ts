// Written by hand: calculus, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('mathematics', 'XII');
const A = at(3, 'a');
const D = at(3, 'b');
const I = at(3, 'c');
const E = at(3, 'e');

const questions: BankDef[] = [
  match(A(3, 1), [['$\\frac{d}{dx}\\sin^{-1} x$', '$\\frac{1}{\\sqrt{1 - x^2}}$'], ['$\\frac{d}{dx}\\tan^{-1} x$', '$\\frac{1}{1 + x^2}$'], ['$\\frac{d}{dx}\\log x$', '$\\frac{1}{x}$']]),
  match(A(4, 2), [['$\\frac{d}{dx} a^x$', '$a^x \\log a$'], ['$\\frac{d}{dx} e^{2x}$', '$2e^{2x}$'], ['$\\frac{d}{dx} \\sin(x^2)$', '$2x\\cos(x^2)$'], ['$\\frac{d}{dx} x^x$', '$x^x(1 + \\log x)$']]),
  match(A(3, 2), [['$|x|$ at 0', 'Continuous, not differentiable'], ['$x^2$ at 0', 'Continuous and differentiable'], ['$\\frac{1}{x}$ at 0', 'Not continuous']]),
  match(A(4, 3), [['$x = a\\cos t$, $y = a\\sin t$', '$\\frac{dy}{dx} = -\\cot t$'], ['$x = t^2$, $y = t^3$', '$\\frac{dy}{dx} = \\frac{3t}{2}$'], ['$x = e^t$, $y = e^{-t}$', '$\\frac{dy}{dx} = -e^{-2t}$'], ['$x = at$, $y = \\frac{a}{t}$', '$\\frac{dy}{dx} = -\\frac{1}{t^2}$']]),
  match(A(3, 3), [['$y = e^{3x}$', '$\\frac{d^2y}{dx^2} = 9y$'], ['$y = \\sin 3x$', '$\\frac{d^2y}{dx^2} = -9y$'], ['$y = x^3$', '$\\frac{d^2y}{dx^2} = 6x$']]),
  match(D(3, 1), [['$f\'(x) > 0$ on an interval', '$f$ is increasing there'], ['$f\'(x) < 0$ on an interval', '$f$ is decreasing there'], ['$f\'(c) = 0$ and $f\'\'(c) < 0$', 'Local maximum at $c$']]),
  match(D(4, 2), [['Slope of the tangent at $x_0$', '$f\'(x_0)$'], ['Slope of the normal at $x_0$', '$-\\frac{1}{f\'(x_0)}$'], ['Tangent parallel to the $x$-axis', '$f\'(x_0) = 0$'], ['Tangent parallel to the $y$-axis', '$\\frac{dx}{dy} = 0$']]),
  match(D(3, 2), [['$f(x) = x^3$', 'Increasing on $\\mathbb{R}$'], ['$f(x) = e^{-x}$', 'Decreasing on $\\mathbb{R}$'], ['$f(x) = x^2$', 'Decreasing, then increasing']]),
  match(D(4, 3), [['$x^2 - 4x$', 'Least value $-4$, at $x = 2$'], ['$-x^2 + 6x$', 'Greatest value 9, at $x = 3$'], ['$x + \\frac{1}{x}$, $x > 0$', 'Least value 2, at $x = 1$'], ['$\\sin x + \\cos x$', 'Greatest value $\\sqrt{2}$, at $x = \\frac{\\pi}{4}$']]),
  match(D(3, 3), [['Rate of change of a circle’s area', '$2\\pi r \\frac{dr}{dt}$'], ['Rate of change of a sphere’s volume', '$4\\pi r^2 \\frac{dr}{dt}$'], ['Rate of change of a cube’s volume', '$3a^2 \\frac{da}{dt}$']]),
  match(I(3, 1), [['$\\int \\frac{1}{x}\\,dx$', '$\\log|x| + C$'], ['$\\int e^x\\,dx$', '$e^x + C$'], ['$\\int \\sec^2 x\\,dx$', '$\\tan x + C$']]),
  match(I(4, 2), [['$\\int \\frac{dx}{1 + x^2}$', '$\\tan^{-1} x + C$'], ['$\\int \\frac{dx}{\\sqrt{1 - x^2}}$', '$\\sin^{-1} x + C$'], ['$\\int \\frac{dx}{x^2 - 1}$', '$\\frac{1}{2}\\log\\left|\\frac{x - 1}{x + 1}\\right| + C$'], ['$\\int \\frac{dx}{\\sqrt{x^2 + 1}}$', '$\\log\\left|x + \\sqrt{x^2 + 1}\\right| + C$']]),
  match(I(3, 2), [['$\\int x e^x\\,dx$', 'By parts'], ['$\\int \\frac{2x}{x^2 + 3}\\,dx$', 'By substitution'], ['$\\int \\frac{dx}{(x - 1)(x - 2)}$', 'By partial fractions']]),
  match(I(4, 3), [['$\\int_0^{\\pi} \\sin x\\,dx$', '2'], ['$\\int_0^1 x^2\\,dx$', '$\\frac{1}{3}$'], ['$\\int_{-1}^{1} x^3\\,dx$', '0'], ['$\\int_0^1 e^x\\,dx$', '$e - 1$']]),
  match(I(3, 3), [['$\\int_a^b f(x)\\,dx$', '$\\int_a^b f(a + b - x)\\,dx$'], ['$\\int_{-a}^{a} f(x)\\,dx$, $f$ odd', '0'], ['$\\int_{-a}^{a} f(x)\\,dx$, $f$ even', '$2\\int_0^a f(x)\\,dx$']]),
  match(E(3, 1), [['$\\frac{dy}{dx} = 2x$', 'Order 1, degree 1'], ['$\\left(\\frac{d^2y}{dx^2}\\right)^3 + y = 0$', 'Order 2, degree 3'], ['$\\frac{d^3y}{dx^3} + \\frac{dy}{dx} = 0$', 'Order 3, degree 1']]),
  match(E(4, 2), [['$\\frac{dy}{dx} = \\frac{x}{y}$', 'Variables separable'], ['$\\frac{dy}{dx} = \\frac{x + y}{x - y}$', 'Homogeneous'], ['$\\frac{dy}{dx} + \\frac{y}{x} = x$', 'Linear in $y$'], ['$\\frac{dx}{dy} + x = y$', 'Linear in $x$']]),
  match(E(3, 2), [['$\\frac{dy}{dx} + 2y = x$', 'Integrating factor $e^{2x}$'], ['$\\frac{dy}{dx} + \\frac{y}{x} = 1$', 'Integrating factor $x$'], ['$\\frac{dy}{dx} - y\\tan x = 1$', 'Integrating factor $\\cos x$']]),
  match(E(4, 3), [['$\\frac{dy}{dx} = y$', '$y = Ce^x$'], ['$\\frac{dy}{dx} = \\frac{y}{x}$', '$y = Cx$'], ['$\\frac{dy}{dx} = -\\frac{x}{y}$', '$x^2 + y^2 = C$'], ['$\\frac{dy}{dx} = x$', '$y = \\frac{x^2}{2} + C$']]),
  match(E(3, 3), [['General solution of a first-order equation', 'Has one arbitrary constant'], ['Particular solution', 'Has no arbitrary constant'], ['Family $y = Ae^x + Be^{-x}$', 'Its equation has order 2']]),
];

export default questions;
