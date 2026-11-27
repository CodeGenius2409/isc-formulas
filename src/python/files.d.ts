// The list of Pyodide's files, made at build time by scripts/lib/pyodide-files.mjs.
declare module 'virtual:python-files' {
  const files: {
    version: string;
    /** pyodide/<version>/, relative to the app. */
    dir: string;
    files: { name: string; type: string; bytes: number }[];
    /** The cut-down standard library's file name. */
    stdlib: string;
    lock: import('pyodide').Lockfile;
    /** The Cache Storage name that holds the files while "Keep Python for offline use" is on. */
    cache: string;
  };
  export default files;
}

// NumPy, pandas and Matplotlib, made at build time by scripts/lib/pyodide-packages.mjs. Only the tracer's own
// chunks import this, so its list never reaches the first load or the offline download.
declare module 'virtual:python-packages' {
  const packages: {
    /** Pyodide's lock file, with only these packages in it. The worker starts with it. */
    lock: import('pyodide').Lockfile;
    /** The extra standard library first (package null), then the wheels, each after what it depends on. */
    files: { name: string; package: string | null; type: string; bytes: number; sha256: string }[];
    libraries: { name: string; label: string }[];
    /** The Cache Storage name that holds them while "Also keep NumPy, pandas and Matplotlib" is on. */
    cache: string;
  };
  export default packages;
}
