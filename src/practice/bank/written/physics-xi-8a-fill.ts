// Written by hand: thermal properties of matter, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The heating curve is drawn for steady heating, not to scale: the boiling flat is drawn longer than the melting flat, as the latent heats are.
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, ar, derive } = kit('physics', 'XI');
const H = at(8, 'a');

const questions: BankDef[] = [
  figure(H(3, 2), 'Ice at −20 °C is heated steadily until it has become steam above 100 °C. The graph shows its temperature against time. Explain the sloping and flat parts, and why the second flat part is longer than the first.', ['On the sloping parts the heat raises the temperature of the ice, the water or the steam.', 'On the flat parts, at 0 °C and 100 °C, the heat goes into changing the state, as latent heat, so the temperature doesn’t rise.', 'The flat part at 100 °C is longer because the specific latent heat of vaporisation of water is about seven times that of fusion of ice.'], {
    shown: graph('time (min)', 'temperature (°C)', [{ points: [[0, -20], [1, 0], [9, 0], [19, 100], [45, 100], [47, 120]] }], { x: [[10, '10'], [20, '20'], [30, '30'], [40, '40']], y: [[0, '0'], [100, '100']], yFrom: -30 }),
  }),
  figure(H(3, 2), 'Sketch, on the same axes, how the energy radiated by a black body is spread over wavelength at two temperatures, and use it to explain Wien’s displacement law.', ['Each curve rises from zero to a peak at a wavelength λm, and then falls slowly.', 'The hotter body’s curve is higher everywhere, as it radiates far more energy in all.', 'Its peak is at a shorter wavelength: λm T is constant, which is Wien’s displacement law.'], {
    answer: sketch(340, 220, 'Axes of energy radiated against wavelength. Two humped curves. The hotter one, T2, is much taller with its peak further left, at a shorter wavelength. The cooler one, T1, is lower with its peak further right. Dashed lines drop from each peak to the wavelength axis.', [
      arrow([50, 190], [330, 190]), arrow([50, 190], [50, 14]), label(326, 208, 'wavelength', 'end'), label(56, 18, 'energy', 'start'),
      { t: 'path', d: 'M56 188 C 76 40, 104 30, 130 70 S 220 150, 320 172' }, { t: 'path', d: 'M60 189 C 110 160, 140 140, 170 142 S 260 180, 320 186', dash: 1 },
      line([[102, 52], [102, 190]], { dash: 1 }), line([[160, 143], [160, 190]], { dash: 1 }),
      label(110, 48, 'T₂, hotter', 'start'), label(166, 136, 'T₁', 'start'), label(102, 206, 'λm₂'), label(160, 206, 'λm₁'),
    ]),
  }),
  figure(H(3, 2), 'A straight bimetallic strip of brass and iron, riveted together, is heated, and bends as shown. Which metal is on the outside of the curve, and why? Give one use of such a strip.', ['Brass is on the outside of the curve.', 'Brass expands more than iron for the same rise in temperature, so its side becomes longer and the strip bends with brass on the longer, outer side.', 'It is used in a thermostat, where the bending strip breaks a circuit when it gets too hot.'], {
    shown: sketch(320, 160, 'On the left, a straight strip made of two metals, brass on top and iron underneath, at room temperature. On the right, the same strip after heating, bent into an arch that bows upwards, the brass still on top.', [
      { t: 'box', x: 20, y: 50, w: 120, h: 8 }, { t: 'box', x: 20, y: 58, w: 120, h: 8 }, label(80, 40, 'brass'), label(80, 84, 'iron'), label(80, 120, 'cold'),
      { t: 'path', d: 'M180 70 Q 240 30, 300 70' }, { t: 'path', d: 'M180 78 Q 240 38, 300 78' }, { t: 'path', d: 'M180 86 Q 240 46, 300 86' },
      line([[180, 70], [180, 86]]), line([[300, 70], [300, 86]]), label(240, 120, 'heated'),
    ]),
  }),

  predict(H(2, 1), 'A metal plate with a round hole in it is heated. Predict what happens to the size of the hole.', 'The hole gets larger.', 'Every part of the plate expands in the same proportion, as if the hole were filled with the same metal, which would expand too.'),
  predict(H(2, 1), 'Two equal cans of hot water, one painted dull black and one polished shiny, are left to cool. Predict which cools faster, and why.', 'The dull black can cools faster.', 'A dull black surface is a better emitter of radiation than a shiny one.'),
  predict(H(2, 2), '200 g of water at 80 °C is mixed with 300 g of water at 20 °C. Predict the final temperature, ignoring heat losses.', 'Heat lost = heat gained: 200 × (80 − T) = 300 × (T − 20).', '16 000 + 6000 = 500T, so T = 44 °C.'),

  odd(H(2, 1), ['copper', 'silver', 'aluminium', 'wood'], 'wood', 'It is a poor conductor of heat; the others are good conductors.'),
  odd(H(2, 1), ['land and sea breezes', 'a room heater warming a room', 'water circulating in a pan on a stove', 'the Sun warming the Earth'], 'the Sun warming the Earth', 'It happens by radiation, through empty space; the others happen by convection.'),
  odd(H(2, 2), ['linear expansivity', 'area expansivity', 'volume expansivity', 'thermal conductivity'], 'thermal conductivity', 'Its unit is W m⁻¹ K⁻¹; the others are measures of expansion, in K⁻¹.'),

  long(H(5, 2), '0.50 kg of copper at 200 °C is dropped into 1.0 kg of water at 20 °C in a calorimeter of negligible heat capacity. The specific heat capacities of copper and water are 400 and 4200 J kg⁻¹ K⁻¹.\n(a) State the principle of calorimetry. [1]\n(b) Write the heat lost by the copper and the heat gained by the water, if the final temperature is T. [2]\n(c) Find T. [1]\n(d) Give one reason the measured T would be a little lower. [1]', '(a) When hot and cold bodies are mixed, with no heat lost, the heat lost by the hot body equals the heat gained by the cold one.', '(b) Heat lost by copper = 0.50 × 400 × (200 − T).', '(b) Heat gained by water = 1.0 × 4200 × (T − 20).', '(c) 40 000 − 200T = 4200T − 84 000, so T = 124 000/4400 = 28 °C.', '(d) Some heat is lost to the air as the copper is moved, or to the calorimeter itself.'),
  long(H(5, 2), '2.0 kg of ice at −10 °C is turned into water at 50 °C. Take the specific heat capacities of ice and water as 2100 and 4200 J kg⁻¹ K⁻¹, and the specific latent heat of fusion as 3.36 × 10⁵ J/kg.\n(a) Find the heat needed for each stage. [3]\n(b) Find the total. [1]\n(c) Which stage needs the most heat? [1]', '(a) Warming the ice to 0 °C: 2.0 × 2100 × 10 = 42 000 J.', '(a) Melting it: 2.0 × 3.36 × 10⁵ = 672 000 J.', '(a) Warming the water to 50 °C: 2.0 × 4200 × 50 = 420 000 J.', '(b) 42 000 + 672 000 + 420 000 = 1.134 × 10⁶ J.', '(c) Melting the ice.'),
  long(H(5, 2), 'Answer each part.\n(a) A copper rod 0.50 m long, of cross-section 2.0 × 10⁻⁴ m², has its ends at 100 °C and 0 °C. Find the rate of flow of heat along it, if k = 400 W m⁻¹ K⁻¹. [2]\n(b) By what factor does the power radiated by a black body grow when its kelvin temperature is doubled? [1]\n(c) The Sun’s radiation peaks at about 500 nm. Find its surface temperature, taking Wien’s constant as 2.9 × 10⁻³ m K. [2]', '(a) Q/t = kAΔT/L.', '(a) = 400 × 2.0 × 10⁻⁴ × 100/0.50 = 16 W.', '(b) By Stefan’s law, power ∝ T⁴, so by 2⁴ = 16.', '(c) T = b/λm.', '(c) = 2.9 × 10⁻³/(500 × 10⁻⁹) = 5800 K.'),

  tell(H(2, 1), 'Distinguish between heat capacity and specific heat capacity.', 'Heat capacity is the heat needed to raise the temperature of a whole body by 1 K, in J/K; it depends on the body’s mass.', 'Specific heat capacity is the heat needed to raise 1 kg of a substance by 1 K, in J kg⁻¹ K⁻¹; it depends only on the substance.'),
  tell(H(2, 1), 'Distinguish between conduction and radiation.', 'In conduction, heat passes through a material from particle to particle, without the material moving; it needs a medium.', 'In radiation, heat travels as electromagnetic waves, which need no medium and cross empty space at the speed of light.'),

  match(H(4, 1), [['Wien’s displacement law', 'λm T = constant'], ['Stefan’s law', 'power radiated ∝ T⁴'], ['Rate of conduction through a rod', 'kAΔT/L'], ['The principle of calorimetry', 'heat lost = heat gained']]),
  match(H(4, 2), [['Specific heat capacity of water', '4200 J kg⁻¹ K⁻¹'], ['Specific latent heat of fusion of ice', '3.36 × 10⁵ J/kg'], ['Specific latent heat of vaporisation of water', '2.26 × 10⁶ J/kg'], ['Wien’s constant', '2.9 × 10⁻³ m K']]),
  match(H(4, 2), [['Linear expansivity α', 'ΔL/(LΔT)'], ['Area expansivity β', '2α'], ['Volume expansivity γ', '3α'], ['Water between 0 °C and 4 °C', 'contracts as it warms']]),

  ar(H(1, 1), 'Water is densest at 4 °C.', 'Water contracts when it is warmed from 0 °C to 4 °C.', 1, 'It shrinks as it warms to 4 °C and expands above it, so its volume is least, and density greatest, at 4 °C.'),
  ar(H(1, 1), 'A metal feels colder to the touch than wood in the same room.', 'The metal is at a lower temperature than the wood.', 3, 'Both are at the same temperature; the metal feels colder because it conducts heat away from the hand faster.'),
  ar(H(1, 2), 'The peak of a star’s spectrum moves to shorter wavelengths as the star gets hotter.', 'The product of λm and the kelvin temperature is constant.', 1, 'This is Wien’s displacement law: λm = b/T falls as T rises.'),

  derive(H(3, 2), 'Show that the area expansivity β of a solid is twice its linear expansivity α.', ['A square plate of side L, heated through ΔT, has side L(1 + αΔT).', 1], ['Its area becomes L²(1 + αΔT)² = L²(1 + 2αΔT + α²ΔT²).', 1], ['α²ΔT² is negligible, so ΔA = 2αL²ΔT, and β = ΔA/(AΔT) = 2α.', 1]),
  derive(H(3, 2), 'Show that the volume expansivity γ of a solid is three times its linear expansivity α.', ['A cube of side L, heated through ΔT, has side L(1 + αΔT).', 1], ['Its volume becomes L³(1 + αΔT)³ = L³(1 + 3αΔT + …).', 1], ['Ignoring higher powers of αΔT, ΔV = 3αL³ΔT, so γ = ΔV/(VΔT) = 3α.', 1]),
  derive(H(3, 1), 'Masses m₁ and m₂ of water at temperatures t₁ and t₂, with t₁ > t₂, are mixed. Show that, with no heat lost, the final temperature is (m₁t₁ + m₂t₂)/(m₁ + m₂).', ['Heat lost by the hot water = m₁c(t₁ − T), and heat gained by the cold = m₂c(T − t₂).', 1], ['By the principle of calorimetry, m₁c(t₁ − T) = m₂c(T − t₂), and c cancels.', 1], ['m₁t₁ + m₂t₂ = (m₁ + m₂)T, so T = (m₁t₁ + m₂t₂)/(m₁ + m₂).', 1]),
];

export default questions;
