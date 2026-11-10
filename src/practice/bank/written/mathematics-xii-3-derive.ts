// Written by hand: calculus, proofs not already in the bank. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { derive } = kit('mathematics', 'XII');
const A = at(3, 'a');
const I = at(3, 'c');
const E = at(3, 'e');

const questions: BankDef[] = [
  derive(A(3, 2), 'Prove from first principles that the derivative of $e^x$ is $e^x$.', ['$\\frac{d}{dx}e^x = \\lim_{h \\to 0}\\frac{e^{x + h} - e^x}{h}$.', 1], ['$= e^x \\lim_{h \\to 0}\\frac{e^h - 1}{h}$.', 1], ['The limit is 1, so the derivative is $e^x$.', 1]),
  derive(I(3, 2), 'Prove that $\\int_{-a}^{a} f(x)\\,dx = 2\\int_0^a f(x)\\,dx$ for even $f$, and 0 for odd $f$.', ['Split: $\\int_{-a}^{a} f = \\int_{-a}^{0} f + \\int_0^{a} f$, and put $x = -t$ in the first, giving $\\int_0^a f(-t)\\,dt$.', 1], ['For even $f$, $f(-t) = f(t)$, so the total is $2\\int_0^a f$.', 1], ['For odd $f$, $f(-t) = -f(t)$, so the two parts cancel to 0.', 1]),
  derive(I(3, 3), 'Prove that $\\int \\frac{dx}{x^2 - a^2} = \\frac{1}{2a}\\log\\left|\\frac{x - a}{x + a}\\right| + C$.', ['$\\frac{1}{x^2 - a^2} = \\frac{1}{2a}\\left(\\frac{1}{x - a} - \\frac{1}{x + a}\\right)$.', 1], ['Integrating gives $\\frac{1}{2a}(\\log|x - a| - \\log|x + a|)$.', 1], ['$= \\frac{1}{2a}\\log\\left|\\frac{x - a}{x + a}\\right| + C$.', 1]),
  derive(E(3, 1), 'Show that the general solution of $\\frac{dy}{dx} = ky$ is $y = Ce^{kx}$.', ['Separating, $\\frac{dy}{y} = k\\,dx$.', 1], ['Integrating, $\\log|y| = kx + c$.', 1], ['So $y = Ce^{kx}$, with $C = \\pm e^c$.', 1]),
  derive(E(3, 2), 'Form the differential equation of the family $y = A\\cos x + B\\sin x$.', ['$\\frac{dy}{dx} = -A\\sin x + B\\cos x$.', 1], ['$\\frac{d^2y}{dx^2} = -A\\cos x - B\\sin x = -y$.', 1], ['So $\\frac{d^2y}{dx^2} + y = 0$, with both constants gone.', 1]),
  derive(E(3, 2), 'Show that putting $y = vx$ turns $\\frac{dy}{dx} = F\\left(\\frac{y}{x}\\right)$ into an equation whose variables separate.', ['$y = vx$ gives $\\frac{dy}{dx} = v + x\\frac{dv}{dx}$.', 1], ['So $v + x\\frac{dv}{dx} = F(v)$.', 1], ['That is $\\frac{dv}{F(v) - v} = \\frac{dx}{x}$, with the variables separated.', 1]),
  derive(E(3, 3), 'Form the differential equation of the circles that touch the $y$-axis at the origin, $x^2 + y^2 = 2ax$.', ['Differentiating, $2x + 2y\\frac{dy}{dx} = 2a$.', 1], ['So $2a = 2x + 2yy\'$; putting this into the equation, $x^2 + y^2 = x(2x + 2yy\')$.', 1], ['That is $2xy\\frac{dy}{dx} = y^2 - x^2$.', 1]),
];

export default questions;
