// Written by hand: d- and f-block elements, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('chemistry', 'XII');
const A = at(4, 'a');

const questions: BankDef[] = [
  predict(A(2, 1), 'Predict whether an aqueous solution of Sc³⁺ is coloured, and give the reason.', 'It is colourless.', 'Sc³⁺ has no d electrons, so no d–d transition can absorb visible light.'),
  predict(A(2, 2), 'Predict which of Ti³⁺ and Ti⁴⁺ is coloured in solution, and why.', 'Ti³⁺, with one 3d electron, is coloured, as it can absorb visible light in a d–d transition.', 'Ti⁴⁺ is 3d⁰, with no d electron to do so, so it is colourless.'),
  predict(A(2, 2), 'Predict whether Cr²⁺ acts as an oxidising or a reducing agent in water, and why.', 'A reducing agent.', 'It is easily oxidised to Cr³⁺, whose t₂g³ arrangement is especially stable.'),
  predict(A(3, 3), 'Predict which of Mn²⁺ and Fe²⁺ is more easily oxidised to the +3 state, and explain from their electron configurations.', 'Fe²⁺ is more easily oxidised.', 'Mn²⁺ is 3d⁵, a stable half-filled set, which losing an electron would break.', 'Fe²⁺ is 3d⁶; losing one electron gives the stable 3d⁵.'),
  predict(A(2, 3), 'Predict whether Cu⁺ is stable in water, and what happens to it.', 'It isn’t stable: it disproportionates.', '2Cu⁺ → Cu²⁺ + Cu, as Cu²⁺ is much more strongly hydrated.'),
];

export default questions;
