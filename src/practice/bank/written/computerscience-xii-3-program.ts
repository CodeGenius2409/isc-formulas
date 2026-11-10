// Written by hand: methods, programs. Places are at(unit, topic)(marks, difficulty).
import { at, kit, type BankDef } from '../define';

const { program } = kit('computerscience', 'XII');
const M = at(3, 'a');

const questions: BankDef[] = [
  program(M(10, 2), 'A class Fraction has data members int num and int den.\nWrite: a constructor Fraction(int n, int d); a method int gcd(int a, int b) that returns the greatest common divisor; a method Fraction add(Fraction f) that returns a new Fraction, the sum of this one and f, in lowest terms; a method void show() that prints the fraction as num/den; and a static int count that counts how many Fraction objects have been made.\nWrite a main method that adds 1/2 and 1/3, shows the result, and prints count.', [['The constructor stores n and d with this, and adds 1 to the static count.', 2], ['gcd() works by repeated remainders, or recursion, and returns the result.', 2], ['add() forms the new numerator and denominator from this and f.', 2], ['add() divides both by their gcd, and returns a new Fraction object.', 2], ['show() prints num/den, and main shows 5/6 and a count of 3.', 2]], '```\nclass Fraction {\n  int num, den;\n  static int count = 0;\n  Fraction(int n, int d) {\n    this.num = n;\n    this.den = d;\n    count++;\n  }\n  int gcd(int a, int b) {\n    while (b != 0) {\n      int r = a % b;\n      a = b;\n      b = r;\n    }\n    return a;\n  }\n  Fraction add(Fraction f) {\n    int n = this.num * f.den + f.num * this.den;\n    int d = this.den * f.den;\n    int g = gcd(n, d);\n    return new Fraction(n / g, d / g);\n  }\n  void show() {\n    System.out.println(num + "/" + den);\n  }\n  public static void main(String[] args) {\n    Fraction a = new Fraction(1, 2);\n    Fraction b = new Fraction(1, 3);\n    Fraction c = a.add(b);\n    c.show();\n    System.out.println(count);\n  }\n}\n```'),
];

export default questions;
