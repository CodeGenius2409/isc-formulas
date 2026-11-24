// What the program reads: the text in the Input box, for Scanner and BufferedReader.
import { bool, dbl, int, NULL, runtimeError, str, VOID, type JValue } from './values';

/** A line of the Input box, shown in the console where a terminal would show it as typed. */
export interface InputEcho {
  /** Where in the output it goes. */
  at: number;
  text: string;
}

export class ProgramInput {
  private state: { text: string; pos: number };
  /** The lines the program has reached so far, each echoed once, the first time anything on it is read. */
  readonly echoes: InputEcho[] = [];
  private echoedUpTo = 0;

  /** outputLength says how much the program has printed, so an echo lands after the prompt before it. */
  constructor(
    text: string,
    private outputLength: () => number = () => 0,
  ) {
    this.state = { text, pos: 0 };
  }

  /** Echoes every line not yet echoed, up to and including the one holding pos. */
  private echoThrough(pos: number) {
    const { text } = this.state;
    while (this.echoedUpTo <= pos && this.echoedUpTo < text.length) {
      const end = text.indexOf('\n', this.echoedUpTo);
      const stop = end < 0 ? text.length : end;
      this.echoes.push({ at: this.outputLength(), text: text.slice(this.echoedUpTo, stop).replace(/\r$/, '') });
      this.echoedUpTo = stop + 1;
    }
  }

  /** Like a terminal waiting at a hasNext…() test: the line with the next token is typed in. */
  private echoNextToken() {
    const next = this.state.text.slice(this.state.pos).search(/\S/);
    if (next >= 0) this.echoThrough(this.state.pos + next);
  }

  nextToken(line: number): string {
    const s = this.state;
    while (s.pos < s.text.length && /\s/.test(s.text[s.pos])) s.pos++;
    if (s.pos >= s.text.length) throw runtimeError('java.util.NoSuchElementException: the program asked for more input than the Input box holds. Add more values there.', line);
    this.echoThrough(s.pos);
    const start = s.pos;
    while (s.pos < s.text.length && !/\s/.test(s.text[s.pos])) s.pos++;
    return s.text.slice(start, s.pos);
  }

  hasToken(): boolean {
    return /\S/.test(this.state.text.slice(this.state.pos));
  }

  nextLine(line: number): string {
    const s = this.state;
    if (s.pos >= s.text.length) {
      throw runtimeError('java.util.NoSuchElementException: the program asked for another line, but the Input box has run out.', line);
    }
    this.echoThrough(s.pos);
    const end = s.text.indexOf('\n', s.pos);
    const out = end < 0 ? s.text.slice(s.pos) : s.text.slice(s.pos, end);
    s.pos = end < 0 ? s.text.length : end + 1;
    return out.replace(/\r$/, '');
  }

  readLine(line: number): JValue {
    return this.state.pos >= this.state.text.length ? NULL : str(this.nextLine(line));
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
        this.echoNextToken();
        return bool(this.hasToken());
      case 'hasNextLine':
        if (this.state.pos < this.state.text.length) this.echoThrough(this.state.pos);
        return bool(this.state.pos < this.state.text.length);
      case 'hasNextInt': {
        this.echoNextToken();
        const m = /^\s*([+-]?\d+)(\s|$)/.exec(this.state.text.slice(this.state.pos));
        return bool(Boolean(m));
      }
      case 'hasNextDouble': {
        this.echoNextToken();
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
