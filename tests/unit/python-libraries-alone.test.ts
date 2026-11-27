// Each library on its own, as a worker installs them for a program that imports only that one: NumPy first,
// then pandas, and never Matplotlib. python-libraries.test.ts installs all three at once, which hid a reset
// that needed Matplotlib. This file has its own Pyodide, as every test file does.
import { describe, expect, it } from 'vitest';
import { nodeEngine, libraryExtras } from './lib/python-node';

describe('a library installed on its own', () => {
  it('runs NumPy, then pandas, run after run, without Matplotlib, and puts their settings back each time', async () => {
    const engine = await nodeEngine();
    await engine.install(['numpy'], libraryExtras());
    expect(engine.run('import numpy as np\nnp.set_printoptions(precision=2)\nprint(np.array([1 / 3]))', '').output).toBe('[0.33]\n');
    expect(engine.run('import numpy as np\nprint(np.array([1 / 3]))', '').output, 'the next run has NumPy’s own precision').toBe('[0.33333333]\n');

    await engine.install(['six', 'python-dateutil', 'pytz', 'pandas'], null);
    const set = engine.run('import pandas as pd\npd.set_option("display.max_rows", 5)\nprint(pd.get_option("display.max_rows"))', '');
    expect(set.error).toBeNull();
    expect(set.output).toBe('5\n');
    const next = engine.run('import pandas as pd\nprint(pd.get_option("display.max_rows"), pd.Series([1, 2, 3]).sum())', '');
    expect(next.error).toBeNull();
    expect(next.output).toBe('60 6\n');
    expect(engine.run('import matplotlib', '').error?.type).toBe('ModuleNotFoundError');
  }, 180_000);
});
