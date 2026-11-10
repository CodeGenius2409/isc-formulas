// Written by hand: electrochemistry, derivations not already in the bank. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { derive } = kit('chemistry', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  derive(A(3, 2), 'Obtain the Nernst equation for the electrode Mⁿ⁺ + ne⁻ → M at 298 K.', ['ΔG = ΔG° + RT ln Q, with Q = 1/[Mⁿ⁺] as the metal is a solid.', 1], ['With ΔG = −nFE and ΔG° = −nFE°: E = E° − (RT/nF) ln(1/[Mⁿ⁺]).', 1], ['At 298 K this is E = E° − (0.059/n) log(1/[Mⁿ⁺]).', 1]),
  derive(A(3, 3), 'Show that the potential of a hydrogen electrode at 1 bar is −0.059 pH volts at 298 K.', ['The reaction is H⁺ + e⁻ → ½H₂, with E° = 0.', 1], ['E = 0 − 0.059 log(1/[H⁺]) for one electron and hydrogen at 1 bar.', 1], ['As log(1/[H⁺]) = pH, E = −0.059 pH.', 1]),
  derive(A(3, 3), 'Obtain the emf of the concentration cell Cu | Cu²⁺(c₁) || Cu²⁺(c₂) | Cu at 298 K.', ['Both electrodes are the same, so E° = 0.', 1], ['The cell reaction moves Cu²⁺ from c₂ to c₁, so Q = c₁/c₂ and n = 2.', 1], ['E = (0.059/2) log(c₂/c₁), positive when c₂ > c₁.', 1]),
  derive(B(3, 1), 'Show that the conductivity of a solution is its conductance times the cell constant.', ['R = ρl/A, so G = 1/R = (1/ρ)(A/l) = κA/l.', 1], ['The cell constant is l/A.', 1], ['So κ = G × (l/A).', 1]),
  derive(B(3, 2), 'Show that molar conductivity Λm = 1000κ/c, with c in mol L⁻¹ and κ in S cm⁻¹.', ['Λm is κ times the volume holding one mole: Λm = κV.', 1], ['1 L is 1000 cm³, so one mole is in 1000/c cm³.', 1], ['So Λm = 1000κ/c, in S cm² mol⁻¹.', 1]),
  derive(B(3, 2), 'From Faraday’s laws, obtain the mass of a substance deposited by a current I in time t.', ['The charge passed is Q = It.', 1], ['One mole of Mⁿ⁺ needs n faradays, nF coulombs, to deposit M grams.', 1], ['So m = MIt/nF.', 1]),
  derive(B(3, 3), 'Show, from the first law, that the same charge deposits masses in the ratio of the substances’ equivalent masses.', ['From m = MIt/nF, the mass deposited by one charge Q is (M/n)(Q/F).', 1], ['M/n is the equivalent mass, E.', 1], ['So for the same Q, m₁/m₂ = E₁/E₂: Faraday’s second law.', 1]),
  derive(B(3, 3), 'Show that the degree of ionisation of a weak electrolyte is Λm/Λ°m.', ['Λ°m is the molar conductivity when the electrolyte is fully ionised.', 1], ['At a concentration where only a fraction α is ionised, there are α times as many ions to carry current.', 1], ['So Λm = αΛ°m, and α = Λm/Λ°m.', 1]),
];

export default questions;
