// Written by hand: mechanical properties of solids, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const E = at(7, 'a');

const questions: BankDef[] = [
  figure(E(3, 2), 'The graph shows the load on a wire 2 m long, of cross-section 1 mm², against its extension. Find the Young’s modulus of its material, and say what happens beyond an extension of 1 mm.', ['In the straight part, a load of 100 N gives an extension of 1.0 mm.', 'Y = FL/(AΔl) = (100 × 2)/(1 × 10⁻⁶ × 1.0 × 10⁻³) = 2 × 10¹¹ Pa.', 'Beyond 1 mm the graph curves: extension is no longer proportional to load, so Hooke’s law no longer holds.'], {
    shown: graph('extension (mm)', 'load (N)', [{ points: [[0, 0], [1, 100], [1.2, 110], [1.4, 116], [1.6, 120]] }], { x: [[1, '1.0'], [1.6, '1.6']], y: [[100, '100'], [120, '120']] }),
  }),
  figure(E(3, 1), 'Draw a block under each of the three kinds of stress, a stretching stress, a stress from all sides and a shearing stress, and name the modulus of elasticity for each.', ['Stretching: equal forces pull outwards on opposite faces; Young’s modulus.', 'From all sides: forces press inwards on every face, as a pressure; bulk modulus.', 'Shearing: equal and opposite forces act along the top and bottom faces; shear modulus, or modulus of rigidity.'], {
    answer: sketch(360, 160, 'Three square blocks side by side. The first has arrows pulling outwards from its left and right faces, labelled Young’s modulus. The second has arrows pressing inwards on all four faces, labelled bulk modulus. The third has an arrow to the right along its top face and an arrow to the left along its bottom face, labelled shear modulus.', [
      { t: 'box', x: 40, y: 50, w: 50, h: 50 }, arrow([40, 75], [12, 75]), arrow([90, 75], [118, 75]), label(65, 140, 'Young’s'),
      { t: 'box', x: 155, y: 50, w: 50, h: 50 }, arrow([180, 22], [180, 46]), arrow([180, 128], [180, 104]), arrow([128, 75], [151, 75]), arrow([232, 75], [209, 75]), label(180, 140, 'bulk'),
      { t: 'box', x: 270, y: 50, w: 50, h: 50 }, arrow([275, 44], [320, 44]), arrow([315, 106], [270, 106]), label(295, 140, 'shear'),
    ]),
  }),
  figure(E(3, 2), 'The graph shows the stress–strain curves of two materials, A and B, up to the point where each breaks. Which has the larger Young’s modulus? Which is brittle and which ductile?', ['A has the steeper straight part, so the larger Young’s modulus.', 'A breaks almost as soon as its straight part ends, so it is brittle.', 'B stretches a long way plastically before breaking, so it is ductile.'], {
    shown: graph('strain', 'stress (MPa)', [{ label: 'A', points: [[0, 0], [0.002, 400]] }, { label: 'B', points: [[0, 0], [0.004, 200], [0.012, 240], [0.025, 265], [0.04, 280]] }], { x: [[0.02, '0.02'], [0.04, '0.04']], y: [[200, '200'], [400, '400']] }),
  }),

  predict(E(2, 1), 'A wire is loaded beyond its elastic limit, and the load is then taken off. Predict what happens to the wire.', 'It doesn’t go back to its first length.', 'It keeps a permanent extension, as it has been deformed plastically.'),
  predict(E(2, 1), 'The same load hangs from a steel wire and from a copper wire of the same length and thickness. Predict which stretches more, and why.', 'The copper wire stretches more.', 'Copper has a smaller Young’s modulus than steel, and extension = FL/(AY).'),
  predict(E(2, 2), 'A rubber band is stretched. Predict what happens to its thickness, and name the quantity that links the two changes.', 'It becomes thinner as it gets longer.', 'Poisson’s ratio, the lateral strain divided by the longitudinal strain, links them.'),

  odd(E(2, 1), ['Young’s modulus', 'bulk modulus', 'shear modulus', 'Poisson’s ratio'], 'Poisson’s ratio', 'It has no unit, being a ratio of two strains; the others are measured in pascals.'),
  odd(E(2, 1), ['steel', 'copper', 'aluminium', 'glass'], 'glass', 'It is brittle; the others are ductile.'),
  odd(E(2, 1), ['stress', 'pressure', 'Young’s modulus', 'strain'], 'strain', 'It has no unit; the others are measured in N/m².'),

  long(E(5, 2), 'A steel wire 2 m long, of cross-section 2 mm², carries a load of 400 N. Young’s modulus for steel is 2 × 10¹¹ Pa.\n(a) Find the stress. [1]\n(b) Find the strain. [1]\n(c) Find the extension. [2]\n(d) Find the extension if the wire had twice the radius. [1]', '(a) Stress = F/A = 400/(2 × 10⁻⁶) = 2 × 10⁸ Pa.', '(b) Strain = stress/Y = 2 × 10⁸/(2 × 10¹¹) = 1 × 10⁻³.', '(c) Extension = strain × L.', '(c) = 1 × 10⁻³ × 2 = 2 × 10⁻³ m = 2 mm.', '(d) Twice the radius gives four times the area, so a quarter of the extension: 0.5 mm.'),
  long(E(5, 2), 'Answer each part on bulk modulus.\n(a) Define bulk modulus. [1]\n(b) Water has a bulk modulus of 2.2 × 10⁹ Pa. Find the fractional change in its volume when the pressure on it rises by 1.1 × 10⁷ Pa. [2]\n(c) What is compressibility, and why do gases have a small bulk modulus? [2]', '(a) The ratio of the change in pressure to the fractional change in volume it causes: B = −Δp/(ΔV/V).', '(b) ΔV/V = Δp/B = 1.1 × 10⁷/(2.2 × 10⁹).', '(b) = 5 × 10⁻³, a decrease of 0.5%.', '(c) Compressibility is 1/B, how easily a body’s volume is reduced.', '(c) A gas’s molecules are far apart, so a small pressure reduces its volume a lot: its bulk modulus is small.'),
  long(E(5, 3), 'A cube of side 10 cm has its bottom face fixed. A force of 2000 N along its top face moves that face sideways by 0.2 mm.\n(a) Define shearing stress and shearing strain. [2]\n(b) Find the shearing stress. [1]\n(c) Find the shearing strain. [1]\n(d) Find the shear modulus. [1]', '(a) Shearing stress is the force along a face divided by its area.', '(a) Shearing strain is the sideways movement of a face divided by its distance from the fixed face.', '(b) 2000/(0.1 × 0.1) = 2 × 10⁵ Pa.', '(c) 0.2 × 10⁻³/0.1 = 2 × 10⁻³.', '(d) G = stress/strain = 2 × 10⁵/(2 × 10⁻³) = 1 × 10⁸ Pa.'),

  tell(E(2, 2), 'Distinguish between stress and pressure.', 'Stress is the internal restoring force per unit area that a body sets up when it is deformed; it can act along or across a surface.', 'Pressure is the force per unit area pressing at right angles on a surface, from outside.'),
  tell(E(2, 1), 'Distinguish between longitudinal strain and shearing strain.', 'Longitudinal strain is the change in length divided by the first length, from stretching or squashing.', 'Shearing strain is the sideways movement of a face divided by its distance from the fixed face, from a force along a surface.'),
  tell(E(2, 1), 'Distinguish between ductile and brittle materials, with an example of each.', 'A ductile material, such as copper, stretches a long way plastically before it breaks, and can be drawn into wires.', 'A brittle material, such as glass, breaks soon after its elastic limit, with little plastic stretching.'),

  match(E(4, 1), [['Stretching a wire', 'Young’s modulus'], ['Squeezing a body from all sides', 'bulk modulus'], ['Twisting or shearing a block', 'shear modulus'], ['A wire thinning as it stretches', 'Poisson’s ratio']]),
  match(E(4, 1), [['Stress', 'N/m²'], ['Strain', 'no unit'], ['Young’s modulus', 'Pa'], ['The force constant of a wire', 'N/m']]),
  match(E(4, 2), [['The proportional limit', 'where the straight part of the graph ends'], ['The elastic limit', 'the largest stress after which the wire fully recovers'], ['The yield point', 'where the wire starts to flow plastically'], ['The breaking point', 'where the wire snaps']]),

  ar(E(1, 1), 'Within the elastic limit, doubling the load on a wire doubles its extension.', 'Within it, stress is proportional to strain.', 1, 'That is Hooke’s law, so extension is proportional to load.'),
  ar(E(1, 2), 'The Young’s modulus of a wire depends on its length.', 'Young’s modulus is stress divided by strain.', 4, 'Young’s modulus depends only on the material, not on the wire’s size.'),
  ar(E(1, 1), 'Poisson’s ratio has no unit.', 'Rubber can be stretched a long way.', 2, 'Both are true, but it has no unit because it is a ratio of two strains.'),

  derive(E(3, 1), 'A wire of length L and cross-section A, of a material of Young’s modulus Y, carries a load F. Show that its extension is Δl = FL/(AY).', ['Stress = F/A and strain = Δl/L.', 1], ['Y = stress/strain = (F/A)/(Δl/L) = FL/(AΔl).', 1], ['Rearranging, Δl = FL/(AY).', 1]),
  derive(E(3, 2), 'Show that, for wires of the same material carrying the same load, the extension is proportional to L/r², where r is the radius.', ['Δl = FL/(AY), with A = πr².', 1], ['F and Y are the same for both wires, so Δl = (F/πY) × L/r².', 1], ['So Δl is proportional to L/r²: a wire twice as thick stretches a quarter as much.', 1]),
  derive(E(3, 1), 'Show that Young’s modulus has the same dimensions as stress, and find them.', ['Strain is a ratio of two lengths, so it has no dimensions.', 1], ['Y = stress/strain, so Y has the dimensions of stress, force per area.', 1], ['[MLT⁻²]/[L²] = [ML⁻¹T⁻²].', 1]),
];

export default questions;
