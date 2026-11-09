// Written by hand: numericals on linear programming, for Mathematics XII at 0% generated. The answers are computed separately in
// tests/unit/written-answers.test.ts. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { theory } = bank('mathematics', 'XII');
const n = (place: Place, text: string, points: (string | [string, number])[]) => theory('short', place, text, points, { format: 'numerical' });
const L = (marks: number, d: 1 | 2 | 3): Place => [6, 'a', marks, d];

const questions: BankDef[] = [
  n(L(1, 1), 'A feasible region has corners $(0, 0)$, $(4, 0)$ and $(0, 6)$. Find the maximum of $Z = 3x + 2y$.', ['At the corners, $Z$ is 0, 12 and 12, so the maximum is $12$.']),
  n(L(1, 2), 'A feasible region has corners $(1, 1)$, $(3, 1)$ and $(1, 4)$. Find the minimum of $Z = 2x + y$.', ['At the corners, $Z$ is 3, 7 and 6, so the minimum is $3$.']),
  n(L(2, 1), 'A feasible region has corners $(0, 0)$, $(5, 0)$, $(3, 2)$ and $(0, 4)$. Find the maximum of $Z = 2x + 3y$.', ['At the corners, $Z$ is 0, 10, 12 and 12.', 'The maximum is $12$, at both $(3, 2)$ and $(0, 4)$.']),
  n(L(2, 1), 'Maximise $Z = 3x + 4y$ subject to $x + y \\le 5$, $x \\ge 0$, $y \\ge 0$.', ['The corners are $(0, 0)$, $(5, 0)$ and $(0, 5)$.', 'The maximum is $20$, at $(0, 5)$.']),
  n(L(2, 2), 'Minimise $Z = 2x + y$ subject to $x + y \\ge 4$, $x \\ge 0$, $y \\ge 0$.', ['The region’s corners are $(4, 0)$ and $(0, 4)$, and $Z$ is 8 and 4.', 'The region is unbounded, but $Z$ can’t go lower there, so the minimum is $4$.']),
  n(L(3, 2), 'Maximise $Z = x + y$ subject to $x + 2y \\le 8$, $3x + 2y \\le 12$, $x \\ge 0$, $y \\ge 0$.', ['The two lines meet at $(2, 3)$.', 'The corners are $(0, 0)$, $(4, 0)$, $(2, 3)$ and $(0, 4)$.', 'The values are 0, 4, 5 and 4, so the maximum is $5$.']),
  n(L(3, 2), 'A student has 10 hours to revise for Physics and Chemistry, and wants at least 2 hours on each. Each hour on Physics gains 3 marks, and on Chemistry 2 marks. Find the most marks that can be gained.', ['Maximise $Z = 3x + 2y$, with $x + y \\le 10$, $x \\ge 2$, $y \\ge 2$.', 'The corners are $(2, 2)$, $(8, 2)$ and $(2, 8)$.', 'The values are 10, 28 and 22, so the most is $28$.']),
  n(L(3, 3), 'Minimise $Z = 5x + 3y$ subject to $2x + y \\ge 8$, $x + 2y \\ge 7$, $x \\ge 0$, $y \\ge 0$.', ['The lines meet at $(3, 2)$.', 'The corners are $(0, 8)$, $(3, 2)$ and $(7, 0)$.', 'The values are 24, 21 and 35, so the minimum is $21$.']),
  n(L(5, 2), 'A workshop makes tables and chairs. A table uses 2 units of wood, and a chair uses 1. A table and a chair each take 1 hour. There are 100 units of wood and 80 hours. The profit is ₹50 on a table, and ₹30 on a chair. Find the largest profit.', ['Maximise $Z = 50x + 30y$.', 'Subject to $2x + y \\le 100$, $x + y \\le 80$, $x \\ge 0$, $y \\ge 0$.', 'The lines meet at $(20, 60)$.', 'The corners are $(0, 0)$, $(50, 0)$, $(20, 60)$ and $(0, 80)$, with values 0, 2500, 2800 and 2400.', 'The largest profit is $2800$ rupees.']),
  n(L(5, 3), 'A diet uses two foods, costing ₹6 and ₹10 per unit. It needs at least 10 units of vitamin A, where the foods have 1 and 2 units per unit. It needs at least 15 units of vitamin B, where they have 3 and 1. Find the least cost.', ['Minimise $Z = 6x + 10y$.', 'Subject to $x + 2y \\ge 10$, $3x + y \\ge 15$, $x \\ge 0$, $y \\ge 0$.', 'The lines meet at $(4, 3)$.', 'The corners are $(0, 15)$, $(4, 3)$ and $(10, 0)$, with values 150, 54 and 60.', 'The least cost is $54$ rupees.']),
];

export default questions;
