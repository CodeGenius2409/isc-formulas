// A simulator inside a question: preset to the question's values, with its readouts hidden until it's been answered.
import { createContext, useContext, useState } from 'react';
import { getRoute } from '../../lib/router';

export interface SimQuestion {
  preset?: Record<string, number>;
  /** Answer-revealing numbers stay hidden. */
  hide?: boolean;
}

export const SimQuestionContext = createContext<SimQuestion>({});

export const useSimQuestion = (): SimQuestion => useContext(SimQuestionContext);

/** Starts from the question's value, or from a value in the address, or from the simulator's own default. */
export function usePreset(name: string, start: number): [number, (v: number) => void] {
  const { preset } = useSimQuestion();
  const fromAddress = getRoute().path[0] === 'tools' ? getRoute().query.get(name) : null;
  return useState<number>(preset?.[name] ?? (fromAddress !== null && Number.isFinite(Number(fromAddress)) ? Number(fromAddress) : start));
}
