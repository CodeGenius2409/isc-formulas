// A LaTeX command written with one backslash in a TypeScript string loses it: \frac becomes a form feed, \times a tab.
// So no question may hold a backspace, tab, vertical tab or form feed.
import { expect, it } from 'vitest';
import { loadBank } from '../../src/practice/bank';
it('no question holds a control character left by a lost backslash', async () => {
  const out: string[] = [];
  for (const s of ['physics', 'chemistry', 'mathematics', 'computerscience'] as const) for (const l of ['XI', 'XII'] as const) {
    const bank = await loadBank(s, l);
    for (const d of bank.defs) {
      const all = JSON.stringify(d);
      // In JSON a real backslash is \\, and a control character is \b, \f, \t or \u000b. Drop the first, then look for the rest.
      if (/\\[bft]|\\u000[0-8bcef]/.test(all.replace(/\\\\/g, ''))) out.push(`${d.id} ${d.text.slice(0, 60)}`);
    }
  }
  expect(out).toEqual([]);
});
