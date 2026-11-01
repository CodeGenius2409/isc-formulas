import { BookOpen, CalendarDays, FlaskConical, PencilRuler, Search } from 'lucide-react';
import { href, openWork, type Route } from '../../lib/router';
import { openContentsSheet, openPalette } from '../../state/ui';

/** Phone navigation, at the bottom of the screen where a thumb can reach it. */
export function Dock({ route }: { route: Route }) {
  const section = route.path[0] ?? '';
  return (
    <nav className="dock" aria-label="Main">
      <a className="dock-item" href={href('')} aria-current={section === '' ? 'true' : undefined}>
        <CalendarDays size={21} aria-hidden /> Today
      </a>
      <button type="button" className="dock-item" onClick={openContentsSheet} aria-current={section === 'book' ? 'true' : undefined}>
        <BookOpen size={21} aria-hidden /> Book
      </button>
      <button type="button" className="dock-item" onClick={openPalette}>
        <Search size={21} aria-hidden /> Find
      </button>
      <button type="button" className="dock-item" onClick={() => openWork('solve')} aria-current={route.work ? 'true' : undefined}>
        <PencilRuler size={21} aria-hidden /> Work
      </button>
      <a className="dock-item" href={href('tools')} aria-current={section === 'tools' ? 'true' : undefined}>
        <FlaskConical size={21} aria-hidden /> Tools
      </a>
    </nav>
  );
}
