// Written by hand: logic gates and their applications, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { long } = kit('computerscience', 'XII');
const A = at(2, 'a');
const B = at(2, 'b');

const questions: BankDef[] = [
  long(A(10, 2), 'Answer each part.\n(i) Show how NOT, AND and OR can each be made using only NAND gates. [3]\n(ii) Show how an XOR gate can be made from AND, OR and NOT gates, and write its expression. [3]\n(iii) Write the output of a circuit in which A and B go into a NOR gate, and that output and C go into an AND gate. [2]\n(iv) State why NAND and NOR are preferred in making chips. [2]', ['(i) NOT: both inputs of one NAND tied together.', '(i) AND: a NAND followed by a NOT made from a NAND.', '(i) OR: each input through a NOT made from a NAND, then a NAND.', ['(ii) A ⊕ B = A·B′ + A′·B.', 1], ['(ii) Two NOT gates, two AND gates and one OR gate, connected to match.', 2], ['(iii) (A + B)′ · C.', 2], ['(iv) Each makes any other gate, so one kind of gate can build a whole circuit, which is cheaper to make.', 2]]),
  long(B(10, 2), 'Answer each part.\n(i) What does a 3-to-8 decoder do? Say which output is active for the input 101. [3]\n(ii) Write the expressions for the outputs of a 4-to-2 encoder, with inputs D0 to D3. [3]\n(iii) Give one use each for a multiplexer and a decoder in a computer. [2]\n(iv) What makes a priority encoder different from a plain encoder? [2]', ['(i) It takes three inputs and makes exactly one of eight outputs active.', ['(i) 101 is 5, so output D5 is active.', 2], ['(ii) Y1 = D2 + D3.', 1], ['(ii) Y0 = D1 + D3.', 1], '(ii) Only one input is assumed to be active at a time.', '(iii) A multiplexer selects one of several data lines to send on a shared bus.', '(iii) A decoder selects one memory location from an address.', ['(iv) If several inputs are active, it gives the code of the highest priority, while a plain encoder gives a wrong code.', 2]]),
  long(B(10, 3), 'A hall light is controlled by three switches A, B and C. It is on when an odd number of the switches are on.\n(i) Draw up its truth table. [3]\n(ii) Write its sum-of-products expression, and simplify it to an expression using XOR. [3]\n(iii) Explain why this is the same as the Sum of a full adder. [2]\n(iv) Why is this useful for a light with several switches? [2]', ['(i) Eight rows are listed.', ['(i) The output is 1 for 001, 010, 100 and 111, and 0 otherwise.', 2], '(ii) F = A′B′C + A′BC′ + AB′C′ + ABC.', ['(ii) F = A ⊕ B ⊕ C.', 2], ['(iii) A full adder’s Sum is 1 when an odd number of its inputs are 1, which is this same function.', 2], ['(iv) Changing any one switch always changes the light, wherever the others are set.', 2]]),
];

export default questions;
