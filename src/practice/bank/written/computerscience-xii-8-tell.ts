// Written by hand: binary trees, distinguish between. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { tell } = kit('computerscience', 'XII');
const T = at(8, 'a');

const questions: BankDef[] = [
  tell(T(2, 1), 'Distinguish between the level of a node and its degree.', 'The level tells how far down the node is, counting the root as level 0.', 'The degree is the number of children it has: 0, 1 or 2 in a binary tree.'),
  tell(T(2, 2), 'Distinguish between pre-order and post-order traversal.', 'Pre-order visits the node first, then its left and right subtrees.', 'Post-order visits the left and right subtrees first, then the node.'),
  tell(T(2, 2), 'Distinguish between the size and the height of a binary tree.', 'The size is the number of nodes in it.', 'The height is the number of edges on the longest path from the root to a leaf.'),
  tell(T(2, 3), 'Distinguish between a binary tree and a binary search tree.', 'A binary tree only needs each node to have at most two children.', 'A binary search tree also keeps smaller keys in the left subtree and larger ones in the right.'),
];

export default questions;
