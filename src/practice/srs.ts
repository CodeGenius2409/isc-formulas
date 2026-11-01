// Spaced repetition, using the SM-2 algorithm (Wozniak, 1990), with one change:
// a missed item comes back the same day instead of the next, so that mistakes return
// while they are still fresh.
//
// Each item has an ease factor (EF), starting at 2.5, and an interval in days.
//   quality q is 0 to 5. Below 3 counts as a miss.
//   miss:    repetitions = 0, interval = 0 (due again today)
//   correct: 1st time 1 day, 2nd time 6 days, then interval × EF, rounded
//   EF = max(1.3, EF + 0.1 − (5 − q) × (0.08 + (5 − q) × 0.02))

export interface SrsItem {
  id: string;
  ef: number;
  /** Days until the next review. */
  interval: number;
  repetitions: number;
  /** Local date as YYYY-MM-DD. */
  due: string;
  lapses: number;
  lastReviewed: string;
}

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

/** Marks for automatically graded answers. Self-graded cards use the full scale. */
export const QUALITY_CORRECT: Quality = 4;
export const QUALITY_WRONG: Quality = 1;

export function dayString(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

export function addDays(day: string, days: number): string {
  const [y, m, d] = day.split('-').map(Number);
  return dayString(new Date(y, m - 1, d + days));
}

export function newItem(id: string, today: string): SrsItem {
  return { id, ef: 2.5, interval: 0, repetitions: 0, due: today, lapses: 0, lastReviewed: '' };
}

export function schedule(item: SrsItem, quality: Quality, today: string): SrsItem {
  const q = quality;
  const ef = Math.max(1.3, item.ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (q < 3) {
    return { ...item, ef, interval: 0, repetitions: 0, due: today, lapses: item.lapses + 1, lastReviewed: today };
  }
  const repetitions = item.repetitions + 1;
  const interval = repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.round(item.interval * ef);
  return { ...item, ef, interval, repetitions, due: addDays(today, interval), lastReviewed: today };
}

export function isDue(item: SrsItem, today: string): boolean {
  return item.due <= today;
}

/** Most overdue first. Among those, the items you find hardest. */
export function reviewOrder(items: SrsItem[], today: string): SrsItem[] {
  return items.filter((i) => isDue(i, today)).sort((a, b) => a.due.localeCompare(b.due) || a.ef - b.ef || a.id.localeCompare(b.id));
}
