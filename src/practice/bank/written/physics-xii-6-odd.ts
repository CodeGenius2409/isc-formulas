// Written by hand: optics, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('physics', 'XII');
const A = at(6, 'a');
const B = at(6, 'b');
const C = at(6, 'c');

const questions: BankDef[] = [
  odd(A(2, 1), ['optical fibre', 'mirage', 'sparkle of a diamond', 'rainbow’s colours'], 'rainbow’s colours', 'They come from dispersion; the others come from total internal reflection.'),
  odd(A(2, 2), ['concave mirror', 'convex lens', 'convex mirror', 'converging lens of glass in air'], 'convex mirror', 'It always diverges light; the others converge it.'),
  odd(A(2, 2), ['dioptre', 'm⁻¹', 'power of a lens', 'metre'], 'metre', 'It is the unit of focal length; the others belong to power.'),
  odd(A(2, 3), ['real depth', 'apparent depth', 'refractive index', 'focal length'], 'refractive index', 'It has no unit; the others are lengths.'),
  odd(A(2, 3), ['red', 'orange', 'yellow', 'violet'], 'violet', 'A prism bends it the most; the others are bent less, red least of all.'),
  odd(B(2, 1), ['objective', 'eyepiece', 'tube', 'prism'], 'prism', 'It isn’t a part of a simple astronomical telescope; the others are.'),
  odd(B(2, 2), ['compound microscope', 'astronomical telescope', 'simple microscope', 'reflecting telescope'], 'simple microscope', 'It has a single lens; the others have two parts, an objective and an eyepiece.'),
  odd(B(2, 2), ['magnifying power', 'resolving detail', 'brightness of the image', 'tube length'], 'tube length', 'It is a size of the instrument; the others are how well it performs.'),
  odd(B(2, 3), ['f₀/fₑ', 'f₀ + fₑ', '(L/f₀)(D/fₑ)', '1 + D/f'], 'f₀ + fₑ', 'It is a length, the telescope’s tube; the others are magnifying powers.'),
  odd(B(2, 3), ['microscope’s objective', 'microscope’s eyepiece', 'telescope’s eyepiece', 'telescope’s objective'], 'telescope’s objective', 'It has a long focal length; the others have short ones.'),
  odd(C(2, 1), ['interference', 'diffraction', 'Huygens’ wavelets', 'photoelectric effect'], 'photoelectric effect', 'It shows light behaving as particles; the others are wave ideas.'),
  odd(C(2, 2), ['λD/d', '2λD/a', 'nλ', 'v/λ'], 'v/λ', 'It is a frequency; the others are a fringe width, a maximum’s width and a path difference.'),
  odd(C(2, 2), ['two slits lit by one lamp', 'two lamps of the same colour', 'a slit and its mirror image', 'two slits lit by a laser'], 'two lamps of the same colour', 'They aren’t coherent; the others give coherent sources.'),
  odd(C(2, 3), ['plane wavefront', 'spherical wavefront', 'cylindrical wavefront', 'light ray'], 'light ray', 'It shows a direction of travel; the others are surfaces of constant phase.'),
  odd(C(2, 3), ['fringe width in Young’s experiment', 'width of the central maximum', 'separation of the slits', 'wavelength in water'], 'separation of the slits', 'It is set by the apparatus; the others depend on the light’s wavelength.'),
];

export default questions;
