import { Search } from 'lucide-react';
import { getClass, getSubject, splitUnitName, unitTitle } from '../../data/book';
import type { ClassLevel, SubjectId, UnitStatus } from '../../data/types';
import { href } from '../../lib/router';
import { openPalette } from '../../state/ui';

export const STATUS_LABEL: Partial<Record<UnitStatus, string>> = {
  'not-in-syllabus': 'Not in 2028 syllabus',
  supplementary: 'Supplementary',
};

interface Props {
  subject: SubjectId;
  level: ClassLevel;
  unitIndex: number | null;
  subtopicIndex: number | null;
  onNavigate?: () => void;
}

/** The syllabus tree: units with counts, and the open unit's sub-topics. */
export function Contents({ subject, level, unitIndex, subtopicIndex, onNavigate }: Props) {
  const info = getSubject(subject);
  const cls = getClass(subject, level);

  return (
    <>
      <div className="contents-head" data-subject={subject}>
        <div className="contents-title">
          <a href={href(`book/${subject}/${level}`)} className="font-display text-step-2 font-bold no-underline" onClick={onNavigate}>
            {info.label}
          </a>
          <span className="num text-step--1 text-ink-3" title={`ISC paper code ${info.code}`}>
            {info.code}
          </span>
        </div>
        <div className="seg mt-2" role="group" aria-label="Class">
          {info.classes.map((c) => (
            <a key={c.level} href={href(`book/${subject}/${c.level}`)} aria-current={c.level === level ? 'true' : undefined} onClick={onNavigate}>
              Class {c.level}
            </a>
          ))}
        </div>
        <button type="button" className="find-trigger" onClick={openPalette}>
          <Search size={16} aria-hidden /> Find a formula
          <kbd aria-hidden>/</kbd>
        </button>
      </div>
      <nav className="toc" aria-label={`${info.label} Class ${level} contents`} data-subject={subject}>
        {cls?.units.map((unit, i) => {
          const { number } = splitUnitName(unit.name);
          const open = unitIndex === i;
          return (
            <div key={unit.name}>
              <a className="toc-unit" href={href(`book/${subject}/${level}/${i}`)} aria-current={open && subtopicIndex == null ? 'true' : open ? 'true' : undefined} onClick={onNavigate}>
                <span className="toc-num num">{number}</span>
                <span>
                  {unitTitle(unit.name)}
                  {STATUS_LABEL[unit.status] && <span className="status-label block">{STATUS_LABEL[unit.status]}</span>}
                </span>
                <span className="toc-count num">{unit.count}</span>
              </a>
              {open &&
                unit.subtopics.map((sub, j) => (
                  <a key={sub.name} className="toc-sub" href={href(`book/${subject}/${level}/${i}`, { s: String(j) })} aria-current={subtopicIndex === j ? 'true' : undefined} onClick={onNavigate}>
                    <span className="toc-num num">
                      {number}.{j + 1}
                    </span>
                    <span>{sub.name}</span>
                    <span className="toc-count num">{sub.count}</span>
                  </a>
                ))}
            </div>
          );
        })}
      </nav>
    </>
  );
}
