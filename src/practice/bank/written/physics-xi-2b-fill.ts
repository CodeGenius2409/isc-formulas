// Written by hand: motion in a plane, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('physics', 'XI');
const P = at(2, 'b');

const questions: BankDef[] = [
  figure(P(3, 2), 'Sketch the path of a projectile launched from level ground, and draw its velocity, with its horizontal and vertical parts, at the launch, at the top and on landing.', ['The path is a parabola, symmetric about its highest point.', 'The horizontal part, u cos θ, is the same everywhere; at the top the vertical part is zero, so the velocity is horizontal there.', 'On landing the vertical part is u sin θ downwards, so the velocity has the launch speed, at θ below the horizontal.'], {
    answer: sketch(340, 220, 'A parabola from the launch point on the left, up to a highest point, and down to the landing point on the right. At the launch an arrow points up and to the right, with a horizontal part and an upward part drawn dashed. At the top a horizontal arrow shows the velocity. At landing an arrow points down and to the right, with a horizontal part and a downward part drawn dashed.', [
      line([[20, 170], [320, 170]]), { t: 'path', d: 'M40 170 Q 170 -10, 300 170' },
      arrow([40, 170], [80, 120]), line([[40, 170], [80, 170]], { dash: 1 }), line([[80, 170], [80, 120]], { dash: 1 }), label(66, 134, 'u', 'end'),
      arrow([170, 80], [210, 80]), label(214, 84, 'u cos θ', 'start'),
      arrow([300, 170], [330, 206]), line([[300, 170], [330, 170]], { dash: 1 }), line([[330, 170], [330, 206]], { dash: 1 }),
    ]),
  }),
  figure(P(3, 1), 'The figure shows a displacement of 3 m east followed by one of 4 m north. Find the size and direction of the total displacement.', ['The resultant runs from the start to the end of the second arrow.', 'Its size is √(3² + 4²) = 5 m.', 'It makes an angle tan⁻¹(4/3) ≈ 53° north of east.'], {
    shown: sketch(260, 200, 'An arrow 3 units long points east from a starting point. From its head, a second arrow 4 units long points north. A dashed arrow, the resultant, joins the start to the end.', [
      arrow([40, 170], [160, 170]), label(100, 188, '3 m east'), arrow([160, 170], [160, 10]), label(168, 94, '4 m north', 'start'),
      line([[40, 170], [160, 10]], { dash: 1 }), label(84, 80, 'resultant', 'end'),
    ]),
  }),
  figure(P(2, 1), 'A force of 10 N acts at 30° above the horizontal. Draw it with its horizontal and vertical components, and find each.', ['The horizontal component is 10 cos 30° = 8.66 N.', 'The vertical component is 10 sin 30° = 5 N.'], {
    answer: sketch(280, 180, 'An arrow of 10 N at 30° above the horizontal from the origin. A dashed horizontal arrow along the x-axis is its horizontal component, 8.66 N, and a dashed vertical arrow up to the head of the force is its vertical component, 5 N.', [
      arrow([30, 150], [270, 150]), arrow([30, 170], [30, 15]),
      arrow([30, 150], [203, 50]), label(110, 86, '10 N', 'end'), label(70, 142, '30°', 'start'),
      arrow([30, 150], [203, 150]), label(120, 168, '8.66 N'), arrow([203, 150], [203, 50]), label(210, 104, '5 N', 'start'),
    ]),
  }),

  predict(P(2, 2), 'A ball is thrown at the same speed first at 45° and then at 60° to the horizontal. Predict how its range and greatest height change.', 'The range falls, as sin 120° = 0.87 is less than sin 90° = 1.', 'The greatest height rises, as sin² 60° = 0.75 is more than sin² 45° = 0.5.'),
  predict(P(2, 1), 'A stone whirled in a horizontal circle on a string breaks free. Predict the path it takes at first, seen from above.', 'It flies off in a straight line along the tangent to the circle at the point where it was released.', 'With the string gone, nothing pulls it towards the centre, so it keeps its velocity at that instant.'),
  predict(P(2, 1), 'Predict the vector product of a vector A with itself.', 'A × A = 0, the zero vector.', 'Its size is A × A × sin 0° = 0.'),

  odd(P(2, 1), ['displacement', 'velocity', 'acceleration', 'speed'], 'speed', 'It is a scalar; the others are vectors.'),
  odd(P(2, 1), ['î·î', 'ĵ·ĵ', 'k̂·k̂', 'î·ĵ'], 'î·ĵ', 'It is 0, as î and ĵ are at right angles; the others are all 1.'),
  odd(P(2, 2), ['work', 'power', 'torque', 'energy'], 'torque', 'It is a vector, found by a vector product; the others are scalars.'),

  long(P(5, 1), 'A ball is thrown at 20 m/s at 30° above the horizontal from level ground. (g = 10 m/s²)\n(a) Find its time of flight. [1]\n(b) Find its greatest height. [2]\n(c) Find its range. [2]', '(a) T = 2u sin θ/g = 2 × 20 × 0.5/10 = 2 s.', '(b) H = u² sin²θ/2g.', '(b) = 400 × 0.25/20 = 5 m.', '(c) R = u² sin 2θ/g.', '(c) = 400 × 0.866/10 = 34.6 m.'),
  long(P(5, 2), 'Two vectors are A = 3î + 4ĵ and B = î − 2ĵ.\n(a) Find A + B and A − B. [2]\n(b) Find A·B. [1]\n(c) Find the angle between A and B. [2]', '(a) A + B = 4î + 2ĵ.', '(a) A − B = 2î + 6ĵ.', '(b) A·B = 3 × 1 + 4 × (−2) = −5.', '(c) |A| = 5 and |B| = √5, so cos θ = −5/(5√5) = −1/√5.', '(c) θ = 116.6°.'),
  long(P(5, 2), 'A 0.5 kg stone on a string 1 m long is whirled in a horizontal circle, making 2 turns each second. Ignore gravity.\n(a) Find its angular speed. [1]\n(b) Find its speed. [1]\n(c) Find its centripetal acceleration. [2]\n(d) Find the tension in the string. [1]', '(a) ω = 2π × 2 = 4π rad/s.', '(b) v = ωr = 4π × 1 = 12.6 m/s.', '(c) a = ω²r = 16π² × 1.', '(c) = 158 m/s², towards the centre.', '(d) T = ma = 0.5 × 158 = 79 N.'),

  tell(P(2, 1), 'Distinguish between a position vector and a displacement vector.', 'A position vector runs from the origin to the point where a body is.', 'A displacement vector runs from where a body started to where it is now; it is the change in its position vector.'),
  tell(P(2, 2), 'Distinguish between uniform motion in a straight line and uniform circular motion.', 'In uniform motion in a straight line, the velocity is constant, so there is no acceleration.', 'In uniform circular motion, the speed is constant but the direction keeps changing, so there is an acceleration towards the centre.'),

  match(P(4, 1), [['The range of a projectile', 'u² sin 2θ/g'], ['The greatest height of a projectile', 'u² sin²θ/2g'], ['The time of flight of a projectile', '2u sin θ/g'], ['Centripetal acceleration', 'v²/r']]),
  match(P(4, 2), [['î × ĵ', 'k̂'], ['ĵ × k̂', 'î'], ['k̂ × î', 'ĵ'], ['î × î', 'the zero vector']]),
  match(P(4, 2), [['A·B = 0, for non-zero vectors', 'A and B at right angles'], ['A × B = 0, for non-zero vectors', 'A and B parallel or opposite'], ['|A + B| = |A| + |B|', 'A and B in the same direction'], ['A + B = 0', 'A and B equal in size and opposite']]),

  ar(P(1, 1), 'Forces of 3 N and 4 N can have a resultant of 5 N.', 'At right angles, their resultant is √(3² + 4²) = 5 N.', 1, 'So 5 N is the resultant when the forces are at right angles.'),
  ar(P(1, 1), 'A body in uniform circular motion has no acceleration.', 'Its speed doesn’t change.', 4, 'Its direction keeps changing, so it accelerates towards the centre.'),
];

export default questions;
