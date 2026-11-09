// Written by hand: numericals on atoms and nuclei, for Physics XII at 0% generated. Answers come from the solver. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef, type Place } from '../define';

const { num } = bank('physics', 'XII');
const A = (marks: number, d: 1 | 2 | 3): Place => [8, 'a', marks, d];
const N = (marks: number, d: 1 | 2 | 3): Place => [8, 'b', marks, d];

const questions: BankDef[] = [
  // ---- 8a Atoms
  num(A(1, 1), { text: 'Hydrogen atoms are excited to the level n = 4. How many spectral lines can they give as they fall back?', vars: {}, parts: [{ ask: 'Number of spectral lines', use: 'p-xii-8-67', find: 'N', given: { n: '4' }, marks: 1 }] }),
  num(A(2, 2), { text: 'A gas of hydrogen atoms gives 10 spectral lines. From what level did the electrons start?', vars: {}, parts: [{ ask: 'Level', use: 'p-xii-8-67', find: 'n', given: { N: '10' }, marks: 2, positive: true }] }),
  // ---- 8b Nuclei
  num(N(1, 1), { text: 'A nuclide has a decay constant of 0.0693 per day. Find its half-life.', vars: {}, parts: [{ ask: 'Half-life', use: 'p-xii-8-5', find: 'T_half', given: { lambda: '0.0693 day^-1' }, unit: 'days', marks: 1 }] }),
  num(N(2, 1), { text: 'A hospital’s radioactive tracer has a half-life of 6 hours. Find its decay constant.', vars: {}, parts: [{ ask: 'Decay constant', use: 'p-xii-8-5', find: 'lambda', given: { T_half: '6 h' }, marks: 2 }] }),
  num(N(1, 1), { text: 'A nuclide has a decay constant of 0.02 per second. Find its mean life.', vars: {}, parts: [{ ask: 'Mean life', use: 'p-xii-8-6', find: 'tau', given: { lambda: '0.02 s^-1' }, marks: 1 }] }),
  num(N(2, 1), { text: 'A sample of 80 g of a nuclide has a half-life of 10 days. Find the mass left after 30 days.', vars: {}, parts: [{ ask: 'Mass remaining', use: 'p-xii-8-112', find: 'm', given: { m_0: '80 g', t: '30 days', T_half: '10 days' }, unit: 'g', marks: 2 }] }),
  num(N(3, 2), { text: 'A hospital receives 40 mg of a tracer of half-life 8 days. After how long will only 5 mg be left?', vars: {}, parts: [{ ask: 'Time', use: 'p-xii-8-112', find: 't', given: { m: '5 mg', m_0: '40 mg', T_half: '8 days' }, unit: 'days', marks: 3 }] }),
  num(N(3, 3), { text: 'A sample starts with 10¹⁰ nuclei, and its decay constant is 0.1 per hour. Find how many remain after 10 hours.', vars: {}, parts: [{ ask: 'Nuclei remaining', use: 'p-xii-8-4', find: 'N', given: { N_0: '1e10', lambda: '0.1 h^-1', t: '10 h' }, marks: 3 }] }),
  num(N(2, 1), { text: 'Find the radius of a nucleus of mass number 64. (R₀ = 1.2 fm.)', vars: {}, parts: [{ ask: 'Nuclear radius', use: 'p-xii-8-83', find: 'R', given: { R_0: '1.2 fm', A: '64' }, marks: 2 }] }),
  num(N(3, 2), { text: 'A nucleus has a radius of 3.6 fm. Find its mass number. (R₀ = 1.2 fm.)', vars: {}, parts: [{ ask: 'Mass number', use: 'p-xii-8-83', find: 'A', given: { R: '3.6 fm', R_0: '1.2 fm' }, marks: 3 }] }),
];

export default questions;
