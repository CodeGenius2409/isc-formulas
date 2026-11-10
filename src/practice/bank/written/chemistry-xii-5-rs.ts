// Written by hand: coordination compounds, reasons. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason } = kit('chemistry', 'XII');
const A = at(5, 'a');

const questions: BankDef[] = [
  reason(A(1, 1), 'Why is [Ni(CO)₄] tetrahedral and diamagnetic?', 'CO pairs nickel’s electrons, so it is sp³ hybridised, with no unpaired electrons.'),
  reason(A(2, 2), 'Why is [Co(NH₃)₆]³⁺ diamagnetic, though Co³⁺ has six d electrons?', 'NH₃ is a strong ligand, which forces the electrons to pair in the lower orbitals.', 'So there are no unpaired electrons in the d²sp³ complex.'),
  reason(A(2, 2), 'Why is [Fe(H₂O)₆]³⁺ strongly paramagnetic, while [Fe(CN)₆]³⁻ is only weakly so?', 'H₂O is a weak field ligand, so there are five unpaired electrons.', 'CN⁻ is a strong field ligand, so only one remains.'),
  reason(A(2, 3), 'Why are chelate complexes more stable than similar ones with simple ligands?', 'Ring formation leaves the metal held at two or more points.', 'Entropy also rises, as one chelating ligand frees several simple ones.'),
  reason(A(1, 2), 'Why do [Ti(H₂O)₆]³⁺ solutions look violet?', 'Its one d electron absorbs yellow-green light in a d–d change, leaving the colour opposite to it.'),
];

export default questions;
