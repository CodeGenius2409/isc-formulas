// Original questions in the style of ISC Physics Class XI. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, ar, theory, num } = bank('physics', 'XI');

const questions: BankDef[] = [
  // One mark
  mcq([1, 'a', 1, 1], 'How many significant figures does 0.05060 have?', ['3', '4', '5', '6'], 1, 'Leading zeros do not count, but the zero between 5 and 6 and the trailing zero do.'),
  mcq([1, 'b', 1, 2], 'Which pair of quantities has the same dimensions?', ['Work and torque', 'Force and power', 'Momentum and energy', 'Pressure and force'], 0, 'Both are [ML²T⁻²].'),
  ar([1, 'b', 1, 2], 'A dimensionally correct equation need not be physically correct.', 'Dimensional analysis cannot detect a wrong dimensionless constant.', 1),
  mcq([2, 'a', 1, 1], 'The slope of a velocity-time graph gives:', ['displacement', 'acceleration', 'speed', 'distance'], 1),
  mcq([2, 'b', 1, 2], 'For a projectile launched from level ground, the range is greatest when the angle of projection is:', ['30°', '45°', '60°', '90°'], 1, 'R = u² sin 2θ / g is largest when sin 2θ = 1.'),
  ar([2, 'b', 1, 2], 'At the highest point of its path, the velocity of a projectile is not zero.', 'The horizontal component of velocity stays constant throughout the flight, if air resistance is ignored.', 1),
  mcq([3, 'a', 1, 1], 'The law of inertia is another name for Newton’s:', ['first law', 'second law', 'third law', 'law of gravitation'], 0),
  mcq([3, 'b', 1, 2], 'The coefficient of static friction between a block and a plane is µ. The block starts to slide when the plane’s angle of inclination θ satisfies:', ['sin θ = µ', 'cos θ = µ', 'tan θ = µ', 'θ = µ'], 2),
  ar([3, 'c', 1, 2], 'A cyclist leans inwards when going round a curve.', 'Leaning inwards reduces the weight of the cyclist.', 3, 'Leaning lets the road’s reaction supply a horizontal, centripetal component. The weight does not change.'),
  mcq([4, 'a', 1, 1], 'If the speed of a body doubles, its kinetic energy becomes:', ['two times as large', 'three times as large', 'four times as large', 'eight times as large'], 2),
  mcq([4, 'b', 1, 2], 'In a perfectly inelastic collision, which quantity is conserved?', ['Kinetic energy only', 'Momentum only', 'Both momentum and kinetic energy', 'Neither'], 1),
  mcq([5, 'b', 1, 2], 'A skater spinning with arms outstretched pulls them in. What happens?', ['Angular speed falls', 'Angular speed rises', 'Angular momentum rises', 'Angular momentum falls'], 1, 'Moment of inertia falls and angular momentum is conserved, so the angular speed rises.'),
  mcq([5, 'c', 1, 1], 'The moment of inertia of a body does not depend on:', ['its mass', 'the axis of rotation', 'the distribution of mass', 'its angular speed'], 3),
  mcq([6, 'a', 1, 1], 'The value of g at the centre of the Earth is:', ['9.8 m/s²', 'zero', 'infinite', 'about half of its surface value'], 1),
  ar([6, 'b', 1, 2], 'Astronauts in an orbiting satellite feel weightless because gravity is zero at that height.', 'The satellite and the astronauts fall together towards the Earth with the same acceleration.', 4, 'Gravity there is far from zero. It is what keeps the satellite in orbit.'),
  mcq([7, 'a', 1, 1], 'Young’s modulus of a perfectly rigid body is:', ['zero', 'one', 'infinite', 'negative'], 2),
  mcq([7, 'b', 1, 2], 'Bernoulli’s principle is a statement of the conservation of:', ['mass', 'energy', 'momentum', 'charge'], 1),
  mcq([7, 'c', 1, 2], 'A liquid wets a glass surface if the angle of contact is:', ['acute', 'exactly 90°', 'obtuse', '180°'], 0),
  mcq([8, 'a', 1, 1], 'The mode of heat transfer that needs no medium is:', ['conduction', 'convection', 'radiation', 'evaporation'], 2),
  mcq([8, 'b', 1, 2], 'In an isothermal change of an ideal gas, the change in internal energy is:', ['zero', 'equal to the work done', 'equal to the heat supplied', 'negative'], 0, 'Internal energy of an ideal gas depends only on temperature.'),
  ar([9, 'a', 1, 2], 'At a fixed temperature, the average translational kinetic energy of gas molecules is the same, whatever the gas.', 'Gas molecules are taken to collide elastically with one another and with the walls.', 2, 'Both are true, but the assertion comes from kinetic energy being set by absolute temperature alone.'),
  mcq([10, 'a', 1, 1], 'In simple harmonic motion, the acceleration is greatest at:', ['the mean position', 'the extreme positions', 'halfway to the extreme', 'all points equally'], 1),
  mcq([10, 'b', 1, 2], 'At the closed end of an organ pipe, there is always:', ['a displacement antinode', 'a displacement node', 'a pressure node', 'neither a node nor an antinode'], 1),

  // Two marks
  theory('short', [1, 'b', 2, 2], 'Use dimensions to check the equation $v^2 = u^2 + 2as$.', ['Each side’s terms: $[v^2] = [u^2] = L^2T^{-2}$.', '$[2as] = (LT^{-2})(L) = L^2T^{-2}$, so all the terms have the same dimensions and the equation is dimensionally correct.']),
  num([2, 'a', 2, 1], {
    text: 'A car moving at {U} m/s accelerates uniformly at {A} m/s² for {T} s. Find its final velocity.',
    vars: { U: [5, 20, 5], A: [1, 4, 1], T: [3, 12, 3] },
    parts: [{ ask: 'Final velocity', use: 'p-xi-2-4', find: 'v', given: { u: 'U m/s', a: 'A m/s^2', t: 'T s' }, marks: 2 }],
  }),
  num([2, 'b', 2, 2], {
    text: 'A ball is thrown at {U} m/s at {TH}° to the horizontal. Find its time of flight. (Take g = 9.8 m/s²)',
    vars: { U: [10, 40, 5], TH: [30, 60, 15] },
    parts: [{ ask: 'Time of flight', use: 'p-xi-2-8', find: 'T', given: { u: 'U m/s', theta: 'TH deg' }, marks: 2 }],
  }),
  num([3, 'a', 2, 1], {
    text: 'A force changes the velocity of a {M} kg body from {U} m/s to {V} m/s in {T} s. Find the force.',
    vars: { M: [2, 10, 2], U: [2, 6, 2], V: [10, 20, 2], T: [2, 5, 1] },
    parts: [{ ask: 'Force on the body', use: 'p-xi-3-25', find: 'F', given: { m: 'M kg', v: 'V m/s', u: 'U m/s', t: 'T s' }, marks: 2 }],
  }),
  theory('reason', [3, 'b', 2, 2], 'Explain why it is easier to pull a roller than to push it.', ['When pulling, the vertical component of the force acts upwards, which reduces the normal reaction and so reduces friction.', 'When pushing, the vertical component acts downwards, which increases the normal reaction and friction.']),
  num([4, 'a', 2, 1], {
    text: 'A pump lifts {M} kg of water through {H} m in {T} s. Find its power output. (Take g = 9.8 m/s²)',
    vars: { M: [100, 500, 100], H: [5, 20, 5], T: [10, 50, 10] },
    parts: [{ ask: 'Power output', use: 'p-xi-4-73', find: 'P', given: { m: 'M kg', h: 'H m', t: 'T s' }, marks: 2 }],
  }),
  num([5, 'c', 2, 2], {
    text: 'A uniform disc of mass {M} kg and radius {R} cm spins about its own axis, perpendicular to its plane. Find its moment of inertia.',
    vars: { M: [1, 6, 1], R: [10, 40, 10] },
    parts: [{ ask: 'Moment of inertia', use: 'p-xi-5-6', find: 'I', given: { M: 'M kg', R: 'R cm' }, marks: 2 }],
  }),
  theory('definition', [5, 'a', 2, 1], 'Define the centre of mass of a system of particles. Where is the centre of mass of two equal masses?', ['It is the point where the whole mass of the system may be taken to be concentrated when describing its translational motion.', 'For two equal masses it is at the midpoint of the line joining them.']),
  num([6, 'a', 2, 2], {
    text: 'Find the gravitational force between two bodies of masses {A} kg and {B} kg placed {D} m apart.',
    vars: { A: [100, 900, 100], B: [50, 400, 50], D: [1, 5, 1] },
    parts: [{ ask: 'Gravitational force', use: 'p-xi-6-1', find: 'F', given: { m_1: 'A kg', m_2: 'B kg', r: 'D m' }, marks: 2 }],
  }),
  theory('short', [6, 'b', 2, 2], 'State what is meant by escape speed. Does it depend on the mass of the body being launched?', ['Escape speed is the minimum speed with which a body must be projected to leave the gravitational field of a planet for good.', 'No. It does not depend on the mass of the body, since $v_e = \\sqrt{2GM/R}$ contains only the planet’s mass and radius.']),
  num([7, 'a', 2, 2], {
    text: 'A wire of length {L} m and cross-section {A} mm² extends by {E} mm under a load of {F} N. Calculate the Young’s modulus of its material.',
    vars: { L: [1, 4, 1], A: [1, 3, 1], E: [0.5, 2, 0.5], F: [50, 200, 50] },
    parts: [{ ask: 'Young’s modulus', use: 'p-xi-7-1', find: 'Y', given: { F: 'F N', L: 'L m', A: 'A mm^2', DeltaL: 'E mm' }, marks: 2 }],
  }),
  theory('reason', [7, 'c', 2, 1], 'Give reasons. (a) Small drops of a liquid are nearly spherical. (b) Hot soup tastes better than cold soup, because it spreads over the tongue more easily.', ['(a) Surface tension makes a drop take the shape with the least surface area for its volume, which is a sphere.', '(b) Surface tension falls as temperature rises, so the hot liquid spreads more readily.']),
  num([8, 'a', 2, 1], {
    text: 'How much heat is needed to raise the temperature of {M} kg of water by {D} K? (Specific heat capacity of water = 4200 J kg⁻¹ K⁻¹)',
    vars: { M: [1, 5, 1], D: [10, 50, 10] },
    parts: [{ ask: 'Heat needed', use: 'p-xi-8-43', find: 'Q', given: { m: 'M kg', c: '4200 J/(kg*K)', DeltaT: 'D K' }, marks: 2 }],
  }),
  num([9, 'a', 2, 2], {
    text: 'Find the r.m.s. speed of a gas with a pressure of {P} × 10⁵ Pa and a density of {D} kg/m³.',
    vars: { P: [1, 3, 1], D: [1, 2, 0.5] },
    parts: [{ ask: 'R.m.s. speed', use: 'p-xi-9-37', find: 'c_rms', given: { P: 'P*1e5 Pa', rho: 'D kg/m^3' }, marks: 2 }],
  }),
  num([10, 'a', 2, 1], {
    text: 'A simple pendulum has a length of {L} cm. Find its time period. (Take g = 9.8 m/s²)',
    vars: { L: [25, 100, 25] },
    parts: [{ ask: 'Time period', use: 'p-xi-10-5', find: 'T', given: { l: 'L cm' }, marks: 2 }],
  }),
  theory('distinguish', [10, 'b', 2, 2], 'State two differences between transverse and longitudinal waves.', ['In a transverse wave particles vibrate perpendicular to the direction of travel. In a longitudinal wave they vibrate along it.', 'A transverse wave forms crests and troughs. A longitudinal wave forms compressions and rarefactions.']),

  // Three marks
  num([2, 'a', 3, 2], {
    text: 'A stone is dropped from a tower of height {H} m. Find how long it takes to reach the ground, and its speed as it lands. (Take g = 9.8 m/s²)',
    vars: { H: [20, 100, 20] },
    parts: [
      { ask: 'Time to reach the ground', use: 'p-xi-2-76', find: 't', given: { h: 'H m' }, marks: 2, save: 'FALL' },
      { ask: 'Speed on landing', use: 'p-xi-2-73', find: 'v', given: { t: 'FALL' }, marks: 1 },
    ],
  }),
  num([2, 'b', 3, 2], {
    text: 'A projectile is fired at {U} m/s at {TH}° to the horizontal. Find its maximum height and horizontal range. (Take g = 9.8 m/s²)',
    vars: { U: [20, 50, 10], TH: [30, 60, 15] },
    parts: [
      { ask: 'Maximum height', use: 'p-xi-2-9', find: 'H', given: { u: 'U m/s', theta: 'TH deg' }, marks: 1 },
      { ask: 'Horizontal range', use: 'p-xi-2-10', find: 'R_h', given: { u: 'U m/s', theta: 'TH deg' }, marks: 2 },
    ],
  }),
  num([3, 'b', 3, 2], {
    text: 'A block of mass {M} kg is pulled along a rough floor by a force of {F} N. The coefficient of kinetic friction is {MU}. Find its acceleration. (Take g = 9.8 m/s²)',
    vars: { M: [2, 8, 2], F: [40, 80, 10], MU: [0.1, 0.4, 0.1] },
    parts: [{ ask: 'Acceleration', use: 'p-xi-3-70', find: 'a', given: { F: 'F N', mu_k: 'MU', m: 'M kg' }, marks: 3 }],
  }),
  num([3, 'c', 3, 3], {
    text: 'A car goes round a level curve of radius {R} m. The coefficient of friction between tyres and road is {MU}. Find the greatest safe speed, and the centripetal acceleration at that speed.',
    vars: { R: [20, 80, 10], MU: [0.2, 0.6, 0.1] },
    parts: [
      { ask: 'Greatest safe speed', use: 'p-xi-3-120', find: 'v_max', given: { mu_s: 'MU', r: 'R m' }, marks: 2, save: 'VM' },
      { ask: 'Centripetal acceleration', use: 'p-xi-2-12', find: 'a_c', given: { v: 'VM', r: 'R m' }, marks: 1 },
    ],
  }),
  theory('derivation', [3, 'a', 3, 2], 'State Newton’s second law of motion, and use it to obtain $F = ma$.', ['The rate of change of momentum of a body is proportional to the applied force, and takes place in the direction of the force.', '$F \\propto dp/dt = d(mv)/dt = m\\,dv/dt$ for constant mass, which gives $F = kma$.', 'With the newton defined so that k = 1, $F = ma$.']),
  num([4, 'b', 3, 2], {
    text: 'A ball of mass {A} kg moving at {U} m/s hits and sticks to a ball of mass {B} kg moving the same way at {W} m/s. Find their common velocity, and the reduced mass of the pair.',
    vars: { A: [1, 4, 1], B: [2, 6, 2], U: [8, 12, 2], W: [1, 4, 1] },
    parts: [
      { ask: 'Common velocity', use: 'p-xi-4-96', find: 'v', given: { m_1: 'A kg', u_1: 'U m/s', m_2: 'B kg', u_2: 'W m/s' }, marks: 2 },
      { ask: 'Reduced mass of the pair', use: 'p-xi-4-101', find: 'mu', given: { m_1: 'A kg', m_2: 'B kg' }, marks: 1 },
    ],
  }),
  theory('derivation', [4, 'a', 3, 2], 'Prove that the total mechanical energy of a freely falling body stays constant, by comparing its energy at the top and after falling a distance x.', ['At the top, height h, from rest: $E = mgh$.', 'After falling x, $v^2 = 2gx$, so $KE = mgx$ and $PE = mg(h-x)$.', 'Adding these gives $E = mgx + mg(h - x) = mgh$, the same as at the top.']),
  num([5, 'b', 3, 2], {
    text: 'A wheel with a moment of inertia of {I} kg m² spins at {W} rad/s. Without an external torque, its moment of inertia changes to {J} kg m². Find the new angular speed and new rotational kinetic energy.',
    vars: { I: [2, 8, 2], W: [10, 30, 10], J: [1, 4, 1] },
    when: (v) => v.J < v.I,
    parts: [
      { ask: 'New angular speed', use: 'p-xi-5-22', find: 'omega_2', given: { I_1: 'I kg*m^2', omega_1: 'W rad/s', I_2: 'J kg*m^2' }, marks: 2, save: 'NW' },
      { ask: 'New rotational kinetic energy', use: 'p-xi-5-8', find: 'K', given: { I: 'J kg*m^2', omega: 'NW' }, marks: 1 },
    ],
  }),
  theory('derivation', [5, 'c', 3, 3], 'State the theorem of parallel axes. Use it to find the moment of inertia of a uniform rod of mass M and length L about an axis through one end, perpendicular to the rod.', ['The moment of inertia about any axis equals that about a parallel axis through the centre of mass, plus the mass times the square of the distance between the axes: $I = I_{cm} + Md^2$.', 'For the rod, $I_{cm} = ML^2/12$ and $d = L/2$.', 'So $I = ML^2/12 + ML^2/4 = ML^2/3$.']),
  num([6, 'b', 3, 2], {
    text: 'A satellite orbits {H} km above the surface of the Earth. Find its orbital speed and the escape speed from the Earth’s surface. (M = 6 × 10²⁴ kg, R = 6.4 × 10⁶ m)',
    vars: { H: [400, 2000, 400] },
    parts: [
      { ask: 'Orbital speed', use: 'p-xi-6-86', find: 'v_o', given: { M: '6e24 kg', R: '6.4e6 m', h: 'H km' }, marks: 2 },
      { ask: 'Escape speed from the surface', use: 'p-xi-6-4', find: 'v_e', given: { M: '6e24 kg', R: '6.4e6 m' }, marks: 1 },
    ],
  }),
  theory('derivation', [6, 'a', 3, 2], 'Obtain the variation of g with depth d below the Earth’s surface, assuming uniform density.', ['At depth d, only the sphere of radius R − d attracts the body, since the outer shell exerts no net force.', 'So $g_d = \\dfrac{4}{3}\\pi G\\rho (R-d)$, while $g = \\dfrac{4}{3}\\pi G\\rho R$.', 'Dividing gives $g_d = g(1 - d/R)$.']),
  theory('short', [7, 'b', 3, 2], 'State Bernoulli’s principle. Use it to explain why an aeroplane wing gets lift.', ['For the steady flow of a non-viscous, incompressible fluid, $P + \\tfrac12\\rho v^2 + \\rho g h$ is constant along a streamline.', 'The wing’s shape makes air flow faster over the top than under it.', 'So the pressure above is less than the pressure below, and this difference gives an upward force.']),
  num([7, 'b', 3, 3], {
    text: 'A steel ball of radius {R} mm falls through oil of density 900 kg/m³ and viscosity {V} Pa s. The density of steel is 7800 kg/m³. Find its terminal velocity. (Take g = 9.8 m/s²)',
    vars: { R: [1, 3, 1], V: [0.5, 2, 0.5] },
    parts: [{ ask: 'Terminal velocity', use: 'p-xi-7-15', find: 'v_t', given: { r: 'R mm', rho: '7800 kg/m^3', sigma: '900 kg/m^3', eta: 'V Pa*s' }, marks: 3 }],
  }),
  theory('derivation', [8, 'b', 3, 2], 'Show that for one mole of an ideal gas, $C_P - C_V = R$.', ['At constant volume, the heat supplied only raises internal energy: $C_V\\,dT = dU$.', 'At constant pressure, $C_P\\,dT = dU + P\\,dV$.', 'For one mole, $PV = RT$ gives $P\\,dV = R\\,dT$. Substituting, $C_P\\,dT = C_V\\,dT + R\\,dT$, so $C_P - C_V = R$.']),
  num([8, 'b', 3, 2], {
    text: 'A Carnot engine works between {T1} K and {T2} K. It takes {Q} J of heat from the source in each cycle. Find its efficiency and the work done in one cycle.',
    vars: { T1: [500, 800, 100], T2: [300, 400, 50], Q: [1000, 4000, 1000] },
    parts: [
      { ask: 'Efficiency', use: 'p-xi-8-5', find: 'eta', given: { T_1: 'T1 K', T_2: 'T2 K' }, marks: 1, save: 'EFF' },
      { ask: 'Work done per cycle', use: 'p-xi-8-139', find: 'W', given: { eta: 'EFF', Q_1: 'Q J' }, marks: 2 },
    ],
  }),
  num([9, 'a', 3, 2], {
    text: 'A cylinder holds {N} mol of an ideal gas in a volume of {V} L at a temperature of {T} K. Find the pressure of the gas, then the total translational kinetic energy per mole.',
    vars: { N: [1, 4, 1], V: [10, 40, 10], T: [300, 400, 50] },
    parts: [
      { ask: 'Pressure', use: 'p-xi-8-6', find: 'P', given: { n: 'N mol', V: 'V L', T: 'T K' }, marks: 2 },
      { ask: 'Translational kinetic energy per mole', use: 'p-xi-9-46', find: 'K', given: { T: 'T K' }, marks: 1 },
    ],
  }),
  num([10, 'a', 3, 2], {
    text: 'A particle of mass {M} g on a spring of constant {K} N/m performs SHM of amplitude {A} cm. Find the period and the total energy.',
    vars: { M: [100, 400, 100], K: [10, 40, 10], A: [2, 8, 2] },
    parts: [
      { ask: 'Period', use: 'p-xi-10-4', find: 'T', given: { m: 'M g', k: 'K N/m' }, marks: 1 },
      { ask: 'Total energy', use: 'p-xi-10-6', find: 'E', given: { k: 'K N/m', A: 'A cm' }, marks: 2 },
    ],
  }),
  num([10, 'b', 3, 2], {
    text: 'A string of length {L} m and linear density {M} g/m is stretched by a tension of {T} N. Find the speed of waves on it, and its fundamental frequency.',
    vars: { L: [1, 2, 0.5], M: [2, 8, 2], T: [40, 160, 40] },
    parts: [
      { ask: 'Wave speed', use: 'p-xi-10-24', find: 'v', given: { T: 'T N', mu: 'M*0.001 kg/m' }, marks: 2, save: 'SP' },
      { ask: 'Fundamental frequency', use: 'p-xi-10-14', find: 'f', given: { v: 'SP', L: 'L m' }, marks: 1 },
    ],
  }),

  // Five marks
  theory('derivation', [2, 'a', 5, 2], 'Use a velocity-time graph to obtain the three equations of uniformly accelerated motion in a straight line.', ['Draw the graph as a straight line from velocity u at t = 0 up to velocity v at time t.', 'The slope is the acceleration: $a = (v-u)/t$, so $v = u + at$.', 'The area under the graph is the displacement: a rectangle plus a triangle, $s = ut + \\tfrac12(v-u)t$.', 'Putting $v - u = at$ gives $s = ut + \\tfrac12 at^2$.', 'As a trapezium, $s = \\tfrac12(u+v)t$. With $t = (v-u)/a$, this gives $v^2 = u^2 + 2as$.']),
  theory('derivation', [2, 'b', 5, 3], 'A projectile is fired at speed u at angle θ to the horizontal. Obtain the equation of its path, its time of flight and its range, ignoring air resistance.', ['Horizontally, with no acceleration: $x = (u\\cos\\theta)t$. Vertically: $y = (u\\sin\\theta)t - \\tfrac12 gt^2$.', 'Eliminating t gives $y = x\\tan\\theta - \\dfrac{g x^2}{2u^2\\cos^2\\theta}$, a parabola.', 'Setting y = 0 for landing gives the time of flight $T = 2u\\sin\\theta/g$.', 'Range $R = (u\\cos\\theta)T$.', 'So $R = u^2\\sin 2\\theta/g$.']),
  theory('derivation', [4, 'b', 5, 3], 'For a one-dimensional elastic collision between $m_1$ moving at $u_1$ and $m_2$ at rest, obtain the speeds after collision. Comment on the case of equal masses.', ['Momentum: $m_1 u_1 = m_1 v_1 + m_2 v_2$.', 'Kinetic energy: $\\tfrac12 m_1 u_1^2 = \\tfrac12 m_1 v_1^2 + \\tfrac12 m_2 v_2^2$.', 'Combining these gives $u_1 + v_1 = v_2$.', 'Solving: $v_1 = \\dfrac{(m_1-m_2)u_1}{m_1+m_2}$ and $v_2 = \\dfrac{2m_1 u_1}{m_1+m_2}$.', 'For equal masses, $v_1 = 0$ and $v_2 = u_1$: the bodies exchange velocities.']),
  theory('derivation', [7, 'c', 5, 3], 'Explain why a liquid rises in a capillary tube, and obtain the height of the rise in terms of surface tension S, radius r and angle of contact θ.', ['The meniscus is concave, so the pressure just under it is below atmospheric pressure, by $2S\\cos\\theta/r$.', 'So liquid is pushed up the tube until the hydrostatic pressure makes up the difference.', 'At equilibrium, the pressure difference equals $h\\rho g$.', 'So $h\\rho g = 2S\\cos\\theta/r$.', 'This gives $h = \\dfrac{2S\\cos\\theta}{r\\rho g}$, so narrower tubes give greater rise.']),
  theory('derivation', [8, 'b', 5, 3], 'Obtain the work done by one mole of an ideal gas in an isothermal expansion from $V_1$ to $V_2$, and in an adiabatic change from $T_1$ to $T_2$.', ['In general, $W = \\int P\\,dV$.', 'Isothermally, $P = RT/V$, so $W = RT\\int_{V_1}^{V_2} dV/V$.', 'This gives $W = RT\\ln(V_2/V_1)$.', 'Adiabatically, $PV^\\gamma = K$, so $W = \\int K V^{-\\gamma} dV$.', 'This gives $W = \\dfrac{R(T_1 - T_2)}{\\gamma - 1}$.']),
  theory('derivation', [10, 'a', 5, 2], 'Show that the motion of a mass on an ideal spring is simple harmonic. Obtain its period, and write how the kinetic and potential energy share the total energy.', ['Restoring force: $F = -kx$, so $a = -(k/m)x$.', 'Acceleration proportional to displacement and directed to the mean position defines SHM.', 'Comparing with $a = -\\omega^2 x$ gives $\\omega = \\sqrt{k/m}$.', 'So $T = 2\\pi\\sqrt{m/k}$.', '$KE = \\tfrac12 k(A^2 - x^2)$ and $PE = \\tfrac12 kx^2$, with a constant sum of $\\tfrac12 kA^2$.']),
];

export default questions;
