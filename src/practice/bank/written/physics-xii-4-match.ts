// Written by hand: alternating current, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('physics', 'XII');
const B = at(4, 'b');

const questions: BankDef[] = [
  match(B(3, 1), [['Pure resistor', 'Current in phase with voltage'], ['Pure inductor', 'Current lags by π/2'], ['Pure capacitor', 'Current leads by π/2']]),
  match(B(4, 2), [['Inductive reactance', 'ωL'], ['Capacitive reactance', '1/ωC'], ['Impedance of a series LCR circuit', '√(R² + (X_L − X_C)²)'], ['Resonant frequency', '1/2π√(LC)']]),
  match(B(3, 2), [['Power factor of a pure resistor', '1'], ['Power factor of a pure inductor', '0'], ['Power factor of a series LCR circuit off resonance', 'Between 0 and 1']]),
  match(B(4, 3), [['Frequency raised, in an inductor', 'Reactance rises'], ['Frequency raised, in a capacitor', 'Reactance falls'], ['At resonance in series LCR', 'Impedance is least'], ['Lower resistance in series LCR', 'Sharper resonance']]),
  match(B(3, 3), [['Rms value of a sinusoidal current', 'I₀/√2'], ['Average power in an a.c. circuit', 'V_rms I_rms cos φ'], ['Wattless current', 'Its power factor is zero']]),
];

export default questions;
