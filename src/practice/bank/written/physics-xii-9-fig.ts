// Written by hand: the semiconductor diode, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { graph, label, line, plot, sketch } from '../figures';

const { figure } = kit('physics', 'XII');
const B = at(9, 'b');

const questions: BankDef[] = [
  figure(B(2, 1), 'Draw the I–V characteristic of a p–n junction diode in forward and reverse bias. Mark the knee voltage.', ['Forward: little current until the knee, about 0.7 V for silicon, then a steep rise.', 'Reverse: a tiny, nearly steady current, until breakdown at a large reverse voltage.'], {
    answer: graph('voltage V', 'current I', [{ points: [[-8, -6], [-7, -0.3], [-4, -0.2], [0, 0], [0.5, 0.2], [0.7, 1], [0.9, 6]] }], { x: [[0.7, '0.7 V'], [-7, 'breakdown']] }),
  }),
  figure(B(2, 2), 'Draw the input and the output waveforms of a full-wave rectifier on one time axis. How does its output differ from a half-wave rectifier’s?', ['The output, dashed, is the input with every negative half turned positive: a pulse for each half cycle.', 'A half-wave rectifier passes only the positive halves, with gaps where the negative halves were.'], {
    answer: graph('time', 'voltage', [{ label: 'input', points: plot((t) => Math.sin(t), 0, 3.5 * Math.PI, 60) }, { label: 'output', points: plot((t) => Math.abs(Math.sin(t)), 0, 4 * Math.PI, 60) }]),
  }),
  figure(B(3, 2), 'The figure shows a rectifier circuit. Name it, name parts D and C, and say what C does to the output.', ['A half-wave rectifier, with one diode.', 'D is a junction diode, and C is a capacitor across the load.', 'C charges at each peak and discharges slowly between them, so it smooths the output.'], {
    shown: sketch(320, 150, 'A transformer’s secondary on the left feeds a single diode D in series with a load resistor on the right. A capacitor C is joined across the load.', [
      { t: 'path', d: 'M40 30 C 55 40, 55 50, 40 60 C 55 70, 55 80, 40 90 C 55 100, 55 110, 40 120' }, label(30, 76, '~', 'end'),
      line([[40, 30], [120, 30]]), { t: 'path', d: 'M120 20 L140 30 L120 40 Z M140 20 L140 40' }, label(130, 14, 'D'),
      line([[140, 30], [260, 30], [260, 50]]), { t: 'box', x: 252, y: 50, w: 16, h: 50 }, label(276, 78, 'load', 'start'), line([[260, 100], [260, 120], [40, 120]]),
      line([[200, 30], [200, 68]]), line([[188, 68], [212, 68]]), line([[188, 78], [212, 78]]), line([[200, 78], [200, 120]]), label(180, 76, 'C', 'end'),
    ]),
  }),
  figure(B(2, 3), 'Draw the I–V characteristic of a Zener diode in reverse bias, and show how it is used to keep a voltage steady.', ['In reverse, the current stays tiny until the Zener voltage, then rises steeply with almost no rise in voltage.', 'Joined in reverse across the load, with a series resistor, it holds the load voltage at Vz as the input changes.'], {
    answer: graph('voltage V', 'current I', [{ points: [[-6, -8], [-5.1, -1], [-5, -0.1], [-2, -0.05], [0, 0], [0.5, 0.2], [0.7, 1], [0.9, 6]] }], { x: [[-5, '−Vz']] }),
  }),
  figure(B(2, 2), 'Draw the I–V characteristic of a solar cell, and mark its open-circuit voltage and short-circuit current.', ['The curve lies in the fourth quadrant: the cell gives current and voltage out.', 'It meets the V axis at the open-circuit voltage V_oc and the I axis at the short-circuit current I_sc.'], {
    answer: graph('voltage V', 'current I', [{ points: plot((v) => -5 + 0.05 * (Math.exp(v * 8) - 1), 0, 0.58, 30) }], { x: [[0.58, 'V_oc']], y: [[-5, 'I_sc']] }),
  }),
];

export default questions;
