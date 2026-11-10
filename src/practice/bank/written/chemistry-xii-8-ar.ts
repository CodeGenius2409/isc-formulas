// Written by hand: aldehydes and ketones, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('chemistry', 'XII');
const A = at(8, 'a');

const questions: BankDef[] = [
  ar(A(1, 1), 'Aldehydes are easily oxidised, and ketones are not.', 'An aldehyde has a hydrogen on its carbonyl carbon.', 1, 'That hydrogen lets the carbonyl carbon be oxidised to –COOH without breaking a C–C bond.'),
  ar(A(1, 2), 'Methanal undergoes the aldol reaction.', 'Methanal has no α-hydrogen.', 4, 'Without an α-hydrogen it can’t form the carbanion the aldol reaction needs; it gives the Cannizzaro reaction instead.'),
  ar(A(1, 2), 'Propanone gives a positive iodoform test.', 'Propanone has a CH₃CO– group.', 1, 'Methyl ketones and ethanal give iodoform with iodine and alkali.'),
  ar(A(1, 3), 'Benzaldehyde gives a red precipitate with Fehling’s solution.', 'Benzaldehyde reduces Tollens’ reagent.', 4, 'Aromatic aldehydes don’t reduce Fehling’s solution, though they do reduce Tollens’ reagent.'),
  ar(A(1, 3), 'Aldehydes boil lower than alcohols of similar mass.', 'Aldehyde molecules can’t hydrogen bond with one another.', 1, 'They have only dipole–dipole forces, weaker than the hydrogen bonds between alcohol molecules.'),
];

export default questions;
