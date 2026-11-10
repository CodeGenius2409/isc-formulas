// Written by hand: systems of particles and rigid bodies, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('physics', 'XI');
const A = at(5, 'a');
const B = at(5, 'b');
const C = at(5, 'c');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why can a ring’s centre of mass be at a point with no mass?', 'The centre of mass is a weighted average of positions, and for a ring that average is its empty centre.'),
  reason(A(2, 2), 'Why doesn’t the centre of mass of a system speed up when its parts push on each other?', 'Internal forces come in equal and opposite pairs.', 'So they add to zero, and only an external force changes the centre of mass’s motion.'),
  reason(A(2, 2), 'Why is the centre of mass of two unequal masses nearer the heavier one?', 'Each position is weighted by its mass.', 'So the heavier mass pulls the average towards itself, as m₁r₁ = m₂r₂.'),
  reason(A(2, 3), 'A man walks from one end of a boat to the other on still water. Why does the boat move back?', 'With no horizontal external force, the centre of mass of the man and boat stays put.', 'As he moves forward, the boat must move back to keep it there.'),
  reason(A(1, 2), 'Why does a tall bus with a low centre of mass tip less easily?', 'It can tilt further before its centre of mass passes outside its base.'),
  short(A(2, 1), 'Where is the centre of mass of a uniform rod of length L? What is it for a uniform sphere?', 'At its middle, L/2 from either end.', 'At the sphere’s centre.'),
  short(A(2, 2), 'Give the position of the centre of mass of two particles m₁ at x₁ and m₂ at x₂. Where is it for equal masses?', 'x = (m₁x₁ + m₂x₂)/(m₁ + m₂).', 'For equal masses, halfway between them.'),
  short(A(3, 2), 'Masses 2 kg and 3 kg are 1 m apart. Find the centre of mass from the 2 kg mass, and say how it moves if each pulls on the other.', 'x = (2 × 0 + 3 × 1)/5 = 0.6 m.', 'The pulls are internal forces.', 'So the centre of mass doesn’t move, even as the masses move closer.'),
  short(A(3, 3), 'Show that the total momentum of a system equals its total mass times the velocity of its centre of mass. What does it give for an isolated system?', 'M R = Σ mᵢ rᵢ, by the definition of the centre of mass.', 'Differentiating, M V = Σ mᵢ vᵢ, the total momentum.', 'With no external force, the total momentum is constant, so V is constant.'),
  short(A(2, 3), 'A shell explodes in mid-air into two pieces. Describe the path of their centre of mass, and give the reason.', 'It carries on along the shell’s parabola until a piece lands.', 'The explosion’s forces are internal, and only gravity acts from outside.'),
  reason(B(1, 1), 'Why is it harder to open a door by pushing near its hinges?', 'A small arm makes a small torque, so a larger force is needed.'),
  reason(B(2, 2), 'Why does a diver tuck in to turn faster in the air?', 'With no external torque, the diver’s angular momentum Iω stays the same.', 'Tucking in lowers I, so ω rises.'),
  reason(B(2, 2), 'Why can a body be in translational equilibrium and still turn?', 'The forces can add up to zero but still have a net torque.', 'A couple is an example: equal, opposite forces along different lines.'),
  reason(B(2, 3), 'Why does a tightrope walker carry a long pole?', 'The pole raises the walker’s moment of inertia.', 'So a small torque turns them more slowly, which gives time to correct.'),
  reason(B(1, 2), 'Why is torque a vector, at right angles to both the force and its arm?', 'It is defined as τ = r × F, and a vector product is at right angles to both.'),
  short(B(2, 1), 'Define torque and angular momentum for a particle about a point.', 'Torque τ = r × F.', 'Angular momentum L = r × p.'),
  short(B(2, 2), 'State the conditions for a rigid body to be in equilibrium.', 'The vector sum of the forces is zero.', 'The vector sum of the torques about any point is zero.'),
  short(B(3, 2), 'Give the rotational match for each: mass; force; linear momentum.', 'Moment of inertia, I.', 'Torque, τ.', 'Angular momentum, L = Iω.'),
  short(B(3, 3), 'Show that τ = dL/dt for a particle, and say what follows when τ is zero.', 'L = r × p, so dL/dt = v × p + r × dp/dt.', 'v × p = 0, as they are parallel, and dp/dt = F, so dL/dt = r × F = τ.', 'With no torque, L stays constant, which is the conservation of angular momentum.'),
  short(B(2, 3), 'Give the rotational forms of the kinetic energy and of the work done by a torque.', 'K = ½Iω².', 'W = τθ, for a steady torque turning through θ.'),
  reason(C(1, 1), 'Why is a body’s moment of inertia not fixed, as its mass is?', 'It depends on the axis chosen and how the mass is spread around it.'),
  reason(C(2, 2), 'Why does a hollow cylinder roll down a slope more slowly than a solid one of the same mass and radius?', 'Its mass is farther from the axis, so it has a larger moment of inertia.', 'More of its energy goes into turning, so less is left for moving down.'),
  reason(C(2, 2), 'Why are the spokes of a cartwheel light, while its rim is heavy?', 'Mass at the rim gives the largest moment of inertia for the mass used.', 'So the wheel runs more steadily against sudden changes.'),
  reason(C(2, 3), 'Why can’t the perpendicular axes theorem be used for a solid sphere?', 'It holds only for a flat body, or lamina, in one plane.', 'It needs the third axis to be at right angles to the plane holding all the mass.'),
  reason(C(1, 2), 'Why is the moment of inertia of a rod least about an axis through its middle?', 'By the parallel axes theorem, any other parallel axis adds Md², which is more.'),
  short(C(2, 1), 'Define radius of gyration, and give its link with the moment of inertia.', 'The distance from the axis at which all the mass could be placed to give the same moment of inertia.', 'I = Mk².'),
  short(C(2, 2), 'State the theorem of perpendicular axes.', 'For a flat body, the moment of inertia about an axis at right angles to its plane equals the sum of those about two axes in the plane.', 'The two axes are at right angles, and meet where the third one passes through.'),
  short(C(3, 2), 'Give the moment of inertia of each about its own symmetry axis: a ring of mass M and radius R; a disc; a solid sphere.', 'Ring: MR².', 'Disc: ½MR².', 'Solid sphere: ⅖MR².'),
  short(C(3, 3), 'Use the perpendicular axes theorem to find the moment of inertia of a ring about a diameter.', 'About its axis, I_z = MR².', 'By symmetry, the two diameters at right angles have equal moments, I_x = I_y.', 'I_x + I_y = I_z, so each is ½MR².'),
  short(C(2, 3), 'A disc and a ring have the same mass and radius. Which has the larger radius of gyration about its axis, and by how much?', 'The ring: its k is R, and the disc’s is R/√2.', 'So the ring’s is √2 times the disc’s.'),
];

export default questions;
