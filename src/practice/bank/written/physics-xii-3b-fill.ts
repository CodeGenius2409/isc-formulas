// Written by hand: magnetism and matter, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, plot, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XII');
const M = at(3, 'b');

const questions: BankDef[] = [
  figure(M(2, 1), 'Draw the magnetic field lines of a bar magnet, and mark its axial line and equatorial line.', ['Closed curves leave the N pole and enter the S pole outside the magnet, closest together near the poles.', 'The axial line runs through both poles; the equatorial line is the perpendicular bisector of the magnet.'], {
    answer: sketch(320, 200, 'A bar magnet lying left to right, S on the left and N on the right. Curved field lines leave the N end, loop round above and below, and enter the S end. A dashed horizontal line through both poles is the axial line. A dashed vertical line through the middle of the magnet is the equatorial line.', [
      { t: 'box', x: 110, y: 90, w: 100, h: 30 }, label(125, 110, 'S'), label(195, 110, 'N'),
      { t: 'path', d: 'M210 98 C 232 62, 88 62, 110 98', arrow: 1 }, { t: 'path', d: 'M210 92 C 300 0, 20 0, 110 92', arrow: 1 },
      { t: 'path', d: 'M210 112 C 232 148, 88 148, 110 112', arrow: 1 }, { t: 'path', d: 'M210 118 C 300 210, 20 210, 110 118', arrow: 1 },
      line([[10, 105], [110, 105]], { dash: 1 }), line([[210, 105], [310, 105]], { dash: 1 }), line([[160, 20], [160, 90]], { dash: 1 }), line([[160, 120], [160, 195]], { dash: 1 }),
      label(306, 124, 'axial line', 'end'), label(166, 16, 'equatorial line', 'start'),
    ]),
  }),
  figure(M(2, 2), 'Draw the magnetic field lines of a circular current loop, seen edge-on, and show why it behaves like a bar magnet.', ['Field lines circle each side of the loop and pass straight through its middle, all in one direction.', 'So one face acts as a north pole and the other as a south pole: a magnetic dipole of moment IA along the axis.'], {
    answer: sketch(320, 180, 'A loop seen edge-on: the current comes out of the page at the top and goes into it at the bottom. Field lines circle each of these, and a straight line through the middle points to the right. The right face is marked N and the left face S.', [
      { t: 'circle', x: 160, y: 45, r: 5 }, { t: 'dot', x: 160, y: 45 }, { t: 'circle', x: 160, y: 135, r: 5 }, line([[156, 131], [164, 139]]), line([[156, 139], [164, 131]]),
      { t: 'circle', x: 160, y: 45, r: 18 }, { t: 'circle', x: 160, y: 45, r: 32 }, { t: 'circle', x: 160, y: 135, r: 18 }, { t: 'circle', x: 160, y: 135, r: 32 },
      line([[30, 90], [290, 90]], { arrow: 1 }), label(198, 40, 'I', 'start'), label(198, 150, 'I', 'start'),
      label(204, 84, 'N', 'start'), label(116, 84, 'S', 'end'),
    ]),
  }),
  figure(M(3, 2), 'The graph shows how the torque on a bar magnet in a uniform field of 0.5 T changes with the angle between its axis and the field. Read off the greatest torque and the angle at which it acts, and find the magnet’s dipole moment.', ['The greatest torque is 0.2 N m.', 'It acts at 90°, as τ = mB sin θ.', 'm = τ/B = 0.2/0.5 = 0.4 A m².'], {
    shown: graph('angle θ (degrees)', 'torque (N m)', [{ points: plot((t) => 0.2 * Math.sin((t * Math.PI) / 180), 0, 180, 36) }], { x: [[90, '90'], [180, '180']], y: [[0.2, '0.2']] }),
  }),

  predict(M(2, 2), 'A bar magnet is cut in half across its length, at right angles to its axis. Predict the poles of each piece, and its dipole moment.', 'Each piece is a complete magnet, with its own N and S poles.', 'Each has half the dipole moment, as it has half the length with the same pole strength.'),
  predict(M(2, 2), 'A bar magnet is held at right angles to a uniform field and let go. Predict how it moves.', 'A torque turns it towards the direction of the field.', 'It swings past, oscillates about the field direction, and settles along it, where it is in stable equilibrium.'),
  predict(M(2, 2), 'A small rod of bismuth and one of aluminium are hung, in turn, between the poles of a strong electromagnet. Predict how each sets itself.', 'Bismuth, being diamagnetic, sets at right angles to the field, moving away from the stronger parts.', 'Aluminium, being paramagnetic, sets along the field.'),

  odd(M(2, 1), ['iron', 'nickel', 'cobalt', 'copper'], 'copper', 'It is diamagnetic; the others are ferromagnetic.'),
  odd(M(2, 2), ['bismuth', 'copper', 'water', 'aluminium'], 'aluminium', 'It is paramagnetic; the others are diamagnetic.'),
  odd(M(2, 1), ['a bar magnet', 'a current-carrying solenoid', 'a current loop', 'a straight current-carrying wire'], 'a straight current-carrying wire', 'Its field lines are circles round it, with no poles; the others behave as magnetic dipoles.'),

  long(M(5, 2), 'Answer each part on a current loop.\n(a) Write the magnetic dipole moment of a coil of N turns, area A, carrying current I, and give its direction. [2]\n(b) Find it for a circular coil of 50 turns and radius 4 cm carrying 2 A. [2]\n(c) Why does such a coil behave like a bar magnet? [1]', '(a) m = NIA.', '(a) It is along the axis of the coil, given by the right-hand rule: fingers curled with the current, thumb along m.', '(b) A = π × 0.04² = 5.03 × 10⁻³ m².', '(b) m = 50 × 2 × 5.03 × 10⁻³ ≈ 0.50 A m².', '(c) Its field is like that of a bar magnet, with one face acting as N and the other as S, and it turns to line up in a field.'),
  long(M(5, 2), 'Answer each part on a bar magnet.\n(a) Describe the direction of its field at a point on its axial line and at a point on its equatorial line. [2]\n(b) How do both fields change as the distance from a short magnet grows? [1]\n(c) A magnet of moment 2 A m² lies at 30° to a uniform field of 0.3 T. Find the torque on it. [2]', '(a) On the axial line, the field is along the axis, in the direction of the dipole moment, from S to N.', '(a) On the equatorial line, it is parallel to the axis but opposite to the dipole moment.', '(b) Both fall off quickly, as 1/r³, far from the magnet.', '(c) τ = mB sin θ = 2 × 0.3 × sin 30°.', '(c) = 0.3 N m.'),
  long(M(5, 2), 'Answer each part on magnets.\n(a) What must a material for a permanent magnet do, and what must the core of an electromagnet do? Name a suitable material for each. [2]\n(b) How can a permanent magnet be made using a solenoid? [2]\n(c) Why does heating or hammering a permanent magnet weaken it? [1]', '(a) A permanent magnet must keep its magnetism strongly once magnetised: steel or alnico.', '(a) An electromagnet’s core must be magnetised strongly by a small current and lose its magnetism when the current stops: soft iron.', '(b) A steel rod is placed inside a solenoid.', '(b) A large direct current is passed for a short time, then switched off; the rod stays magnetised.', '(c) It knocks the domains out of line, so their moments no longer add up.'),

  tell(M(2, 1), 'Distinguish between the axial line and the equatorial line of a bar magnet.', 'The axial line passes through both poles, along the magnet; the field on it points along the dipole moment.', 'The equatorial line is the perpendicular bisector of the magnet; the field on it points opposite to the dipole moment.'),
  tell(M(2, 1), 'Distinguish between diamagnetic and ferromagnetic substances.', 'A diamagnetic substance, such as copper, is weakly repelled by a magnet and moves towards a weaker field.', 'A ferromagnetic substance, such as iron, is strongly attracted and can be made into a permanent magnet.'),

  match(M(4, 1), [['Bismuth', 'diamagnetic, weakly repelled'], ['Aluminium', 'paramagnetic, weakly attracted'], ['Nickel', 'ferromagnetic, strongly attracted'], ['Soft iron', 'the core of an electromagnet']]),
  match(M(4, 2), [['0°', 'no torque, stable equilibrium'], ['90°', 'the largest torque, mB'], ['180°', 'no torque, unstable equilibrium'], ['30°', 'a torque of mB/2']]),
  match(M(4, 1), [['Magnetic dipole moment', 'A m²'], ['Magnetic field', 'T'], ['Torque', 'N m'], ['Magnetic flux', 'Wb']]),

  ar(M(1, 1), 'A freely suspended bar magnet comes to rest along the magnetic field.', 'In that position the torque on it is zero, and it is in stable equilibrium.', 1, 'Turned slightly either way, the torque brings it back.'),
  ar(M(1, 2), 'Magnetic field lines form closed loops.', 'Like magnetic poles repel each other.', 2, 'Both are true, but the lines are closed because magnetic poles always come in pairs; there are no single poles for them to start or end on.'),
  ar(M(1, 1), 'A current loop has no magnetic dipole moment.', 'A current loop behaves like a magnetic dipole of moment IA.', 4, 'A loop has a dipole moment IA, along its axis.'),

  derive(M(3, 2), 'An electron of charge e and mass mₑ moves at speed v in a circular orbit of radius r. Show that its magnetic dipole moment is μ = (e/2mₑ)L, where L is its angular momentum.', ['It goes round once in time 2πr/v, so it is a current I = e/(2πr/v) = ev/2πr.', 1], ['μ = IA = (ev/2πr) × πr² = evr/2.', 1], ['L = mₑvr, so μ = (e/2mₑ) × mₑvr = (e/2mₑ)L.', 1]),
  derive(M(3, 3), 'Find the work done in turning a magnetic dipole of moment m in a uniform field B from angle θ₁ to θ₂, and so write its potential energy.', ['The torque is mB sin θ, so turning it through dθ against the torque takes dW = mB sin θ dθ.', 1], ['W = ∫ mB sin θ dθ from θ₁ to θ₂ = mB(cos θ₁ − cos θ₂).', 1], ['Taking zero energy at θ = 90°, U = −mB cos θ, least when the dipole lies along the field.', 1]),
  derive(M(3, 2), 'A solenoid of length l, with n turns per unit length and cross-section A, carries a current I. Show that it has the dipole moment of a bar magnet, m = nlIA.', ['Each turn is a current loop of moment IA, along the axis.', 1], ['All the turns carry the current the same way round, so their moments point the same way and add.', 1], ['There are nl turns, so m = nlIA along the axis, and the solenoid behaves as a bar magnet of this moment.', 1]),
];

export default questions;
