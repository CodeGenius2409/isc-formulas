// Written by hand: vector algebra, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('mathematics', 'XII');
const V = at(4, 'a');

const questions: BankDef[] = [
  predict(V(2, 1), 'Predict $\\vec{a} \\cdot (\\vec{a} \\times \\vec{b})$ without working it out, and give the reason.', 'Zero.', '$\\vec{a} \\times \\vec{b}$ is at right angles to $\\vec{a}$.'),
  predict(V(2, 2), 'Two vectors have $|\\vec{a} + \\vec{b}| = |\\vec{a} - \\vec{b}|$. Predict the angle between them.', 'Squaring, $\\vec{a} \\cdot \\vec{b} = -\\vec{a} \\cdot \\vec{b}$, so $\\vec{a} \\cdot \\vec{b} = 0$.', 'They are at right angles.'),
  predict(V(2, 2), 'Predict what happens to $|\\vec{a} \\times \\vec{b}|$ when the angle between two vectors of fixed sizes grows from 0 to $180°$.', 'It rises from 0 to its greatest, $|\\vec{a}||\\vec{b}|$, at $90°$.', 'It then falls back to 0 at $180°$.'),
  predict(V(3, 3), 'Predict whether three vectors $\\vec{a}$, $\\vec{b}$ and $\\vec{a} + \\vec{b}$ can be the sides of a triangle, and what $\\vec{a} \\cdot \\vec{b} = 0$ would tell you about it.', 'Yes: drawn head to tail, $\\vec{a}$ and $\\vec{b}$ close with $\\vec{a} + \\vec{b}$.', 'If $\\vec{a} \\cdot \\vec{b} = 0$, the triangle has a right angle between $\\vec{a}$ and $\\vec{b}$.', 'Then $|\\vec{a} + \\vec{b}|^2 = |\\vec{a}|^2 + |\\vec{b}|^2$, which is Pythagoras’ theorem.'),
  predict(V(2, 3), 'A unit vector makes equal angles with all three axes. Predict its direction cosines.', 'All three are equal, with $3l^2 = 1$.', 'So each is $\\pm\\frac{1}{\\sqrt{3}}$.'),
];

export default questions;
