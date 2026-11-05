// Problems reported with questions. They stay on this device until exported, so they can be sent back to be fixed.
import { createStore } from '../../lib/store';
import { readJson, writeJson } from '../../lib/storage';
import type { BankItem } from '../bank/types';

const KEY = 'isc-question-reports';
const LIMIT = 500;

export interface QuestionReport {
  date: string;
  id: string;
  blueprint?: string;
  seed?: number;
  text: string;
  answer: unknown;
  comment: string;
}

export const reportsStore = createStore<QuestionReport[]>(readJson<QuestionReport[]>(KEY, []), (value) => writeJson(KEY, value));

export function reportProblem(item: BankItem, comment: string): void {
  const answer = item.form === 'mcq' ? item.options[item.answer]?.text : item.form === 'output' ? item.expected : item.form === 'theory' ? item.points.map((p) => p.text) : item.parts.map((p) => p.question.answerText);
  const report: QuestionReport = {
    date: new Date().toISOString(),
    id: item.id,
    blueprint: item.generated?.blueprint,
    seed: item.generated?.seed,
    text: item.text,
    answer,
    comment: comment.trim(),
  };
  reportsStore.set((list) => [report, ...list].slice(0, LIMIT));
}

export function clearReports(): void {
  reportsStore.set([]);
}

/** Saves the reports as a file, to send on. */
export function exportReports(): void {
  const blob = new Blob([JSON.stringify({ app: 'isc-formula-book', kind: 'question-reports', exportedAt: new Date().toISOString(), reports: reportsStore.get() }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `isc-question-reports-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
