// Computer Science, Class XI: knowledge added to what computerscience-xi.ts holds. Written fresh from the syllabus.
import { mergeKnowledge, type Facts } from '../dsl';
import MORE_A from './more/computerscience-xi-a';

const knowledge: Record<string, Facts> = {
  '1a': {
    ar: [
      ['octal digits', '18 isn’t a valid octal number.', '18 is a valid octal number.', 'Octal uses only the digits 0 to 7.', 'Octal numbers must be even.', 'Decimal 8 is 10 in octal.'],
      ['2’s complement', 'Computers commonly use 2’s complement for negative numbers.', 'Computers commonly use a separate sign bit, and no complements, for all arithmetic.', 'Addition and subtraction can then share one circuit.', 'Each number then needs two separate circuits.', '2’s complement has only one form for zero.'],
      ['the range of 8 bits', 'Eight bits in 2’s complement go from −128 to 127.', 'Eight bits in 2’s complement go from −255 to 255.', 'They give 256 values, with half of them negative.', 'They give 512 values.', 'The leftmost bit shows the sign.'],
    ],
  },
  '2a': {
    ar: [
      ['Unicode and ASCII', 'Unicode can represent far more characters than ASCII.', 'ASCII can represent far more characters than Unicode.', 'It has far more code points for the world’s scripts.', 'It has only 7 bits for each character.', 'Unicode includes all the ASCII characters.'],
      ['ASCII codes', 'In ASCII, ‘A’ has a smaller code than ‘a’.', 'In ASCII, ‘a’ has a smaller code than ‘A’.', 'Capital letters start at 65, and small letters at 97.', 'Small letters start at 65, and capitals at 97.', 'ASCII control characters have codes below 32.'],
      ['ASCII’s size', 'Standard ASCII has 128 characters.', 'Standard ASCII has 1024 characters.', 'It uses a 7-bit code.', 'It uses a 10-bit code.', 'ASCII has no codes for Devanagari letters.'],
    ],
  },
  '3a': {
    ar: [
      ['the conditional', 'p ⇒ q is true when p is false.', 'p ⇒ q is false when p is false.', 'It is false only when p is true and q is false.', 'It is false whenever q is false.', 'p ⇒ q is equivalent to ~p ∨ q.'],
      ['tautologies', 'p ∨ ~p is a tautology.', 'p ∨ ~p is a contradiction.', 'One of p and ~p is always true.', 'Both p and ~p are always false.', 'p ∧ ~p is a contradiction.'],
      ['the contrapositive', 'A statement and its contrapositive always agree in truth value.', 'A statement and its converse always agree in truth value.', 'p ⇒ q and ~q ⇒ ~p are false in exactly the same case.', 'p ⇒ q and q ⇒ p are false in exactly the same case.', 'The converse of p ⇒ q is q ⇒ p.'],
    ],
  },
  '3b': {
    ar: [
      ['universal gates', 'Any logic circuit can be built from NAND gates alone.', 'Any logic circuit can be built from OR gates alone.', 'NAND can make NOT, AND and OR.', 'NAND can make only NOT.', 'NOR is also a universal gate.'],
      ['XOR', 'An XOR gate gives 0 when both its inputs are 1.', 'An XOR gate gives 1 when both its inputs are 1.', 'It gives 1 only when its inputs differ.', 'It gives 1 only when its inputs match.', 'A half adder’s sum comes from an XOR gate.'],
      ['the half adder', 'A half adder needs two outputs.', 'A half adder needs just one output.', 'It gives a sum and a carry.', 'It gives only a carry.', 'A half adder has no carry input.'],
    ],
  },
  '4a': {
    ar: [
      ['inheritance', 'A subclass can reuse the code of its superclass.', 'A subclass must rewrite all the code of its superclass.', 'It inherits the superclass’s non-private members.', 'It inherits only the superclass’s private members.', 'The keyword extends marks a subclass.'],
      ['encapsulation', 'Fields are often made private.', 'Fields should always be public.', 'A class then controls how its data is changed.', 'Other classes can then change them more easily.', 'Encapsulation joins data and methods in one unit.'],
      ['classes and objects', 'One class can have many objects.', 'One class can have only one object.', 'A class is the template from which objects are made.', 'An object is the template from which classes are made.', 'Each object has its own copy of the instance variables.'],
    ],
  },
  '5a': {
    ar: [
      ['references', 'Two reference variables can refer to one object.', 'Two reference variables must always refer to two different objects.', 'Assigning a reference copies the address, not the object.', 'Assigning a reference copies the object.', 'A change through one reference is seen through the other.'],
      ['the garbage collector', 'A Java programmer doesn’t free memory by hand.', 'A Java programmer must free every object’s memory by hand.', 'The garbage collector reclaims objects with no references to them.', 'The JVM never reclaims any memory.', 'Java has no delete operator.'],
      ['new and the constructor', 'The new operator always calls a constructor.', 'The new operator never calls a constructor.', 'A constructor sets up each object as it is created.', 'A constructor runs only when the object is deleted.', 'A class with no constructor gets a default one.'],
    ],
  },
  '5b': {
    ar: [
      ['the kinds of error', 'A logical error can’t be found by the compiler.', 'A logical error is always found by the compiler.', 'The program is valid Java, and only gives wrong results.', 'The program breaks Java’s grammar.', 'A syntax error stops a program compiling.'],
      ['checked exceptions', 'Reading a file needs an IOException to be handled or declared.', 'Reading a file never needs an exception to be mentioned.', 'IOException is a checked exception.', 'IOException is a logic error.', 'ArithmeticException is an unchecked exception.'],
      ['arithmetic exceptions', 'Dividing an int by zero throws an exception.', 'Dividing an int by zero gives Infinity.', 'Integers have no value to stand for infinity.', 'Integers treat zero as one.', 'Dividing a double by zero gives Infinity.'],
    ],
  },
  '6a': {
    ar: [
      ['implicit widening', 'An int can be assigned to a double with no cast.', 'A double can be assigned to an int with no cast.', 'Widening can’t lose the size of the value.', 'Widening always loses part of the value.', 'A long literal ends in L.'],
      ['wrapper classes', 'A wrapper class is needed to treat an int as an object.', 'An int is already an object in Java.', 'int is a primitive type.', 'int is a class with methods.', 'Integer.MAX_VALUE holds the largest int.'],
      ['char as a number', '‘A’ + 1 gives the int 66 in Java.', '‘A’ + 1 gives the String “A1” in Java.', 'A char is promoted to int in arithmetic.', 'A char is treated as a String in arithmetic.', 'A char literal is written in single quotes.'],
    ],
  },
  '7a': {
    ar: [
      ['integer division', '7 / 2 gives 3 in Java.', '7 / 2 gives 3.5 in Java.', 'Dividing two ints drops the fraction.', 'Dividing two ints rounds to the nearest whole number.', '7 % 2 gives 1.'],
      ['short-circuit evaluation', 'In a && b, b isn’t evaluated if a is false.', 'In a && b, b is always evaluated first.', 'The result is already known to be false.', 'The result depends only on b.', '&& has higher precedence than ||.'],
      ['the precedence of operators', '2 + 3 * 4 gives 14 in Java.', '2 + 3 * 4 gives 20 in Java.', 'Multiplication comes before addition.', 'Addition comes before multiplication.', 'Brackets can change the order.'],
    ],
  },
  '8a': {
    ar: [
      ['switch and break', 'A case without a break falls through to the next.', 'A case without a break always ends the switch.', 'Execution carries on until a break or the end of the switch.', 'Execution jumps back to the start of the switch.', 'default runs if no case matches.'],
      ['the do-while loop', 'A do-while loop always runs at least once.', 'A do-while loop can skip its body completely.', 'Its condition is tested after the body.', 'Its condition is tested before the body.', 'A while loop can run zero times.'],
      ['scope', 'A variable declared in a loop doesn’t exist outside it.', 'A variable declared in a loop can be used anywhere in the method.', 'A local variable lasts only until its block ends.', 'A local variable lasts for the whole program.', 'A variable declared in main can be used anywhere in main after its declaration.'],
    ],
  },
  '9a': {
    ar: [
      ['the return statement', 'A method stops as soon as it runs a return statement.', 'A method goes on to its last line even after a return statement.', 'return sends control straight back to the caller.', 'return only stores the value for later.', 'A method can have more than one return statement.'],
      ['overloading', 'Two methods can have one name, if their parameter lists differ.', 'Two methods can have one name, if only their return types differ.', 'The compiler tells them apart by their parameters.', 'The compiler tells them apart by their return types alone.', 'Constructors can also be overloaded.'],
      ['static methods', 'A static method can be called with no object.', 'A static method can only be called on an object.', 'It belongs to the class.', 'It belongs to each object.', 'A static method can’t use this.'],
    ],
  },
  '10a': {
    ar: [
      ['string immutability', 'Strings in Java can’t be changed once they’re made.', 'Strings in Java can be changed in place by toUpperCase().', 'Methods such as toUpperCase() return a new String.', 'Methods such as toUpperCase() change the original String.', 'StringBuffer can be changed in place.'],
      ['compareTo', '"apple".compareTo("mango") gives a negative number.', '"apple".compareTo("mango") gives a positive number.', 'At the first characters that differ, it gives the first string’s code minus the second’s.', 'At the first characters that differ, it gives the second string’s code minus the first’s.', 'equals() gives true or false.'],
      ['array bounds', 'The last element of an array a is a[a.length - 1].', 'The last element of an array a is a[a.length].', 'Indexes start at 0.', 'Indexes start at 1.', 'Going past the end throws an exception.'],
    ],
  },
  '11a': {
    ar: [
      ['Scanner’s methods', 'nextInt() leaves the newline behind.', 'nextInt() always reads the newline as well.', 'It reads only the number’s characters.', 'It reads the entire rest of the line.', 'nextLine() reads up to the end of the line.'],
      ['Scanner and imports', 'A program using Scanner needs an import.', 'A program using Scanner needs no import.', 'Scanner is in the package java.util.', 'Scanner is in the package java.lang.', 'import java.util.*; imports all the classes of that package.'],
      ['wrong input', 'nextInt() can throw an exception for the input “abc”.', 'nextInt() returns 0 for the input “abc”.', 'The input can’t be read as an int.', 'The input is treated as 0 by default.', 'nextDouble() reads a double.'],
    ],
  },
  '11b': {
    ar: [
      ['text and binary files', 'A binary file is usually smaller than a text file of the same numbers.', 'A binary file is usually larger than a text file of the same numbers.', 'It stores values in their compact internal form.', 'It stores each digit as a separate character.', 'A text file can be read in a plain editor.'],
      ['output streams', 'A FileWriter can’t read a file.', 'A FileWriter can read a file.', 'It is an output stream, so data flows only from the program to the file.', 'It is an input stream.', 'FileReader is an input stream.'],
      ['the end of a file', 'BufferedReader’s readLine() returns null at the end of a file.', 'BufferedReader’s readLine() returns 0 at the end of a file.', 'null shows there are no more lines.', 'null shows that the line was empty.', 'A loop can read until it gets null.'],
    ],
  },
  '12a': {
    ar: [
      ['Python’s floor division', 'In Python, 7 // 2 gives 3.', 'In Python, 7 // 2 gives 3.5.', '// rounds the quotient down to a whole number.', '// always gives a float.', '7 % 2 gives 1.'],
      ['Python’s types', 'A Python variable can hold values of different types over time.', 'A Python variable must keep one type for its whole life.', 'Python is dynamically typed.', 'Python needs a type in each declaration.', 'type() tells a value’s type.'],
      ['Python and execution', 'Python is called an interpreted language.', 'Python code must be compiled to machine code by hand before it runs.', 'Its code is run by an interpreter, step by step.', 'Its code runs only on one operating system.', 'Python can be used interactively.'],
    ],
  },
  '13a': {
    ar: [
      ['phishing', 'A strange link in an email should not be clicked.', 'Any link in an email is always safe to click.', 'It may lead to a fake site that steals passwords.', 'Clicking on a link always cleans the computer.', 'Phishing tries to trick people into giving up personal data.'],
      ['two-factor authentication', 'Two-factor authentication makes an account safer.', 'Two-factor authentication makes an account less safe.', 'A stolen password alone isn’t then enough to get in.', 'It removes the need for any password check.', 'A code sent to a phone is a common second factor.'],
      ['intellectual property', 'Copying software without a licence is an offence.', 'Copying software without a licence is always allowed.', 'Software is protected by copyright.', 'Software has no owner.', 'Open-source licences allow copying under stated terms.'],
    ],
  },
};

export default mergeKnowledge(knowledge, MORE_A);
