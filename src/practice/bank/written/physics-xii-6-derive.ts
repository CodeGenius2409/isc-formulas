// Written by hand: optical instruments, derivations not already in the bank. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { derive } = kit('physics', 'XII');
const B = at(6, 'b');

const questions: BankDef[] = [
  derive(B(3, 3), 'Obtain the magnifying power of an astronomical telescope when its final image is formed at the near point, D.', ['The object’s angle at the objective is α = h/f₀, where h is the size of the first image.', 1], ['The eyepiece forms the final image at D, so the first image is at uₑ with 1/uₑ = 1/fₑ + 1/D, and β = h/uₑ.', 1], ['m = β/α = f₀/uₑ = (f₀/fₑ)(1 + fₑ/D).', 1]),
  derive(B(3, 3), 'A compound microscope is set so that the final image is at infinity. Obtain its magnifying power.', ['The objective magnifies m₀ = v₀/u₀ ≈ L/f₀, with the first image near the eyepiece’s focus.', 1], ['With the image at the eyepiece’s focus, the eyepiece magnifies D/fₑ.', 1], ['m = m₀ × mₑ = (L/f₀)(D/fₑ).', 1]),
];

export default questions;
