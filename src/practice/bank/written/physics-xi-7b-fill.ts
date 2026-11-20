// Written by hand: mechanical properties of fluids, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The velocity–time graph of a falling sphere is v = 5(1 − e^(−t)), levelling off at a terminal velocity of 5 m/s.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, plot, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const F = at(7, 'b');

const questions: BankDef[] = [
  figure(F(3, 1), 'Draw a labelled diagram of a hydraulic lift, and use Pascal’s law to show how a small force can lift a heavy load.', ['Two cylinders, one narrow with a piston of area a and one wide with a piston of area A, joined by a pipe and filled with liquid.', 'A force f on the small piston makes a pressure f/a, which Pascal’s law carries undiminished through the liquid to the large piston.', 'The large piston feels a force F = (f/a) × A, which is A/a times as large as f.'], {
    answer: sketch(340, 200, 'Two cylinders joined at the bottom by a pipe, all filled with liquid. The narrow cylinder on the left has a small piston with a small force f pushing down on it. The wide cylinder on the right has a large piston carrying a heavy load, with a large force F pushing up.', [
      { t: 'path', d: 'M60 60 L60 170 L280 170 L280 60' }, { t: 'path', d: 'M90 60 L90 140 L180 140 L180 60' },
      line([[60, 90], [90, 90]]), arrow([75, 40], [75, 86]), label(82, 52, 'f', 'start'), label(75, 112, 'a'),
      line([[180, 100], [280, 100]]), { t: 'box', x: 200, y: 64, w: 60, h: 36 }, label(230, 86, 'load'), label(206, 124, 'A'),
      label(135, 160, 'liquid'), arrow([250, 136], [250, 104]), label(256, 126, 'F', 'start'),
    ]),
  }),
  figure(F(3, 2), 'A small steel ball is dropped into a tall jar of oil. The graph shows its velocity against time. Explain its shape, and give the terminal velocity.', ['At first the only large force is its weight, less the upthrust, so it speeds up quickly.', 'As it speeds up, the viscous drag, 6πηrv, grows, so its acceleration falls and the curve flattens.', 'When the drag, with the upthrust, balances the weight, it moves at a steady terminal velocity: 5 m/s here.'], {
    shown: graph('time (s)', 'velocity (m/s)', [{ points: plot((t) => 5 * (1 - Math.exp(-t)), 0, 5, 30) }], { x: [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']], y: [[5, '5']] }),
  }),
  figure(F(3, 2), 'Water flows steadily from left to right through a level pipe that narrows, as shown, with an open tube standing up from each part. Explain why the water stands lower in the tube over the narrow part. If the wide part has twice the area of the narrow part and the water there moves at 1 m/s, find the speed in the narrow part and the difference in pressure.', ['By continuity, Av is constant, so the water moves faster in the narrow part, and by Bernoulli’s theorem its pressure there is lower, so it rises less in that tube.', 'v = 2 × 1 = 2 m/s.', 'Difference in pressure = ½ρ(v₂² − v₁²) = ½ × 1000 × (4 − 1) = 1500 Pa.'], {
    shown: sketch(340, 170, 'A level pipe, wide on the left and narrowing to a thinner section on the right. An open vertical tube rises from the top of the wide part, with water standing high in it. Another rises from the narrow part, with water standing lower.', [
      line([[20, 100], [140, 100], [180, 115], [320, 115]]), line([[20, 150], [140, 150], [180, 135], [320, 135]]),
      line([[70, 100], [70, 20]]), line([[84, 100], [84, 20]]), line([[70, 40], [84, 40]]),
      line([[240, 115], [240, 20]]), line([[254, 115], [254, 20]]), line([[240, 76], [254, 76]]),
      arrow([30, 125], [70, 125]), label(110, 130, 'wide'), label(290, 130, 'narrow'),
    ]),
  }),

  predict(F(2, 1), 'Predict the total pressure at the bottom of a 10 m column of water, open to the air. (Atmospheric pressure = 1.01 × 10⁵ Pa, ρ = 1000 kg/m³, g = 9.8 m/s².)', 'P = P₀ + ρgh = 1.01 × 10⁵ + 1000 × 9.8 × 10.', '= 1.99 × 10⁵ Pa, about twice atmospheric pressure.'),
  predict(F(2, 2), 'The radius of a small ball falling through oil is doubled, with the same material. Predict the change in its terminal velocity.', 'The terminal velocity is 2r²(ρ − σ)g/(9η), proportional to r².', 'It becomes 4 times as large.'),
  predict(F(2, 1), 'Predict what can happen to a light roof in a strong gale, and why.', 'It can be lifted off.', 'The fast wind over the roof lowers the pressure above it, while the still air inside keeps its pressure, giving an upward force.'),

  odd(F(2, 1), ['a hydraulic lift', 'hydraulic brakes', 'a hydraulic press', 'an aeroplane wing'], 'an aeroplane wing', 'It works by Bernoulli’s theorem; the others work by Pascal’s law.'),
  odd(F(2, 1), ['Pa s', 'poise', 'N s m⁻²', 'N m⁻²'], 'N m⁻²', 'It is a unit of pressure; the others are units of viscosity.'),
  odd(F(2, 2), ['Stokes’ law', 'terminal velocity', 'coefficient of viscosity', 'Pascal’s law'], 'Pascal’s law', 'It is about fluids at rest; the others are about the viscous drag on moving fluids.'),

  long(F(5, 2), 'In a hydraulic lift, the small piston has an area of 10 cm² and the large one 500 cm². It lifts a car of mass 1000 kg. (g = 9.8 m/s².)\n(a) Find the force needed on the small piston. [2]\n(b) How far must the small piston move to raise the car by 2 cm? [2]\n(c) Show that the lift doesn’t give more energy than is put in. [1]', '(a) Pressure is the same: f/10 = 9800/500.', '(a) f = 196 N.', '(b) The volume of liquid moved is the same: 10 × x = 500 × 2.', '(b) x = 100 cm.', '(c) Work in = 196 × 1.00 = 196 J; work out = 9800 × 0.02 = 196 J: the same.'),
  long(F(5, 2), 'A raindrop of radius 0.1 mm falls through air of viscosity 1.8 × 10⁻⁵ Pa s. Take the density of water as 1000 kg/m³, ignore the air’s density, and take g = 9.8 m/s².\n(a) State Stokes’ law. [1]\n(b) Find the terminal velocity of the drop. [2]\n(c) Eight such drops join into one. Find the terminal velocity of the big drop. [2]', '(a) The drag on a small sphere moving slowly through a fluid is 6πηrv.', '(b) v = 2r²ρg/(9η) = 2 × (10⁻⁴)² × 1000 × 9.8/(9 × 1.8 × 10⁻⁵).', '(b) = 1.2 m/s.', '(c) The volume is 8 times as large, so the radius doubles.', '(c) v ∝ r², so it becomes 4 × 1.21 = 4.8 m/s.'),
  long(F(5, 3), 'A wide tank stands on the ground, filled with water. A small hole is made in its side 5.0 m below the water surface and 1.25 m above the ground. (g = 9.8 m/s².)\n(a) Find the speed of the water coming out of the hole. [2]\n(b) How far from the tank does the jet hit the ground? [2]\n(c) Why doesn’t this speed depend on the density of the liquid? [1]', '(a) By Bernoulli’s theorem, v = √(2gh).', '(a) = √(2 × 9.8 × 5.0) = 9.9 m/s.', '(b) Time to fall 1.25 m: t = √(2 × 1.25/9.8) = 0.505 s.', '(b) Distance = 9.9 × 0.505 = 5.0 m.', '(c) The pressure from depth, ρgh, and the kinetic energy per unit volume, ½ρv², both have ρ, which cancels.'),

  tell(F(2, 2), 'Distinguish between viscosity and solid friction.', 'Viscous drag in a fluid depends on the speed of the layers and the area of contact.', 'Solid friction between two surfaces is nearly independent of their speed and of the area of contact.'),
  tell(F(2, 1), 'Distinguish between gauge pressure and absolute pressure.', 'Absolute pressure is the total pressure at a point, including the atmosphere’s.', 'Gauge pressure is the pressure above atmospheric: absolute pressure minus atmospheric pressure, ρgh at depth h in a liquid.'),

  match(F(4, 1), [['Pascal’s law', 'hydraulic brakes'], ['Bernoulli’s theorem', 'the lift on an aeroplane wing'], ['Stokes’ law', 'the terminal velocity of a raindrop'], ['The equation of continuity', 'water speeding up in a narrow pipe']]),
  match(F(4, 2), [['Pressure at depth h', 'P₀ + ρgh'], ['Viscous drag on a sphere', '6πηrv'], ['Terminal velocity of a sphere', '2r²(ρ − σ)g/(9η)'], ['Speed of water from a hole at depth h', '√(2gh)']]),
  match(F(4, 1), [['A liquid flowing slowly through a narrow tube', 'streamline flow'], ['Water gushing from a fully open tap', 'turbulent flow'], ['Critical velocity', 'the speed above which the flow turns turbulent'], ['Viscosity', 'internal friction between the layers of a fluid']]),

  ar(F(1, 1), 'The pressure at a given depth in a liquid doesn’t depend on the shape of the vessel.', 'It depends only on the depth, the density of the liquid and g.', 1, 'P = P₀ + ρgh has no term for the shape.'),
  ar(F(1, 1), 'A hydraulic lift multiplies both force and energy.', 'Pressure applied to a liquid is passed on equally in all directions.', 4, 'It multiplies force, but the large piston moves a shorter distance, so the work out is no more than the work in.'),
  ar(F(1, 2), 'A fluid moves fastest where a pipe is narrowest.', 'Bernoulli’s theorem is a statement of the conservation of energy.', 2, 'Both are true, but the speed-up comes from continuity, Av = constant, as the same volume must pass each second.'),

  derive(F(3, 2), 'Use Stokes’ law to derive an expression for the terminal velocity of a small sphere of radius r and density ρ falling through a fluid of density σ and viscosity η.', ['Its weight is (4/3)πr³ρg, and the upthrust is (4/3)πr³σg.', 1], ['At terminal velocity v, weight = upthrust + drag: (4/3)πr³ρg = (4/3)πr³σg + 6πηrv.', 1], ['So v = 2r²(ρ − σ)g/(9η).', 1]),
  derive(F(3, 1), 'Show that the pressure at a depth h in a liquid of density ρ, open to the air at pressure P₀, is P₀ + ρgh.', ['Take a vertical column of the liquid of cross-section A and height h, from the surface down.', 1], ['Its weight is ρAhg, and it is held up by the difference in the forces on its ends: PA − P₀A = ρAhg.', 1], ['So P = P₀ + ρgh.', 1]),
];

export default questions;
