// Written by hand: collisions, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The two-dimensional collision is chosen to be elastic: 2 kg at 3 m/s hits 1 kg at rest; after, 2 kg moves at √3 m/s at 30° above, 1 kg at 2√3 m/s at 30° below.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const K = at(4, 'b');

const questions: BankDef[] = [
  figure(K(3, 2), 'A ball A moving along the x-axis hits an equal ball B at rest, elastically but not head-on. Draw their paths before and after, and state what is kept along each axis and the angle between the paths after.', ['Before: A moves along the x-axis towards B; after, A and B move off on either side of the x-axis.', 'Momentum is kept along x: the x-parts after add to A’s first momentum; along y, the two y-parts are equal and opposite.', 'For equal masses in an elastic collision, with one at rest, the two paths after are at 90° to each other.'], {
    answer: sketch(340, 200, 'Ball A moves along a horizontal line towards ball B at rest. After the collision, A moves off upwards and to the right, and B downwards and to the right; the angle between their paths is marked 90°.', [
      { t: 'circle', x: 60, y: 100, r: 10 }, label(60, 80, 'A'), arrow([74, 100], [130, 100]),
      { t: 'circle', x: 160, y: 100, r: 10 }, label(160, 80, 'B, at rest'),
      line([[170, 100], [320, 100]], { dash: 1 }),
      arrow([168, 94], [260, 40]), label(264, 36, 'A after', 'start'),
      arrow([168, 106], [208, 175]), label(212, 186, 'B after', 'start'), label(190, 122, '90°', 'start'),
    ]),
  }),
  figure(K(3, 2), 'The graph shows the velocities of trolley A, of mass 1 kg, and trolley B, at rest, before and after they collide and stick together. Find the mass of B, and the kinetic energy lost.', ['Momentum is kept: 1 × 6 = (1 + m) × 2.', 'm = 2 kg.', 'Kinetic energy before = ½ × 1 × 6² = 18 J; after = ½ × 3 × 2² = 6 J, so 12 J is lost.'], {
    shown: graph('time (s)', 'velocity (m/s)', [{ label: 'A', points: [[0, 6], [2, 6], [2.2, 2], [4, 2]] }, { label: 'B', points: [[0, 0], [2, 0], [2.2, 2], [3.4, 2]] }], { x: [[2, '2'], [4, '4']], y: [[2, '2'], [6, '6']] }),
  }),
  figure(K(3, 1), 'Make a table comparing perfectly elastic, inelastic and perfectly inelastic collisions: whether momentum and kinetic energy are kept, and the coefficient of restitution.', ['Momentum is kept in all three.', 'Kinetic energy is kept only in a perfectly elastic collision; some is lost in an inelastic one, and the most possible in a perfectly inelastic one.', 'e = 1 for perfectly elastic, 0 < e < 1 for inelastic, and e = 0 for perfectly inelastic, where the bodies move together.'], {
    answer: table(['Collision', 'Momentum', 'Kinetic energy', 'e'], [['Perfectly elastic', 'kept', 'kept', '1'], ['Inelastic', 'kept', 'partly lost', 'between 0 and 1'], ['Perfectly inelastic', 'kept', 'most lost; bodies stick', '0']]),
  }),

  predict(K(2, 2), 'A heavy ball hits a very light ball at rest, head-on and elastically. Predict how each moves afterwards.', 'The heavy ball carries on with almost its first speed.', 'The light ball moves off at nearly twice that speed, since v₂ = 2m₁u/(m₁ + m₂) ≈ 2u.'),
  predict(K(2, 2), 'Two equal balls moving at +3 m/s and −2 m/s collide head-on and elastically. Predict their velocities afterwards.', 'Equal masses in an elastic head-on collision swap velocities.', 'So they move at −2 m/s and +3 m/s.'),
  predict(K(2, 2), 'A ball is dropped from 1.0 m onto a floor, with a coefficient of restitution of 0.5. Predict the height it bounces to.', 'It leaves the floor at e times the speed it hit it, and height ∝ speed².', 'It rises to e² × 1.0 = 0.25 m.'),

  odd(K(2, 1), ['momentum', 'total energy', 'kinetic energy', 'mass'], 'kinetic energy', 'It isn’t kept in an inelastic collision; the others are kept in every collision.'),
  odd(K(2, 1), ['a bullet lodging in a block', 'two railway wagons coupling', 'a lump of clay hitting a wall', 'two billiard balls bouncing apart'], 'two billiard balls bouncing apart', 'It is nearly elastic; the others are perfectly inelastic, the bodies moving together after.'),
  odd(K(2, 2), ['e = 1', 'e = 0', 'e = 0.6', 'e = 1.5'], 'e = 1.5', 'It would mean more kinetic energy after than before, which can’t happen unless energy is released, as in an explosion; the others are ordinary collisions.'),

  long(K(5, 2), 'A 2 kg ball moving at 5 m/s hits a 3 kg ball at rest, head-on and elastically.\n(a) Find the velocity of the 2 kg ball after. [1]\n(b) Find the velocity of the 3 kg ball after. [1]\n(c) Check that momentum is kept. [1]\n(d) Check that kinetic energy is kept. [1]\n(e) If they had stuck together instead, how much kinetic energy would have been lost? [1]', '(a) v₁ = (m₁ − m₂)u/(m₁ + m₂) = (−1/5) × 5 = −1 m/s: it bounces back.', '(b) v₂ = 2m₁u/(m₁ + m₂) = (4/5) × 5 = 4 m/s.', '(c) Before 2 × 5 = 10; after 2 × (−1) + 3 × 4 = 10 kg m/s.', '(d) Before ½ × 2 × 25 = 25 J; after ½ × 2 × 1 + ½ × 3 × 16 = 1 + 24 = 25 J.', '(e) Common velocity 10/5 = 2 m/s, kinetic energy ½ × 5 × 4 = 10 J, so 15 J lost.'),
  long(K(5, 2), 'A bullet of mass 10 g moving at 400 m/s lodges in a 2.0 kg block hanging from strings. (g = 9.8 m/s².)\n(a) Find the velocity of the block and bullet just after. [2]\n(b) Find the height the block rises. [2]\n(c) What fraction of the bullet’s kinetic energy is lost? [1]', '(a) Momentum is kept: 0.010 × 400 = 2.01v.', '(a) v = 1.99 m/s.', '(b) ½v² = gh, so h = v²/2g = 1.99²/19.6.', '(b) = 0.20 m.', '(c) The fraction kept is m/(m + M) = 0.010/2.01, so 99.5% is lost.'),
  long(K(5, 3), 'A 2 kg ball moving at 3 m/s along the x-axis hits a 1 kg ball at rest. After, the 2 kg ball moves at √3 m/s at 30° above the x-axis.\n(a) What is kept in the collision? [1]\n(b) Find the x-part of the 1 kg ball’s velocity. [1]\n(c) Find its y-part. [1]\n(d) Find its speed and direction. [1]\n(e) Show that the collision is elastic. [1]', '(a) Momentum, along each axis separately.', '(b) 2 × 3 = 2√3 cos 30° + vx, so vx = 6 − 3 = 3 m/s.', '(c) 0 = 2√3 sin 30° + vy, so vy = −√3 m/s.', '(d) √(9 + 3) = 2√3 = 3.46 m/s, at 30° below the x-axis.', '(e) Before ½ × 2 × 9 = 9 J; after ½ × 2 × 3 + ½ × 1 × 12 = 3 + 6 = 9 J.'),

  tell(K(2, 2), 'Distinguish between an elastic collision in one dimension and one in two dimensions.', 'In one dimension the bodies move along one line before and after, and momentum and kinetic energy fix both final velocities.', 'In two dimensions they move off at angles, momentum is kept along each axis, and one more fact, such as one angle, is needed to fix the outcome.'),
  tell(K(2, 1), 'Distinguish between an inelastic and a perfectly inelastic collision.', 'In an inelastic collision some kinetic energy is lost, but the bodies separate: 0 < e < 1.', 'In a perfectly inelastic collision they stick together and move with a common velocity, losing the most kinetic energy: e = 0.'),

  match(K(4, 1), [['A perfectly elastic collision', 'e = 1'], ['A perfectly inelastic collision', 'e = 0'], ['A partly elastic collision', '0 < e < 1'], ['Equal masses, head-on and elastic', 'velocities swapped']]),
  match(K(4, 2), [['Velocity of m₁ after an elastic head-on collision with m₂ at rest', '(m₁ − m₂)u/(m₁ + m₂)'], ['Velocity of m₂ after the same collision', '2m₁u/(m₁ + m₂)'], ['Common velocity when they stick', 'm₁u/(m₁ + m₂)'], ['Coefficient of restitution', 'speed of separation/speed of approach']]),
  match(K(4, 2), [['A ball hitting a massive wall elastically', 'rebounds at the same speed'], ['A heavy body hitting a light one at rest, elastically', 'the light one moves off at nearly twice the speed'], ['A light body hitting a heavy one at rest, elastically', 'bounces back at nearly the same speed'], ['Equal bodies colliding elastically, not head-on, one at rest', 'move apart at 90°']]),

  ar(K(1, 1), 'In a perfectly inelastic collision the bodies move together afterwards.', 'Their coefficient of restitution is zero.', 1, 'e = 0 means no speed of separation: they move with a common velocity.'),
  ar(K(1, 1), 'Kinetic energy is kept in every collision.', 'Momentum is kept in every collision.', 4, 'Kinetic energy is kept only in elastic collisions.'),
  ar(K(1, 1), 'Momentum is kept in an inelastic collision.', 'Kinetic energy is kept in an inelastic collision.', 3, 'Some kinetic energy becomes heat, sound or the work of changing shape.'),

  derive(K(3, 2), 'A body of mass m₁ moving at u hits a body of mass m₂ at rest, and they stick together. Show that the fraction of kinetic energy lost is m₂/(m₁ + m₂).', ['Momentum is kept: m₁u = (m₁ + m₂)v, so v = m₁u/(m₁ + m₂).', 1], ['Kinetic energy after = ½(m₁ + m₂)v² = ½m₁²u²/(m₁ + m₂), which is m₁/(m₁ + m₂) of the first, ½m₁u².', 1], ['So the fraction lost is 1 − m₁/(m₁ + m₂) = m₂/(m₁ + m₂).', 1]),
];

export default questions;
