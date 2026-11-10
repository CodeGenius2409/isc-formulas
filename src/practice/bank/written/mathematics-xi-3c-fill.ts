// Written by hand: conic sections, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XI');
const K = at(3, 'c');

// Each sketch has its origin at (160, cy), with u px to a unit.
const path = (pts: [number, number][]) => `M${pts.map(([x, y]) => `${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`).join(' L')}`;

// y² = 8x, 20 px to a unit, origin (110, 110): t runs over y from −5 to 5.
const parabola = path(Array.from({ length: 41 }, (_, i) => {
  const y = -5 + i * 0.25;
  return [110 + 20 * ((y * y) / 8), 110 - 20 * y] as [number, number];
}));

// x²/4 − y²/5 = 1, 30 px to a unit, origin (160, 140): x = 2 cosh t, y = √5 sinh t.
const branch = (side: 1 | -1) => path(Array.from({ length: 29 }, (_, i) => {
  const t = -1.4 + i * 0.1;
  return [160 + side * 30 * 2 * Math.cosh(t), 140 - 30 * Math.sqrt(5) * Math.sinh(t)] as [number, number];
}));
const slope = Math.sqrt(5) / 2;

const questions: BankDef[] = [
  figure(K(3, 1), 'Sketch the parabola $y^2 = 8x$, marking its vertex, focus, directrix and latus rectum.', ['$4a = 8$, so $a = 2$: the vertex is $(0, 0)$ and the focus $(2, 0)$.', 'The directrix is the line $x = -2$.', 'The latus rectum is the chord through the focus from $(2, 4)$ to $(2, -4)$, of length 8.'], {
    answer: sketch(320, 220, 'Axes crossing at the origin, which is the vertex. A parabola opens to the right from the origin. The focus is marked at (2, 0). A dashed vertical line at x = −2 is the directrix. A vertical chord through the focus, from (2, 4) to (2, −4), is the latus rectum.', [
      arrow([20, 110], [310, 110]), arrow([110, 210], [110, 10]), label(306, 126, 'x', 'end'), label(100, 16, 'y', 'end'),
      { t: 'path', d: parabola },
      line([[70, 15], [70, 205]], { dash: 1 }), label(64, 26, 'x = −2', 'end'),
      { t: 'dot', x: 150, y: 110 }, label(156, 126, 'S(2, 0)', 'start'),
      line([[150, 30], [150, 190]]), label(156, 48, '(2, 4)', 'start'), label(156, 180, '(2, −4)', 'start'),
      label(104, 126, 'O', 'end'),
    ]),
  }),
  figure(K(3, 2), 'The figure shows an ellipse with its centre at the origin, cutting the axes where marked. Write its equation, and find its eccentricity and foci.', ['$a = 4$ and $b = 2$, so $\\dfrac{x^2}{16} + \\dfrac{y^2}{4} = 1$.', '$c^2 = a^2 - b^2 = 12$, so $c = 2\\sqrt{3}$ and $e = \\dfrac{c}{a} = \\dfrac{\\sqrt{3}}{2}$.', 'The foci are $(\\pm 2\\sqrt{3}, 0)$.'], {
    shown: sketch(320, 200, 'Axes crossing at the origin. An ellipse centred there, wider than it is tall, cuts the x-axis at −4 and 4 and the y-axis at 2 and −2.', [
      arrow([20, 100], [310, 100]), arrow([160, 190], [160, 10]), label(306, 116, 'x', 'end'), label(150, 16, 'y', 'end'),
      { t: 'path', d: 'M40 100 A120 60 0 1 0 280 100 A120 60 0 1 0 40 100' },
      label(34, 94, '−4', 'end'), label(286, 94, '4', 'start'), label(166, 34, '2', 'start'), label(166, 176, '−2', 'start'),
    ]),
  }),
  figure(K(3, 3), 'Sketch the hyperbola $\\dfrac{x^2}{4} - \\dfrac{y^2}{5} = 1$, marking its vertices, foci and asymptotes.', ['$a = 2$, $b = \\sqrt{5}$: the vertices are $(\\pm 2, 0)$.', '$c^2 = a^2 + b^2 = 9$, so the foci are $(\\pm 3, 0)$.', 'The asymptotes are $y = \\pm \\dfrac{\\sqrt{5}}{2}x$, which the two branches approach without meeting.'], {
    answer: sketch(320, 280, 'Axes crossing at the origin. Two branches of a hyperbola open left and right, through the vertices (−2, 0) and (2, 0). The foci are marked at (−3, 0) and (3, 0). Two dashed lines through the origin are the asymptotes, which the branches approach.', [
      arrow([10, 140], [310, 140]), arrow([160, 275], [160, 6]), label(306, 156, 'x', 'end'), label(150, 14, 'y', 'end'),
      { t: 'path', d: branch(1) }, { t: 'path', d: branch(-1) },
      line([[160 - 120 / slope, 20], [160 + 120 / slope, 260]], { dash: 1 }), line([[160 - 120 / slope, 260], [160 + 120 / slope, 20]], { dash: 1 }),
      { t: 'dot', x: 220, y: 140 }, { t: 'dot', x: 100, y: 140 }, { t: 'dot', x: 250, y: 140 }, { t: 'dot', x: 70, y: 140 },
      label(216, 156, '2', 'end'), label(104, 156, '−2', 'start'), label(254, 156, 'S(3, 0)', 'start'), label(66, 156, 'S′(−3, 0)', 'end'),
    ]),
  }),

  predict(K(2, 2), 'In the ellipse $\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$, $a$ is kept fixed and $b$ is brought closer and closer to $a$. Predict what happens to its eccentricity and its shape.', '$e = \\sqrt{1 - \\dfrac{b^2}{a^2}}$, which tends to 0 as $b \\to a$.', 'The foci move in to the centre, and the ellipse becomes more and more like a circle.'),
  predict(K(2, 1), 'Predict which way the parabola $x^2 = -12y$ opens, and give its focus and directrix.', 'It opens downwards, as $y \\le 0$ for every point on it.', '$4a = 12$, so the focus is $(0, -3)$ and the directrix is $y = 3$.'),
  predict(K(2, 2), 'A plane cuts a double cone and passes through its vertex. Predict the possible sections.', 'A single point, if the plane meets the cone only at the vertex; or a straight line, if it touches the cone along a generator.', 'Or a pair of intersecting lines, if it cuts through both nappes; these are the degenerate conics.'),

  odd(K(2, 1), ['$y^2 = 4x$', '$x^2 = -6y$', '$y^2 = -10x$', '$\\dfrac{x^2}{4} + y^2 = 1$'], '$\\dfrac{x^2}{4} + y^2 = 1$', 'It is an ellipse; the other three are parabolas.'),
  odd(K(2, 2), ['$\\dfrac{x^2}{9} + \\dfrac{y^2}{4} = 1$', '$\\dfrac{x^2}{16} + \\dfrac{y^2}{9} = 1$', '$\\dfrac{x^2}{4} - \\dfrac{y^2}{9} = 1$', '$\\dfrac{x^2}{25} + \\dfrac{y^2}{16} = 1$'], '$\\dfrac{x^2}{4} - \\dfrac{y^2}{9} = 1$', 'It is a hyperbola, with $e > 1$; the others are ellipses, with $e < 1$.'),
  odd(K(2, 1), ['a circle', 'an ellipse', 'a parabola', 'a pair of intersecting lines'], 'a pair of intersecting lines', 'It is a degenerate conic, from a plane through the vertex; the others are not.'),

  long(K(6, 1), 'For the parabola $y^2 = -16x$:\n(a) find its focus and directrix. [2]\n(b) Write its axis, and the length of its latus rectum. [2]\n(c) Find the points on it with $x = -4$, and their distance from the focus. [2]', '(a) $4a = 16$, so $a = 4$, and the parabola opens to the left: the focus is $(-4, 0)$.', '(a) The directrix is $x = 4$.', '(b) The axis is the $x$-axis, $y = 0$.', '(b) The latus rectum is $4a = 16$.', '(c) $y^2 = 64$, so the points are $(-4, 8)$ and $(-4, -8)$.', '(c) Each is $|-4 - 4| = 8$ from the directrix, so 8 from the focus.'),
  long(K(6, 2), 'For the ellipse $9x^2 + 16y^2 = 144$:\n(a) write it in standard form, and give the lengths of its axes. [2]\n(b) Find its eccentricity and foci. [2]\n(c) Find the length of its latus rectum. [1]\n(d) What is the sum of the distances of any point on it from the two foci? [1]', '(a) Dividing by 144: $\\dfrac{x^2}{16} + \\dfrac{y^2}{9} = 1$.', '(a) $a = 4$ and $b = 3$, so the major axis is 8 and the minor axis 6.', '(b) $c^2 = 16 - 9 = 7$, so $e = \\dfrac{\\sqrt{7}}{4}$.', '(b) The foci are $(\\pm\\sqrt{7}, 0)$.', '(c) $\\dfrac{2b^2}{a} = \\dfrac{18}{4} = \\dfrac{9}{2}$.', '(d) $2a = 8$.'),
  long(K(6, 2), 'A hyperbola has its foci at $(\\pm 5, 0)$ and a transverse axis of length 8.\n(a) Find its equation. [3]\n(b) Find its eccentricity. [1]\n(c) Write its asymptotes. [2]', '(a) $2a = 8$, so $a = 4$, and $c = 5$.', '(a) $b^2 = c^2 - a^2 = 25 - 16 = 9$.', '(a) $\\dfrac{x^2}{16} - \\dfrac{y^2}{9} = 1$.', '(b) $e = \\dfrac{c}{a} = \\dfrac{5}{4}$.', '(c) The asymptotes are $y = \\pm \\dfrac{b}{a}x$.', '(c) So $y = \\dfrac{3}{4}x$ and $y = -\\dfrac{3}{4}x$.'),

  tell(K(2, 1), 'Distinguish between a parabola and an ellipse, by eccentricity and by shape.', 'A parabola has $e = 1$ and is an open curve, with one branch going on without end.', 'An ellipse has $0 < e < 1$ and is a closed curve.'),
  tell(K(2, 1), 'Distinguish between the major axis and the minor axis of the ellipse $\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$, $a > b$.', 'The major axis is the longer one, of length $2a$, along the $x$-axis; the foci lie on it.', 'The minor axis is the shorter one, of length $2b$, along the $y$-axis.'),
  tell(K(2, 2), 'Distinguish between a circle and an ellipse as sections of a cone.', 'A circle is cut by a plane at right angles to the cone’s axis.', 'An ellipse is cut by a plane tilted to the axis, but less steeply than a generator, so it cuts every generator of one nappe.'),

  match(K(4, 1), [['$y^2 = 4ax$, $a > 0$', 'opens to the right'], ['$y^2 = -4ax$, $a > 0$', 'opens to the left'], ['$x^2 = 4ay$, $a > 0$', 'opens upwards'], ['$x^2 = -4ay$, $a > 0$', 'opens downwards']]),
  match(K(4, 1), [['$e = 0$', 'a circle'], ['$0 < e < 1$', 'an ellipse'], ['$e = 1$', 'a parabola'], ['$e > 1$', 'a hyperbola']]),
  match(K(4, 2), [['A plane at right angles to the axis, not through the vertex', 'a circle'], ['A plane parallel to one generator', 'a parabola'], ['A plane through the vertex, cutting both nappes', 'a pair of intersecting lines'], ['A plane cutting both nappes, not through the vertex', 'a hyperbola']]),

  reason(K(2, 1), 'Why is the eccentricity of a parabola exactly 1?', 'Eccentricity is the ratio of a point’s distance from the focus to its distance from the directrix.', 'Every point of a parabola is the same distance from both, so the ratio is 1.'),
  reason(K(2, 1), 'Why are the foci of $\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$, with $a > b$, on the $x$-axis?', 'As $a > b$, the ellipse is longer along the $x$-axis, which is its major axis.', 'The foci always lie on the major axis, at $(\\pm c, 0)$ with $c^2 = a^2 - b^2$.'),
  reason(K(2, 2), 'Why is the hyperbola $x^2 - y^2 = a^2$ called rectangular?', 'Here $b = a$, so its asymptotes are $y = x$ and $y = -x$.', 'These are at right angles to each other.'),

  short(K(2, 1), 'Find the equation of the parabola with vertex at the origin and focus $(0, -2)$.', 'The focus is on the negative $y$-axis, so it is $x^2 = -4ay$ with $a = 2$.', '$x^2 = -8y$.'),
  short(K(2, 2), 'Find the equation of the ellipse with vertices $(\\pm 6, 0)$ and foci $(\\pm 4, 0)$.', '$a = 6$ and $c = 4$, so $b^2 = a^2 - c^2 = 20$.', '$\\dfrac{x^2}{36} + \\dfrac{y^2}{20} = 1$.'),

  ar(K(1, 1), 'The parabola $y^2 = 4ax$ is symmetric about the $x$-axis.', 'Putting $-y$ for $y$ leaves the equation unchanged.', 1, 'So whenever $(x, y)$ is on the curve, so is $(x, -y)$.'),
  ar(K(1, 2), 'The major axis of $\\dfrac{x^2}{16} + \\dfrac{y^2}{25} = 1$ lies along the $x$-axis.', 'The major axis of an ellipse is its longer axis.', 4, 'Here $25 > 16$, so the longer axis, of length 10, lies along the $y$-axis.'),
  ar(K(1, 2), 'The latus rectum of $y^2 = 4ax$ has length $4a$.', 'The latus rectum passes through the focus.', 2, 'Both are true, but the length comes from putting $x = a$ into the equation, which gives $y = \\pm 2a$.'),

  derive(K(3, 2), 'Derive the equation $y^2 = 4ax$ of the parabola with focus $(a, 0)$ and directrix $x = -a$, $a > 0$.', ['A point $P(x, y)$ is on the parabola when its distance from the focus equals its distance from the directrix: $\\sqrt{(x - a)^2 + y^2} = |x + a|$.', 1], ['Squaring: $x^2 - 2ax + a^2 + y^2 = x^2 + 2ax + a^2$.', 1], ['So $y^2 = 4ax$.', 1]),
  derive(K(3, 1), 'Show that the latus rectum of the parabola $y^2 = 4ax$ has length $4a$.', ['The latus rectum is the chord through the focus $(a, 0)$ at right angles to the axis, the line $x = a$.', 1], ['Putting $x = a$: $y^2 = 4a^2$, so $y = \\pm 2a$.', 1], ['Its ends are $(a, 2a)$ and $(a, -2a)$, so its length is $4a$.', 1]),
  derive(K(3, 2), 'Show that the latus rectum of the ellipse $\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$ has length $\\dfrac{2b^2}{a}$.', ['The latus rectum is the chord through the focus $(c, 0)$ at right angles to the major axis, where $c^2 = a^2 - b^2$.', 1], ['Putting $x = c$: $\\dfrac{y^2}{b^2} = 1 - \\dfrac{c^2}{a^2} = \\dfrac{b^2}{a^2}$, so $y = \\pm\\dfrac{b^2}{a}$.', 1], ['So its length is $\\dfrac{2b^2}{a}$.', 1]),
];

export default questions;
