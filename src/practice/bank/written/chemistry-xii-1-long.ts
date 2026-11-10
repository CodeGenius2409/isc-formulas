// Written by hand: solutions, long answers in parts. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XII');
const A = at(1, 'a');

const questions: BankDef[] = [
  long(A(5, 1), 'Answer each part on colligative properties.\n(a) What is a colligative property? Name four. [3]\n(b) Why do they give a molar mass that is too low for NaCl? [2]', '(a) A property that depends only on the number of solute particles, not on what they are.', '(a) Relative lowering of vapour pressure and elevation of boiling point.', '(a) Depression of freezing point and osmotic pressure.', '(b) NaCl splits into two ions, so there are about twice as many particles.', '(b) The effect is about doubled, so the molar mass found is about half the true value.'),
  long(A(5, 2), 'Answer each part on a solution of 1.8 g of glucose (M = 180) in 100 g of water. K_f = 1.86 K kg mol⁻¹ and K_b = 0.52 K kg mol⁻¹.\n(a) Find its molality. [1]\n(b) Find its freezing point and boiling point. [2]\n(c) What would the freezing point be for the same molality of NaCl, taking i = 2? [2]', '(a) m = (1.8/180)/0.1 = 0.1 mol kg⁻¹.', '(b) ΔT_f = 1.86 × 0.1 = 0.186 K, so it freezes at about −0.19 °C.', '(b) ΔT_b = 0.52 × 0.1 = 0.052 K, so it boils at about 100.05 °C.', '(c) ΔT_f = 2 × 1.86 × 0.1 = 0.372 K.', '(c) It freezes at about −0.37 °C.'),
  long(A(5, 3), 'Answer each part on osmosis.\n(a) Define osmotic pressure, and write how it depends on concentration and temperature. [2]\n(b) Why is osmotic pressure preferred for finding the molar mass of proteins? [2]\n(c) What happens to a plant cell put in pure water? [1]', '(a) The pressure that must be applied to a solution to stop pure solvent passing into it through a semipermeable membrane.', '(a) π = CRT.', '(b) It is large enough to measure even for the very dilute solutions a protein gives.', '(b) It is measured at room temperature, so the protein isn’t damaged by heat.', '(c) Water enters by osmosis, and the cell swells.'),
];

export default questions;
