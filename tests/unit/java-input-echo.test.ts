// The Java tracer's console shows each line of input after the prompt it answers, as a terminal does.
import { describe, expect, it } from 'vitest';
import { runProgram } from '../../src/java/trace';

const prog = (body: string) => `import java.util.Scanner;
class P {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
${body}
    }
}`;

describe('input echo', () => {
  it('puts a line read by nextLine() after its prompt', () => {
    const run = runProgram(prog(`        System.out.print("Your name: ");
        String n = sc.nextLine();
        System.out.println("Hello, " + n);`), 'Asha');
    expect(run.error).toBeNull();
    expect(run.output).toBe('Your name: Hello, Asha\n');
    expect(run.echoes.map(({ at, text }) => ({ at, text }))).toEqual([{ at: 'Your name: '.length, text: 'Asha' }]);
  });

  it('echoes a line once, when its first token is read, not once per token', () => {
    const run = runProgram(prog(`        System.out.print("Two numbers: ");
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.print("Third: ");
        int c = sc.nextInt();
        System.out.println(a + b + c);`), '3 4\n5');
    expect(run.error).toBeNull();
    expect(run.echoes.map((e) => e.text)).toEqual(['3 4', '5']);
    expect(run.echoes[1].at).toBe('Two numbers: Third: '.length);
  });

  it('shows an echo only from the step after the read', () => {
    const run = runProgram(prog(`        System.out.print("n: ");
        int n = sc.nextInt();
        System.out.println(n * 2);`), '21');
    const [echo] = run.echoes;
    expect(echo.step).toBeGreaterThan(0);
    // Before the read, the prompt has been printed but nothing has been typed yet.
    expect(run.steps[echo.step - 1].outputLength).toBe(echo.at);
  });

  it('has no echoes when nothing is read', () => {
    expect(runProgram(prog('        System.out.println("hi");'), '1 2').echoes).toEqual([]);
  });

  it('in a hasNextInt() loop, echoes each line as the loop first reaches it', () => {
    const run = runProgram(prog(`        int s = 0;
        while (sc.hasNextInt()) { s += sc.nextInt(); }
        System.out.println("sum " + s);`), '1 2\n3\n');
    expect(run.output).toBe('sum 6\n');
    expect(run.echoes.map((e) => e.text)).toEqual(['1 2', '3']);
    expect(run.echoes[0].step).toBeLessThan(run.echoes[1].step);
  });

  it('keeps what was read when the Input box runs out, and still says why it stopped', () => {
    const run = runProgram(prog(`        System.out.print("a: ");
        int a = sc.nextInt();
        System.out.print("b: ");
        int b = sc.nextInt();`), '7');
    expect(run.error?.message).toContain('NoSuchElementException');
    expect(run.echoes.map(({ at, text }) => ({ at, text }))).toEqual([{ at: 'a: '.length, text: '7' }]);
  });

  it('shows blank lines skipped on the way to a number, as Enter pressed at the prompt', () => {
    const run = runProgram(prog(`        System.out.print("n: ");
        int n = sc.nextInt();
        System.out.println(n);`), '\n\n9\n');
    expect(run.echoes.map((e) => e.text)).toEqual(['', '', '9']);
  });

  it('works for BufferedReader, and drops the carriage return of Windows line endings', () => {
    const run = runProgram(`import java.io.*;
class P {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        System.out.print("name: ");
        System.out.println("hi " + br.readLine());
    }
}`, 'Ravi\r\n');
    expect(run.output).toBe('name: hi Ravi\n');
    expect(run.echoes.map(({ at, text }) => ({ at, text }))).toEqual([{ at: 'name: '.length, text: 'Ravi' }]);
  });
});
