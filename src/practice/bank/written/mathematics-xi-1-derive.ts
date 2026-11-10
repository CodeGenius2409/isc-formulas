// Written by hand: trigonometry, proofs not already in the bank. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { derive } = kit('mathematics', 'XI');
const T = at(1, 'c');

const questions: BankDef[] = [
  derive(T(3, 2), 'Prove that $\\sin(A + B) = \\sin A\\cos B + \\cos A\\sin B$, using the formula for $\\cos(A - B)$.', ['$\\sin(A + B) = \\cos\\left(\\frac{\\pi}{2} - (A + B)\\right) = \\cos\\left(\\left(\\frac{\\pi}{2} - A\\right) - B\\right)$.', 1], ['$= \\cos\\left(\\frac{\\pi}{2} - A\\right)\\cos B + \\sin\\left(\\frac{\\pi}{2} - A\\right)\\sin B$.', 1], ['$= \\sin A\\cos B + \\cos A\\sin B$.', 1]),
];

export default questions;
