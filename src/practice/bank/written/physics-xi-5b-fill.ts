// Written by hand: torque, angular momentum and the equilibrium of rigid bodies, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The ω–t graph rises steadily from 0 to 20 rad/s in 4 s.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const T = at(5, 'b');

const questions: BankDef[] = [
  figure(T(3, 2), 'A uniform metre rule of mass 100 g balances on a knife edge at its 50 cm mark, with a 60 g mass hung at 20 cm and an unknown mass at 70 cm, as shown. Find the unknown mass and the force on the knife edge.', ['The rule’s own weight acts at 50 cm, through the knife edge, so it has no moment about it.', 'Moments about the knife edge: 60 × 30 = m × 20, so m = 90 g.', 'The knife edge holds up everything: 60 + 100 + 90 = 250 g weight, about 2.45 N.'], {
    shown: sketch(320, 150, 'A horizontal metre rule on a triangular knife edge at its middle, the 50 cm mark. A 60 g mass hangs at the 20 cm mark, and a mass m hangs at the 70 cm mark.', [
      { t: 'box', x: 20, y: 60, w: 280, h: 10 }, { t: 'path', d: 'M160 70 L148 94 L172 94 Z' },
      line([[76, 70], [76, 100]]), { t: 'box', x: 64, y: 100, w: 24, h: 20 }, label(76, 136, '60 g'),
      line([[216, 70], [216, 100]]), { t: 'box', x: 204, y: 100, w: 24, h: 20 }, label(216, 136, 'm'),
      label(76, 52, '20 cm'), label(160, 52, '50 cm'), label(216, 52, '70 cm'),
    ]),
  }),
  figure(T(2, 2), 'Draw a force F acting at a point whose position from an axis O is r, at an angle θ to r, and show the direction of the torque τ = r × F.', ['τ = rF sin θ, where r sin θ is the perpendicular distance from O to the line of F.', 'τ is at right angles to both r and F, here out of the page, by the right-hand rule.'], {
    answer: sketch(300, 200, 'A point O with an arrow r drawn from it to a point P. From P, an arrow F points at an angle θ to the line of r. At O, a dot in a circle shows the torque pointing out of the page. A dashed line from O meets the line of F at right angles, marked r sin θ.', [
      { t: 'circle', x: 50, y: 150, r: 8 }, { t: 'dot', x: 50, y: 150 }, label(4, 128, 'τ out of page', 'start'),
      arrow([58, 146], [170, 100]), label(110, 112, 'r', 'end'),
      arrow([170, 100], [220, 30]), label(226, 30, 'F', 'start'), line([[170, 100], [230, 75]], { dash: 1 }), label(196, 98, 'θ', 'start'),
      line([[170, 100], [106, 190]], { dash: 1 }), line([[50, 150], [106, 190]], { dash: 1 }), label(112, 194, 'r sin θ', 'start'),
    ]),
  }),
  figure(T(3, 2), 'The graph shows the angular velocity of a wheel, of moment of inertia 2.0 kg m², against time. Find its angular acceleration, the angle it turns through in 4 s, and the torque on it.', ['α = gradient = 20/4 = 5.0 rad/s².', 'θ = area under the graph = ½ × 4 × 20 = 40 rad.', 'τ = Iα = 2.0 × 5.0 = 10 N m.'], {
    shown: graph('time (s)', 'angular velocity (rad/s)', [{ points: [[0, 0], [4, 20]] }], { x: [[2, '2'], [4, '4']], y: [[10, '10'], [20, '20']] }),
  }),

  predict(T(2, 2), 'If the polar ice caps melted and the water spread towards the equator, predict what would happen to the length of a day.', 'More of the Earth’s mass would be further from its axis, so its moment of inertia would rise.', 'With no outside torque, Iω stays the same, so ω would fall and the day would get a little longer.'),
  predict(T(2, 1), 'A force on a door is moved from 0.4 m to 0.8 m from the hinges, at right angles to the door. Predict how its torque changes.', 'τ = rF, so it doubles.', 'The door is easier to turn: half the force gives the same torque.'),
  predict(T(2, 1), 'A force of 10 N acts along a line that passes through a body’s axis of rotation. Predict its torque about the axis.', 'Zero.', 'Its perpendicular distance from the axis is zero, so it can’t turn the body.'),

  odd(T(2, 2), ['torque', 'angular momentum', 'angular velocity', 'moment of inertia'], 'moment of inertia', 'At this level it is treated as a scalar; the others are vectors along the axis.'),
  odd(T(2, 2), ['kg m² s⁻¹', 'J s', 'N m s', 'N m'], 'N m', 'It is a unit of torque; the others are units of angular momentum.'),
  odd(T(2, 1), ['a spinning skater pulling in the arms', 'a diver tucking in', 'a planet speeding up near the Sun', 'a car braking on a straight road'], 'a car braking on a straight road', 'It isn’t an example of the conservation of angular momentum; the others are.'),

  long(T(5, 2), 'A flywheel of moment of inertia 0.50 kg m² starts from rest, with a constant torque of 2.0 N m on it for 5.0 s.\n(a) Find its angular acceleration. [1]\n(b) Find its angular velocity after 5.0 s. [1]\n(c) Find the angle it turns through. [1]\n(d) Find its kinetic energy then. [1]\n(e) Show that this equals the work done by the torque. [1]', '(a) α = τ/I = 2.0/0.50 = 4.0 rad/s².', '(b) ω = αt = 4.0 × 5.0 = 20 rad/s.', '(c) θ = ½αt² = ½ × 4.0 × 25 = 50 rad.', '(d) ½Iω² = ½ × 0.50 × 400 = 100 J.', '(e) Work = τθ = 2.0 × 50 = 100 J.'),
  long(T(5, 3), 'A disc of moment of inertia 0.20 kg m² spins at 10 rad/s about a vertical axis. A second disc, of moment of inertia 0.30 kg m², at rest, is dropped onto it on the same axis, and they spin together.\n(a) Find their common angular velocity. [2]\n(b) Find the kinetic energy before and after. [2]\n(c) Why is kinetic energy lost? [1]', '(a) No outside torque, so angular momentum is kept: 0.20 × 10 = (0.20 + 0.30)ω.', '(a) ω = 4.0 rad/s.', '(b) Before: ½ × 0.20 × 10² = 10 J.', '(b) After: ½ × 0.50 × 4² = 4.0 J, so 6.0 J is lost.', '(c) Friction between the discs, while they slip before turning together, changes it into heat.'),
  long(T(5, 2), 'A uniform beam 4.0 m long, of weight 200 N, rests on supports at its two ends, A and B. A load of 400 N sits 1.0 m from A.\n(a) State the two conditions for the beam to be in equilibrium. [1]\n(b) Find the force at B. [2]\n(c) Find the force at A. [1]\n(d) Where must the load be for the two forces to be equal? [1]', '(a) The net force on it is zero, and the net torque about any point is zero.', '(b) Torques about A: R(B) × 4.0 = 200 × 2.0 + 400 × 1.0.', '(b) R(B) = 800/4.0 = 200 N.', '(c) R(A) = 200 + 400 − 200 = 400 N.', '(d) At the middle, 2.0 m from each end.'),

  tell(T(2, 1), 'Distinguish between torque and angular momentum.', 'Torque, τ = r × F, is the turning effect of a force, in N m; it changes a body’s rotation.', 'Angular momentum, L = r × p, or Iω, is the quantity of rotation a body has, in kg m² s⁻¹; torque is its rate of change.'),
  tell(T(2, 1), 'Distinguish between translational and rotational equilibrium.', 'A body is in translational equilibrium when the net force on it is zero, so its centre of mass doesn’t accelerate.', 'It is in rotational equilibrium when the net torque on it is zero, so its angular velocity doesn’t change.'),
  tell(T(2, 1), 'Distinguish between angular velocity and angular acceleration.', 'Angular velocity ω is the rate of change of angle, in rad/s.', 'Angular acceleration α is the rate of change of angular velocity, in rad/s².'),

  match(T(4, 1), [['τ = Iα', 'F = ma'], ['L = Iω', 'p = mv'], ['½Iω²', '½mv²'], ['ω = ω₀ + αt', 'v = u + at']]),
  match(T(4, 2), [['Torque', 'r × F'], ['Angular momentum of a particle', 'r × p'], ['Rate of change of angular momentum', 'the net torque'], ['Work done by a constant torque', 'τθ']]),
  match(T(4, 1), [['A spinning skater pulling in the arms', 'spins faster'], ['A diver opening out', 'turns more slowly'], ['A wheel with a constant torque on it', 'speeds up uniformly'], ['A body with zero net force and zero net torque', 'is in equilibrium']]),

  ar(T(1, 1), 'A long spanner makes it easier to turn a tight nut.', 'A longer arm gives a larger torque for the same force.', 1, 'τ = rF, so a larger r needs a smaller F.'),
  ar(T(1, 2), 'Torque and work have the same unit, so they are the same kind of quantity.', 'Each is formed from a force and a distance.', 4, 'Torque is a vector, the cross product of r and F; work is a scalar, the dot product of F and the displacement.'),
  ar(T(1, 2), 'A ceiling fan keeps turning for a while after it is switched off.', 'Angular momentum is a vector.', 2, 'Both are true, but the fan keeps turning because of its rotational inertia; only the small torque of friction slows it.'),

  derive(T(3, 2), 'Show that τ = Iα for a rigid body turning about a fixed axis.', ['A particle of mass m at distance r from the axis has a tangential acceleration rα, so the tangential force on it is mrα.', 1], ['Its torque about the axis is r × mrα = mr²α.', 1], ['Adding for all particles, τ = (Σmr²)α = Iα; internal torques cancel in pairs.', 1]),
  derive(T(3, 1), 'Show that the angular momentum of a rigid body turning about a fixed axis is L = Iω.', ['A particle of mass m at distance r moves at v = rω, at right angles to r.', 1], ['Its angular momentum is r × mv = mr²ω.', 1], ['Adding for all particles, L = (Σmr²)ω = Iω.', 1]),
  derive(T(3, 2), 'Show that the work done by a constant torque τ turning a body through an angle θ is τθ, and that it equals the change in ½Iω².', ['A force F at radius r moves its point through an arc r dθ, doing work F r dθ = τ dθ; for constant τ, W = τθ.', 1], ['τ = Iα = Iω dω/dθ, so τ dθ = Iω dω.', 1], ['Integrating, W = ½Iω₂² − ½Iω₁², the change in rotational kinetic energy.', 1]),
];

export default questions;
