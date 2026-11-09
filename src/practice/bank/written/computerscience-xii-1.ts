// Written by hand: Boolean algebra and Karnaugh maps. Places are [unit, topic, marks, difficulty].
import { bank, type BankDef } from '../define';

const { mcq, ar, theory } = bank('computerscience', 'XII');
const B = (marks: number, d: 1 | 2 | 3): [number, string, number, 1 | 2 | 3] => [1, 'b', marks, d];

const questions: BankDef[] = [
  mcq(B(1, 1), 'By the absorption law, A + A·B equals:', ['A', 'B', 'A·B', 'A + B'], 0),
  mcq(B(1, 1), 'A + A′ equals:', ['0', '1', 'A', 'A′'], 1),
  mcq(B(1, 1), 'A·A′ equals:', ['0', '1', 'A', 'A′'], 0),
  mcq(B(1, 1), 'The dual of A + 1 = 1 is:', ['A·0 = 0', 'A + 0 = A', 'A·1 = A', 'A′ + 1 = 1'], 0, 'Swap + with · and 0 with 1.'),
  mcq(B(1, 2), 'By De Morgan’s law, (A + B)′ equals:', ['A′ + B′', 'A′·B′', 'A·B', '(A·B)′'], 1),
  mcq(B(1, 2), 'A + A′·B simplifies to:', ['A', 'B', 'A + B', 'A·B'], 2),
  mcq(B(1, 2), 'A 4-variable Karnaugh map has how many cells?', ['4', '8', '16', '32'], 2),
  mcq(B(1, 2), 'A quad in a Karnaugh map removes how many variables?', ['1', '2', '3', '4'], 1, 'A pair removes 1, a quad 2 and an octet 3.'),
  mcq(B(1, 2), 'Adjacent rows of a Karnaugh map differ in:', ['no variable', 'one variable', 'two variables', 'all variables'], 1, 'They follow Gray code order.'),
  mcq(B(1, 3), 'An octet in a 4-variable Karnaugh map reduces to a term with:', ['1 variable', '2 variables', '3 variables', '4 variables'], 0),
  mcq(B(1, 3), 'The minterm for A = 1, B = 0, C = 1 is:', ['A·B′·C', 'A′·B·C′', 'A′ + B + C′', 'A + B′ + C'], 0),
  mcq(B(1, 3), 'The maxterm for A = 1, B = 0, C = 1 is:', ['A·B′·C', 'A′ + B + C′', 'A + B′ + C', 'A′·B·C′'], 1, 'In a maxterm, a 1 appears complemented.'),
  mcq(B(1, 2), 'A don’t care condition in a Karnaugh map:', ['must be left out of any group', 'may be grouped as 0 or 1, whichever helps', 'must be taken as 1', 'must be taken as 0'], 1),
  mcq(B(1, 3), 'The canonical sum of products of a 3-variable function has at most how many minterms?', ['3', '6', '8', '9'], 2),
  ar(B(1, 2), 'A·(A + B) = A.', 'This is one form of the absorption law.', 1),
  ar(B(1, 2), 'In a Karnaugh map, the top and bottom rows count as adjacent.', 'The map’s rows are in Gray code order, in which they differ by only one variable.', 1),
  ar(B(1, 1), 'NAND is a universal gate.', 'Any Boolean function can be built from NAND gates alone.', 1),
  ar(B(1, 3), 'A pair of cells diagonal to each other in a Karnaugh map can be grouped.', 'Cells can be grouped only if they differ in one variable.', 4, 'Diagonal cells differ in two variables, so they can’t be grouped.'),
  ar(B(1, 2), 'A prime implicant must always be included in a minimal expression.', 'An essential prime implicant covers a minterm no other prime implicant covers.', 4, 'Only essential ones must be. Others may not be needed.'),
  ar(B(1, 3), 'Grouping the largest possible blocks gives simpler terms in a Karnaugh map.', 'Each doubling of a group removes one more variable from its term.', 1),
  theory('reason', B(1, 1), 'Give a reason: in the Karnaugh map, Gray code is used, and not plain binary, to label rows.', ['Then neighbouring cells differ in one variable only, so they can be combined.']),
  theory('reason', B(2, 2), 'Give a reason: simplifying a Boolean expression matters when building a circuit.', ['A simpler expression needs fewer gates.', 'That means lower cost, less power and less delay.']),
  theory('reason', B(2, 3), 'Give a reason: redundant groups should be left out when reading a Karnaugh map.', ['A group whose cells are all covered by other groups adds a term that changes nothing.', 'Leaving it out keeps the expression minimal, with the same function.']),
  theory('distinguish', B(2, 1), 'Distinguish between a minterm and a maxterm.', ['Minterm: a product term with every variable, that is 1 for exactly one row of the truth table.', 'Maxterm: a sum term with every variable, that is 0 for exactly one row.']),
  theory('distinguish', B(2, 1), 'Distinguish between the canonical SOP form and the canonical POS form.', ['SOP: a sum of minterms, one for each row where the output is 1.', 'POS: a product of maxterms, one for each row where the output is 0.']),
  theory('distinguish', B(2, 2), 'Distinguish between the dual and the complement of a Boolean expression.', ['Dual: swap + with ·, and 0 with 1, leaving the variables as they are.', 'Complement: do the same, and also complement every variable.']),
  theory('distinguish', B(3, 2), 'Give three differences between a prime implicant and an essential prime implicant.', ['Prime implicant: a group that can’t be made larger. Essential: a prime implicant covering at least one minterm no other covers.', 'A minimal expression need not use every prime implicant. It must use every essential one.', 'A function may have many prime implicants, and may have fewer essential ones, or none.']),
  theory('short', B(1, 1), 'State the commutative law for the OR operation.', ['A + B = B + A.']),
  theory('short', B(1, 1), 'Write the POS form of a function that is 0 only for A = 0, B = 1.', ['A + B′.']),
  theory('short', B(2, 1), 'State De Morgan’s two laws.', ['(A + B)′ = A′·B′.', '(A·B)′ = A′ + B′.']),
  theory('short', B(2, 1), 'Simplify A·B + A·B′ using Boolean laws.', ['A·(B + B′), by the distributive law.', '= A, since B + B′ = 1.']),
  theory('short', B(2, 2), 'Simplify (A + B)·(A + B′).', ['= A + B·B′, by the distributive law.', '= A + 0 = A.']),
  theory('short', B(2, 2), 'Find the complement of A·B + C.', ['By De Morgan: (A·B)′·C′.', '= (A′ + B′)·C′.']),
  theory('short', B(3, 2), 'Simplify A·B + A·B·C + A·B′ using Boolean laws, naming each.', ['A·B + A·B·C = A·B, by absorption.', 'So the expression is A·B + A·B′ = A·(B + B′), by the distributive law.', '= A, by the complement law.']),
  theory('short', B(3, 3), 'Prove by Boolean algebra that A·B + A′·C + B·C = A·B + A′·C (the consensus law).', ['B·C = B·C·(A + A′) = A·B·C + A′·B·C.', 'So the expression is A·B(1 + C) + A′·C(1 + B).', 'Since 1 + X = 1, it equals A·B + A′·C.'], { format: 'derivation' }),
  theory('short', B(3, 3), 'Prove De Morgan’s law (A + B)′ = A′·B′ by showing the right-hand side is the complement of A + B.', ['(A + B) + A′·B′ = (A + B + A′)·(A + B + B′) = 1·1 = 1.', '(A + B)·A′·B′ = A·A′·B′ + B·B′·A′ = 0.', 'Both complement conditions hold, so A′·B′ is the complement of A + B.'], { format: 'derivation' }),
  theory('short', B(2, 2), 'Convert F = A + B·C into canonical SOP form in A, B and C, and say how many minterms it has.', ['A = A·(B + B′)·(C + C′) gives four minterms, and B·C = (A + A′)·B·C adds one new one, A′·B·C.', 'F is the sum of five minterms: A′BC, AB′C′, AB′C, ABC′, ABC.']),
  theory('short', B(5, 3), 'F(A, B, C, D) = Σ(0, 1, 2, 3, 8, 9, 10, 11). Reduce it with a Karnaugh map, showing the group, and write a circuit description for the result.', [['Mark cells 0, 1, 3, 2 in the row A′B′, and cells 8, 9, 11, 10 in the row AB′.', 2], ['These rows are adjacent, and form an octet.', 1], ['A changes across it, and B stays 0, and C and D both change.', 1], ['So F = B′, which needs just one NOT gate on B.', 1]], { format: 'long' }),
  theory('short', B(5, 3), 'F(A, B, C, D) = Σ(0, 2, 8, 10). Use a Karnaugh map to reduce it, explaining why these four cells can be grouped.', [['0 = 0000, 2 = 0010, 8 = 1000 and 10 = 1010.', 1], ['They’re the four corners of the map.', 1], ['Top and bottom rows are adjacent, and so are the left and right columns, so the corners form a quad.', 1], ['A and C change, while B = 0 and D = 0.', 1], ['F = B′·D′.', 1]], { format: 'long' }),
  theory('short', B(2, 2), 'A student groups the cells for minterms 5 and 10 in a 4-variable Karnaugh map as a pair. Say what’s wrong.', ['5 = 0101 and 10 = 1010 differ in all four variables.', 'A pair must differ in exactly one variable, so they can’t be grouped.'], { format: 'mistake' }),
  theory('short', B(2, 1), 'Draw a blank 3-variable Karnaugh map, labelling rows and columns in the right order.', ['Two rows for A: 0, 1.', 'Four columns for BC in Gray code order: 00, 01, 11, 10.'], { format: 'diagram' }),
  theory('short', B(4, 2), 'A lift’s door may close when the load is safe (A), the door path is clear (B), and either a floor button (C) or the close button (D) has been pressed.\n(i) Write the Boolean function for “close”. [2]\n(ii) How many rows would its truth table have? [1]\n(iii) What is the output when A = 1, B = 1, C = 0, D = 0? [1]', [['(i) F = A·B·(C + D).', 2], ['(ii) 16.', 1], ['(iii) 0: neither button has been pressed.', 1]], { format: 'cbq', style: 'cbq-style' }),
  theory('short', B(3, 2), 'A hall light can be switched from two ends, so that changing either switch changes the light.\n(i) Write its truth table’s output for AB = 00, 01, 10, 11. [1]\n(ii) Write its SOP expression. [1]\n(iii) Name this function. [1]', [['(i) 0, 1, 1, 0.', 1], ['(ii) A′·B + A·B′.', 1], ['(iii) Exclusive OR.', 1]], { format: 'cbq', style: 'cbq-style' }),
];

export default questions;
