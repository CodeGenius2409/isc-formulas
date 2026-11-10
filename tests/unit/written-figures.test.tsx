// Hand-written figure questions: every figure shown with a question, and every answer figure, draws without a broken
// coordinate, and has words for a screen reader. A sketch's marks stay inside its own frame.
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BankDiagram, describe as describeFigure } from '../../src/components/bank/BankDiagram';
import type { ClassLevel, SubjectId } from '../../src/data/types';
import { loadBank } from '../../src/practice/bank';
import type { DiagramSpec } from '../../src/practice/bank/diagram';

const CLASSES: [SubjectId, ClassLevel][] = [['physics', 'XI'], ['physics', 'XII'], ['chemistry', 'XI'], ['chemistry', 'XII'], ['mathematics', 'XI'], ['mathematics', 'XII'], ['computerscience', 'XI'], ['computerscience', 'XII']];

function inFrame(spec: DiagramSpec): string[] {
  if (spec.kind !== 'sketch') return [];
  const out: string[] = [];
  const check = (x: number, y: number) => {
    if (x < 0 || y < 0 || x > spec.w || y > spec.h) out.push(`${x},${y} outside ${spec.w}×${spec.h}`);
  };
  for (const m of spec.marks) {
    if (m.t === 'line' || m.t === 'shade') m.p.forEach(([x, y]) => check(x, y));
    else if (m.t === 'box') (check(m.x, m.y), check(m.x + m.w, m.y + m.h));
    else if (m.t === 'circle') (check(m.x - m.r, m.y - m.r), check(m.x + m.r, m.y + m.r));
    else if (m.t === 'dot') check(m.x, m.y);
    else if (m.t === 'text') {
      // At 13px, a character is about 7px wide, so a label's whole width has to fit, not just its anchor.
      const width = [...m.s].length * 7;
      const from = m.a === 'start' ? m.x : m.a === 'end' ? m.x - width : m.x - width / 2;
      check(from, m.y);
      check(from + width, m.y - 10);
    }
  }
  return out;
}

describe.each(CLASSES)('%s %s', (subject, level) => {
  it('draws every hand-written figure, with words for it', async () => {
    const bank = await loadBank(subject, level);
    const written = bank.defs.filter((d) => (!d.origin || d.origin === 'written') && (d.diagram || d.answerDiagram));
    if (subject === 'physics' && level === 'XII') expect(written.filter((d) => d.format === 'diagram').length).toBeGreaterThan(40);
    for (const d of written) {
      for (const spec of [d.diagram, d.answerDiagram].filter(Boolean) as DiagramSpec[]) {
        const svg = renderToStaticMarkup(<BankDiagram spec={spec} plain />);
        expect(svg, d.text).not.toMatch(/NaN|Infinity|undefined/);
        expect(describeFigure(spec).length, d.text).toBeGreaterThan(20);
        expect(inFrame(spec), d.text).toEqual([]);
      }
      // A figure question says what is to be drawn or read, and gives something to mark it by.
      if (d.format === 'diagram') expect(d.diagram || d.answerDiagram, d.text).toBeTruthy();
    }
  });
});
