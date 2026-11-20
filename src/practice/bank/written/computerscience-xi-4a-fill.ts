// Written by hand: an introduction to object-oriented programming, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar, program } = kit('computerscience', 'XI');
const O = at(4, 'a');

const code = (lines: string[]) => '```\n' + lines.join('\n') + '\n```';

const questions: BankDef[] = [
  predict(O(2, 1), 'A class Counter has an instance variable count, starting at 0. Two objects, a and b, are made, and a.count is increased three times. Predict the value of b.count.', 'It is still 0.', 'Each object has its own copy of an instance variable, so changing a’s doesn’t change b’s.'),
  predict(O(2, 2), 'A class Account declares double balance as private. Another class tries to set acc.balance = 500. Predict what happens, and how the balance should be changed.', 'The program doesn’t compile: a private member can’t be reached from outside its class.', 'The balance should be changed through a public method of Account, such as deposit(500).'),
  predict(O(2, 2), 'A class has a static variable total, starting at 0, and each object’s constructor adds 5 to it. Predict total after three objects are made.', 'It is 15.', 'A static variable belongs to the class, so all objects share one copy, and each adds 5 to it.'),

  odd(O(2, 1), ['encapsulation', 'inheritance', 'polymorphism', 'compilation'], 'compilation', 'It is a step in running a program; the others are principles of object-oriented programming.'),
  odd(O(2, 1), ['int', 'double', 'char', 'String'], 'String', 'It is a class, a reference type; the others are primitive types.'),
  odd(O(2, 1), ['bytecode', 'the JVM', 'javac', 'the BIOS'], 'the BIOS', 'It is part of a computer’s start-up firmware; the others are parts of how a Java program is compiled and run.'),

  long(O(5, 1), 'Answer each part on the principles of object-oriented programming.\n(a) What is encapsulation? [1]\n(b) What is abstraction? [1]\n(c) What is inheritance? [1]\n(d) What is polymorphism? [1]\n(e) Give the state and behaviour of a real-world object, a fan. [1]', '(a) Wrapping data and the methods that work on it into one unit, a class, and hiding the data from outside.', '(b) Showing only the essential features of an object, and hiding the details of how it works.', '(c) One class taking on the data members and methods of another, so code is reused.', '(d) One name, such as a method name, taking many forms, so the same message can be handled differently by different objects.', '(e) State: speed and whether it is on; behaviour: switch on, switch off and change speed.'),
  long(O(5, 2), 'Answer each part on how a Java program is run.\n(a) What does the compiler javac produce? [1]\n(b) What does the Java Virtual Machine do? [1]\n(c) Why is Java said to be platform independent? [1]\n(d) Give one compile-time error and one run-time error, with an example of each. [2]', '(a) Bytecode, stored in a .class file.', '(b) It interprets the bytecode, turning it into the machine code of the computer it runs on.', '(c) The same bytecode runs on any machine that has a JVM, whatever its processor or operating system.', '(d) Compile-time: a syntax error found by the compiler, such as a missing semicolon.', '(d) Run-time: an error while the program runs, such as dividing an int by zero.'),
  long(O(5, 2), 'A bank account has an account number and a balance; money can be paid in and taken out, and the balance can be checked.\n(a) Give two features of procedure-oriented programming. [1]\n(b) Give two features of object-oriented programming. [1]\n(c) Name the data members and the member methods of an Account class. [2]\n(d) Which members should be private, and why? [1]', '(a) The program is a list of procedures, and data is often shared openly between them.', '(b) The program is built from objects, which keep their own data and methods together, and hide the data.', '(c) Data members: accountNumber and balance.', '(c) Methods: deposit(), withdraw() and getBalance().', '(d) The data members, so that the balance can be changed only through deposit() and withdraw(), which can check the amounts.'),

  tell(O(2, 1), 'Distinguish between procedure-oriented and object-oriented programming.', 'Procedure-oriented programming is built around functions that act on data, which is often shared openly.', 'Object-oriented programming is built around objects, each holding its own data and the methods that act on it, with the data hidden.'),
  tell(O(2, 1), 'Distinguish between the data members and the member methods of a class.', 'Data members are the variables of a class, holding the state of each object.', 'Member methods are its functions, giving the behaviour of the objects and working on their data.'),

  match(O(4, 1), [['Encapsulation', 'wrapping data and methods into one unit'], ['Abstraction', 'showing the essential features and hiding the details'], ['Inheritance', 'a class taking on the features of another'], ['Polymorphism', 'one name, many forms']]),
  match(O(4, 1), [['javac', 'compiles source code into bytecode'], ['The java command', 'runs the bytecode on the JVM'], ['Bytecode', 'instructions for the JVM, kept in a .class file'], ['The JVM', 'interprets bytecode on a particular machine']]),
  match(O(4, 1), [['A class', 'a blueprint for objects'], ['An object', 'an instance of a class'], ['The state of an object', 'the values of its data members'], ['The behaviour of an object', 'what it can do, through its methods']]),

  reason(O(2, 1), 'Give a reason: a class is called a user-defined data type.', 'The programmer defines it, choosing its data members and methods.', 'Variables can then be declared of that class type, just as of int or double.'),
  reason(O(2, 2), 'Give a reason: inheritance saves effort when a program is extended.', 'A new class can take on the members of an existing class without writing them again.', 'Only what is new or different needs to be added, and the tested code is reused.'),

  short(O(2, 1), 'Name the four principles of object-oriented programming.', 'Encapsulation and abstraction.', 'Inheritance and polymorphism.'),
  short(O(2, 1), 'What is bytecode?', 'The machine-independent code that the Java compiler produces from source code, kept in .class files.', 'It is run by the Java Virtual Machine, not directly by the processor.'),
  short(O(2, 1), 'Give two items of state and two of behaviour for an object of a class Car.', 'State: its colour and its speed.', 'Behaviour: accelerate() and brake().'),

  ar(O(1, 1), 'An object’s data can be kept safe from changes by other classes.', 'Data members can be declared private, and reached only through the class’s methods.', 1, 'This is encapsulation: the methods can check any change before making it.'),
  ar(O(1, 2), 'A class takes up memory for its instance variables as soon as it is defined.', 'Memory for instance variables is set aside only when an object is created.', 4, 'Each new object gets its own memory for its instance variables; the class itself is only a blueprint.'),
  ar(O(1, 1), 'Inheritance lets code be reused.', 'A subclass takes on the members of its superclass.', 1, 'The subclass needn’t rewrite what the superclass already has.'),

  program(O(5, 1), 'Write a class Rectangle with data members length and breadth, a constructor to set them, and methods area() and perimeter(). In main, make a rectangle 5 by 3 and print its area and perimeter.', [['Data members length and breadth.', 1], ['A constructor with two parameters sets them.', 1], ['area() returns length × breadth.', 1], ['perimeter() returns 2 × (length + breadth).', 1], ['main makes the object with new and prints both.', 1]], code([
    'class Rectangle {',
    '  double length, breadth;',
    '',
    '  Rectangle(double l, double b) {',
    '    length = l;',
    '    breadth = b;',
    '  }',
    '',
    '  double area() {',
    '    return length * breadth;',
    '  }',
    '',
    '  double perimeter() {',
    '    return 2 * (length + breadth);',
    '  }',
    '',
    '  public static void main(String[] args) {',
    '    Rectangle r = new Rectangle(5, 3);',
    '    System.out.println("Area = " + r.area());',
    '    System.out.println("Perimeter = " + r.perimeter());',
    '  }',
    '}',
  ])),
  program(O(6, 2), 'Write a class Account with a private balance, a constructor that sets the opening balance, and methods deposit(amount), withdraw(amount) and getBalance(). withdraw() refuses, with a message, if there isn’t enough money. In main, open an account with 1000, pay in 500, try to take out 2000, then take out 300, and print the balance.', [['balance is private.', 1], ['The constructor sets the opening balance.', 1], ['deposit() adds the amount.', 1], ['withdraw() checks the balance first, and prints a message if it is too small.', 2], ['main calls the methods in order and prints getBalance().', 1]], code([
    'class Account {',
    '  private double balance;',
    '',
    '  Account(double opening) {',
    '    balance = opening;',
    '  }',
    '',
    '  void deposit(double amount) {',
    '    balance += amount;',
    '  }',
    '',
    '  void withdraw(double amount) {',
    '    if (amount > balance) {',
    '      System.out.println("Not enough money");',
    '    } else {',
    '      balance -= amount;',
    '    }',
    '  }',
    '',
    '  double getBalance() {',
    '    return balance;',
    '  }',
    '',
    '  public static void main(String[] args) {',
    '    Account acc = new Account(1000);',
    '    acc.deposit(500);',
    '    acc.withdraw(2000);',
    '    acc.withdraw(300);',
    '    System.out.println("Balance = " + acc.getBalance());',
    '  }',
    '}',
  ])),
  program(O(5, 2), 'Write a class Student with data members name and marks, a constructor to set them, and a method grade() that returns "A" for marks of 80 or more, "B" for 60 to 79, and "C" below 60. In main, make two students and print each name with its grade.', [['Data members name and marks, set by a constructor.', 1], ['grade() tests the marks in order, from the top.', 2], ['It returns a String.', 1], ['main makes two objects and prints each name and grade.', 1]], code([
    'class Student {',
    '  String name;',
    '  int marks;',
    '',
    '  Student(String n, int m) {',
    '    name = n;',
    '    marks = m;',
    '  }',
    '',
    '  String grade() {',
    '    if (marks >= 80) return "A";',
    '    else if (marks >= 60) return "B";',
    '    else return "C";',
    '  }',
    '',
    '  public static void main(String[] args) {',
    '    Student s1 = new Student("Riya", 85);',
    '    Student s2 = new Student("Kabir", 64);',
    '    System.out.println(s1.name + " " + s1.grade());',
    '    System.out.println(s2.name + " " + s2.grade());',
    '  }',
    '}',
  ])),
];

export default questions;
