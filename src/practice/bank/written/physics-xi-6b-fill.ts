// Written by hand: potential, escape velocity and satellites, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// Values used: GM of the Earth = 6.67 × 10⁻¹¹ × 6 × 10²⁴ = 4.0 × 10¹⁴ m³/s², R = 6.4 × 10⁶ m, g = 9.8 m/s².
import { at, kit, type BankDef } from '../define';
import { graph, label, line, plot, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('physics', 'XI');
const S = at(6, 'b');

const questions: BankDef[] = [
  figure(S(3, 2), 'Sketch a graph of the gravitational potential V outside the Earth against the distance r from its centre, from the surface outwards, and explain its shape.', ['V = −GM/r: it is negative everywhere, as potential is zero at infinity and work must be done to take a mass away.', 'At the surface it is −GM/R, its lowest value outside the Earth.', 'It rises towards zero as r grows, without reaching it: at r = 2R it is −GM/2R.'], {
    answer: graph('distance from the centre, r', 'V, in units of GM/R', [{ points: plot((r) => -1 / r, 1, 5, 24) }], { x: [[1, 'R'], [2, '2R'], [4, '4R']], y: [[-1, '−1'], [-0.5, '−½']], xFrom: 0, yFrom: -1.1 }),
  }),
  figure(S(3, 2), 'Draw the paths of a body launched horizontally from a high tower on the Earth at a speed below the orbital speed, at the orbital speed, and at the escape speed or more.', ['Below the orbital speed, it curves down and hits the Earth.', 'At the orbital speed, √(GM/r), it goes round in a circle.', 'At the escape speed or more, √(2GM/r), it leaves the Earth for good, on an open path.'], {
    answer: sketch(360, 260, 'The Earth as a circle with a tower on top. From the top of the tower three paths start to the right: a short curve that falls to the ground; a circle all the way round the Earth; and an open curve that sweeps away and doesn’t come back.', [
      { t: 'circle', x: 150, y: 150, r: 60 }, label(150, 154, 'Earth'), { t: 'path', d: 'M150 90 L150 74' },
      { t: 'path', d: 'M150 74 Q 182 76, 196 112' }, label(240, 112, 'too slow', 'start'), line([[238, 108], [194, 100]]),
      { t: 'circle', x: 150, y: 150, r: 76 }, label(150, 248, 'orbital speed: circle'),
      { t: 'path', d: 'M150 74 Q 250 60, 330 18' }, label(240, 82, 'escape speed', 'start'),
    ]),
  }),
  figure(S(3, 2), 'The table gives the orbital radii of three satellites of the Earth. Which goes round fastest, which has the longest period, and which could be geostationary? Explain.', ['A, in the smallest orbit, is fastest, as v = √(GM/r) rises as r falls.', 'B, in the largest orbit, has the longest period, as T² ∝ r³.', 'B’s period is 2π√(r³/GM) = 2π√((4.2 × 10⁷)³/(4.0 × 10¹⁴)) ≈ 8.6 × 10⁴ s, about 24 hours, so it could be geostationary if it is over the equator and moves west to east.'], {
    shown: table(['Satellite', 'Orbital radius (km)'], [['A', '7 000'], ['B', '42 000'], ['C', '20 000']]),
  }),

  predict(S(2, 3), 'A planet has the same density as the Earth but twice its radius. Predict its escape speed, if the Earth’s is 11.2 km/s.', 'v = √(2GM/R), and with the same density M ∝ R³, so v ∝ √(R²) = R.', 'It doubles, to 22.4 km/s.'),
  predict(S(2, 3), 'A satellite in a low orbit is slowed by the thin air. Predict what happens to its orbit and to its speed.', 'It loses energy, so its total energy, −GMm/2r, becomes more negative, and it spirals into a smaller orbit.', 'In a smaller orbit its speed, √(GM/r), is larger: it speeds up.'),
  predict(S(2, 2), 'A satellite’s total energy is −2 × 10⁹ J. Predict its kinetic and potential energies.', 'Its kinetic energy is GMm/2r, equal in size to the total but positive: +2 × 10⁹ J.', 'Its potential energy is −GMm/r, twice the total: −4 × 10⁹ J.'),

  odd(S(2, 2), ['escape velocity', 'orbital velocity', 'period of an orbit', 'kinetic energy of the satellite'], 'kinetic energy of the satellite', 'It depends on the satellite’s mass; the others don’t.'),
  odd(S(2, 2), ['gravitational potential energy', 'total energy of a satellite', 'gravitational potential', 'kinetic energy of a satellite'], 'kinetic energy of a satellite', 'It is positive; the others are negative, taking zero at infinity.'),
  odd(S(2, 1), ['TV broadcasting', 'telephone links', 'weather pictures of one region', 'photographing the whole Earth’s surface'], 'photographing the whole Earth’s surface', 'It is done by satellites in low polar orbits; the others use geostationary satellites, which always see the same region.'),

  long(S(5, 2), 'A satellite of mass 500 kg orbits 600 km above the Earth’s surface. Take GM = 4.0 × 10¹⁴ m³/s² and the Earth’s radius as 6400 km.\n(a) Find its orbital speed. [2]\n(b) Find its period. [1]\n(c) Find its total energy. [2]', '(a) r = 6400 + 600 = 7000 km = 7.0 × 10⁶ m.', '(a) v = √(GM/r) = √(4.0 × 10¹⁴/7.0 × 10⁶) = 7.6 × 10³ m/s.', '(b) T = 2πr/v = 2π × 7.0 × 10⁶/7.56 × 10³ = 5.8 × 10³ s, about 97 minutes.', '(c) E = −GMm/2r.', '(c) = −4.0 × 10¹⁴ × 500/(1.4 × 10⁷) = −1.4 × 10¹⁰ J.'),
  long(S(5, 2), 'Answer each part on escape speed.\n(a) Find the escape speed from the Earth, with g = 9.8 m/s² and R = 6.4 × 10⁶ m. [1]\n(b) Find it from the Moon, with g = 1.6 m/s² and R = 1.74 × 10⁶ m. [2]\n(c) A body is launched from the Earth at three times the escape speed. Find its speed far away from the Earth. [2]', '(a) v = √(2gR) = √(2 × 9.8 × 6.4 × 10⁶) = 1.12 × 10⁴ m/s, 11.2 km/s.', '(b) v = √(2 × 1.6 × 1.74 × 10⁶).', '(b) = 2.36 × 10³ m/s, about 2.4 km/s.', '(c) Energy is conserved: ½mv² − ½mv(e)² = ½mv(∞)², so v(∞)² = 9v(e)² − v(e)² = 8v(e)².', '(c) v(∞) = 2√2 × 11.2 = 31.7 km/s.'),
  long(S(5, 3), 'Answer each part on geostationary satellites.\n(a) Give two conditions an orbit must meet for a satellite to be geostationary. [2]\n(b) Find the radius of its orbit, taking GM = 4.0 × 10¹⁴ m³/s². [2]\n(c) Find its height above the surface, with R = 6.4 × 10⁶ m. [1]', '(a) It must lie over the equator, in the plane of the Earth’s spin.', '(a) Its period must be 24 hours, moving west to east, the way the Earth turns.', '(b) r³ = GMT²/4π² = 4.0 × 10¹⁴ × 86 400²/4π² = 7.6 × 10²² m³.', '(b) r = 4.2 × 10⁷ m.', '(c) h = 4.2 × 10⁷ − 6.4 × 10⁶ = 3.6 × 10⁷ m, about 36 000 km.'),

  tell(S(2, 1), 'Distinguish between gravitational potential and gravitational potential energy at a point.', 'Gravitational potential is the work done to bring unit mass from infinity to the point, −GM/r, in J/kg.', 'Gravitational potential energy is the work done to bring a given mass m there, −GMm/r, in J.'),
  tell(S(2, 1), 'Distinguish between a geostationary satellite and a polar satellite.', 'A geostationary satellite orbits over the equator, about 36 000 km up, with a period of 24 hours, so it stays over one spot.', 'A polar satellite orbits low, over the poles, in about 100 minutes, so the Earth turns beneath it and it sees the whole surface.'),
  tell(S(2, 2), 'Distinguish between gravitational field strength and gravitational potential at a point.', 'Field strength is the force on unit mass there, GM/r², a vector, in N/kg.', 'Potential is the work done to bring unit mass from infinity, −GM/r, a scalar, in J/kg.'),

  match(S(4, 1), [['Orbital speed close to the Earth’s surface', 'about 7.9 km/s'], ['Escape speed from the Earth', 'about 11.2 km/s'], ['Period of a geostationary satellite', '24 hours'], ['Height of a geostationary satellite', 'about 36 000 km']]),
  match(S(4, 2), [['Kinetic energy of a satellite', 'GMm/2r'], ['Potential energy of a satellite', '−GMm/r'], ['Total energy of a satellite', '−GMm/2r'], ['Gravitational potential at distance r', '−GM/r']]),
  match(S(4, 2), [['Escape velocity from a planet', '√(2GM/R)'], ['Orbital velocity at radius r', '√(GM/r)'], ['Period of an orbit of radius r', '2π√(r³/GM)'], ['Escape velocity in terms of g', '√(2gR)']]),

  ar(S(1, 2), 'The escape speed from the Moon is less than from the Earth.', 'The Moon has much less mass for its radius, and the escape speed is √(2GM/R).', 1, 'GM/R is far smaller for the Moon, so its escape speed is only about 2.4 km/s.'),
  ar(S(1, 1), 'A geostationary satellite moves from east to west.', 'It must turn with the Earth to stay over the same spot.', 4, 'The Earth turns from west to east, so the satellite must move west to east too.'),
];

export default questions;
