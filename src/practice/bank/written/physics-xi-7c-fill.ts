// Written by hand: surface tension, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The capillary graph is h = 15 mm at 1/r = 1 mm⁻¹, rising in proportion: S = hρgr/2 = 0.015 × 1000 × 9.8 × 0.001/2 = 0.074 N/m.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, plot, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const S = at(7, 'c');

const questions: BankDef[] = [
  figure(S(3, 1), 'Draw a narrow glass tube standing in water, and another in mercury, showing the shape of each surface in the tube, its level, and the angle of contact.', ['Water rises in the tube, and its surface is curved down in the middle, concave, as water wets glass.', 'Mercury falls below the outside level, and its surface is curved up, convex, as it doesn’t wet glass.', 'The angle of contact is less than 90° for water and more than 90° for mercury.'], {
    answer: sketch(340, 200, 'Two dishes side by side, each with a narrow tube standing in it. In the water dish, the water inside the tube stands above the outside level, with a surface curved down in the middle; the angle of contact is marked less than 90°. In the mercury dish, the mercury inside the tube stands below the outside level, with a surface curved up; the angle of contact is marked more than 90°.', [
      line([[20, 120], [20, 180], [150, 180], [150, 120]]), line([[20, 140], [70, 140]], { dash: 1 }), line([[100, 140], [150, 140]], { dash: 1 }),
      line([[75, 30], [75, 170]]), line([[95, 30], [95, 170]]), { t: 'path', d: 'M75 72 Q 85 84, 95 72' }, label(85, 196, 'water, θ < 90°'),
      line([[190, 120], [190, 180], [320, 180], [320, 120]]), line([[190, 130], [240, 130]], { dash: 1 }), line([[270, 130], [320, 130]], { dash: 1 }),
      line([[245, 30], [245, 170]]), line([[265, 30], [265, 170]]), { t: 'path', d: 'M245 160 Q 255 148, 265 160' }, label(255, 196, 'mercury, θ > 90°'),
    ]),
  }),
  figure(S(3, 2), 'The graph shows how far water rises in glass tubes of different radius r, plotted against 1/r. What does the straight line show? Find the rise in a tube of radius 0.5 mm, and the surface tension of water. (Take the angle of contact as 0, ρ = 1000 kg/m³, g = 9.8 m/s².)', ['The line through the origin shows that h is proportional to 1/r, as h = 2S cos θ/(ρgr).', 'For r = 0.5 mm, 1/r = 2 mm⁻¹, and h = 30 mm.', 'At r = 1 mm, h = 15 mm, so S = hρgr/2 = 0.015 × 1000 × 9.8 × 0.001/2 = 0.074 N/m.'], {
    shown: graph('1/r (mm⁻¹)', 'height of rise h (mm)', [{ points: plot((x) => 15 * x, 0, 2, 4) }], { x: [[1, '1'], [2, '2']], y: [[15, '15'], [30, '30']] }),
  }),
  figure(S(2, 2), 'Draw the forces from neighbouring molecules on a molecule deep inside a liquid and on one at its surface, and use them to explain surface tension.', ['Inside the liquid, a molecule is pulled equally in all directions, so the net force on it is zero.', 'At the surface there are no liquid molecules above, so the net pull is inwards; the surface behaves like a stretched skin, which is surface tension.'], {
    answer: sketch(320, 180, 'A liquid with its surface across the top. A molecule deep inside has arrows pulling it equally in every direction. A molecule at the surface has arrows pulling it sideways and downwards only, giving a net pull into the liquid.', [
      line([[20, 50], [300, 50]]), label(24, 44, 'surface', 'start'),
      { t: 'circle', x: 220, y: 54, r: 6 }, arrow([214, 54], [184, 54]), arrow([226, 54], [256, 54]), arrow([220, 60], [220, 92]), arrow([216, 58], [196, 78]), arrow([224, 58], [244, 78]),
      { t: 'circle', x: 90, y: 120, r: 6 }, arrow([84, 120], [54, 120]), arrow([96, 120], [126, 120]), arrow([90, 114], [90, 84]), arrow([90, 126], [90, 156]),
      label(90, 172, 'inside: no net force'), label(220, 116, 'surface: net pull inwards'),
    ]),
  }),

  predict(S(2, 2), 'A matchstick floats on still water, and a drop of detergent is touched to the water on one side of it. Predict how the matchstick moves, and why.', 'It shoots away from the detergent.', 'The detergent lowers the surface tension on its side, so the stronger pull of the clean surface on the other side drags the matchstick.'),
  predict(S(2, 3), 'A small soap bubble and a large one are joined by a tube with a tap, and the tap is opened. Predict what happens.', 'The small bubble shrinks and the large one grows.', 'The excess pressure, 4S/r, is greater inside the smaller bubble, so air flows from it into the larger one.'),
  predict(S(2, 1), 'The water in a beaker is warmed. Predict how the height to which it rises in a glass capillary tube changes.', 'The rise becomes smaller.', 'Surface tension falls as the temperature rises, and h is proportional to S.'),

  odd(S(2, 1), ['a small drop being nearly spherical', 'a needle floating on water', 'water rising in a narrow tube', 'a boat floating on a lake'], 'a boat floating on a lake', 'It floats by buoyancy; the others come from surface tension.'),
  odd(S(2, 1), ['water on clean glass', 'kerosene on glass', 'alcohol on glass', 'mercury on glass'], 'mercury on glass', 'Its angle of contact is more than 90°, so it doesn’t wet the glass; the others wet it.'),
  odd(S(2, 2), ['N/m', 'J/m²', 'kg/s²', 'N/m²'], 'N/m²', 'It is a unit of pressure; the other three are units of surface tension.'),

  long(S(5, 2), 'Answer each part on excess pressure.\n(a) Why is the excess pressure inside a soap bubble 4S/r, while inside a liquid drop it is 2S/r? [2]\n(b) Find the excess pressure inside a soap bubble of radius 1 cm, if S = 0.03 N/m. [1]\n(c) Find the work done in blowing this bubble. [2]', '(a) A drop has one surface, giving 2S/r.', '(a) A soap bubble has two surfaces, inside and outside, each giving 2S/r, so 4S/r.', '(b) 4 × 0.03/0.01 = 12 Pa.', '(c) The film has two surfaces, so the new area is 2 × 4πr² = 8π × 10⁻⁴ m².', '(c) W = S × ΔA = 0.03 × 8π × 10⁻⁴ = 7.5 × 10⁻⁵ J.'),
  long(S(5, 2), 'Water rises 3.0 cm in a clean glass tube. Take S = 0.072 N/m, the angle of contact as 0, ρ = 1000 kg/m³ and g = 9.8 m/s².\n(a) Find the radius of the tube. [2]\n(b) If only 2 cm of the tube stands above the water, does water flow out of the top? Explain. [2]\n(c) What happens to mercury in the same tube? [1]', '(a) r = 2S/(ρgh) = 0.144/(1000 × 9.8 × 0.030).', '(a) = 4.9 × 10⁻⁴ m, about 0.49 mm.', '(b) No: the water reaches the top and stops there.', '(b) Its surface becomes flatter, with a larger radius of curvature, so the upward pull balances the shorter column.', '(c) It is pushed down below the outside level, as its angle of contact is more than 90°.'),
  long(S(5, 3), 'Answer each part on surface energy.\n(a) What is surface energy, and how is it related to surface tension? [2]\n(b) 1000 small drops of water, each of radius r, join into one large drop. Find its radius. [1]\n(c) Find the energy released, in terms of S and r. [2]', '(a) Surface energy is the extra energy of the molecules at a surface, per unit area of it.', '(a) It is the work done to make unit new area of surface, which equals the surface tension S.', '(b) The volume is kept: (4/3)πR³ = 1000 × (4/3)πr³, so R = 10r.', '(c) The area falls from 1000 × 4πr² = 4000πr² to 4π(10r)² = 400πr².', '(c) Energy released = S × 3600πr².'),

  tell(S(2, 1), 'Distinguish between cohesive and adhesive forces, with an example of each.', 'Cohesive forces attract molecules of the same substance to each other, as between water molecules.', 'Adhesive forces attract molecules of different substances, as between water and glass.'),
  tell(S(2, 2), 'Distinguish between surface tension and surface energy.', 'Surface tension is the force per unit length along a line in the surface, at right angles to it, in N/m.', 'Surface energy is the energy stored per unit area of the surface, in J/m²; the two have equal values.'),
  tell(S(2, 1), 'Distinguish between the excess pressure inside a liquid drop and inside a soap bubble of the same radius r.', 'A liquid drop has one surface, so the excess pressure is 2S/r.', 'A soap bubble has two surfaces, so the excess pressure is 4S/r, twice as much.'),

  match(S(4, 1), [['Excess pressure inside a liquid drop', '2S/r'], ['Excess pressure inside a soap bubble', '4S/r'], ['Height of capillary rise', '2S cos θ/(ρgr)'], ['Surface energy per unit area', 'S']]),
  match(S(4, 2), [['An angle of contact below 90°', 'the liquid wets the solid and rises in a tube'], ['An angle of contact above 90°', 'the liquid doesn’t wet the solid and falls in a tube'], ['An angle of contact of 90°', 'no rise or fall in a tube'], ['An angle of contact of 0°', 'the liquid spreads fully over the solid']]),
  match(S(4, 2), [['Detergent in washing', 'lowers surface tension so water reaches the dirt'], ['Wax on a raincoat', 'makes the angle of contact large'], ['Oil spread on rough sea', 'calms the waves'], ['Fine tubes in plants', 'help water rise by capillary action']]),

  ar(S(1, 2), 'Small drops are more nearly spherical than large ones.', 'For a small drop, surface tension matters far more than its weight.', 1, 'Surface tension pulls a drop into a sphere, the shape of least area, while weight flattens large drops.'),
  ar(S(1, 1), 'Raising the temperature of a liquid raises its surface tension.', 'Molecules move faster at higher temperatures.', 4, 'Faster molecules are held less firmly together, so surface tension falls as the temperature rises.'),
  ar(S(1, 1), 'A soap film has two surfaces.', 'Soap lowers the surface tension of water.', 2, 'Both are true, but the film has two surfaces because it is a thin sheet of liquid with air on both sides.'),

  derive(S(3, 2), 'Show that the excess pressure inside a liquid drop of radius r is 2S/r.', ['If the radius grows from r to r + dr, the surface area grows by 8πr dr, so the work done against surface tension is S × 8πr dr.', 1], ['This work is done by the excess pressure p acting over the area 4πr² through dr: p × 4πr² dr.', 1], ['Equating, p × 4πr² dr = 8πSr dr, so p = 2S/r.', 1]),
  derive(S(3, 2), 'Show that the excess pressure inside a soap bubble of radius r is 4S/r.', ['A soap bubble has two surfaces, so enlarging its radius by dr adds 2 × 8πr dr of surface.', 1], ['The work against surface tension is 16πSr dr, done by the excess pressure p × 4πr² dr.', 1], ['Equating, p = 4S/r.', 1]),
];

export default questions;
