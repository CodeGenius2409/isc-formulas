// Written by hand: basic concepts, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XI');
const B = at(1, 'b');
const C = at(1, 'c');

const questions: BankDef[] = [
  long(B(5, 2), 'Hydrogen and oxygen react to give water: 2H₂ + O₂ → 2H₂O. A mixture holds 10 g of hydrogen and 64 g of oxygen.\n(a) Define a limiting reagent. [1]\n(b) Find which reagent is limiting. [2]\n(c) Find the mass of water formed, and the mass of the other reagent left over. [2]', ['(a) The reactant used up first, which sets how much product can form.', '(b) There are 5 mol of H₂ and 2 mol of O₂.', '(b) 2 mol of O₂ needs only 4 mol of H₂, so oxygen is limiting.', '(c) 4 mol of water, which is 72 g.', '(c) 1 mol of H₂ is left, which is 2 g.']),
  long(B(5, 3), 'A compound contains 40.0% carbon, 6.67% hydrogen and the rest oxygen, by mass. Its molar mass is 180 g mol⁻¹.\n(a) Find its empirical formula. [3]\n(b) Find its molecular formula. [1]\n(c) How many oxygen atoms are in 0.5 mol of it? [1]', ['(a) Oxygen is 53.33%, so the mole ratio is 40/12 : 6.67/1 : 53.33/16.', '(a) That is 3.33 : 6.67 : 3.33.', '(a) So the empirical formula is CH₂O.', '(b) CH₂O is 30, and 180 / 30 = 6, so C₆H₁₂O₆.', '(c) 0.5 × 6 × 6.022 × 10²³ = 1.81 × 10²⁴ atoms.']),
  long(C(5, 2), 'Answer each part on volumetric work.\n(a) Distinguish between the molarity and the normality of a solution. [2]\n(b) 4.9 g of H₂SO₄ is dissolved to make 500 mL of solution. Find its normality. [2]\n(c) What volume of it neutralises 25 mL of 0.2 N NaOH? [1]', ['(a) Molarity is moles of solute per litre of solution.', '(a) Normality is gram equivalents of solute per litre of solution.', '(b) The equivalent mass of H₂SO₄ is 98 / 2 = 49, so there is 0.1 equivalent.', '(b) 0.1 / 0.5 L = 0.2 N.', '(c) N₁V₁ = N₂V₂ gives 25 mL.']),
];

export default questions;
