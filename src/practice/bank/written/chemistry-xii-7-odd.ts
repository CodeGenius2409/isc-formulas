// Written by hand: alcohols, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('chemistry', 'XII');
const A = at(7, 'a');

const questions: BankDef[] = [
  odd(A(2, 1), ['methanol', 'ethanol', 'propan-1-ol', 'propan-2-ol'], 'propan-2-ol', 'It is a secondary alcohol; the others are primary.'),
  odd(A(2, 2), ['acidified K₂Cr₂O₇', 'acidified KMnO₄', 'PCC', 'LiAlH₄'], 'LiAlH₄', 'It is a reducing agent; the others oxidise alcohols.'),
  odd(A(2, 2), ['ethene', 'ethanal', 'ethyl ethanoate', 'ethane'], 'ethane', 'It isn’t made directly from ethanol in one step by the usual reagents; the others are, by dehydration, oxidation and esterification.'),
  odd(A(2, 3), ['Lucas test', 'oxidation with K₂Cr₂O₇', 'Victor Meyer test', 'Fehling’s test'], 'Fehling’s test', 'It tests for aldehydes; the others tell primary, secondary and tertiary alcohols apart.'),
  odd(A(2, 3), ['glycerol', 'ethane-1,2-diol', 'ethanol', 'butane-1,4-diol'], 'ethanol', 'It has one –OH group; the others have more than one.'),
];

export default questions;
