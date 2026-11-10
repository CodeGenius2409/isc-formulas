// Written by hand: dual nature of radiation and matter, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('physics', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  tell(A(2, 1), 'Distinguish between the work function and the threshold frequency of a metal.', 'The work function is the least energy needed to free an electron from the metal.', 'The threshold frequency is the least frequency of light that can do it: ν₀ = φ/h.'),
  tell(A(2, 2), 'Distinguish between the effects of intensity and of frequency on photoelectric emission.', 'Raising the intensity gives more photoelectrons, and a larger current, at the same energies.', 'Raising the frequency gives photoelectrons more kinetic energy, and a larger stopping potential.'),
  tell(A(2, 2), 'Distinguish between a photon and an electron.', 'A photon has no rest mass and no charge, and always moves at c.', 'An electron has mass and a negative charge, and moves slower than light.'),
  tell(A(2, 3), 'Distinguish between the wave picture and the photon picture of light, by what each explains.', 'The wave picture explains interference and diffraction.', 'The photon picture explains the photoelectric effect, with its threshold and instant emission.'),
  tell(A(3, 3), 'Distinguish between the de Broglie wavelength of a cricket ball and that of an electron, and say why waves are seen only with the electron.', 'λ = h/mv, so a ball’s wavelength is far too small to notice, about 10⁻³⁴ m.', 'An electron’s is about 10⁻¹⁰ m, the size of the gaps between atoms in a crystal.', 'So crystals can diffract electrons, as Davisson and Germer found, but nothing can diffract a ball.'),
];

export default questions;
