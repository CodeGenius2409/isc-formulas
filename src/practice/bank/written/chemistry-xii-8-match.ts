// Written by hand: aldehydes and ketones, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('chemistry', 'XII');
const A = at(8, 'a');

const questions: BankDef[] = [
  match(A(3, 1), [['Tollens’ reagent', 'Silver mirror with aldehydes'], ['Fehling’s solution', 'Red precipitate with aliphatic aldehydes'], ['2,4-DNP', 'Orange precipitate with any carbonyl']]),
  match(A(4, 2), [['Aldol condensation', 'Needs an α-hydrogen'], ['Cannizzaro reaction', 'Aldehyde with no α-hydrogen, in strong alkali'], ['Clemmensen reduction', 'Zinc amalgam and HCl'], ['Wolff–Kishner reduction', 'Hydrazine, then KOH in glycol']]),
  match(A(3, 2), [['Ethanal with HCN', 'Cyanohydrin'], ['Propanone with NH₂OH', 'Oxime'], ['Ethanal with NH₂NH₂', 'Hydrazone']]),
  match(A(4, 3), [['Rosenmund reduction', 'Acid chloride to aldehyde'], ['Stephen reaction', 'Nitrile to aldehyde'], ['Etard reaction', 'Toluene to benzaldehyde'], ['Ozonolysis', 'Alkene to carbonyl compounds']]),
  match(A(3, 3), [['Iodoform test', 'Methyl ketones and ethanal'], ['Schiff’s reagent', 'Turns pink with aldehydes'], ['Sodium bisulphite', 'Crystalline addition product']]),
];

export default questions;
