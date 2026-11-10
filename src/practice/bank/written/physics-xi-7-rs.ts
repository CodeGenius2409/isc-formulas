// Written by hand: properties of bulk matter, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('physics', 'XI');
const A = at(7, 'a');
const B = at(7, 'b');
const C = at(7, 'c');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why does a wire break when stretched past a certain load?', 'Past its breaking stress, its bonds can’t hold the atoms together.'),
  reason(A(2, 2), 'Why are springs made of steel rather than copper?', 'Steel has a higher Young’s modulus and a higher elastic limit.', 'So a steel spring returns to shape after larger loads.'),
  reason(A(2, 2), 'Why does a thick wire stretch less than a thin one of the same material under the same load?', 'The same force over a larger area gives a smaller stress.', 'Strain is stress over Young’s modulus, so it is smaller too.'),
  reason(A(2, 3), 'Why can liquids and gases have a bulk modulus, but no shear modulus?', 'They resist a change in volume.', 'They can’t hold a shear, as their layers slide past each other.'),
  reason(A(1, 2), 'Why is Young’s modulus a property of the material, not of the wire?', 'Stress and strain take away the wire’s size, which leaves only what the material does.'),
  short(A(2, 1), 'State Hooke’s law, and say where it holds.', 'Stress is proportional to strain.', 'It holds up to the limit of proportionality, within the elastic limit.'),
  short(A(2, 2), 'Define Poisson’s ratio. Why has it no unit?', 'The lateral strain divided by the longitudinal strain.', 'It is a ratio of two strains, each without units.'),
  short(A(3, 2), 'Name the modulus of elasticity for each kind of stress: a stretch; a change in volume; a twist or shear.', 'Young’s modulus.', 'Bulk modulus.', 'Modulus of rigidity, the shear modulus.'),
  short(A(3, 3), 'Describe the regions of a stress–strain graph for a metal wire, from the start until it breaks.', 'A straight part, where Hooke’s law holds, up to the elastic limit.', 'Beyond the yield point, it stretches a lot for little extra stress, and stays stretched.', 'At the ultimate stress it narrows, and then it breaks.'),
  short(A(2, 3), 'State two ways a stretched wire stores energy, and give the energy per unit volume.', 'It stores elastic potential energy, from work done against the forces between atoms.', 'Energy per unit volume = ½ × stress × strain.'),
  reason(B(1, 1), 'Why does a dam need to be thicker at the bottom?', 'The water’s pressure rises with depth, so it pushes hardest there.'),
  reason(B(2, 2), 'Why does a small force on a hydraulic lift’s small piston raise a heavy car?', 'By Pascal’s law, the pressure is passed on equally through the liquid.', 'The large piston has a larger area, so the same pressure gives a much larger force.'),
  reason(B(2, 2), 'Why does a stream of water from a tap get narrower as it falls?', 'Gravity speeds up the water as it falls.', 'By continuity, Av stays the same, so the area falls as v rises.'),
  reason(B(2, 3), 'Why does honey flow more slowly than water, and more quickly when warmed?', 'Honey has a much higher viscosity, so its layers resist sliding.', 'Warming weakens the forces between its molecules, so its viscosity falls.'),
  reason(B(1, 2), 'Why do two boats moving side by side, close and fast, tend to be drawn together?', 'The water between them flows faster, so by Bernoulli its pressure is lower.'),
  short(B(2, 1), 'State Pascal’s law, and give one use of it.', 'Pressure applied to an enclosed liquid is passed on equally to every part of it.', 'It is used in hydraulic brakes.'),
  tell(B(2, 2), 'Distinguish between streamline and turbulent flow.', 'In streamline flow, each particle follows the path of the one before it, at steady velocity.', 'In turbulent flow, above the critical velocity, the motion is irregular, with eddies.'),
  short(B(3, 2), 'State Stokes’ law. Give the terminal velocity of a small sphere falling through a fluid, and what it depends on.', 'F = 6πηrv.', 'v = 2r²(ρ − σ)g / 9η.', 'It depends on the square of the radius, and on the densities and viscosity.'),
  short(B(3, 3), 'State Bernoulli’s theorem. Name two quantities it shows to trade off along a streamline, and one condition it needs.', 'P + ½ρv² + ρgh is the same at every point on a streamline.', 'A rise in speed comes with a fall in pressure, at the same height.', 'It needs steady, non-viscous flow of an incompressible fluid.'),
  short(B(2, 3), 'Define the coefficient of viscosity, and give its SI unit.', 'The tangential force per unit area for a unit velocity gradient: η = F/(A dv/dx).', 'N s m⁻², or the pascal second.'),
  reason(C(1, 1), 'Why does a needle placed gently on water float, though steel is denser than water?', 'Surface tension acts like a stretched film, and holds up its small weight.'),
  reason(C(2, 2), 'Why is soapy water better than plain water at washing clothes?', 'Soap lowers the surface tension of water.', 'So it wets and spreads into the fibres more easily, and takes out the dirt.'),
  reason(C(2, 2), 'Why does a liquid rise higher in a narrow tube than in a wider one?', 'h = 2S cos θ/rρg.', 'So a smaller radius gives a greater height.'),
  reason(C(2, 3), 'Why is the pressure inside a soap bubble greater than outside, and more so for a small bubble?', 'The curved film pulls inward, so the air inside must push back harder.', 'The excess is 4S/r, which is larger when r is small.'),
  reason(C(1, 2), 'Why does mercury fall below the outside level in a glass tube?', 'Its angle of contact with glass is more than 90°, so cos θ is negative.'),
  short(C(2, 1), 'Define surface tension, and give its SI unit.', 'The force per unit length acting along the surface, at right angles to a line drawn on it.', 'N m⁻¹.'),
  short(C(2, 2), 'What is the angle of contact? Give its size for water on clean glass, and for mercury on glass.', 'The angle between the solid and the tangent to the liquid surface, measured through the liquid.', 'About 0° for water, and about 140° for mercury.'),
  short(C(3, 2), 'Give the excess pressure inside a liquid drop, an air bubble in a liquid, and a soap bubble, each of radius r.', 'Liquid drop: 2S/r.', 'Air bubble inside a liquid: 2S/r.', 'Soap bubble in air: 4S/r, as it has two surfaces.'),
  short(C(3, 3), 'Show that surface energy per unit area equals surface tension.', 'Stretch a film of width l by a distance x against a force F = Sl, as one surface.', 'The work done is Slx, and the new area is lx.', 'So the work per unit area, the surface energy, is S.'),
  short(C(2, 3), 'Name two ways surface tension can be lowered, and give an example of each.', 'Raising the temperature, as in hot water.', 'Adding a detergent or soap.'),
];

export default questions;
