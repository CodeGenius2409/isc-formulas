// Written by hand: ray optics practical work, of each type the subtopic lacked, up to three. Places are at(unit, topic)(marks, difficulty).
// The prism graph is worked out for A = 60° and n = 1.509, which gives a minimum deviation of 38° at i = 49°.
import { at, kit, type BankDef } from '../define';
import { graph, label, line, plot, sketch } from '../figures';

const { figure, predict, odd, long, match } = kit('physics', 'XII');
const O = at(6, 'p');

const rad = Math.PI / 180;
/** Deviation of a ray through a 60° prism of index 1.509, for an angle of incidence i in degrees. */
const deviation = (i: number) => {
  const r1 = Math.asin(Math.sin(i * rad) / 1.509) / rad;
  const e = Math.asin(1.509 * Math.sin((60 - r1) * rad)) / rad;
  return i + e - 60;
};

const questions: BankDef[] = [
  figure(O(3, 1), 'Draw the set-up on an optical bench for finding the focal length of a convex lens by the u–v method, marking u and v.', ['An object needle O on its upright at one end, with the lens L in a holder, its centre at the height of the needle tip.', 'An image needle I on the far side, moved until there is no parallax between it and the inverted real image of O.', 'u is the distance from O to L and v from L to I, read from the bench scale with the index correction.'], {
    answer: sketch(340, 164,'An optical bench drawn as a long horizontal bar. On the left, an upright needle O. In the middle, a lens L in a holder. On the right, an upright needle I. The distance from O to L is marked u, and from L to I is marked v.', [
      line([[20, 110], [320, 110]]), line([[20, 118], [320, 118]]),
      line([[60, 110], [60, 50]]), label(60, 40, 'O'), { t: 'path', d: 'M150 40 Q 162 75, 150 110 Q 138 75, 150 40' }, label(150, 30, 'L'),
      line([[270, 110], [270, 60]]), label(270, 50, 'I'),
      line([[60, 136], [150, 136]]), line([[60, 130], [60, 142]]), line([[150, 130], [150, 142]]), label(105, 156, 'u'),
      line([[150, 136], [270, 136]]), line([[270, 130], [270, 142]]), label(210, 156, 'v'),
    ]),
  }),
  figure(O(3, 2), 'The graph is of 1/v against 1/u, both taken as positive, for real images formed by a convex lens. Find its focal length from the graph.', ['For a convex lens with real images, 1/v + 1/u = 1/f in these magnitudes, a straight line with equal intercepts.', 'Both intercepts are at 5 × 10⁻² cm⁻¹ = 0.05 cm⁻¹.', 'So 1/f = 0.05 cm⁻¹, and f = 20 cm.'], {
    shown: graph('1/u (10⁻² cm⁻¹)', '1/v (10⁻² cm⁻¹)', [{ points: [[0, 5], [5, 0]] }], { x: [[2.5, '2.5'], [5, '5']], y: [[2.5, '2.5'], [5, '5']] }),
  }),
  figure(O(3, 2), 'The graph shows the angle of deviation against the angle of incidence for a prism of angle 60°. Read off the angle of minimum deviation, and find the refractive index of the glass.', ['The lowest point of the curve gives δm = 38°, at i = 49°.', 'μ = sin((A + δm)/2)/sin(A/2) = sin 49°/sin 30°.', '= 0.755/0.5 = 1.51.'], {
    shown: graph('angle of incidence i (°)', 'deviation δ (°)', [{ points: plot(deviation, 32, 80, 40) }], { x: [[40, '40'], [49, '49'], [60, '60'], [70, '70']], y: [[38, '38'], [45, '45'], [50, '50']], xFrom: 30, yFrom: 35 }),
  }),

  predict(O(2, 2), 'While removing parallax, a student moves the eye to the right, and the tip of the image seems to move to the right of the image needle. Predict which is nearer the eye, and which way the needle should be moved.', 'Whichever seems to move with the eye is further away, so the image is further from the eye than the needle.', 'The needle should be moved away from the eye, towards the image.'),

  odd(O(2, 1), ['the u–v method', 'the displacement method', 'the u = v method', 'the minimum deviation method'], 'the minimum deviation method', 'It is used with a prism, to find its refractive index; the others find the focal length of a lens.'),
  odd(O(2, 2), ['index correction', 'parallax between needle and image', 'the zero error of a screw gauge', 'judging the sharpest image on a screen'], 'the zero error of a screw gauge', 'It isn’t an error of an optical-bench experiment; the others are.'),
  odd(O(2, 1), ['an optical bench', 'pins or needles', 'a travelling microscope', 'a spherometer'], 'a spherometer', 'It measures the curvature of a surface mechanically; the others are used to locate rays or images in ray-optics experiments.'),

  long(O(5, 2), 'In the displacement method for a convex lens, the object and screen are kept 90 cm apart.\n(a) Describe the method. [2]\n(b) Why must the distance be more than 4f? [1]\n(c) The two lens positions that give sharp images are 30 cm apart. Find f. [1]\n(d) Give one advantage of the method. [1]', '(a) With object and screen fixed a distance D apart, the lens is moved between them to find the two positions where a sharp image forms on the screen.', '(a) The distance d between these two positions is measured, and f = (D² − d²)/4D.', '(b) Only then are there two such positions; for D < 4f no real image forms on the screen at all.', '(c) f = (90² − 30²)/(4 × 90) = 7200/360 = 20 cm.', '(d) Distances are measured between positions of the lens, so the position of its optical centre needn’t be known.'),
  long(O(5, 2), 'Answer each part on finding the refractive index of a prism with pins.\n(a) Describe how the angle of deviation is found for one angle of incidence. [2]\n(b) What graph is drawn, and what is its shape? [1]\n(c) For a prism of angle 60°, the minimum deviation is 37°. Find its refractive index. [2]', '(a) Pins P and Q are stuck along an incident ray, and pins R and S are placed in line with the images of P and Q seen through the prism.', '(a) The lines PQ and RS are carried on to meet; the angle between them is the angle of deviation.', '(b) Deviation against angle of incidence, a U-shaped curve with a single lowest point at minimum deviation.', '(c) μ = sin((60 + 37)/2)/sin 30° = sin 48.5°/0.5.', '(c) = 0.749/0.5 = 1.50.'),

  match(O(4, 2), [['A concave mirror, by the u–v method', '1/f = 1/v + 1/u'], ['A convex lens, by the displacement method', 'f = (D² − d²)/4D'], ['A prism, at minimum deviation', 'μ = sin((A + δm)/2)/sin(A/2)'], ['A glass slab, with a travelling microscope', 'μ = real depth/apparent depth']]),
  match(O(4, 2), [['No parallax', 'needle and image tips move together as the eye moves'], ['The image further from the eye than the needle', 'the image tip moves with the eye'], ['Index correction', 'the true distance minus the distance read on the bench'], ['The image needle', 'placed where the real image forms']]),
];

export default questions;
