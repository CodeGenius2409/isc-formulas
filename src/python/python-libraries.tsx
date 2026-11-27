// NumPy, pandas and Matplotlib on the page's side: which files a program's imports need, getting them from this
// visit's memory, the offline copy or the app's own server, with progress, and keeping them for offline use
// when "Also keep NumPy, pandas and Matplotlib" is on, with that setting's own part of Settings. Only the Python
// tracer and that setting load this file, which is saved with Python rather than precached, so neither the
// first load nor the offline download carries any of it. The setting shows only under Keep Python, when this
// file is saved too.
import { useEffect } from 'react';
import PACKAGES from 'virtual:python-packages';
import { LoadBar } from '../components/LoadBar';
import { readString, writeString } from '../lib/storage';
import { createStore, useStore } from './state';
import { KEEP_LIBRARIES_KEY, keepPythonStore, megabytes, pythonUrl, readWithProgress, type SaveState } from './offline';

/** Written into the libraries' cache once every file is in it. */
const LIBRARIES_SAVED = 'libraries-saved.json';

export const librariesSaveStore = createStore<SaveState>({ phase: 'idle' });

/** "Also keep NumPy, pandas and Matplotlib". Turning it on saves their files in a cache of their own; off deletes them. */
export const keepLibrariesStore = createStore<boolean>(readString(KEEP_LIBRARIES_KEY) === 'on' && keepPythonStore.get(), (on) => {
  writeString(KEEP_LIBRARIES_KEY, on ? 'on' : 'off');
  if (on) void saveLibraries();
  else void forgetLibraries();
});

// Turning Keep Python off deletes the libraries' files too (offline.ts does that), so the setting goes off here.
keepPythonStore.subscribe(() => {
  if (!keepPythonStore.get()) keepLibrariesStore.set(false);
});

async function forgetLibraries(): Promise<void> {
  librariesSaveStore.set({ phase: 'idle' });
  if (typeof caches === 'undefined') return;
  try {
    for (const name of await caches.keys()) if (name.startsWith('python-libraries-')) await caches.delete(name);
  } catch {
    /* Nothing more can be done: the files were unreachable anyway. */
  }
}

/** True if every library file is saved: the last thing a save writes is there. */
async function librariesSaved(): Promise<boolean> {
  if (typeof caches === 'undefined') return false;
  try {
    if (!(await caches.has(PACKAGES.cache))) return false;
    return Boolean(await (await caches.open(PACKAGES.cache)).match(pythonUrl(LIBRARIES_SAVED)));
  } catch {
    return false;
  }
}

export type PackageFile = (typeof PACKAGES.files)[number];

const BY_PACKAGE = new Map(PACKAGES.files.filter((f) => f.package).map((f) => [f.package!, f]));
/** The extra standard library the libraries need. It goes to a worker before its first library. */
export const EXTRAS = PACKAGES.files.find((f) => f.package === null)!;
export const LIBRARY_LOCK = PACKAGES.lock;

/** NumPy, pandas or Matplotlib, as people write them, for a list of packages: "pandas and NumPy". */
export function labelFor(packages: string[]): string {
  const named = PACKAGES.libraries.filter((l) => packages.includes(l.name)).map((l) => l.label);
  const list = named.length ? named : packages;
  return list.length < 2 ? (list[0] ?? '') : `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
}

/** What these packages weigh, with the extra standard library if it's going too. */
export function bytesFor(packages: string[], withExtras: boolean): number {
  return packages.reduce((n, p) => n + (BY_PACKAGE.get(p)?.bytes ?? 0), withExtras ? EXTRAS.bytes : 0);
}

/** No connection, and the files aren't kept on this device. */
export class LibrariesOffline extends Error {}

/** Files fetched this visit, so a new worker, or saving them, doesn't fetch them again. */
const inMemory = new Map<string, ArrayBuffer>();

async function savedLibraryFile(name: string): Promise<ArrayBuffer | null> {
  if (typeof caches === 'undefined') return null;
  try {
    if (!(await caches.has(PACKAGES.cache))) return null;
    const hit = await (await caches.open(PACKAGES.cache)).match(pythonUrl(name));
    return hit ? await hit.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** Checks a file against the SHA-256 the build took from Pyodide's lock file. Without Web Crypto, it can't. */
async function check(file: PackageFile, data: ArrayBuffer): Promise<void> {
  if (typeof crypto === 'undefined' || !crypto.subtle) return;
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', data));
  const hex = Array.from(digest, (b) => b.toString(16).padStart(2, '0')).join('');
  if (hex !== file.sha256) throw new Error(`${file.name} arrived damaged. Try again.`);
}

async function download(file: PackageFile, onBytes: (n: number) => void, signal?: AbortSignal): Promise<ArrayBuffer> {
  let response: Response;
  try {
    response = await fetch(pythonUrl(file.name), { signal });
  } catch (err) {
    if (signal?.aborted) throw err;
    if (!navigator.onLine) throw new LibrariesOffline();
    throw new Error('It couldn’t be downloaded. Check your connection and try again.');
  }
  if (!response.ok) throw new Error(`It couldn’t be downloaded (the server said ${response.status}). Try again in a moment.`);
  const data = await readWithProgress(response, onBytes);
  await check(file, data);
  return data;
}

export interface LibraryFiles {
  extras: ArrayBuffer | null;
  files: { url: string; type: string; data: ArrayBuffer }[];
}

/**
 * The files for these packages, and the extra standard library if asked, as copies to hand to a worker. Each
 * comes from this visit's memory, then the offline copy, then the app's own server. Offline with any missing,
 * it throws LibrariesOffline before fetching anything.
 */
export async function libraryFiles(packages: string[], withExtras: boolean, onProgress: (loaded: number, total: number) => void, signal?: AbortSignal): Promise<LibraryFiles> {
  const wanted = [...(withExtras ? [EXTRAS] : []), ...packages.map((p) => BY_PACKAGE.get(p)!)];
  const missing: PackageFile[] = [];
  for (const file of wanted) {
    if (inMemory.has(file.name)) continue;
    const saved = await savedLibraryFile(file.name);
    if (saved) inMemory.set(file.name, saved);
    else missing.push(file);
  }
  if (missing.length && !navigator.onLine) throw new LibrariesOffline();
  const total = missing.reduce((n, f) => n + f.bytes, 0);
  let loaded = 0;
  onProgress(0, total);
  for (const file of missing) {
    const data = await download(
      file,
      (n) => {
        loaded += n;
        onProgress(Math.min(loaded, total), total);
      },
      signal,
    );
    inMemory.set(file.name, data);
  }
  return {
    extras: withExtras ? inMemory.get(EXTRAS.name)!.slice(0) : null,
    files: packages.map((p) => {
      const file = BY_PACKAGE.get(p)!;
      return { url: pythonUrl(file.name), type: file.type, data: inMemory.get(file.name)!.slice(0) };
    }),
  };
}

export const LIBRARIES_TOTAL = PACKAGES.files.reduce((n, f) => n + f.bytes, 0);

let saving: Promise<void> | null = null;

/** Saves every library file for offline use, from this visit's downloads where there are any. */
export function saveLibraries(): Promise<void> {
  saving ??= (async () => {
    if (typeof caches === 'undefined') {
      librariesSaveStore.set({ phase: 'failed', message: 'This browser won’t let the book keep files, so the libraries can’t be saved for offline use.' });
      return;
    }
    let loaded = 0;
    librariesSaveStore.set({ phase: 'saving', loaded, total: LIBRARIES_TOTAL });
    try {
      const cache = await caches.open(PACKAGES.cache);
      for (const file of PACKAGES.files) {
        // Turned off while saving: what was saved goes too.
        if (!keepLibrariesStore.get()) {
          await caches.delete(PACKAGES.cache);
          librariesSaveStore.set({ phase: 'idle' });
          return;
        }
        const url = pythonUrl(file.name);
        if (await cache.match(url)) {
          loaded += file.bytes;
          continue;
        }
        let data = inMemory.get(file.name);
        if (data) loaded += file.bytes;
        else {
          data = await download(file, (n) => {
            loaded += n;
            librariesSaveStore.set({ phase: 'saving', loaded: Math.min(loaded, LIBRARIES_TOTAL), total: LIBRARIES_TOTAL });
          });
        }
        await cache.put(url, new Response(data, { headers: { 'Content-Type': file.type, 'Content-Length': String(data.byteLength) } }));
        librariesSaveStore.set({ phase: 'saving', loaded: Math.min(loaded, LIBRARIES_TOTAL), total: LIBRARIES_TOTAL });
      }
      // Written last, so a save that was cut short isn't taken for a whole one.
      await cache.put(pythonUrl(LIBRARIES_SAVED), new Response('{}', { headers: { 'Content-Type': 'application/json' } }));
      for (const name of await caches.keys()) if (name.startsWith('python-libraries-') && name !== PACKAGES.cache) await caches.delete(name);
      librariesSaveStore.set({ phase: 'saved' });
    } catch {
      librariesSaveStore.set({
        phase: 'failed',
        message: navigator.onLine ? 'NumPy, pandas and Matplotlib couldn’t be saved. There may not be enough space on this device.' : 'NumPy, pandas and Matplotlib can’t be saved while you’re offline. They will save the next time you’re online and open Settings.',
      });
    } finally {
      saving = null;
    }
  })();
  return saving;
}

const shareOf = (save: SaveState) => (save.phase === 'saving' && save.total ? Math.round((save.loaded / save.total) * 100) : null);

/** "Also keep NumPy, pandas and Matplotlib", under Keep Python in Settings. */
export function LibrariesOption() {
  const keep = useStore(keepLibrariesStore);
  const save = useStore(librariesSaveStore);
  const share = shareOf(save);

  // On a later visit: saved if it should be, and a save that was cut short is finished.
  useEffect(() => {
    if (!keepLibrariesStore.get()) return;
    void librariesSaved().then((saved) => {
      if (saved) librariesSaveStore.set({ phase: 'saved' });
      else if (navigator.onLine) void saveLibraries();
    });
  }, []);

  return (
    <div className="mt-3" style={{ marginInlineStart: '1.75rem' }}>
      <label className="check-row">
        <input type="checkbox" checked={keep} onChange={(e) => keepLibrariesStore.set(e.target.checked)} />
        Also keep NumPy, pandas and Matplotlib
      </label>
      <p className="mt-1 text-ink-2" role="status" data-testid="libraries-offline-state">
        {!keep && `A program that uses them downloads them the first time, about ${megabytes(LIBRARIES_TOTAL)} in all.`}
        {keep && save.phase === 'saving' && `Saving NumPy, pandas and Matplotlib on this device. ${share ?? 0}%`}
        {keep && save.phase === 'saved' && 'NumPy, pandas and Matplotlib are saved on this device, so programs that use them work offline.'}
        {keep && save.phase === 'idle' && `NumPy, pandas and Matplotlib will be saved on this device, about ${megabytes(LIBRARIES_TOTAL)}.`}
        {keep && save.phase === 'failed' && save.message}
      </p>
      {keep && save.phase === 'saving' && <LoadBar className="mt-2" share={share ?? 0} label="Saving NumPy, pandas and Matplotlib" />}
      {keep && save.phase === 'failed' && navigator.onLine && (
        <button type="button" className="btn btn-line mt-2" onClick={() => void saveLibraries()}>
          Try again
        </button>
      )}
    </div>
  );
}
