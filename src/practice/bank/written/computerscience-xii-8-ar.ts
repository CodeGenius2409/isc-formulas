// Written by hand: binary trees, assertion and reason. Answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { ar } = kit('computerscience', 'XII');
const T = at(8, 'a');

const questions: BankDef[] = [
  ar(T(1, 1), 'The root is the first node in a pre-order traversal.', 'Pre-order visits a node before its subtrees.', 1, 'Starting at the root, the root itself comes first.'),
  ar(T(1, 2), 'An in-order traversal of a binary search tree gives the keys in sorted order.', 'Every node in a binary search tree has two children.', 3, 'The assertion holds, because smaller keys are on the left; but nodes may have fewer than two children.'),
  ar(T(1, 2), 'A leaf has degree 2.', 'A leaf has no children.', 4, 'With no children, a leaf has degree 0.'),
  ar(T(1, 3), 'A binary tree of height 2 can have at most 7 nodes.', 'Level k of a binary tree can hold at most 2ᵏ nodes.', 1, '1 + 2 + 4 = 7.'),
  ar(T(1, 3), 'The pre-order traversal alone fixes the shape of a binary tree.', 'Pre-order gives the root first.', 4, 'Different trees can share a pre-order; the in-order is needed as well.'),
];

export default questions;
