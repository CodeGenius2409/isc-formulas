// Written by hand: oscillations, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The displacement–time graph is x = 4 sin(πt) cm: amplitude 4 cm, period 2 s.
import { at, kit, type BankDef } from '../define';
import { graph, plot } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('physics', 'XI');
const O = at(10, 'a');

const questions: BankDef[] = [
  figure(O(3, 2), 'The graph shows the displacement of a particle in SHM against time. Find its amplitude, period and frequency, and its greatest speed.', ['The amplitude is 4 cm, and the period is 2 s.', 'The frequency is 1/2 = 0.5 Hz, so ω = 2π × 0.5 = π rad/s.', 'The greatest speed is ωA = π × 4 = 12.6 cm/s, at the mean position.'], {
    shown: graph('time (s)', 'displacement (cm)', [{ points: plot((t) => 4 * Math.sin(Math.PI * t), 0, 4, 60) }], { x: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], y: [[4, '4'], [-4, '−4']], yFrom: -5 }),
  }),
  figure(O(2, 2), 'Sketch, on the same axes, the displacement and the velocity of a particle in SHM against time, over one period, starting from the mean position.', ['The displacement is a sine curve, x = A sin ωt, starting at zero.', 'The velocity is a cosine curve, starting at its greatest value: it is a quarter of a period, π/2, ahead of the displacement.'], {
    answer: graph('time', 'x and v', [{ label: 'x', points: plot((t) => Math.sin(t), 0, 2 * Math.PI, 40) }, { label: 'v', points: plot((t) => Math.cos(t), 0, 2 * Math.PI, 40) }], { yFrom: -1.2 }),
  }),
  figure(O(2, 1), 'Sketch a graph of the acceleration of a particle in SHM against its displacement, and say what its slope gives.', ['A straight line through the origin with a negative slope, as a = −ω²x.', 'The size of the slope is ω², from which the period, 2π/ω, can be found.'], {
    answer: graph('displacement x', 'acceleration a', [{ points: [[-1, 1], [1, -1]] }], { x: [[-1, '−A'], [1, 'A']], y: [[1, 'ω²A'], [-1, '−ω²A']], xFrom: -1.2, yFrom: -1.2 }),
  }),

  predict(O(2, 2), 'A simple pendulum has a period of 2.0 s on the Earth. Predict its period on the Moon, where g is one sixth as large.', 'T = 2π√(l/g), so T ∝ 1/√g.', 'T = 2.0 × √6 = 4.9 s.'),
  predict(O(2, 2), 'The amplitude of a mass on a spring is doubled. Predict what happens to its period and to its total energy.', 'The period is unchanged, as 2π√(m/k) doesn’t depend on amplitude.', 'The total energy, ½kA², becomes 4 times as large.'),
  predict(O(2, 1), 'The mass hung on a spring is made 4 times as large. Predict what happens to the period.', 'T = 2π√(m/k), so T ∝ √m.', 'The period doubles.'),

  odd(O(2, 1), ['a pendulum making small swings', 'a mass bobbing on a spring', 'a ball bouncing on the floor', 'a prong of a tuning fork'], 'a ball bouncing on the floor', 'It is periodic, but not SHM, as the force on it isn’t proportional to its displacement; the others are SHM.'),
  odd(O(2, 2), ['sin ωt', 'cos ωt', 'sin ωt + cos ωt', 'e^(−ωt)'], 'e^(−ωt)', 'It isn’t periodic; the others are periodic, and each describes an SHM.'),
  odd(O(2, 1), ['displacement', 'velocity', 'acceleration', 'period'], 'period', 'It stays the same throughout the motion; the others keep changing.'),

  long(O(5, 2), 'A 0.50 kg mass on a spring of force constant 200 N/m oscillates with an amplitude of 0.10 m.\n(a) Find the period. [1]\n(b) Find the greatest speed. [1]\n(c) Find the total energy. [1]\n(d) Find the speed when the displacement is 0.06 m. [1]\n(e) Find the greatest acceleration. [1]', '(a) ω = √(k/m) = √400 = 20 rad/s, so T = 2π/20 = 0.31 s.', '(b) ωA = 20 × 0.10 = 2.0 m/s.', '(c) ½kA² = ½ × 200 × 0.10² = 1.0 J.', '(d) v = ω√(A² − x²) = 20 × √(0.010 − 0.0036) = 1.6 m/s.', '(e) ω²A = 400 × 0.10 = 40 m/s².'),
  long(O(5, 2), 'Take g = 9.8 m/s².\n(a) Find the length of a pendulum with a period of 2.0 s. [2]\n(b) What is its period if its length is made 4 times as large? [1]\n(c) By what percentage does the period change if the length is increased by 21%? [2]', '(a) l = gT²/4π².', '(a) = 9.8 × 4/39.5 = 0.99 m.', '(b) T ∝ √l, so it doubles, to 4.0 s.', '(c) T ∝ √l: √1.21 = 1.1.', '(c) The period rises by 10%.'),
  long(O(5, 2), 'A particle moves with displacement x = 0.05 sin(10t + π/6), in metres, with t in seconds.\n(a) Find its amplitude, angular frequency, frequency and period. [2]\n(b) Give its initial phase, and its displacement at t = 0. [1]\n(c) Find its greatest speed and greatest acceleration. [2]', '(a) A = 0.05 m and ω = 10 rad/s.', '(a) f = 10/2π = 1.6 Hz, and T = 2π/10 = 0.63 s.', '(b) π/6; x = 0.05 sin(π/6) = 0.025 m.', '(c) Greatest speed = ωA = 0.5 m/s.', '(c) Greatest acceleration = ω²A = 5 m/s².'),

  tell(O(2, 1), 'Distinguish between periodic and oscillatory motion, with an example of each.', 'Periodic motion repeats itself after equal intervals of time, as in the Earth going round the Sun.', 'Oscillatory motion is periodic motion to and fro about a mean position, as in a swinging pendulum; all oscillations are periodic, but not all periodic motions are oscillations.'),
  tell(O(2, 1), 'Distinguish between displacement and amplitude in SHM.', 'Displacement is the distance of the particle from the mean position at a given moment; it keeps changing.', 'Amplitude is the greatest displacement, which stays the same in undamped SHM.'),
  tell(O(2, 2), 'Distinguish between the phase and the initial phase (phase constant) of a particle in SHM, x = A sin(ωt + φ).', 'The phase, ωt + φ, gives the state of motion, position and direction, at time t; it keeps changing.', 'The initial phase, φ, is the phase at t = 0, fixed by where the motion starts.'),

  match(O(4, 1), [['Period of a mass on a spring', '2π√(m/k)'], ['Period of a simple pendulum', '2π√(l/g)'], ['Greatest speed in SHM', 'ωA'], ['Greatest acceleration in SHM', 'ω²A']]),
  match(O(4, 1), [['At the mean position', 'speed greatest, acceleration zero'], ['At an extreme position', 'speed zero, acceleration greatest'], ['The total energy', 'the same at every point'], ['The potential energy', 'greatest at the extremes']]),
  match(O(4, 2), [['Phase difference between displacement and acceleration', 'π'], ['Period of a seconds pendulum', '2 s'], ['Frequency', 'number of oscillations per second'], ['Force constant of a spring', 'force per unit extension']]),

  ar(O(1, 2), 'For small swings, the period of a simple pendulum doesn’t depend on its amplitude.', 'For small angles, sin θ ≈ θ, so the restoring force is proportional to the displacement.', 1, 'A restoring force proportional to the displacement gives SHM, whose period doesn’t depend on amplitude.'),
  ar(O(1, 1), 'In SHM, the kinetic energy is greatest at the extreme positions.', 'The total energy stays constant.', 4, 'The kinetic energy is greatest at the mean position, and zero at the extremes.'),
  ar(O(1, 2), 'A mass hanging on a vertical spring moves with SHM when pulled down and let go.', 'Gravity acts on the mass.', 2, 'Both are true, but it is SHM because the net force about the new equilibrium position is −kx; gravity only shifts that position.'),
];

export default questions;
