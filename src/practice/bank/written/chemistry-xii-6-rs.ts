// Written by hand: haloalkanes, haloarenes and polyhalogen compounds, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('chemistry', 'XII');
const A = at(6, 'a');
const B = at(6, 'b');
const C = at(6, 'c');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why don’t haloalkanes dissolve in water, even though the C–X bond is polar?', 'Too little energy is released in forming new bonds with water to break water’s strong hydrogen bonds.'),
  reason(A(2, 2), 'Why does a tertiary halide react by SN1, and a primary one by SN2?', 'A tertiary halide forms a stable carbocation, and is too crowded for backside attack.', 'A primary halide’s carbocation is unstable, and it is open to attack.'),
  reason(A(2, 2), 'Why does an SN1 reaction of an optically active halide give a racemic mixture?', 'The carbocation is planar.', 'So the nucleophile attacks from either face equally.'),
  reason(A(2, 3), 'Why does ethyl chloride give ethanol with aqueous KOH, but ethene with alcoholic KOH?', 'In water, OH⁻ acts as a nucleophile and substitutes.', 'In alcohol, the stronger base RO⁻ removes a proton, which gives elimination.'),
  reason(A(1, 2), 'Why is C–I the weakest of the carbon–halogen bonds?', 'Iodine’s large size gives poor overlap with carbon, so it is the longest bond.'),
  short(A(2, 1), 'Write the IUPAC names of (CH₃)₂CHCl and CH₃CH₂CH₂Br, and classify each as primary, secondary or tertiary.', '2-chloropropane, which is secondary.', '1-bromopropane, which is primary.'),
  short(A(2, 2), 'What is meant by a racemic mixture? Why doesn’t it rotate the plane of polarised light?', 'An equal mixture of the two enantiomers of a compound.', 'The rotations of the two cancel out.'),
  short(A(3, 2), 'Write the mechanism of the SN2 reaction of CH₃Br with OH⁻, in steps. What happens to its configuration?', 'OH⁻ attacks from the side opposite to the bromine.', 'A transition state has both partly bonded, as bromide leaves.', 'The configuration inverts.'),
  short(A(3, 3), 'Name each reaction, and give its product: C₂H₅Br with AgCN; C₂H₅Br with KCN; C₂H₅Br with Na in dry ether.', 'Ethyl isocyanide, C₂H₅NC.', 'Ethyl cyanide, C₂H₅CN.', 'Butane, in the Wurtz reaction.'),
  reason(B(1, 1), 'Why is chlorobenzene hard to hydrolyse, compared with ethyl chloride?', 'Resonance gives its C–Cl bond partial double-bond character, so it is harder to break.'),
  reason(B(2, 2), 'The halogen in chlorobenzene deactivates the ring, but directs ortho and para. Why?', 'Its –I effect removes electron density, which deactivates.', 'Its +R effect raises density at the ortho and para positions.'),
  reason(B(2, 3), 'Why does p-nitrochlorobenzene react with OH⁻ far more easily than chlorobenzene?', 'The nitro group withdraws electrons from the ring.', 'That stabilises the negatively charged intermediate.'),
  reason(B(1, 2), 'Why is para-dichlorobenzene higher melting than its ortho isomer?', 'Its symmetry lets it pack more closely in the crystal.'),
  short(B(2, 1), 'How is chlorobenzene made from aniline? Name the reaction.', 'Make the diazonium salt with NaNO₂ and HCl at 273–278 K.', 'Warm with CuCl: the Sandmeyer reaction.'),
  short(B(2, 2), 'Write the products when chlorobenzene reacts with Cl₂ and FeCl₃, and with concentrated HNO₃ and H₂SO₄.', 'Mainly 1,4-dichlorobenzene and some 1,2-dichlorobenzene.', 'Mainly 1-chloro-4-nitrobenzene and some 1-chloro-2-nitrobenzene.'),
  short(B(3, 2), 'What is the Wurtz–Fittig reaction? Write the reaction for making toluene.', 'An aryl and an alkyl halide join with sodium in dry ether.', 'C₆H₅Cl + CH₃Cl + 2Na → C₆H₅CH₃ + 2NaCl.', 'The reaction needs dry ether, as sodium reacts with water.'),
  short(B(3, 3), 'Show by resonance why the C–Cl bond of chlorobenzene is shorter than that of chloromethane. State another result of it.', 'A lone pair on chlorine is shared with the ring in resonance forms.', 'This gives the bond partial double-bond character, so it is shorter.', 'It is also harder to break, so substitution is slow.'),
  reason(C(1, 1), 'Why are freons harmful high in the atmosphere?', 'UV light frees chlorine atoms from them, which break down ozone in a chain reaction.'),
  reason(C(2, 2), 'Why is chloroform stored in dark, filled bottles?', 'Light and air slowly oxidise it to phosgene, a poison.', 'A dark, full bottle keeps out light and air.'),
  reason(C(2, 2), 'Why was DDT banned in many countries, though it controls insects?', 'It doesn’t break down easily, so it stays in the environment.', 'It builds up in fat, and moves up food chains.'),
  reason(C(1, 2), 'Why was iodoform once used as an antiseptic?', 'It releases free iodine on contact with skin, which kills germs.'),
  reason(C(2, 3), 'Why is tetrachloromethane no longer common in dry cleaning?', 'It can harm the liver and nervous system.', 'It also harms the ozone layer, once it reaches the upper atmosphere.'),
  short(C(2, 1), 'State one use and one harm of dichloromethane.', 'It is a solvent and paint remover.', 'Too much of it harms the nervous system.'),
  short(C(2, 2), 'What are freons? State one of their uses.', 'Chlorofluorocarbons of methane and ethane.', 'As coolants in refrigerators and as aerosol propellants.'),
  short(C(3, 2), 'Give one use each of iodoform, chloroform and DDT.', 'Iodoform: as an antiseptic.', 'Chloroform: as a solvent.', 'DDT: as an insecticide.'),
];

export default questions;
