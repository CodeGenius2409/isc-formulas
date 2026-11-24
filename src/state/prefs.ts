import { createStore } from '../lib/store';
import { readString, writeString } from '../lib/storage';
import { themeChange } from '../lib/motion';

export type ThemeChoice = 'system' | 'paper' | 'board';
export type ContrastChoice = 'normal' | 'high';

function initialTheme(): ThemeChoice {
  const saved = readString('isc-theme');
  // The old app stored "light" and "dark".
  if (saved === 'light' || saved === 'paper') return 'paper';
  if (saved === 'dark' || saved === 'board') return 'board';
  return 'system';
}

const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function apply(): void {
  const theme = themeStore.get();
  const resolved = theme === 'system' ? (systemDark.matches ? 'board' : 'paper') : theme;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.contrast = contrastStore.get();
  syncThemeColor();
}

function syncThemeColor(): void {
  const color = getComputedStyle(document.documentElement).getPropertyValue('--paper-2').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
}

export const themeStore = createStore<ThemeChoice>(initialTheme(), (value) => {
  writeString('isc-theme', value);
  themeChange(apply);
});

export const contrastStore = createStore<ContrastChoice>(readString('isc-contrast') === 'high' ? 'high' : 'normal', (value) => {
  writeString('isc-contrast', value);
  themeChange(apply);
});

systemDark.addEventListener('change', () => themeChange(apply));
apply();

/** Match device follows prefers-reduced-motion. Reduced and Full override it. */
export type MotionChoice = 'device' | 'reduce' | 'full';

const systemReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

function applyMotion(): void {
  const choice = motionStore.get();
  document.documentElement.dataset.motion = choice === 'reduce' || (choice === 'device' && systemReduce.matches) ? 'reduce' : 'full';
}

const savedMotion = readString('isc-motion');
export const motionStore = createStore<MotionChoice>(savedMotion === 'reduce' || savedMotion === 'full' ? savedMotion : 'device', (value) => {
  writeString('isc-motion', value);
  applyMotion();
});

systemReduce.addEventListener('change', applyMotion);
applyMotion();
