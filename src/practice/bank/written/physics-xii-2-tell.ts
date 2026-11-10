// Written by hand: current electricity, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('physics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  tell(A(2, 1), 'Distinguish between drift velocity and mobility.', 'Drift velocity is the average velocity of free electrons along the wire, in m s⁻¹.', 'Mobility is the drift velocity per unit field, v_d/E, in m² V⁻¹ s⁻¹.'),
  tell(A(2, 2), 'Distinguish between drift velocity and the random thermal velocity of electrons in a wire.', 'The thermal velocity is large, about 10⁵ m/s, but in random directions, so it averages to zero.', 'The drift velocity is tiny, about a millimetre a second, but along the wire, so it makes the current.'),
  tell(A(2, 2), 'Distinguish between resistors joined in series and in parallel.', 'In series, the same current flows through each, and R = R₁ + R₂.', 'In parallel, each has the same voltage, and 1/R = 1/R₁ + 1/R₂.'),
  tell(A(2, 3), 'Distinguish between current and current density.', 'Current is the charge passing per second through a whole cross-section, a scalar.', 'Current density is the current per unit area, a vector along the flow.'),
  tell(A(2, 3), 'Distinguish between electrical energy and electrical power.', 'Energy is the work done by the current, VIt, measured in joules or kW h.', 'Power is the rate of doing it, VI, measured in watts.'),
  tell(B(2, 1), 'Distinguish between Kirchhoff’s junction rule and loop rule.', 'The junction rule: the currents into a junction add up to the currents out, from conservation of charge.', 'The loop rule: round any closed loop, the emfs add up to the sum of the IR drops, from conservation of energy.'),
  tell(B(2, 3), 'Distinguish between a metre bridge and a potentiometer by what each measures, and how.', 'A metre bridge finds an unknown resistance, by balancing the ratio of two resistances.', 'A potentiometer measures an emf or potential difference, by balancing it against the fall of potential along a wire.'),
];

export default questions;
