// Written by hand: chemical kinetics, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { graph, plot } from '../figures';

const { figure } = kit('chemistry', 'XII');
const A = at(3, 'a');

const questions: BankDef[] = [
  figure(A(3, 2), 'The graph shows the concentration of a reactant against time. Find the average rate over the first 20 s, and say how the instantaneous rate at 20 s would be found.', ['Average rate = −Δ[R]/Δt = (0.80 − 0.40)/20 = 0.020 mol L⁻¹ s⁻¹.', 'Draw the tangent to the curve at 20 s.', 'The instantaneous rate is minus its slope.'], {
    shown: graph('time (s)', '[R] (mol L⁻¹)', [{ points: plot((t) => 0.8 * Math.exp((-Math.LN2 * t) / 20), 0, 60, 30) }], { x: [[20, '20'], [40, '40']], y: [[0.8, '0.80'], [0.4, '0.40']] }),
  }),
];

export default questions;
