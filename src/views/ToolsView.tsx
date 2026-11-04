import { lazy, Suspense, useEffect, useMemo } from 'react';
import { retryImport } from '../lib/retry-import';
import { ArrowLeft } from 'lucide-react';
import { manifest } from '../data/book';
import { href } from '../lib/router';
import { SIM_ALIASES, SIMS } from '../sims/registry';

export default function ToolsView({ toolId }: { toolId: string | null }) {
  const id = toolId ? (SIM_ALIASES[toolId] ?? toolId) : null;
  const sim = id ? SIMS.find((s) => s.id === id) : null;

  useEffect(() => {
    document.title = sim ? `${sim.title}: ISC Formula Book` : 'Tools: ISC Formula Book';
  }, [sim]);

  if (toolId && !sim) {
    return (
      <div className="page-pad">
        <h1 className="text-step-3">No tool called "{toolId}"</h1>
        <p className="mt-2">
          <a href={href('tools')}>See all tools</a>
        </p>
      </div>
    );
  }
  if (sim) return <ToolPage key={sim.id} simId={sim.id} />;

  return (
    <div className="page">
      <div className="page-pad">
        <h1 className="text-step-3">Tools</h1>
        <p className="mt-1 text-ink-2">Simulators and calculators. All of them work offline.</p>
        {manifest.subjects.map((subject) => (
          <section key={subject.id} className="today-section" data-subject={subject.id} aria-labelledby={`tools-${subject.id}`}>
            <h2 id={`tools-${subject.id}`} style={{ color: 'var(--subject)' }}>
              {subject.label}
            </h2>
            <div className="tool-index">
              {SIMS.filter((s) => s.subject === subject.id).map((s) => (
                <a key={s.id} className="tool-link" href={href(`tools/${s.id}`)}>
                  <b>{s.title}</b>
                  <span>{s.desc}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function ToolPage({ simId }: { simId: string }) {
  const sim = SIMS.find((s) => s.id === simId)!;
  const Component = useMemo(() => lazy(() => retryImport(() => sim.load()).then((c) => ({ default: c }))), [sim]);
  return (
    <div className="page" data-subject={sim.subject}>
      <div className="page-pad">
        <a className="btn btn-quiet -ml-2" href={href('tools')}>
          <ArrowLeft size={16} aria-hidden /> All tools
        </a>
        <h1 className="mt-1 text-step-3" style={{ color: 'var(--subject)' }}>
          {sim.title}
        </h1>
        <p className="mb-4 mt-1 text-ink-2">{sim.desc}</p>
        <Suspense fallback={<p className="text-ink-3">Opening</p>}>
          <Component />
        </Suspense>
      </div>
    </div>
  );
}
