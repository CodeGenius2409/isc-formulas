import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Wand2 } from 'lucide-react';
import { BankInputs, BankPrompt, BankReview, marksLabel } from '../components/bank/BankParts';
import { GeneratedMark, PaperLegend, ReportProblem } from '../components/bank/GeneratedMark';
import { ShareSlider } from '../components/bank/ShareSlider';
import { manifest, getSubject } from '../data/book';
import type { ClassLevel, SubjectId } from '../data/types';
import { useAsync } from '../lib/hooks';
import { href, openWork, useRoute } from '../lib/router';
import { useStore } from '../lib/store';
import { isAttempted, scoreOf } from '../practice/bank/mark';
import { loadBank } from '../practice/bank';
import { abandonPaper, answerPaper, finishMarking, PAPER_MINUTES, paperHistoryStore, paperResult, paperSlots, paperSpec, paperStore, startPaper, submitPaper, type Paper, type PaperResult } from '../practice/bank/paper';
import { markFigures, paperDiagramsStore, type FigureMark } from '../practice/gen/figures';
import { describePlan, paperShareStore, paperUsesGeneratedStore, planShare } from '../practice/gen/mix';
import { SimPanel } from '../components/bank/SimPanel';
import type { BankAnswer, BankItem } from '../practice/bank/types';
import { lastReadStore } from '../state/library';

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function PaperView() {
  const paper = useStore(paperStore);
  const [result, setResult] = useState<PaperResult | null>(null);

  useEffect(() => {
    document.title = 'Mock paper: ISC Formula Book';
  }, []);

  useEffect(() => {
    if (paper && !result) document.getElementById('main')?.scrollTo({ top: 0 });
    // A move between stages starts at the top. Answering doesn't.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paper?.startedAt, paper?.submittedAt]);

  if (paper) return <PaperSheet paper={paper} onFinished={setResult} />;
  if (result) return <Finished result={result} onAnother={() => setResult(null)} />;
  return <PaperHome />;
}

function PaperHome() {
  const last = useStore(lastReadStore);
  const history = useStore(paperHistoryStore);
  const route = useRoute();
  const q = route.query;
  const linkedSeed = q.get('seed') ? Number(q.get('seed')) : undefined;
  const [subject, setSubject] = useState<SubjectId>((q.get('subject') as SubjectId | null) ?? last?.subject ?? 'physics');
  const [level, setLevel] = useState<ClassLevel>((q.get('level') as ClassLevel | null) ?? last?.classLevel ?? 'XII');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');
  const spec = useMemo(() => paperSpec(subject, level), [subject, level]);
  const useGenerated = useStore(paperUsesGeneratedStore);
  const share = useStore(paperShareStore);
  const diagrams = useStore(paperDiagramsStore);
  const bank = useAsync(() => loadBank(subject, level), `${subject}-${level}`);
  const plan = bank.status === 'ready' ? planShare(paperSlots(subject, level, bank.value), useGenerated ? share : 0) : null;
  // Nothing can rule out the bank running short, even with the switch off.
  const needsGenerated = !useGenerated && Boolean(plan?.raised);

  const start = async (seed?: number, shareOverride?: number) => {
    setBusy(true);
    setProblem('');
    try {
      await startPaper(subject, level, { share: shareOverride ?? (useGenerated ? (plan?.share ?? share) : needsGenerated ? plan!.share : 0), seed, diagrams });
    } catch (e) {
      setProblem(e instanceof Error ? e.message : 'The paper could not be built.');
    }
    setBusy(false);
  };

  return (
    <div className="page">
      <div className="page-pad max-w-[48rem]">
        <h1 className="text-step-3">Build a mock paper</h1>
        <p className="mt-2 max-w-[65ch] text-ink-2">Three hours, with the same sections and marks as the real paper. The questions are written for this app in the style of past papers, not copied from them. Numericals get fresh values each time. When you hand it in, you mark the written answers against the marking scheme and see how you did in each topic.</p>
        <p className="mt-2">
          <a className="text-action" href={href('generate')}>
            <Wand2 size={15} aria-hidden className="inline" /> Generate questions, for teachers and for worksheets
          </a>
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            <label className="lbl" htmlFor="paper-subject">
              Subject
            </label>
            <select id="paper-subject" className="field" value={subject} onChange={(e) => setSubject(e.target.value as SubjectId)}>
              {manifest.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="paper-class">
              Class
            </label>
            <select id="paper-class" className="field" value={level} onChange={(e) => setLevel(e.target.value as ClassLevel)}>
              <option value="XI">Class XI</option>
              <option value="XII">Class XII</option>
            </select>
          </div>
        </div>

        <section className="today-section" aria-labelledby="paper-shape-h">
          <h2 id="paper-shape-h">This paper: {spec.total} marks, {PAPER_MINUTES / 60} hours</h2>
          <ul className="m-0 mt-2 list-none p-0">
            {spec.sections.map((s) => (
              <li key={s.name} className="border-b border-rule py-2">
                <span className="font-semibold">{s.name}.</span> {s.note}
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <label className="switch-row">
              <input type="checkbox" checked={useGenerated} onChange={(e) => paperUsesGeneratedStore.set(e.target.checked)} /> Use generated questions
            </label>
            {useGenerated && plan && <ShareSlider value={share} onChange={(v) => paperShareStore.set(v)} message={describePlan(plan)} warning={plan.raised} />}
            {!useGenerated && <p className="mt-1 text-step--1 text-ink-2">{needsGenerated && plan ? plan.raised : 'This paper will use only questions from the bank.'}</p>}
            <label className="switch-row mt-2">
              <input type="checkbox" checked={diagrams} onChange={(e) => paperDiagramsStore.set(e.target.checked)} /> Include diagrams
            </label>
          </div>
          {linkedSeed !== undefined ? (
            <button type="button" className="btn btn-solid mt-3" disabled={busy} onClick={() => void start(linkedSeed, Number(q.get('share') ?? 0))}>
              {busy ? 'Building the paper' : 'Open the linked paper'}
            </button>
          ) : (
            <button type="button" className="btn btn-solid mt-3" disabled={busy} onClick={() => void start()}>
              {busy ? 'Building the paper' : 'Start the paper'}
            </button>
          )}
          {problem && (
            <p className="mt-2 text-bad" role="alert">
              {problem}
            </p>
          )}
        </section>

        {history.length > 0 && (
          <section className="today-section" aria-labelledby="paper-past-h">
            <h2 id="paper-past-h">Past papers</h2>
            <ul className="m-0 mt-2 list-none p-0">
              {history.map((r) => (
                <li key={r.date} className="border-b border-rule py-2">
                  <details>
                    <summary>
                      {getSubject(r.subject).label} {r.level}: <span className="num font-semibold">{r.got}</span> of <span className="num">{r.total}</span>, {DATE.format(new Date(r.date))}
                    </summary>
                    <ResultTables result={r} />
                    {r.seed !== undefined && (
                      <a className="btn btn-line mt-2" href={href('paper', { subject: r.subject, level: r.level, seed: String(r.seed), share: String(r.generatedShare ?? 0) })}>
                        Sit this paper again
                      </a>
                    )}
                  </details>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

const clock = (ms: number): string => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/** Its own component, so that a tick redraws this and nothing else. */
function Timer({ endsAt }: { endsAt: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= endsAt) submitPaper(true);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);
  return (
    <span className="num font-semibold" role="timer" aria-label="Time left">
      {clock(endsAt - now)}
    </span>
  );
}

const PaperQuestion = memo(function PaperQuestion({ item, number, answer, marking, figure }: { item: BankItem; number: number; answer: BankAnswer | undefined; marking: boolean; figure: FigureMark | undefined }) {
  const current = answer ?? {};
  const onChange = (change: Partial<BankAnswer>) => answerPaper(item.id, change);
  return (
    <li className="paper-question" id={`pq-${item.id}`} data-generated={item.generated ? true : undefined}>
      <p className="bank-meta">
        <span className="font-semibold">Question {number}</span>
        <GeneratedMark item={item} />
        <span className="bank-marks">{marking ? `${scoreOf(item, current)} of ${item.marks}` : `[${item.marks}]`}</span>
      </p>
      <BankPrompt item={item} figure={figure ?? 'none'} />
      <BankInputs item={item} answer={current} onChange={onChange} marked={marking} />
      {marking && <BankReview item={item} answer={current} onChange={onChange} />}
      {marking && item.simulator && <SimPanel simulator={item.simulator} answered />}
      <ReportProblem item={item} />
    </li>
  );
});

function PaperSheet({ paper, onFinished }: { paper: Paper; onFinished: (result: PaperResult) => void }) {
  const marking = Boolean(paper.submittedAt);
  const [confirming, setConfirming] = useState(false);
  const label = `${getSubject(paper.subject).label} ${paper.level}`;

  // Time may have run out while the app was closed.
  useEffect(() => {
    if (!paper.submittedAt && Date.now() >= paper.endsAt) submitPaper(true);
  }, [paper.endsAt, paper.submittedAt]);

  const items = paper.sections.flatMap((s) => s.questions.map((q) => q.item));
  const figures = useMemo(() => markFigures(items, paper.diagrams !== false), [paper.startedAt, paper.diagrams]); // eslint-disable-line react-hooks/exhaustive-deps
  const toAnswer = items.filter((i) => i.form !== 'theory');
  const unanswered = toAnswer.filter((i) => !isAttempted(i, paper.answers[i.id])).length;
  const result = marking ? paperResult(paper) : null;
  const anyGenerated = items.some((i) => i.generated);
  let number = 0;

  return (
    <div className="page" data-subject={paper.subject}>
      <div className="paper-bar no-print">
        <span className="font-semibold">{label} mock paper</span>
        {marking ? (
          <span>
            <span className="num font-semibold">{result!.got}</span> of <span className="num">{result!.total}</span> so far
          </span>
        ) : (
          <Timer endsAt={paper.endsAt} />
        )}
      </div>
      <div className="page-pad max-w-[48rem]">
        <h1 className="text-step-3">{marking ? 'Mark your paper' : `${label}, ${paper.total} marks`}</h1>
        {marking ? (
          <p className="mt-2 max-w-[65ch] text-ink-2">
            {paper.timedOut ? 'Time is up, so the paper was handed in. ' : ''}Multiple choice, numericals and program output are already marked. For each written answer, tick the points you earned, then finish below.
          </p>
        ) : (
          <p className="mt-2 max-w-[65ch] text-ink-2">Write theory answers on paper. Your work is saved as you go, so you can leave and come back, but the clock keeps running.</p>
        )}
        {anyGenerated && <PaperLegend />}

        {paper.sections.map((section) => (
          <section key={section.name} className="today-section" aria-label={section.name}>
            <h2>{section.name}</h2>
            <p className="mt-1 text-ink-2">{section.note}{section.choose ? ' Your best two count.' : ''}</p>
            <ol className="m-0 list-none p-0">
              {section.questions.map((q) => {
                number += 1;
                return <PaperQuestion key={q.item.id} item={q.item} number={number} answer={paper.answers[q.item.id]} marking={marking} figure={figures.get(q.item.id)} />;
              })}
            </ol>
          </section>
        ))}

        <div className="mt-4 flex flex-wrap gap-2 no-print">
          {marking ? (
            <button type="button" className="btn btn-solid" onClick={() => {
              const finished = finishMarking();
              if (finished) onFinished(finished);
            }}>
              Finish marking
            </button>
          ) : confirming ? (
            <>
              <p className="w-full" role="status">{unanswered > 0 ? `${unanswered} ${unanswered === 1 ? 'answer is' : 'answers are'} still blank. ` : ''}Hand in now? You can't change answers afterwards.</p>
              <button type="button" className="btn btn-solid" onClick={() => submitPaper()}>
                Hand in the paper
              </button>
              <button type="button" className="btn btn-line" onClick={() => setConfirming(false)}>
                Keep writing
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-solid" onClick={() => setConfirming(true)}>
                Hand in
              </button>
              <button type="button" className="btn btn-quiet" onClick={abandonPaper}>
                Abandon this paper
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultTables({ result }: { result: PaperResult }) {
  return (
    <>
      <h3 className="mt-3 font-semibold">By section</h3>
      <table className="paper-table">
        <thead>
          <tr>
            <th scope="col">Section</th>
            <th scope="col">Marks</th>
          </tr>
        </thead>
        <tbody>
          {result.sections.map((s) => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td className="num">{s.got} of {s.outOf}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="mt-3 font-semibold">By topic, weakest first</h3>
      <table className="paper-table">
        <thead>
          <tr>
            <th scope="col">Topic</th>
            <th scope="col">Marks</th>
          </tr>
        </thead>
        <tbody>
          {result.topics.map((t) => (
            <tr key={`${t.unit}${t.topic}`}>
              <td>
                {t.topic}
                <span className="block text-step--1 text-ink-3">{t.unit}</span>
              </td>
              <td className="num">{t.got} of {t.outOf}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function Finished({ result, onAnother }: { result: PaperResult; onAnother: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <div className="page">
      <div className="page-pad max-w-[48rem]">
        <h1 ref={heading} tabIndex={-1} className="text-step-3">
          {getSubject(result.subject).label} {result.level}: {result.got} of {result.total}
        </h1>
        <p className="mt-2 text-ink-2">
          {marksLabel(result.got)} in {result.minutes} {result.minutes === 1 ? 'minute' : 'minutes'}. Questions you lost marks on are in your mistakes, and come back in review sooner.
        </p>
        <ResultTables result={result} />
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn btn-solid" onClick={() => openWork('practice')}>
            Review my mistakes
          </button>
          <button type="button" className="btn btn-line" onClick={onAnother}>
            Build another paper
          </button>
        </div>
      </div>
    </div>
  );
}
