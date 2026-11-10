// Written by hand: d- and f-block elements, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('chemistry', 'XII');
const A = at(4, 'a');

const questions: BankDef[] = [
  match(A(3, 1), [['Zinc', 'Not a typical transition element'], ['Manganese', 'Shows the most oxidation states in the first series'], ['Scandium', 'Its common ion, Sc³⁺, is colourless']]),
  match(A(4, 2), [['KMnO₄', 'Purple'], ['K₂Cr₂O₇', 'Orange'], ['CuSO₄·5H₂O', 'Blue'], ['FeSO₄·7H₂O', 'Pale green']]),
  match(A(3, 2), [['Lanthanoid contraction', 'Zr and Hf have nearly the same size'], ['Actinoids', 'Mostly radioactive'], ['Ce⁴⁺', 'A good oxidising agent']]),
  match(A(4, 3), [['Iron in the Haber process', 'Catalyst'], ['V₂O₅ in the contact process', 'Catalyst for making SO₃'], ['Paramagnetism', 'Unpaired d electrons'], ['Interstitial compounds', 'Small atoms trapped in a metal lattice']]),
  match(A(3, 3), [['MnO₄⁻ in acid', 'Reduced to Mn²⁺'], ['MnO₄⁻ in neutral solution', 'Reduced to MnO₂'], ['Cr₂O₇²⁻ in acid', 'Reduced to Cr³⁺']]),
];

export default questions;
