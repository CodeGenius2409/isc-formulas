// Written by hand: optics, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, plot, sketch } from '../figures';

const { figure } = kit('physics', 'XII');
const A = at(6, 'a');
const B = at(6, 'b');
const C = at(6, 'c');

const questions: BankDef[] = [
  figure(A(2, 2), 'Draw a graph of the angle of deviation δ against the angle of incidence i for a prism. Mark the angle of least deviation.', ['δ first falls as i rises, reaches a least value δm, then rises again.', 'δm is marked at the bottom of the curve, where the ray passes through the prism symmetrically.'], {
    answer: graph('angle of incidence i', 'angle of deviation δ', [{ points: plot((i) => 38 + 0.02 * (i - 50) ** 2, 30, 80, 24) }], { y: [[38, 'δm']] }),
  }),
  figure(B(3, 2), 'Draw a ray diagram of a compound microscope forming its final image at the near point. Label the objective, the eyepiece and both images.', ['A small object just beyond the objective’s focus gives a real, inverted, enlarged image.', 'That image falls just inside the eyepiece’s focus, which acts as a magnifier.', 'The final image is virtual, inverted and much enlarged, at the near point.'], {
    // Worked to scale: objective at x = 90 with f = 25, object 35 before it, so the real image is 87.5 beyond it, 2.5 times as
    // tall. Eyepiece at x = 200 with f = 30, the image 22.5 before it, so the virtual image is 90 before it, 4 times taller again.
    answer: sketch(320, 205, 'A compound microscope. A small upright object stands just beyond the focus of a short-focus objective. Two rays from its tip meet beyond the objective in an inverted, enlarged real image, which lies just inside the focus of the eyepiece. The rays leaving the eyepiece, traced back as dashed lines, meet in a much larger inverted virtual image on the left.', [
      line([[5, 100], [315, 100]], { dash: 1 }),
      arrow([55, 100], [55, 92]), label(48, 86, 'object', 'end'),
      line([[90, 60], [90, 140]]), label(90, 52, 'objective'),
      line([[55, 92], [90, 92], [177.5, 120]]), line([[55, 92], [177.5, 120]]),
      arrow([177.5, 100], [177.5, 120]), label(206, 130, '← real image', 'start'),
      line([[200, 55], [200, 145]]), label(200, 47, 'eyepiece'),
      line([[177.5, 120], [200, 120], [260, 80]]), line([[177.5, 120], [240, 64.4]]),
      line([[200, 120], [110, 180]], { dash: 1 }), line([[177.5, 120], [110, 180]], { dash: 1 }),
      line([[110, 100], [110, 180]], { dash: 1, arrow: 1 }), label(110, 198, 'final image'),
    ]),
  }),
  figure(B(2, 1), 'The figure shows a refracting astronomical telescope in normal adjustment. Name the lenses P and Q, and give the distance between them.', ['P is the objective, of long focal length f₀, and Q is the eyepiece, of short focal length fₑ.', 'In normal adjustment their foci meet, so the distance is f₀ + fₑ.'], {
    shown: sketch(320, 140, 'Two convex lenses on one axis. The left one, P, is large; the right one, Q, is small. Parallel rays from a distant object enter P, cross at a point between the lenses, and leave Q parallel again.', [
      // P at x = 70 with f = 160 and Q at x = 260 with f = 30 share a focal plane at x = 230. Rays sloping at 0.1 meet there at
      // y = 86, and leave Q parallel to the line from that point through Q's centre.
      line([[10, 70], [310, 70]], { dash: 1 }), line([[70, 15], [70, 125]]), label(70, 10, 'P'), line([[260, 40], [260, 100]]), label(260, 34, 'Q'),
      line([[10, 64], [70, 70], [230, 86], [260, 89], [310, 62.3]]), line([[10, 44], [70, 50], [230, 86], [260, 92.75], [310, 66.1]]),
    ]),
  }),
  figure(B(2, 2), 'Draw a labelled diagram of a reflecting telescope with a concave primary mirror. Say why it is preferred for large telescopes.', ['Light from a star reflects off a large concave mirror towards its focus, where a small plane mirror sends it sideways to an eyepiece.', 'A mirror has no chromatic aberration, and a large one is easier to support than a lens of the same size.'], {
    answer: sketch(320, 170, 'A reflecting telescope. Parallel rays enter from the left and reach a large concave mirror on the right. They reflect towards its focus, but a small plane mirror at 45° in their path sends them down to an eyepiece below the tube.', [
      { t: 'path', d: 'M280 20 C 300 60, 300 110, 280 150' }, label(300, 14, 'concave mirror', 'end'),
      line([[20, 50], [282, 50], [150, 85]]), line([[20, 120], [282, 120], [150, 85]]),
      line([[140, 75], [160, 95]]), label(150, 70, 'plane mirror'),
      line([[150, 85], [150, 150]], { arrow: 1 }), { t: 'box', x: 138, y: 150, w: 24, h: 12 }, label(170, 160, 'eyepiece', 'start'),
    ]),
  }),
  figure(B(3, 3), 'The figure shows how the angular magnification of a telescope changes as its eyepiece is changed, with the objective kept the same. Read off the magnification for fₑ = 2 cm, and find the objective’s focal length.', ['At fₑ = 2 cm, m = 50.', 'm = f₀/fₑ, so f₀ = 50 × 2 = 100 cm.', 'The graph is a hyperbola because m is inversely proportional to fₑ.'], {
    shown: graph('focal length of eyepiece fₑ (cm)', 'magnification m', [{ points: plot((f) => 100 / f, 1, 10, 30) }], { x: [[2, '2'], [5, '5'], [10, '10']], y: [[50, '50'], [20, '20']] }),
  }),
  figure(C(2, 1), 'Draw a plane wavefront meeting a plane surface, and use Huygens’ secondary wavelets to show the reflected wavefront.', ['The wavefront meets the surface first at one end, where a wavelet starts spreading back.', 'By the time the other end arrives, the tangent to the wavelets is the reflected wavefront, at the same angle to the surface.'], {
    // Incidence at 30°: A (70, 140), B 120 along the wavefront, C where B's ray meets the mirror, and D on the wavelet round A of
    // radius BC, so that AD is at right angles to CD.
    answer: sketch(320, 170, 'A plane wavefront AB meets a horizontal mirror at A. While the end B travels to C, a wavelet of radius BC grows from A. The reflected wavefront CD is the tangent from C to that wavelet, and makes the same angle with the mirror as AB does.', [
      line([[0, 140], [320, 140]]), label(314, 158, 'mirror', 'end'),
      line([[70, 140], [174, 80]]), label(70, 158, 'A'), label(180, 76, 'B', 'start'),
      line([[174, 80], [208, 140]], { dash: 1 }), label(212, 158, 'C'),
      { t: 'path', d: 'M1 140 A 69 69 0 0 1 139 140', dash: 1 },
      line([[208, 140], [105, 80]]), label(98, 76, 'D', 'end'),
    ]),
  }),
  figure(C(2, 2), 'Draw the intensity pattern on the screen in Young’s double-slit experiment, and mark one fringe width.', ['Bright and dark fringes of equal width, with equal brightness.', 'The fringe width β is the distance between two neighbouring bright fringes.'], {
    answer: graph('position on the screen', 'intensity', [{ points: plot((y) => Math.cos(y) ** 2, -9.4, 9.4, 80) }], { x: [[0, '0'], [3.14, 'β']] }),
  }),
  figure(C(2, 2), 'Draw the intensity pattern from a single slit lit by monochromatic light, and mark the width of the central maximum.', ['A wide, bright central maximum, with weaker maxima on each side, getting dimmer.', 'The central maximum is twice as wide as the others: 2λD/a, between the first minima.'], {
    answer: graph('position on the screen', 'intensity', [{ points: plot((x) => (Math.abs(x) < 1e-6 ? 1 : (Math.sin(x) / x) ** 2), -12, 12, 120) }], { x: [[-3.14, '−λD/a'], [3.14, 'λD/a']] }),
  }),
  figure(C(3, 3), 'The figure shows Young’s experiment with slits S₁ and S₂ and a screen. A point P on the screen has a path difference of 1.5λ. Is P bright or dark? What happens to the fringes if the slit separation is halved?', ['A path difference of 1.5λ is (n + ½)λ with n = 1.', 'So P is dark: the second dark fringe from the centre.', 'β = λD/d, so halving d doubles the fringe width.'], {
    shown: sketch(320, 160, 'Two slits S₁ and S₂, one above the other, on a barrier at the left. A screen stands at the right. Lines from both slits meet at a point P on the screen, above the centre O.', [
      line([[60, 10], [60, 66]]), line([[60, 74], [60, 86]]), line([[60, 94], [60, 150]]), label(50, 72, 'S₁', 'end'), label(50, 96, 'S₂', 'end'),
      line([[280, 10], [280, 150]]), label(290, 84, 'O', 'start'), { t: 'dot', x: 280, y: 40 }, label(290, 44, 'P', 'start'),
      line([[60, 70], [280, 40]]), line([[60, 90], [280, 40]]), line([[60, 80], [280, 80]], { dash: 1 }),
    ]),
  }),
  figure(C(2, 3), 'Draw how a plane wavefront is refracted on passing from air into glass, using Huygens’ principle. Say why the wavefront turns.', ['One end enters the glass first, and its wavelets travel more slowly there.', 'So the refracted wavefront, the tangent to them, is turned towards the normal, with sin i / sin r = v₁/v₂.'], {
    answer: sketch(320, 170, 'A plane wavefront AB meets the boundary between air above and glass below at A. While B travels a distance v₁t in air to C, a wavelet of smaller radius v₂t grows from A into the glass. The refracted wavefront is the tangent from C to that wavelet.', [
      line([[10, 90], [310, 90]]), label(20, 80, 'air', 'start'), label(20, 110, 'glass', 'start'),
      line([[70, 90], [140, 20]]), label(64, 104, 'A'), label(146, 18, 'B', 'start'),
      line([[140, 20], [210, 90]], { dash: 1 }), label(214, 104, 'C'),
      { t: 'path', d: 'M20 90 A 50 50 0 0 0 120 90', dash: 1 },
      line([[210, 90], [90, 136]]),
    ]),
  }),
];

export default questions;
