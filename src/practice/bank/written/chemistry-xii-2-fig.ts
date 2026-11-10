// Written by hand: electrochemistry, figures to draw, label and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';
import { arrow, graph, label, line, plot, sketch, table } from '../figures';

const { figure } = kit('chemistry', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const daniell = (marks: boolean) =>
  sketch(320, 170, marks ? 'A Daniell cell. On the left, a zinc rod P stands in zinc sulphate; on the right, a copper rod Q stands in copper sulphate. A U-tube R joins the two beakers, and a voltmeter joins the rods.' : 'A Daniell cell: zinc in zinc sulphate on the left, copper in copper sulphate on the right, a salt bridge joining the beakers, and a voltmeter across the rods, with electrons flowing from zinc to copper in the wire.', [
    { t: 'box', x: 30, y: 80, w: 90, h: 70 }, { t: 'box', x: 200, y: 80, w: 90, h: 70 },
    line([[75, 40], [75, 135]]), line([[245, 40], [245, 135]]),
    { t: 'path', d: 'M95 100 L95 60 L225 60 L225 100' }, { t: 'path', d: 'M105 100 L105 70 L215 70 L215 100' },
    line([[75, 40], [75, 20], [140, 20]]), { t: 'circle', x: 160, y: 20, r: 12 }, label(160, 25, 'V'), line([[172, 20], [245, 20], [245, 40]]),
    ...(marks ? [label(62, 120, 'P', 'end'), label(258, 120, 'Q', 'start'), label(160, 54, 'R')] : [label(62, 120, 'Zn', 'end'), label(258, 120, 'Cu', 'start'), label(160, 54, 'salt bridge'), label(75, 166, 'ZnSO₄'), label(245, 166, 'CuSO₄'), arrow([110, 10], [150, 10]), label(100, 12, 'e⁻', 'end')]),
  ]);

const questions: BankDef[] = [
  figure(A(3, 1), 'Draw a labelled diagram of a Daniell cell. Mark the anode, the cathode and the direction of electron flow in the outer wire.', ['Zinc in zinc sulphate is the anode, and copper in copper sulphate the cathode.', 'A salt bridge joins the two solutions.', 'Electrons flow from zinc to copper through the outer wire.'], { answer: daniell(false) }),
  figure(A(3, 2), 'The figure shows a galvanic cell. Name P, Q and R, and write the reaction at P.', ['P is the zinc anode, and Q the copper cathode.', 'R is a salt bridge, which completes the circuit and keeps both solutions neutral.', 'At P: Zn → Zn²⁺ + 2e⁻.'], { shown: daniell(true) }),
  figure(A(2, 2), 'Draw a labelled diagram of the standard hydrogen electrode.', ['A platinum electrode coated with platinum black, dipping in a solution of H⁺ ions at 1 mol L⁻¹.', 'Pure hydrogen gas at 1 bar bubbles over the platinum, at 298 K.'], {
    answer: sketch(300, 170, 'A standard hydrogen electrode. A glass tube dips into a beaker of acid of H⁺ concentration 1 mol per litre. Hydrogen gas at 1 bar enters at the top and bubbles out at the bottom over a platinum foil coated with platinum black.', [
      { t: 'box', x: 60, y: 80, w: 180, h: 80 }, label(250, 150, '1 M H⁺', 'start'),
      line([[130, 20], [130, 130]]), line([[170, 20], [170, 130]]), arrow([200, 40], [172, 40]), label(205, 44, 'H₂ at 1 bar', 'start'),
      line([[150, 10], [150, 120]]), { t: 'box', x: 140, y: 120, w: 20, h: 20 }, label(110, 136, 'Pt', 'end'),
    ]),
  }),
  figure(A(2, 3), 'The graph shows the emf of a cell Zn | Zn²⁺ || Cu²⁺ | Cu against log([Zn²⁺]/[Cu²⁺]) at 298 K. Find E° and the slope.', ['Where the log is zero, E = E° = 1.10 V.', 'The slope is −0.059/n = −0.0295 V, as n = 2.'], {
    shown: graph('log([Zn²⁺]/[Cu²⁺])', 'E (V)', [{ points: [[-2, 1.159], [0, 1.1], [2, 1.041]] }], { x: [[-2, '−2'], [2, '2']], y: [[1.159, '1.16'], [1.1, '1.10'], [1.041, '1.04']], xFrom: -2, yFrom: 1.0 }),
  }),
  figure(A(2, 2), 'The table gives standard reduction potentials. Which metal is the strongest reducing agent, and what is E° for a cell made of zinc and silver?', ['Magnesium, which has the most negative E°.', 'E° = E°(cathode) − E°(anode) = 0.80 − (−0.76) = 1.56 V.'], {
    shown: table(['Half-cell', 'E° (V)'], [['Mg²⁺ | Mg', '−2.37'], ['Zn²⁺ | Zn', '−0.76'], ['Cu²⁺ | Cu', '+0.34'], ['Ag⁺ | Ag', '+0.80']]),
  }),
  figure(B(2, 1), 'On the same axes, draw graphs of molar conductivity against √c for a strong electrolyte and for a weak one.', ['A strong electrolyte gives a straight line, falling slightly as √c rises.', 'A weak one rises steeply as the solution is diluted, so its line can’t be extended to c = 0.'], {
    answer: graph('√c', 'molar conductivity Λm', [{ label: 'KCl', points: [[0, 150], [1, 135]] }, { label: 'CH₃COOH', points: plot((s) => 390 / (1 + 40 * s), 0.05, 1, 24) }]),
  }),
  figure(B(2, 2), 'The graph shows the molar conductivity of KCl against √c. Find its limiting molar conductivity, and the slope.', ['Extend the line to √c = 0: Λ°m = 150 S cm² mol⁻¹.', 'Slope = (135 − 150)/1 = −15 S cm² mol⁻¹ per (mol L⁻¹)^½.'], {
    shown: graph('√c ((mol L⁻¹)^½)', 'Λm (S cm² mol⁻¹)', [{ points: [[0.2, 147], [1, 135]] }], { x: [[1, '1']], y: [[150, '150'], [135, '135']], yFrom: 120 }),
  }),
  figure(B(3, 2), 'Draw a labelled diagram of the electrolysis of aqueous copper sulphate with copper electrodes. Write the reactions at each electrode.', ['Two copper plates dip in copper sulphate, joined to a battery.', 'At the cathode: Cu²⁺ + 2e⁻ → Cu, so copper is deposited.', 'At the anode: Cu → Cu²⁺ + 2e⁻, so the anode dissolves and the solution stays the same.'], {
    answer: sketch(300, 170, 'A beaker of copper sulphate solution with two copper plates. The left plate is joined to the positive terminal of a battery, the anode; the right one to the negative terminal, the cathode.', [
      { t: 'box', x: 50, y: 70, w: 200, h: 90 }, label(150, 150, 'CuSO₄(aq)'),
      { t: 'box', x: 90, y: 50, w: 10, h: 80 }, { t: 'box', x: 200, y: 50, w: 10, h: 80 },
      line([[95, 50], [95, 20], [140, 20]]), line([[140, 10], [140, 30]]), line([[150, 15], [150, 25]]), line([[150, 20], [205, 20], [205, 50]]),
      label(88, 62, 'anode +', 'end'), label(212, 62, 'cathode −', 'start'),
    ]),
  }),
  figure(B(2, 3), 'The table gives the limiting molar conductivities of some ions. Use Kohlrausch’s law to find Λ°m for ethanoic acid.', ['Λ°m(CH₃COOH) = λ°(H⁺) + λ°(CH₃COO⁻).', '= 349.8 + 40.9 = 390.7 S cm² mol⁻¹.'], {
    shown: table(['Ion', 'λ° (S cm² mol⁻¹)'], [['H⁺', '349.8'], ['Na⁺', '50.1'], ['CH₃COO⁻', '40.9'], ['Cl⁻', '76.3']]),
  }),
  figure(B(2, 2), 'Draw a graph of the conductivity κ of a solution against its concentration, for a strong electrolyte. Why does it differ from the graph of molar conductivity?', ['κ rises with concentration, as there are more ions in each unit volume.', 'Molar conductivity falls instead, as it is κ shared over more moles, and the ions hinder each other.'], {
    answer: graph('concentration c', 'conductivity κ', [{ points: plot((c) => 10 * c - 1.5 * c * c, 0, 2.5, 20) }]),
  }),
];

export default questions;
