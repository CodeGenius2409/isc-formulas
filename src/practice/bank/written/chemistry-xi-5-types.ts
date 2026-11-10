// Written by hand: thermodynamics, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XI');
const A = at(5, 'a');
const B = at(5, 'b');

const questions: BankDef[] = [
  long(A(5, 2), 'Answer each part.\n(a) State the first law of thermodynamics, and write its equation. [2]\n(b) Show that ΔH = ΔU + Δn(g)RT for a reaction of ideal gases. [2]\n(c) For N₂(g) + 3H₂(g) → 2NH₃(g), what is Δn(g), and is ΔH larger or smaller than ΔU? [1]', ['(a) Energy can’t be created or destroyed, only changed from one form to another.', '(a) ΔU = q + w.', '(b) H = U + PV, so ΔH = ΔU + Δ(PV) at constant pressure.', '(b) For ideal gases, Δ(PV) = Δn(g)RT.', '(c) Δn(g) = −2, so ΔH is smaller than ΔU.']),
  long(B(5, 2), 'Answer each part.\n(a) State the second law of thermodynamics in terms of entropy. [1]\n(b) Write the Gibbs equation, and say what the sign of ΔG tells you. [2]\n(c) A reaction has ΔH = +40 kJ mol⁻¹ and ΔS = +100 J K⁻¹ mol⁻¹. Find the temperature above which it is spontaneous. [2]', ['(a) In a spontaneous change, the entropy of the universe increases.', '(b) ΔG = ΔH − TΔS.', '(b) A negative ΔG means spontaneous, and a positive one means not.', '(c) At the limit ΔG = 0, so T = ΔH / ΔS.', '(c) T = 40,000 / 100 = 400 K.']),
  long(B(5, 3), 'Answer each part.\n(a) State the third law of thermodynamics. [1]\n(b) Say whether entropy rises or falls in each, with a reason: water freezing; solid CaCO₃ becoming CaO and CO₂. [2]\n(c) A reaction with ΔH and ΔS both negative is spontaneous only at low temperatures. Explain this. [2]', ['(a) The entropy of a perfect crystal at 0 K is zero.', '(b) It falls on freezing, as the molecules become more ordered.', '(b) It rises on decomposing, as a gas forms.', '(c) ΔG = ΔH − TΔS, and −TΔS is positive.', '(c) At low T, the negative ΔH wins, while at high T the positive term makes ΔG positive.']),
];

export default questions;
