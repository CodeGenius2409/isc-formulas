// Written by hand: Newton's laws and momentum, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('physics', 'XI');
const N = at(3, 'a');

const questions: BankDef[] = [
  figure(N(3, 2), 'The graph shows the force on a 0.2 kg ball, at rest at first, while it is struck. Find the impulse, the ball’s speed afterwards, and the average force.', ['Impulse = area under the graph = ½ × 0.04 × 100 = 2 N s.', 'Impulse = change in momentum, so 0.2v = 2 and v = 10 m/s.', 'Average force = impulse/time = 2/0.04 = 50 N.'], {
    shown: graph('time (s)', 'force (N)', [{ points: [[0, 0], [0.02, 100], [0.04, 0]] }], { x: [[0.02, '0.02'], [0.04, '0.04']], y: [[100, '100']] }),
  }),
  figure(N(2, 1), 'A block is pulled to the right along a rough horizontal floor by a horizontal force P. Draw its free-body diagram, naming every force.', ['Its weight mg acts downwards, and the floor’s normal reaction N acts upwards.', 'The pull P acts to the right, and friction f acts to the left, against the motion.'], {
    answer: sketch(320, 200, 'A block in the middle. An arrow down from it is the weight, mg. An arrow up from it is the normal reaction, N. An arrow to the right is the pull, P. An arrow to the left is friction, f.', [
      { t: 'box', x: 120, y: 75, w: 80, h: 50 },
      arrow([160, 125], [160, 185]), label(168, 172, 'mg', 'start'), arrow([160, 75], [160, 15]), label(168, 26, 'N', 'start'),
      arrow([200, 100], [280, 100]), label(282, 94, 'P', 'start'), arrow([120, 100], [40, 100]), label(38, 94, 'f', 'end'),
    ]),
  }),
  figure(N(3, 2), 'The graph shows the momentum of a body against time. Find the force acting on it, and say what the straight line tells you about the force.', ['By Newton’s second law, the force is the rate of change of momentum: the slope of the graph.', 'F = (10 − 2)/4 = 2 N.', 'The line is straight, so the slope, and so the force, is constant.'], {
    shown: graph('time (s)', 'momentum (kg m/s)', [{ points: [[0, 2], [4, 10]] }], { x: [[2, '2'], [4, '4']], y: [[2, '2'], [10, '10']] }),
  }),

  predict(N(2, 1), 'A passenger sits in a bus that turns sharply to the left. Predict which way the passenger leans, and why.', 'The passenger leans to the right, away from the turn.', 'By inertia of direction, the body tends to keep moving in a straight line while the bus turns under it.'),
  predict(N(2, 2), 'Two skaters at rest push each other apart. One has twice the mass of the other. Predict how their speeds compare, and why.', 'The lighter skater moves off twice as fast as the heavier, in the opposite direction.', 'Their total momentum stays zero, so m₁v₁ = m₂v₂, and the speeds are in the inverse ratio of the masses.'),
  predict(N(2, 2), 'The same force acts for the same time on a light body and a heavy one, both at rest. Predict how their momenta and their speeds compare.', 'Both gain the same momentum, as each gets the same impulse, F × t.', 'The light body moves faster, as v = p/m.'),

  odd(N(2, 1), ['N s', 'kg m/s', 'N', 'kg m s⁻¹'], 'N', 'It is a unit of force; the others are units of momentum or impulse.'),
  odd(N(2, 2), ['a passenger thrown forward when a bus stops', 'dust leaving a carpet that is beaten', 'a gun recoiling when fired', 'a coin dropping into a glass as the card under it is flicked away'], 'a gun recoiling when fired', 'It comes from the conservation of momentum; the others come from inertia.'),
  odd(N(2, 2), ['a gun recoiling', 'a rocket speeding up in space', 'two skaters pushing apart', 'a ball rolling to a stop on grass'], 'a ball rolling to a stop on grass', 'An outside force, friction, takes away its momentum; in the others the total momentum is conserved.'),

  long(N(5, 2), 'A bullet of mass 20 g leaves a 4 kg rifle at 300 m/s.\n(a) Find the speed at which the rifle recoils. [2]\n(b) Find the recoil speed if the rifle is held firmly against a shooter, so that rifle and shooter together have a mass of 74 kg. [1]\n(c) Why is the total momentum zero after firing? [2]', '(a) Momentum is conserved: 0.02 × 300 = 4 × v.', '(a) v = 6/4 = 1.5 m/s, backwards.', '(b) v = 6/74 = 0.081 m/s, which is why the rifle is held firmly.', '(c) Before firing, the rifle and bullet are at rest, so their total momentum is zero.', '(c) The forces in firing are internal, equal and opposite, so the total momentum stays zero: the bullet’s forward momentum equals the rifle’s backward momentum.'),
  long(N(5, 2), 'A ball of mass 0.15 kg comes towards a bat at 20 m/s and is hit straight back at 30 m/s. The bat is in contact with it for 0.01 s.\n(a) Find the impulse on the ball. [2]\n(b) Find the average force on it. [2]\n(c) Why does a fielder draw the hands back when catching? [1]', '(a) Taking the ball’s return direction as positive, its momentum changes from −0.15 × 20 to +0.15 × 30.', '(a) Impulse = 4.5 − (−3.0) = 7.5 N s.', '(b) F = impulse/time = 7.5/0.01.', '(b) = 750 N.', '(c) It makes the stopping time longer, so a smaller force gives the same change in momentum.'),
  long(N(5, 2), 'A person of mass 60 kg stands on a weighing scale in a lift. (g = 10 m/s²) Find the scale’s reading when the lift:\n(a) is at rest [1]\n(b) accelerates upwards at 2 m/s² [2]\n(c) moves downwards at a steady speed [1]\n(d) falls freely. [1]', '(a) R = mg = 600 N.', '(b) R − mg = ma, so R = m(g + a).', '(b) = 60 × 12 = 720 N.', '(c) There is no acceleration, so R = mg = 600 N.', '(d) a = g downwards, so R = m(g − g) = 0: the person feels weightless.'),

  tell(N(2, 1), 'Distinguish between momentum and impulse.', 'Momentum is the product of a body’s mass and velocity, p = mv, which it has at any moment.', 'Impulse is the product of a force and the time it acts, F × t, which equals the change in momentum it causes.'),
  tell(N(2, 1), 'Distinguish between inertia of rest and inertia of motion, with an example of each.', 'Inertia of rest: a body at rest stays at rest; a passenger falls back when a bus starts suddenly.', 'Inertia of motion: a moving body keeps moving; a passenger falls forward when a bus stops suddenly.'),
  tell(N(2, 1), 'Distinguish between balanced and unbalanced forces.', 'Balanced forces add up to zero, so they don’t change the body’s velocity.', 'Unbalanced forces have a resultant, which accelerates the body.'),

  match(N(4, 1), [['The first law', 'a body keeps its state of rest or uniform motion unless a net force acts'], ['The second law', 'force equals the rate of change of momentum'], ['The third law', 'action and reaction are equal and opposite'], ['The conservation of momentum', 'total momentum stays constant with no external force']]),
  match(N(4, 1), [['Momentum', 'kg m/s'], ['Force', 'N'], ['Impulse', 'N s'], ['Acceleration', 'm/s²']]),
  match(N(4, 2), [['A gun recoiling', 'the conservation of momentum'], ['A fielder drawing the hands back', 'a longer time, so a smaller force'], ['A passenger lurching forward as a bus brakes', 'inertia of motion'], ['Walking forward by pushing the ground back', 'the third law']]),

  ar(N(1, 1), 'Impulse and momentum have the same unit.', 'An impulse equals the change of momentum it produces.', 1, 'So N s and kg m/s are the same unit.'),
  ar(N(1, 1), 'A body moving at constant velocity must have a net force acting on it.', 'By Newton’s first law, a body keeps moving uniformly unless a net force acts.', 4, 'Uniform motion needs no net force; a net force would change the velocity.'),
  ar(N(1, 1), 'Momentum is a vector.', 'Mass is a scalar.', 2, 'Both are true, but momentum is a vector because velocity is one.'),
];

export default questions;
