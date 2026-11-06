// Physics, Class XII: the ray optics experiments in Paper II, written fresh from the syllabus. Not from any paper.
import type { Facts } from '../../dsl';

const knowledge: Record<string, Facts> = {
  '6p': {
    define: [
      ['parallax', 'The apparent shift of one object against another when the eye moves sideways.'],
      ['removing parallax', 'Moving a needle until it and an image stay together, however the eye moves sideways.'],
      ['the u–v method', 'Finding the focal length of a lens or mirror by measuring several object and image distances.'],
    ],
    recall: [
      ['Two objects show no parallax when they are:', 'at the same position', 'of the same size', 'of the same colour', 'at very different distances'],
      ['If an image shifts in the same direction as the eye moves, compared with a needle, the image is:', 'farther away than the needle', 'closer than the needle', 'at the needle', 'not real'],
      ['A graph of 1/v against 1/u for a convex lens, in the usual form, cuts each axis at:', '1/f', 'f', '2f', 'f/2'],
      ['For a convex lens, a graph of uv against (u + v), using sizes alone, has a slope of:', 'f', '1/f', 'u', 'v'],
      ['For a real image, the smallest distance between object and image with a convex lens is:', '4f', '2f', 'f', '3f'],
      ['A focal length of a convex lens can be found roughly by:', 'focusing a distant object on a screen', 'measuring its thickness', 'weighing it', 'measuring its colour'],
    ],
    truths: [
      ['A distance is measured between the optical centre and the needle’s tip, with a correction if needed.', 'A distance is measured between the optical centre and the base of the stand, in every case.'],
      ['At no parallax, the tip of the needle coincides with the tip of the image.', 'At no parallax, the needle is at twice the distance of the image.'],
      ['Index error is the difference between the true and measured distance for a known rod.', 'Index error is the difference between the two focal lengths of a lens.'],
    ],
    reason: [
      ['A needle’s image must have no parallax with a second needle before it is measured.', 'Only then is the second needle at the position of the image.'],
      ['A lens’s readings are taken with a small aperture.', 'Rays near the axis give a sharper image, which agrees with the lens formula.'],
    ],
    explain: [
      ['How is parallax removed in a concave mirror experiment?', 'Move the image needle until, as the eye moves sideways, its tip stays on the tip of the inverted image.'],
      ['Give two sources of error in a u–v experiment.', 'Parallax not fully removed.', 'An index error between the rod’s length and the measured distance.'],
      ['What is the best way to find the focal length of a concave mirror from u–v data?', 'Plot 1/v against 1/u, and read the intercept on either axis.'],
    ],
  },
};

export default knowledge;
