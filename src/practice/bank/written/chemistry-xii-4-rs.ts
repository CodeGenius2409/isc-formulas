// Written by hand: d- and f-block elements, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short } = kit('chemistry', 'XII');
const A = at(4, 'a');
const B = at(4, 'b');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why are most transition metal ions coloured?', 'They have unpaired d electrons, which absorb visible light in moving between d orbitals.'),
  reason(A(2, 2), 'Why do transition metals show many oxidation states?', 'The energies of their (n−1)d and ns electrons are close.', 'So different numbers of them can be lost or shared.'),
  reason(A(2, 2), 'Why do transition metals make good catalysts?', 'They can change oxidation state readily.', 'They also offer a surface to bind reactants.'),
  reason(A(2, 3), 'Why is Zn not usually regarded as a transition metal, though it’s in the d-block?', 'Zn and Zn²⁺ both have a full 3d¹⁰ subshell.', 'A transition metal has an incomplete d subshell in the atom or a common ion.'),
  short(A(2, 1), 'What is lanthanoid contraction? Give one result of it.', 'The steady fall in atomic and ionic radii across the lanthanoids.', 'Zr and Hf have almost the same size, so they are hard to separate.'),
  short(A(2, 2), 'What are interstitial compounds? State two properties.', 'Small atoms like C or N fill the holes in a metal’s lattice.', 'They are very hard, and melt at high temperatures.'),
  short(A(3, 2), 'Find the spin-only magnetic moment of Mn²⁺ and of Fe²⁺.', 'μ = √(n(n + 2)) BM.', 'Mn²⁺ has 5 unpaired electrons, so 5.92 BM.', 'Fe²⁺ has 4, so 4.90 BM.'),
  short(A(3, 3), 'State three differences between lanthanoids and actinoids.', 'Actinoids show more oxidation states.', 'Actinoids are all radioactive, and lanthanoids mostly aren’t.', 'Lanthanoids’ 4f electrons are held more tightly, while 5f electrons take part in bonding more readily.'),
  reason(B(2, 2), 'Why is KMnO₄ strongly coloured, though Mn(VII) has no d electrons?', 'The colour comes from charge transfer, from oxygen to manganese.', 'It isn’t from a d–d change, as there are no d electrons.'),
  reason(B(1, 2), 'Why is KMnO₄ not acidified with HCl in titrations?', 'It oxidises Cl⁻ to chlorine, so some of it would be used up.'),
  reason(B(2, 3), 'Why does K₂Cr₂O₇ solution turn yellow when alkali is added?', 'Orange Cr₂O₇²⁻ changes into yellow CrO₄²⁻.', 'It is an equilibrium that depends on pH, and H⁺ is used up.'),
  reason(B(2, 2), 'Why is a KMnO₄ solution kept in a dark bottle?', 'Light breaks it down slowly.', 'It forms MnO₂, which also speeds up the breakdown.'),
  short(B(2, 1), 'Starting from a chromite ore, name the steps in making K₂Cr₂O₇.', 'Fuse with Na₂CO₃ in air to give Na₂CrO₄, then acidify to Na₂Cr₂O₇.', 'Add KCl, and crystallise out K₂Cr₂O₇.'),
  short(B(2, 2), 'Write the half-equation of permanganate in acid, and in neutral or weakly alkaline solution.', 'In acid: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O.', 'In neutral: MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻.'),
  short(B(3, 2), 'Write the balanced equation for acidified dichromate reacting with Fe²⁺, and name the colour change.', 'Cr₂O₇²⁻ + 14H⁺ + 6Fe²⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O.', 'Each dichromate takes 6 electrons.', 'Orange to green.'),
  short(B(3, 3), 'Name the two main steps in making KMnO₄ from MnO₂, and write the first as an equation.', '2MnO₂ + 4KOH + O₂ → 2K₂MnO₄ + 2H₂O.', 'K₂MnO₄ is then oxidised, electrolytically or by disproportionation in acid.', 'It gives purple KMnO₄, which crystallises out.'),
];

export default questions;
