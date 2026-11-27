/// <reference lib="webworker" />
// The Python tracer's worker. A student's program runs here and only here, so a long run never freezes the
// page, and a runaway one is stopped by ending the worker. The page sends Pyodide's files as bytes, so the
// worker needs no network: before Python starts, it loses its ways to reach the network and storage, and
// its fetch only hands back bytes the page has just sent. It has no page to reach, being a worker.
// NumPy, pandas and Matplotlib arrive the same way, as bytes, between runs: never while a program runs.
import type { loadPyodide as LoadPyodide } from 'pyodide';
import { createEngine, type ChartTheme, type PythonEngine } from './engine';
import type { PyRunResult } from './trace';

export interface StartMessage {
  type: 'start';
  loader: ArrayBuffer;
  asm: ArrayBuffer;
  wasm: ArrayBuffer;
  stdlib: ArrayBuffer;
  urls: { index: string; wasm: string; stdlib: string };
  /** Pyodide's lock file, listing only the libraries' packages. */
  lock: import('pyodide').Lockfile;
}

/** Which of a program's imports need packages this worker hasn't installed, so the page can fetch them first. */
export interface ImportsMessage {
  type: 'imports';
  id: number;
  code: string;
}

/** A library's files, sent by the page. The extra standard library comes with the first. */
export interface InstallMessage {
  type: 'install';
  id: number;
  packages: string[];
  extras: ArrayBuffer | null;
  files: { url: string; type: string; data: ArrayBuffer }[];
}

export interface RunMessage {
  type: 'run';
  id: number;
  code: string;
  input: string;
  theme?: ChartTheme;
}

export type ToWorker = StartMessage | ImportsMessage | InstallMessage | RunMessage;

export type FromWorker =
  | { type: 'started' }
  | { type: 'failed'; message: string }
  | { type: 'result'; id: number; result: PyRunResult }
  | { type: 'crashed'; id: number; message: string }
  | { type: 'imports'; id: number; names: string[] }
  | { type: 'installed'; id: number }
  | { type: 'install-failed'; id: number; message: string };

const scope = self as unknown as DedicatedWorkerGlobalScope;
const post = (message: FromWorker) => scope.postMessage(message);

/** Network, storage and script loading. None of them is any use to a program, and each could reach out. */
const CLOSED = ['XMLHttpRequest', 'WebSocket', 'WebSocketStream', 'WebTransport', 'EventSource', 'importScripts', 'indexedDB', 'caches', 'BroadcastChannel', 'Worker', 'SharedWorker', 'RTCPeerConnection', 'cookieStore'];

function close(target: object, name: string, value: unknown = undefined): void {
  for (let o: object | null = target; o; o = Object.getPrototypeOf(o)) {
    if (Object.prototype.hasOwnProperty.call(o, name)) {
      try {
        Object.defineProperty(o, name, { value, writable: false, configurable: false });
      } catch {
        /* Some can't be redefined. Each one that can still narrows what a program could reach. */
      }
    }
  }
}

/**
 * The only files fetch can return: those the page has just sent, each once. Pyodide's own while it starts, and
 * a library's wheels while they install. Nothing can add to it but this file's own code.
 */
const served = new Map<string, { data: ArrayBuffer; type: string }>();

function lockDown(): void {
  for (const name of CLOSED) close(scope, name);
  close(scope.navigator, 'storage');
  const shim = (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const file = served.get(url);
    if (!file) return Promise.reject(new TypeError('The Python tracer has no network access.'));
    served.delete(url);
    return Promise.resolve(new Response(file.data, { headers: { 'Content-Type': file.type } }));
  };
  // Set before Pyodide loads, so any copy of fetch it keeps is this one, and fixed so nothing can replace it.
  close(scope, 'fetch', shim);
  try {
    Object.defineProperty(scope, 'fetch', { value: shim, writable: false, configurable: false });
  } catch {
    /* Already fixed to the shim by close(), if fetch was the worker's own property. */
  }
}

const asModule = (data: ArrayBuffer) => URL.createObjectURL(new Blob([data], { type: 'text/javascript' }));

let engine: PythonEngine | null = null;

async function start(message: StartMessage): Promise<void> {
  served.set(message.urls.wasm, { data: message.wasm, type: 'application/wasm' });
  served.set(message.urls.stdlib, { data: message.stdlib, type: 'application/zip' });
  lockDown();
  const loaderUrl = asModule(message.loader);
  const asmUrl = asModule(message.asm);
  try {
    const { loadPyodide } = (await import(/* @vite-ignore */ loaderUrl)) as { loadPyodide: typeof LoadPyodide };
    const { default: createPyodideModule } = await import(/* @vite-ignore */ asmUrl);
    const pyodide = await loadPyodide({
      indexURL: message.urls.index,
      stdLibURL: message.urls.stdlib,
      lockFileContents: message.lock,
      // Wheels are named relative to the app's own copy of Pyodide, which is where the page sends them from.
      packageBaseUrl: message.urls.index,
      createPyodideModule,
      stdout: () => undefined,
      stderr: () => undefined,
    });
    engine = createEngine(pyodide);
  } finally {
    URL.revokeObjectURL(loaderUrl);
    URL.revokeObjectURL(asmUrl);
    served.clear();
  }
}

/** The packages a program's imports need, each after what it depends on, from the lock file. */
function packagesFor(lock: import('pyodide').Lockfile, imports: string[]): string[] {
  const byImport = new Map<string, string>();
  for (const [name, pkg] of Object.entries(lock.packages)) for (const name2 of pkg.imports) byImport.set(name2, name);
  const order: string[] = [];
  const visit = (name: string) => {
    if (order.includes(name) || !lock.packages[name]) return;
    for (const dep of lock.packages[name].depends) visit(dep);
    order.push(name);
  };
  for (const name of imports) {
    const pkg = byImport.get(name);
    if (pkg) visit(pkg);
  }
  return order;
}

let lock: import('pyodide').Lockfile | null = null;
const installed = new Set<string>();

scope.onmessage = (event: MessageEvent<ToWorker>) => {
  const message = event.data;
  if (message.type === 'start') {
    lock = message.lock;
    start(message).then(
      () => post({ type: 'started' }),
      (err: unknown) => post({ type: 'failed', message: err instanceof Error ? err.message : String(err) }),
    );
    return;
  }
  if (!engine || !lock) {
    post({ type: 'crashed', id: message.id, message: 'Python has not started.' });
    return;
  }
  if (message.type === 'imports') {
    try {
      post({ type: 'imports', id: message.id, names: packagesFor(lock, engine.imports(message.code)).filter((p) => !installed.has(p)) });
    } catch (err) {
      post({ type: 'crashed', id: message.id, message: err instanceof Error ? err.message : String(err) });
    }
    return;
  }
  if (message.type === 'install') {
    for (const file of message.files) served.set(file.url, { data: file.data, type: file.type });
    engine
      .install(message.packages, message.extras ? new Uint8Array(message.extras) : null)
      .then(
        () => {
          message.packages.forEach((p) => installed.add(p));
          post({ type: 'installed', id: message.id });
        },
        (err: unknown) => post({ type: 'install-failed', id: message.id, message: err instanceof Error ? err.message : String(err) }),
      )
      .finally(() => served.clear());
    return;
  }
  if (message.type === 'run') {
    try {
      post({ type: 'result', id: message.id, result: engine.run(message.code, message.input, { theme: message.theme }) });
    } catch (err) {
      // Pyodide can't carry on after a fatal error, so the page starts a new worker.
      post({ type: 'crashed', id: message.id, message: err instanceof Error ? err.message : String(err) });
    }
  }
};
