// Written by hand: binary trees, odd one out. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { odd } = kit('computerscience', 'XII');
const T = at(8, 'a');

const questions: BankDef[] = [
  odd(T(2, 1), ['pre-order', 'in-order', 'post-order', 'binary search'], 'binary search', 'It is a way of searching a sorted array; the others are tree traversals.'),
  odd(T(2, 2), ['root', 'leaf', 'internal node', 'array'], 'array', 'It isn’t a part of a tree; the others are kinds of node.'),
  odd(T(2, 2), ['height', 'depth', 'level', 'value'], 'value', 'It is what a node stores; the others measure where a node is in the tree.'),
  odd(T(2, 3), ['a node with two children', 'a node with one child', 'a node with no children', 'the root of a one-node tree'], 'a node with two children', 'Its degree is 2; the others have degree 0 or 1.'),
  odd(T(2, 3), ['height', 'size', 'level', 'leaf'], 'leaf', 'It is a kind of node; the others are measures of a tree or of a node’s place in it.'),
];

export default questions;
