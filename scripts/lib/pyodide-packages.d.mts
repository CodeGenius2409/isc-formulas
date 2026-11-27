// Types for pyodide-packages.mjs, which pyodide-files.mjs and the Python tests use.
import type { Lockfile, LockfilePackage } from 'pyodide';

export interface PackageFile {
  name: string;
  /** The package in the lock file, or null for the extra standard library, which isn't a Pyodide package. */
  package: string | null;
  type: string;
  data: Buffer;
  sha256: string;
}

export interface PythonPackages {
  /** Pyodide's lock file with only the libraries' packages in it. */
  lock: Lockfile;
  /** The extra standard library first, then the wheels, each after what it depends on. */
  files: PackageFile[];
  libraries: { name: string; label: string }[];
  /** The Cache Storage name that holds them when "Also keep NumPy, pandas and Matplotlib" is on. */
  cache: string;
}

export const LIBRARIES: string[];
export const LIBRARY_LABELS: Record<string, string>;
export const RELEASE_URL: string;
export const PACKAGE_DIR: string;
export function pyodideLock(): Lockfile;
export function packageClosure(lock?: Lockfile): (LockfilePackage & { name: string })[];
export function ensurePackages(log?: (line: string) => void): Promise<void>;
export function libraryStdlib(): Buffer;
export function pythonPackages(): PythonPackages;
export function packageFiles(): { pkg: LockfilePackage & { name: string }; data: Buffer }[];
