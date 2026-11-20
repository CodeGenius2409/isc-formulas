// Written by hand: circular motion, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The force graph is F = 0.4v², for a stone on a string of radius 0.5 m, so its mass is 0.2 kg.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('physics', 'XI');
const C = at(3, 'c');

const questions: BankDef[] = [
  figure(C(3, 2), 'Draw the forces on a car taking a curve on a road banked at an angle θ, with no friction, and show what provides the centripetal force.', ['Only two forces act: the weight mg straight down, and the normal reaction N at right angles to the road.', 'N cos θ, its vertical part, balances the weight: N cos θ = mg.', 'N sin θ, its horizontal part, points to the centre of the curve and provides the centripetal force: N sin θ = mv²/r.'], {
    answer: sketch(320, 220, 'A road surface sloping up to the right at angle θ, with a car on it, seen from behind. The weight mg points straight down from the car. The normal reaction N points up and to the left, at right angles to the road. Dashed lines split N into a vertical part, N cos θ, and a horizontal part, N sin θ, pointing towards the centre of the curve on the left.', [
      line([[30, 190], [290, 190], [290, 90], [30, 190]]), label(70, 184, 'θ', 'start'),
      { t: 'path', d: 'M150 144 L200 125 L191 103 L141 122 Z' }, { t: 'dot', x: 170, y: 123 },
      arrow([170, 123], [170, 186]), label(176, 182, 'mg', 'start'),
      arrow([170, 123], [145, 58]), label(141, 54, 'N', 'end'),
      line([[170, 123], [170, 58]], { dash: 1 }), line([[170, 58], [145, 58]], { dash: 1 }),
      label(176, 84, 'N cos θ', 'start'), arrow([145, 36], [95, 36]), label(120, 28, 'N sin θ, to centre'),
    ]),
  }),
  figure(C(2, 1), 'Draw a body moving at steady speed in a circle, showing its velocity and acceleration at three points.', ['At every point the velocity is along the tangent, in the direction of motion, and of the same size.', 'The acceleration always points to the centre, at right angles to the velocity, with size v²/r.'], {
    answer: sketch(300, 220, 'A circle with its centre marked. At three points on it, an arrow along the tangent shows the velocity v, and an arrow pointing to the centre shows the acceleration a.', [
      { t: 'circle', x: 150, y: 110, r: 70 }, { t: 'dot', x: 150, y: 110 },
      { t: 'dot', x: 150, y: 40 }, arrow([150, 40], [210, 40]), arrow([150, 40], [150, 76]), label(214, 44, 'v', 'start'), label(156, 70, 'a', 'start'),
      { t: 'dot', x: 220, y: 110 }, arrow([220, 110], [220, 170]), arrow([220, 110], [184, 110]), label(226, 170, 'v', 'start'), label(192, 104, 'a'),
      { t: 'dot', x: 80, y: 110 }, arrow([80, 110], [80, 50]), arrow([80, 110], [116, 110]), label(74, 54, 'v', 'end'), label(108, 104, 'a'),
    ]),
  }),
  figure(C(3, 2), 'A stone on a string is whirled in a horizontal circle of radius 0.5 m, at different speeds. The graph shows the tension against v². What does the straight line show, and what is the mass of the stone? (Ignore gravity.)', ['A straight line through the origin shows that the force is proportional to v², at a fixed radius.', 'F = mv²/r, so the gradient is m/r = 4/10 = 0.4 kg/m.', 'm = 0.4 × 0.5 = 0.2 kg.'], {
    shown: graph('v² (m²/s²)', 'tension (N)', [{ points: [[0, 0], [25, 10]] }], { x: [[10, '10'], [20, '20']], y: [[4, '4'], [8, '8']] }),
  }),

  predict(C(2, 1), 'A car takes the same curve at twice the speed. Predict how the centripetal force needed changes.', 'F = mv²/r, so it depends on v².', 'It becomes 4 times as large.'),
  predict(C(2, 2), 'Rain halves the coefficient of friction between the tyres and a level curved road. Predict how the greatest safe speed changes.', 'The greatest safe speed is √(μrg), proportional to √μ.', 'It falls to 1/√2 of its value, about 71%.'),
  predict(C(2, 2), 'A curve of radius 100 m is to be taken at 20 m/s with no need for friction. Predict the angle at which it should be banked. (g = 9.8 m/s².)', 'tan θ = v²/(rg) = 400/(100 × 9.8) = 0.41.', 'θ = 22°.'),

  odd(C(2, 1), ['a stone whirled on a string', 'the Moon going round the Earth', 'a car on a curved road', 'a ball thrown straight up'], 'a ball thrown straight up', 'It moves in a straight line; the others move in circles.'),
  odd(C(2, 2), ['tension', 'gravity', 'friction', 'centrifugal force'], 'centrifugal force', 'It is a pseudo force, seen only from a rotating frame; the others are real forces that can provide a centripetal force.'),
  odd(C(2, 1), ['v²/r', 'ω²r', 'vω', 'v/r'], 'v/r', 'It is the angular speed ω; the others are the centripetal acceleration.'),

  long(C(5, 2), 'A car of mass 1000 kg takes a level curve of radius 50 m. The coefficient of friction between its tyres and the road is 0.5. (g = 9.8 m/s².)\n(a) What provides the centripetal force? [1]\n(b) Find the greatest safe speed. [2]\n(c) Find the friction on the car at 10 m/s. [1]\n(d) Does the greatest safe speed depend on the car’s mass? Explain. [1]', '(a) Friction between the tyres and the road, acting towards the centre.', '(b) μmg = mv²/r, so v = √(μrg) = √(0.5 × 50 × 9.8).', '(b) = 15.7 m/s.', '(c) mv²/r = 1000 × 10²/50 = 2000 N.', '(d) No: m cancels from μmg = mv²/r.'),
  long(C(5, 3), 'A road curve of radius 80 m is banked at 15°. (g = 9.8 m/s², tan 15° = 0.268.)\n(a) Find the speed at which a car needs no friction. [2]\n(b) Which way does friction act on a car going faster than this? [1]\n(c) With μ = 0.3, find the greatest safe speed, using v² = rg(tan θ + μ)/(1 − μ tan θ). [2]', '(a) v = √(rg tan θ) = √(80 × 9.8 × 0.268).', '(a) = 14.5 m/s.', '(b) Down the slope, towards the centre, as the car tends to slide outwards.', '(c) v² = 80 × 9.8 × (0.268 + 0.3)/(1 − 0.3 × 0.268) = 784 × 0.568/0.920 = 484.', '(c) v = 22 m/s.'),
  long(C(5, 2), 'A 0.2 kg stone on a string 0.5 m long is whirled in a horizontal circle at 2 revolutions per second. Ignore gravity.\n(a) Find its angular speed. [1]\n(b) Find its speed. [1]\n(c) Find its centripetal acceleration. [1]\n(d) Find the tension in the string. [1]\n(e) The string breaks at 20 N. Find the greatest number of revolutions per second. [1]', '(a) ω = 2π × 2 = 4π = 12.6 rad/s.', '(b) v = ωr = 12.6 × 0.5 = 6.3 m/s.', '(c) a = ω²r = 12.6² × 0.5 = 79 m/s².', '(d) T = ma = 0.2 × 79 = 15.8 N.', '(e) ω² = 20/(0.2 × 0.5) = 200, so ω = 14.1 rad/s, which is 14.1/2π = 2.25 revolutions per second.'),

  tell(C(2, 2), 'Distinguish between centripetal and centrifugal force.', 'Centripetal force is the real force towards the centre, such as tension or friction, that keeps a body moving in a circle.', 'Centrifugal force is a pseudo force, outwards from the centre, felt only by an observer in the rotating frame.'),
  tell(C(2, 2), 'Distinguish between uniform and non-uniform circular motion.', 'In uniform circular motion the speed is constant; the only acceleration is centripetal, towards the centre.', 'In non-uniform circular motion the speed changes too, so there is also a tangential acceleration, along the path.'),
  tell(C(2, 1), 'Distinguish between the angular velocity and the linear velocity of a body moving in a circle.', 'Angular velocity ω is the angle swept out per second at the centre, in rad/s; it is the same for every point of a rotating body.', 'Linear velocity v is the distance moved per second along the tangent, in m/s: v = ωr, so it grows with the distance from the centre.'),

  match(C(4, 1), [['A stone whirled on a string', 'tension'], ['The Moon going round the Earth', 'gravity'], ['A car on a level curve', 'friction'], ['A car on a frictionless banked curve', 'part of the normal reaction']]),
  match(C(4, 2), [['Centripetal acceleration', 'v²/r'], ['Greatest safe speed on a level curve', '√(μrg)'], ['Best speed on a banked curve', '√(rg tan θ)'], ['Angular speed', 'v/r']]),
  match(C(4, 1), [['The velocity in uniform circular motion', 'along the tangent'], ['The acceleration in uniform circular motion', 'towards the centre'], ['The speed in uniform circular motion', 'constant'], ['The work done by the centripetal force', 'zero']]),

  ar(C(1, 1), 'A body in uniform circular motion is accelerating.', 'The direction of its velocity keeps changing.', 1, 'A change of direction is a change of velocity, so there is an acceleration, towards the centre.'),
  ar(C(1, 1), 'The centripetal force on a car on a level curve comes from its engine.', 'Friction between the tyres and the road acts towards the centre.', 4, 'It is friction, not the engine, that provides the centripetal force.'),
];

export default questions;
