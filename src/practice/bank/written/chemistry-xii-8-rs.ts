// Written by hand: aldehydes, ketones and acids, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('chemistry', 'XII');
const A = at(8, 'a');
const B = at(8, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why are aldehydes more reactive than ketones in nucleophilic addition?', 'A ketone’s carbonyl carbon is more crowded, and receives more electrons from two alkyl groups.'),
  reason(A(2, 2), 'Why do aldehydes boil higher than alkanes of similar mass, but lower than alcohols?', 'Their polar C=O bond gives dipole–dipole attraction.', 'They can’t form hydrogen bonds with each other.'),
  reason(A(2, 2), 'Why are the α-hydrogens of a carbonyl compound acidic?', 'The C=O group withdraws electrons.', 'The carbanion left behind is stabilised by resonance.'),
  reason(A(2, 3), 'Why does formaldehyde undergo the Cannizzaro reaction, and not the aldol reaction?', 'It has no α-hydrogen, which aldol condensation needs.', 'So one molecule is oxidised, and another reduced, in strong alkali.'),
  reason(A(1, 2), 'Why is a little acid added in making hydrazones of carbonyl compounds?', 'It protonates the carbonyl oxygen, making its carbon more open to attack.'),
  short(A(2, 1), 'Name the reagent used to test for an aldehyde with silver, and the result.', 'Tollens’ reagent, ammoniacal silver nitrate.', 'A silver mirror forms.'),
  short(A(2, 2), 'What is aldol condensation? Give the first product of ethanal with dilute alkali.', 'A carbonyl with an α-hydrogen adds to another, in dilute alkali.', '3-hydroxybutanal.'),
  short(A(3, 2), 'Write the mechanism of adding HCN to a carbonyl compound, in steps, and name what catalyses it.', 'CN⁻ attacks the carbonyl carbon, which forms an alkoxide.', 'The alkoxide takes a proton, which gives a cyanohydrin.', 'A base catalyses it, as it raises the CN⁻ concentration.'),
  short(A(3, 3), 'Give one chemical test that tells apart: ethanal and propanone; propanal and propanone; ethanal and benzaldehyde.', 'Tollens’ reagent gives a mirror with ethanal only.', 'Fehling’s gives a red precipitate with propanal only.', 'Iodoform test is positive with ethanal only.'),
  reason(B(1, 1), 'Why do carboxylic acids boil higher than alcohols of similar mass?', 'They form dimers through two hydrogen bonds.'),
  reason(B(2, 2), 'Why is ethanoic acid stronger than ethanol as an acid?', 'The carboxylate ion is stabilised by resonance over two oxygens.', 'The ethoxide ion has no such stabilisation.'),
  reason(B(2, 2), 'Why is chloroethanoic acid stronger than ethanoic acid?', 'Chlorine’s –I effect pulls electrons away.', 'That stabilises the anion.'),
  reason(B(2, 3), 'Why doesn’t a carboxylic acid give the usual reactions of a carbonyl group?', 'The –OH lone pair delocalises onto the C=O group.', 'So its carbon is far less electron-poor.'),
  reason(B(1, 2), 'Why is formic acid able to reduce Tollens’ reagent, though other acids can’t?', 'It has an H–C=O group, which acts like an aldehyde.'),
  short(B(2, 1), 'State a chemical test for a carboxylic acid group, and its result.', 'Add NaHCO₃ to the compound.', 'Brisk effervescence of CO₂.'),
  short(B(2, 2), 'What is the Hell–Volhard–Zelinsky reaction? Write it for ethanoic acid.', 'An acid with an α-hydrogen reacts with a halogen and red phosphorus.', 'CH₃COOH + Cl₂ → ClCH₂COOH + HCl.'),
  short(B(3, 2), 'How would you make ethanoic acid from each: ethanol; ethanenitrile; methylmagnesium bromide?', 'Oxidise with acidified K₂Cr₂O₇.', 'Hydrolyse with dilute acid.', 'React with dry CO₂, then acidify.'),
  short(B(3, 3), 'Arrange in rising acid strength: ethanoic acid, trifluoroethanoic acid, chloroethanoic acid, phenol. Give reasons.', 'Phenol < ethanoic acid < chloroethanoic acid < trifluoroethanoic acid.', 'Carboxylates are better stabilised than phenoxide.', 'Each electron-withdrawing halogen stabilises the anion further, and fluorine most of all.'),
];

export default questions;
