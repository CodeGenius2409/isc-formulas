// Quantity search: "I have v, u, t want s". Matches against the solver registry's
// variables, and ranks formulas that give the wanted quantity from exactly what you
// have above those that need something extra.
import type { ResolvedEntry, ResolvedVar } from '../solver/types';

export interface QuantityQuery {
  have: string[];
  want: string[];
}

export interface QuantityMatch {
  entry: ResolvedEntry;
  /** The symbol to solve for. */
  unknown: string;
  /** Quantities this formula needs that you did not list. */
  missing: ResolvedVar[];
  /** What you listed that this formula does not use. */
  unused: string[];
  /** 0: exactly your quantities. 1: enough, with some left over. 2: needs more. */
  tier: 0 | 1 | 2;
}

const FILLER = new Set(['the', 'my', 'also', 'value', 'values', 'quantities']);
/** Only filler inside a phrase. Alone, "a" and "i" are symbols: acceleration and current. */
const PHRASE_FILLER = new Set([...FILLER, 'a', 'an', 'of', 'i']);

function splitList(text: string): string[] {
  const cleaned = text.replace(/\band\b/gi, ',').trim();
  const parts = cleaned.includes(',') ? cleaned.split(',') : cleaned.split(/\s+/);
  return parts
    .map((part) => {
      const words = part.trim().split(/\s+/).filter(Boolean);
      const drop = words.length > 1 ? PHRASE_FILLER : FILLER;
      return words.filter((w) => !drop.has(w.toLowerCase())).join(' ');
    })
    .filter(Boolean);
}

/**
 * Understands the phrasings students use:
 *   I have v, u, t want s      given v u t find s      find s from v u t
 *   find s given v, u and t    want s have v u t       s from v u t
 */
export function parseQuantityQuery(raw: string): QuantityQuery | null {
  const text = raw.trim().replace(/[?.!]+$/, '');
  const patterns: [RegExp, 'have-want' | 'want-have'][] = [
    [/^(?:i\s+)?(?:have|know|got)\s+(.+?)[,;]?\s+(?:and\s+)?(?:want|need|find|get)\s+(.+)$/i, 'have-want'],
    [/^(?:given|with|using)\s+(.+?)[,;]?\s+(?:find|want|get|calculate)\s+(.+)$/i, 'have-want'],
    [/^(?:i\s+)?(?:want|need|find|get|calculate)\s+(.+?)[,;]?\s+(?:from|given|using|with|have)\s+(.+)$/i, 'want-have'],
    [/^(.+?)\s+(?:from|given)\s+(.+)$/i, 'want-have'],
  ];
  for (const [re, order] of patterns) {
    const m = re.exec(text);
    if (!m) continue;
    const have = splitList(order === 'have-want' ? m[1] : m[2]);
    const want = splitList(order === 'have-want' ? m[2] : m[1]);
    if (have.length && want.length) return { have, want };
  }
  return null;
}

const GREEK_INPUT: Record<string, string> = { α: 'alpha', β: 'beta', γ: 'gamma', δ: 'delta', ε: 'epsilon', θ: 'theta', λ: 'lambda', μ: 'mu', ν: 'nu', π: 'pi', ρ: 'rho', σ: 'sigma', τ: 'tau', φ: 'phi', ω: 'omega', Δ: 'Delta' };

/** v0 and v_0 are the same symbol, and so are λ and lambda. */
function normaliseSymbol(token: string): string {
  let t = token.replace(/[αβγδεθλμνπρστφωΔ]/g, (c) => GREEK_INPUT[c] ?? c);
  t = t.replace(/^delta(?=[A-Za-z])/i, 'Delta');
  t = t.replace(/^([A-Za-z]+)(\d+)$/, '$1_$2');
  return t;
}

/** A token matches by exact symbol, or by a word in the quantity's name. */
function tokenMatches(v: ResolvedVar, token: string): boolean {
  const symbol = normaliseSymbol(token);
  if (v.symbol === symbol) return true;
  if (token.length >= 3 && /[a-z]/i.test(token)) {
    const name = v.name.toLowerCase();
    return name.includes(token.toLowerCase()) && v.symbol.toLowerCase() !== token.toLowerCase();
  }
  return false;
}

export function matchQuantities(query: QuantityQuery, entries: ResolvedEntry[]): QuantityMatch[] {
  const out: QuantityMatch[] = [];
  for (const entry of entries) {
    const wanted = entry.vars.find((v) => query.want.some((token) => tokenMatches(v, token)));
    if (!wanted) continue;
    const provided = entry.vars.filter((v) => v !== wanted && query.have.some((token) => tokenMatches(v, token)));
    // Constants such as g and pre-filled values count as known already.
    const missing = entry.vars.filter((v) => v !== wanted && !provided.includes(v) && !v.isConstant && v.value === undefined);
    const unused = query.have.filter((token) => !entry.vars.some((v) => v !== wanted && tokenMatches(v, token)));
    if (!provided.length && missing.length) continue;
    const tier = missing.length ? 2 : unused.length ? 1 : 0;
    out.push({ entry, unknown: wanted.symbol, missing, unused, tier });
  }
  return out.sort(
    (a, b) =>
      a.tier - b.tier ||
      a.missing.length - b.missing.length ||
      a.unused.length - b.unused.length ||
      // The formula's natural subject first: s = ... before something rearranged for s.
      Number(b.entry.ask === b.unknown || b.entry.eq.trim().startsWith(`${b.unknown} `)) - Number(a.entry.ask === a.unknown || a.entry.eq.trim().startsWith(`${a.unknown} `)) ||
      a.entry.vars.length - b.entry.vars.length,
  );
}
