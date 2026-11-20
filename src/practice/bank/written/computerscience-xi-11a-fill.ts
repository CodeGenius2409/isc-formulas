// Written by hand: input with Scanner and StringTokenizer, three of each type the subtopic lacked. Places are at(unit, topic)(marks, difficulty).
// Assertion–reason answers: 1 both true and R explains, 2 both true but R doesn't explain, 3 A true and R false, 4 A false and R true.
// The model programs read what the tracer gives them, “5 3 1 2 3 4 5 6 7 8 9” on one line, and run there.
import { at, kit, type BankDef } from '../define';

const { predict, odd, long, tell, match, reason, short, ar, program } = kit('computerscience', 'XI');
const S = at(11, 'a');

const code = (lines: string[]) => '```\n' + lines.join('\n') + '\n```';

const questions: BankDef[] = [
  predict(S(2, 1), 'The user types “  12   apples” and a program calls sc.next() twice. Predict what each call returns.', 'The first returns "12", and the second returns "apples".', 'next() skips any whitespace before a token, then reads up to the next whitespace.'),
  predict(S(2, 2), 'Predict what new StringTokenizer("a,b,,c", ",").countTokens() returns, and why.', 'It returns 3: the tokens are a, b and c.', 'Two delimiters next to each other are treated as one break, so no empty token is made between them.'),
  predict(S(2, 1), 'The user types 7 when a program calls sc.nextDouble(). Predict what is returned.', 'The double 7.0.', 'A whole number is a valid double, so it is read and widened; no exception is thrown.'),

  odd(S(2, 1), ['nextInt()', 'nextDouble()', 'nextLine()', 'nextToken()'], 'nextToken()', 'It is a method of StringTokenizer; the others are Scanner methods.'),
  odd(S(2, 1), ['a space', 'a tab', 'a newline', 'a comma'], 'a comma', 'It isn’t whitespace, so by default it doesn’t separate tokens; the others do.'),
  odd(S(2, 2), ['hasNextInt()', 'hasMoreTokens()', 'hasNext()', 'nextInt()'], 'nextInt()', 'It reads a value; the others only test whether there is something to read, returning a boolean.'),

  long(S(5, 2), 'The user types two lines: “10 20” and then “hello world”. A program runs:\nint a = sc.nextInt();\nint b = sc.nextInt();\nString s = sc.nextLine();\nString t = sc.nextLine();\n(a) What are a and b? [1]\n(b) What is s, and why? [2]\n(c) What is t? [1]\n(d) How can the program get “hello world” into s? [1]', '(a) a = 10 and b = 20.', '(b) s is the empty string "".', '(b) nextInt() leaves the newline after 20 unread, so nextLine() reads only what is left of that line, which is nothing.', '(c) t = "hello world".', '(d) Call sc.nextLine() once after the second nextInt(), to use up the rest of the first line, before reading s.'),
  long(S(5, 2), 'String text = "red; green;blue ; ;yellow";\n(a) How many tokens does new StringTokenizer(text, ";") give? [1]\n(b) List them, showing any spaces. [2]\n(c) How many tokens does new StringTokenizer(text, "; ") give? [1]\n(d) Which is the third token in (c)? [1]', '(a) 5.', '(b) "red", " green", "blue ".', '(b) " " and "yellow": the spaces stay, as only ; is a delimiter.', '(c) 4, as spaces are now delimiters too: red, green, blue and yellow.', '(d) blue.'),
  long(S(5, 3), 'Answer each part on exceptions in input.\n(a) What is an exception? [1]\n(b) Name the exception thrown when nextInt() is given “twelve”, and when nextToken() is called with no tokens left. [2]\n(c) Write a few lines that keep asking until the user types a whole number, without letting an exception stop the program. [2]', '(a) An event while a program runs that stops its normal flow, such as bad input, which the program can catch and handle.', '(b) nextInt() with “twelve”: InputMismatchException.', '(b) nextToken() with none left: NoSuchElementException.', '(c) while (!sc.hasNextInt()) { System.out.println("Enter a whole number"); sc.next(); }', '(c) int n = sc.nextInt(); — the loop throws away each bad token, so nextInt() is called only when a whole number is waiting.'),

  tell(S(2, 1), 'Distinguish between next() and nextLine() of the Scanner class.', 'next() reads one token, skipping whitespace before it and stopping at the whitespace after it.', 'nextLine() reads everything left on the current line, spaces and all, and uses up the newline.'),
  tell(S(2, 2), 'Distinguish between the Scanner and StringTokenizer classes.', 'Scanner reads from an input stream such as the keyboard, and can turn tokens into int, double and other types.', 'StringTokenizer only splits a String that is already in the program into String tokens, using delimiters chosen by the program.'),
  tell(S(2, 2), 'Distinguish between IOException and InputMismatchException.', 'IOException is a checked exception, from a failure in reading or writing, such as a missing file; it must be caught or declared with throws.', 'InputMismatchException is unchecked, thrown by Scanner when a token isn’t of the type asked for; it need not be caught or declared.'),

  match(S(4, 1), [['nextInt()', 'reads the next token as an int'], ['nextDouble()', 'reads the next token as a double'], ['next()', 'reads the next token as a String'], ['nextLine()', 'reads the rest of the current line']]),
  match(S(4, 2), [['hasMoreTokens()', 'tells whether a StringTokenizer has another token'], ['nextToken()', 'returns the next token of a StringTokenizer'], ['countTokens()', 'tells how many tokens are left'], ['hasNextInt()', 'tells whether the next Scanner token is a whole number']]),
  match(S(4, 2), [['InputMismatchException', 'nextInt() given text that isn’t a whole number'], ['NoSuchElementException', 'asking for a token when none are left'], ['IOException', 'a failure in reading or writing a file'], ['NumberFormatException', 'Integer.parseInt("12a")']]),

  reason(S(2, 1), 'Give a reason: a program should test hasNextInt() before calling nextInt() on what the user types.', 'If the next token isn’t a whole number, nextInt() throws InputMismatchException and the program stops.', 'Testing first lets the program warn the user and ask again instead.'),
  reason(S(2, 1), 'Give a reason: the tokens from a StringTokenizer must be passed to Integer.parseInt() before they can be added as numbers.', 'nextToken() returns a String, even when it holds digits.', 'Using + on two Strings joins them, so "4" + "5" gives "45", not 9.'),

  short(S(2, 1), 'Write the import and the statement needed to create a Scanner that reads from the keyboard.', 'import java.util.Scanner;', 'Scanner sc = new Scanner(System.in);'),
  short(S(2, 1), 'What is a token? What separates tokens by default in a Scanner and in a StringTokenizer?', 'A token is a group of characters read as one unit, such as a word or a number.', 'By default both use whitespace: spaces, tabs and newlines.'),

  ar(S(1, 1), 'next() can’t read “New Delhi” as a single String.', 'next() stops reading at whitespace.', 1, 'next() returns only "New"; nextLine() is needed for the whole name.'),
  ar(S(1, 2), 'StringTokenizer returns an empty token between two delimiters next to each other.', 'Delimiters next to each other are treated as a single break.', 4, 'No empty tokens are returned, because of what R says.'),
  ar(S(1, 1), 'Integer.parseInt("42") returns the int 42.', 'Scanner is in the package java.util.', 2, 'Both are true, but parseInt belongs to the Integer class and has nothing to do with Scanner’s package.'),

  program(S(6, 1), 'Write a program that reads a sentence from the keyboard and, using a StringTokenizer, prints each word on its own line with its number of letters, and then the number of words.', [['Reads the sentence with a Scanner’s nextLine().', 1], ['Makes a StringTokenizer of it.', 1], ['Loops while hasMoreTokens(), taking each word with nextToken().', 2], ['Prints each word with its length.', 1], ['Counts the words and prints the count.', 1]], code([
    'import java.util.*;',
    '',
    'class WordLengths {',
    '  public static void main(String[] args) {',
    '    Scanner in = new Scanner(System.in);',
    '    System.out.println("Enter a sentence:");',
    '    String line = in.nextLine();',
    '    StringTokenizer st = new StringTokenizer(line);',
    '    int count = 0;',
    '    while (st.hasMoreTokens()) {',
    '      String word = st.nextToken();',
    '      System.out.println(word + " " + word.length());',
    '      count++;',
    '    }',
    '    System.out.println("Words: " + count);',
    '  }',
    '}',
  ])),
  program(S(6, 1), 'Write a program that reads a whole number n, then n decimal numbers, using a Scanner, and prints their sum, their average and the largest of them.', [['Reads n with nextInt().', 1], ['A loop reads n numbers with nextDouble().', 2], ['Keeps a running sum.', 1], ['Keeps the largest, starting from the first number.', 1], ['Prints the sum, the average and the largest.', 1]], code([
    'import java.util.Scanner;',
    '',
    'class SumAverage {',
    '  public static void main(String[] args) {',
    '    Scanner in = new Scanner(System.in);',
    '    System.out.println("How many numbers?");',
    '    int n = in.nextInt();',
    '    double sum = 0, largest = 0;',
    '    for (int i = 1; i <= n; i++) {',
    '      double x = in.nextDouble();',
    '      if (i == 1 || x > largest) largest = x;',
    '      sum += x;',
    '    }',
    '    System.out.println("Sum = " + sum);',
    '    System.out.println("Average = " + sum / n);',
    '    System.out.println("Largest = " + largest);',
    '  }',
    '}',
  ])),
  program(S(6, 2), 'Write a program that reads a line of whole numbers separated by commas, such as “12, 7, 30”, splits it with a StringTokenizer, and prints the sum of the numbers and how many of them are even.', [['Reads the line with nextLine().', 1], ['Makes a StringTokenizer with comma and space as delimiters.', 1], ['Turns each token into an int with Integer.parseInt().', 2], ['Adds each to the sum, and counts the even ones.', 1], ['Prints the sum and the count.', 1]], code([
    'import java.util.*;',
    '',
    'class CommaNumbers {',
    '  public static void main(String[] args) {',
    '    Scanner in = new Scanner(System.in);',
    '    System.out.println("Enter numbers separated by commas:");',
    '    String line = in.nextLine();',
    '    StringTokenizer st = new StringTokenizer(line, ", ");',
    '    int sum = 0, even = 0;',
    '    while (st.hasMoreTokens()) {',
    '      int x = Integer.parseInt(st.nextToken());',
    '      sum += x;',
    '      if (x % 2 == 0) even++;',
    '    }',
    '    System.out.println("Sum = " + sum);',
    '    System.out.println("Even numbers: " + even);',
    '  }',
    '}',
  ])),
];

export default questions;
