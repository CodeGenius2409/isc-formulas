// Written by hand: optics, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('physics', 'XII');
const A = at(6, 'a');
const B = at(6, 'b');
const C = at(6, 'c');

const questions: BankDef[] = [
  short(A(2, 1), 'State the laws of refraction.', 'The incident ray, the refracted ray and the normal lie in one plane.', 'sin i / sin r is constant for a given pair of media.'),
  reason(B(1, 1), 'Why does a telescope have an objective of large aperture?', 'It gathers more light, so that faint stars can be seen.'),
  reason(B(2, 2), 'Why do big astronomical telescopes use mirrors instead of lenses?', 'A mirror has no chromatic aberration.', 'A mirror can be supported from behind, while a large lens would be heavy and hard to make.'),
  reason(B(2, 2), 'In a compound microscope, both lenses have short focal lengths. Why?', 'Magnification is greater when both focal lengths are small.', 'The objective’s image then stays close, so the tube needn’t be long.'),
  reason(B(1, 2), 'For a telescope’s eyepiece, a short focal length is chosen, and for the objective a long one. Why?', 'Its magnifying power is f(o)/f(e), so this gives a large value.'),
  reason(B(2, 3), 'Why is a telescope’s final image usually arranged to be at infinity?', 'The eye is then relaxed, and doesn’t have to focus closely.', 'This is called normal adjustment.'),
  short(B(2, 1), 'Define the magnifying power of a telescope, and write it for normal adjustment.', 'The ratio of the angle the final image makes at the eye to the angle the object makes.', 'M = f(o)/f(e).'),
  short(B(2, 2), 'State two differences between a reflecting and a refracting telescope.', 'A reflector uses a concave mirror as its objective, and a refractor uses a lens.', 'A reflector has no chromatic aberration, and is easier to make large.'),
  short(B(3, 2), 'Write the magnifying power of a compound microscope with the final image at the near point. What does each symbol stand for?', 'm = (v₀/u₀)(1 + D/f(e)).', 'v₀ and u₀ are the image and object distances for the objective.', 'D is the near point distance and f(e) the focal length of the eyepiece.'),
  short(B(3, 3), 'A compound microscope’s objective forms a real image, and its eyepiece a virtual one. Say what each lens does, and where the object must be placed for the objective.', 'The objective makes a real, enlarged image of a close object.', 'The eyepiece acts as a magnifying glass on that image.', 'The object sits just beyond the focus of the objective.'),
  reason(C(1, 1), 'Why are the fringes in a Young’s experiment blurred if the two slits are lit by separate lamps?', 'Separate lamps aren’t coherent, so their phase difference keeps changing and no steady pattern forms.'),
  reason(C(2, 2), 'Why does light not bend round a door as sound does?', 'Diffraction is marked only when the gap is comparable with the wavelength.', 'Light’s wavelength is far smaller than a door, and sound’s isn’t.'),
  reason(C(2, 2), 'In Young’s experiment, why do the fringes disappear if one slit is made much wider than the other?', 'The two beams then have very different amplitudes.', 'So the dark fringes are no longer dark, and the contrast is lost.'),
  reason(C(2, 3), 'In Young’s experiment, what happens to the fringes if the whole apparatus is put under water, and why?', 'The fringes come closer together.', 'The wavelength in water is smaller, and fringe width is λD/d.'),
  reason(C(1, 2), 'Why does a central bright band have twice the width of the others in a single-slit pattern?', 'The first minima lie at sin θ = ±λ/a, so the central band spans twice the width of the others.'),
  short(C(2, 1), 'State Huygens’ principle.', 'Every point on a wavefront acts as a source of secondary wavelets.', 'The new wavefront is the surface that touches them all, a moment later.'),
  short(C(2, 2), 'What is meant by coherent sources? How does Young’s experiment get them from one lamp?', 'Sources with a constant phase difference, and the same frequency.', 'Both slits are lit by the same wavefront from one source, so they keep in step.'),
  short(C(3, 2), 'State two conditions for steady interference, and write the conditions for a bright and a dark fringe.', 'Coherent sources with nearly equal amplitudes.', 'Bright: path difference nλ.', 'Dark: path difference (n + ½)λ.'),
  short(C(3, 3), 'State three differences between interference and diffraction patterns.', 'Interference comes from two coherent sources, and diffraction from one wavefront’s parts.', 'Interference fringes are equally wide, and diffraction’s aren’t.', 'Interference’s bright fringes have similar brightness, while diffraction’s fall off quickly.'),
  short(C(2, 2), 'In Young’s experiment the fringe width is 0.4 mm. What does it become if the slits are moved to half their distance apart, and the screen to twice its distance?', 'β = λD/d.', 'Each change doubles it, so it becomes four times as wide: 1.6 mm.'),
];

export default questions;
