// Written by hand: binary trees, match the columns. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { match } = kit('computerscience', 'XII');
const T = at(8, 'a');

const questions: BankDef[] = [
  match(T(3, 1), [['Root', 'The only node with no parent'], ['Leaf', 'A node with no children'], ['Siblings', 'Nodes with the same parent']]),
  match(T(4, 2), [['Pre-order', 'Node, left subtree, right subtree'], ['In-order', 'Left subtree, node, right subtree'], ['Post-order', 'Left subtree, right subtree, node'], ['Level of a node', 'Its depth, counting the root as level 0']]),
  match(T(3, 2), [['Size of a tree', 'Its number of nodes'], ['Height of a tree', 'The longest path from the root to a leaf, in edges'], ['Degree of a node', 'Its number of children']]),
  match(T(4, 3), [['First node in pre-order', 'The root'], ['Last node in post-order', 'Also the root'], ['First node in in-order', 'The leftmost node'], ['Last node in in-order', 'The rightmost node']]),
  match(T(3, 3), [['Internal node', 'Has at least one child'], ['Subtree', 'A node with all its descendants'], ['Most nodes at level k', '2ᵏ']]),
];

export default questions;
