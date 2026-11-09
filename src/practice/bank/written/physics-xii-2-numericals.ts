// Written by hand: numericals on current electricity, for Physics XII at 0% generated. Answers come from the solver. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { num } = bank('physics', 'XII');
const A = (marks: number, d: 1 | 2 | 3): Place => [2, 'a', marks, d];
const B = (marks: number, d: 1 | 2 | 3): Place => [2, 'b', marks, d];

const questions: BankDef[] = [
  // ---- 2a Conduction, Ohm's law and power
  num(A(1, 1), { text: 'A torch bulb of resistance 15 Ω carries 0.2 A. Find the voltage across it.', vars: {}, parts: [{ ask: 'Voltage', use: 'p-xii-2-1', find: 'V', given: { I: '0.2 A', R: '15 ohm' }, marks: 1 }] }),
  num(A(2, 1), { text: 'A copper wire 50 m long has a cross-section of 2 mm². The resistivity of copper is 1.7 × 10⁻⁸ Ω m. Find its resistance.', vars: {}, parts: [{ ask: 'Resistance', use: 'p-xii-2-2', find: 'R', given: { rho: '1.7e-8 ohm*m', l: '50 m', A: '2 mm^2' }, marks: 2 }] }),
  num(A(3, 2), { text: 'A wire has a resistance of 4 Ω, a length of 2 m and a cross-section of 0.5 mm². Find the resistivity of its material.', vars: {}, parts: [{ ask: 'Resistivity', use: 'p-xii-2-2', find: 'rho', given: { R: '4 ohm', l: '2 m', A: '0.5 mm^2' }, marks: 3 }] }),
  num(A(2, 2), { text: 'A platinum wire has a resistance of 10 Ω at 0 °C, and a temperature coefficient of 3.9 × 10⁻³ per °C. Find its resistance after a rise of 100 °C.', vars: {}, parts: [{ ask: 'Resistance when hot', use: 'p-xii-2-3', find: 'R', given: { R_0: '10 ohm', alpha: '3.9e-3', DeltaT: '100 K' }, marks: 2 }] }),
  num(A(3, 3), { text: 'A heating coil has a resistance of 20 Ω when cold. It reaches 26 Ω when hot. Its temperature coefficient is 5 × 10⁻³ per °C. Find its rise in temperature.', vars: {}, parts: [{ ask: 'Temperature rise', use: 'p-xii-2-3', find: 'DeltaT', given: { R: '26 ohm', R_0: '20 ohm', alpha: '5e-3' }, marks: 3 }] }),
  num(A(1, 1), { text: 'A 230 V kettle draws 8 A. Find its power.', vars: {}, parts: [{ ask: 'Power', use: 'p-xii-2-4', find: 'P', given: { V: '230 V', I: '8 A' }, marks: 1 }] }),
  num(A(2, 1), { text: 'A 60 W lamp runs on a 230 V supply. Find the current it draws.', vars: {}, parts: [{ ask: 'Current', use: 'p-xii-2-4', find: 'I', given: { P: '60 W', V: '230 V' }, marks: 2 }] }),
  num(A(2, 1), { text: 'A heater runs on 230 V at 5 A for 10 minutes. Find the energy it uses.', vars: {}, parts: [{ ask: 'Energy', use: 'p-xii-2-71', find: 'W', given: { V: '230 V', I: '5 A', t: '600 s' }, marks: 2 }] }),
  num(A(3, 3), { text: 'A copper wire of cross-section 1 mm² carries 2 A. Copper has 8.5 × 10²⁸ free electrons per cubic metre. Find their drift speed.', vars: {}, parts: [{ ask: 'Drift velocity', use: 'p-xii-2-11', find: 'v_d', given: { I: '2 A', n: '8.5e28', A: '1 mm^2' }, marks: 3 }] }),
  num(A(2, 1), { text: 'A wire of cross-section 2 mm² carries 3 A. Find the current density.', vars: {}, parts: [{ ask: 'Current density', use: 'p-xii-2-18', find: 'J', given: { I: '3 A', A: '2 mm^2' }, marks: 2 }] }),
  // ---- 2b Cells, Kirchhoff's laws and bridges
  num(B(2, 1), { text: 'A cell of emf 1.5 V and internal resistance 0.5 Ω is joined to a 2.5 Ω resistor. Find the current.', vars: {}, parts: [{ ask: 'Current', use: 'p-xii-2-57', find: 'I', given: { E_m: '1.5 V', R: '2.5 ohm', r: '0.5 ohm' }, marks: 2 }] }),
  num(B(2, 1), { text: 'A car battery of emf 12 V and internal resistance 0.05 Ω supplies 60 A to the starter motor. Find the voltage at its terminals.', vars: {}, parts: [{ ask: 'Terminal voltage', use: 'p-xii-2-22', find: 'V', given: { E_m: '12 V', I: '60 A', r: '0.05 ohm' }, marks: 2 }] }),
  num(B(3, 2), { text: 'A cell of emf 2 V gives a terminal voltage of 1.6 V while it supplies 0.8 A. Find its internal resistance.', vars: {}, parts: [{ ask: 'Internal resistance', use: 'p-xii-2-22', find: 'r', given: { V: '1.6 V', E_m: '2 V', I: '0.8 A' }, marks: 3 }] }),
  num(B(1, 1), { text: 'A cell of emf 1.5 V has an internal resistance of 0.3 Ω. Find the current if its terminals are shorted.', vars: {}, parts: [{ ask: 'Short-circuit current', use: 'p-xii-2-60', find: 'I_sc', given: { E_m: '1.5 V', r: '0.3 ohm' }, marks: 1 }] }),
  num(B(3, 3), { text: 'Six cells, each of emf 1.5 V and internal resistance 0.2 Ω, are arranged in 2 parallel rows of 3 in series, and joined to a 4 Ω resistor. Find the current in the resistor.', vars: {}, parts: [{ ask: 'Current', use: 'p-xii-2-65', find: 'I', given: { m: '2', n: '3', E_m: '1.5 V', R: '4 ohm', r: '0.2 ohm' }, marks: 3 }] }),
  num(B(2, 1), { text: 'A Wheatstone bridge balances with P = 10 Ω, Q = 20 Ω and R = 15 Ω. Find S.', vars: {}, parts: [{ ask: 'Arm S', use: 'p-xii-2-7', find: 'S_b', given: { P_b: '10 ohm', Q_b: '20 ohm', R_b: '15 ohm' }, marks: 2 }] }),
  num(B(3, 2), { text: 'A meter bridge balances at 40 cm, with a known 30 Ω resistor in the left gap. Find the resistance in the right gap.', vars: {}, parts: [{ ask: 'Arm S', use: 'p-xii-2-7', find: 'S_b', given: { P_b: '40 ohm', Q_b: '60 ohm', R_b: '30 ohm' }, marks: 3 }] }),
  num(B(2, 2), { text: 'On a potentiometer, a cell of emf 1.5 V balances at 60 cm. A second cell balances at 80 cm. Find its emf.', vars: {}, parts: [{ ask: 'Second emf', use: 'p-xii-2-14', find: 'E_2', given: { E_1: '1.5 V', l_1: '60 cm', l_2: '80 cm' }, marks: 2 }] }),
  num(B(2, 1), { text: 'Resistors of 6 Ω and 12 Ω are joined in parallel. Find the combined resistance.', vars: {}, parts: [{ ask: 'Equivalent resistance', use: 'p-xii-2-47', find: 'R', given: { R_1: '6 ohm', R_2: '12 ohm' }, marks: 2 }] }),
  num(B(5, 2), { text: 'A battery of emf 9 V and internal resistance 1 Ω drives a current through resistors of 6 Ω and 3 Ω in parallel.\n(i) Find the combined resistance. (ii) Find the current from the battery. (iii) Find the terminal voltage.', vars: {}, parts: [{ ask: 'Equivalent resistance', use: 'p-xii-2-47', find: 'R', given: { R_1: '6 ohm', R_2: '3 ohm' }, marks: 1 }, { ask: 'Current', use: 'p-xii-2-57', find: 'I', given: { E_m: '9 V', R: '2 ohm', r: '1 ohm' }, marks: 2 }, { ask: 'Terminal voltage', use: 'p-xii-2-22', find: 'V', given: { E_m: '9 V', I: '3 A', r: '1 ohm' }, marks: 2 }] }),
];

export default questions;
