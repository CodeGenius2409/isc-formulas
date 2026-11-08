// Physics, Class XI. Numericals are answered by the solver registry. The facts are written for this app.
import { derivationBlueprints } from '../derivations';
import KNOWLEDGE from './knowledge/physics-xi';
import { blueprintsFor } from './dsl';
import type { Blueprint } from './types';

const { num, mcqNum, facts, rest, custom } = blueprintsFor('physics', 'XI', KNOWLEDGE);

const blueprints: Blueprint[] = [
  // ---- Unit 1: Measurement
  ...facts(1, 'a', {
    define: [
      ['least count', 'The smallest value an instrument can measure.'],
      ['a significant figure', 'A digit in a measurement that is known reliably, plus the first uncertain one.'],
      ['absolute error', 'The size of the difference between a measured value and the true value.'],
    ],
    recall: [
      ['The number of significant figures in 0.00450 is:', '3', '2', '5', '6'],
      ['Which is an SI base unit?', 'kilogram', 'gram', 'newton', 'joule'],
      ['A vernier calliper has a least count of 0.1 mm. This means it can measure to:', 'one tenth of a millimetre', 'one millimetre', 'one hundredth of a millimetre', 'one centimetre'],
      ['The number of significant figures in 2.050 × 10³ is:', '4', '3', '2', '7'],
    ],
    reason: [
      ['Taking the mean of many readings improves a result.', 'Random errors tend to cancel out when averaged.'],
      ['A systematic error isn’t removed by repeating the measurement.', 'It shifts every reading the same way.', 'So the mean keeps the same bias.'],
    ],
    compare: [
      ['systematic error', 'random error', ['Shifts readings in one direction.', 'Scatters readings on both sides.'], ['Reduced by calibration.', 'Reduced by averaging.']],
    ],
    truths: [
      ['Percentage errors add when quantities are multiplied.', 'Percentage errors cancel when quantities are multiplied.'],
      ['The SI unit of luminous intensity is the candela.', 'The SI unit of luminous intensity is the lumen.'],
      ['Trailing zeros after a decimal point are significant.', 'Trailing zeros after a decimal point are never significant.'],
      ['A larger number of divisions on a vernier scale gives a smaller least count.', 'A larger number of divisions on a vernier scale gives a larger least count.'],
    ],
  }),
  ...facts(1, 'b', {
    define: [
      ['the dimensions of a quantity', 'The powers to which the base quantities are raised to express it.'],
      ['the principle of homogeneity', 'Every term in a correct physical equation has the same dimensions.'],
    ],
    recall: [
      ['The dimensions of force are:', '[M L T⁻²]', '[M L² T⁻²]', '[M L T⁻¹]', '[M L⁻¹ T⁻²]'],
      ['The dimensions of energy are:', '[M L² T⁻²]', '[M L T⁻²]', '[M L² T⁻¹]', '[M L⁻¹ T⁻²]'],
      ['The dimensions of pressure are:', '[M L⁻¹ T⁻²]', '[M L T⁻²]', '[M L² T⁻²]', '[M L⁻² T⁻¹]'],
      ['Which pair has the same dimensions?', 'Work and torque', 'Force and energy', 'Power and energy', 'Velocity and acceleration'],
    ],
    reason: [
      ['Dimensional analysis can’t find a number like ½ in a formula.', 'Pure numbers have no dimensions.'],
      ['Two quantities with different dimensions can’t be added.', 'Each term in an equation must have the same dimensions.'],
    ],
    truths: [
      ['An angle has no dimensions.', 'An angle has dimensions of length.'],
      ['Momentum and impulse have the same dimensions.', 'Momentum and force have the same dimensions.'],
      ['A dimensionally correct equation might still be wrong.', 'A dimensionally correct equation must always be right.'],
      ['Stress and pressure have the same dimensions.', 'Stress and strain have the same dimensions.'],
    ],
  }),

  // ---- Unit 2: Kinematics
  mcqNum('accelerate', [2, 'a', 1, 1], {
    text: 'A car speeds up from {U} m/s at {A} m/s² for {T} s. Its final speed is:',
    vars: { U: [0, 20, 5], A: [1, 5, 1], T: [2, 10, 2] },
    use: 'p-xi-2-4',
    find: 'v',
    given: { u: 'U m/s', a: 'A m/s^2', t: 'T s' },
    mistakes: (v) => [
      ['added a and t instead of multiplying them', v.U + v.A + v.T],
      ['forgot the starting speed', v.A * v.T],
      ['subtracted at', v.U - v.A * v.T],
      ['used ½at', v.U + 0.5 * v.A * v.T],
    ],
  }),
  num('uniform', [2, 'a', 2, 1], {
    variants: [
      { text: '{scene} starts from rest and accelerates uniformly at {A} m/s² for {T} s. How far does it travel?', parts: [{ ask: 'Distance', use: 'p-xi-2-5', find: 's', given: { u: '0 m/s', a: 'A m/s^2', t: 'T s' }, marks: 2 }] },
      { text: '{scene} starts at {U} m/s and accelerates uniformly at {A} m/s² over {S} m. Find its final speed.', parts: [{ ask: 'Final speed', use: 'p-xi-2-6', find: 'v', given: { u: 'U m/s', a: 'A m/s^2', s: 'S m' }, positive: true, marks: 2 }] },
    ],
    scenes: ['A scooter', 'A train leaving a station', 'A cyclist'],
    vars: { A: [1, 4, 1], T: [2, 10, 2], U: [2, 12, 2], S: [10, 60, 10] },
  }),
  num('free-fall', [2, 'a', 3, 2], {
    diagram: (v) => ({ kind: 'drop', h: `${v.H} m` }),
    text: 'A {scene} is dropped from a height of {H} m. Take g = 9.8 m/s².',
    scenes: ['stone', 'coin', 'small ball'],
    vars: { H: [5, 80, 5] },
    parts: [
      { ask: 'Time to reach the ground', use: 'p-xi-2-76', find: 't', given: { h: 'H m' }, marks: 2, save: 't' },
      { ask: 'Speed on reaching the ground', use: 'p-xi-2-73', find: 'v', given: { t: 't' }, marks: 1 },
    ],
  }),
  num('braking', [2, 'a', 3, 2], {
    style: 'cbq-style',
    text: 'A driver travelling at {V} m/s sees an obstacle and brakes, with a steady deceleration of {A} m/s². The driver’s reaction time is {R} s.',
    vars: { V: [10, 30, 5], A: [4, 8, 1], R: [0.5, 1, 0.5] },
    parts: [
      { ask: 'Distance covered during the reaction time', use: 'p-xi-2-43', find: 'x', given: { x_0: '0 m', v: 'V m/s', t: 'R s' }, marks: 1 },
      { ask: 'Braking distance', use: 'p-xi-2-6', find: 's', given: { v: '0 m/s', u: 'V m/s', a: '-A*1 m/s^2' }, marks: 2 },
    ],
  }),
  mcqNum('projectile-range', [2, 'b', 1, 1], {
    text: 'A ball is thrown at {U} m/s, at {T}° to the ground. Its range is about:',
    vars: { U: [10, 40, 5], T: [30, 60, 15] },
    use: 'p-xi-2-10',
    find: 'R_h',
    given: { u: 'U m/s', theta: 'T deg' },
    mistakes: (v) => [
      ['used sin θ rather than sin 2θ', (v.U ** 2 * Math.sin((v.T * Math.PI) / 180)) / 9.8],
      ['forgot to square the speed', (v.U * Math.sin((2 * v.T * Math.PI) / 180)) / 9.8],
      ['used 2g in the denominator', (v.U ** 2 * Math.sin((2 * v.T * Math.PI) / 180)) / 19.6],
      ['gave the maximum height instead', (v.U * Math.sin((v.T * Math.PI) / 180)) ** 2 / 19.6],
    ],
    diagram: (v) => ({ kind: 'projectile', v: `${v.U} m/s`, angle: `${v.T}°` }),
    sim: (v) => ({ id: 'projectile', preset: { speed: v.U, angle: v.T } }),
  }),
  num('projectile', [2, 'b', 3, 2], {
    text: 'A cricket ball is hit at {U} m/s at {T}° to the horizontal. Take g = 9.8 m/s².',
    vars: { U: [10, 40, 5], T: [30, 60, 15] },
    parts: [
      { ask: 'Time of flight', use: 'p-xi-2-8', find: 'T', given: { u: 'U m/s', theta: 'T deg' }, marks: 1 },
      { ask: 'Greatest height', use: 'p-xi-2-9', find: 'H', given: { u: 'U m/s', theta: 'T deg' }, marks: 1 },
      { ask: 'Range', use: 'p-xi-2-10', find: 'R_h', given: { u: 'U m/s', theta: 'T deg' }, marks: 1 },
    ],
    diagram: (v) => ({ kind: 'projectile', v: `${v.U} m/s`, angle: `${v.T}°` }),
    sim: (v) => ({ id: 'projectile', preset: { speed: v.U, angle: v.T } }),
  }),
  num('horizontal-throw', [2, 'b', 3, 2], {
    text: 'A ball rolls off a table {H} m high at {U} m/s.',
    vars: { H: [1, 5, 1], U: [1, 6, 1] },
    parts: [
      { ask: 'Time to reach the floor', use: 'p-xi-2-76', find: 't', given: { h: 'H m' }, marks: 1 },
      { ask: 'How far from the table it lands', use: 'p-xi-2-200', find: 'R_h', given: { u: 'U m/s', h: 'H m' }, marks: 2 },
    ],
    diagram: (v) => ({ kind: 'projectile', v: `${v.U} m/s`, angle: '0°', h: `${v.H} m` }),
    sim: (v) => ({ id: 'projectile', preset: { speed: v.U, angle: 0, height: v.H } }),
  }),
  num('vectors-resultant', [2, 'b', 2, 2], {
    diagram: (v) => ({ kind: 'vectors', a: `${v.A} m/s`, b: `${v.B} m/s`, angle: `${v.T}°`, deg: v.T }),
    text: 'A body has two velocities of {A} m/s and {B} m/s at the same time, at {T}° to each other. Find the size of the resultant velocity.',
    vars: { A: [3, 12, 1], B: [4, 12, 1], T: [60, 120, 30] },
    parts: [{ ask: 'Size of the resultant', use: 'p-xi-2-113', find: 'R_v', given: { A: 'A m/s', B: 'B m/s', theta: 'T deg' }, unit: 'm/s', marks: 2 }],
  }),
  ...facts(2, 'a', {
    define: [
      ['displacement', 'The shortest distance between the start and end points, with its direction.'],
      ['instantaneous velocity', 'The rate of change of displacement at a given instant.'],
      ['uniformly accelerated motion', 'Motion in which the velocity changes by equal amounts in equal times.'],
    ],
    recall: [
      ['The slope of a velocity–time graph gives:', 'acceleration', 'displacement', 'speed', 'distance'],
      ['In free fall, ignoring air, all bodies have the same:', 'acceleration', 'mass', 'momentum', 'weight'],
    ],
    reason: [
      ['A body can have zero velocity and yet be accelerating.', 'At the top of a throw, velocity is momentarily zero.', 'Gravity is still accelerating it at g.'],
      ['Speed can stay constant while velocity changes.', 'Velocity includes direction.', 'So moving round a circle changes velocity even at a steady speed.'],
    ],
    compare: [
      ['distance', 'displacement', ['A scalar, the length of the path.', 'A vector, the straight line from start to end.'], ['Can’t be negative.', 'Can be negative or zero.']],
      ['speed', 'velocity', ['A scalar.', 'A vector.'], ['Never negative.', 'Can be negative.']],
    ],
    truths: [
      ['Displacement can be zero when distance isn’t.', 'Distance can be zero when displacement isn’t.'],
      ['Average speed over a trip is at least the size of the average velocity.', 'Average speed over a trip is always less than the size of the average velocity.'],
      ['A straight, sloping x–t graph means constant velocity.', 'A straight, sloping x–t graph means constant acceleration.'],
    ],
    figures: { 'Using a velocity–time graph, derive s = ut + ½at².': { kind: 'graph', x: 'Time', y: 'Velocity', lines: [{ points: [[0, 1], [3, 3]] }], ticksX: [[3, 't']], ticksY: [[1, 'u'], [3, 'v']] } },
    long: [
      ['Using a velocity–time graph, derive s = ut + ½at².', 'Draw a straight v–t line rising from u to v in time t.', 'The area under it is a rectangle ut, plus a triangle ½(v − u)t.', 'Since v − u = at, the triangle is ½at².', 'So s = ut + ½at².'],
    ],
    draw: [
      ['Sketch the velocity–time graph for a ball thrown straight up, until it returns.', 'A straight line falling steadily, from +u through zero to −u.', 'Zero at the highest point, with the slope equal to −g throughout.'],
    ],
  }),
  ...facts(2, 'b', {
    define: [
      ['a projectile', 'A body thrown into the air and moving under gravity alone.'],
      ['the range of a projectile', 'The horizontal distance it covers before returning to its starting level.'],
      ['a unit vector', 'A vector of magnitude one, used to show a direction.'],
    ],
    recall: [
      ['The range of a projectile is greatest at a launch angle of:', '45°', '30°', '60°', '90°'],
      ['At the highest point of its path, a projectile’s velocity is:', 'horizontal', 'vertical', 'zero', 'at 45° to the ground'],
      ['The path of a projectile, ignoring air, is a:', 'parabola', 'circle', 'straight line', 'hyperbola'],
      ['At the highest point of its path, the angle between a projectile’s velocity and acceleration is:', '90°', '0°', '45°', '180°'],
    ],
    reason: [
      ['A projectile’s horizontal speed stays constant.', 'No force acts horizontally, ignoring air.'],
      ['A dropped ball and a ball thrown sideways from the same height land together.', 'Vertical motion doesn’t depend on horizontal motion.', 'Both have the same downward acceleration and start with no vertical speed.'],
    ],
    compare: [
      ['a scalar', 'a vector', ['Has size only.', 'Has size and direction.'], ['Example: mass.', 'Example: force.']],
    ],
    truths: [
      ['Vertical and horizontal motions of a projectile are independent.', 'Vertical and horizontal motions of a projectile always affect each other.'],
      ['The time of flight doubles if the launch speed doubles at the same angle.', 'The time of flight is four times as long if the launch speed doubles at the same angle.'],
      ['The range is proportional to the square of the launch speed.', 'The range is proportional to the launch speed.'],
      ['Two vectors are equal only if they have the same size and direction.', 'Two vectors are equal if they have the same size, whatever their directions.'],
    ],
    figures: { 'Show that the path of a projectile is a parabola.': { kind: 'projectile', v: 'u', angle: 'θ' } },
    long: [
      ['Show that the path of a projectile is a parabola.', 'Horizontally, x = (u cos θ)t, so t = x/(u cos θ).', 'Vertically, y = (u sin θ)t − ½gt².', 'Substituting t gives y = x tan θ − gx²/(2u²cos²θ).', 'This has the form y = ax − bx², which is a parabola.'],
    ],
    cases: [
      {
        scene: 'At a school sports day, a shot-putter wonders how to throw as far as possible. The coach says that the launch angle and speed both matter, and that the throw starts from shoulder height.',
        parts: [
          ['Ignoring the release height, which angle gives the longest throw?', '45°.', 1],
          ['If the throw speed is doubled, what happens to the range?', 'It becomes four times as long.', 1],
          ['Why is the best angle slightly below 45° in practice?', 'The shot is released above the ground, so it has extra time in the air.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 3: Laws of motion
  mcqNum('f-ma', [3, 'a', 1, 1], {
    text: 'A force of {F} N acts on a {M} kg trolley on a smooth track. Its acceleration is:',
    vars: { F: [4, 24, 2], M: [2, 8, 1] },
    use: 'p-xi-3-24',
    find: 'a',
    given: { F_net: 'F N', m: 'M kg' },
    diagram: (v) => ({ kind: 'block', m: `${v.M} kg`, forces: [{ dir: 'right', label: `${v.F} N` }] }),
    mistakes: (v) => [
      ['multiplied instead of dividing', v.F * v.M],
      ['divided mass by force', v.M / v.F],
      ['subtracted the mass', v.F - v.M],
      ['halved the force', v.F / (2 * v.M)],
    ],
  }),
  num('impulse', [3, 'a', 2, 2], {
    text: 'A {M} kg ball moving at {U} m/s is hit, and leaves at {V} m/s in the same direction. The contact lasts {T} s. Find the average force.',
    vars: { M: [0.2, 0.5, 0.1], U: [5, 15, 5], V: [20, 40, 5], T: [0.02, 0.1, 0.02] },
    parts: [{ ask: 'Average force', use: 'p-xi-3-25', find: 'F', given: { m: 'M kg', v: 'V m/s', u: 'U m/s', t: 'T s' }, marks: 2 }],
  }),
  num('recoil', [3, 'a', 2, 2], {
    text: 'A {B} g bullet leaves a {G} kg gun at {V} m/s. Find the recoil speed of the gun.',
    vars: { B: [10, 50, 10], G: [2, 6, 1], V: [200, 800, 100] },
    parts: [{ ask: 'Recoil speed', use: 'p-xi-3-36', find: 'V', given: { m: 'B g', v: 'V m/s', M: 'G kg' }, marks: 2 }],
  }),
  num('friction-block', [3, 'b', 3, 2], {
    text: 'A {M} kg box is pushed with a force of {F} N across a floor, with a coefficient of kinetic friction of {U}.',
    vars: { M: [5, 30, 5], F: [40, 150, 10], U: [0.1, 0.4, 0.1] },
    when: (v) => v.F > v.U * v.M * 9.8 * 1.1,
    parts: [
      { ask: 'Friction force', use: 'p-xi-3-4', find: 'f_k', given: { mu_k: 'U', N: 'M*9.8 N' }, marks: 1 },
      { ask: 'Acceleration', use: 'p-xi-3-70', find: 'a', given: { F: 'F N', mu_k: 'U', m: 'M kg' }, marks: 2 },
    ],
    diagram: (v) => ({ kind: 'block', m: `${v.M} kg`, forces: [{ dir: 'right', label: `${v.F} N` }, { dir: 'left', label: 'friction' }] }),
  }),
  num('incline', [3, 'b', 2, 2], {
    text: 'A block slides down a {T}° slope with a coefficient of kinetic friction of {U}. Find its acceleration.',
    vars: { T: [30, 60, 15], U: [0.1, 0.3, 0.1] },
    parts: [{ ask: 'Acceleration down the slope', use: 'p-xi-3-9', find: 'a', given: { theta: 'T deg', mu: 'U' }, marks: 2 }],
    diagram: (v) => ({ kind: 'incline', angle: `${v.T}°`, m: 'm', mu: `μ = ${v.U}` }),
    sim: (v) => ({ id: 'inclined', preset: { deg: v.T, mu: v.U } }),
  }),
  num('pulley', [3, 'a', 3, 3], {
    text: 'Masses of {A} kg and {B} kg hang from the two ends of a light string over a smooth pulley.',
    vars: { A: [2, 8, 1], B: [3, 10, 1] },
    when: (v) => v.B > v.A,
    parts: [
      { ask: 'Acceleration of the masses', use: 'p-xi-3-95', find: 'a', given: { m_1: 'B kg', m_2: 'A kg' }, marks: 2 },
      { ask: 'Tension in the string', use: 'p-xi-3-96', find: 'T', given: { m_1: 'B kg', m_2: 'A kg' }, marks: 1 },
    ],
    diagram: (v) => ({ kind: 'pulley', m1: `${v.A} kg`, m2: `${v.B} kg` }),
    sim: (v) => ({ id: 'atwood', preset: { m1: v.B, m2: v.A } }),
  }),
  mcqNum('lift', [3, 'a', 1, 2], {
    style: 'cbq-style',
    text: 'A {M} kg person stands on a scale in a lift that accelerates upwards at {A} m/s². The scale reads, in newtons:',
    vars: { M: [40, 80, 10], A: [1, 3, 1] },
    use: 'p-xi-3-105',
    find: 'N',
    given: { m: 'M kg', a: 'A m/s^2' },
    diagram: (v) => ({ kind: 'block', m: `${v.M} kg`, forces: [{ dir: 'up', label: `lift rising at ${v.A} m/s²` }, { dir: 'down', label: 'weight' }] }),
    mistakes: (v) => [
      ['used g − a instead of g + a', v.M * (9.8 - v.A)],
      ['ignored the acceleration', v.M * 9.8],
      ['used a alone', v.M * v.A],
      ['used g + 2a', v.M * (9.8 + 2 * v.A)],
    ],
  }),
  num('centripetal', [3, 'c', 2, 1], {
    diagram: (v) => ({ kind: 'circle', r: `${v.R} m`, v: `${v.V} m/s`, m: `${v.M} kg` }),
    text: 'A {M} kg stone on a string moves in a horizontal circle of radius {R} m at {V} m/s. Find the tension, ignoring gravity.',
    vars: { M: [0.2, 1, 0.2], R: [0.5, 2, 0.5], V: [2, 8, 1] },
    parts: [{ ask: 'Tension', use: 'p-xi-3-5', find: 'F_c', given: { m: 'M kg', v: 'V m/s', r: 'R m' }, marks: 2 }],
  }),
  num('banking', [3, 'c', 3, 2], {
    style: 'cbq-style',
    variants: [
      { text: 'A highway curve has a radius of {R} m and is banked at {T}°. Find the speed at which a car needs no friction to take it.', parts: [{ ask: 'Best speed', use: 'p-xi-3-6', find: 'v', given: { r: 'R m', theta: 'T deg' }, marks: 3 }] },
      { text: 'A level curve has a radius of {R} m, and the tyres have a coefficient of static friction of {U}. Find the highest safe speed.', parts: [{ ask: 'Highest safe speed', use: 'p-xi-3-120', find: 'v_max', given: { mu_s: 'U', r: 'R m' }, marks: 3 }] },
    ],
    vars: { R: [50, 300, 50], T: [5, 20, 5], U: [0.2, 0.8, 0.1] },
  }),
  ...facts(3, 'a', {
    define: [
      ['inertia', 'The tendency of a body to keep its state of rest or uniform motion.'],
      ['momentum', 'The product of a body’s mass and its velocity.', 'It is a vector, with SI unit kg m/s.'],
      ['impulse', 'The product of a force and the time for which it acts, equal to the change of momentum.'],
    ],
    recall: [
      ['Newton’s first law gives the idea of:', 'inertia', 'momentum', 'energy', 'power'],
      ['Action and reaction forces act on:', 'different bodies', 'the same body', 'only moving bodies', 'only heavy bodies'],
      ['The rate of change of momentum equals the:', 'net force', 'impulse', 'kinetic energy', 'power'],
      ['In a lift falling freely, the apparent weight of a person is:', 'zero', 'the same as usual', 'double', 'half'],
    ],
    reason: [
      ['A cricketer pulls the hands back when catching a fast ball.', 'This increases the time taken to stop the ball.', 'So the force on the hands is smaller for the same change of momentum.'],
      ['Passengers lurch forward when a bus suddenly stops.', 'Their bodies tend to keep moving, because of inertia.'],
      ['Rockets work in empty space.', 'Exhaust gases are pushed backwards.', 'By Newton’s third law, they push the rocket forward.'],
    ],
    compare: [
      ['mass', 'weight', ['The amount of matter in a body.', 'The gravitational force on a body.'], ['A scalar, measured in kilograms.', 'A vector, measured in newtons.'], ['The same everywhere.', 'Changes from place to place.']],
    ],
    truths: [
      ['Momentum is conserved when no external force acts.', 'Momentum is conserved only when no internal force acts.'],
      ['Impulse has the same unit as momentum.', 'Impulse has the same unit as energy.'],
      ['A greater mass has a greater inertia.', 'A greater mass has a smaller inertia.'],
      ['The SI unit of force is the newton, equal to 1 kg m/s².', 'The SI unit of force is the newton, equal to 1 kg m/s.'],
    ],
    long: [
      ['Show that Newton’s second law leads to F = ma for a body of constant mass.', 'The law says that force is proportional to the rate of change of momentum.', 'So F = k d(mv)/dt.', 'With constant mass, this is k m dv/dt = kma.', 'Choosing units so that k = 1 gives F = ma.'],
      ['Using Newton’s laws, derive the law of conservation of momentum for two colliding bodies.', 'During contact, each body exerts a force on the other.', 'By Newton’s third law, these forces are equal and opposite.', 'So F t on each gives equal and opposite changes of momentum.', 'The total change of momentum is zero, so the total stays constant.'],
    ],
    draw: [
      ['Draw a free-body diagram of a person standing in a lift accelerating upwards.', 'Weight mg acting downwards.', 'A larger normal reaction N acting upwards.'],
    ],
    cases: [
      {
        scene: 'A car’s airbag inflates in a crash, and a seat belt stretches slightly, both holding a passenger who is moving fast. Crumple zones at the front of the car also fold on impact.',
        parts: [
          ['What’s the same with or without these safety features?', 'The change of momentum of the passenger.', 1],
          ['What do these features change?', 'They make the stopping time longer.', 1],
          ['Why does that make the crash less harmful?', 'A longer time means a smaller force for the same impulse.', 1],
        ],
      },
    ],
  }),
  ...facts(3, 'b', {
    define: [
      ['static friction', 'The force that opposes the start of sliding between two surfaces in contact.'],
      ['the coefficient of friction', 'The ratio of the friction force to the normal reaction.'],
      ['the angle of repose', 'The steepest slope on which a body stays at rest without sliding.'],
    ],
    recall: [
      ['Kinetic friction, compared with limiting static friction, is usually:', 'smaller', 'larger', 'exactly equal', 'zero'],
      ['Friction doesn’t depend, to a good approximation, on the:', 'area of contact', 'normal reaction', 'surfaces', 'roughness'],
      ['tan of the angle of repose equals the:', 'coefficient of static friction', 'normal reaction', 'weight', 'acceleration'],
      ['Rolling friction, compared with sliding friction, is usually:', 'much smaller', 'much larger', 'the same', 'zero always'],
    ],
    reason: [
      ['It is easier to pull a lawn roller than to push it.', 'Pulling lifts it slightly, which reduces the normal reaction.', 'So friction is smaller.'],
      ['Ball bearings are used in machines.', 'They replace sliding friction with much smaller rolling friction.'],
      ['Friction is needed to walk.', 'You push backwards on the ground.', 'Friction from the ground pushes you forward.'],
    ],
    compare: [
      ['static friction', 'kinetic friction', ['Acts before sliding starts.', 'Acts during sliding.'], ['Adjusts its size up to a limit.', 'Stays roughly constant.']],
    ],
    truths: [
      ['Limiting friction is proportional to the normal reaction.', 'Limiting friction is proportional to the area of contact.'],
      ['Static friction can be less than its limiting value.', 'Static friction always equals its limiting value.'],
      ['Three forces in equilibrium can be drawn as a closed triangle.', 'Three forces in equilibrium can never be drawn as a closed triangle.'],
    ],
    draw: [
      ['Draw a free-body diagram of a block at rest on a rough slope.', 'Weight downwards, and a normal reaction at right angles to the slope.', 'Friction acting up the slope.'],
    ],
  }),
  ...facts(3, 'c', {
    define: [
      ['centripetal force', 'The inward force that keeps a body moving in a circle.'],
      ['banking of roads', 'Raising the outer edge of a curve, so that part of the normal reaction provides the centripetal force.'],
    ],
    recall: [
      ['For a car on a level curve, the centripetal force comes from:', 'friction', 'the engine', 'air resistance', 'the weight'],
      ['Centripetal acceleration is directed:', 'towards the centre', 'away from the centre', 'along the tangent', 'along the velocity'],
      ['If the speed in a circle doubles, the centripetal force becomes:', 'four times', 'twice', 'half', 'the same'],
    ],
    reason: [
      ['Roads are banked on curves.', 'Part of the normal reaction then provides the centripetal force.', 'So less friction is needed.'],
      ['A cyclist leans inward on a turn.', 'The normal reaction then has a component towards the centre.', 'That provides centripetal force.'],
    ],
    truths: [
      ['Uniform circular motion has a constant speed, but a changing velocity.', 'Uniform circular motion has a constant velocity.'],
      ['Centripetal force does no work on a body in a circle.', 'Centripetal force does positive work on a body in a circle.'],
      ['Tension in a string is greatest at the bottom of a vertical circle.', 'Tension in a string is greatest at the top of a vertical circle.'],
    ],
    long: [
      ['Derive an expression for the best speed on a banked road, with no friction.', 'Resolve the normal reaction: N cos θ balances the weight mg.', 'N sin θ provides the centripetal force mv²/r.', 'Dividing the two gives tan θ = v²/(rg).', 'So v = √(rg tan θ).'],
    ],
  }),

  // ---- Unit 4: Work, energy, power
  mcqNum('ke', [4, 'a', 1, 1], {
    text: 'A {M} kg ball moves at {V} m/s. Its kinetic energy is:',
    vars: { M: [0.5, 5, 0.5], V: [2, 12, 2] },
    use: 'p-xi-4-2',
    find: 'K',
    given: { m: 'M kg', v: 'V m/s' },
    mistakes: (v) => [
      ['forgot to square the speed', 0.5 * v.M * v.V],
      ['forgot the half', v.M * v.V * v.V],
      ['found the momentum', v.M * v.V],
      ['squared the mass', 0.5 * v.M * v.M * v.V * v.V],
    ],
  }),
  num('power-pump', [4, 'a', 2, 1], {
    style: 'cbq-style',
    text: 'A water pump lifts {M} kg of water through {H} m in {T} s. Find its power.',
    vars: { M: [100, 500, 100], H: [5, 25, 5], T: [10, 60, 10] },
    parts: [{ ask: 'Power', use: 'p-xi-4-73', find: 'P', given: { m: 'M kg', h: 'H m', t: 'T s' }, marks: 2 }],
  }),
  num('spring', [4, 'a', 2, 2], {
    text: 'A spring of constant {K} N/m is compressed by {X} cm. Find the energy stored in it.',
    vars: { K: [100, 800, 100], X: [2, 10, 2] },
    parts: [{ ask: 'Energy stored', use: 'p-xi-4-5', find: 'U', given: { k: 'K N/m', x: 'X cm' }, marks: 2 }],
    diagram: (v) => ({ kind: 'spring', k: `${v.K} N/m`, m: 'block', a: `${v.X} cm` }),
    sim: (v) => ({ id: 'spring', preset: { k: v.K, x: v.X / 100 } }),
  }),
  num('roller', [4, 'a', 3, 2], {
    diagram: (v) => ({ kind: 'hill', H: `${v.H} m`, m: `${v.M} kg`, point: { label: `${v.P} m`, fraction: v.P / v.H } }),
    style: 'cbq-style',
    text: 'A roller coaster car of mass {M} kg starts from rest at the top of a {H} m hill. Ignore friction.',
    vars: { M: [200, 800, 200], H: [10, 40, 5], P: [2, 8, 2] },
    when: (v) => v.P < v.H,
    parts: [
      { ask: 'Potential energy at the top', use: 'p-xi-4-4', find: 'U', given: { m: 'M kg', h: 'H m' }, marks: 1 },
      { ask: 'Speed when it is {P} m above the ground', use: 'p-xi-4-57', find: 'v', given: { H: 'H m', h: 'P m' }, marks: 2 },
    ],
  }),
  num('collision', [4, 'b', 3, 2], {
    diagram: (v) => ({ kind: 'trolleys', a: `${v.A} kg`, b: `${v.B} kg`, v: `${v.U} m/s` }),
    text: 'A {A} kg trolley moving at {U} m/s hits a {B} kg trolley at rest. They stick together.',
    vars: { A: [1, 6, 1], U: [2, 10, 2], B: [1, 6, 1] },
    parts: [
      { ask: 'Speed after the collision', use: 'p-xi-4-96', find: 'v', given: { m_1: 'A kg', u_1: 'U m/s', m_2: 'B kg', u_2: '0 m/s' }, marks: 2, save: 'v' },
      { ask: 'Reduced mass of the pair', use: 'p-xi-4-101', find: 'mu', given: { m_1: 'A kg', m_2: 'B kg' }, marks: 1 },
    ],
  }),
  num('restitution', [4, 'b', 2, 2], {
    diagram: (v) => ({ kind: 'drop', h: `${v.H} m`, rebound: { label: `${v.R} m`, fraction: v.R / v.H } }),
    text: 'A ball dropped from {H} m rebounds to {R} m. Find the coefficient of restitution.',
    vars: { H: [1, 5, 1], R: [0.2, 0.8, 0.2] },
    parts: [{ ask: 'Coefficient of restitution', use: 'p-xi-4-106', find: 'e_r', given: { h_2: 'R m', h_1: 'H m' }, marks: 2 }],
  }),
  ...facts(4, 'a', {
    define: [
      ['work done by a force', 'The product of the force and the displacement in its direction.'],
      ['kinetic energy', 'The energy of a body because of its motion, equal to ½mv².'],
      ['power', 'The rate of doing work.', 'Its SI unit is the watt.'],
      ['the work-energy theorem', 'The net work done on a body equals the change in its kinetic energy.'],
    ],
    recall: [
      ['Work done by a force at right angles to the motion is:', 'zero', 'positive', 'negative', 'maximum'],
      ['1 kWh equals:', '3.6 × 10⁶ J', '3.6 × 10³ J', '1000 J', '60 J'],
      ['If momentum doubles, kinetic energy becomes:', 'four times', 'twice', 'half', 'the same'],
      ['Which is a conservative force?', 'Gravity', 'Friction', 'Air resistance', 'Viscous drag'],
    ],
    reason: [
      ['A person holding a heavy bag still does no work on it.', 'The bag doesn’t move.', 'Work needs a displacement.'],
      ['No work is done by gravity on a satellite in a circular orbit.', 'Its force is always at right angles to the velocity.'],
    ],
    compare: [
      ['conservative forces', 'non-conservative forces', ['Work done doesn’t depend on the path.', 'Work done depends on the path.'], ['Work around a closed loop is zero.', 'Work around a closed loop isn’t zero.']],
    ],
    truths: [
      ['Energy can change form, but its total is conserved.', 'Energy can be created when a machine runs.'],
      ['Kinetic energy can’t be negative.', 'Potential energy can’t be negative.'],
      ['Friction does negative work on a sliding body.', 'Friction does positive work on a sliding body.'],
    ],
    long: [
      ['Prove the work-energy theorem for a constant force.', 'From v² = u² + 2as, we have as = ½(v² − u²).', 'Multiplying by m gives mas = ½mv² − ½mu².', 'Since F = ma, Fs = ½mv² − ½mu².', 'So work done equals the change of kinetic energy.'],
    ],
  }),
  ...facts(4, 'b', {
    define: [
      ['an elastic collision', 'A collision in which both momentum and kinetic energy are conserved.'],
      ['the coefficient of restitution', 'The ratio of the speed of separation to the speed of approach.'],
    ],
    recall: [
      ['In a perfectly inelastic collision, the bodies:', 'stick together', 'bounce apart', 'keep all their kinetic energy', 'stop'],
      ['For a perfectly elastic collision, the coefficient of restitution is:', '1', '0', '0.5', 'infinite'],
      ['In every collision without outside forces, what is conserved?', 'Momentum', 'Kinetic energy', 'Speed', 'Velocity'],
      ['If a body hits an equal one at rest in an elastic, head-on collision:', 'they exchange velocities', 'both stop', 'they stick together', 'both speed up'],
    ],
    reason: [
      ['Kinetic energy is lost in an inelastic collision, though momentum isn’t.', 'Some kinetic energy goes into heat, sound and changing shape.', 'Momentum has no other form to change into.'],
    ],
    compare: [
      ['elastic collisions', 'inelastic collisions', ['Kinetic energy is conserved.', 'Kinetic energy isn’t conserved.'], ['Coefficient of restitution is 1.', 'Coefficient of restitution is below 1.']],
    ],
    truths: [
      ['Momentum is conserved in an inelastic collision.', 'Momentum is lost in an inelastic collision.'],
      ['Kinetic energy falls in a perfectly inelastic collision.', 'Kinetic energy rises in a perfectly inelastic collision.'],
      ['Coefficient of restitution is at most 1 for ordinary collisions.', 'Coefficient of restitution is at least 1 for ordinary collisions.'],
    ],
  }),

  // ---- Unit 5: Rotation
  num('torque', [5, 'b', 2, 1], {
    diagram: (v) => ({ kind: 'lever', r: `${v.R} cm`, F: `${v.F} N`, angle: `${v.T}°`, deg: v.T }),
    text: 'A force of {F} N is applied at {R} cm from a hinge, at {T}° to the door. Find the torque.',
    vars: { F: [10, 50, 10], R: [30, 90, 10], T: [30, 90, 30] },
    parts: [{ ask: 'Torque', use: 'p-xi-5-43', find: 'tau', given: { r: 'R cm', F: 'F N', theta: 'T deg' }, marks: 2 }],
  }),
  num('inertia-ring', [5, 'c', 2, 1], {
    variants: [
      { text: 'Find the moment of inertia of a uniform rod of mass {M} kg and length {L} m, about an axis through its centre at right angles to it.', parts: [{ ask: 'Moment of inertia', use: 'p-xi-5-5', find: 'I', given: { M: 'M kg', L: 'L m' }, marks: 2 }] },
      { text: 'Find the moment of inertia of a thin ring of mass {M} kg and radius {R} cm, about an axis through its centre at right angles to its plane.', parts: [{ ask: 'Moment of inertia', use: 'p-xi-5-6', find: 'I', given: { M: 'M kg', R: 'R cm' }, marks: 2 }] },
    ],
    vars: { M: [0.5, 5, 0.5], L: [1, 3, 0.5], R: [10, 50, 10] },
  }),
  num('skater', [5, 'b', 3, 2], {
    style: 'cbq-style',
    text: 'An ice skater spinning at {W} rad/s, with a moment of inertia of {I} kg m², pulls in the arms, which lowers the moment of inertia to {J} kg m².',
    vars: { W: [2, 8, 1], I: [4, 8, 1], J: [1, 3, 1] },
    parts: [
      { ask: 'New angular speed', use: 'p-xi-5-22', find: 'omega_2', given: { I_1: 'I kg*m^2', omega_1: 'W rad/s', I_2: 'J kg*m^2' }, marks: 2, save: 'w' },
      { ask: 'Rotational kinetic energy after pulling in', use: 'p-xi-5-8', find: 'K', given: { I: 'J kg*m^2', omega: 'w' }, marks: 1 },
    ],
  }),
  num('com', [5, 'a', 2, 1], {
    diagram: (v) => ({ kind: 'axis-masses', items: [{ m: `${v.A} kg`, x: 'x = 0' }, { m: `${v.B} kg`, x: `x = ${v.D} m` }] }),
    text: 'Masses of {A} kg and {B} kg are at x = 0 and x = {D} m. Find the position of their centre of mass.',
    vars: { A: [1, 8, 1], B: [1, 8, 1], D: [1, 6, 1] },
    parts: [{ ask: 'x-coordinate of the centre of mass', use: 'p-xi-5-7', find: 'x_cm', given: { m_1: 'A kg', x_1: '0 m', m_2: 'B kg', x_2: 'D m' }, marks: 2 }],
  }),
  ...facts(5, 'a', {
    define: [
      ['the centre of mass', 'The point at which the whole mass of a body can be taken to act, for the study of its motion.'],
    ],
    recall: [
      ['The centre of mass of a uniform disc lies:', 'at its centre', 'on the rim', 'halfway between the centre and the rim', 'outside the disc'],
      ['An exploding firework’s centre of mass, ignoring air, follows:', 'the same parabola', 'a straight vertical path', 'a circle', 'a horizontal straight line'],
      ['Internal forces in a system:', 'don’t change the motion of its centre of mass', 'always stop it', 'always speed it up', 'change its mass'],
    ],
    reason: [
      ['A bomb’s centre of mass keeps moving along its path after it explodes.', 'Explosion forces are all internal.', 'So they can’t change the motion of the centre of mass.'],
    ],
    truths: [
      ['The centre of mass may lie outside the body.', 'The centre of mass must lie within the body.'],
      ['For a uniform sphere, the centre of mass is at the geometric centre.', 'For a uniform sphere, the centre of mass is on the surface.'],
      ['The centre of mass of two equal masses is midway between them.', 'The centre of mass of two equal masses is at one of them.'],
    ],
  }),
  ...facts(5, 'b', {
    define: [
      ['torque', 'The turning effect of a force, equal to the force times its perpendicular distance from the axis.'],
      ['angular momentum', 'The moment of linear momentum about an axis, r × p.'],
      ['conservation of angular momentum', 'If no external torque acts, a system’s angular momentum stays the same.'],
    ],
    recall: [
      ['The SI unit of torque is:', 'N m', 'N', 'J/s', 'kg m/s'],
      ['A skater who pulls in the arms:', 'spins faster', 'spins slower', 'stops', 'loses angular momentum'],
      ['The rotational analogue of force is:', 'torque', 'moment of inertia', 'angular velocity', 'angular momentum'],
    ],
    reason: [
      ['Door handles are placed far from the hinges.', 'A larger distance from the axis gives a larger torque for the same force.'],
      ['A spinning skater speeds up on pulling in the arms.', 'The moment of inertia falls.', 'Angular momentum stays constant, so the angular speed rises.'],
    ],
    compare: [
      ['force', 'torque', ['Causes a change in linear motion.', 'Causes a change in rotation.'], ['Measured in newtons.', 'Measured in newton metres.']],
    ],
    truths: [
      ['Torque is zero when the force passes through the axis.', 'Torque is greatest when the force passes through the axis.'],
      ['Angular momentum is a vector.', 'Angular momentum is a scalar.'],
      ['A body in equilibrium has no net force and no net torque.', 'A body in equilibrium has no net force, but must have a net torque.'],
    ],
  }),
  ...facts(5, 'c', {
    define: [
      ['moment of inertia', 'A body’s resistance to changes in rotation, given by the sum of mr² over all its particles.'],
      ['radius of gyration', 'The distance from the axis at which the whole mass could sit, giving the same moment of inertia.'],
    ],
    recall: [
      ['A ring and a disc of the same mass and radius: which has the larger moment of inertia about its axis?', 'The ring', 'The disc', 'They’re equal', 'It depends on speed'],
      ['A ring and a disc roll down a slope together. Which reaches the bottom first?', 'The disc', 'The ring', 'They tie', 'Neither moves'],
      ['The theorem of parallel axes relates I about any axis to I about:', 'a parallel axis through the centre of mass', 'any other axis', 'a perpendicular axis only', 'the edge only'],
    ],
    reason: [
      ['A flywheel has most of its mass at its rim.', 'This raises the moment of inertia.', 'So it keeps turning smoothly.'],
    ],
    truths: [
      ['Moment of inertia depends on the axis chosen.', 'Moment of inertia doesn’t depend on the axis chosen.'],
      ['The perpendicular axes theorem applies only to flat bodies.', 'The perpendicular axes theorem applies to all bodies.'],
      ['A rolling body has both translational and rotational energy.', 'A rolling body has only rotational energy.'],
    ],
    long: [
      ['Show that the kinetic energy of a rotating rigid body is ½Iω².', 'Each particle has speed v = rω.', 'Its kinetic energy is ½m r²ω².', 'Adding over all particles gives ½(Σmr²)ω².', 'Since I = Σmr², K = ½Iω².'],
    ],
  }),

  // ---- Unit 6: Gravitation
  mcqNum('gravity-force', [6, 'a', 1, 1], {
    text: 'Two {M} kg spheres have centres {R} m apart. The gravitational force between them is:',
    vars: { M: [100, 900, 100], R: [1, 5, 1] },
    use: 'p-xi-6-1',
    find: 'F',
    given: { m_1: 'M kg', m_2: 'M kg', r: 'R m' },
    mistakes: (v, a) => [
      ['forgot to square the distance', a * v.R],
      ['used one mass only', a / v.M],
      ['added the masses', (a / v.M / v.M) * (2 * v.M)],
      ['doubled the force', 2 * a],
    ],
  }),
  num('g-height', [6, 'a', 2, 2], {
    variants: [
      { diagram: (v) => ({ kind: 'orbit', height: `${v.H} km`, mass: 'Earth' }), text: 'Find g at a height of {H} km above the Earth’s surface. Take the Earth’s radius to be 6400 km.', parts: [{ ask: 'g at that height', use: 'p-xi-6-27', find: 'g_h', given: { h: 'H km', R: '6400 km' }, marks: 2 }] },
      { text: 'Find g at a depth of {D} km below the Earth’s surface. Take the Earth’s radius to be 6400 km.', parts: [{ ask: 'g at that depth', use: 'p-xi-6-32', find: 'g_d', given: { d: 'D km', R: '6400 km' }, marks: 2 }] },
    ],
    vars: { H: [100, 900, 100], D: [100, 3000, 100] },
  }),
  num('satellite', [6, 'b', 3, 2], {
    style: 'cbq-style',
    text: 'A weather satellite orbits {H} km above the Earth’s surface. Take the Earth’s mass to be 6 × 10²⁴ kg, and its radius to be 6400 km.',
    vars: { H: [400, 2000, 200] },
    derive: (v) => ({ R: 6400 + v.H }),
    parts: [
      { ask: 'Orbital speed', use: 'p-xi-6-86', find: 'v_o', given: { M: '6e24 kg', R: '6400 km', h: 'H km' }, marks: 2 },
      { ask: 'Period of the orbit', use: 'p-xi-6-6', find: 'T', given: { r: 'R km', M: '6e24 kg' }, unit: 'min', marks: 1 },
    ],
    diagram: (v) => ({ kind: 'orbit', height: `${v.H} km`, mass: '6 × 10²⁴ kg' }),
  }),
  num('escape', [6, 'b', 2, 1], {
    text: 'A planet has a mass of {M} × 10²⁴ kg and a radius of {R} km. Find its escape velocity.',
    vars: { M: [1, 9, 1], R: [3000, 9000, 1000] },
    parts: [{ ask: 'Escape velocity', use: 'p-xi-6-4', find: 'v_e', given: { M: 'M*1e24 kg', R: 'R km' }, unit: 'km/s', marks: 2 }],
  }),
  ...facts(6, 'a', {
    define: [
      ['Newton’s law of gravitation', 'Every two masses attract each other with a force proportional to the product of their masses, and inversely proportional to the square of the distance between them.'],
      ['acceleration due to gravity', 'The acceleration of a freely falling body, caused by the Earth’s pull.'],
    ],
    recall: [
      ['As you go deeper into a uniform Earth, g:', 'decreases', 'increases', 'stays the same', 'becomes negative'],
      ['The SI unit of G is:', 'N m² kg⁻²', 'N m kg⁻¹', 'N kg⁻²', 'N m² kg⁻¹'],
      ['Kepler’s first law says that planets move in:', 'ellipses', 'circles', 'parabolas', 'straight lines'],
      ['Kepler’s third law says that T² is proportional to:', 'r³', 'r²', 'r', '1/r'],
    ],
    reason: [
      ['g is smaller at the equator than at the poles.', 'The Earth bulges at the equator, so the surface is further from the centre.', 'The Earth’s rotation also reduces the apparent g there.'],
      ['Astronauts in orbit feel weightless.', 'They and their spacecraft are falling freely together.', 'So there’s no normal reaction.'],
    ],
    compare: [
      ['gravitational mass', 'inertial mass', ['Measured by the pull of gravity.', 'Measured by resistance to acceleration.'], ['Shows up in the law of gravitation.', 'Shows up in F = ma.']],
    ],
    truths: [
      ['The value of G is the same everywhere in the universe.', 'The value of G changes from planet to planet.'],
      ['A planet moves fastest when closest to the Sun.', 'A planet moves slowest when closest to the Sun.'],
      ['Gravity is always attractive.', 'Gravity can be attractive or repulsive.'],
      ['Escape speed from the Earth doesn’t depend on the mass of the body.', 'Escape speed from the Earth is greater for a heavier body.'],
    ],
    figures: { 'Derive an expression for g at a height h above the Earth’s surface, and approximate it for small h.': { kind: 'orbit', height: 'h', mass: 'M' } },
    long: [
      ['Derive an expression for g at a height h above the Earth’s surface, and approximate it for small h.', 'At the surface, g = GM/R².', 'At height h, g_h = GM/(R + h)².', 'So g_h = g(R/(R + h))² = g(1 + h/R)⁻².', 'For small h, g_h ≈ g(1 − 2h/R).'],
    ],
  }),
  ...facts(6, 'b', {
    define: [
      ['escape velocity', 'The least speed needed for a body to leave a planet’s gravity for good, ignoring air.'],
      ['a geostationary satellite', 'A satellite above the equator, with a period of 24 hours, so it appears fixed from the ground.'],
      ['orbital velocity', 'The speed a satellite needs in order to stay in a given circular orbit.'],
    ],
    recall: [
      ['The Earth’s escape velocity is about:', '11.2 km/s', '7.9 km/s', '3 km/s', '340 m/s'],
      ['Escape velocity doesn’t depend on the:', 'mass of the projectile', 'mass of the planet', 'radius of the planet', 'g of the planet'],
      ['The total energy of a satellite in orbit is:', 'negative', 'positive', 'zero', 'infinite'],
      ['The period of a geostationary satellite is:', '24 hours', '12 hours', '1 hour', '365 days'],
    ],
    reason: [
      ['The Moon has no atmosphere.', 'Its escape velocity is small.', 'So gas molecules there can move fast enough to leave.'],
      ['A satellite’s total energy is negative.', 'It is bound to the Earth.', 'Its negative potential energy outweighs its kinetic energy.'],
    ],
    compare: [
      ['orbital velocity', 'escape velocity', ['Keeps a satellite in orbit.', 'Lets a body leave for good.'], ['Near the surface, it is √(gR).', 'Near the surface, it is √(2gR).']],
    ],
    truths: [
      ['Escape velocity is √2 times the orbital velocity near the surface.', 'Escape velocity equals the orbital velocity near the surface.'],
      ['Higher orbits have longer periods.', 'Higher orbits have shorter periods.'],
      ['Orbital speed falls as the orbit gets larger.', 'Orbital speed rises as the orbit gets larger.'],
    ],
    long: [
      ['Derive an expression for the escape velocity from a planet.', 'A body at the surface has potential energy −GMm/R.', 'To just escape, its total energy must be zero at infinity.', 'So ½mv² = GMm/R.', 'This gives v = √(2GM/R).'],
    ],
    cases: [
      {
        scene: 'A television company rents space on a satellite that stays over one spot on the equator. A separate weather satellite passes over the poles several times a day.',
        parts: [
          ['Why does the first satellite appear fixed in the sky?', 'Its period of 24 hours matches the Earth’s rotation.', 1],
          ['Which satellite is at the greater height?', 'The geostationary one.', 1],
          ['Why is a polar orbit useful for weather pictures?', 'The Earth turns beneath it, so it sees the whole surface in turn.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 7: Bulk matter
  num('stretch', [7, 'a', 3, 2], {
    diagram: (v) => ({ kind: 'hanging', L: `${v.L} m`, A: `${v.A} mm²`, F: `${v.F} N`, e: `${v.E} mm` }),
    text: 'A wire {L} m long with a cross-section of {A} mm² stretches by {E} mm under a load of {F} N.',
    vars: { L: [1, 4, 1], A: [1, 4, 1], E: [0.5, 2, 0.5], F: [50, 200, 50] },
    parts: [
      { ask: 'Stress', use: 'p-xi-7-9', find: 'sigma', given: { F: 'F N', A: 'A mm^2' }, marks: 1 },
      { ask: 'Young’s modulus', use: 'p-xi-7-1', find: 'Y', given: { F: 'F N', L: 'L m', A: 'A mm^2', DeltaL: 'E mm' }, marks: 2 },
    ],
  }),
  mcqNum('pressure-depth', [7, 'b', 1, 1], {
    text: 'What is the gauge pressure from water at a depth of {H} m? Take the density of water as 1000 kg/m³.',
    vars: { H: [2, 20, 2] },
    use: 'p-xi-7-5',
    find: 'P',
    given: { P_0: '0 Pa', rho: '1000 kg/m^3', h: 'H m' },
    mistakes: (v) => [
      ['forgot g', 1000 * v.H],
      ['forgot the density', 9.8 * v.H],
      ['added atmospheric pressure', 1000 * 9.8 * v.H + 101325],
      ['halved the depth', 1000 * 9.8 * (v.H / 2)],
    ],
  }),
  num('continuity', [7, 'b', 2, 1], {
    diagram: (v) => ({ kind: 'pipe', a1: `${v.A} cm²`, v1: `${v.V} m/s`, a2: `${v.B} cm²` }),
    style: 'cbq-style',
    text: 'Water flows at {V} m/s through a hose of cross-section {A} cm². A nozzle narrows it to {B} cm². Find the speed of the water leaving the nozzle.',
    vars: { V: [1, 5, 1], A: [4, 12, 2], B: [1, 3, 1] },
    parts: [{ ask: 'Speed at the nozzle', use: 'p-xi-7-8', find: 'v_2', given: { A_1: 'A cm^2', v_1: 'V m/s', A_2: 'B cm^2' }, marks: 2 }],
  }),
  num('torricelli', [7, 'b', 2, 2], {
    diagram: (v) => ({ kind: 'tank', h: `${v.H} m` }),
    text: 'A water tank has a small hole {H} m below the water surface. Find the speed of the water leaving the hole.',
    vars: { H: [1, 10, 1] },
    parts: [{ ask: 'Speed', use: 'p-xi-7-10', find: 'v', given: { h: 'H m' }, marks: 2 }],
  }),
  num('terminal', [7, 'b', 3, 3], {
    text: 'A steel ball of radius {R} mm and density 7800 kg/m³ falls through oil of density 900 kg/m³ and viscosity {E} Pa s.',
    vars: { R: [1, 3, 1], E: [0.5, 2, 0.5] },
    parts: [{ ask: 'Terminal velocity', use: 'p-xi-7-15', find: 'v_t', given: { r: 'R mm', rho: '7800 kg/m^3', sigma: '900 kg/m^3', eta: 'E Pa*s' }, marks: 3 }],
  }),
  num('capillary', [7, 'c', 2, 2], {
    diagram: (v) => ({ kind: 'capillary', r: `${v.R} mm` }),
    text: 'A clean glass tube of radius {R} mm stands in water, with surface tension 0.072 N/m and an angle of contact of 0°. Find how high the water rises.',
    vars: { R: [0.2, 1, 0.2] },
    parts: [{ ask: 'Height of rise', use: 'p-xi-7-13', find: 'h', given: { S: '0.072 N/m', theta: '0 deg', r: 'R mm', rho: '1000 kg/m^3' }, unit: 'cm', marks: 2 }],
  }),
  ...facts(7, 'a', {
    define: [
      ['stress', 'The restoring force per unit area in a deformed body.'],
      ['strain', 'The fractional change in the size of a body.'],
      ['Hooke’s law', 'Within the elastic limit, stress is proportional to strain.'],
    ],
    recall: [
      ['The SI unit of Young’s modulus is:', 'Pa', 'N', 'J', 'm'],
      ['Strain has:', 'no unit', 'the unit Pa', 'the unit N/m', 'the unit m'],
      ['Which is more elastic?', 'Steel', 'Rubber', 'Clay', 'Wax'],
    ],
    reason: [
      ['Steel is said to be more elastic than rubber.', 'It has a much larger Young’s modulus.', 'So it needs more stress for the same strain.'],
      ['Bridges are built with I-shaped girders.', 'A beam bends less for a greater depth.', 'The I-shape saves material while keeping that stiffness.'],
    ],
    compare: [
      ['elastic behaviour', 'plastic behaviour', ['The body returns to its original shape.', 'The body stays permanently deformed.'], ['Happens below the elastic limit.', 'Happens beyond the elastic limit.']],
    ],
    truths: [
      ['Young’s modulus is a property of the material.', 'Young’s modulus depends on the wire’s length.'],
      ['Beyond the yield point, a wire doesn’t return to its original length.', 'Beyond the yield point, a wire always returns to its original length.'],
      ['Stress and pressure have the same unit.', 'Stress and strain have the same unit.'],
      ['The first slope of a stress–strain graph gives Young’s modulus.', 'The first slope of a stress–strain graph gives the breaking stress.'],
    ],
    draw: [
      ['Sketch a stress–strain graph for a metal wire, and mark the elastic limit and the breaking point.', 'A straight rise to the elastic limit, then a curve to the yield point.', 'The curve reaches a maximum, and ends at the breaking point.'],
    ],
  }),
  ...facts(7, 'b', {
    define: [
      ['Bernoulli’s principle', 'In steady flow, pressure energy, kinetic energy and potential energy per unit volume add up to a constant.'],
      ['viscosity', 'A fluid’s internal friction, which resists flow between its layers.'],
      ['terminal velocity', 'The constant speed reached when the drag and buoyancy balance the weight of a falling body.'],
      ['Pascal’s law', 'Pressure applied to an enclosed fluid is passed on equally in all directions.'],
    ],
    recall: [
      ['A hydraulic lift works on:', 'Pascal’s law', 'Bernoulli’s principle', 'Hooke’s law', 'Stokes’ law'],
      ['Where a pipe narrows, the speed of the fluid:', 'increases', 'decreases', 'stays the same', 'becomes zero'],
      ['Stokes’ law gives the:', 'viscous force on a small sphere', 'pressure in a fluid', 'upthrust', 'surface tension'],
      ['A low Reynolds number means the flow is:', 'smooth, or streamlined', 'turbulent', 'at the speed of sound', 'static'],
    ],
    reason: [
      ['An aeroplane wing gets lift.', 'Air moves faster over the top of the wing.', 'So the pressure above it is lower than the pressure below.'],
      ['A spinning ball curves in the air.', 'Air moves at different speeds on its two sides.', 'So there’s a pressure difference across it, by Bernoulli’s principle.'],
      ['Small raindrops fall slowly.', 'Terminal velocity is proportional to r².', 'So smaller drops reach a lower speed.'],
    ],
    compare: [
      ['streamlined flow', 'turbulent flow', ['Smooth, with each particle following the one before.', 'Irregular, with eddies.'], ['Occurs at a low Reynolds number.', 'Occurs at a high Reynolds number.']],
    ],
    truths: [
      ['Viscosity of a liquid falls as it’s heated.', 'Viscosity of a liquid rises as it’s heated.'],
      ['Pressure in a liquid rises with depth.', 'Pressure in a liquid falls with depth.'],
      ['Buoyant force equals the weight of the fluid displaced.', 'Buoyant force equals the weight of the body.'],
    ],
    long: [
      ['State and prove Bernoulli’s principle for steady, non-viscous flow.', 'Consider a tube of flow with two sections at different heights.', 'Work done by the pressure difference is (P₁ − P₂)V.', 'That equals the gain in kinetic and potential energy.', 'So P + ½ρv² + ρgh is constant.'],
    ],
    cases: [
      {
        scene: 'A petrol pump’s attendant notices that when the hose’s nozzle is partly closed, fuel shoots out faster. Elsewhere in the garage, a hydraulic lift raises a whole car with a small push on a piston.',
        parts: [
          ['Why does narrowing the nozzle speed up the flow?', 'By the equation of continuity, A v is constant.', 1],
          ['Which law explains the hydraulic lift?', 'Pascal’s law.', 1],
          ['How can a small force lift a heavy car?', 'The same pressure acts on a larger piston, so it gives a larger force.', 1],
        ],
      },
    ],
  }),
  ...facts(7, 'c', {
    define: [
      ['surface tension', 'The force per unit length on a line drawn on a liquid’s surface.'],
      ['the angle of contact', 'The angle between a liquid’s surface and a solid, measured inside the liquid.'],
      ['capillarity', 'The rise or fall of a liquid in a narrow tube.'],
    ],
    recall: [
      ['Surface tension of a liquid, as temperature rises:', 'falls', 'rises', 'stays the same', 'first rises, then falls'],
      ['Mercury in a glass capillary tube:', 'falls', 'rises', 'stays level', 'rises, then falls'],
      ['Detergents help cleaning because they:', 'lower water’s surface tension', 'raise water’s surface tension', 'heat the water', 'remove its viscosity'],
      ['Excess pressure inside a soap bubble is:', '4S/r', '2S/r', 'S/r', 'S/2r'],
    ],
    reason: [
      ['Liquid drops are spherical.', 'Surface tension makes a liquid take the least surface area.', 'For a given volume, a sphere has the smallest area.'],
      ['Water wets glass, but mercury doesn’t.', 'Water’s adhesion to glass is stronger than its cohesion.', 'Mercury’s cohesion is stronger than its adhesion.'],
    ],
    truths: [
      ['Soap bubbles have two surfaces.', 'Soap bubbles have one surface.'],
      ['The excess pressure in a liquid drop is 2S/r.', 'The excess pressure in a liquid drop is 4S/r.'],
      ['Adding a soap to water reduces its surface tension.', 'Adding a soap to water increases its surface tension.'],
      ['Surface tension has the unit N/m.', 'Surface tension has the unit N/m².'],
    ],
  }),

  // ---- Unit 8: Heat and thermodynamics
  num('calorimetry', [8, 'a', 3, 2], {
    variants: [
      { text: '{A} kg of water at {T} °C is mixed with {B} kg of water at {U} °C. Find the final temperature.', parts: [{ ask: 'Final temperature', use: 'p-xi-8-50', find: 'T', given: { m_1: 'A kg', c_1: '4200 J/(kg*K)', T_1: 'T1 K', m_2: 'B kg', c_2: '4200 J/(kg*K)', T_2: 'T2 K' }, marks: 3 }] },
    ],
    vars: { A: [1, 4, 1], B: [1, 4, 1], T: [20, 40, 5], U: [60, 90, 10] },
    derive: (v) => ({ T1: v.T + 273, T2: v.U + 273 }),
  }),
  num('heat-melt', [8, 'a', 2, 1], {
    text: 'How much heat is needed to melt {M} kg of ice at 0 °C? The latent heat of fusion of ice is 3.34 × 10⁵ J/kg.',
    vars: { M: [0.5, 5, 0.5] },
    parts: [{ ask: 'Heat needed', use: 'p-xi-8-48', find: 'Q', given: { m: 'M kg', L: '3.34e5 J/kg' }, marks: 2 }],
  }),
  num('conduction', [8, 'a', 3, 2], {
    style: 'cbq-style',
    text: 'A house has a {D} cm thick glass window of area {A} m². Glass has a thermal conductivity of 0.8 W/(m K). It is {I} °C inside, and {O} °C outside.',
    vars: { D: [1, 3, 1], A: [1, 4, 1], I: [20, 25, 5], O: [0, 10, 5] },
    derive: (v) => ({ IK: v.I + 273, OK: v.O + 273 }),
    parts: [{ ask: 'Rate of heat loss through the window', use: 'p-xi-8-62', find: 'H_c', given: { K_t: '0.8 W/(m*K)', A: 'A m^2', T_1: 'IK K', T_2: 'OK K', L: 'D cm' }, marks: 3 }],
  }),
  num('carnot', [8, 'b', 2, 1], {
    diagram: (v) => ({ kind: 'engine', hot: `${v.H} K`, cold: `${v.C} K` }),
    text: 'A heat engine takes heat in at {H} K, and rejects it at {C} K. Find its largest possible efficiency.',
    vars: { H: [400, 800, 50], C: [280, 350, 10] },
    parts: [{ ask: 'Largest efficiency', use: 'p-xi-8-5', find: 'eta', given: { T_2: 'C K', T_1: 'H K' }, marks: 2 }],
  }),
  mcqNum('first-law', [8, 'b', 1, 1], {
    text: 'A gas absorbs {Q} J of heat, and does {W} J of work. Its internal energy rises by:',
    vars: { Q: [100, 500, 50], W: [20, 90, 10] },
    use: 'p-xi-8-1',
    find: 'DeltaU',
    given: { DeltaQ: 'Q J', DeltaW: 'W J' },
    mistakes: (v) => [
      ['added work to heat', v.Q + v.W],
      ['subtracted the wrong way round', v.W - v.Q],
      ['ignored the work', v.Q],
      ['ignored the heat', v.W],
    ],
  }),
  num('isothermal', [8, 'b', 3, 2], {
    text: '{N} mol of an ideal gas expands isothermally at {T} K, from {A} L to {B} L.',
    vars: { N: [1, 4, 1], T: [300, 500, 50], A: [1, 5, 1], B: [6, 20, 2] },
    parts: [{ ask: 'Work done by the gas', use: 'p-xi-8-3', find: 'W', given: { n: 'N mol', T: 'T K', V_2: 'B L', V_1: 'A L' }, marks: 3 }],
    diagram: (v) => ({
      kind: 'graph',
      x: 'Volume (L)',
      y: 'Pressure',
      lines: [{ points: Array.from({ length: 21 }, (_, i) => {
        const V = v.A + (i / 20) * (v.B - v.A);
        return [V, (v.N * 0.0821 * v.T) / V] as [number, number];
      }), smooth: 1 }],
      ticksX: [[v.A, String(v.A)], [v.B, String(v.B)]],
    }),
  }),
  ...facts(8, 'a', {
    define: [
      ['specific heat capacity', 'The heat needed to raise the temperature of one kilogram of a substance by one kelvin.'],
      ['latent heat', 'The heat absorbed or given out per unit mass at a change of state, with no change of temperature.'],
      ['thermal conductivity', 'The rate of heat flow through a unit area, per unit temperature gradient.'],
      ['Newton’s law of cooling', 'A body’s rate of cooling is proportional to the difference between its temperature and that of its surroundings.'],
    ],
    recall: [
      ['Wien’s law relates a black body’s temperature to its:', 'wavelength of peak emission', 'mass', 'volume', 'specific heat'],
      ['Power radiated by a black body is proportional to:', 'T⁴', 'T', 'T²', '1/T'],
      ['Water has a very high:', 'specific heat', 'thermal conductivity', 'density at all temperatures', 'viscosity'],
      ['Heat reaches the Earth from the Sun by:', 'radiation', 'conduction', 'convection', 'evaporation'],
    ],
    reason: [
      ['Water is used in car radiators.', 'It has a high specific heat.', 'So it absorbs a lot of heat for a small rise in temperature.'],
      ['Burns from steam are worse than burns from boiling water.', 'Steam gives out its latent heat when it condenses.', 'That is a great deal of heat beyond what the water holds.'],
      ['Woollen clothes keep us warm.', 'Wool traps air.', 'Air is a very poor conductor of heat.'],
    ],
    compare: [
      ['conduction', 'convection', ['Heat passes by collisions, with no bulk movement.', 'Heat passes by bulk movement of the fluid.'], ['Occurs mostly in solids.', 'Occurs in liquids and gases.']],
      ['heat', 'temperature', ['A form of energy in transit.', 'A measure of how hot a body is.'], ['Measured in joules.', 'Measured in kelvin.']],
    ],
    truths: [
      ['A black surface absorbs and emits radiation well.', 'A black surface reflects radiation well.'],
      ['Water expands on freezing.', 'Water contracts on freezing.'],
      ['Temperature stays constant while a pure substance melts.', 'Temperature rises steadily while a pure substance melts.'],
    ],
  }),
  ...facts(8, 'b', {
    define: [
      ['the first law of thermodynamics', 'Heat supplied to a system equals the rise in its internal energy plus the work it does.'],
      ['an isothermal process', 'A process that takes place at constant temperature.'],
      ['an adiabatic process', 'A process with no heat exchange with the surroundings.'],
      ['the second law of thermodynamics', 'No engine working in a cycle can turn all the heat it takes in into work.'],
    ],
    recall: [
      ['In an isothermal change of an ideal gas, the change in internal energy is:', 'zero', 'positive', 'negative', 'equal to the heat added'],
      ['In a reversible adiabatic change of an ideal gas, this stays constant:', 'PVᵞ', 'PV', 'V/T', 'P/T'],
      ['On a P–V diagram, the area under the curve gives:', 'work done', 'heat', 'temperature', 'internal energy'],
      ['Efficiency of a Carnot engine depends on:', 'the two temperatures only', 'the working substance only', 'the size of the engine', 'the speed of the engine'],
    ],
    reason: [
      ['A bicycle pump gets hot when used quickly.', 'Air is compressed nearly adiabatically.', 'The work done on it raises its internal energy.'],
      ['No engine can be 100% efficient.', 'Some heat must always be rejected to a colder sink.'],
    ],
    compare: [
      ['isothermal changes', 'adiabatic changes', ['Temperature stays constant.', 'No heat is exchanged.'], ['Slow, allowing heat to flow.', 'Fast, or well insulated.']],
      ['a heat engine', 'a refrigerator', ['Turns heat into work.', 'Uses work to move heat from cold to hot.'], ['Measured by efficiency.', 'Measured by coefficient of performance.']],
    ],
    truths: [
      ['C_P is greater than C_V for a gas.', 'C_P is less than C_V for a gas.'],
      ['Work done in a cycle equals the area enclosed on a P–V diagram.', 'Work done in a cycle is always zero.'],
      ['In a change at constant volume, a gas does no work.', 'In a change at constant volume, a gas does the most work.'],
      ['For a monatomic ideal gas, γ is 5/3.', 'For a monatomic ideal gas, γ is 7/5.'],
    ],
    long: [
      ['Show that C_P − C_V = R for an ideal gas.', 'At constant volume, heat raises only the internal energy, so dU = nC_V dT.', 'At constant pressure, nC_P dT = dU + P dV.', 'For an ideal gas, P dV = nR dT.', 'Substituting gives C_P − C_V = R.'],
    ],
    draw: [
      ['Sketch isothermal and adiabatic curves for one gas on a P–V diagram, through a common point.', 'Both curves fall as volume rises.', 'The adiabatic curve is the steeper of the two.'],
    ],
  }),

  // ---- Unit 9: Kinetic theory
  num('gas-law', [9, 'a', 2, 1], {
    text: '{N} mol of an ideal gas is kept in a {V} L flask at {T} K. Find its pressure.',
    vars: { N: [1, 5, 1], V: [10, 50, 10], T: [273, 400, 10] },
    parts: [{ ask: 'Pressure', use: 'p-xi-8-6', find: 'P', given: { V: 'V L', n: 'N mol', T: 'T K' }, unit: 'atm', marks: 2 }],
  }),
  num('rms-speed', [9, 'a', 3, 2], {
    text: 'A gas has a pressure of {P} × 10⁵ Pa, and a density of {D} kg/m³.',
    vars: { P: [1, 3, 1], D: [1, 2, 0.5] },
    parts: [{ ask: 'rms speed of its molecules', use: 'p-xi-9-37', find: 'c_rms', given: { P: 'P*1e5 Pa', rho: 'D kg/m^3' }, marks: 3 }],
  }),
  ...facts(9, 'a', {
    define: [
      ['an ideal gas', 'A gas that obeys PV = nRT exactly, with no forces between its molecules.'],
      ['mean free path', 'The average distance a molecule travels between collisions.'],
      ['degrees of freedom', 'The number of independent ways in which a molecule can have energy.'],
    ],
    recall: [
      ['The average kinetic energy of a gas molecule depends only on its:', 'temperature', 'pressure', 'volume', 'mass'],
      ['A monatomic gas has how many degrees of freedom?', '3', '5', '6', '1'],
      ['The rms speed of a gas molecule is proportional to:', '√T', 'T', 'T²', '1/T'],
      ['Gases behave most like ideal gases at:', 'low pressure and high temperature', 'high pressure and low temperature', 'high pressure and high temperature', 'low pressure and low temperature'],
    ],
    reason: [
      ['Real gases differ from ideal gases at high pressure.', 'Molecules are close enough for their volume and attractions to matter.'],
      ['A gas exerts pressure on its container.', 'Molecules keep hitting the walls.', 'Each collision changes momentum, which gives a force.'],
    ],
    compare: [
      ['real gases', 'ideal gases', ['Their molecules attract each other slightly.', 'Their molecules don’t attract each other.'], ['Liquefy under suitable conditions.', 'Never liquefy.']],
    ],
    truths: [
      ['Absolute zero is the temperature at which an ideal gas’s pressure would fall to zero.', 'Absolute zero is the freezing point of water.'],
      ['Doubling the kelvin temperature doubles the mean kinetic energy.', 'Doubling the kelvin temperature doesn’t change the mean kinetic energy.'],
      ['Equipartition gives ½kT per degree of freedom.', 'Equipartition gives 2kT per degree of freedom.'],
    ],
    long: [
      ['Derive the expression P = ⅓ρc² from the kinetic theory of gases.', 'A molecule of speed c_x hitting a wall changes its momentum by 2mc_x.', 'The rate of hits on a wall gives a force of mc_x²/L.', 'Adding all molecules gives a pressure of Nmc̄²/(3V).', 'With ρ = Nm/V, P = ⅓ρc².'],
    ],
  }),

  // ---- Unit 10: Oscillations and waves
  mcqNum('pendulum-mcq', [10, 'a', 1, 1], {
    text: 'A simple pendulum is {L} m long. Its period is about:',
    vars: { L: [0.25, 2.5, 0.25] },
    use: 'p-xi-10-5',
    find: 'T',
    given: { l: 'L m' },
    mistakes: (v) => [
      ['forgot the square root', 2 * Math.PI * (v.L / 9.8)],
      ['left out the 2π', Math.sqrt(v.L / 9.8)],
      ['inverted the fraction', 2 * Math.PI * Math.sqrt(9.8 / v.L)],
      ['used π instead of 2π', Math.PI * Math.sqrt(v.L / 9.8)],
    ],
  }),
  num('spring-mass', [10, 'a', 3, 2], {
    sim: (v) => ({ id: 'spring', preset: { k: v.K, x: v.A / 100 } }),
    text: 'A {M} kg mass on a spring of constant {K} N/m oscillates with an amplitude of {A} cm.',
    vars: { M: [0.2, 2, 0.2], K: [20, 200, 20], A: [2, 10, 2] },
    derive: (v) => ({ W: Math.sqrt(v.K / v.M) }),
    parts: [
      { ask: 'Period', use: 'p-xi-10-4', find: 'T', given: { m: 'M kg', k: 'K N/m' }, marks: 1 },
      { ask: 'Greatest speed', use: 'p-xi-10-78', find: 'v_max', given: { omega: 'W rad/s', A: 'A cm' }, marks: 1 },
      { ask: 'Total energy', use: 'p-xi-10-6', find: 'E', given: { k: 'K N/m', A: 'A cm' }, marks: 1 },
    ],
    diagram: (v) => ({ kind: 'spring', k: `${v.K} N/m`, m: `${v.M} kg`, a: `${v.A} cm` }),
  }),
  num('wave', [10, 'b', 2, 1], {
    text: 'A sound wave has a frequency of {F} Hz, and travels at {V} m/s. Find its wavelength.',
    vars: { F: [200, 1000, 100], V: [330, 350, 10] },
    parts: [{ ask: 'Wavelength', use: 'p-xi-10-8', find: 'lambda', given: { f: 'F Hz', v: 'V m/s' }, marks: 2 }],
    diagram: () => ({ kind: 'wave', amplitude: 'A', wavelength: 'λ' }),
  }),
  num('string', [10, 'b', 3, 2], {
    diagram: (v) => ({ kind: 'standing', ends: 'fixed', L: `${v.L} m`, note: `tension ${v.T} N` }),
    text: 'A sonometer wire {L} m long has a tension of {T} N, and a mass of {M} g per metre.',
    vars: { L: [0.5, 1.5, 0.5], T: [20, 100, 20], M: [1, 5, 1] },
    parts: [
      { ask: 'Speed of the wave on the wire', use: 'p-xi-10-24', find: 'v', given: { T: 'T N', mu: 'M*0.001 kg/m' }, marks: 1 },
      { ask: 'Fundamental frequency', use: 'p-xi-10-13', find: 'f', given: { L: 'L m', T: 'T N', mu: 'M*0.001 kg/m' }, marks: 2 },
    ],
  }),
  num('organ-pipe', [10, 'b', 2, 2], {
    variants: [
      { diagram: (v) => ({ kind: 'standing', ends: 'open', L: `${v.L} m` }), text: 'Find the fundamental frequency of an open organ pipe {L} m long. Take the speed of sound as {V} m/s.', parts: [{ ask: 'Fundamental frequency', use: 'p-xi-10-14', find: 'f', given: { v: 'V m/s', L: 'L m' }, marks: 2 }] },
      { diagram: (v) => ({ kind: 'standing', ends: 'closed', L: `${v.L} m` }), text: 'Find the fundamental frequency of a closed organ pipe {L} m long. Take the speed of sound as {V} m/s.', parts: [{ ask: 'Fundamental frequency', use: 'p-xi-10-15', find: 'f', given: { v: 'V m/s', L: 'L m' }, marks: 2 }] },
    ],
    vars: { L: [0.5, 2, 0.25], V: [330, 350, 10] },
  }),
  ...facts(10, 'a', {
    define: [
      ['simple harmonic motion', 'Motion in which acceleration is proportional to displacement from a fixed point, and directed towards it.'],
      ['the amplitude of an oscillation', 'The largest displacement from the mean position.'],
      ['the period of an oscillation', 'The time for one complete oscillation.'],
    ],
    recall: [
      ['In SHM, the speed is greatest at the:', 'mean position', 'extreme position', 'halfway point', 'same everywhere'],
      ['In SHM, the acceleration is greatest at the:', 'extreme position', 'mean position', 'halfway point', 'same everywhere'],
      ['The period of a simple pendulum doesn’t depend on its:', 'mass', 'length', 'location', 'g value'],
      ['On the Moon, a pendulum’s period is:', 'longer', 'shorter', 'the same', 'zero'],
    ],
    reason: [
      ['A pendulum clock runs slow at a high altitude.', 'g is smaller there.', 'So its period is longer.'],
      ['Soldiers break step when crossing a bridge.', 'Their steady steps could match the bridge’s natural frequency.', 'That would cause resonance and large swings.'],
    ],
    compare: [
      ['free oscillations', 'forced oscillations', ['Vibrate at the natural frequency.', 'Vibrate at the frequency of the driving force.'], ['No outside force keeps them going.', 'An outside periodic force keeps them going.']],
    ],
    truths: [
      ['The total energy in SHM is proportional to the square of the amplitude.', 'The total energy in SHM is proportional to the amplitude.'],
      ['In SHM, velocity and displacement are 90° out of phase.', 'In SHM, velocity and displacement are in phase.'],
      ['Resonance happens when the driving frequency matches the natural frequency.', 'Resonance happens when the driving frequency is twice the natural frequency.'],
    ],
    long: [
      ['Show that a simple pendulum moves with SHM for small angles, and derive its period.', 'The restoring force on the bob is mg sin θ.', 'For small angles, sin θ ≈ x/l, so F = −(mg/l)x.', 'This has the form of SHM, with ω² = g/l.', 'So T = 2π√(l/g).'],
    ],
    draw: [
      ['Sketch how kinetic and potential energy vary with displacement in SHM.', 'Potential energy as a U-shaped parabola, smallest at the mean position.', 'Kinetic energy as an upside-down parabola, largest at the mean position, with a constant total.'],
    ],
  }),
  ...facts(10, 'b', {
    define: [
      ['a progressive wave', 'A wave that carries energy from one place to another.'],
      ['a stationary wave', 'A wave pattern from two equal waves moving in opposite directions, with fixed nodes and antinodes.'],
      ['beats', 'Regular rises and falls in loudness, from two sounds of slightly different frequencies.'],
    ],
    recall: [
      ['Sound waves in air are:', 'longitudinal', 'transverse', 'electromagnetic', 'stationary always'],
      ['The beat frequency of 256 Hz and 260 Hz is:', '4 Hz', '258 Hz', '516 Hz', '2 Hz'],
      ['The distance between two adjacent nodes in a stationary wave is:', 'half a wavelength', 'one wavelength', 'a quarter of a wavelength', 'two wavelengths'],
    ],
    reason: [
      ['Sound travels faster in steel than in air.', 'Steel has a very high elasticity, which more than makes up for its high density.'],
      ['Sound can’t travel in a vacuum.', 'It needs a medium to carry its vibrations.'],
    ],
    compare: [
      ['transverse waves', 'longitudinal waves', ['Particles vibrate at right angles to the wave.', 'Particles vibrate along the wave.'], ['Form crests and troughs.', 'Form compressions and rarefactions.']],
      ['progressive waves', 'stationary waves', ['Carry energy along.', 'Don’t carry energy along.'], ['All particles have the same amplitude.', 'Amplitude varies from zero at nodes to a maximum at antinodes.']],
    ],
    truths: [
      ['The first overtone of an open pipe is its second harmonic.', 'The first overtone of an open pipe is its third harmonic.'],
      ['Frequency doesn’t change when sound enters another medium.', 'Frequency always changes when sound enters another medium.'],
      ['Speed of a wave on a string depends on its tension.', 'Speed of a wave on a string doesn’t depend on its tension.'],
    ],
    draw: [
      ['Draw the first two modes of vibration of a stretched string, and mark the nodes and antinodes.', 'One loop for the fundamental, with nodes at both ends and an antinode in the middle.', 'Two loops for the second harmonic, with a node in the middle.'],
    ],
    cases: [
      {
        scene: 'A guitarist tunes a string against a tuning fork. When both are sounded together, a slow throbbing can be heard, and it gets slower as the string’s tension is adjusted, until it stops.',
        parts: [
          ['What is the throbbing called?', 'Beats.', 1],
          ['What does it mean when the throbbing stops?', 'The two frequencies are equal.', 1],
          ['Why does raising the tension raise the pitch?', 'A higher tension makes the wave faster, and the frequency is v/2L.', 1],
        ],
      },
    ],
  }),
  ...rest(),
  ...derivationBlueprints('physics', 'XI', { custom } as never),
];

export default blueprints;
