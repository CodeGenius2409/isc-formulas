// Where the tour's note goes, and what the tour remembers, including with storage blocked.
import { afterEach, describe, expect, it, vi } from 'vitest';
import { STEPS } from '../../src/tour/steps';
import { endTour, markTip, placePanel, savedRole, saveRole, tipSeen, tourWanted } from '../../src/tour/state';

const VIEW = { width: 375, height: 812 };
const PANEL = { width: 340, height: 180 };

function fakeStorage(blocked = false) {
  const data = new Map<string, string>();
  const fail = () => {
    throw new Error('blocked');
  };
  vi.stubGlobal('localStorage', {
    getItem: blocked ? fail : (k: string) => data.get(k) ?? null,
    setItem: blocked ? fail : (k: string, v: string) => void data.set(k, v),
    removeItem: blocked ? fail : (k: string) => void data.delete(k),
  });
  vi.stubGlobal('navigator', { webdriver: false });
}

afterEach(() => vi.unstubAllGlobals());

describe('placing the note', () => {
  it('goes above a target at the bottom of a phone, such as the dock, and points at it', () => {
    const dockBook = { top: 752, left: 75, width: 75, height: 60 };
    const placed = placePanel(dockBook, PANEL, VIEW);
    expect(placed.side).toBe('above');
    expect(placed.top + PANEL.height).toBeLessThanOrEqual(dockBook.top);
    expect(placed.left).toBeGreaterThanOrEqual(8);
    expect(placed.left + PANEL.width).toBeLessThanOrEqual(VIEW.width - 8);
    expect(placed.left + (placed.pointer ?? 0)).toBeCloseTo(dockBook.left + dockBook.width / 2, 0);
  });

  it('goes under a target near the top, and stays inside the window at its edges', () => {
    const tab = { top: 0, left: 1290, width: 150, height: 46 };
    const placed = placePanel(tab, PANEL, { width: 1440, height: 900 });
    expect(placed.side).toBe('below');
    expect(placed.top).toBeGreaterThan(tab.top + tab.height);
    expect(placed.left + PANEL.width).toBeLessThanOrEqual(1440 - 8);
  });

  it('sits low in the middle when there is nothing to point at', () => {
    const placed = placePanel(null, PANEL, VIEW);
    expect(placed.side).toBe('none');
    expect(placed.top + PANEL.height).toBeLessThan(VIEW.height);
    expect(placed.left).toBeCloseTo((VIEW.width - PANEL.width) / 2, 0);
  });

  it('keeps clear of a target as tall as the window', () => {
    const placed = placePanel({ top: 0, left: 0, width: 75, height: 812 }, PANEL, VIEW);
    expect(placed.top).toBeGreaterThanOrEqual(8);
    expect(placed.top + PANEL.height).toBeLessThanOrEqual(VIEW.height - 8);
  });
});

describe('the steps', () => {
  it('number five to seven for each role, one sentence each', () => {
    for (const steps of Object.values(STEPS)) {
      expect(steps.length).toBeGreaterThanOrEqual(5);
      expect(steps.length).toBeLessThanOrEqual(7);
      for (const step of steps) expect(step.text.match(/[.!?](\s|$)/g), step.id).toHaveLength(1);
    }
  });

  it('show a teacher the generator, its sets and Word export first', () => {
    expect(STEPS.teacher[0].id).toBe('generator');
    expect(STEPS.teacher[0].text).toMatch(/Sets A, B and C/);
    expect(STEPS.teacher[0].text).toMatch(/Word/);
    expect(STEPS.student[0].id).toBe('book');
  });
});

describe('what the tour remembers', () => {
  it('opens on a first visit, and not once it has been finished or skipped', () => {
    fakeStorage();
    expect(tourWanted()).toBe(true);
    endTour('skipped');
    expect(tourWanted()).toBe(false);
  });

  it('remembers the role and each tip', () => {
    fakeStorage();
    expect(savedRole()).toBeNull();
    saveRole('teacher');
    expect(savedRole()).toBe('teacher');
    expect(tipSeen('solver')).toBe(false);
    markTip('solver', true);
    expect(tipSeen('solver')).toBe(true);
    markTip('solver', false);
    expect(tipSeen('solver')).toBe(false);
  });

  it('works with storage blocked, offering the tour again rather than failing', () => {
    fakeStorage(true);
    expect(tourWanted()).toBe(true);
    expect(() => endTour('done')).not.toThrow();
    expect(() => markTip('plotter', true)).not.toThrow();
    expect(tipSeen('plotter')).toBe(false);
    expect(savedRole()).toBeNull();
  });
});
