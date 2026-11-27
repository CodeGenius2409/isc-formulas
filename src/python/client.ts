// The page's side of the Python tracer. Only the Python tracer imports this, so nothing else in the app
// loads Pyodide. It downloads Pyodide's files once a visit, or reads them from the offline copy, with
// progress, then starts the worker and hands them over. Stopping a program ends the worker; the next run
// starts a fresh one from the files already here, without downloading them again.
// Before each run it asks the worker which of NumPy, pandas and Matplotlib the program imports and the worker
// doesn't have yet, and fetches and installs just those, so nothing more loads for a program that doesn't.
import FILES from 'virtual:python-files';
import { createStore } from './state';
import { pythonUrl, readWithProgress, rememberDownloaded, savedFile } from './offline';
import { bytesFor, labelFor, LIBRARY_LOCK, libraryFiles, LibrariesOffline } from './python-libraries';
import type { ChartTheme } from './engine';
import type { PyRunResult } from './trace';
import type { FromWorker, InstallMessage, RunMessage, StartMessage, ToWorker } from './python-worker';

export type LoadState =
  | { phase: 'idle' }
  | { phase: 'downloading'; loaded: number; total: number }
  | { phase: 'starting' }
  | { phase: 'ready' }
  /** No connection, and no copy kept for offline use. */
  | { phase: 'offline' }
  | { phase: 'failed'; message: string };

export const pythonLoadStore = createStore<LoadState>({ phase: 'idle' });

/** NumPy, pandas or Matplotlib, while a program that imports them waits to run. */
export type LibraryState =
  | { phase: 'idle' }
  | { phase: 'downloading'; label: string; loaded: number; total: number }
  | { phase: 'installing'; label: string }
  /** No connection, and they aren't kept on this device. */
  | { phase: 'offline'; label: string }
  | { phase: 'failed'; label: string; message: string };

export const libraryLoadStore = createStore<LibraryState>({ phase: 'idle' });

export class RunStopped extends Error {}

/** A run that takes this long is ended by ending the worker, even if Python's own clock didn't stop it. */
export const WATCHDOG_MS = 25_000;
/** Installing and starting a library takes seconds. This long means something has gone wrong. */
const INSTALL_MS = 120_000;

const TOTAL = FILES.files.reduce((n, f) => n + f.bytes, 0);
let files: Map<string, ArrayBuffer> | null = null;
let worker: Worker | null = null;
let starting: Promise<Worker> | null = null;
/** False once the tracer has closed, so a download that finishes later doesn't start a worker nobody needs. */
let wanted = false;
/** Whether this worker has the libraries' part of the standard library yet. It goes with the first library. */
let extrasSent = false;
let nextId = 1;
/** The download of a library in progress, so Stop can cancel it. */
let fetching: AbortController | null = null;
const pending = new Map<number, { resolve: (message: FromWorker) => void; reject: (e: Error) => void; timer: number }>();

async function download(): Promise<Map<string, ArrayBuffer>> {
  if (files) return files;
  const got = new Map<string, ArrayBuffer>();
  let loaded = 0;
  const missing = [];
  for (const file of FILES.files) {
    const saved = await savedFile(file.name);
    if (saved) {
      got.set(file.name, saved);
      loaded += file.bytes;
    } else missing.push(file);
  }
  if (missing.length && !navigator.onLine) {
    pythonLoadStore.set({ phase: 'offline' });
    throw new Error('offline');
  }
  pythonLoadStore.set({ phase: 'downloading', loaded, total: TOTAL });
  for (const file of missing) {
    let response: Response;
    try {
      response = await fetch(pythonUrl(file.name));
    } catch {
      throw new Error(navigator.onLine ? 'Python couldn’t be downloaded. Check your connection and try again.' : 'offline');
    }
    if (!response.ok) throw new Error(`Python couldn’t be downloaded (the server said ${response.status}). Try again in a moment.`);
    const data = await readWithProgress(response, (n) => {
      loaded += n;
      pythonLoadStore.set({ phase: 'downloading', loaded: Math.min(loaded, TOTAL), total: TOTAL });
    });
    got.set(file.name, data);
    rememberDownloaded(file.name, data);
  }
  files = got;
  return got;
}

function settleAll(error: Error): void {
  for (const [id, job] of pending) {
    window.clearTimeout(job.timer);
    job.reject(error);
    pending.delete(id);
  }
}

function onMessage(message: FromWorker): void {
  if (!('id' in message)) return;
  const job = pending.get(message.id);
  if (!job) return;
  pending.delete(message.id);
  window.clearTimeout(job.timer);
  if (message.type === 'crashed') {
    // After a crash Python can't be trusted to carry on, so the next run starts again.
    endWorker();
    job.reject(new Error(message.message));
  } else job.resolve(message);
}

/** Sends the worker a message and waits for its answer. Past the time allowed, onTimeout decides what happens. */
function ask(target: Worker, message: ToWorker & { id: number }, ms: number, onTimeout: () => void, transfer: Transferable[] = []): Promise<FromWorker> {
  return new Promise<FromWorker>((resolve, reject) => {
    const timer = window.setTimeout(onTimeout, ms);
    pending.set(message.id, { resolve, reject, timer });
    target.postMessage(message, transfer);
  });
}

function startWorker(): Promise<Worker> {
  starting ??= (async () => {
    try {
      const data = await download();
      if (!wanted) throw new Error('closed');
      pythonLoadStore.set({ phase: 'starting' });
      const next = new Worker(new URL('./python-worker.ts', import.meta.url), { type: 'module', name: 'python-tracer' });
      await new Promise<void>((resolve, reject) => {
        next.onmessage = (event: MessageEvent<FromWorker>) => {
          if (event.data.type === 'started') resolve();
          else if (event.data.type === 'failed') reject(new Error(`Python couldn’t start: ${event.data.message}`));
        };
        next.onerror = () => reject(new Error('Python couldn’t start in this browser.'));
        const start: StartMessage = {
          type: 'start',
          // Copies, so the files stay here for the next worker.
          loader: data.get('pyodide.mjs')!.slice(0),
          asm: data.get('pyodide.asm.mjs')!.slice(0),
          wasm: data.get('pyodide.asm.wasm')!.slice(0),
          stdlib: data.get(FILES.stdlib)!.slice(0),
          urls: { index: pythonUrl(''), wasm: pythonUrl('pyodide.asm.wasm'), stdlib: pythonUrl(FILES.stdlib) },
          lock: LIBRARY_LOCK,
        };
        next.postMessage(start, [start.loader, start.asm, start.wasm, start.stdlib]);
      });
      next.onmessage = (event: MessageEvent<FromWorker>) => onMessage(event.data);
      next.onerror = () => {
        endWorker();
        settleAll(new Error('Python stopped unexpectedly.'));
      };
      if (!wanted) {
        next.terminate();
        throw new Error('closed');
      }
      worker = next;
      extrasSent = false;
      pythonLoadStore.set({ phase: 'ready' });
      return next;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message === 'closed') pythonLoadStore.set({ phase: 'idle' });
      else if (message !== 'offline') pythonLoadStore.set({ phase: 'failed', message });
      throw err;
    } finally {
      starting = null;
    }
  })();
  return starting;
}

function endWorker(): void {
  worker?.terminate();
  worker = null;
  extrasSent = false;
}

/** Downloads and starts Python, if it isn't running already. */
export function loadPython(): Promise<void> {
  wanted = true;
  if (worker) return Promise.resolve();
  return startWorker().then(() => undefined);
}

/**
 * Installs the libraries a program imports that this worker hasn't got: from memory, the offline copy or the
 * server, with progress. Offline without them, or if they fail, the run doesn't start and the state says why.
 */
async function installLibraries(target: Worker, code: string): Promise<void> {
  // What the last program's libraries said belongs to it, not to this one.
  libraryLoadStore.set({ phase: 'idle' });
  const answer = await ask(target, { type: 'imports', id: nextId++, code }, INSTALL_MS, () => stopPython('time'));
  const needed = answer.type === 'imports' ? answer.names : [];
  if (!needed.length) return;
  const label = labelFor(needed);
  const withExtras = !extrasSent;
  fetching = new AbortController();
  try {
    const total = bytesFor(needed, withExtras);
    libraryLoadStore.set({ phase: 'downloading', label, loaded: 0, total });
    const got = await libraryFiles(needed, withExtras, (loaded, all) => libraryLoadStore.set({ phase: 'downloading', label, loaded, total: all }), fetching.signal);
    libraryLoadStore.set({ phase: 'installing', label });
    const message: InstallMessage = { type: 'install', id: nextId++, packages: needed, extras: got.extras, files: got.files };
    const transfer = [...(got.extras ? [got.extras] : []), ...got.files.map((f) => f.data)];
    const done = await ask(target, message, INSTALL_MS, () => stopPython('time'), transfer);
    if (done.type === 'install-failed') throw new Error(done.message);
    extrasSent = true;
    libraryLoadStore.set({ phase: 'idle' });
  } catch (err) {
    if (err instanceof RunStopped || fetching?.signal.aborted) {
      libraryLoadStore.set({ phase: 'idle' });
      throw err instanceof RunStopped ? err : new RunStopped('user');
    }
    if (err instanceof LibrariesOffline) libraryLoadStore.set({ phase: 'offline', label });
    else libraryLoadStore.set({ phase: 'failed', label, message: err instanceof Error ? err.message : String(err) });
    throw err;
  } finally {
    fetching = null;
  }
}

/** Runs a program in the worker. A program that won't finish is stopped by stopPython() or the watchdog. */
export async function runPython(code: string, input: string, theme?: ChartTheme): Promise<PyRunResult> {
  wanted = true;
  const target = worker ?? (await startWorker());
  await installLibraries(target, code);
  if (worker !== target) throw new RunStopped('user');
  const message: RunMessage = { type: 'run', id: nextId++, code, input, theme };
  const answer = await ask(target, message, WATCHDOG_MS, () => stopPython('time'));
  if (answer.type !== 'result') throw new Error('Python gave an answer the tracer didn’t expect.');
  return answer.result;
}

/** Ends a running program by ending its worker. Python starts again, from memory, for the next run. */
export function stopPython(why: 'user' | 'time' = 'user'): void {
  const downloading = fetching;
  if (!pending.size && !downloading) return;
  downloading?.abort();
  endWorker();
  settleAll(new RunStopped(why));
  if (!wanted) return;
  pythonLoadStore.set({ phase: 'starting' });
  void startWorker().catch(() => undefined);
}

/** Frees the worker's memory when the tracer closes. The downloaded files stay for this visit. */
export function closePython(): void {
  wanted = false;
  fetching?.abort();
  settleAll(new RunStopped('user'));
  endWorker();
  libraryLoadStore.set({ phase: 'idle' });
  if (pythonLoadStore.get().phase === 'ready') pythonLoadStore.set({ phase: 'idle' });
}

/** Forgets a failure, so Retry downloads again. */
export function retryPython(): Promise<void> {
  pythonLoadStore.set({ phase: 'idle' });
  return loadPython();
}

export const PYTHON_TOTAL_BYTES = TOTAL;
