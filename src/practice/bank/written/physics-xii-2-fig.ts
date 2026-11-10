// Written by hand: current electricity, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { graph, label, line, plot, sketch, table } from '../figures';

const { figure } = kit('physics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  figure(A(2, 1), 'Draw the I–V graphs of a metal wire kept at a steady temperature and of a filament lamp, on the same axes.', ['The wire gives a straight line through the origin, as it obeys Ohm’s law.', 'The lamp’s graph curves towards the V axis, as its resistance rises as it heats up.'], {
    answer: graph('potential difference V', 'current I', [{ label: 'wire', points: [[0, 0], [4, 4]] }, { label: 'lamp', points: plot((v) => 2.6 * Math.sqrt(v / 4), 0, 4, 20) }]),
  }),
  figure(A(2, 2), 'The graph shows the current I through a conductor against the potential difference V across it. Find its resistance, and say whether it obeys Ohm’s law.', ['R = V/I = 6 V / 2 A = 3 Ω.', 'Yes: the graph is a straight line through the origin, so V/I is constant.'], {
    shown: graph('V (V)', 'I (A)', [{ points: [[0, 0], [6, 2]] }], { x: [[6, '6']], y: [[2, '2']] }),
  }),
  figure(A(2, 2), 'Draw graphs of resistivity against temperature for a metal such as copper and for a semiconductor such as silicon.', ['Copper: resistivity rises with temperature, nearly in a straight line.', 'Silicon: resistivity falls steeply as the temperature rises.'], {
    answer: graph('temperature T', 'resistivity ρ', [{ label: 'copper', points: [[0, 1], [10, 2]] }, { label: 'silicon', points: plot((t) => 6 * Math.exp(-t / 3), 0, 10, 24) }]),
  }),
  figure(A(2, 3), 'The table gives the resistance of a wire at two temperatures. Find its temperature coefficient of resistance.', ['α = (R₂ − R₁) / (R₁(T₂ − T₁)) = (12.4 − 10.0) / (10.0 × 60).', 'α = 4.0 × 10⁻³ K⁻¹.'], {
    shown: table(['Temperature (°C)', 'Resistance (Ω)'], [['20', '10.0'], ['80', '12.4']], 'A copper wire'),
  }),
  figure(A(3, 3), 'The graph shows I against V for two wires P and Q, of the same material and length. Which has the larger resistance, and which the larger cross-section? Give reasons.', ['P is steeper, so for the same V it carries more current: Q has the larger resistance.', 'R = ρl/A, with ρ and l the same, so a smaller resistance means a larger area.', 'So P has the larger cross-section.'], {
    shown: graph('V', 'I', [{ label: 'P', points: [[0, 0], [5, 4]] }, { label: 'Q', points: [[0, 0], [5, 2]] }]),
  }),
  figure(B(2, 1), 'Draw the circuit of a metre bridge used to find an unknown resistance X. Mark the balancing length l.', ['A known resistance R and X sit in the two gaps of the bridge, joined across a 1 m wire, with a cell across the wire’s ends.', 'A galvanometer joins the middle of the gaps to a jockey on the wire. At balance, l is from the end beside R, and X/R = (100 − l)/l.'], {
    answer: sketch(300, 180, 'A metre bridge. A straight wire runs along the bottom. Above it, two gaps hold resistance R on the left and the unknown X on the right. A galvanometer G joins the point between them to a jockey J on the wire. A cell is joined across the two ends of the wire. The length l is marked from the left end to J.', [
      line([[30, 120], [270, 120]]), line([[30, 120], [30, 40], [100, 40]]), { t: 'box', x: 100, y: 30, w: 30, h: 20 }, label(115, 24, 'R'),
      line([[130, 40], [170, 40]]), { t: 'box', x: 170, y: 30, w: 30, h: 20 }, label(185, 24, 'X'), line([[200, 40], [270, 40], [270, 120]]),
      line([[150, 40], [150, 70]]), { t: 'circle', x: 150, y: 82, r: 12 }, label(150, 87, 'G'), line([[150, 94], [150, 120]]), label(160, 116, 'J', 'start'),
      line([[30, 120], [30, 166], [140, 166]]), line([[140, 158], [140, 174]]), line([[150, 162], [150, 170]]), line([[150, 166], [270, 166], [270, 120]]),
      line([[30, 130], [150, 130]], { dash: 1 }), label(90, 146, 'l'),
    ]),
  }),
  figure(B(3, 2), 'The figure shows a potentiometer circuit. Name the parts A, B and C, and say what is done at balance.', ['A is the driver cell, which keeps a steady current in the wire.', 'B is the cell whose emf is measured, and C is the galvanometer.', 'At balance C reads zero, so B’s emf equals the fall of potential along the balancing length of the wire.'], {
    shown: sketch(300, 160, 'A long wire along the top, with a cell A and a key joined across its two ends below. From the left end of the wire, a second cell B and a galvanometer C lead to a jockey that touches the wire.', [
      line([[30, 40], [270, 40]]), line([[30, 40], [30, 130], [140, 130]]), line([[140, 122], [140, 138]]), line([[150, 126], [150, 134]]), line([[150, 130], [270, 130], [270, 40]]), label(145, 152, 'A'),
      line([[30, 40], [30, 85], [70, 85]]), line([[70, 77], [70, 93]]), line([[78, 81], [78, 89]]), label(74, 72, 'B'),
      line([[78, 85], [130, 85]]), { t: 'circle', x: 142, y: 85, r: 12 }, label(142, 90, 'C'), line([[154, 85], [190, 85], [190, 40]]),
    ]),
  }),
  figure(B(2, 3), 'The graph shows the terminal voltage V of a cell against the current I it gives. Find its emf and its internal resistance.', ['Where I = 0, V is the emf: E = 1.5 V.', 'The slope is −r: r = (1.5 − 0.9)/1.2 = 0.5 Ω.'], {
    shown: graph('current I (A)', 'terminal voltage V (V)', [{ points: [[0, 1.5], [1.2, 0.9]] }], { x: [[1.2, '1.2']], y: [[1.5, '1.5'], [0.9, '0.9']] }),
  }),
];

export default questions;
