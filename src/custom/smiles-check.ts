// Marks a "try it" answer. Any correct way of writing the compound is right, and a wrong try gets told what is off.
import { readSmiles, sameSmiles, SmilesMistake } from './smiles-read';

export interface TryResult {
  right: boolean;
  /** What to say, in words. Empty when nothing has been typed. */
  message: string;
}

const formulas = (text: string) => {
  const read = readSmiles(text);
  return [...read.reactants, ...read.products].map((m) => m.formula).join(', ');
};

export function checkTry(answer: string, target: string, hints: string[], wrongTries: number): TryResult {
  const text = answer.trim();
  if (!text) return { right: false, message: '' };
  if (sameSmiles(text, target)) return { right: true, message: 'Right. Any correct way of writing it counts.' };
  const hint = hints[Math.min(wrongTries, hints.length - 1)];
  let yours: string;
  try {
    yours = formulas(text);
  } catch (err) {
    return { right: false, message: `${err instanceof SmilesMistake ? err.message : "That can't be read."} ${hint}` };
  }
  if (yours !== formulas(target)) return { right: false, message: `That gives ${yours}, and this one should be ${formulas(target)}. ${hint}` };
  return { right: false, message: `Those are the right atoms, ${yours}, but joined differently. ${hint}` };
}
