// Written by hand: optics, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('physics', 'XII');
const A = at(6, 'a');
const B = at(6, 'b');
const C = at(6, 'c');

const questions: BankDef[] = [
  match(A(3, 1), [['Concave mirror', 'Shaving mirror'], ['Convex mirror', 'Rear-view mirror of a car'], ['Plane mirror', 'Image the same size, upright']]),
  match(A(4, 2), [['Object beyond 2F of a convex lens', 'Real, smaller image between F and 2F'], ['Object at 2F of a convex lens', 'Real, same-size image at 2F'], ['Object between F and the lens', 'Virtual, upright, larger image'], ['Object anywhere in front of a concave lens', 'Virtual, upright, smaller image']]),
  match(A(3, 2), [['Lens maker’s formula', '1/f = (μ − 1)(1/R₁ − 1/R₂)'], ['Thin lenses in contact', '1/F = 1/f₁ + 1/f₂'], ['Power of a lens', '1/f, in metres']]),
  match(A(4, 3), [['Critical angle', 'sin c = 1/μ'], ['Prism at least deviation', 'μ = sin((A + δ)/2) / sin(A/2)'], ['Apparent depth', 'Real depth / μ'], ['Refraction at a curved surface', 'μ₂/v − μ₁/u = (μ₂ − μ₁)/R']]),
  match(A(3, 3), [['Optical fibre', 'Carries light along a bent glass thread'], ['Mirage', 'Total internal reflection in hot air'], ['Rainbow', 'Dispersion and internal reflection in drops']]),
  match(B(3, 1), [['Compound microscope', 'Objective of short focal length'], ['Astronomical telescope', 'Objective of long focal length'], ['Simple microscope', 'A single convex lens']]),
  match(B(4, 2), [['Telescope, normal adjustment', 'm = f_o/f_e'], ['Simple microscope, image at near point', 'm = 1 + D/f'], ['Telescope tube length, normal adjustment', 'f_o + f_e'], ['Compound microscope', 'm = m_o × m_e']]),
  match(B(3, 2), [['Refracting telescope', 'An objective lens'], ['Reflecting telescope', 'A concave mirror as objective'], ['Eyepiece of a compound microscope', 'Works as a simple magnifier']]),
  match(B(4, 3), [['Large objective aperture in a telescope', 'Brighter image'], ['Large objective focal length in a telescope', 'More angular magnification'], ['Reflecting telescope', 'No chromatic aberration'], ['Telescope’s eyepiece', 'Magnifies the objective’s image']]),
  match(B(3, 3), [['Astronomical telescope in normal adjustment', 'Final image at infinity'], ['Simple microscope', 'Image virtual and upright'], ['Objective of a compound microscope', 'Real, inverted, enlarged image']]),
  match(C(3, 1), [['Interference', 'Two coherent sources'], ['Diffraction', 'Light bending round an edge'], ['Huygens’ principle', 'Each point on a wavefront is a new source']]),
  match(C(4, 2), [['Fringe width in Young’s experiment', 'λD/d'], ['Bright fringe', 'Path difference nλ'], ['Dark fringe', 'Path difference (n + ½)λ'], ['Width of the central maximum, single slit', '2λD/a']]),
  match(C(3, 2), [['Plane wavefront', 'From a very distant source'], ['Spherical wavefront', 'From a point source'], ['Cylindrical wavefront', 'From a line source, such as a slit']]),
  match(C(4, 3), [['Slits moved closer together', 'Fringes get wider'], ['Whole apparatus put in water', 'Fringes get narrower'], ['One slit made a little wider than the other', 'Dark fringes are no longer fully dark'], ['Source slit made very wide', 'Fringes blur and vanish']]),
  match(C(3, 3), [['Two independent lamps', 'No steady fringes'], ['One slit covered in Young’s experiment', 'Single-slit diffraction pattern'], ['White light in Young’s experiment', 'A white central fringe, with coloured ones']]),
];

export default questions;
