// Written by hand: dual nature of radiation and matter, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('physics', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  predict(A(2, 1), 'The intensity of light on a photocell is doubled, at the same frequency above threshold. Predict what happens to the photocurrent and to the stopping potential.', 'The photocurrent doubles, as twice as many photons free twice as many electrons.', 'The stopping potential stays the same, as each photon has the same energy.'),
  predict(A(2, 2), 'Light below a metal’s threshold frequency is made very bright. Predict whether photoelectrons are emitted.', 'No, none are emitted.', 'Each photon has energy hν, less than the work function, and a single electron can’t gather energy from two photons.'),
  predict(A(2, 2), 'The frequency of light on a metal is raised, above its threshold. Predict what happens to the greatest kinetic energy of the photoelectrons.', 'It rises.', 'By Einstein’s equation, K_max = hν − φ, so it rises in a straight line with ν.'),
  predict(A(3, 3), 'An electron and a proton are accelerated through the same potential difference. Predict which has the longer de Broglie wavelength, and by how much.', 'Both gain the same kinetic energy, eV.', 'λ = h/√(2mK), so the lighter electron has the longer wavelength.', 'The ratio is √(m_p/m_e), about 43.'),
  predict(A(2, 3), 'The potential difference that accelerates an electron is made four times as large. Predict what happens to its de Broglie wavelength.', 'It halves.', 'λ = h/√(2meV), so λ is proportional to 1/√V.'),
];

export default questions;
