// Written by hand: three-dimensional geometry, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XI');
const T = at(3, 'd');

// Oblique axes from O = (130, 150): one unit of x is (−14, 10) px and of y is (30, 0) px; each figure sets its own unit of z, upwards.
const axes3 = (): SketchMark[] => [
  arrow([130, 150], [60, 200]), arrow([130, 150], [300, 150]), arrow([130, 150], [130, 14]),
  label(54, 204, 'x', 'end'), label(306, 154, 'y', 'start'), label(138, 20, 'z', 'start'), label(124, 146, 'O', 'end'),
];

const questions: BankDef[] = [
  figure(T(3, 1), 'Draw three axes in space and mark the point $P(2, 3, 4)$, showing how it is reached from the origin. What are its distances from the three coordinate planes?', ['From $O$, go 2 units along the $x$-axis and 3 along the $y$-direction to $(2, 3, 0)$ on the $xy$-plane, then 4 units up to $P$.', 'Its distances from the $yz$-, $zx$- and $xy$-planes are 2, 3 and 4.', 'That is, each coordinate is the distance from one coordinate plane.'], {
    answer: sketch(320, 220, 'Three axes from the origin O: x towards the viewer and down-left, y to the right, z upwards. Dashed lines go 2 units along x, 3 units parallel to y to the point (2, 3, 0), then 4 units up to P(2, 3, 4).', [
      ...axes3(), line([[102, 170], [192, 170]], { dash: 1 }), line([[220, 150], [192, 170]], { dash: 1 }), line([[192, 170], [192, 70]], { dash: 1 }),
      { t: 'dot', x: 192, y: 70 }, label(200, 66, 'P(2, 3, 4)', 'start'), { t: 'dot', x: 192, y: 170 }, label(200, 186, '(2, 3, 0)', 'start'),
    ]),
  }),
  figure(T(3, 2), 'The figure shows a cuboid with one corner at the origin $O$ and edges of 2, 3 and 6 along the $x$-, $y$- and $z$-axes. Give the coordinates of $A$, $C$, $D$ and $P$, and the length of the diagonal $OP$.', ['$A(2, 0, 0)$, $C(0, 3, 0)$ and $D(0, 0, 6)$, on the three axes.', '$P$, the far corner, is $(2, 3, 6)$.', '$OP = \\sqrt{2^2 + 3^2 + 6^2} = \\sqrt{49} = 7$.'], {
    shown: sketch(320, 220, 'A cuboid with corner O at the origin. Its edge OA, of length 2, is along the x-axis; OC, of length 3, along the y-axis; and OD, of length 6, along the z-axis. P is the corner opposite O.', [
      ...axes3(),
      line([[130, 150], [102, 170], [192, 170], [220, 150], [130, 150]]), line([[130, 42], [102, 62], [192, 62], [220, 42], [130, 42]]),
      line([[102, 170], [102, 62]]), line([[192, 170], [192, 62]]), line([[220, 150], [220, 42]]), line([[130, 150], [130, 42]]),
      label(108, 186, 'A', 'start'), label(226, 146, 'C', 'start'), label(124, 40, 'D', 'end'), label(186, 78, 'P', 'end'),
      label(110, 150, '2', 'end'), label(175, 145, '3'), label(124, 100, '6', 'end'),
    ]),
  }),
  figure(T(2, 1), 'Make a table showing the sign of $x$, $y$ and $z$ in each of the eight octants.', ['The coordinate planes split space into eight octants, one for each choice of sign of $x$, $y$ and $z$.', 'I $(+, +, +)$, II $(-, +, +)$, III $(-, -, +)$, IV $(+, -, +)$, V $(+, +, -)$, VI $(-, +, -)$, VII $(-, -, -)$, VIII $(+, -, -)$.'], {
    answer: table(['Octant', 'x', 'y', 'z'], [['I', '+', '+', '+'], ['II', '−', '+', '+'], ['III', '−', '−', '+'], ['IV', '+', '−', '+'], ['V', '+', '+', '−'], ['VI', '−', '+', '−'], ['VII', '−', '−', '−'], ['VIII', '+', '−', '−']]),
  }),

  predict(T(2, 1), 'A point lies in the $yz$-plane. Predict which of its coordinates is zero, and why.', 'Its $x$-coordinate is zero.', 'The $x$-coordinate is the distance from the $yz$-plane, and the point lies on it.'),
  predict(T(2, 1), 'Predict the octant in which the point $(-2, 3, -5)$ lies.', 'Its signs are $(-, +, -)$.', 'So it lies in octant VI.'),
  predict(T(2, 1), 'Predict the distance of $(3, 4, 12)$ from the $xy$-plane, and from the origin.', 'Its distance from the $xy$-plane is $|z| = 12$.', 'From the origin it is $\\sqrt{9 + 16 + 144} = 13$.'),

  odd(T(2, 1), ['$(0, 0, 5)$', '$(0, 0, -2)$', '$(0, 3, 0)$', '$(0, 0, 1)$'], '$(0, 3, 0)$', 'It lies on the $y$-axis; the others lie on the $z$-axis.'),
  odd(T(2, 1), ['$(1, 2, 0)$', '$(-3, 4, 0)$', '$(5, 0, 0)$', '$(2, 0, 3)$'], '$(2, 0, 3)$', 'It isn’t on the $xy$-plane, as $z \\neq 0$; the others are.'),
  odd(T(2, 2), ['$(1, 2, 2)$', '$(2, 1, 2)$', '$(0, 0, 3)$', '$(1, 1, 1)$'], '$(1, 1, 1)$', 'It is $\\sqrt{3}$ from the origin; the others are all 3 from it.'),

  long(T(6, 2), 'The points are $A(2, 3, 4)$, $B(-1, 2, 1)$ and $C(5, 4, 7)$.\n(a) Find $AB$, $AC$ and $BC$. [3]\n(b) Show that the three points are collinear. [2]\n(c) Which point lies between the other two? [1]', '(a) $AB = \\sqrt{9 + 1 + 9} = \\sqrt{19}$.', '(a) $AC = \\sqrt{9 + 1 + 9} = \\sqrt{19}$.', '(a) $BC = \\sqrt{36 + 4 + 36} = \\sqrt{76} = 2\\sqrt{19}$.', '(b) $AB + AC = 2\\sqrt{19} = BC$.', '(b) The two shorter distances add up to the longest, so the points lie on one line.', '(c) $A$, which is in fact the midpoint of $BC$.'),
  long(T(6, 3), 'The points are $P(2, -3, 4)$ and $Q(8, 0, 10)$.\n(a) Find the point that divides $PQ$ internally in the ratio $1 : 2$. [2]\n(b) Find the ratio in which the $xy$-plane divides $PQ$. [2]\n(c) Find the length of $PQ$. [2]', '(a) $\\left(\\dfrac{1 \\times 8 + 2 \\times 2}{3}, \\dfrac{1 \\times 0 + 2 \\times (-3)}{3}, \\dfrac{1 \\times 10 + 2 \\times 4}{3}\\right)$.', '(a) $= (4, -2, 6)$.', '(b) On the $xy$-plane $z = 0$: $\\dfrac{10k + 4}{k + 1} = 0$ for the ratio $k : 1$.', '(b) $k = -\\dfrac{2}{5}$, so it divides $PQ$ externally in the ratio $2 : 5$.', '(c) $PQ = \\sqrt{36 + 9 + 36}$.', '(c) $= \\sqrt{81} = 9$.'),
  long(T(6, 2), 'The points are $A(0, 7, -10)$, $B(1, 6, -6)$ and $C(4, 9, -6)$.\n(a) Find $AB$, $BC$ and $CA$. [3]\n(b) Show that the triangle $ABC$ is isosceles. [1]\n(c) Show that it is right-angled. [1]\n(d) Find its area. [1]', '(a) $AB = \\sqrt{1 + 1 + 16} = \\sqrt{18}$.', '(a) $BC = \\sqrt{9 + 9 + 0} = \\sqrt{18}$.', '(a) $CA = \\sqrt{16 + 4 + 16} = 6$.', '(b) $AB = BC$, so it is isosceles.', '(c) $AB^2 + BC^2 = 18 + 18 = 36 = CA^2$, so the angle at $B$ is a right angle.', '(d) Area $= \\dfrac{1}{2} \\times \\sqrt{18} \\times \\sqrt{18} = 9$ square units.'),

  tell(T(2, 1), 'Distinguish between a coordinate axis and a coordinate plane in space.', 'A coordinate axis is a line, such as the $x$-axis, on which two coordinates are zero: $(a, 0, 0)$.', 'A coordinate plane is a plane holding two axes, such as the $xy$-plane, on which one coordinate is zero: $(a, b, 0)$.'),
  tell(T(2, 2), 'Distinguish between internal and external division of the line joining two points.', 'Dividing internally in the ratio $m : n$ gives a point between them: $\\left(\\dfrac{mx_2 + nx_1}{m + n}, \\dots\\right)$.', 'Dividing externally gives a point on the line beyond them: $\\left(\\dfrac{mx_2 - nx_1}{m - n}, \\dots\\right)$.'),
  tell(T(2, 2), 'Distinguish between the distance of $(x, y, z)$ from the origin and from the $z$-axis.', 'From the origin it is $\\sqrt{x^2 + y^2 + z^2}$.', 'From the $z$-axis it is $\\sqrt{x^2 + y^2}$, as the nearest point of the axis is $(0, 0, z)$.'),

  match(T(4, 1), [['A point on the $x$-axis', '$(a, 0, 0)$'], ['A point on the $yz$-plane', '$(0, b, c)$'], ['The origin', '$(0, 0, 0)$'], ['A point on the $zx$-plane', '$(a, 0, c)$']]),
  match(T(4, 2), [['The distance of $(2, 3, 6)$ from the origin', '7'], ['The distance of $(2, 3, 6)$ from the $xy$-plane', '6'], ['The distance of $(2, 3, 6)$ from the $z$-axis', '$\\sqrt{13}$'], ['The distance of $(2, 3, 6)$ from the $yz$-plane', '2']]),
  match(T(4, 2), [['The midpoint of $(2, 4, 6)$ and $(4, 6, 8)$', '$(3, 5, 7)$'], ['The centroid of $(0, 0, 0)$, $(3, 0, 0)$ and $(0, 6, 0)$', '$(1, 2, 0)$'], ['The point dividing $(0, 0, 0)$ to $(3, 6, 9)$ in the ratio $1 : 2$', '$(1, 2, 3)$'], ['The point dividing $(0, 0, 0)$ to $(3, 6, 9)$ in the ratio $2 : 1$', '$(2, 4, 6)$']]),

  reason(T(2, 1), 'Why does a point in space need three coordinates?', 'Space has three independent directions: along, across and up.', 'So a point needs one coordinate for its distance in each, from each of the three coordinate planes.'),
  reason(T(2, 1), 'Why do the three coordinate planes divide space into eight octants?', 'Each of $x$, $y$ and $z$ can be positive or negative.', 'That gives $2 \\times 2 \\times 2 = 8$ combinations of signs, one octant for each.'),
  reason(T(2, 1), 'Why can a coordinate of a point in space be negative?', 'A coordinate gives a distance from a coordinate plane, with a sign for the side of the plane.', 'A point on the other side of the plane from the positive axis has a negative coordinate.'),

  short(T(2, 1), 'Find the midpoint and the length of the segment joining $(1, -2, 3)$ and $(3, 4, -1)$.', 'Midpoint $= (2, 1, 1)$.', 'Length $= \\sqrt{4 + 36 + 16} = \\sqrt{56} = 2\\sqrt{14}$.'),
  short(T(2, 2), 'Find $k$ if the distance between $(2, k, 1)$ and $(-1, 3, 5)$ is 5.', '$9 + (k - 3)^2 + 16 = 25$, so $(k - 3)^2 = 0$.', '$k = 3$.'),

  ar(T(1, 1), '$(0, 0, -4)$ lies on the $z$-axis.', 'Every point on the $z$-axis has $x = 0$ and $y = 0$.', 1, 'Its $x$ and $y$ are both 0.'),
  ar(T(1, 1), 'The point $(2, -3, 4)$ lies in the first octant.', 'In the first octant all three coordinates are positive.', 4, 'Its $y$-coordinate is negative, so it lies in octant IV.'),
  ar(T(1, 1), 'The distance between $(1, 1, 1)$ and $(2, 2, 2)$ is $\\sqrt{3}$.', 'The origin is the point $(0, 0, 0)$.', 2, 'Both are true, but the distance comes from $\\sqrt{1 + 1 + 1}$.'),

  derive(T(3, 1), 'Show that the distance between $P(x_1, y_1, z_1)$ and $Q(x_2, y_2, z_2)$ is $\\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}$.', ['Take $R(x_2, y_2, z_1)$, level with $P$. In the horizontal plane, $PR^2 = (x_2 - x_1)^2 + (y_2 - y_1)^2$, by Pythagoras.', 1], ['$QR$ is vertical, of length $|z_2 - z_1|$, and at right angles to $PR$.', 1], ['So $PQ^2 = PR^2 + QR^2$, which gives the formula.', 1]),
  derive(T(3, 2), 'Show that the point dividing the join of $A(x_1, y_1, z_1)$ and $B(x_2, y_2, z_2)$ internally in the ratio $m : n$ is $\\left(\\dfrac{mx_2 + nx_1}{m + n}, \\dfrac{my_2 + ny_1}{m + n}, \\dfrac{mz_2 + nz_1}{m + n}\\right)$.', ['Let the point be $P(x, y, z)$, with $\\dfrac{AP}{PB} = \\dfrac{m}{n}$.', 1], ['Projecting onto the $x$-axis keeps the ratio: $\\dfrac{x - x_1}{x_2 - x} = \\dfrac{m}{n}$, so $x = \\dfrac{mx_2 + nx_1}{m + n}$.', 1], ['In the same way for $y$ and $z$, which gives the formula.', 1]),
  derive(T(3, 2), 'Show that the centroid of the triangle with vertices $A(x_1, y_1, z_1)$, $B(x_2, y_2, z_2)$ and $C(x_3, y_3, z_3)$ is $\\left(\\dfrac{x_1 + x_2 + x_3}{3}, \\dfrac{y_1 + y_2 + y_3}{3}, \\dfrac{z_1 + z_2 + z_3}{3}\\right)$.', ['The midpoint $D$ of $BC$ is $\\left(\\dfrac{x_2 + x_3}{2}, \\dfrac{y_2 + y_3}{2}, \\dfrac{z_2 + z_3}{2}\\right)$.', 1], ['The centroid divides the median $AD$ in the ratio $2 : 1$.', 1], ['Its $x$-coordinate is $\\dfrac{2 \\times \\frac{x_2 + x_3}{2} + x_1}{3} = \\dfrac{x_1 + x_2 + x_3}{3}$, and the same for $y$ and $z$.', 1]),
];

export default questions;
