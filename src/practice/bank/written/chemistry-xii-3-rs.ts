// Written by hand: kinetics, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('chemistry', 'XII');
const A = at(3, 'a');
const B = at(3, 'b');

const questions: BankDef[] = [
  tell(A(2, 1), 'Distinguish between average and instantaneous rate of a reaction.', 'Average rate is the change in concentration over a stretch of time.', 'Instantaneous rate is the rate at a given moment, the slope of the tangent there.'),
  reason(B(1, 1), 'Why does a small rise in temperature greatly speed up a reaction?', 'The fraction of molecules with energy at least equal to the activation energy rises sharply.'),
  reason(B(2, 2), 'Why does a catalyst speed up a reaction but not change its equilibrium constant?', 'It offers a route with lower activation energy for both directions.', 'So both rates rise alike, and the equilibrium isn’t moved.'),
  reason(B(2, 2), 'Not every collision between molecules leads to a reaction. Why?', 'They must have enough energy, at least the threshold energy.', 'They must also collide in the right orientation.'),
  reason(B(1, 2), 'Why is a graph of ln k against 1/T a straight line?', 'The Arrhenius equation gives ln k = ln A − Eₐ/RT, which is a line in 1/T.'),
  reason(B(2, 3), 'Why is a reaction with a large activation energy more sensitive to temperature?', 'The slope of ln k against 1/T is −Eₐ/R.', 'So a large Eₐ gives a greater change in k for the same change in T.'),
  short(B(2, 1), 'Define activation energy and threshold energy, and link them.', 'Threshold energy is the least energy molecules need to react.', 'Activation energy is the excess over their average energy, needed to reach it.'),
  short(B(2, 2), 'Write the Arrhenius equation, and say what each symbol stands for.', 'k = A e^(−Eₐ/RT).', 'k is the rate constant, A the frequency factor, Eₐ the activation energy, R the gas constant and T the temperature.'),
  short(B(3, 2), 'Sketch in words an energy profile for an exothermic reaction, and name what the peak stands for. What does a catalyst change on it?', 'The products lie lower than the reactants.', 'The peak is the activated complex.', 'A catalyst lowers the peak, and doesn’t change the ends.'),
  short(B(3, 3), 'What two factors decide the rate according to simple collision theory? Say how each appears in the Arrhenius equation.', 'The frequency of suitably oriented collisions appears as A.', 'The share of molecules with enough energy appears as e^(−Eₐ/RT).', 'So rate depends on both.'),
];

export default questions;
