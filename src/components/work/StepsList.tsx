import { forwardRef } from 'react';
import type { Step } from '../../solver/solve';
import { Math as MathTex } from '../Math';

/** Worked solution, set like working in an exercise book. */
export const StepsList = forwardRef<HTMLOListElement, { steps: Step[] }>(function StepsList({ steps }, ref) {
  return (
    <ol className="steps list-none p-0" ref={ref} aria-label="Worked solution" tabIndex={-1}>
      {steps.map((step, i) => (
        <li className="step" key={`${step.label}${i}`}>
          <div className="step-num">{i + 1}</div>
          <div className="step-body">
            <div className="step-label">{step.label}</div>
            {step.math.map((line) => (
              <div className="step-math math-host" key={line}>
                <MathTex latex={line} />
              </div>
            ))}
            {step.note && <div className="step-note">{step.note}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
});
