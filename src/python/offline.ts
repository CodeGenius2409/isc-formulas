// "Keep Python for offline use". Pyodide is over 10 MB, so it is never part of the app's offline download.
// Only while this setting is on are its files kept, in a cache of their own that the page fills and
// empties. The service worker's precache is fixed when the app is built, so it can't be the place for
// something a person chooses. Every storage call can fail, and the tracer still works when one does.
import FILES from 'virtual:python-files';
import { createStore } from './state';
import { readString, writeString } from '../lib/storage';

const KEEP_KEY = 'isc-keep-python';
const OFFERED_KEY = 'isc-keep-python-offered';
/** "Also keep NumPy, pandas and Matplotlib", which python-libraries.tsx owns. Only its undoing is here. */
export const KEEP_LIBRARIES_KEY = 'isc-keep-python-libraries';

export const keepPythonStore = createStore<boolean>(readString(KEEP_KEY) === 'on', (on) => {
  writeString(KEEP_KEY, on ? 'on' : 'off');
  if (on) void savePython();
  else {
    // The libraries are kept only with Python itself, so they go too.
    writeString(KEEP_LIBRARIES_KEY, 'off');
    void forgetPython();
  }
});

/** Whether the offer to keep Python has been shown, so it's made only once. */
export const pythonOfferedStore = createStore<boolean>(readString(OFFERED_KEY) === 'yes', (shown) => {
  if (shown) writeString(OFFERED_KEY, 'yes');
});

export type SaveState = { phase: 'idle' } | { phase: 'saving'; loaded: number; total: number } | { phase: 'saved' } | { phase: 'failed'; message: string };

export const pythonSaveStore = createStore<SaveState>({ phase: 'idle' });

/** All of Pyodide's files, in bytes as they're stored. */
export const PYTHON_BYTES = FILES.files.reduce((n, f) => n + f.bytes, 0);

export const pythonUrl = (name: string) => new URL(`${FILES.dir}${name}`, document.baseURI).href;

const hasCaches = () => typeof caches !== 'undefined';

async function openCache(): Promise<Cache | null> {
  if (!hasCaches()) return null;
  try {
    return await caches.open(FILES.cache);
  } catch {
    return null;
  }
}

/** A saved copy of one file, if there is one. */
export async function savedFile(name: string): Promise<ArrayBuffer | null> {
  if (!hasCaches()) return null;
  try {
    // has() doesn't create the cache, so looking doesn't leave an empty one behind.
    if (!(await caches.has(FILES.cache))) return null;
    const cache = await caches.open(FILES.cache);
    const hit = await cache.match(pythonUrl(name));
    return hit ? await hit.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** The Python tracer's own code files, which are kept with Pyodide. The service worker saves this list itself. */
async function tracerFiles(): Promise<string[]> {
  try {
    const response = await fetch(pythonUrl('tracer-files.json'));
    if (!response.ok) return [];
    const list = (await response.json()) as { files?: unknown };
    return Array.isArray(list.files) ? list.files.filter((f): f is string => typeof f === 'string') : [];
  } catch {
    return [];
  }
}

const appUrl = (path: string) => new URL(path, document.baseURI).href;

/** True if every file is saved, so the tracer can open and start with no connection. */
export async function pythonSaved(): Promise<boolean> {
  if (!hasCaches()) return false;
  try {
    if (!(await caches.has(FILES.cache))) return false;
    const cache = await caches.open(FILES.cache);
    const urls = [...FILES.files.map((f) => pythonUrl(f.name)), ...(await tracerFiles()).map(appUrl)];
    const hits = await Promise.all(urls.map((url) => cache.match(url)));
    return hits.every(Boolean);
  } catch {
    return false;
  }
}

/** Reads a response's body, reporting how many bytes have come so far. */
export async function readWithProgress(response: Response, onBytes: (n: number) => void): Promise<ArrayBuffer> {
  if (!response.body) {
    const data = await response.arrayBuffer();
    onBytes(data.byteLength);
    return data;
  }
  const reader = response.body.getReader();
  const parts: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
    size += value.byteLength;
    onBytes(value.byteLength);
  }
  const all = new Uint8Array(size);
  let at = 0;
  for (const part of parts) {
    all.set(part, at);
    at += part.byteLength;
  }
  return all.buffer;
}

/** Files already downloaded this visit, so saving them doesn't fetch them a second time. */
const inMemory = new Map<string, ArrayBuffer>();

export function rememberDownloaded(name: string, data: ArrayBuffer): void {
  inMemory.set(name, data);
}

let saving: Promise<void> | null = null;

/** Saves every file for offline use, from this visit's download where there is one. */
export function savePython(): Promise<void> {
  saving ??= (async () => {
    const cache = await openCache();
    if (!cache) {
      pythonSaveStore.set({ phase: 'failed', message: 'This browser won’t let the book keep files, so Python can’t be saved for offline use.' });
      return;
    }
    let loaded = 0;
    pythonSaveStore.set({ phase: 'saving', loaded, total: PYTHON_BYTES });
    try {
      for (const file of FILES.files) {
        const url = pythonUrl(file.name);
        if (await cache.match(url)) {
          loaded += file.bytes;
          continue;
        }
        let data = inMemory.get(file.name);
        if (!data) {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          data = await readWithProgress(response, (n) => {
            loaded += n;
            pythonSaveStore.set({ phase: 'saving', loaded, total: PYTHON_BYTES });
          });
        } else {
          loaded += file.bytes;
        }
        await cache.put(url, new Response(data, { headers: { 'Content-Type': file.type, 'Content-Length': String(data.byteLength) } }));
        pythonSaveStore.set({ phase: 'saving', loaded, total: PYTHON_BYTES });
      }
      // The tracer's own page, editor and worker, which are small. Older ones, from before an update, go.
      const current = new Set((await tracerFiles()).map(appUrl));
      for (const url of current) {
        if (await cache.match(url)) continue;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        // Only the type is kept. A host's Vary header would stop the copy matching a module's request.
        await cache.put(url, new Response(await response.blob(), { headers: { 'Content-Type': response.headers.get('Content-Type') ?? 'text/javascript' } }));
      }
      for (const request of await cache.keys()) if (request.url.includes('/assets/') && !current.has(request.url)) await cache.delete(request);
      // An older Pyodide, from before an update, is no use now.
      for (const name of await caches.keys()) if (name.startsWith('python-offline-') && name !== FILES.cache) await caches.delete(name);
      pythonSaveStore.set({ phase: 'saved' });
    } catch {
      pythonSaveStore.set({ phase: 'failed', message: navigator.onLine ? 'Python couldn’t be saved. There may not be enough space on this device.' : 'Python can’t be saved while you’re offline. It will save the next time you’re online and open this page.' });
    } finally {
      saving = null;
    }
  })();
  return saving;
}

/** Deletes Python's saved files, and the libraries' with them. */
export async function forgetPython(): Promise<void> {
  pythonSaveStore.set({ phase: 'idle' });
  if (!hasCaches()) return;
  try {
    for (const name of await caches.keys()) if (name.startsWith('python-offline-') || name.startsWith('python-libraries-')) await caches.delete(name);
  } catch {
    /* Nothing more can be done: the files were unreachable anyway. */
  }
}

/** Puts the saved state right on a later visit: saved if it should be, and finishes a save that was cut short. */
export async function checkSavedPython(): Promise<void> {
  if (!keepPythonStore.get()) return;
  if (await pythonSaved()) pythonSaveStore.set({ phase: 'saved' });
  else if (navigator.onLine) void savePython();
}

export function megabytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
