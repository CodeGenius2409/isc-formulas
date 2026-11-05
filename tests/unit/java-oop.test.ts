// Inheritance, interfaces and the rest of the object-oriented syllabus, each with output that was worked out by hand.
// tests/unit/java-jdk.test.ts also runs these against a real JDK where one is installed.
import { describe, expect, it } from 'vitest';
import { runProgram } from '../../src/java/trace';
import { OOP_PROGRAMS, OOP_REJECTED } from './java-oop-programs';

describe('object-oriented Java in the tracer', () => {
  for (const program of OOP_PROGRAMS) {
    it(program.name, () => {
      const result = runProgram(program.code);
      expect(result.error).toBeNull();
      expect(result.output.replace(/\r\n/g, '\n')).toBe(program.expected);
    });
  }
});

describe('what javac would refuse is refused, with a clear reason', () => {
  for (const program of OOP_REJECTED) {
    it(program.name, () => {
      const result = runProgram(program.code);
      expect(result.error, 'it should not have run').not.toBeNull();
      expect(result.error!.message).toMatch(program.message);
    });
  }
});

describe('what the tracer can\'t do, it says so', () => {
  const stops = (code: string) => runProgram(code).error?.message ?? '';
  it('default methods in an interface', () => expect(stops('interface A { default int f() { return 1; } } class T { public static void main(String[] a) { } }')).toMatch(/default methods/i));
  it('nested classes', () => expect(stops('class T { class B { } public static void main(String[] a) { } }')).toMatch(/nested/i));
  it('anonymous classes', () => expect(stops('interface A { void f(); } class T { public static void main(String[] a) { A x = new A() { public void f() { } }; } }')).toMatch(/anonymous/i));
  it('extending a library class', () => expect(stops('class T extends Thread { public static void main(String[] a) { } }')).toMatch(/library class/i));
  it('generics', () => expect(stops('class T<K> { public static void main(String[] a) { } }')).toMatch(/generic/i));
  it('enums', () => expect(stops('enum E { A, B } class T { public static void main(String[] a) { } }')).toMatch(/enum/i));
});

describe('the views show what is happening', () => {
  const code = `abstract class Shape {
  protected String name;
  Shape(String n) {
    name = n;
  }
  abstract double area();
  void show() {
    System.out.println(name + " " + area());
  }
}
class Square extends Shape {
  private double side;
  Square(double s) {
    super("square");
    side = s;
  }
  double area() {
    return side * side;
  }
}
class Main {
  public static void main(String[] args) {
    Shape s = new Square(2);
    s.show();
  }
}`;
  const result = runProgram(code);
  const names = result.steps.flatMap((step) => step.frames.map((f) => f.method));

  it('the call stack names the class whose method is running, and what it runs on', () => {
    expect(result.error).toBeNull();
    expect(names).toContain('Main.main([])');
    expect(names).toContain('new Square(2)');
    expect(names).toContain('Shape("square"), making a Square');
    expect(names).toContain('Shape.show() on a Square');
    expect(names).toContain('Square.area()');
  });

  it('an object shows its runtime class and its inherited fields', () => {
    const last = result.steps.filter((step) => step.frames.length === 1).at(-1)!;
    const s = last.frames[0].vars.find((v) => v.name === 's')!;
    expect(s.type).toBe('Shape');
    expect(s.value).toBe('Square{name="square", side=2.0}');
  });

  it('this shows inherited fields too', () => {
    const inside = result.steps.find((step) => step.frames.at(-1)?.method === 'Square.area()')!;
    expect(inside.frames.at(-1)!.vars.map((v) => v.name)).toEqual(['this.name', 'this.side']);
  });
});
