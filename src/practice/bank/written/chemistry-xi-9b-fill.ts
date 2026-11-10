// Written by hand: alkenes, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';
import { arrow, label, line, sketch } from '../figures';

const { figure, predict, odd, long, tell, match, reason, short, ar } = kit('chemistry', 'XI');
const A = at(9, 'b');

const questions: BankDef[] = [
  figure(A(3, 2), 'Show the two steps of the electrophilic addition of HBr to ethene, and say which step is slow.', ['Step 1, slow: the π electrons of the double bond take the H of HBr, which leaves as Br⁻, giving the ethyl carbocation, CH₃–CH₂⁺.', 'Step 2, fast: Br⁻ joins the carbocation, giving bromoethane, CH₃CH₂Br.', 'It is called electrophilic addition, as H⁺ is the electrophile that attacks first.'], {
    answer: sketch(330, 130, 'Two steps, one above the other. First, ethene and hydrogen bromide give the ethyl carbocation and a bromide ion; the arrow is marked slow. Second, the carbocation and the bromide ion give bromoethane; the arrow is marked fast.', [
      label(20, 45, 'CH₂=CH₂ + H–Br', 'start'), arrow([125, 40], [185, 40]), label(155, 32, 'slow'), label(195, 45, 'CH₃–CH₂⁺ + Br⁻', 'start'),
      label(20, 105, 'CH₃–CH₂⁺ + Br⁻', 'start'), arrow([125, 100], [185, 100]), label(155, 92, 'fast'), label(195, 105, 'CH₃CH₂Br', 'start'),
    ]),
  }),
  figure(A(2, 2), 'The figure shows the ozonolysis of an alkene X. Find the structure of X and name it.', ['The two C=O carbons were joined by the double bond: (CH₃)₂C= and =CHCH₃.', 'So X is (CH₃)₂C=CHCH₃, 2-methylbut-2-ene.'], {
    shown: sketch(360, 80, 'Alkene X, treated with ozone and then with zinc and water, gives propanone, CH₃COCH₃, and ethanal, CH₃CHO.', [
      label(40, 45, 'X'), arrow([60, 40], [180, 40]), label(120, 32, 'O₃, then Zn and H₂O'), label(190, 45, 'CH₃COCH₃ + CH₃CHO', 'start'),
    ]),
  }),
  figure(A(2, 2), 'Draw the structure of ethene, showing its bond angles, and say how the two bonds between its carbon atoms are formed.', ['Each carbon is sp² hybridised, and its three hybrid orbitals form σ bonds to two H atoms and the other C, at about 120° in one plane.', 'The unhybridised p orbitals of the two carbons overlap sideways, above and below that plane, to form a π bond, so C=C is one σ and one π bond.'], {
    answer: sketch(280, 150, 'Two carbon atoms joined by a double bond, each also bonded to two hydrogen atoms, one above and one below, all in one flat plane. The angle between two bonds on a carbon is marked 120°, and the double bond is marked σ + π.', [
      label(110, 85, 'C'), label(170, 85, 'C'), line([[119, 77], [161, 77]]), line([[119, 83], [161, 83]]),
      line([[104, 72], [84, 46]]), line([[104, 88], [84, 114]]), line([[176, 72], [196, 46]]), line([[176, 88], [196, 114]]),
      label(78, 40, 'H'), label(78, 128, 'H'), label(202, 40, 'H'), label(202, 128, 'H'),
      label(140, 66, 'σ + π'), label(84, 84, '120°', 'end'),
    ]),
  }),

  predict(A(2, 1), 'Ethene is bubbled through cold, dilute, alkaline potassium permanganate. Predict what is seen, and the product.', 'The purple colour fades, and a brown precipitate of MnO₂ forms.', 'Ethene is oxidised to ethane-1,2-diol, HOCH₂CH₂OH.'),
  predict(A(2, 2), 'Propene is treated with water in the presence of an acid. Predict the main product, and why.', 'Propan-2-ol, CH₃CH(OH)CH₃.', 'H⁺ adds first to give the more stable secondary carbocation, which water then joins, as Markovnikov’s rule says.'),
  predict(A(2, 1), 'Predict the products of the ozonolysis of propene.', 'The double bond splits, and each carbon of it becomes a C=O.', 'So propene, CH₃CH=CH₂, gives ethanal, CH₃CHO, and methanal, HCHO.'),

  odd(A(2, 1), ['ethene', 'propene', 'but-1-ene', 'cyclohexane'], 'cyclohexane', 'It has no double bond, though its formula fits CₙH₂ₙ; the others are alkenes.'),
  odd(A(2, 1), ['H₂ with Ni', 'Br₂', 'HBr', 'aqueous NaOH'], 'aqueous NaOH', 'It doesn’t add across a C=C bond; the others do.'),
  odd(A(2, 2), ['but-2-ene', 'pent-2-ene', 'propene', 'hex-3-ene'], 'propene', 'It shows no geometrical isomerism, as one carbon of its double bond carries two H atoms; the others do.'),

  long(A(5, 2), 'Answer each part on making ethene.\n(a) How is it made from ethanol? Give the equation and the conditions. [2]\n(b) How is it made from bromoethane? Give the equation and the reagent. [2]\n(c) Why is alcoholic KOH used in (b), not aqueous KOH? [1]', '(a) CH₃CH₂OH → CH₂=CH₂ + H₂O.', '(a) By heating with excess concentrated sulphuric acid at about 443 K.', '(b) CH₃CH₂Br + KOH → CH₂=CH₂ + KBr + H₂O.', '(b) Heating with alcoholic potassium hydroxide removes HBr.', '(c) In water, the OH⁻ ions replace the bromine and give ethanol; in alcohol, the stronger base removes HBr instead.'),
  long(A(5, 2), 'Answer each part on ozonolysis.\n(a) What is ozonolysis, and what are its two steps? [2]\n(b) Give the products of the ozonolysis of 2-methylpropene. [1]\n(c) Which alkene gives only propanone? [1]\n(d) How does ozonolysis help to find where the double bond is in an alkene? [1]', '(a) The splitting of an alkene at its double bond by ozone.', '(a) Ozone first adds to form an ozonide, which zinc and water then break into aldehydes or ketones.', '(b) Propanone and methanal.', '(c) 2,3-Dimethylbut-2-ene, (CH₃)₂C=C(CH₃)₂.', '(d) The two carbons of the double bond become C=O groups, so joining the products’ C=O carbons back together shows where it was.'),

  tell(A(2, 2), 'Distinguish between Markovnikov addition and anti-Markovnikov addition of HBr to propene.', 'Without peroxide, H adds to the carbon with more hydrogens, giving 2-bromopropane, by an ionic path.', 'With a peroxide, the addition goes the other way, giving 1-bromopropane, by a free-radical path.'),
  tell(A(2, 1), 'Distinguish between ethane and ethene by a chemical test.', 'Ethene decolourises bromine water at once, as bromine adds across its double bond.', 'Ethane leaves bromine water orange, as it has no double bond.'),
  tell(A(2, 1), 'Distinguish between addition and substitution reactions, with ethene and ethane as examples.', 'In addition, two parts join across a double bond and nothing leaves: ethene and bromine give 1,2-dibromoethane.', 'In substitution, an atom is replaced by another: ethane and chlorine in light give chloroethane and HCl.'),

  match(A(4, 1), [['Ethene with H₂ over Ni', 'ethane'], ['Ethene with Br₂', '1,2-dibromoethane'], ['Ethene with HBr', 'bromoethane'], ['Ethene with cold dilute alkaline KMnO₄', 'ethane-1,2-diol']]),
  match(A(4, 2), [['Propene with HBr', '2-bromopropane'], ['Propene with HBr and a peroxide', '1-bromopropane'], ['Propene with water and an acid', 'propan-2-ol'], ['Propene with O₃, then Zn and water', 'ethanal and methanal']]),
  match(A(4, 1), [['CH₂=CHCH₃', 'propene'], ['CH₂=CHCH₂CH₃', 'but-1-ene'], ['CH₃CH=CHCH₃', 'but-2-ene'], ['(CH₃)₂C=CH₂', '2-methylpropene']]),

  reason(A(2, 3), 'Why does the peroxide effect work with HBr but not with HCl or HI?', 'The H–Cl bond is too strong to be split by the free radicals.', 'The H–I bond splits easily, but the iodine radicals join to form I₂ instead of adding to the alkene.'),
  reason(A(2, 1), 'Why can’t the two halves of a molecule turn freely about a C=C double bond?', 'The π bond is formed by the sideways overlap of p orbitals.', 'Turning one end would twist these apart and break the π bond, which needs a lot of energy.'),
  reason(A(2, 1), 'Why are alkenes also called olefins?', 'The lower alkenes react with chlorine to give oily liquids.', 'Olefin means oil-forming.'),

  short(A(2, 1), 'Give the IUPAC names of CH₂=C(CH₃)CH₂CH₃ and CH₃CH=C(CH₃)₂.', '2-Methylbut-1-ene.', '2-Methylbut-2-ene.'),
  short(A(2, 2), 'Ethene is absorbed in cold concentrated sulphuric acid, and the product is warmed with water. Name the product of each step.', 'Ethyl hydrogensulphate, CH₃CH₂OSO₃H.', 'Warming with water gives ethanol, CH₃CH₂OH.'),

  ar(A(1, 2), 'Propene with HBr gives mainly 2-bromopropane.', 'The secondary carbocation formed is more stable than the primary one.', 1, 'Br⁻ joins the more stable secondary carbocation, at the middle carbon.'),
  ar(A(1, 1), 'Ethene shows geometrical isomerism.', 'Rotation about a C=C bond is restricted.', 4, 'Each carbon of ethene carries two identical H atoms, so it has no geometrical isomers.'),
  ar(A(1, 1), 'Alkenes undergo addition reactions.', 'Ethene is the first member of the alkene series.', 2, 'Both are true, but alkenes add because of their double bond.'),
];

export default questions;
