// Written by hand: methods, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('computerscience', 'XII');
const M = at(3, 'a');

const questions: BankDef[] = [
  ar(M(1, 2), 'A static method can be called without making an object of its class.', 'A static method belongs to the class, not to any object.', 1, 'So it is called through the class name, as Math.sqrt() is.'),
];

export default questions;
