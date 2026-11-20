// Written by hand: purification and analysis of organic compounds, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('chemistry', 'XI');
const P = at(8, 'b');

const questions: BankDef[] = [
  figure(P(3, 2), 'The figure shows a paper chromatogram of a mixture, run until the solvent front was 10.0 cm above the base line. Find the Rf value of each spot, and say which substance is held more strongly by the paper.', ['Rf = distance moved by the spot/distance moved by the solvent.', 'Spot A: 7.5/10.0 = 0.75; spot B: 3.0/10.0 = 0.30.', 'B has the smaller Rf, so it is held more strongly by the stationary phase, the paper.'], {
    shown: sketch(300, 230, 'A strip of paper. A pencil base line near the bottom, where the mixture was spotted. A solvent front 10.0 cm above it. Spot A is 7.5 cm above the base line, and spot B is 3.0 cm above it.', [
      { t: 'box', x: 80, y: 10, w: 80, h: 210 }, line([[80, 200], [160, 200]], { dash: 1 }), line([[80, 30], [160, 30]], { dash: 1 }),
      { t: 'dot', x: 120, y: 72 }, { t: 'dot', x: 120, y: 149 }, label(132, 76, 'A', 'start'), label(132, 153, 'B', 'start'),
      label(166, 204, 'base line', 'start'), label(166, 34, 'solvent front', 'start'),
      line([[60, 200], [60, 30]]), label(54, 120, '10.0 cm', 'end'), label(230, 76, '7.5 cm up'), label(230, 153, '3.0 cm up'),
    ]),
  }),
  figure(P(3, 2), 'Draw a labelled diagram of fractional distillation, and say when it is used.', ['A flask heating the mixture, with a fractionating column above it packed with glass beads, and a thermometer at its top, level with the side arm.', 'A water-cooled condenser leading to a receiver.', 'It separates liquids whose boiling points are close together, as the vapour condenses and boils again many times up the column.'], {
    answer: sketch(340, 230, 'A round flask with a heater under it. A tall fractionating column stands on the flask, with a thermometer at its top level with a side arm. The side arm leads into a sloping condenser, with water in at the lower end and out at the upper end, and on into a receiving flask.', [
      { t: 'circle', x: 70, y: 170, r: 32 }, line([[46, 212], [94, 212]]), label(70, 226, 'heat'),
      { t: 'box', x: 62, y: 50, w: 16, h: 90 }, label(56, 100, 'column', 'end'), line([[70, 18], [70, 60]]), label(78, 20, 'thermometer', 'start'),
      line([[78, 60], [100, 60]]), line([[100, 54], [250, 130]]), line([[100, 70], [250, 146]]),
      arrow([200, 150], [200, 125]), label(200, 166, 'water in'), arrow([128, 66], [128, 42]), label(134, 42, 'water out', 'start'),
      { t: 'path', d: 'M250 140 L270 150 L270 176 Q 270 200, 290 200 Q 310 200, 310 176 L310 150' }, label(290, 226, 'receiver'),
    ]),
  }),
  figure(P(3, 2), 'The table gives the results of tests on the sodium extract of an organic compound. Which elements does it contain? Explain each.', ['Nitrogen: the Prussian blue colour shows cyanide ions, from nitrogen and carbon fused with sodium.', 'Sulphur: the violet colour with sodium nitroprusside shows sulphide ions.', 'Chlorine: a white precipitate with AgNO₃, soluble in ammonia, is AgCl; the extract was boiled with HNO₃ first, to remove cyanide and sulphide.'], {
    shown: table(['Test on the sodium extract', 'Result'], [['Boiled with FeSO₄, then FeCl₃ and acid added', 'Prussian blue colour'], ['Sodium nitroprusside added', 'violet colour'], ['Boiled with dilute HNO₃, then AgNO₃ added', 'white precipitate, soluble in ammonia']]),
  }),

  predict(P(2, 1), 'A mixture contains naphthalene and common salt. Predict a simple way to separate them, and why it works.', 'Sublimation: on gentle heating the naphthalene turns straight to vapour and collects as a solid on a cold surface.', 'Salt doesn’t sublime, so it is left behind.'),
  predict(P(2, 1), 'Propanone boils at 56 °C and ethanoic acid at 118 °C. Predict how a mixture of them can be separated.', 'By simple distillation.', 'Their boiling points are far apart, so the propanone boils off first and is condensed, leaving the ethanoic acid.'),
  predict(P(2, 2), 'An organic compound contains both nitrogen and sulphur. Predict what is seen when its sodium extract is tested with FeCl₃, and why.', 'A blood-red colour.', 'Fusion with sodium forms NaSCN, whose thiocyanate ions give red Fe(SCN)²⁺ with Fe³⁺.'),

  odd(P(2, 1), ['crystallisation', 'sublimation', 'distillation', 'Lassaigne’s test'], 'Lassaigne’s test', 'It is a test to detect elements; the others are methods of purification.'),
  odd(P(2, 2), ['chlorine', 'bromine', 'iodine', 'nitrogen'], 'nitrogen', 'It is estimated by the Dumas or Kjeldahl method; the others are estimated by the Carius method.'),
  odd(P(2, 2), ['aniline from water', 'essential oils from flowers', 'o-nitrophenol from p-nitrophenol', 'ethanol from water'], 'ethanol from water', 'It is separated by fractional distillation; the others by steam distillation.'),

  long(P(5, 3), 'In a Kjeldahl estimation, the ammonia from 0.50 g of an organic compound is passed into 50.0 cm³ of 0.50 M H₂SO₄. The acid left over needs 60.0 cm³ of 0.50 M NaOH.\n(a) What is the principle of the method? [1]\n(b) Find the moles of acid used by the ammonia. [2]\n(c) Find the percentage of nitrogen. [1]\n(d) Name another method of estimating nitrogen. [1]', '(a) The compound is heated with concentrated H₂SO₄, turning its nitrogen into ammonium sulphate; with alkali this gives ammonia, which is absorbed in a known amount of acid.', '(b) H⁺ taken = 2 × 0.050 × 0.50 = 0.050 mol; H⁺ left = 0.060 × 0.50 = 0.030 mol, from the NaOH.', '(b) H⁺ used by ammonia = 0.020 mol, so there was 0.020 mol of NH₃.', '(c) Mass of N = 0.020 × 14 = 0.28 g, so % N = 0.28/0.50 × 100 = 56%.', '(d) The Dumas method.'),
  long(P(5, 2), 'Answer each part on the Carius method.\n(a) What is its principle? [1]\n(b) 0.20 g of a compound gives 0.287 g of AgCl. Find the percentage of chlorine. [2]\n(c) 0.15 g of another compound gives 0.233 g of BaSO₄. Find the percentage of sulphur. [2]', '(a) The compound is heated with fuming HNO₃ in a sealed tube, turning its halogen into silver halide, with AgNO₃, or its sulphur into sulphuric acid, weighed as BaSO₄.', '(b) % Cl = (35.5/143.5) × (0.287/0.20) × 100.', '(b) = 35.5%.', '(c) % S = (32/233) × (0.233/0.15) × 100.', '(c) = 21.3%.'),

  tell(P(2, 1), 'Distinguish between crystallisation and sublimation as methods of purification.', 'In crystallisation, the impure solid is dissolved in a hot solvent, and pure crystals form as it cools, the impurities staying in solution.', 'In sublimation, a solid that turns straight to vapour on heating is separated from one that doesn’t, and collected on a cold surface.'),
  tell(P(2, 1), 'Distinguish between qualitative and quantitative analysis of an organic compound.', 'Qualitative analysis finds which elements are present, as in Lassaigne’s test.', 'Quantitative analysis finds how much of each is present, as a percentage by mass, as in the Kjeldahl or Carius method.'),

  match(P(4, 1), [['Separating aniline from water', 'steam distillation'], ['Purifying glycerol, which decomposes at its boiling point', 'distillation under reduced pressure'], ['Separating camphor from sand', 'sublimation'], ['Separating the fractions of petroleum', 'fractional distillation']]),
  match(P(4, 2), [['Nitrogen in the sodium extract', 'Prussian blue with FeSO₄ and FeCl₃'], ['Sulphur in the sodium extract', 'violet colour with sodium nitroprusside'], ['Chlorine in the sodium extract', 'white precipitate with AgNO₃, soluble in ammonia'], ['Nitrogen and sulphur together', 'blood-red colour with FeCl₃']]),
  match(P(4, 1), [['The Dumas method', 'nitrogen collected as N₂ gas'], ['The Kjeldahl method', 'nitrogen turned into ammonia'], ['The Carius method', 'halogens weighed as silver halide'], ['The Liebig method', 'carbon and hydrogen weighed as CO₂ and H₂O']]),

  reason(P(2, 2), 'Give reasons. (a) In Lassaigne’s test the compound is fused with sodium. (b) An Rf value is always less than 1.', '(a) Sodium turns the covalently bound N, S and halogens into ionic NaCN, Na₂S and NaX, which dissolve in water and can be tested for.', '(b) A spot can never move further than the solvent that carries it.'),
  reason(P(2, 2), 'Give reasons. (a) A liquid that decomposes at its boiling point is distilled under reduced pressure. (b) Crystals are washed with a little cold solvent after filtering.', '(a) Lowering the pressure lowers its boiling point, so it distils before it decomposes.', '(b) This removes the impure liquid on their surface without dissolving much of the crystals.'),

  short(P(2, 1), 'What is the Rf value of a substance? Find it for a spot 4.2 cm from the base line when the solvent front is 7.0 cm from it.', 'Rf is the distance moved by the substance divided by the distance moved by the solvent front, both from the base line.', 'Rf = 4.2/7.0 = 0.60.'),
  short(P(2, 1), 'Give two ways of checking that a solid organic compound is pure.', 'It melts sharply at its known melting point.', 'It gives a single spot on a paper or thin-layer chromatogram.'),

  ar(P(1, 2), 'Steam distillation lets aniline distil below 100 °C.', 'The mixture boils when the sum of the vapour pressures of water and aniline equals atmospheric pressure.', 1, 'Each liquid needs only part of the atmospheric pressure, so the mixture boils below the boiling point of either.'),
  ar(P(1, 1), 'Lassaigne’s test can detect nitrogen in hydrazine, NH₂NH₂.', 'The test needs carbon in the compound to form cyanide ions.', 4, 'Hydrazine has no carbon, so no NaCN forms, and the test fails.'),
  ar(P(1, 2), 'The Rf value of a substance depends on the solvent used.', 'Rf compares how far the substance moves with how far the solvent moves.', 2, 'Both are true, but Rf depends on the solvent because the substance’s solubility in it, against its hold on the paper, changes from solvent to solvent.'),
];

export default questions;
