// Sample programs from typical ISC topics. tests/unit/java.test.ts checks each one
// against its expected output.

export interface Sample {
  id: string;
  title: string;
  topic: string;
  code: string;
  input?: string;
  /** What the program prints, for the tests. */
  expected: string;
}

export const SAMPLES: Sample[] = [
  {
    id: 'series-sum',
    title: 'Sum of a series: 1 + 2 + ... + n',
    topic: 'Series',
    code: `class SumSeries {
    public static void main(String[] args) {
        int n = 5;
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum = sum + i;
        }
        System.out.println("Sum = " + sum);
    }
}`,
    expected: 'Sum = 15\n',
  },
  {
    id: 'series-fraction',
    title: 'Series: 1/1! + 2/2! + ... + n/n!',
    topic: 'Series',
    code: `class FractionSeries {
    public static void main(String[] args) {
        int n = 4;
        double sum = 0.0;
        long fact = 1;
        for (int i = 1; i <= n; i++) {
            fact = fact * i;
            sum = sum + (double) i / fact;
        }
        System.out.println("Sum = " + sum);
    }
}`,
    expected: 'Sum = 2.6666666666666665\n',
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci series',
    topic: 'Series',
    code: `class Fibonacci {
    public static void main(String[] args) {
        int n = 8;
        int a = 0, b = 1;
        for (int i = 1; i <= n; i++) {
            System.out.print(a + " ");
            int c = a + b;
            a = b;
            b = c;
        }
        System.out.println();
    }
}`,
    expected: '0 1 1 2 3 5 8 13 \n',
  },
  {
    id: 'prime',
    title: 'Prime number check',
    topic: 'Number programs',
    code: `class PrimeCheck {
    static boolean isPrime(int n) {
        if (n < 2) {
            return false;
        }
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        int[] values = {2, 15, 17, 1};
        for (int v : values) {
            System.out.println(v + " prime? " + isPrime(v));
        }
    }
}`,
    expected: '2 prime? true\n15 prime? false\n17 prime? true\n1 prime? false\n',
  },
  {
    id: 'palindrome-number',
    title: 'Palindrome number',
    topic: 'Number programs',
    code: `class PalindromeNumber {
    public static void main(String[] args) {
        int n = 1221;
        int original = n;
        int reversed = 0;
        while (n > 0) {
            int digit = n % 10;
            reversed = reversed * 10 + digit;
            n = n / 10;
        }
        if (reversed == original) {
            System.out.println(original + " is a palindrome");
        } else {
            System.out.println(original + " is not a palindrome");
        }
    }
}`,
    expected: '1221 is a palindrome\n',
  },
  {
    id: 'armstrong',
    title: 'Armstrong number',
    topic: 'Number programs',
    code: `class Armstrong {
    public static void main(String[] args) {
        int n = 153;
        int temp = n;
        int sum = 0;
        do {
            int d = temp % 10;
            sum += d * d * d;
            temp /= 10;
        } while (temp != 0);
        System.out.println(sum == n ? "Armstrong" : "Not Armstrong");
    }
}`,
    expected: 'Armstrong\n',
  },
  {
    id: 'digits-input',
    title: 'Sum of digits, with Scanner',
    topic: 'Number programs',
    code: `import java.util.Scanner;

class SumOfDigits {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        int sum = 0;
        while (n != 0) {
            sum += n % 10;
            n /= 10;
        }
        System.out.println("Sum of digits = " + sum);
    }
}`,
    input: '4728',
    expected: 'Enter a number: Sum of digits = 21\n',
  },
  {
    id: 'binary',
    title: 'Decimal to binary',
    topic: 'Number programs',
    code: `class DecimalToBinary {
    public static void main(String[] args) {
        int n = 25;
        String binary = "";
        while (n > 0) {
            binary = (n % 2) + binary;
            n = n / 2;
        }
        System.out.println(binary);
    }
}`,
    expected: '11001\n',
  },
  {
    id: 'grade-switch',
    title: 'Grade with switch',
    topic: 'Decisions',
    code: `class Grade {
    public static void main(String[] args) {
        int marks = 72;
        char grade;
        switch (marks / 10) {
            case 10:
            case 9:
                grade = 'A';
                break;
            case 8:
            case 7:
                grade = 'B';
                break;
            case 6:
                grade = 'C';
                break;
            default:
                grade = 'F';
        }
        System.out.println("Grade: " + grade);
    }
}`,
    expected: 'Grade: B\n',
  },
  {
    id: 'vowels',
    title: 'Count vowels in a string',
    topic: 'String handling',
    code: `class CountVowels {
    public static void main(String[] args) {
        String s = "Computer Science";
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = Character.toLowerCase(s.charAt(i));
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                count++;
            }
        }
        System.out.println("Vowels: " + count);
    }
}`,
    expected: 'Vowels: 6\n',
  },
  {
    id: 'reverse-string',
    title: 'Reverse a string and check palindrome',
    topic: 'String handling',
    code: `class ReverseString {
    public static void main(String[] args) {
        String word = "MADAM";
        String reversed = "";
        for (int i = word.length() - 1; i >= 0; i--) {
            reversed = reversed + word.charAt(i);
        }
        System.out.println(reversed);
        System.out.println(word.equals(reversed));
    }
}`,
    expected: 'MADAM\ntrue\n',
  },
  {
    id: 'capitalise',
    title: 'Capitalise each word',
    topic: 'String handling',
    code: `class Capitalise {
    public static void main(String[] args) {
        String line = "the quick brown fox";
        String[] words = line.split(" ");
        StringBuffer result = new StringBuffer();
        for (int i = 0; i < words.length; i++) {
            String w = words[i];
            result.append(Character.toUpperCase(w.charAt(0)));
            result.append(w.substring(1));
            if (i < words.length - 1) {
                result.append(" ");
            }
        }
        System.out.println(result);
    }
}`,
    expected: 'The Quick Brown Fox\n',
  },
  {
    id: 'bubble-sort',
    title: 'Bubble sort',
    topic: 'Arrays',
    code: `class BubbleSort {
    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1};
        int n = a.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (a[j] > a[j + 1]) {
                    int t = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = t;
                }
            }
        }
        for (int x : a) {
            System.out.print(x + " ");
        }
        System.out.println();
    }
}`,
    expected: '1 2 5 9 \n',
  },
  {
    id: 'selection-sort',
    title: 'Selection sort',
    topic: 'Arrays',
    code: `class SelectionSort {
    public static void main(String[] args) {
        int[] a = {29, 10, 14, 37, 13};
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++) {
                if (a[j] < a[min]) {
                    min = j;
                }
            }
            int t = a[min];
            a[min] = a[i];
            a[i] = t;
        }
        System.out.println(java.util.Arrays.toString(a));
    }
}`,
    expected: '[10, 13, 14, 29, 37]\n',
  },
  {
    id: 'binary-search',
    title: 'Binary search',
    topic: 'Arrays',
    code: `class BinarySearch {
    public static void main(String[] args) {
        int[] a = {3, 8, 15, 23, 42, 57};
        int key = 23;
        int low = 0, high = a.length - 1;
        int pos = -1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (a[mid] == key) {
                pos = mid;
                break;
            } else if (a[mid] < key) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        System.out.println("Found at index " + pos);
    }
}`,
    expected: 'Found at index 3\n',
  },
  {
    id: 'matrix',
    title: 'Transpose of a 2D array',
    topic: 'Arrays',
    code: `class Transpose {
    public static void main(String[] args) {
        int[][] m = {{1, 2, 3}, {4, 5, 6}};
        int[][] t = new int[3][2];
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 3; j++) {
                t[j][i] = m[i][j];
            }
        }
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 2; j++) {
                System.out.print(t[i][j] + " ");
            }
            System.out.println();
        }
    }
}`,
    expected: '1 4 \n2 5 \n3 6 \n',
  },
  {
    id: 'factorial',
    title: 'Factorial by recursion',
    topic: 'Recursion',
    code: `class Factorial {
    static long fact(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * fact(n - 1);
    }

    public static void main(String[] args) {
        System.out.println("5! = " + fact(5));
        System.out.println("20! = " + fact(20));
    }
}`,
    expected: '5! = 120\n20! = 2432902008176640000\n',
  },
  {
    id: 'gcd',
    title: 'GCD by recursion',
    topic: 'Recursion',
    code: `class Gcd {
    static int gcd(int a, int b) {
        if (b == 0) {
            return a;
        }
        return gcd(b, a % b);
    }

    public static void main(String[] args) {
        System.out.println(gcd(48, 18));
    }
}`,
    expected: '6\n',
  },
  {
    id: 'hanoi',
    title: 'Tower of Hanoi',
    topic: 'Recursion',
    code: `class Hanoi {
    static int moves = 0;

    static void solve(int n, char from, char to, char via) {
        if (n == 0) {
            return;
        }
        solve(n - 1, from, via, to);
        moves++;
        System.out.println("Move disc " + n + " from " + from + " to " + to);
        solve(n - 1, via, to, from);
    }

    public static void main(String[] args) {
        solve(2, 'A', 'C', 'B');
        System.out.println("Total moves: " + moves);
    }
}`,
    expected: 'Move disc 1 from A to B\nMove disc 2 from A to C\nMove disc 1 from B to C\nTotal moves: 3\n',
  },
  {
    id: 'class-student',
    title: 'A class with a constructor',
    topic: 'Classes and objects',
    code: `class Student {
    String name;
    int marks;

    Student(String n, int m) {
        name = n;
        marks = m;
    }

    boolean passed() {
        return marks >= 40;
    }

    void display() {
        System.out.println(name + ": " + marks + (passed() ? " (pass)" : " (fail)"));
    }
}

class School {
    public static void main(String[] args) {
        Student a = new Student("Asha", 78);
        Student b = new Student("Ravi", 35);
        a.display();
        b.display();
    }
}`,
    expected: 'Asha: 78 (pass)\nRavi: 35 (fail)\n',
  },
  {
    id: 'class-counter',
    title: 'Static and instance variables',
    topic: 'Classes and objects',
    code: `class Counter {
    static int created = 0;
    int value;

    Counter() {
        created++;
        value = 10;
    }

    void add(int amount) {
        this.value += amount;
    }

    public static void main(String[] args) {
        Counter c = new Counter();
        Counter d = new Counter();
        c.add(5);
        System.out.println(c.value + " " + d.value + " " + Counter.created);
    }
}`,
    expected: '15 10 2\n',
  },
];
