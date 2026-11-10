// Written by hand: methods, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('computerscience', 'XII');
const M = at(3, 'a');

const questions: BankDef[] = [
  reason(M(2, 2), 'Give a reason: a method that changes an element of an array passed to it changes the caller’s array.', 'The method receives a copy of the reference, not a copy of the array.', 'Both references point to the same array object, so the change is seen by both.'),
  reason(M(2, 3), 'Give a reason: a static method can’t use this.', 'A static method belongs to the class, and is called without any object.', 'this refers to the current object, and there is none.'),
  reason(M(1, 2), 'Give a reason: this is needed in a constructor whose parameter has the same name as an instance variable.', 'The parameter hides the instance variable, so this.name is needed to reach the instance variable.'),
  tell(M(2, 1), 'Distinguish between formal and actual arguments.', 'Formal arguments are the parameters in the method’s heading, which receive values.', 'Actual arguments are the values or variables passed when the method is called.'),
  short(M(2, 2), 'What is a static variable? How many copies of it are there?', 'A variable declared static belongs to the class, not to any one object.', 'There is only one copy, shared by every object of the class.'),
  short(M(3, 2), 'A method public static int[] twice(int[] a) returns a new array with every element doubled. Write its body.', 'int[] b = new int[a.length];', 'for (int i = 0; i < a.length; i++) b[i] = 2 * a[i];', 'return b;'),
  short(M(3, 3), 'State how primitive and object arguments behave when passed to a method, with an example of each.', 'A primitive is passed by value, so the method gets a copy: changing it in the method leaves the caller’s int unchanged.', 'An object is passed by its reference, so the method can change the object’s fields, as with an array’s elements.', 'Making the parameter refer to a new object doesn’t change which object the caller’s variable refers to.'),
];

export default questions;
