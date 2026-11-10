// Written by hand: alternating current, long answers in parts. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('physics', 'XII');
const B = at(4, 'b');

const questions: BankDef[] = [
  long(B(5, 1), 'Answer each part on a series LCR circuit.\n(a) Give its impedance, and draw its phasor diagram. [2]\n(b) Find the resonant frequency, and the current at resonance. [2]\n(c) Why is a series LCR circuit used to tune a radio? [1]', '(a) Z = √(R² + (X_L − X_C)²).', '(a) V_R along I, V_L ahead by 90° and V_C behind by 90°; their sum is the supply voltage.', '(b) At resonance X_L = X_C, so f₀ = 1/2π√(LC).', '(b) Z = R, so I = V/R, its greatest value.', '(c) It responds strongly only near one frequency, so one station is picked out.'),
  long(B(5, 2), 'Answer each part on power in a.c. circuits.\n(a) Show that the average power is V_rms I_rms cos φ. [3]\n(b) What is wattless current, and when does it flow? [2]', '(a) With v = V₀ sin ωt and i = I₀ sin(ωt − φ), p = vi.', '(a) Averaging over a cycle, the sin ωt cos ωt term goes to zero, leaving ½V₀I₀ cos φ.', '(a) That is V_rms I_rms cos φ.', '(b) Current whose average power is zero, as its phase is 90° from the voltage.', '(b) It flows in a pure inductor or capacitor, where cos φ = 0.'),
  long(B(5, 2), 'Answer each part on a circuit with 100 Ω, 0.5 H and 10 μF in series, on 220 V, 50 Hz.\n(a) Find X_L and X_C. [2]\n(b) Find the impedance and current. [2]\n(c) Does the current lead or lag the voltage? [1]', '(a) X_L = 2π × 50 × 0.5 ≈ 157 Ω.', '(a) X_C = 1/(2π × 50 × 10 × 10⁻⁶) ≈ 318 Ω.', '(b) Z = √(100² + 161²) ≈ 190 Ω.', '(b) I = 220/190 ≈ 1.16 A.', '(c) X_C > X_L, so the current leads the voltage.'),
  long(B(5, 3), 'Answer each part on rms values.\n(a) Show that the rms value of a sinusoidal current is I₀/√2. [3]\n(b) Why are a.c. meters marked in rms values? [1]\n(c) Find the peak voltage of 230 V mains. [1]', '(a) i² = I₀² sin² ωt, and sin² ωt = ½(1 − cos 2ωt).', '(a) Over a cycle the cosine averages to zero, so the mean of i² is I₀²/2.', '(a) Its square root is I₀/√2.', '(b) The rms value gives the same heating as a steady current of that size.', '(c) V₀ = 230√2 ≈ 325 V.'),
];

export default questions;
