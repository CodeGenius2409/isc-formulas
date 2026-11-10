// Written by hand: coordination compounds, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('chemistry', 'XII');
const A = at(5, 'a');

const questions: BankDef[] = [
  tell(A(2, 1), 'In a complex, distinguish between the metal’s coordination number and its oxidation state.', 'The coordination number is the number of donor atoms bonded to the metal.', 'The oxidation number is the charge the metal would have if all the ligands were removed with their electron pairs.'),
  tell(A(2, 2), 'Distinguish between high-spin and low-spin octahedral complexes.', 'High spin: with a weak-field ligand, Δo is less than the pairing energy, so electrons spread out before pairing.', 'Low spin: with a strong-field ligand, Δo is larger, so electrons pair in t₂g first.'),
  tell(A(2, 2), 'Distinguish between a monodentate and a chelating ligand, with an example of each.', 'A monodentate ligand binds through one donor atom, as NH₃ does.', 'A chelating ligand binds through two or more, forming a ring, as ethylenediamine does.'),
  tell(A(2, 3), 'Distinguish between a strong-field and a weak-field ligand.', 'A strong-field ligand, such as CN⁻, splits the d orbitals widely, giving low-spin complexes.', 'A weak-field ligand, such as Cl⁻, splits them only slightly, giving high-spin complexes.'),
  tell(A(2, 3), 'Distinguish between homoleptic and heteroleptic complexes, with an example of each.', 'A homoleptic complex has only one kind of ligand, as [Co(NH₃)₆]³⁺.', 'A heteroleptic complex has more than one kind, as [Co(NH₃)₄Cl₂]⁺.'),
];

export default questions;
