/// <reference lib="webworker" />
// The Python tracer's worker. A student's program runs here and only here, so a long run never freezes the
// page, and a runaway one is stopped by ending the worker. The page sends Pyodide's files as bytes, so the
// worker needs no network: before Python starts, it loses its ways to reach the network and storage, and
// its fetch only hands back those bytes. It has no page to reach, being a worker.
import type { loadPyodide as LoadPyodide } from 'pyodide';
import { createEngine, type PythonEngine } from './engine';
import type { PyRunResult } from './trace';

export interface StartMessage {
  type: 'start';
  loader: ArrayBuffer;
  asm: ArrayBuffer;
  wasm: ArrayBuffer;
  stdlib: ArrayBuffer;
  urls: { index: string; wasm: string; stdlib: string };
  lock: import('pyodide').Lockfile;
}

export interface RunMessage {
  type: 'run';
  id: number;
  code: string;
  input: string;
}

export type FromWorker = { type: 'started' } | { type: 'failed'; message: string } | { type: 'result'; id: number; result: PyRunResult } | { type: 'crashed'; id: number; message: string };

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

function lockDown(served: Map<string, { data: ArrayBuffer; type: string }>): void {
  for (const name of CLOSED) close(scope, name);
  close(scope.navigator, 'storage');
  // While Pyodide starts, fetch hands back its own files and nothing else. Afterwards, not even those.
  const shim = (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const file = served.get(url);
    if (!file) return Promise.reject(new TypeError('The Python tracer has no network access.'));
    served.delete(url);
    return Promise.resolve(new Response(file.data, { headers: { 'Content-Type': file.type } }));
  };
  Object.defineProperty(scope, 'fetch', { value: shim, writable: true, configurable: true });
}

function sealFetch(): void {
  close(scope, 'fetch', () => Promise.reject(new TypeError('The Python tracer has no network access.')));
}

const asModule = (data: ArrayBuffer) => URL.createObjectURL(new Blob([data], { type: 'text/javascript' }));

let engine: PythonEngine | null = null;

async function start(message: StartMessage): Promise<void> {
  const served = new Map([
    [message.urls.wasm, { data: message.wasm, type: 'application/wasm' }],
    [message.urls.stdlib, { data: message.stdlib, type: 'application/zip' }],
  ]);
  lockDown(served);
  const loaderUrl = asModule(message.loader);
  const asmUrl = asModule(message.asm);
  try {
    const { loadPyodide } = (await import(/* @vite-ignore */ loaderUrl)) as { loadPyodide: typeof LoadPyodide };
    const { default: createPyodideModule } = await import(/* @vite-ignore */ asmUrl);
    const pyodide = await loadPyodide({
      indexURL: message.urls.index,
      stdLibURL: message.urls.stdlib,
      lockFileContents: message.lock,
      createPyodideModule,
      stdout: () => undefined,
      stderr: () => undefined,
    });
    engine = createEngine(pyodide);
  } finally {
    URL.revokeObjectURL(loaderUrl);
    URL.revokeObjectURL(asmUrl);
    sealFetch();
  }
}

scope.onmessage = (event: MessageEvent<StartMessage | RunMessage>) => {
  const message = event.data;
  if (message.type === 'start') {
    start(message).then(
      () => post({ type: 'started' }),
      (err: unknown) => post({ type: 'failed', message: err instanceof Error ? err.message : String(err) }),
    );
    return;
  }
  if (message.type === 'run') {
    if (!engine) {
      post({ type: 'crashed', id: message.id, message: 'Python has not started.' });
      return;
    }
    try {
      post({ type: 'result', id: message.id, result: engine.run(message.code, message.input) });
    } catch (err) {
      // Pyodide can't carry on after a fatal error, so the page starts a new worker.
      post({ type: 'crashed', id: message.id, message: err instanceof Error ? err.message : String(err) });
    }
  }
};
