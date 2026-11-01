import { X } from 'lucide-react';
import { SUBJECT_IDS, getSubject } from '../../data/book';
import type { ClassLevel, SubjectId } from '../../data/types';
import { href } from '../../lib/router';
import { useStore } from '../../lib/store';
import { classMemoryStore } from '../../state/library';
import { closeContentsSheet, contentsSheetStore } from '../../state/ui';
import { Sheet } from '../Sheet';
import { Contents } from './Contents';
import { THUMB_LABEL } from './Rail';

interface Props {
  subject: SubjectId;
  level: ClassLevel;
  unitIndex: number | null;
  subtopicIndex: number | null;
}

/** The contents as a sheet, for screens with no room for a permanent column. */
export function BookSheet({ subject, level, unitIndex, subtopicIndex }: Props) {
  const open = useStore(contentsSheetStore);
  const memory = useStore(classMemoryStore);
  return (
    <Sheet open={open} onClose={closeContentsSheet} label="Contents" side="left" className="sheet-contents">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center border-b border-rule">
          <nav aria-label="Subjects" className="flex flex-1 gap-1 p-2">
            {SUBJECT_IDS.map((id) => (
              <a
                key={id}
                data-subject={id}
                href={href(`book/${id}/${memory[id] ?? 'XI'}`)}
                aria-current={id === subject ? 'true' : undefined}
                aria-label={getSubject(id).label}
                className="flex h-11 flex-1 items-center justify-center rounded-[3px] font-display font-bold no-underline"
                style={{ background: 'var(--subject)', color: 'var(--on-subject)', outline: id === subject ? '2px solid var(--ink)' : undefined, outlineOffset: 1 }}
              >
                {THUMB_LABEL[id]}
              </a>
            ))}
          </nav>
          <button type="button" className="btn btn-quiet" aria-label="Close contents" onClick={closeContentsSheet}>
            <X size={20} aria-hidden />
          </button>
        </div>
        <div className="contents min-h-0 flex-1" style={{ borderRight: 0 }}>
          <Contents subject={subject} level={level} unitIndex={unitIndex} subtopicIndex={subtopicIndex} onNavigate={closeContentsSheet} />
        </div>
      </div>
    </Sheet>
  );
}
