// Written by hand: aldehydes and ketones, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('chemistry', 'XII');
const A = at(8, 'a');

const questions: BankDef[] = [
  odd(A(2, 1), ['methanal', 'ethanal', 'propanal', 'propanone'], 'propanone', 'It is a ketone; the others are aldehydes.'),
  odd(A(2, 2), ['ethanal', 'propanone', 'butan-2-one', 'methanal'], 'methanal', 'It gives no iodoform test, having no CH₃CO– group; the others do.'),
  odd(A(2, 2), ['HCN', 'NaHSO₃', 'NH₂OH', 'Br₂ in CCl₄'], 'Br₂ in CCl₄', 'It doesn’t add across C=O; the others add to the carbonyl group as nucleophiles.'),
  odd(A(2, 3), ['methanal', 'benzaldehyde', '2,2-dimethylpropanal', 'ethanal'], 'ethanal', 'It has α-hydrogens, so it gives the aldol reaction; the others undergo the Cannizzaro reaction.'),
  odd(A(2, 3), ['Tollens’ reagent', 'Fehling’s solution', 'Schiff’s reagent', '2,4-DNP'], '2,4-DNP', 'It reacts with ketones too; the others react with aldehydes only.'),
];

export default questions;
