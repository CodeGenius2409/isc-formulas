// Written by hand: methods, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('computerscience', 'XII');
const M = at(3, 'a');

const questions: BankDef[] = [
  odd(M(2, 1), ['int', 'double', 'char', 'String'], 'String', 'It is a class, so an object’s reference is passed; the others are primitive types, passed by value.'),
  odd(M(2, 2), ['void', 'int', 'boolean', 'static'], 'static', 'It is a modifier; the others are return types.'),
  odd(M(2, 2), ['public', 'private', 'protected', 'return'], 'return', 'It is a statement; the others are access specifiers.'),
  odd(M(2, 3), ['int[]', 'char[]', 'an object of a class', 'double'], 'double', 'A method can’t change the caller’s value through it; through the others it can reach the same object.'),
  odd(M(2, 3), ['a method’s name', 'the number of parameters', 'the types of parameters', 'its return type'], 'its return type', 'It isn’t part of the method’s signature; the others are.'),
];

export default questions;
