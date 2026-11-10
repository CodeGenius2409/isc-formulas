// Written by hand: magnetism, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('physics', 'XII');
const B = at(3, 'b');

const questions: BankDef[] = [
  reason(B(1, 1), 'Why is soft iron, and not steel, used for the core of an electromagnet?', 'It magnetises strongly and loses its magnetism at once when the current stops.'),
  reason(B(2, 2), 'Why do magnetic field lines form closed loops, unlike electric ones?', 'There are no isolated magnetic poles.', 'So lines have no start or end, and the net flux through a closed surface is zero.'),
  reason(B(2, 2), 'Why is a diamagnetic substance pushed out of a strong magnetic field?', 'The field induces in its atoms a moment opposite to the field.', 'So it is repelled, and moves towards the weaker part.'),
  reason(B(2, 3), 'Why can a current loop be treated as a magnetic dipole?', 'Far away, its field has the same pattern as that of a short bar magnet.', 'It also feels a torque in a uniform field, as a bar magnet does, with moment m = NIA.'),
  reason(B(1, 2), 'Why is steel, and not soft iron, used for a permanent magnet?', 'Steel keeps its magnetism for a long time once magnetised, and is not easily demagnetised.'),
  short(B(2, 1), 'Name one example each of a diamagnetic, a paramagnetic and a ferromagnetic substance, and say how each behaves in a magnetic field.', 'Copper or bismuth is weakly repelled. Aluminium is weakly attracted.', 'Iron is strongly attracted.'),
  short(B(2, 2), 'An electromagnet is needed for a crane. State three factors that decide its strength, in two marks.', 'The number of turns and the current in them.', 'The material of the core, such as soft iron.'),
  short(B(3, 2), 'A short bar magnet is placed in a uniform field. What does it feel? Give the expression, and say at which angle it is largest and when it is stable.', 'A torque, τ = mB sin θ, and no net force.', 'It is largest at 90°.', 'It is in stable equilibrium at θ = 0.'),
  short(B(3, 2), 'An electron circles a nucleus at speed v in an orbit of radius r. Write the current it amounts to, and its magnetic moment.', 'The charge passes once in each period, so I = ev / (2πr).', 'The moment is IA, with A = πr².', 'So m = evr / 2.'),
  short(B(3, 3), 'In what ways is a bar magnet like a current-carrying solenoid? Give three.', 'Their field patterns outside are alike.', 'Each has a north and a south pole, which can’t be separated.', 'Each feels a torque in a uniform field, with its own magnetic moment.'),
];

export default questions;
