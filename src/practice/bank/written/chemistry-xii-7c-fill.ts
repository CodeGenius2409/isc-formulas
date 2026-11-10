// Written by hand: ethers, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// Boiling points and solubilities in water at about 20 °C: ethoxyethane 308 K and 6.9 g per 100 mL; butan-1-ol 391 K and 7.7 g; pentane 309 K and 0.004 g.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch, table } from '../figures';

const { figure, predict, odd, long, tell, match, ar } = kit('chemistry', 'XII');
const E = at(7, 'c');

/** A benzene ring with a vertex at the top, centred at (cx, cy). */
const ring = (cx: number, cy: number) => [
  { t: 'path' as const, d: `M${cx} ${cy - 28} L${cx + 24} ${cy - 14} L${cx + 24} ${cy + 14} L${cx} ${cy + 28} L${cx - 24} ${cy + 14} L${cx - 24} ${cy - 14} Z` },
  { t: 'circle' as const, x: cx, y: cy, r: 15 },
];

const questions: BankDef[] = [
  figure(E(2, 2), 'Draw the shape of a methoxymethane molecule, showing the lone pairs on oxygen, and give its C–O–C bond angle.', ['The oxygen is sp³ hybridised, with two bonds to methyl groups and two lone pairs, so the molecule is bent.', 'The C–O–C angle is about 111.7°, a little above the tetrahedral angle, as the two methyl groups push each other apart.'], {
    answer: sketch(260, 150, 'An oxygen atom at the top with two lone pairs drawn above it. Two bonds go down from it to the left and right, each to a CH₃ group, making a bent shape. The angle between the bonds is marked 111.7°.', [
      { t: 'dot', x: 110, y: 44 }, { t: 'dot', x: 116, y: 37 }, { t: 'dot', x: 144, y: 37 }, { t: 'dot', x: 150, y: 44 },
      label(130, 60, 'O'), line([[122, 64], [70, 108]]), line([[138, 64], [190, 108]]),
      label(58, 124, 'CH₃'), label(202, 124, 'CH₃'), label(130, 104, '111.7°'),
    ]),
  }),
  figure(E(3, 2), 'The table compares an ether, an alcohol and an alkane of nearly the same molar mass. Explain the boiling points, and why the ether and the alcohol dissolve in water about equally while the alkane hardly dissolves.', ['Butan-1-ol boils far higher, as its molecules are held together by hydrogen bonds.', 'Ethoxyethane has no O–H group, so its molecules can’t hydrogen bond with each other, and it boils close to pentane.', 'The oxygen of both the ether and the alcohol can hydrogen bond with water molecules, but pentane can’t, so it hardly dissolves.'], {
    shown: table(['Compound', 'Molar mass (g/mol)', 'Boiling point (K)', 'Solubility in water (g per 100 mL)'], [['Ethoxyethane', '74', '308', '6.9'], ['Butan-1-ol', '74', '391', '7.7'], ['Pentane', '72', '309', '0.004']]),
  }),
  figure(E(2, 2), 'Draw the structure of methoxybenzene, and mark with arrows the positions at which an electrophile attacks the ring. Why there?', ['A benzene ring carrying an –OCH₃ group, with arrows at the two positions next to it, ortho, and the one opposite it, para.', 'The oxygen’s lone pair is spread into the ring by resonance, making the ortho and para positions richest in electrons.'], {
    answer: sketch(260, 170, 'A benzene ring with an OCH₃ group at the top. Two arrows point at the ring carbons on either side of the group, labelled ortho, and one arrow points at the carbon at the bottom, opposite the group, labelled para.', [
      ...ring(130, 90), line([[130, 62], [130, 44]]), label(130, 36, 'OCH₃'),
      arrow([186, 58], [158, 74]), label(192, 54, 'ortho', 'start'), arrow([74, 58], [102, 74]), label(68, 54, 'ortho', 'end'),
      arrow([130, 150], [130, 122]), label(140, 156, 'para', 'start'),
    ]),
  }),

  predict(E(2, 2), 'Ethoxyethane is heated with excess concentrated hydriodic acid. Predict the products, and why no ethanol is left.', 'HI first splits the ether into iodoethane and ethanol.', 'With excess HI the ethanol is also turned into iodoethane and water, so the products are iodoethane and water.'),
  predict(E(2, 1), 'Phenol is warmed with sodium hydroxide solution, and bromoethane is then added. Predict the product, and name the reaction.', 'Ethoxybenzene, C₆H₅OC₂H₅, from the phenoxide ion displacing bromide.', 'This is the Williamson synthesis.'),
  predict(E(2, 3), 'Ethoxyethane and pentane are each shaken with cold concentrated sulphuric acid. Predict what happens to each, and why.', 'Ethoxyethane dissolves, as the lone pair on its oxygen takes a proton to form an oxonium salt.', 'Pentane has no lone pair to take a proton, so it doesn’t dissolve and forms a separate layer.'),

  odd(E(2, 1), ['CH₃OCH₃', 'C₂H₅OC₂H₅', 'CH₃OC₂H₅', 'C₆H₅OCH₃'], 'C₆H₅OCH₃', 'It is an aryl ether; the others are aliphatic ethers.'),
  odd(E(2, 1), ['ethoxyethane', 'butan-1-ol', 'butan-2-ol', '2-methylpropan-2-ol'], 'ethoxyethane', 'All four are C₄H₁₀O, but it is an ether; the others are alcohols.'),
  odd(E(2, 2), ['C₂H₅ONa + C₂H₅Br', 'C₆H₅ONa + CH₃I', '(CH₃)₃CONa + CH₃Br', 'CH₃ONa + (CH₃)₃CBr'], 'CH₃ONa + (CH₃)₃CBr', 'The tertiary bromide mostly eliminates, giving 2-methylpropene; the other pairs give ethers.'),

  long(E(5, 2), 'Answer each part on the ethers of formula C₄H₁₀O.\n(a) Write the structures and IUPAC names of the three ethers. [3]\n(b) Which of them is a symmetrical ether? Give its common name. [1]\n(c) Name an alcohol that is a functional isomer of them. [1]', '(a) CH₃OCH₂CH₂CH₃, 1-methoxypropane.', '(a) CH₃OCH(CH₃)₂, 2-methoxypropane.', '(a) C₂H₅OC₂H₅, ethoxyethane.', '(b) Ethoxyethane, with the same group on each side of the oxygen: diethyl ether.', '(c) Butan-1-ol, or any other C₄H₁₀O alcohol.'),
  long(E(5, 3), 'Answer each part on methoxybenzene.\n(a) Write the equation for making it by the Williamson synthesis. [1]\n(b) Why can’t it be made from bromobenzene and sodium methoxide? [2]\n(c) Give the main products of its reaction with ethanoyl chloride and anhydrous AlCl₃, and say why the ring reacts faster than benzene. [2]', '(a) C₆H₅ONa + CH₃I → C₆H₅OCH₃ + NaI.', '(b) The C–Br bond of bromobenzene gains some double-bond character by resonance with the ring.', '(b) So it is too strong for the methoxide ion to displace the bromine.', '(c) 4-Methoxyacetophenone mainly, with some 2-methoxyacetophenone.', '(c) The –OCH₃ group gives electrons to the ring by resonance, so electrophiles attack it more readily.'),
  long(E(5, 3), 'Answer each part on how hydriodic acid splits an ether.\n(a) Write the steps by which HI splits methoxyethane, and name the products. [3]\n(b) Why does HI split ethers better than HCl does? [2]', '(a) The ether’s oxygen takes a proton from HI, forming an oxonium ion.', '(a) The iodide ion attacks the less crowded carbon, the methyl group, by SN2.', '(a) This gives iodomethane and ethanol.', '(b) HI is a stronger acid, so it protonates the ether more fully.', '(b) The iodide ion is a better nucleophile than the chloride ion.'),

  tell(E(2, 1), 'Distinguish between symmetrical and unsymmetrical ethers, with an example of each.', 'A symmetrical ether has the same group on both sides of the oxygen, as in ethoxyethane, C₂H₅OC₂H₅.', 'An unsymmetrical ether has two different groups, as in methoxyethane, CH₃OC₂H₅.'),
  tell(E(2, 2), 'Distinguish between the Williamson synthesis and the dehydration of alcohols as ways of making ethers.', 'The Williamson synthesis reacts an alkoxide with a primary alkyl halide, and can make symmetrical or unsymmetrical ethers.', 'Dehydration heats a primary alcohol with concentrated sulphuric acid at 413 K, and suits only symmetrical ethers.'),
  tell(E(2, 1), 'Distinguish between ethoxyethane and its isomer butan-1-ol by a chemical test.', 'A piece of sodium added to butan-1-ol gives bubbles of hydrogen.', 'Sodium gives no gas with ethoxyethane, which has no O–H group.'),

  match(E(4, 1), [['CH₃OCH₃', 'methoxymethane'], ['CH₃OC₂H₅', 'methoxyethane'], ['C₆H₅OCH₃', 'methoxybenzene'], ['C₆H₅OC₂H₅', 'ethoxybenzene']]),
  match(E(4, 2), [['Ethoxyethane with excess HI, heated', 'iodoethane and water'], ['Methoxybenzene with HI', 'phenol and iodomethane'], ['Sodium phenoxide with iodomethane', 'methoxybenzene'], ['Ethanol with concentrated H₂SO₄ at 413 K', 'ethoxyethane']]),
  match(E(4, 2), [['Ethoxyethane in the past', 'used as an anaesthetic'], ['Methoxybenzene', 'used in perfumes'], ['An ether kept in light and air', 'forms explosive peroxides'], ['The oxygen of an ether', 'a Lewis base that can take a proton']]),

  ar(E(1, 3), '2-Methoxy-2-methylpropane with HI gives 2-iodo-2-methylpropane and methanol.', 'The tertiary carbocation formed is stable, so the C–O bond to the tertiary carbon breaks.', 1, 'The reaction goes by SN1 through the tertiary carbocation, which iodide then joins.'),
  ar(E(1, 2), 'Methoxybenzene with HI gives iodobenzene and methanol.', 'The O–CH₃ bond is weaker than the O–C₆H₅ bond.', 4, 'The O–C₆H₅ bond has partial double-bond character, so the O–CH₃ bond breaks and the products are phenol and iodomethane.'),
];

export default questions;
