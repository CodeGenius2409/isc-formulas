// Written by hand: dual nature of radiation and matter, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('physics', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  odd(A(2, 1), ['photoelectric effect', 'Davisson–Germer experiment', 'existence of a threshold frequency', 'instant emission of photoelectrons'], 'Davisson–Germer experiment', 'It shows the wave nature of electrons; the others show the particle nature of light.'),
  odd(A(2, 2), ['hν', 'hc/λ', 'pc', 'h/p'], 'h/p', 'It is a wavelength; the others are a photon’s energy.'),
  odd(A(2, 2), ['work function', 'stopping potential × e', 'greatest kinetic energy', 'threshold wavelength'], 'threshold wavelength', 'It is a length; the others are energies.'),
  odd(A(2, 3), ['intensity of the light', 'number of photoelectrons', 'saturation current', 'stopping potential'], 'stopping potential', 'It doesn’t depend on intensity; the others rise with it.'),
  odd(A(2, 3), ['electron', 'proton', 'neutron', 'photon'], 'photon', 'It has no rest mass; the others are particles with mass.'),
];

export default questions;
