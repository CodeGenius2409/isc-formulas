// Written by hand: current electricity, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('physics', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  match(A(3, 1), [['Resistivity', 'Ω m'], ['Conductivity', 'S m⁻¹'], ['Current density', 'A m⁻²']]),
  match(A(4, 2), [['Drift velocity', 'eEτ/m'], ['Current in a wire', 'neAv_d'], ['Resistivity', 'm/ne²τ'], ['Mobility', 'v_d/E']]),
  match(A(3, 2), [['Copper', 'Resistance rises with temperature'], ['Silicon', 'Resistance falls with temperature'], ['Manganin', 'Resistance barely changes with temperature']]),
  match(A(4, 3), [['Length doubled, same volume', 'Resistance four times'], ['Length doubled, same area', 'Resistance doubles'], ['Area doubled, same length', 'Resistance halves'], ['Radius doubled, same length', 'Resistance a quarter']]),
  match(A(3, 3), [['Power in a resistor at a given current', 'I²R'], ['Power in a resistor at a given voltage', 'V²/R'], ['Energy in a resistor over time t', 'VIt']]),
  match(B(3, 1), [['Kirchhoff’s junction rule', 'Conservation of charge'], ['Kirchhoff’s loop rule', 'Conservation of energy'], ['Wheatstone bridge at balance', 'No current in the galvanometer']]),
  match(B(4, 2), [['Terminal voltage while a cell gives current', 'E − Ir'], ['Terminal voltage while a cell is charged', 'E + Ir'], ['Current through a short circuit', 'E/r'], ['n equal cells in series', 'Emf nE, resistance nr']]),
  match(B(3, 2), [['Metre bridge', 'Finds an unknown resistance'], ['Potentiometer', 'Compares the emfs of two cells'], ['Galvanometer with a large series resistance', 'Works as a voltmeter']]),
  match(B(4, 3), [['Balance condition of a Wheatstone bridge', 'P/Q = R/S'], ['Metre bridge, balance at l cm', 'X/R = l/(100 − l)'], ['Potentiometer, emfs at lengths l₁ and l₂', 'E₁/E₂ = l₁/l₂'], ['Internal resistance by potentiometer', 'r = R(l₁ − l₂)/l₂']]),
  match(B(3, 3), [['Greatest power to an external load', 'When R = r'], ['Efficiency at greatest power', '50%'], ['Two equal cells in parallel', 'Emf E, resistance r/2']]),
];

export default questions;
