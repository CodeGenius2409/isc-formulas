// Written by hand: aldehydes and ketones, long answers in parts. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XII');
const A = at(8, 'a');

const questions: BankDef[] = [
  long(A(5, 1), 'Answer each part on nucleophilic addition.\n(a) Write the mechanism of HCN adding to ethanal. [3]\n(b) Why are aldehydes more reactive than ketones in such reactions? [2]', '(a) CN⁻ attacks the carbonyl carbon, and the C=O pair moves onto oxygen.', '(a) This gives an alkoxide ion.', '(a) It takes a proton from HCN, giving the cyanohydrin CH₃CH(OH)CN.', '(b) A ketone’s two alkyl groups push electrons to the carbonyl carbon, making it less positive.', '(b) They also crowd it, so a nucleophile reaches it less easily.'),
  long(A(5, 2), 'Answer each part on aldol condensation.\n(a) What is aldol condensation, and what does it need? [2]\n(b) Write the mechanism for ethanal in dilute alkali. [3]', '(a) The joining of two carbonyl molecules in dilute alkali, giving a β-hydroxy carbonyl compound.', '(a) It needs at least one α-hydrogen.', '(b) OH⁻ removes an α-hydrogen, giving the carbanion ⁻CH₂CHO.', '(b) It attacks the carbonyl carbon of another ethanal.', '(b) The alkoxide formed takes a proton from water, giving 3-hydroxybutanal.'),
  long(A(5, 2), 'Answer each part on the Cannizzaro reaction.\n(a) What is the Cannizzaro reaction, and which aldehydes give it? [2]\n(b) Write the equation for methanal. [1]\n(c) Write the equation for benzaldehyde, and name the products. [2]', '(a) An aldehyde with no α-hydrogen, in strong alkali, is half oxidised and half reduced.', '(a) Methanal and benzaldehyde are examples.', '(b) 2HCHO + NaOH → HCOONa + CH₃OH.', '(c) 2C₆H₅CHO + NaOH → C₆H₅COONa + C₆H₅CH₂OH.', '(c) Sodium benzoate and benzyl alcohol.'),
  long(A(5, 3), 'Answer each part on making carbonyl compounds.\n(a) How is ethanal made from ethanol? [1]\n(b) How is propanone made from propan-2-ol? [1]\n(c) Describe the Rosenmund reduction, with its catalyst and the reason for poisoning it. [3]', '(a) Oxidise with acidified K₂Cr₂O₇, distilling the ethanal off at once.', '(b) Oxidise with acidified K₂Cr₂O₇.', '(c) An acid chloride is reduced with hydrogen to an aldehyde.', '(c) The catalyst is palladium on barium sulphate.', '(c) It is poisoned so that the aldehyde isn’t reduced further to an alcohol.'),
];

export default questions;
