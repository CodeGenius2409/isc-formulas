// Written by hand: numericals on calculus, for Mathematics XII at 0% generated. The answers are computed separately in
// tests/unit/written-answers.test.ts. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { theory } = bank('mathematics', 'XII');
const n = (place: Place, text: string, points: (string | [string, number])[]) => theory('short', place, text, points, { format: 'numerical' });
const A = (marks: number, d: 1 | 2 | 3): Place => [3, 'a', marks, d];
const B = (marks: number, d: 1 | 2 | 3): Place => [3, 'b', marks, d];
const C = (marks: number, d: 1 | 2 | 3): Place => [3, 'c', marks, d];
const R = (marks: number, d: 1 | 2 | 3): Place => [3, 'd', marks, d];
const E = (marks: number, d: 1 | 2 | 3): Place => [3, 'e', marks, d];

const questions: BankDef[] = [
  // ---- 3a Differentiation
  n(A(1, 1), 'If $y = e^{2x}$, find $\\frac{dy}{dx}$ at $x = 0$.', ['$2e^{2x}$ at $x = 0$ is $2$.']),
  n(A(1, 1), 'If $y = \\log x$, find $\\frac{dy}{dx}$ at $x = 2$.', ['$\\frac{1}{x}$ at $x = 2$ is $\\frac{1}{2}$.']),
  n(A(2, 1), 'If $y = \\sin 3x$, find $\\frac{dy}{dx}$ at $x = 0$.', ['$\\frac{dy}{dx} = 3\\cos 3x$.', 'At $x = 0$ it is $3$.']),
  n(A(2, 1), 'If $y = \\tan x$, find $\\frac{dy}{dx}$ at $x = \\frac{\\pi}{4}$.', ['$\\frac{dy}{dx} = \\sec^2 x$.', 'At $x = \\frac{\\pi}{4}$ it is $2$.']),
  n(A(2, 2), 'If $x = t^2$ and $y = 2t$, find $\\frac{dy}{dx}$ at $t = 2$.', ['$\\frac{dy}{dx} = \\frac{2}{2t} = \\frac{1}{t}$.', 'At $t = 2$ it is $\\frac{1}{2}$.']),
  n(A(3, 1), 'If $x^2 + y^2 = 25$, find $\\frac{dy}{dx}$ at $(3, 4)$.', ['$2x + 2y\\frac{dy}{dx} = 0$.', 'So $\\frac{dy}{dx} = -\\frac{x}{y}$.', 'At $(3, 4)$ it is $-\\frac{3}{4}$.']),
  n(A(3, 2), 'If $y = x^x$, find $\\frac{dy}{dx}$ at $x = 1$.', ['$\\log y = x\\log x$.', '$\\frac{1}{y}\\frac{dy}{dx} = 1 + \\log x$.', 'At $x = 1$, $y = 1$, so it is $1$.']),
  n(A(3, 2), 'Find $k$ so that $f(x) = kx + 1$ for $x \\le 2$, and $f(x) = 3x - 1$ for $x > 2$, is continuous at $x = 2$.', ['The left-hand limit is $2k + 1$.', 'The right-hand limit is 5.', 'So $2k + 1 = 5$, and $k = 2$.']),
  n(A(5, 3), 'Find $a$ and $b$ so that $f(x) = ax^2 + b$ for $x \\le 1$, and $f(x) = 2x + 1$ for $x > 1$, is differentiable at $x = 1$. Give the value of $b$.', ['It must be continuous at 1 first: the limits are $a + b$ and 3.', 'So $a + b = 3$.', 'The left derivative is $2a$, and the right derivative is 2.', 'So $2a = 2$, and $a = 1$.', 'So $b = 2$.']),
  n(A(5, 3), 'If $y = (\\sin^{-1}x)^2$, find the constant value of $(1 - x^2)\\frac{d^2y}{dx^2} - x\\frac{dy}{dx}$.', ['$\\frac{dy}{dx} = \\frac{2\\sin^{-1}x}{\\sqrt{1 - x^2}}$.', 'So $\\sqrt{1 - x^2}\\,\\frac{dy}{dx} = 2\\sin^{-1}x$.', 'Differentiate again: $\\sqrt{1 - x^2}\\,\\frac{d^2y}{dx^2} - \\frac{x}{\\sqrt{1 - x^2}}\\frac{dy}{dx} = \\frac{2}{\\sqrt{1 - x^2}}$.', 'Multiply through by $\\sqrt{1 - x^2}$.', 'The value is $2$.']),
  // ---- 3b Applications of derivatives
  n(B(1, 1), 'Find the slope of the tangent to $y = x^3$ at $x = 2$.', ['$3x^2$ at $x = 2$ is $12$.']),
  n(B(1, 1), 'Find the maximum value of $4 - x^2$.', ['It is greatest at $x = 0$, where it is $4$.']),
  n(B(2, 1), 'The radius of a circle grows at 2 cm/s. How fast is its area growing when the radius is 5 cm?', ['$\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}$.', 'This is $20\\pi$ cm²/s.']),
  n(B(2, 2), 'Use differentials to find an approximate value of $\\sqrt{26}$.', ['Take $x = 25$, $\\Delta x = 1$, so $\\Delta y \\approx \\frac{1}{2\\sqrt{25}} = 0.1$.', 'So $\\sqrt{26} \\approx 5.1$.']),
  n(B(2, 1), 'Find the minimum value of $x^2 - 4x + 5$.', ['$f\'(x) = 2x - 4 = 0$ at $x = 2$, and $f\'\'(x) > 0$.', 'The minimum value is $1$.']),
  n(B(3, 2), 'Find the local maximum value of $x^3 - 3x$.', ['$f\'(x) = 3x^2 - 3 = 0$, so $x = \\pm 1$.', '$f\'\'(-1) = -6 < 0$, so the maximum is at $x = -1$.', 'The value is $2$.']),
  n(B(3, 1), 'A rectangle has a perimeter of 20 cm. Find its largest possible area.', ['With sides $x$ and $10 - x$, $A = 10x - x^2$.', '$A\' = 10 - 2x = 0$ at $x = 5$, and $A\'\' < 0$.', 'The largest area is $25$ cm².']),
  n(B(3, 3), 'Air is pumped into a spherical balloon at 100 cm³/s. How fast is the radius growing when it is 5 cm?', ['$V = \\frac{4}{3}\\pi r^3$, so $\\frac{dV}{dt} = 4\\pi r^2\\frac{dr}{dt}$.', '$100 = 100\\pi\\frac{dr}{dt}$.', 'So $\\frac{dr}{dt} = \\frac{1}{\\pi}$ cm/s.']),
  n(B(5, 2), 'An open box is made from a square sheet of side 18 cm, by cutting a square of side $x$ from each corner and folding up. Find the largest possible volume.', ['$V = x(18 - 2x)^2$.', '$V\' = (18 - 2x)(18 - 6x)$.', 'So $x = 3$, as $x = 9$ leaves no box.', '$V\'\' < 0$ at $x = 3$, so it’s a maximum.', 'The volume is $432$ cm³.']),
  n(B(5, 2), 'A farmer has 100 m of fence to enclose a rectangle beside a straight wall, so that only three sides need fencing. Find the largest area.', ['Let the sides at right angles to the wall be $x$, so the other is $100 - 2x$.', '$A = 100x - 2x^2$.', '$A\' = 100 - 4x = 0$ at $x = 25$.', '$A\'\' = -4 < 0$, so it’s a maximum.', 'The area is $1250$ m².']),
  // ---- 3c Integrals
  n(C(1, 1), 'Evaluate $\\int_0^1 x^2\\,dx$.', ['$\\left[\\frac{x^3}{3}\\right]_0^1 = \\frac{1}{3}$.']),
  n(C(1, 1), 'Evaluate $\\int_0^{\\pi/2} \\cos x\\,dx$.', ['$[\\sin x]_0^{\\pi/2} = 1$.']),
  n(C(2, 1), 'Evaluate $\\int_1^2 (2x + 1)\\,dx$.', ['$[x^2 + x]_1^2 = 6 - 2$.', 'This is $4$.']),
  n(C(2, 1), 'Evaluate $\\int_0^{\\pi/4} \\sec^2 x\\,dx$.', ['$[\\tan x]_0^{\\pi/4}$.', 'This is $1$.']),
  n(C(2, 2), 'Evaluate $\\int_{-1}^{1} |x|\\,dx$.', ['The function is even, so this is $2\\int_0^1 x\\,dx$.', 'This is $1$.']),
  n(C(3, 2), 'Evaluate $\\int_1^e \\log x\\,dx$.', ['By parts: $[x\\log x]_1^e - \\int_1^e dx$.', 'That is $e - (e - 1)$.', 'This is $1$.']),
  n(C(3, 2), 'Evaluate $\\int_0^1 xe^x\\,dx$.', ['By parts: $[xe^x]_0^1 - \\int_0^1 e^x\\,dx$.', 'That is $e - (e - 1)$.', 'This is $1$.']),
  n(C(3, 2), 'Evaluate $\\int_0^{\\pi/2} \\sin^2 x\\,dx$.', ['$\\sin^2 x = \\frac{1 - \\cos 2x}{2}$.', '$\\left[\\frac{x}{2} - \\frac{\\sin 2x}{4}\\right]_0^{\\pi/2}$.', 'This is $\\frac{\\pi}{4}$.']),
  n(C(5, 3), 'Evaluate $\\int_0^{\\pi/2} \\frac{\\sin x}{\\sin x + \\cos x}\\,dx$.', ['Let $I$ be the integral.', 'Replacing $x$ by $\\frac{\\pi}{2} - x$: $I = \\int_0^{\\pi/2} \\frac{\\cos x}{\\sin x + \\cos x}\\,dx$.', 'Adding the two: $2I = \\int_0^{\\pi/2} dx$.', 'So $2I = \\frac{\\pi}{2}$.', 'So $I = \\frac{\\pi}{4}$.']),
  n(C(5, 3), 'Evaluate $\\int_0^{\\pi} x\\sin x\\,dx$, by parts.', ['Take $u = x$ and $dv = \\sin x\\,dx$.', 'Then $[-x\\cos x]_0^{\\pi} + \\int_0^{\\pi} \\cos x\\,dx$.', 'The first term is $\\pi$.', 'The second is $[\\sin x]_0^{\\pi} = 0$.', 'So the value is $\\pi$.']),
  // ---- 3d Application of integrals
  n(R(1, 1), 'Find the area under $y = 2x$ from $x = 0$ to $x = 3$.', ['$[x^2]_0^3 = 9$.']),
  n(R(2, 1), 'Find the area under $y = x^2$ from $x = 0$ to $x = 3$.', ['$\\left[\\frac{x^3}{3}\\right]_0^3$.', 'This is $9$.']),
  n(R(2, 1), 'Find the area under one arch of $y = \\sin x$, from $x = 0$ to $x = \\pi$.', ['$[-\\cos x]_0^{\\pi}$.', 'This is $2$.']),
  n(R(2, 2), 'Find the area under $y = 3x + 2$ from $x = 0$ to $x = 2$.', ['$\\left[\\frac{3x^2}{2} + 2x\\right]_0^2$.', 'This is $10$.']),
  n(R(3, 2), 'Find the area between $y = x$ and $y = x^2$.', ['They meet at $x = 0$ and $x = 1$.', 'Area $= \\int_0^1 (x - x^2)\\,dx$.', 'This is $\\frac{1}{6}$.']),
  n(R(3, 2), 'Find the area enclosed by $y^2 = 4x$ and the line $x = 1$.', ['By symmetry, area $= 2\\int_0^1 2\\sqrt{x}\\,dx$.', 'That is $4\\left[\\frac{2}{3}x^{3/2}\\right]_0^1$.', 'This is $\\frac{8}{3}$.']),
  n(R(3, 3), 'Find the area of the region of $x^2 + y^2 = 4$ in the first quadrant, by integration.', ['Area $= \\int_0^2 \\sqrt{4 - x^2}\\,dx$.', '$\\left[\\frac{x}{2}\\sqrt{4 - x^2} + 2\\sin^{-1}\\frac{x}{2}\\right]_0^2$.', 'This is $\\pi$.']),
  n(R(5, 2), 'Sketch the region between $y = x^2$ and $y = 2x$, and find its area.', ['A sketch: the parabola and the line through the origin.', 'They meet where $x^2 = 2x$, at $x = 0$ and $x = 2$.', 'Area $= \\int_0^2 (2x - x^2)\\,dx$.', '$\\left[x^2 - \\frac{x^3}{3}\\right]_0^2 = 4 - \\frac{8}{3}$.', 'This is $\\frac{4}{3}$.']),
  n(R(5, 3), 'Find the area enclosed by the ellipse $\\frac{x^2}{9} + \\frac{y^2}{4} = 1$, by integration.', ['By symmetry, area $= 4\\int_0^3 y\\,dx$.', 'Here $y = \\frac{2}{3}\\sqrt{9 - x^2}$.', 'So the area is $\\frac{8}{3}\\int_0^3 \\sqrt{9 - x^2}\\,dx$.', 'The integral is $\\frac{9\\pi}{4}$.', 'The area is $6\\pi$.']),
  n(R(5, 2), 'Find the area of the triangle with vertices $(0, 0)$, $(4, 0)$ and $(2, 3)$, by integration.', ['The sides are $y = \\frac{3x}{2}$ from 0 to 2, and $y = 6 - \\frac{3x}{2}$ from 2 to 4.', 'The first part: $\\int_0^2 \\frac{3x}{2}\\,dx = 3$.', 'The second part: $\\int_2^4 \\left(6 - \\frac{3x}{2}\\right)dx = 3$.', 'Add the two parts.', 'The area is $6$.']),
  // ---- 3e Differential equations
  n(E(1, 1), 'Find the order of $\\frac{d^2y}{dx^2} + \\left(\\frac{dy}{dx}\\right)^3 = 0$.', ['The highest derivative is the second, so the order is $2$.']),
  n(E(1, 2), 'Find the degree of $\\frac{d^2y}{dx^2} + \\left(\\frac{dy}{dx}\\right)^3 = 0$.', ['The highest derivative appears to the first power, so the degree is $1$.']),
  n(E(2, 1), 'If $\\frac{dy}{dx} = 2x$ and $y = 3$ at $x = 0$, find $y$ at $x = 2$.', ['$y = x^2 + 3$.', 'At $x = 2$, $y = 7$.']),
  n(E(2, 1), 'If $\\frac{dy}{dx} = y$ and $y = 1$ at $x = 0$, find $y$ at $x = 1$.', ['$y = e^x$.', 'At $x = 1$, $y = e$.']),
  n(E(2, 2), 'If $\\frac{dy}{dx} = 3y$ and $y = 2$ at $x = 0$, find $y$ at $x = \\log 2$.', ['$y = 2e^{3x}$.', 'At $x = \\log 2$, $y = 2 \\times 2^3 = 16$.']),
  n(E(3, 2), 'If $\\frac{dy}{dx} = xy$ and $y = 2$ at $x = 0$, find $y$ at $x = \\sqrt{2}$.', ['$\\frac{dy}{y} = x\\,dx$, so $\\log y = \\frac{x^2}{2} + c$.', 'So $y = 2e^{x^2/2}$.', 'At $x = \\sqrt{2}$, $y = 2e$.']),
  n(E(3, 2), 'If $\\frac{dy}{dx} + \\frac{y}{x} = 1$ and $y = 1$ at $x = 1$, find $y$ at $x = 2$.', ['The integrating factor is $x$, so $(xy)\' = x$.', '$xy = \\frac{x^2}{2} + c$, and $c = \\frac{1}{2}$.', 'At $x = 2$: $2y = \\frac{5}{2}$, so $y = \\frac{5}{4}$.']),
  n(E(3, 3), 'A population grows at a rate proportional to its size, and doubles in 10 years. How many times its first size is it after 30 years?', ['$\\frac{dP}{dt} = kP$, so $P = P_0e^{kt}$.', '$e^{10k} = 2$.', 'So $e^{30k} = 2^3 = 8$.']),
  n(E(5, 3), 'Solve $\\frac{dy}{dx} = \\frac{x + y}{x}$, with $y = 0$ at $x = 1$, and find $y$ at $x = e$.', ['Put $y = vx$, so $v + x\\frac{dv}{dx} = 1 + v$.', 'So $dv = \\frac{dx}{x}$.', 'So $v = \\log x + c$, and $y = x(\\log x + c)$.', 'The condition gives $c = 0$.', 'At $x = e$, $y = e$.']),
  n(E(5, 3), 'Solve $\\frac{dy}{dx} + 2y = 4$, with $y = 0$ at $x = 0$. What value does $y$ approach as $x$ grows large?', ['The integrating factor is $e^{2x}$.', '$ye^{2x} = \\int 4e^{2x}\\,dx = 2e^{2x} + c$.', 'The condition gives $c = -2$.', 'So $y = 2 - 2e^{-2x}$.', 'As $x$ grows, $y$ approaches $2$.']),
];

export default questions;
