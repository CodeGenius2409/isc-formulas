// Written by hand: circles, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XI');
const C = at(3, 'b');

const axes = (ox: number, oy: number, w: number, h: number): SketchMark[] => [
  arrow([10, oy], [w - 10, oy]), arrow([ox, h - 10], [ox, 10]), label(w - 14, oy + 16, 'x', 'end'), label(ox - 8, 18, 'y', 'end'),
];

const questions: BankDef[] = [
  figure(C(3, 2), 'Sketch the circle $x^2 + y^2 - 4x - 2y - 4 = 0$, marking its centre and radius, and find the lengths of the chords it cuts on the two axes.', ['Completing the squares: $(x - 2)^2 + (y - 1)^2 = 9$, so the centre is $(2, 1)$ and the radius 3.', 'On the $x$-axis, $x^2 - 4x - 4 = 0$ gives $x = 2 \\pm 2\\sqrt{2}$: a chord of length $4\\sqrt{2}$.', 'On the $y$-axis, $y^2 - 2y - 4 = 0$ gives $y = 1 \\pm \\sqrt{5}$: a chord of length $2\\sqrt{5}$.'], {
    // Origin (90, 180), 30 px to a unit: the centre is at (150, 150) and the radius is 90 px.
    answer: sketch(300, 260, 'Axes crossing at the origin. A circle with its centre at (2, 1) and radius 3 crosses the x-axis on both sides of the origin and the y-axis above and below it. A radius from the centre to the right is marked 3.', [
      ...axes(90, 180, 300, 260), { t: 'circle', x: 150, y: 150, r: 90 }, { t: 'dot', x: 150, y: 150 }, label(150, 142, 'C(2, 1)', 'end'),
      line([[150, 150], [240, 150]]), label(196, 144, '3'),
      { t: 'dot', x: 65.2, y: 180 }, { t: 'dot', x: 234.8, y: 180 }, { t: 'dot', x: 90, y: 82.9 }, { t: 'dot', x: 90, y: 217.1 },
    ]),
  }),
  figure(C(3, 2), 'The figure shows two circles, each centred on the $x$-axis, with the points where they cut it marked. Write their equations, say how they are placed, and give the point they share.', ['The first has centre $(0, 0)$ and radius 2: $x^2 + y^2 = 4$. The second has centre $(5, 0)$ and radius 3: $(x - 5)^2 + y^2 = 9$.', 'The distance between the centres is 5, which equals $2 + 3$, the sum of the radii.', 'So they touch externally, at $(2, 0)$.'], {
    // Origin (80, 110), 25 px to a unit.
    shown: sketch(300, 200, 'Two circles on the x-axis. The smaller is centred at the origin and cuts the axis at −2 and 2. The larger is centred at 5 and cuts the axis at 2 and 8. They meet at the point 2 on the axis.', [
      arrow([10, 110], [295, 110]), { t: 'circle', x: 80, y: 110, r: 50 }, { t: 'circle', x: 205, y: 110, r: 75 },
      { t: 'dot', x: 80, y: 110 }, { t: 'dot', x: 205, y: 110 }, label(80, 128, 'O'), label(205, 128, '5'),
      label(26, 104, '−2', 'end'), label(134, 104, '2', 'start'), label(284, 104, '8', 'start'),
    ]),
  }),
  figure(C(3, 2), 'Find the equation of the circle on the diameter joining $A(1, 1)$ and $B(5, 3)$. Sketch it, and use the point $P(1, 3)$ on it to show that $AB$ subtends a right angle there.', ['$(x - 1)(x - 5) + (y - 1)(y - 3) = 0$, that is $x^2 + y^2 - 6x - 4y + 8 = 0$, with centre $(3, 2)$ and radius $\\sqrt{5}$.', '$P(1, 3)$ is on it: $1 + 9 - 6 - 12 + 8 = 0$.', '$PA$ is vertical and $PB$ is horizontal, so the angle $APB$ is a right angle, the angle in a semicircle.'], {
    // Origin (40, 200), 35 px to a unit.
    answer: sketch(300, 230, 'Axes crossing at the origin. A circle has A(1, 1) and B(5, 3) at the ends of a diameter, drawn through its centre (3, 2). The point P(1, 3) on the circle is joined to A by a vertical line and to B by a horizontal line, and the right angle at P is marked.', [
      ...axes(40, 200, 300, 230), { t: 'circle', x: 145, y: 130, r: 78.3 },
      line([[75, 165], [215, 95]]), { t: 'dot', x: 75, y: 165 }, { t: 'dot', x: 215, y: 95 }, { t: 'dot', x: 145, y: 130 }, { t: 'dot', x: 75, y: 95 },
      line([[75, 95], [75, 165]], { dash: 1 }), line([[75, 95], [215, 95]], { dash: 1 }), line([[75, 105], [85, 105], [85, 95]]),
      label(84, 176, 'A(1, 1)', 'start'), label(222, 92, 'B(5, 3)', 'start'), label(90, 114, 'P(1, 3)', 'start'), label(152, 146, '(3, 2)', 'start'),
    ]),
  }),

  predict(C(2, 1), 'Predict whether the point $(3, 4)$ lies inside, on or outside the circle $x^2 + y^2 = 20$.', '$3^2 + 4^2 = 25$, which is more than 20.', 'So the point is farther than $\\sqrt{20}$ from the centre: it lies outside.'),
  predict(C(2, 2), 'For $x^2 + y^2 + 2gx + 2fy + c = 0$, $g^2 + f^2 - c$ is negative. Predict what the equation stands for.', 'Completing the squares gives $(x + g)^2 + (y + f)^2 = g^2 + f^2 - c$, a negative number.', 'A sum of squares can’t be negative, so no real point satisfies it: there is no real circle.'),
  predict(C(2, 3), 'Predict how the circle $x^2 + y^2 - 6x + 4y + 9 = 0$ is placed with respect to the two axes.', 'Its centre is $(3, -2)$ and its radius $\\sqrt{9 + 4 - 9} = 2$.', 'The centre is 2 from the $x$-axis, equal to the radius, so the circle touches the $x$-axis; it is 3 from the $y$-axis, more than the radius, so it doesn’t meet the $y$-axis.'),

  odd(C(2, 1), ['$x^2 + y^2 = 9$', '$x^2 + y^2 - 9 = 0$', '$(x - 0)^2 + (y - 0)^2 = 3^2$', '$x^2 + y^2 = 3$'], '$x^2 + y^2 = 3$', 'Its radius is $\\sqrt{3}$; the other three are the same circle, of radius 3.'),
  odd(C(2, 1), ['$x^2 + y^2 + 4x = 0$', '$x^2 + y^2 - 6y = 0$', '$x^2 + y^2 + 2x - 2y = 0$', '$x^2 + y^2 - 4x + 3 = 0$'], '$x^2 + y^2 - 4x + 3 = 0$', 'It doesn’t pass through the origin, as its constant term isn’t zero; the others do.'),
  odd(C(2, 2), ['$x = 2 + 3\\cos\\theta$, $y = 1 + 3\\sin\\theta$', '$(x - 2)^2 + (y - 1)^2 = 9$', '$x^2 + y^2 - 4x - 2y - 4 = 0$', '$x^2 + y^2 - 4x - 2y + 4 = 0$'], '$x^2 + y^2 - 4x - 2y + 4 = 0$', 'Its radius is 1; the other three describe one circle, of centre $(2, 1)$ and radius 3.'),

  long(C(6, 3), 'Find the equation of the circle whose centre lies on the line $2x - y = 3$ and which passes through $(3, -2)$ and $(-2, 0)$.', 'Let the centre be $(h, 2h - 3)$, as it lies on the line.', 'It is the same distance from both points: $(h - 3)^2 + (2h - 1)^2 = (h + 2)^2 + (2h - 3)^2$.', 'Expanding, $-10h + 10 = -8h + 13$, so $h = -\\dfrac{3}{2}$.', 'The centre is $\\left(-\\dfrac{3}{2}, -6\\right)$, and $r^2 = \\left(\\dfrac{1}{2}\\right)^2 + 6^2 = \\dfrac{145}{4}$.', 'The circle is $x^2 + y^2 + 3x + 12y + 2 = 0$.', 'Check: $(3, -2)$ gives $9 + 4 + 9 - 24 + 2 = 0$, and $(-2, 0)$ gives $4 - 6 + 2 = 0$.'),
  long(C(6, 2), 'Two circles are $x^2 + y^2 = 16$ and $x^2 + y^2 - 8x - 6y + 21 = 0$.\n(a) Find the centre and radius of each. [2]\n(b) Find the distance between their centres. [1]\n(c) How are they placed with respect to each other? [2]\n(d) Find the equation of their common chord. [1]', '(a) The first has centre $(0, 0)$ and radius 4.', '(a) The second has centre $(4, 3)$ and radius $\\sqrt{16 + 9 - 21} = 2$.', '(b) $\\sqrt{4^2 + 3^2} = 5$.', '(c) $|4 - 2| = 2 < 5 < 4 + 2 = 6$.', '(c) So they cut each other at two points.', '(d) Subtracting the equations: $8x + 6y - 37 = 0$.'),

  tell(C(2, 2), 'Distinguish between two circles that touch externally and two that touch internally, by the distance $d$ between their centres.', 'They touch externally when $d = r_1 + r_2$, each lying outside the other.', 'They touch internally when $d = |r_1 - r_2|$, one lying inside the other.'),
  tell(C(2, 1), 'Distinguish between the standard form and the general form of the equation of a circle.', 'The standard form, $(x - h)^2 + (y - k)^2 = r^2$, shows the centre $(h, k)$ and the radius $r$ at once.', 'The general form, $x^2 + y^2 + 2gx + 2fy + c = 0$, needs the squares completed to give the centre $(-g, -f)$ and radius $\\sqrt{g^2 + f^2 - c}$.'),
  tell(C(2, 1), 'Distinguish between the parametric form and the standard form of the circle with centre $(h, k)$ and radius $r$.', 'The parametric form gives each point separately: $x = h + r\\cos\\theta$, $y = k + r\\sin\\theta$.', 'The standard form is one equation in $x$ and $y$: $(x - h)^2 + (y - k)^2 = r^2$.'),

  match(C(4, 1), [['$x^2 + y^2 = 25$', 'centre $(0, 0)$, radius 5'], ['$(x - 1)^2 + (y + 2)^2 = 4$', 'centre $(1, -2)$, radius 2'], ['$x^2 + y^2 - 6x = 0$', 'centre $(3, 0)$, radius 3'], ['$x^2 + y^2 + 4y - 5 = 0$', 'centre $(0, -2)$, radius 3']]),
  match(C(4, 2), [['$d > r_1 + r_2$', 'apart, not meeting'], ['$d = r_1 + r_2$', 'touching externally'], ['$|r_1 - r_2| < d < r_1 + r_2$', 'cutting at two points'], ['$d = |r_1 - r_2|$', 'touching internally']]),
  match(C(4, 1), [['$x = r\\cos\\theta$, $y = r\\sin\\theta$', 'the parametric form'], ['$(x - h)^2 + (y - k)^2 = r^2$', 'the standard form'], ['$(x - x_1)(x - x_2) + (y - y_1)(y - y_2) = 0$', 'the diameter form'], ['$x^2 + y^2 + 2gx + 2fy + c = 0$', 'the general form']]),

  reason(C(2, 1), 'Why does the equation of a circle have equal coefficients of $x^2$ and $y^2$, and no $xy$ term?', 'Every circle can be written $(x - h)^2 + (y - k)^2 = r^2$.', 'Expanding it gives $x^2 + y^2$ with coefficient 1 each, and no product $xy$.'),
  reason(C(2, 2), 'Why does the angle in a semicircle give the diameter form of a circle?', 'A point $P(x, y)$ is on the circle on diameter $AB$ exactly when $PA$ is perpendicular to $PB$.', 'Setting the product of the slopes of $PA$ and $PB$ equal to $-1$ gives $(x - x_1)(x - x_2) + (y - y_1)(y - y_2) = 0$.'),
  reason(C(2, 3), 'Why does the circle $x^2 + y^2 + 2gx + 2fy + c = 0$ touch the $x$-axis when $g^2 = c$?', 'On the $x$-axis, $y = 0$, so $x^2 + 2gx + c = 0$.', 'This has equal roots when $4g^2 - 4c = 0$, so the circle meets the axis at one point only: it touches it.'),

  short(C(2, 1), 'Find the equation of the circle with centre $(-2, 3)$ and radius 4.', '$(x + 2)^2 + (y - 3)^2 = 16$.', 'That is $x^2 + y^2 + 4x - 6y - 3 = 0$.'),
  short(C(2, 1), 'Find the length of the chord that $x^2 + y^2 - 6x + 2y + 5 = 0$ cuts on the $x$-axis.', 'Putting $y = 0$: $x^2 - 6x + 5 = 0$, so $x = 1$ or $x = 5$.', 'The chord has length $5 - 1 = 4$.'),

  ar(C(1, 1), 'The circle $x^2 + y^2 - 4x - 6y + 9 = 0$ touches the $y$-axis.', 'Its centre $(2, 3)$ is 2 from the $y$-axis, which equals its radius.', 1, 'The radius is $\\sqrt{4 + 9 - 9} = 2$, so the circle just reaches the $y$-axis.'),
  ar(C(1, 1), '$x^2 + 2y^2 - 4x + 6y = 0$ is a circle.', 'An equation of the second degree in $x$ and $y$ can stand for a circle.', 4, 'For a circle the coefficients of $x^2$ and $y^2$ must be equal; here they are 1 and 2.'),
  ar(C(1, 1), 'The point $(1, 1)$ lies inside the circle $x^2 + y^2 = 4$.', 'Every circle has a centre.', 2, 'Both are true, but the point is inside because $1 + 1 = 2 < 4$.'),

  derive(C(3, 1), 'Show that $x^2 + y^2 + 2gx + 2fy + c = 0$ is a circle with centre $(-g, -f)$ and radius $\\sqrt{g^2 + f^2 - c}$, when $g^2 + f^2 > c$.', ['Grouping and completing the squares: $(x^2 + 2gx + g^2) + (y^2 + 2fy + f^2) = g^2 + f^2 - c$.', 1], ['So $(x + g)^2 + (y + f)^2 = g^2 + f^2 - c$.', 1], ['This is a circle with centre $(-g, -f)$ and radius $\\sqrt{g^2 + f^2 - c}$.', 1]),
  derive(C(3, 2), 'Derive the equation of the circle on the line joining $A(x_1, y_1)$ and $B(x_2, y_2)$ as diameter.', ['A point $P(x, y)$ is on the circle exactly when angle $APB$ is a right angle, the angle in a semicircle.', 1], ['So the slopes multiply to $-1$: $\\dfrac{y - y_1}{x - x_1} \\times \\dfrac{y - y_2}{x - x_2} = -1$.', 1], ['Clearing fractions: $(x - x_1)(x - x_2) + (y - y_1)(y - y_2) = 0$, which also holds at $A$ and $B$ themselves.', 1]),
  derive(C(3, 2), 'Show that the circle $x^2 + y^2 + 2gx + 2fy + c = 0$ cuts a chord of length $2\\sqrt{g^2 - c}$ on the $x$-axis, when $g^2 > c$.', ['On the $x$-axis $y = 0$, so the circle meets it where $x^2 + 2gx + c = 0$.', 1], ['The roots are $x_1, x_2 = -g \\pm \\sqrt{g^2 - c}$.', 1], ['The chord’s length is $|x_1 - x_2| = 2\\sqrt{g^2 - c}$.', 1]),
];

export default questions;
