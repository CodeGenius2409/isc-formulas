// Reads the reactions out of the data's LaTeX: species on each side, and what is written over the arrow.

function closing(s, open, opener = '{', closer = '}') {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === '\\') {
      i++;
      continue;
    }
    if (s[i] === opener) depth++;
    if (s[i] === closer && --depth === 0) return i;
  }
  return -1;
}

/** LaTeX to plain condensed text: H_{2}O becomes H2O. Charges stay as ^+ so they can be told apart. */
function plain(tex) {
  let s = tex;
  for (;;) {
    const m = /\\(?:text|mathrm|ce|mathbf|textbf)\{/.exec(s);
    if (!m) break;
    const open = m.index + m[0].length - 1;
    const close = closing(s, open);
    if (close < 0) break;
    s = s.slice(0, m.index) + s.slice(open + 1, close) + s.slice(close + 1);
  }
  return s
    .replace(/\\overset\{\+\}\{([A-Za-z]+)\}/g, '$1^+')
    .replace(/\\(?:quad|qquad|,|;|:|!| )/g, ' ')
    .replace(/\\equiv/g, '≡')
    .replace(/\\(?:downarrow|uparrow)/g, '')
    .replace(/\\Delta/g, 'heat')
    .replace(/\\tfrac\{1\}\{2\}/g, '½')
    .replace(/_\{([^{}]*)\}/g, '$1')
    .replace(/_(\w)/g, '$1')
    .replace(/\^\{([-+0-9a-z]*)\}/g, '^$1')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const ARROWS = [
  [/^\\xrightarrow/, true],
  [/^\\(?:rightarrow|longrightarrow)/, false],
  [/^\\to(?![a-z])/, false],
  [/^\\rightleftharpoons/, false, true],
];

/** Splits a side on the + that separates species, leaving ^+ charges and brackets alone. */
function splitSide(side) {
  const out = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < side.length; i++) {
    const ch = side[i];
    if ('([{'.includes(ch)) depth++;
    if (')]}'.includes(ch)) depth--;
    if (ch === '+' && depth === 0 && side[i - 1] !== '^') {
      out.push(current);
      current = '';
    } else current += ch;
  }
  out.push(current);
  return out.map((s) => s.trim()).filter(Boolean);
}

/**
 * Finds the reactions in an entry. Each is a chain: species, arrow, species, arrow, ...
 * `isPlain` is for the worked examples, written directly with → rather than in LaTeX.
 */
export function readReactions(source, isPlain = false) {
  const text = isPlain
    ? source.replace(/→\[([^\]]*)\]/g, '\\xrightarrow{$1}').replace(/→/g, '\\rightarrow ')
    : source
        .replace(/\\begin\{aligned\}|\\end\{aligned\}|&/g, '')
        .replace(/\\\\/g, ';')
        .replace(/\\overset\{[^{}]*\}\{\\rightleftharpoons\}/g, '\\rightleftharpoons ');
  const lines = text.split(/;|\\qquad/);
  const reactions = [];
  for (const line of lines) {
    const chain = [];
    let rest = line;
    let side = '';
    let hasArrow = false;
    while (rest.length) {
      const hit = rest[0] === '\\' ? ARROWS.find(([pattern]) => pattern.test(rest)) : null;
      if (!hit) {
        side += rest[0];
        rest = rest.slice(1);
        continue;
      }
      rest = rest.replace(hit[0], '');
      let over = '';
      if (hit[1]) {
        let below = '';
        if (rest[0] === '[') {
          const close = closing(rest, 0, '[', ']');
          below = plain(rest.slice(1, close));
          rest = rest.slice(close + 1);
        }
        if (rest[0] === '{') {
          const close = closing(rest, 0);
          over = plain(rest.slice(1, close));
          rest = rest.slice(close + 1);
        }
        if (below) over = over ? `${over}; ${below}` : below;
      }
      chain.push({ species: splitSide(plain(side)) }, { arrow: over, ...(hit[2] ? { both: true } : {}) });
      side = '';
      hasArrow = true;
    }
    if (!hasArrow) continue;
    chain.push({ species: splitSide(plain(side)) });
    reactions.push(chain);
  }
  return reactions;
}

/** Strips a coefficient and any note from a species. Returns what is left, and the coefficient. */
export function cleanSpecies(raw) {
  let s = raw.trim().replace(/\s*\((?:major|minor|alc|aq|dry|vapour|excess|\d+\s*K)\)\s*$/i, '');
  s = s.replace(/\s*\(([a-z]+)\)$/i, (all, word) => (/glucose|fructose/.test(word) ? ` (${word})` : ''));
  s = s.replace(/^\[([^[\]]*)\]$/, '$1');
  const coefficient = /^(\d+)\s*(?=[A-Za-z(\[])/.exec(s);
  // 2,4-(NO2)... is a locant, not a coefficient.
  if (coefficient && !/^\d+,/.test(s)) {
    s = s.slice(coefficient[0].length);
    return { species: s.trim(), count: Number(coefficient[1]) };
  }
  return { species: s.trim(), count: undefined };
}

/** Counts the atoms in a condensed formula, or null if it can't be read as one. */
export function atomsOfCondensed(form) {
  const text = form
    .replace(/^(?:cis|trans|n|iso|o|m|p|\d(?:,\d)*)-/, '')
    .replace(/\s*\([a-z]+\)$/, '')
    .replace(/\^[-+]/g, '')
    .replace(/[-=≡]/g, '');
  function parse(s, start) {
    const atoms = {};
    let i = start;
    while (i < s.length) {
      if (s[i] === '(') {
        const [inner, end] = parse(s, i + 1);
        i = end + 1;
        const n = /^\d+/.exec(s.slice(i));
        const mult = n ? Number(n[0]) : 1;
        if (n) i += n[0].length;
        for (const [k, v] of Object.entries(inner)) atoms[k] = (atoms[k] ?? 0) + v * mult;
      } else if (s[i] === ')') {
        return [atoms, i];
      } else {
        const m = /^([A-Z][a-z]?)(\d*)/.exec(s.slice(i));
        if (!m) return [null, i];
        atoms[m[1]] = (atoms[m[1]] ?? 0) + (m[2] ? Number(m[2]) : 1);
        i += m[0].length;
      }
      if (atoms === null) return [null, i];
    }
    return [atoms, i];
  }
  try {
    const [atoms] = parse(text, 0);
    return atoms;
  } catch {
    return null;
  }
}
