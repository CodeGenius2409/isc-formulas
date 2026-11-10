// Written by hand: solutions, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('chemistry', 'XII');
const A = at(1, 'a');

const questions: BankDef[] = [
  match(A(3, 1), [['Molarity', 'Moles of solute per litre of solution'], ['Molality', 'Moles of solute per kilogram of solvent'], ['Mole fraction', 'Moles of one part over total moles']]),
  match(A(4, 2), [['Relative lowering of vapour pressure', 'Mole fraction of the solute'], ['Elevation of boiling point', 'K_b m'], ['Depression of freezing point', 'K_f m'], ['Osmotic pressure', 'CRT']]),
  match(A(3, 2), [['Positive deviation from Raoult’s law', 'Ethanol and water'], ['Negative deviation from Raoult’s law', 'Chloroform and acetone'], ['Nearly ideal solution', 'Benzene and toluene']]),
  match(A(4, 3), [['NaCl in water', 'van ’t Hoff factor about 2'], ['Glucose in water', 'van ’t Hoff factor 1'], ['Ethanoic acid in benzene', 'van ’t Hoff factor about ½'], ['K₂SO₄ in water', 'van ’t Hoff factor about 3']]),
  match(A(3, 3), [['Isotonic solutions', 'Same osmotic pressure'], ['Hypertonic solution', 'Higher osmotic pressure'], ['Reverse osmosis', 'Pressure above the osmotic pressure pushes solvent out']]),
];

export default questions;
