import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { flushSync } from 'react-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Formula } from '../data/types';
import { listReveal } from '../lib/motion';
import { FormulaRow } from './FormulaRow';
import { PenLine } from 'lucide-react';

export type ListItem =
  | { kind: 'section'; key: string; number: string; name: string; count: number; subtopicIndex: number; addHref?: string; custom?: 1 }
  | { kind: 'formula'; key: string; formula: Formula };

interface Props {
  items: ListItem[];
  scrollRef: RefObject<HTMLElement | null>;
  showWhere?: boolean;
  /** Index into `items` to bring to the top, whenever `scrollKey` changes. Null means the page top. */
  scrollToIndex?: number | null;
  scrollKey?: number;
  /** Reports the item at the reading line, or null while the list is still below it. */
  onTopItemChange?: (index: number | null) => void;
  /** A formula to pick out for a moment, having just been saved. */
  highlightId?: string | null;
}

/** How long after the last scroll event a jump counts as finished. */
const JUMP_SETTLE_MS = 120;

/** Tall lists stay fast because only the rows near the screen exist. */
export function FormulaList({ items, scrollRef, showWhere, scrollToIndex, scrollKey, onTopItemChange, highlightId }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [printing, setPrinting] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  // The running head sits over the top of the list, so the reading line starts below it.
  const [headHeight, setHeadHeight] = useState(0);
  const [measured, setMeasured] = useState(false);
  // While a jump is landing, and until the reader next scrolls, this is the current item. The
  // last section of a unit often can't reach the top, and tracking would then contradict the click.
  const jump = useRef<{ index: number; settledAt: number | null } | null>(null);
  const servedKey = useRef<number | undefined>(undefined);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (i) => (items[i].kind === 'section' ? 72 : 84),
    overscan: 8,
    scrollMargin: offset,
    scrollPaddingStart: headHeight,
    getItemKey: (i) => items[i].key,
  });

  // Measured again when anything above the list changes height, such as the syllabus note opening.
  useLayoutEffect(() => {
    const list = listRef.current;
    const scroller = scrollRef.current;
    if (!list || !scroller) return;
    const measure = () => {
      setOffset(list.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop);
      setHeadHeight(scroller.querySelector<HTMLElement>('.running-head')?.offsetHeight ?? 0);
    };
    measure();
    setMeasured(true);
    const observer = new ResizeObserver(measure);
    if (list.parentElement) observer.observe(list.parentElement);
    return () => observer.disconnect();
  }, [scrollRef, items]);

  useEffect(() => {
    const root = listRef.current;
    if (root) listReveal([...root.querySelectorAll('.row')]);
    // Once per list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // A virtual list holds only what is on screen, but a print needs every row.
  useEffect(() => {
    const before = () => flushSync(() => setPrinting(true));
    const after = () => setPrinting(false);
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
    };
  }, []);

  const onToggle = useCallback((id: string) => setOpenId((cur) => (cur === id ? null : id)), []);

  useEffect(() => {
    if (!measured || servedKey.current === scrollKey) return;
    const first = servedKey.current === undefined;
    servedKey.current = scrollKey;
    if (scrollToIndex != null && scrollToIndex >= 0 && scrollToIndex < items.length) {
      jump.current = { index: scrollToIndex, settledAt: null };
      virtualizer.scrollToIndex(scrollToIndex, { align: 'start' });
    } else if (!first) {
      jump.current = null;
      scrollRef.current?.scrollTo({ top: 0 });
    }
    // Only for a new request, not as the reading place changes or rows are measured.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollKey, measured]);

  // Rows change height after they first draw, as fonts, KaTeX and structures arrive. A jump keeps its
  // section in place through all of that, until the reader scrolls.
  const totalSize = virtualizer.getTotalSize();
  useEffect(() => {
    const current = jump.current;
    const scroller = scrollRef.current;
    if (!current || !scroller) return;
    const wanted = virtualizer.getOffsetForIndex(current.index, 'start')?.[0];
    if (wanted === undefined || Math.abs(scroller.scrollTop - wanted) <= 1) return;
    current.settledAt = null;
    virtualizer.scrollToIndex(current.index, { align: 'start' });
    // Only when the list changes height.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSize, offset, headHeight]);

  // Works from the scroll offset and the virtualiser's positions for every row, so it holds for rows
  // that aren't in the DOM. Runs at most once a frame, and renders only when the answer changes.
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller || !onTopItemChange || !measured) return;
    let frame = 0;
    let settle = 0;
    const report = () => {
      frame = 0;
      const scrollTop = scroller.scrollTop;
      const current = jump.current;
      if (current && (current.settledAt === null || Math.abs(scrollTop - current.settledAt) <= 2)) {
        onTopItemChange(current.index);
        return;
      }
      jump.current = null;
      const line = scrollTop + headHeight + 1;
      if (line < offset) {
        onTopItemChange(null);
        return;
      }
      const atEnd = scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      onTopItemChange(atEnd ? items.length - 1 : (virtualizer.getVirtualItemForOffset(line)?.index ?? null));
    };
    const landing = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (jump.current) jump.current.settledAt = scroller.scrollTop;
      }, JUMP_SETTLE_MS);
    };
    const onScroll = () => {
      if (jump.current?.settledAt === null) landing();
      if (!frame) frame = requestAnimationFrame(report);
    };
    // A hand on the page ends the jump straight away.
    const release = () => {
      jump.current = null;
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    scroller.addEventListener('wheel', release, { passive: true });
    scroller.addEventListener('touchmove', release, { passive: true });
    if (jump.current?.settledAt === null) landing();
    report();
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      scroller.removeEventListener('wheel', release);
      scroller.removeEventListener('touchmove', release);
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [scrollRef, onTopItemChange, measured, items, offset, headHeight, virtualizer]);

  const virtualItems = virtualizer.getVirtualItems();

  const renderItem = (item: ListItem) =>
    item.kind === 'section' ? (
      <div className="section-head" data-subtopic={item.subtopicIndex}>
        <div className="row-num">{item.custom ? <PenLine size={15} aria-hidden className="row-pen" /> : item.number}</div>
        <h2>
          {item.name}
          <small>{item.count}</small>
        </h2>
        {item.addHref && (
          <a className="btn btn-quiet section-add no-print" href={item.addHref} aria-label={`Add a formula to ${item.name}`} title="Add a formula">
            <PenLine size={15} aria-hidden /> <span className="act-label">Add a formula</span>
          </a>
        )}
      </div>
    ) : (
      <FormulaRow formula={item.formula} open={openId === item.formula.id} onToggle={onToggle} showWhere={showWhere} flash={highlightId === item.formula.id} />
    );

  if (printing) {
    return (
      <div className="ruled print-list" ref={listRef}>
        {items.map((item) => (
          <div key={item.key}>{renderItem(item)}</div>
        ))}
      </div>
    );
  }

  return (
    <div ref={listRef} className="ruled" style={{ height: totalSize }}>
      {virtualItems.map((v) => (
        <div
          key={v.key}
          data-index={v.index}
          ref={virtualizer.measureElement}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${v.start - offset}px)` }}
        >
          {renderItem(items[v.index])}
        </div>
      ))}
    </div>
  );
}
