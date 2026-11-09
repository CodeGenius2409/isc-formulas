// Written by hand: redox reactions, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XI');
const A = at(7, 'a');

const questions: BankDef[] = [
  long(A(5, 2), 'Permanganate ions oxidise Fe²⁺ to Fe³⁺ in acid, and become Mn²⁺.\n(a) Find the oxidation number of Mn in MnO₄⁻. [1]\n(b) Write the two half-equations. [2]\n(c) Write the balanced ionic equation. [1]\n(d) Name the oxidising agent. [1]', ['(a) +7.', '(b) MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O.', '(b) Fe²⁺ → Fe³⁺ + e⁻.', '(c) MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O.', '(d) MnO₄⁻.']),
  long(A(5, 3), 'Answer each part.\n(a) Balance by the half-reaction method, in acid: Cr₂O₇²⁻ + I⁻ → Cr³⁺ + I₂. [2]\n(b) What is a disproportionation reaction? Show that Cl₂ with cold NaOH is one, using oxidation numbers. [2]\n(c) Find the oxidation number of sulphur in S₂O₃²⁻, on average. [1]', ['(a) Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O, and 2I⁻ → I₂ + 2e⁻.', '(a) Cr₂O₇²⁻ + 14H⁺ + 6I⁻ → 2Cr³⁺ + 3I₂ + 7H₂O.', '(b) One element in a reaction is both oxidised and reduced.', '(b) Chlorine goes from 0 to −1 in NaCl and to +1 in NaClO.', '(c) +2.']),
];

export default questions;
