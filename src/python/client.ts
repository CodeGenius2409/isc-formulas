// The page's side of the Python tracer. Only the Python tracer imports this, so nothing else in the app
// loads Pyodide. It downloads Pyodide's files once a visit, or reads them from the offline copy, with
// progress, then starts the worker and hands them over. Stopping a program ends the worker; the next run
// starts a fresh one from the files already here, without downloading them again.
import FILES from 'virtual:python-files';
import { createStore } from './state';
import { pythonUrl, readWithProgress, rememberDownloaded, savedFile } from './offline';
import type { PyRunResult } from './trace';
import type { FromWorker, RunMessage, StartMessage } from './python-worker';

export type LoadState =
  | { phase: 'idle' }
  | { phase: 'downloading'; loaded: number; total: number }
  | { phase: 'starting' }
  | { phase: 'ready' }
  /** No connection, and no copy kept for offline use. */
  | { phase: 'offline' }
  | { phase: 'failed'; message: string };

export const pythonLoadStore = createStore<LoadState>({ phase: 'idle' });

export class RunStopped extends Error {}

/** A run that takes this long is ended by ending the worker, even if Python's own clock didn't stop it. */
export const WATCHDOG_MS = 25_000;

const TOTAL = FILES.files.reduce((n, f) => n + f.bytes, 0);
let files: Map<string, ArrayBuffer> | null = null;
let worker: Worker | null = null;
let starting: Promise<Worker> | null = null;
/** False once the tracer has closed, so a download that finishes later doesn't start a worker nobody needs. */
let wanted = false;
let nextId = 1;
const pending = new Map<number, { resolve: (r: PyRunResult) => void; reject: (e: Error) => void; timer: number }>();

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
  if (message.type !== 'result' && message.type !== 'crashed') return;
  const job = pending.get(message.id);
  if (!job) return;
  pending.delete(message.id);
  window.clearTimeout(job.timer);
  if (message.type === 'result') job.resolve(message.result);
  else {
    // After a crash Python can't be trusted to carry on, so the next run starts again.
    endWorker();
    job.reject(new Error(message.message));
  }
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
          lock: FILES.lock,
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
}

/** Downloads and starts Python, if it isn't running already. */
export function loadPython(): Promise<void> {
  wanted = true;
  if (worker) return Promise.resolve();
  return startWorker().then(() => undefined);
}

/** Runs a program in the worker. A program that won't finish is stopped by stopPython() or the watchdog. */
export async function runPython(code: string, input: string): Promise<PyRunResult> {
  wanted = true;
  const target = worker ?? (await startWorker());
  const id = nextId++;
  return new Promise<PyRunResult>((resolve, reject) => {
    const timer = window.setTimeout(() => stopPython('time'), WATCHDOG_MS);
    pending.set(id, { resolve, reject, timer });
    const message: RunMessage = { type: 'run', id, code, input };
    target.postMessage(message);
  });
}

/** Ends a running program by ending its worker. Python starts again, from memory, for the next run. */
export function stopPython(why: 'user' | 'time' = 'user'): void {
  if (!pending.size) return;
  endWorker();
  settleAll(new RunStopped(why));
  if (!wanted) return;
  pythonLoadStore.set({ phase: 'starting' });
  void startWorker().catch(() => undefined);
}

/** Frees the worker's memory when the tracer closes. The downloaded files stay for this visit. */
export function closePython(): void {
  wanted = false;
  settleAll(new RunStopped('user'));
  endWorker();
  if (pythonLoadStore.get().phase === 'ready') pythonLoadStore.set({ phase: 'idle' });
}

/** Forgets a failure, so Retry downloads again. */
export function retryPython(): Promise<void> {
  pythonLoadStore.set({ phase: 'idle' });
  return loadPython();
}

export const PYTHON_TOTAL_BYTES = TOTAL;
