// Written by hand: electrostatics, derivations not already in the bank. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { derive } = kit('physics', 'XII');
const B = at(1, 'b');

const questions: BankDef[] = [
  derive(B(3, 3), 'Obtain the electric potential at a point on the axis of a short electric dipole, at distance r from its centre.', ['The point is r − a from the charge +q and r + a from −q.', 1], ['V = kq/(r − a) − kq/(r + a) = kq·2a/(r² − a²).', 1], ['For a short dipole, r ≫ a, so V = kp/r², with p = 2qa.', 1]),
];

export default questions;
