// Written by hand: binary trees, figures to draw and read. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { figure } = kit('computerscience', 'XII');
const T = at(8, 'a');

const questions: BankDef[] = [
  figure(T(3, 1), 'Write the pre-order, in-order and post-order traversals of the binary tree shown.', ['Pre-order: A B D E C F.', 'In-order: D B E A C F.', 'Post-order: D E B F C A.'], {
    shown: { kind: 'tree', nodes: [{ label: 'A', left: 1, right: 2 }, { label: 'B', left: 3, right: 4 }, { label: 'C', right: 5 }, { label: 'D' }, { label: 'E' }, { label: 'F' }] },
  }),
  figure(T(3, 2), 'For the binary tree shown, give its height, name its leaves, and name the sibling of T.', ['The longest path from the root, P to R to T to V, has 3 edges, so the height is 3.', 'The leaves are S, U and V.', 'T’s sibling is U, as both are children of R.'], {
    shown: { kind: 'tree', nodes: [{ label: 'P', left: 1, right: 2 }, { label: 'Q', left: 3 }, { label: 'R', left: 4, right: 5 }, { label: 'S' }, { label: 'T', left: 6 }, { label: 'U' }, { label: 'V' }] },
  }),
  figure(T(3, 3), 'A binary tree has pre-order M N P Q R and in-order P N Q M R. Draw the tree.', ['M is first in pre-order, so it is the root. In in-order, P N Q is on its left and R on its right.', 'In the left part, N comes first in pre-order, so it roots that subtree, with P on its left and Q on its right.', 'R is M’s right child, a leaf.'], {
    answer: { kind: 'tree', nodes: [{ label: 'M', left: 1, right: 2 }, { label: 'N', left: 3, right: 4 }, { label: 'R' }, { label: 'P' }, { label: 'Q' }] },
  }),
  figure(T(2, 2), 'Draw the binary search tree formed by inserting 50, 30, 70, 20, 40 and 60, in that order.', ['50 is the root, with 30 on its left and 70 on its right.', '20 and 40 are the left and right children of 30, and 60 is the left child of 70.'], {
    answer: { kind: 'tree', nodes: [{ label: '50', left: 1, right: 2 }, { label: '30', left: 3, right: 4 }, { label: '70', left: 5 }, { label: '20' }, { label: '40' }, { label: '60' }] },
  }),
  figure(T(2, 1), 'In the binary tree shown, name the root, the internal nodes and the external nodes.', ['The root is K. The internal nodes, with at least one child, are K, L and M.', 'The external nodes, or leaves, are N, O and Q.'], {
    shown: { kind: 'tree', nodes: [{ label: 'K', left: 1, right: 2 }, { label: 'L', left: 3, right: 4 }, { label: 'M', right: 5 }, { label: 'N' }, { label: 'O' }, { label: 'Q' }] },
  }),
];

export default questions;
