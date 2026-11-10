// Written by hand: binary trees, predict and explain. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { predict } = kit('computerscience', 'XII');
const T = at(8, 'a');

const questions: BankDef[] = [
  predict(T(2, 1), 'Keys 10, 20, 30, 40 and 50 are inserted into an empty binary search tree in that order. Predict the shape of the tree and its height.', 'Each key goes to the right of the one before, so the tree is a single chain leaning right.', 'Its height is 4.'),
  predict(T(2, 2), 'Predict the in-order traversal of any binary search tree holding 15, 3, 8 and 21, whatever order they were inserted in.', '3 8 15 21.', 'In-order always visits a binary search tree’s keys in ascending order.'),
  predict(T(2, 2), 'A binary tree has 7 nodes. Predict its least and greatest possible height.', 'Least: 2, when it is full, with 1, 2 and 4 nodes on its three levels.', 'Greatest: 6, when it is a single chain.'),
  predict(T(3, 3), 'A leaf is removed from a binary tree. Predict what happens to the tree’s size, and whether its height can change.', 'The size falls by 1.', 'The height falls only if that leaf was the only one at the deepest level.', 'Otherwise the height stays the same.'),
  predict(T(2, 3), 'Predict the post-order traversal of a tree whose pre-order is X Y Z and whose in-order is Y X Z.', 'X is the root, with Y on its left and Z on its right.', 'Post-order: Y Z X.'),
];

export default questions;
