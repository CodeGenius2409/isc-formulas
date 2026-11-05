import { memo, Suspense, useId } from 'react';
import { CircleCheck, CircleX } from 'lucide-react';
import type { BankAnswer, BankItem, NumericItem, TheoryItem } from '../../practice/bank/types';
import { markPart, normaliseOutput } from '../../practice/bank/mark';
import { unitLabel } from '../../solver/unit-label';
import { useStructures } from '../../data/structures';
import { EntryStructures, Molecule } from '../Structures';
import { LazyLewis } from '../LazyLewis';
import { StepsList } from '../work/StepsList';
import { lazyRetry } from '../../lib/retry-import';
import { KEPT_NOTE, withFigureNote, type FigureMark } from '../../practice/gen/figures';
import { CodeBlock, RichText } from './RichText';

// The drawings are their own file, fetched the first time a question has a figure.
const BankDiagram = lazyRetry(() => import('./BankDiagram'));

export const marksLabel = (marks: number): string => `${marks} ${marks === 1 ? 'mark' : 'marks'}`;

/**
 * What is asked: the words, then any structure, figure or program. In a paper, `figure` gives the figure its number,
 * and 'none' leaves it out.
 */
export const BankPrompt = memo(function BankPrompt({ item, figure }: { item: BankItem; figure?: FigureMark | 'none' }) {
  const mark = figure && figure !== 'none' ? figure : undefined;
  const drawn = figure !== 'none' && item.diagram;
  return (
    <div className="bank-prompt">
      <RichText text={withFigureNote(item.text, mark)} python={Boolean(item.python)} />
      {item.structure && <EntryStructures structure={item.structure} scale={1} />}
      {drawn &&
        (mark ? (
          <figure className="bank-figure" data-testid="paper-figure" data-kept={mark.kept || undefined}>
            <Suspense fallback={<div className="bank-diagram-wait" aria-hidden />}>
              <BankDiagram spec={item.diagram!} />
            </Suspense>
            <figcaption>Fig. {mark.number}</figcaption>
            {mark.kept && <p className="bank-figure-note">{KEPT_NOTE}</p>}
          </figure>
        ) : (
          <Suspense fallback={<div className="bank-diagram-wait" aria-hidden />}>
            <BankDiagram spec={item.diagram!} />
          </Suspense>
        ))}
      {item.form === 'output' && <CodeBlock code={item.code} python={Boolean(item.python)} />}
    </div>
  );
});

function OptionMolecule({ name }: { name: string }) {
  const compound = useStructures()?.[name];
  return compound ? <Molecule compound={compound} scale={0.85} /> : null;
}

interface InputProps {
  item: BankItem;
  answer: BankAnswer;
  onChange: (change: Partial<BankAnswer>) => void;
  /** Show the right option, after marking. */
  marked?: boolean;
}

/** Where the answer goes. The same controls in practice and in a mock paper. */
export function BankInputs({ item, answer, onChange, marked }: InputProps) {
  const id = useId();
  if (item.form === 'mcq') {
    return (
      <div className="mt-2" role="group" aria-label="Options">
        {item.options.map((option, i) => {
          const state = !marked ? undefined : i === item.answer ? 'right' : answer.choice === i ? 'wrong' : undefined;
          return (
            <button key={i} type="button" className="choice" data-state={state} data-chosen={answer.choice === i || undefined} aria-pressed={answer.choice === i} disabled={marked} onClick={() => onChange({ choice: i })}>
              <span className="choice-key">{i + 1}</span>
              {option.structure ? <OptionMolecule name={option.structure} /> : <RichText text={option.text} python={Boolean(item.python)} className="rich-inline" />}
              {state === 'right' && <span className="sr-only"> (correct answer)</span>}
              {state === 'wrong' && <span className="sr-only"> (your answer, incorrect)</span>}
            </button>
          );
        })}
      </div>
    );
  }
  if (item.form === 'numeric') {
    const parts = answer.parts ?? item.parts.map(() => ({ value: '', unit: '' }));
    const change = (i: number, next: Partial<{ value: string; unit: string }>) => onChange({ parts: parts.map((p, j) => (j === i ? { ...p, ...next } : p)) });
    return (
      <div className="mt-2">
        {item.parts.map((part, i) => (
          <div key={i} className="bank-part">
            <p className="bank-part-ask">
              {item.parts.length > 1 && `(${i + 1}) `}
              {part.ask} <span className="bank-marks">[{part.marks}]</span>
            </p>
            <div className="mt-1 grid gap-2" style={{ gridTemplateColumns: part.question.unit ? 'minmax(0, 1fr) 7rem' : 'minmax(0, 1fr)' }}>
              <div>
                <label className="lbl" htmlFor={`${id}-v${i}`}>
                  Your answer
                </label>
                <input id={`${id}-v${i}`} className="field num" autoComplete="off" spellCheck={false} inputMode="text" value={parts[i].value} disabled={marked} onChange={(e) => change(i, { value: e.target.value })} />
              </div>
              {part.question.unit && (
                <div>
                  <label className="lbl" htmlFor={`${id}-u${i}`}>
                    Unit
                  </label>
                  <select id={`${id}-u${i}`} className="field" value={parts[i].unit} disabled={marked} onChange={(e) => change(i, { unit: e.target.value })}>
                    <option value="">Choose</option>
                    {part.question.unitChoices.map((u) => (
                      <option key={u} value={u}>
                        {unitLabel(u)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (item.form === 'output') {
    return (
      <div className="mt-2">
        <label className="lbl" htmlFor={`${id}-o`}>
          Output
        </label>
        <textarea id={`${id}-o`} className="field num bank-output" rows={Math.min(8, item.expected.split('\n').length + 1)} autoComplete="off" spellCheck={false} value={answer.text ?? ''} disabled={marked} onChange={(e) => onChange({ text: e.target.value })} />
      </div>
    );
  }
  return <p className="work-hint">Write your answer on paper. You mark it yourself against the marking scheme.</p>;
}

function NumericReview({ item, answer }: { item: NumericItem; answer: BankAnswer }) {
  return (
    <>
      {item.parts.map((part, i) => {
        const mark = markPart(item, i, answer);
        return (
          <div key={i} className="bank-part">
            <div className="notice" data-tone={mark.correct ? 'good' : 'bad'}>
              {mark.correct ? <CircleCheck size={18} aria-hidden /> : <CircleX size={18} aria-hidden />}
              <p>
                {item.parts.length > 1 && `(${i + 1}) `}
                {mark.correct ? `Right, ${marksLabel(part.marks)}. ${part.question.answerText}.` : `No marks. You gave ${mark.shown}. The answer is ${part.question.answerText}.`} {mark.reason}
              </p>
            </div>
            <StepsList steps={part.question.steps} />
          </div>
        );
      })}
    </>
  );
}

function TheoryReview({ item, answer, onChange }: { item: TheoryItem; answer: BankAnswer; onChange: (change: Partial<BankAnswer>) => void }) {
  const ticks = answer.ticks ?? item.points.map(() => false);
  return (
    <>
      <fieldset className="mark-scheme">
        <legend className="lbl">Marking scheme. Tick each point your answer earned.</legend>
        {item.points.map((point, i) => (
          <label key={i} className="mark-point">
            <input type="checkbox" checked={Boolean(ticks[i])} onChange={(e) => onChange({ ticks: ticks.map((t, j) => (j === i ? e.target.checked : Boolean(t))) })} />
            <RichText text={point.text} python={Boolean(item.python)} className="rich-inline" />
            <span className="bank-marks">[{point.marks}]</span>
          </label>
        ))}
      </fieldset>
      {item.model && (
        <details className="mt-2">
          <summary className="text-action">Show a full model answer</summary>
          <RichText text={item.model} python={Boolean(item.python)} className="mt-2" />
        </details>
      )}
    </>
  );
}

/** After answering: what was right, with the working or the marking scheme. */
export function BankReview({ item, answer, onChange }: { item: BankItem; answer: BankAnswer; onChange: (change: Partial<BankAnswer>) => void }) {
  return (
    <>
      <ReviewBody item={item} answer={answer} onChange={onChange} />
      {item.answerDiagram && (
        <figure className="bank-figure" data-testid="answer-figure">
          <Suspense fallback={<div className="bank-diagram-wait" aria-hidden />}>
            <BankDiagram spec={item.answerDiagram} />
          </Suspense>
          <figcaption>The diagram for this answer</figcaption>
        </figure>
      )}
    </>
  );
}

function ReviewBody({ item, answer, onChange }: { item: BankItem; answer: BankAnswer; onChange: (change: Partial<BankAnswer>) => void }) {
  if (item.form === 'numeric') return <NumericReview item={item} answer={answer} />;
  if (item.form === 'theory') {
    return (
      <>
        <TheoryReview item={item} answer={answer} onChange={onChange} />
        {item.answerLewis && <LazyLewis ids={item.answerLewis} />}
      </>
    );
  }
  const right = item.form === 'mcq' ? answer.choice === item.answer : normaliseOutput(answer.text ?? '') === normaliseOutput(item.expected);
  return (
    <>
      <div className="notice" data-tone={right ? 'good' : 'bad'}>
        {right ? <CircleCheck size={18} aria-hidden /> : <CircleX size={18} aria-hidden />}
        <p>{right ? `Right, ${marksLabel(item.marks)}.` : item.form === 'mcq' ? 'No marks. The correct answer is outlined.' : 'No marks. The output is below.'}</p>
      </div>
      {item.form === 'output' && !right && <CodeBlock code={item.expected} python />}
      {item.why && <RichText text={item.why} python={Boolean(item.python)} className="mt-2 text-ink-2" />}
      {item.answerLewis && <LazyLewis ids={item.answerLewis} />}
    </>
  );
}
