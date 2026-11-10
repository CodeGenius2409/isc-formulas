// Written by hand: string handling, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar, program } = kit('computerscience', 'XII');
const S = at(4, 'b');

const questions: BankDef[] = [
  predict(S(2, 1), 'Predict the output, and explain it.\n```\nString s = "Java";\nSystem.out.println(s.indexOf(\'a\') + " " + s.lastIndexOf(\'a\'));\n```', 'It prints 1 3.', 'Indexes start at 0: the first a is at index 1, and the last at index 3.'),
  predict(S(2, 2), 'Predict the output, and explain it.\n```\nSystem.out.println(1 + 2 + "3" + 4 + 5);\n```', 'It prints 3345.', '+ works from left to right: 1 + 2 is the int 3, then joining "3" makes the String "33", and 4 and 5 are joined on as text.'),
  predict(S(2, 2), 'Predict the output, and explain it.\n```\nStringBuffer sb = new StringBuffer("cat");\nsb.append("s");\nsb.insert(0, "big ");\nsb.reverse();\nSystem.out.println(sb);\n```', 'It prints stac gib.', 'The buffer is changed in place: "cats", then "big cats", which reverse() turns round.'),

  odd(S(2, 2), ['append()', 'insert()', 'reverse()', 'substring()'], 'substring()', 'It returns a new String and leaves the StringBuffer unchanged; the other three change the StringBuffer itself.'),
  odd(S(2, 1), ['charAt()', 'length()', 'indexOf()', 'toUpperCase()'], 'toUpperCase()', 'It returns a String; the others return a char or an int.'),
  odd(S(2, 1), ['"Hello".equals("hello")', '"Hello".equalsIgnoreCase("hello")', '"Hello".startsWith("He")', '"Hello".endsWith("lo")'], '"Hello".equals("hello")', 'It is false, as equals() takes case into account; the other three are true.'),

  long(S(5, 1), 'Given String s = "PROGRAMMING";, write the value of each.\n(a) s.length() and s.charAt(4) [1]\n(b) s.indexOf(\'M\') and s.lastIndexOf(\'M\') [1]\n(c) s.substring(3, 7) [1]\n(d) s.replace(\'M\', \'N\') [1]\n(e) The sign of s.toLowerCase().compareTo(s), with a reason [1]', '(a) 11 and \'R\'.', '(b) 6 and 7.', '(c) "GRAM".', '(d) "PROGRANNING".', '(e) Positive, 32: \'p\' is 112 and \'P\' is 80, and the first characters already differ.'),
  long(S(5, 2), 'Answer each part on StringBuffer.\n(a) Why is StringBuffer used when a program changes a string many times? [2]\n(b) Give the contents of sb after these statements:\n```\nStringBuffer sb = new StringBuffer("ISC");\nsb.append(2028);\nsb.insert(3, \' \');\nsb.setCharAt(0, \'i\');\n```\n[2]\n(c) How is a StringBuffer turned back into a String? [1]', '(a) A String can’t be changed, so every change makes a new String object.', '(a) A StringBuffer is changed in place, which saves making and discarding many objects.', '(b) After append: "ISC2028"; after insert: "ISC 2028".', '(b) After setCharAt: "iSC 2028".', '(c) With sb.toString().'),
  long(S(5, 2), 'Answer each part on methods for a sentence s whose words are separated by single spaces.\n(a) Write a method int words(String s) that returns the number of words. [2]\n(b) Write a method String title(String s) that returns s with the first letter of each word in capitals. [3]', '(a) Count the spaces with a loop over charAt.', '(a) Return the count of spaces plus 1.', '(b) Start a StringBuffer, and loop over the characters.', '(b) A character at index 0, or just after a space, is added as Character.toUpperCase of it; others are added unchanged.', '(b) Return the buffer as a String.'),

  tell(S(2, 1), 'Distinguish between String and StringBuffer.', 'A String can’t be changed once made; methods such as toUpperCase() return a new String.', 'A StringBuffer can be changed in place, by methods such as append(), insert() and reverse().'),
  tell(S(2, 1), 'Distinguish between charAt() and indexOf().', 'charAt(i) takes an index and returns the character at it.', 'indexOf(c) takes a character and returns the index where it first appears, or −1.'),
  tell(S(2, 2), 'Distinguish between compareTo() and equals() for Strings.', 'equals() returns a boolean: true only if the two strings have the same characters.', 'compareTo() returns an int: 0 if they are equal, negative if the first comes earlier in dictionary order, and positive if it comes later.'),

  match(S(4, 1), [['"HELLO".toLowerCase()', '"hello"'], ['"  hi  ".trim()', '"hi"'], ['"banana".indexOf(\'n\')', '2'], ['"banana".replace(\'a\', \'o\')', '"bonono"']]),
  match(S(4, 1), [['length()', 'the number of characters'], ['charAt(i)', 'the character at index i'], ['substring(i)', 'the part from index i to the end'], ['concat(t)', 'the string with t joined at its end']]),
  match(S(4, 2), [['"apple".compareTo("apple")', '0'], ['"b".compareTo("a")', '1'], ['"a".compareTo("c")', '-2'], ['"Z".compareTo("a")', '-7']]),

  reason(S(2, 1), 'Why does s.charAt(s.length()) cause an error?', 'The indexes of s run from 0 to s.length() − 1.', 'So s.length() is one past the last character, and charAt throws a StringIndexOutOfBoundsException.'),
  reason(S(2, 2), 'Why is a StringBuffer faster than a String when a loop adds one character at a time many times?', 'Each + on a String makes a new String and copies all the characters so far.', 'A StringBuffer adds the character to the same object, so nothing is copied again.'),
  reason(S(2, 1), 'Why does "Apple".compareTo("apple") give a negative number?', 'compareTo() compares the Unicode codes of the first characters that differ: A is 65 and a is 97.', 'So it returns 65 − 97 = −32, which is negative.'),

  short(S(2, 1), 'Write one statement that puts the reverse of a String s into a String r, using StringBuffer.', 'String r = new StringBuffer(s).reverse().toString();', 'The StringBuffer is made from s, reversed in place, and turned back into a String.'),
  short(S(2, 1), 'Give the output of these statements, and explain it.\n```\nString s = "Computer";\nSystem.out.println(s.substring(3) + s.charAt(0));\n```', 'substring(3) is "puter", from index 3 to the end, and charAt(0) is \'C\'.', 'So it prints puterC.'),
  short(S(2, 1), 'Write a loop that counts how many times the letter a appears in a String s.', 'A counter starts at 0, and a loop runs i from 0 to s.length() − 1.', 'Inside it, if (s.charAt(i) == \'a\') count++;'),

  ar(S(1, 1), 's.concat("x") leaves s unchanged.', 'String objects can’t be changed.', 1, 'concat returns a new String, and s still refers to the old one.'),
  ar(S(1, 1), '"Hello".length() is 6.', 'length() returns the number of characters in a string.', 4, '"Hello" has 5 characters, so length() is 5.'),
  ar(S(1, 1), 'A StringBuffer can be changed after it is made.', 'StringBuffer is in the package java.lang.', 2, 'Both are true, but its package has nothing to do with its being changeable.'),

  program(S(10, 2), 'Design a class Initials with a String field name, holding a full name of two or more words separated by single spaces. Give it a constructor and a method String shortForm(), which uses a StringBuffer to return the initials of every word but the last, each followed by a full stop and a space, then the last word in full. In main, read a name and print its short form. For example, Mohandas Karamchand Gandhi gives M. K. Gandhi.', [['The field and a constructor that stores the name.', 2], ['lastIndexOf(\' \') finds where the last word starts.', 2], ['A loop picks out the first character, and each character just after a space before the last word.', 2], ['Each initial is appended to the StringBuffer with ". ".', 2], ['The last word, substring(last + 1), is appended, and the result returned and printed.', 2]], '```\nimport java.util.Scanner;\n\nclass Initials {\n  String name;\n  Initials(String n) {\n    name = n.trim();\n  }\n  String shortForm() {\n    StringBuffer sb = new StringBuffer();\n    int last = name.lastIndexOf(\' \');\n    sb.append(name.charAt(0));\n    sb.append(". ");\n    for (int i = 1; i < last; i++) {\n      if (name.charAt(i - 1) == \' \') {\n        sb.append(name.charAt(i));\n        sb.append(". ");\n      }\n    }\n    sb.append(name.substring(last + 1));\n    return sb.toString();\n  }\n  public static void main(String[] args) {\n    Scanner in = new Scanner(System.in);\n    Initials p = new Initials(in.nextLine());\n    System.out.println(p.shortForm());\n  }\n}\n```'),
];

export default questions;
