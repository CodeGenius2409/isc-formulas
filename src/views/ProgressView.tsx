import { useEffect, useMemo, useState } from 'react';
import { ListChecks, RotateCcw, Trash2 } from 'lucide-react';
import { RichText } from '../components/bank/RichText';
import { manifest } from '../data/book';
import { isBankId } from '../practice/bank/define';
import { href, openWork } from '../lib/router';
import { useStore } from '../lib/store';
import { deleteMistake, mistakesStore, srsStore, statsStore, today } from '../practice/progress';
import { reviewOrder } from '../practice/srs';
import { startMistakes } from '../practice/session';
import { startReviewNow } from '../practice/session-link';
import { BackupControls } from '../components/BackupControls';
import { Math as MathTex } from '../components/Math';

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ProgressView() {
  const srs = useStore(srsStore);
  const stats = useStore(statsStore);
  const mistakes = useStore(mistakesStore);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    document.title = 'Progress: ISC Formula Book';
  }, []);

  const due = useMemo(() => reviewOrder(Object.values(srs), today()).length, [srs]);
  const learned = useMemo(() => Object.values(srs).filter((i) => i.repetitions >= 2).length, [srs]);
  const seenQuestions = useMemo(() => Object.keys(srs).filter(isBankId).length, [srs]);
  const seen = Object.keys(srs).length - seenQuestions;
  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;

  const topics = useMemo(() => [...new Set(mistakes.filter((m) => !subject || m.subject === subject).map((m) => m.topic))].sort(), [mistakes, subject]);

  const shown = useMemo(
    () => mistakes.filter((m) => (showResolved || !m.resolved) && (!subject || m.subject === subject) && (!topic || m.topic === topic)),
    [mistakes, subject, topic, showResolved],
  );
  const openShown = shown.filter((m) => !m.resolved);

  const retryShown = () => {
    const ids = new Set(openShown.map((m) => m.id));
    startMistakes((id) => ids.has(id));
    openWork('practice');
  };

  return (
    <div className="page">
      <div className="page-pad max-w-[48rem]">
        <h1 className="text-step-3">Progress</h1>
        <p className="stat-line mt-2">
          <span><b>{seen}</b> {seen === 1 ? 'formula' : 'formulas'} practised</span>
          <span><b>{seenQuestions}</b> exam {seenQuestions === 1 ? 'question' : 'questions'} practised</span>
          <span><b>{learned}</b> learned</span>
          <span><b>{due}</b> due today</span>
          {stats.answered > 0 && <span><b>{accuracy}%</b> right over {stats.answered} answers</span>}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-solid"
            disabled={!due}
            onClick={startReviewNow}
          >
            <ListChecks size={16} aria-hidden /> {due ? `Review ${due} due` : 'Nothing due'}
          </button>
          <a className="btn btn-line" href={href('paper')}>
            Build a mock paper
          </a>
        </div>

        <section className="today-section" aria-labelledby="mistakes-h">
          <h2 id="mistakes-h">Mistakes</h2>
          {mistakes.length === 0 ? (
            <p className="empty">No mistakes logged. Every wrong answer lands here, so you can retry it later.</p>
          ) : (
            <>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="lbl" htmlFor="m-subject">
                    Subject
                  </label>
                  <select
                    id="m-subject"
                    className="field"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      setTopic('');
                    }}
                  >
                    <option value="">All subjects</option>
                    {manifest.subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="lbl" htmlFor="m-topic">
                    Topic
                  </label>
                  <select id="m-topic" className="field" value={topic} onChange={(e) => setTopic(e.target.value)}>
                    <option value="">All topics</option>
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="mt-2 flex items-center gap-2">
                <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} /> Include mistakes I have since got right
              </label>
              <button type="button" className="btn btn-line mt-2" disabled={!openShown.length} onClick={retryShown}>
                <RotateCcw size={16} aria-hidden /> {openShown.length ? `Retry these ${openShown.length}` : 'Nothing to retry'}
              </button>

              {shown.length === 0 && <p className="empty">No mistakes match this filter.</p>}
              <ul className="m-0 mt-2 list-none p-0">
                {shown.slice(0, 200).map((m) => (
                  <li key={m.id} className="mistake" data-subject={m.subject || undefined}>
                    <div className="flex items-start justify-between gap-2">
                      {isBankId(m.formulaId) ? (
                        <span className="font-semibold">{m.formulaName}</span>
                      ) : (
                        <a href={href(`f/${m.formulaId}`)} className="font-semibold">
                          {m.formulaName}
                        </a>
                      )}
                      <button type="button" className="btn btn-quiet flex-none" aria-label={`Delete this mistake about ${m.formulaName}`} onClick={() => deleteMistake(m.id)}>
                        <Trash2 size={15} aria-hidden />
                      </button>
                    </div>
                    {isBankId(m.formulaId) ? <RichText text={m.asked} className="mt-1" /> : <p className="mt-1">{m.asked}</p>}
                    <p className="mt-1 text-bad">
                      You answered: {m.yourAnswerIsLatex ? <MathTex latex={m.yourAnswer} /> : m.yourAnswer}
                    </p>
                    <p className="text-good">
                      Correct answer: {m.correctAnswerIsLatex ? <MathTex latex={m.correctAnswer} /> : isBankId(m.formulaId) ? <RichText text={m.correctAnswer} className="rich-inline" /> : m.correctAnswer}
                    </p>
                    <p className="mt-1 text-step--1 text-ink-3">
                      {m.topic}, {DATE.format(new Date(m.date))}
                      {m.resolved ? '. Since got right.' : ''}
                    </p>
                  </li>
                ))}
              </ul>
              {shown.length > 200 && <p className="mt-2 text-ink-2">Showing the latest 200 of {shown.length}. Filter to see the rest.</p>}
            </>
          )}
        </section>

        <BackupControls />

        <section className="today-section" aria-labelledby="how-h">
          <h2 id="how-h">How reviews are scheduled</h2>
          <p className="mt-2 max-w-[65ch] text-ink-2">
            Reviews use the SM-2 method. Each right answer spaces the next review further out: one day, then six, then longer each time. Anything you miss comes back the same day and starts again, and what you find harder comes back more often. A written answer you mark yourself counts as missed if it earned half the marks or less.
          </p>
        </section>
      </div>
    </div>
  );
}
