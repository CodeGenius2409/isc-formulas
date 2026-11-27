// The Python tracer in a real browser: Python loads only when the tracer opens, steps forwards and back, reads
// input, is stopped when a program won't end, and works offline only when it has been kept for offline use.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { openRoute, waitForServiceWorker, watchProblems } from './helpers';

test.describe.configure({ mode: 'serial' });

const PYTHON_TIMEOUT = 60_000;

async function openTracer(page: Page): Promise<void> {
  await page.goto('/#/tools/python');
  await expect(page.getByRole('heading', { name: 'Python program tracer' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Trace again' })).toBeEnabled({ timeout: PYTHON_TIMEOUT });
}

const status = (page: Page) => page.locator('.tracer-steps [role="status"]');
const consoleText = (page: Page) => page.getByRole('log', { name: 'Console' });

async function writeProgram(page: Page, code: string): Promise<void> {
  const edit = page.getByRole('button', { name: 'Edit code' }).first();
  await edit.click();
  const content = page.locator('.cm-content');
  await content.waitFor();
  await content.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Delete');
  await page.keyboard.insertText(code);
}

test('Python loads only when the tracer opens, and nowhere else', async ({ page }) => {
  test.setTimeout(180_000);
  const asked: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/pyodide/')) asked.push(r.url());
  });
  const problems = watchProblems(page);
  await page.goto('/');
  for (const route of ['', 'book/computerscience/XII/6', 'tools', 'tools/java', 'practice', 'settings', 'generate']) await openRoute(page, route);
  expect(asked, 'nothing loads Pyodide before the Python tracer opens').toEqual([]);

  await openTracer(page);
  expect(asked.some((u) => u.endsWith('pyodide.asm.wasm'))).toBe(true);
  expect(asked.some((u) => /python_stdlib-\w+\.zip$/.test(u))).toBe(true);
  // Each file comes once a visit, from this site.
  expect(new Set(asked).size).toBe(asked.length);
  expect(asked.every((u) => u.startsWith('http://localhost'))).toBe(true);
  await expect(status(page)).toContainText('Step 1 of');
  expect(problems).toEqual([]);
});

test('steps forwards and back, with the call stack, variables and console', async ({ page }) => {
  test.setTimeout(120_000);
  await openTracer(page);
  await page.getByLabel('Program', { exact: true }).selectOption({ label: 'Factorial by recursion' });
  await expect(status(page)).toContainText('Step 1 of');
  await expect(page.locator('.code-line[data-current="true"]')).toContainText('def factorial(n):');

  const step = page.getByRole('button', { name: 'Step', exact: true });
  await step.click();
  await expect(status(page)).toContainText('Step 2 of');
  await expect(page.locator('.code-line[data-current="true"]')).toContainText('print(factorial(5))');
  await step.click();
  await expect(status(page)).toContainText('factorial(n=5) is called');
  await expect(page.getByRole('region', { name: 'Table of factorial’s variables' })).toContainText('5');
  await expect(page.locator('.call-stack')).toContainText('<module>');

  await page.getByRole('button', { name: 'Previous step' }).click();
  await expect(status(page)).toContainText('Step 2 of');
  await page.getByRole('region', { name: /Program code/ }).press('ArrowRight');
  await expect(status(page)).toContainText('Step 3 of');

  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(status(page)).toContainText('Finished in');
  await expect(consoleText(page)).toHaveText('120\n');
});

test('shows when two names are one list', async ({ page }) => {
  await openTracer(page);
  await page.getByLabel('Program', { exact: true }).selectOption({ label: 'Two names for one list' });
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await page.getByRole('button', { name: 'Previous step' }).click();
  const vars = page.getByRole('region', { name: 'Table of variables' });
  await expect(vars).toContainText('Same list as b.');
  await expect(vars).toContainText('Same list as a.');
  await expect(page.locator('.trace-table').last()).toBeVisible();
});

test('statistics, fractions, collections and the rest of the everyday library work, and read clearly', async ({ page }) => {
  test.setTimeout(120_000);
  await openTracer(page);
  await page.getByLabel('Program', { exact: true }).selectOption({ label: 'Exact fractions, where floats are slightly out' });
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(consoleText(page)).toContainText('With fractions: 1 True');
  await expect(consoleText(page)).toContainText('2/3 + 5/6 = 3/2');
  await page.getByRole('button', { name: 'Previous step' }).click();
  const vars = page.getByRole('region', { name: 'Table of variables' });
  await expect(vars.getByRole('row', { name: /^a Fraction 2\/3/ })).toBeVisible();
  // These are normal Python, so no note says they go beyond the syllabus.
  await expect(page.locator('.notice').filter({ hasText: 'don’t cover' })).toHaveCount(0);

  await writeProgram(
    page,
    [
      'import statistics, json, csv',
      'from collections import Counter, deque',
      'from decimal import Decimal',
      'from datetime import date',
      'c = Counter("banana")',
      'q = deque([1, 2])',
      'd = Decimal("0.1") + Decimal("0.2")',
      'gap = date(2028, 2, 14) - date(2027, 11, 27)',
      'rows = list(csv.reader(["a,b", "1,2"]))',
      'print(statistics.median([3, 1, 2]), json.dumps(rows), gap.days)',
    ].join('\n'),
  );
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(consoleText(page)).toHaveText('2 [["a", "b"], ["1", "2"]] 79\n');
  await page.getByRole('button', { name: 'Previous step' }).click();
  await expect(vars.getByRole('row', { name: /^c Counter/ })).toContainText("Counter({'a': 3, 'n': 2, 'b': 1})");
  await expect(vars.getByRole('row', { name: /^q deque/ })).toContainText('deque([1, 2])');
  await expect(vars.getByRole('row', { name: /^d Decimal/ })).toContainText('0.3');
  await expect(vars.getByRole('row', { name: /^gap timedelta/ })).toContainText('79 days, 0:00:00');
  await expect(page.locator('.notice').filter({ hasText: 'don’t cover' })).toHaveCount(0);
});

test('reads input() from the input box, a line at a time', async ({ page }) => {
  await openTracer(page);
  await page.getByLabel('Program', { exact: true }).selectOption({ label: 'Is a word a palindrome?' });
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(consoleText(page)).toHaveText('Enter a word: Madam\nMadam is a palindrome\n');
  await expect(consoleText(page).locator('.console-in')).toHaveText('Madam\n');

  await page.getByLabel(/^Input/).fill('Python');
  await expect(page.getByText('The input has changed. Press Trace again to use it.')).toBeVisible();
  await page.getByRole('button', { name: 'Trace again' }).click();
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(consoleText(page)).toContainText('Python is not a palindrome');

  await writeProgram(page, 'a = input("First: ")\nb = input("Second: ")');
  await page.getByLabel(/^Input/).fill('only one');
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(page.locator('.notice[data-tone="bad"]')).toContainText('EOFError: EOF when reading a line');
  await expect(page.locator('.notice[data-tone="bad"]')).toContainText('more input than the Input box has');
});

test('stops a program that never ends, and carries on afterwards', async ({ page }) => {
  test.setTimeout(180_000);
  await openTracer(page);
  // A loop Python's tracing sees is stopped by the step limit.
  await writeProgram(page, 'n = 0\nwhile True:\n    n += 1');
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  await page.getByRole('button', { name: 'Run to the end' }).click({ timeout: PYTHON_TIMEOUT });
  await expect(page.locator('.notice[data-tone="bad"]')).toContainText('infinite loop');

  // A loop inside one built-in call has no steps to count, so Stop ends the worker.
  await page.getByRole('button', { name: 'Edit code' }).click();
  await page.locator('.cm-content').click();
  await page.keyboard.press('Control+A');
  await page.keyboard.insertText('print(sum(range(10 ** 15)))');
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  const stop = page.getByRole('button', { name: 'Stop' });
  await expect(stop).toBeVisible();
  await stop.click();
  await expect(page.getByText('Stopped. Python is starting again, ready for the next run.')).toBeVisible();

  await page.getByLabel('Program', { exact: true }).selectOption({ label: 'Factorial by recursion' });
  await page.getByRole('button', { name: 'Run to the end' }).click({ timeout: PYTHON_TIMEOUT });
  await expect(consoleText(page)).toHaveText('120\n');
});

test('shows Python’s own error, in plain words too, with the line marked', async ({ page }) => {
  await openTracer(page);
  await writeProgram(page, 'marks = [40, 55]\nprint(marks[2])');
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  await page.getByRole('button', { name: 'Run to the end' }).click();
  const notice = page.locator('.notice[data-tone="bad"]');
  await expect(notice).toContainText('Line 2. IndexError: list index out of range');
  await expect(notice).toContainText('A list of n items has positions 0 to n − 1');
  await expect(page.locator('.code-line[data-error="true"]')).toContainText('print(marks[2])');

  await writeProgram(page, 'if True:\nprint(1)');
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  await expect(notice).toContainText("IndentationError: expected an indented block after 'if' statement on line 1");
  await expect(page.locator('.code-line[data-error="true"]')).toContainText('print(1)');
});

test('a program can’t reach JavaScript, and a note says when it goes beyond the syllabus', async ({ page }) => {
  await openTracer(page);
  await writeProgram(page, 'import js');
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(page.locator('.notice[data-tone="bad"]')).toContainText("ModuleNotFoundError: No module named 'js'");

  await writeProgram(page, 'class Point:\n    pass\nprint("made")');
  await page.getByRole('button', { name: 'Trace', exact: true }).click();
  await expect(page.locator('.notice').filter({ hasText: 'beyond' }).or(page.locator('.notice').filter({ hasText: 'don’t cover' }))).toContainText('classes');
});

test('the editor indents after a colon and lines else up with its if', async ({ page }) => {
  await openTracer(page);
  await writeProgram(page, '');
  for (const [i, line] of ['for i in range(3):', 'if i > 1:', 'print(i)'].entries()) {
    if (i) await page.keyboard.press('Enter');
    await page.keyboard.type(line);
  }
  await page.keyboard.press('Enter');
  await page.keyboard.press('Backspace');
  await page.keyboard.type('else:');
  const text = await page.locator('.cm-line').evaluateAll((lines) => lines.map((l) => (l as HTMLElement).innerText.replace(/\n$/, '')).join('\n'));
  expect(text).toBe(['for i in range(3):', '    if i > 1:', '        print(i)', '    else:'].join('\n'));
});

test('the tracer passes axe', async ({ page }) => {
  await openTracer(page);
  await page.getByRole('button', { name: 'Step', exact: true }).click();
  const { violations } = await new AxeBuilder({ page }).include('.tracer').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
});

test('offline, without Keep Python, the tracer says so rather than failing', async ({ page, context }) => {
  await page.goto('/');
  await waitForServiceWorker(page);
  await context.setOffline(true);
  const problems = watchProblems(page);
  await page.reload();
  await openRoute(page, 'tools/python');
  await expect(page.getByText('You’re offline, and the Python tracer isn’t saved on this device')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Settings' }).last()).toBeVisible();
  expect(problems).toEqual([]);
  await context.setOffline(false);
});

test('with Keep Python for offline use on, the tracer works with no connection', async ({ page, context }) => {
  test.setTimeout(240_000);
  await page.goto('/');
  await waitForServiceWorker(page);
  await openRoute(page, 'settings');
  await page.getByRole('checkbox', { name: 'Keep Python for offline use' }).check();
  await expect(page.getByTestId('python-offline-state')).toHaveText('Python is saved on this device, so the tracer works offline.', { timeout: PYTHON_TIMEOUT });

  await context.setOffline(true);
  const problems = watchProblems(page);
  await page.reload();
  await openTracer(page);
  await page.getByLabel('Program', { exact: true }).selectOption({ label: 'Bubble sort' });
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(consoleText(page)).toContainText('Sorted: [10, 13, 14, 29, 37]');
  // The everyday library modules are saved with Python itself.
  await page.getByLabel('Program', { exact: true }).selectOption({ label: 'Class marks: mean, median, mode and standard deviation' });
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(consoleText(page)).toContainText('Standard deviation: 11.71');
  await page.getByLabel('Program', { exact: true }).selectOption({ label: 'Permutations and combinations for a P&C problem' });
  await page.getByRole('button', { name: 'Run to the end' }).click();
  await expect(consoleText(page)).toContainText('6 committees, and 4C2 = 6');
  expect(problems).toEqual([]);

  // Turning it off deletes the copy.
  await context.setOffline(false);
  await openRoute(page, 'settings');
  await page.getByRole('checkbox', { name: 'Keep Python for offline use' }).uncheck();
  await expect(page.getByTestId('python-offline-state')).toHaveText('Python isn’t saved on this device.');
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).filter((k) => k.startsWith('python-offline-')).length)).toBe(0);
});

test('the first time it opens, the tracer offers to keep Python, once', async ({ page }) => {
  await page.goto('/#/tools/python');
  await page.evaluate(() => {
    localStorage.removeItem('isc-keep-python-offered');
    localStorage.removeItem('isc-keep-python');
  });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Trace again' })).toBeEnabled({ timeout: PYTHON_TIMEOUT });
  const offer = page.getByRole('region', { name: 'Keep Python for offline use' });
  await expect(offer).toBeVisible();
  await offer.getByRole('button', { name: 'Not now' }).click();
  await expect(offer).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Trace again' })).toBeEnabled({ timeout: PYTHON_TIMEOUT });
  await expect(offer).toHaveCount(0);
});
