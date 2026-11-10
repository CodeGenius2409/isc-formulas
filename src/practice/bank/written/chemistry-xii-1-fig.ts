// Written by hand: solutions, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { graph } from '../figures';

const { figure } = kit('chemistry', 'XII');
const A = at(1, 'a');

const questions: BankDef[] = [
  figure(A(2, 2), 'Draw the vapour pressure–composition graph of an ideal mixture of two liquids A and B. Show the partial pressures and the total.', ['Each partial pressure is a straight line, from zero up to that liquid’s pure vapour pressure: p_B is the dashed line.', 'The total is a straight line joining p°A and p°B.'], {
    answer: graph('mole fraction of B', 'vapour pressure', [{ label: 'total', points: [[0, 40], [1, 100]] }, { points: [[0, 0], [1, 100]] }, { label: 'p_A', points: [[0, 40], [1, 0]] }]),
  }),
  figure(A(2, 3), 'Draw the total vapour pressure against composition for a mixture showing a positive deviation from Raoult’s law, with the ideal line dashed. Give one such mixture.', ['The total, the solid curve, lies above the straight ideal line, with a maximum for a large deviation.', 'Ethanol and water, as their mixed attractions are weaker than in the pure liquids.'], {
    answer: graph('mole fraction of B', 'total vapour pressure', [{ points: [[0, 40], [0.25, 82], [0.5, 100], [0.75, 106], [1, 100]] }, { label: 'ideal', points: [[0, 40], [1, 100]] }]),
  }),
];

export default questions;
