// Downloads Pyodide's NumPy, pandas and Matplotlib wheels, and their dependencies, for the pinned Pyodide
// version, and checks each against the SHA-256 in Pyodide's lock file. The build runs this itself; this
// script is for running it on its own. It exits with an error on any mismatch.
import { ensurePackages, packageClosure, PACKAGE_DIR } from './lib/pyodide-packages.mjs';

try {
  await ensurePackages();
  const list = packageClosure();
  console.log(`pyodide-packages: ${list.length} wheels checked in ${PACKAGE_DIR}: ${list.map((p) => p.name).join(', ')}.`);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
