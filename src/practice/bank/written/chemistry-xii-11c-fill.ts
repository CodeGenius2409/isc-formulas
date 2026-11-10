// Written by hand: identifying functional groups in practical work, of each type the subtopic lacked, up to three. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, match, reason, short, ar } = kit('chemistry', 'XII');
const P = at(11, 'c');

/** A scheme of three tests, top to bottom, ending in the compounds named as given. */
const scheme = (p: string, q: string, r: string): SketchMark[] => [
  label(110, 24, 'Test with NaHCO₃'), arrow([150, 30], [230, 56]), label(196, 34, 'fizzes', 'start'), label(240, 66, p, 'start'),
  arrow([110, 30], [110, 70]), label(116, 54, 'no fizz', 'start'),
  label(110, 84, 'Test with 2,4-DNP'), arrow([110, 90], [110, 130]), label(116, 114, 'orange precipitate', 'start'),
  label(110, 144, 'Test with Tollens’ reagent'), arrow([150, 150], [230, 176]), label(196, 154, 'mirror', 'start'), label(240, 186, q, 'start'),
  arrow([110, 150], [110, 190]), label(116, 174, 'no mirror', 'start'), label(110, 206, r),
];

const questions: BankDef[] = [
  figure(P(3, 2), 'The scheme shows tests used to sort benzoic acid, formaldehyde and acetone. Name P, Q and R, and the group each test shows.', ['P is benzoic acid: fizzing with NaHCO₃ shows a –COOH group.', 'Q is formaldehyde: an orange precipitate with 2,4-DNP shows a carbonyl group, and the silver mirror an aldehyde.', 'R is acetone: a carbonyl group that gives no silver mirror is a ketone.'], {
    shown: sketch(340, 215, 'A scheme of tests from top to bottom. Testing with sodium hydrogencarbonate: if it fizzes, the compound is P. If not, testing with 2,4-DNP gives an orange precipitate; then testing with Tollens’ reagent: if a silver mirror forms, the compound is Q; if not, it is R.', scheme('P', 'Q', 'R')),
    answer: sketch(340, 215, 'The same scheme with the compounds named: P is benzoic acid, Q is formaldehyde and R is acetone.', scheme('benzoic acid', 'formaldehyde', 'acetone')),
  }),
  figure(P(3, 1), 'Make a table giving one test, and what is seen, for glycerol, glucose and powdered milk.', ['Glycerol heated with solid KHSO₄ gives the sharp, irritating smell of acrolein.', 'Glucose warmed with Fehling’s solution gives a red precipitate.', 'Powdered milk in the biuret test, with NaOH and then a drop of dilute CuSO₄, gives a violet colour.'], {
    answer: table(['Substance', 'Test', 'What is seen'], [['Glycerol', 'heated with solid KHSO₄', 'sharp smell of acrolein'], ['Glucose', 'warmed with Fehling’s solution', 'red precipitate'], ['Powdered milk', 'NaOH, then a drop of dilute CuSO₄', 'violet colour']]),
  }),
  figure(P(2, 1), 'Draw how the silver mirror test is carried out on formaldehyde, and say what shows a positive result.', ['A test tube of Tollens’ reagent with a little formaldehyde stands in a beaker of warm water, a water bath.', 'A shiny silver mirror forms on the inside of the tube, as the aldehyde reduces Ag⁺ to silver.'], {
    answer: sketch(390, 200, 'A beaker of warm water. A test tube stands in it, holding Tollens’ reagent and formaldehyde. Labels point to the warm water bath and to the silver mirror on the inside wall of the tube.', [
      line([[40, 70], [40, 180], [160, 180], [160, 70]]), line([[40, 100], [160, 100]], { dash: 1 }),
      { t: 'path', d: 'M88 30 L88 150 A 12 12 0 0 0 112 150 L112 30' }, line([[88, 120], [112, 120]], { dash: 1 }),
      line([[160, 140], [196, 140]]), label(200, 144, 'warm water bath', 'start'),
      line([[112, 134], [196, 96]]), label(200, 100, 'silver mirror on the wall', 'start'),
      line([[100, 30], [196, 40]]), label(200, 44, 'Tollens’ + formaldehyde', 'start'),
    ]),
  }),

  predict(P(2, 2), 'A few drops of acetone are added to sodium nitroprusside solution, and the mixture is made alkaline with NaOH. Predict what is seen.', 'A red colour appears.', 'This is the test for a methyl ketone, such as acetone.'),
  predict(P(2, 1), 'A solution of powdered milk is made alkaline with NaOH, and a drop of dilute copper sulphate is added. Predict what is seen, and what it shows.', 'A violet colour appears.', 'It shows peptide bonds, so protein is present: the biuret test.'),

  odd(P(2, 1), ['Tollens’ reagent', 'Fehling’s solution', 'Schiff’s reagent', 'sodium hydrogencarbonate'], 'sodium hydrogencarbonate', 'It tests for a –COOH group; the others test for an aldehyde.'),
  odd(P(2, 1), ['glycerol', 'formaldehyde', 'acetone', 'benzene'], 'benzene', 'It has no functional group to test for; each of the others has one.'),
  odd(P(2, 2), ['the biuret test', 'Fehling’s test', 'Tollens’ test', 'Schiff’s test'], 'the biuret test', 'It detects proteins; the others detect a –CHO group, as in glucose or formaldehyde.'),

  long(P(5, 2), 'Answer each part on formaldehyde and acetone.\n(a) Give a test that both give, and what is seen. [2]\n(b) Give two tests that formaldehyde gives but acetone doesn’t, and what is seen. [2]\n(c) Why does only formaldehyde give the tests in (b)? [1]', '(a) Both have a carbonyl group, so both give an orange precipitate with 2,4-DNP.', '(a) The precipitate is the 2,4-dinitrophenylhydrazone.', '(b) Tollens’ reagent, warmed: a silver mirror.', '(b) Fehling’s solution, warmed: a red precipitate.', '(c) An aldehyde has a hydrogen on its carbonyl carbon and is easily oxidised, so it reduces these reagents; a ketone hasn’t.'),
  long(P(5, 2), 'Answer each part on benzoic acid and aniline.\n(a) Give a test for benzoic acid, with what is seen and the equation. [2]\n(b) Give the carbylamine test for aniline, with what is noticed. [2]\n(c) How does each behave with dilute acid and dilute alkali? [1]', '(a) Adding sodium hydrogencarbonate solution gives brisk effervescence of CO₂.', '(a) C₆H₅COOH + NaHCO₃ → C₆H₅COONa + H₂O + CO₂.', '(b) Aniline is warmed with chloroform and alcoholic KOH.', '(b) A very offensive smell of phenyl isocyanide shows a primary amine.', '(c) Benzoic acid dissolves in dilute NaOH, forming a salt; aniline dissolves in dilute HCl, forming anilinium chloride.'),
  long(P(5, 2), 'Answer each part on glucose and protein.\n(a) Describe Fehling’s test on glucose, and what is seen. [2]\n(b) Describe the biuret test on powdered milk, and what is seen. [2]\n(c) Why does glucose give Fehling’s test? [1]', '(a) Equal volumes of Fehling’s solutions A and B are mixed, the glucose solution is added, and the mixture is warmed.', '(a) A red precipitate of copper(I) oxide forms.', '(b) The milk is shaken with water, made alkaline with NaOH, and a drop of dilute CuSO₄ is added.', '(b) A violet colour appears.', '(c) In solution some glucose is in its open form, with a free –CHO group, which reduces Cu²⁺ to copper(I) oxide.'),

  match(P(4, 1), [['Glycerol', 'the acrolein test with KHSO₄'], ['Formaldehyde', 'a silver mirror with Tollens’ reagent'], ['Acetone', 'a red colour with sodium nitroprusside and NaOH'], ['Aniline', 'an orange dye with nitrous acid and then β-naphthol']]),
  match(P(4, 1), [['Benzoic acid with NaHCO₃', 'brisk effervescence'], ['Glucose with Fehling’s solution', 'a red precipitate'], ['Milk in the biuret test', 'a violet colour'], ['Aniline with bromine water', 'a white precipitate']]),

  reason(P(2, 2), 'Why must Tollens’ reagent be made fresh, and not kept?', 'On standing, it can form silver compounds that explode easily.', 'So it is made just before use, and washed away afterwards.'),

  short(P(2, 1), 'Describe the acrolein test for glycerol, and what is noticed.', 'A little glycerol is heated with solid potassium hydrogensulphate.', 'A sharp, irritating smell of acrolein is given off.'),
  short(P(2, 1), 'Describe Schiff’s test for an aldehyde, and what is seen.', 'A few drops of the compound are added to Schiff’s reagent, which is colourless.', 'A pink to magenta colour appears with an aldehyde.'),

  ar(P(1, 1), 'Acetone gives an orange precipitate with 2,4-DNP.', 'Acetone has a carbonyl group.', 1, '2,4-DNP reacts with the carbonyl group of aldehydes and ketones.'),
];

export default questions;
