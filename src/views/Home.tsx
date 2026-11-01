import { manifest, unitTitle } from '../data/book';
import { href } from '../lib/router';
import { useStore } from '../lib/store';
import { lastReadStore, recentsStore } from '../state/library';
import { AnimatedContent } from '../components/AnimatedContent';
import { OfflineLine } from '../components/OfflineStatus';
import { RecentFormulas } from '../components/RecentFormulas';
import { ReviewQueue } from '../components/ReviewQueue';

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

export default function Home() {
  const last = useStore(lastReadStore);
  const recents = useStore(recentsStore);

  return (
    <div className="page">
      <div className="page-pad">
        <AnimatedContent>
          <h1 className="today-date">{DATE_FORMAT.format(new Date())}</h1>
          <OfflineLine />

          <ReviewQueue />

          {last && (
            <section className="today-section" aria-labelledby="continue-h">
              <h2 id="continue-h">Continue reading</h2>
              <a className="leaders" data-subject={last.subject} href={href(`book/${last.subject}/${last.classLevel}/${last.unitIndex ?? 0}`, last.subtopicIndex != null ? { s: String(last.subtopicIndex) } : undefined)}>
                <span className="ltitle font-semibold" style={{ color: 'var(--subject)' }}>
                  {unitTitle(last.unit)}
                </span>
                <span className="fill" aria-hidden />
                <span className="text-ink-2">
                  {manifest.subjects.find((s) => s.id === last.subject)?.label} {last.classLevel}
                  {last.subtopic ? `, ${last.subtopic}` : ''}
                </span>
              </a>
            </section>
          )}

          {recents.length > 0 && <RecentFormulas ids={recents.slice(0, 6)} />}

          <section className="today-section" aria-labelledby="book-h">
            <h2 id="book-h">The book</h2>
            <div className="title-grid">
              {manifest.subjects.map((subject) => (
                <div key={subject.id} data-subject={subject.id} className="py-2">
                  <h3 className="text-step-1" style={{ color: 'var(--subject)' }}>
                    {subject.label}
                  </h3>
                  {subject.classes.map((cls) => (
                    <a key={cls.level} className="leaders" href={href(`book/${subject.id}/${cls.level}`)}>
                      <span className="ltitle">Class {cls.level}</span>
                      <span className="fill" aria-hidden />
                      <span className="lcount num">{cls.units.length} units</span>
                    </a>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-3 text-step--1 text-ink-3">{manifest.totals.entries.toLocaleString('en-GB')} formulas in all.</p>
          </section>
        </AnimatedContent>
      </div>
    </div>
  );
}
