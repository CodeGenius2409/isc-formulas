// Written by hand: methods, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('computerscience', 'XII');
const M = at(3, 'a');

const questions: BankDef[] = [
  match(M(3, 1), [['static', 'Belongs to the class, not an object'], ['this', 'Refers to the current object'], ['void', 'The method returns nothing']]),
  match(M(4, 2), [['int passed to a method', 'The method gets a copy of the value'], ['int[] passed to a method', 'The method can change the caller’s elements'], ['A method that returns an array', 'Its return type ends in []'], ['A method with the same name and different parameters', 'An overloaded method']]),
  match(M(3, 2), [['Formal argument', 'Named in the method’s heading'], ['Actual argument', 'Given in the call'], ['Return value', 'Sent back by return']]),
  match(M(4, 3), [['A static method calls an instance method directly', 'A compile error'], ['An instance method uses a static variable', 'Allowed'], ['A method changes its int parameter', 'The caller’s variable is unchanged'], ['A method makes its array parameter refer to a new array', 'The caller still has the old array']]),
  match(M(3, 3), [['Pure method', 'Changes no state of its object'], ['Impure method', 'Changes the state of its object'], ['Accessor method', 'Returns a field’s value']]),
];

export default questions;
