import { lazy, Suspense, useRef, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { closeWork, openWork, type Route, type WorkTab } from '../../lib/router';

const SolvePane = lazy(() => import('./SolvePane'));
const CheckPane = lazy(() => import('./CheckPane'));
const PracticePane = lazy(() => import('./PracticePane'));

const TABS: { id: WorkTab; label: string }[] = [
  { id: 'solve', label: 'Solve' },
  { id: 'check', label: 'Check units' },
  { id: 'practice', label: 'Practice' },
];

interface Props {
  route: Route;
  tab: WorkTab;
  closable?: boolean;
}

/** The facing page. On wide screens it stays open beside the book. */
export function WorkArea({ route, tab, closable }: Props) {
  const tabsRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab);
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length;
    if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = TABS.length - 1;
    if (next >= 0) {
      e.preventDefault();
      openWork(TABS[next].id);
      tabsRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus();
    }
  };

  return (
    <>
      <div className="work-tabs" role="tablist" aria-label="Working area" ref={tabsRef} onKeyDown={onKeyDown}>
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" id={`work-tab-${t.id}`} aria-selected={tab === t.id} aria-controls="work-panel" tabIndex={tab === t.id ? 0 : -1} className="work-tab" onClick={() => openWork(t.id)}>
            {t.label}
          </button>
        ))}
        {closable && (
          <button type="button" className="work-close" aria-label="Close working area" onClick={closeWork}>
            <X size={20} aria-hidden />
          </button>
        )}
      </div>
      <div className="work-body" role="tabpanel" id="work-panel" aria-labelledby={`work-tab-${tab}`}>
        <Suspense fallback={<p className="text-ink-3">Opening</p>}>
          {tab === 'solve' && <SolvePane formulaId={route.workFormula} />}
          {tab === 'check' && <CheckPane />}
          {tab === 'practice' && <PracticePane formulaId={route.workFormula} />}
        </Suspense>
      </div>
    </>
  );
}
