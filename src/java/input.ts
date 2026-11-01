// What the program reads: the text in the Input box, for Scanner and BufferedReader.
import { bool, dbl, int, NULL, runtimeError, str, VOID, type JValue } from './values';

export class ProgramInput {
  private state: { text: string; pos: number };

  constructor(text: string) {
    this.state = { text, pos: 0 };
  }

  nextToken(line: number): string {
    const s = this.state;
    while (s.pos < s.text.length && /\s/.test(s.text[s.pos])) s.pos++;
    if (s.pos >= s.text.length) throw runtimeError('java.util.NoSuchElementException: the program asked for more input than the Input box holds. Add more values there.', line);
    const start = s.pos;
    while (s.pos < s.text.length && !/\s/.test(s.text[s.pos])) s.pos++;
    return s.text.slice(start, s.pos);
  }

  hasToken(): boolean {
    return /\S/.test(this.state.text.slice(this.state.pos));
  }

  nextLine(line: number): string {
    const s = this.state;
    if (s.pos > s.text.length || (s.pos === s.text.length && !s.text.endsWith('\n'))) {
      throw runtimeError('java.util.NoSuchElementException: the program asked for another line, but the Input box has run out.', line);
    }
    const end = s.text.indexOf('\n', s.pos);
    const out = end < 0 ? s.text.slice(s.pos) : s.text.slice(s.pos, end);
    s.pos = end < 0 ? s.text.length + 1 : end + 1;
    return out.replace(/\r$/, '');
  }

  readLine(line: number): JValue {
    const s = this.state;
    if (s.pos > s.text.length || (s.pos === s.text.length && !s.text.endsWith('\n'))) return NULL;
    return str(this.nextLine(line));
  }

  scanner(name: string, line: number): JValue {
    const parseWhole = (text: string, min: bigint, max: bigint) => {
      if (!/^[+-]?\d+$/.test(text) || BigInt(text) < min || BigInt(text) > max) throw runtimeError(`java.util.InputMismatchException: "${text}" in the Input box is not the whole number the program asked for.`, line);
      return text;
    };
    switch (name) {
      case 'next':
        return str(this.nextToken(line));
      case 'nextLine':
        return str(this.nextLine(line));
      case 'nextInt':
        return int(Number(parseWhole(this.nextToken(line), -2147483648n, 2147483647n)));
      case 'nextLong':
        return { t: 'long', v: BigInt(parseWhole(this.nextToken(line), -9223372036854775808n, 9223372036854775807n)) };
      case 'nextShort':
        return { t: 'short', v: Number(parseWhole(this.nextToken(line), -32768n, 32767n)) };
      case 'nextByte':
        return { t: 'byte', v: Number(parseWhole(this.nextToken(line), -128n, 127n)) };
      case 'nextDouble':
      case 'nextFloat': {
        const t = this.nextToken(line);
        const v = Number(t);
        if (Number.isNaN(v)) throw runtimeError(`java.util.InputMismatchException: "${t}" in the Input box is not the number the program asked for.`, line);
        return name === 'nextDouble' ? dbl(v) : { t: 'float', v: Math.fround(v) };
      }
      case 'nextBoolean': {
        const t = this.nextToken(line).toLowerCase();
        if (t !== 'true' && t !== 'false') throw runtimeError(`java.util.InputMismatchException: "${t}" is not true or false.`, line);
        return bool(t === 'true');
      }
      case 'hasNext':
        return bool(this.hasToken());
      case 'hasNextLine':
        return bool(this.state.pos < this.state.text.length);
      case 'hasNextInt': {
        const m = /^\s*([+-]?\d+)(\s|$)/.exec(this.state.text.slice(this.state.pos));
        return bool(Boolean(m));
      }
      case 'hasNextDouble': {
        const m = /^\s*(\S+)/.exec(this.state.text.slice(this.state.pos));
        return bool(Boolean(m) && !Number.isNaN(Number(m![1])));
      }
      case 'close':
        return VOID;
      default:
        throw runtimeError(`Scanner.${name} is not supported in this tracer.`, line);
    }
  }
}
