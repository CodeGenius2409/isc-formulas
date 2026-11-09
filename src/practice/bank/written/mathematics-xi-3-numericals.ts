// Written by hand: numericals on coordinate geometry, for Mathematics XI at 0% generated. The answers are computed separately in
// tests/unit/written-answers.test.ts. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { theory } = bank('mathematics', 'XI');
const n = (place: Place, text: string, points: (string | [string, number])[]) => theory('short', place, text, points, { format: 'numerical' });
const L = (marks: number, d: 1 | 2 | 3): Place => [3, 'a', marks, d];
const C = (marks: number, d: 1 | 2 | 3): Place => [3, 'b', marks, d];
const K = (marks: number, d: 1 | 2 | 3): Place => [3, 'c', marks, d];
const G = (marks: number, d: 1 | 2 | 3): Place => [3, 'd', marks, d];

const questions: BankDef[] = [
  // ---- 3a Straight lines
  n(L(1, 1), 'Find the slope of the line through $(1, 2)$ and $(3, 8)$.', ['$\\frac{8 - 2}{3 - 1} = 3$.']),
  n(L(1, 1), 'Find the distance of $(3, 4)$ from the line $3x + 4y = 0$.', ['$\\frac{|9 + 16|}{5} = 5$.']),
  n(L(2, 1), 'Find the area of the triangle that $\\frac{x}{2} + \\frac{y}{3} = 1$ makes with the axes.', ['The intercepts are 2 and 3.', 'The area is $\\frac{1}{2} \\times 2 \\times 3 = 3$.']),
  n(L(2, 2), 'Find $k$ if $2x + 3y = 1$ and $kx - y = 5$ are perpendicular.', ['The slopes are $-\\frac{2}{3}$ and $k$.', 'Their product is $-1$, so $k = \\frac{3}{2}$.']),
  n(L(2, 1), 'Find the angle the line $y = x$ makes with the x-axis.', ['The slope is 1.', 'So the angle is $\\frac{\\pi}{4}$.']),
  n(L(3, 1), 'Find the distance between the parallel lines $3x + 4y = 5$ and $3x + 4y = 15$.', ['The distance is $\\frac{|c_1 - c_2|}{\\sqrt{a^2 + b^2}}$.', 'That is $\\frac{10}{5}$.', 'This is $2$.']),
  n(L(3, 1), 'Find where $x + y = 5$ and $x - y = 1$ meet. Give the value of $xy$.', ['Adding gives $2x = 6$, so $x = 3$.', 'Then $y = 2$.', 'So $xy = 6$.']),
  n(L(3, 2), 'A triangle has vertices $(0, 0)$, $(6, 0)$ and $(0, 8)$. Find the length of its longest side, and of the median to that side.', ['The longest side joins $(6, 0)$ and $(0, 8)$, and its length is 10.', 'Its midpoint is $(3, 4)$.', 'The median from the origin is $5$.']),
  n(L(5, 2), 'Find the line through $(1, 2)$ perpendicular to $3x - 4y = 5$, and its distance from the origin.', ['The given slope is $\\frac{3}{4}$, so the new slope is $-\\frac{4}{3}$.', '$y - 2 = -\\frac{4}{3}(x - 1)$.', 'So $4x + 3y = 10$.', 'The distance is $\\frac{10}{\\sqrt{16 + 9}}$.', 'This is $2$.']),
  n(L(5, 3), 'A triangle has vertices $A(0, 4)$, $B(-3, 0)$ and $C(3, 0)$. Find the length of the altitude from $C$ to $AB$.', ['Base $BC = 6$, with height 4, so the area is 12.', '$AB = \\sqrt{9 + 16} = 5$.', 'The area is also $\\frac{1}{2} \\times AB \\times h$.', 'So $\\frac{5h}{2} = 12$.', 'The altitude is $\\frac{24}{5}$.']),
  // ---- 3b Circles
  n(C(1, 1), 'Find the radius of $x^2 + y^2 = 49$.', ['$\\sqrt{49} = 7$.']),
  n(C(1, 1), 'Find the radius of $x^2 + y^2 - 6x - 8y = 0$.', ['$\\sqrt{9 + 16} = 5$.']),
  n(C(2, 1), 'Find the radius of the circle with centre $(3, 4)$ that passes through the origin.', ['The radius is the distance from the origin.', 'This is $5$.']),
  n(C(2, 2), 'Find the length of the tangent from $(4, 3)$ to $x^2 + y^2 = 9$.', ['$\\sqrt{x_1^2 + y_1^2 - r^2} = \\sqrt{25 - 9}$.', 'This is $4$.']),
  n(C(2, 1), 'Find the value of $c$ if the circle $x^2 + y^2 + 4x - 6y + c = 0$ has radius 2.', ['The radius squared is $4 + 9 - c$.', 'So $13 - c = 4$, and $c = 9$.']),
  n(C(3, 2), 'Find the area of $x^2 + y^2 - 4x - 6y - 12 = 0$.', ['The centre is $(2, 3)$.', '$r^2 = 4 + 9 + 12 = 25$.', 'The area is $25\\pi$.']),
  n(C(3, 2), 'Find the positive value of $c$ if $y = x + c$ touches $x^2 + y^2 = 8$.', ['The distance from the centre equals the radius: $\\frac{c}{\\sqrt{2}} = \\sqrt{8}$.', 'So $c = \\sqrt{16}$.', 'So $c = 4$.']),
  n(C(3, 3), 'Find the distance between the centres of $x^2 + y^2 = 4$ and $x^2 + y^2 - 6x - 8y + 16 = 0$, and say whether they touch. Give the distance.', ['The centres are $(0, 0)$ and $(3, 4)$, and the radii are 2 and 3.', 'The sum of the radii equals the distance, so they touch.', 'The distance is $5$.']),
  n(C(5, 2), 'Find the circle through $(0, 0)$, $(2, 0)$ and $(0, 4)$. Give the square of its radius.', ['Let it be $x^2 + y^2 + 2gx + 2fy + c = 0$; the origin gives $c = 0$.', '$(2, 0)$ gives $4 + 4g = 0$, so $g = -1$.', '$(0, 4)$ gives $16 + 8f = 0$, so $f = -2$.', 'The circle is $x^2 + y^2 - 2x - 4y = 0$, with centre $(1, 2)$.', 'So $r^2 = 5$.']),
  n(C(5, 3), 'Find the tangent to $x^2 + y^2 = 25$ at $(3, 4)$, and the area of the triangle it makes with the axes.', ['The tangent is $3x + 4y = 25$.', 'The x-intercept is $\\frac{25}{3}$.', 'The y-intercept is $\\frac{25}{4}$.', 'The area is $\\frac{1}{2} \\times \\frac{25}{3} \\times \\frac{25}{4}$.', 'This is $\\frac{625}{24}$.']),
  // ---- 3c Conic sections
  n(K(1, 1), 'Find the length of the latus rectum of $y^2 = 12x$.', ['$4a = 12$.']),
  n(K(1, 2), 'Find the eccentricity of $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$.', ['$\\sqrt{1 - \\frac{9}{25}} = \\frac{4}{5}$.']),
  n(K(2, 1), 'Find the eccentricity of $\\frac{x^2}{9} - \\frac{y^2}{16} = 1$.', ['$\\sqrt{1 + \\frac{16}{9}}$.', 'This is $\\frac{5}{3}$.']),
  n(K(2, 1), 'Find the distance between the foci of $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$.', ['$c = \\sqrt{25 - 9} = 4$.', 'The distance is $2c = 8$.']),
  n(K(2, 2), 'A point on $y^2 = 12x$ has $y = 6$. Find its distance from the focus.', ['Here $x = 3$, and $a = 3$.', 'The distance is $x + a = 6$.']),
  n(K(3, 2), 'An ellipse has a semi-major axis of 5 and an eccentricity of $\\frac{3}{5}$. Find $b^2$.', ['$c = ae = 3$.', '$b^2 = a^2 - c^2$.', 'So $b^2 = 25 - 9 = 16$.']),
  n(K(3, 2), 'Find the length of the latus rectum of $\\frac{x^2}{9} - \\frac{y^2}{16} = 1$.', ['Here $a = 3$ and $b = 4$.', 'The length is $\\frac{2b^2}{a}$.', 'This is $\\frac{32}{3}$.']),
  n(K(3, 1), 'Find the focus of $y^2 = 8x$, and the length of its latus rectum. Give the length.', ['$4a = 8$, so $a = 2$.', 'The focus is $(2, 0)$.', 'The length is $8$.']),
  n(K(5, 2), 'A dish in the shape of a parabola is 12 m wide and 3 m deep. (i) Set up axes at its vertex. (ii) Write the form of its equation. (iii) Use the edge of the dish to find $a$. (iv) Say where the receiver must go. Give its distance from the vertex.', ['(i) The vertex is at the origin, with the axis along $x$.', '(ii) $y^2 = 4ax$.', '(iii) The edge is at $(3, 6)$, so $36 = 12a$.', 'So $a = 3$.', '(iv) It goes at the focus, $3$ m from the vertex.']),
  n(K(5, 3), 'An arch is half an ellipse, 40 m wide and 10 m high at the centre. Find the square of its height 10 m from the centre.', ['Take $\\frac{x^2}{400} + \\frac{y^2}{100} = 1$.', 'Put $x = 10$.', '$\\frac{y^2}{100} = 1 - \\frac{1}{4}$.', 'So $y^2 = 100 \\times \\frac{3}{4}$.', 'So $y^2 = 75$.']),
  // ---- 3d Three-dimensional geometry
  n(G(1, 1), 'Find the distance of $(3, 4, 0)$ from the origin.', ['$\\sqrt{9 + 16} = 5$.']),
  n(G(1, 1), 'Find the z-coordinate of the midpoint of $(1, 2, 3)$ and $(3, 4, 7)$.', ['$\\frac{3 + 7}{2} = 5$.']),
  n(G(2, 1), 'Find the distance between $(1, 2, 3)$ and $(4, 6, 15)$.', ['$\\sqrt{9 + 16 + 144}$.', 'This is $13$.']),
  n(G(2, 1), 'Find the x-coordinate of the point dividing the join of $(1, 2, 3)$ and $(4, 5, 6)$ in the ratio $1 : 2$, internally.', ['$\\frac{1 \\times 4 + 2 \\times 1}{3}$.', 'This is $2$.']),
  n(G(2, 2), 'Find the distance of $(3, 4, 12)$ from the origin, and from the z-axis. Give the distance from the z-axis.', ['From the origin it is 13.', 'From the z-axis it is $\\sqrt{9 + 16} = 5$.']),
  n(G(3, 1), 'A triangle has vertices $(1, 2, 3)$, $(3, 0, 5)$ and $(5, 4, 1)$. Find its centroid, and give the sum of the centroid’s coordinates.', ['$x = \\frac{1 + 3 + 5}{3} = 3$.', '$y = 2$, and $z = 3$.', 'The sum is $8$.']),
  n(G(3, 2), 'Find the point on the x-axis equidistant from $(1, 2, 3)$ and $(3, 2, -1)$. Give its x-coordinate.', ['$(x - 1)^2 + 4 + 9 = (x - 3)^2 + 4 + 1$.', '$-2x + 14 = -6x + 14$.', 'So $x = 0$.']),
  n(G(3, 2), 'A point divides the join of $(2, 3, 4)$ and $(5, 6, 7)$ in the ratio $2 : 1$, internally. Find the sum of its coordinates.', ['$x = \\frac{10 + 2}{3} = 4$.', '$y = 5$, and $z = 6$.', 'The sum is $15$.']),
  n(G(5, 2), 'Show that $A(0, 0, 0)$, $B(3, 0, 0)$ and $C(0, 4, 0)$ form a right-angled triangle, and find its area.', ['$AB = 3$.', '$AC = 4$.', '$BC = 5$.', '$3^2 + 4^2 = 5^2$, so the right angle is at $A$.', 'The area is $6$.']),
  n(G(5, 3), 'A hall is 4 m long, 3 m wide and 12 m high. With one corner as the origin, find the coordinates of the far corner, and the length of the longest rod that fits. Then find how far the rod’s midpoint is from the floor.', ['The far corner is $(4, 3, 12)$.', 'The longest rod joins opposite corners.', 'Its midpoint is $(2, 1.5, 6)$, which is 6 m from the floor.', 'Its length is $\\sqrt{16 + 9 + 144}$.', 'This is $13$ m.']),
];

export default questions;
