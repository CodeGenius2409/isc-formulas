// Written by hand: gravitation, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('physics', 'XI');
const A = at(6, 'a');
const B = at(6, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why don’t we notice the gravitational pull between two people standing close together?', 'G is so small that the force between bodies of everyday mass is tiny.'),
  reason(A(2, 2), 'Why does g fall as you go down a deep mine?', 'Only the mass inside your radius pulls you, and the shell above pulls equally every way.', 'For uniform density, g = g₀(1 − d/R), so it falls with depth.'),
  reason(A(2, 2), 'Why does a planet move fastest when it is nearest the Sun?', 'By Kepler’s second law, the line to the Sun sweeps equal areas in equal times.', 'Near the Sun the line is short, so the planet must move faster to sweep the same area.'),
  reason(A(2, 3), 'Why would a body weigh nothing at the Earth’s centre, though it keeps its mass?', 'At the centre, the Earth’s mass pulls equally in every direction.', 'So g is zero there, and weight mg is zero, while m stays the same.'),
  reason(A(1, 2), 'Why is the gravitational force called a central force?', 'It acts along the line joining the centres of the two bodies.'),
  short(A(2, 1), 'State Newton’s law of gravitation.', 'Every two bodies attract with a force proportional to the product of their masses.', 'It is inversely proportional to the square of the distance between their centres: F = Gm₁m₂/r².'),
  short(A(2, 2), 'State Kepler’s first and third laws.', 'Each planet moves in an ellipse, with the Sun at one focus.', 'The square of its period is proportional to the cube of the semi-major axis: T² ∝ a³.'),
  short(A(3, 2), 'Give how g changes with a small height h above the surface, and with depth d below it. Where is g greatest?', 'g_h ≈ g(1 − 2h/R), for h much less than R.', 'g_d = g(1 − d/R).', 'It is greatest at the surface.'),
  short(A(3, 3), 'Show that g = GM/R² at the Earth’s surface, and use it to say how g would change if the Earth shrank to half its radius with the same mass.', 'A body of mass m at the surface feels mg = GMm/R².', 'So g = GM/R².', 'With R halved, g becomes four times as large.'),
  short(A(2, 3), 'Why does g change with latitude? Give two reasons.', 'The Earth bulges at the equator, so a body there is farther from the centre.', 'The Earth’s spin needs some of the pull for circular motion, most at the equator.'),
  reason(B(1, 1), 'Why does a satellite in a circular orbit need no fuel to keep moving?', 'Gravity gives exactly the centripetal force it needs, and there is no air to slow it.'),
  reason(B(2, 2), 'Why is escape velocity the same for a pebble and a spacecraft?', 'v = √(2GM/R).', 'The body’s own mass cancels out, so it doesn’t appear.'),
  reason(B(2, 2), 'Why does a geostationary satellite stay above one point on the equator?', 'Its period is 24 hours, the same as the Earth’s spin.', 'It moves west to east, in the equator’s plane, so it keeps pace with the ground below.'),
  reason(B(2, 3), 'Why is gravitational potential energy taken as zero at infinity, and negative everywhere else?', 'Gravity is attractive, so work must be done to pull bodies apart.', 'Starting from zero far away, bringing them closer releases energy, so the energy is negative.'),
  reason(B(1, 2), 'Why do lower satellites go round faster?', 'v = √(GM/r), so a smaller orbit gives a higher speed.'),
  short(B(2, 1), 'Define gravitational potential at a point, and give its value at distance r from a mass M.', 'The work done per unit mass to bring a small mass from infinity to that point.', 'V = −GM/r.'),
  short(B(2, 2), 'Give the escape velocity and the orbital velocity near the Earth’s surface, and how they are related.', 'Escape velocity is √(2gR), about 11.2 km/s.', 'Orbital velocity is √(gR), about 7.9 km/s, so escape velocity is √2 times it.'),
  short(B(3, 2), 'State three things true of a geostationary satellite.', 'Its period is 24 hours.', 'It orbits in the plane of the equator.', 'It moves in the same direction as the Earth spins, at a height of about 36,000 km.'),
  short(B(3, 3), 'For a satellite of mass m in an orbit of radius r, give its kinetic, potential and total energy.', 'K = GMm/2r.', 'U = −GMm/r.', 'E = K + U = −GMm/2r.'),
  short(B(2, 3), 'Give two uses of geostationary satellites, and one of satellites in low orbits.', 'Television broadcasting and weather watching over a fixed region.', 'Low orbits are used for mapping the Earth, as they pass close over every part.'),
];

export default questions;
