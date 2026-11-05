// An editable Word file of a paper or its answer key. The library loads only when someone asks for one.
import { createElement } from 'react';
import { BankDiagram } from '../../components/bank/BankDiagram';
import { loadStructures } from '../../data/structures';
import type { BankItem } from '../bank/types';
import { allItems, type PaperItem, type TeacherPaper } from './teacher';

/** LaTeX as text a person can read and edit in Word. */
export function plainMaths(text: string): string {
  let out = text;
  for (let i = 0; i < 4; i++) {
    out = out
      .replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)')
      .replace(/\\sqrt\{([^{}]*)\}/g, '√($1)')
      .replace(/\\binom\{([^{}]*)\}\{([^{}]*)\}/g, 'C($1, $2)');
  }
  return out
    .replace(/\\begin\{[vb]?matrix\}([\s\S]*?)\\end\{[vb]?matrix\}/g, (_, body: string) => `[${body.replace(/\\\\/g, ';').replace(/&/g, ',').replace(/\s+/g, ' ').trim()}]`)
    .replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, (_, body: string) => `{ ${body.replace(/\\\\/g, ';').replace(/&/g, ' ').trim()} }`)
    .replace(/\\(?:left|right)/g, '')
    .replace(/\\hat\{([a-z])\}/g, '$1̂')
    .replace(/\\vec\s*\{([a-zA-Z]+)\}/g, '$1⃗')
    .replace(/\\vec\s*([a-zA-Z])/g, '$1⃗')
    .replace(/\\mathbb\{R\}/g, 'ℝ')
    .replace(/\\text\{([^{}]*)\}/g, '$1')
    .replace(/\^\{([^{}]*)\}/g, (_, p: string) => (p.length > 1 ? `^(${p})` : `^${p}`))
    .replace(/_\{([^{}]*)\}/g, (_, p: string) => (p.length > 1 ? `_(${p})` : `_${p}`))
    .replace(/\\int/g, '∫')
    .replace(/\\sum/g, 'Σ')
    .replace(/\\pi/g, 'π')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\omega/g, 'ω')
    .replace(/\\phi/g, 'φ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\epsilon/g, 'ε')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\le(?:q)?\b/g, '≤')
    .replace(/\\ge(?:q)?\b/g, '≥')
    .replace(/\\to\b/g, '→')
    .replace(/\\infty/g, '∞')
    .replace(/\\circ/g, '∘')
    .replace(/\\cap/g, '∩')
    .replace(/\\cup/g, '∪')
    .replace(/\\lim/g, 'lim')
    .replace(/\\(sin|cos|tan|cot|sec|cosec|log)/g, '$1')
    .replace(/\\[,;!\s]/g, ' ')
    .replace(/\\/g, '')
    .replace(/\$/g, '');
}

/** Words and code blocks, in order, from a question's text. */
function pieces(text: string): { code: boolean; text: string }[] {
  return text
    .split(/```\n?/)
    .map((part, i) => ({ code: i % 2 === 1, text: i % 2 === 1 ? part.replace(/\n$/, '') : plainMaths(part).trim() }))
    .filter((p) => p.text);
}

interface Png {
  data: Uint8Array;
  width: number;
  height: number;
}

/** Turns a drawing into a PNG on a white page, at twice its size so that it stays sharp. */
async function svgToPng(svg: string, width: number, height: number): Promise<Png | null> {
  const sized = svg.replace('<svg', `<svg width="${width * 2}" height="${height * 2}"`);
  const url = URL.createObjectURL(new Blob([sized], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    await new Promise<void>((done, fail) => {
      image.onload = () => done();
      image.onerror = () => fail(new Error('The figure could not be drawn.'));
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, 'image/png'));
    return blob ? { data: new Uint8Array(await blob.arrayBuffer()), width, height } : null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** The compounds a question draws, in order. */
export function compoundsIn(item: BankItem): string[] {
  const structure = item.structure;
  if (!structure) return [];
  const inRows = (structure.rows ?? []).flat().flatMap((token) => ('s' in token ? [token.s] : []));
  return [...(structure.list ?? []), ...inRows];
}

/** Everything drawn for a question. A compound the question asks about is drawn even with figures switched off. */
async function figuresOf(item: BankItem, withFigures: boolean): Promise<Png[]> {
  const out: Png[] = [];
  if (withFigures && item.diagram) {
    const { renderToStaticMarkup } = await import('react-dom/server');
    const svg = renderToStaticMarkup(createElement(BankDiagram, { spec: item.diagram, plain: true }))
      .replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" style="color:#000000;font-family:sans-serif"')
      .replace(/<button[\s\S]*?>|<\/button>/g, '');
    const viewBox = /viewBox="0 0 (\d+) (\d+)"/.exec(svg);
    if (viewBox) {
      const png = await svgToPng(svg, Number(viewBox[1]), Number(viewBox[2]));
      if (png) out.push(png);
    }
  }
  if (withFigures || item.structure?.unnamed) {
    const names = compoundsIn(item);
    if (names.length) {
      const compounds = await loadStructures();
      for (const name of names) {
        const c = compounds[name];
        if (!c) continue;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${c.w} ${c.h}"><path d="${c.l}" fill="none" stroke="#000000" stroke-width="1.6"/><path d="${c.f}" fill="#000000"/></svg>`;
        const png = await svgToPng(svg, Math.ceil(c.w), Math.ceil(c.h));
        if (png) out.push(png);
      }
    }
  }
  return out;
}

export const STUDENT_FOOTER = 'This paper contains generated questions, which are not official ISC questions and may contain mistakes.';

export function answerLines(item: BankItem): string[] {
  switch (item.form) {
    case 'mcq':
      return [`${plainMaths(item.options[item.answer].text)} [${item.marks}]`, ...(item.why ? [plainMaths(item.why)] : [])];
    case 'output':
      return [`Output: ${item.expected.replace(/\n/g, ' / ')} [${item.marks}]`];
    case 'numeric':
      return item.parts.map((p) => `${plainMaths(p.ask)}: ${plainMaths(p.question.answerText)} [${p.marks}]`);
    case 'theory':
      return [...item.points.map((p) => `${plainMaths(p.text)} [${p.marks}]`), ...(item.model ? [item.model] : [])];
  }
}

export type DocKind = 'paper' | 'key';

/** Builds the file. `kind` chooses between the paper and its answer key. */
export async function buildDocx(paper: TeacherPaper, kind: DocKind): Promise<Blob> {
  const { AlignmentType, Document, Footer, HeadingLevel, ImageRun, Packer, Paragraph, TextRun } = await import('docx');
  const size = paper.options.fontSize * 2;
  const run = (text: string, extra: Record<string, unknown> = {}) => new TextRun({ text, size, ...extra });
  const body: InstanceType<typeof Paragraph>[] = [];
  const { header } = paper;
  if (header.school) body.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [run(header.school, { bold: true })] }));
  body.push(new Paragraph({ alignment: AlignmentType.CENTER, heading: HeadingLevel.TITLE, children: [run(`${header.exam}${paper.setName ? `, Set ${paper.setName}` : ''}${kind === 'key' ? ': answer key and marking scheme' : ''}`, { bold: true })] }));
  const meta = [header.classSection && `Class: ${header.classSection}`, header.date && `Date: ${header.date}`, header.time && `Time allowed: ${header.time}`, header.maxMarks && `Maximum marks: ${header.maxMarks}`].filter(Boolean).join('    ');
  if (meta) body.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [run(meta)] }));
  if (kind === 'paper') {
    for (const line of header.instructions.split('\n').filter(Boolean)) body.push(new Paragraph({ bullet: { level: 0 }, children: [run(line)] }));
  }
  const anyGenerated = allItems(paper).some((i) => i.question.item.generated);
  let number = 0;
  for (const section of paper.sections) {
    if (paper.sections.length > 1) body.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [run(section.name, { bold: true })] }));
    if (section.note && kind === 'paper') body.push(new Paragraph({ children: [run(section.note, { italics: true })] }));
    for (const item of section.items) {
      number++;
      await addQuestion(item, number);
    }
  }

  async function addQuestion(entry: PaperItem, n: number) {
    const q = entry.question.item;
    const text = entry.editedText ?? q.text;
    const tag = q.generated ? ' (Generated)' : '';
    const marks = paper.options.showMarks ? ` [${q.marks}]` : '';
    if (kind === 'key') {
      body.push(new Paragraph({ spacing: { before: 200 }, children: [run(`Question ${n}${tag}`, { bold: true })] }));
      for (const line of answerLines(q)) body.push(new Paragraph({ children: [run(line)] }));
      return;
    }
    const parts = pieces(text);
    parts.forEach((part, i) => {
      if (part.code) {
        for (const line of part.text.split('\n')) body.push(new Paragraph({ children: [run(line, { font: 'Consolas' })] }));
      } else {
        for (const [j, line] of part.text.split('\n').entries()) {
          body.push(new Paragraph({ spacing: i === 0 && j === 0 ? { before: 200 } : undefined, children: i === 0 && j === 0 ? [run(`${n}. `, { bold: true }), run(line), run(`${marks}${tag}`, { italics: true })] : [run(line)] }));
        }
      }
    });
    for (const png of await figuresOf(q, paper.options.diagrams).catch(() => [] as Png[])) {
      body.push(new Paragraph({ children: [new ImageRun({ type: 'png', data: png.data, transformation: { width: png.width, height: png.height } })] }));
    }
    if (q.form === 'output') for (const line of q.code.split('\n')) body.push(new Paragraph({ children: [run(line, { font: 'Consolas' })] }));
    if (q.form === 'mcq') q.options.forEach((option, i) => body.push(new Paragraph({ indent: { left: 360 }, children: [run(`(${'abcdef'[i]}) ${plainMaths(option.text)}`)] })));
    if (q.form === 'numeric' && q.parts.length > 1) q.parts.forEach((p, i) => body.push(new Paragraph({ indent: { left: 360 }, children: [run(`(${i + 1}) ${plainMaths(p.ask)} [${p.marks}]`)] })));
    for (let i = 0; i < paper.options.answerLines; i++) body.push(new Paragraph({ border: { bottom: { color: '888888', size: 4, style: 'single', space: 12 } }, children: [run('')] }));
  }

  const footerText = anyGenerated ? (kind === 'key' ? 'Generated, not official ISC. Check the answers before use.' : STUDENT_FOOTER) : '';
  const doc = new Document({
    sections: [
      {
        children: body,
        footers: footerText ? { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: footerText, size: 16 })] })] }) } : undefined,
      },
    ],
  });
  return Packer.toBlob(doc);
}

export function saveBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
