// Written by hand: the semiconductor diode, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('physics', 'XII');
const B = at(9, 'b');

const questions: BankDef[] = [
  predict(B(2, 1), 'A diode in forward bias has the battery reversed. Predict what happens to the current and to the depletion layer.', 'The current falls to a tiny reverse current.', 'The depletion layer widens.'),
  predict(B(2, 2), 'The smoothing capacitor in a full-wave rectifier is replaced by one of much larger capacitance. Predict the effect on the output.', 'The output becomes smoother, with less ripple.', 'A larger capacitor discharges more slowly between peaks.'),
  predict(B(2, 2), 'The input voltage to a Zener regulator rises a little, above the Zener voltage. Predict what happens to the voltage across the load.', 'It stays almost the same, at the Zener voltage.', 'The extra current flows through the Zener diode, and the extra voltage is dropped across the series resistor.'),
  predict(B(3, 3), 'A photodiode in reverse bias is lit with brighter light of the same colour. Predict what happens to its current, and why it is used in reverse bias.', 'The reverse current rises, in proportion to the light’s intensity.', 'Each absorbed photon makes an electron–hole pair, swept across by the junction field.', 'In reverse bias the dark current is tiny, so the change caused by light stands out.'),
  predict(B(2, 3), 'A light-emitting diode of a material with a larger band gap is used. Predict how the colour of its light changes.', 'Its light has a shorter wavelength, towards the blue.', 'The photon energy equals the band gap, and λ = hc/E.'),
];

export default questions;
