// Written by hand: induction and a.c., reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('physics', 'XII');
const A = at(4, 'a');
const B = at(4, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why does a magnet dropped through a long copper pipe fall more slowly than one dropped outside it?', 'It induces eddy currents in the pipe, whose field opposes its motion, as Lenz’s law says.'),
  reason(A(2, 2), 'Why is Lenz’s law a statement of the conservation of energy?', 'The induced current always opposes the change that makes it, so work must be done against it.', 'If it helped the change, energy would appear from nothing.'),
  reason(A(2, 2), 'Why are the cores of transformers laminated?', 'Thin insulated sheets cut the paths of eddy currents.', 'So less energy is lost as heat in the core.'),
  reason(A(2, 3), 'A coil’s self-inductance is said to act like inertia in a circuit. Why?', 'It opposes any change in the current, as mass opposes a change in velocity.', 'Its energy, ½LI², matches kinetic energy, ½mv².'),
  reason(A(1, 2), 'Why does a spark often jump across a switch as an inductive circuit is opened?', 'The current falls very fast, so a large emf is induced across the gap.'),
  short(A(2, 1), 'State Faraday’s two laws of electromagnetic induction.', 'An emf is induced in a circuit whenever the magnetic flux through it changes.', 'The size of the emf equals the rate of change of the flux.'),
  tell(A(2, 2), 'Distinguish between self-induction and mutual induction.', 'Self-induction is an emf in a coil due to the change of current in that same coil.', 'Mutual induction is an emf in a coil due to the change of current in a nearby coil.'),
  short(A(3, 2), 'Give three ways to raise the emf from a coil turning in a magnetic field.', 'Use more turns.', 'Use a larger area or a stronger field.', 'Turn it faster.'),
  short(A(3, 3), 'Give three uses of eddy currents, each in a line.', 'Induction furnaces, which heat metal by currents in it.', 'Electromagnetic brakes on trains.', 'Damping in a moving coil meter, so that the pointer settles quickly.'),
  reason(B(1, 2), 'Why is an ordinary moving coil ammeter of no use for measuring a.c.?', 'The average of a.c. over a cycle is zero, so its pointer can’t follow it.'),
  reason(B(2, 2), 'Why does a choke coil save power compared with a resistor, when both reduce a.c.?', 'A pure inductor’s current is 90° behind the voltage, so its average power is zero.', 'A resistor would waste the same drop as heat.'),
  reason(B(2, 3), 'Why can a capacitor be said to pass a.c. and block d.c.?', 'Its reactance, 1/ωC, is infinite for d.c., as ω is zero.', 'At a high frequency the reactance is small, so a.c. passes easily.'),
  short(B(2, 1), 'Define the rms value of an alternating current. How does it relate to the peak value?', 'The steady current that would give the same heat in a resistor in the same time.', 'I(rms) = I₀ / √2.'),
  short(B(2, 2), 'What is resonance in a series LCR circuit? Write the resonant frequency.', 'The state in which the inductive and capacitive reactances are equal, so the current is largest.', 'f = 1 / (2π√(LC)).'),
  short(B(3, 2), 'Define power factor, and find its value in a pure resistor, a pure inductor and a series LCR circuit at resonance.', 'cos φ, which is the ratio of average power to VI.', 'It is 1 for a pure resistor, and for a series LCR circuit at resonance.', 'It is 0 for a pure inductor.'),
  short(B(3, 3), 'State three energy losses in a real transformer, and one way each is kept small.', 'Copper losses, by using thick windings.', 'Eddy current losses, by laminating the core.', 'Hysteresis losses, by using soft iron.'),
];

export default questions;
