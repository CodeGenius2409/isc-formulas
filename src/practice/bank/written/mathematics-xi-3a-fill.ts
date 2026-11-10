// Written by hand: straight lines, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XI');
const L = at(3, 'a');

/** Axes with the origin at (ox, oy), u px to a unit. */
const axes = (ox: number, oy: number, w: number, h: number): SketchMark[] => [
  arrow([10, oy], [w - 10, oy]), arrow([ox, h - 10], [ox, 10]), label(w - 14, oy + 16, 'x', 'end'), label(ox - 8, 18, 'y', 'end'), label(ox - 6, oy + 16, 'O', 'end'),
];

const questions: BankDef[] = [
  figure(L(3, 1), 'Draw the line $2x + 3y = 6$, marking where it cuts the axes, and find the area of the triangle it makes with the axes.', ['Putting $y = 0$ gives $x = 3$, and putting $x = 0$ gives $y = 2$: it cuts the axes at $(3, 0)$ and $(0, 2)$.', 'The line joins these two points.', 'The triangle has legs 3 and 2, so its area is $\\dfrac{1}{2} \\times 3 \\times 2 = 3$ square units.'], {
    // Origin (60, 160), 40 px to a unit.
    answer: sketch(300, 200, 'Axes crossing at the origin. A straight line falls from the point (0, 2) on the y-axis to (3, 0) on the x-axis, and runs a little beyond each.', [
      ...axes(60, 160, 300, 200),
      line([[20, 53.3], [220, 186.7]]), { t: 'dot', x: 180, y: 160 }, { t: 'dot', x: 60, y: 80 },
      label(184, 152, '(3, 0)', 'start'), label(66, 74, '(0, 2)', 'start'), label(150, 70, '2x + 3y = 6', 'start'),
    ]),
  }),
  figure(L(3, 2), 'The figure shows two lines, $L_1$ and $L_2$. Write their equations, find where they meet, and show that they are perpendicular.', ['$L_1$ passes through $(0, 4)$ and $(4, 0)$: $x + y = 4$. $L_2$ passes through the origin and $(4, 4)$: $y = x$.', 'Solving, $2x = 4$, so they meet at $(2, 2)$.', 'Their slopes are $-1$ and $1$, whose product is $-1$, so they are perpendicular.'], {
    // Origin (50, 190), 35 px to a unit.
    shown: sketch(260, 220, 'Axes crossing at the origin. Line L1 runs from (0, 4) on the y-axis down to (4, 0) on the x-axis. Line L2 runs from the origin up through (4, 4). They cross at a point between.', [
      ...axes(50, 190, 260, 220), line([[50, 50], [190, 190]]), line([[50, 190], [190, 50]]),
      { t: 'dot', x: 50, y: 50 }, { t: 'dot', x: 190, y: 190 }, { t: 'dot', x: 190, y: 50 },
      label(58, 46, '(0, 4)', 'start'), label(194, 206, '(4, 0)', 'start'), label(196, 50, '(4, 4)', 'start'),
      label(150, 140, 'L₁', 'start'), label(166, 98, 'L₂', 'start'),
    ]),
  }),
  figure(L(3, 3), 'Draw the line $x\\cos 60^\\circ + y\\sin 60^\\circ = 2$, marking the perpendicular from the origin to it, its length, and the angle it makes with the $x$-axis. Find where the line cuts the axes.', ['The perpendicular from the origin has length 2 and makes $60^\\circ$ with the $x$-axis; the line is at right angles to it at its foot, $(1, \\sqrt{3})$.', 'Putting $y = 0$: $\\dfrac{x}{2} = 2$, so it cuts the $x$-axis at $(4, 0)$.', 'Putting $x = 0$: $\\dfrac{\\sqrt{3}}{2}y = 2$, so it cuts the $y$-axis at $\\left(0, \\dfrac{4}{\\sqrt{3}}\\right)$.'], {
    // Origin (40, 200), 40 px to a unit: the foot (1, √3) is at (80, 130.7), and the intercepts at (200, 200) and (40, 107.6).
    answer: sketch(300, 230, 'Axes crossing at the origin. A line cuts the x-axis at 4 and the y-axis at about 2.3. A dashed segment from the origin meets the line at right angles at the point (1, √3); it is marked p = 2, and the angle it makes with the x-axis is marked 60°.', [
      ...axes(40, 200, 300, 230), line([[22, 97.2], [230, 217.3]]),
      line([[40, 200], [80, 130.7]], { dash: 1 }), { t: 'dot', x: 80, y: 130.7 },
      label(74, 172, 'p = 2', 'start'), label(64, 192, '60°', 'start'),
      label(204, 192, '4', 'start'), label(46, 102, '4/√3', 'start'), label(86, 126, '(1, √3)', 'start'),
    ]),
  }),

  predict(L(2, 1), 'In $y = 3x + c$, the value of $c$ is changed. Predict what changes in the line and what stays the same.', 'The slope, 3, stays the same, so every such line is parallel to the others.', 'The $y$-intercept, $c$, changes, so the line moves up or down.'),
  predict(L(2, 2), 'The origin is shifted to $(2, -3)$, keeping the axes parallel. Predict the new coordinates of $P(5, 1)$, and the new equation of the line $x + y = 4$.', 'With $x = X + 2$ and $y = Y - 3$, $P$ becomes $(3, 4)$.', '$x + y = 4$ becomes $X + 2 + Y - 3 = 4$, that is $X + Y = 5$.'),
  predict(L(2, 2), 'Predict the point through which every line of the family $(2x + y - 4) + \\lambda(x - y + 1) = 0$ passes, whatever $\\lambda$ is.', 'It is the point where $2x + y = 4$ and $x - y = -1$ meet.', 'Adding them, $3x = 3$, so $x = 1$ and $y = 2$: the point $(1, 2)$.'),

  odd(L(2, 1), ['$2x + 4y = 7$', '$x + 2y = 3$', '$3x + 6y + 1 = 0$', '$2x - y = 5$'], '$2x - y = 5$', 'Its slope is 2; the other three have slope $-\\dfrac{1}{2}$ and are parallel.'),
  odd(L(2, 1), ['$x = 3$', '$y = 3$', '$x + 0y = 5$', '$x = -2$'], '$y = 3$', 'It is a horizontal line; the others are vertical.'),
  odd(L(2, 1), ['$y = mx + c$', '$\\dfrac{x}{a} + \\dfrac{y}{b} = 1$', '$x\\cos\\alpha + y\\sin\\alpha = p$', '$x^2 + y^2 = r^2$'], '$x^2 + y^2 = r^2$', 'It is a circle; the others are forms of the equation of a straight line.'),

  long(L(6, 2), 'A triangle has vertices $A(1, 2)$, $B(4, 6)$ and $C(7, 2)$.\n(a) Find the lengths of $AB$ and $BC$, and say what kind of triangle it is. [2]\n(b) Find the equation of $AB$. [1]\n(c) Find the length of the altitude from $C$ to $AB$. [2]\n(d) Find the area of the triangle. [1]', '(a) $AB = \\sqrt{3^2 + 4^2} = 5$ and $BC = \\sqrt{3^2 + 4^2} = 5$.', '(a) Two sides are equal, so it is isosceles.', '(b) The slope of $AB$ is $\\dfrac{4}{3}$, so $y - 2 = \\dfrac{4}{3}(x - 1)$, that is $4x - 3y + 2 = 0$.', '(c) The distance of $C(7, 2)$ from $AB$ is $\\dfrac{|28 - 6 + 2|}{\\sqrt{16 + 9}}$.', '(c) $= \\dfrac{24}{5}$.', '(d) Area $= \\dfrac{1}{2} \\times 5 \\times \\dfrac{24}{5} = 12$ square units.'),
  long(L(6, 3), 'Answer each part.\n(a) Find the acute angle between $y = 2x + 1$ and $y = -3x + 4$. [2]\n(b) Find the equations of the lines through $(2, 1)$ that make an angle of $45^\\circ$ with the line $x - 2y = 3$. [4]', '(a) $\\tan\\theta = \\left|\\dfrac{2 - (-3)}{1 + 2(-3)}\\right| = \\left|\\dfrac{5}{-5}\\right| = 1$.', '(a) So $\\theta = 45^\\circ$.', '(b) The given line has slope $\\dfrac{1}{2}$, so a line of slope $m$ needs $\\left|\\dfrac{m - \\frac{1}{2}}{1 + \\frac{m}{2}}\\right| = 1$.', '(b) This gives $m = 3$ or $m = -\\dfrac{1}{3}$.', '(b) With $m = 3$: $y - 1 = 3(x - 2)$, that is $3x - y - 5 = 0$.', '(b) With $m = -\\dfrac{1}{3}$: $3(y - 1) = -(x - 2)$, that is $x + 3y - 5 = 0$.'),
  long(L(6, 2), 'For the line $3x - 4y + 12 = 0$:\n(a) find its slope and its intercepts on the axes. [2]\n(b) Write it in intercept form. [1]\n(c) Write it in normal form. [2]\n(d) Find its distance from the origin. [1]', '(a) $y = \\dfrac{3}{4}x + 3$, so the slope is $\\dfrac{3}{4}$.', '(a) It cuts the $x$-axis at $-4$ and the $y$-axis at 3.', '(b) $\\dfrac{x}{-4} + \\dfrac{y}{3} = 1$.', '(c) Writing it as $-3x + 4y = 12$, so the right side is positive, and dividing by $\\sqrt{9 + 16} = 5$:', '(c) $-\\dfrac{3}{5}x + \\dfrac{4}{5}y = \\dfrac{12}{5}$, with $\\cos\\alpha = -\\dfrac{3}{5}$ and $\\sin\\alpha = \\dfrac{4}{5}$.', '(d) $p = \\dfrac{12}{5}$.'),

  tell(L(2, 1), 'Distinguish between the slope-intercept form and the intercept form of a line.', 'The slope-intercept form, $y = mx + c$, gives the slope $m$ and the $y$-intercept $c$.', 'The intercept form, $\\dfrac{x}{a} + \\dfrac{y}{b} = 1$, gives the intercepts $a$ and $b$ on both axes.'),
  tell(L(2, 1), 'Distinguish between parallel and perpendicular lines, by their slopes.', 'Parallel lines have equal slopes, $m_1 = m_2$.', 'Perpendicular lines have slopes whose product is $-1$, $m_1 m_2 = -1$.'),
  tell(L(2, 2), 'Distinguish between the normal form and the general form of the equation of a line.', 'The normal form, $x\\cos\\alpha + y\\sin\\alpha = p$, gives the length $p$ of the perpendicular from the origin and the angle $\\alpha$ it makes with the $x$-axis.', 'The general form, $ax + by + c = 0$, covers every line, but shows none of these directly.'),

  match(L(4, 1), [['$y - y_1 = m(x - x_1)$', 'the point-slope form'], ['$y = mx + c$', 'the slope-intercept form'], ['$\\dfrac{x}{a} + \\dfrac{y}{b} = 1$', 'the intercept form'], ['$x\\cos\\alpha + y\\sin\\alpha = p$', 'the normal form']]),
  match(L(4, 1), [['$2x + 3y = 6$', 'slope $-\\dfrac{2}{3}$'], ['$y = 5$', 'slope 0'], ['$x - y = 1$', 'slope 1'], ['$x = 4$', 'no defined slope']]),
  match(L(4, 2), [['The distance of $(0, 0)$ from $3x + 4y = 10$', '2'], ['The distance of $(1, 1)$ from $3x + 4y = 2$', '1'], ['The distance between $3x + 4y = 5$ and $3x + 4y = 20$', '3'], ['The distance of $(0, 0)$ from $x = 4$', '4']]),

  reason(L(2, 1), 'Why do parallel lines have equal slopes?', 'Parallel lines make the same angle $\\theta$ with the $x$-axis.', 'The slope is $\\tan\\theta$, so it is the same for both.'),
  reason(L(2, 2), 'Why does $ax + by + c = 0$ always stand for a straight line, if $a$ and $b$ aren’t both zero?', 'If $b \\neq 0$ it can be written $y = -\\dfrac{a}{b}x - \\dfrac{c}{b}$, a line of slope $-\\dfrac{a}{b}$.', 'If $b = 0$ then $a \\neq 0$, and it is $x = -\\dfrac{c}{a}$, a vertical line.'),
  reason(L(2, 2), 'Why does every line $L_1 + \\lambda L_2 = 0$ pass through the point where $L_1 = 0$ and $L_2 = 0$ meet?', 'At that point, both $L_1$ and $L_2$ are zero.', 'So $L_1 + \\lambda L_2 = 0$ holds there for every value of $\\lambda$.'),

  short(L(2, 1), 'Find the equation of the line through $(2, -1)$ and $(5, 3)$.', 'The slope is $\\dfrac{3 - (-1)}{5 - 2} = \\dfrac{4}{3}$.', '$y + 1 = \\dfrac{4}{3}(x - 2)$, that is $4x - 3y - 11 = 0$.'),
  short(L(2, 1), 'Find the angle that the line $\\sqrt{3}x - y + 1 = 0$ makes with the $x$-axis.', 'It is $y = \\sqrt{3}x + 1$, with slope $\\sqrt{3}$.', '$\\tan\\theta = \\sqrt{3}$, so $\\theta = 60^\\circ$.'),

  ar(L(1, 1), 'The lines $2x + 3y = 5$ and $3x - 2y = 7$ are perpendicular.', 'The product of their slopes is $-1$.', 1, 'The slopes are $-\\dfrac{2}{3}$ and $\\dfrac{3}{2}$, whose product is $-1$.'),
  ar(L(1, 1), 'The line $\\dfrac{x}{3} + \\dfrac{y}{4} = 1$ cuts the $y$-axis at $(0, 3)$.', 'In $\\dfrac{x}{a} + \\dfrac{y}{b} = 1$, $a$ is the $x$-intercept and $b$ the $y$-intercept.', 4, 'Here $b = 4$, so the line cuts the $y$-axis at $(0, 4)$.'),
  ar(L(1, 2), 'The distance between $6x + 8y = 5$ and $6x + 8y = 25$ is 2.', 'The origin lies on neither line.', 2, 'Both are true, but the distance comes from $\\dfrac{|25 - 5|}{\\sqrt{36 + 64}} = 2$.'),

  derive(L(3, 2), 'Lines of slopes $m_1$ and $m_2$ make angles $\\theta_1$ and $\\theta_2$ with the $x$-axis. Show that the acute angle $\\theta$ between them satisfies $\\tan\\theta = \\left|\\dfrac{m_1 - m_2}{1 + m_1 m_2}\\right|$.', ['The angle between the lines is $\\theta_1 - \\theta_2$, or its supplement.', 1], ['$\\tan(\\theta_1 - \\theta_2) = \\dfrac{\\tan\\theta_1 - \\tan\\theta_2}{1 + \\tan\\theta_1\\tan\\theta_2} = \\dfrac{m_1 - m_2}{1 + m_1 m_2}$.', 1], ['The acute angle has a positive tangent, so $\\tan\\theta = \\left|\\dfrac{m_1 - m_2}{1 + m_1 m_2}\\right|$.', 1]),
  derive(L(3, 3), 'The perpendicular from the origin to a line has length $p$ and makes an angle $\\alpha$ with the $x$-axis. Derive the normal form $x\\cos\\alpha + y\\sin\\alpha = p$.', ['The foot of the perpendicular is $N(p\\cos\\alpha, p\\sin\\alpha)$, and $ON$ has slope $\\tan\\alpha$.', 1], ['The line passes through $N$ at right angles to $ON$, so its slope is $-\\cot\\alpha$: $y - p\\sin\\alpha = -\\dfrac{\\cos\\alpha}{\\sin\\alpha}(x - p\\cos\\alpha)$.', 1], ['Multiplying by $\\sin\\alpha$: $y\\sin\\alpha - p\\sin^2\\alpha = -x\\cos\\alpha + p\\cos^2\\alpha$, so $x\\cos\\alpha + y\\sin\\alpha = p$.', 1]),
];

export default questions;
