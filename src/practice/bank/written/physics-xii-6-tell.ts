// Written by hand: optics, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('physics', 'XII');
const A = at(6, 'a');
const B = at(6, 'b');
const C = at(6, 'c');

const questions: BankDef[] = [
  tell(A(2, 3), 'Distinguish between total internal reflection and reflection at a plane mirror.', 'Total internal reflection happens only for light going from a denser to a rarer medium, beyond the critical angle, and reflects all of it.', 'A mirror reflects light at any angle, but some light is always lost.'),
  tell(B(2, 1), 'Distinguish between a compound microscope and an astronomical telescope by the focal lengths of their lenses.', 'A microscope has an objective of short focal length and a short eyepiece.', 'A telescope has an objective of long focal length and an eyepiece of short focal length.'),
  tell(B(2, 2), 'Distinguish between a refracting and a reflecting telescope.', 'A refracting telescope uses a lens as its objective.', 'A reflecting telescope uses a concave mirror, which has no chromatic aberration and is easier to make large.'),
  tell(B(2, 2), 'Distinguish between magnifying power and resolving power of a telescope.', 'Magnifying power tells how much larger the image appears: f₀/fₑ.', 'Resolving power tells how well it shows two close objects as separate, which rises with the objective’s diameter.'),
  tell(B(3, 3), 'Distinguish between a telescope used in normal adjustment and one set for the near point.', 'In normal adjustment, the final image is at infinity, and the tube length is f₀ + fₑ.', 'Set for the near point, the final image is at 25 cm, and the eyepiece is a little closer to the first image.', 'The magnifying power is f₀/fₑ in the first, and slightly more, (f₀/fₑ)(1 + fₑ/D), in the second.'),
  tell(B(2, 3), 'Distinguish between the objective and the eyepiece of a compound microscope by what each does.', 'The objective forms a real, enlarged, inverted image of the object.', 'The eyepiece acts as a magnifier, forming a virtual, still larger image of that.'),
  tell(C(2, 1), 'Distinguish between coherent and incoherent sources.', 'Coherent sources keep a constant phase difference, so they give steady fringes.', 'Incoherent sources have a phase difference that changes randomly, so their pattern averages out.'),
  tell(C(2, 2), 'Distinguish between path difference and phase difference.', 'Path difference is the difference in the distances two waves travel, in metres.', 'Phase difference is the difference in their phase angles: φ = (2π/λ) × path difference.'),
  tell(C(2, 2), 'Distinguish between a wavefront and a ray.', 'A wavefront is a surface of points vibrating in the same phase.', 'A ray is a line at right angles to the wavefronts, showing the direction of travel.'),
  tell(C(2, 3), 'Distinguish between constructive and destructive interference.', 'Constructive: the waves meet in phase, with a path difference of nλ, and give a bright fringe.', 'Destructive: they meet out of phase, with a path difference of (n + ½)λ, and give a dark fringe.'),
];

export default questions;
