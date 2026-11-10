// Written by hand: d- and f-block elements, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('chemistry', 'XII');
const A = at(4, 'a');

const questions: BankDef[] = [
  predict(A(2, 1), 'Predict whether an aqueous solution of Sc³⁺ is coloured, and give the reason.', 'It is colourless.', 'Sc³⁺ has no d electrons, so no d–d transition can absorb visible light.'),
  predict(A(2, 2), 'Acidified potassium dichromate is added to a solution of Fe²⁺ ions. Predict the colour change, and what happens to each ion.', 'Orange changes to green.', 'Cr₂O₇²⁻ is reduced to Cr³⁺, and Fe²⁺ is oxidised to Fe³⁺.'),
  predict(A(2, 2), 'An alkali is added to a solution of potassium dichromate. Predict what is seen.', 'The orange solution turns yellow.', 'Dichromate changes to chromate, CrO₄²⁻, in alkali.'),
  predict(A(3, 3), 'Predict which of Mn²⁺ and Fe²⁺ is more easily oxidised to the +3 state, and explain from their electron configurations.', 'Fe²⁺ is more easily oxidised.', 'Mn²⁺ is 3d⁵, a stable half-filled set, which losing an electron would break.', 'Fe²⁺ is 3d⁶; losing one electron gives the stable 3d⁵.'),
  predict(A(2, 3), 'Predict whether Cu⁺ is stable in water, and what happens to it.', 'It isn’t stable: it disproportionates.', '2Cu⁺ → Cu²⁺ + Cu, as Cu²⁺ is much more strongly hydrated.'),
];

export default questions;
