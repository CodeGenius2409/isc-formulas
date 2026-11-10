// Written by hand: alcohols, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('chemistry', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  predict(A(2, 1), 'A small piece of sodium is dropped into ethanol. Predict what is seen, and write the products.', 'It fizzes steadily, more gently than with water, as hydrogen is given off.', 'The products are sodium ethoxide and hydrogen.'),
  predict(A(2, 2), 'Predict which of propan-1-ol and propan-2-ol turns Lucas reagent cloudy first, and why.', 'Propan-2-ol, in about five minutes; propan-1-ol shows no cloudiness at room temperature.', 'A secondary alcohol forms a more stable carbocation, so its chloride forms faster.'),
  predict(A(2, 2), 'Ethanol is warmed with acidified potassium dichromate. Predict the colour change and the organic product if the product is distilled off at once.', 'Orange turns green.', 'Ethanal, as it is removed before it can be oxidised further to ethanoic acid.'),
  predict(A(3, 3), 'Predict how the boiling points of methanol, ethanol, propan-1-ol and butan-1-ol compare, and explain.', 'They rise steadily from methanol to butan-1-ol.', 'All of them form hydrogen bonds through their –OH groups.', 'Each extra CH₂ adds van der Waals attraction, so more energy is needed to separate the molecules.'),
  predict(A(2, 3), 'Predict the product when 2-methylpropan-2-ol is warmed with acidified potassium dichromate.', 'No reaction, under mild conditions.', 'A tertiary alcohol has no hydrogen on the carbon bearing –OH, so it can’t be oxidised that way.'),
];

export default questions;
