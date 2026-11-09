import { describe, expect, it } from 'vitest';
import { clampWidth, parseWidth } from '../../src/lib/work-width';

describe('the width of the working area', () => {
  const limits = { min: 320, max: 800 };

  it('stays within its limits', () => {
    expect(clampWidth(500, limits)).toBe(500);
    expect(clampWidth(100, limits)).toBe(320);
    expect(clampWidth(2000, limits)).toBe(800);
  });

  it('keeps the minimum when the window leaves no room to choose', () => {
    expect(clampWidth(500, { min: 320, max: 200 })).toBe(320);
  });

  it('ignores a saved width that isn’t usable', () => {
    expect(parseWidth(null)).toBeNull();
    expect(parseWidth('')).toBeNull();
    expect(parseWidth('wide')).toBeNull();
    expect(parseWidth('-40')).toBeNull();
    expect(parseWidth('Infinity')).toBeNull();
    expect(parseWidth('512')).toBe(512);
  });
});
