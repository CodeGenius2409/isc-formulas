import { lazy, Suspense, useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { SUBJECT_IDS } from './data/book';
import type { ClassLevel, SubjectId } from './data/types';
import { useMediaQuery } from './lib/hooks';
import { viewEnter } from './lib/motion';
import { closeWork, useRoute, type Route, type WorkTab } from './lib/router';
import { useStore } from './lib/store';
import { lastReadStore } from './state/library';
import { contentsSheetStore, closeContentsSheet, openPalette } from './state/ui';
import { Sheet } from './components/Sheet';
import { BookSheet } from './components/shell/BookSheet';
import { Contents } from './components/shell/Contents';
import { Dock } from './components/shell/Dock';
import { Rail } from './components/shell/Rail';
import { Toast } from './components/shell/Toast';
import { WorkArea } from './components/work/WorkArea';
import { FindPalette } from './components/FindPalette';
import { UpdatePrompt } from './components/UpdatePrompt';
import Home from './views/Home';

const BookContents = lazy(() => import('./views/BookContents'));
const UnitView = lazy(() => import('./views/UnitView'));
const FormulaView = lazy(() => import('./views/FormulaView'));
const Saved = lazy(() => import('./views/Saved'));
const Settings = lazy(() => import('./views/Settings'));
const ProgressView = lazy(() => import('./views/ProgressView'));
const ToolsView = lazy(() => import('./views/ToolsView'));
const SearchView = lazy(() => import('./views/SearchView'));

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
        <UnitView key={`${place.subject}-${place.level}-${place.unitIndex}`} subject={place.subject} level={place.level} unitIndex={place.unitIndex} subtopicIndex={place.subtopicIndex} scrollRef={scrollRef} />
      );
    case 'f':
      return a ? <FormulaView key={a} id={a} /> : <NotFound />;
    case 'saved':
      return <Saved scrollRef={scrollRef} />;
    case 'settings':
      return <Settings />;
    case 'practice':
      return <ProgressView />;
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
  const route = useRoute();
  const last = useStore(lastReadStore);
  const contentsOpen = useStore(contentsSheetStore);
  const fallback = { subject: last?.subject ?? ('physics' as SubjectId), level: last?.classLevel ?? ('XI' as ClassLevel) };
  const place = bookPlace(route, fallback);
  const mainRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const pathKey = route.path.join('/');

  const workBeside = useMediaQuery('(min-width: 1280px)');
  const contentsBeside = useMediaQuery('(min-width: 1024px)');
  const workTab: WorkTab = route.work ?? 'solve';

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
    <div className="shell">
      <a href="#main" className="sr-only-focusable btn btn-solid" style={{ position: 'fixed', zIndex: 50, top: 8, left: 8 }} onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}>
        Skip to content
      </a>
      <Rail route={route} activeSubject={place.inBook ? place.subject : null} />
      {contentsBeside && (
        <div className="contents">
          <Contents subject={place.subject} level={place.level} unitIndex={place.unitIndex} subtopicIndex={place.subtopicIndex} />
        </div>
      )}
      <main id="main" ref={mainRef} tabIndex={-1}>
        <div ref={viewRef}>
          <Suspense fallback={<p className="spinner-line">Opening</p>}>
            <View route={route} place={place} scrollRef={mainRef} />
          </Suspense>
        </div>
      </main>
      {workBeside && (
        <aside className="work" aria-label="Working area">
          <WorkArea route={route} tab={workTab} />
        </aside>
      )}
      {!workBeside && (
        <Sheet open={route.work !== null} onClose={closeWork} label="Working area" className="work">
          <WorkArea route={route} tab={workTab} closable />
        </Sheet>
      )}
      {!contentsBeside && contentsOpen && <BookSheet subject={place.subject} level={place.level} unitIndex={place.unitIndex} subtopicIndex={place.subtopicIndex} />}
      <Dock route={route} />
      <FindPalette />
      <Toast />
      <UpdatePrompt />
    </div>
  );
}
