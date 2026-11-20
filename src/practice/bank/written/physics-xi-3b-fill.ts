// Written by hand: equilibrium of forces and friction, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The friction graph is for a block of weight 50 N: limiting friction 20 N, kinetic friction 15 N.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const F = at(3, 'b');

const questions: BankDef[] = [
  figure(F(3, 2), 'A block of weight 50 N on a rough floor is pulled with a slowly growing horizontal force. The graph shows the friction on it against the applied force. Explain its shape, and find μs and μk.', ['At first the block doesn’t move, and static friction grows to equal the applied force: the sloping part.', 'Friction reaches its limit, 20 N, and the block starts to slide; friction then drops to kinetic friction, 15 N, and stays there.', 'μs = 20/50 = 0.4, and μk = 15/50 = 0.3.'], {
    shown: graph('applied force (N)', 'friction (N)', [{ points: [[0, 0], [20, 20], [20, 15], [35, 15]] }], { x: [[10, '10'], [20, '20'], [30, '30']], y: [[15, '15'], [20, '20']] }),
  }),
  figure(F(3, 2), 'A lamp of weight 10 N hangs from two strings, each at 60° to the vertical. Draw the forces on the knot and the triangle of forces, and find the tension in each string.', ['Three forces act at the knot: the weight, 10 N, straight down, and the two tensions T along the strings.', 'In equilibrium they form a closed triangle, so their vertical parts balance: 2T cos 60° = 10.', 'T = 10 N in each string.'], {
    answer: sketch(340, 200, 'On the left, a knot with three arrows: the weight pointing straight down, and two tensions pointing up along strings at 60° to the vertical on either side. On the right, a closed triangle drawn from the three forces, head to tail.', [
      { t: 'dot', x: 100, y: 90 }, arrow([100, 90], [100, 170]), label(108, 160, '10 N', 'start'),
      arrow([100, 90], [44, 58]), arrow([100, 90], [156, 58]), label(40, 50, 'T', 'end'), label(160, 50, 'T', 'start'),
      line([[100, 90], [100, 40]], { dash: 1 }), label(84, 70, '60°', 'end'), label(118, 70, '60°', 'start'),
      arrow([300, 40], [300, 140]), arrow([300, 140], [213, 90]), arrow([213, 90], [300, 40]), label(306, 94, '10 N', 'start'), label(250, 128, 'T', 'end'), label(250, 58, 'T', 'end'),
    ]),
  }),
  figure(F(3, 2), 'A block is pulled up a rough slope at a steady speed by a rope parallel to the slope. Draw a free-body diagram of the block, and write the force needed.', ['Its weight mg acts straight down, and the normal reaction N acts at right angles to the slope, with N = mg cos θ.', 'The pull P acts up the slope, and kinetic friction acts down the slope, as the block moves up.', 'At steady speed, P = mg sin θ + μk mg cos θ.'], {
    answer: sketch(320, 220, 'A slope rising to the right. A block on it. Four arrows from the block: weight straight down, normal reaction at right angles to the slope, pull up the slope, and friction down the slope.', [
      line([[20, 190], [300, 190], [300, 50], [20, 190]]),
      { t: 'path', d: 'M150 125 L190 105 L175 75 L135 95 Z' }, { t: 'dot', x: 162, y: 100 },
      arrow([162, 100], [162, 170]), label(168, 166, 'mg', 'start'),
      arrow([162, 100], [132, 40]), label(128, 36, 'N', 'end'),
      arrow([162, 100], [224, 69]), label(228, 66, 'P', 'start'),
      arrow([162, 100], [110, 126]), label(106, 136, 'friction', 'end'),
    ]),
  }),

  predict(F(2, 1), 'A book on a table is pushed sideways with a force of 2 N, but doesn’t move. Predict the friction on it.', 'The friction is 2 N, opposite to the push.', 'Static friction adjusts itself to balance the applied force, up to its limit.'),
  predict(F(2, 2), 'A 2 kg block slides down a rough slope at 30°, with μk = 0.2. Predict its acceleration. (g = 9.8 m/s².)', 'a = g(sin θ − μk cos θ) = 9.8(0.5 − 0.2 × 0.866).', '= 3.2 m/s² down the slope.'),
  predict(F(2, 1), 'A brick lying on its broad face is turned onto its narrow face on the same floor. Predict how the force needed to start it sliding changes.', 'It stays the same.', 'Limiting friction depends on the normal force and the surfaces, not on the area of contact.'),

  odd(F(2, 1), ['ball bearings', 'lubricating oil', 'polishing surfaces', 'tyre treads'], 'tyre treads', 'They increase grip; the others reduce friction.'),
  odd(F(2, 1), ['static friction', 'limiting friction', 'kinetic friction', 'normal reaction'], 'normal reaction', 'It acts at right angles to the surface; the others are kinds of friction, acting along it.'),
  odd(F(2, 1), ['walking', 'writing with a pen', 'a car braking', 'a spacecraft coasting in empty space'], 'a spacecraft coasting in empty space', 'No friction is involved; the others all need friction.'),

  long(F(5, 2), 'A 5.0 kg block rests on a floor, with μs = 0.5 and μk = 0.4. (g = 9.8 m/s².)\n(a) Find the least horizontal force that starts it moving. [1]\n(b) A force of 30 N is applied. Find its acceleration. [2]\n(c) Instead, a force of 20 N is applied. What happens, and what is the friction? [1]\n(d) Why is μk less than μs? [1]', '(a) μs mg = 0.5 × 5.0 × 9.8 = 24.5 N.', '(b) Kinetic friction = 0.4 × 49 = 19.6 N.', '(b) a = (30 − 19.6)/5.0 = 2.1 m/s².', '(c) 20 N is less than 24.5 N, so it stays at rest, with friction of 20 N.', '(d) Once sliding, the surfaces have less time to bond at their points of contact.'),
  long(F(5, 3), 'A block on an adjustable slope just starts to slide when the slope is at 30°.\n(a) Find μs. [1]\n(b) The slope is raised to 37°, and μk = 0.5. Find the block’s acceleration. [2]\n(c) Find the force parallel to the slope that pushes a 2.0 kg block up the 37° slope at steady speed. [2] (g = 9.8 m/s², sin 37° = 0.60, cos 37° = 0.80.)', '(a) μs = tan 30° = 0.58.', '(b) a = g(sin 37° − μk cos 37°) = 9.8(0.60 − 0.5 × 0.80).', '(b) = 9.8 × 0.20 = 2.0 m/s².', '(c) P = mg(sin 37° + μk cos 37°) = 2.0 × 9.8 × (0.60 + 0.40).', '(c) = 19.6 N.'),
  long(F(5, 3), 'Forces of 3 N, 4 N and 5 N act at a point and keep it in equilibrium.\n(a) State the condition for three concurrent forces to be in equilibrium. [1]\n(b) Find the angle between the 3 N and 4 N forces. [2]\n(c) State Lami’s theorem. [1]\n(d) Use it to find the angle between the 4 N and 5 N forces. [1]', '(a) Their vector sum is zero: drawn head to tail, they form a closed triangle.', '(b) 3, 4 and 5 make a right-angled triangle, as 3² + 4² = 5²: the 5 N force balances the resultant of the other two, of size 5 N.', '(b) So the 3 N and 4 N forces are at 90°.', '(c) Each force is proportional to the sine of the angle between the other two.', '(d) 3/sin α = 5/sin 90°, so sin α = 0.6 and α = 143° (the angle greater than 90°, as the angles add to 360°).'),

  tell(F(2, 1), 'Distinguish between limiting friction and kinetic friction.', 'Limiting friction is the greatest static friction, just as a body starts to slide: μs N.', 'Kinetic friction acts while the body slides, μk N, and is a little smaller.'),
  tell(F(2, 1), 'Distinguish between sliding and rolling friction.', 'Sliding friction acts when one surface slides over another.', 'Rolling friction acts when a body rolls on a surface; it is much smaller, as the surfaces don’t slide over each other.'),
  tell(F(2, 2), 'Distinguish between the angle of friction and the angle of repose.', 'The angle of friction is the angle between the normal reaction and the resultant of the normal reaction and limiting friction: tan λ = μs.', 'The angle of repose is the least angle of a slope at which a body on it just begins to slide: tan θ = μs. The two are equal.'),

  match(F(4, 1), [['Static friction', 'matches the applied force, up to a limit'], ['Limiting friction', 'μs N'], ['Kinetic friction', 'μk N'], ['Rolling friction', 'much smaller than sliding friction']]),
  match(F(4, 1), [['Ball bearings', 'turn sliding into rolling'], ['Lubricants', 'put a thin layer of fluid between surfaces'], ['Streamlining', 'cuts air resistance'], ['Tyre treads', 'keep grip on wet roads']]),
  match(F(4, 2), [['The angle of repose θ', 'tan θ = μs'], ['Three forces in equilibrium', 'form a closed triangle'], ['Lami’s theorem', 'each force ∝ the sine of the angle between the other two'], ['Acceleration down a rough slope', 'g(sin θ − μk cos θ)']]),

  ar(F(1, 2), 'Friction doesn’t depend on the apparent area of contact.', 'The real area of contact depends on the normal force, not on the apparent area.', 1, 'Surfaces touch only at high points, whose total area grows with the normal force.'),
  ar(F(1, 1), 'Static friction always equals μs N.', 'Limiting friction is μs N.', 4, 'Static friction can be anything from zero up to μs N, matching the applied force.'),
  ar(F(1, 1), 'A body at rest on a slope has friction acting up the slope.', 'Friction always acts in the direction of motion.', 3, 'Friction opposes the motion, or the tendency to move, which here is down the slope.'),

  derive(F(3, 1), 'Show that the angle of repose equals the angle of friction.', ['A body just about to slide on a slope at the angle of repose θ has mg sin θ = f, the limiting friction, and mg cos θ = N.', 1], ['So tan θ = f/N = μs.', 1], ['The angle of friction λ also has tan λ = μs, so θ = λ.', 1]),
  derive(F(3, 2), 'Derive an expression for the acceleration of a body sliding down a rough slope of angle θ, with coefficient of kinetic friction μk.', ['Along the slope, the part of the weight is mg sin θ, and the normal reaction is N = mg cos θ.', 1], ['Kinetic friction μk mg cos θ acts up the slope, so the net force is mg sin θ − μk mg cos θ.', 1], ['a = g(sin θ − μk cos θ).', 1]),
  derive(F(3, 3), 'A block of mass m on a rough floor is pulled by a force F at an angle θ above the horizontal. Show that it just starts to move when F = μmg/(cos θ + μ sin θ).', ['The upward part of F lowers the normal reaction: N = mg − F sin θ.', 1], ['It starts to move when F cos θ = μN = μ(mg − F sin θ).', 1], ['F(cos θ + μ sin θ) = μmg, so F = μmg/(cos θ + μ sin θ).', 1]),
];

export default questions;
