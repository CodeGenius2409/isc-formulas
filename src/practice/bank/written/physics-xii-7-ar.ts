// Written by hand: dual nature of radiation and matter, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('physics', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  ar(A(1, 1), 'Photoelectrons are emitted the instant light falls on the metal, however dim it is.', 'Each electron takes the whole energy of one photon at once.', 1, 'No time is needed for energy to build up, as it would in the wave picture.'),
  ar(A(1, 2), 'The stopping potential rises when the light is made brighter.', 'Brighter light has more photons each second.', 4, 'Brighter light gives more photoelectrons, but not faster ones, so the stopping potential stays the same.'),
  ar(A(1, 2), 'An electron and a proton with the same kinetic energy have different de Broglie wavelengths.', 'λ = h/√(2mK) depends on the mass.', 1, 'The lighter electron has the longer wavelength.'),
  ar(A(1, 3), 'The work function of a metal depends on the frequency of the light falling on it.', 'Light below the threshold frequency frees no electrons.', 4, 'The work function belongs to the metal alone; the threshold frequency is φ/h.'),
];

export default questions;
