// Written by hand: coordination compounds, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('chemistry', 'XII');
const A = at(5, 'a');

const questions: BankDef[] = [
  ar(A(1, 1), '[Fe(CN)₆]⁴⁻ is diamagnetic.', 'CN⁻ is a strong-field ligand, which pairs the six d electrons in t₂g.', 1, 'With no unpaired electrons, the complex is diamagnetic.'),
  ar(A(1, 2), 'Tetrahedral complexes are nearly always high spin.', 'The tetrahedral splitting Δt is only about 4/9 of Δo.', 1, 'Δt is almost always smaller than the pairing energy.'),
  ar(A(1, 2), 'Complexes with chelating ligands are usually more stable than similar ones with monodentate ligands.', 'A chelating ligand forms a ring with the metal.', 1, 'Ring formation, the chelate effect, makes the complex harder to break apart.'),
  ar(A(1, 3), '[Co(NH₃)₆]³⁺ is coloured.', 'It has no d electrons.', 3, 'Co³⁺ is d⁶; its colour comes from d–d transitions between t₂g and eg.'),
];

export default questions;
