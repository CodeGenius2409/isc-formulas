// Written by hand: binary trees, reasons and short answers. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { reason, short, tell } = kit('computerscience', 'XII');
const T = at(8, 'a');

const questions: BankDef[] = [
  reason(T(1, 1), 'Give a reason: a binary tree’s root has no parent.', 'It is the topmost node, from which every other node descends.'),
  reason(T(2, 2), 'Give a reason: in-order traversal of a binary search tree gives the keys in sorted order.', 'It visits the left subtree, then the node, then the right subtree.', 'In a binary search tree, everything on the left is smaller and everything on the right is larger.'),
  reason(T(2, 2), 'Give a reason: a binary tree of height h (counting the root at level 0) has at most 2^(h+1) − 1 nodes.', 'Level k holds at most 2ᵏ nodes, as each node has at most two children.', 'Adding 1 + 2 + 4 + … + 2ʰ gives 2^(h+1) − 1.'),
  reason(T(2, 3), 'Give a reason: pre-order and in-order traversals together fix a binary tree, but pre-order alone doesn’t.', 'Pre-order gives the root first, but not where its left subtree ends.', 'In-order puts the left subtree before the root, so it splits the rest into left and right.'),
  reason(T(1, 2), 'Give a reason: every node of a binary tree is the root of a subtree.', 'The node with all its descendants is itself a binary tree.'),
  tell(T(2, 1), 'Distinguish between an internal node and an external node of a binary tree.', 'An internal node has at least one child.', 'An external node, or leaf, has no children.'),
  short(T(2, 2), 'Define the depth and the height of a node in a binary tree.', 'Depth: the number of edges from the root down to the node.', 'Height: the number of edges on the longest path from the node down to a leaf.'),
  short(T(2, 2), 'What are siblings in a binary tree? What is the degree of a node?', 'Siblings are nodes with the same parent.', 'The degree is the number of children the node has, at most 2.'),
  short(T(3, 2), 'A binary tree has root A, with left child B and right child C. B has left child D and right child E. Write its pre-order, in-order and post-order traversals.', 'Pre-order: A B D E C.', 'In-order: D B E A C.', 'Post-order: D E B C A.'),
  short(T(3, 3), 'The pre-order of a binary tree is P Q S T R, and its in-order is S Q T P R. Find its root, its left subtree and its right subtree.', 'The root is P, the first in pre-order.', 'In in-order, S Q T lies left of P, so the left subtree has root Q with children S and T.', 'R lies right of P, so the right subtree is the single node R.'),
];

export default questions;
