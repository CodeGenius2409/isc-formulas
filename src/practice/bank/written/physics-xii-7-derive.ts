// Written by hand: dual nature of radiation and matter, derivations not already in the bank. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { derive } = kit('physics', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  derive(A(3, 2), 'Show that the stopping potential varies linearly with the frequency of the light, and find the slope.', ['By Einstein’s equation, the greatest kinetic energy is hν − φ.', 1], ['The stopping potential stops these electrons: eV₀ = hν − φ.', 1], ['So V₀ = (h/e)ν − φ/e, a straight line of slope h/e.', 1]),
  derive(A(3, 2), 'Show that the momentum of a photon of wavelength λ is h/λ.', ['A photon’s energy is E = hν = hc/λ.', 1], ['For a particle moving at c with no rest mass, E = pc.', 1], ['So p = E/c = h/λ.', 1]),
  derive(A(3, 3), 'Obtain the number of photons given out each second by a source of power P emitting light of wavelength λ.', ['Each photon carries energy hc/λ.', 1], ['In one second the source gives out energy P.', 1], ['So n = P/(hc/λ) = Pλ/hc.', 1]),
];

export default questions;
