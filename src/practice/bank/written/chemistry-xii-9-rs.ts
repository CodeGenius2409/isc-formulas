// Written by hand: nitrogen compounds, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('chemistry', 'XII');
const A = at(9, 'a');
const B = at(9, 'b');
const C = at(9, 'c');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why does aniline not dissolve well in water?', 'Its large phenyl group is hydrophobic, and outweighs its –NH₂ group’s hydrogen bonds.'),
  reason(A(2, 2), 'Why is aniline a weaker base than methylamine?', 'Its lone pair is delocalised into the ring.', 'So it is less available for a proton.'),
  reason(A(2, 2), 'Why is acetylation done before nitrating aniline?', 'Direct nitration oxidises aniline, and also forms the m-isomer through its ion.', 'Acetylation protects –NH₂, so the para isomer is the main product.'),
  reason(A(2, 3), 'In water, (CH₃)₂NH is a stronger base than (CH₃)₃N. Why?', 'Three alkyl groups give the tertiary amine more electron donation.', 'But its ion is less stabilised by hydrogen bonding with water, and it’s more crowded.'),
  short(A(2, 1), 'Classify as primary, secondary or tertiary: CH₃CH₂NH₂, (CH₃)₂NH, (CH₃)₃N. How is it different from alcohols?', 'Primary, secondary, tertiary, respectively.', 'For amines it goes by how many alkyl groups are on the nitrogen, not on the carbon.'),
  short(A(2, 2), 'What is Hinsberg’s reagent? How does it tell a primary amine from a secondary one?', 'Benzenesulphonyl chloride.', 'A primary amine’s product dissolves in alkali, and a secondary amine’s doesn’t.'),
  short(A(3, 2), 'How is ethanamine made in each: from a nitrile; from a nitro compound; by the Hofmann bromamide reaction?', 'Reduce ethanenitrile with LiAlH₄.', 'Reduce nitroethane with H₂/Ni or Sn/HCl.', 'Treat propanamide with Br₂ and KOH.'),
  short(A(3, 3), 'State the carbylamine test. Why does it work for primary amines only?', 'Warm the amine with chloroform and alcoholic KOH.', 'An offensive-smelling isocyanide forms.', 'The reaction replaces both hydrogens of –NH₂, which only a primary amine has.'),
  reason(B(1, 1), 'Why do alkyl halides with KCN give mainly cyanides, and with AgCN mainly isocyanides?', 'KCN is ionic, so carbon attacks. AgCN is covalent, so nitrogen does.'),
  reason(B(2, 2), 'Why are cyanides more polar than isocyanides?', 'Carbon in C≡N is bonded by a polar triple bond to nitrogen.', 'Both charge separation and the direction of the dipole differ in isocyanides.'),
  reason(B(2, 2), 'Why is an amide dehydrated to a cyanide rather than an isocyanide?', 'The amide’s carbon is already bonded to its nitrogen.', 'So loss of water leaves the C≡N group.'),
  reason(B(1, 2), 'Why do isocyanides smell so offensive that they serve as a test?', 'Their strong smell is a clear sign of even a small amount, as in the carbylamine test.'),
  reason(B(2, 3), 'Why does a cyanide on hydrolysis give an acid, while an isocyanide gives an amine?', 'A cyanide’s carbon holds the attached alkyl group, and ends up in –COOH.', 'An isocyanide’s alkyl group is on nitrogen, so it ends up in an amine.'),
  short(B(2, 1), 'How is ethyl cyanide made from an alkyl halide, and from an amide?', 'C₂H₅Br with KCN.', 'Propanamide with P₂O₅ on heating.'),
  short(B(2, 2), 'How is an isocyanide made from an alkyl halide, and from a primary amine?', 'An alkyl halide with AgCN.', 'A primary amine with CHCl₃ and KOH.'),
  short(B(3, 2), 'What does CH₃CN give on hydrolysis, and on reduction? Name the reagent for each.', 'Hydrolysis with dilute acid gives ethanoic acid.', 'Reduction with LiAlH₄ gives ethanamine.', 'Both keep the carbon chain.'),
  short(B(3, 3), 'State three differences between ethyl cyanide and ethyl isocyanide.', 'Cyanide has its alkyl group on carbon, and isocyanide on nitrogen.', 'Hydrolysis gives an acid from the first, and an amine from the second.', 'Reduction gives a primary amine from the first, and a secondary one from the second.'),
  reason(C(1, 1), 'Why are diazonium salts made and used below about 278 K?', 'They break down with loss of nitrogen when warm.'),
  reason(C(2, 2), 'Why are aromatic diazonium salts more stable than aliphatic ones?', 'Their positive charge is delocalised into the ring.', 'An aliphatic ion has no such delocalisation, and it quickly loses N₂.'),
  reason(C(2, 3), 'Why are coupling reactions of diazonium salts run in weakly alkaline solution for phenol?', 'Alkali turns phenol into phenoxide, which is more reactive.', 'A very strong alkali would destroy the diazonium ion.'),
  reason(C(1, 2), 'Why are diazonium salts so useful in making many benzene compounds?', 'N₂ is an excellent leaving group, so many other groups can replace it.'),
  reason(C(2, 2), 'Why can’t fluorobenzene and iodobenzene be made by the Sandmeyer route used for chlorobenzene?', 'Iodobenzene forms with KI alone, with no catalyst.', 'Fluorobenzene is made through the Balz–Schiemann reaction with HBF₄.'),
  short(C(2, 1), 'Name the reagents that change benzenediazonium chloride to chlorobenzene, and to phenol.', 'CuCl and HCl.', 'Warm water.'),
  short(C(2, 2), 'What is a coupling reaction? Give the product of benzenediazonium chloride with phenol.', 'Attack of a diazonium ion on an activated ring, keeping the –N=N– link.', 'p-hydroxyazobenzene, an orange dye.'),
  short(C(3, 2), 'Write the steps by which aniline is changed to benzonitrile. Name the reaction.', 'NaNO₂ and HCl at 273–278 K give benzenediazonium chloride.', 'CuCN and KCN replace the diazo group.', 'This is the Sandmeyer reaction.'),
  short(C(3, 3), 'Show how to change benzene to bromobenzene through a diazonium salt. Give the reagents.', 'Nitrate with HNO₃ and H₂SO₄, and reduce with Sn and HCl to aniline.', 'Diazotise with NaNO₂ and HCl in the cold.', 'Warm with CuBr and HBr.'),
];

export default questions;
