// Written by hand: Cells, Kirchhoff’s laws and bridges. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, ar, theory } = bank('physics', 'XII');
const C = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [2, 'b', marks, d];

const questions: BankDef[] = [
  mcq(C(1, 1), 'The terminal voltage of a cell delivering a current is:', ['greater than its emf', 'equal to its emf', 'less than its emf', 'zero'], 2, 'V = E − Ir.'),
  mcq(C(1, 1), 'Kirchhoff’s loop rule comes from the conservation of:', ['charge', 'energy', 'momentum', 'mass'], 1),
  mcq(C(1, 2), 'While a cell is being charged, its terminal voltage is:', ['less than its emf', 'greater than its emf', 'equal to its emf', 'zero'], 1, 'V = E + Ir.'),
  mcq(C(1, 2), 'Three identical cells of emf E and internal resistance r are in parallel. Their combination has:', ['emf 3E, resistance 3r', 'emf E, resistance r/3', 'emf E, resistance 3r', 'emf 3E, resistance r/3'], 1),
  mcq(C(1, 2), 'A Wheatstone bridge is most sensitive when:', ['all four resistances are of the same order', 'one resistance is very large', 'the galvanometer is removed', 'the cell has a large resistance'], 0),
  mcq(C(1, 3), 'In a metre bridge, the end errors are removed by:', ['using a thick wire', 'interchanging the two resistances and averaging', 'using a larger cell', 'using a shorter wire'], 1),
  mcq(C(1, 3), 'In a balanced Wheatstone bridge, swapping the cell and the galvanometer:', ['spoils the balance', 'keeps the balance', 'reverses the current in the arms only', 'blows the galvanometer'], 1),
  mcq(C(1, 1), 'The greatest current a cell can deliver is:', ['E/r', 'Er', 'E + r', 'E − r'], 0, 'With a short circuit, R = 0.'),
  mcq(C(1, 2), 'For greatest power in the external resistance R, in terms of the internal resistance r:', ['R = r', 'R = 2r', 'R = r/2', 'R is as large as possible'], 0),
  ar(C(1, 2), 'A potentiometer can measure an emf more exactly than a voltmeter can.', 'At balance a potentiometer draws no current from the cell.', 1),
  ar(C(1, 2), 'Kirchhoff’s junction rule is a statement of the conservation of charge.', 'Charge can’t build up at a junction in a steady state.', 1),
  ar(C(1, 1), 'A metre bridge wire should have a low resistivity.', 'A wire with a high temperature coefficient gives the best readings.', 4, 'It needs a high resistivity and a low temperature coefficient.'),
  ar(C(1, 3), 'Cells in series add their emfs when connected the same way round.', 'Internal resistance plays no part in a series combination.', 3, 'Internal resistances add too.'),
  theory('reason', C(1, 1), 'Give a reason: a car battery has a very low internal resistance.', ['It must deliver a very large current to the starter motor.']),
  theory('reason', C(2, 2), 'Give a reason: a potentiometer’s wire is long and of uniform cross-section.', ['Uniformity keeps the fall of potential per unit length constant.', 'Greater length gives a smaller potential gradient, and so a more sensitive reading.']),
  theory('reason', C(2, 2), 'Give a reason: the balance point of a metre bridge is best kept near the middle of the wire.', ['Any error in reading the length is then the smallest share of each length.', 'End resistances also matter less, away from the ends.']),
  theory('reason', C(2, 3), 'Give a reason: an electric circuit’s voltage across a cell falls as more lamps are connected in parallel.', ['More lamps in parallel lower the external resistance, so the total current rises.', 'The lost volts, Ir, rise, so the terminal voltage E − Ir falls.']),
  theory('distinguish', C(2, 1), 'Distinguish between the emf of a cell and its terminal voltage.', ['Emf: the energy given per unit charge by the cell, the voltage when no current is drawn.', 'Terminal voltage: the voltage across its terminals in use, E − Ir.']),
  theory('distinguish', C(2, 2), 'Distinguish between a potentiometer and a voltmeter for measuring emf.', ['Potentiometer: draws no current at balance, so it reads the true emf.', 'Voltmeter: draws some current, so it reads the terminal voltage, below the emf.']),
  theory('distinguish', C(2, 2), 'Distinguish between cells in series and in parallel, as to when each one is useful.', ['Series: gives a higher emf, useful when the external resistance is large.', 'Parallel: gives a lower internal resistance, useful when the external resistance is small.']),
  theory('short', C(2, 1), 'State Kirchhoff’s two rules.', ['Junction: the currents entering a junction add up to those leaving.', 'Loop: round any closed loop, the sum of emfs equals the sum of IR drops.']),
  theory('short', C(2, 2), 'Write the balance condition of a Wheatstone bridge, and say what is zero at balance.', ['P/Q = R/S.', 'There is no current through the galvanometer.']),
  theory('short', C(2, 2), 'How is a potentiometer used to compare the emfs of two cells?', ['Find the balance length l₁ for one cell, and l₂ for the other.', 'E₁/E₂ = l₁/l₂.']),
  theory('short', C(3, 2), 'How is a potentiometer used to find a cell’s internal resistance?', ['Find the balance length l₁ with the cell on open circuit.', 'Connect a resistance R across the cell, and find the new balance length l₂.', 'r = R(l₁ − l₂)/l₂.']),
  theory('short', C(3, 3), 'A student connects a metre bridge, and sees no balance at any point on the wire. Give three likely reasons.', ['The jockey or galvanometer has a bad contact.', 'One of the resistances is far larger than the other, so the balance point is off the wire.', 'A connection in the circuit is loose or broken.']),
  theory('derivation', C(3, 2), 'Derive the balance condition of a Wheatstone bridge, using Kirchhoff’s rules.', ['With no galvanometer current, the same current I₁ passes through P and Q, and I₂ through R and S.', 'At balance, the two ends of the galvanometer are at one potential, so I₁P = I₂R and I₁Q = I₂S.', 'Dividing, P/Q = R/S.']),
  theory('derivation', C(3, 3), 'Show that a cell delivers the greatest power to an external resistance R when R = r.', ['P = E²R/(R + r)².', 'Setting dP/dR = 0 gives (R + r) − 2R = 0.', 'So R = r, and the greatest power is E²/(4r).']),
  theory('derivation', C(5, 3), 'Obtain the equivalent emf and equivalent internal resistance of two cells in parallel, with emfs E₁, E₂ and internal resistances r₁, r₂.', [['Let the cells give currents I₁ and I₂, with total I = I₁ + I₂, and a common voltage V.', 1], ['V = E₁ − I₁r₁ = E₂ − I₂r₂.', 1], ['So I = (E₁ − V)/r₁ + (E₂ − V)/r₂.', 1], ['Rearranged, V = (E₁r₂ + E₂r₁)/(r₁ + r₂) − I r₁r₂/(r₁ + r₂).', 1], ['Comparing with V = E − Ir: E = (E₁r₂ + E₂r₁)/(r₁ + r₂), and r = r₁r₂/(r₁ + r₂).', 1]]),
  theory('short', C(2, 1), 'Draw the circuit of a metre bridge, and label the known and unknown resistances.', ['A 1 m wire on a scale, with a cell across it, and R and S in the gaps of a metal strip.', 'A galvanometer from between R and S to a jockey on the wire.'], { format: 'diagram' }),
  theory('short', C(3, 2), 'Draw a graph of terminal voltage against current for a cell. Show how to read its emf and its internal resistance from it.', ['A straight line falling from the V-axis.', 'The intercept on the V-axis is the emf.', 'The size of the slope is the internal resistance.'], { format: 'diagram' }),
  theory('short', C(4, 2), 'A torch’s two 1.5 V cells have become old, each with an internal resistance of 1 Ω. They run a 4 Ω lamp in series.\n(i) Find the current. [2]\n(ii) Find the voltage across the lamp. [1]\n(iii) Why is the lamp dim, though a voltmeter on the cells alone reads 3 V? [1]', [['(i) I = 3/(4 + 2) = 0.5 A.', 2], ['(ii) 0.5 × 4 = 2 V.', 1], ['(iii) A voltmeter draws almost no current, so there are few lost volts. In use, there’s 1 V lost inside the cells.', 1]], { format: 'cbq', style: 'cbq-style' }),
];

export default questions;
