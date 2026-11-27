// NumPy, pandas and Matplotlib in the Python tracer, in a real browser: nothing of theirs loads until a program
// imports one, each loads and runs with a message and a Retry, charts appear in the console, arrays and tables
// read as tables, "Also keep NumPy, pandas and Matplotlib" saves and deletes their files, and the app's first
// load is what it was.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { openRoute, setTheme, waitForServiceWorker, watchProblems } from './helpers';

test.describe.configure({ mode: 'serial' });

const PYTHON_TIMEOUT = 60_000;
/** Installing and importing a library the first time takes seconds; pandas the longest. */
const LIBRARY_TIMEOUT = 120_000;

const status = (page: Page) => page.locator('.tracer-steps [role="status"]');
const consoleText = (page: Page) => page.getByRole('log', { name: 'Console' });
const vars = (page: Page) => page.getByRole('region', { name: 'Table of variables' });

async function openTracer(page: Page): Promise<void> {
  await page.goto('/#/tools/python');
  await expect(page.getByRole('button', { name: 'Trace again' })).toBeEnabled({ timeout: PYTHON_TIMEOUT });
}

/** Picks a sample and waits until it has run, libraries and all. */
async function runSample(page: Page, label: string): Promise<void> {
  await page.getByLabel('Program', { exact: true }).selectOption({ label });
  await expect(page.getByRole('button', { name: 'Run to the end' })).toBeVisible({ timeout: LIBRARY_TIMEOUT });
  await page.getByRole('button', { name: 'Run to the end' }).click();
}

async function writeProgram(page: Page, code: string): Promise<void> {
  await page.getByRole('button', { name: 'Edit code' }).first().click();
  const content = page.locator('.cm-content');
  await content.waitFor();
  await content.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Delete');
  await page.keyboard.insertText(code);
}

/** The library files this page asks the server for. */
function watchLibraries(page: Page): string[] {
  const asked: string[] = [];
  page.on('request', (r) => {
    const name = r.url().split('/').pop() ?? '';
    if (/\.whl$|^python_stdlib_libraries-/.test(name)) asked.push(name.split('-')[0]);
  });
  return asked;
}

test('nothing of NumPy, pandas or Matplotlib loads until a program imports one', async ({ page }) => {
  test.setTimeout(180_000);
  const asked = watchLibraries(page);
  const problems = watchProblems(page);
  await openTracer(page);
  for (const label of ['Bubble sort', 'Factorial by recursion', 'Class marks: mean, median, mode and standard deviation', 'Counting letters and words with Counter']) {
    await runSample(page, label);
    await expect(status(page)).toContainText('Finished in');
  }
  expect(asked, 'no library file for programs that don’t import one').toEqual([]);
  await expect(page.getByTestId('library-note')).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('each library loads when a program imports it, with a message, and only what it needs', async ({ page }) => {
  test.setTimeout(300_000);
  const asked = watchLibraries(page);
  const problems = watchProblems(page);
  await openTracer(page);

  await page.getByLabel('Program', { exact: true }).selectOption({ label: 'Marks as a NumPy array: mean, median and standard deviation' });
  await expect(page.locator('.py-load')).toContainText(/Loading NumPy, about \d+\.\d MB, the first time a program uses it this visit|Starting NumPy/);
  await page.getByRole('button', { name: 'Run to the end' }).click({ timeout: LIBRARY_TIMEOUT });
  await expect(consoleText(page)).toContainText('Mean: 77.75');
  await expect(consoleText(page)).toContainText('Above 80: [85 91 85 88]');
  await expect(page.getByTestId('library-note')).toHaveText('NumPy isn’t in the ISC syllabus, but it’s useful to learn.');
  expect(asked.sort(), 'NumPy and the libraries’ standard library, nothing else').toEqual(['numpy', 'python_stdlib_libraries']);

  await runSample(page, 'Average marks for each house, with groupby');
  await expect(consoleText(page)).toContainText('Best house: Blue');
  await expect(page.getByTestId('library-note')).toHaveText('pandas isn’t in the ISC syllabus, but it’s useful to learn.');
  expect(asked.sort(), 'pandas brings what it depends on, and NumPy isn’t fetched again').toEqual(['numpy', 'pandas', 'python_dateutil', 'python_stdlib_libraries', 'pytz', 'six']);

  await runSample(page, 'A bar chart of marks in each subject');
  await expect(consoleText(page)).toContainText('Average: 85.5');
  await expect(page.getByTestId('library-note')).toHaveText('Matplotlib isn’t in the ISC syllabus, but it’s useful to learn.');
  expect(new Set(asked).size, 'each file once a visit').toBe(asked.length);
  expect(asked).toContain('matplotlib');
  expect(problems).toEqual([]);
});

test('charts appear in the console at the step that drew them, crisp, with alt text, in the theme', async ({ page, context }) => {
  test.setTimeout(300_000);
  await setTheme(context, 'board');
  await openTracer(page);
  await runSample(page, 'A line graph of a week’s temperatures');
  const chart = consoleText(page).locator('img.console-fig');
  await expect(chart).toHaveCount(1);
  await expect(chart).toHaveAttribute('alt', 'Chart 1: A line graph with 2 lines titled “Highest temperature in a week”, with x axis Day and y axis Temperature (°C), key: Delhi, Shimla.');
  await expect(chart).toHaveAttribute('src', /^data:image\/svg\+xml/);
  // Drawn on the blackboard's slate, so it sits in the console rather than on a white card.
  expect(await chart.getAttribute('src')).toContain(encodeURIComponent('#1d2a26'));
  expect(await chart.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  // Before plt.show() has run, there is no chart yet.
  await page.getByRole('button', { name: 'Previous step' }).click();
  await page.getByRole('button', { name: 'Previous step' }).click();
  await page.getByRole('button', { name: 'Previous step' }).click();
  await expect(chart).toHaveCount(0);
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(chart).toHaveCount(1);

  // Several figures each appear, in order.
  await writeProgram(page, ['import matplotlib.pyplot as plt', 'plt.figure()', 'plt.bar(["a", "b"], [3, 5])', 'plt.figure()', 'plt.scatter([1, 2, 3], [3, 1, 2])', 'plt.show()', 'plt.pie([1, 2, 3])', 'plt.savefig("pie.png")', 'print("done")'].join('\n'));
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  await page.getByRole('button', { name: 'Run to the end' }).click({ timeout: LIBRARY_TIMEOUT });
  await expect(consoleText(page)).toContainText('done');
  await expect(chart).toHaveCount(3);
  expect(await chart.evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).alt))).toEqual(['Chart 1: A bar chart with 2 bars.', 'Chart 2: A scatter plot of 3 points.', 'Chart 3: A pie chart with 3 slices.']);
});

test('the variables table shows arrays, DataFrames and the standard library’s types as tables and values', async ({ page }) => {
  test.setTimeout(300_000);
  await openTracer(page);
  await runSample(page, 'A slice of an array shares its data, and a copy doesn’t');
  await page.getByRole('button', { name: 'Previous step' }).click();
  const table = vars(page);
  const b = table.getByRole('row').filter({ has: page.getByRole('rowheader', { name: 'b', exact: true }) });
  await expect(b).toContainText('ndarray');
  await expect(b.locator('table.value-table caption')).toHaveText(/^3 values, int(32|64)$/);
  await expect(b.locator('table.value-table td')).toHaveText(['99', '3', '4']);
  await expect(b).toContainText('Shares its data with a and grid, so changing one changes the other.');
  const grid = table.getByRole('row').filter({ has: page.getByRole('rowheader', { name: 'grid', exact: true }) });
  await expect(grid.locator('table.value-table caption')).toHaveText(/^2 × 3 array, int(32|64)$/);

  await runSample(page, 'A class’s marks in a DataFrame: a new column, and filtering');
  await page.getByRole('button', { name: 'Previous step' }).click();
  const df = table.getByRole('row').filter({ has: page.getByRole('rowheader', { name: 'df', exact: true }) });
  await expect(df).toContainText('DataFrame');
  const frame = df.locator('table.value-table');
  // Six rows are few enough to show whole; a longer table shows its first five (python-libraries.test.ts).
  await expect(frame.locator('caption')).toHaveText('6 rows × 5 columns');
  await expect(frame.locator('thead th')).toHaveText(['name', 'house', 'physics', 'maths', 'total']);
  await expect(frame.locator('tbody tr')).toHaveCount(6);
  await expect(frame.locator('tbody tr').first()).toContainText('Asha');
  await expect(frame.locator('tbody tr').first()).toContainText('186');

  await writeProgram(page, ['from fractions import Fraction', 'from decimal import Decimal', 'from datetime import date', 'from collections import Counter, deque', 'f = Fraction(3, 4)', 'd = Decimal("0.1") + Decimal("0.2")', 'day = date(2028, 2, 14)', 'c = Counter("aab")', 'q = deque([1, 2])', 'print(f, d, day, c, q)'].join('\n'));
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await page.getByRole('button', { name: 'Previous step' }).click();
  for (const [name, type, value] of [
    ['f', 'Fraction', '3/4'],
    ['d', 'Decimal', '0.3'],
    ['day', 'date', '2028-02-14'],
    ['c', 'Counter', "Counter({'a': 2, 'b': 1})"],
    ['q', 'deque', 'deque([1, 2])'],
  ]) {
    await expect(table.getByRole('row', { name: `${name} ${type} ${value}`, exact: true })).toBeVisible();
  }
});

test('offline, a program that imports a library that isn’t kept says it needs a connection, with Retry', async ({ page, context }) => {
  test.setTimeout(300_000);
  await page.goto('/');
  await waitForServiceWorker(page);
  await openRoute(page, 'settings');
  await page.getByRole('checkbox', { name: 'Keep Python for offline use' }).check();
  await expect(page.getByTestId('python-offline-state')).toHaveText('Python is saved on this device, so the tracer works offline.', { timeout: PYTHON_TIMEOUT });
  await expect(page.getByRole('checkbox', { name: 'Also keep NumPy, pandas and Matplotlib' })).not.toBeChecked();

  await context.setOffline(true);
  const problems = watchProblems(page);
  await page.reload();
  await openTracer(page);
  // A program without a library runs as it did.
  await runSample(page, 'Bubble sort');
  await expect(consoleText(page)).toContainText('Sorted: [10, 13, 14, 29, 37]');

  await page.getByLabel('Program', { exact: true }).selectOption({ label: 'Marks as a NumPy array: mean, median and standard deviation' });
  const notice = page.locator('.notice').filter({ hasText: 'needs a connection' });
  await expect(notice).toContainText('This program uses NumPy, which needs a connection the first time. You’re offline, and it isn’t saved on this device.');
  await expect(page.locator('.notice[data-tone="bad"]'), 'a message, not an error').toHaveCount(0);
  expect(problems).toEqual([]);

  // Back online, Retry loads it.
  await context.setOffline(false);
  await notice.getByRole('button', { name: 'Retry' }).click();
  await page.getByRole('button', { name: 'Run to the end' }).click({ timeout: LIBRARY_TIMEOUT });
  await expect(consoleText(page)).toContainText('Mean: 77.75');
  await expect(notice).toHaveCount(0);
});

test('a library that fails to download says so, and Retry tries again', async ({ page }) => {
  test.setTimeout(300_000);
  await openTracer(page);
  await page.route(/numpy-[^/]*\.whl$/, (route) => route.fulfill({ status: 503, body: 'busy' }));
  await page.getByLabel('Program', { exact: true }).selectOption({ label: 'Marks as a NumPy array: mean, median and standard deviation' });
  const failed = page.locator('.notice[data-tone="bad"]').filter({ hasText: 'NumPy couldn’t load' });
  await expect(failed).toContainText('the server said 503');
  await page.unroute(/numpy-[^/]*\.whl$/);
  await failed.getByRole('button', { name: 'Retry' }).click();
  await page.getByRole('button', { name: 'Run to the end' }).click({ timeout: LIBRARY_TIMEOUT });
  await expect(consoleText(page)).toContainText('Mean: 77.75');
  await expect(failed).toHaveCount(0);
});

test('Stop ends heavy NumPy work, and the next run installs NumPy again without downloading it', async ({ page }) => {
  test.setTimeout(300_000);
  const asked = watchLibraries(page);
  await openTracer(page);
  await runSample(page, 'Marks as a NumPy array: mean, median and standard deviation');
  await expect(consoleText(page)).toContainText('Mean: 77.75');
  const downloads = asked.length;

  await writeProgram(page, 'import numpy as np\nprint(np.ones((3000, 3000)) @ np.ones((3000, 3000)))');
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  const stop = page.getByRole('button', { name: 'Stop' });
  await expect(stop).toBeVisible();
  await stop.click();
  await expect(page.getByText('Stopped. Python is starting again, ready for the next run.')).toBeVisible();

  await runSample(page, 'Marks as a NumPy array: mean, median and standard deviation');
  await expect(consoleText(page)).toContainText('Mean: 77.75');
  expect(asked.length, 'NumPy came from this visit’s memory').toBe(downloads);

  // A loop of NumPy work is stopped by the tracer's own clock or step count, as any loop is.
  await writeProgram(page, 'import numpy as np\nwhile True:\n    a = np.ones((100, 100)) @ np.ones((100, 100))');
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  await page.getByRole('button', { name: 'Run to the end' }).click({ timeout: LIBRARY_TIMEOUT });
  await expect(page.locator('.notice[data-tone="bad"]')).toContainText('infinite loop');
});

test('Also keep NumPy, pandas and Matplotlib saves them for offline use, and turning it off deletes them', async ({ page, context }) => {
  test.setTimeout(400_000);
  await page.goto('/');
  await waitForServiceWorker(page);
  await openRoute(page, 'settings');
  // Only under Keep Python.
  await expect(page.getByRole('checkbox', { name: 'Also keep NumPy, pandas and Matplotlib' })).toHaveCount(0);
  await page.getByRole('checkbox', { name: 'Keep Python for offline use' }).check();
  await expect(page.getByTestId('python-offline-state')).toHaveText('Python is saved on this device, so the tracer works offline.', { timeout: PYTHON_TIMEOUT });
  const keepLibraries = page.getByRole('checkbox', { name: 'Also keep NumPy, pandas and Matplotlib' });
  await expect(page.getByTestId('libraries-offline-state')).toContainText(/about \d+\.\d MB in all/);
  await keepLibraries.check();
  await expect(page.getByTestId('libraries-offline-state')).toHaveText('NumPy, pandas and Matplotlib are saved on this device, so programs that use them work offline.', { timeout: LIBRARY_TIMEOUT });
  const saved = () => page.evaluate(async () => {
    const names = (await caches.keys()).filter((k) => k.startsWith('python-libraries-'));
    return names.length ? (await (await caches.open(names[0])).keys()).length : 0;
  });
  // Thirteen wheels, the libraries' standard library, and the note that the save finished.
  expect(await saved()).toBe(15);

  await context.setOffline(true);
  const problems = watchProblems(page);
  await page.reload();
  await openTracer(page);
  await runSample(page, 'A scatter plot of height and weight, with a best-fit line');
  await expect(consoleText(page)).toContainText('Slope of the best-fit line: 0.95 kg per cm');
  await expect(consoleText(page).locator('img.console-fig')).toHaveCount(1);
  await runSample(page, 'Average marks for each house, with groupby');
  await expect(consoleText(page)).toContainText('Best house: Blue');
  expect(problems).toEqual([]);

  // Turning it off deletes them, and leaves Python itself.
  await context.setOffline(false);
  await openRoute(page, 'settings');
  await page.getByRole('checkbox', { name: 'Also keep NumPy, pandas and Matplotlib' }).uncheck();
  await expect.poll(saved).toBe(0);
  expect(await page.evaluate(async () => (await caches.keys()).filter((k) => k.startsWith('python-offline-')).length)).toBe(1);

  // Turning Keep Python off takes the libraries with it.
  await page.getByRole('checkbox', { name: 'Also keep NumPy, pandas and Matplotlib' }).check();
  await expect(page.getByTestId('libraries-offline-state')).toContainText('are saved on this device', { timeout: LIBRARY_TIMEOUT });
  await page.getByRole('checkbox', { name: 'Keep Python for offline use' }).uncheck();
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).filter((k) => k.startsWith('python-')).length)).toBe(0);
  await expect(page.getByRole('checkbox', { name: 'Also keep NumPy, pandas and Matplotlib' })).toHaveCount(0);
});

test('the tracer passes axe with a chart, an array and a DataFrame showing', async ({ page }) => {
  test.setTimeout(300_000);
  await openTracer(page);
  await runSample(page, 'A slice of an array shares its data, and a copy doesn’t');
  await page.getByRole('button', { name: 'Previous step' }).click();
  const check = async () => {
    const { violations } = await new AxeBuilder({ page }).include('.tracer').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
  };
  await check();
  await runSample(page, 'Average marks for each house, with groupby');
  await page.getByRole('button', { name: 'Previous step' }).click();
  await check();
  await runSample(page, 'A bar chart of marks in each subject');
  await expect(consoleText(page).locator('img.console-fig')).toHaveCount(1);
  await check();
});

test('the app’s first load is what it was before the libraries, and asks for nothing of Python', async ({ page }) => {
  // master's first load before this work, measured byte for byte from its build: the 13 files of HTML, CSS and
  // JS the first screen asks for, gzipped. File names carry hashes, so a few bytes can move.
  const BEFORE_GZIP = 293_786;
  const html = readFileSync(join('dist', 'index.html'), 'utf8');
  const names = new Set([...html.matchAll(/(?:src|href)="\.\/(assets\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]));
  names.add('index.html');
  expect(names.size).toBe(13);
  expect([...names].some((n) => /python|Python/.test(n))).toBe(false);
  let gzip = 0;
  for (const name of names) gzip += gzipSync(readFileSync(join('dist', name)), { level: 9 }).length;
  expect(Math.abs(gzip - BEFORE_GZIP)).toBeLessThanOrEqual(64);

  const asked: string[] = [];
  page.on('request', (r) => asked.push(r.url()));
  await page.goto('/');
  await expect(page.locator('main h1, main h2').first()).toBeVisible();
  expect(asked.filter((u) => /\/pyodide\/|python-libraries|PythonTracer/.test(u))).toEqual([]);
});
