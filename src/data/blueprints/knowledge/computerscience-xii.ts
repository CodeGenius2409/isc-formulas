// Computer Science, Class XII: knowledge added to what computerscience-xii.ts holds. Written fresh from the syllabus.
import { mergeKnowledge, type Facts } from '../dsl';
import { COMPUTERSCIENCE_XII } from './more/v6-formats';
import MORE_A from './more/computerscience-xii-a';

const knowledge: Record<string, Facts> = {
  '1a': {
    ar: [
      ['the conditional', 'p ⇒ q is false only when p is true and q is false.', 'p ⇒ q is false whenever p is false.', 'A promise is broken only if its condition holds and its result doesn’t.', 'A promise is broken whenever its condition fails.', 'p ⇒ q is read as “p implies q”.'],
      ['the biconditional', 'p ⇔ q is true when p and q have the same truth value.', 'p ⇔ q is true when p and q have different truth values.', 'p ⇔ q means p ⇒ q and q ⇒ p both hold.', 'p ⇔ q means neither p ⇒ q nor q ⇒ p holds.', 'XNOR behaves in the same way.'],
      ['the rows of a truth table', 'A truth table for 4 variables has 16 rows.', 'A truth table for 4 variables has 8 rows.', 'Each variable doubles the number of combinations, giving 2⁴.', 'Each variable adds two rows.', 'A contradiction has 0 in every row of its final column.'],
    ],
  },
  '1b': {
    ar: [
      ['canonical forms', 'A maxterm is 0 for exactly one combination of inputs.', 'A maxterm is 1 for exactly one combination of inputs.', 'It is a sum of all the variables, each complemented or not.', 'It is a product of all the variables, each complemented or not.', 'A minterm is 1 for exactly one combination of inputs.'],
      ['K-map grouping', 'K-map columns are in the order 00, 01, 11, 10.', 'K-map columns are in the order 00, 01, 10, 11.', 'Neighbouring cells must differ in just one variable.', 'Neighbouring cells must differ in all their variables.', 'A group must have 1, 2, 4 or 8 cells.'],
      ['absorption', 'A + AB = A.', 'A + AB = B.', 'If A is 0, both sides are 0, and if A is 1, both sides are 1.', 'If A is 0, both sides are 1.', 'A(A + B) = A also holds.'],
      ['De Morgan’s laws', '(A + B)′ = A′B′.', '(A + B)′ = A′ + B′.', 'Both sides are 1 only when A and B are both 0.', 'Both sides are 1 whenever A or B is 1.', '(AB)′ = A′ + B′.'],
    ],
  },
  '2a': {
    ar: [
      ['NAND as a universal gate', 'NAND is called a universal gate.', 'NAND can be used only with other kinds of gate.', 'NOT, AND and OR can all be built from it.', 'Only AND can be built from it.', 'NOR is also universal.'],
      ['bubble-pushing NOT', 'A NAND gate with its inputs joined acts as a NOT gate.', 'A NAND gate with its inputs joined acts as an OR gate.', '(AA)′ = A′.', '(AA)′ = A.', 'A NOR gate with its inputs joined also acts as a NOT gate.'],
      ['NOT twice', 'Two NOT gates in series give back the input.', 'Two NOT gates in series always give 0.', 'A″ = A.', 'A″ = A′.', 'A NOT gate has one input.'],
    ],
  },
  '2b': {
    ar: [
      ['the full adder', 'A full adder can be built from two half adders and an OR gate.', 'A full adder can be built from one half adder alone.', 'It must add three bits, two at a time.', 'It must add only two bits.', 'Its carry is AB + BC + CA.'],
      ['the multiplexer', 'A multiplexer with 8 inputs needs 3 select lines.', 'A multiplexer with 8 inputs needs 8 select lines.', '2³ = 8, so three lines can pick out any input.', '3² = 8, so three lines can pick out any input.', 'A multiplexer is also called a data selector.'],
      ['the decoder', 'A 3-to-8 decoder activates one output for each input code.', 'A 3-to-8 decoder activates every output for each input code.', 'Each three-bit code stands for just one line.', 'Each three-bit code stands for all eight lines.', 'A 3-to-8 decoder has three input lines.'],
    ],
  },
  '3a': {
    ar: [
      ['objects as parameters', 'A method can change the fields of an object passed to it.', 'A method can’t change the fields of an object passed to it.', 'The parameter holds a copy of the reference, which points to the same object.', 'The parameter holds a complete copy of the object.', 'Assigning a new object to the parameter doesn’t affect the caller.'],
      ['static and instance members', 'A static method can’t directly use an instance variable.', 'A static method can directly use any instance variable.', 'A static method has no this to tell it which object.', 'A static method has several objects as this.', 'A static variable is shared by all objects.'],
      ['constructors', 'A constructor has no return type.', 'A constructor has the return type void.', 'It is called by new, which gives back the object itself.', 'It is called by return, which gives back an int.', 'A constructor has the class’s name.'],
    ],
  },
  '4a': {
    ar: [
      ['binary search', 'Binary search needs a sorted array.', 'Binary search works on any array.', 'It relies on knowing which half can hold the key.', 'It compares each element in turn.', 'Binary search takes O(log n) steps.'],
      ['row-major order', 'A[i][j] in row-major order is at base + w(i × columns + j), with 0-based indexes.', 'A[i][j] in row-major order is at base + w(j × columns + i), with 0-based indexes.', 'All of the earlier rows are stored before it.', 'All of the later rows are stored before it.', 'Column-major order stores a column at a time.'],
      ['bubble sort', 'After one pass of an ascending bubble sort, the largest value is at the end.', 'After one pass of an ascending bubble sort, the smallest value is at the end.', 'The largest value is carried along by each swap.', 'The largest value stays where it started.', 'Bubble sort takes O(n²) in the worst case.'],
    ],
  },
  '4b': {
    ar: [
      ['strings are objects', 'equals() is used to compare the contents of two Strings.', '== is used to compare the contents of two Strings.', 'String is a class, and == compares references.', 'String is a primitive type, and == compares its characters.', 'String is in the package java.lang.'],
      ['substring', 's.substring(1, 3) has two characters.', 's.substring(1, 3) has three characters.', 'The end index isn’t included.', 'The end index is included.', 's.substring(0) is the whole of s.'],
      ['trim', 'trim() doesn’t remove spaces in the middle of a string.', 'trim() removes every space in a string.', 'It removes spaces only at the two ends.', 'It removes only the first space.', 'trim() returns a new String.'],
    ],
  },
  '5a': {
    ar: [
      ['tail recursion', 'In tail recursion, nothing is left to do after the recursive call.', 'In tail recursion, work is still left to do after the recursive call.', 'The recursive call is the method’s very last action.', 'The recursive call comes first in the method.', 'A factorial written as n * fact(n - 1) isn’t tail-recursive.'],
      ['recursion and memory', 'Recursion usually uses more memory than a loop.', 'A loop usually uses more memory than recursion.', 'Each call adds a frame on the call stack.', 'Each loop iteration adds a frame on the call stack.', 'Java limits how deep the call stack can grow.'],
      ['statements after the call', 'Statements after a recursive call run as the calls return.', 'Statements after a recursive call never run.', 'Each call must finish its recursive call before it can go on.', 'Each call ends as soon as it makes its recursive call.', 'This can print values in reverse order.'],
    ],
  },
  '6a': {
    ar: [
      ['single inheritance', 'A Java class can extend only one class.', 'A Java class can extend any number of classes.', 'Two parents could otherwise offer two different bodies for one method.', 'Java has no extends keyword.', 'A class can be extended by many subclasses.'],
      ['overriding', 'An overridden method is chosen at run time.', 'An overridden method is chosen at compile time.', 'The object’s runtime class decides which version runs.', 'The variable’s declared type decides which version runs.', 'This is called dynamic binding.'],
      ['abstract classes', 'An abstract class can’t be created with new.', 'An abstract class can be created with new.', 'It may have methods with no body.', 'It has no methods at all.', 'A class can’t be both abstract and final.'],
      ['super', 'A subclass’s constructor calls its parent’s constructor first.', 'A subclass’s constructor calls its parent’s constructor last.', 'The inherited part of the object must be set up first.', 'The new part of the object must be set up first.', 'Object’s constructor runs before any other.'],
    ],
  },
  '6b': {
    ar: [
      ['implementing many interfaces', 'A class can implement several interfaces.', 'A class can implement only one interface.', 'An interface brings no method bodies, so nothing can clash.', 'An interface brings many method bodies, which all clash.', 'A class can extend only one class.'],
      ['instantiating an interface', 'An interface can’t be created with new.', 'An interface can be created with new.', 'Its methods have no bodies to run.', 'Its methods all have complete bodies.', 'An interface is compiled to its own class file.'],
      ['an interface’s methods', 'A method implementing an interface’s method must be public.', 'A method implementing an interface’s method must be private.', 'An interface’s methods are public, and an override can’t be less visible.', 'An interface’s methods are private, and an override can’t be more visible.', 'A class may implement an interface and still add methods of its own.'],
    ],
  },
  '7a': {
    ar: [
      ['string slices', 's[a:b] stops before index b.', 's[a:b] includes index b.', 'A slice takes from a up to but not including b.', 'A slice takes everything from b onwards.', 'A negative index counts from the end.'],
      ['immutable strings in Python', 's[0] = "x" causes an error for a Python string.', 's[0] = "x" changes the first character of a Python string.', 'Python strings are immutable.', 'Python strings are mutable lists.', 'Methods such as upper() return a new string.'],
      ['beyond the end', 'A slice beyond the end of a string gives no error.', 'A slice beyond the end of a string always gives an error.', 'Slices stop quietly at the ends.', 'Slices wrap back round to the start.', 'An index beyond the end does give an error.'],
    ],
  },
  '7b': {
    ar: [
      ['aliasing', 'After b = a, changing b also changes a, for lists.', 'After b = a, changing b leaves a unchanged, for lists.', 'Both names refer to the same list.', 'b holds a complete copy of the list.', 'a[:] makes a shallow copy.'],
      ['list methods', 'a.sort() changes the list a in place.', 'a.sort() leaves a unchanged and returns a new list.', 'sort() returns None and works in place.', 'sort() returns a sorted copy.', 'sorted(a) returns a new list.'],
      ['mixed types', 'A Python list can hold items of different types.', 'A Python list can hold only one type of item.', 'Each item is a reference to an object of any type.', 'Each item must be a number.', 'Lists can hold other lists.'],
    ],
  },
  '7c': {
    ar: [
      ['tuple unpacking', 'a, b = b, a swaps two values in Python.', 'a, b = b, a sets both values to b.', 'The right side is packed into a tuple first.', 'The left side is worked out first.', 'Tuples can be nested.'],
      ['the one-item tuple', '(5,) is a tuple, and (5) isn’t.', '(5) is a tuple, and (5,) isn’t.', 'The comma makes the tuple.', 'The round brackets alone make the tuple.', 'An empty tuple is written ().'],
      ['tuple operations', 'Tuples can be joined with +.', 'Tuples can’t be joined with +.', 'This makes a new tuple, without changing the originals.', 'This changes the first tuple in place.', 'len() works on a tuple.'],
    ],
  },
  '8a': {
    ar: [
      ['the height of a tree', 'A binary tree of height h (in levels) has at most 2ʰ − 1 nodes.', 'A binary tree of height h (in levels) has at most 2h nodes.', 'Each level can hold twice as many nodes as the one before.', 'Each level can hold just two nodes.', 'Level 1 has one node, the root.'],
      ['traversals', 'Pre-order traversal always visits the root of the tree first.', 'Post-order traversal always visits the root of the tree first.', 'Pre-order visits each node before either of its subtrees.', 'Post-order visits each node before its subtrees.', 'In-order visits the left subtree, the root, then the right subtree.'],
      ['the root and leaves', 'A leaf has no children.', 'A leaf has exactly two children.', 'It lies at the end of a branch.', 'It lies at the top of the tree.', 'An internal node has at least one child.'],
    ],
  },
  '9a': {
    ar: [
      ['nested loops', 'Two nested loops over n items take O(n²) steps.', 'Two nested loops over n items take O(n) steps.', 'The inner body runs n times for each of the n outer turns.', 'The inner body runs once in total.', 'Bubble sort uses two nested loops.'],
      ['logarithmic growth', 'Binary search on a million items takes about 20 comparisons at worst.', 'Binary search on a million items takes about a million comparisons at worst.', 'Each comparison halves the range, and 2²⁰ is about a million.', 'Each comparison removes just one item.', 'Binary search needs a sorted array.'],
      ['the best case', 'Linear search can finish after one comparison.', 'Linear search always needs n comparisons.', 'The item it looks for may be the first one checked.', 'It must check every item before it stops.', 'Linear search works on unsorted data.'],
    ],
  },
};

export default mergeKnowledge(knowledge, MORE_A, COMPUTERSCIENCE_XII);
