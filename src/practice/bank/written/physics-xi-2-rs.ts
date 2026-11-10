// Written by hand: kinematics, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('physics', 'XI');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why can a body’s distance travelled never be less than the size of its displacement?', 'Displacement is the shortest path between the two points, and any real path is at least that long.'),
  reason(A(2, 2), 'Why is the area under a velocity–time graph the displacement, and not the distance?', 'Each strip of area is v·Δt, which is the displacement in that short time.', 'Where v is negative, the area counts as negative, so the areas add as displacements do.'),
  reason(A(2, 2), 'A position–time graph can never be a vertical line. Why?', 'A vertical line would put the body at many places at one instant.', 'It would also need an infinite velocity, which is impossible.'),
  reason(A(1, 2), 'A ball thrown straight up has zero velocity at the top. Why isn’t its acceleration zero there?', 'Gravity still acts on it, so it keeps an acceleration g downwards, which starts it falling.'),
  reason(A(2, 3), 'Why do the equations v = u + at and s = ut + ½at² fail for a car whose acceleration changes?', 'They are found by assuming a constant acceleration.', 'With a varying one, v and s must come from integrating a(t).'),
  tell(A(2, 1), 'Distinguish between uniform and non-uniform motion, with an example of each.', 'Uniform: equal displacements in equal times, such as a car at a steady 60 km/h on a straight road.', 'Non-uniform: unequal displacements in equal times, such as a falling stone.'),
  short(A(2, 2), 'What does the slope of each of these give: a position–time graph and a velocity–time graph?', 'The slope of a position–time graph is the velocity.', 'The slope of a velocity–time graph is the acceleration.'),
  short(A(3, 2), 'Sketch, in words, the velocity–time graph of a ball thrown up and caught at the same height. Give its slope and the total area.', 'A straight line falling from +u through zero to −u.', 'Its slope is −g throughout.', 'The total area is zero, as the ball ends where it started.'),
  short(A(3, 3), 'Define instantaneous velocity. How is it found from a position–time graph, and how from x(t)?', 'The velocity at an instant: the limit of Δx/Δt as Δt goes to zero.', 'On a graph, it is the slope of the tangent at that instant.', 'From x(t), it is the derivative dx/dt.'),
  short(A(2, 3), 'What is a frame of reference? Why can two observers give different velocities for the same body?', 'A set of axes, with a clock, from which positions and times are measured.', 'Velocity is measured relative to the frame, so two frames moving apart give different values.'),
  reason(B(1, 1), 'Why is time a scalar, though it has a direction from past to future?', 'It has no direction in space, and times add as ordinary numbers.'),
  reason(B(2, 2), 'Why can’t two vectors of different sizes add up to zero?', 'For a zero sum, the second must be the exact opposite of the first.', 'That needs the same size, in the opposite direction.'),
  reason(B(2, 2), 'Why is the scalar product of two perpendicular vectors zero?', 'A·B = AB cos θ.', 'With θ = 90°, cos θ is zero.'),
  reason(B(2, 3), 'Why does a body in uniform circular motion accelerate, though its speed is steady?', 'Its velocity changes direction all the time.', 'A change of velocity is an acceleration, which points to the centre.'),
  reason(B(1, 2), 'Why is A × B not the same as B × A?', 'They have the same size, but opposite directions, as the right-hand rule shows.'),
  short(B(2, 1), 'Classify as scalar or vector: displacement, speed, momentum, work.', 'Vectors: displacement and momentum.', 'Scalars: speed and work.'),
  short(B(2, 2), 'What is a unit vector? Give the unit vector along the vector 3î + 4ĵ.', 'A vector of size one, which gives only a direction.', '(3î + 4ĵ)/5.'),
  short(B(3, 2), 'A projectile is fired from level ground. State what happens to its horizontal velocity, its vertical velocity and its acceleration during the flight.', 'The horizontal velocity stays the same throughout.', 'The vertical velocity falls to zero at the top, then grows downwards.', 'The acceleration is g downwards at every point.'),
  short(B(3, 3), 'Two angles of projection give the same range for the same speed. How are they related, and which gives the longer flight?', 'They add up to 90°, such as 30° and 60°.', 'R = u² sin 2θ / g, and sin 2θ is the same for both.', 'The steeper one stays up longer, as its vertical velocity is larger.'),
  tell(B(2, 3), 'Distinguish between the scalar and vector products of two vectors.', 'A scalar product A·B = AB cos θ is a number.', 'A vector product A × B has size AB sin θ, at right angles to both.'),
  short(A(2, 1), 'A car goes 3 km east and then 4 km north in 10 minutes. Find its distance travelled and its displacement.', 'Distance: 3 + 4 = 7 km.', 'Displacement: √(3² + 4²) = 5 km, at about 53° north of east.'),
  short(B(2, 1), 'State the condition for two vectors to be equal. Are 2î + 3ĵ and 3î + 2ĵ equal?', 'Two vectors are equal when they have the same size and the same direction.', 'No: they have the same size, √13, but point in different directions.'),
];

export default questions;
