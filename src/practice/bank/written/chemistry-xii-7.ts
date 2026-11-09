// Written by hand: Alcohols. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, ar, theory } = bank('chemistry', 'XII');
const A = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [7, 'a', marks, d];

const questions: BankDef[] = [
  mcq(A(1, 1), 'The IUPAC name of CH₃CH(OH)CH₃ is:', ['propan-1-ol', 'propan-2-ol', '2-methylethanol', 'isopropane'], 1),
  mcq(A(1, 1), 'Which alcohol gives turbidity at once with the Lucas reagent at room temperature?', ['Butan-1-ol', 'Butan-2-ol', '2-methylpropan-2-ol', 'Methanol'], 2, 'Tertiary alcohols react fastest.'),
  mcq(A(1, 2), 'Ethanol boils far higher than methoxymethane, its isomer, because of:', ['its larger mass', 'hydrogen bonding', 'its ionic character', 'its branching'], 1),
  mcq(A(1, 2), 'Primary alcohols are oxidised by acidified K₂Cr₂O₇ first to:', ['ketones', 'aldehydes', 'alkenes', 'ethers'], 1),
  mcq(A(1, 2), 'Which gives a ketone on oxidation?', ['Propan-1-ol', 'Propan-2-ol', '2-methylpropan-2-ol', 'Methanol'], 1),
  mcq(A(1, 3), 'Heating ethanol with excess concentrated H₂SO₄ at about 443 K gives mainly:', ['ethoxyethane', 'ethene', 'ethanal', 'ethanoic acid'], 1, 'At 413 K with excess alcohol, the ether is the main product.'),
  mcq(A(1, 3), 'Heating excess ethanol with concentrated H₂SO₄ at about 413 K gives mainly:', ['ethoxyethane', 'ethene', 'ethanal', 'ethyl sulphate only'], 0),
  mcq(A(1, 1), 'An alcohol reacts with sodium to give:', ['an alkane', 'hydrogen and a sodium alkoxide', 'an ether and water', 'an aldehyde'], 1),
  mcq(A(1, 2), 'Which reagent stops the oxidation of a primary alcohol at the aldehyde?', ['Acidified KMnO₄', 'PCC', 'Concentrated HNO₃', 'Bromine water'], 1),
  ar(A(1, 2), 'Lower alcohols are soluble in water.', 'They form hydrogen bonds with water molecules.', 1),
  ar(A(1, 2), 'Solubility of alcohols in water falls as the carbon chain grows.', 'A larger alkyl group is more hydrophobic.', 1),
  ar(A(1, 1), 'Tertiary alcohols are easily oxidised to ketones by K₂Cr₂O₇.', 'They have no hydrogen atom on the carbon carrying the OH group.', 4, 'With no such hydrogen, they resist oxidation.'),
  ar(A(1, 3), 'Dehydration of butan-2-ol gives mainly but-2-ene.', 'Saytzeff’s rule favours the more substituted alkene.', 1),
  ar(A(1, 3), 'Tertiary alcohols dehydrate more easily than primary alcohols.', 'A tertiary carbocation is more stable than a primary one.', 1),
  theory('reason', A(1, 1), 'Give a reason: alcohols have higher boiling points than alkanes of similar mass.', ['Alcohol molecules are held by hydrogen bonds, which take more energy to break.']),
  theory('reason', A(1, 2), 'Give a reason: tertiary alcohols react faster than primary ones with hydrogen halides.', ['The reaction goes through a carbocation, and a tertiary one is the most stable.']),
  theory('reason', A(2, 2), 'Give a reason: ethanol is a weaker acid than water.', ['The ethyl group pushes electrons towards oxygen, by the +I effect.', 'This makes the O–H bond less polar, and destabilises the ethoxide ion.']),
  theory('reason', A(2, 3), 'Give a reason: the boiling points of isomeric alcohols fall with increasing branching.', ['Branching makes a molecule more compact, with a smaller surface area.', 'So the van der Waals forces are weaker, even though hydrogen bonds remain.']),
  theory('reason', A(2, 2), 'Give a reason: sodium metal is used to test for an OH group, but it can’t be used on a wet sample.', ['Alcohols give hydrogen gas with sodium.', 'Water also gives hydrogen with sodium, and would give a false result.']),
  theory('distinguish', A(2, 1), 'Give a chemical test that distinguishes ethanol from methanol.', ['Warm each with iodine and NaOH: ethanol gives a yellow iodoform precipitate.', 'Methanol gives no such precipitate.']),
  theory('distinguish', A(2, 2), 'Distinguish between primary, secondary and tertiary alcohols by the Lucas test.', ['Tertiary: turbidity appears at once, and secondary in about five minutes.', 'Primary: no turbidity at room temperature.']),
  theory('distinguish', A(2, 2), 'Give a chemical test that distinguishes propan-2-ol from propan-1-ol.', ['Warm each with iodine and NaOH: propan-2-ol gives yellow iodoform, as it has the CH₃CH(OH)– group.', 'Propan-1-ol doesn’t.']),
  theory('short', A(1, 1), 'What is rectified spirit?', ['A mixture of about 95% ethanol and 5% water, by mass, that boils as an azeotrope.']),
  theory('short', A(2, 1), 'Write the equation for the reaction of ethanol with thionyl chloride, and say why it is a convenient method.', ['C₂H₅OH + SOCl₂ → C₂H₅Cl + SO₂ + HCl.', 'The by-products are gases, which escape, and leave the pure haloalkane.']),
  theory('short', A(2, 2), 'How is ethanol obtained from ethene? Write the equations.', ['CH₂=CH₂ + H₂SO₄ → CH₃CH₂OSO₃H.', 'CH₃CH₂OSO₃H + H₂O → CH₃CH₂OH + H₂SO₄.']),
  theory('short', A(3, 2), 'Write the three steps in the acid-catalysed dehydration of ethanol to ethene.', ['Protonation of the alcohol, to give CH₃CH₂OH₂⁺.', 'Loss of water, to give a carbocation.', 'Loss of H⁺, to give ethene.']),
  theory('short', A(3, 3), 'How would you convert methanol to ethanol in three steps?', ['CH₃OH + PBr₃ → CH₃Br.', 'CH₃Br + Mg in dry ether → CH₃MgBr.', 'CH₃MgBr + HCHO, then acid hydrolysis → CH₃CH₂OH.']),
  theory('short', A(5, 3), 'Describe the mechanism of acid-catalysed hydration of an alkene to give an alcohol, using propene as the example. Explain which product forms, and why.', [['H⁺ adds to the double bond first.', 1], ['It adds to the CH₂ end, to give the more stable secondary carbocation (Markovnikov’s rule).', 1], ['Water attacks the carbocation.', 1], ['Loss of H⁺ from the oxonium ion gives the alcohol.', 1], ['The product is propan-2-ol, and not propan-1-ol.', 1]], { format: 'long' }),
  theory('short', A(5, 2), 'Starting from ethanol, how would you prepare (i) ethanal, (ii) ethanoic acid, (iii) ethene, (iv) bromoethane, and (v) ethoxyethane?', [['(i) Oxidation with PCC.', 1], ['(ii) Oxidation with acidified K₂Cr₂O₇, in excess.', 1], ['(iii) Concentrated H₂SO₄ at 443 K.', 1], ['(iv) PBr₃, or HBr.', 1], ['(v) Excess ethanol with concentrated H₂SO₄ at 413 K.', 1]], { format: 'long' }),
  theory('short', A(3, 2), 'A label on a hand sanitiser says it contains 70% ethanol. A student warms a sample with iodine and NaOH, and sees a yellow solid.\n(i) What is the yellow solid? [1]\n(ii) What group in ethanol gives this test? [1]\n(iii) Would methanol give the same result? [1]', [['(i) Iodoform, CHI₃.', 1], ['(ii) CH₃CH(OH)–.', 1], ['(iii) No.', 1]], { format: 'cbq', style: 'cbq-style' }),
];

export default questions;
