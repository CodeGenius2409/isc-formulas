// Written by hand: optics, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('physics', 'XII');
const B = at(6, 'b');
const C = at(6, 'c');

const questions: BankDef[] = [
  ar(B(1, 1), 'The objective of an astronomical telescope has a large diameter.', 'A larger objective collects more light and resolves finer detail.', 1, 'Brightness and resolving power both rise with the objective’s aperture.'),
  ar(B(1, 2), 'A compound microscope has an objective of long focal length.', 'Its magnifying power rises as the objective’s focal length falls.', 4, 'A microscope’s objective has a short focal length, which is exactly why its magnification is large.'),
  ar(B(1, 2), 'Large telescopes are usually reflecting telescopes.', 'A concave mirror forms a real image of a distant object at its focus.', 2, 'Both are true, but that is true of a lens as well. Mirrors are chosen for large telescopes because a large mirror can be supported from behind, and has no chromatic aberration.'),
  ar(B(1, 3), 'The final image in an astronomical telescope is erect.', 'The objective forms an inverted image of a distant object.', 4, 'The eyepiece doesn’t turn it upright again, so the final image is inverted.'),
  ar(B(1, 3), 'A telescope’s magnifying power can be raised by using an eyepiece of shorter focal length.', 'In normal adjustment, its magnifying power is f₀/fₑ.', 1, 'A smaller fₑ makes f₀/fₑ larger.'),
  ar(C(1, 1), 'Two separate sodium lamps can’t give a steady interference pattern.', 'They are not coherent sources.', 1, 'Their phase difference changes randomly, so the fringes shift too fast to be seen.'),
  ar(C(1, 2), 'In Young’s experiment, the fringe width rises if the slits are moved closer together.', 'The fringe width is inversely proportional to the slit separation.', 1, 'β = λD/d.'),
  ar(C(1, 2), 'In single-slit diffraction, the central maximum is the same width as the other maxima.', 'The first minimum is at sin θ = λ/a.', 4, 'The central maximum lies between the first minima on both sides, so it is twice as wide as the others.'),
  ar(C(1, 3), 'Huygens’ principle explains the laws of reflection and refraction.', 'Every point on a wavefront acts as a source of secondary wavelets.', 1, 'The new wavefront is the tangent to the wavelets, which gives both laws.'),
];

export default questions;
