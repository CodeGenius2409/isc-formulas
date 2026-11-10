// Written by hand: aldehydes and ketones, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('chemistry', 'XII');
const A = at(8, 'a');

const questions: BankDef[] = [
  predict(A(2, 1), 'Propanone is warmed with Tollens’ reagent. Predict what is seen, and why.', 'Nothing: no silver mirror forms.', 'A ketone has no hydrogen on its carbonyl carbon, so it isn’t easily oxidised.'),
  predict(A(2, 2), 'Benzaldehyde is heated with concentrated NaOH. Predict the products, and name the reaction.', 'Benzyl alcohol and sodium benzoate.', 'The Cannizzaro reaction, as benzaldehyde has no α-hydrogen.'),
  predict(A(2, 2), 'Predict which of ethanal and propanone adds HCN more readily, and why.', 'Ethanal.', 'Its carbonyl carbon has only one alkyl group, so it is less crowded and more electron-poor.'),
  predict(A(3, 3), 'Propanone is warmed with iodine and sodium hydroxide. Predict what is seen, and the two products.', 'A yellow precipitate with an antiseptic smell.', 'The precipitate is iodoform, CHI₃.', 'The other product is sodium ethanoate.'),
  predict(A(2, 3), 'Ethanal and propanal are mixed and treated with dilute alkali. Predict how many aldol products can form, and why.', 'Four.', 'Each can act as both the attacking carbanion and the acceptor, giving two self- and two cross-products.'),
];

export default questions;
