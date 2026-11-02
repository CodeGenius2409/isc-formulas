import { useState } from 'react';
import { loadSyllabus, syllabusUnit } from '../data/syllabus';
import type { ClassLevel, SubjectId, SyllabusUnit } from '../data/types';

interface Props {
  subject: SubjectId;
  level: ClassLevel;
  /** The unit's official number. */
  number: number;
}

/** The official wording for this unit. Loads when opened, as most readers never will. */
export function SyllabusNote({ subject, level, number }: Props) {
  const [unit, setUnit] = useState<SyllabusUnit | null>(null);
  const [edition, setEdition] = useState('');

  const onToggle = (open: boolean) => {
    if (!open || unit) return;
    void loadSyllabus(subject).then(
      (syllabus) => {
        setUnit(syllabusUnit(syllabus, level, number) ?? null);
        setEdition(syllabus.edition);
      },
      () => undefined,
    );
  };

  return (
    <details className="syllabus-note no-print" onToggle={(e) => onToggle(e.currentTarget.open)}>
      <summary>Syllabus</summary>
      {unit && (
        <div className="syllabus-body">
          {unit.topics.map((topic) => (
            <p key={topic.key}>
              <b>{topic.name}.</b> {topic.wording}
            </p>
          ))}
          <p className="syllabus-source">{edition}</p>
        </div>
      )}
    </details>
  );
}
