// Written by hand: methods, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('computerscience', 'XII');
const M = at(3, 'a');

const questions: BankDef[] = [
  predict(M(2, 1), 'A method void bump(int n) { n++; } is called as bump(x) with x = 5. Predict the value of x afterwards.', 'x is still 5.', 'An int is passed by value: the method changes only its own copy.'),
  predict(M(2, 2), 'A method void bump(int[] a) { a[0]++; } is called with an array whose first element is 5. Predict that element afterwards.', 'It becomes 6.', 'The method gets a copy of the reference, which points to the same array.'),
  predict(M(2, 2), 'A class has a static int count, and its constructor adds 1 to it. Three objects are made. Predict the value of count, as seen from each object.', '3.', 'There is one count shared by the whole class, so every object sees the same value.'),
  predict(M(3, 3), 'A method void reset(int[] a) { a = new int[3]; } is called with an array {7, 8, 9}. Predict what the caller’s array holds afterwards, and explain.', 'It still holds {7, 8, 9}.', 'The method’s parameter is made to refer to a new array.', 'The caller’s variable still refers to the old one, which was never changed.'),
  predict(M(2, 3), 'Inside an instance method, a local variable has the same name as an instance variable. Predict which one a plain use of the name refers to.', 'The local variable, which hides the instance variable.', 'this.name is needed to reach the instance variable.'),
];

export default questions;
