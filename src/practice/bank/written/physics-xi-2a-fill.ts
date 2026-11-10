// Written by hand: motion in a straight line, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { graph, label, line, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const S = at(2, 'a');

/** Small axes with the origin at (x, 140), 90 px wide and 110 px tall, named as given. */
const mini = (x: number, y: string): SketchMark[] => [line([[x, 140], [x, 24]], { arrow: 1 }), line([[x, 140], [x + 95, 140]], { arrow: 1 }), label(x + 6, 24, y, 'start'), label(x + 95, 158, 't', 'end')];

const questions: BankDef[] = [
  figure(S(3, 1), 'The graph shows the position of a body against time. Find its velocity in each of the three stages, and its average speed and average velocity over the 6 s.', ['0–2 s: 10/2 = 5 m/s; 2–4 s: 0, at rest; 4–6 s: −10/2 = −5 m/s, coming back.', 'It goes 10 m out and 10 m back, so its average speed is 20/6 = 3.3 m/s.', 'It ends where it began, so its displacement and average velocity are zero.'], {
    shown: graph('time (s)', 'position (m)', [{ points: [[0, 0], [2, 10], [4, 10], [6, 0]] }], { x: [[2, '2'], [4, '4'], [6, '6']], y: [[10, '10']] }),
  }),
  figure(S(3, 1), 'The graph shows the velocity of a car against time. Find its acceleration and its retardation, and the distance it covers in the 14 s.', ['Acceleration = 20/4 = 5 m/s², over the first 4 s.', 'Retardation = 20/4 = 5 m/s², over the last 4 s.', 'Distance = area under the graph = ½ × 4 × 20 + 6 × 20 + ½ × 4 × 20 = 40 + 120 + 40 = 200 m.'], {
    shown: graph('time (s)', 'velocity (m/s)', [{ points: [[0, 0], [4, 20], [10, 20], [14, 0]] }], { x: [[4, '4'], [10, '10'], [14, '14']], y: [[20, '20']] }),
  }),
  figure(S(3, 2), 'A body is dropped from rest. Taking downwards as positive, sketch its distance fallen, velocity and acceleration against time, ignoring air.', ['Distance fallen against time is a parabola curving upwards, as s = ½gt².', 'Velocity against time is a straight line through the origin, of slope g, as v = gt.', 'Acceleration against time is a horizontal line at g, as the acceleration is constant.'], {
    answer: sketch(350, 170, 'Three small graphs side by side, each against time. The first, distance, is a curve starting flat at the origin and bending upwards. The second, velocity, is a straight line rising from the origin. The third, acceleration, is a horizontal line above the time axis, marked g.', [
      ...mini(20, 'distance'), { t: 'path', d: 'M20 140 Q 80 140, 110 40' },
      ...mini(135, 'velocity'), line([[135, 140], [225, 40]]),
      ...mini(250, 'acceleration'), line([[250, 90], [340, 90]]), label(262, 84, 'g', 'start'),
    ]),
  }),

  predict(S(2, 1), 'A ball is thrown straight up at 20 m/s. Taking g = 10 m/s², predict how long it takes to reach the top, and to come back to the hand.', 'At the top v = 0, so 0 = 20 − 10t and t = 2 s.', 'Going down takes as long as going up, so it is back after 4 s.'),
  predict(S(2, 2), 'Two stones are dropped from the same high point, one 1 s after the other. Predict whether the gap between them stays the same while both fall, and why.', 'The gap grows.', 'Both gain speed at the same rate, but the first is always 10 m/s faster, so it pulls further ahead each second.'),
  predict(S(2, 1), 'A car’s velocity–time graph is a horizontal line above the time axis. Predict its acceleration, and the shape of its position–time graph.', 'Its acceleration is zero, as its velocity doesn’t change.', 'Its position–time graph is a straight sloping line, as it covers equal distances in equal times.'),

  odd(S(2, 1), ['speed', 'distance', 'velocity', 'time'], 'velocity', 'It is a vector; the others are scalars.'),
  odd(S(2, 1), ['m/s', 'km/h', 'm/s²', 'cm/s'], 'm/s²', 'It is a unit of acceleration; the others are units of speed.'),
  odd(S(2, 2), ['the slope of a position–time graph', 'a speedometer reading', 'the slope of a velocity–time graph', 'dx/dt'], 'the slope of a velocity–time graph', 'It gives acceleration; the others give velocity or speed.'),

  long(S(5, 2), 'A stone is thrown straight up at 15 m/s from the top of a tower 20 m high. (g = 10 m/s²)\n(a) Find the greatest height it reaches above the ground. [2]\n(b) Find how long it takes to reach the ground. [2]\n(c) Find its speed as it hits the ground. [1]', '(a) It rises u²/2g = 225/20 = 11.25 m above the top.', '(a) So it reaches 20 + 11.25 = 31.25 m above the ground.', '(b) Taking up as positive, −20 = 15t − 5t², so t² − 3t − 4 = 0.', '(b) (t − 4)(t + 1) = 0, so t = 4 s.', '(c) v = 15 − 10 × 4 = −25 m/s, so it hits the ground at 25 m/s.'),
  long(S(5, 2), 'The position of a body is x = 3t² − 2t³, in metres, with t in seconds.\n(a) Find its velocity and acceleration at time t. [2]\n(b) When, after t = 0, is it momentarily at rest? [1]\n(c) Find its position and acceleration at that moment. [2]', '(a) v = dx/dt = 6t − 6t².', '(a) a = dv/dt = 6 − 12t.', '(b) v = 6t(1 − t) = 0 at t = 1 s.', '(c) x = 3 − 2 = 1 m.', '(c) a = 6 − 12 = −6 m/s².'),
  long(S(5, 2), 'A car moving at 72 km/h brakes uniformly and stops in 40 m.\n(a) Find its retardation. [2]\n(b) Find the time it takes to stop. [1]\n(c) If it had been moving twice as fast, with the same retardation, how far would it travel before stopping? [2]', '(a) 72 km/h = 20 m/s, and 0 = 20² − 2a × 40.', '(a) a = 400/80 = 5 m/s².', '(b) t = 20/5 = 4 s.', '(c) The stopping distance is u²/2a, which goes as u².', '(c) Doubling u makes it four times as far: 160 m.'),

  tell(S(2, 1), 'Distinguish between the position–time graph and the velocity–time graph of a body in uniform motion.', 'The position–time graph is a straight sloping line, whose slope is the velocity.', 'The velocity–time graph is a horizontal line, as the velocity doesn’t change.'),
  tell(S(2, 2), 'Distinguish between acceleration in the direction of motion and acceleration against it, for a moving car.', 'Acceleration in the direction of the velocity makes the car go faster.', 'Acceleration against the velocity, retardation, makes it slow down.'),

  match(S(4, 1), [['The slope of a position–time graph', 'velocity'], ['The slope of a velocity–time graph', 'acceleration'], ['The area under a velocity–time graph', 'displacement'], ['The area under an acceleration–time graph', 'change in velocity']]),
  match(S(4, 2), [['v = u + at', 'velocity and time'], ['s = ut + ½at²', 'displacement and time'], ['v² = u² + 2as', 'velocity and displacement'], ['s = ½(u + v)t', 'displacement with the average of the two velocities']]),
  match(S(4, 2), [['A position–time graph that is a horizontal line', 'at rest'], ['A position–time graph that is a straight sloping line', 'uniform velocity'], ['A position–time graph that is a parabola curving upwards', 'uniform acceleration from rest'], ['A velocity–time graph sloping down to the time axis', 'slowing uniformly to rest']]),

  ar(S(1, 1), 'A body moving at constant speed in a straight line has no acceleration.', 'Its velocity doesn’t change.', 1, 'Acceleration is the rate of change of velocity, which is zero here.'),
  ar(S(1, 1), 'The slope of a position–time graph gives the acceleration.', 'The slope of a velocity–time graph gives the acceleration.', 4, 'The slope of a position–time graph gives the velocity.'),
  ar(S(1, 2), 'A body can have zero velocity at an instant and still be accelerating.', 'Displacement is a vector.', 2, 'Both are true, but the reason is that velocity can be changing even as it passes through zero, as at the top of a throw.'),

  derive(S(3, 2), 'Starting from a = dv/dt, use calculus to derive v² = u² + 2as for constant acceleration.', ['a = dv/dt = (dv/dx)(dx/dt) = v dv/dx, so v dv = a dx.', 1], ['Integrating from u to v and from 0 to s: ∫v dv = ∫a dx, so ½v² − ½u² = as.', 1], ['So v² = u² + 2as.', 1]),
];

export default questions;
