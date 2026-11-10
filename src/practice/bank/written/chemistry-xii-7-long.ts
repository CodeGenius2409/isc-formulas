// Written by hand: alcohols, long answers in parts. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  long(A(5, 1), 'Answer each part on telling alcohols apart.\n(a) Describe the Lucas test, and how it tells primary, secondary and tertiary alcohols apart. [3]\n(b) How does oxidation with acidified dichromate tell them apart? [2]', '(a) Shake the alcohol with Lucas reagent, concentrated HCl with ZnCl₂.', '(a) A tertiary alcohol turns cloudy at once, and a secondary one in about five minutes.', '(a) A primary alcohol stays clear at room temperature.', '(b) Primary gives an aldehyde, then an acid, and secondary gives a ketone, both turning orange to green.', '(b) Tertiary doesn’t react under mild conditions, so it stays orange.'),
  long(A(5, 2), 'Answer each part on the dehydration of ethanol.\n(a) Write the mechanism of its dehydration with concentrated H₂SO₄ at 443 K. [3]\n(b) What forms instead at about 413 K, with excess ethanol? [2]', '(a) The –OH is protonated, giving CH₃CH₂OH₂⁺.', '(a) Water leaves, giving the carbocation CH₃CH₂⁺.', '(a) A proton is lost from the next carbon, giving ethene.', '(b) Ethoxyethane, an ether.', '(b) Another ethanol molecule attacks the protonated alcohol before it can lose water.'),
  long(A(5, 3), 'Answer each part on methanol and ethanol.\n(a) How is ethanol made by fermentation? Write the overall equation. [2]\n(b) Why is methanol dangerous to drink? [1]\n(c) Give one use each of methanol and ethanol. [2]', '(a) Yeast enzymes turn sugar, such as glucose, into ethanol, without air.', '(a) C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂.', '(b) Even a small amount can cause blindness, and a larger amount death.', '(c) Methanol: as a solvent, or to make methanal.', '(c) Ethanol: as a fuel, or in medicines and drinks.'),
];

export default questions;
