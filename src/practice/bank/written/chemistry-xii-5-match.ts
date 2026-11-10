// Written by hand: coordination compounds, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('chemistry', 'XII');
const A = at(5, 'a');

const questions: BankDef[] = [
  match(A(3, 1), [['Ethylenediamine', 'A bidentate ligand'], ['EDTA⁴⁻', 'A hexadentate ligand'], ['NO₂⁻', 'An ambidentate ligand']]),
  match(A(4, 2), [['sp³', 'Tetrahedral'], ['dsp²', 'Square planar'], ['d²sp³', 'Inner-orbital octahedral'], ['sp³d²', 'Outer-orbital octahedral']]),
  match(A(3, 2), [['[Co(NH₃)₆]Cl₃', 'Gives three Cl⁻ ions in water'], ['[Co(NH₃)₅Cl]Cl₂', 'Gives two Cl⁻ ions in water'], ['[Co(NH₃)₄Cl₂]Cl', 'Gives one Cl⁻ ion in water']]),
  match(A(4, 3), [['[Co(NH₃)₅NO₂]²⁺ and [Co(NH₃)₅ONO]²⁺', 'Linkage isomers'], ['[Co(NH₃)₅Br]SO₄ and [Co(NH₃)₅SO₄]Br', 'Ionisation isomers'], ['cis and trans [Pt(NH₃)₂Cl₂]', 'Geometrical isomers'], ['The two forms of [Co(en)₃]³⁺', 'Optical isomers']]),
  match(A(3, 3), [['Strong-field ligand such as CN⁻', 'Large splitting, low spin'], ['Weak-field ligand such as F⁻', 'Small splitting, high spin'], ['Colour of a complex', 'Comes from d–d transitions']]),
];

export default questions;
