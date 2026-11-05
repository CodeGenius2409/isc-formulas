import { ensureCustomLoaded } from './custom/store';
import { Suspense, useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { lazyRetry } from './lib/retry-import';
import { SUBJECT_IDS } from './data/book';
import type { ClassLevel, SubjectId } from './data/types';
import { useMediaQuery } from './lib/hooks';
import { viewEnter } from './lib/motion';
import { closeWork, useRoute, workState, type Route } from './lib/router';
import { useStore } from './lib/store';
import { lastReadStore, rememberPlace } from './state/library';
import { contentsSheetStore, closeContentsSheet, openPalette, paletteStore } from './state/ui';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sheet } from './components/Sheet';
import { BookSheet } from './components/shell/BookSheet';
import { Contents } from './components/shell/Contents';
import { Dock } from './components/shell/Dock';
import { Rail } from './components/shell/Rail';
import { Toast } from './components/shell/Toast';
import { WorkArea } from './components/work/WorkArea';
import { UpdatePrompt } from './components/UpdatePrompt';
import Home from './views/Home';

const BookContents = lazyRetry(() => import('./views/BookContents'));
const UnitView = lazyRetry(() => import('./views/UnitView'));
const FormulaView = lazyRetry(() => import('./views/FormulaView'));
const Saved = lazyRetry(() => import('./views/Saved'));
const Settings = lazyRetry(() => import('./views/Settings'));
const ProgressView = lazyRetry(() => import('./views/ProgressView'));
const PaperView = lazyRetry(() => import('./views/PaperView'));
const MyFormulas = lazyRetry(() => import('./views/MyFormulas'));
const FormulaEditor = lazyRetry(() => import('./views/FormulaEditor'));
const ToolsView = lazyRetry(() => import('./views/ToolsView'));
const GeneratorView = lazyRetry(() => import('./views/GeneratorView'));
const SearchView = lazyRetry(() => import('./views/SearchView'));
const FindPalette = lazyRetry<object>(() => import('./components/FindPalette').then((m) => ({ default: m.FindPalette })));

interface BookPlace {
  subject: SubjectId;
  level: ClassLevel;
  unitIndex: number | null;
  subtopicIndex: number | null;
  inBook: boolean;
}

function isSubject(value: string | undefined): value is SubjectId {
  return SUBJECT_IDS.includes(value as SubjectId);
}

function readInt(value: string | null | undefined): number | null {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

/** Where the contents should point, even on pages outside the book. */
function bookPlace(route: Route, fallback: { subject: SubjectId; level: ClassLevel }): BookPlace {
  if (route.path[0] === 'book' && isSubject(route.path[1])) {
    return {
      subject: route.path[1],
      level: route.path[2] === 'XII' ? 'XII' : 'XI',
      unitIndex: readInt(route.path[3]),
      subtopicIndex: readInt(route.query.get('s')),
      inBook: true,
    };
  }
  return { ...fallback, unitIndex: null, subtopicIndex: null, inBook: false };
}

function View({ route, place, scrollRef }: { route: Route; place: BookPlace; scrollRef: RefObject<HTMLElement | null> }) {
  const [section, a] = route.path;
  switch (section) {
    case undefined:
      return <Home />;
    case 'book':
      if (!place.inBook) return <NotFound />;
      return place.unitIndex == null ? (
        <BookContents subject={place.subject} level={place.level} />
      ) : (
        <UnitView key={`${place.subject}-${place.level}-${place.unitIndex}`} subject={place.subject} level={place.level} unitIndex={place.unitIndex} subtopicIndex={place.subtopicIndex} navigation={route.navigation} scrollRef={scrollRef} />
      );
    case 'f':
      return a ? <FormulaView key={a} id={a} /> : <NotFound />;
    case 'saved':
      return <Saved scrollRef={scrollRef} />;
    case 'settings':
      return <Settings />;
    case 'practice':
      return <ProgressView />;
    case 'paper':
      return <PaperView />;
    case 'generate':
      return <GeneratorView />;
    case 'mine':
      if (a === 'new') return <FormulaEditor key="new" editId={null} />;
      if (a === 'edit' && route.path[2]) return <FormulaEditor key={route.path[2]} editId={route.path[2]} />;
      return <MyFormulas scrollRef={scrollRef} />;
    case 'tools':
      return <ToolsView toolId={a ?? null} />;
    case 'find':
      return <SearchView scrollRef={scrollRef} />;
    default:
      return <NotFound />;
  }
}

function NotFound() {
  return (
    <div className="page-pad">
      <h1 className="text-step-3">This page is not in the book</h1>
      <p className="mt-2 text-ink-2">
        The link may be mistyped. <a href="#/">Go to Today</a>.
      </p>
    </div>
  );
}

export function App() {
  useEffect(() => {
    void ensureCustomLoaded();
  }, []);
  const route = useRoute();
  const last = useStore(lastReadStore);
  const contentsOpen = useStore(contentsSheetStore);
  const paletteOpen = useStore(paletteStore);
  const paletteUsed = useRef(false);
  paletteUsed.current ||= paletteOpen;
  const fallback = { subject: last?.subject ?? ('physics' as SubjectId), level: last?.classLevel ?? ('XI' as ClassLevel) };
  const place = bookPlace(route, fallback);
  const mainRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const pathKey = route.path.join('/');

  // Where you are in the book, so that adding a formula starts there, even from a page outside it.
  useEffect(() => {
    if (place.inBook) rememberPlace(place.subject, place.level);
  }, [place.inBook, place.subject, place.level]);

  // A simulator needs the room more than it needs the book beside it.
  const wideTool = route.path[0] === 'tools' && route.path[1] !== undefined;
  const workBeside = useMediaQuery('(min-width: 80em)') && !wideTool;
  const contentsBeside = useMediaQuery('(min-width: 64em)') && !wideTool;
  const workTab = workState(route).tab;

  // Keys typed into a form must stay in the form.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openPalette();
        return;
      }
      const el = e.target as HTMLElement | null;
      const typing = el?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? '');
      if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        openPalette();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // A new page starts at the top, and focus moves to it for keyboard and screen-reader users.
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    closeContentsSheet();
    mainRef.current?.focus({ preventScroll: true });
    viewEnter(viewRef.current);
    if (route.path.length === 0) document.title = 'Today: ISC Formula Book';
    // Only when the page itself changes, not when the working area changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathKey]);

  return (
    <div className="shell" data-wide={wideTool || undefined}>
      <a href="#main" className="sr-only-focusable btn btn-solid" style={{ position: 'fixed', zIndex: 50, top: 8, left: 8 }} onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}>
        Skip to content
      </a>
      <Rail route={route} activeSubject={place.inBook ? place.subject : null} />
      {contentsBeside && (
        <aside className="toc-col" aria-label="Book contents">
          <Contents subject={place.subject} level={place.level} unitIndex={place.unitIndex} subtopicIndex={place.subtopicIndex} />
        </aside>
      )}
      <main id="main" ref={mainRef} tabIndex={-1}>
        <div ref={viewRef}>
          <ErrorBoundary resetKey={pathKey}>
            <Suspense fallback={<p className="spinner-line">Opening</p>}>
              <View route={route} place={place} scrollRef={mainRef} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
      {workBeside && (
        <aside className="work" aria-label="Working area">
          <ErrorBoundary label="The working area" resetKey={workTab}>
            <WorkArea route={route} tab={workTab} />
          </ErrorBoundary>
        </aside>
      )}
      {!workBeside && (
        <Sheet open={route.work !== null} onClose={closeWork} label="Working area" className="work">
          <ErrorBoundary label="The working area" resetKey={workTab}>
            <WorkArea route={route} tab={workTab} closable />
          </ErrorBoundary>
        </Sheet>
      )}
      {!contentsBeside && contentsOpen && <BookSheet subject={place.subject} level={place.level} unitIndex={place.unitIndex} subtopicIndex={place.subtopicIndex} />}
      <Dock route={route} />
      {paletteUsed.current && (
        <ErrorBoundary label="Find">
          <Suspense fallback={null}>
            <FindPalette />
          </Suspense>
        </ErrorBoundary>
      )}
      <Toast />
      <UpdatePrompt />
    </div>
  );
}
