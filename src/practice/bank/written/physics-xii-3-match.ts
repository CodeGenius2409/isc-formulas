// Written by hand: moving charges and magnetism, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('physics', 'XII');
const A = at(3, 'a');

const questions: BankDef[] = [
  match(A(3, 1), [['Magnetic field', 'tesla'], ['Magnetic moment', 'A m²'], ['Permeability of free space', 'T m A⁻¹']]),
  match(A(4, 2), [['Field at the centre of a circular loop', 'μ₀I/2R'], ['Field near a long straight wire', 'μ₀I/2πr'], ['Force per unit length between parallel wires', 'μ₀I₁I₂/2πd'], ['Force on a moving charge', 'q(v × B)']]),
  match(A(3, 2), [['Charge moving along the field', 'No force'], ['Charge moving at right angles to the field', 'Moves in a circle'], ['Charge moving at an angle to the field', 'Moves in a helix']]),
  match(A(4, 3), [['Radius of a charged particle’s circle', 'mv/qB'], ['Period of its circle', '2πm/qB'], ['Force on a current-carrying wire', 'IL × B'], ['Torque on a coil in a field', 'NIAB sin θ']]),
  match(A(3, 3), [['Galvanometer to ammeter', 'Small resistance in parallel'], ['Galvanometer to voltmeter', 'Large resistance in series'], ['Radial field in a galvanometer', 'Deflection proportional to current']]),
];

export default questions;
