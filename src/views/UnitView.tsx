import { useCallback, useEffect, useMemo, useState, type RefObject } from 'react';
import { ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import { getClass, getSubject, loadUnits, unitTitle, splitUnitName } from '../data/book';
import type { ClassLevel, SubjectId } from '../data/types';
import { useAsync } from '../lib/hooks';
import { href } from '../lib/router';
import { lastReadStore, rememberClass } from '../state/library';
import { FormulaList, type ListItem } from '../components/FormulaList';
import { STATUS_LABEL } from '../components/shell/Contents';
import { SyllabusNote } from '../components/SyllabusNote';

interface Props {
  subject: SubjectId;
  level: ClassLevel;
  unitIndex: number;
  subtopicIndex: number | null;
  scrollRef: RefObject<HTMLElement | null>;
}

export default function UnitView({ subject, level, unitIndex, subtopicIndex, scrollRef }: Props) {
  const state = useAsync(() => loadUnits(subject, level), `${subject}-${level}`);
  const info = getSubject(subject);
  const cls = getClass(subject, level);
  const meta = cls?.units[unitIndex];
  const unit = state.status === 'ready' ? state.value[unitIndex] : undefined;
  const [topIndex, setTopIndex] = useState(0);

  const items = useMemo<ListItem[]>(() => {
    if (!unit) return [];
    const out: ListItem[] = [];
    for (const sub of unit.subtopics) {
      out.push({ kind: 'section', key: `s${sub.index}`, number: `${unit.number}.${sub.index + 1}`, name: sub.name, count: sub.formulas.length, subtopicIndex: sub.index });
      for (const formula of sub.formulas) out.push({ kind: 'formula', key: formula.id, formula });
    }
    return out;
  }, [unit]);

  const sectionPositions = useMemo(() => {
    const map = new Map<number, number>();
    items.forEach((item, i) => {
      if (item.kind === 'section') map.set(item.subtopicIndex, i);
    });
    return map;
  }, [items]);

  // The running head follows the section at the top of the screen.
  const hereSection = useMemo(() => {
    for (let i = Math.min(topIndex, items.length - 1); i >= 0; i--) {
      const item = items[i];
      if (item?.kind === 'section') return item;
    }
    return null;
  }, [items, topIndex]);

  useEffect(() => {
    rememberClass(subject, level);
  }, [subject, level]);

  useEffect(() => {
    if (!meta) return;
    lastReadStore.set({ subject, classLevel: level, unit: meta.name, unitIndex, subtopic: hereSection?.name ?? null, subtopicIndex: hereSection?.subtopicIndex });
  }, [subject, level, unitIndex, meta, hereSection]);

  const onTopItemChange = useCallback((i: number) => setTopIndex(i), []);

  useEffect(() => {
    document.title = meta ? `${unitTitle(meta.name)}: ${info.label} ${level}` : 'ISC Formula Book';
  }, [meta, info.label, level]);

  if (!meta) return <div className="page-pad">This unit does not exist. Pick one from the contents.</div>;

  const prev = unitIndex > 0 ? cls?.units[unitIndex - 1] : undefined;
  const next = cls?.units[unitIndex + 1];

  return (
    <div className="page" data-subject={subject}>
      <div className="running-head">
        <div className="crumbs">
          <a href={href(`book/${subject}/${level}`)}>
            {info.label} {level}
          </a>
          <span aria-hidden> / </span>
          <span className="here">{hereSection?.name ?? unitTitle(meta.name)}</span>
        </div>
        <button type="button" className="btn btn-quiet no-print" onClick={() => window.print()} aria-label="Print this unit">
          <Printer size={17} aria-hidden />
        </button>
      </div>

      <header className="unit-title">
        <h1>{unitTitle(meta.name)}</h1>
        <p>
          {meta.count} formulas in {meta.subtopics.length} sections
        </p>
        {STATUS_LABEL[meta.status] && <p className="status-label">{STATUS_LABEL[meta.status]}</p>}
        <SyllabusNote subject={subject} level={level} number={Number(splitUnitName(meta.name).number)} />
      </header>

      {state.status === 'loading' && <p className="spinner-line">Opening {unitTitle(meta.name)}</p>}
      {state.status === 'error' && <p className="spinner-line">This unit could not load. Reload the page to try again.</p>}
      {unit && (
        <FormulaList items={items} scrollRef={scrollRef} scrollToIndex={subtopicIndex != null ? (sectionPositions.get(subtopicIndex) ?? null) : null} onTopItemChange={onTopItemChange} />
      )}

      {unit && (
        <nav aria-label="Other units" className="no-print unit-nav">
          {prev ? (
            <a className="btn btn-line" href={href(`book/${subject}/${level}/${unitIndex - 1}`)}>
              <ChevronLeft size={16} aria-hidden /> <span>{unitTitle(prev.name)}</span>
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a className="btn btn-line" href={href(`book/${subject}/${level}/${unitIndex + 1}`)}>
              <span>{unitTitle(next.name)}</span> <ChevronRight size={16} aria-hidden />
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
