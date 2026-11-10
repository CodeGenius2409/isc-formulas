// Written by hand: aldehydes and ketones, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('chemistry', 'XII');
const A = at(8, 'a');

const questions: BankDef[] = [
  tell(A(2, 1), 'Distinguish between the carbonyl group of an aldehyde and that of a ketone.', 'In an aldehyde, the carbonyl carbon carries at least one hydrogen: –CHO.', 'In a ketone, it carries two carbon groups and no hydrogen.'),
  tell(A(2, 2), 'Distinguish between aldol condensation and the Cannizzaro reaction.', 'Aldol: a carbonyl compound with an α-hydrogen, in dilute alkali, joins another to give a β-hydroxy carbonyl compound.', 'Cannizzaro: an aldehyde with no α-hydrogen, in strong alkali, gives an alcohol and a carboxylic acid salt.'),
  tell(A(2, 2), 'Distinguish between Tollens’ reagent and Fehling’s solution.', 'Tollens’ is ammoniacal silver nitrate; it gives a silver mirror with all aldehydes.', 'Fehling’s is alkaline copper(II) tartrate; it gives a red precipitate with aliphatic aldehydes only.'),
  tell(A(2, 3), 'Distinguish between benzaldehyde and ethanal by a chemical test.', 'Warm each with Fehling’s solution.', 'Ethanal gives a red precipitate of Cu₂O; benzaldehyde, an aromatic aldehyde, gives none.'),
];

export default questions;
