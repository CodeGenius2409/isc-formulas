// Written by hand: linear programming, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar, derive } = kit('mathematics', 'XII');
const P = at(6, 'a');

const questions: BankDef[] = [
  // Origin at (60, 190), 30 px to a unit.
  figure(P(3, 2), 'Draw the feasible region of $x + 2y \\le 8$, $x + y \\le 5$, $x \\ge 0$, $y \\ge 0$, and write its corner points.', ['The lines $x + 2y = 8$ and $x + y = 5$ are drawn, and the region below both, in the first quadrant, is shaded.', 'The lines meet where $y = 3$ and $x = 2$.', 'The corners are $(0, 0)$, $(5, 0)$, $(2, 3)$ and $(0, 4)$.'], {
    answer: sketch(320, 215, 'Axes with the origin at the lower left. The line x + 2y = 8 runs from (0, 4) to (8, 0), and the line x + y = 5 from (0, 5) to (5, 0). They cross at (2, 3). The shaded region below both lines, in the first quadrant, has corners (0, 0), (5, 0), (2, 3) and (0, 4).', [
      { t: 'shade', p: [[60, 190], [210, 190], [120, 100], [60, 70]] },
      arrow([60, 190], [310, 190]), arrow([60, 190], [60, 10]), line([[60, 70], [300, 190]]), line([[60, 40], [210, 190]]),
      label(310, 206, 'x', 'end'), label(68, 14, 'y', 'start'), label(54, 206, 'O', 'end'),
      label(210, 206, '(5, 0)'), label(114, 120, '(2, 3)', 'end'), label(54, 74, '(0, 4)', 'end'),
      label(236, 150, 'x + 2y = 8', 'start'), label(66, 40, 'x + y = 5', 'start'),
    ]),
  }),
  // Origin at (70, 190), 30 px to a unit.
  figure(P(3, 1), 'The shaded region is the feasible region of a linear programming problem, with corners $O$, $A(6, 0)$, $B(4, 3)$ and $C(0, 5)$. Find the maximum of $Z = 2x + 3y$, and where it occurs.', ['At $O$, $Z = 0$; at $A$, $Z = 12$.', 'At $B$, $Z = 8 + 9 = 17$; at $C$, $Z = 15$.', 'The maximum is 17, at $B(4, 3)$.'], {
    shown: sketch(310, 215, 'Axes with the origin O at the lower left. A shaded four-sided region has corners O, A(6, 0) on the x-axis, B(4, 3), and C(0, 5) on the y-axis.', [
      { t: 'shade', p: [[70, 190], [250, 190], [190, 100], [70, 40]] },
      arrow([70, 190], [300, 190]), arrow([70, 190], [70, 10]), line([[250, 190], [190, 100], [70, 40]]),
      label(300, 206, 'x', 'end'), label(78, 14, 'y', 'start'), label(64, 206, 'O', 'end'),
      label(250, 206, 'A(6, 0)'), label(196, 96, 'B(4, 3)', 'start'), label(64, 44, 'C(0, 5)', 'end'),
    ]),
  }),
  // Origin at (50, 180), 40 px to a unit.
  figure(P(2, 3), 'The shaded region, which goes on without end, is the feasible region of $x + y \\ge 3$, $x \\ge 0$, $y \\ge 0$. Does $Z = x + y$ have a minimum and a maximum on it? Explain.', ['Minimum 3, at every point of the edge from $(3, 0)$ to $(0, 3)$, since $Z = 3$ all along it.', 'No maximum: $Z$ grows without limit, as at $(n, 0)$ for larger and larger $n$.'], {
    shown: sketch(310, 200, 'Axes with the origin at the lower left. The line x + y = 3 joins (0, 3) and (3, 0). Everything above and to the right of it, in the first quadrant, is shaded, out to the edges of the figure.', [
      { t: 'shade', p: [[50, 60], [50, 10], [300, 10], [300, 180], [170, 180]] },
      arrow([50, 180], [305, 180]), arrow([50, 180], [50, 6]), line([[50, 60], [170, 180]]),
      label(44, 64, '(0, 3)', 'end'), label(170, 196, '(3, 0)'), label(175, 170, 'x + y = 3', 'start'), label(300, 196, 'x', 'end'), label(58, 14, 'y', 'start'),
    ]),
  }),

  predict(P(2, 2), '$Z = 2x + 4y$ takes its maximum at both $(8, 0)$ and $(0, 4)$, the ends of the edge $x + 2y = 8$ of a feasible region. Predict how many optimal solutions there are.', 'On that edge $Z = 2(x + 2y) = 16$ at every point.', 'So there are infinitely many optimal solutions: every point of the edge.'),
  predict(P(2, 2), 'An extra constraint is added to a linear programming problem. Predict whether its maximum value can go up, and why.', 'The new feasible region is part of the old one, or the same.', 'So the maximum can only stay the same or fall; it can’t go up.'),
  predict(P(2, 1), 'The constraints are $x + y \\le 2$, $x + y \\ge 5$, $x \\ge 0$, $y \\ge 0$. Predict the feasible region and the solution.', 'No point can have $x + y$ both at most 2 and at least 5, so the feasible region is empty.', 'The problem is infeasible: it has no solution.'),

  odd(P(2, 1), ['$x + y \\le 4$', '$2x - y \\ge 1$', '$Z = 3x + 5y$', '$x \\ge 0$'], '$Z = 3x + 5y$', 'It is the objective function; the other three are constraints.'),
  odd(P(2, 1), ['$(0, 0)$', '$(4, 0)$', '$(2, 2)$', '$(3, 2)$'], '$(3, 2)$', 'For $x + y \\le 4$, $x \\ge 0$, $y \\ge 0$, it gives $x + y = 5$, so it isn’t feasible; the others are.'),
  odd(P(2, 1), ['a diet problem', 'a manufacturing problem', 'a transportation problem', 'a quadratic programming problem'], 'a quadratic programming problem', 'Its objective is not linear; the other three are kinds of linear programming problem.'),

  long(P(6, 2), 'A baker makes cakes and loaves. A cake needs 200 g of flour and 25 g of fat, and a loaf 100 g of flour and 50 g of fat. There are 5 kg of flour and 1 kg of fat. The profit is ₹30 on a cake and ₹20 on a loaf.\n(a) Write the problem as a linear programming problem. [2]\n(b) Find the corner points of the feasible region. [2]\n(c) How many of each should be made for the greatest profit? [2]', '(a) Maximise $Z = 30x + 20y$, for $x$ cakes and $y$ loaves.', '(a) Subject to $2x + y \\le 50$, $x + 2y \\le 40$, $x \\ge 0$, $y \\ge 0$.', '(b) The two lines meet where $x = 20$, $y = 10$.', '(b) The corners are $(0, 0)$, $(25, 0)$, $(20, 10)$ and $(0, 20)$.', '(c) $Z = 0$, $750$, $800$ and $400$ at those corners.', '(c) So 20 cakes and 10 loaves, for a profit of ₹800.'),
  long(P(6, 3), 'A farmer mixes two feeds. Feed P costs ₹4 a kg and feed Q ₹3 a kg. The mix needs at least 10 units of protein, which P gives at 2 units a kg and Q at 1, and at least 8 units of fibre, which P gives at 1 unit a kg and Q at 2.\n(a) Write the problem as a linear programming problem. [2]\n(b) Find the corner points of the feasible region. [2]\n(c) Find the least cost. [1]\n(d) Why must this answer be checked, and how? [1]', '(a) Minimise $Z = 4x + 3y$, for $x$ kg of P and $y$ kg of Q.', '(a) Subject to $2x + y \\ge 10$, $x + 2y \\ge 8$, $x \\ge 0$, $y \\ge 0$.', '(b) The lines meet at $(4, 2)$.', '(b) The corners are $(0, 10)$, $(4, 2)$ and $(8, 0)$.', '(c) $Z = 30$, $22$ and $32$, so the least cost is ₹22, with 4 kg of P and 2 kg of Q.', '(d) The region is unbounded, so check that the half-plane $4x + 3y < 22$ has no point in common with it; it hasn’t, so 22 is the minimum.'),

  tell(P(2, 1), 'Distinguish between a feasible solution and an optimal feasible solution.', 'A feasible solution is any point that satisfies all the constraints.', 'An optimal feasible solution is a feasible point that gives the objective function its best value.'),
  tell(P(2, 2), 'Distinguish between a bounded and an unbounded feasible region, and say what each means for a maximum.', 'A bounded region can be enclosed in a circle; then $Z$ always has a maximum and a minimum, at corners.', 'An unbounded region goes on without end in some direction; then a maximum may not exist.'),
  tell(P(2, 1), 'Distinguish between a constraint and the objective function.', 'A constraint is a linear inequality that the variables must satisfy, such as a limit on time or material.', 'The objective function is the linear function, such as profit or cost, to be maximised or minimised.'),

  match(P(4, 1), [['$x + y \\le 4$', 'the side of $x + y = 4$ that holds the origin'], ['$x + y \\ge 4$', 'the side of $x + y = 4$ away from the origin'], ['$x \\ge 2$', 'to the right of $x = 2$'], ['$y \\le 3$', 'below $y = 3$']]),
  match(P(4, 1), [['$(0, 0)$', '$0$'], ['$(4, 0)$', '$12$'], ['$(1, 3)$', '$9$'], ['$(0, 5)$', '$10$']]),
  match(P(4, 2), [['A bounded feasible region', '$Z$ has a maximum and a minimum, at corners'], ['An empty feasible region', 'there is no solution'], ['Two corners give the same maximum', 'every point of the edge joining them is optimal'], ['An unbounded region on which $Z$ keeps growing', 'there is no maximum']]),

  reason(P(2, 2), 'Why are strict inequalities such as $x + y < 4$ not used as constraints?', 'The boundary line would not be part of the feasible region.', 'The best value is reached on the boundary, at a corner, so it might never be attained.'),
  reason(P(2, 3), 'For an unbounded feasible region, why is the smallest corner value $m$ of $Z = ax + by$ checked against the half-plane $ax + by < m$?', 'The region goes on without end, so a smaller value could lie somewhere other than a corner.', 'If the half-plane $ax + by < m$ has no point in common with the region, nothing smaller exists, and $m$ is the minimum.'),
  reason(P(2, 2), 'Why are the lines $3x + 2y = k$, for different values of $k$, all parallel? How does that help find a maximum?', 'They all have slope $-\\dfrac{3}{2}$, as only $k$ changes.', 'Moving the line outward raises $Z$, so the last point of the region it touches gives the maximum.'),

  short(P(2, 1), 'Find the corner points of the region $x + y \\le 6$, $x \\le 4$, $x \\ge 0$, $y \\ge 0$.', '$x = 4$ meets $x + y = 6$ at $(4, 2)$.', 'The corners are $(0, 0)$, $(4, 0)$, $(4, 2)$ and $(0, 6)$.'),

  ar(P(1, 1), 'The region $x + y \\le 2$, $x \\ge 0$, $y \\ge 0$ is bounded.', 'It is the triangle with corners $(0, 0)$, $(2, 0)$ and $(0, 2)$.', 1, 'A triangle can be enclosed in a circle.'),
  ar(P(1, 2), 'Every linear programming problem has an optimal solution.', 'The feasible region of some linear programming problems is empty.', 4, 'With an empty region, or an unbounded one on which $Z$ keeps growing, there is no optimal solution.'),
  ar(P(1, 2), 'If $Z$ is maximum at two corners, it is maximum at every point of the segment joining them.', 'A linear function is constant along every line.', 3, '$Z$ is constant only along the lines $Z = k$; here the segment is one of them.'),

  derive(P(3, 2), 'Show that if $Z = ax + by$ takes the same value at two corner points $P$ and $Q$, it takes that value at every point of the segment $PQ$.', ['Any point of $PQ$ is $R = (1 - t)P + tQ$, for some $0 \\le t \\le 1$.', 1], ['As $Z$ is linear, $Z(R) = (1 - t)Z(P) + tZ(Q)$.', 1], ['With $Z(P) = Z(Q)$, this is $(1 - t)Z(P) + tZ(P) = Z(P)$.', 1]),
  derive(P(3, 2), 'Show that at every point of the segment joining points $P$ and $Q$, the value of $Z = ax + by$ lies between $Z(P)$ and $Z(Q)$.', ['A point of the segment is $R = (1 - t)P + tQ$, with $0 \\le t \\le 1$.', 1], ['$Z(R) = (1 - t)Z(P) + tZ(Q)$, as $Z$ is linear.', 1], ['This is a weighted average of $Z(P)$ and $Z(Q)$ with weights adding to 1, so it lies between them; hence an edge never beats both its ends.', 1]),
  derive(P(3, 3), 'Show that the feasible region of $x + y \\le 4$, $x \\ge 0$, $y \\ge 0$ contains the whole segment joining any two of its points.', ['Take feasible points $(x_1, y_1)$ and $(x_2, y_2)$, and $R = ((1 - t)x_1 + tx_2, (1 - t)y_1 + ty_2)$ with $0 \\le t \\le 1$.', 1], ['Its coordinates are sums of non-negative terms, so both are $\\ge 0$.', 1], ['Its $x + y$ is $(1 - t)(x_1 + y_1) + t(x_2 + y_2) \\le 4(1 - t) + 4t = 4$, so $R$ is feasible.', 1]),
];

export default questions;
