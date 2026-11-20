// Written by hand: centre of mass, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const C = at(5, 'a');

const questions: BankDef[] = [
  figure(C(3, 2), 'The figure shows three particles on x–y axes, with distances in metres. Find the coordinates of their centre of mass.', ['Total mass = 1 + 2 + 1 = 4 kg.', 'x = (1 × 0 + 2 × 4 + 1 × 0)/4 = 2 m.', 'y = (1 × 0 + 2 × 0 + 1 × 4)/4 = 1 m, so the centre of mass is at (2 m, 1 m).'], {
    shown: sketch(300, 220, 'x–y axes in metres. A 1 kg particle at the origin, a 2 kg particle at (4, 0) on the x-axis, and a 1 kg particle at (0, 4) on the y-axis.', [
      arrow([40, 190], [280, 190]), arrow([40, 190], [40, 14]), label(276, 208, 'x (m)', 'end'), label(48, 18, 'y (m)', 'start'),
      { t: 'dot', x: 40, y: 190 }, { t: 'dot', x: 200, y: 190 }, { t: 'dot', x: 40, y: 30 },
      label(48, 182, '1 kg', 'start'), label(200, 180, '2 kg'), label(48, 34, '1 kg', 'start'),
      label(200, 208, '4'), label(30, 34, '4', 'end'), label(30, 206, '0', 'end'),
    ]),
  }),
  figure(C(2, 2), 'A uniform sheet is cut into the L shape shown, made of two rectangles of equal area. Mark the centre of mass of each rectangle and of the whole sheet, and explain.', ['The centre of mass of each uniform rectangle is where its diagonals cross.', 'The two parts have equal masses, so the centre of mass of the whole sheet is half-way along the line joining their centres.'], {
    answer: sketch(260, 220, 'An L-shaped sheet: a tall rectangle on the left and a wider, shorter rectangle at the bottom right, of equal area. A dot marks the centre of each rectangle, G1 and G2, joined by a dashed line. A third dot, G, is at the middle of that line.', [
      { t: 'path', d: 'M40 40 L100 40 L100 120 L220 120 L220 200 L40 200 Z' }, line([[100, 120], [100, 200]], { dash: 1 }),
      { t: 'dot', x: 70, y: 120 }, { t: 'dot', x: 160, y: 160 }, line([[70, 120], [160, 160]], { dash: 1 }), { t: 'dot', x: 115, y: 140 },
      label(64, 114, 'G1', 'end'), label(166, 174, 'G2', 'start'), label(118, 134, 'G', 'start'),
    ]),
  }),
  figure(C(3, 3), 'A man of mass 60 kg stands at one end of a boat of mass 140 kg and length 4 m, at rest on still water. He walks to the other end. How far does the boat move? Ignore the drag of the water.', ['No horizontal external force acts, so the centre of mass of the man and boat stays where it is.', 'If the boat moves back a distance d, the man moves 4 − d forwards relative to the water, and 60(4 − d) = 140d.', 'So 240 = 200d, and d = 1.2 m; the man moves 2.8 m relative to the water.'], {
    shown: sketch(320, 190, 'A boat 4 m long floating on water, with a man of mass 60 kg standing at its left end. The boat’s mass is 140 kg.', [
      { t: 'path', d: 'M40 120 L280 120 L260 150 L60 150 Z' }, line([[20, 146], [300, 146]], { dash: 1 }),
      { t: 'circle', x: 60, y: 84, r: 6 }, line([[60, 90], [60, 108]]), line([[60, 108], [54, 120]]), line([[60, 108], [66, 120]]), line([[52, 98], [68, 98]]),
      label(76, 84, 'man, 60 kg', 'start'), label(160, 136, 'boat, 140 kg'),
      line([[40, 168], [280, 168]]), line([[40, 162], [40, 174]]), line([[280, 162], [280, 174]]), label(160, 184, '4 m'),
    ]),
  }),

  predict(C(2, 1), 'One half of a rod is made of steel and the other half, of the same size, of wood. Predict where its centre of mass is.', 'Not at the middle, as it would be for a uniform rod.', 'It is in the steel half, since the steel has more mass and the centre of mass lies nearer the greater mass.'),
  predict(C(2, 2), 'A cannon resting on smooth ice fires a shell horizontally. Predict what happens to the cannon, and to the centre of mass of the cannon and shell.', 'The cannon recoils backwards, with a momentum equal and opposite to the shell’s.', 'The forces of the firing are internal, so the centre of mass of the cannon and shell stays at rest.'),
  predict(C(2, 2), 'A 100 g mass hangs from the 100 cm mark of a uniform metre rule, also of mass 100 g. Predict the mark at which the rule balances on a knife edge.', 'The rule’s own weight acts at 50 cm, and the hanging mass at 100 cm.', 'They are equal, so the centre of mass is half-way between, at the 75 cm mark.'),

  odd(C(2, 1), ['a ring', 'a hollow sphere', 'a horseshoe', 'a solid cube'], 'a solid cube', 'Its centre of mass lies within its material; for the others it lies in empty space.'),
  odd(C(2, 2), ['the velocity of each part', 'the kinetic energy of the system', 'the momentum of each part', 'the velocity of the centre of mass'], 'the velocity of the centre of mass', 'Internal forces can’t change it; they can change each of the others.'),
  odd(C(2, 2), ['m₁r₁ = m₂r₂', 'r₁/r₂ = m₂/m₁', 'm₁/r₁ = m₂/r₂', 'm₁r₁ − m₂r₂ = 0'], 'm₁/r₁ = m₂/r₂', 'It is wrong; the others all say that two particles balance about their centre of mass, at distances r₁ and r₂.'),

  long(C(5, 2), 'Particles of 3 kg and 5 kg are on the x-axis, at x = 2 m and x = 6 m. The 3 kg particle moves at +4 m/s and the 5 kg particle at −2 m/s.\n(a) Find the position of their centre of mass. [1]\n(b) Find the velocity of their centre of mass. [2]\n(c) Find the total momentum, and show it equals the total mass times the velocity of the centre of mass. [1]\n(d) No external force acts. Where is the centre of mass 2 s later? [1]', '(a) x = (3 × 2 + 5 × 6)/8 = 36/8 = 4.5 m.', '(b) v = (3 × 4 + 5 × (−2))/8.', '(b) = 2/8 = 0.25 m/s.', '(c) Total momentum = 12 − 10 = 2 kg m/s, and 8 × 0.25 = 2 kg m/s.', '(d) It moves steadily: 4.5 + 0.25 × 2 = 5.0 m.'),
  long(C(5, 2), 'A shell of mass 6 kg moving horizontally at 20 m/s bursts into two pieces. The 2 kg piece is left at rest.\n(a) Why is momentum conserved in the burst? [1]\n(b) Find the velocity of the 4 kg piece. [2]\n(c) What is the velocity of the centre of mass just after the burst? [1]\n(d) Find the kinetic energy given by the burst. [1]', '(a) The forces of the burst are internal, and the external force, gravity, has no horizontal part.', '(b) 6 × 20 = 2 × 0 + 4v.', '(b) v = 30 m/s, in the same direction.', '(c) Still 20 m/s, as before the burst.', '(d) Before: ½ × 6 × 20² = 1200 J; after: ½ × 4 × 30² = 1800 J; the burst gave 600 J.'),
  long(C(5, 3), 'Answer each part on the centre of mass of rods.\n(a) Where is the centre of mass of a uniform rod of length L, and why? [1]\n(b) A uniform rod of mass 2 kg and length 1 m has a 1 kg mass fixed to one end. Find their centre of mass from the other end. [2]\n(c) A uniform rod of length 1 m is bent at its middle into a right angle. Find its centre of mass from the corner. [2]', '(a) At its mid-point, L/2 from either end, as each half is a mirror image of the other.', '(b) x = (2 × 0.5 + 1 × 1.0)/3.', '(b) = 2/3 m, about 0.67 m from the free end.', '(c) Each half has its centre 0.25 m from the corner, along its own arm, at (0.25, 0) and (0, 0.25).', '(c) The halves have equal mass, so the centre of mass is at (0.125 m, 0.125 m), off the rod.'),

  tell(C(2, 1), 'Distinguish between the centre of mass and the centre of gravity of a body.', 'The centre of mass is the point where the whole mass of the body may be taken to be, for its motion.', 'The centre of gravity is the point through which its weight acts; the two are the same when g is the same over the body.'),
  tell(C(2, 2), 'Distinguish between the effect of internal forces and of external forces on the centre of mass of a system.', 'Internal forces come in equal and opposite pairs, so they cancel and can’t move the centre of mass.', 'Only a net external force accelerates the centre of mass, with F = Ma, where a is the acceleration of the centre of mass.'),
  tell(C(2, 1), 'Distinguish between the centre of mass of a body and its geometric centre.', 'The geometric centre depends only on the body’s shape.', 'The centre of mass depends on how its mass is spread out; the two are the same only for a uniform, symmetric body.'),

  match(C(4, 1), [['A uniform rod of length L', 'at its mid-point'], ['A uniform ring', 'at its centre, where there is no mass'], ['A uniform triangular plate', 'where its medians meet'], ['A uniform rectangular sheet', 'where its diagonals cross']]),
  match(C(4, 2), [['Position of the centre of mass of two particles', '(m₁x₁ + m₂x₂)/(m₁ + m₂)'], ['Velocity of the centre of mass of two particles', '(m₁v₁ + m₂v₂)/(m₁ + m₂)'], ['Total momentum of a system', 'total mass × velocity of the centre of mass'], ['Net external force on a system', 'total mass × acceleration of the centre of mass']]),
  match(C(4, 2), [['A shell bursting in mid-air', 'its centre of mass keeps to the same parabola'], ['Two skaters pushing apart from rest', 'their centre of mass stays at rest'], ['A man walking along a boat on still water', 'the boat moves the other way'], ['A ball falling towards the Earth', 'the centre of mass of ball and Earth doesn’t accelerate']]),

  ar(C(1, 1), 'The centre of mass of two particles always lies on the line joining them.', 'Its position is an average of their positions, weighted by their masses.', 1, 'A weighted average of two points lies between them, on the line joining them.'),
  ar(C(1, 1), 'The centre of mass of a body must lie inside the body.', 'The centre of mass of a uniform rod is at its middle.', 4, 'The centre of mass of a ring or a hollow sphere is at its centre, where there is no material.'),
  ar(C(1, 2), 'The centre of mass of the Earth and the Moon goes round the Sun.', 'The Moon’s mass is about one eightieth of the Earth’s.', 2, 'Both are true, but the centre of mass goes round the Sun because the Sun’s pull is the external force on the pair.'),

  derive(C(3, 2), 'Show that the net external force on a system of particles equals its total mass times the acceleration of its centre of mass.', ['Mr = Σmᵢrᵢ, so differentiating twice, Ma = Σmᵢaᵢ, where a is the acceleration of the centre of mass.', 1], ['mᵢaᵢ is the total force on particle i, external and internal, so Ma is the sum of all forces on all particles.', 1], ['Internal forces come in equal and opposite pairs, by the third law, and cancel, so Ma = F, the net external force.', 1]),
  derive(C(3, 1), 'Show that the centre of mass of two particles divides the line joining them in the inverse ratio of their masses.', ['Put m₁ at x = 0 and m₂ at x = d; the centre of mass is at x = m₂d/(m₁ + m₂).', 1], ['Its distance from m₁ is r₁ = m₂d/(m₁ + m₂), and from m₂ is r₂ = d − r₁ = m₁d/(m₁ + m₂).', 1], ['So r₁/r₂ = m₂/m₁: the inverse ratio of the masses.', 1]),
  derive(C(3, 2), 'Show by integration that the centre of mass of a uniform rod of length L is at its middle.', ['Take the rod along the x-axis from 0 to L, with mass per unit length λ = M/L; an element dx has mass λ dx.', 1], ['x = (1/M)∫x λ dx from 0 to L = (λ/M)(L²/2).', 1], ['= (M/L)(L²/2)/M = L/2, the middle of the rod.', 1]),
];

export default questions;
