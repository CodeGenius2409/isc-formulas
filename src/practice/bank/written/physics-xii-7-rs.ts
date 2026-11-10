// Written by hand: dual nature, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('physics', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why is there a threshold frequency in the photoelectric effect?', 'One photon gives its energy to one electron, and below this frequency it has less than the work function.'),
  reason(A(2, 2), 'Brighter light of the same colour gives more photoelectrons, but not faster ones. Why?', 'More intensity means more photons, so more electrons leave.', 'Each photon’s energy, hν, is unchanged, so the top speed stays the same.'),
  reason(A(2, 2), 'The wave picture of light cannot explain why emission from a metal is immediate. Why not?', 'On the wave picture, energy spreads over the surface, so an electron would need time to gather enough.', 'On the photon picture, one photon gives it all at once.'),
  reason(A(2, 3), 'Why is the de Broglie wavelength of a cricket ball never noticed?', 'λ = h/mv, and its mass is huge compared with an electron’s.', 'So its wavelength is far too small for any effect to be seen.'),
  reason(A(1, 2), 'Why do alkali metals work well in photocells for visible light?', 'Their work functions are small, so visible photons can free electrons from them.'),
  short(A(2, 1), 'Define work function and stopping potential.', 'Work function: the least energy needed to free an electron from a metal surface.', 'Stopping potential: the reverse voltage that just stops the fastest photoelectrons.'),
  short(A(2, 1), 'Write Einstein’s photoelectric equation, and say what each term stands for.', 'hν = φ + K(max).', 'hν is the photon’s energy, φ the work function, and K(max) the top kinetic energy of the electrons.'),
  short(A(2, 2), 'What is a photon? State two of its properties.', 'A packet of light energy, E = hν.', 'It has no rest mass, and moves at c, with momentum h/λ.'),
  short(A(3, 2), 'Sketch in words a graph of stopping potential against frequency. What do its slope and intercept tell you?', 'A straight line starting at the threshold frequency.', 'Its slope is h/e.', 'Its intercept on the frequency axis is the threshold frequency.'),
  short(A(3, 3), 'State the de Broglie relation, and find how an electron’s wavelength changes if the voltage accelerating it is multiplied by four.', 'λ = h/p.', 'λ = h/√(2meV), so λ goes as 1/√V.', 'Four times the voltage halves the wavelength.'),
];

export default questions;
