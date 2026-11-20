// Written by hand: qualitative analysis of a single salt, of each type the subtopic lacked, up to three. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('chemistry', 'XI');
const Q = at(10, 'b');

const questions: BankDef[] = [
  figure(Q(3, 1), 'Make a table of the cation groups 0 to VI, giving the group reagent and the cations of the syllabus found in each.', ['Group 0: NH₄⁺, tested with NaOH on warming; group I: Pb²⁺, with dilute HCl; group II: Cu²⁺ and Pb²⁺, with H₂S in dilute HCl.', 'Group III: Fe³⁺ and Al³⁺, with NH₄OH and NH₄Cl; group IV: Zn²⁺, Mn²⁺, Ni²⁺ and Co²⁺, with H₂S in ammoniacal solution.', 'Group V: Ba²⁺, Sr²⁺ and Ca²⁺, with (NH₄)₂CO₃; group VI: Mg²⁺, with no group reagent.'], {
    answer: table(['Group', 'Reagent', 'Cations'], [['0', 'NaOH, warmed', 'NH₄⁺'], ['I', 'dilute HCl', 'Pb²⁺'], ['II', 'H₂S in dilute HCl', 'Cu²⁺, Pb²⁺'], ['III', 'NH₄OH with NH₄Cl', 'Fe³⁺, Al³⁺'], ['IV', 'H₂S in ammoniacal solution', 'Zn²⁺, Mn²⁺, Ni²⁺, Co²⁺'], ['V', '(NH₄)₂CO₃ with NH₄OH and NH₄Cl', 'Ba²⁺, Sr²⁺, Ca²⁺'], ['VI', 'none', 'Mg²⁺']]),
  }),
  figure(Q(3, 2), 'The table gives the results of tests on a salt X. Identify its anion and cation, and name X.', ['The anion is NO₃⁻: brown fumes with concentrated H₂SO₄ and copper, and a brown ring with FeSO₄.', 'The cation is in group V, from the white precipitate with (NH₄)₂CO₃, and the crimson flame shows Sr²⁺.', 'X is strontium nitrate, Sr(NO₃)₂.'], {
    shown: table(['Test', 'Result'], [['Dilute H₂SO₄ added', 'no gas'], ['Concentrated H₂SO₄ and copper turnings, warmed', 'brown fumes'], ['Fresh FeSO₄, then concentrated H₂SO₄ down the side', 'a brown ring'], ['Groups I to IV reagents', 'no precipitate'], ['(NH₄)₂CO₃ with NH₄OH and NH₄Cl', 'white precipitate'], ['Flame test', 'crimson flame']]),
  }),
  figure(Q(2, 1), 'Draw a test tube showing a positive brown ring test for a nitrate, labelling the layers.', ['The salt solution with fresh FeSO₄ sits above a layer of concentrated H₂SO₄ poured carefully down the side, which sinks to the bottom.', 'A brown ring of [Fe(H₂O)₅NO]²⁺ forms where the two layers meet.'], {
    answer: sketch(260, 220, 'A test tube with two layers. The lower layer is concentrated sulphuric acid. The upper layer is the salt solution with iron(II) sulphate. A dark band, the brown ring, lies where they meet.', [
      { t: 'path', d: 'M100 20 L100 180 Q 100 200, 120 200 Q 140 200, 140 180 L140 20' },
      line([[100, 130], [140, 130]]), { t: 'shade', p: [[100, 124], [140, 124], [140, 134], [100, 134]] },
      line([[100, 70], [140, 70]], { dash: 1 }),
      label(148, 100, 'solution + FeSO₄', 'start'), label(148, 132, 'brown ring', 'start'), label(148, 170, 'conc. H₂SO₄', 'start'),
    ]),
  }),

  predict(Q(2, 1), 'An ammonium salt is warmed with NaOH solution, and moist red litmus paper is held at the mouth of the tube. Predict what is seen.', 'The red litmus turns blue, and a smell of ammonia is noticed.', 'NH₄⁺ + OH⁻ → NH₃ + H₂O; the ammonia gas is alkaline.'),
  predict(Q(2, 1), 'H₂S is passed through an acidified solution containing Cu²⁺ ions. Predict what is seen.', 'A black precipitate forms.', 'It is copper(II) sulphide, CuS, a group II sulphide insoluble even in acid.'),

  odd(Q(2, 1), ['Ba²⁺', 'Sr²⁺', 'Ca²⁺', 'Mg²⁺'], 'Mg²⁺', 'It is in group VI; the others are precipitated as carbonates in group V.'),
  odd(Q(2, 1), ['CO₃²⁻', 'SO₃²⁻', 'S²⁻', 'SO₄²⁻'], 'SO₄²⁻', 'It gives no gas with dilute H₂SO₄; the others do.'),
  odd(Q(2, 1), ['Cl⁻', 'Br⁻', 'I⁻', 'NO₃⁻'], 'NO₃⁻', 'It gives no precipitate with silver nitrate; the others do.'),

  long(Q(5, 2), 'Answer each part on tests for anions.\n(a) Give the confirmatory test for a sulphate. [1]\n(b) How does a chloride behave with AgNO₃ and then ammonia? [1]\n(c) Describe the chromyl chloride test. [2]\n(d) Why don’t bromides and iodides give this test? [1]', '(a) With BaCl₂ solution, a white precipitate of BaSO₄ that doesn’t dissolve in concentrated HCl.', '(b) A white precipitate of AgCl, which dissolves in ammonia solution.', '(c) The salt is heated with solid K₂Cr₂O₇ and concentrated H₂SO₄, giving red vapours of chromyl chloride, CrO₂Cl₂.', '(c) Passed into NaOH, these give a yellow solution of chromate, which gives a yellow precipitate of PbCrO₄ with lead acetate.', '(d) They don’t form a chromyl compound; they are oxidised to free bromine or iodine instead.'),
  long(Q(5, 2), 'Answer each part on group II cations.\n(a) Name the group reagent. [1]\n(b) Give the colours of the sulphides of Cu²⁺ and Pb²⁺. [1]\n(c) How is Cu²⁺ confirmed? [2]\n(d) How is Pb²⁺ confirmed? [1]', '(a) H₂S gas passed through the solution acidified with dilute HCl.', '(b) Both CuS and PbS are black.', '(c) With excess NH₄OH, Cu²⁺ gives a deep blue solution of [Cu(NH₃)₄]²⁺.', '(c) With potassium ferrocyanide, it gives a chocolate-brown precipitate.', '(d) With potassium iodide or potassium chromate, it gives a yellow precipitate, PbI₂ or PbCrO₄.'),
  long(Q(5, 1), 'Answer each part on group V cations.\n(a) Give the flame colours of Ba²⁺, Sr²⁺ and Ca²⁺. [3]\n(b) Name the group reagent. [1]\n(c) Why must groups I to IV be removed before group V is tested? [1]', '(a) Ba²⁺: apple green.', '(a) Sr²⁺: crimson.', '(a) Ca²⁺: brick red.', '(b) (NH₄)₂CO₃, with NH₄Cl and NH₄OH.', '(c) Cations of the earlier groups would also be precipitated as carbonates, and confuse the result.'),

  tell(Q(2, 1), 'Distinguish between Fe³⁺ and Al³⁺ by their group III precipitates.', 'Fe³⁺ gives a reddish-brown precipitate of Fe(OH)₃ with NH₄OH and NH₄Cl.', 'Al³⁺ gives a white, jelly-like precipitate of Al(OH)₃.'),

  match(Q(4, 1), [['Brisk effervescence that turns lime water milky', 'CO₃²⁻'], ['A rotten-egg gas that blackens lead acetate paper', 'S²⁻'], ['A vinegar smell with dilute H₂SO₄', 'CH₃COO⁻'], ['A brown ring with FeSO₄ and concentrated H₂SO₄', 'NO₃⁻']]),
  match(Q(4, 1), [['Group I', 'dilute HCl'], ['Group II', 'H₂S in dilute HCl'], ['Group III', 'NH₄OH with NH₄Cl'], ['Group V', '(NH₄)₂CO₃ with NH₄OH and NH₄Cl']]),
  match(Q(4, 1), [['Ba²⁺', 'apple-green flame'], ['Sr²⁺', 'crimson flame'], ['Ca²⁺', 'brick-red flame'], ['Cu²⁺', 'bluish-green flame']]),

  reason(Q(2, 2), 'Give a reason: Pb²⁺ may be found in both group I and group II.', 'PbCl₂ is only slightly soluble in cold water, so not all the lead is precipitated in group I.', 'The Pb²⁺ left in solution is precipitated as black PbS with H₂S in group II.'),

  short(Q(2, 1), 'How is the NH₄⁺ ion confirmed with Nessler’s reagent?', 'Nessler’s reagent, an alkaline solution of K₂HgI₄, is added to the salt solution.', 'A brown precipitate, or a brown colour, shows NH₄⁺.'),

  ar(Q(1, 2), 'A nitrite gives brown fumes with dilute H₂SO₄.', 'Dilute acid breaks down NO₂⁻ to NO, which turns into brown NO₂ in air.', 1, 'A nitrate needs concentrated acid, so this tells a nitrite from a nitrate.'),
];

export default questions;
