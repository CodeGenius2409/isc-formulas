// Written by hand: classification, naming and isomerism of organic compounds, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { label, line, sketch } from '../figures';
import type { SketchMark } from '../diagram';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('chemistry', 'XI');
const O = at(8, 'a');

/** Carbon skeleton: a C at each point, and bonds drawn between the given pairs, stopping short of the letters. */
const skeleton = (atoms: [number, number][], bonds: [number, number][]): SketchMark[] => [
  ...atoms.map(([x, y]) => label(x, y + 5, 'C')),
  ...bonds.map(([i, j]) => {
    const [x1, y1] = atoms[i];
    const [x2, y2] = atoms[j];
    const d = Math.hypot(x2 - x1, y2 - y1);
    const ux = (x2 - x1) / d;
    const uy = (y2 - y1) / d;
    return line([[Math.round(x1 + 9 * ux), Math.round(y1 + 9 * uy)], [Math.round(x2 - 9 * ux), Math.round(y2 - 9 * uy)]]);
  }),
];

/** A C=C bond at (x, 70) to (x + 50, 70), with groups up-left, down-left, up-right and down-right. */
const alkene = (x: number, ul: string, dl: string, ur: string, dr: string, name: string): SketchMark[] => [
  label(x, 75, 'C'), label(x + 50, 75, 'C'), line([[x + 9, 67], [x + 41, 67]]), line([[x + 9, 73], [x + 41, 73]]),
  line([[x - 6, 62], [x - 22, 44]]), line([[x - 6, 78], [x - 22, 96]]), line([[x + 56, 62], [x + 72, 44]]), line([[x + 56, 78], [x + 72, 96]]),
  label(x - 28, 38, ul), label(x - 28, 112, dl), label(x + 78, 38, ur), label(x + 78, 112, dr),
  label(x + 25, 142, name),
];

const chain6: [number, number][] = [[60, 60], [100, 60], [140, 60], [180, 60], [220, 60], [260, 60], [100, 100]];

const questions: BankDef[] = [
  figure(O(3, 1), 'Draw the carbon skeletons of the three chain isomers of C₅H₁₂, and give the IUPAC name of each.', ['Five carbons in a straight chain: pentane.', 'Four carbons in a chain with one branch on the second: 2-methylbutane.', 'Three carbons in a chain with two branches on the middle one: 2,2-dimethylpropane.'], {
    answer: sketch(345, 240, 'Three carbon skeletons, one above another. The first is five carbons in a row, named pentane. The second is four carbons in a row with one more carbon joined below the second, named 2-methylbutane. The third is one carbon joined to four others, above, below, left and right, named 2,2-dimethylpropane.', [
      ...skeleton([[30, 40], [65, 40], [100, 40], [135, 40], [170, 40]], [[0, 1], [1, 2], [2, 3], [3, 4]]), label(210, 45, 'pentane', 'start'),
      ...skeleton([[30, 105], [65, 105], [100, 105], [135, 105], [65, 140]], [[0, 1], [1, 2], [2, 3], [1, 4]]), label(210, 110, '2-methylbutane', 'start'),
      ...skeleton([[65, 195], [30, 195], [100, 195], [65, 165], [65, 225]], [[0, 1], [0, 2], [0, 3], [0, 4]]), label(210, 200, '2,2-dimethylpropane', 'start'),
    ]),
  }),
  figure(O(2, 1), 'The figure shows the carbon skeleton of an alkane, with its chain numbered in two ways, A and B. Which numbering is right, and what is the alkane’s IUPAC name?', ['Numbering A puts the branch on C-2, and B puts it on C-5.', 'The chain is numbered to give the branch the lowest number, so A is right: 2-methylhexane.'], {
    shown: sketch(300, 150, 'Six carbons in a row, with one more carbon joined below the second from the left. Above the row, numbering A runs 1 to 6 from left to right. Below it, numbering B runs 1 to 6 from right to left.', [
      ...skeleton(chain6, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 6]]),
      label(20, 40, 'A', 'start'), ...chain6.slice(0, 6).map(([x], i) => label(x, 38, `${i + 1}`)),
      label(20, 140, 'B', 'start'), ...chain6.slice(0, 6).map(([x], i) => label(x, 140, `${6 - i}`)),
    ]),
  }),
  figure(O(2, 2), 'Draw the two geometrical isomers of but-2-ene, and name each.', ['cis-But-2-ene: both CH₃ groups on the same side of the C=C bond.', 'trans-But-2-ene: the CH₃ groups on opposite sides; the double bond can’t rotate, so the two are different compounds.'], {
    answer: sketch(340, 155, 'Two drawings side by side, each a C=C double bond with a group on each carbon above and below. In the first, both CH₃ groups are on top and both H atoms below: cis-but-2-ene. In the second, one CH₃ is on top on the left and the other below on the right: trans-but-2-ene.', [
      ...alkene(60, 'CH₃', 'H', 'CH₃', 'H', 'cis-but-2-ene'), ...alkene(230, 'CH₃', 'H', 'H', 'CH₃', 'trans-but-2-ene'),
    ]),
  }),

  predict(O(2, 1), 'Predict how many structural isomers C₄H₁₀ has, and name them.', 'Two.', 'Butane, with a straight chain, and 2-methylpropane, with a branch.'),
  predict(O(2, 2), 'Predict the IUPAC name of CH₃CH₂CH(CH₃)CH₂CH₃, and say why it isn’t 2-ethylbutane.', '3-Methylpentane.', 'The longest chain has five carbons, running through the ethyl group, so the parent is pentane with a methyl on C-3.'),
  predict(O(2, 2), 'Ethanol, CH₃CH₂OH, and methoxymethane, CH₃OCH₃, have the same formula. Predict whether they have similar properties, and explain.', 'No: ethanol is a liquid that mixes with water, while methoxymethane is a gas at room temperature.', 'They are functional isomers, with different functional groups, an alcohol and an ether, and ethanol’s molecules hydrogen bond with each other.'),

  odd(O(2, 1), ['CH₃OH', 'C₂H₅OH', 'C₃H₇OH', 'CH₃CHO'], 'CH₃CHO', 'It is an aldehyde; the others belong to the homologous series of alcohols.'),
  odd(O(2, 2), ['butane and 2-methylpropane', 'pentane and 2,2-dimethylpropane', 'propan-1-ol and propan-2-ol', 'hexane and 2-methylpentane'], 'propan-1-ol and propan-2-ol', 'They are position isomers; the other pairs are chain isomers.'),
  odd(O(2, 1), ['benzene', 'toluene', 'cyclohexane', 'phenol'], 'cyclohexane', 'It is alicyclic; the others are aromatic.'),

  long(O(5, 1), 'Answer each part on the classification of organic compounds.\n(a) What are acyclic and cyclic compounds? Give an example of each. [2]\n(b) Cyclic compounds are divided into alicyclic, aromatic and heterocyclic compounds. Say what each is, with an example. [3]', '(a) Acyclic, or open-chain, compounds have no ring of atoms, as butane.', '(a) Cyclic compounds have one or more rings, as cyclohexane.', '(b) Alicyclic compounds have rings of carbon atoms that aren’t aromatic, as cyclohexane.', '(b) Aromatic compounds have a benzene ring, or a ring like it, as benzene or toluene.', '(b) Heterocyclic compounds have a ring with an atom other than carbon in it, as pyridine or furan.'),
  long(O(5, 2), 'Give the IUPAC name of each.\n(a) CH₃CH(Cl)CH₂CH₃ [1]\n(b) (CH₃)₃CCH₂OH [1]\n(c) CH₂=CHCH₂CH₃ [1]\n(d) CH₃COOC₂H₅ [1]\n(e) HOOC–CH₂–COOH [1]', '(a) 2-Chlorobutane.', '(b) 2,2-Dimethylpropan-1-ol.', '(c) But-1-ene.', '(d) Ethyl ethanoate.', '(e) Propanedioic acid.'),

  tell(O(2, 1), 'Distinguish between chain isomers and position isomers, with an example of each.', 'Chain isomers differ in the carbon chain, straight or branched, as butane and 2-methylpropane.', 'Position isomers have the same chain but the functional group in a different place, as propan-1-ol and propan-2-ol.'),
  tell(O(2, 2), 'Distinguish between metamers and functional isomers, with an example of each.', 'Metamers have the same functional group but different groups on either side of it, as ethoxyethane and 1-methoxypropane.', 'Functional isomers have different functional groups, as propanal and propanone.'),
  tell(O(2, 1), 'Distinguish between a homologous series and a set of isomers.', 'Members of a homologous series have the same functional group and differ by CH₂, so their formulae differ.', 'Isomers have the same molecular formula but different structures.'),

  match(O(4, 1), [['–CHO', 'an aldehyde, named -al'], ['>C=O within a chain', 'a ketone, named -one'], ['–COOH', 'a carboxylic acid, named -oic acid'], ['–OH', 'an alcohol, named -ol']]),
  match(O(4, 1), [['meth-', 'one carbon'], ['eth-', 'two carbons'], ['prop-', 'three carbons'], ['but-', 'four carbons']]),
  match(O(4, 2), [['Butane and 2-methylpropane', 'chain isomers'], ['Propan-1-ol and propan-2-ol', 'position isomers'], ['Ethanol and methoxymethane', 'functional isomers'], ['Ethoxyethane and 1-methoxypropane', 'metamers']]),

  reason(O(2, 1), 'Why is (CH₃)₂CHCH₃ named 2-methylpropane and not 1,1-dimethylethane?', 'The parent is the longest chain, which here has three carbons.', 'So it is propane with a methyl group on C-2.'),
  reason(O(2, 1), 'Why do isomers have different properties, though their molecular formula is the same?', 'Their atoms are joined in different ways, so they are different structures.', 'They may have different chains or functional groups, which decide their physical and chemical properties.'),
  reason(O(2, 1), 'Why is a carbon chain numbered from the end that gives the lowest numbers to its branches or functional group?', 'A chain can be numbered from either end, which would give two names for one compound.', 'The lowest-number rule picks one of them, so each compound has a single name.'),

  short(O(2, 1), 'Write the structures of (a) 2,3-dimethylbutane and (b) pent-2-yne.', '(a) (CH₃)₂CH–CH(CH₃)₂.', '(b) CH₃C≡CCH₂CH₃.'),
  short(O(2, 1), 'Give the IUPAC names of (a) CH₃CH₂COCH₂CH₃ and (b) CH₃CH(OH)CH₂CH₂CH₃.', '(a) Pentan-3-one.', '(b) Pentan-2-ol.'),

  ar(O(1, 1), 'Butanal and butanone are functional isomers.', 'They have the same formula, C₄H₈O, but different functional groups.', 1, 'One is an aldehyde and the other a ketone, so they are functional isomers.'),
  ar(O(1, 2), 'Butane and 2-methylpropane have the same boiling point.', 'Butane and 2-methylpropane have the same molecular formula.', 4, 'Branching makes 2-methylpropane more compact, with weaker forces between molecules, so it boils lower.'),
  ar(O(1, 1), 'Pyridine is a heterocyclic compound.', 'Benzene is an aromatic compound.', 2, 'Both are true, but pyridine is heterocyclic because its ring holds a nitrogen atom.'),
];

export default questions;
