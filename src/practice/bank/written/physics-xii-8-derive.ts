// Written by hand: atoms and nuclei, derivations not already in the bank. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { derive } = kit('physics', 'XII');
const A = at(8, 'a');
const B = at(8, 'b');

const questions: BankDef[] = [
  derive(A(3, 3), 'Use Bohr’s energy levels to obtain the wavelengths of the lines in hydrogen’s spectrum.', ['The levels are Eₙ = −13.6/n² eV, or −hcR/n².', 1], ['A jump from n₂ down to n₁ gives a photon of energy hc/λ = E_{n₂} − E_{n₁}.', 1], ['So 1/λ = R(1/n₁² − 1/n₂²).', 1]),
  derive(B(3, 1), 'Show that 1 u of mass is equivalent to about 931.5 MeV.', ['1 u = 1.6605 × 10⁻²⁷ kg.', 1], ['E = mc² = 1.6605 × 10⁻²⁷ × (3 × 10⁸)² ≈ 1.494 × 10⁻¹⁰ J.', 1], ['Dividing by 1.602 × 10⁻¹³ J per MeV gives about 931.5 MeV.', 1]),
  derive(B(3, 2), 'Obtain the binding energy of a nucleus of mass M, with Z protons and A − Z neutrons.', ['The separate nucleons have mass Zm_p + (A − Z)m_n.', 1], ['The mass defect is Δm = Zm_p + (A − Z)m_n − M.', 1], ['The binding energy is Δm c², or Δm in u times 931.5 MeV.', 1]),
  derive(B(3, 3), 'Obtain the energy released, the Q value, in a nuclear reaction A + B → C + D.', ['Mass–energy is conserved, counting rest mass and kinetic energy together.', 1], ['Q = (m_A + m_B − m_C − m_D)c².', 1], ['If Q > 0, the products are lighter and energy is released, as kinetic energy of the products.', 1]),
];

export default questions;
