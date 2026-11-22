// Types for pyodide-files.mjs, which vite.config.ts and the Python tests both use.
import type { Lockfile } from 'pyodide';
import type { Plugin } from 'vite';

export interface PythonFile {
  name: string;
  type: string;
  data: Buffer;
}

export interface PythonFiles {
  version: string;
  /** Where the files are served, relative to the app: pyodide/<version>/. */
  dir: string;
  files: PythonFile[];
  stdlibName: string;
  /** Pyodide's lock file with no packages in it. */
  lock: Lockfile;
  /** The Cache Storage name that holds them when "Keep Python for offline use" is on. */
  cache: string;
}

export const PYODIDE_DIR: string;
export const PYODIDE_VERSION: string;
export function trimZip(zip: Buffer, keep: (name: string) => boolean): Buffer;
export function pythonFiles(): PythonFiles;
export function pyodidePlugin(): Plugin;
/** Globs for the Python tracer's own chunks, which are saved with Pyodide rather than precached. */
export const TRACER_CHUNKS: string[];
export const TRACER_LIST: string;
