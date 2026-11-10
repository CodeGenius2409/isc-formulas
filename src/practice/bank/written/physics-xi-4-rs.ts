// Written by hand: work, energy, power and collisions, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('physics', 'XI');
const A = at(4, 'a');
const B = at(4, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why is the work done by friction on a sliding box negative?', 'Friction acts opposite to the displacement, so cos θ = −1.'),
  reason(A(2, 2), 'Why is gravity called a conservative force?', 'The work it does between two points doesn’t depend on the path.', 'Round a closed path, it does no work at all.'),
  reason(A(2, 2), 'Why does a car use more fuel when it is driven up a hill at the same speed?', 'Its engine must do work against gravity, raising its potential energy.', 'That is besides the work against friction and air, so more power is needed.'),
  reason(A(2, 3), 'A light body and a heavy one have the same momentum. Why does the light one have more kinetic energy?', 'K = p²/2m.', 'With the same p, a smaller m gives a larger K.'),
  reason(A(1, 2), 'Why can’t kinetic energy ever be negative?', 'It is ½mv², and both m and v² are never negative.'),
  short(A(2, 1), 'Define one joule and one watt.', 'One joule is the work done by a force of one newton moving its point of action one metre along it.', 'One watt is a rate of work of one joule a second.'),
  short(A(2, 2), 'State the work–energy theorem, and say what it means for a body whose speed stays the same.', 'The work done by all the forces on a body equals its change in kinetic energy.', 'If the speed doesn’t change, the net work done on it is zero.'),
  short(A(3, 2), 'Give the potential energy of a spring of constant k stretched by x. Why is it the area under the force–extension graph?', 'U = ½kx².', 'The work done is ∫F dx, which is the area under the graph.', 'The graph is a straight line through the origin, so the area is a triangle, ½ · x · kx.'),
  short(A(3, 3), 'A stone falls freely from rest. Describe how its kinetic, potential and total energy change as it falls, ignoring air.', 'Its potential energy falls steadily as its height falls.', 'Its kinetic energy rises by the same amount.', 'So its total mechanical energy stays the same throughout.'),
  short(A(2, 3), 'Show that power can be written as P = Fv for a constant force along the motion.', 'P = dW/dt = F ds/dt.', 'ds/dt = v, so P = Fv.'),
  reason(B(1, 1), 'Why is momentum kept in every collision, though kinetic energy often isn’t?', 'The forces between the bodies are internal, equal and opposite, so the total momentum can’t change.'),
  reason(B(2, 2), 'Why do two equal balls swap speeds when they collide head-on and elastically?', 'Both momentum and kinetic energy are kept.', 'For equal masses, the only answer that does both is a swap of velocities.'),
  reason(B(2, 2), 'Why does a ball dropped on the floor never bounce back to the height it fell from?', 'The collision with the floor isn’t perfectly elastic.', 'Some kinetic energy turns into heat, sound and lasting deformation.'),
  reason(B(2, 3), 'Why is the loss of kinetic energy greatest when two bodies stick together after colliding?', 'They move off with the velocity of the centre of mass.', 'The kinetic energy of motion relative to the centre of mass, which is all that can be lost, is then all gone.'),
  reason(B(1, 2), 'A light ball hits a heavy wall elastically. Why does it come back with almost the same speed?', 'The wall barely moves, so it takes almost no energy, and the ball keeps nearly all of it.'),
  tell(B(2, 1), 'Distinguish between an elastic and an inelastic collision in terms of what is kept.', 'In an elastic collision, both momentum and kinetic energy are kept.', 'In an inelastic collision, momentum is kept but some kinetic energy is lost.'),
  short(B(2, 2), 'Define the coefficient of restitution. What is its value for a perfectly elastic and a perfectly inelastic collision?', 'e is the speed of separation divided by the speed of approach.', 'e = 1 for perfectly elastic, and e = 0 for perfectly inelastic.'),
  short(B(3, 2), 'A ball of mass m hits an equal ball at rest, and they stick. Find their speed after, and the fraction of kinetic energy lost.', 'mu = 2mv, so v = u/2.', 'Kinetic energy after = ½(2m)(u/2)² = ¼mu².', 'That is half of ½mu², so half the kinetic energy is lost.'),
  short(B(3, 3), 'In a two-dimensional collision, state what is kept along each axis. Why are the two equations of momentum not enough to fix the outcome?', 'Momentum is kept along x, and separately along y.', 'If elastic, kinetic energy is kept too.', 'There are four unknowns, the two speeds and two angles, so one more fact, such as one angle, is needed.'),
  short(B(2, 3), 'Two equal balls collide elastically, one at rest, but not head-on. At what angle do they move apart?', 'At 90° to each other.', 'Keeping both momentum and energy makes v₁² + v₂² = u², which needs the velocities at right angles.'),
];

export default questions;
