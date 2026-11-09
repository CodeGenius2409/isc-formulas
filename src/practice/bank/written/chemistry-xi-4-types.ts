// Written by hand: chemical bonding, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('chemistry', 'XI');
const A = at(4, 'a');
const B = at(4, 'b');

const questions: BankDef[] = [
  long(A(5, 2), 'Answer each part on ionic and covalent bonds.\n(a) Name the steps of the Born–Haber cycle for NaCl, in order. [2]\n(b) Why does MgO have a far higher melting point than NaCl? [1]\n(c) State Fajans’ rules, and use them to say why AlCl₃ is more covalent than NaCl. [2]', ['(a) Sublimation of Na, then its ionisation.', '(a) Dissociation of ½Cl₂, then the electron gain of Cl, then the formation of the lattice.', '(b) Its ions have double the charge and are smaller, so its lattice enthalpy is far higher.', '(c) Covalent character grows with a small, highly charged cation and a large anion.', '(c) Al³⁺ is smaller and more highly charged than Na⁺, so it distorts Cl⁻ more.']),
  long(B(5, 2), 'Answer each part.\n(a) Use VSEPR theory to say why the bond angles in CH₄, NH₃ and H₂O are about 109.5°, 107° and 104.5°. [3]\n(b) State the hybridisation of carbon in ethene and ethyne. [1]\n(c) State the hybridisation of the central atom in SF₆. [1]', ['(a) Each central atom has four electron pairs, around a tetrahedron.', '(a) CH₄ has no lone pairs, NH₃ has one and H₂O has two.', '(a) Lone pairs repel more than bonding pairs, so they push the bonds closer.', '(b) sp² in ethene, and sp in ethyne.', '(c) sp³d².']),
  long(B(5, 3), 'Answer each part using molecular orbital theory.\n(a) Write the configuration of O₂, and find its bond order. [2]\n(b) Why is O₂ paramagnetic? [1]\n(c) Arrange O₂, O₂⁺ and O₂⁻ by bond length, and give the reason. [2]', ['(a) The filled orbitals end with π*2p with two unpaired electrons.', '(a) Bond order = (10 − 6) / 2 = 2.', '(b) It has two unpaired electrons in its π* orbitals.', '(c) O₂⁺ < O₂ < O₂⁻.', '(c) Their bond orders are 2.5, 2 and 1.5, and a higher bond order makes a shorter bond.']),
];

export default questions;
