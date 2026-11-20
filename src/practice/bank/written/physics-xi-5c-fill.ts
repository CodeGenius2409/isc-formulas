// Written by hand: moment of inertia, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const I = at(5, 'c');

const questions: BankDef[] = [
  figure(I(3, 2), 'Draw a ring in the plane of the paper with a diameter, a tangent parallel to it, and a tangent at right angles to its plane. Use the theorems of axes to find the moment of inertia of the ring about each tangent.', ['About its own axis, at right angles to its plane, I = MR²; by the perpendicular axes theorem each diameter has MR²/2.', 'Tangent in the plane, parallel to a diameter: MR²/2 + MR² = 3MR²/2, by the parallel axes theorem.', 'Tangent at right angles to the plane, parallel to the ring’s axis: MR² + MR² = 2MR².'], {
    answer: sketch(360, 210,'A ring in the plane of the paper, with a horizontal diameter through its centre. A dashed horizontal tangent touches the ring at the bottom, parallel to the diameter. A dot at the right-hand edge of the ring marks a tangent at right angles to the paper.', [
      { t: 'circle', x: 140, y: 96, r: 64 }, line([[60, 96], [220, 96]]), label(226, 100, 'diameter', 'start'),
      line([[50, 160], [230, 160]], { dash: 1 }), label(236, 164, 'tangent, 3MR²/2', 'start'),
      { t: 'dot', x: 204, y: 96 }, label(210, 60, 'tangent at right', 'start'), label(210, 76, 'angles: 2MR²', 'start'),
      { t: 'dot', x: 140, y: 96 }, label(146, 116, 'MR²', 'start'), label(180, 196, 'dots: axes at right angles to the paper'),
    ]),
  }),
  figure(I(3, 2), 'Make a table giving the radius of gyration of a thin rod about its middle, of a thin rod about one end, and of a hollow sphere about a diameter.', ['Rod about its middle: I = ML²/12, so k = L/√12, about 0.29L.', 'Rod about one end: I = ML²/3, so k = L/√3, about 0.58L.', 'Hollow sphere: I = 2MR²/3, so k = R√(2/3), about 0.82R.'], {
    answer: table(['Body and axis', 'I', 'k = √(I/M)'], [['Rod, about its middle', 'ML²/12', 'L/√12 ≈ 0.29L'], ['Rod, about one end', 'ML²/3', 'L/√3 ≈ 0.58L'], ['Hollow sphere, about a diameter', '2MR²/3', 'R√(2/3) ≈ 0.82R']]),
  }),
  figure(I(3, 2), 'Three small masses are fixed to a light rod 1 m long, as shown. Find the moment of inertia of the system about an axis at right angles to the rod through the 1 kg mass, and through the 2 kg mass.', ['I = Σmr².', 'Through the 1 kg mass: 2 × 0.5² + 3 × 1.0² = 0.5 + 3 = 3.5 kg m².', 'Through the 2 kg mass: 1 × 0.5² + 3 × 0.5² = 1.0 kg m².'], {
    shown: sketch(320, 120, 'A light horizontal rod 1 m long. A 1 kg mass at its left end, a 2 kg mass at its middle, 0.5 m along, and a 3 kg mass at its right end.', [
      line([[40, 60], [280, 60]]), { t: 'circle', x: 40, y: 60, r: 7 }, { t: 'circle', x: 160, y: 60, r: 9 }, { t: 'circle', x: 280, y: 60, r: 11 },
      label(40, 40, '1 kg'), label(160, 40, '2 kg'), label(280, 38, '3 kg'),
      label(100, 90, '0.5 m'), label(220, 90, '0.5 m'), line([[40, 76], [280, 76]], { dash: 1 }),
    ]),
  }),

  predict(I(2, 1), 'A metal disc is hammered out into a thinner disc of twice the radius, with the same mass. Predict how its moment of inertia about its axis changes.', 'I = MR²/2, and M stays the same.', 'Doubling R makes I 4 times as large.'),
  predict(I(2, 2), 'Predict the moment of inertia of a thin rod about an axis along its own length.', 'It is almost zero.', 'All of its mass lies very close to that axis, so r² is tiny for every part.'),
  predict(I(2, 2), 'A body of mass 2 kg has a moment of inertia of 0.10 kg m² about an axis through its centre of mass. Predict its moment of inertia about a parallel axis 0.2 m away.', 'By the parallel axes theorem, I = I(cm) + Md².', 'I = 0.10 + 2 × 0.2² = 0.18 kg m², larger than about the centre of mass.'),

  odd(I(2, 1), ['kg m²', 'kg m² s⁻¹', 'g cm²', '[ML²]'], 'kg m² s⁻¹', 'It is a unit of angular momentum; the others are units or dimensions of moment of inertia.'),
  odd(I(2, 2), ['a thin ring about its axis', 'a thin-walled hollow cylinder about its axis', 'a point mass at distance R from the axis', 'a uniform disc about its axis'], 'a uniform disc about its axis', 'Its moment of inertia is MR²/2; the others are all MR², as all their mass is at distance R.'),
  odd(I(2, 1), ['a flywheel', 'a potter’s wheel', 'a cartwheel with a heavy rim', 'a racing bicycle wheel'], 'a racing bicycle wheel', 'It is made light so that its moment of inertia is small and it speeds up easily; the others are built for a large moment of inertia.'),

  long(I(5, 2), 'A uniform rod has mass 0.6 kg and length 1.0 m.\n(a) Find its moment of inertia about an axis through its middle, at right angles to it. [1]\n(b) Use the parallel axes theorem to find it about a parallel axis through one end. [2]\n(c) Find the radius of gyration about that end. [1]\n(d) Find the moment of inertia about a parallel axis 0.25 m from one end. [1]', '(a) ML²/12 = 0.6 × 1/12 = 0.05 kg m².', '(b) I = 0.05 + 0.6 × 0.5².', '(b) = 0.05 + 0.15 = 0.20 kg m², the same as ML²/3.', '(c) k = √(0.20/0.6) = 0.58 m.', '(d) The axis is 0.25 m from the middle: 0.05 + 0.6 × 0.25² = 0.0875 kg m².'),
  long(I(5, 2), 'A uniform disc has mass 2 kg and radius 0.1 m.\n(a) Find its moment of inertia about its axis. [1]\n(b) Find it about a diameter. [2]\n(c) Find its radius of gyration about its axis. [1]\n(d) It spins about its axis at 20 rad/s. Find its kinetic energy. [1]', '(a) MR²/2 = 2 × 0.01/2 = 0.01 kg m².', '(b) By the perpendicular axes theorem, two diameters at right angles add to the axial value: 2I(d) = 0.01.', '(b) I(d) = 0.005 kg m².', '(c) k = √(0.01/2) = 0.071 m, which is R/√2.', '(d) ½Iω² = ½ × 0.01 × 20² = 2 J.'),
  long(I(5, 1), 'Answer each part.\n(a) Define moment of inertia, and say why it is called the rotational analogue of mass. [2]\n(b) Why does a body’s moment of inertia depend on the axis? [1]\n(c) A ring and a disc of the same mass and radius spin about their axes at the same angular speed. Find the ratio of their kinetic energies. [2]', '(a) I = Σmr², the sum of each particle’s mass times the square of its distance from the axis.', '(a) It measures how hard it is to change a body’s rotation, as mass does for motion in a line.', '(b) A different axis puts the mass at different distances from it.', '(c) I(ring) = MR² and I(disc) = MR²/2.', '(c) Kinetic energy ½Iω² is in the ratio of I: 2 : 1.'),

  tell(I(2, 1), 'Distinguish between mass and moment of inertia.', 'Mass measures the resistance to a change in motion in a line; it is the same whatever the motion.', 'Moment of inertia measures the resistance to a change in rotation; it depends on the axis and how the mass is spread about it.'),
  tell(I(2, 1), 'Distinguish between the parallel and perpendicular axes theorems.', 'The parallel axes theorem, I = I(cm) + Md², links the moments of inertia about two parallel axes, one through the centre of mass; it holds for any body.', 'The perpendicular axes theorem, Iz = Ix + Iy, links three axes at right angles meeting at a point in a flat body; it holds only for flat bodies.'),
  tell(I(2, 2), 'Distinguish between the moment of inertia and the radius of gyration of a body about an axis.', 'The moment of inertia, Σmr², depends on the mass and its spread, in kg m².', 'The radius of gyration is the distance at which the whole mass could be put to give the same moment of inertia, k = √(I/M), in m.'),

  match(I(4, 2), [['A thin rod about its middle', 'ML²/12'], ['A thin rod about one end', 'ML²/3'], ['A hollow sphere about a diameter', '2MR²/3'], ['A ring about a diameter', 'MR²/2']]),
  match(I(4, 1), [['The parallel axes theorem', 'I = I(cm) + Md²'], ['The perpendicular axes theorem', 'Iz = Ix + Iy'], ['The radius of gyration', 'k = √(I/M)'], ['The kinetic energy of rotation', '½Iω²']]),
  match(I(4, 1), [['The rotational analogue of mass', 'moment of inertia'], ['The rotational analogue of force', 'torque'], ['The rotational analogue of linear momentum', 'angular momentum'], ['The rotational analogue of velocity', 'angular velocity']]),

  ar(I(1, 1), 'The moment of inertia of a body depends on the axis of rotation.', 'Its mass is spread at different distances from different axes.', 1, 'I = Σmr², and the distances r change with the axis.'),
  ar(I(1, 2), 'The radius of gyration of a body is the same about every axis.', 'k = √(I/M).', 4, 'I, and so k, changes with the axis.'),
  ar(I(1, 2), 'The parallel axes theorem can be used for a body of any shape.', 'One of the two axes must pass through the centre of mass.', 2, 'Both are true, but the theorem holds for any shape because its proof needs no assumption about the shape.'),

  derive(I(3, 1), 'Use the perpendicular axes theorem to find the moment of inertia of a uniform disc about a diameter, given that about its axis it is MR²/2.', ['For a flat body, the moment of inertia about an axis at right angles to it equals the sum of those about two axes at right angles in its plane, through the same point.', 1], ['By symmetry, every diameter has the same moment of inertia I(d), so I(d) + I(d) = MR²/2.', 1], ['I(d) = MR²/4.', 1]),
  derive(I(3, 1), 'Use the parallel axes theorem to find the moment of inertia of a uniform disc about a tangent at right angles to its plane.', ['The parallel axes theorem: I = I(cm) + Md², where d is the distance between the axes.', 1], ['The disc’s own axis passes through its centre of mass, with I = MR²/2, and the tangent is d = R from it.', 1], ['I = MR²/2 + MR² = 3MR²/2.', 1]),
];

export default questions;
