// Written by hand: complex numbers, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XI');
const Z = at(2, 'a');

const plane = (ox: number, oy: number, w: number, h: number): SketchMark[] => [
  arrow([10, oy], [w - 10, oy]), arrow([ox, h - 10], [ox, 10]), label(w - 14, oy + 16, 'Re', 'end'), label(ox - 6, 18, 'Im', 'end'),
];

const questions: BankDef[] = [
  figure(Z(3, 1), 'On an Argand diagram, plot $z = 3 + 4i$, its conjugate $\\bar{z}$ and $-z$, and find $|z|$.', ['$z$ is the point $(3, 4)$, and $\\bar{z} = 3 - 4i$ is its mirror image in the real axis, $(3, -4)$.', '$-z = -3 - 4i$ is the point $(-3, -4)$, opposite $z$ through the origin.', '$|z| = \\sqrt{3^2 + 4^2} = 5$, its distance from the origin.'], {
    // Origin (160, 120), 20 px to a unit.
    answer: sketch(320, 240, 'An Argand diagram. The point z = 3 + 4i is up and to the right of the origin, joined to it by a line marked 5. Its conjugate, 3 − 4i, is directly below it, and −z, −3 − 4i, is down and to the left.', [
      ...plane(160, 120, 320, 240), line([[160, 120], [220, 40]]), label(184, 74, '5', 'end'),
      { t: 'dot', x: 220, y: 40 }, label(228, 40, 'z = 3 + 4i', 'start'), { t: 'dot', x: 220, y: 200 }, label(228, 204, '3 − 4i', 'start'), { t: 'dot', x: 100, y: 200 }, label(92, 204, '−3 − 4i', 'end'),
    ]),
  }),
  figure(Z(3, 2), 'The Argand diagram shows a complex number $z$. Write $z$ in polar form and in the form $a + ib$.', ['$|z| = 2$ and $\\arg z = 120^\\circ = \\dfrac{2\\pi}{3}$.', '$z = 2\\left(\\cos\\dfrac{2\\pi}{3} + i\\sin\\dfrac{2\\pi}{3}\\right)$.', '$z = 2\\left(-\\dfrac{1}{2} + \\dfrac{\\sqrt{3}}{2}i\\right) = -1 + \\sqrt{3}i$.'], {
    // Origin (160, 140), 50 px to a unit.
    shown: sketch(320, 200, 'An Argand diagram. A line of length 2 runs from the origin up and to the left to the point z, making an angle of 120° with the positive real axis.', [
      ...plane(160, 140, 320, 200), line([[160, 140], [110, 53.4]]), { t: 'dot', x: 110, y: 53.4 }, label(102, 50, 'z', 'end'),
      label(126, 98, '2', 'end'), { t: 'path', d: 'M185 140 A 25 25 0 0 0 147.5 118.3' }, label(186, 118, '120°', 'start'),
    ]),
  }),
  figure(Z(3, 2), 'Mark the three cube roots of unity on an Argand diagram, and write $\\omega$ and $\\omega^2$ in the form $a + ib$.', ['They lie on the circle $|z| = 1$, at angles $0^\\circ$, $120^\\circ$ and $240^\\circ$: the points $1$, $\\omega$ and $\\omega^2$.', '$\\omega = -\\dfrac{1}{2} + \\dfrac{\\sqrt{3}}{2}i$ and $\\omega^2 = -\\dfrac{1}{2} - \\dfrac{\\sqrt{3}}{2}i$.', 'They are the corners of an equilateral triangle inside the circle.'], {
    // Origin (160, 110), radius 70 px.
    answer: sketch(320, 220, 'An Argand diagram with a circle of radius 1 about the origin. Three points on it, 1 on the positive real axis, ω up and to the left at 120°, and ω² down and to the left at 240°, are joined into an equilateral triangle.', [
      ...plane(160, 110, 320, 220), { t: 'circle', x: 160, y: 110, r: 70 },
      line([[230, 110], [125, 49.4], [125, 170.6], [230, 110]], { dash: 1 }),
      { t: 'dot', x: 230, y: 110 }, { t: 'dot', x: 125, y: 49.4 }, { t: 'dot', x: 125, y: 170.6 },
      label(236, 104, '1', 'start'), label(118, 44, 'ω', 'end'), label(118, 186, 'ω²', 'end'),
    ]),
  }),

  predict(Z(2, 1), 'Predict the value of $i^{101}$, and explain.', 'The powers of $i$ repeat every four: $i, -1, -i, 1$.', '$101 = 4 \\times 25 + 1$, so $i^{101} = i$.'),
  predict(Z(2, 2), 'Predict what multiplying a complex number by $i$ does to its point on an Argand diagram.', '$i(a + ib) = -b + ia$, so the point $(a, b)$ moves to $(-b, a)$.', 'It turns through $90^\\circ$ anticlockwise about the origin, keeping its distance from it.'),
  predict(Z(2, 1), 'For a complex number $z$, $z\\bar{z} = 25$. Predict $|z|$.', '$z\\bar{z} = |z|^2$.', 'So $|z|^2 = 25$ and $|z| = 5$.'),

  odd(Z(2, 1), ['$i^4$', '$i^8$', '$i^{12}$', '$i^2$'], '$i^2$', 'It is $-1$; the other three are all 1.'),
  odd(Z(2, 1), ['1', '$\\omega$', '$\\omega^2$', '$-1$'], '$-1$', 'It isn’t a cube root of unity, as $(-1)^3 = -1$; the others are.'),
  odd(Z(2, 2), ['$3 + 4i$', '$4 - 3i$', '$-5$', '$1 + 2i$'], '$1 + 2i$', 'Its modulus is $\\sqrt{5}$; the other three have modulus 5.'),

  long(Z(6, 1), 'Let $z_1 = 2 + 3i$ and $z_2 = 1 - i$.\n(a) Find $z_1 + z_2$ and $z_1 z_2$. [2]\n(b) Find $\\dfrac{z_1}{z_2}$ in the form $a + ib$. [2]\n(c) Check that $|z_1 z_2| = |z_1||z_2|$. [2]', '(a) $z_1 + z_2 = 3 + 2i$.', '(a) $z_1 z_2 = 2 - 2i + 3i - 3i^2 = 5 + i$.', '(b) Multiplying top and bottom by $1 + i$: $\\dfrac{(2 + 3i)(1 + i)}{2}$.', '(b) $= \\dfrac{-1 + 5i}{2} = -\\dfrac{1}{2} + \\dfrac{5}{2}i$.', '(c) $|5 + i| = \\sqrt{26}$.', '(c) $|z_1||z_2| = \\sqrt{13} \\times \\sqrt{2} = \\sqrt{26}$, the same.'),
  long(Z(6, 2), 'Find the square roots of $-8 - 6i$, and check one of them.', 'Let $(x + iy)^2 = -8 - 6i$, so $x^2 - y^2 = -8$ and $2xy = -6$.', 'Also $x^2 + y^2 = |-8 - 6i| = 10$.', 'Adding and subtracting: $x^2 = 1$ and $y^2 = 9$.', 'As $xy = -3$ is negative, $x$ and $y$ have opposite signs.', 'So the roots are $1 - 3i$ and $-1 + 3i$.', 'Check: $(1 - 3i)^2 = 1 - 6i + 9i^2 = -8 - 6i$.'),

  tell(Z(2, 1), 'Distinguish between the modulus and the argument of a complex number.', 'The modulus $|z|$ is the distance of its point from the origin: $|a + ib| = \\sqrt{a^2 + b^2}$.', 'The argument is the angle the line from the origin makes with the positive real axis.'),
  tell(Z(2, 1), 'Distinguish between a complex number and its conjugate on an Argand diagram.', '$z = a + ib$ is the point $(a, b)$.', 'Its conjugate $\\bar{z} = a - ib$ is the point $(a, -b)$, its mirror image in the real axis.'),
  tell(Z(2, 2), 'Distinguish between the Cartesian form and the polar form of a complex number.', 'The Cartesian form, $a + ib$, gives its real and imaginary parts.', 'The polar form, $r(\\cos\\theta + i\\sin\\theta)$, gives its modulus $r$ and argument $\\theta$.'),

  match(Z(4, 1), [['$i^2$', '$-1$'], ['$i^3$', '$-i$'], ['$i^4$', '1'], ['$i^5$', '$i$']]),
  match(Z(4, 2), [['$|3 + 4i|$', '5'], ['$\\arg i$', '$\\dfrac{\\pi}{2}$'], ['$\\overline{2 - 5i}$', '$2 + 5i$'], ['$(1 + i)^2$', '$2i$']]),
  match(Z(4, 2), [['$1 + \\omega + \\omega^2$', '0'], ['$\\omega^3$', '1'], ['$\\omega^4$', '$\\omega$'], ['$\\omega^2$', '$\\bar{\\omega}$']]),

  reason(Z(2, 1), 'Why is $z\\bar{z}$ always a real number that isn’t negative?', '$(a + ib)(a - ib) = a^2 - i^2b^2 = a^2 + b^2$.', 'A sum of squares of real numbers is real and never negative.'),
  reason(Z(2, 2), 'Why do the cube roots of unity all lie on the circle $|z| = 1$?', 'If $z^3 = 1$, then $|z|^3 = |z^3| = 1$.', 'As $|z|$ is a positive real number, $|z| = 1$.'),
  reason(Z(2, 1), 'Why is the argument of a negative real number $\\pi$?', 'A negative real number lies on the negative real axis.', 'That is half a turn from the positive real axis, an angle of $\\pi$.'),

  short(Z(2, 1), 'Write $1 - i$ in polar form.', '$|1 - i| = \\sqrt{2}$, and its point is in the fourth quadrant at $-\\dfrac{\\pi}{4}$.', '$1 - i = \\sqrt{2}\\left(\\cos\\left(-\\dfrac{\\pi}{4}\\right) + i\\sin\\left(-\\dfrac{\\pi}{4}\\right)\\right)$.'),
  short(Z(2, 2), 'Find the real numbers $x$ and $y$ if $(x + iy)(2 - 3i) = 4 + i$.', '$x + iy = \\dfrac{4 + i}{2 - 3i} = \\dfrac{(4 + i)(2 + 3i)}{13} = \\dfrac{5 + 14i}{13}$.', '$x = \\dfrac{5}{13}$ and $y = \\dfrac{14}{13}$.'),

  ar(Z(1, 1), '$(1 + i)^4 = -4$.', '$(1 + i)^2 = 2i$.', 1, 'Squaring again, $(2i)^2 = 4i^2 = -4$.'),
  ar(Z(1, 1), 'The argument of $-2$ is 0.', '$-2$ lies on the negative real axis.', 4, 'On the negative real axis, the argument is $\\pi$.'),
  ar(Z(1, 1), '$\\omega^2$ is a cube root of unity.', '$\\omega$ is a complex number.', 2, 'Both are true, but $\\omega^2$ is a cube root of unity because $(\\omega^2)^3 = (\\omega^3)^2 = 1$.'),

  derive(Z(3, 2), 'Show that the complex cube roots of unity, $\\omega$ and $\\omega^2$, satisfy $1 + \\omega + \\omega^2 = 0$.', ['$z^3 - 1 = (z - 1)(z^2 + z + 1) = 0$.', 1], ['The complex roots $\\omega$ and $\\omega^2$ satisfy $z^2 + z + 1 = 0$, as they aren’t 1.', 1], ['So $\\omega^2 + \\omega + 1 = 0$, that is $1 + \\omega + \\omega^2 = 0$.', 1]),
  derive(Z(3, 3), 'If $\\sqrt{a + ib} = x + iy$, show that $x^2 = \\dfrac{\\sqrt{a^2 + b^2} + a}{2}$ and $y^2 = \\dfrac{\\sqrt{a^2 + b^2} - a}{2}$.', ['Squaring: $x^2 - y^2 + 2ixy = a + ib$, so $x^2 - y^2 = a$ and $2xy = b$.', 1], ['Taking moduli of $(x + iy)^2 = a + ib$: $x^2 + y^2 = \\sqrt{a^2 + b^2}$.', 1], ['Adding and subtracting the two equations in $x^2$ and $y^2$ gives the results.', 1]),
];

export default questions;
