// Physics, Class XII. Numericals are answered by the solver registry. The facts are written for this app.
import { blueprintsFor, type Values } from './dsl';
import type { Blueprint } from './types';

const { num, mcqNum, facts, custom } = blueprintsFor('physics', 'XII');

const ohms = (x: number) => `${x} Ω`;

const blueprints: Blueprint[] = [
  // ---- Unit 1: Electrostatics
  mcqNum('coulomb-mcq', [1, 'a', 1, 1], {
    text: 'Two small charges of {Q1} µC and {Q2} µC are {D} cm apart in air. The force between them is:',
    vars: { Q1: [1, 9, 1], Q2: [2, 8, 2], D: [10, 40, 5] },
    use: 'p-xii-1-1',
    find: 'F',
    given: { q_1: 'Q1 uC', q_2: 'Q2 uC', r: 'D cm' },
    mistakes: (v, a) => [
      ['forgot to square the distance', (a * (v.D / 100) ** 2) / (v.D / 100)],
      ['left the distance in cm', a / 1e4],
      ['used the charges in mC', a * 1e6],
      ['divided the charges instead of multiplying', (a * v.Q2 * v.Q2) / (v.Q1 * v.Q2)],
      ['doubled the distance', a / 4],
    ],
  }),
  num('field-point', [1, 'a', 2, 1], {
    text: '{scene} carries a charge of {Q} nC. Find the electric field it produces at a point {D} cm away.',
    scenes: ['A small charged sphere', 'A dust particle on a printer drum', 'A charged bead on a thread'],
    vars: { Q: [2, 40, 2], D: [5, 40, 5] },
    parts: [{ ask: 'Electric field at the point', use: 'p-xii-1-2', find: 'E', given: { q: 'Q nC', r: 'D cm' }, marks: 2 }],
  }),
  num('coulomb-unknown', [1, 'a', 2, 2], {
    variants: [
      { text: 'Two equal point charges of {Q} µC repel each other with a force of {F} N. How far apart are they?', parts: [{ ask: 'Separation', use: 'p-xii-1-1', find: 'r', given: { q_1: 'Q uC', q_2: 'Q uC', F: 'F N' }, unit: 'cm', marks: 2 }] },
      { text: 'Two equal point charges are {D} cm apart in air, and each feels a force of {F} N. Find the size of each charge.', parts: [{ ask: 'Each charge', use: 'p-xii-1-1', find: 'q_1', given: { q_2: 'Q uC', F: 'F N', r: 'D cm' }, unit: 'uC', marks: 2 }] },
    ],
    vars: { Q: [2, 10, 1], F: [1, 9, 1], D: [10, 30, 5] },
  }),
  num('dipole-torque', [1, 'a', 2, 2], {
    text: 'An electric dipole of moment {P} × 10⁻⁹ C m lies at {T}° to a uniform field of {E} × 10⁴ N/C. Calculate the torque on it.',
    vars: { P: [2, 9, 1], T: [30, 60, 30], E: [1, 9, 1] },
    parts: [{ ask: 'Torque on the dipole', use: 'p-xii-1-44', find: 'tau', given: { p: 'P*1e-9 C*m', E: 'E*1e4 V/m', theta: 'T deg' }, marks: 2 }],
  }),
  num('sheet-field', [1, 'a', 2, 1], {
    text: 'A large flat sheet carries a uniform charge density of {S} × 10⁻⁷ C/m². Using Gauss’s theorem, find the electric field close to it.',
    vars: { S: [1, 9, 1] },
    parts: [{ ask: 'Field near the sheet', use: 'p-xii-1-69', find: 'E', given: { sigma: 'S*1e-7 C/m^2' }, marks: 2 }],
  }),
  num('two-charges-chain', [1, 'b', 3, 2], {
    text: 'Point charges of {Q1} µC and {Q2} µC are held {D} cm apart in air.',
    vars: { Q1: [1, 8, 1], Q2: [1, 8, 1], D: [5, 30, 5] },
    parts: [
      { ask: 'Force between them', use: 'p-xii-1-1', find: 'F', given: { q_1: 'Q1 uC', q_2: 'Q2 uC', r: 'D cm' }, marks: 1 },
      { ask: 'Potential energy of the pair', use: 'p-xii-1-95', find: 'U', given: { q_1: 'Q1 uC', q_2: 'Q2 uC', r: 'D cm' }, marks: 2 },
    ],
    diagram: (v) => ({ kind: 'charges', items: [{ q: `${v.Q1} µC`, sign: '+' }, { q: `${v.Q2} µC`, sign: '+' }], gaps: [`${v.D} cm`] }),
  }),
  mcqNum('capacitance-mcq', [1, 'b', 1, 1], {
    text: 'An air capacitor has plates of area {A} cm², {D} mm apart. Its capacitance is closest to:',
    vars: { A: [100, 900, 100], D: [1, 5, 1] },
    use: 'p-xii-1-8',
    find: 'C',
    given: { A: 'A cm^2', d: 'D mm' },
    unit: 'pF',
    mistakes: (v, a) => [
      ['left the area in cm²', a * 1e4],
      ['left the separation in mm', a / 1e3],
      ['multiplied by the separation instead of dividing', (a * (v.D / 1000) ** 2)],
      ['forgot ε₀ was in the formula', a / 8.854e-12],
      ['halved the separation', a * 2],
    ],
  }),
  num('capacitor-store', [1, 'b', 3, 2], {
    text: 'A parallel plate capacitor has plates of area {A} cm², {D} mm apart in air. It is connected to a {V} V supply.',
    vars: { A: [100, 500, 50], D: [1, 4, 1], V: [50, 300, 50] },
    parts: [
      { ask: 'Capacitance', use: 'p-xii-1-8', find: 'C', given: { A: 'A cm^2', d: 'D mm' }, unit: 'pF', marks: 1, save: 'c' },
      { ask: 'Energy stored', use: 'p-xii-1-18', find: 'U', given: { C: 'c', V: 'V V' }, marks: 2 },
    ],
    diagram: (v) => ({ kind: 'capacitor', A: `${v.A} cm²`, d: `${v.D} mm`, V: `${v.V} V` }),
  }),
  num('capacitors-series', [1, 'b', 3, 2], {
    text: 'Capacitors of {C1} µF and {C2} µF are joined in series across a {V} V battery.',
    vars: { C1: [2, 12, 2], C2: [3, 12, 3], V: [12, 60, 12] },
    parts: [
      { ask: 'Combined capacitance', use: 'p-xii-1-141', find: 'C', given: { C_1: 'C1 uF', C_2: 'C2 uF' }, unit: 'uF', marks: 1, save: 'c' },
      { ask: 'Energy stored in the combination', use: 'p-xii-1-18', find: 'U', given: { C: 'c', V: 'V V' }, marks: 2 },
    ],
    diagram: (v) => ({ kind: 'series-capacitors', c1: `${v.C1} µF`, c2: `${v.C2} µF`, v: `${v.V} V` }),
  }),
  num('dielectric', [1, 'b', 2, 2], {
    text: 'An air capacitor with plates of area {A} cm² and {D} mm apart has its gap filled with a material of dielectric constant {K}. Calculate its new capacitance.',
    vars: { A: [100, 400, 100], D: [1, 4, 1], K: [2, 8, 1] },
    parts: [{ ask: 'New capacitance', use: 'p-xii-1-121', find: 'C', given: { n: 'K', A: 'A cm^2', d: 'D mm' }, unit: 'pF', marks: 2 }],
    diagram: (v) => ({ kind: 'capacitor', A: `${v.A} cm²`, d: `${v.D} mm`, dielectric: `K = ${v.K}` }),
  }),
  num('potential-work', [1, 'b', 2, 1], {
    text: 'Moving a charge of {Q} µC between two points takes {W} mJ of work. Find the potential difference between the points.',
    vars: { Q: [2, 20, 2], W: [1, 9, 1] },
    parts: [{ ask: 'Potential difference', use: 'p-xii-1-86', find: 'V', given: { W: 'W mJ', q_0: 'Q uC' }, marks: 2 }],
  }),
  ...facts(1, 'a', {
    define: [
      ['electric field at a point', 'The force experienced by a small positive test charge placed there, per unit charge.', 'It is a vector along that force, and its SI unit is N/C.'],
      ['electric flux through a surface', 'The total of E·dA over the surface, a measure of the field lines passing through it.', 'Its SI unit is N m²/C, and it is a scalar.'],
      ['electric dipole moment', 'The product of one of the two charges and the distance between them, directed from negative to positive.', 'Its SI unit is C m.'],
      ['quantisation of charge', 'Any charge is a whole-number multiple of the charge on an electron.'],
    ],
    recall: [
      ['The SI unit of electric flux is:', 'N m²/C', 'N/C', 'V/m²', 'C/m²'],
      ['The field inside a charged conducting sphere in equilibrium is:', 'zero', 'the same as at its surface', 'greatest at the centre', 'inversely proportional to the distance from the centre'],
      ['Electric field lines start on:', 'positive charges and end on negative charges', 'negative charges and end on positive charges', 'positive charges and form closed loops', 'conductors only'],
      ['A dipole in a uniform electric field experiences:', 'a torque, but no net force', 'a net force, but no torque', 'both a net force and a torque', 'neither a net force nor a torque'],
      ['By Gauss’s theorem, the flux through a closed surface depends on:', 'the charge enclosed', 'the shape of the surface', 'the charges outside it', 'the size of the surface'],
    ],
    reason: [
      ['Two electric field lines never cross.', 'At a crossing, the field would have two directions at one point.', 'The field at a point can only have one direction.'],
      ['Electric field lines meet a conductor at right angles.', 'A conductor’s surface is an equipotential surface.', 'A component along the surface would move charges, which doesn’t happen at equilibrium.'],
      ['A person is safe inside a metal car during lightning.', 'Charge stays on the outer surface of a conductor.', 'The field inside a closed conductor is zero.'],
      ['A dipole placed in a uniform field does not accelerate.', 'The two charges feel equal and opposite forces.', 'So the net force is zero, and it only turns.'],
    ],
    compare: [
      ['electric field lines', 'magnetic field lines', ['They begin and end on charges.', 'They form closed loops.'], ['They can’t exist inside a conductor at equilibrium.', 'They pass through magnetic materials.'], ['They start and end at right angles to a conductor.', 'They can run in any direction near a magnet.']],
      ['a conductor', 'a dielectric', ['It has free charges that move through it.', 'Its charges only shift a little within each atom.'], ['The field inside it is zero at equilibrium.', 'The field inside it is reduced, but not to zero.']],
    ],
    truths: [
      ['Charge is conserved in an isolated system.', 'Charge can be created in an isolated system.'],
      ['The field due to a point charge varies as the inverse square of the distance.', 'The field due to a point charge varies inversely with the distance.'],
      ['The net flux through a closed surface with no charge inside it is zero.', 'The net flux through a closed surface with no charge inside it is always positive.'],
      ['The force between two charges is reduced in a medium of higher dielectric constant.', 'The force between two charges is increased in a medium of higher dielectric constant.'],
      ['A dipole in a non-uniform field can experience a net force.', 'A dipole never experiences a net force, whatever the field.'],
    ],
    explain: [
      ['State Coulomb’s law in words.', 'The force between two point charges is proportional to the product of the charges, and inversely proportional to the square of the distance between them.', 'It acts along the line joining them.'],
      ['State Gauss’s theorem.', 'The total electric flux through a closed surface is 1/ε₀ times the net charge enclosed by it.'],
    ],
    long: [
      ['Derive an expression for the electric field at a point on the axis of an electric dipole.', 'Take charges ±q a distance 2a apart, and a point at distance r from the centre on the axis.', 'Write the two fields, from +q and from −q, along the axis, each using Coulomb’s law.', ['Subtract them, as they point in opposite directions, and simplify to E = (1/4πε₀)(2pr)/(r² − a²)².', 1]],
      ['Using Gauss’s theorem, derive the field due to a long straight wire with uniform linear charge density λ.', 'Choose a cylindrical Gaussian surface of radius r and length L around the wire.', 'Flux through the curved surface is E × 2πrL, and through the flat ends it is zero.', 'The charge enclosed is λL, so E = λ/(2πε₀r).'],
      ['Using Gauss’s theorem, derive the field due to a uniformly charged thin spherical shell at a point outside it, and state its value inside.', 'Choose a concentric Gaussian sphere of radius r outside the shell.', 'By symmetry the flux is E × 4πr².', 'The charge enclosed is q, so E = q/(4πε₀r²), as if the charge were at the centre.', 'Inside the shell, no charge is enclosed, so the field is zero.', ['Conclusion: outside, it falls as 1/r², and inside, it is zero.', 1]],
    ],
    draw: [
      ['Draw the electric field lines of an electric dipole.', 'Lines leaving the positive charge and ending on the negative charge.', 'Curved lines, closest together near the charges, that never cross.'],
    ],
    cases: [
      {
        scene: 'A paint shop charges droplets from a spray nozzle and earths the metal panel being painted, so the droplets are drawn to it and wrap round its edges.',
        parts: [
          ['Why do droplets repel each other as they leave the nozzle?', 'They carry charges of the same sign, so they repel, which spreads them into a fine mist.', 1],
          ['Why does paint also reach the back of the panel?', 'Field lines curve round to end on the earthed panel, and droplets follow them.', 1],
          ['What would change if the panel were not earthed?', 'It would charge up with the same sign as the droplets and start to repel them.', 1],
        ],
      },
      {
        scene: 'On a dry day, a student who has just walked across a carpet feels a small shock when touching a metal door handle.',
        parts: [
          ['What causes the student to become charged?', 'Rubbing against the carpet moves electrons between the shoes and the carpet.', 1],
          ['Why is the shock felt at the handle, and not before?', 'The handle is a conductor, so charge can flow suddenly once the gap is small enough for the field to break it down.', 1],
          ['Why does this happen less often on a humid day?', 'Moist air conducts a little better, so charge leaks away before it builds up.', 1],
        ],
      },
    ],
  }),
  ...facts(1, 'b', {
    define: [
      ['electric potential at a point', 'The work done per unit positive charge in bringing a small test charge from infinity to that point.', 'It is a scalar, with SI unit the volt.'],
      ['an equipotential surface', 'A surface on which every point is at the same potential.', 'No work is done in moving a charge along it.'],
      ['capacitance of a conductor', 'The charge it holds per unit potential, C = Q/V.', 'Its SI unit is the farad.'],
      ['dielectric constant', 'The ratio of the capacitance with the material between the plates to the capacitance with vacuum there.'],
    ],
    recall: [
      ['When a dielectric slab is put between the plates of a charged, isolated capacitor, the potential difference:', 'decreases', 'increases', 'stays the same', 'becomes zero'],
      ['The energy stored in a capacitor is:', '½CV²', 'CV²', '½CV', 'C²V/2'],
      ['Capacitors in parallel all have the same:', 'potential difference', 'charge', 'energy', 'capacitance'],
      ['The work done in moving a charge along an equipotential surface is:', 'zero', 'positive', 'negative', 'dependent on the path'],
      ['Doubling the separation of an air capacitor’s plates makes its capacitance:', 'half as large', 'twice as large', 'four times as large', 'unchanged'],
    ],
    reason: [
      ['The electric field is always at right angles to an equipotential surface.', 'A component along the surface would mean a potential difference along it.', 'But every point on the surface is at the same potential.'],
      ['A capacitor blocks a steady current once it is charged.', 'Its plates are separated by an insulator.', 'When its potential equals the supply’s, no more charge flows.'],
      ['Putting a dielectric between a capacitor’s plates raises its capacitance.', 'Induced charges on the dielectric reduce the field between the plates.', 'A lower potential for the same charge means a larger capacitance.'],
    ],
    compare: [
      ['electric potential', 'electric field', ['A scalar.', 'A vector.'], ['Measured in volts.', 'Measured in V/m or N/C.'], ['Falls as 1/r for a point charge.', 'Falls as 1/r² for a point charge.']],
      ['capacitors in series', 'capacitors in parallel', ['Each has the same charge.', 'Each has the same potential difference.'], ['The reciprocals of the capacitances add.', 'The capacitances add.'], ['The total is less than the smallest.', 'The total is more than the largest.']],
    ],
    truths: [
      ['Potential is a scalar quantity.', 'Potential is a vector quantity.'],
      ['Capacitance of a parallel plate capacitor increases as its plate area increases.', 'Capacitance of a parallel plate capacitor decreases as its plate area increases.'],
      ['Two equipotential surfaces can never cross.', 'Two equipotential surfaces can cross at right angles.'],
      ['Inside a charged conductor at equilibrium, the potential is the same everywhere.', 'Inside a charged conductor at equilibrium, the potential is zero everywhere.'],
    ],
    long: [
      ['Derive an expression for the capacitance of a parallel plate capacitor with air between its plates.', 'The field between the plates is E = σ/ε₀ = Q/(ε₀A).', 'The potential difference is V = Ed = Qd/(ε₀A).', 'So C = Q/V = ε₀A/d.'],
      ['Derive an expression for the energy stored in a charged capacitor.', 'Moving a small charge dq against a potential q/C takes work dW = (q/C)dq.', 'Integrate from 0 to Q to get W = Q²/2C.', 'Using Q = CV, this is also ½CV², which is the stored energy.'],
      ['Find the combined capacitance of capacitors in series and in parallel, and show which is larger for two equal capacitors.', 'In series, each carries the same charge and the potentials add.', 'So 1/C = 1/C₁ + 1/C₂.', 'In parallel, each has the same potential and the charges add.', 'So C = C₁ + C₂.', 'For two equal capacitors these give C/2 and 2C, so parallel is larger.'],
    ],
    draw: [
      ['Sketch the equipotential surfaces of a single positive point charge.', 'Concentric spheres, drawn as circles around the charge.', 'Spaced further apart as the distance grows.'],
    ],
    cases: [
      {
        scene: 'A camera flash charges a capacitor from a small battery over a few seconds, then empties it through the lamp in a fraction of a millisecond.',
        parts: [
          ['Why is a capacitor used, rather than the battery directly?', 'A capacitor can release its stored energy very quickly, giving a large current for a moment.', 1],
          ['If the voltage on the capacitor is doubled, how does the energy stored change?', 'It becomes four times as large, as energy depends on V².', 1],
          ['What happens to the capacitance if a dielectric with a larger constant is used?', 'It increases in proportion to the dielectric constant.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 2: Current Electricity
  mcqNum('resistance-mcq', [2, 'a', 1, 1], {
    text: 'A wire of resistivity {P} × 10⁻⁸ Ω m is {L} m long, with a cross-section of {A} mm². Its resistance is:',
    vars: { P: [2, 9, 1], L: [2, 20, 2], A: [1, 5, 1] },
    use: 'p-xii-2-2',
    find: 'R',
    given: { rho: 'P*1e-8 ohm*m', l: 'L m', A: 'A mm^2' },
    mistakes: (v, a) => [
      ['left the area in mm²', a * 1e-6],
      ['multiplied by the area instead of dividing', a * (v.A * 1e-6) ** 2],
      ['divided by the length', a / (v.L * v.L)],
      ['took the area as a diameter', a * (v.A * 1e-3) ** 2 * 1e6],
      ['doubled the length', a * 2],
      ['halved the length', a / 2],
    ],
  }),
  num('ohm-power', [2, 'a', 2, 1], {
    text: '{scene} draws {I} A from a {V} V supply. Find its resistance and the power it uses.',
    scenes: ['An electric iron', 'A room heater', 'A water pump'],
    vars: { I: [2, 10, 1], V: [110, 240, 10] },
    parts: [
      { ask: 'Resistance', use: 'p-xii-2-1', find: 'R', given: { V: 'V V', I: 'I A' }, marks: 1 },
      { ask: 'Power used', use: 'p-xii-2-4', find: 'P', given: { V: 'V V', I: 'I A' }, marks: 1 },
    ],
  }),
  num('drift', [2, 'a', 3, 2], {
    text: 'A copper wire of cross-section {A} mm² carries {I} A. Copper has {N} × 10²⁸ free electrons per m³.',
    vars: { A: [1, 5, 1], I: [1, 10, 1], N: [8, 9, 1] },
    parts: [
      { ask: 'Drift speed of the electrons', use: 'p-xii-2-11', find: 'v_d', given: { I: 'I A', n: 'N*1e28 m^-3', A: 'A mm^2' }, marks: 2 },
      { ask: 'Current density in the wire', use: 'p-xii-2-18', find: 'J', given: { I: 'I A', A: 'A mm^2' }, marks: 1 },
    ],
  }),
  num('temperature', [2, 'a', 2, 2], {
    text: 'A coil has a resistance of {R} Ω at 20 °C. Its temperature coefficient of resistance is {A} × 10⁻³ per K. Find its resistance at {T} °C.',
    vars: { R: [10, 100, 10], A: [2, 6, 1], T: [60, 200, 20] },
    derive: (v) => ({ D: v.T - 20 }),
    parts: [{ ask: 'Resistance at the higher temperature', use: 'p-xii-2-3', find: 'R', given: { R_0: 'R ohm', alpha: 'A*1e-3 K^-1', DeltaT: 'D K' }, marks: 2 }],
  }),
  num('cell-terminal', [2, 'b', 3, 2], {
    text: 'A cell of emf {E} V and internal resistance {R} Ω is connected to an external resistor of {X} Ω.',
    vars: { E: [2, 12, 2], R: [0.5, 2, 0.5], X: [2, 10, 1] },
    parts: [
      { ask: 'Current in the circuit', use: 'p-xii-2-57', find: 'I', given: { E_m: 'E V', R: 'X ohm', r: 'R ohm' }, marks: 1, save: 'i' },
      { ask: 'Terminal voltage of the cell', use: 'p-xii-2-22', find: 'V', given: { E_m: 'E V', I: 'i', r: 'R ohm' }, marks: 2 },
    ],
    diagram: (v) => ({ kind: 'circuit', source: { type: 'cell', label: `${v.E} V`, r: ohms(v.R) }, loop: [{ type: 'R', label: ohms(v.X) }] }),
  }),
  num('parallel-chain', [2, 'b', 5, 3], {
    text: 'A cell of emf {E} V and internal resistance {R} Ω feeds resistors of {A} Ω and {B} Ω connected in parallel.',
    vars: { E: [6, 24, 6], R: [0.5, 1.5, 0.5], A: [2, 12, 2], B: [3, 12, 3] },
    parts: [
      { ask: 'Combined resistance of the two resistors', use: 'p-xii-2-47', find: 'R', given: { R_1: 'A ohm', R_2: 'B ohm' }, marks: 1, save: 'p' },
      { ask: 'Current drawn from the cell', use: 'p-xii-2-57', find: 'I', given: { E_m: 'E V', R: 'p', r: 'R ohm' }, marks: 2, save: 'i' },
      { ask: 'Potential difference across the cell’s terminals', use: 'p-xii-2-22', find: 'V', given: { E_m: 'E V', I: 'i', r: 'R ohm' }, marks: 2 },
    ],
    diagram: (v) => ({ kind: 'cell-parallel', emf: `${v.E} V`, r: ohms(v.R), r1: ohms(v.A), r2: ohms(v.B) }),
  }),
  num('wheatstone', [2, 'b', 2, 2], {
    text: 'A Wheatstone bridge balances with P = {P} Ω, Q = {Q} Ω and R = {R} Ω. Find the fourth resistance S.',
    vars: { P: [10, 50, 10], Q: [20, 100, 20], R: [10, 60, 10] },
    parts: [{ ask: 'Resistance S', use: 'p-xii-2-7', find: 'S_b', given: { P_b: 'P ohm', Q_b: 'Q ohm', R_b: 'R ohm' }, marks: 2 }],
    diagram: (v) => ({ kind: 'wheatstone', p: ohms(v.P), q: ohms(v.Q), r: ohms(v.R), s: '?' }),
  }),
  mcqNum('potentiometer', [2, 'b', 1, 2], {
    text: 'On a potentiometer, a cell of emf {E} V balances at {A} cm. Another cell balances at {B} cm. Its emf is:',
    vars: { E: [1.5, 2, 0.5], A: [150, 300, 50], B: [100, 250, 50] },
    when: (v) => v.A !== v.B,
    use: 'p-xii-2-14',
    find: 'E_2',
    given: { E_1: 'E V', l_1: 'A cm', l_2: 'B cm' },
    mistakes: (v) => [
      ['inverted the ratio of the lengths', (v.E * v.A) / v.B],
      ['added the lengths', (v.E * (v.A + v.B)) / v.A],
      ['subtracted the lengths', (v.E * Math.abs(v.A - v.B)) / v.A],
      ['took the difference of the emfs', v.E * (1 - v.B / v.A)],
    ],
  }),
  num('short-circuit', [2, 'b', 2, 1], {
    variants: [
      { text: 'A cell of emf {E} V has an internal resistance of {R} Ω. Find the current if its terminals are joined by a thick wire of negligible resistance.', parts: [{ ask: 'Short-circuit current', use: 'p-xii-2-60', find: 'I_sc', given: { E_m: 'E V', r: 'R ohm' }, marks: 2 }] },
      { text: 'A car battery of emf {E} V gives a short-circuit current of {S} A. Find its internal resistance.', parts: [{ ask: 'Internal resistance', use: 'p-xii-2-60', find: 'r', given: { E_m: 'E V', I_sc: 'S A' }, marks: 2 }] },
    ],

    vars: { E: [2, 12, 2], R: [0.1, 1, 0.1], S: [20, 200, 20] },
  }),
  num('energy-bill', [2, 'a', 3, 2], {
    style: 'cbq-style',
    text: 'A household {scene} of {P} W runs for {H} hours a day from a {V} V supply. Each unit (kWh) costs ₹{C}.',
    scenes: ['geyser', 'room heater', 'iron'],
    vars: { P: [500, 2000, 100], H: [1, 4, 1], V: [220, 240, 20], C: [5, 9, 1] },
    derive: (v) => ({ J: v.P * v.H * 3600, I2: v.P / v.V }),
    parts: [
      { ask: 'Current drawn', use: 'p-xii-2-4', find: 'I', given: { P: 'P W', V: 'V V' }, marks: 1 },
      { ask: 'Energy used in one day', use: 'p-xii-2-71', find: 'W', given: { V: 'V V', I: 'I2 A', t: 'H h' }, marks: 2 },
    ],
  }),
  ...facts(2, 'a', {
    define: [
      ['drift velocity', 'The small average velocity with which free electrons move through a conductor under an electric field.'],
      ['resistivity of a material', 'The resistance of a piece of the material of unit length and unit cross-section.', 'It depends on the material and temperature, not on its shape.'],
      ['current density', 'The current per unit area of cross-section, taken at right angles to the current.', 'It is a vector with SI unit A/m².'],
      ['mobility of a charge carrier', 'The drift speed per unit electric field.'],
      ['relaxation time', 'The average time between successive collisions of a free electron with the lattice.'],
    ],
    recall: [
      ['Which of these depends on the shape of a conductor?', 'Resistance', 'Resistivity', 'Drift speed in a given field', 'Number density of electrons'],
      ['When the temperature of a metal rises, its resistivity:', 'increases', 'decreases', 'stays constant', 'falls to zero'],
      ['If a wire is stretched to twice its length at constant volume, its resistance becomes:', 'four times', 'twice', 'half', 'unchanged'],
      ['The SI unit of mobility is:', 'm²/(V s)', 'm/(V s)', 'V s/m²', 'm²/s'],
      ['Which material is preferred for a standard resistor?', 'Manganin', 'Copper', 'Silver', 'Silicon'],
    ],
    reason: [
      ['Manganin is used in standard resistors.', 'Its resistivity changes very little with temperature.'],
      ['Resistivity of a metal rises with temperature.', 'Ions vibrate more, so electrons collide more often.', 'The relaxation time falls, which raises the resistivity.'],
      ['Electrons drift slowly, yet a lamp lights at once when switched on.', 'The electric field travels through the circuit almost at the speed of light.', 'So electrons everywhere in the wire begin to drift at once.'],
    ],
    compare: [
      ['resistance', 'resistivity', ['Depends on length and cross-section.', 'Depends only on the material and temperature.'], ['Measured in ohms.', 'Measured in ohm metres.']],
      ['ohmic conductors', 'non-ohmic conductors', ['V against I is a straight line through the origin.', 'V against I is not a straight line.'], ['Resistance stays constant at a fixed temperature.', 'Resistance changes with the current.']],
    ],
    truths: [
      ['Drift speed is proportional to the applied electric field.', 'Drift speed is proportional to the square of the applied electric field.'],
      ['Resistance is proportional to length.', 'Resistance is inversely proportional to length.'],
      ['Resistivity of a semiconductor falls as its temperature rises.', 'Resistivity of a semiconductor rises as its temperature rises.'],
      ['Power lost in a resistor is I²R.', 'Power lost in a resistor is IR².'],
    ],
    long: [
      ['Derive the relation I = nAev_d between current and drift speed.', 'In time t, electrons travel a distance v_d t.', 'So the electrons passing a section are those in a volume A v_d t, which number nA v_d t.', 'The charge passing is nA v_d t e, so I = nAev_d.'],
      ['Starting from the motion of free electrons, obtain the microscopic form of Ohm’s law, J = σE.', 'An electron accelerates at a = eE/m between collisions.', 'So the drift speed is v_d = eEτ/m, where τ is the relaxation time.', 'Substituting into I = nAev_d gives J = (ne²τ/m)E.', 'The bracket is the conductivity, σ.', ['So J = σE, which is Ohm’s law at a point.', 1]],
    ],
    draw: [
      ['Sketch how the resistivity of a metal varies with temperature.', 'Resistivity on the vertical axis, temperature on the horizontal axis.', 'A curve rising with temperature, nearly straight over ordinary temperatures.'],
    ],
    cases: [
      {
        scene: 'An electrician compares two wires of the same length and material. Wire A has twice the diameter of wire B. Both are used to carry current to the same heater.',
        parts: [
          ['What is the ratio of the resistance of A to that of B?', '1 : 4, because the area goes as the square of the diameter.', 1],
          ['Which wire runs cooler, and why?', 'Wire A, because for the same current it wastes less power, as P = I²R.', 1],
          ['Does the resistivity differ between the two wires?', 'No, resistivity depends on the material and temperature, not the size.', 1],
        ],
      },
    ],
  }),
  ...facts(2, 'b', {
    define: [
      ['the emf of a cell', 'The energy supplied by the cell per unit charge passing through it.', 'It equals the potential difference across its terminals when no current flows.'],
      ['internal resistance of a cell', 'The resistance the cell’s own electrolyte and electrodes offer to current inside it.'],
      ['a balanced Wheatstone bridge', 'A bridge with no current through the galvanometer, so P/Q = R/S.'],
    ],
    recall: [
      ['Kirchhoff’s junction rule follows from conservation of:', 'charge', 'energy', 'momentum', 'mass'],
      ['Kirchhoff’s loop rule follows from conservation of:', 'energy', 'charge', 'momentum', 'mass'],
      ['A potentiometer is better than a voltmeter for measuring emf because it:', 'draws no current at balance', 'has a lower resistance', 'uses a longer scale only', 'is cheaper'],
      ['The terminal voltage of a cell while it is delivering a current is:', 'less than its emf', 'more than its emf', 'equal to its emf', 'zero'],
      ['In a metre bridge, a null point near the middle is preferred because:', 'it gives the smallest percentage error', 'the wire is thickest there', 'the current is largest there', 'the galvanometer works only there'],
    ],
    reason: [
      ['A voltmeter reads less than the emf of a cell that is delivering current.', 'There is a voltage drop Ir across the internal resistance.'],
      ['A potentiometer can measure emf exactly, but a voltmeter can’t.', 'At balance, the potentiometer draws no current from the cell.', 'A voltmeter always draws some current, so it reads the terminal voltage.'],
      ['Cells are joined in parallel to supply a large current to a low resistance.', 'Parallel cells have a lower total internal resistance.', 'So less voltage is lost inside, and the current is larger.'],
    ],
    compare: [
      ['emf', 'terminal potential difference', ['It is the energy per unit charge given by the cell.', 'It is the energy per unit charge given to the external circuit.'], ['It doesn’t depend on the current drawn.', 'It falls as the current rises.']],
      ['potentiometer', 'voltmeter', ['Draws no current at balance.', 'Always draws a small current.'], ['Measures true emf.', 'Measures terminal voltage.']],
    ],
    truths: [
      ['At a junction, the total current in equals the total current out.', 'At a junction, the total current in is more than the total current out.'],
      ['Around a closed loop, the sum of the emfs equals the sum of the IR drops.', 'Around a closed loop, the sum of the emfs equals twice the sum of the IR drops.'],
      ['Sensitivity of a potentiometer improves as its wire is made longer.', 'Sensitivity of a potentiometer improves as its wire is made shorter.'],
      ['Swapping the cell and galvanometer in a balanced bridge leaves it balanced.', 'Swapping the cell and galvanometer in a balanced bridge unbalances it.'],
    ],
    long: [
      ['Using Kirchhoff’s laws, derive the balance condition of a Wheatstone bridge.', 'Apply the loop rule to the loop containing P, the galvanometer and R, with no galvanometer current.', 'Apply it to the loop containing Q, the galvanometer and S.', 'Dividing the two equations gives P/Q = R/S.'],
      ['Derive the current when m identical cells, each of emf E and internal resistance r, are joined in series with a resistor R. Compare with the same cells in parallel.', 'In series the emf is mE and the internal resistance is mr.', 'So I = mE/(R + mr).', 'In parallel, the emf is E and the internal resistance is r/m.', 'So I = E/(R + r/m).', 'Series is better when R is much larger than r, and parallel when R is much smaller.'],
    ],
    draw: [
      ['Draw a labelled circuit diagram of a metre bridge for finding an unknown resistance.', 'The metre wire with a jockey and a galvanometer between the two gaps.', 'A resistance box and the unknown resistor in the two gaps, with a cell and a key across the wire.'],
    ],
    cases: [
      {
        scene: 'A torch that works well with new cells becomes dim as they age, although a voltmeter across an aged cell that’s out of the torch still reads close to its original value.',
        parts: [
          ['Which property of the cell has changed most?', 'Its internal resistance has increased.', 1],
          ['Why does the voltmeter still show a nearly normal reading?', 'It draws very little current, so little voltage is lost inside the cell.', 1],
          ['Why is the torch dim?', 'The bulb draws a larger current, so a large voltage drop inside the cell leaves less across the bulb.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 3: Magnetism
  mcqNum('wire-field-mcq', [3, 'a', 1, 1], {
    text: 'A long straight wire carries {I} A. The magnetic field {D} cm from it is:',
    vars: { I: [2, 20, 2], D: [1, 10, 1] },
    use: 'p-xii-3-3',
    find: 'B',
    given: { I: 'I A', r: 'D cm' },
    mistakes: (_v, a) => [
      ['used μ₀I/2r, the formula for a circular coil', a * Math.PI],
      ['left the distance in cm', a / 100],
      ['forgot the 2 in the denominator', a * 2],
      ['took the distance as a diameter', a * 2 * 2],
      ['forgot the π', a * Math.PI],
    ],
    diagram: (v) => ({ kind: 'wire', I: `${v.I} A`, r: `${v.D} cm` }),
  }),
  num('coil-centre', [3, 'a', 2, 1], {
    text: 'A circular coil of {N} turns and radius {R} cm carries {I} A. Find the magnetic field at its centre.',
    vars: { N: [20, 200, 20], R: [5, 20, 5], I: [1, 5, 1] },
    parts: [{ ask: 'Field at the centre', use: 'p-xii-3-17', find: 'B', given: { N: 'N', I: 'I A', R: 'R cm' }, marks: 2 }],
  }),
  num('solenoid', [3, 'a', 2, 1], {
    text: 'A long solenoid has {N} turns per metre and carries {I} A. Find the field inside it, well away from its ends.',
    vars: { N: [500, 3000, 500], I: [1, 8, 1] },
    parts: [{ ask: 'Field inside', use: 'p-xii-3-16', find: 'B', given: { n: 'N m^-1', I: 'I A' }, marks: 2 }],
    diagram: (v) => ({ kind: 'solenoid', turns: `${v.N} turns/m`, I: `${v.I} A`, length: 'long' }),
  }),
  num('parallel-wires', [3, 'a', 2, 2], {
    text: 'Two long parallel wires {D} cm apart carry currents of {A} A and {B} A in the same direction. Find the force per metre on each, and state whether they attract or repel.',
    vars: { D: [2, 20, 2], A: [2, 20, 2], B: [2, 20, 2] },
    parts: [{ ask: 'Force per metre, which is attractive here', use: 'p-xii-3-12', find: 'F_l', given: { I_1: 'A A', I_2: 'B A', d: 'D cm' }, marks: 2 }],
  }),
  num('charge-in-field', [3, 'a', 3, 2], {
    text: 'An electron enters a uniform magnetic field of {B} mT at right angles, at {V} × 10⁶ m/s.',
    vars: { B: [1, 9, 1], V: [1, 9, 1] },
    parts: [
      { ask: 'Force on the electron', use: 'p-xii-3-36', find: 'F', given: { q: '1.6e-19 C', v: 'V*1e6 m/s', B: 'B mT', theta: '90 deg' }, marks: 1 },
      { ask: 'Radius of its circular path', use: 'p-xii-3-38', find: 'r', given: { m: '9.11e-31 kg', v: 'V*1e6 m/s', q: '1.6e-19 C', B: 'B mT' }, unit: 'cm', marks: 2 },
    ],
  }),
  num('force-on-wire', [3, 'a', 2, 1], {
    text: 'A straight conductor {L} cm long carries {I} A at {T}° to a uniform field of {B} T. Find the force on it.',
    vars: { L: [10, 50, 10], I: [1, 10, 1], T: [30, 90, 30], B: [0.1, 0.9, 0.1] },
    parts: [{ ask: 'Force on the conductor', use: 'p-xii-3-48', find: 'F', given: { B: 'B T', I: 'I A', l: 'L cm', theta: 'T deg' }, marks: 2 }],
  }),
  num('galvanometer', [3, 'a', 3, 2], {
    text: 'A galvanometer of resistance {G} Ω gives full deflection at {I} mA. It is to read up to {A} A as an ammeter.',
    vars: { G: [20, 100, 20], I: [1, 10, 1], A: [1, 10, 1] },
    parts: [
      { ask: 'Value of the shunt needed', use: 'p-xii-3-62', find: 'S', given: { I_g: 'I mA', G_c: 'G ohm', I: 'A A' }, unit: 'ohm', marks: 3 },
    ],
  }),
  num('coil-torque', [3, 'a', 3, 2], {
    text: 'A rectangular coil of {N} turns and area {A} cm² carries {I} A in a {B} T field, with its plane parallel to the field.',
    vars: { N: [20, 100, 20], A: [10, 50, 10], I: [1, 5, 1], B: [0.1, 0.5, 0.1] },
    parts: [
      { ask: 'Magnetic moment of the coil', use: 'p-xii-3-20', find: 'm', given: { N: 'N', I: 'I A', A: 'A cm^2' }, marks: 1 },
      { ask: 'Torque on the coil', use: 'p-xii-3-53', find: 'tau', given: { N: 'N', I: 'I A', A: 'A cm^2', B: 'B T', phi: '90 deg' }, marks: 2 },
    ],
  }),
  ...facts(3, 'a', {
    define: [
      ['the Lorentz force', 'The total force on a charge moving in electric and magnetic fields, F = q(E + v × B).'],
      ['the ampere, using the force between two wires', 'The steady current which, in two long parallel wires 1 m apart in vacuum, gives a force of 2 × 10⁻⁷ N per metre of length.'],
      ['the current sensitivity of a galvanometer', 'The deflection it gives per unit current.'],
      ['radial magnetic field', 'A field in which the plane of the coil stays parallel to the field in every position, as produced by curved pole pieces.'],
    ],
    recall: [
      ['A charged particle moving parallel to a magnetic field:', 'feels no force', 'moves in a circle', 'speeds up', 'slows down'],
      ['A magnetic force on a moving charge does no work because it is:', 'at right angles to the velocity', 'parallel to the velocity', 'too small', 'against the velocity'],
      ['Two parallel wires with currents in the same direction:', 'attract each other', 'repel each other', 'exert no force on each other', 'twist each other'],
      ['To convert a galvanometer to an ammeter, connect:', 'a low resistance in parallel', 'a high resistance in series', 'a low resistance in series', 'a high resistance in parallel'],
      ['To convert a galvanometer to a voltmeter, connect:', 'a high resistance in series', 'a low resistance in parallel', 'a high resistance in parallel', 'a low resistance in series'],
    ],
    reason: [
      ['An ammeter must have a very low resistance.', 'It is connected in series and shouldn’t change the current it measures.'],
      ['A voltmeter must have a very high resistance.', 'It is connected in parallel and should draw almost no current.'],
      ['A magnetic field cannot change the speed of a charged particle.', 'The force is always at right angles to the velocity.', 'So it does no work and the kinetic energy stays the same.'],
      ['The coil of a moving coil galvanometer sits in a radial field.', 'The plane of the coil stays parallel to the field as it turns.', 'So the torque is proportional to the current, and the scale is linear.'],
    ],
    compare: [
      ['an ammeter', 'a voltmeter', ['Very low resistance.', 'Very high resistance.'], ['Connected in series.', 'Connected in parallel.'], ['Made with a shunt across a galvanometer.', 'Made with a large resistor in series with a galvanometer.']],
      ['Biot–Savart law', 'Ampere’s circuital law', ['Gives the field of a small current element.', 'Relates the line integral of B around a loop to the current enclosed.'], ['Works for any current shape, with integration.', 'Is easy to use only where there’s high symmetry.']],
    ],
    truths: [
      ['The field inside a long solenoid is nearly uniform.', 'The field inside a long solenoid is zero.'],
      ['The field at the centre of a circular coil is proportional to the number of turns.', 'The field at the centre of a circular coil is inversely proportional to the number of turns.'],
      ['The period of a charged particle in a uniform magnetic field doesn’t depend on its speed.', 'The period of a charged particle in a uniform magnetic field is proportional to its speed.'],
      ['A current loop behaves like a magnetic dipole.', 'A current loop behaves like an electric dipole.'],
    ],
    explain: [
      ['State Ampere’s circuital law.', 'The line integral of B around a closed path equals μ₀ times the net current through the area it encloses.'],
      ['State the Biot–Savart law in words.', 'The field of a small current element is proportional to the current, the length of the element and the sine of the angle to the line joining the point.', 'It is inversely proportional to the square of the distance to the point.'],
    ],
    long: [
      ['Using the Biot–Savart law, derive the field at the centre of a circular coil of N turns.', 'Each element dl of the loop is at right angles to the radius.', 'So dB = μ₀I dl/(4πR²), and all the contributions point the same way.', 'Adding over the circumference 2πR gives B = μ₀I/2R for one turn.', 'With N turns, B = μ₀NI/2R.'],
      ['Using Ampere’s circuital law, derive the field inside a long solenoid.', 'Take a rectangular path with one side of length L inside, parallel to the axis.', 'Only this side contributes, since the field outside is negligible, and the short sides are at right angles to B.', 'The current enclosed is nLI.', 'So BL = μ₀nLI, which gives B = μ₀nI.'],
      ['Derive an expression for the radius of the path of a charged particle moving at right angles to a uniform magnetic field, and show that its period doesn’t depend on its speed.', 'The magnetic force qvB provides the centripetal force.', 'So qvB = mv²/r.', 'That gives r = mv/(qB).', 'The period is T = 2πr/v.', ['Substituting r gives T = 2πm/(qB), which has no v in it.', 1]],
    ],
    draw: [
      ['Draw the magnetic field lines around a long straight wire carrying current into the page.', 'Concentric circles with the wire at the centre.', 'Clockwise arrows, by the right-hand rule.'],
    ],
    cases: [
      {
        scene: 'A student wants to measure the current through a small lamp using a galvanometer with a coil resistance of 50 Ω that reaches full scale at 2 mA.',
        parts: [
          ['What must be connected to the galvanometer to measure a larger current?', 'A small shunt resistance in parallel with it.', 1],
          ['Why must the shunt be small?', 'So most of the current takes the shunt, and the meter’s total resistance stays low.', 1],
          ['What would happen if the galvanometer were connected directly?', 'The lamp’s current could exceed its 2 mA limit and damage the coil.', 1],
        ],
      },
    ],
  }),
  ...facts(3, 'b', {
    define: [
      ['magnetic susceptibility', 'The ratio of the intensity of magnetisation of a material to the magnetising field.'],
      ['retentivity', 'The magnetisation a material keeps after the magnetising field is removed.'],
      ['coercivity', 'The reverse field needed to bring the magnetisation of a material to zero.'],
      ['the Curie temperature', 'The temperature above which a ferromagnetic material becomes paramagnetic.'],
    ],
    recall: [
      ['The susceptibility of a diamagnetic material is:', 'small and negative', 'small and positive', 'large and positive', 'zero'],
      ['Which of these is ferromagnetic?', 'Iron', 'Aluminium', 'Copper', 'Bismuth'],
      ['Permanent magnets need a material with:', 'high retentivity and high coercivity', 'high retentivity and low coercivity', 'low retentivity and high coercivity', 'low retentivity and low coercivity'],
      ['A transformer core needs a material with:', 'a narrow hysteresis loop', 'a wide hysteresis loop', 'high coercivity', 'no magnetic properties'],
    ],
    reason: [
      ['Soft iron is used for electromagnet cores.', 'It has low coercivity, so it loses its magnetism quickly when the current stops.'],
      ['Diamagnetic materials are weakly repelled by a magnet.', 'A field induces small magnetic moments opposing it.', 'So the material moves towards the weaker part of the field.'],
      ['Paramagnetism weakens as temperature rises.', 'Thermal motion disturbs the alignment of the atomic magnetic moments.'],
    ],
    compare: [
      ['diamagnetic materials', 'paramagnetic materials', ['Weakly repelled by a magnet.', 'Weakly attracted by a magnet.'], ['Small negative susceptibility.', 'Small positive susceptibility.'], ['Susceptibility doesn’t depend on temperature.', 'Susceptibility falls as temperature rises.']],
      ['soft iron', 'steel', ['Low coercivity.', 'High coercivity.'], ['Used in electromagnets and transformer cores.', 'Used in permanent magnets.']],
    ],
    truths: [
      ['Ferromagnetic materials have domains.', 'Diamagnetic materials have domains.'],
      ['The area of a hysteresis loop measures the energy lost per cycle.', 'The area of a hysteresis loop measures the energy gained per cycle.'],
      ['A superconductor below its critical temperature expels magnetic fields.', 'A superconductor below its critical temperature concentrates magnetic fields.'],
    ],
    draw: [
      ['Sketch a hysteresis loop for a ferromagnetic material, and mark its retentivity and coercivity.', 'A closed loop of B against H, with retentivity marked where it crosses the B axis.', 'Coercivity marked where it crosses the H axis.'],
    ],
  }),

  // ---- Unit 4: EMI and AC
  mcqNum('motional-emf', [4, 'a', 1, 1], {
    text: 'A rod {L} cm long moves at {V} m/s at right angles to a field of {B} T. The emf across its ends is:',
    vars: { L: [10, 90, 10], V: [2, 10, 1], B: [0.1, 0.9, 0.1] },
    use: 'p-xii-4-2',
    find: 'E_m',
    given: { B: 'B T', l: 'L cm', v: 'V m/s' },
    mistakes: (_v, a) => [
      ['left the length in cm', a * 100],
      ['halved it, as in a rotating rod', a / 2],
      ['doubled the speed', a * 2],
      ['squared the speed', a * _v.V],
    ],
    diagram: (v) => ({ kind: 'rail', B: `${v.B} T`, l: `${v.L} cm`, v: `${v.V} m/s` }),
  }),
  num('rod-current', [4, 'a', 3, 2], {
    text: 'A {L} cm rod slides at {V} m/s on rails in a {B} T field. The rails are joined by a {R} Ω resistor.',
    vars: { L: [20, 80, 20], V: [2, 10, 2], B: [0.2, 1, 0.2], R: [2, 10, 2] },
    parts: [
      { ask: 'Induced emf', use: 'p-xii-4-2', find: 'E_m', given: { B: 'B T', l: 'L cm', v: 'V m/s' }, marks: 1, save: 'e' },
      { ask: 'Current in the resistor', use: 'p-xii-2-1', find: 'I', given: { V: 'e', R: 'R ohm' }, marks: 2 },
    ],
    diagram: (v) => ({ kind: 'rail', B: `${v.B} T`, l: `${v.L} cm`, v: `${v.V} m/s`, r: ohms(v.R) }),
  }),
  num('inductor-energy', [4, 'a', 2, 1], {
    text: 'A coil of inductance {L} mH carries a steady current of {I} A. Find the energy stored in its magnetic field.',
    vars: { L: [10, 200, 10], I: [1, 10, 1] },
    parts: [{ ask: 'Energy stored', use: 'p-xii-4-4', find: 'U', given: { L: 'L mH', I: 'I A' }, marks: 2 }],
  }),
  num('generator', [4, 'a', 2, 2], {
    text: 'A generator coil of {N} turns and area {A} cm² spins at {W} rad/s in a {B} T field. Find the peak emf.',
    vars: { N: [50, 500, 50], A: [50, 300, 50], W: [50, 400, 50], B: [0.1, 0.5, 0.1] },
    parts: [{ ask: 'Peak emf', use: 'p-xii-4-102', find: 'e_0', given: { N: 'N', B: 'B T', A: 'A cm^2', omega: 'W rad/s' }, marks: 2 }],
  }),
  mcqNum('rms', [4, 'b', 1, 1], {
    text: 'The peak voltage of an a.c. supply is {V} V. Its rms voltage is:',
    vars: { V: [100, 400, 20] },
    use: 'p-xii-4-6',
    find: 'V_rms',
    given: { V_0: 'V V' },
    mistakes: (v) => [
      ['multiplied by √2 instead of dividing', v.V * Math.SQRT2],
      ['divided by 2', v.V / 2],
      ['took the average of a half cycle', (2 * v.V) / Math.PI],
      ['took it to equal the peak', v.V * 1.0001 * 1.5],
    ],
  }),
  num('lcr', [4, 'b', 5, 3], {
    text: 'A series a.c. circuit has R = {R} Ω, X_L = {L} Ω and X_C = {C} Ω. It is connected to a supply of {V} V rms.',
    vars: { R: [30, 80, 10], L: [40, 120, 10], C: [20, 100, 10], V: [100, 240, 20] },
    when: (v) => v.L !== v.C,
    parts: [
      { ask: 'Impedance of the circuit', use: 'p-xii-4-7', find: 'Z', given: { R: 'R ohm', X_L: 'L ohm', X_C: 'C ohm' }, marks: 2, save: 'z' },
      { ask: 'rms current', use: 'p-xii-2-1', find: 'I', given: { V: 'V V', R: 'z' }, marks: 1, save: 'i' },
      { ask: 'Power factor angle', use: 'p-xii-4-18', find: 'phi', given: { R: 'R ohm', Z: 'z' }, unit: 'deg', marks: 2 },
    ],
    diagram: (v) => ({ kind: 'circuit', source: { type: 'ac', label: `${v.V} V rms` }, loop: [{ type: 'R', label: ohms(v.R) }, { type: 'L', label: `X_L = ${v.L} Ω` }, { type: 'C', label: `X_C = ${v.C} Ω` }] }),
  }),
  num('resonance', [4, 'b', 3, 2], {
    text: 'A series circuit has L = {L} mH and C = {C} µF, with R = {R} Ω.',
    vars: { L: [10, 200, 10], C: [1, 20, 1], R: [5, 40, 5] },
    parts: [
      { ask: 'Resonant frequency', use: 'p-xii-4-20', find: 'f_0', given: { L: 'L mH', C: 'C uF' }, marks: 1 },
      { ask: 'Resonant angular frequency', use: 'p-xii-4-8', find: 'omega_0', given: { L: 'L mH', C: 'C uF' }, marks: 1, save: 'w' },
      { ask: 'Quality factor', use: 'p-xii-4-10', find: 'Q_f', given: { omega_0: 'w', L: 'L mH', R: 'R ohm' }, marks: 1 },
    ],
    diagram: (v) => ({ kind: 'circuit', source: { type: 'ac', label: 'variable f' }, loop: [{ type: 'R', label: ohms(v.R) }, { type: 'L', label: `${v.L} mH` }, { type: 'C', label: `${v.C} µF` }] }),
  }),
  num('transformer', [4, 'b', 2, 1], {
    style: 'cbq-style',
    text: 'A phone charger uses a transformer to step {P} V mains down to {S} V. Its primary has {N} turns. Find the number of turns on the secondary.',
    vars: { P: [220, 240, 20], S: [6, 24, 6], N: [1000, 4000, 500] },
    parts: [{ ask: 'Turns on the secondary', use: 'p-xii-4-12', find: 'N_s', given: { V_s: 'S V', V_p: 'P V', N_p: 'N' }, marks: 2 }],
  }),
  num('transformer-current', [4, 'b', 3, 2], {
    text: 'An ideal transformer has {P} V on its primary and {S} V on its secondary, and a load of {R} Ω on the secondary.',
    vars: { P: [200, 240, 20], S: [10, 40, 10], R: [5, 20, 5] },
    parts: [
      { ask: 'Current in the secondary', use: 'p-xii-2-1', find: 'I', given: { V: 'S V', R: 'R ohm' }, marks: 1, save: 'is' },
      { ask: 'Current in the primary', use: 'p-xii-4-105', find: 'I_p', given: { V_p: 'P V', V_s: 'S V', I_s: 'is' }, marks: 2 },
    ],
  }),
  ...facts(4, 'a', {
    define: [
      ['magnetic flux through a surface', 'The product of the field, the area and the cosine of the angle between the field and the normal to the area.', 'Its SI unit is the weber.'],
      ['self-inductance of a coil', 'The flux linked with the coil per unit current through it.', 'Its SI unit is the henry.'],
      ['mutual inductance of two coils', 'The flux linked with one coil per unit current in the other.'],
      ['eddy currents', 'Circulating currents induced in the body of a conductor when the flux through it changes.'],
    ],
    recall: [
      ['Lenz’s law is a consequence of conservation of:', 'energy', 'charge', 'momentum', 'mass'],
      ['The SI unit of inductance is the:', 'henry', 'weber', 'tesla', 'farad'],
      ['Induced emf depends on the:', 'rate of change of flux', 'size of the flux only', 'direction of the flux only', 'resistance of the coil'],
      ['Transformer cores are laminated to reduce:', 'eddy currents', 'flux leakage', 'resistance of the windings', 'hysteresis'],
    ],
    reason: [
      ['A magnet falling through a copper tube falls slowly.', 'Eddy currents are induced in the tube.', 'Their field opposes the magnet’s motion, by Lenz’s law.'],
      ['Moving a magnet towards a coil takes more force when the circuit is closed.', 'The induced current opposes the motion.', 'So extra mechanical work is turned into electrical energy.'],
      ['Transformer cores are made of thin sheets.', 'Thin insulated sheets break up the paths of eddy currents, so less energy is lost as heat.'],
    ],
    compare: [
      ['self-induction', 'mutual induction', ['A change of current in a coil induces an emf in the same coil.', 'A change of current in one coil induces an emf in a nearby coil.'], ['It opposes changes in that coil’s own current.', 'It lets energy pass between two separate circuits.']],
    ],
    truths: [
      ['An induced current opposes the change that causes it.', 'An induced current always helps the change that causes it.'],
      ['Doubling the number of turns of a coil makes its self-inductance four times as large.', 'Doubling the number of turns of a coil makes its self-inductance twice as large.'],
      ['Induced emf is zero if the flux through a coil is constant.', 'Induced emf is largest if the flux through a coil is constant.'],
    ],
    explain: [
      ['State Faraday’s laws of electromagnetic induction.', 'An emf is induced whenever the flux through a circuit changes.', 'The size of the emf equals the rate of change of the flux.'],
      ['State Lenz’s law.', 'The induced current flows in the direction that opposes the change producing it.'],
    ],
    long: [
      ['Derive an expression for the emf across a straight rod moving at right angles to a uniform magnetic field.', 'In time dt, the rod sweeps out an area lv dt.', 'So the flux through the circuit changes by Blv dt.', 'By Faraday’s law, emf = dΦ/dt = Blv.'],
      ['Derive the expression for the energy stored in an inductor.', 'While current rises, the emf in the coil is L dI/dt.', 'Work done in time dt is LI dI, against this emf.', 'Integrating from 0 to I gives U = ½LI².'],
    ],
    cases: [
      {
        scene: 'An induction cooker has a coil under its glass top, carrying a rapidly changing current. A steel pan on top heats up, while the glass stays much cooler.',
        parts: [
          ['What is produced in the base of the pan?', 'Eddy currents, induced by the changing magnetic flux.', 1],
          ['Why does the pan get hot?', 'The eddy currents dissipate energy as heat in the pan’s resistance.', 1],
          ['Why doesn’t the glass top heat directly?', 'Glass is an insulator, so almost no current is induced in it.', 1],
        ],
      },
    ],
  }),
  ...facts(4, 'b', {
    define: [
      ['the rms value of an alternating current', 'The steady current that would give the same heating in the same resistor.', 'It equals the peak current divided by √2.'],
      ['impedance', 'The total opposition to alternating current in a circuit, equal to rms voltage divided by rms current.'],
      ['resonance in a series LCR circuit', 'The condition in which X_L equals X_C, so the impedance is least and the current largest.'],
      ['wattless current', 'A current that is 90° out of phase with the voltage, so its average power is zero.'],
      ['power factor', 'The cosine of the phase angle between voltage and current, which is the ratio of true power to apparent power.'],
    ],
    recall: [
      ['At resonance in a series LCR circuit, the power factor is:', '1', '0', '0.5', '0.707'],
      ['In a purely capacitive circuit, the current:', 'leads the voltage by 90°', 'lags the voltage by 90°', 'is in phase with the voltage', 'leads the voltage by 180°'],
      ['The average power in a purely inductive a.c. circuit is:', 'zero', 'V²/R', 'VI', 'VI/2'],
      ['Inductive reactance as frequency increases:', 'increases', 'decreases', 'stays the same', 'becomes zero'],
      ['A transformer works on:', 'mutual induction', 'self-induction only', 'direct current', 'electrostatic induction'],
      ['A capacitor offers infinite reactance to:', 'direct current', 'high-frequency a.c.', 'low-frequency a.c.', 'a.c. of any frequency'],
    ],
    reason: [
      ['A transformer can’t work on direct current.', 'Steady current gives no change of flux, so no emf is induced in the secondary.'],
      ['Power is sent over long distances at high voltage.', 'For the same power, a high voltage means a small current.', 'The loss I²R in the lines is then much smaller.'],
      ['A choke coil is used instead of a resistor to limit a.c. in a tube light.', 'An ideal inductor uses no average power.', 'A resistor would waste the energy as heat.'],
      ['A capacitor passes high-frequency a.c. more easily.', 'Its reactance is 1/(2πfC).', 'So the reactance falls as the frequency rises.'],
    ],
    compare: [
      ['inductive reactance', 'capacitive reactance', ['Rises with frequency.', 'Falls with frequency.'], ['The current lags the voltage by 90°.', 'The current leads the voltage by 90°.']],
      ['a step-up transformer', 'a step-down transformer', ['More turns on the secondary.', 'Fewer turns on the secondary.'], ['Raises the voltage and lowers the current.', 'Lowers the voltage and raises the current.']],
    ],
    truths: [
      ['At resonance, the voltages across L and C cancel.', 'At resonance, the voltages across L and C add up.'],
      ['The average value of a sinusoidal current over a full cycle is zero.', 'The average value of a sinusoidal current over a full cycle equals its peak.'],
      ['Reactance is measured in ohms.', 'Reactance is measured in henries.'],
      ['An ideal transformer has the same power in its primary and secondary.', 'An ideal transformer has more power in its secondary than in its primary.'],
    ],
    long: [
      ['Using a phasor diagram, derive the expression for the impedance of a series LCR circuit.', 'Draw V_R in phase with I, V_L leading I by 90°, and V_C lagging I by 90°.', 'V_L and V_C are opposite, so their difference is V_L − V_C.', 'So V² = V_R² + (V_L − V_C)², by Pythagoras.', 'Dividing by I gives Z = √(R² + (X_L − X_C)²).', ['Then tan φ = (X_L − X_C)/R gives the phase.', 1]],
      ['Show that the average power in an a.c. circuit is V_rms I_rms cos φ, and explain why it is zero for a pure inductor.', 'Instantaneous power is VI = V₀I₀ sin ωt sin(ωt − φ).', 'Averaging over a cycle leaves ½V₀I₀ cos φ.', 'That equals V_rms I_rms cos φ.', 'For a pure inductor, φ = 90°, so cos φ = 0.', 'So no average power is used.'],
    ],
    draw: [
      ['Sketch how the current in a series LCR circuit changes with the frequency of the supply.', 'Current on the vertical axis, frequency on the horizontal axis.', 'A curve with a sharp peak at the resonant frequency.'],
      ['Sketch how inductive and capacitive reactance vary with frequency.', 'X_L as a straight line rising through the origin.', 'X_C as a curve falling with frequency.'],
    ],
    cases: [
      {
        scene: 'A radio tuner uses a coil and a variable capacitor in series. Turning the dial changes the capacitance until a station is heard clearly.',
        parts: [
          ['What is the tuner doing when the station comes in clearly?', 'Bringing the circuit into resonance with the station’s frequency.', 1],
          ['What happens to the resonant frequency when the capacitance is increased?', 'It falls, as f₀ = 1/(2π√LC).', 1],
          ['Why does low resistance in the coil help with selecting one station?', 'It gives a higher quality factor and a sharper peak, so nearby stations are rejected.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 5: EM waves
  mcqNum('em-ratio', [5, 'a', 1, 2], {
    text: 'The electric field amplitude of an electromagnetic wave in vacuum is {E} V/m. Its magnetic field amplitude is:',
    vars: { E: [30, 300, 30] },
    use: 'p-xii-5-2',
    find: 'B',
    given: { E: 'E V/m' },
    mistakes: (v) => [
      ['multiplied by c instead of dividing', v.E * 3e8],
      ['used c = 3 × 10⁶ m/s', v.E / 3e6],
      ['took the two to be equal', v.E],
      ['divided by c twice', v.E / 9e16],
    ],
  }),
  ...facts(5, 'a', {
    define: [
      ['displacement current', 'The current ε₀ dΦ_E/dt associated with a changing electric field.', 'Maxwell added it so that Ampere’s law also holds in the gap of a charging capacitor.'],
      ['an electromagnetic wave', 'A wave of electric and magnetic fields, at right angles to each other and to the direction of travel, needing no medium.'],
    ],
    recall: [
      ['Which of these has the shortest wavelength?', 'Gamma rays', 'X-rays', 'Ultraviolet', 'Microwaves'],
      ['Which radiation is used to scan luggage at an airport?', 'X-rays', 'Microwaves', 'Infrared', 'Radio waves'],
      ['Which radiation is used in remote controls for televisions?', 'Infrared', 'Gamma rays', 'Ultraviolet', 'X-rays'],
      ['Which radiation is used in a microwave oven and in radar?', 'Microwaves', 'Ultraviolet', 'X-rays', 'Gamma rays'],
      ['All electromagnetic waves in vacuum have the same:', 'speed', 'frequency', 'wavelength', 'energy per photon'],
      ['Which radiation can sterilise surgical instruments and treat tumours?', 'Gamma rays', 'Radio waves', 'Infrared', 'Microwaves'],
      ['Which radiation is mostly absorbed by the ozone layer?', 'Ultraviolet', 'Radio waves', 'Visible light', 'Microwaves'],
    ],
    reason: [
      ['Electromagnetic waves are transverse.', 'The electric and magnetic fields oscillate at right angles to the direction of travel.'],
      ['Electromagnetic waves can travel through a vacuum.', 'They are self-sustaining oscillations of fields, and need no medium.'],
      ['Infrared radiation is sometimes called heat waves.', 'It is readily absorbed by water molecules in most materials, which raises their temperature.'],
    ],
    compare: [
      ['conduction current', 'displacement current', ['Due to the flow of charges.', 'Due to a changing electric field.'], ['Flows in conductors.', 'Exists wherever an electric field changes, even in vacuum.']],
    ],
    truths: [
      ['Electromagnetic waves carry both energy and momentum.', 'Electromagnetic waves carry energy, but no momentum.'],
      ['The speed of light in vacuum is 1/√(μ₀ε₀).', 'The speed of light in vacuum is √(μ₀ε₀).'],
      ['In an electromagnetic wave, E and B are in phase.', 'In an electromagnetic wave, E and B are 90° out of phase.'],
    ],
    cases: [
      {
        scene: 'At a hospital, a technician uses X-rays to image a fractured arm, and later a nurse takes the patient’s temperature with a thermometer that reads the infrared given off by the forehead.',
        parts: [
          ['Which radiation has the higher frequency?', 'X-rays.', 1],
          ['Why do X-rays show bones?', 'Bone absorbs them more strongly than soft tissue, so it casts a shadow.', 1],
          ['What makes the forehead give off infrared?', 'All warm bodies emit it, because of thermal motion in the skin.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 6: Optics
  mcqNum('lens-mcq', [6, 'a', 1, 1], {
    text: 'An object is {U} cm in front of a convex lens of focal length {F} cm. The image forms at a distance of:',
    vars: { U: [20, 90, 10], F: [10, 15, 5] },
    when: (v) => v.U > v.F * 1.2,
    use: 'p-xii-6-3',
    find: 'v',
    given: { u: '-U cm', f: 'F cm' },
    unit: 'cm',
    mistakes: (v) => [
      ['forgot the sign convention, taking u as positive', 1 / (1 / v.F - 1 / v.U)],
      ['added the two reciprocals with a wrong sign', 1 / (1 / v.F + 1 / v.U)],
      ['just subtracted the distances', v.U - v.F],
      ['added the distances', v.U + v.F],
    ],
    diagram: (v) => ({ kind: 'lens', lens: 'convex', f: v.F, u: v.U, fLabel: `f = ${v.F} cm`, uLabel: `${v.U} cm` }),
  }),
  num('lens-image', [6, 'a', 3, 2], {
    variants: [
      { text: 'An object stands {U} cm in front of a convex lens of focal length {F} cm.', parts: [{ ask: 'Image distance', use: 'p-xii-6-3', find: 'v', given: { u: '-U cm', f: 'F cm' }, unit: 'cm', marks: 2, save: 'v' }, { ask: 'Size of the magnification', use: 'p-xii-6-2', find: 'm', given: { v: 'v', u: 'U cm' }, marks: 1 }] },
      { text: 'A convex lens forms a real image {V} cm from itself when the object is {U} cm from it.', parts: [{ ask: 'Focal length', use: 'p-xii-6-127', find: 'f', given: { u: 'U cm', v: 'V cm' }, unit: 'cm', marks: 2 }, { ask: 'Size of the magnification', use: 'p-xii-6-2', find: 'm', given: { v: 'V cm', u: 'U cm' }, marks: 1 }] },
    ],
    vars: { U: [20, 90, 10], F: [10, 15, 5], V: [20, 60, 10] },
    when: (v) => v.U > v.F * 1.2,
    diagram: (v) => ({ kind: 'lens', lens: 'convex', f: v.F, u: v.U, fLabel: 'f', uLabel: `${v.U} cm` }),
  }),
  num('mirror', [6, 'a', 3, 2], {
    text: 'An object is {U} cm in front of a concave mirror of focal length {F} cm.',
    vars: { U: [20, 60, 5], F: [10, 15, 5] },
    when: (v) => v.U > v.F * 1.2,
    parts: [
      { ask: 'Distance of the image from the mirror', use: 'p-xii-6-1', find: 'v', given: { u: '-U cm', f: '-F cm' }, unit: 'cm', marks: 2, save: 'v' },
      { ask: 'Size of the magnification', use: 'p-xii-6-2', find: 'm', given: { v: 'v', u: 'U cm' }, marks: 1 },
    ],
    diagram: (v) => ({ kind: 'mirror', mirror: 'concave', f: v.F, u: v.U, fLabel: `f = ${v.F} cm`, uLabel: `${v.U} cm` }),
  }),
  num('lensmaker', [6, 'a', 2, 2], {
    text: 'A biconvex lens of refractive index {N} has surfaces of radii {A} cm and {B} cm. Find its focal length.',
    vars: { N: [1.4, 1.6, 0.1], A: [10, 40, 10], B: [10, 40, 10] },
    parts: [{ ask: 'Focal length', use: 'p-xii-6-4', find: 'f', given: { mu: 'N', R_1: 'A cm', R_2: '-B cm' }, unit: 'cm', marks: 2 }],
  }),
  mcqNum('critical-angle', [6, 'a', 1, 1], {
    text: 'A material has a refractive index of {N}. The critical angle for light going from it into air is:',
    vars: { N: [1.3, 2.4, 0.1] },
    use: 'p-xii-6-41',
    find: 'i_c',
    given: { n: 'N' },
    unit: 'deg',
    mistakes: (v) => [
      ['used tan instead of sin', (Math.atan(1 / v.N) * 180) / Math.PI],
      ['forgot to take the inverse', (1 / v.N) * 100],
      ['used cos instead of sin', (Math.acos(1 / v.N) * 180) / Math.PI],
      ['used the index itself as the sine', (Math.asin(v.N / 2.5) * 180) / Math.PI],
    ],
  }),
  num('snell', [6, 'a', 2, 1], {
    text: 'A ray passes from air into a transparent block at an angle of incidence of {I}°, and bends to {R}° inside it. Find the refractive index of the block, and the speed of light in it.',
    vars: { I: [30, 60, 15], R: [15, 25, 5] },
    when: (v) => v.I > v.R,
    parts: [
      { ask: 'Refractive index', use: 'p-xii-6-7', find: 'mu_2', given: { mu_1: '1', i: 'I deg', r: 'R deg' }, marks: 1, save: 'n' },
      { ask: 'Speed of light in the block', use: 'p-xii-6-31', find: 'v', given: { n: 'n' }, marks: 1 },
    ],
  }),
  num('prism', [6, 'a', 3, 2], {
    text: 'A prism of angle {A}° gives a minimum deviation of {D}° for a certain colour.',
    vars: { A: [30, 60, 15], D: [20, 40, 5] },
    when: (v) => v.D < v.A,
    parts: [
      { ask: 'Refractive index of the glass for that colour', use: 'p-xii-6-63', find: 'n', given: { A: 'A deg', delta_m: 'D deg' }, marks: 3 },
    ],
    diagram: (v) => ({ kind: 'prism', angle: `${v.A}°` }),
  }),
  num('combined-lenses', [6, 'a', 2, 2], {
    text: 'Two thin lenses of focal lengths {A} cm and {B} cm are placed in contact. Find the focal length of the combination.',
    vars: { A: [10, 40, 5], B: [10, 40, 5] },
    parts: [{ ask: 'Combined focal length', use: 'p-xii-6-56', find: 'F_c', given: { f_1: 'A cm', f_2: 'B cm' }, unit: 'cm', marks: 2 }],
  }),
  num('telescope', [6, 'b', 2, 1], {
    style: 'cbq-style',
    text: 'A student builds a telescope from a {O} cm objective and a {E} cm eyepiece, in normal adjustment, to look at the Moon.',
    vars: { O: [50, 150, 10], E: [2, 10, 1] },
    parts: [
      { ask: 'Magnifying power', use: 'p-xii-6-17', find: 'm', given: { f_o: 'O cm', f_e: 'E cm' }, marks: 1 },
      { ask: 'Length of the tube', use: 'p-xii-6-81', find: 'L', given: { f_o: 'O cm', f_e: 'E cm' }, unit: 'cm', marks: 1 },
    ],
  }),
  num('fringe', [6, 'c', 2, 1], {
    text: 'In Young’s experiment the slits are {S} mm apart and the screen is {D} m away. Light of wavelength {L} nm is used. Find the fringe width.',
    vars: { S: [0.2, 1, 0.1], D: [1, 2.5, 0.5], L: [400, 700, 50] },
    parts: [{ ask: 'Fringe width', use: 'p-xii-6-9', find: 'beta', given: { lambda: 'L nm', D: 'D m', d: 'S mm' }, unit: 'mm', marks: 2 }],
    diagram: (v) => ({ kind: 'ydse', d: `${v.S} mm`, D: `${v.D} m`, lambda: `${v.L} nm` }),
  }),
  mcqNum('fringe-mcq', [6, 'c', 1, 1], {
    text: 'A double slit {S} mm apart is {D} m from a screen, and uses light of {L} nm. The fringe width is:',
    vars: { S: [0.5, 2, 0.5], D: [1, 2, 0.5], L: [400, 700, 100] },
    use: 'p-xii-6-9',
    find: 'beta',
    given: { lambda: 'L nm', D: 'D m', d: 'S mm' },
    unit: 'mm',
    mistakes: (_v, a) => [
      ['forgot to convert nm to m', a * 1e9],
      ['left the slit gap in mm', a / 1000],
      ['doubled it, thinking of the central maximum', a * 2],
      ['halved it, thinking of bright to dark', a / 2],
    ],
  }),
  num('fringe-water', [6, 'c', 3, 2], {
    text: 'A double slit set-up has a fringe width of {B} mm in air, with light of wavelength {L} nm. The whole set-up is then immersed in water of refractive index {N}.',
    vars: { B: [0.4, 2, 0.2], L: [450, 650, 50], N: [1.33] },
    derive: (v) => ({ NB: v.B / v.N }),
    parts: [
      { ask: 'Wavelength of the light in water', use: 'p-xii-6-34', find: 'lambda_m', given: { lambda_0: 'L nm', n: 'N' }, unit: 'nm', marks: 2 },
      { ask: 'New fringe width, which falls in the same ratio', use: 'p-xii-6-34', find: 'lambda_m', given: { lambda_0: 'B mm', n: 'N' }, unit: 'mm', marks: 1 },
    ],
  }),
  num('malus', [6, 'c', 2, 1], {
    text: 'Polarised light of intensity {I} W/m² falls on a polaroid, at {T}° to its axis. Find the intensity of the light that gets through.',
    vars: { I: [10, 100, 10], T: [30, 60, 15] },
    parts: [{ ask: 'Intensity transmitted', use: 'p-xii-6-20', find: 'I', given: { I_0: 'I W/m^2', theta: 'T deg' }, marks: 2 }],
  }),
  ...facts(6, 'a', {
    define: [
      ['the critical angle', 'The angle of incidence in a denser medium for which the angle of refraction in the rarer medium is 90°.'],
      ['the principal focus of a convex lens', 'The point on the axis where rays parallel to the axis meet after passing through the lens.'],
      ['power of a lens', 'The reciprocal of its focal length in metres.', 'Its SI unit is the dioptre.'],
      ['angle of minimum deviation', 'The smallest angle through which a prism turns a ray, occurring when the ray passes through it symmetrically.'],
      ['dispersion', 'The splitting of white light into its colours, because the refractive index differs from colour to colour.'],
    ],
    recall: [
      ['A convex mirror always forms an image that is:', 'virtual, erect and smaller', 'real, inverted and smaller', 'virtual, erect and larger', 'real, erect and smaller'],
      ['When a convex lens is put into water, its focal length:', 'increases', 'decreases', 'stays the same', 'becomes zero'],
      ['Total internal reflection needs light to travel:', 'from a denser to a rarer medium', 'from a rarer to a denser medium', 'at normal incidence', 'only in water'],
      ['The sky looks blue because blue light is:', 'scattered more than red', 'scattered less than red', 'absorbed by the air', 'reflected by clouds'],
      ['An optical fibre works by:', 'total internal reflection', 'refraction alone', 'diffraction', 'polarisation'],
      ['The focal length of a spherical mirror is related to its radius of curvature by:', 'f = R/2', 'f = 2R', 'f = R', 'f = R²'],
      ['Which colour bends most in passing through a prism?', 'Violet', 'Red', 'Green', 'Yellow'],
    ],
    reason: [
      ['A diamond sparkles.', 'Its high refractive index gives it a small critical angle.', 'So most light that enters is totally internally reflected many times.'],
      ['The Sun looks reddish at sunrise and sunset.', 'Sunlight then travels through a greater thickness of air.', 'Most of the blue is scattered away, so red is left.'],
      ['A convex mirror is used as a rear-view mirror.', 'It always forms an erect, smaller image.', 'So it covers a wider field of view.'],
      ['Clouds look white.', 'Water droplets are large compared with the wavelength of light.', 'They scatter all colours about equally.'],
      ['Optical fibres can carry signals around bends.', 'The core has a higher refractive index than the cladding.', 'So light keeps totally internally reflecting along it.'],
    ],
    compare: [
      ['a real image', 'a virtual image', ['Rays actually meet at it.', 'Rays only appear to come from it.'], ['It can be caught on a screen.', 'It can’t be caught on a screen.'], ['Usually inverted.', 'Usually erect.']],
      ['a convex lens', 'a concave lens', ['Thicker in the middle.', 'Thinner in the middle.'], ['Converges parallel rays.', 'Diverges parallel rays.'], ['Has a positive focal length.', 'Has a negative focal length.']],
    ],
    truths: [
      ['A concave lens always forms a virtual image of a real object.', 'A concave lens always forms a real image of a real object.'],
      ['The power of two thin lenses in contact is the sum of their powers.', 'The power of two thin lenses in contact is the product of their powers.'],
      ['Refractive index is greater for violet light than for red light.', 'Refractive index is greater for red light than for violet light.'],
      ['Scattering by small particles varies as 1/λ⁴.', 'Scattering by small particles varies as λ⁴.'],
      ['A ray going to the optical centre of a thin lens carries on undeviated.', 'A ray going to the optical centre of a thin lens is bent to the focus.'],
    ],
    long: [
      ['Derive the mirror formula for a concave mirror forming a real image.', 'Draw the two standard rays, and use the two pairs of similar triangles.', 'They give A′B′/AB = −v/−u = (−v + f)/−f, using the sign convention.', 'Rearranging gives v/u = (v − f)/f.', 'Dividing through by v gives 1/v + 1/u = 1/f.'],
      ['Derive the lens maker’s formula for a thin lens of refractive index n in air.', 'Refraction at the first surface gives n/v₁ − 1/u = (n − 1)/R₁.', 'Refraction at the second surface gives 1/v − n/v₁ = (1 − n)/R₂.', 'Adding them removes v₁, which gives 1/v − 1/u = (n − 1)(1/R₁ − 1/R₂).', 'For an object at infinity, v = f, so 1/f = (n − 1)(1/R₁ − 1/R₂).', ['Conclusion: focal length depends on the index and the two radii.', 1]],
      ['Show that the refractive index of a prism is n = sin((A + δₘ)/2)/sin(A/2).', 'At minimum deviation, the ray passes symmetrically, so r₁ = r₂ = r.', 'Since r₁ + r₂ = A, we get r = A/2.', 'Since i + e = A + δ and i = e, we get i = (A + δₘ)/2.', 'Substituting into Snell’s law gives the result.'],
    ],
    draw: [
      ['Draw a ray diagram for a convex lens, with an object between F and 2F. State where the image forms.', 'Two standard rays, one parallel to the axis then through F, the other through the optical centre.', 'A real, inverted, enlarged image beyond 2F.'],
      ['Draw the ray path through a prism at minimum deviation.', 'A ray passing through the prism parallel to its base.', 'Equal angles of incidence and emergence marked.'],
      ['Draw a ray diagram for a convex mirror, showing how it forms an image.', 'One ray heading for F and reflected parallel, one heading for C and reflected back.', 'A virtual, erect and smaller image behind the mirror.'],
    ],
    cases: [
      {
        scene: 'A swimmer looking up from under still water sees a bright circle of the outside world overhead, and beyond it the surface looks like a mirror.',
        parts: [
          ['Why does the surface look like a mirror beyond the circle?', 'Light from under the water hits the surface beyond the critical angle, so it is totally internally reflected.', 1],
          ['What decides the size of the bright circle?', 'The swimmer’s depth and the critical angle of water.', 1],
          ['What would happen to the circle if the swimmer dived deeper?', 'It would get larger, because the same critical angle reaches further across the surface.', 1],
        ],
      },
      {
        scene: 'An endoscope carries images from inside the body along a thin bundle of glass fibres, each coated with a cladding of lower refractive index.',
        parts: [
          ['Which effect keeps the light inside each fibre?', 'Total internal reflection at the boundary of the core and cladding.', 1],
          ['Why must the core have the higher refractive index?', 'Total internal reflection only happens going from a denser to a rarer medium.', 1],
          ['Why does a fibre carry light with little loss, even when it bends?', 'The light reflects completely at each bounce, as long as the angle stays above the critical angle.', 1],
        ],
      },
    ],
  }),
  ...facts(6, 'b', {
    define: [
      ['the magnifying power of a telescope', 'The ratio of the angle the image makes at the eye to the angle the object makes at the eye.'],
      ['the least distance of distinct vision', 'The nearest distance at which a normal eye sees clearly, about 25 cm.'],
      ['normal adjustment of a telescope', 'The setting in which the final image is at infinity, so the eye is relaxed.'],
    ],
    recall: [
      ['An astronomical telescope in normal adjustment has a tube length of:', 'f_o + f_e', 'f_o − f_e', 'f_o × f_e', 'f_o / f_e'],
      ['For greater magnification, a telescope should have:', 'a long objective and a short eyepiece', 'a short objective and a long eyepiece', 'both long', 'both short'],
      ['A compound microscope’s objective has:', 'a small focal length and a small aperture', 'a large focal length and a large aperture', 'a large focal length and a small aperture', 'a small focal length and a large aperture'],
      ['The final image in an astronomical telescope is:', 'inverted relative to the object', 'erect relative to the object', 'real and erect', 'real and smaller'],
    ],
    reason: [
      ['A telescope’s objective has a large aperture.', 'It gathers more light from faint objects.', 'It also gives better resolving power.'],
      ['Reflecting telescopes are preferred for very large instruments.', 'A mirror has no chromatic aberration.', 'A large mirror is lighter and easier to support than a large lens.'],
    ],
    compare: [
      ['a compound microscope', 'an astronomical telescope', ['The objective has a short focal length.', 'The objective has a long focal length.'], ['Used for small nearby objects.', 'Used for distant objects.']],
      ['a refracting telescope', 'a reflecting telescope', ['Uses a lens as the objective.', 'Uses a concave mirror as the objective.'], ['Suffers from chromatic aberration.', 'Is free of chromatic aberration.']],
    ],
    truths: [
      ['The objective of a telescope has a longer focal length than its eyepiece.', 'The objective of a telescope has a shorter focal length than its eyepiece.'],
      ['Magnifying power of a simple microscope is greater when the image is at the near point.', 'Magnifying power of a simple microscope is greater when the image is at infinity.'],
      ['A larger objective aperture improves a telescope’s resolving power.', 'A larger objective aperture worsens a telescope’s resolving power.'],
    ],
    long: [
      ['Derive an expression for the magnifying power of an astronomical telescope in normal adjustment.', 'A distant object makes an angle α at the objective, forming an image at its focus.', 'That image is at the focus of the eyepiece as well, so the final image is at infinity.', 'The angles are α = h/f_o and β = h/f_e.', 'So M = β/α = f_o/f_e.'],
    ],
    draw: [
      ['Draw a labelled ray diagram of a compound microscope with its final image at the near point.', 'Objective forming a real, enlarged image inside the focus of the eyepiece.', 'The eyepiece forming a virtual, enlarged final image at the least distance of distinct vision.'],
      ['Draw a labelled ray diagram of an astronomical telescope in normal adjustment.', 'Parallel rays from a distant object, focused by the objective at its focal plane.', 'The eyepiece at that same point, with parallel rays leaving it.'],
    ],
  }),
  ...facts(6, 'c', {
    define: [
      ['a wavefront', 'The surface through points of a wave that are all in the same phase.'],
      ['coherent sources', 'Sources of the same frequency with a constant phase difference.'],
      ['the Brewster angle', 'The angle of incidence at which the reflected light is completely polarised.', 'At this angle, the reflected and refracted rays are at right angles.'],
      ['polarisation of light', 'The restriction of the electric vibrations of light to one plane.'],
    ],
    recall: [
      ['Which shows that light is a transverse wave?', 'Polarisation', 'Interference', 'Diffraction', 'Reflection'],
      ['If the slit separation in a double slit experiment is doubled, the fringe width:', 'is halved', 'is doubled', 'stays the same', 'is four times as large'],
      ['A bright fringe needs a path difference of:', 'a whole number of wavelengths', 'an odd number of half wavelengths', 'exactly half a wavelength', 'zero only'],
      ['The central fringe with white light in a double slit is:', 'white', 'dark', 'red', 'violet'],
      ['Sunlight has a wavefront close to:', 'plane', 'spherical', 'cylindrical', 'conical'],
      ['The width of the central maximum in single-slit diffraction, compared with the other maxima, is:', 'about twice as wide', 'the same', 'half as wide', 'a quarter as wide'],
    ],
    reason: [
      ['Two separate lamps don’t give steady interference fringes.', 'They aren’t coherent, as their phase difference keeps changing.', 'So the pattern shifts too fast to see.'],
      ['Diffraction of sound is easily noticed, but that of light isn’t.', 'Sound has wavelengths comparable with everyday openings.', 'Light has a far smaller wavelength.'],
      ['Polaroid sunglasses cut glare from water.', 'Light reflected from water is partly polarised horizontally.', 'The polaroid’s vertical axis blocks this.'],
    ],
    compare: [
      ['interference', 'diffraction', ['Superposition of waves from two coherent sources.', 'Superposition of wavelets from one wavefront.'], ['Bright fringes are about equally bright.', 'Brightness of the maxima falls away from the centre.'], ['Fringe widths are about equal.', 'The central maximum is twice as wide as the others.']],
      ['polarised light', 'unpolarised light', ['Its vibrations are in one plane.', 'Its vibrations are in all planes at right angles to the ray.'], ['Passing a rotating polaroid varies its brightness.', 'Passing a rotating polaroid leaves its brightness unchanged.']],
    ],
    truths: [
      ['Fringe width is directly proportional to wavelength.', 'Fringe width is inversely proportional to wavelength.'],
      ['Interference redistributes energy, but conserves it overall.', 'Interference destroys energy at dark fringes.'],
      ['Immersing a double slit in water narrows the fringes.', 'Immersing a double slit in water widens the fringes.'],
      ['Every point on a wavefront is a source of secondary wavelets.', 'Only the centre of a wavefront is a source of secondary wavelets.'],
    ],
    long: [
      ['Using Huygens’ principle, verify the law of reflection.', 'Draw a plane wavefront AB meeting a mirror, with B still a distance from the mirror.', 'While B reaches the mirror at C, the wavelet from A travels the same distance to D.', 'Triangles ABC and ADC are congruent.', 'So the angle of incidence equals the angle of reflection.'],
      ['Derive the expression for fringe width in Young’s double slit experiment.', 'Two slits a distance d apart are at a distance D from the screen.', 'The path difference at a point y from the centre is yd/D.', 'A bright fringe needs yd/D = nλ, so y = nλD/d.', 'The difference between neighbouring fringes is β = λD/d.', ['So fringe width grows with the wavelength and the distance to the screen.', 1]],
    ],
    draw: [
      ['Sketch the intensity against distance on the screen in Young’s experiment.', 'Equally spaced maxima of equal height along the screen.', 'Zero intensity midway between the maxima.'],
      ['Sketch how intensity varies across the screen in single-slit diffraction.', 'A tall central maximum.', 'Much lower side maxima, getting lower with distance from the centre.'],
    ],
    cases: [
      {
        scene: 'Two students shine a yellow laser at a card. One card has a pair of narrow slits, and the other a single narrow slit. The patterns they see on a far wall look quite different.',
        parts: [
          ['Which card gives equally spaced fringes of similar brightness?', 'The card with two slits, which shows interference.', 1],
          ['What is the broad central band on the other card called?', 'The central maximum of single-slit diffraction.', 1],
          ['What do both patterns say about the nature of light?', 'That light behaves as a wave.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 7: Dual nature
  mcqNum('photon-energy', [7, 'a', 1, 1], {
    text: 'Light of frequency {F} × 10¹⁴ Hz has photons of energy:',
    vars: { F: [4, 9, 1] },
    use: 'p-xii-7-4',
    find: 'E',
    given: { nu: 'F*1e14 Hz' },
    unit: 'eV',
    mistakes: (_v, a) => [
      ['gave the answer in joules without dividing by e', a * 1.6e-19],
      ['used h/2π', a / (2 * Math.PI)],
      ['doubled the energy', a * 2],
      ['halved the energy', a / 2],
    ],
  }),
  num('photoelectric', [7, 'a', 3, 2], {
    text: 'Light of wavelength {L} nm falls on a metal with a work function of {W} eV.',
    vars: { L: [200, 400, 25], W: [1.8, 2.6, 0.2] },
    derive: (v) => ({ NU: 3e8 / (v.L * 1e-9) }),
    parts: [
      { ask: 'Maximum kinetic energy of the photoelectrons', use: 'p-xii-7-1', find: 'K_max', given: { nu: 'NU Hz', phi: 'W eV' }, unit: 'eV', marks: 2 },
      { ask: 'Stopping potential', use: 'p-xii-7-8', find: 'V_0', given: { nu: 'NU Hz', phi: 'W eV' }, marks: 1 },
    ],
  }),
  num('threshold', [7, 'a', 2, 1], {
    variants: [
      { text: 'A metal has a work function of {W} eV. Find its threshold wavelength.', parts: [{ ask: 'Threshold wavelength', use: 'p-xii-7-18', find: 'lambda_0', given: { phi: 'W eV' }, unit: 'nm', marks: 2 }] },
      { text: 'A metal has a work function of {W} eV. Find its threshold frequency.', parts: [{ ask: 'Threshold frequency', use: 'p-xii-7-19', find: 'nu_0', given: { phi: 'W eV' }, marks: 2 }] },
    ],
    vars: { W: [1.8, 5, 0.2] },
  }),
  num('debroglie', [7, 'a', 2, 1], {
    variants: [
      { text: 'Find the de Broglie wavelength of an electron travelling at {V} × 10⁶ m/s.', parts: [{ ask: 'de Broglie wavelength', use: 'p-xii-7-2', find: 'lambda', given: { m: '9.11e-31 kg', v: 'V*1e6 m/s' }, unit: 'nm', marks: 2 }] },
      { text: 'A {M} g ball travels at {S} m/s. Find its de Broglie wavelength, and say why no wave effects are seen.', parts: [{ ask: 'de Broglie wavelength. It is far too small to detect', use: 'p-xii-7-2', find: 'lambda', given: { m: 'M g', v: 'S m/s' }, marks: 2 }] },
    ],
    vars: { V: [1, 9, 1], M: [50, 300, 50], S: [10, 40, 10] },
  }),
  num('photon-rate', [7, 'a', 3, 3], {
    style: 'cbq-style',
    text: 'A laser pointer of power {P} mW emits light of frequency {F} × 10¹⁴ Hz.',
    vars: { P: [1, 5, 1], F: [4, 7, 1] },
    parts: [
      { ask: 'Energy of each photon', use: 'p-xii-7-4', find: 'E', given: { nu: 'F*1e14 Hz' }, marks: 1 },
      { ask: 'Photons emitted per second', use: 'p-xii-7-9', find: 'N', given: { P: 'P mW', nu: 'F*1e14 Hz' }, marks: 2 },
    ],
  }),
  custom('stopping-graph', [7, 'a', 3, 3], { type: 'short', format: 'diagram', style: 'cbq-style' }, (g) => {
    const f1 = g.int(4, 6);
    const f2 = f1 + g.int(2, 3);
    return g.theory('The graph shows stopping potential against the frequency of the incident light for two metals, A and B. Both lines meet the frequency axis at the frequencies marked.\n(i) Which metal has the larger work function? [1]\n(ii) What does the slope of each line give? [1]\n(iii) Light of one frequency above both thresholds falls on each metal. Which gives electrons with more kinetic energy? [1]', [
      ['(i) Metal B, as it has the larger threshold frequency.', 1],
      ['(ii) h/e, the same for both.', 1],
      ['(iii) Metal A, as less energy goes to overcoming the work function.', 1],
    ], {
      diagram: {
        kind: 'graph',
        x: 'Frequency (× 10¹⁴ Hz)',
        y: 'Stopping potential',
        lines: [{ label: 'A', points: [[f1, 0], [f1 + 4, 2]] }, { label: 'B', points: [[f2, 0], [f2 + 4, 2]] }],
        ticksX: [[f1, String(f1)], [f2, String(f2)]],
      },
    });
  }),
  ...facts(7, 'a', {
    define: [
      ['work function', 'The least energy needed to take an electron out of a metal’s surface.'],
      ['threshold frequency', 'The lowest frequency of light that can release electrons from a given metal.'],
      ['stopping potential', 'The negative potential on the collector at which the photocurrent just falls to zero.'],
      ['matter waves', 'Waves associated with moving particles, of wavelength h/p.'],
    ],
    recall: [
      ['Raising the intensity of light above the threshold frequency increases the:', 'photocurrent', 'stopping potential', 'kinetic energy of each electron', 'work function'],
      ['Raising the frequency of the incident light raises the:', 'maximum kinetic energy of the electrons', 'number of electrons', 'work function', 'threshold frequency'],
      ['The slope of a graph of stopping potential against frequency is:', 'h/e', 'e/h', 'h', 'e'],
      ['The Davisson–Germer experiment showed the wave nature of:', 'electrons', 'photons', 'protons', 'X-rays'],
      ['If an electron’s speed doubles, its de Broglie wavelength:', 'is halved', 'doubles', 'is unchanged', 'is four times as large'],
    ],
    reason: [
      ['Photoelectric emission is instantaneous, however faint the light.', 'An electron absorbs one photon’s energy all at once.', 'It doesn’t have to wait to build up energy.'],
      ['Wave theory cannot explain the threshold frequency.', 'On wave theory, enough time at any frequency would give enough energy.', 'But no electrons are emitted below threshold, however long the wait.'],
      ['Wave effects aren’t seen for a moving cricket ball.', 'Its momentum is large, so its de Broglie wavelength is far too small to detect.'],
    ],
    compare: [
      ['photons', 'electrons', ['Have no rest mass.', 'Have a rest mass.'], ['Travel at the speed of light in vacuum.', 'Always travel slower than light.'], ['Carry no charge.', 'Carry a negative charge.']],
    ],
    truths: [
      ['Stopping potential doesn’t depend on the intensity of the light.', 'Stopping potential is proportional to the intensity of the light.'],
      ['Photon energy is proportional to frequency.', 'Photon energy is inversely proportional to frequency.'],
      ['The photoelectric effect supports the particle nature of light.', 'The photoelectric effect supports only the wave nature of light.'],
    ],
    explain: [
      ['State Einstein’s photoelectric equation, and what each term stands for.', 'K_max = hν − φ, where hν is the energy of a photon.', 'φ is the work function, and K_max is the largest kinetic energy of an emitted electron.'],
    ],
    long: [
      ['Show that the de Broglie wavelength of an electron accelerated through V volts is 1.227/√V nm.', 'Kinetic energy gained is eV = p²/2m.', 'So p = √(2meV).', 'λ = h/p = h/√(2meV).', 'Putting in the constants gives λ = 1.227/√V nm.'],
    ],
    draw: [
      ['Sketch how photocurrent varies with collector potential for two intensities at the same frequency.', 'Both curves meet the axis at the same negative stopping potential.', 'The brighter light reaches the higher saturation current.'],
      ['Sketch how maximum kinetic energy of photoelectrons varies with frequency.', 'A straight line starting from the threshold frequency on the frequency axis.', 'Its slope is h.'],
    ],
    cases: [
      {
        scene: 'An automatic door uses a photocell. Light falls on a metal plate and keeps a current flowing. A person walking through blocks the beam, and the current stops, which opens the door.',
        parts: [
          ['What effect does the photocell rely on?', 'The photoelectric effect.', 1],
          ['Why would red light fail with some metal plates?', 'Its photon energy may be below the metal’s work function.', 1],
          ['How does brighter light change the current?', 'More photons per second release more electrons, so the current rises.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 8: Atoms and nuclei
  num('half-life', [8, 'b', 3, 2], {
    text: 'A radioactive sample has a half-life of {T} days, and starts with {M} g of the substance.',
    vars: { T: [2, 20, 2], M: [16, 128, 16], D: [1, 4, 1] },
    derive: (v) => ({ E: v.T * v.D }),
    parts: [
      { ask: 'Decay constant', use: 'p-xii-8-5', find: 'lambda', given: { T_half: 'T day' }, unit: 's^-1', marks: 1 },
      { ask: 'Mass left after {E} days', use: 'p-xii-8-112', find: 'm', given: { m_0: 'M g', t: 'E day', T_half: 'T day' }, unit: 'g', marks: 2 },
    ],
  }),
  mcqNum('half-life-mcq', [8, 'b', 1, 1], {
    text: 'A nuclide has a half-life of {T} years. Of {M} g, the mass left after {E} years is:',
    vars: { T: [5, 30, 5], M: [16, 80, 16], K: [2, 4, 1] },
    derive: (v) => ({ E: v.T * v.K }),
    use: 'p-xii-8-112',
    find: 'm',
    given: { m_0: 'M g', t: 'E year', T_half: 'T year' },
    unit: 'g',
    mistakes: (v, a) => [
      ['counted one half-life too few', a * 2],
      ['counted one half-life too many', a / 2],
      ['gave the amount that has decayed', v.M - a],
      ['divided by the number of half-lives instead', v.M / v.K],
    ],
  }),
  num('nucleus-size', [8, 'b', 2, 1], {
    text: 'Taking R₀ = 1.2 fm, find the radius of a nucleus of mass number {A}.',
    vars: { A: [8, 27, 64, 125, 216] },
    parts: [{ ask: 'Radius of the nucleus', use: 'p-xii-8-83', find: 'R', given: { A: 'A' }, marks: 2 }],
  }),
  custom('bohr-energy', [8, 'a', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const high = g.int(3, 6);
    const low = g.int(1, 2);
    const eHigh = -13.6 / high ** 2;
    const eLow = -13.6 / low ** 2;
    const de = eHigh - eLow;
    const lambda = (1242 / de);
    return {
      form: 'numeric',
      text: `In a hydrogen atom, an electron falls from the n = ${high} level to the n = ${low} level.`,
      diagram: { kind: 'levels', levels: [{ n: `n = ${low}`, E: `${(eLow).toFixed(2)} eV`, at: eLow }, { n: `n = ${high}`, E: `${eHigh.toFixed(2)} eV`, at: eHigh }], from: 1, to: 0 },
      parts: [
        g.answerPart('Energy of the photon emitted', de, 2, [{ label: 'Use the energy of each level', math: [`E_n = -\\dfrac{13.6}{n^2}\\text{ eV}`, `\\Delta E = ${eHigh.toFixed(3)} - (${eLow.toFixed(3)}) = ${de.toFixed(3)}\\text{ eV}`] }], 'eV'),
        g.answerPart('Wavelength of the light', lambda, 1, [{ label: 'Use the photon energy', math: [`\\lambda = \\dfrac{hc}{\\Delta E} = \\dfrac{1242}{${de.toFixed(3)}}\\text{ nm} = ${lambda.toFixed(1)}\\text{ nm}`] }], 'nm'),
      ],
    };
  }),
  custom('binding', [8, 'b', 3, 2], { type: 'numerical', format: 'numerical' }, (g) => {
    const [name, z, a, mass] = g.pick([
      ['helium-4', 2, 4, 4.002603],
      ['carbon-12', 6, 12, 12.0],
      ['oxygen-16', 8, 16, 15.994915],
      ['neon-20', 10, 20, 19.992440],
      ['iron-56', 26, 56, 55.934937],
    ] as const);
    const defect = z * 1.007825 + (a - z) * 1.008665 - mass;
    const be = defect * 931.5;
    return {
      form: 'numeric',
      text: `The atomic mass of ${name} is ${mass} u. Take the mass of a hydrogen atom to be 1.007825 u, and of a neutron to be 1.008665 u, with 1 u = 931.5 MeV/c².`,
      parts: [
        g.answerPart('Mass defect', defect, 1, [{ label: 'Compare the parts with the whole', math: [`\\Delta m = ${z}(1.007825) + ${a - z}(1.008665) - ${mass} = ${defect.toFixed(6)}\\text{ u}`] }], 'u'),
        g.answerPart('Binding energy per nucleon', be / a, 2, [{ label: 'Convert, and share among the nucleons', math: [`\\text{BE} = ${defect.toFixed(6)} \\times 931.5 = ${be.toFixed(2)}\\text{ MeV}`, `\\dfrac{\\text{BE}}{A} = \\dfrac{${be.toFixed(2)}}{${a}} = ${(be / a).toFixed(2)}\\text{ MeV}`] }], 'MeV'),
      ],
    };
  }),
  custom('level-transitions', [8, 'a', 1, 2], { type: 'mcq', format: 'mcq' }, (g) => {
    const n = g.int(3, 6);
    const lines = (n * (n - 1)) / 2;
    return g.mcqNumber(`A hydrogen atom sits in the n = ${n} level. The largest number of different spectral lines it can emit on falling to the ground state, taking every possible route, is:`, lines, '', [
      { slip: 'used n − 1, counting only one route', value: n - 1 },
      { slip: 'forgot to halve n(n − 1)', value: n * (n - 1) },
      { slip: 'used n', value: n },
      { slip: 'used n²', value: n * n },
      { slip: 'used n(n + 1)/2', value: (n * (n + 1)) / 2 },
    ]);
  }),
  ...facts(8, 'a', {
    define: [
      ['the ground state of an atom', 'The state of lowest energy, in which it is most stable.'],
      ['the ionisation energy of an atom', 'The least energy needed to take an electron completely out of the atom from its ground state.'],
      ['the impact parameter', 'The perpendicular distance of an alpha particle’s initial path from the centre of the nucleus.'],
      ['distance of closest approach', 'The distance from the nucleus at which an alpha particle moving straight at it stops and turns back.'],
    ],
    recall: [
      ['Which series of hydrogen lines lies in the visible region?', 'Balmer', 'Lyman', 'Paschen', 'Brackett'],
      ['Which series of hydrogen lines lies in the ultraviolet?', 'Lyman', 'Balmer', 'Paschen', 'Pfund'],
      ['The energy of an electron in the nth orbit of hydrogen varies as:', '1/n²', '1/n', 'n', 'n²'],
      ['Rutherford’s alpha scattering showed that an atom has:', 'a small, massive, positive nucleus', 'charge spread evenly throughout', 'electrons in fixed shells', 'no empty space'],
      ['The radius of the nth Bohr orbit varies as:', 'n²', 'n', '1/n', '1/n²'],
    ],
    reason: [
      ['Most alpha particles in Rutherford’s experiment went straight through the foil.', 'Most of an atom is empty space.', 'So few alpha particles come close to a nucleus.'],
      ['An atomic spectrum is made of lines, not a continuous band.', 'Energy levels in an atom are discrete.', 'So only certain photon energies can be emitted.'],
    ],
    compare: [
      ['an emission spectrum', 'an absorption spectrum', ['Bright lines on a dark background.', 'Dark lines on a bright background.'], ['Produced as excited atoms fall to lower levels.', 'Produced when cool atoms absorb from continuous light.']],
    ],
    truths: [
      ['Angular momentum of an electron in a Bohr orbit is a whole-number multiple of h/2π.', 'Angular momentum of an electron in a Bohr orbit can have any value.'],
      ['A hydrogen atom emits light only when its electron falls to a lower level.', 'A hydrogen atom emits light only when its electron rises to a higher level.'],
      ['The ionisation energy of hydrogen is 13.6 eV.', 'The ionisation energy of hydrogen is 3.4 eV.'],
    ],
    explain: [
      ['State Bohr’s postulates for the hydrogen atom.', 'An electron moves in a circular orbit without radiating, in certain allowed orbits.', 'Allowed orbits have angular momentum nh/2π.', 'A photon is emitted or absorbed only on a jump between orbits, with hν = E₂ − E₁.'],
    ],
    long: [
      ['Using Bohr’s postulates, derive the expression for the radius of the nth orbit of hydrogen.', 'Equate the Coulomb force with the centripetal force, mv²/r = e²/(4πε₀r²).', 'Use the quantum condition mvr = nh/2π.', 'Eliminate v between these two equations.', 'That gives r = ε₀n²h²/(πme²), so r is proportional to n².'],
      ['Derive the total energy of an electron in the nth Bohr orbit of hydrogen, and explain why it is negative.', 'Kinetic energy is e²/(8πε₀r).', 'Potential energy is −e²/(4πε₀r).', 'So total energy is −e²/(8πε₀r).', 'Substituting r gives E = −13.6/n² eV.', 'It is negative because the electron is bound to the nucleus.'],
    ],
    draw: [
      ['Draw an energy level diagram for hydrogen, showing the Lyman and Balmer series.', 'Levels n = 1 to at least 4, closer together as n rises, with n = 1 at −13.6 eV.', 'Lyman arrows ending at n = 1, and Balmer arrows ending at n = 2.'],
    ],
  }),
  ...facts(8, 'b', {
    define: [
      ['mass defect', 'The difference between the total mass of the separate nucleons and the mass of the nucleus.'],
      ['binding energy of a nucleus', 'The energy needed to separate a nucleus into its nucleons, equal to the mass defect times c².'],
      ['half-life', 'The time in which half of the nuclei in a sample decay.'],
      ['isotopes', 'Atoms with the same atomic number, but different mass numbers.'],
      ['isobars', 'Atoms with the same mass number, but different atomic numbers.'],
    ],
    recall: [
      ['Nuclear density is:', 'about the same for all nuclei', 'greatest for heavy nuclei', 'greatest for light nuclei', 'proportional to mass number'],
      ['Beta-minus decay raises the atomic number by:', '1', '2', '0', '4'],
      ['Alpha decay lowers the mass number by:', '4', '2', '1', '0'],
      ['Which is most stable, judging by binding energy per nucleon?', 'Iron-56', 'Uranium-238', 'Helium-4', 'Hydrogen-2'],
      ['Nuclear forces are:', 'short-range and strong', 'long-range and strong', 'short-range and weak', 'long-range and weak'],
      ['Energy is released in fission because the products have:', 'a greater binding energy per nucleon', 'a smaller binding energy per nucleon', 'more mass overall', 'more nucleons'],
    ],
    reason: [
      ['Fusion needs a very high temperature.', 'Nuclei repel strongly because of their positive charge.', 'They need very high kinetic energy to get close enough.'],
      ['Heavy nuclei can release energy in fission.', 'Their binding energy per nucleon is lower than that of middle-sized nuclei.', 'So splitting them raises the binding energy per nucleon.'],
      ['A neutron is a good projectile for causing fission.', 'It has no charge, so the nucleus doesn’t repel it.'],
    ],
    compare: [
      ['nuclear fission', 'nuclear fusion', ['A heavy nucleus splits into lighter ones.', 'Light nuclei join into a heavier one.'], ['Starts with a neutron at ordinary temperatures.', 'Needs extremely high temperatures.'], ['Used in nuclear power stations.', 'Powers the Sun and stars.']],
      ['alpha rays', 'beta rays', ['Helium nuclei with charge +2e.', 'Fast electrons or positrons, with charge ±e.'], ['Low penetration, high ionising power.', 'Greater penetration, lower ionising power.']],
    ],
    truths: [
      ['The radius of a nucleus varies as the cube root of its mass number.', 'The radius of a nucleus varies directly as its mass number.'],
      ['Binding energy per nucleon is largest around mass number 56.', 'Binding energy per nucleon is largest around mass number 200.'],
      ['The nuclear force doesn’t depend on charge.', 'The nuclear force acts only between protons.'],
      ['Gamma emission doesn’t change the mass number or atomic number.', 'Gamma emission lowers the mass number by 4.'],
    ],
    long: [
      ['Starting from the radioactive decay law, derive N = N₀e^(−λt), and from it the relation between half-life and decay constant.', 'The rate of decay is dN/dt = −λN.', 'Integrating gives N = N₀e^(−λt).', 'At the half-life, N = N₀/2.', 'So e^(−λT) = ½, which gives T = ln 2/λ = 0.693/λ.'],
    ],
    draw: [
      ['Sketch binding energy per nucleon against mass number.', 'A rapid rise for light nuclei, a broad peak near A = 56, and a slow fall for heavy nuclei.', 'Mention why fission and fusion both release energy: each moves towards the peak.'],
      ['Sketch the number of undecayed nuclei against time.', 'An exponential fall from N₀ with time.', 'N₀/2 at one half-life and N₀/4 at two half-lives.'],
    ],
    cases: [
      {
        scene: 'Archaeologists date a wooden tool by measuring its carbon-14, which has a half-life of about 5730 years. Living trees keep a steady level of it, and after a tree dies, the level starts to fall.',
        parts: [
          ['Why does the carbon-14 level stop being topped up when the tree dies?', 'The tree stops taking in carbon from the air.', 1],
          ['If a sample has a quarter of the carbon-14 of living wood, how old is it?', 'Two half-lives, about 11 460 years.', 1],
          ['Does temperature affect this rate of decay?', 'No, radioactive decay doesn’t depend on temperature.', 1],
        ],
      },
    ],
  }),

  // ---- Unit 9: Electronic devices
  num('diode-current', [9, 'b', 2, 2], {
    text: 'A silicon diode with a forward drop of {D} V is in series with a {R} Ω resistor across a {V} V supply. Find the current.',
    vars: { D: [0.7], R: [50, 300, 50], V: [3, 12, 1] },
    parts: [{ ask: 'Current', use: 'p-xii-9-23', find: 'I', given: { V_s: 'V V', V_D: 'D V', R: 'R ohm' }, unit: 'mA', marks: 2 }],
    diagram: (v) => ({ kind: 'circuit', source: { type: 'cell', label: `${v.V} V` }, loop: [{ type: 'diode', label: 'Si' }, { type: 'R', label: ohms(v.R) }] }),
  }),
  num('zener', [9, 'b', 2, 2], {
    text: 'A Zener diode rated at {Z} V keeps the voltage steady across a {R} Ω load. Find the load current.',
    vars: { Z: [5, 15, 1], R: [100, 1000, 100] },
    parts: [{ ask: 'Load current', use: 'p-xii-9-41', find: 'I_L', given: { V_Z: 'Z V', R_L: 'R ohm' }, unit: 'mA', marks: 2 }],
  }),
  num('carriers', [9, 'a', 2, 2], {
    text: 'A silicon crystal has an intrinsic carrier density of {I} × 10¹⁶ per m³. Doping gives {E} × 10²² electrons per m³. Find the density of holes.',
    vars: { I: [1, 2, 0.5], E: [1, 8, 1] },
    parts: [{ ask: 'Hole density', use: 'p-xii-9-1', find: 'n_h', given: { n_i: 'I*1e16 m^-3', n_e: 'E*1e22 m^-3' }, marks: 2 }],
  }),
  custom('gates', [9, 'b', 2, 2], { type: 'short', format: 'short' }, (g) => {
    const [gate, f] = g.pick([
      ['NAND', (a: number, b: number) => 1 - (a & b)],
      ['NOR', (a: number, b: number) => 1 - (a | b)],
      ['AND', (a: number, b: number) => a & b],
      ['OR', (a: number, b: number) => a | b],
    ] as const);
    const a = g.int(0, 1);
    const b = g.int(0, 1);
    return g.theory(`Inputs A = ${a} and B = ${b} go to a ${gate} gate. Write the output, and the truth table for this gate.`, [
      [`Output = ${f(a, b)}.`, 1],
      [`Truth table for ${gate}: 00 → ${f(0, 0)}, 01 → ${f(0, 1)}, 10 → ${f(1, 0)}, 11 → ${f(1, 1)}.`, 1],
    ]);
  }),
  ...facts(9, 'a', {
    define: [
      ['an intrinsic semiconductor', 'A pure semiconductor, in which the numbers of free electrons and holes are equal.'],
      ['doping', 'Adding a small, controlled amount of impurity to a semiconductor, to raise its conductivity.'],
      ['the energy band gap', 'The energy difference between the top of the valence band and the bottom of the conduction band.'],
    ],
    recall: [
      ['An n-type semiconductor is made by adding a:', 'pentavalent impurity', 'trivalent impurity', 'tetravalent impurity', 'divalent impurity'],
      ['A p-type semiconductor is made by adding:', 'boron', 'phosphorus', 'arsenic', 'antimony'],
      ['The majority carriers in a p-type semiconductor are:', 'holes', 'electrons', 'protons', 'ions'],
      ['As a semiconductor is heated, its conductivity:', 'rises', 'falls', 'stays the same', 'becomes zero'],
      ['Which has the largest band gap?', 'An insulator', 'A conductor', 'A semiconductor', 'They are all the same'],
    ],
    reason: [
      ['A p-type semiconductor is electrically neutral, despite having holes.', 'The impurity atoms are themselves neutral overall.', 'Each hole is simply a missing electron from a neutral atom’s bond.'],
      ['The conductivity of a semiconductor rises with temperature.', 'Heating frees more electrons from the valence band.', 'That adds carriers faster than extra collisions reduce their mobility.'],
    ],
    compare: [
      ['an n-type semiconductor', 'a p-type semiconductor', ['Doped with a pentavalent element.', 'Doped with a trivalent element.'], ['Majority carriers are electrons.', 'Majority carriers are holes.']],
      ['a conductor', 'a semiconductor', ['No band gap: bands overlap.', 'A small band gap, about 1 eV.'], ['Resistance rises with temperature.', 'Resistance falls with temperature.']],
    ],
    truths: [
      ['A hole behaves like a positive charge.', 'A hole behaves like a negative charge.'],
      ['In an intrinsic semiconductor, electrons and holes are equal in number.', 'In an intrinsic semiconductor, electrons far outnumber holes.'],
      ['Silicon has a band gap of about 1.1 eV.', 'Silicon has a band gap of about 11 eV.'],
    ],
    draw: [
      ['Draw energy band diagrams for a conductor, a semiconductor and an insulator.', 'Three band diagrams showing overlap, a small gap and a large gap.', 'Valence and conduction bands labelled in each.'],
    ],
  }),
  ...facts(9, 'b', {
    define: [
      ['the depletion region', 'The thin region at a p-n junction, which has no free charge carriers.'],
      ['rectification', 'Changing alternating current into direct current in one direction.'],
      ['Zener breakdown', 'The sudden large rise in reverse current at a sharply defined reverse voltage in a heavily doped diode.'],
      ['a logic gate', 'A circuit that gives a digital output following a logical rule from one or more digital inputs.'],
    ],
    recall: [
      ['In forward bias, the depletion layer:', 'becomes narrower', 'becomes wider', 'is unchanged', 'disappears completely at any voltage'],
      ['A Zener diode is mainly used as a:', 'voltage regulator', 'rectifier', 'amplifier', 'light source'],
      ['A full-wave rectifier’s output frequency, for a 50 Hz input, is:', '100 Hz', '50 Hz', '25 Hz', '200 Hz'],
      ['An LED emits light because of:', 'recombination of electrons and holes', 'heating of the junction', 'high resistance of the material', 'reverse breakdown'],
      ['A photodiode is operated in:', 'reverse bias', 'forward bias', 'zero bias only', 'breakdown'],
      ['A NAND gate gives 0 only when:', 'all its inputs are 1', 'all its inputs are 0', 'any input is 0', 'any input is 1'],
    ],
    reason: [
      ['A solar cell needs no external bias.', 'The junction’s built-in field separates the electrons and holes that light produces.', 'That drives a current on its own.'],
      ['Reverse current in a p-n junction is very small.', 'Only the few minority carriers can cross the barrier.'],
      ['NAND and NOR are called universal gates.', 'Any other gate can be built using only NAND, or only NOR.'],
    ],
    compare: [
      ['forward bias', 'reverse bias', ['p side connected to positive terminal.', 'p side connected to negative terminal.'], ['Depletion layer narrows.', 'Depletion layer widens.'], ['A large current flows.', 'A very small current flows.']],
      ['half-wave rectifier', 'full-wave rectifier', ['Uses one diode.', 'Uses two diodes, or four in a bridge.'], ['Conducts for half of each cycle.', 'Conducts for the whole cycle.']],
    ],
    truths: [
      ['A diode conducts well in only one direction.', 'A diode conducts equally well in both directions.'],
      ['Zener diodes are heavily doped.', 'Zener diodes are very lightly doped.'],
      ['Barrier potential opposes the flow of majority carriers.', 'Barrier potential helps the flow of majority carriers.'],
    ],
    draw: [
      ['Draw the circuit of a full-wave rectifier using two diodes, and sketch its output.', 'A centre-tapped transformer, two diodes and a load resistor.', 'Output pulses in one direction, for every half cycle of the input.'],
      ['Sketch the V–I characteristic of a p-n junction diode.', 'A small current until the knee voltage in forward bias, then a steep rise.', 'A very small reverse current until breakdown.'],
      ['Draw the symbol and write the truth table for a NOR gate.', 'The OR symbol with a small circle at its output.', 'Output is 1 only when both inputs are 0.'],
    ],
    cases: [
      {
        scene: 'A rooftop panel charges a battery during the day. A homeowner notices its output falling on hot days and wonders whether adding a diode between the panel and battery is useful.',
        parts: [
          ['What does the panel’s p-n junction do to the electrons and holes made by sunlight?', 'Its built-in field drives them in opposite directions, producing a current.', 1],
          ['What is the diode for?', 'It stops the battery from discharging back through the panel at night.', 1],
          ['Why might the output fall on hot days?', 'More carriers exist in the semiconductor at high temperature, which lowers the junction’s voltage.', 1],
        ],
      },
    ],
  }),
];

export default blueprints;
export type { Values };
