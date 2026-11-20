// Written by hand: gravity and its variation, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The g–r graph is in units of R and of g at the surface: g rises as r inside, and falls as 1/r² outside.
import { at, kit, type BankDef } from '../define';
import { graph, plot, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('physics', 'XI');
const G = at(6, 'a');

const questions: BankDef[] = [
  figure(G(3, 2), 'Sketch a graph of how g changes with distance r from the centre of the Earth, from the centre to well outside it, taking the Earth’s density as uniform.', ['Inside the Earth, g = g₀r/R: it rises in a straight line from zero at the centre.', 'It is greatest, g₀, at the surface, r = R.', 'Outside, g = g₀R²/r², falling as 1/r²: to g₀/4 at r = 2R.'], {
    answer: graph('distance from the centre, r', 'g', [{ points: [[0, 0], [1, 1], ...plot((r) => 1 / (r * r), 1, 3, 20).slice(1)] }], { x: [[1, 'R'], [2, '2R'], [3, '3R']], y: [[1, 'g₀'], [0.25, 'g₀/4']] }),
  }),
  figure(G(3, 2), 'The table gives the mean distance from the Sun, in astronomical units, and the period, in years, of three planets. Show that they obey Kepler’s third law, and find the period of a planet 4 AU from the Sun.', ['For the Earth T²/r³ = 1; for Mars 1.88²/1.52³ = 3.53/3.51 ≈ 1.0.', 'For Jupiter 11.86²/5.20³ = 140.7/140.6 ≈ 1.0, so T² ∝ r³ holds.', 'At 4 AU, T² = 4³ = 64, so T = 8 years.'], {
    shown: table(['Planet', 'Distance r (AU)', 'Period T (years)'], [['Earth', '1.00', '1.00'], ['Mars', '1.52', '1.88'], ['Jupiter', '5.20', '11.86']]),
  }),
  figure(G(3, 1), 'Make a table showing how g changes with height, with depth and with latitude, giving the formula or reason for each.', ['Height h, small: g(1 − 2h/R), falling as you go up.', 'Depth d: g(1 − d/R), falling to zero at the centre.', 'Latitude: g is least at the equator and greatest at the poles, because of the Earth’s spin and its bulge at the equator.'], {
    answer: table(['Change', 'g becomes', 'Effect'], [['Height h, small', 'g(1 − 2h/R)', 'falls'], ['Depth d', 'g(1 − d/R)', 'falls, to zero at the centre'], ['Latitude', 'least at the equator', 'spin and the equatorial bulge']]),
  }),

  predict(G(2, 1), 'The distance between two masses is halved and one of the masses is doubled. Predict the change in the force between them.', 'F ∝ m₁m₂/r²: doubling a mass doubles F, and halving r makes it 4 times as large.', 'So the force becomes 8 times as large.'),
  predict(G(2, 2), 'Predict how g at the equator, and at the poles, would change if the Earth spun faster.', 'At the equator g would fall, as more of the pull of gravity is needed to keep bodies moving in a circle.', 'At the poles it would be unchanged, as bodies there aren’t carried round a circle.'),
  predict(G(2, 2), 'Predict the depth at which g is half its value at the surface, taking the Earth’s density as uniform and its radius as R.', 'g at depth d is g(1 − d/R).', 'For half, 1 − d/R = ½, so d = R/2.'),

  odd(G(2, 2), ['Kepler’s first law', 'Kepler’s second law', 'Kepler’s third law', 'Newton’s law of gravitation'], 'Newton’s law of gravitation', 'It is a law of force between any two masses; the others describe the motion of the planets, as found from observation.'),
  odd(G(2, 1), ['G', 'g', 'the mass of the Earth', 'the radius of the Earth'], 'g', 'It changes from place to place; the others have fixed values.'),
  odd(G(2, 2), ['N m²/kg²', 'm³ kg⁻¹ s⁻²', '[M⁻¹L³T⁻²]', 'N/kg'], 'N/kg', 'It is a unit of g; the others are the units or dimensions of G.'),

  long(G(5, 2), 'Take the radius of the Earth as 6400 km and g at the surface as 9.8 m/s².\n(a) Find g at a height of 64 km. [2]\n(b) Find g at a depth of 64 km. [2]\n(c) Which makes g fall faster, going up or going down by the same small distance? [1]', '(a) g(1 − 2h/R) = 9.8(1 − 2 × 64/6400).', '(a) = 9.8 × 0.98 = 9.60 m/s².', '(b) g(1 − d/R) = 9.8(1 − 64/6400).', '(b) = 9.8 × 0.99 = 9.70 m/s².', '(c) Going up: g falls twice as fast with height as with depth, for small distances.'),
  long(G(5, 2), 'Answer each part on Kepler’s laws.\n(a) State the law of areas. [1]\n(b) For a planet in a circular orbit of radius r round the Sun, of mass M, show that T² = 4π²r³/(GM). [2]\n(c) A planet is 9 times as far from the Sun as the Earth. Find its period. [1]\n(d) What does the law of areas say about a planet’s speed near the Sun? [1]', '(a) The line from the Sun to a planet sweeps out equal areas in equal times.', '(b) Gravity provides the centripetal force: GMm/r² = mω²r = m(2π/T)²r.', '(b) So T² = 4π²r³/(GM).', '(c) T² ∝ r³, so T = 9^(3/2) = 27 years.', '(d) It moves fastest when nearest the Sun, so that it sweeps out the same area in the same time.'),
  long(G(5, 3), 'Take g = 9.8 m/s², the radius of the Earth as 6.4 × 10⁶ m and G = 6.67 × 10⁻¹¹ N m²/kg².\n(a) Find the mass of the Earth. [2]\n(b) Find its mean density. [2]\n(c) What would a 60 kg person weigh at the surface, and at the Earth’s centre? [1]', '(a) g = GM/R², so M = gR²/G.', '(a) = 9.8 × (6.4 × 10⁶)²/(6.67 × 10⁻¹¹) = 6.0 × 10²⁴ kg.', '(b) Volume = (4/3)πR³ = 1.10 × 10²¹ m³.', '(b) Density = 6.0 × 10²⁴/1.10 × 10²¹ = 5.5 × 10³ kg/m³.', '(c) 60 × 9.8 = 588 N at the surface, and nothing at the centre, where g = 0.'),

  tell(G(2, 1), 'Distinguish between g and G.', 'g is the acceleration due to gravity, about 9.8 m/s² at the Earth’s surface; it changes from place to place.', 'G is the universal gravitational constant, 6.67 × 10⁻¹¹ N m²/kg², the same everywhere.'),
  tell(G(2, 1), 'Distinguish between the mass and the weight of a body.', 'Mass is the amount of matter in a body, measured in kg; it is the same everywhere.', 'Weight is the force of gravity on it, mg, measured in newtons; it changes with g.'),
  tell(G(2, 2), 'Distinguish between how g changes with a small height and with depth below the Earth’s surface.', 'With height h, g falls as g(1 − 2h/R), as you get further from the whole mass of the Earth.', 'With depth d, g falls as g(1 − d/R), more slowly, as the mass outside you no longer pulls you towards the centre.'),

  match(G(4, 1), [['Kepler’s first law', 'orbits are ellipses with the Sun at one focus'], ['Kepler’s second law', 'equal areas are swept out in equal times'], ['Kepler’s third law', 'T² is proportional to r³'], ['Newton’s law of gravitation', 'F = Gm₁m₂/r²']]),
  match(G(4, 2), [['g at a small height h', 'g(1 − 2h/R)'], ['g at a depth d', 'g(1 − d/R)'], ['g at the centre of the Earth', 'zero'], ['g at the surface', 'GM/R²']]),
  match(G(4, 1), [['The gravitational constant G', '6.67 × 10⁻¹¹ N m²/kg²'], ['g at the Earth’s surface', '9.8 m/s²'], ['The mass of the Earth', '6.0 × 10²⁴ kg'], ['The radius of the Earth', '6.4 × 10⁶ m']]),

  ar(G(1, 1), 'A body weighs less on the Moon than on the Earth.', 'The value of g on the Moon is about one sixth of that on the Earth.', 1, 'Weight is mg, so with the same mass it is about one sixth as much on the Moon.'),
  ar(G(1, 1), 'G has the same value everywhere in the universe.', 'g has the same value everywhere on the Earth.', 3, 'g changes with height, depth and latitude.'),
  ar(G(1, 2), 'Kepler’s law of areas follows from the conservation of angular momentum.', 'The pull of the Sun on a planet is a central force, with no torque about the Sun.', 1, 'With no torque, the planet’s angular momentum is constant, and the rate of sweeping out area is L/2m.'),
];

export default questions;
