import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { CircleCheck, CircleX, FileText, ListChecks, Lightbulb, RotateCcw, Sparkles, Wand2 } from 'lucide-react';
import { loadSyllabus } from '../../data/syllabus';
import type { ClassLevel, SubjectId } from '../../data/types';
import { loadBank } from '../../practice/bank';
import { planShare, practiceShareStore } from '../../practice/gen/mix';
import { ShareSlider } from '../bank/ShareSlider';
import { findFormula, getSubject, unitTitle } from '../../data/book';
import type { Formula } from '../../data/types';
import { useAsync } from '../../lib/hooks';
import { answerFeedback, stepsReveal } from '../../lib/motion';
import { href, useRoute } from '../../lib/router';
import { useStore } from '../../lib/store';
import { lastReadStore } from '../../state/library';
import { mistakesStore, recordAnswer, srsStore, today } from '../../practice/progress';
import { correctSummary, markNumeric, questionSummary, type McqQuestion, type NumericMark, type NumericQuestion, type Question, type RecallQuestion } from '../../practice/questions';
import { QUALITY_CORRECT, QUALITY_WRONG, reviewOrder, type Quality } from '../../practice/srs';
import { endSession, nextQuestion, noteResult, sessionStore, startMistakes, startNew, startReview, startUnit } from '../../practice/session';
import { practiceBusyStore } from '../../practice/session-link';
import { unitLabel } from '../../solver/unit-label';
import { BankCard } from '../bank/BankCard';
import { Math as MathTex } from '../Math';
import { EntryStructures, Molecule } from '../Structures';
import { useStructures } from '../../data/structures';
import { StepsList } from './StepsList';

function topicOf(f: Formula | null): string {
  return f ? `${unitTitle(f.unit)}, ${f.subtopic}` : '';
}

/** The working area's practice tab: choosing what to practise, then each question. */
export default function PracticePane() {
  const session = useStore(sessionStore);
  const busy = useStore(practiceBusyStore);

  if (busy) return <p className="text-ink-3">Preparing questions</p>;
  if (!session) return <PracticeHome />;
  if (session.index >= session.items.length) return <SessionSummary />;
  const item = session.items[session.index];
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2 text-step--1 text-ink-2">
        <span>
          {session.title}: <span className="num">{session.index + 1}</span> of <span className="num">{session.items.length}</span>
        </span>
        <button type="button" className="btn btn-quiet" onClick={endSession}>
          End session
        </button>
      </div>
      {item.question.kind === 'bank' ? (
        <BankCard key={`${session.index}-${item.question.formulaId}`} question={item.question} mistakeId={item.mistakeId} />
      ) : (
        <QuestionCard key={`${session.index}-${item.question.formulaId}`} question={item.question} mistakeId={item.mistakeId} />
      )}
    </div>
  );
}

function PracticeHome() {
  const srs = useStore(srsStore);
  const mistakes = useStore(mistakesStore);
  const last = useStore(lastReadStore);
  const route = useRoute();
  const due = useMemo(() => reviewOrder(Object.values(srs), today()).length, [srs]);
  const open = mistakes.filter((m) => !m.resolved).length;
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const share = useStore(practiceShareStore);

  // Practising what is on screen beats practising what was last open.
  const here = route.path[0] === 'book' && route.path[3] != null ? { subject: route.path[1], level: route.path[2], unit: Number(route.path[3]) } : last ? { subject: last.subject, level: last.classLevel, unit: last.unitIndex ?? 0 } : null;

  const run = async (start: () => Promise<unknown> | unknown, empty: string) => {
    setMessage('');
    const session = await start();
    if (!session) setMessage(empty);
  };

  return (
    <div>
      <h2 className="work-title">Practice</h2>
      <p className="work-hint">Questions in the style of the board papers, with fresh numbers each time and marking schemes for written answers. Whatever you miss comes back sooner.</p>
      <div className="mt-3 flex flex-col gap-2">
        <button type="button" className={due ? 'btn btn-solid' : 'btn btn-line'} disabled={!due} onClick={() => void run(() => startReview(), 'Nothing is due right now.')}>
          <ListChecks size={16} aria-hidden /> {due ? `Review ${due} due today` : 'Nothing due today'}
        </button>
        {here && (
          <button type="button" className={due ? 'btn btn-line' : 'btn btn-solid'} onClick={() => void run(() => startUnit(here.subject as never, here.level as never, here.unit, undefined, { topic: topic || undefined, difficulty: difficulty ? (Number(difficulty) as 1 | 2 | 3) : undefined }), 'That unit has no formulas to practise.')}>
            <Sparkles size={16} aria-hidden /> Practise this unit
          </button>
        )}
        {here && <UnitSettings subject={here.subject as SubjectId} level={here.level as ClassLevel} unit={here.unit} topic={topic} onTopic={setTopic} difficulty={difficulty} onDifficulty={setDifficulty} share={share} />}
        <a className="btn btn-line" href={href('paper')}>
          <FileText size={16} aria-hidden /> Build a mock paper
        </a>
        <a className="btn btn-line" href={href('generate')}>
          <Wand2 size={16} aria-hidden /> Generate questions
        </a>
        <button type="button" className="btn btn-line" disabled={!open} onClick={() => void run(() => startMistakes(), 'No mistakes to retry.')}>
          <RotateCcw size={16} aria-hidden /> {open ? `Retry ${open} ${open === 1 ? 'mistake' : 'mistakes'}` : 'No mistakes to retry'}
        </button>
        <button type="button" className="btn btn-line" onClick={() => void run(() => startNew(), 'You have seen every formula. Well done.')}>
          Ten new formulas
        </button>
      </div>
      {message && (
        <p className="mt-2 text-ink-2" role="status">
          {message}
        </p>
      )}
      <p className="mt-3 text-step--1">
        <a className="text-action" href={href('practice')}>See progress and mistakes</a>
      </p>
    </div>
  );
}

const SESSION_EXAM = 8;

/** What goes into a unit's practice: which topic, how hard, and how much of it is generated. */
function UnitSettings({ subject, level, unit, topic, onTopic, difficulty, onDifficulty, share }: { subject: SubjectId; level: ClassLevel; unit: number; topic: string; onTopic: (t: string) => void; difficulty: string; onDifficulty: (d: string) => void; share: number }) {
  const srs = useStore(srsStore);
  const info = useAsync(async () => {
    const [syllabus, bank] = await Promise.all([loadSyllabus(subject), loadBank(subject, level)]);
    const units = syllabus.classes.find((c) => c.level === level)?.units ?? [];
    return { units, bank };
  }, `${subject}-${level}`);
  if (info.status !== 'ready') return null;
  const here = info.value.units[unit];
  if (!here) return null;
  const unseen = info.value.bank.defs.filter((d) => d.unit === here.number && (!topic || d.topic === topic) && (!difficulty || d.difficulty === Number(difficulty)) && !srs[d.id]).length;
  const plan = planShare([{ marks: 1, count: SESSION_EXAM, bankHas: unseen }], share);
  return (
    <details className="practice-settings">
      <summary>Practice settings</summary>
      <div className="mt-2 grid gap-2">
        <div>
          <label className="lbl" htmlFor="practice-topic">
            Topic
          </label>
          <select id="practice-topic" className="field" value={topic} onChange={(e) => onTopic(e.target.value)}>
            <option value="">The whole unit</option>
            {here.topics.map((t) => (
              <option key={t.key} value={t.key}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="lbl" htmlFor="practice-difficulty">
            Difficulty
          </label>
          <select id="practice-difficulty" className="field" value={difficulty} onChange={(e) => onDifficulty(e.target.value)}>
            <option value="">Mixed</option>
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </select>
        </div>
      </div>
      <ShareSlider value={share} onChange={(v) => practiceShareStore.set(v)} message={plan.generated ? `About ${plan.generated} of ${SESSION_EXAM} exam-style questions will be generated.` : 'Every exam-style question will come from the bank.'} warning={plan.raised} />
    </details>
  );
}

function SessionSummary() {
  const session = useStore(sessionStore)!;
  const focus = useRef<HTMLButtonElement>(null);
  useEffect(() => focus.current?.focus(), []);
  return (
    <div>
      <h2 className="work-title">{session.title}: finished</h2>
      <p className="mt-2 text-step-1">
        <span className="num font-bold">{session.correct}</span> of <span className="num">{session.answered}</span> right.
      </p>
      <p className="work-hint">Anything you missed comes back sooner, and is in your mistakes list.</p>
      <button ref={focus} type="button" className="btn btn-solid mt-3" onClick={endSession}>
        Done
      </button>
    </div>
  );
}

interface CardProps {
  question: Question;
  mistakeId?: string;
}

function useFormula(id: string) {
  const state = useAsync(() => findFormula(id), id);
  return state.status === 'ready' ? state.value : null;
}

/** Records the result against the schedule, the session and the mistakes log. */
function useRecord(question: Question, mistakeId: string | undefined, formula: Formula | null) {
  return (correct: boolean, quality: Quality, yourAnswer: string, yourAnswerIsLatex = false) => {
    const right = correctSummary(question);
    recordAnswer({
      question,
      correct,
      quality,
      asked: questionSummary(question),
      yourAnswer,
      yourAnswerIsLatex,
      correctAnswer: right.text ?? right.latex ?? '',
      correctAnswerIsLatex: !right.text,
      formula: { name: formula?.name ?? question.formulaId, subject: formula?.subject ?? '', classLevel: formula?.classLevel ?? '', topic: topicOf(formula) },
      mistakeId,
    });
    noteResult(correct);
  };
}

function QuestionCard({ question, mistakeId }: CardProps) {
  const formula = useFormula(question.formulaId);
  const record = useRecord(question, mistakeId, formula);
  useEffect(() => {
    document.getElementById('work-panel')?.scrollTo({ top: 0 });
  }, [question]);
  return (
    <div>
      {question.kind === 'numeric' && <NumericCard question={question} formula={formula} record={record} />}
      {question.kind === 'mcq' && <McqCard question={question} record={record} />}
      {question.kind === 'recall' && <RecallCard question={question} record={record} />}
      {formula && (
        <p className="mt-3 text-step--1 text-ink-3" data-subject={formula.subject}>
          {getSubject(formula.subject).label} {formula.classLevel}, {topicOf(formula)}
        </p>
      )}
    </div>
  );
}

function NextButton({ afterAnswer }: { afterAnswer: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (afterAnswer) ref.current?.focus({ preventScroll: true });
  }, [afterAnswer]);
  return (
    <button ref={ref} type="button" className="btn btn-solid mt-3 w-full" onClick={nextQuestion}>
      Next question
    </button>
  );
}

type Record = (correct: boolean, quality: Quality, yourAnswer: string, yourAnswerIsLatex?: boolean) => void;

function NumericCard({ question, formula, record }: { question: NumericQuestion; formula: Formula | null; record: Record }) {
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [mark, setMark] = useState<NumericMark | null>(null);
  const [hint, setHint] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus({ preventScroll: true }), []);

  useLayoutEffect(() => {
    if (!mark) return;
    answerFeedback(noticeRef.current, mark.correct);
    if (stepsRef.current) stepsReveal([...stepsRef.current.children]);
  }, [mark]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mark) return;
    const result = markNumeric(question, value, unit);
    setMark(result);
    record(result.correct, result.correct ? QUALITY_CORRECT : QUALITY_WRONG, result.shown);
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <h2 className="work-title">
        Find {question.unknownName} <MathTex latex={question.unknownTex} />
      </h2>
      <dl className="readouts mt-2">
        {question.givens.map((g) => (
          <Fragment key={g.symbol}>
            <dt>
              <MathTex latex={g.symbol} /> {g.name}
            </dt>
            <dd>
              {g.raw}
              {g.unit === 'deg' ? '°' : g.unit ? ` ${unitLabel(g.unit)}` : ''}
            </dd>
          </Fragment>
        ))}
      </dl>

      {!hint && !mark && (
        <button type="button" className="btn btn-quiet -ml-2 mt-1" onClick={() => setHint(true)}>
          <Lightbulb size={15} aria-hidden /> Show the formula
        </button>
      )}
      {(hint || mark) && formula && (
        <div className="math-host mt-2">
          <MathTex latex={formula.latex} />
        </div>
      )}

      <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: question.unit ? 'minmax(0, 1fr) 7rem' : 'minmax(0, 1fr)' }}>
        <div>
          <label className="lbl" htmlFor="answer-value">
            Your answer
          </label>
          <input ref={inputRef} id="answer-value" className="field num" autoComplete="off" spellCheck={false} value={value} disabled={Boolean(mark)} onChange={(e) => setValue(e.target.value)} />
        </div>
        {question.unit && (
          <div>
            <label className="lbl" htmlFor="answer-unit">
              Unit
            </label>
            <select id="answer-unit" className="field" value={unit} disabled={Boolean(mark)} onChange={(e) => setUnit(e.target.value)}>
              <option value="">Choose</option>
              {question.unitChoices.map((u) => (
                <option key={u} value={u}>
                  {unitLabel(u)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!mark && (
        <button type="submit" className="btn btn-solid mt-3 w-full">
          Check answer
        </button>
      )}

      {mark && (
        <>
          <div ref={noticeRef} className="notice" data-tone={mark.correct ? 'good' : 'bad'} role={mark.correct ? 'status' : 'alert'}>
            {mark.correct ? <CircleCheck size={18} aria-hidden /> : <CircleX size={18} aria-hidden />}
            <p>
              {mark.correct ? `Right. ${question.answerText}.` : `Not quite. You gave ${mark.shown}. The answer is ${question.answerText}.`} {mark.reason}
            </p>
          </div>
          <NextButton afterAnswer />
          <StepsList ref={stepsRef} steps={question.steps} />
        </>
      )}
    </form>
  );
}

function McqCard({ question, record }: { question: McqQuestion; record: Record }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => firstRef.current?.focus({ preventScroll: true }), []);

  const choose = (i: number) => {
    if (chosen !== null) return;
    setChosen(i);
    const option = question.options[i];
    record(option.correct, option.correct ? QUALITY_CORRECT : QUALITY_WRONG, option.text ?? option.latex ?? '', !option.text);
  };

  useLayoutEffect(() => {
    if (chosen !== null) answerFeedback(noticeRef.current, question.options[chosen].correct);
  }, [chosen, question]);

  // Number keys choose an option, so the keyboard stays quick.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (chosen === null && n >= 1 && n <= question.options.length && !/^(INPUT|SELECT|TEXTAREA)$/.test((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        choose(n - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const isRight = chosen !== null && question.options[chosen].correct;

  return (
    <div>
      <h2 className="work-title">{question.prompt}</h2>
      {question.promptStructure && <EntryStructures structure={question.promptStructure} scale={1} />}
      {question.promptLatex && (
        <div className="math-host mt-2">
          <MathTex latex={question.promptLatex} />
        </div>
      )}
      <div className="mt-2" role="group" aria-label="Options">
        {question.options.map((option, i) => {
          const state = chosen === null ? undefined : option.correct ? 'right' : chosen === i ? 'wrong' : undefined;
          return (
            <button key={i} ref={i === 0 ? firstRef : undefined} type="button" className="choice" data-state={state} disabled={chosen !== null} onClick={() => choose(i)}>
              <span className="choice-key">{i + 1}</span>
              {option.structure ? <OptionMolecule name={option.structure} /> : option.latex ? <MathTex latex={option.latex} /> : option.text}
              {state === 'right' && <span className="sr-only"> (correct answer)</span>}
              {state === 'wrong' && <span className="sr-only"> (your answer, incorrect)</span>}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <>
          <div ref={noticeRef} className="notice" data-tone={isRight ? 'good' : 'bad'} role={isRight ? 'status' : 'alert'}>
            {isRight ? <CircleCheck size={18} aria-hidden /> : <CircleX size={18} aria-hidden />}
            <p>{isRight ? 'Right.' : 'Not quite. The correct answer is outlined.'}</p>
          </div>
          <NextButton afterAnswer />
        </>
      )}
    </div>
  );
}

function RecallCard({ question, record }: { question: RecallQuestion; record: Record }) {
  const [revealed, setRevealed] = useState(false);
  const [graded, setGraded] = useState(false);
  const revealRef = useRef<HTMLButtonElement>(null);
  const firstGrade = useRef<HTMLButtonElement>(null);

  useEffect(() => revealRef.current?.focus({ preventScroll: true }), []);
  useEffect(() => {
    if (revealed) firstGrade.current?.focus({ preventScroll: true });
  }, [revealed]);

  const grade = (quality: Quality, label: string) => {
    if (graded) return;
    setGraded(true);
    record(quality >= 3, quality, label);
  };

  return (
    <div>
      <h2 className="work-title">Can you recall this?</h2>
      <p className="mt-2 text-step-1 font-semibold">{question.name}</p>
      {question.note && <p className="mt-1 text-ink-2">{question.note}</p>}
      {!revealed ? (
        <button ref={revealRef} type="button" className="btn btn-solid mt-3 w-full" onClick={() => setRevealed(true)}>
          Show the formula
        </button>
      ) : (
        <>
          <div className="big-formula math-host mt-3">
            <MathTex latex={question.latex} />
          </div>
          {!graded ? (
            <>
              <p className="lbl mt-3">How well did you know it?</p>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Rate your recall">
                <button ref={firstGrade} type="button" className="btn btn-line" onClick={() => grade(1, 'Did not recall it')}>
                  Forgot it
                </button>
                <button type="button" className="btn btn-line" onClick={() => grade(3, 'Recalled with difficulty')}>
                  Hard
                </button>
                <button type="button" className="btn btn-line" onClick={() => grade(4, 'Recalled it')}>
                  Knew it
                </button>
                <button type="button" className="btn btn-line" onClick={() => grade(5, 'Recalled it easily')}>
                  Easy
                </button>
              </div>
            </>
          ) : (
            <NextButton afterAnswer />
          )}
        </>
      )}
    </div>
  );
}

function OptionMolecule({ name }: { name: string }) {
  const compound = useStructures()?.[name];
  return compound ? <Molecule compound={compound} scale={0.85} /> : null;
}
