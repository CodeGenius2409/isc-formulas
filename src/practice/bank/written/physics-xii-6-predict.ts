// Written by hand: optics, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('physics', 'XII');
const A = at(6, 'a');
const B = at(6, 'b');
const C = at(6, 'c');

const questions: BankDef[] = [
  predict(A(2, 1), 'The lower half of a convex lens is covered with black paper. Predict what happens to the image of an object.', 'The whole image still forms, as every part of the lens still brings light from each point to the image.', 'It is only dimmer, as half the light is blocked.'),
  predict(A(2, 2), 'A convex lens of glass (μ = 1.5) is put in water (μ = 1.33). Predict what happens to its focal length.', 'By the lens maker’s formula, 1/f depends on μ_lens/μ_medium − 1, which falls from 0.5 to about 0.13.', 'So the focal length grows, to about four times its value in air.'),
  predict(A(2, 2), 'An object is moved from far away towards a concave mirror, up to its focus. Predict how the image moves and changes size.', 'The image moves from the focus out towards infinity.', 'It grows from a point to very large, staying real and inverted.'),
  predict(A(3, 3), 'Light travels from glass into air, and the angle of incidence is raised slowly. Predict what happens to the refracted ray and the reflected ray.', 'The refracted ray bends further from the normal, and grows fainter.', 'At the critical angle it grazes the surface.', 'Beyond it there is no refracted ray: all the light is reflected.'),
  predict(A(2, 3), 'White light passes through a glass prism. Predict which colour is deviated most, and give the reason.', 'Violet is deviated most.', 'Glass has a larger refractive index for violet than for red, so it bends violet more.'),
  predict(B(2, 1), 'The objective of an astronomical telescope is replaced by one of larger diameter but the same focal length. Predict the effect on the image.', 'The magnifying power doesn’t change, as it is f₀/fₑ.', 'The image is brighter, as more light is collected, and finer detail can be resolved.'),
  predict(B(2, 2), 'The eyepiece of a compound microscope is replaced by one of shorter focal length. Predict what happens to the magnifying power.', 'It rises.', 'The eyepiece’s own magnification, about 1 + D/fₑ, is larger for a smaller fₑ.'),
  predict(B(2, 2), 'In an astronomical telescope in normal adjustment, the eyepiece is moved slightly closer to the objective. Predict where the final image now forms.', 'The first image now lies inside the eyepiece’s focus.', 'So the final image is no longer at infinity, but at a finite distance, and the telescope can be set to form it at the near point.'),
  predict(B(3, 3), 'A compound microscope and an astronomical telescope are both used in normal adjustment. Predict which of them has the larger separation between its lenses, and why.', 'The telescope, as its objective has a long focal length.', 'Its separation is f₀ + fₑ.', 'A microscope uses short focal lengths for both lenses, so they are close together.'),
  predict(C(2, 1), 'In Young’s experiment, one slit is covered with a thin, transparent glass sheet. Predict what happens to the fringes.', 'The whole pattern shifts towards the covered slit, as light through the glass takes longer.', 'The fringe width stays the same.'),
  predict(C(2, 2), 'In Young’s experiment, red light is replaced by blue light. Predict what happens to the fringe width.', 'It becomes smaller.', 'β = λD/d, and blue light has a shorter wavelength.'),
  predict(C(2, 2), 'In a single-slit experiment, the slit is made narrower. Predict what happens to the central maximum.', 'It becomes wider, as its width is 2λD/a.', 'It also becomes dimmer, as less light gets through.'),
  predict(C(3, 3), 'In Young’s experiment, the two slits are lit by two separate lamps of the same colour instead of one. Predict what is seen on the screen, and why.', 'No steady fringes, just even light.', 'Separate lamps aren’t coherent: their phase difference changes randomly many times a second.', 'So the bright and dark fringes shift too fast to be seen, and average out.'),
  predict(C(2, 3), 'Young’s experiment is done with the whole apparatus under water. Predict what happens to the fringe width.', 'It falls by the factor μ = 1.33.', 'Light’s wavelength in water is λ/μ, and β = λD/d.'),
  predict(B(2, 3), 'The mirror of a large reflecting telescope is replaced by a lens of the same size and focal length. Predict two problems that appear.', 'Chromatic aberration: different colours come to focus at different points.', 'A large lens is heavy and can be held only at its rim, so it sags and distorts the image.'),
];

export default questions;
