// Written by hand: dimensions, of each type the subtopic lacked, up to three. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { table } from '../figures';

const { figure, predict, odd, long, tell, match } = kit('physics', 'XI');
const D = at(1, 'b');

const questions: BankDef[] = [
  figure(D(3, 1), 'Make a table of the dimensional formulae of velocity, acceleration, force, work, power and pressure, showing how each follows from the one before or from its definition.', ['Velocity = length/time: [LT⁻¹]; acceleration = velocity/time: [LT⁻²].', 'Force = mass × acceleration: [MLT⁻²]; work = force × distance: [ML²T⁻²].', 'Power = work/time: [ML²T⁻³]; pressure = force/area: [ML⁻¹T⁻²].'], {
    answer: table(['Quantity', 'Defined as', 'Dimensions'], [['Velocity', 'length/time', '[LT⁻¹]'], ['Acceleration', 'velocity/time', '[LT⁻²]'], ['Force', 'mass × acceleration', '[MLT⁻²]'], ['Work', 'force × distance', '[ML²T⁻²]'], ['Power', 'work/time', '[ML²T⁻³]'], ['Pressure', 'force/area', '[ML⁻¹T⁻²]']]),
  }),
  figure(D(3, 2), 'The table gives the dimensions of momentum, with three others left blank. Find P, Q and R.', ['P: impulse = force × time = [MLT⁻²][T] = [MLT⁻¹], the same as momentum.', 'Q: torque = force × distance = [ML²T⁻²].', 'R: angular momentum = momentum × distance = [ML²T⁻¹].'], {
    shown: table(['Quantity', 'Dimensions'], [['Momentum', '[MLT⁻¹]'], ['Impulse', 'P'], ['Torque', 'Q'], ['Angular momentum', 'R']]),
  }),
  figure(D(2, 1), 'Check, in a table, that each term of s = ut + ½at² has the same dimensions.', ['s is a length, [L]; ut is [LT⁻¹][T] = [L].', '½at² is [LT⁻²][T²] = [L], with ½ having no dimensions; every term is [L], so the equation is consistent.'], {
    answer: table(['Term', 'Working', 'Dimensions'], [['s', 'a length', '[L]'], ['ut', '[LT⁻¹] × [T]', '[L]'], ['½at²', '[LT⁻²] × [T²]', '[L]']]),
  }),

  predict(D(2, 2), 'The drag on a body is written F = kv², where v is its speed. Predict the dimensions of k.', 'k = F/v² = [MLT⁻²]/[L²T⁻²].', 'So k has the dimensions [ML⁻¹].'),
  predict(D(2, 3), 'The period T of a mass m on a spring of spring constant k depends only on m and k. Predict, using dimensions, how T depends on them.', 'Let T ∝ mᵃkᵇ, with k = force/extension, [MT⁻²]. Then [T] = [M]ᵃ[MT⁻²]ᵇ.', 'Matching powers: a + b = 0 and −2b = 1, so b = −½ and a = ½: T ∝ √(m/k).'),
  predict(D(2, 1), 'Predict whether the equation E = mc² + ½mv² is dimensionally consistent.', 'mc² and ½mv² are each a mass times a speed squared, [ML²T⁻²].', 'Both terms, and E, are energies, so it is consistent.'),

  odd(D(2, 1), ['work', 'torque', 'energy', 'power'], 'power', 'Its dimensions are [ML²T⁻³]; the other three are [ML²T⁻²].'),

  long(D(5, 2), 'The escape speed v from a planet may depend on the gravitational constant G, the planet’s mass M and its radius R.\n(a) Use dimensions to find how v depends on them. [3]\n(b) What can’t this method tell you? [1]\n(c) The true formula is v = √(2GM/R). Check that it is dimensionally correct. [1]', '(a) Let v ∝ GᵃMᵇRᶜ, with G having dimensions [M⁻¹L³T⁻²].', '(a) [LT⁻¹] = [M]⁻ᵃ⁺ᵇ[L]³ᵃ⁺ᶜ[T]⁻²ᵃ, so −2a = −1, −a + b = 0 and 3a + c = 1.', '(a) a = ½, b = ½ and c = −½: v ∝ √(GM/R).', '(b) The number in front, here √2, which has no dimensions.', '(c) GM/R has dimensions [M⁻¹L³T⁻²][M]/[L] = [L²T⁻²], whose square root is [LT⁻¹], a speed.'),
  long(D(5, 1), 'Use dimensions to convert each.\n(a) 1 newton into dynes. [2]\n(b) A density of 1 g/cm³ into kg/m³. [1]\n(c) A power of 1 watt into erg/s. [2]', '(a) [MLT⁻²]: 1 N = 1 kg × 1 m × 1 s⁻² = 1000 g × 100 cm × 1 s⁻².', '(a) = 10⁵ g cm s⁻² = 10⁵ dyne.', '(b) [ML⁻³]: 1 g/cm³ = 10⁻³ kg/(10⁻⁶ m³) = 1000 kg/m³.', '(c) [ML²T⁻³]: 1 W = 1000 g × (100 cm)² × 1 s⁻³.', '(c) = 10⁷ erg/s.'),
  long(D(5, 2), 'The position of a particle is x = A sin ωt + Bt², with x in metres and t in seconds.\n(a) Find the dimensions of A, ω and B. [3]\n(b) Why must ωt have no dimensions? [1]\n(c) Find the dimensions of A/B. [1]', '(a) A sin ωt must be a length, and sin ωt is a pure number, so A is [L].', '(a) ωt has no dimensions, so ω is [T⁻¹].', '(a) Bt² is a length, so B is [LT⁻²].', '(b) The sine of a quantity can only be found for a pure number, an angle.', '(c) A/B = [L]/[LT⁻²] = [T²].'),

  tell(D(2, 1), 'Distinguish between the unit and the dimensions of a physical quantity, with force as an example.', 'A unit is a chosen amount of the quantity used to measure it: force is measured in newtons.', 'Dimensions show how the quantity is built from the base quantities: force is [MLT⁻²], whatever the units.'),

  match(D(4, 1), [['Force', '[MLT⁻²]'], ['Pressure', '[ML⁻¹T⁻²]'], ['Power', '[ML²T⁻³]'], ['Momentum', '[MLT⁻¹]']]),
  match(D(4, 2), [['Planck’s constant', '[ML²T⁻¹]'], ['The gravitational constant', '[M⁻¹L³T⁻²]'], ['The coefficient of viscosity', '[ML⁻¹T⁻¹]'], ['Surface tension', '[MT⁻²]']]),
  match(D(4, 1), [['Has the same dimensions as work', 'torque'], ['Has the same dimensions as momentum', 'impulse'], ['Has the same dimensions as pressure', 'stress'], ['Has the same dimensions as frequency', 'angular velocity']]),
];

export default questions;
