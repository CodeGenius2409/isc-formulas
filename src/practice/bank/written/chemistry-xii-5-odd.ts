// Written by hand: coordination compounds, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('chemistry', 'XII');
const A = at(5, 'a');

const questions: BankDef[] = [
  odd(A(2, 1), ['NH₃', 'H₂O', 'Cl⁻', 'ethylenediamine'], 'ethylenediamine', 'It is bidentate; the others are monodentate.'),
  odd(A(2, 2), ['NO₂⁻', 'SCN⁻', 'CN⁻', 'NH₃'], 'NH₃', 'It can bind through only one atom; the others are ambidentate.'),
  odd(A(2, 2), ['[Ni(CO)₄]', '[Ni(CN)₄]²⁻', '[Zn(NH₃)₄]²⁺', '[NiCl₄]²⁻'], '[NiCl₄]²⁻', 'It is paramagnetic; the others are diamagnetic.'),
  odd(A(2, 3), ['linkage isomerism', 'ionisation isomerism', 'coordination isomerism', 'geometrical isomerism'], 'geometrical isomerism', 'It is stereoisomerism; the others are structural isomerism.'),
  odd(A(2, 3), ['CN⁻', 'CO', 'en', 'I⁻'], 'I⁻', 'It is a weak-field ligand; the others are strong-field ligands.'),
];

export default questions;
