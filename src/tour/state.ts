// What the tour and the one-time tips remember. Every read and write goes through lib/storage, so with storage
// blocked the tour simply shows again next time, and nothing breaks.
import { readJson, readString, removeKey, writeJson, writeString } from '../lib/storage';

export type Role = 'student' | 'teacher';

const TOUR_KEY = 'isc-tour';
const ROLE_KEY = 'isc-tour-role';
const TIPS_KEY = 'isc-tips';
/** Browser tests run under automation, where the tour would cover every page they test, so it starts only when asked. */
const TEST_KEY = 'isc-tour-test';

/** Whether the tour should open by itself: on the first visit, and not once it has been finished or skipped. */
export function tourWanted(): boolean {
  if (readString(TOUR_KEY)) return false;
  if (typeof navigator !== 'undefined' && navigator.webdriver && readString(TEST_KEY) !== 'on') return false;
  return true;
}

export function endTour(how: 'done' | 'skipped'): void {
  writeString(TOUR_KEY, how);
}

export function savedRole(): Role | null {
  const role = readString(ROLE_KEY);
  return role === 'student' || role === 'teacher' ? role : null;
}

export function saveRole(role: Role): void {
  writeString(ROLE_KEY, role);
}

export const TIPS = {
  solver: 'The solver',
  plotter: 'The graph plotter',
  generator: 'The question generator',
} as const;

export type TipId = keyof typeof TIPS;

export function tipSeen(id: TipId): boolean {
  return Boolean(readJson<Partial<Record<TipId, boolean>>>(TIPS_KEY, {})[id]);
}

export function markTip(id: TipId, seen: boolean): void {
  const tips = readJson<Partial<Record<TipId, boolean>>>(TIPS_KEY, {});
  if (seen) tips[id] = true;
  else delete tips[id];
  if (Object.keys(tips).length) writeJson(TIPS_KEY, tips);
  else removeKey(TIPS_KEY);
}

/** Asks the app to start the tour now, from the ? button on Today or from Settings. */
export const TOUR_EVENT = 'isc-tour-start';

export function startTour(): void {
  window.dispatchEvent(new Event(TOUR_EVENT));
}

export interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Placed {
  top: number;
  left: number;
  /** Where the pointer sits along the panel's edge, from its left. */
  pointer: number | null;
  side: 'above' | 'below' | 'none';
}

const MARGIN = 8;
const GAP = 12;

/**
 * Where the step's panel goes: under its target if there's room, otherwise over it, which is always the case for the
 * dock at the bottom of a phone, and inside the window either way. With no target it sits low in the middle.
 */
export function placePanel(target: Box | null, panel: { width: number; height: number }, view: { width: number; height: number }): Placed {
  const clampLeft = (left: number) => Math.max(MARGIN, Math.min(left, view.width - panel.width - MARGIN));
  if (!target) {
    return { top: Math.max(MARGIN, view.height - panel.height - view.height * 0.15), left: clampLeft((view.width - panel.width) / 2), pointer: null, side: 'none' };
  }
  const centre = target.left + target.width / 2;
  const left = clampLeft(centre - panel.width / 2);
  const pointer = Math.max(16, Math.min(centre - left, panel.width - 16));
  const below = target.top + target.height + GAP;
  if (below + panel.height <= view.height - MARGIN) return { top: below, left, pointer, side: 'below' };
  const above = target.top - GAP - panel.height;
  if (above >= MARGIN) return { top: above, left, pointer, side: 'above' };
  // A target as tall as the window, such as the subject tabs on a short screen: the panel sits beside it, in view.
  return { top: Math.max(MARGIN, Math.min(target.top, view.height - panel.height - MARGIN)), left: clampLeft(target.left + target.width + GAP), pointer: null, side: 'none' };
}
