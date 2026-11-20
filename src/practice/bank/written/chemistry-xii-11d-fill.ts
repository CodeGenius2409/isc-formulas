// Written by hand: qualitative analysis of a single salt, of each type the subtopic lacked, up to three. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, match } = kit('chemistry', 'XII');
const Q = at(11, 'd');

const questions: BankDef[] = [
  figure(Q(3, 1), 'Make a table sorting the anions of the syllabus by the first test that shows them: dilute H₂SO₄, concentrated H₂SO₄, or neither.', ['Dilute H₂SO₄ gives a gas with CO₃²⁻, SO₃²⁻, S²⁻, NO₂⁻ and CH₃COO⁻.', 'Concentrated H₂SO₄ is needed for Cl⁻, Br⁻, I⁻, NO₃⁻ and C₂O₄²⁻.', 'SO₄²⁻ and PO₄³⁻ give no gas with either, and are tested on their own.'], {
    answer: table(['First test', 'Anions shown'], [['Dilute H₂SO₄', 'CO₃²⁻, SO₃²⁻, S²⁻, NO₂⁻, CH₃COO⁻'], ['Concentrated H₂SO₄', 'Cl⁻, Br⁻, I⁻, NO₃⁻, C₂O₄²⁻'], ['Neither; tested on their own', 'SO₄²⁻, PO₄³⁻']]),
  }),
  figure(Q(3, 2), 'The table gives the results of tests on a white salt Y. Identify its anion and cation, and name Y.', ['The anion is CO₃²⁻: brisk effervescence with dilute acid, giving CO₂, which turns lime water milky.', 'The cation is Zn²⁺: a white sulphide in group IV, and a white hydroxide that dissolves in excess NaOH.', 'Y is zinc carbonate, ZnCO₃.'], {
    shown: table(['Test', 'Result'], [['Dilute H₂SO₄ added', 'brisk effervescence; the gas turns lime water milky'], ['Groups I to III reagents', 'no precipitate'], ['H₂S in ammoniacal solution', 'white precipitate'], ['NaOH added drop by drop, then in excess', 'white precipitate, which dissolves in excess']]),
  }),
  figure(Q(2, 1), 'Draw how a flame test is carried out, labelling the parts.', ['A platinum or nichrome wire, cleaned by dipping in concentrated HCl, is dipped in a paste of the salt with concentrated HCl.', 'It is held at the edge of the hottest, non-luminous part of a Bunsen flame, and the colour of the flame is seen.'], {
    answer: sketch(280, 220, 'A Bunsen burner with a tall, non-luminous flame. A wire with a loop at its end, held in a glass handle, is pushed into the edge of the flame. The loop carries a paste of the salt with concentrated HCl.', [
      { t: 'box', x: 110, y: 150, w: 20, h: 50 }, line([[90, 200], [150, 200]]), label(120, 216, 'Bunsen burner'),
      { t: 'path', d: 'M108 150 Q 100 100, 120 40 Q 140 100, 132 150' },
      line([[240, 80], [180, 110], [136, 112]]), { t: 'circle', x: 132, y: 112, r: 4 }, label(276, 70, 'wire in glass handle', 'end'),
      label(146, 132, 'salt paste on loop', 'start'), label(10, 40, 'non-luminous', 'start'), label(10, 56, 'flame', 'start'),
    ]),
  }),

  predict(Q(2, 2), 'A pink salt gives a black precipitate with H₂S in ammoniacal solution, and a blue borax bead. Predict the cation, and one more test to confirm it.', 'The cation is Co²⁺.', 'With potassium thiocyanate and amyl alcohol, it gives a blue colour in the alcohol layer.'),

  odd(Q(2, 1), ['Zn²⁺', 'Mn²⁺', 'Ni²⁺', 'Ca²⁺'], 'Ca²⁺', 'It is in group V; the others are in group IV.'),
  odd(Q(2, 2), ['ZnS', 'MnS', 'NiS', 'CuS'], 'CuS', 'It is precipitated in group II, from acid solution; the others only in group IV, from ammoniacal solution.'),
  odd(Q(2, 1), ['dimethylglyoxime', 'potassium thiocyanate', 'potassium hexacyanoferrate(II)', 'lime water'], 'lime water', 'It tests a gas, CO₂; the others confirm cations.'),

  long(Q(5, 2), 'Answer each part on confirming cations of groups III and IV.\n(a) A group III precipitate may be Fe(OH)₃ or Al(OH)₃. How are they told apart and confirmed? [2]\n(b) How is Zn²⁺ confirmed? [1]\n(c) How are Ni²⁺ and Co²⁺ confirmed? [2]', '(a) Fe(OH)₃ is reddish brown; dissolved in HCl, it gives a blood-red colour with KSCN, or Prussian blue with K₄[Fe(CN)₆].', '(a) Al(OH)₃ is white and jelly-like, and dissolves in excess NaOH; the blue lake test, with litmus, confirms it.', '(b) The white sulphide dissolves in HCl; with NaOH this gives a white precipitate that dissolves in excess, or a white precipitate with K₄[Fe(CN)₆].', '(c) Ni²⁺: a rose-red precipitate with dimethylglyoxime and ammonia.', '(c) Co²⁺: a blue borax bead, or a blue colour with KSCN in amyl alcohol.'),
  long(Q(5, 3), 'Answer each part on oxalate, phosphate and acetate.\n(a) Why must oxalate and phosphate be removed before cations of group III onwards are tested? [2]\n(b) Give a test for oxalate. [1]\n(c) Give a test for phosphate. [1]\n(d) Give a test for acetate with neutral FeCl₃. [1]', '(a) In the ammoniacal solution used from group III on, they precipitate cations of groups III to VI as oxalates and phosphates.', '(a) These would come down in the wrong group, and give false results.', '(b) With CaCl₂, a white precipitate of calcium oxalate, which decolourises warm acidified KMnO₄.', '(c) With magnesia mixture, a white crystalline precipitate of MgNH₄PO₄.', '(d) A deep red colour, which gives a reddish-brown precipitate on boiling.'),

  match(Q(4, 1), [['Ni²⁺', 'rose-red precipitate with dimethylglyoxime'], ['Fe³⁺', 'blood-red colour with KSCN'], ['Cu²⁺', 'chocolate precipitate with K₄[Fe(CN)₆]'], ['Zn²⁺', 'white precipitate with K₄[Fe(CN)₆]']]),
  match(Q(4, 1), [['Group IV reagent', 'H₂S in ammoniacal solution'], ['Group VI', 'no group reagent; Mg²⁺ is tested directly'], ['Zero group', 'NaOH, warmed, for NH₄⁺'], ['Group II reagent', 'H₂S in acid solution']]),
  match(Q(4, 2), [['Violet vapours with concentrated H₂SO₄', 'I⁻'], ['Reddish-brown vapours with concentrated H₂SO₄', 'Br⁻'], ['A colourless gas that fumes with ammonia', 'Cl⁻'], ['CO₂ with a gas that burns with a blue flame', 'C₂O₄²⁻']]),
];

export default questions;
