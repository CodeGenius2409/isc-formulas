// Written by hand: coordination compounds, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('chemistry', 'XII');
const A = at(5, 'a');

const questions: BankDef[] = [
  predict(A(2, 1), 'Excess silver nitrate is added to a solution of one mole of [Co(NH₃)₅Cl]Cl₂. Predict how many moles of AgCl form.', 'Two moles.', 'Only the two chloride ions outside the coordination sphere are free in solution; the one bonded to cobalt doesn’t react.'),
  predict(A(2, 2), 'Predict whether [Ni(CN)₄]²⁻ is paramagnetic or diamagnetic, given that it is square planar.', 'Diamagnetic.', 'Ni²⁺ is d⁸; with strong-field CN⁻ in a square planar dsp² complex, all eight electrons are paired.'),
  predict(A(2, 2), 'The ligands round a metal ion are changed from H₂O to NH₃, a stronger-field ligand. Predict the change in the colour absorbed.', 'Δo rises, so higher-energy light, of shorter wavelength, is absorbed.', 'The complex’s colour shifts accordingly, as for Cu²⁺, from pale blue to deep blue.'),
  predict(A(3, 3), 'Predict whether [CoF₆]³⁻ is high spin or low spin, and how many unpaired electrons it has.', 'High spin, as F⁻ is a weak-field ligand.', 'Co³⁺ is d⁶; with a small Δo, four electrons stay unpaired: t₂g⁴ eg².', 'So it has four unpaired electrons and is paramagnetic.'),
  predict(A(2, 3), 'Predict whether [Pt(NH₃)₂Cl₂], which is square planar, shows optical isomerism.', 'No.', 'A square planar complex has a plane of symmetry, the plane of the molecule, so its mirror image is the same.'),
];

export default questions;
