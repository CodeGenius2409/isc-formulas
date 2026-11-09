// Written by hand: equilibrium, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XI');
const A = at(6, 'a');
const B = at(6, 'b');

const questions: BankDef[] = [
  long(A(5, 2), 'For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), which is exothermic:\n(a) Give Kc in terms of the concentrations. [1]\n(b) State Le Chatelier’s principle. [1]\n(c) Say what happens to the yield of ammonia on raising the pressure, and on raising the temperature, with reasons. [2]\n(d) What does a catalyst do to the equilibrium? [1]', ['(a) Kc = [NH₃]² / ([N₂][H₂]³).', '(b) A system at equilibrium shifts so as to oppose a change made to it.', '(c) A higher pressure raises the yield, as the forward reaction makes fewer moles of gas.', '(c) A higher temperature lowers it, as the forward reaction gives out heat.', '(d) It speeds up both directions, so equilibrium comes sooner, but it doesn’t change the position.']),
  long(B(5, 2), 'Answer each part.\n(a) What is a buffer solution? Name the two parts of an acidic buffer. [2]\n(b) Find the pH of a solution that is 0.1 M in ethanoic acid and 0.1 M in sodium ethanoate, given pKa = 4.74. [1]\n(c) How does this buffer resist a little added acid? [1]\n(d) Why is a solution of sodium ethanoate basic? [1]', ['(a) A solution whose pH changes little when a small amount of acid or base is added.', '(a) A weak acid and its salt with a strong base.', '(b) pH = pKa + log(salt/acid) = 4.74.', '(c) Ethanoate ions take up the added H⁺, forming the weak acid.', '(d) Ethanoate hydrolyses, giving OH⁻.']),
  long(B(5, 3), 'Answer each part.\n(a) Write the solubility product of Ag₂CrO₄ in terms of its solubility s. [1]\n(b) The solubility of AgCl in water is 1.0 × 10⁻⁵ mol L⁻¹. Find Ksp. [1]\n(c) Find its solubility in 0.1 M NaCl. [2]\n(d) What is this effect called? [1]', ['(a) Ksp = (2s)²(s) = 4s³.', '(b) Ksp = s² = 1.0 × 10⁻¹⁰.', '(c) With [Cl⁻] = 0.1 M, s = Ksp / 0.1.', '(c) s = 1.0 × 10⁻⁹ mol L⁻¹.', '(d) The common ion effect.']),
];

export default questions;
