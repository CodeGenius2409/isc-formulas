// Written by hand: numericals on induction and alternating current, for Physics XII at 0% generated. Answers come from the solver.
// Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { num } = bank('physics', 'XII');
const I = (marks: number, d: 1 | 2 | 3): Place => [4, 'a', marks, d];
const C = (marks: number, d: 1 | 2 | 3): Place => [4, 'b', marks, d];

const questions: BankDef[] = [
  // ---- 4a Electromagnetic induction
  num(I(2, 1), { text: 'A 50 cm metal rod moves at 4 m/s at right angles to a field of 0.3 T. Find the emf across it.', vars: {}, parts: [{ ask: 'Motional emf', use: 'p-xii-4-2', find: 'E_m', given: { B: '0.3 T', l: '50 cm', v: '4 m/s' }, marks: 2 }] }),
  num(I(3, 2), { text: 'The wingspan of an aircraft is 40 m, and the vertical part of the Earth’s field is 4 × 10⁻⁵ T. An emf of 0.4 V appears across the wings. Find the speed of the aircraft.', vars: {}, parts: [{ ask: 'Speed', use: 'p-xii-4-2', find: 'v', given: { E_m: '0.4 V', B: '4e-5 T', l: '40 m' }, marks: 3 }] }),
  num(I(2, 1), { text: 'A 2 H coil carries 3 A. Find the energy stored in its magnetic field.', vars: {}, parts: [{ ask: 'Stored energy', use: 'p-xii-4-4', find: 'U', given: { L: '2 H', I: '3 A' }, marks: 2 }] }),
  num(I(3, 2), { text: 'What current in a 0.5 H inductor stores 4 J of energy?', vars: {}, parts: [{ ask: 'Current', use: 'p-xii-4-4', find: 'I', given: { U: '4 J', L: '0.5 H' }, marks: 3, positive: true }] }),
  num(I(2, 2), { text: 'A coil of 100 turns and area 200 cm² turns at 50 rad/s in a field of 0.2 T. Find its peak emf.', vars: {}, parts: [{ ask: 'Peak emf', use: 'p-xii-4-102', find: 'e_0', given: { N: '100', B: '0.2 T', A: '200 cm^2', omega: '50 rad/s' }, marks: 2 }] }),
  num(I(3, 3), { text: 'A generator coil of 200 turns and area 0.05 m² turns in a field of 0.1 T. It must give a peak emf of 100 V. Find the angular speed it needs.', vars: {}, parts: [{ ask: 'Angular frequency', use: 'p-xii-4-102', find: 'omega', given: { e_0: '100 V', N: '200', B: '0.1 T', A: '0.05 m^2' }, marks: 3 }] }),
  // ---- 4b Alternating current
  num(C(1, 1), { text: 'A mains supply has a peak voltage of 325 V. Find its rms voltage.', vars: {}, parts: [{ ask: 'Rms voltage', use: 'p-xii-4-6', find: 'V_rms', given: { V_0: '325 V' }, marks: 1 }] }),
  num(C(1, 1), { text: 'An alternating current has an rms value of 5 A. Find its peak value.', vars: {}, parts: [{ ask: 'Peak current', use: 'p-xii-4-13', find: 'I_0', given: { I_rms: '5 A' }, marks: 1 }] }),
  num(C(2, 1), { text: 'A series circuit has R = 30 Ω, a reactance of X_L = 80 Ω and a reactance of X_C = 40 Ω. Find its impedance.', vars: {}, parts: [{ ask: 'Impedance', use: 'p-xii-4-7', find: 'Z', given: { R: '30 ohm', X_L: '80 ohm', X_C: '40 ohm' }, marks: 2 }] }),
  num(C(3, 2), { text: 'A series LCR circuit has an impedance of 13 Ω and R = 5 Ω, and X_C = 4 Ω. If X_L is the larger reactance, find it.', vars: {}, parts: [{ ask: 'Inductive reactance', use: 'p-xii-4-7', find: 'X_L', given: { Z: '13 ohm', R: '5 ohm', X_C: '4 ohm' }, marks: 3, positive: true }] }),
  num(C(2, 1), { text: 'A tuning circuit has L = 10 mH and C = 100 μF. Find its resonant angular frequency.', vars: {}, parts: [{ ask: 'Resonant angular frequency', use: 'p-xii-4-8', find: 'omega_0', given: { L: '10 mH', C: '100e-6 F' }, marks: 2 }] }),
  num(C(2, 1), { text: 'A radio’s tuning circuit has L = 2 mH and C = 500 pF. Find its resonant frequency.', vars: {}, parts: [{ ask: 'Resonant frequency', use: 'p-xii-4-20', find: 'f_0', given: { L: '2 mH', C: '500e-12 F' }, marks: 2 }] }),
  num(C(3, 3), { text: 'A radio must tune to 1 MHz, using a 100 μH coil. Find the capacitance needed.', vars: {}, parts: [{ ask: 'Capacitance', use: 'p-xii-4-20', find: 'C', given: { f_0: '1e6 Hz', L: '100e-6 H' }, marks: 3 }] }),
  num(C(2, 2), { text: 'An AC circuit runs at 230 V and 5 A, with a phase angle of 60° between them. Find its average power.', vars: {}, parts: [{ ask: 'Average power', use: 'p-xii-4-9', find: 'P', given: { V_rms: '230 V', I_rms: '5 A', phi: '60 deg' }, marks: 2 }] }),
  num(C(2, 1), { text: 'A series circuit has R = 40 Ω and an impedance of 50 Ω. Find its phase angle.', vars: {}, parts: [{ ask: 'Phase angle', use: 'p-xii-4-18', find: 'phi', given: { R: '40 ohm', Z: '50 ohm' }, unit: 'deg', marks: 2 }] }),
  num(C(2, 1), { text: 'A transformer has 200 primary turns and 1000 secondary turns, on a 230 V supply. Find the secondary voltage.', vars: {}, parts: [{ ask: 'Secondary voltage', use: 'p-xii-4-12', find: 'V_s', given: { V_p: '230 V', N_s: '1000', N_p: '200' }, marks: 2 }] }),
  num(C(3, 2), { text: 'A phone charger’s ideal transformer steps 230 V down to 5 V, and the secondary supplies 2 A. Find the current in the primary.', vars: {}, parts: [{ ask: 'Primary current', use: 'p-xii-4-105', find: 'I_p', given: { V_p: '230 V', V_s: '5 V', I_s: '2 A' }, marks: 3 }] }),
  num(C(3, 2), { text: 'A series LCR circuit resonates at 1000 rad/s, with L = 50 mH and R = 10 Ω. Find its quality factor.', vars: {}, parts: [{ ask: 'Quality factor', use: 'p-xii-4-10', find: 'Q_f', given: { omega_0: '1000 rad/s', L: '50 mH', R: '10 ohm' }, marks: 3 }] }),
  num(C(5, 2), { text: 'A series circuit has R = 60 Ω, X_L = 100 Ω and X_C = 20 Ω, on a supply of 200 V rms.\n(i) Find the impedance. (ii) Find the phase angle. (iii) The rms current is 2 A. Find the average power, using that angle.', vars: {}, parts: [{ ask: 'Impedance', use: 'p-xii-4-7', find: 'Z', given: { R: '60 ohm', X_L: '100 ohm', X_C: '20 ohm' }, marks: 2 }, { ask: 'Phase angle', use: 'p-xii-4-18', find: 'phi', given: { R: '60 ohm', Z: '100 ohm' }, unit: 'deg', marks: 1 }, { ask: 'Average power', use: 'p-xii-4-9', find: 'P', given: { V_rms: '200 V', I_rms: '2 A', phi: '53.13 deg' }, marks: 2 }] }),
];

export default questions;
