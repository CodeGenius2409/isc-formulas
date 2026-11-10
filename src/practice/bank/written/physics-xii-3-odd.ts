// Written by hand: magnetism and alternating current, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('physics', 'XII');
const A = at(3, 'a');

const questions: BankDef[] = [
  odd(A(2, 1), ['tesla', 'weber per square metre', 'N A⁻¹ m⁻¹', 'weber'], 'weber', 'It is the unit of magnetic flux; the others are units of magnetic field.'),
  odd(A(2, 2), ['Biot–Savart law', 'Ampère’s circuital law', 'Fleming’s left-hand rule', 'Gauss’s law of electrostatics'], 'Gauss’s law of electrostatics', 'It is about electric fields; the others are about magnetic fields and forces.'),
  odd(A(2, 2), ['electron', 'proton', 'alpha particle', 'neutron'], 'neutron', 'It has no charge, so a magnetic field doesn’t turn it; the others are bent.'),
  odd(A(2, 3), ['radial field', 'phosphor bronze spring', 'soft iron core', 'shunt'], 'shunt', 'It is added to make an ammeter; the others are parts of the galvanometer itself.'),
  odd(A(2, 3), ['qvB sin θ', 'BIL sin θ', 'NIAB sin θ', 'μ₀I/2πr'], 'μ₀I/2πr', 'It is a magnetic field; the others are a force, a force and a torque.'),
];

export default questions;
