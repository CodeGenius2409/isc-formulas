// Programs for the object-oriented part of the tracer. The expected output is what Java prints.
export interface OopProgram {
  name: string;
  code: string;
  expected: string;
}

export const OOP_PROGRAMS: OopProgram[] = [
  {
    name: 'single inheritance, with an inherited field and method',
    code: `class Animal {
  String name = "animal";
  void speak() {
    System.out.println(name + " makes a sound");
  }
}
class Dog extends Animal {
  void fetch() {
    System.out.println(name + " fetches");
  }
}
class Main {
  public static void main(String[] args) {
    Dog d = new Dog();
    d.speak();
    d.fetch();
  }
}`,
    expected: 'animal makes a sound\nanimal fetches\n',
  },
  {
    name: 'overriding, and dynamic dispatch through a parent type',
    code: `class Animal {
  String sound() {
    return "...";
  }
  void speak() {
    System.out.println(sound());
  }
}
class Dog extends Animal {
  String sound() {
    return "Woof";
  }
}
class Cat extends Animal {
  String sound() {
    return "Meow";
  }
}
class Main {
  public static void main(String[] args) {
    Animal[] all = { new Animal(), new Dog(), new Cat() };
    for (int i = 0; i < all.length; i++) {
      all[i].speak();
    }
  }
}`,
    expected: '...\nWoof\nMeow\n',
  },
  {
    name: 'multilevel inheritance, with a chain of super calls',
    code: `class A {
  A() {
    System.out.println("A made");
  }
  String who() {
    return "A";
  }
}
class B extends A {
  B() {
    System.out.println("B made");
  }
  String who() {
    return "B then " + super.who();
  }
}
class C extends B {
  C() {
    super();
    System.out.println("C made");
  }
  String who() {
    return "C then " + super.who();
  }
}
class Main {
  public static void main(String[] args) {
    A x = new C();
    System.out.println(x.who());
  }
}`,
    expected: 'A made\nB made\nC made\nC then B then A\n',
  },
  {
    name: 'super with arguments, and this(...) chaining',
    code: `class Person {
  protected String name;
  protected int age;
  Person(String n, int a) {
    name = n;
    age = a;
  }
  Person(String n) {
    this(n, 18);
  }
  public String toString() {
    return name + ", " + age;
  }
}
class Student extends Person {
  private int marks;
  Student(String n, int m) {
    super(n);
    marks = m;
  }
  public String toString() {
    return super.toString() + ", " + marks;
  }
}
class Main {
  public static void main(String[] args) {
    Student s = new Student("Asha", 90);
    System.out.println(s);
    System.out.println("Record: " + s);
  }
}`,
    expected: 'Asha, 18, 90\nRecord: Asha, 18, 90\n',
  },
  {
    name: 'field initializers run after super(), and a parent constructor sees overridden methods',
    code: `class Base {
  int x = 5;
  Base() {
    show();
  }
  void show() {
    System.out.println("Base " + x);
  }
}
class Child extends Base {
  int y = 7;
  void show() {
    System.out.println("Child " + y);
  }
}
class Main {
  public static void main(String[] args) {
    Child c = new Child();
    c.show();
  }
}`,
    expected: 'Child 0\nChild 7\n',
  },
  {
    name: 'an abstract class and abstract methods',
    code: `abstract class Shape {
  abstract double area();
  void describe() {
    System.out.println("Area is " + area());
  }
}
class Rectangle extends Shape {
  double w, h;
  Rectangle(double w, double h) {
    this.w = w;
    this.h = h;
  }
  double area() {
    return w * h;
  }
}
class Square extends Rectangle {
  Square(double s) {
    super(s, s);
  }
}
class Main {
  public static void main(String[] args) {
    Shape a = new Rectangle(2, 3);
    Shape b = new Square(4);
    a.describe();
    b.describe();
  }
}`,
    expected: 'Area is 6.0\nArea is 16.0\n',
  },
  {
    name: 'an interface, with a class implementing two of them',
    code: `interface Printable {
  void print();
}
interface Scorable {
  int MAX = 100;
  int score();
}
class Test implements Printable, Scorable {
  public void print() {
    System.out.println("Score " + score() + " of " + MAX);
  }
  public int score() {
    return 73;
  }
}
class Main {
  public static void main(String[] args) {
    Test t = new Test();
    Printable p = t;
    Scorable s = t;
    p.print();
    System.out.println(s.score());
    System.out.println(Scorable.MAX);
    System.out.println(Test.MAX);
  }
}`,
    expected: 'Score 73 of 100\n73\n100\n100\n',
  },
  {
    name: 'an interface extending another, implemented through a parent class',
    code: `interface Named {
  String name();
}
interface Greeter extends Named {
  String greet();
}
abstract class Base implements Greeter {
  public String greet() {
    return "Hello " + name();
  }
}
class Friend extends Base {
  public String name() {
    return "Ravi";
  }
}
class Main {
  public static void main(String[] args) {
    Greeter g = new Friend();
    System.out.println(g.greet());
    Named n = g;
    System.out.println(n.name());
  }
}`,
    expected: 'Hello Ravi\nRavi\n',
  },
  {
    name: 'instanceof, and casting between class types',
    code: `class Shape {
}
class Circle extends Shape {
  double r = 2;
  double twice() {
    return r * 2;
  }
}
class Square extends Shape {
}
class Main {
  public static void main(String[] args) {
    Shape[] all = { new Circle(), new Square(), null };
    for (int i = 0; i < all.length; i++) {
      Shape s = all[i];
      System.out.println((s instanceof Shape) + " " + (s instanceof Circle));
      if (s instanceof Circle) {
        Circle c = (Circle) s;
        System.out.println(c.twice());
        System.out.println(((Circle) s).r);
      }
    }
    Object o = new Circle();
    System.out.println(o instanceof Shape);
    String text = "hi";
    Object t = text;
    System.out.println(t instanceof String);
  }
}`,
    expected: 'true true\n4.0\n2.0\ntrue false\nfalse false\ntrue\ntrue\n',
  },
  {
    name: 'a field hidden by a subclass: the type as written decides, and super reaches the parent\'s',
    code: `class P {
  int v = 1;
  int get() {
    return v;
  }
}
class Q extends P {
  int v = 2;
  int get() {
    return v;
  }
  int parent() {
    return super.v;
  }
  int viaSuper() {
    return super.get();
  }
}
class Main {
  public static void main(String[] args) {
    Q q = new Q();
    P p = q;
    System.out.println(q.v);
    System.out.println(p.v);
    System.out.println(p.get());
    System.out.println(q.parent());
    System.out.println(q.viaSuper());
    System.out.println(((P) q).v);
  }
}`,
    expected: '2\n1\n2\n1\n1\n1\n',
  },
  {
    name: 'overloads are chosen by the type as written, and overrides by the runtime class',
    code: `class A {
  String f(A x) {
    return "A.f(A)";
  }
  String f(B x) {
    return "A.f(B)";
  }
}
class B extends A {
  String f(A x) {
    return "B.f(A)";
  }
}
class Main {
  public static void main(String[] args) {
    A a = new A();
    A ab = new B();
    B b = new B();
    System.out.println(a.f(a));
    System.out.println(a.f(ab));
    System.out.println(a.f(b));
    System.out.println(ab.f(ab));
    System.out.println(ab.f(b));
    System.out.println(b.f(b));
  }
}`,
    expected: 'A.f(A)\nA.f(A)\nA.f(B)\nB.f(A)\nA.f(B)\nA.f(B)\n',
  },
  {
    name: 'a private method isn\'t overridden, and a static method goes by the type as written',
    code: `class A {
  private String hidden() {
    return "A hidden";
  }
  String show() {
    return hidden();
  }
  static String kind() {
    return "A kind";
  }
}
class B extends A {
  String hidden() {
    return "B hidden";
  }
  static String kind() {
    return "B kind";
  }
}
class Main {
  public static void main(String[] args) {
    A x = new B();
    System.out.println(x.show());
    System.out.println(A.kind());
    System.out.println(B.kind());
    System.out.println(x.kind());
  }
}`,
    expected: 'A hidden\nA kind\nB kind\nA kind\n',
  },
  {
    name: 'toString in a parent is used for a subclass, equals can be overridden, and static fields are shared',
    code: `class Item {
  static int count = 0;
  int id;
  Item() {
    count++;
    id = count;
  }
  public String toString() {
    return "Item " + id;
  }
  public boolean equals(Object o) {
    return o instanceof Item && ((Item) o).id == id;
  }
}
class Book extends Item {
}
class Main {
  public static void main(String[] args) {
    Item a = new Item();
    Book b = new Book();
    System.out.println(a);
    System.out.println(b);
    System.out.println(a.equals(b));
    System.out.println(a.equals(a));
    System.out.println(Book.count);
    Object o = b;
    System.out.println(o.toString());
    System.out.println(b.getClass().getName());
  }
}`,
    expected: 'Item 1\nItem 2\nfalse\ntrue\n2\nItem 2\nBook\n',
  },
  {
    name: 'polymorphism in parameters and return values',
    code: `abstract class Account {
  protected double balance;
  Account(double b) {
    balance = b;
  }
  abstract double interest();
  Account self() {
    return this;
  }
}
class Savings extends Account {
  Savings(double b) {
    super(b);
  }
  double interest() {
    return balance * 0.05;
  }
  Savings self() {
    return this;
  }
}
class Current extends Account {
  Current(double b) {
    super(b);
  }
  double interest() {
    return 0;
  }
}
class Main {
  static double total(Account[] list) {
    double sum = 0;
    for (Account a : list) {
      sum += a.interest();
    }
    return sum;
  }
  static Account open(boolean saver) {
    if (saver) {
      return new Savings(100);
    }
    return new Current(100);
  }
  public static void main(String[] args) {
    Account[] list = { open(true), open(false), new Savings(200) };
    System.out.println(total(list));
    System.out.println(list[0].self().interest());
  }
}`,
    expected: '15.0\n5.0\n',
  },
  {
    name: 'protected and inherited members used directly, and this passed along',
    code: `class Counter {
  protected int n;
  protected void up() {
    n++;
  }
  Counter me() {
    return this;
  }
}
class Twice extends Counter {
  protected void up() {
    super.up();
    this.up2();
  }
  private void up2() {
    n = n + 1;
  }
}
class Main {
  public static void main(String[] args) {
    Counter c = new Twice();
    c.up();
    c.me().up();
    System.out.println(c.n);
  }
}`,
    expected: '4\n',
  },
];

export const OOP_REJECTED: { name: string; code: string; message: RegExp }[] = [
  { name: 'creating an abstract class', code: 'abstract class A { } class T { public static void main(String[] a) { A x = new A(); } }', message: /A is abstract/ },
  { name: 'creating an interface', code: 'interface A { } class T { public static void main(String[] a) { A x = new A(); } }', message: /A is an interface/ },
  { name: 'leaving an abstract method undefined', code: 'abstract class A { abstract int f(); } class B extends A { } class T { public static void main(String[] a) { } }', message: /B must define f\(\)/ },
  { name: 'leaving an interface method undefined', code: 'interface A { int f(); } class B implements A { } class T { public static void main(String[] a) { } }', message: /B must define f\(\)/ },
  { name: 'an abstract method in a class that isn\'t abstract', code: 'class A { abstract int f(); } class T { public static void main(String[] a) { } }', message: /must be declared abstract/ },
  { name: 'an abstract method with a body', code: 'abstract class A { abstract int f() { return 1; } } class T { public static void main(String[] a) { } }', message: /cannot have a body/ },
  { name: 'a method with no body', code: 'class A { int f(); } class T { public static void main(String[] a) { } }', message: /has no body/ },
  { name: 'an interface method that isn\'t public', code: 'interface A { int f(); } class B implements A { int f() { return 1; } } class T { public static void main(String[] a) { } }', message: /must be declared public/ },
  { name: 'overriding with weaker access', code: 'class A { public int f() { return 1; } } class B extends A { int f() { return 2; } } class T { public static void main(String[] a) { } }', message: /less visible/ },
  { name: 'overriding with a different return type', code: 'class A { int f() { return 1; } } class B extends A { double f() { return 2; } } class T { public static void main(String[] a) { } }', message: /must return int/ },
  { name: 'overriding a final method', code: 'class A { final int f() { return 1; } } class B extends A { int f() { return 2; } } class T { public static void main(String[] a) { } }', message: /final method/ },
  { name: 'extending a final class', code: 'final class A { } class B extends A { } class T { public static void main(String[] a) { } }', message: /A is final/ },
  { name: 'extending two classes', code: 'class A { } class B { } class C extends A, B { } class T { public static void main(String[] a) { } }', message: /only one class/ },
  { name: 'extending an interface from a class', code: 'interface A { } class B extends A { } class T { public static void main(String[] a) { } }', message: /must use implements/ },
  { name: 'implementing a class', code: 'class A { } class B implements A { } class T { public static void main(String[] a) { } }', message: /must use extends/ },
  { name: 'a class inheriting from itself', code: 'class A extends B { } class B extends A { } class T { public static void main(String[] a) { } }', message: /inherit from itself/ },
  { name: 'no suitable parent constructor', code: 'class A { A(int x) { } } class B extends A { B() { } } class T { public static void main(String[] a) { } }', message: /must call super/ },
  { name: 'super(...) anywhere but first', code: 'class A { } class B extends A { B() { int x = 1; super(); } } class T { public static void main(String[] a) { new B(); } }', message: /first statement/ },
  { name: 'a private field in the parent', code: 'class A { private int x; } class B extends A { int f() { return x; } } class T { public static void main(String[] a) { System.out.println(new B().f()); } }', message: /private access in A/ },
  { name: 'a private field from outside', code: 'class A { private int x; } class T { public static void main(String[] a) { A o = new A(); System.out.println(o.x); } }', message: /private access in A/ },
  { name: 'a private method from outside', code: 'class A { private int f() { return 1; } } class T { public static void main(String[] a) { A o = new A(); System.out.println(o.f()); } }', message: /private access in A/ },
  { name: 'a method the declared type doesn\'t have', code: 'class A { } class B extends A { int f() { return 1; } } class T { public static void main(String[] a) { A o = new B(); System.out.println(o.f()); } }', message: /A has no method called f.*cast it first/ },
  { name: 'a field the declared type doesn\'t have', code: 'class A { } class B extends A { int x; } class T { public static void main(String[] a) { A o = new B(); System.out.println(o.x); } }', message: /A has no variable "x".*cast it first/ },
  { name: 'a method called on Object', code: 'class B { int f() { return 1; } } class T { public static void main(String[] a) { Object o = new B(); System.out.println(o.f()); } }', message: /Object has no method/ },
  { name: 'a parent assigned to a child without a cast', code: 'class A { } class B extends A { } class T { public static void main(String[] a) { A x = new B(); B y = x; } }', message: /cast is needed/ },
  { name: 'a bad cast at run time', code: 'class A { } class B extends A { } class C extends A { } class T { public static void main(String[] a) { A x = new C(); B y = (B) x; } }', message: /ClassCastException/ },
  { name: 'a cast between unrelated classes', code: 'class A { } class B { } class T { public static void main(String[] a) { A x = new A(); B y = (B) x; } }', message: /unrelated classes/ },
  { name: 'instanceof between unrelated classes', code: 'class A { } class B { } class T { public static void main(String[] a) { A x = new A(); System.out.println(x instanceof B); } }', message: /unrelated classes/ },
  { name: 'calling an abstract method through super', code: 'abstract class A { abstract int f(); } class B extends A { int f() { return super.f(); } } class T { public static void main(String[] a) { System.out.println(new B().f()); } }', message: /abstract in A/ },
];
