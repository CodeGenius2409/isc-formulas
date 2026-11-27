// NumPy, pandas and Matplotlib for the Python tracer: Pyodide's own builds of them, at the pinned Pyodide
// version, with whatever its lock file says they depend on. The npm package has no wheels, so they come from
// Pyodide's release for that exact version, at build time only, and each file must match the SHA-256 in
// Pyodide's lock file or the build stops. The app serves them from its own origin, like the core files; it
// never asks a CDN for anything.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
// Only functions from here, which are called later, as pyodide-files.mjs imports this module too.
import { keepEntry, trimZip } from './pyodide-files.mjs';

const require = createRequire(import.meta.url);
const PYODIDE_DIR = dirname(require.resolve('pyodide/package.json'));
const PYODIDE_VERSION = JSON.parse(readFileSync(join(PYODIDE_DIR, 'package.json'), 'utf8')).version;

/** The libraries a program may import, by their package names in Pyodide's lock file, and as people write them. */
export const LIBRARIES = ['numpy', 'pandas', 'matplotlib'];
export const LIBRARY_LABELS = { numpy: 'NumPy', pandas: 'pandas', matplotlib: 'Matplotlib' };

/** Pyodide's release for this version, where its own loader would look. Used at build time only. */
export const RELEASE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/** Where the checked files are kept between builds. node_modules is ignored by git, as these should be. */
export const PACKAGE_DIR = join(PYODIDE_DIR, '..', '.cache', 'pyodide-packages', PYODIDE_VERSION);

const sha256 = (data) => createHash('sha256').update(data).digest('hex');

let lockCache = null;
/** Pyodide's full lock file, as the npm package ships it. */
export function pyodideLock() {
  lockCache ??= JSON.parse(readFileSync(join(PYODIDE_DIR, 'pyodide-lock.json'), 'utf8'));
  return lockCache;
}

/** The libraries and everything they depend on, each after its dependencies. */
export function packageClosure(lock = pyodideLock()) {
  const order = [];
  const visit = (name, from) => {
    if (order.some((p) => p.name === name)) return;
    const entry = lock.packages[name];
    if (!entry) throw new Error(`Pyodide ${PYODIDE_VERSION}'s lock file has no package called ${name}${from ? `, which ${from} depends on` : ''}.`);
    for (const dep of entry.depends) visit(dep, name);
    order.push({ ...entry, name });
  };
  for (const name of LIBRARIES) visit(name);
  return order;
}

/** Downloads any wheel that isn't here yet, and checks every one against the lock file. */
export async function ensurePackages(log = (line) => console.log(line)) {
  mkdirSync(PACKAGE_DIR, { recursive: true });
  for (const pkg of packageClosure()) {
    const path = join(PACKAGE_DIR, pkg.file_name);
    if (existsSync(path) && sha256(readFileSync(path)) === pkg.sha256) continue;
    const url = RELEASE_URL + pkg.file_name;
    log(`pyodide-packages: downloading ${pkg.file_name} from Pyodide ${PYODIDE_VERSION}'s release`);
    let response;
    try {
      response = await fetch(url);
    } catch (err) {
      throw new Error(`pyodide-packages: couldn't download ${url}: ${err instanceof Error ? err.message : err}. The build needs a connection the first time, to fetch NumPy, pandas and Matplotlib.`);
    }
    if (!response.ok) throw new Error(`pyodide-packages: ${url} answered HTTP ${response.status}.`);
    const data = Buffer.from(await response.arrayBuffer());
    const got = sha256(data);
    if (got !== pkg.sha256) throw new Error(`pyodide-packages: ${pkg.file_name} doesn't match Pyodide's lock file. Its SHA-256 is ${got}, and the lock file says ${pkg.sha256}. Nothing was saved, and the build stops here.`);
    writeFileSync(`${path}.part`, data);
    renameSync(`${path}.part`, path);
  }
}

/**
 * What the libraries import from the standard library beyond the core zip. It ships as an archive of its own
 * that installs with them, so Python's own download doesn't grow for anyone else, and a program that doesn't
 * use them still can't import email or unittest. Each is here because an import needs it: pyparsing, which
 * Matplotlib reads its settings with, imports unittest, and so argparse, difflib and gettext; Matplotlib's font
 * manager imports plistlib, which needs xml; importlib.metadata needs email; NumPy imports pickle, ctypes,
 * platform and secrets; pandas imports zoneinfo, urllib.parse, pprint and uuid; dateutil imports pkgutil,
 * tarfile and gzip; and zipfile needs the cp437 codec to read a wheel's file names at all.
 * tests/unit/python-libraries.test.ts imports every module of the three libraries and fails if one needs
 * something left out.
 */
const EXTRA_FOLDERS = ['email/', 'unittest/', 'importlib/metadata/', 'importlib/resources/', 'xml/', 'html/', 'urllib/', 'zoneinfo/', 'ctypes/', 'sysconfig/'];
const EXTRA_FILES = [
  'pickle.py', '_compat_pickle.py', 'platform.py', 'secrets.py', 'hmac.py', 'hashlib.py', 'pkgutil.py', 'gzip.py', 'ipaddress.py', 'pprint.py', 'uuid.py',
  'queue.py', 'shlex.py', 'difflib.py', 'argparse.py', 'gettext.py', 'plistlib.py', 'tarfile.py', 'encodings/cp437.py',
  // Lazier needs: timeit for fontTools, which saving a PDF uses; fileinput for pylab; quopri for packaging's
  // metadata reader; mimetypes for Matplotlib's web backends.
  'timeit.py', 'fileinput.py', 'quopri.py', 'mimetypes.py',
];
/**
 * Parts of those folders that nothing imports, even with every module of the libraries imported: the network
 * half of urllib (a program has no network), XML's DOM and SAX, unittest's mock, email's writing side, the HTML
 * parser, and ctypes for Windows, AIX and macOS.
 */
const EXTRA_LEAVE_OUT = [
  'xml/dom/', 'xml/sax/', 'unittest/mock.py', 'unittest/async_case.py', 'unittest/_log.py', 'unittest/__main__.py', 'urllib/request.py', 'urllib/robotparser.py',
  'urllib/response.py', 'urllib/error.py', 'email/mime/', 'email/generator.py', 'html/parser.py', 'ctypes/_aix.py', 'ctypes/macholib/', 'ctypes/wintypes.py', 'sysconfig/__main__.py',
];
const extraEntry = (name) =>
  !keepEntry(name) && !EXTRA_LEAVE_OUT.some((part) => name.startsWith(part)) && (EXTRA_FILES.includes(name) || EXTRA_FOLDERS.some((folder) => name.startsWith(folder)));

/** The standard library modules the libraries need, as a zip that unpacks without cp437, which it brings. */
export function libraryStdlib() {
  return trimZip(readFileSync(join(PYODIDE_DIR, 'python_stdlib.zip')), extraEntry, { utf8Names: true });
}

let packagesCache = null;
/**
 * What the app serves for the libraries: the wheels, the extra standard library, and a lock file listing only
 * the wheels' packages, which the worker starts with. The extras aren't a Pyodide package, so they aren't in
 * the lock file: the worker unpacks them itself, before the first wheel, as every wheel needs cp437 to unpack.
 * The name of the cache that keeps them offline changes when any file does.
 */
export function pythonPackages() {
  if (packagesCache) return packagesCache;
  const lock = pyodideLock();
  const extras = libraryStdlib();
  const extrasHash = sha256(extras);
  const wheels = packageFiles();
  const packages = {};
  for (const { pkg } of wheels) {
    const { name, version, file_name, install_dir, sha256: hash, package_type, imports, depends } = pkg;
    packages[name] = { name, version, file_name, install_dir, sha256: hash, package_type, imports, depends };
  }
  const files = [
    { name: `python_stdlib_libraries-${extrasHash.slice(0, 10)}.zip`, package: null, type: 'application/zip', data: extras, sha256: extrasHash },
    ...wheels.map(({ pkg, data }) => ({ name: pkg.file_name, package: pkg.name, type: 'application/zip', data, sha256: pkg.sha256 })),
  ];
  const all = createHash('sha256');
  for (const f of files) all.update(f.sha256);
  packagesCache = {
    lock: { info: lock.info, packages },
    files,
    libraries: LIBRARIES.map((name) => ({ name, label: LIBRARY_LABELS[name] })),
    cache: `python-libraries-${PYODIDE_VERSION}-${all.digest('hex').slice(0, 10)}`,
  };
  return packagesCache;
}

let filesCache = null;
/**
 * The checked wheels, with their bytes. Each is hashed again here, so a file changed after it was downloaded
 * fails the build too. Call ensurePackages() first.
 */
export function packageFiles() {
  if (filesCache) return filesCache;
  filesCache = packageClosure().map((pkg) => {
    const path = join(PACKAGE_DIR, pkg.file_name);
    if (!existsSync(path)) throw new Error(`pyodide-packages: ${pkg.file_name} is missing. Run \`npm run packages\`, which downloads it.`);
    const data = readFileSync(path);
    const got = sha256(data);
    if (got !== pkg.sha256) throw new Error(`pyodide-packages: ${pkg.file_name} doesn't match Pyodide's lock file (SHA-256 ${got}, expected ${pkg.sha256}). Delete it and run \`npm run packages\` again.`);
    return { pkg, data };
  });
  return filesCache;
}
