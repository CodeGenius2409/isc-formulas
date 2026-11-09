// Written by hand: hydrocarbons, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XI');
const A = at(9, 'a');
const B = at(9, 'b');
const C = at(9, 'c');
const D = at(9, 'd');

const questions: BankDef[] = [
  long(A(5, 2), 'Answer each part on alkanes.\n(a) Write the steps of the chlorination of methane in sunlight: initiation, propagation and termination. [3]\n(b) How would you make butane from ethyl bromide? Name the reaction. [1]\n(c) Why can’t this reaction make methane? [1]', ['(a) Initiation: Cl₂ → 2Cl•, in light.', '(a) Propagation: CH₄ + Cl• → CH₃• + HCl, then CH₃• + Cl₂ → CH₃Cl + Cl•.', '(a) Termination: two radicals join, as in CH₃• + Cl• → CH₃Cl.', '(b) Heat it with sodium in dry ether: the Wurtz reaction.', '(c) It joins two alkyl groups, so its product has at least two carbons.']),
  long(B(5, 2), 'Answer each part on propene.\n(a) State Markovnikov’s rule, and write the main product with HBr. [2]\n(b) Explain the rule by the stability of the carbocation. [1]\n(c) What changes when a peroxide is present, and why? [1]\n(d) What does ozonolysis of propene give? [1]', ['(a) The hydrogen adds to the carbon of the double bond that already has more hydrogens.', '(a) The product is 2-bromopropane.', '(b) It goes through the secondary carbocation, which is more stable than the primary.', '(c) 1-bromopropane forms, as the mechanism becomes free radical.', '(d) Ethanal and methanal.']),
  long(C(5, 2), 'Answer each part on alkynes.\n(a) Why are the hydrogens of ethyne acidic, unlike those of ethene? [1]\n(b) Give a test that tells but-1-yne from but-2-yne. [1]\n(c) What do you get from ethyne with hydrogen over Lindlar’s catalyst? [1]\n(d) Write the product of adding water to ethyne, with its catalyst, and name the step that changes the first product. [2]', ['(a) Its sp carbon has more s character, so it holds the electrons of the C–H bond closer.', '(b) With ammoniacal AgNO₃, only but-1-yne gives a white precipitate.', '(c) Ethene.', '(d) With dilute H₂SO₄ and HgSO₄, it gives ethanal.', '(d) The first product, an enol, changes by keto–enol tautomerism.']),
  long(D(5, 2), 'Answer each part on benzene.\n(a) What shows that benzene isn’t a simple triene? Give two pieces of evidence. [2]\n(b) Write the steps of its nitration, and name the electrophile. [2]\n(c) Is –CH₃ activating, and where does it direct? [1]', ['(a) All its C–C bonds have the same length, between those of a single and a double bond.', '(a) It prefers substitution to addition, and doesn’t decolourise bromine water.', '(b) H₂SO₄ and HNO₃ give NO₂⁺, the electrophile.', '(b) It attacks the ring to give a carbocation, which then loses H⁺.', '(c) It activates, and directs to the ortho and para positions.']),
  long(D(5, 3), 'Answer each part.\n(a) State Hückel’s rule, and use it to say which is aromatic: cyclopentadienyl anion or cyclobutadiene. [2]\n(b) Why is nitrobenzene nitrated only in harsh conditions, and where does the new group go? [2]\n(c) Name a Friedel–Crafts reaction of benzene, and its catalyst. [1]', ['(a) A planar ring with (4n + 2) π electrons in continuous overlap is aromatic.', '(a) The anion, with 6 π electrons, while cyclobutadiene has 4.', '(b) –NO₂ withdraws electrons and deactivates the ring.', '(b) The new group goes to the meta position.', '(c) Alkylation or acylation, with anhydrous AlCl₃.']),
];

export default questions;
