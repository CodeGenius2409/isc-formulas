// Marks an answer. Multiple choice, numericals and program output mark themselves. Theory is marked by
// the student, point by point, against the marking scheme.
import { markNumeric, type NumericMark } from '../questions';
import { QUALITY_CORRECT, QUALITY_WRONG, type Quality } from '../srs';
import type { BankAnswer, BankItem, NumericItem } from './types';

export function markPart(item: NumericItem, index: number, answer: BankAnswer): NumericMark {
  const given = answer.parts?.[index];
  return markNumeric(item.parts[index].question, given?.value ?? '', given?.unit ?? '');
}

/** Line ends and spacing at the ends of lines aren't what a "write the output" question tests. */
export function normaliseOutput(text: string): string {
  return text
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim().replace(/\s+/g, ' '))
    .join('\n')
    .trim();
}

/** Marks earned. Theory counts only what has been ticked so far. */
export function scoreOf(item: BankItem, answer: BankAnswer | undefined): number {
  if (!answer) return 0;
  switch (item.form) {
    case 'mcq':
      return answer.choice === item.answer ? item.marks : 0;
    case 'output':
      return normaliseOutput(answer.text ?? '') === normaliseOutput(item.expected) ? item.marks : 0;
    case 'numeric':
      return item.parts.reduce((sum, part, i) => sum + (markPart(item, i, answer).correct ? part.marks : 0), 0);
    case 'theory':
      return item.points.reduce((sum, point, i) => sum + (answer.ticks?.[i] ? point.marks : 0), 0);
  }
}

/** Over half the marks counts as knowing it. Anything less goes to the mistakes list. */
export function isPassing(item: BankItem, score: number): boolean {
  return score * 2 > item.marks || score === item.marks;
}

export function qualityOf(item: BankItem, score: number): Quality {
  if (item.form !== 'theory') return score === item.marks ? QUALITY_CORRECT : isPassing(item, score) ? 3 : QUALITY_WRONG;
  if (score === item.marks) return 5;
  if (score * 4 >= item.marks * 3) return 4;
  if (isPassing(item, score)) return 3;
  return score > 0 ? 2 : 1;
}

export function isAttempted(item: BankItem, answer: BankAnswer | undefined): boolean {
  if (!answer) return false;
  if (item.form === 'mcq') return answer.choice !== undefined;
  if (item.form === 'output') return Boolean(answer.text?.trim());
  if (item.form === 'numeric') return Boolean(answer.parts?.some((p) => p.value.trim()));
  return Boolean(answer.ticks?.some(Boolean));
}

/** The model answer as one line of words, for the mistakes list. */
export function answerSummary(item: BankItem): string {
  switch (item.form) {
    case 'mcq':
      return item.options[item.answer].text;
    case 'output':
      return item.expected.replace(/\n/g, ' / ');
    case 'numeric':
      return item.parts.map((p) => p.question.answerText).join('; ');
    case 'theory':
      return item.points.map((p) => p.text).join(' ');
  }
}

export function yourAnswerSummary(item: BankItem, answer: BankAnswer | undefined): string {
  if (!answer) return '(no answer)';
  switch (item.form) {
    case 'mcq':
      return answer.choice === undefined ? '(no answer)' : item.options[answer.choice].text;
    case 'output':
      return answer.text?.trim() ? answer.text.trim().replace(/\n/g, ' / ') : '(no answer)';
    case 'numeric':
      return item.parts.map((_, i) => markPart(item, i, answer).shown).join('; ');
    case 'theory': {
      const got = item.points.reduce((sum, p, i) => sum + (answer.ticks?.[i] ? p.marks : 0), 0);
      return `Self-marked ${got} of ${item.marks}`;
    }
  }
}
