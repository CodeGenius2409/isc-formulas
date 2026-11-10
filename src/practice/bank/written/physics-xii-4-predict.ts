// Written by hand: alternating current, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('physics', 'XII');
const B = at(4, 'b');

const questions: BankDef[] = [
  predict(B(2, 1), 'A lamp in series with a capacitor glows on an a.c. supply. Predict what happens to its brightness if the supply’s frequency is raised.', 'The capacitor’s reactance, 1/ωC, falls.', 'So more current flows, and the lamp glows brighter.'),
  predict(B(2, 2), 'A lamp in series with an inductor glows on an a.c. supply. Predict what happens when an iron rod is pushed into the inductor.', 'The inductance rises, so the reactance ωL rises.', 'The current falls, and the lamp dims.'),
  predict(B(2, 2), 'A series LCR circuit is at resonance. Predict what happens to the current and the power factor if the capacitance is then increased.', 'The circuit leaves resonance, so the impedance rises and the current falls.', 'The power factor falls below 1.'),
  predict(B(3, 3), 'In a series LCR circuit at resonance, the resistance is halved. Predict what happens to the resonant frequency, the peak current and the sharpness of resonance.', 'The resonant frequency stays 1/2π√(LC), as R isn’t in it.', 'The current at resonance, V/R, doubles.', 'The resonance becomes sharper, with a higher Q factor.'),
  predict(B(2, 3), 'An ideal inductor is joined to an a.c. supply. Predict the average power it takes over a cycle.', 'Zero.', 'The current lags the voltage by π/2, so cos φ = 0: the energy stored in one quarter cycle is returned in the next.'),
];

export default questions;
