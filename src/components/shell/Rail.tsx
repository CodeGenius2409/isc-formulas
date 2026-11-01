import { CalendarDays, FlaskConical, ListChecks, PencilRuler, Search, Settings2, Star } from 'lucide-react';
import { SUBJECT_IDS, getSubject } from '../../data/book';
import type { SubjectId } from '../../data/types';
import { href, openWork, type Route } from '../../lib/router';
import { useMediaQuery } from '../../lib/hooks';
import { useStore } from '../../lib/store';
import { classMemoryStore } from '../../state/library';
import { openPalette } from '../../state/ui';

export const THUMB_LABEL: Record<SubjectId, string> = { physics: 'Ph', chemistry: 'Ch', mathematics: 'Ma', computerscience: 'CS' };

interface Props {
  route: Route;
  activeSubject: SubjectId | null;
}

/** The left edge of the book: a thumb index of subjects, then everything else. */
export function Rail({ route, activeSubject }: Props) {
  const memory = useStore(classMemoryStore);
  const workIsSheet = useMediaQuery('(max-width: 1279px)');
  const section = route.path[0] ?? '';
  const link = (target: string) => (section === target ? 'true' : undefined);

  return (
    <div className="rail">
      <nav aria-label="Subjects" className="thumbs">
        {SUBJECT_IDS.map((id) => {
          const subject = getSubject(id);
          return (
            <a key={id} className="thumb" data-subject={id} href={href(`book/${id}/${memory[id] ?? 'XI'}`)} aria-current={activeSubject === id ? 'true' : undefined} aria-label={subject.label} title={subject.label}>
              {THUMB_LABEL[id]}
            </a>
          );
        })}
      </nav>
      <nav aria-label="Main" className="rail-links">
        <a className="rail-link" href={href('')} aria-current={link('')}>
          <CalendarDays size={20} aria-hidden /> Today
        </a>
        <button type="button" className="rail-link" onClick={openPalette} aria-keyshortcuts="/ Control+K Meta+K">
          <Search size={20} aria-hidden /> Find
        </button>
        <a className="rail-link" href={href('saved')} aria-current={link('saved')}>
          <Star size={20} aria-hidden /> Saved
        </a>
        <a className="rail-link" href={href('practice')} aria-current={link('practice')}>
          <ListChecks size={20} aria-hidden /> Progress
        </a>
        <a className="rail-link" href={href('tools')} aria-current={link('tools')}>
          <FlaskConical size={20} aria-hidden /> Tools
        </a>
        {workIsSheet && (
          <button type="button" className="rail-link" onClick={() => openWork('solve')}>
            <PencilRuler size={20} aria-hidden /> Work
          </button>
        )}
        <a className="rail-link" href={href('settings')} aria-current={link('settings')}>
          <Settings2 size={20} aria-hidden /> Settings
        </a>
      </nav>
    </div>
  );
}
