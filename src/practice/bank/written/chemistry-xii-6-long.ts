// Written by hand: haloalkanes, long answers in parts. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XII');
const A = at(6, 'a');

const questions: BankDef[] = [
  long(A(5, 1), 'Answer each part on the SN2 mechanism.\n(a) Write the mechanism of the reaction of CH₃Br with OH⁻. [3]\n(b) Why do tertiary halides seldom react by SN2? [2]', '(a) OH⁻ attacks the carbon from the side opposite to Br.', '(a) In the transition state, HO and Br are both partly bonded, and the three hydrogens lie flat.', '(a) Br⁻ leaves, and the molecule is inverted, giving CH₃OH.', '(b) Three alkyl groups crowd the carbon.', '(b) So the nucleophile can’t reach its back side.'),
  long(A(5, 2), 'Answer each part on the SN1 mechanism.\n(a) Write the mechanism of the hydrolysis of (CH₃)₃CBr. [3]\n(b) Why does SN1 of an optically active halide give a racemic mixture? [2]', '(a) The C–Br bond breaks slowly, giving the carbocation (CH₃)₃C⁺ and Br⁻.', '(a) This first step is slow, so it decides the rate: rate = k[(CH₃)₃CBr].', '(a) Water or OH⁻ attacks the carbocation quickly, giving (CH₃)₃COH.', '(b) The carbocation is planar.', '(b) It is attacked equally from either face, giving equal amounts of the two enantiomers.'),
  long(A(5, 2), 'Answer each part on the reactions of bromoethane.\nGive the product and name the reaction or type for each:\n(a) with aqueous KOH; [1]\n(b) with alcoholic KOH; [1]\n(c) with KCN; [1]\n(d) with sodium in dry ether; [1]\n(e) with magnesium in dry ether. [1]', '(a) Ethanol, by substitution.', '(b) Ethene, by elimination.', '(c) Propanenitrile, by substitution.', '(d) Butane, by the Wurtz reaction.', '(e) Ethylmagnesium bromide, a Grignard reagent.'),
  long(A(5, 3), 'Answer each part on optical isomerism.\n(a) What is a chiral carbon? Mark it in butan-2-ol. [2]\n(b) What are enantiomers, and how do they differ? [2]\n(c) What is a racemic mixture? [1]', '(a) A carbon joined to four different groups.', '(a) In CH₃CH(OH)CH₂CH₃, the second carbon, bearing –OH, is chiral.', '(b) A pair of non-superimposable mirror-image molecules.', '(b) They have the same physical properties, but turn the plane of polarised light equally in opposite directions.', '(c) An equal mixture of two enantiomers, which is optically inactive.'),
  long(A(5, 3), 'Answer each part on the nature of the C–X bond.\n(a) Why is the C–X bond polar? [1]\n(b) Arrange the C–X bonds by length and by strength, and explain. [2]\n(c) Which haloalkane reacts fastest in substitution, and why? [2]', '(a) The halogen is more electronegative than carbon, so it pulls the bonding pair towards itself.', '(b) Length: C–F < C–Cl < C–Br < C–I, as the halogen atom grows.', '(b) Strength falls the other way, as the longer bonds overlap less.', '(c) Iodoalkanes.', '(c) The C–I bond is the weakest, and I⁻ is the best leaving group.'),
];

export default questions;
