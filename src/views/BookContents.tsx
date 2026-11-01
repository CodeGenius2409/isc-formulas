import { getClass, getSubject, splitUnitName, unitTitle } from '../data/book';
import type { ClassLevel, SubjectId } from '../data/types';
import { href } from '../lib/router';
import { STATUS_LABEL } from '../components/shell/Contents';

export default function BookContents({ subject, level }: { subject: SubjectId; level: ClassLevel }) {
  const info = getSubject(subject);
  const cls = getClass(subject, level);
  if (!cls) return <div className="page-pad">No Class {level} contents for {info.label}.</div>;
  return (
    <div className="page" data-subject={subject}>
      <div className="page-pad">
        <h1 className="text-step-3" style={{ color: 'var(--subject)' }}>
          {info.label}, Class {level}
        </h1>
        <p className="mt-1 text-ink-2">
          Paper {info.code}. {cls.count.toLocaleString('en-GB')} formulas in {cls.units.length} units.
        </p>
        <div className="seg mt-3" role="group" aria-label="Class">
          {info.classes.map((c) => (
            <a key={c.level} href={href(`book/${subject}/${c.level}`)} aria-current={c.level === level ? 'true' : undefined}>
              Class {c.level}
            </a>
          ))}
        </div>
        <nav aria-label="Units" className="mt-5">
          {cls.units.map((unit, i) => (
            <a key={unit.name} className="leaders" href={href(`book/${subject}/${level}/${i}`)}>
              <span className="lnum num">{splitUnitName(unit.name).number}</span>
              <span className="ltitle">
                {unitTitle(unit.name)}
                {STATUS_LABEL[unit.status] && <span className="status-label block">{STATUS_LABEL[unit.status]}</span>}
              </span>
              <span className="fill" aria-hidden />
              <span className="lcount num">{unit.count}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
