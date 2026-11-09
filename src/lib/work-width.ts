// How wide the working area is when it sits beside the book. The sheet on smaller screens keeps its own width.
import { readString, removeKey, writeString } from './storage';

const KEY = 'isc-work-width';

export interface WidthLimits {
  min: number;
  max: number;
}

/** Keeps a width within its limits. If the window is too small to allow any choice, the minimum wins. */
export function clampWidth(width: number, { min, max }: WidthLimits): number {
  return Math.max(min, Math.min(width, max));
}

/** A saved width, or null if there's none or it isn't a usable number. */
export function parseWidth(raw: string | null): number | null {
  if (raw === null || raw.trim() === '') return null;
  const width = Number(raw);
  return Number.isFinite(width) && width > 0 ? width : null;
}

export function readWidth(): number | null {
  return parseWidth(readString(KEY));
}

export function saveWidth(width: number): void {
  writeString(KEY, String(Math.round(width)));
}

export function forgetWidth(): void {
  removeKey(KEY);
}
