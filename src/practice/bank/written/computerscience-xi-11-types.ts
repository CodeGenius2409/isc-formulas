// Written by hand: input, output and files, by question type. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { program } = kit('computerscience', 'XI');
const B = at(11, 'b');

const questions: BankDef[] = [
  program(B(10, 3), 'Write a program that writes five names, read from the keyboard, to a text file names.txt, one on each line. It then reads the file back, and prints only the names that begin with the letter A. Handle any IOException.', [['Imports java.io and java.util.', 1], ['A Scanner reads the names from the keyboard.', 1], ['A PrintWriter or FileWriter writes each on its own line.', 2], ['The writer is closed before reading.', 1], ['A BufferedReader or Scanner reads until the file ends.', 2], ['Tests the first letter, and prints those that match.', 2], ['A try and catch for IOException.', 1]], '```\nimport java.io.*;\nimport java.util.Scanner;\n\nclass Names {\n  public static void main(String[] args) {\n    Scanner in = new Scanner(System.in);\n    try {\n      PrintWriter out = new PrintWriter(new FileWriter("names.txt"));\n      for (int i = 0; i < 5; i++) out.println(in.nextLine());\n      out.close();\n      BufferedReader file = new BufferedReader(new FileReader("names.txt"));\n      String name = file.readLine();\n      while (name != null) {\n        if (name.startsWith("A")) System.out.println(name);\n        name = file.readLine();\n      }\n      file.close();\n    } catch (IOException e) {\n      System.out.println("File problem: " + e.getMessage());\n    }\n  }\n}\n```'),
];

export default questions;
