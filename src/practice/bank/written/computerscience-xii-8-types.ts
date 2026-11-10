// Written by hand: binary trees, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('computerscience', 'XII');
const A = at(8, 'a');

const questions: BankDef[] = [
  long(A(5, 1), 'Answer each part on binary trees.\n(i) Define the root, a leaf, and the height of a binary tree. [3]\n(ii) What is the largest number of nodes a binary tree of height 3 can have, counting the root’s level as 0? [2]', ['(i) The root is the top node, with no parent.', '(i) A leaf is a node with no children.', '(i) The height is the number of edges on the longest path from the root to a leaf.', ['(ii) 1 + 2 + 4 + 8 = 15, which is 2⁴ − 1.', 2]]),
  long(A(5, 2), 'Insert 50, 30, 70, 20, 40, 60 in that order into an empty binary search tree.\n(i) Draw the tree. [2]\n(ii) Write its inorder and its preorder traversal. [2]\n(iii) What does inorder always give for a binary search tree? [1]', [['(i) 50 is the root. 30 and 70 are its children. 20 and 40 are under 30, and 60 is the left child of 70.', 2], '(ii) Inorder: 20, 30, 40, 50, 60, 70.', '(ii) Preorder: 50, 30, 20, 40, 70, 60.', '(iii) The values in ascending order.']),
  long(A(5, 3), 'A binary tree has the inorder traversal D, B, E, A, C and the preorder traversal A, B, D, E, C.\n(i) Reconstruct the tree, and say how the root is found. [3]\n(ii) Write its postorder traversal. [1]\n(iii) What is its height? [1]', ['(i) The first in preorder, A, is the root.', '(i) In inorder, what is before A is its left subtree (D, B, E), and C is its right.', '(i) B is the left child of A, with D and E under it, and C is the right child of A.', '(ii) D, E, B, C, A.', '(iii) 2.']),
];

export default questions;
