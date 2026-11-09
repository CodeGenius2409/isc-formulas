// Written by hand: numericals on electrostatics, for Physics XII at 0% generated. Answers come from the solver. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { num } = bank('physics', 'XII');
const A = (marks: number, d: 1 | 2 | 3): Place => [1, 'a', marks, d];
const B = (marks: number, d: 1 | 2 | 3): Place => [1, 'b', marks, d];

const questions: BankDef[] = [
  // ---- 1a Electric charges and fields
  num(A(2, 1), { text: 'Two small charged spheres carrying 3 × 10⁻⁶ C and 5 × 10⁻⁶ C sit 30 cm apart in air. Find the force between them.', vars: {}, parts: [{ ask: 'Force', use: 'p-xii-1-1', find: 'F', given: { q_1: '3e-6 C', q_2: '5e-6 C', r: '30 cm' }, marks: 2 }] }),
  num(A(2, 2), { text: 'Two equal charges of 2 × 10⁻⁶ C repel each other with a force of 0.9 N in air. How far apart are they?', vars: {}, parts: [{ ask: 'Separation', use: 'p-xii-1-1', find: 'r', given: { F: '0.9 N', q_1: '2e-6 C', q_2: '2e-6 C' }, unit: 'cm', marks: 2 }] }),
  num(A(2, 1), { text: 'Find the electric field 20 cm from a point charge of 8 × 10⁻⁹ C.', vars: {}, parts: [{ ask: 'Electric field', use: 'p-xii-1-2', find: 'E', given: { q: '8e-9 C', r: '20 cm' }, marks: 2 }] }),
  num(A(3, 2), { text: 'A Van de Graaff dome behaves like a point charge at its centre. At 50 cm from the centre, the field is 3.6 × 10⁵ N/C. Find the charge on the dome.', vars: {}, parts: [{ ask: 'Charge', use: 'p-xii-1-2', find: 'q', given: { E: '3.6e5 N/C', r: '50 cm' }, marks: 3 }] }),
  num(A(1, 1), { text: 'A plastic comb gains a charge of 3.2 × 10⁻⁹ C. How many extra electrons is that?', vars: {}, parts: [{ ask: 'Number of electrons', use: 'p-xii-1-11', find: 'n', given: { q: '3.2e-9 C' }, marks: 1 }] }),
  num(A(2, 1), { text: 'A dipole of moment 4 × 10⁻⁹ C m sits at 30° to a uniform field of 5 × 10⁴ N/C. Find the torque on it.', vars: {}, parts: [{ ask: 'Torque', use: 'p-xii-1-44', find: 'tau', given: { p: '4e-9 C*m', E: '5e4 N/C', theta: '30 deg' }, marks: 2 }] }),
  num(A(3, 2), { text: 'A dipole of moment 2 × 10⁻⁸ C m feels a largest torque of 6 × 10⁻⁴ N m in a uniform field. Find the field.', vars: {}, parts: [{ ask: 'Electric field', use: 'p-xii-1-44', find: 'E', given: { tau: '6e-4 N*m', p: '2e-8 C*m', theta: '90 deg' }, marks: 3 }] }),
  num(A(2, 2), { text: 'A very large flat sheet has a surface charge density of 1.77 × 10⁻⁶ C/m². Find the field near it.', vars: {}, parts: [{ ask: 'Electric field', use: 'p-xii-1-69', find: 'E', given: { sigma: '1.77e-6 C/m^2' }, marks: 2 }] }),
  num(A(1, 1), { text: 'Two parallel plates 2 cm apart are held at a potential difference of 100 V. Find the field between them.', vars: {}, parts: [{ ask: 'Electric field', use: 'p-xii-1-73', find: 'E', given: { V: '100 V', d: '2 cm' }, marks: 1 }] }),
  num(A(3, 3), { text: 'A cell membrane is about 8 nm thick, with a potential difference of 70 mV across it. Treat it as parallel plates, and find the field inside it.', vars: {}, parts: [{ ask: 'Electric field', use: 'p-xii-1-73', find: 'E', given: { V: '0.07 V', d: '8e-9 m' }, marks: 3 }] }),
  // ---- 1b Potential and capacitance
  num(B(1, 1), { text: 'Find the potential 10 cm from a point charge of 2 × 10⁻⁹ C.', vars: {}, parts: [{ ask: 'Potential', use: 'p-xii-1-6', find: 'V', given: { q: '2e-9 C', r: '10 cm' }, marks: 1 }] }),
  num(B(2, 2), { text: 'How far from a charge of 5 × 10⁻⁹ C is the potential 150 V?', vars: {}, parts: [{ ask: 'Distance', use: 'p-xii-1-6', find: 'r', given: { V: '150 V', q: '5e-9 C' }, unit: 'cm', marks: 2 }] }),
  num(B(2, 1), { text: 'It takes 6 × 10⁻⁵ J of work to bring a test charge of 2 × 10⁻⁶ C from far away to a point. Find the potential at that point.', vars: {}, parts: [{ ask: 'Potential', use: 'p-xii-1-86', find: 'V', given: { W: '6e-5 J', q_0: '2e-6 C' }, marks: 2 }] }),
  num(B(2, 1), { text: 'Find the potential energy of a charge of 4 × 10⁻⁶ C at a point where the potential is 500 V.', vars: {}, parts: [{ ask: 'Potential energy', use: 'p-xii-1-90', find: 'U', given: { q: '4e-6 C', V: '500 V' }, marks: 2 }] }),
  num(B(3, 2), { text: 'Find the potential energy of two charges, 3 × 10⁻⁶ C and 6 × 10⁻⁶ C, placed 9 cm apart in air.', vars: {}, parts: [{ ask: 'Potential energy', use: 'p-xii-1-95', find: 'U', given: { q_1: '3e-6 C', q_2: '6e-6 C', r: '9 cm' }, marks: 3 }] }),
  num(B(2, 1), { text: 'A parallel plate capacitor has plates of area 200 cm², 1 mm apart, in air. Find its capacitance.', vars: {}, parts: [{ ask: 'Capacitance', use: 'p-xii-1-8', find: 'C', given: { A: '200 cm^2', d: '1 mm' }, marks: 2 }] }),
  num(B(3, 2), { text: 'A capacitor has plates of area 100 cm², 0.5 mm apart, filled with a dielectric of constant 5. Find its capacitance.', vars: {}, parts: [{ ask: 'Capacitance', use: 'p-xii-1-25', find: 'C', given: { K: '5', A: '100 cm^2', d: '0.5 mm' }, marks: 3 }] }),
  num(B(2, 1), { text: 'A camera flash stores its energy in a 200 μF capacitor charged to 300 V. Find the energy stored.', vars: {}, parts: [{ ask: 'Stored energy', use: 'p-xii-1-18', find: 'U', given: { C: '200e-6 F', V: '300 V' }, marks: 2 }] }),
  num(B(3, 2), { text: 'A defibrillator must store 200 J in a 50 μF capacitor. To what voltage must it be charged?', vars: {}, parts: [{ ask: 'Voltage', use: 'p-xii-1-18', find: 'V', given: { U: '200 J', C: '50e-6 F' }, marks: 3, positive: true }] }),
  num(B(2, 1), { text: 'Capacitors of 6 μF and 3 μF are joined in series. Find the combined capacitance.', vars: {}, parts: [{ ask: 'Equivalent capacitance', use: 'p-xii-1-141', find: 'C', given: { C_1: '6e-6 F', C_2: '3e-6 F' }, marks: 2 }] }),
  num(B(3, 3), { text: 'A 4 μF capacitor at 100 V and a 2 μF capacitor at 40 V are joined, positive to positive. Find the energy lost as they share charge.', vars: {}, parts: [{ ask: 'Energy lost', use: 'p-xii-1-140', find: 'DeltaU', given: { C_1: '4e-6 F', C_2: '2e-6 F', V_1: '100 V', V_2: '40 V' }, marks: 3 }] }),
  num(B(5, 2), { text: 'A parallel plate capacitor has plates of area 500 cm², 2 mm apart, and is charged to 60 V.\n(i) Find its capacitance. (ii) Find the energy it stores. (iii) A dielectric of constant 4 then fills the gap. Find the new capacitance.', vars: {}, parts: [{ ask: 'Capacitance', use: 'p-xii-1-8', find: 'C', given: { A: '500 cm^2', d: '2 mm' }, marks: 2, save: 'Cx' }, { ask: 'Stored energy', use: 'p-xii-1-18', find: 'U', given: { C: 'Cx', V: '60 V' }, marks: 2 }, { ask: 'New capacitance', use: 'p-xii-1-25', find: 'C', given: { K: '4', A: '500 cm^2', d: '2 mm' }, marks: 1 }] }),
];

export default questions;
