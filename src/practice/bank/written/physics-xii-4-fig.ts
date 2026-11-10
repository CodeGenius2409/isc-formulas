// Written by hand: alternating current, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { graph, plot } from '../figures';

const { figure } = kit('physics', 'XII');
const B = at(4, 'b');

const questions: BankDef[] = [
  figure(B(2, 2), 'Draw a graph of the current against the frequency of the supply in a series LCR circuit, for a small and a large resistance. Mark the resonant frequency.', ['Both peak at the same resonant frequency, 1/2π√(LC).', 'The smaller resistance gives a taller, sharper peak.'], {
    answer: graph('frequency f', 'current I', [{ label: 'small R', points: plot((f) => 1 / Math.sqrt(0.04 + (f - 1 / f) ** 2), 0.2, 4, 60) }, { label: 'large R', points: plot((f) => 1 / Math.sqrt(1 + (f - 1 / f) ** 2), 0.2, 3, 50) }], { x: [[1, 'f₀']] }),
  }),
];

export default questions;
