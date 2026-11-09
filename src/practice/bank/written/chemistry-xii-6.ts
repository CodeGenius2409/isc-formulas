// Written by hand: Polyhalogen compounds. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, ar, theory } = bank('chemistry', 'XII');
const P = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [6, 'c', marks, d];

const questions: BankDef[] = [
  mcq(P(1, 1), 'A compound once used as an antiseptic, with a strong smell, is:', ['iodoform', 'DDT', 'freon-12', 'dichloromethane'], 0),
  mcq(P(1, 2), 'In the upper atmosphere, freons mainly harm:', ['the ozone layer', 'the soil', 'rain water', 'plant roots'], 0),
  ar(P(1, 2), 'Chloroform is stored in dark bottles, filled to the top.', 'Air and light slowly oxidise it to poisonous phosgene.', 1),
  ar(P(1, 2), 'DDT builds up along food chains.', 'It is stable, and it dissolves in fats rather than water.', 1),
  theory('reason', P(1, 2), 'Give a reason: tetrachloromethane is no longer in wide use as a dry-cleaning solvent.', ['It can damage the liver and nerves, and it harms the ozone layer in the upper atmosphere.']),
  theory('short', P(2, 2), 'Give one use of dichloromethane, and one health risk.', ['A solvent, for example in paint removers.', 'High exposure can harm the nervous system, causing dizziness and nausea.']),
  theory('short', P(2, 3), 'Explain how a chlorine atom from a freon destroys ozone, and why one atom can do so much harm.', ['Cl• + O₃ → ClO• + O₂, and then ClO• + O• → Cl• + O₂.', 'The chlorine atom is released again, and it goes on destroying more ozone.']),
];

export default questions;
