// Written by hand: carboxylic acids, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// Solubilities in water near 20–25 °C, in g per 100 mL: pentanoic acid 5.0, hexanoic acid 1.1, benzoic acid 0.34; ethanoic acid mixes in all proportions.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const A = at(8, 'b');

/** Three reactions of benzoic acid, one to a row, with the products named as given. */
const rows = (p: string, q: string, r: string): SketchMark[] => [
  ['conc. HNO₃, conc. H₂SO₄', p], ['LiAlH₄, then H₂O', q], ['C₂H₅OH, conc. H₂SO₄', r],
].flatMap(([reagent, product], i) => {
  const y = 34 + i * 50;
  return [label(50, y + 5, 'C₆H₅COOH'), arrow([95, y], [245, y]), label(170, y - 8, reagent), label(255, y + 5, product, 'start')];
});

const questions: BankDef[] = [
  figure(A(2, 2), 'Draw the hydrogen-bonded dimer that ethanoic acid forms, and say how it affects the acid’s boiling point.', ['Two molecules face each other, the O–H of each hydrogen bonded to the C=O oxygen of the other, making a ring.', 'Each unit behaves like a molecule of twice the mass, held by two hydrogen bonds, so ethanoic acid boils higher than alcohols of similar mass.'], {
    answer: sketch(320, 160, 'Two ethanoic acid molecules side by side. In each, a CH₃ group is bonded to a carbon that carries a C=O oxygen and an O–H group. The H of each O–H points at the C=O oxygen of the other molecule, and the two hydrogen bonds are drawn as dashed lines, closing a ring.', [
      label(36, 85, 'CH₃'), line([[54, 80], [80, 80]]), label(90, 85, 'C'),
      line([[95, 72], [116, 50]]), line([[100, 76], [121, 54]]), label(124, 48, 'O'),
      line([[96, 88], [116, 108]]), label(124, 118, 'O'), line([[132, 113], [146, 113]]), label(154, 118, 'H'),
      line([[162, 113], [190, 113]], { dash: 1 }),
      label(284, 85, 'CH₃', 'middle'), line([[240, 80], [266, 80]]), label(230, 85, 'C'),
      line([[225, 88], [204, 110]]), line([[220, 84], [199, 106]]), label(196, 118, 'O'),
      line([[224, 72], [204, 52]]), label(196, 48, 'O'), line([[174, 43], [188, 43]]), label(166, 48, 'H'),
      line([[130, 43], [158, 43]], { dash: 1 }),
    ]),
  }),
  figure(A(3, 2), 'The table gives how well some carboxylic acids dissolve in water. Explain why ethanoic acid mixes completely, and why the others dissolve less and less.', ['The –COOH group hydrogen bonds with water molecules, so small acids such as ethanoic acid mix completely.', 'As the hydrocarbon chain grows, the larger non-polar part can’t hydrogen bond with water, so pentanoic and hexanoic acids dissolve less.', 'Benzoic acid has a large non-polar phenyl group, so it dissolves only slightly in cold water.'], {
    shown: table(['Acid', 'Solubility in water (g per 100 mL)'], [['Ethanoic acid', 'mixes in all proportions'], ['Pentanoic acid', '5.0'], ['Hexanoic acid', '1.1'], ['Benzoic acid', '0.34']]),
  }),
  figure(A(3, 2), 'The figure shows three reactions of benzoic acid. Name the products P, Q and R.', ['P is 3-nitrobenzoic acid, as –COOH directs the nitro group to the meta position.', 'Q is phenylmethanol, C₆H₅CH₂OH, as LiAlH₄ reduces –COOH to –CH₂OH.', 'R is ethyl benzoate, an ester.'], {
    shown: sketch(420, 150, 'Three rows, each starting from benzoic acid. With concentrated nitric and sulphuric acids it gives P. With lithium aluminium hydride, then water, it gives Q. With ethanol and concentrated sulphuric acid it gives R.', rows('P', 'Q', 'R')),
    answer: sketch(420, 150, 'The same three rows with the products named: 3-nitrobenzoic acid, phenylmethanol and ethyl benzoate.', rows('3-nitrobenzoic acid', 'phenylmethanol', 'ethyl benzoate')),
  }),

  predict(A(2, 1), 'Ethanoic acid is warmed with ethanol and a few drops of concentrated sulphuric acid. Predict the product, and how it can be recognised.', 'Ethyl ethanoate, CH₃COOC₂H₅, an ester.', 'It has a sweet, fruity smell.'),
  predict(A(2, 3), 'The molar mass of ethanoic acid is found from the freezing point of its solution in benzene. Predict the value found, and explain.', 'About 120 g/mol, twice its true molar mass of 60 g/mol.', 'In benzene the acid forms hydrogen-bonded dimers, so there are half as many particles as molecules.'),
  predict(A(2, 1), 'A piece of magnesium ribbon is dropped into ethanoic acid. Predict what is seen, and the products.', 'Bubbles of hydrogen gas are given off.', 'Magnesium ethanoate is formed: Mg + 2CH₃COOH → (CH₃COO)₂Mg + H₂.'),

  odd(A(2, 1), ['HCOOH', 'CH₃COOH', 'CH₃CH₂COOH', 'C₆H₅COOH'], 'C₆H₅COOH', 'It is an aromatic acid; the others are aliphatic.'),
  odd(A(2, 2), ['ClCH₂COOH', 'Cl₂CHCOOH', 'CH₃COOH', 'F₃CCOOH'], 'CH₃COOH', 'It has no electron-withdrawing halogen, so it is the weakest acid of the four.'),
  odd(A(2, 2), ['LiAlH₄', 'PCl₅', 'SOCl₂', 'PCl₃'], 'LiAlH₄', 'It reduces –COOH to –CH₂OH; the others turn –COOH into –COCl.'),

  long(A(5, 2), 'Answer each part on the acid strength of carboxylic acids.\n(a) Why is a carboxylic acid acidic? Use the carboxylate ion to explain. [2]\n(b) Arrange benzoic acid, 4-nitrobenzoic acid and 4-methoxybenzoic acid in rising acid strength, and explain. [2]\n(c) Why is ethanoic acid weaker than methanoic acid? [1]', '(a) It can give up H⁺ from its –OH group, forming a carboxylate ion, RCOO⁻.', '(a) The negative charge of RCOO⁻ is shared equally between the two oxygens by resonance, which steadies the ion.', '(b) 4-Methoxybenzoic acid < benzoic acid < 4-nitrobenzoic acid.', '(b) The nitro group withdraws electrons and steadies the anion, so it strengthens the acid; the methoxy group gives electrons to the ring, so it weakens it.', '(c) The methyl group gives electrons, by its +I effect, which makes the ethanoate ion less stable.'),
  long(A(5, 2), 'Answer each part on losing carbon dioxide.\n(a) What is decarboxylation? Write the equation for heating sodium ethanoate with soda lime. [2]\n(b) What is Kolbe’s electrolysis? Write the overall equation for sodium ethanoate. [2]\n(c) Which hydrocarbon does sodium propanoate give when heated with soda lime? [1]', '(a) The removal of CO₂ from a carboxylic acid or its salt.', '(a) CH₃COONa + NaOH → CH₄ + Na₂CO₃, with CaO present.', '(b) Electrolysis of a concentrated solution of the sodium salt, giving an alkane with twice as many carbons as the acid’s alkyl group.', '(b) 2CH₃COONa + 2H₂O → C₂H₆ + 2CO₂ + H₂ + 2NaOH.', '(c) Ethane, C₂H₆.'),
  long(A(5, 1), 'Answer each part on naming carboxylic acids.\n(a) What are monocarboxylic and dicarboxylic acids? Give an example of each. [2]\n(b) Give the IUPAC names of CH₃CH(CH₃)COOH, CH₂=CHCOOH and C₆H₅CH₂COOH. [3]', '(a) A monocarboxylic acid has one –COOH group, as ethanoic acid.', '(a) A dicarboxylic acid has two, as ethanedioic acid, HOOC–COOH.', '(b) CH₃CH(CH₃)COOH is 2-methylpropanoic acid.', '(b) CH₂=CHCOOH is propenoic acid.', '(b) C₆H₅CH₂COOH is phenylethanoic acid.'),

  tell(A(2, 1), 'Distinguish between a carboxylic acid and an ester.', 'A carboxylic acid has a –COOH group, is acidic, and its molecules hydrogen bond with each other; ethanoic acid smells of vinegar.', 'An ester has a –COOR group, isn’t acidic, and can’t hydrogen bond with itself, so it boils lower; esters smell fruity.'),
  tell(A(2, 2), 'Distinguish between ethanoic acid and ethanoyl chloride.', 'Ethanoic acid, CH₃COOH, is a weak acid with an –OH group in its –COOH.', 'Ethanoyl chloride, CH₃COCl, has Cl in place of the OH, and reacts fast with water, giving ethanoic acid and HCl.'),
  tell(A(2, 1), 'Distinguish between aliphatic and aromatic carboxylic acids, with an example of each.', 'In an aliphatic acid the –COOH group is joined to an open chain or to hydrogen, as ethanoic acid.', 'In an aromatic acid the –COOH group is joined directly to a benzene ring, as benzoic acid.'),

  match(A(4, 1), [['HCOOH', 'methanoic acid'], ['CH₃COOH', 'ethanoic acid'], ['C₆H₅COOH', 'benzoic acid'], ['HOOC–COOH', 'ethanedioic acid']]),
  match(A(4, 2), [['CH₃COOH with PCl₅', 'ethanoyl chloride'], ['CH₃COOH with C₂H₅OH and conc. H₂SO₄', 'ethyl ethanoate'], ['CH₃COOH with LiAlH₄, then H₂O', 'ethanol'], ['CH₃COOH with NaHCO₃', 'sodium ethanoate, CO₂ and water']]),
  match(A(4, 1), [['Ethanoic acid', 'vinegar'], ['Sodium benzoate', 'a food preservative'], ['Methanoic acid', 'the leather and rubber industries'], ['Esters of carboxylic acids', 'fruity flavours and perfumes']]),

  ar(A(1, 2), 'Benzoic acid is a stronger acid than ethanoic acid.', 'The phenyl group withdraws electrons, which steadies the benzoate ion, while the methyl group gives electrons to the ethanoate ion.', 1, 'A steadier anion means a stronger acid, so benzoic acid is stronger.'),
  ar(A(1, 2), 'Methanoic acid can’t be made by oxidising methanol.', 'Methanoic acid is the simplest carboxylic acid.', 4, 'Oxidising methanol gives methanal and then methanoic acid.'),
];

export default questions;
