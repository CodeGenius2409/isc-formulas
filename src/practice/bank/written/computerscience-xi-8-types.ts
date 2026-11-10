// Written by hand: statements and scope, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { program } = kit('computerscience', 'XI');
const A = at(8, 'a');

const questions: BankDef[] = [
  program(A(10, 2), 'Write a program with a method void pattern(int n) that prints this for n = 4, and for any other n in the same way:\n1\n1 2\n1 2 3\n1 2 3 4\nAdd a method int sumSeries(int n) that returns 1 + 2 + 4 + … with n terms, doubling each time. Write a main method that calls both for n = 4.', [['pattern() has an outer loop over the rows.', 2], ['An inner loop prints 1 to the row number, with spaces.', 2], ['A new line after each row.', 1], ['sumSeries() keeps a term that doubles, and a total.', 3], ['main calls both, and prints the sum.', 2]], '```\nclass Series {\n  static void pattern(int n) {\n    for (int r = 1; r <= n; r++) {\n      for (int c = 1; c <= r; c++) System.out.print(c + " ");\n      System.out.println();\n    }\n  }\n  static int sumSeries(int n) {\n    int term = 1, total = 0;\n    for (int i = 0; i < n; i++) {\n      total += term;\n      term *= 2;\n    }\n    return total;\n  }\n  public static void main(String[] args) {\n    pattern(4);\n    System.out.println(sumSeries(4));\n  }\n}\n```'),
];

export default questions;
