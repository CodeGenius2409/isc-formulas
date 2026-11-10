// Written by hand: work, energy and power, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { graph, label, line, plot, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const E = at(4, 'a');

const questions: BankDef[] = [
  figure(E(3, 1), 'The graph shows the force needed to stretch a spring against its extension. Find the spring constant, the work done in stretching it by 10 cm, and the extra work needed to go from 5 cm to 10 cm.', ['k = F/x = 20/0.10 = 200 N/m.', 'Work = area under the graph = ½ × 0.10 × 20 = 1.0 J.', 'From 5 cm to 10 cm: ½k(0.10² − 0.05²) = 100 × 0.0075 = 0.75 J.'], {
    shown: graph('extension (m)', 'force (N)', [{ points: plot((x) => 200 * x, 0, 0.1, 10) }], { x: [[0.05, '0.05'], [0.1, '0.10']], y: [[10, '10'], [20, '20']] }),
  }),
  figure(E(3, 2), 'The graph shows a varying force acting along the path of a 2 kg body, which starts from rest on a smooth surface. Find the work done by the force over the 6 m, and the body’s speed at the end.', ['Work = area under the graph = ½ × 2 × 10 + 2 × 10 + ½ × 2 × 10.', '= 10 + 20 + 10 = 40 J.', 'By the work–energy theorem, ½ × 2 × v² = 40, so v = √40 = 6.3 m/s.'], {
    shown: graph('displacement (m)', 'force (N)', [{ points: [[0, 0], [2, 10], [4, 10], [6, 0]] }], { x: [[2, '2'], [4, '4'], [6, '6']], y: [[10, '10']] }),
  }),
  figure(E(3, 2), 'A body falls freely from a height H. Sketch, on one set of axes, its potential energy, kinetic energy and total energy against its height above the ground, ignoring air.', ['The potential energy, mgh, is a straight line rising with height, from 0 at the ground to mgH at the top.', 'The kinetic energy, mg(H − h), is a straight line falling with height, from mgH at the ground to 0 at the top.', 'The total energy is a horizontal line at mgH, as mechanical energy is conserved.'], {
    // Origin (50, 180); the height runs from 0 to H over 220 px, and the energy from 0 to mgH over 140 px.
    answer: sketch(320, 215, 'Axes: energy upwards, height above the ground to the right. A straight line for potential energy rises from zero at the ground to mgH at height H. A dashed straight line for kinetic energy falls from mgH at the ground to zero at height H. A horizontal line at mgH is the total energy.', [
      line([[50, 180], [50, 12]], { arrow: 1 }), line([[50, 180], [305, 180]], { arrow: 1 }), label(58, 18, 'energy', 'start'), label(305, 208, 'height above the ground', 'end'),
      line([[50, 180], [270, 40]]), line([[50, 40], [270, 180]], { dash: 1 }), line([[50, 40], [270, 40]]),
      label(44, 44, 'mgH', 'end'), label(270, 196, 'H'), label(160, 32, 'total energy'),
      label(60, 100, 'kinetic', 'start'), label(180, 120, 'potential', 'start'),
    ]),
  }),

  predict(E(2, 1), 'A ball is dropped and bounces back to only 60% of the height it fell from. Predict where the rest of its energy went.', '40% of its mechanical energy wasn’t returned.', 'It went into heat and sound, and into the brief squashing of the ball, through non-conservative forces.'),
  predict(E(2, 2), 'The same box is pushed up a steep smooth ramp and a gentle smooth ramp to the same height. Predict how the work done compares, and why.', 'The work done is the same, mgh, on both ramps.', 'Gravity is conservative, so the work depends only on the rise in height; the gentle ramp needs a smaller force over a longer distance.'),
  predict(E(2, 1), 'The extension of a spring is doubled. Predict what happens to the energy stored in it.', 'It becomes four times as large.', 'The energy is ½kx², which goes as the square of the extension.'),

  odd(E(2, 2), ['gravity on a satellite in a circular orbit', 'the tension on a stone whirled in a horizontal circle', 'the upward push on a book carried along a level corridor', 'gravity on a ball thrown upwards, while it rises'], 'gravity on a ball thrown upwards, while it rises', 'It does negative work, as it acts against the motion; the other forces are at right angles to the motion and do no work.'),
  odd(E(2, 1), ['lifting a box', 'gravity on a falling stone', 'friction on a sliding block', 'pushing a pram forward'], 'friction on a sliding block', 'It does negative work; the others do positive work.'),
  odd(E(2, 1), ['½mv²', 'mgh', '½kx²', 'Fv'], 'Fv', 'It is a power; the others are energies.'),

  long(E(5, 2), 'A 2 kg block slides from rest down a smooth curved track from a height of 5 m, then along a rough level floor, where the coefficient of friction is 0.25, until it stops. (g = 10 m/s²)\n(a) Find its speed at the bottom of the track. [2]\n(b) Find how far it slides along the floor. [2]\n(c) Is its mechanical energy conserved over the whole journey? Explain. [1]', '(a) mgh = ½mv², as the track is smooth.', '(a) v = √(2gh) = √100 = 10 m/s.', '(b) Friction’s work removes the kinetic energy: μmg × d = ½mv².', '(b) d = v²/(2μg) = 100/5 = 20 m.', '(c) No: it is conserved on the smooth track, but friction turns it all into heat on the floor.'),
  long(E(5, 2), 'A spring has a spring constant of 400 N/m.\n(a) Find the work done in stretching it by 5 cm. [1]\n(b) Find the extra work needed to stretch it from 5 cm to 10 cm. [2]\n(c) The spring is compressed by 10 cm and used to push a 0.5 kg block along a smooth floor. Find the block’s speed when it leaves the spring. [2]', '(a) ½kx² = ½ × 400 × 0.05² = 0.5 J.', '(b) ½ × 400 × 0.10² = 2.0 J in all.', '(b) So the extra work is 2.0 − 0.5 = 1.5 J.', '(c) The stored 2.0 J becomes kinetic energy: ½ × 0.5 × v² = 2.0.', '(c) v² = 8, so v = 2.8 m/s.'),
  long(E(5, 3), 'A motor raises a lift of mass 500 kg at a steady 2 m/s, against a friction force of 1000 N. (g = 10 m/s²)\n(a) Find the force the motor must exert. [1]\n(b) Find the power it delivers. [2]\n(c) Find the work it does in 10 s. [1]\n(d) How much of that work becomes potential energy? [1]', '(a) The speed is steady, so the force balances the weight and friction: 5000 + 1000 = 6000 N.', '(b) P = Fv.', '(b) = 6000 × 2 = 12 000 W = 12 kW.', '(c) W = Pt = 12 000 × 10 = 1.2 × 10⁵ J.', '(d) The lift rises 20 m, gaining mgh = 5000 × 20 = 1.0 × 10⁵ J; the rest goes to heat through friction.'),

  tell(E(2, 2), 'Distinguish between the work done by a constant force and by a variable force.', 'For a constant force, W = Fs cos θ.', 'For a variable force, the path is split into small steps and the work added up: W = ∫F dx, the area under the force–displacement graph.'),
  tell(E(2, 1), 'Distinguish between elastic potential energy and gravitational potential energy.', 'Elastic potential energy is stored in a stretched or squashed spring, ½kx².', 'Gravitational potential energy is stored by a body raised against gravity, mgh near the Earth.'),
  tell(E(2, 2), 'Distinguish between average power and instantaneous power.', 'Average power is the total work done divided by the total time taken.', 'Instantaneous power is the rate of doing work at one moment, dW/dt, which equals Fv.'),

  match(E(4, 1), [['Work done', 'Fs cos θ'], ['Kinetic energy', '½mv²'], ['The potential energy of a spring', '½kx²'], ['Power', 'Fv']]),
  match(E(4, 2), [['One kilowatt-hour', '3.6 × 10⁶ J'], ['One electronvolt', '1.6 × 10⁻¹⁹ J'], ['One horsepower', '746 W'], ['One erg', '10⁻⁷ J']]),
  match(E(4, 2), [['Force along the displacement, θ = 0°', 'the most positive work, Fs'], ['Force at right angles, θ = 90°', 'no work'], ['Force against the displacement, θ = 180°', 'negative work, −Fs'], ['θ = 60°', 'half the most work, Fs/2']]),

  ar(E(1, 1), 'A body can have energy without having momentum.', 'A body at rest can have potential energy.', 1, 'A body at rest has no momentum, yet it can store potential energy.'),
  ar(E(1, 2), 'The work done by friction round a closed path is zero.', 'Friction is a non-conservative force.', 4, 'Friction always opposes the motion, so its work round a closed path is negative, not zero.'),
  ar(E(1, 1), 'Power is a scalar.', 'Its SI unit is the watt.', 2, 'Both are true, but power is a scalar because it is work, a scalar, divided by time.'),

  derive(E(3, 2), 'Show that the potential energy stored in a spring of spring constant k, stretched by x, is ½kx².', ['To stretch it, a force kx′ must be applied at each extension x′, against the spring’s restoring force.', 1], ['The work done to stretch it from 0 to x is W = ∫kx′ dx′ from 0 to x.', 1], ['W = ½kx², which is stored as potential energy.', 1]),
  derive(E(3, 3), 'Prove the work–energy theorem for a variable force acting along a straight line.', ['The work done is W = ∫F dx, and F = ma = m(dv/dt).', 1], ['m(dv/dt) dx = m(dx/dt) dv = mv dv, so W = ∫mv dv from u to v.', 1], ['W = ½mv² − ½mu², the change in kinetic energy.', 1]),
];

export default questions;
