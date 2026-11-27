// NumPy, pandas and Matplotlib in the Python tracer: the same wheels and the same install the app's worker uses,
// in Node. The libraries must have every standard library module they need, the samples must print what a
// real Python with the same libraries prints, charts must come out as pictures at the step that drew them,
// arrays and tables must read as tables, and the walls around a program must still stand.
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { libraryStdlib, packageClosure, pyodideLock, pythonPackages } from '../../scripts/lib/pyodide-packages.mjs';
import { PYODIDE_DIR, pythonFiles, zipEntries } from '../../scripts/lib/pyodide-files.mjs';
import { libraryNote } from '../../src/python/explain';
import { PY_SAMPLES } from '../../src/python/samples';
import type { PyRunResult, PyStep } from '../../src/python/trace';
import { comparablePython, libraryEngine, nodeEngine, realPythonHas, runRealPython, startPyodide } from './lib/python-node';

const run = async (code: string, input = '', theme?: Parameters<Awaited<ReturnType<typeof libraryEngine>>['run']>[2]) => (await libraryEngine()).run(code, input, theme);
const lineSteps = (r: PyRunResult) => r.steps.filter((s) => s.event === 'line');
const varOf = (step: PyStep, name: string, frame = step.frames.length - 1) => step.frames[frame].vars.find((v) => v.name === name);
const lastLine = (r: PyRunResult) => lineSteps(r).pop()!;
const SAMPLES = PY_SAMPLES.filter((s) => s.libraries);

beforeAll(async () => {
  await libraryEngine();
}, 180_000);

describe('the files shipped for the libraries', () => {
  it('lists only NumPy, pandas, Matplotlib and their dependencies in the lock file, as Pyodide’s own lock file has them', () => {
    const { lock } = pythonPackages();
    const names = Object.keys(lock.packages).sort();
    expect(names).toEqual(['contourpy', 'cycler', 'fonttools', 'kiwisolver', 'matplotlib', 'numpy', 'packaging', 'pandas', 'pillow', 'pyparsing', 'python-dateutil', 'pytz', 'six']);
    const full = pyodideLock();
    for (const name of names) {
      expect(lock.packages[name].sha256, name).toBe(full.packages[name].sha256);
      expect(lock.packages[name].file_name, `${name} is fetched from the app, never a CDN`).not.toMatch(/^https?:|\//);
      expect(lock.packages[name].depends).toEqual(full.packages[name].depends);
    }
    expect(lock.info).toEqual(pythonFiles().lock.info);
    expect(packageClosure().map((p) => p.name).sort()).toEqual(names);
  });

  it('keeps the libraries’ standard library apart from Python’s own, so the core download doesn’t grow', () => {
    const core = new Set(zipEntries(pythonFiles().files.find((f) => f.name === pythonFiles().stdlibName)!.data).map((e) => e.name));
    const extras = zipEntries(libraryStdlib()).map((e) => e.name);
    expect(extras.filter((name) => core.has(name))).toEqual([]);
    for (const name of ['email/__init__.py', 'unittest/__init__.py', 'importlib/metadata/__init__.py', 'encodings/cp437.py', 'pickle.py']) expect(extras, name).toContain(name);
  });

  it('marks every name in that zip as UTF-8, so it unpacks before the cp437 codec it brings is there', () => {
    const zip = libraryStdlib();
    let at = zip.readUInt32LE(zip.length - 22 + 16);
    for (let i = 0; i < zip.readUInt16LE(zip.length - 22 + 10); i++) {
      expect(zip.readUInt16LE(at + 8) & 0x0800).toBe(0x0800);
      at += 46 + zip.readUInt16LE(at + 28) + zip.readUInt16LE(at + 30) + zip.readUInt16LE(at + 32);
    }
  });
});

describe('everything the libraries import is there', () => {
  it('imports every module of NumPy, pandas, Matplotlib and their dependencies, and none needs a standard library module that was left out', async () => {
    const py = await startPyodide();
    // Every module in Pyodide's full standard library, by its dotted name.
    const fullNames = new Set(zipEntries(readFileSync(join(PYODIDE_DIR, 'python_stdlib.zip'))).map((e) => e.name.replace(/\/__init__\.py$/, '').replace(/\.py$/, '').replace(/\//g, '.')));
    const result = JSON.parse(
      py.runPython(`
import importlib, json, pkgutil, warnings
missing, count = {}, 0
# Tests, GUI toolkits, documentation builders and command-line tools, none of which a program can use here.
skip = ('.tests', '._tests', 'conftest', 'imagingtk', 'ImageTk', 'backend_tk', '_tkagg', 'qt', 'gtk', 'wx', 'macosx', 'cairo', 'sphinxext', '__main__', '.ai.')
with warnings.catch_warnings():
    warnings.simplefilter('ignore')
    for top in ['numpy', 'pandas', 'matplotlib', 'mpl_toolkits', 'PIL', 'dateutil', 'pytz', 'six', 'cycler', 'kiwisolver', 'contourpy', 'pyparsing', 'packaging', 'fontTools']:
        module = importlib.import_module(top)
        names = [top] + ([m.name for m in pkgutil.walk_packages(module.__path__, top + '.', onerror=lambda n: None)] if hasattr(module, '__path__') else [])
        for name in names:
            if any(part in name for part in skip):
                continue
            count += 1
            try:
                importlib.import_module(name)
            except ModuleNotFoundError as e:
                missing.setdefault(e.name, []).append(name)
            except Exception:
                pass
json.dumps({'count': count, 'missing': missing})
`) as string,
    ) as { count: number; missing: Record<string, string[]> };
    expect(result.count).toBeGreaterThan(1000);
    // fontTools' command-line tools want multiprocessing, getopt and graphlib; the Pyodide backend wants pyodide, which a program may not import.
    const allowed = new Set(['multiprocessing', 'getopt', 'graphlib', 'pyodide']);
    const stdlibMissing = Object.entries(result.missing).filter(([name]) => (fullNames.has(name) || fullNames.has(name.split('.')[0])) && !allowed.has(name.split('.')[0]));
    expect(Object.fromEntries(stdlibMissing)).toEqual({});
  }, 300_000);
});

describe('the samples that use NumPy, pandas and Matplotlib', () => {
  it('has samples for NumPy, pandas and Matplotlib, from five to eight', () => {
    expect(SAMPLES.length).toBeGreaterThanOrEqual(5);
    expect(SAMPLES.length).toBeLessThanOrEqual(8);
    for (const library of ['numpy', 'pandas', 'matplotlib']) expect(SAMPLES.some((s) => s.libraries!.includes(library)), library).toBe(true);
  });

  it.each(SAMPLES.map((s) => [s.title, s] as const))('%s prints what it should, with the library note', async (_t, sample) => {
    const r = await run(sample.code, sample.input ?? '');
    expect(r.error).toBeNull();
    expect(r.output).toBe(sample.expected);
    expect(r.beyond).toEqual([]);
    expect([...r.libraries].sort()).toEqual([...sample.libraries!].sort());
    expect(r.truncated).toBe(false);
    if (sample.libraries!.includes('matplotlib')) expect(r.figures.length, 'its chart').toBe(1);
  });

  const { python, pyodide } = comparablePython();
  describe.skipIf(!python)(`and prints what a real Python ${pyodide} prints, where it has the libraries`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'isc-libraries-'));
    afterAll(() => rmSync(dir, { recursive: true, force: true }));
    it.each(SAMPLES.map((s, i) => [s.title, s, i] as const))('%s', async (_t, sample, i) => {
      if (!realPythonHas(python!, sample.libraries!)) {
        console.warn(`Skipped “${sample.title}”: ${python} has no ${sample.libraries!.join(' or ')}. Set ISC_REAL_PYTHON to a Python that has.`);
        return;
      }
      const theirs = runRealPython(python!, dir, `lib${i}`, sample.code, sample.input ?? '');
      expect(theirs.error).toBeNull();
      expect(theirs.stdout).toBe(sample.expected);
      expect((await run(sample.code, sample.input ?? '')).output).toBe(theirs.stdout);
    });
  });
});

describe('charts', () => {
  it('shows plt.show()’s chart as an SVG picture, at the step after the line that drew it, with alt text', async () => {
    const r = await run('import matplotlib.pyplot as plt\nplt.plot([1, 2, 3], [4, 1, 9], label="marks")\nplt.title("Term marks")\nplt.xlabel("Test")\nplt.ylabel("Marks")\nplt.legend()\nprint("before")\nplt.show()\nprint("after")');
    expect(r.error).toBeNull();
    expect(r.output).toBe('before\nafter\n');
    expect(r.figures).toHaveLength(1);
    const [figure] = r.figures;
    expect(figure.mime).toBe('image/svg+xml');
    expect(figure.data).toMatch(/^<\?xml[\s\S]*<svg[\s\S]*<\/svg>\s*$/);
    // An <img> never runs an SVG's scripts, and this one has none to run.
    expect(figure.data).not.toMatch(/<script|\son[a-z]+\s*=/i);
    expect([figure.width, figure.height]).toEqual([640, 480]);
    expect(figure.alt).toBe('Chart 1: A line graph titled “Term marks”, with x axis Test and y axis Marks, key: marks.');
    const extra = r.extras.find((e) => e.kind === 'fig')!;
    expect(extra.text).toBe('0');
    expect(extra.at, 'between the two prints').toBe('before\n'.length);
    const showLine = lineSteps(r).find((s) => s.line === 8)!;
    expect(extra.step, 'it appears once plt.show() has run').toBe(r.steps.indexOf(showLine) + 1);
  });

  it('shows several figures, each once, from show() and savefig(), and savefig() still writes its file', async () => {
    const r = await run(
      [
        'import os',
        'import matplotlib.pyplot as plt',
        'plt.figure()',
        'plt.bar(["a", "b", "c"], [3, 5, 2])',
        'plt.figure()',
        'plt.scatter([1, 2, 3], [3, 1, 2])',
        'plt.show()',
        'fig, ax = plt.subplots()',
        'ax.pie([1, 2, 3], labels=["x", "y", "z"], autopct="%1.0f%%")',
        'fig.savefig("pie.png")',
        'plt.show()',
        'print(os.path.exists("pie.png"), os.path.getsize("pie.png") > 1000)',
      ].join('\n'),
    );
    expect(r.error).toBeNull();
    expect(r.output).toBe('True True\n');
    expect(r.figures.map((f) => f.alt)).toEqual(['Chart 1: A bar chart with 3 bars.', 'Chart 2: A scatter plot of 3 points.', 'Chart 3: A pie chart with 3 slices, key: x, y, z.']);
    expect(r.extras.filter((e) => e.kind === 'fig').map((e) => e.text)).toEqual(['0', '1', '2']);
  });

  it('starts each run with no figures left from the last, and draws in the app’s theme', async () => {
    await run('import matplotlib.pyplot as plt\nplt.plot([1, 2])');
    const board = { ink: '#eeece1', ink2: '#cdd0c4', faint: '#7d8d86', paper: '#1d2a26', grid: '#33443e', palette: ['#93c9f1', '#f0d264'] };
    const r = await run('import matplotlib.pyplot as plt\nplt.plot([1, 2, 3])\nplt.show()', '', { theme: board });
    expect(r.figures).toHaveLength(1);
    expect(r.figures[0].alt).toBe('Chart 1: A line graph.');
    const svg = r.figures[0].data.toLowerCase();
    expect(svg, 'slate behind it').toContain('fill: #1d2a26');
    expect(svg, 'the first chalk for its line').toContain('stroke: #93c9f1');
    const plain = await run('import matplotlib.pyplot as plt\nplt.plot([1, 2, 3])\nplt.show()');
    expect(plain.figures[0].data.toLowerCase(), 'Matplotlib’s own blue, with no theme').toContain('stroke: #1f77b4');
  });

  it('draws a very large chart as a PNG instead', async () => {
    const r = await run('import numpy as np\nimport matplotlib.pyplot as plt\nrng = np.random.default_rng(1)\nplt.scatter(rng.random(60000), rng.random(60000), s=1)\nplt.show()');
    expect(r.error).toBeNull();
    expect(r.figures[0].mime).toBe('image/png');
    expect(Buffer.from(r.figures[0].data, 'base64').subarray(1, 4).toString()).toBe('PNG');
    expect(r.figures[0].width).toBe(640);
  }, 120_000);
});

describe('the variables table', () => {
  it('shows a NumPy array’s shape, dtype and values, shortened when large', async () => {
    const r = await run('import numpy as np\na = np.array([3, 1, 4])\ngrid = np.arange(12).reshape(3, 4) / 2\nbig = np.arange(1000)\nm = a.mean()\npass');
    const last = lastLine(r);
    expect(varOf(last, 'a')).toMatchObject({ type: 'ndarray', value: '[3 1 4]', view: { kind: 'array', shape: [3], rows: [['3', '1', '4']] } });
    expect(varOf(last, 'grid')?.value).toBe('[[0. 0.5 1. 1.5] [2. 2.5 3. 3.5] [4. 4.5 5. 5.5]]');
    expect(varOf(last, 'grid')?.view).toMatchObject({ kind: 'array', shape: [3, 4], dtype: 'float64' });
    const big = varOf(last, 'big')!;
    expect(big.view).toMatchObject({ kind: 'array', shape: [1000], rows: [['0', '1', '2', '3', '4', '5', '6', '…', '998', '999']] });
    expect(big.value).toBe('[0 1 2 3 4 5 6 … 998 999]');
    expect(varOf(last, 'm'), 'a NumPy number as a student writes it').toMatchObject({ type: 'float64', value: '2.6666666666666665' });
  });

  it('shows a DataFrame as its first rows, with the shape, and a Series with its index', async () => {
    const r = await run('import pandas as pd\ndf = pd.DataFrame({"name": ["Asha", "Ravi", "Meera", "Kabir", "Zoya", "Dev", "Ira"], "marks": [91, 78, 85.5, 64, 88, 72, 69]})\ns = df.groupby("name")["marks"].mean().head(2)\npass');
    const last = lastLine(r);
    const df = varOf(last, 'df')!;
    expect(df.type).toBe('DataFrame');
    expect(df.value).toBe('7 rows × 2 columns');
    expect(df.view).toEqual({
      kind: 'frame',
      shape: [7, 2],
      columns: ['name', 'marks'],
      index: ['0', '1', '2', '3', '4'],
      rows: [
        ['Asha', '91.0'],
        ['Ravi', '78.0'],
        ['Meera', '85.5'],
        ['Kabir', '64.0'],
        ['Zoya', '88.0'],
      ],
      more: 2,
    });
    expect(varOf(last, 's')).toMatchObject({ type: 'Series', value: 'Asha: 91.0, Dev: 72.0', view: { kind: 'series', shape: [2], name: 'marks', index: ['Asha', 'Dev'], values: ['91.0', '72.0'], more: 0 } });
  });

  it('marks two names for one array or DataFrame, and arrays that share their data', async () => {
    const r = await run('import numpy as np\nimport pandas as pd\na = np.arange(6)\nb = a\nview = a[1:4]\ngrid = a.reshape(2, 3)\ncopy = a.copy()\ndf = pd.DataFrame({"x": [1, 2]})\nsame = df\npass');
    const last = lastLine(r);
    expect(varOf(last, 'b')?.same).toEqual([{ frame: 0, path: 'a' }]);
    expect(varOf(last, 'same')?.same).toEqual([{ frame: 0, path: 'df' }]);
    expect(varOf(last, 'view')?.shares).toEqual([
      { frame: 0, path: 'a' },
      { frame: 0, path: 'b' },
      { frame: 0, path: 'grid' },
    ]);
    expect(varOf(last, 'copy')?.shares).toBeUndefined();
    expect(varOf(last, 'copy')?.same).toBeUndefined();
  });

  it('shows arrays of unusual dtypes without stopping the program', async () => {
    const r = await run('import numpy as np\nrec = np.array([(1, 2.5)], dtype=[("a", "i4"), ("b", "f8")])\nwords = np.array(["x", "yz"])\nwhen = np.array(["2028-02-14"], dtype="datetime64[D]")\nprint(rec["b"][0])');
    expect(r.error).toBeNull();
    expect(r.output).toBe('2.5\n');
    const last = lastLine(r);
    expect(varOf(last, 'rec')?.value).toBe('[(1, 2.5)]');
    expect(varOf(last, 'words')?.value).toBe("['x' 'yz']");
    expect(varOf(last, 'when')?.value).toBe('[2028-02-14]');
  });

  it('leaves out NumPy’s functions, as it does Python’s', async () => {
    const r = await run('from numpy import sqrt, mean\nx = sqrt(16)\npass');
    expect(lastLine(r).frames[0].vars.map((v) => v.name)).toEqual(['x']);
  });
});

describe('tracing a program that uses the libraries', () => {
  it('steps through the program’s own lines only, however much work NumPy and pandas do', async () => {
    const code = 'import numpy as np\nimport pandas as pd\na = np.random.default_rng(1).random((300, 300))\nb = a @ a\ndf = pd.DataFrame(b).describe()\nprint(round(float(b.mean()), 1))';
    const r = await run(code);
    expect(r.error).toBeNull();
    expect(r.output).toBe('75.0\n');
    expect(r.totalSteps).toBeLessThan(20);
    expect(new Set(r.steps.flatMap((s) => s.frames.map((f) => f.fn)))).toEqual(new Set(['<module>']));
    expect(lineSteps(r).map((s) => s.line)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('steps into the program’s own function when pandas calls it', async () => {
    const r = await run('import pandas as pd\ndef grade(m):\n    return "A" if m >= 80 else "B"\ns = pd.Series([91, 64]).apply(grade)\nprint(s.tolist())');
    expect(r.output).toBe("['A', 'B']\n");
    expect(r.steps.filter((s) => s.event === 'call').map((s) => s.frames[s.frames.length - 1].fn)).toEqual(['grade', 'grade']);
  });

  it('stops a loop of heavy NumPy work at the time limit', async () => {
    const engine = await nodeEngine({ steps: 500_000, recorded: 20_000, output: 200_000, seconds: 2 });
    const started = Date.now();
    const r = engine.run('import numpy as np\nwhile True:\n    a = np.ones((200, 200)) @ np.ones((200, 200))', '');
    expect(r.stopped).toBe('time');
    expect(Date.now() - started).toBeLessThan(15_000);
  }, 60_000);

  it('counts a library’s use as its own lines, not the library’s, against the step limit', async () => {
    const engine = await nodeEngine({ steps: 50, recorded: 20_000, output: 200_000, seconds: 20 });
    const r = engine.run('import numpy as np\nfor i in range(100):\n    x = np.sort(np.arange(1000)[::-1])', '');
    expect(r.stopped).toBe('steps');
  });
});

describe('a known difference from NumPy on a PC', () => {
  // Pyodide is 32-bit WebAssembly, so NumPy's default whole number is int32, where a 64-bit PC's is int64. A sum
  // past 2,147,483,647 wraps round, with no error. Nothing in the tracer can change NumPy's build; DECISIONS.md
  // says so. This test is here so that a Pyodide that changes it is noticed.
  it('makes whole-number arrays int32, which wrap round past about 2.1 billion', async () => {
    const r = await run('import numpy as np\nprint(np.arange(3).dtype, np.arange(100000).sum(), np.arange(100000, dtype=np.int64).sum())');
    expect(r.output).toBe('int32 704982704 4999950000\n');
  });
});

describe('the syllabus note and the walls', () => {
  it('notes NumPy, pandas and Matplotlib warmly, and doesn’t count them as other imports', async () => {
    const r = await run('import numpy as np\nfrom matplotlib import pyplot as plt\nimport pandas\nprint("ok")');
    expect(r.libraries).toEqual(['numpy', 'matplotlib', 'pandas']);
    expect(r.beyond).toEqual([]);
    expect(libraryNote(['numpy'])).toBe('NumPy isn’t in the ISC syllabus, but it’s useful to learn.');
    expect(libraryNote(r.libraries)).toBe('NumPy, Matplotlib and pandas aren’t in the ISC syllabus, but they’re useful to learn.');
    expect(libraryNote([])).toBeNull();
  });

  it('reads a program’s imports before it runs, without running it', async () => {
    const engine = await libraryEngine();
    expect(engine.imports('import numpy as np, os.path\nfrom matplotlib import pyplot\nfrom . import x\nprint(1/0)')).toEqual(['numpy', 'os', 'matplotlib']);
    expect(engine.imports('if True print(')).toEqual([]);
  });

  it('still refuses js, pyodide and micropip, and installs nothing a program asks for', async () => {
    for (const name of ['js', 'pyodide', 'pyodide_js', 'micropip', 'scipy']) {
      const r = await run(`import ${name}`);
      expect(r.error?.type, name).toBe('ModuleNotFoundError');
    }
    const r = await run('import sys\nprint(sorted(m for m in sys.modules if m.split(".")[0] in ("js", "pyodide", "pyodide_js", "micropip")))');
    expect(r.output).toBe('[]\n');
  });
});
