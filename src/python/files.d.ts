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
