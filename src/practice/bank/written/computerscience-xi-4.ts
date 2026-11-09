// Written by hand: Classes and objects, introduction. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, theory } = bank('computerscience', 'XI');
const I = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [4, 'a', marks, d];

const questions: BankDef[] = [
  mcq(I(1, 1), 'A class is best described as:', ['one particular object', 'a blueprint from which objects are made', 'a kind of loop', 'a value stored in memory'], 1),
  theory('distinguish', I(2, 1), 'Distinguish between a class and an object, with one example.', ['A class describes the data and behaviour of a kind of thing: Student.', 'An object is a particular instance of it: a student named Asha.']),
  theory('reason', I(1, 2), 'Give a reason: data members of a class are usually kept private.', ['So they can be changed only through its methods, which keep the object’s data valid.']),
];

export default questions;
