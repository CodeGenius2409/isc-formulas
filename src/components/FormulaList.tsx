import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { flushSync } from 'react-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Formula } from '../data/types';
import { FormulaRow } from './FormulaRow';

export type ListItem =
  | { kind: 'section'; key: string; number: string; name: string; count: number; subtopicIndex: number }
  | { kind: 'formula'; key: string; formula: Formula };

interface Props {
  items: ListItem[];
  scrollRef: RefObject<HTMLElement | null>;
  showWhere?: boolean;
  /** Index into `items` to bring to the top once rendered. */
  scrollToIndex?: number | null;
  onTopItemChange?: (index: number) => void;
}

/** Tall lists stay fast because only the rows near the screen exist. */
export function FormulaList({ items, scrollRef, showWhere, scrollToIndex, onTopItemChange }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [printing, setPrinting] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (i) => (items[i].kind === 'section' ? 72 : 84),
    overscan: 8,
    scrollMargin: offset,
    getItemKey: (i) => items[i].key,
  });

  useLayoutEffect(() => {
    if (listRef.current && scrollRef.current) {
      const list = listRef.current.getBoundingClientRect().top;
      const scroller = scrollRef.current.getBoundingClientRect().top;
      setOffset(list - scroller + scrollRef.current.scrollTop);
    }
  }, [scrollRef, items]);

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
    if (scrollToIndex != null && scrollToIndex >= 0 && scrollToIndex < items.length) {
      virtualizer.scrollToIndex(scrollToIndex, { align: 'start' });
    }
    // Only when the target changes, not on every measured-size change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToIndex, items, offset]);

  const virtualItems = virtualizer.getVirtualItems();
  const top = useMemo(() => {
    const scrollTop = (virtualizer.scrollOffset ?? 0) - offset + 48;
    const hit = virtualItems.find((v) => v.end - offset > scrollTop);
    return hit?.index ?? 0;
  }, [virtualItems, virtualizer.scrollOffset, offset]);

  useEffect(() => {
    onTopItemChange?.(top);
  }, [top, onTopItemChange]);

  const renderItem = (item: ListItem) =>
    item.kind === 'section' ? (
      <div className="section-head" data-subtopic={item.subtopicIndex}>
        <div className="row-num">{item.number}</div>
        <h2>
          {item.name}
          <small>{item.count}</small>
        </h2>
      </div>
    ) : (
      <FormulaRow formula={item.formula} open={openId === item.formula.id} onToggle={onToggle} showWhere={showWhere} />
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
    <div ref={listRef} className="ruled" style={{ height: virtualizer.getTotalSize() }}>
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
