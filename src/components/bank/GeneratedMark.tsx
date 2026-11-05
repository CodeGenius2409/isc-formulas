import { useId, useState } from 'react';
import { Dices, Flag } from 'lucide-react';
import type { BankItem } from '../../practice/bank/types';
import { reportProblem } from '../../practice/gen/report';

export const GENERATED_NOTICE = 'Generated practice question. This is not an official ISC question and may contain mistakes.';
export const PAPER_NOTICE = 'This paper contains generated questions, marked with a die. They are not official ISC questions and may contain mistakes.';

/** Beside the question number. Bank questions don't get one, so a glance is enough. */
export function GeneratedMark({ item }: { item: BankItem }) {
  if (!item.generated) return null;
  return (
    <span className="gen-mark" data-testid="generated-mark" title={GENERATED_NOTICE}>
      <Dices size={14} aria-hidden /> Generated
      <span className="sr-only">. {GENERATED_NOTICE}</span>
    </span>
  );
}

/** The longer note, for a single question. A paper shows it once at the top instead. */
export function GeneratedNote({ item }: { item: BankItem }) {
  if (!item.generated) return null;
  return (
    <details className="gen-note no-print">
      <summary>What does Generated mean?</summary>
      <p>{GENERATED_NOTICE}</p>
    </details>
  );
}

/** Shown once at the top of a paper with any generated questions, on screen and in print. */
export function PaperLegend() {
  return (
    <p className="gen-legend" data-testid="paper-legend">
      <span className="gen-mark">
        <Dices size={14} aria-hidden /> Generated
      </span>{' '}
      {PAPER_NOTICE}
    </p>
  );
}

/** Saves the question, its seed and a comment on this device. */
export function ReportProblem({ item }: { item: BankItem }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <p className="report-sent no-print" role="status">
        Saved on this device. You can export your reports from Progress.
      </p>
    );
  }
  if (!open) {
    return (
      <button type="button" className="btn btn-quiet report-open no-print" onClick={() => setOpen(true)}>
        <Flag size={14} aria-hidden /> Report a problem
      </button>
    );
  }
  return (
    <div className="report-box no-print">
      <label className="lbl" htmlFor={id}>
        What’s wrong with this question?
      </label>
      <textarea id={id} className="field" rows={2} value={comment} onChange={(e) => setComment(e.target.value)} />
      <div className="mt-1 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-line"
          disabled={!comment.trim()}
          onClick={() => {
            reportProblem(item, comment);
            setSent(true);
          }}
        >
          Save report
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
