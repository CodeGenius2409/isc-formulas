import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getSubject } from '../../data/book';
import { answerFeedback } from '../../lib/motion';
import { answerSummary, isPassing, qualityOf, scoreOf, yourAnswerSummary } from '../../practice/bank/mark';
import type { BankAnswer, BankQuestion } from '../../practice/bank/types';
import { noteMissedSteps, recordAnswer } from '../../practice/progress';
import { nextQuestion, noteResult } from '../../practice/session';
import { BankInputs, BankPrompt, BankReview, marksLabel } from './BankParts';
import { BankNote, GeneratedMark, GeneratedNote, ReportProblem } from './GeneratedMark';
import { SimPanel } from './SimPanel';

/** A question from the bank in a practice session: answer, then see the working or mark yourself. */
export function BankCard({ question, mistakeId }: { question: BankQuestion; mistakeId?: string }) {
  const { item } = question;
  const [answer, setAnswer] = useState<BankAnswer>({});
  const [checked, setChecked] = useState(false);
  const [saved, setSaved] = useState(false);
  const reviewRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.getElementById('work-panel')?.scrollTo({ top: 0 });
  }, [question]);

  const save = (final: BankAnswer) => {
    const score = scoreOf(item, final);
    const correct = isPassing(item, score);
    recordAnswer({
      question,
      correct,
      quality: qualityOf(item, score),
      asked: item.text,
      yourAnswer: yourAnswerSummary(item, final),
      correctAnswer: answerSummary(item),
      formula: { name: `${marksLabel(item.marks)}: ${item.topicName}`, subject: item.subject, classLevel: item.level, topic: `${item.unitName}, ${item.topicName}` },
      mistakeId,
    });
    noteResult(correct);
    if (item.form === 'theory') noteMissedSteps(item.stepBlueprint, item.points, final.ticks);
    setSaved(true);
  };

  const check = (final = answer) => {
    setChecked(true);
    if (item.form !== 'theory') save(final);
  };

  const change = (next: Partial<BankAnswer>) => {
    const merged = { ...answer, ...next };
    setAnswer(merged);
    // Choosing an option is the answer. There is nothing to confirm.
    if (item.form === 'mcq') check(merged);
  };

  useLayoutEffect(() => {
    if (checked && item.form !== 'theory') answerFeedback(reviewRef.current?.querySelector('.notice') ?? null, scoreOf(item, answer) === item.marks);
    // Once, when the answer is checked.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  useEffect(() => {
    if (saved) nextRef.current?.focus({ preventScroll: true });
  }, [saved]);

  const score = scoreOf(item, answer);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!checked) check();
      }}
      noValidate
    >
      <p className="bank-meta">
        <span>{getSubject(item.subject).label} {item.level}, {item.topicName}</span>
        <GeneratedMark item={item} />
        <span className="bank-marks">[{item.marks}]</span>
      </p>
      <div className="bank-body" data-generated={item.generated ? true : undefined}>
        <BankPrompt item={item} />
      </div>
      <GeneratedNote item={item} />
      <BankNote item={item} />
      {item.simulator && <SimPanel simulator={item.simulator} answered={checked} />}
      <BankInputs item={item} answer={answer} onChange={change} marked={checked} />

      {!checked && item.form !== 'mcq' && (
        <button type="submit" className="btn btn-solid mt-3 w-full">
          {item.form === 'theory' ? 'Show the marking scheme' : 'Check answer'}
        </button>
      )}

      {checked && (
        <div ref={reviewRef}>
          <BankReview item={item} answer={answer} onChange={(next) => setAnswer({ ...answer, ...next })} />
          {item.form === 'numeric' && (
            <p className="mt-2 font-semibold">
              <span className="num">{score}</span> of <span className="num">{item.marks}</span> marks
            </p>
          )}
          {item.form === 'theory' && !saved && (
            <button type="button" className="btn btn-solid mt-3 w-full" onClick={() => save(answer)}>
              Save my mark: {score} of {item.marks}
            </button>
          )}
          {saved && (
            <button ref={nextRef} type="button" className="btn btn-solid mt-3 w-full" onClick={nextQuestion}>
              Next question
            </button>
          )}
        </div>
      )}
      <ReportProblem item={item} />
    </form>
  );
}
