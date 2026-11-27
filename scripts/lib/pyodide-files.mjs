// The files the Python tracer loads, served from the app's own origin under pyodide/<version>/.
// Pyodide comes from the pinned `pyodide` npm package. Its standard library is cut down to what Python
// needs to start, plus the few modules a school program imports, by copying entries out of the zip
// unchanged. tests/unit/python-stdlib.test.ts starts Python on the cut-down zip and fails if it needs
// anything that was left out.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
// pyodide-packages.mjs imports this module too, so it uses only functions from here, called later.
import { ensurePackages, pythonPackages } from './pyodide-packages.mjs';

const require = createRequire(import.meta.url);
export const PYODIDE_DIR = dirname(require.resolve('pyodide/package.json'));
export const PYODIDE_VERSION = JSON.parse(readFileSync(join(PYODIDE_DIR, 'package.json'), 'utf8')).version;

/** Whole folders of the library to keep. Pyodide's own packages, and what its startup imports. */
const KEEP_FOLDERS = ['pyodide/', '_pyodide/', 'asyncio/', 're/', 'json/', 'collections/', 'string/', 'logging/', 'pathlib/', 'compression/', 'zipfile/', 'concurrent/futures/'];

/**
 * Library modules a school program uses as freely as math and random: statistics, fractions, decimal, datetime
 * and csv. Their C halves (_decimal, _datetime, _csv, _statistics) are built into Pyodide; these are the Python
 * halves, and what they import: numbers for statistics and fractions, and _strptime and calendar for
 * datetime.strptime. collections, itertools, string, time, copy, functools and json were already here.
 */
export const EVERYDAY_FILES = ['statistics.py', 'fractions.py', 'decimal.py', 'numbers.py', 'datetime.py', '_strptime.py', 'calendar.py', 'csv.py'];

/** Single files. Pyodide's startup needs most of these, and the tracer the rest. */
const KEEP_FILES = [
  '__future__.py', '_collections_abc.py', '_colorize.py', '_opcode_metadata.py', '_py_warnings.py', '_sitebuiltins.py', '_ssl.py', '_weakrefset.py',
  'abc.py', 'annotationlib.py', 'ast.py', 'base64.py', 'bisect.py', 'bz2.py', 'codecs.py', 'codeop.py', 'contextlib.py', 'contextvars.py', 'copy.py', 'copyreg.py',
  'dataclasses.py', 'dis.py', 'enum.py', 'fnmatch.py', 'functools.py', 'genericpath.py', 'glob.py', 'heapq.py', 'inspect.py', 'io.py', 'keyword.py', 'linecache.py',
  'locale.py', 'lzma.py', 'ntpath.py', 'opcode.py', 'operator.py', 'os.py', 'posixpath.py', 'random.py', 'reprlib.py', 'selectors.py', 'shutil.py', 'signal.py',
  'site.py', 'socket.py', 'ssl.py', 'stat.py', 'struct.py', 'subprocess.py', 'tempfile.py', 'textwrap.py', 'threading.py', 'token.py', 'tokenize.py', 'traceback.py',
  'types.py', 'typing.py', 'warnings.py', 'weakref.py', 'zipimport.py', 'concurrent/__init__.py',
  ...EVERYDAY_FILES,
  'importlib/__init__.py', 'importlib/_abc.py', 'importlib/_bootstrap.py', 'importlib/_bootstrap_external.py', 'importlib/abc.py', 'importlib/machinery.py', 'importlib/util.py',
  // Text encodings a program can meet: UTF-8 and the common single-byte ones.
  'encodings/__init__.py', 'encodings/aliases.py', 'encodings/utf_8.py', 'encodings/utf_8_sig.py', 'encodings/ascii.py', 'encodings/latin_1.py', 'encodings/cp1252.py',
  'encodings/utf_16.py', 'encodings/utf_32.py', 'encodings/raw_unicode_escape.py', 'encodings/unicode_escape.py',
];

/** Whether a standard library zip entry is in the core zip, which every run of the tracer downloads. */
export const keepEntry = (name) =>
  name.startsWith('_sysconfigdata') ||
  KEEP_FILES.includes(name) ||
  KEEP_FOLDERS.some((folder) => name.startsWith(folder)) ||
  (name.endsWith('/') && [...KEEP_FOLDERS, 'encodings/', 'importlib/', 'concurrent/'].some((folder) => folder.startsWith(name)));

/** The entries of a zip, with their stored and full sizes, read from its central directory. */
export function zipEntries(zip) {
  let end = zip.length - 22;
  while (end >= 0 && zip.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < 0) throw new Error('Not a zip file');
  const entries = [];
  let at = zip.readUInt32LE(end + 16);
  for (let i = 0, count = zip.readUInt16LE(end + 10); i < count; i++) {
    const nameLength = zip.readUInt16LE(at + 28);
    const central = 46 + nameLength + zip.readUInt16LE(at + 30) + zip.readUInt16LE(at + 32);
    const local = zip.readUInt32LE(at + 42);
    const stored = zip.readUInt32LE(at + 20);
    // Everything the entry adds to the zip: its local header, its data and its line in the directory.
    const total = 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28) + stored + central;
    entries.push({ name: zip.toString('utf8', at + 46, at + 46 + nameLength), stored, size: zip.readUInt32LE(at + 24), total });
    at += central;
  }
  return entries;
}

/**
 * Copies the kept entries of a zip into a new one. Nothing is decompressed, so every checksum still holds.
 * With utf8Names, each entry is marked as having a UTF-8 name, which changes nothing for the ASCII names of
 * the standard library, but lets Python unpack the zip without the cp437 codec that zipfile otherwise needs.
 */
export function trimZip(zip, keep, { utf8Names = false } = {}) {
  let end = zip.length - 22;
  while (end >= 0 && zip.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < 0) throw new Error('Not a zip file');
  const count = zip.readUInt16LE(end + 10);
  let at = zip.readUInt32LE(end + 16);
  const bodies = [];
  const directory = [];
  let offset = 0;
  for (let i = 0; i < count; i++) {
    const nameLength = zip.readUInt16LE(at + 28);
    const extraLength = zip.readUInt16LE(at + 30);
    const commentLength = zip.readUInt16LE(at + 32);
    const entryLength = 46 + nameLength + extraLength + commentLength;
    const name = zip.toString('utf8', at + 46, at + 46 + nameLength);
    if (keep(name)) {
      const flags = zip.readUInt16LE(at + 8);
      const compressed = zip.readUInt32LE(at + 20);
      const local = zip.readUInt32LE(at + 42);
      let length = 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28) + compressed;
      if (flags & 0x08) length += zip.readUInt32LE(local + length) === 0x08074b50 ? 16 : 12;
      const body = zip.subarray(local, local + length);
      const header = Buffer.from(zip.subarray(at, at + entryLength));
      if (utf8Names) {
        // Bit 11 of the flags, in the entry's own header and in the directory. Neither is in any checksum.
        const copy = Buffer.from(body);
        copy.writeUInt16LE(copy.readUInt16LE(6) | 0x0800, 6);
        header.writeUInt16LE(flags | 0x0800, 8);
        bodies.push(copy);
      } else bodies.push(body);
      header.writeUInt32LE(offset, 42);
      directory.push(header);
      offset += length;
    }
    at += entryLength;
  }
  const centralSize = directory.reduce((n, b) => n + b.length, 0);
  const tail = Buffer.alloc(22);
  tail.writeUInt32LE(0x06054b50, 0);
  tail.writeUInt16LE(directory.length, 8);
  tail.writeUInt16LE(directory.length, 10);
  tail.writeUInt32LE(centralSize, 12);
  tail.writeUInt32LE(offset, 16);
  return Buffer.concat([...bodies, ...directory, tail]);
}

const hash = (data) => createHash('sha256').update(data).digest('hex');

let cached = null;

/** The files under pyodide/<version>/, with their bytes, and the name of the cache that keeps them offline. */
export function pythonFiles() {
  if (cached) return cached;
  const stdlib = trimZip(readFileSync(join(PYODIDE_DIR, 'python_stdlib.zip')), keepEntry);
  const stdlibName = `python_stdlib-${hash(stdlib).slice(0, 10)}.zip`;
  const files = [
    { name: 'pyodide.mjs', type: 'text/javascript', data: readFileSync(join(PYODIDE_DIR, 'pyodide.mjs')) },
    { name: 'pyodide.asm.mjs', type: 'text/javascript', data: readFileSync(join(PYODIDE_DIR, 'pyodide.asm.mjs')) },
    { name: 'pyodide.asm.wasm', type: 'application/wasm', data: readFileSync(join(PYODIDE_DIR, 'pyodide.asm.wasm')) },
    { name: stdlibName, type: 'application/zip', data: stdlib },
  ];
  const lock = JSON.parse(readFileSync(join(PYODIDE_DIR, 'pyodide-lock.json'), 'utf8'));
  const all = createHash('sha256');
  for (const f of files) all.update(f.data);
  cached = {
    version: PYODIDE_VERSION,
    dir: `pyodide/${PYODIDE_VERSION}/`,
    files,
    stdlibName,
    // No packages: the tracer runs the standard library only, and never downloads more.
    lock: { info: lock.info, packages: {} },
    cache: `python-offline-${PYODIDE_VERSION}-${all.digest('hex').slice(0, 10)}`,
  };
  return cached;
}

const VIRTUAL = 'virtual:python-files';
const PACKAGES = 'virtual:python-packages';

/**
 * The Python tracer's own code: its page, its editor, its worker, and the part that loads NumPy, pandas and
 * Matplotlib. They're no use offline without Pyodide, so they're left out of the offline download with it,
 * and saved with it. vite.config.ts leaves them out of the precache and serves them from the saved copy.
 */
export const TRACER_CHUNKS = ['assets/PythonTracer-*', 'assets/PythonEditor-*', 'assets/python-worker-*', 'assets/python-libraries-*'];
export const TRACER_LIST = 'tracer-files.json';
export const TRACER_CHUNK = /\/assets\/(PythonTracer|PythonEditor|python-worker|python-libraries)-[\w-]+\.(js|css)$/;
const isTracerChunk = (fileName) => TRACER_CHUNK.test(`/${fileName}`);

/** Everything served under pyodide/<version>/: Pyodide itself, then the libraries. */
const servedFiles = () => [...pythonFiles().files, ...pythonPackages().files];

/**
 * Serves the files in development, writes them into dist/ in a build, and tells the app their names and sizes.
 * The libraries' list is a module of its own, which only the tracer's chunks import, so Settings, which is part
 * of the offline download, carries none of it.
 */
export function pyodidePlugin() {
  return {
    name: 'python-tracer-files',
    async buildStart() {
      // Downloads any wheel that isn't here yet, and stops the build if one doesn't match Pyodide's lock file.
      await ensurePackages((line) => this.info(line));
      pythonPackages();
    },
    resolveId(id) {
      if (id === VIRTUAL || id === PACKAGES) return `\0${id}`;
      return null;
    },
    load(id) {
      if (id === `\0${VIRTUAL}`) {
        const { version, dir, files, stdlibName, lock, cache } = pythonFiles();
        const list = files.map((f) => ({ name: f.name, type: f.type, bytes: f.data.length }));
        return `export default ${JSON.stringify({ version, dir, files: list, stdlib: stdlibName, lock, cache })};`;
      }
      if (id === `\0${PACKAGES}`) {
        const { lock, files, libraries, cache } = pythonPackages();
        const list = files.map((f) => ({ name: f.name, package: f.package, type: f.type, bytes: f.data.length, sha256: f.sha256 }));
        return `export default ${JSON.stringify({ lock, files: list, libraries, cache })};`;
      }
      return null;
    },
    configureServer(server) {
      const { dir } = pythonFiles();
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '').split('?')[0];
        // In development nothing is hashed or precached, so there is no list to keep.
        if (path.endsWith(`/${dir}${TRACER_LIST}`)) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ files: [] }));
          return;
        }
        if (!path.includes(`/${dir}`)) return next();
        const file = servedFiles().find((f) => path.endsWith(`/${dir}${f.name}`));
        if (!file) return next();
        res.setHeader('Content-Type', file.type);
        res.end(file.data);
      });
    },
    generateBundle(_options, bundle) {
      const { dir } = pythonFiles();
      for (const f of servedFiles()) this.emitFile({ type: 'asset', fileName: `${dir}${f.name}`, source: f.data });
      const tracer = Object.values(bundle)
        .map((item) => item.fileName)
        .filter(isTracerChunk)
        .sort();
      this.emitFile({ type: 'asset', fileName: `${dir}${TRACER_LIST}`, source: JSON.stringify({ files: tracer }) });
    },
  };
}
